package video

import (
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"log"
	"strings"
	"bytes"
	"time"
	"encoding/json"
	"database/sql"

	"example.com/m/auth"
	"example.com/m/db"
)

type VideoInfo struct {
	Title		string
	PrevImgPath	string
	Url			string
	Tag			string
	Date		string
	Subtitle		int
}

type VideoInfoList struct {
	VideoInfo	[]VideoInfo
}

type UpdateVideo struct {
	Target		string
	Title		string
	Tag			string
	Date		string
}

type Response struct {
	Status			int
}

func Video(w http.ResponseWriter, r *http.Request) {
	if auth.VerifyPermission(r) {
		switch r.Method {
		case "GET":
			// transfer list
			video_list_log := VideoList(w, r)
			fmt.Println(video_list_log)
		case "PUT":
			// video update
			video_update_log := VideoUpdate(w, r)
			fmt.Println(video_update_log)
		default:
			http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		}
	} else {
		http.Error(w, "Forbidden", http.StatusForbidden)
	}
}

func VideoList(w http.ResponseWriter, r *http.Request) string {
	// 미리보기 이미지, 타이틀, 태그
	path := "/media/video/"
	filePath := "/media/video/res/"
	out, cmdErr := exec.Command("ls", filePath).Output()
	if cmdErr != nil {
		log.Fatal(cmdErr)
	}

	files := strings.Split(string(out), "\n")
	var prevFiles []string
	for _, fileName := range files {
		if strings.Contains(fileName, ".png") {
			prevFiles = append(prevFiles, fileName)
		}
	}

	var videolist VideoInfoList
	for _, prevName := range prevFiles {
		var b bytes.Buffer
		b.WriteString(path)
		b.WriteString(prevName)
		prevPath := b.String()

		var video VideoInfo
		video.Title = strings.Split(prevName, ".png")[0]
		video.PrevImgPath = prevPath

		b.Reset()
		b.WriteString(path)
		b.WriteString(video.Title)
		videoCheck := b.String()
		if _, err := os.Stat(videoCheck + ".mp4"); err == nil {
			video.Url = videoCheck + ".mp4"
		} else if _, err := os.Stat(videoCheck + ".avi"); err == nil {
			video.Url = videoCheck + ".avi"
		} else {
			continue
		}
		var unixDate int64
		selectVideoQuery := "SELECT tag, date, subtitle FROM video WHERE title = ?"
		selErr := db.DB().QueryRow(selectVideoQuery, video.Title).Scan(&video.Tag, &unixDate, &video.Subtitle)
		if selErr != nil {
			if selErr == sql.ErrNoRows {
				video.Tag = ""
				video.Date = ""
				video.Subtitle = 0
			} else {
				log.Fatal(selErr)
			}
		} else {
			video.Date = time.Unix(unixDate, 0).Format("2006-01-02")
		}
		if video.Subtitle == 1 {
			if _, err := os.Stat(videoCheck + ".vtt"); err != nil {
				video.Subtitle = 0
			}
		}
		videolist.VideoInfo = append(videolist.VideoInfo, video)
	}

	json.NewEncoder(w).Encode(videolist)
	return "Video List Response"
}

func VideoUpdate(w http.ResponseWriter, r *http.Request) string {
	var videoData UpdateVideo
	json.NewDecoder(r.Body).Decode(&videoData)
	res := Response{1}
	if videoData.Target == "image" {
		videoPreviewImageUpdate := VidPrevImgUpt()
		if videoPreviewImageUpdate {
			res.Status = 0
		}
	}
	if videoData.Target == "info" {
		videoInfoUpdate := VidInfoUpt(videoData.Title, videoData.Date, videoData.Tag)
		if videoInfoUpdate {
			res.Status = 0
		}
	}
	json.NewEncoder(w).Encode(res)
	return "Video Updated"
}