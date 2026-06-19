package media

import (
	"fmt"
	"net/http"
)

func Media(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
    case "GET":
		fmt.Println("TEST")
	case "POST":
		// video update
		// video_update_log := VidPrevImgUpt(w, r)
		fmt.Println("TEST")
	case "PUT":
		fmt.Println("TEST")
	default:
		fmt.Println("TEST")
	}
}