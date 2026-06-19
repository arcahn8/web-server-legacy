package auth

import (
	"log"
	"time"
	"errors"
	// "database/sql"
	"io/ioutil"

	// "example.com/m/db"
	"github.com/dgrijalva/jwt-go"
	// "github.com/google/uuid"
)

type TokenOptions struct {
	Aflag		bool
	Id			string
	Platform	string
}

func SecretKey() []byte {
	key, err := ioutil.ReadFile("./secret")
	if err != nil {
        log.Fatal(err)
    }
	return key
}

func CreateToken(to TokenOptions) (string) {
	claims := jwt.StandardClaims{}
	if to.Aflag { // Aflag true, access
		claims = jwt.StandardClaims{
			Audience: to.Platform,
			ExpiresAt: time.Now().Add(time.Minute * 20).Unix(), 
			Id: to.Id,
			Issuer: "lamp",
			Subject: "access",
		}
	} else { // Aflag false, refresh
		claims = jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 24).Unix(), 
			Id: to.Id,
			Issuer: "lamp",
			Subject: "refresh",
		}
	}
	secret := SecretKey()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &claims)
	tokenString, err := token.SignedString(secret)
	if err != nil {
        log.Fatal(err)
    }
	return tokenString
}

func VerifyToken(tokenString string) (*jwt.StandardClaims, error) {
	keyFunc := func(token *jwt.Token) (interface{}, error) {
		_, ok := token.Method.(*jwt.SigningMethodHMAC)
		if !ok {
			return nil, errors.New("invalid signing method")
		}
		secret := SecretKey()
		return secret, nil
	}

	token, err := jwt.ParseWithClaims(tokenString, &jwt.StandardClaims{}, keyFunc)
	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*jwt.StandardClaims); ok && token.Valid {
		return claims, nil
	} else {
		return nil, errors.New("invalid token")
	}
}

func ParseToken(accessToken, refreshToken string) (string, string) {
	id, platform := "", ""
	tokenR, _, errR := new(jwt.Parser).ParseUnverified(refreshToken, jwt.MapClaims{})
    if errR != nil {
        return id, platform
    }
	if claimsR, okR := tokenR.Claims.(jwt.MapClaims); okR {
		id = claimsR["jti"].(string)
	}
	tokenA, _, errA := new(jwt.Parser).ParseUnverified(accessToken, jwt.MapClaims{})
    if errA != nil {
        return id, platform
    }
	if claimsA, okA := tokenA.Claims.(jwt.MapClaims); okA {
		platform = claimsA["aud"].(string)
	}
	return id, platform
}