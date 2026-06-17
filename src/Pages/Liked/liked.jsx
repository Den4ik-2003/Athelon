import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import Star from "../../assets/Icons/star.svg"
import StarFill from "../../assets/Icons/starFill.svg"
import StarHalf from "../../assets/Icons/starHalf.svg"
import Like from "../../assets/Icons/like.svg"
import LikeFill from "../../assets/Icons/likeFill.svg"
import Loader from "../../Components/Loader/loader"
import "./liked.css"

const API_URL = import.meta.env.VITE_API_URL
const API_KEY = import.meta.env.VITE_API_KEY

export default function Liked() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const likedItems = JSON.parse(localStorage.getItem("likedItems")) || []

    fetch(API_URL, {
      cache: "no-store",
      headers: { "x-api-key": API_KEY }
    })
      .then(res => {
        if (!res.ok) throw new Error("error")
        return res.json()
      })
      .then(data => {
        const likedProducts = data
          .filter(item => likedItems.includes(item.id))
          .map(p => ({ ...p, liked: true, image: p.images?.[0] || "" }))
        setProducts(likedProducts)
        setLoading(false)
      })
      .catch(() => {
        setLoading(true)
      })
  }, [])

  const toggleLike = id => {
    setProducts(prev =>
      prev.filter(p => {
        if (p.id === id) {
          const items = JSON.parse(localStorage.getItem("likedItems")) || []
          localStorage.setItem("likedItems", JSON.stringify(items.filter(i => i !== id)))
          window.dispatchEvent(new Event("localStorageUpdate"))
          return false
        }
        return true
      })
    )
  }

  const renderStars = rating => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) stars.push(<img key={i} src={StarFill} className="star-icon" alt="" />)
      else if (i - rating >= 0.25 && i - rating < 0.75) stars.push(<img key={i} src={StarHalf} className="star-icon" alt="" />)
      else stars.push(<img key={i} src={Star} className="star-icon" alt="" />)
    }
    return stars
  }

  return (
    <section className="liked container">
      <Helmet>
        <title>Улюблені товари — Athleon</title>
        <meta name="description" content="Ваш список улюблених товарів Athleon: збережені бутси, форма та аксесуари для футболу." />
        <meta property="og:title" content="Улюблені товари — Athleon" />
        <meta property="og:description" content="Перегляньте збережені товари та оформіть замовлення на футбольне екіпірування від Athleon." />
        <meta property="og:url" content="https://athelon.netlify.app/liked" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://athelon.netlify.app/liked" />
      </Helmet>

      <h2 className="liked-title">Товари які вам сподобались</h2>

      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <div className="empty-state">
          <p>Поки немає лайкнутих товарів</p>
          <NavLink to="/products" className="basket-btn2">
            Переглянути товари
          </NavLink>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(item => {
            const outOfStock = Number(item.inStock) === 0
            return (
              <NavLink key={item.id} to={`/product/${item.id}`} className="deal-card-link">
                <div className={`deal-card ${outOfStock ? "deal-card--out-of-stock" : ""}`}>
                  <div className="deal-img">
                    <img src={item.image} alt={item.name} />
                    {outOfStock && (
                      <div className="out-of-stock-badge">Немає в наявності</div>
                    )}
                  </div>
                  <h3>{item.name}</h3>
                  <div className="rating">{renderStars(item.rating)}</div>
                  <p className="price">
                    <span className="old">{item.oldPrice} грн</span>
                    <span className="new">{item.newPrice} грн</span>
                  </p>
                  <div className="card-footer">
                    <button
                      className="button"
                      disabled={outOfStock}
                      onClick={e => outOfStock && e.preventDefault()}
                    >
                      {outOfStock ? "Немає в наявності" : "Купити"}
                    </button>
                    <div className="card-icons">
                      <img
                        src={item.liked ? LikeFill : Like}
                        alt=""
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
            )
          })}
        </div>
      )}
    </section>
  )
}