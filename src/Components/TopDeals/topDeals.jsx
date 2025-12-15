import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import Star from "../../assets/Icons/star.svg"
import StarFill from "../../assets/Icons/starFill.svg"
import StarHalf from "../../assets/Icons/starHalf.svg"
import Like from "../../assets/Icons/like.svg"
import LikeFill from "../../assets/Icons/likeFill.svg"
import "./topDeals.css"

export const TopDeals = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch("https://athelonservers.onrender.com/api/products")
      .then(res => res.json())
      .then(data => {
        const discounted = data.filter(item => item.oldPrice > item.newPrice)
        const likedItems = JSON.parse(localStorage.getItem("likedItems")) || []
        setProducts(
          discounted.slice(0, 8).map(p => ({
            ...p,
            liked: likedItems.includes(p.id),
            image: p.images && p.images.length > 0 ? p.images[0] : ""
          }))
        )
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
          const newLiked = !p.liked
          updateLocalStorage("likedItems", id, newLiked)
          return { ...p, liked: newLiked }
        }
        return p
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
    <section className="top-deals container">
      <h2>Топ пропозиції</h2>
      <div className="deals-grid">
        {products.map(item => (
          <NavLink key={item.id} to={`/product/${item.id}`} className="deal-card-link">
            <div className="deal-card deal-card-top">
              <div className="deal-img">
                <img src={item.image} alt={item.name} />
              </div>
              <h3>{item.name}</h3>
              <p className="description" dangerouslySetInnerHTML={{ __html: item.description }}></p>
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
        ))}
      </div>
    </section>
  )
}
