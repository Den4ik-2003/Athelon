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
            Справжня сила — у впевненості, що народжується зсередини. Кожна річ,
            кожна деталь, кожен образ — це крок до твого найкращого «я». Одягни
            стиль, який говорить без слів.
          </p>

          <NavLink to="/products" className="button">
            Почати зараз
          </NavLink>
        </div>
      </section>

      <TopDeals />

      <Advantages />

      <Stats />
    </div>
  );
}
