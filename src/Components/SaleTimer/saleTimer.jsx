import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./saleTimer.css";

export default function SaleTimer() {
  const [product, setProduct] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://athelonservers.onrender.com/api/products")
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        const discounted = data.filter(p => p.oldPrice > p.newPrice);
        if (!discounted.length) return;
        const randomIndex = Math.floor(Math.random() * discounted.length);
        setProduct(discounted[randomIndex]);
      });
    setTimeLeft(10800);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  if (!product) return null;

  return (
    <section className="sale-timer container">
      <h2>Спеціальна пропозиція</h2>
      <div className="sale-card">
        <div className="sale-img">
          <img src={product.images?.[0]} alt={product.name} />
        </div>
        <div className="sale-info">
          <h3>{product.name}</h3>
          <p>
            <span className="old">{product.oldPrice} грн</span>
            <br />
            <span className="new">{product.newPrice} грн</span>
          </p>
          <div className="timer">
            Акція закінчиться через: <span>{formatTime(timeLeft)}</span>
          </div>
          <br />
          <button
            className="button buttonProposition"
            onClick={() => navigate("/products")}
          >
            Перейти
          </button>
        </div>
      </div>
    </section>
  );
}