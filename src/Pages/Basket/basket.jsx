import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import "./basket.css"
import Loader from "../../Components/Loader/loader"

const API_URL = import.meta.env.VITE_API_URL
const API_KEY = import.meta.env.VITE_API_KEY

export default function Basket() {
  const [cartProducts, setCartProducts] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || []

    if (cartItems.length === 0) {
      setCartProducts([])
      setTotalPrice(0)
      localStorage.setItem("totalPrice", JSON.stringify(0))
      setLoading(false)
      return
    }

    fetch(API_URL, {
      cache: "no-store",
      headers: { "x-api-key": API_KEY }
    })
      .then(res => {
        if (!res.ok) throw new Error("error")
        return res.json()
      })
      .then(data => {
        const filtered = cartItems
          .map(cartItem => {
            const product = data.find(p => p.id === cartItem.id)
            if (!product) return null
            return {
              ...product,
              size: cartItem.size,
              quantity: cartItem.quantity || 1,
              image: product.images?.[0] || ""
            }
          })
          .filter(Boolean)

        setCartProducts(filtered)
        calculateTotal(filtered)
        setLoading(false)
      })
      .catch(() => {
        setLoading(true)
      })
  }, [])

  const calculateTotal = products => {
    const total = products.reduce(
      (acc, item) => acc + Number(item.newPrice) * (item.quantity || 1),
      0
    )
    setTotalPrice(total)
    localStorage.setItem("totalPrice", JSON.stringify(total))
  }

  const updateLocalStorage = items => {
    localStorage.setItem("cartItems", JSON.stringify(items))
    window.dispatchEvent(new Event("localStorageUpdate"))
  }

  const changeQuantity = (id, size, delta) => {
    setCartProducts(prev => {
      const updated = prev.map(p => {
        if (p.id === id && p.size === size) {
          const q = (p.quantity || 1) + delta
          return { ...p, quantity: q > 0 ? q : 1 }
        }
        return p
      })
      updateLocalStorage(updated.map(p => ({
        id: p.id,
        name: p.name,
        price: p.newPrice,
        size: p.size,
        quantity: p.quantity,
        sezon: p.sezon
      })))
      calculateTotal(updated)
      return updated
    })
  }

  const removeFromCart = (id, size) => {
    const updated = cartProducts.filter(p => !(p.id === id && p.size === size))
    setCartProducts(updated)
    calculateTotal(updated)
    updateLocalStorage(updated)
  }

  const clearCart = () => {
    setCartProducts([])
    setTotalPrice(0)
    updateLocalStorage([])
    localStorage.setItem("totalPrice", JSON.stringify(0))
  }

  return (
    <section className="basket2 top-deals container">
      <h2>Ваш кошик</h2>

      {loading ? (
        <Loader />
      ) : cartProducts.length === 0 ? (
        <div className="basket-empty2">
          <p>Ваш кошик порожній</p>
          <NavLink to="/products" className="basket-btn2">
            Перейти до товарів
          </NavLink>
        </div>
      ) : (
        <>
          <div className="deals-grid">
            {cartProducts.map(item => (
              <div key={`${item.id}-${item.size}`} className="deal-card basket-card">
                <NavLink to={`/product/${item.id}`} className="deal-img">
                  <img src={item.image} alt={item.name} />
                </NavLink>

                <h3>{item.name}</h3>

                <p className="price">
                  <span className="new">{item.newPrice} грн</span>
                </p>

                <p className="description2">
                  Розмір: <strong>{item.size}</strong>
                </p>

                <div className="card-footer2">
                  <div className="basket-quantity">
                    <button onClick={() => changeQuantity(item.id, item.size, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => changeQuantity(item.id, item.size, 1)}>+</button>
                  </div>
                  <button
                    className="basket-remove"
                    onClick={() => removeFromCart(item.id, item.size)}
                  >
                    Видалити
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="basket-bottom">
            <div className="basket-total">
              <span>Всього: </span>
              <strong>{totalPrice} грн</strong>
            </div>
            <div className="basket-buttons">
              <NavLink to="/order" className="basket-buy-btn">
                Оформити замовлення
              </NavLink>
              <button onClick={clearCart} className="basket-clear-btn">
                Видалити все
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}