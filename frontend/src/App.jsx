import React, { useEffect, useState } from "react"
import { MeiliSearch } from "meilisearch"

const client = new MeiliSearch({
  host: "http://89.169.161.5:7700",
  apiKey: "supersecretkey"
})

export default function App() {
  const [query, setQuery] = useState("")
  const [brand, setBrand] = useState("")
  const [size, setSize] = useState("")
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sort, setSort] = useState("price:asc")
  const [results, setResults] = useState([])

  useEffect(() => {
    const options = {
      filter: [],
      sort: [sort],
      q: query
    }

    if (brand) options.filter.push(`brand = "${brand}"`)
    if (size) options.filter.push(`size = "${size}"`)
    if (inStockOnly) options.filter.push("in_stock = true")

    client.index("products").search(query, options).then(res => setResults(res.hits))
  }, [query, brand, size, inStockOnly, sort])

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Поиск по товарам</h1>

      <input
        type="text"
        placeholder="Поиск..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ padding: "0.5rem", width: "300px", marginRight: "1rem" }}
      />

      <select value={brand} onChange={e => setBrand(e.target.value)} style={{ padding: "0.5rem", marginRight: "1rem" }}>
        <option value="">Все бренды</option>
        <option value="ТехноФут">ТехноФут</option>
        <option value="СпецТкань">СпецТкань</option>
        <option value="GripTech">GripTech</option>
        <option value="SafeHead">SafeHead</option>
      </select>

      <select value={size} onChange={e => setSize(e.target.value)} style={{ padding: "0.5rem", marginRight: "1rem" }}>
        <option value="">Все размеры</option>
        <option value="L">L</option>
        <option value="42">42</option>
        <option value="XL">XL</option>
        <option value="универсальный">универсальный</option>
      </select>

      <label style={{ marginRight: "1rem" }}>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={e => setInStockOnly(e.target.checked)}
        />{" "}
        Только в наличии
      </label>

      <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: "0.5rem" }}>
        <option value="price:asc">По цене ↑</option>
        <option value="price:desc">По цене ↓</option>
        <option value="created_at:desc">Сначала новые</option>
      </select>

      <div style={{ marginTop: "2rem" }}>
        {results.map(item => (
          <div key={item.id} style={{
            border: "1px solid #ddd",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            maxWidth: "500px"
          }}>
            <h3>{item.title}</h3>
            <p style={{ margin: "0.5rem 0", fontWeight: "bold" }}>{item.price} ₽</p>
            <p>{item.description}</p>
            <p style={{ fontSize: "0.9rem", color: "#555" }}>
              {item.brand} / {item.category} / {item.size} — {item.in_stock ? "В наличии" : "Нет в наличии"}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
