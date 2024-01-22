package main

import (
	"fmt"
	"log"
	"net/http"
)

var (
	linkList map[string]string
)

func main() {
	linkList = make(map[string]string)
	http.HandleFunc("/createLink", createLink)
	log.Fatal(http.ListenAndServe("localhost:8000", nil))
}

func createLink(w http.ResponseWriter, r *http.Request) {
	key, ok := r.URL.Query()["link"]
	if ok {
		if _, exists := linkList[key[0]]; !exists {
			linkList[key[0]] = "taken"
			w.WriteHeader(http.StatusAccepted)
			fmt.Fprintf(w, "Added a new link")
			return
		}
		w.WriteHeader(http.StatusConflict)
		fmt.Fprintf(w, "Link already exists")
		return
	}

	w.WriteHeader(http.StatusBadRequest)
	fmt.Fprintf(w, "No link value provided")
	return
}
