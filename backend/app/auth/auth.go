package auth

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"example.com/m/db"
)

func Validate(w http.ResponseWriter, r *http.Request) string {
	var res Response
	res.Status = 0

	cookieA, ckA_err := r.Cookie("Access")
	if ckA_err != nil {
		res.Status = 1
		json.NewEncoder(w).Encode(res)
		return "Validate Failed"
	}
	tokenA, uid := ValidateAccessToken(cookieA.Value)
	if tokenA {
		res.Message = uid
		json.NewEncoder(w).Encode(res)
		return "Validate Succeeded"
	}
	cookieR, ckR_err := r.Cookie("Refresh")
	if ckR_err != nil {
		res.Status = 1
		json.NewEncoder(w).Encode(res)
		return "Validate Failed"
	}
	if ValidateRefreshToken(cookieR.Value) {
		tokenId, tokenPlatform := ParseToken(cookieA.Value, cookieR.Value)
		res.JWTAccessToken = CreateToken(TokenOptions{true, tokenId, tokenPlatform})
		at := http.Cookie {
			Name: "Access",
			Value: res.JWTAccessToken,
			HttpOnly: true,
			Path: "/",
		}
		res.Message = tokenId
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		http.SetCookie(w, &at)
		json.NewEncoder(w).Encode(res)
		return "Validate Succeeded"
	}
	res.Status = 1
	json.NewEncoder(w).Encode(res)
	return "Validate Failed"
}

func ValidateAccessToken(accessCookie string) (bool, string) {
	user, token_err := VerifyToken(accessCookie)
	if token_err != nil {
		return false, ""
	}
	selectUserQuery := "SELECT user_id FROM user WHERE user_id = ?"

	var uid string
	db_err := db.DB().QueryRow(selectUserQuery, user.Id).Scan(&uid)
	if db_err != nil && db_err !=sql.ErrNoRows {
		return false, ""
	}
	return true, uid
}

func ValidateRefreshToken(refreshCookie string) bool {
	user, token_err := VerifyToken(refreshCookie)
	if token_err != nil {
		return false
	}
	selectUserQuery := "SELECT user_id FROM user WHERE user_id = ?"
	var uid string
	db_err := db.DB().QueryRow(selectUserQuery, user.Id).Scan(&uid)
	if db_err != nil && db_err !=sql.ErrNoRows {
		return false
	}
	return true
}

func VerifyPermission(r *http.Request) bool {
	cookieA, ckA_err := r.Cookie("Access")
	if ckA_err != nil {
		return false
	}
	tokenA, uid := ValidateAccessToken(cookieA.Value)
	if tokenA {
		var permission int
		selectUserQuery := "SELECT user_permission FROM user WHERE user_id = ?"
		db_err := db.DB().QueryRow(selectUserQuery, uid).Scan(&permission)
		if db_err != nil && db_err !=sql.ErrNoRows {
			return false
		}
		if permission == 0 {
			return true
		}
		return false
	}
	return false
}