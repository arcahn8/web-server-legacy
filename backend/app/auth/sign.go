package auth

import (
	"fmt"
	"log"
	"time"
	"database/sql"
	"encoding/json"
	"net/http"

	"example.com/m/db"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Id			string
	Pw			string
	Platform	string
}

type Response struct {
	Status			int
	JWTAccessToken	string
	JWTRefreshToken	string
	Message			string
}
// Status = 0 : Success, 1 : False


func Sign(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
    case "GET":
        // access token -> refresh token
		vali_log := Validate(w, r)
        fmt.Println(vali_log)
    case "POST":
        // sign-in
		sign_in_log := SignIn(w, r)
		fmt.Println(sign_in_log)
    case "DELETE":
        // sign-out
		sign_out_log := SignOut(w, r)
        fmt.Println(sign_out_log)
    default:
        http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
    }
}

func Registration(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
    case "GET":
        // refresh token 확인
        fmt.Fprintln(w, "This is a GET request")
    case "POST":
        // 회원가입
		reg_log := Register(w, r)
		fmt.Println(reg_log)
    case "DELETE":
        // 회원탈퇴
        fmt.Fprintln(w, "This is a DELETE request")
    default:
        http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
    }
}

func SignIn(w http.ResponseWriter, r *http.Request) string {
	var userdata User
	json.NewDecoder(r.Body).Decode(&userdata)

	var id string
	var pw string
	res := Response{0, "", "", ""}

	selectUserQuery := "SELECT user_id, user_pw FROM user WHERE user_id = ?"
	err := db.DB().QueryRow(selectUserQuery, userdata.Id).Scan(&id, &pw)
	if err != nil && err !=sql.ErrNoRows {
		res.Status = 1
		log.Fatal(err)
	}

	pw_err := bcrypt.CompareHashAndPassword([]byte(pw), []byte(userdata.Pw))
	if pw_err != nil {
		res.Status = 1
	}
	
	if res.Status == 0 {
		res.JWTAccessToken = CreateToken(TokenOptions{true, userdata.Id, userdata.Platform})
		at := http.Cookie {
			Name: "Access",
			Value: res.JWTAccessToken,
			HttpOnly: true,
			Path: "/",
		}
		res.JWTRefreshToken = CreateToken(TokenOptions{false, userdata.Id, ""})
		rt := http.Cookie {
			Name: "Refresh",
			Value: res.JWTRefreshToken,
			HttpOnly: true,
			Path: "/",
		}
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		http.SetCookie(w, &at)
		http.SetCookie(w, &rt)
		res.Message = userdata.Id
		json.NewEncoder(w).Encode(res)
		return "Signin Succeeded"
	}

	// fmt.Println(res.JWTAccessToken)

	json.NewEncoder(w).Encode(res)
	return "Signin Failed"
}

func SignOut(w http.ResponseWriter, r *http.Request) string {
	res := Response{0, "", "", ""}
	cookieR, ckR_err := r.Cookie("Refresh")
	if ckR_err != nil {
		res.Status = 1
		at := http.Cookie {
			Name: "Access",
			Value: "",
			HttpOnly: true,
			Path: "/",
			MaxAge: -1,
		}
		w.Header().Set("Access-Control-Allow-Credentials", "true")
	http.SetCookie(w, &at)
		json.NewEncoder(w).Encode(res)
		return "Signout Succeeded"
	}
	expireDate := time.Now().AddDate(0, 0, 14).Unix()

	insertTokenQuery := "INSERT INTO blacktoken (token, date) VALUES (?, ?)"
	insertPrepare, _ := db.DB().Prepare(insertTokenQuery)
	_, err := insertPrepare.Exec(cookieR.Value, expireDate)
	if err != nil {
		log.Fatal(err)
	}

	at := http.Cookie {
		Name: "Access",
		Value: "",
		HttpOnly: true,
		Path: "/",
		MaxAge: -1,
	}
	rt := http.Cookie {
		Name: "Refresh",
		Value: "",
		HttpOnly: true,
		Path: "/",
		MaxAge: -1,
	}
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	http.SetCookie(w, &at)
	http.SetCookie(w, &rt)
	json.NewEncoder(w).Encode(res)
	return "Signout Succeeded"
}

func Register(w http.ResponseWriter, r *http.Request) string {
	var userdata User
	json.NewDecoder(r.Body).Decode(&userdata)

	pw := []byte(userdata.Pw)
	pw_hash, _ := bcrypt.GenerateFromPassword(pw, bcrypt.DefaultCost)
	fmt.Printf(string(pw_hash))

	insertUserQuery := "INSERT INTO user (user_id, user_pw, user_permission) VALUES (?, ?, 1)"
	// user_permission = 0 : admin, 1 : user

	insertPrepare, _ := db.DB().Prepare(insertUserQuery)

	_, err := insertPrepare.Exec(userdata.Id, string(pw_hash))
	if err != nil {
		log.Fatal(err)
	}
	return "Register Succeeded"
}