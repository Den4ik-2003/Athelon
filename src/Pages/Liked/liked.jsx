import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import Star from "../../assets/Icons/star.svg"
import StarFill from "../../assets/Icons/starFill.svg"
import StarHalf from "../../assets/Icons/starHalf.svg"
import Like from "../../assets/Icons/like.svg"
import LikeFill from "../../assets/Icons/likeFill.svg"
import "./liked.css"

export default function Liked() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const likedItems = JSON.parse(localStorage.getItem("likedItems")) || []
    fetch("http://localhost:5001/api/products")
      .then(res => res.json())
      .then(data => {
        const likedProducts = data
          .filter(item => likedItems.includes(item.id))
          .map(p => ({ ...p, liked: true, image: p.images?.[0] || "" }))
        setProducts(likedProducts)
      })
      .catch(err => console.error("Помилка завантаження лайкнутих товарів:", err))
  }, [])

  const toggleLike = id => {
    setProducts(prev => prev.filter(p => {
      if (p.id === id) {
        const items = JSON.parse(localStorage.getItem("likedItems")) || []
        localStorage.setItem("likedItems", JSON.stringify(items.filter(i => i !== id)))
        window.dispatchEvent(new Event("localStorageUpdate"))
        return false
      }
      return true
    }))
  }

  const renderStars = rating => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) stars.push(<img key={i} src={StarFill} className="star-icon" alt="star" />)
      else if (i - rating >= 0.25 && i - rating < 0.75) stars.push(<img key={i} src={StarHalf} className="star-icon" alt="star-half" />)
      else stars.push(<img key={i} src={Star} className="star-icon" alt="star-empty" />)
    }
    return stars
  }

  return (
    <section className="liked container">
      <h2 className="liked-title">Товари які вам сподобались</h2>
      {products.length === 0 ? (
        <div className="empty-state">
          <p>Поки немає лайкнутих товарів</p>
          <NavLink to="/products" className="view-products-btn">Переглянути товари</NavLink>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(item => (
            <NavLink key={item.id} to={`/product/${item.id}`} className="deal-card-link">
              <div className="deal-card">
                <div className="deal-img"><img src={item.image} alt={item.name} /></div>
                <h3>{item.name}</h3>
                <p className="description" dangerouslySetInnerHTML={{ __html: item.description }}></p>
                <div className="rating">{renderStars(item.rating)}</div>
                <p className="price"><span className="old">{item.oldPrice} грн</span> <span className="new">{item.newPrice} грн</span></p>
                <div className="card-footer">
                  <button className="buy-btn">Купити</button>
                  <div className="card-icons">
                    <img src={item.liked ? LikeFill : Like} alt="heart" className={`icon heart ${item.liked ? "active" : ""}`} onClick={e => { e.preventDefault(); toggleLike(item.id); }} />
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
