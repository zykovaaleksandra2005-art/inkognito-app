package main

import (
	"embed"
	"flag"
	"fmt"
	"net/http"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"

	"inkognito-app/server"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	runServer := flag.Bool("server", false, "Запустить приложение в режиме веб-сервера для сайта")
	flag.Parse()

	if *runServer {
		fmt.Println("Запуск веб-сервера для сайта на http://localhost:8080...")

		http.HandleFunc("/api/quote", server.HandleGetQuote)

		frontendDir := http.Dir("./frontend")
		fileServer := http.FileServer(frontendDir)
		http.Handle("/", fileServer)

		err := http.ListenAndServe(":8080", nil)
		if err != nil {
			fmt.Println("Ошибка запуска сервера:", err)
		}
		return
	}

	app := NewApp()

	err := wails.Run(&options.App{
		Title:  "inkognito-app",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
