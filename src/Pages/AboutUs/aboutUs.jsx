import { useEffect, useRef } from "react"
import "./aboutUs.css"
import History from "../../assets/Images/about1.jpg"
import Mission from "../../assets/Images/mission.jpg"

const OFFERS = [
  "Футбольні форми та комплектуючі для команд і особистої гри",
  "Бутси, гетри та спортивний одяг для тренувань і матчів",
  "Аксесуари: сумки, щитки, рукавички та більше",
  "Оригінальне екіпірування Nike, Adidas, Puma та інших",
]

export default function AboutUs() {
  const revealRef = useRef(null)

  useEffect(() => {
    const els = revealRef.current?.querySelectorAll("[data-reveal]")
    if (!els) return
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target) }
      }),
      { threshold: 0.12 }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="about-page" ref={revealRef}>

      <section className="about-hero">
        <div className="about-hero__bg" aria-hidden="true">
          <div className="about-hero__blob about-hero__blob--a" />
          <div className="about-hero__blob about-hero__blob--b" />
          <div className="about-hero__grid" />
        </div>
        <div className="about-hero__inner" data-reveal>
          <p className="about-eyebrow">Хто ми</p>
          <h1 className="about-hero__title">Про <span>Athleon</span></h1>
          <p className="about-hero__lead">
            Молода та амбітна компанія, що спеціалізується на футбольному та
            спортивному екіпіруванні. Форми, бутси, аксесуари від провідних
            брендів — для тих, хто грає на повну.
          </p>
        </div>
      </section>

      <section className="about-split">
        <div className="about-split__text" data-reveal data-reveal-dir="left">
          <p className="about-eyebrow">З чого все почалось</p>
          <h2>Наша історія</h2>
          <p>
            Кілька років тому команда ентузіастів футболу вирішила змінити
            підхід до спортивного екіпірування в Україні. Починали з невеликого
            асортименту — сьогодні ми надійний постачальник оригінального
            екіпірування для тисяч спортсменів.
          </p>
        </div>
        <div className="about-split__media" data-reveal data-reveal-dir="right">
          <div className="about-img-frame">
            <img src={History} alt="Наша команда" />
            <div className="about-img-frame__badge">
              <span className="badge-num">5+</span>
              <span className="badge-label">років досвіду</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-split about-split--flip about-split--dark">
        <div className="about-split__media" data-reveal data-reveal-dir="left">
          <div className="about-img-frame">
            <img src={Mission} alt="Місія" />
            <div className="about-img-frame__badge about-img-frame__badge--right">
              <span className="badge-num">50+</span>
              <span className="badge-label">брендів</span>
            </div>
          </div>
        </div>
        <div className="about-split__text" data-reveal data-reveal-dir="right">
          <p className="about-eyebrow">Навіщо ми існуємо</p>
          <h2>Наша місія</h2>
          <p>
            Надихати спортсменів виглядати впевнено — на полі та поза ним.
            Ми поєднуємо стиль, комфорт і результативність у кожній деталі
            екіпірування, яке пропонуємо.
          </p>
        </div>
      </section>

      <section className="about-offers">
        <div className="about-offers__header" data-reveal>
          <p className="about-eyebrow">Асортимент</p>
          <h2>Що ми пропонуємо</h2>
        </div>

        <div className="about-offers__grid">
          {OFFERS.map((text, i) => (
            <div
              className="offer-card"
              key={i}
              data-reveal
              style={{ "--delay": `${i * 0.1}s` }}
            >
              <span className="offer-card__num">0{i + 1}</span>
              <p className="offer-card__text">{text}</p>
              <div className="offer-card__line" />
            </div>
          ))}
        </div>

        
      </section>

      <section className="about-cta" data-reveal>
        <div className="about-cta__inner">
          <h2>Приєднуйтесь до <span>Athleon</span></h2>
          <p>
            Персональний підбір, стильне екіпірування та підтримка на кожному
            кроці — від першого замовлення до поля.
          </p>
          <a href="/products" className="about-cta__btn">Переглянути товари</a>
        </div>
        <div className="about-cta__blob" aria-hidden="true" />
      </section>

    </div>
  )
}