import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import Star from "../../assets/Icons/star.svg"
import StarFill from "../../assets/Icons/starFill.svg"
import StarHalf from "../../assets/Icons/starHalf.svg"
import Like from "../../assets/Icons/like.svg"
import LikeFill from "../../assets/Icons/likeFill.svg"
import Loader from "../Loader/loader"
import "./topDeals.css"

export const TopDeals = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("https://athelonservers.onrender.com/api/products")
      .then(res => res.json())
      .then(data => {
        const likedItems = JSON.parse(localStorage.getItem("likedItems")) || []

        const mapped = data
          .filter(item => Number(item.oldPrice) > Number(item.newPrice))
          .sort((a, b) => Number(a.id) - Number(b.id))
          .slice(-8)
          .reverse()
          .map(p => ({
            ...p,
            liked: likedItems.includes(p.id),
            image: p.images?.[0] || ""
          }))

        setProducts(mapped)
        setLoading(false)
      })
      .catch(() => setLoading(false))
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

  return (
    <section className="top-deals container">
      <h2>Топ пропозиції</h2>

      {loading ? (
        <Loader />
      ) : (
        <div className="deals-grid">
          {products.map(item => (
            <NavLink key={item.id} to={`/product/${item.id}`} className="deal-card-link">
              <div className="deal-card deal-card-top">
                <div className="deal-img">
                  <img src={item.image} alt={item.name} />
                </div>

                <h3>{item.name}</h3>

                <div className="rating">{renderStars(item.rating)}</div>

                <p className="price">
                  <span className="old">{item.oldPrice} грн</span>
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
          ))}
        </div>
      )}
    </section>
  )
}
