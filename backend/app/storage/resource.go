package storage

import (
	"fmt"
	"net/http"
	"os"
	"encoding/json"

	"example.com/m/auth"
)

func StorageResource(w http.ResponseWriter, r *http.Request) {
	if auth.VerifyPermission(r) {
		switch r.Method {
		case "GET":
			fileDownloadLog := FileDownload(w, r)
			fmt.Println(fileDownloadLog)
		case "DELETE":
			fileDeleteLog := FileDelete(w, r)
			fmt.Println(fileDeleteLog)
		default:
			http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		}
	} else {
		http.Error(w, "Forbidden", http.StatusForbidden)
	}
}

func FileDownload(w http.ResponseWriter, r *http.Request) string {
	fileName := r.URL.Path

	_, fileErr := os.Stat(fileName)
	if os.IsNotExist(fileErr) {
		http.NotFound(w, r)
		return "File download failure"
	}
	http.ServeFile(w, r, fileName)
	return "File downloaded successfully."
}

func FileDelete(w http.ResponseWriter, r *http.Request) string {
	fileName := r.URL.Path
	res := Response{1}

	_, fileErr := os.Stat(fileName)
	if os.IsNotExist(fileErr) {
		json.NewEncoder(w).Encode(res)
		return fileName + " >> delete failure"
	}

	rmErr := os.Remove(fileName)
	if rmErr != nil {
		json.NewEncoder(w).Encode(res)
		return fileName + " >> delete failure"
	}
	res.Status = 0
	json.NewEncoder(w).Encode(res)
	return fileName + " deleted successfully."
}