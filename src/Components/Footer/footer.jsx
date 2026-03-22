import "./footer.css"
import { NavLink } from "react-router-dom"
import Instagram from "../../assets/Icons/instagram.webp"
import Telegram from "../../assets/Icons/telegram.webp"

export default function Footer() {
  const contacts = {
    email: {
      value: "athelonstore@gmail.com",
      link: "mailto:athelonstore@gmail.com",
    },
    instagram: "https://instagram.com/athelon.store",
    telegram: "https://t.me/athelonstore",
  }

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-col about">
          <h3>Athelon</h3>
          <p>
    Ми — команда, яка живе футболом та сучасним спортивним стилем. У нас ви знайдете все необхідне для бездоганного футбольного образу — від форм та бутсів до стильних аксесуарів для тренувань і матчів. Ми працюємо онлайн, щоб ви могли легко замовити оригінальне спортивне екіпірування з будь-якої точки України.
</p>
        </div>

        <div className="footer-col links">
          <h4>Швидкі посилання</h4>
          <ul>
            <li>
              <NavLink to="/home">Головна</NavLink>
            </li>
            <li>
              <NavLink to="/products">Товари</NavLink>
            </li>
            <li>
              <NavLink to="/about">Про нас</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Контакти</NavLink>
            </li>
          </ul>
        </div>

        <div className="footer-col contact">
          <h4>Контакти</h4>
          <ul>
            <li>
              <a href={contacts.email.link}>
                {contacts.email.value}
              </a>
            </li>
            <li>Україна, онлайн-магазин</li>
          </ul>
        </div>

        <div className="footer-col social">
          <h4>Ми в соцмережах</h4>
          <div className="social-icons">
            <a
              href={contacts.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={Instagram} alt="Instagram" />
            </a>
            <a
              href={contacts.telegram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={Telegram} alt="Telegram" />
            </a>
            {/* <a
              href={contacts.tiktok}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={TikTok} alt="TikTok" />
            </a> */}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Athelon. Всі права захищено.</p>
      </div>
    </footer>
  )
}
