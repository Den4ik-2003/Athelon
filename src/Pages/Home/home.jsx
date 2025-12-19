import Video from "../../assets/Video/video.mp4";
import Advantages from "../../Components/Advantages/advantages";
import { NavLink } from "react-router-dom";
import { TopDeals } from "../../Components/TopDeals/topDeals";
import "./home.css";
import Stats from "../../Components/Stats/stats";

export default function Home() {
  return (
    <div>
      <section className="hero">
        <video className="hero-video" src={Video} autoPlay loop muted></video>

        <div className="hero-content">
          <h1>Athelon</h1>
          <p>
            Athelon — це сучасний одяг для тих, хто обирає стиль, комфорт і характер.
Кожна деталь, кожен крій і кожен образ створені, щоб підкреслити твою індивідуальність.
Одягни стиль, який говорить без слів.
          </p>

          <NavLink to="/products" className="button">
            Перейти до товарів
          </NavLink>
        </div>
      </section>

      <TopDeals />

      <Advantages />

      <Stats />
    </div>
  );
}
