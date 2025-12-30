import { useEffect, useState, useRef } from "react"
import Star from "../../assets/Icons/star.svg"
import StarFill from "../../assets/Icons/starFill.svg"
import StarHalf from "../../assets/Icons/starHalf.svg"
import ArrowLeft from "../../assets/Icons/arrowLeft.svg"
import ArrowRight from "../../assets/Icons/arrowRight.svg"
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

export default function Advantages() {
  const [reviews, setReviews] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [phase, setPhase] = useState("show")
  const [loading, setLoading] = useState(true)
  const timerRef = useRef(null)

  const mockReviews = [
    { user: "Олександра", rating: 5, comment: "Дуже якісний сервіс, швидка доставка!", avatar: Avatar1 },
    { user: "Степан", rating: 4.8, comment: "Замовляю вже не вперше — все супер.", avatar: Avatar2 },
    { user: "Оксана", rating: 4.9, comment: "Якість перевершила очікування.", avatar: Avatar3 },
    { user: "Юлія", rating: 4.7, comment: "Хороший магазин, рекомендую.", avatar: Avatar4 },
    { user: "Денис", rating: 5, comment: "Дуже задоволена покупкою ❤️", avatar: Avatar5 },
    { user: "Дмитро", rating: 4.8, comment: "Все прийшло швидко і без проблем.", avatar: Avatar6 },
    { user: "Богдан", rating: 4.9, comment: "Підтримка відповідає миттєво.", avatar: Avatar7 },
    { user: "Владислав", rating: 5, comment: "Один з кращих сервісів, що пробував.", avatar: Avatar8 },
    { user: "Назар", rating: 4.7, comment: "Дуже зручно користуватись сайтом.", avatar: Avatar9 },
    { user: "Богдан", rating: 4.9, comment: "Точно повернусь ще 👍", avatar: Avatar10 },
  ]

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setReviews(mockReviews)
      setLoading(false)
    }, 300)
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    if (!isMobile || !reviews.length) return

    timerRef.current = setTimeout(() => {
      setPhase("hide")
      setTimeout(() => {
        setCurrentIndex(i => (i + 1) % reviews.length)
        setPhase("show")
      }, 700)
    }, 5000)

    return () => clearTimeout(timerRef.current)
  }, [currentIndex, isMobile, reviews.length])

  const prevSlide = () => {
    setCurrentIndex(i => (i === 0 ? reviews.length - 1 : i - 1))
  }

  const nextSlide = () => {
    setCurrentIndex(i => (i === reviews.length - 1 ? 0 : i + 1))
  }

  const renderStars = rating =>
    Array.from({ length: 5 }, (_, i) => {
      if (i + 1 <= Math.floor(rating)) return <img key={i} src={StarFill} />
      if (i + 1 - rating < 1) return <img key={i} src={StarHalf} />
      return <img key={i} src={Star} />
    })

  const Card = ({ review, active }) => (
    <div className={`review-card2 ${active ? "active" : ""} ${isMobile ? phase : ""}`}>
      <div className="review-header">
        <img src={review.avatar} className="avatar" />
        <div className="user-info">
          <h4>{review.user}</h4>
          <div className="stars">{renderStars(review.rating)}</div>
        </div>
      </div>
      <p className="review-text">{review.comment}</p>
    </div>
  )

  const prev = currentIndex === 0 ? reviews.length - 1 : currentIndex - 1
  const next = currentIndex === reviews.length - 1 ? 0 : currentIndex + 1

  return (
    <section className="reviews-carousel">
      <h2>Відгуки наших клієнтів</h2>

      {loading ? (
        <Loader />
      ) : (
        <div className="carousel-wrapper">
          {!isMobile && (
            <img src={ArrowLeft} className="carousel-btn left" onClick={prevSlide} />
          )}

          <div className="reviews-display">
            {isMobile ? (
              <Card review={reviews[currentIndex]} active />
            ) : (
              <>
                <Card review={reviews[prev]} />
                <Card review={reviews[currentIndex]} active />
                <Card review={reviews[next]} />
              </>
            )}
          </div>

          {!isMobile && (
            <img src={ArrowRight} className="carousel-btn right" onClick={nextSlide} />
          )}
        </div>
      )}
    </section>
  )
}
