package db

import (
	"log"
	// "os"
	"fmt"
	"database/sql"
	
	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func DB() *sql.DB {
	if db == nil {
		database, err := sql.Open("sqlite3", "./back.db")
		if err != nil {
			log.Fatal(err)
		}
		db = database
	}
	return db
}

func InitDB() {
	// os.Create("./back.db")
	createTableQuery := `CREATE TABLE user (
		id	INTEGER	PRIMARY KEY	AUTOINCREMENT,
		user_id			TEXT	NOT NULL,
		user_pw			TEXT	NOT NULL,
		user_permission	INTEGER	NOT NULL,
		user_token		TEXT,
		UNIQUE (id, user_id)
	)`
	_, err := DB().Exec(createTableQuery)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("DB Success!\n")
}

func TokenDB() {
	createTableQuery := `CREATE TABLE blacktoken (
		token	TEXT	NOT NULL	PRIMARY KEY,
		date	INTEGER	NOT NULL
	)`
	_, err := DB().Exec(createTableQuery)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("DB Success!\n")
}

func TokenDBReset() {
	deleteTableQuery := `DELETE FROM blacktoken`
	_, err := DB().Exec(deleteTableQuery)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Token DB Reset!\n")
}
func VideoDB() {
	createTableQuery := `CREATE TABLE video (
		id			INTEGER	PRIMARY KEY	AUTOINCREMENT, 
		title		TEXT	NOT NULL,
		date		INTEGER	NOT NULL,
		tag			TEXT	NOT NULL,
		subtitle	INTEGER NOT NULL
	)`
	_, err := DB().Exec(createTableQuery)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("video DB Success!\n")
}
func GalleryDB() {
	createTableQuery := `CREATE TABLE gallery (
		id			INTEGER	PRIMARY KEY	AUTOINCREMENT, 
		title		TEXT	NOT NULL,
		tag			TEXT	NOT NULL,
		translated	INTEGER NOT NULL,
		author		TEXT	NOT NULL,
		rating		INTEGER	NOT NULL
	)`
	_, err := DB().Exec(createTableQuery)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Gallery DB Success!\n")
}