import Video from "../../assets/Video/video.mp4";
import Advantages from "../../Components/Advantages/advantages";
import { NavLink } from "react-router-dom";
import { TopDeals } from "../../Components/TopDeals/topDeals";
import "./home.css";
import SaleTimer from "../../Components/SaleTimer/saleTimer";

export default function Home() {
  return (
    <div>
      <section className="hero">
        <video className="hero-video" src={Video} autoPlay loop muted></video>

        <div className="hero-content">
          <h1>Athelon</h1>
          <p>
            Athleon — це сучасне екіпірування для футболу та спорту, для тих,
            хто обирає стиль, комфорт і результативність. Кожна футбольна форма,
            кожні бутси та аксесуари створені, щоб підкреслити твою
            індивідуальність на полі. Одягни стиль та екіпірування, яке говорить
            про твою силу без слів.
          </p>

          <NavLink to="/products" className="button">
            Перейти до товарів
          </NavLink>
        </div>
      </section>

      <TopDeals />

      <Advantages />

      <section className="why-us container">
        <h2>Чому обирають <span>Athleon </span>?</h2>

        <div className="why-grid">
          <div className="why-card">
            <h3>⚡ Швидка доставка</h3>
            <p>Доставляємо по всій Україні за 1–3 дні</p>
          </div>

          <div className="why-card">
            <h3>🏆 Якість</h3>
            <p>Тільки перевірені бренди та матеріали</p>
          </div>

          <div className="why-card">
            <h3>💰 Вигідні ціни</h3>
            <p>Регулярні знижки та акції</p>
          </div>
        </div>
      </section>

      <SaleTimer />
    </div>
  );
}
