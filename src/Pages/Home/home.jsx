import Video from "../../assets/Video/video.mp4";
import Advantages from "../../Components/Advantages/advantages";
import { NavLink } from "react-router-dom";
import { TopDeals } from "../../Components/TopDeals/topDeals";
import "./home.css";

export default function Home() {
  return (
    <div>
      <section className="hero">
        <video className="hero-video" src={Video} autoPlay loop muted></video>

        <div className="hero-content">
          <h1>Athelon</h1>
          <p>
    Athleon — це сучасне екіпірування для футболу та спорту, для тих, хто обирає стиль, комфорт і результативність.  
    Кожна футбольна форма, кожні бутси та аксесуари створені, щоб підкреслити твою індивідуальність на полі.  
    Одягни стиль та екіпірування, яке говорить про твою силу без слів.
</p>

          <NavLink to="/products" className="button">
            Перейти до товарів
          </NavLink>
        </div>
      </section>

      <TopDeals />

      <Advantages />

    </div>
  );
}
