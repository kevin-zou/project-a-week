package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
)

// In-memory map of shortened URLs to full URLs
var (
	linkList map[string]string
)

func main() {
	linkList = make(map[string]string)
	http.HandleFunc("/createLink", createLink)
	http.HandleFunc("/", redirectHandler)
	log.Fatal(http.ListenAndServe("localhost:8000", nil))
}

type CreateLinkPayload struct {
	Link      string `json:"link"`
	ShortName string `json:"shortName"`
}

func createLink(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method unsupported.", http.StatusMethodNotAllowed)
		return
	}
	var data CreateLinkPayload
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if data.Link == "" {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "No link value provided.")
		return
	}

	if data.ShortName == "" {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "No short name value provided.")
		return
	}

	if _, exists := linkList[data.ShortName]; !exists {
		linkList[data.ShortName] = data.Link
		w.WriteHeader(http.StatusAccepted)
		fmt.Fprintf(w, "Added a new link. Your shortened link is: http://localhost:8000/%s", data.ShortName)
		return
	}
	w.WriteHeader(http.StatusConflict)
	fmt.Fprintf(w, "Shortened link already exists. Try another short name.")
	return
}

func redirectHandler(w http.ResponseWriter, r *http.Request) {
	linkKey := strings.TrimPrefix(r.URL.Path, "/")
	if originalLink, exists := linkList[linkKey]; exists {
		http.Redirect(w, r, originalLink, http.StatusFound)
		return
	}
	http.NotFound(w, r)
}
