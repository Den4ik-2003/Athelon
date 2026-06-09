import { useEffect, useState, useRef, useCallback } from "react"
import Star from "../../assets/Icons/star.svg"
import StarFill from "../../assets/Icons/starFill.svg"
import StarHalf from "../../assets/Icons/starHalf.svg"
import Loader from "../Loader/loader"
import Avatar1 from "../../assets/Avatars/ava1.jpg"
import Avatar2 from "../../assets/Avatars/ava2.jpg"
import Avatar3 from "../../assets/Avatars/ava3.jpg"
import Avatar4 from "../../assets/Avatars/ava4.jpg"
import Avatar5 from "../../assets/Avatars/ava5.jpg"
import Avatar6 from "../../assets/Avatars/ava6.jpg"
import Avatar7 from "../../assets/Avatars/ava7.jpg"
import Avatar8 from "../../assets/Avatars/ava8.jpg"
import Avatar9 from "../../assets/Avatars/ava9.jpg"
import Avatar10 from "../../assets/Avatars/ava10.jpg"
import "./advantages.css"

const mockReviews = [
  { user: "Олександра", rating: 5,   comment: "Дуже якісний сервіс, швидка доставка!", avatar: Avatar1 },
  { user: "Степан",     rating: 4.8, comment: "Замовляю вже не вперше — все супер.", avatar: Avatar2 },
  { user: "Оксана",     rating: 4.9, comment: "Якість перевершила очікування.", avatar: Avatar3 },
  { user: "Юлія",       rating: 4.7, comment: "Хороший магазин, рекомендую.", avatar: Avatar4 },
  { user: "Денис",      rating: 5,   comment: "Дуже задоволений покупкою ❤️", avatar: Avatar5 },
  { user: "Дмитро",     rating: 4.8, comment: "Все прийшло швидко і без проблем.", avatar: Avatar6 },
  { user: "Богдан",     rating: 4.9, comment: "Підтримка відповідає миттєво.", avatar: Avatar7 },
  { user: "Владислав",  rating: 5,   comment: "Один з кращих сервісів, що пробував.", avatar: Avatar8 },
  { user: "Назар",      rating: 4.7, comment: "Дуже зручно користуватись сайтом.", avatar: Avatar9 },
  { user: "Богдан",     rating: 4.9, comment: "Точно повернусь ще 👍", avatar: Avatar10 },
]

const STACK = [
  { x: 12,  y: 20,  rot:  7,  scale: 0.88 },  
  { x: -8,  y: 13,  rot: -5,  scale: 0.91 },  
  { x:  5,  y: 6,   rot:  3,  scale: 0.95 },  
  { x:  0,  y: 0,   rot:  0,  scale: 1.00 },  
]

const VISIBLE = STACK.length
const TOTAL   = mockReviews.length

function renderStars(rating) {
  return Array.from({ length: 5 }, (_, i) => {
    if (i + 1 <= Math.floor(rating)) return <img key={i} src={StarFill} alt="★" />
    if (i + 1 - rating < 1)          return <img key={i} src={StarHalf} alt="½" />
    return <img key={i} src={Star} alt="☆" />
  })
}

function DeckCard({ review, depthIndex, isTop, onClick }) {
  const cardRef = useRef(null)
  const s = STACK[depthIndex]

  const handleMouseMove = useCallback(e => {
    if (!isTop || !cardRef.current) return
    const { left, top, width, height } = cardRef.current.getBoundingClientRect()
    const cx = (e.clientX - left) / width  - 0.5
    const cy = (e.clientY - top)  / height - 0.5
    cardRef.current.style.setProperty("--tilt-x", `${cy * -14}deg`)
    cardRef.current.style.setProperty("--tilt-y", `${cx *  14}deg`)
  }, [isTop])

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return
    cardRef.current.style.setProperty("--tilt-x", "0deg")
    cardRef.current.style.setProperty("--tilt-y", "0deg")
  }, [])

  return (
    <div
      ref={cardRef}
      className={`deck-card ${isTop ? "deck-card--top" : "deck-card--ghost"}`}
      style={{
        "--tx":  `${s.x}px`,
        "--ty":  `${s.y}px`,
        "--rot": `${s.rot}deg`,
        "--sc":  s.scale,
        "--z":   depthIndex + 1,
        "--dim": isTop ? 1 : 0.45 + depthIndex * 0.1,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={isTop ? onClick : undefined}
    >
      <div className="deck-card__inner">
        <div className="deck-card__glare" />
        {isTop && (
          <>
            <div className="review-header">
              <div className="avatar-wrap">
                <img src={review.avatar} className="avatar" alt={review.user} />
                <span className="avatar-ring" />
              </div>
              <div className="user-info">
                <h4>{review.user}</h4>
                <div className="stars">{renderStars(review.rating)}</div>
              </div>
              <span className="rating-badge">{review.rating.toFixed(1)}</span>
            </div>
            <p className="review-text">"{review.comment}"</p>
            <div className="card-hint">Натисни щоб далі →</div>
          </>
        )}
      </div>
    </div>
  )
}

export default function Advantages() {
  const [loading, setLoading]     = useState(true)
  const [baseIndex, setBaseIndex] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState("next")

  const animatingRef = useRef(false)
  const baseIndexRef = useRef(0)
  const autoRef      = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(t)
  }, [])

  const goTo = useCallback((nextIndex, dir) => {
    if (animatingRef.current) return
    animatingRef.current = true
    setAnimating(true)
    setDirection(dir)
    setTimeout(() => {
      baseIndexRef.current = nextIndex
      setBaseIndex(nextIndex)
      animatingRef.current = false
      setAnimating(false)
    }, 550)
  }, [])

  const advance = useCallback((dir) => {
    const next = dir === "next"
      ? (baseIndexRef.current + 1) % TOTAL
      : (baseIndexRef.current - 1 + TOTAL) % TOTAL
    goTo(next, dir)
  }, [goTo])

  useEffect(() => {
    if (loading) return
    const schedule = () => {
      clearTimeout(autoRef.current)
      autoRef.current = setTimeout(() => { advance("next"); schedule() }, 4500)
    }
    schedule()
    return () => clearTimeout(autoRef.current)
  }, [loading, advance])

  if (loading) return (
    <section className="reviews-section"><Loader /></section>
  )

  const avgRating = (mockReviews.reduce((s, r) => s + r.rating, 0) / TOTAL).toFixed(1)

  const deckItems = Array.from({ length: VISIBLE }, (_, depthIndex) => {
    const offset = VISIBLE - 1 - depthIndex
    const idx = ((baseIndex - offset) % TOTAL + TOTAL) % TOTAL
    return { review: mockReviews[idx], depthIndex }
  })

  return (
    <section className="reviews-section">
      <div className="blob blob--a" aria-hidden="true" />
      <div className="blob blob--b" aria-hidden="true" />

      <div className="reviews-inner">
        <div className="reviews-meta">
          <p className="reviews-eyebrow">Що кажуть клієнти</p>
          <h2 className="reviews-headline">
            Тисячі задоволених<br />покупців
          </h2>
          <div className="stat-row">
            <div className="stat">
              <span className="stat-num">{avgRating}</span>
              <span className="stat-label">Середня оцінка</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-num">{TOTAL}+</span>
              <span className="stat-label">Відгуків сьогодні</span>
            </div>
          </div>
          <div className="nav-buttons">
            <button className="nav-btn" onClick={() => advance("prev")} aria-label="Попередній">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="dot-track">
              {mockReviews.map((_, i) => (
                <button
                  key={i}
                  className={`dot ${i === baseIndex ? "dot--active" : ""}`}
                  onClick={() => { if (i !== baseIndex) goTo(i, i > baseIndex ? "next" : "prev") }}
                  aria-label={`Відгук ${i + 1}`}
                />
              ))}
            </div>
            <button className="nav-btn" onClick={() => advance("next")} aria-label="Наступний">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="deck-stage">
          <div className={`deck ${animating ? `deck--${direction}` : ""}`}>
            {deckItems.map(({ review, depthIndex }) => (
              <DeckCard
                key={`${baseIndex}-${depthIndex}`}
                review={review}
                depthIndex={depthIndex}
                isTop={depthIndex === VISIBLE - 1}
                onClick={() => advance("next")}
              />
            ))}
          </div>
          <div className="deck-shadow" />
        </div>
      </div>
    </section>
  )
}