import { Helmet } from "react-helmet-async";
import Video from "../../assets/Video/video.mp4";
import Advantages from "../../Components/Advantages/advantages";
import { NavLink } from "react-router-dom";
import { TopDeals } from "../../Components/TopDeals/topDeals";
import "./home.css";
import SaleTimer from "../../Components/SaleTimer/saleTimer";
import WhyUs from "../../Components/WhyUs/whyUs";

export default function Home() {
  return (
    <div>
      <Helmet>
        <title>Athleon — Футбольне екіпірування в Україні</title>
        <meta name="description" content="Athleon — інтернет-магазин футбольного екіпірування: бутси, форма, аксесуари. Доставка Новою Поштою та УкрПоштою по всій Україні." />
        <meta property="og:title" content="Athleon — Футбольне екіпірування в Україні" />
        <meta property="og:description" content="Великий вибір бутс, форми та аксесуарів для футболу. Швидка доставка по всій Україні." />
        <meta property="og:url" content="https://athelon.netlify.app/" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://athelon.netlify.app/" />
      </Helmet>

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

      <WhyUs />

      <SaleTimer />
    </div>
  );
}