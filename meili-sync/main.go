package main

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/meilisearch/meilisearch-go"
	_ "github.com/lib/pq"
)

type Product struct {
	ID          int     `json:"id"`
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	InStock     bool    `json:"in_stock"`
	Category    string  `json:"category"`
	Brand       string  `json:"brand"`
	Size        string  `json:"size"`
	CreatedAt   string  `json:"created_at"`
}

func main() {
	db, err := sql.Open("postgres", "host=shop-postgres port=5432 user=shopuser password=shoppass dbname=shop sslmode=disable")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	rows, err := db.Query(`SELECT id, title, description, price, in_stock, category, brand, size, created_at FROM products`)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	var products []Product
	for rows.Next() {
		var p Product
		if err := rows.Scan(&p.ID, &p.Title, &p.Description, &p.Price, &p.InStock, &p.Category, &p.Brand, &p.Size, &p.CreatedAt); err != nil {
			log.Fatal(err)
		}
		products = append(products, p)
	}

	client := meilisearch.NewClient(meilisearch.ClientConfig{
		Host:   "http://meilisearch:7700",
		APIKey: "supersecretkey",
	})

	_, err = client.Index("products").AddDocuments(products)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("✅ Успешно отправлено в MeiliSearch")
}
