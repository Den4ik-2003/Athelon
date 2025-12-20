import { NavLink } from "react-router-dom";
import "./notfound.css";

export default function NotFound() {
  return (
    <div className="notfound">
      <div className="notfound-box">
        <h1>404</h1>
        <p>Сторінку не знайдено</p>
        <NavLink to="/" className="button">
          На головну
        </NavLink>
      </div>
    </div>
  );
}
