package video

import (
	"fmt"
	"strings"
	"bytes"
	"os/exec"
	"log"
	"time"
	"database/sql"

	"example.com/m/db"
)


func VidPrevImgUpt() bool {
	videoPath := "/media/video/"
	prevPath := videoPath + "res/"

	videoOut, vCmdErr := exec.Command("ls", videoPath).Output()
	if vCmdErr != nil {
		log.Fatal(vCmdErr)
	}

	videos := strings.Split(string(videoOut), "\n")
	var videoFiles []string
	for _, videoName := range videos {
		if strings.Contains(videoName, ".mp4") {
			videoFiles = append(videoFiles, videoName)
		}
		if strings.Contains(videoName, ".avi") {
			videoFiles = append(videoFiles, videoName)
		}
	}

	prevOut, pCmdErr := exec.Command("ls", prevPath).Output()
	if pCmdErr != nil {
		log.Fatal(pCmdErr)
	}
	prevs := strings.Split(string(prevOut), "\n")
	var prevFiles []string
	for _, prevName := range prevs {
		if strings.Contains(prevName, ".png") {
			prevFiles = append(prevFiles, prevName)
		}
	}

	if len(prevFiles) != 0 {
		for _, imgName := range prevFiles {
			var b bytes.Buffer
			b.WriteString(strings.Split(imgName, ".png")[0])
			name := b.String()

			for i := 0; i < len(videoFiles); i++ {
				if strings.Contains(videoFiles[i], name) {
					if i + 1 == len(videoFiles) {
						videoFiles = videoFiles[:i]
						break
					}
					videoFiles = append(videoFiles[:i], videoFiles[i+1:]...)
					break
				}
			}
		}
	}
	fmt.Println("List of videos for extracting preview image", videoFiles)

	if len(videoFiles) != 0 {
		startTime := "00:10:00"
		frameNumber := "0"
		for _, videoName := range videoFiles {
			var b bytes.Buffer
			b.WriteString(videoPath)
			b.WriteString(videoName)
			videoFile := b.String()
	
			b.Reset()
			b.WriteString(prevPath)
			if strings.Contains(videoName, ".mp4") {
				b.WriteString(strings.Split(videoName, ".mp4")[0])
			}
			if strings.Contains(videoName, ".avi") {
				b.WriteString(strings.Split(videoName, ".avi")[0])
			}
			b.WriteString(".png")
			imgFile := b.String()

			cmd := exec.Command("ffmpeg", "-ss", startTime, "-i", videoFile, "-vf", fmt.Sprintf("select='eq(n,%s)', scale=256:144", frameNumber), "-vframes", "1", imgFile)
			ffmpegErr := cmd.Run()
			if ffmpegErr != nil {
				log.Fatal(ffmpegErr)
			}
		}
	}
	return true
}

func VidInfoUpt(title string, date string, tag string) bool {
	var queryResult string

	t, timeErr := time.Parse("2006-01-02", date)
	if timeErr != nil {
		log.Fatal(timeErr)
	}
	unixDate := t.Unix()
	selectVideoQuery := "SELECT title FROM video WHERE title = ?"
	selErr := db.DB().QueryRow(selectVideoQuery, title).Scan(&queryResult)
	if selErr != nil {
		if selErr == sql.ErrNoRows {
			insertVideoQuery := "INSERT INTO video (title, date, tag, subtitle) VALUES (?, ?, ?, 0)"
			insertPrepare, _ := db.DB().Prepare(insertVideoQuery)
			_, insErr := insertPrepare.Exec(title, unixDate, tag)
			if insErr != nil {
				log.Fatal(insErr)
			}
			return true
		} else {
			log.Fatal(selErr)
		}
	}
	updateVideoQuery := "UPDATE video SET date = ?, tag = ? WHERE title = ?"
	updatePrepare, _ := db.DB().Prepare(updateVideoQuery)
	_, uptErr := updatePrepare.Exec(unixDate, tag, title)
	if uptErr != nil {
		log.Fatal(uptErr)
	}
	return true
}