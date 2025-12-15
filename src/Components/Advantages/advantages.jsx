import { useEffect, useState, useRef } from "react"
import Star from "../../assets/Icons/star.svg"
import StarFill from "../../assets/Icons/starFill.svg"
import StarHalf from "../../assets/Icons/starHalf.svg"
import ArrowLeft from "../../assets/Icons/arrowLeft.svg"
import ArrowRight from "../../assets/Icons/arrowRight.svg"
import "./advantages.css"

export default function Advantages() {
  const [reviews, setReviews] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [phase, setPhase] = useState("show")
  const timerRef = useRef(null)

  useEffect(() => {
    fetch("http://localhost:5001/api/products")
      .then(res => res.json())
      .then(data => {
        const allReviews = data.map(p => p.reviews).flat().slice(0, 7)
        setReviews(allReviews)
      })
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    if (!isMobile || !reviews.length) return

    const run = () => {
      setPhase("show")

      timerRef.current = setTimeout(() => {
        setPhase("hide")

        timerRef.current = setTimeout(() => {
          setCurrentIndex(i => (i + 1) % reviews.length)
          setPhase("show")
        }, 2000)
      }, 5000)
    }

    run()
    return () => clearTimeout(timerRef.current)
  }, [currentIndex, isMobile, reviews.length])

  const prevSlide = () => {
    setCurrentIndex(p => (p === 0 ? reviews.length - 1 : p - 1))
  }

  const nextSlide = () => {
    setCurrentIndex(p => (p === reviews.length - 1 ? 0 : p + 1))
  }

  const renderStars = rating =>
    Array.from({ length: 5 }, (_, i) => {
      if (i + 1 <= Math.floor(rating)) return <img key={i} src={StarFill} />
      if (i + 1 - rating < 1) return <img key={i} src={StarHalf} />
      return <img key={i} src={Star} />
    })

  if (!reviews.length) return null

  const prev = currentIndex === 0 ? reviews.length - 1 : currentIndex - 1
  const next = currentIndex === reviews.length - 1 ? 0 : currentIndex + 1

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

  return (
    <section className="reviews-carousel">
      <h2>Відгуки наших клієнтів</h2>
      <div className="carousel-wrapper">
        {!isMobile && <img src={ArrowLeft} className="carousel-btn left" onClick={prevSlide} />}
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
        {!isMobile && <img src={ArrowRight} className="carousel-btn right" onClick={nextSlide} />}
      </div>
    </section>
  )
}
