package gallery

import (
	"fmt"
	"net/http"
	"net/url"
	"os"
	// "os/exec"
	"log"
	"strings"
	"strconv"
	"encoding/json"
	"database/sql"

	"example.com/m/auth"
	"example.com/m/db"
)

type GalleryInfo struct {
	Title			string
	PrevImgPath		string
	Tag				string
	Translated		int
	Author			string
	Rating			int
}

type GalleryInfoList struct {
	GalleryInfo	[]GalleryInfo
	TotalCount	int
}

type GalleryPage struct {
	Id int
	ImgPath string
}

type GalleryPart struct {
	Subtitle	string
	Pages	[]GalleryPage
}

type GalleryDetails struct {
	GalleryInfo
	Parts	[]GalleryPart
}

type RequestGalleryDetails struct {
	GalleryName	string
}

type RequestGalleryUpdate struct {
	Action	string // refresh or edit
	GalleryInfo
}

type Response struct {
	Status			int
}

func Gallery(w http.ResponseWriter, r *http.Request) {
	if auth.VerifyPermission(r) {
		switch r.Method {
		case "GET":
			// transfer list
			galleryListLog := GalleryList(w, r)
			fmt.Println(galleryListLog)
		case "POST":
			// transfer gallery
			galleryContentLog := GalleryContent(w, r)
			fmt.Println(galleryContentLog)
		case "PUT":
			// gallery update
			galleryUpdateLog := GalleryUpdate(w, r)
			fmt.Println(galleryUpdateLog)
		default:
			http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		}
	} else {
		http.Error(w, "Forbidden", http.StatusForbidden)
	}
}

func GalleryList(w http.ResponseWriter, r *http.Request) string {
	r.ParseForm()
	encodedTag := r.FormValue("tag")
	pageNumStr := r.FormValue("page")
	count, conditionString := GalleryCountQuery(encodedTag)
	whereClause := ""
	if conditionString != "" {
		whereClause = strings.Join([]string{"WHERE tag LIKE", conditionString}, " ")
	}

	limitClause := "LIMIT 0, 18"
	pageNum, toIntErr := strconv.Atoi(pageNumStr)
	if toIntErr != nil {
		pageNum = 0
	}
	if pageNumStr != "" && pageNum > 0 && count > (pageNum - 1) * 18 {
		startNum := strconv.Itoa((pageNum - 1) * 18)
		limitClause = strings.Join([]string{"LIMIT ", startNum, ", 18"}, "")
	} // 1 - 0 ~ 17, 2 - 18 ~ 35, 3 - 36 ~ 53

	GalleryQuery := "SELECT title, tag, translated, author, rating FROM gallery"
	selectGalleryQuery := strings.Join([]string{GalleryQuery, whereClause, "ORDER BY id DESC", limitClause}, " ")

	var gallerys GalleryInfoList
	gallerys.TotalCount = count

	galleryRows, queryErr := db.DB().Query(selectGalleryQuery)
	if queryErr != nil {
		log.Fatal(queryErr)
	}
	defer galleryRows.Close()

	hasRows := false

	for galleryRows.Next() {
		hasRows = true
		var gallery GalleryInfo
		scanErr := galleryRows.Scan(&gallery.Title, &gallery.Tag, &gallery.Translated, &gallery.Author, &gallery.Rating)
		if scanErr != nil {
			log.Fatal(scanErr)
		}
		galleryPath := strings.Join([]string{"/media/gallery/", gallery.Title, "/"}, "")
		gallery.PrevImgPath = GalleryPrevImg(galleryPath)
		gallerys.GalleryInfo = append(gallerys.GalleryInfo, gallery)
	}
	if !hasRows {
		return "Gallery rows not found"
	}

	json.NewEncoder(w).Encode(gallerys)
	return "Gallery List Response"
}

func GalleryCountQuery(encodedTag string) (int, string) {
	var count int
	galleryCountQuery := []string{}
	galleryCountQuery = append(galleryCountQuery, "SELECT COUNT(*) FROM gallery")
	whereClause := ""

	if encodedTag != "" {
		decodedTag, decErr := url.QueryUnescape(encodedTag)
		if decErr != nil {
			return 0, whereClause
		}
		tags := strings.Split(decodedTag, " ")
		tagsWithWildcard := []string{}

		for _, tag := range tags {
			withWildcard := []string{"'%", tag, "%'"}
			tagsWithWildcard = append(tagsWithWildcard, strings.Join(withWildcard, ""))
		}
		whereClause = strings.Join(tagsWithWildcard, " AND tag LIKE ")
		galleryCountQuery = append(galleryCountQuery, "WHERE tag LIKE")
		galleryCountQuery = append(galleryCountQuery, whereClause)
	}
	selectGalleryCountQuery := strings.Join(galleryCountQuery, " ")
	selCntErr := db.DB().QueryRow(selectGalleryCountQuery).Scan(&count)
	if selCntErr != nil {
		if selCntErr == sql.ErrNoRows {
			count = 0
		} else {
			log.Fatal(selCntErr)
		}
	}
	return count, whereClause
}

func GalleryPrevImg(galleryPath string) string {
	entries, entryErr := os.ReadDir(galleryPath)
	if entryErr != nil {
		log.Fatal(entryErr)
	}

	dirs := []string{}
	imgs := []string{}
	for _, entry := range entries {
		if entry.IsDir() {
			dirs = append(dirs, entry.Name())
		}
		if strings.Contains(entry.Name(), ".webp") {
			imgs = append(imgs, entry.Name())
		}
	}
	if len(imgs) > 0 {
		galleryPrevImg := strings.Join([]string{galleryPath, imgs[0]}, "")
		if _, galleryImg := os.Stat(galleryPrevImg); !os.IsNotExist(galleryImg) {
			return galleryPrevImg
		}
	}
	if len(imgs) == 0 && len(dirs) > 0 {
		return GalleryPrevImg(strings.Join([]string{galleryPath, dirs[0], "/"}, ""))
	}
	return ""
}

func GalleryContent(w http.ResponseWriter, r *http.Request) string {
	var gallery GalleryDetails
	var reqGallery RequestGalleryDetails
	json.NewDecoder(r.Body).Decode(&reqGallery)

	galleryQuery := "SELECT title, tag, translated, author, rating FROM gallery WHERE title = ?"
	selErr := db.DB().QueryRow(galleryQuery, reqGallery.GalleryName).Scan(&gallery.Title, &gallery.Tag, &gallery.Translated, &gallery.Author, &gallery.Rating)
	if selErr != nil {
		if selErr == sql.ErrNoRows {
			http.Error(w, "Forbidden", http.StatusForbidden)
			return "Gallery Response Failure"
		} else {
			log.Fatal(selErr)
		}
	}
	galleryPath := strings.Join([]string{"/media/gallery/", reqGallery.GalleryName, "/"}, "")
	gallery.PrevImgPath = GalleryPrevImg(galleryPath)

	entries, entryErr := os.ReadDir(galleryPath)
	if entryErr != nil {
		log.Fatal(entryErr)
	}
	dirs := []string{}
	imgs := []string{}
	for _, entry := range entries {
		if entry.IsDir() {
			dirs = append(dirs, entry.Name())
		}
		if strings.Contains(entry.Name(), ".webp") {
			imgs = append(imgs, entry.Name())
		}
	}

	if len(imgs) > 0 && len(dirs) == 0 {
		var galleryPart GalleryPart
		var galleryPage GalleryPage
		galleryPart.Subtitle = ""

		for i, img := range imgs {
			galleryPage.Id = i
			galleryPage.ImgPath = strings.Join([]string{galleryPath, img}, "")
			galleryPart.Pages = append(galleryPart.Pages, galleryPage)
		}
		gallery.Parts = append(gallery.Parts, galleryPart)
	}

	if len(imgs) == 0 && len(dirs) > 0 {
		for _, dir := range dirs {
			dirName := strings.Join([]string{galleryPath, dir, "/"}, "")
			entries, entryErr := os.ReadDir(dirName)
			if entryErr != nil {
				log.Fatal(entryErr)
			}

			var galleryPart GalleryPart
			galleryPart.Subtitle = dir
			for i, entry := range entries {
				var galleryPage GalleryPage
				if strings.Contains(entry.Name(), ".webp") {
					galleryPage.Id = i
					galleryPage.ImgPath = strings.Join([]string{dirName, entry.Name()}, "")
					galleryPart.Pages = append(galleryPart.Pages, galleryPage)
				}
			}
			gallery.Parts = append(gallery.Parts, galleryPart)
		}
	}
	json.NewEncoder(w).Encode(gallery)
	return "Gallery Response"
}

func GalleryUpdate(w http.ResponseWriter, r *http.Request) string {
	var galleryData RequestGalleryUpdate
	json.NewDecoder(r.Body).Decode(&galleryData)
	res := Response{1}

	if galleryData.Action == "refresh" {
		if GalleryListRefresh() {
			res.Status = 0
		}
	}
	if galleryData.Action == "edit" {
		if GalleryInfoEdit(galleryData.Title, galleryData.Tag, galleryData.Translated, galleryData.Author, galleryData.Rating) {
			res.Status = 0
		}
	}
	json.NewEncoder(w).Encode(res)
	return "Gallery Updated"
}