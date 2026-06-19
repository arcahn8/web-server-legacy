package storage

import (
	"fmt"
	"net/http"
	"io"
	"os"
	"strings"
	"log"
	"time"
	"encoding/json"
	"path/filepath"

	"example.com/m/auth"
)

type Response struct {
	Status			int
}

type FileInfo struct {
	Name	string
	Date	string
	Size	string
	URL		string
}

type FileList struct {
	FileInfo	[]FileInfo
}

type EditFile struct {
	Name	string
	NewName	string
}

func Storage(w http.ResponseWriter, r *http.Request) {
	if auth.VerifyPermission(r) {
		switch r.Method {
    	case "GET":
			// transfer list
			storageListlog := StorageList(w, r)
			fmt.Println(storageListlog)
		case "POST":
			// file rename
			fileRenameLog := FileRename(w, r)
			fmt.Println(fileRenameLog)
		case "PUT":
			// receive storage
			fileUploadLog := FileUpload(w, r)
			fmt.Println(fileUploadLog)
		default:
			http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		}
	} else {
		http.Error(w, "Forbidden", http.StatusForbidden)
	}
}

func StorageList(w http.ResponseWriter, r *http.Request) string {
	path := "/storage/"
	entries, entryErr := os.ReadDir(path)
	if entryErr != nil {
		log.Fatal(entryErr)
	}

	files := []string{}

	for _, entry := range entries {
		if !entry.IsDir() {
			files = append(files, entry.Name())
		}
	}

	if len(files) > 0 {
		var fileList FileList
		koreaLocation, timeErr := time.LoadLocation("Asia/Seoul")
		if timeErr != nil {
			log.Fatal(timeErr)
		}
		for _, fileName := range files {
			fileUrl := strings.Join([]string{path, fileName}, "")
			file, fileErr := os.Stat(fileUrl)
			if fileErr != nil {
				log.Fatal(fileErr)
			}
			
			korTime := file.ModTime().In(koreaLocation).Format("06/01/02 15:04")

			var fileSize string
			kbSize := float64(file.Size()) / 1024.0 // KB
			if mbSize := kbSize / 1024.0; mbSize >= 1 {
				if gbSize := mbSize / 1024.0; gbSize >= 1 {
					fileSize = fmt.Sprintf("%.1fGB", gbSize)
				} else {
					fileSize = fmt.Sprintf("%.1fMB", mbSize)
				}
			} else {
				fileSize = fmt.Sprintf("%.1fKB", kbSize)
			}

			fileInfo := FileInfo{fileName, korTime, fileSize, fileUrl}
			fileList.FileInfo = append(fileList.FileInfo, fileInfo)
		}

		json.NewEncoder(w).Encode(fileList)
		return "Storage list response"
	}
	return "Storage list(0) response"
}

func FileRename(w http.ResponseWriter, r *http.Request) string {
	var editFile EditFile
	res := Response{1}
	json.NewDecoder(r.Body).Decode(&editFile)

	_, fileErr := os.Stat("/storage/" + editFile.Name)
	if os.IsNotExist(fileErr) {
		json.NewEncoder(w).Encode(res)
		return "File rename failure"
	}

	mvErr := os.Rename("/storage/" + editFile.Name, "/storage/" + editFile.NewName)
	if mvErr != nil {
		json.NewEncoder(w).Encode(res)
		return "File rename failure"
	}
	res.Status = 0
	json.NewEncoder(w).Encode(res)
	return editFile.Name + " to " + editFile.NewName + " renamed successfully."
}

func FileUpload(w http.ResponseWriter, r *http.Request) string {
	res := Response{1}
    upload, uploadHeader, err := r.FormFile("file")
    if err != nil {
        // http.Error(w, err.Error(), http.StatusBadRequest)
		json.NewEncoder(w).Encode(res)
        return "File upload failure"
    }
    defer upload.Close()
	newName := FileNameCheck(uploadHeader.Filename)
    file, err := os.Create("/storage/" + newName)
    if err != nil {
        // http.Error(w, err.Error(), http.StatusInternalServerError)
		json.NewEncoder(w).Encode(res)
        return "File upload failure"
    }
    defer file.Close()

    _, err = io.Copy(file, upload)
    if err != nil {
        // http.Error(w, err.Error(), http.StatusInternalServerError)
		json.NewEncoder(w).Encode(res)
        return "File upload failure"
    }
	res.Status = 0
	json.NewEncoder(w).Encode(res)
	return newName + " uploaded successfully."
}

func FileNameCheck(fileName string) string {
	if _, fileCheck := os.Stat(strings.Join([]string{"/storage/", fileName}, "")); !os.IsNotExist(fileCheck) {
		baseName := fileName[:len(fileName)-len(filepath.Ext(fileName))]
    	ext := filepath.Ext(fileName)

		i := 1
		for {
			newFileName := fmt.Sprintf("%s(%d)%s", baseName, i, ext)
			_, err := os.Stat(strings.Join([]string{"/storage/",newFileName}, ""))
			if os.IsNotExist(err) {
				return newFileName
			}
			i++
		}
	}
	return fileName
}