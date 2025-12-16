import { useEffect, useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import Star from "../../assets/Icons/star.svg"
import StarFill from "../../assets/Icons/starFill.svg"
import StarHalf from "../../assets/Icons/starHalf.svg"
import Like from "../../assets/Icons/like.svg"
import LikeFill from "../../assets/Icons/likeFill.svg"
import "./products.css"
import Loader from "../../Components/Loader/loader"

export default function Products() {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    price: [0, 10000],
    rating: 0,
    inStock: "all"
  })
  const [visibleCount, setVisibleCount] = useState(50)

  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const searchTerm = query.get("search")?.toLowerCase() || ""

  useEffect(() => {
    setLoading(true)

    fetch("https://athelonservers.onrender.com/api/products")
      .then(res => {
        if (!res.ok) throw new Error("Network error")
        return res.json()
      })
      .then(data => {
        if (!Array.isArray(data) || !data.length) return

        const likedItems = JSON.parse(localStorage.getItem("likedItems")) || []

        const mapped = data.map(p => ({
          ...p,
          liked: likedItems.includes(p.id)
        }))

        setProducts(mapped)
        setCategories([...new Set(mapped.map(p => p.category).filter(Boolean))])
        setBrands([...new Set(mapped.map(p => p.brand).filter(Boolean))])
        setLoading(false)
      })
      .catch(() => {
        setLoading(true)
      })
  }, [])

  const updateLocalStorage = (key, id, add) => {
    let items = JSON.parse(localStorage.getItem(key)) || []
    if (add) {
      if (!items.includes(id)) items.push(id)
    } else {
      items = items.filter(i => i !== id)
    }
    localStorage.setItem(key, JSON.stringify(items))
    window.dispatchEvent(new Event("localStorageUpdate"))
  }

  const toggleLike = id => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const liked = !p.liked
          updateLocalStorage("likedItems", id, liked)
          return { ...p, liked }
        }
        return p
      })
    )
  }

  const renderStars = rating =>
    Array.from({ length: 5 }, (_, i) => {
      if (i + 1 <= Math.floor(rating)) return <img key={i} src={StarFill} className="star-icon" />
      if (i + 1 - rating < 1) return <img key={i} src={StarHalf} className="star-icon" />
      return <img key={i} src={Star} className="star-icon" />
    })

  const handleFilterChange = e => {
    const { name, value } = e.target
    if (name === "priceMin") setFilters(p => ({ ...p, price: [Number(value), p.price[1]] }))
    else if (name === "priceMax") setFilters(p => ({ ...p, price: [p.price[0], Number(value)] }))
    else setFilters(p => ({ ...p, [name]: value }))
  }

  useEffect(() => {
    let result = [...products]

    if (searchTerm)
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm)
      )

    if (filters.category) result = result.filter(p => p.category === filters.category)
    if (filters.brand) result = result.filter(p => p.brand === filters.brand)
    result = result.filter(p => p.newPrice >= filters.price[0] && p.newPrice <= filters.price[1])
    if (filters.rating) result = result.filter(p => p.rating >= filters.rating)
    if (filters.inStock === "yes") result = result.filter(p => p.inStock)
    if (filters.inStock === "no") result = result.filter(p => !p.inStock)

    setFiltered(result)
  }, [products, filters, searchTerm])

  const loadMore = () => setVisibleCount(p => p + 50)
  const visibleProducts = filtered.slice(0, visibleCount)

  return (
    <section className="top-deals container">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="filters">
            <select name="category" onChange={handleFilterChange} value={filters.category}>
              <option value="">Всі категорії</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select name="brand" onChange={handleFilterChange} value={filters.brand}>
              <option value="">Всі бренди</option>
              {brands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            <input type="number" name="priceMin" value={filters.price[0]} onChange={handleFilterChange} />
            <input type="number" name="priceMax" value={filters.price[1]} onChange={handleFilterChange} />

            <select name="rating" value={filters.rating} onChange={handleFilterChange}>
              <option value={0}>Будь-який рейтинг</option>
              <option value={1}>1+</option>
              <option value={2}>2+</option>
              <option value={3}>3+</option>
              <option value={4}>4+</option>
              <option value={5}>5</option>
            </select>

            <select name="inStock" value={filters.inStock} onChange={handleFilterChange}>
              <option value="all">Всі</option>
              <option value="yes">В наявності</option>
              <option value="no">Немає</option>
            </select>
          </div>

          <div className="deals-grid">
            {visibleProducts.length === 0 ? (
              <p className="errorText">Товари за цим фільтром не знайдено</p>
            ) : (
              visibleProducts.map(item => (
                <NavLink key={item.id} to={`/product/${item.id}`} className="deal-card-link">
                  <div className="deal-card">
                    <div className="deal-img">
                      <img src={item.images?.[0]} alt={item.name} />
                    </div>

                    <h3>{item.name}</h3>

                    <p className="description" dangerouslySetInnerHTML={{ __html: item.description }}></p>

                    <div className="rating">{renderStars(item.rating)}</div>

                    <p className="price">
                      {item.oldPrice !== item.newPrice && <span className="old">{item.oldPrice} грн</span>}
                      <span className="new">{item.newPrice} грн</span>
                    </p>

                    <div className="card-footer">
                      <button className="button">Купити</button>
                      <div className="card-icons">
                        <img
                          src={item.liked ? LikeFill : Like}
                          className={`icon heart ${item.liked ? "active" : ""}`}
                          onClick={e => {
                            e.preventDefault()
                            toggleLike(item.id)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </NavLink>
              ))
            )}
          </div>

          {visibleProducts.length < filtered.length && (
            <div className="load-more-container">
              <button className="button load-more" onClick={loadMore}>Показати ще</button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
