import "./footer.css";
import { NavLink } from "react-router-dom";
import Instagram from "../../assets/Icons/instagram.webp";
import Telegram from "../../assets/Icons/telegram.webp";
import TikTok from "../../assets/Icons/tiktok.png";

export default function Footer() {
  const contacts = [
    {
      title: "Email",
      value: "athelonstore@gmail.com",
      link: "https://mail.google.com/mail/u/0/#search/athelonstore%40gmail.com",
    },
    { title: "Instagram", value: "https://instagram.com/athleon" },
    { title: "Telegram", value: "https://t.me/athleonshop" },
    { title: "TikTok", value: "https://tiktok.com/@athleon" },
  ];

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-col about">
          <h3>Athelon</h3>
          <p>
            Ми — команда, яка живе стилем та сучасною чоловічою модою. У нас ви
            знайдете все необхідне для створення бездоганного образу — від одягу
            та взуття до вишуканих аксесуарів. Ми працюємо онлайн, щоб ви могли
            легко замовити оригінальний брендовий одяг з будь-якої точки
            України.
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
            {contacts.slice(0, 1).map((item, i) => (
              <li key={i}>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  {item.value}
                </a>
              </li>
            ))}
            <li>Україна, онлайн-магазин</li>
          </ul>
        </div>

        <div className="footer-col social">
          <h4>Ми в соцмережах</h4>
          <div className="social-icons">
            <a
              href={contacts[1].value}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={Instagram} alt="Instagram" />
            </a>
            <a
              href={contacts[2].value}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={Telegram} alt="Telegram" />
            </a>
            <a
              href={contacts[3].value}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={TikTok} alt="TikTok" />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Athelon. Всі права захищено.</p>
      </div>
    </footer>
  );
}
