package video

import (
	"fmt"
	"net/http"
	"os"
	"path"
	"strings"

	"example.com/m/auth"
)

func VideoResource(w http.ResponseWriter, r *http.Request) {
	if auth.VerifyPermission(r) {
		switch r.Method {
		case "GET":
			fileName := path.Base(r.URL.Path)
			if fileName == "" || fileName == "/" {
				http.Error(w, "File name not provided", http.StatusBadRequest)
				return
			}
			switch {
			case strings.Contains(fileName, ".png"):
				VideoPreviewImage(w, r, fileName)
			case strings.Contains(fileName, ".mp4"):
				VideoStream(w, r, fileName)
			case strings.Contains(fileName, ".avi"):
				VideoStream(w, r, fileName)
			case strings.Contains(fileName, ".vtt"):
				VideoSubtitle(w,r, fileName)
			default:
				http.Error(w, "File name not provided", http.StatusBadRequest)
			}
		default:
			http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		}
	} else {
		http.Error(w, "Forbidden", http.StatusForbidden)
	}
}

func VideoPreviewImage(w http.ResponseWriter, r *http.Request, fileName string) {
	filePath := "/media/video/res/" + fileName
	_, err := os.Stat(filePath)
	if os.IsNotExist(err) {
		http.NotFound(w, r)
		return
	}
	http.ServeFile(w, r, filePath)
}

func VideoStream(w http.ResponseWriter, r *http.Request, fileName string) {
	filePath := "/media/video/" + fileName
	video, vidErr := os.Open(filePath)
	if vidErr != nil {
		http.Error(w, vidErr.Error(), http.StatusInternalServerError)
		return
	}
	defer video.Close()
	info, infoErr := video.Stat()
	if infoErr != nil {
		http.Error(w, infoErr.Error(), http.StatusInternalServerError)
		return
	}
	if strings.Contains(fileName, ".avi") {
		w.Header().Set("Content-Type", "video/x-msvideo")
		fmt.Println("TEST")
	} else {
		w.Header().Set("Content-Type", "video/mp4")
	}
	fmt.Println(filePath + " Striming")
	http.ServeContent(w, r, filePath, info.ModTime(), video)
}

func VideoSubtitle(w http.ResponseWriter, r *http.Request, fileName string) {
	filePath := "/media/video/" + fileName
	fmt.Println(filePath)
	_, err := os.Stat(filePath)
	if os.IsNotExist(err) {
		http.NotFound(w, r)
		return
	}
	http.ServeFile(w, r, filePath)
}