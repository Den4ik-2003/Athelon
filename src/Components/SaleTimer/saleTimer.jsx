import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./saleTimer.css";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const PRODUCT_KEY = "saleTimerProduct";
const TIMER_KEY = "saleTimerEnd";
const DURATION = 10800;

export default function SaleTimer() {
  const [product, setProduct] = useState(null);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [visible, setVisible] = useState(false);
  const [digits, setDigits] = useState({ h: "03", m: "00", s: "00" });
  const [flipping, setFlipping] = useState({ h: false, m: false, s: false });
  const prevDigits = useRef({ h: "03", m: "00", s: "00" });
  const navigate = useNavigate();
  const allProductsRef = useRef([]);

  const pickNewProduct = (products) => {
    if (!products.length) return null;
    const picked = products[Math.floor(Math.random() * products.length)];
    const endTime = Date.now() + DURATION * 1000;
    localStorage.setItem(PRODUCT_KEY, JSON.stringify(picked));
    localStorage.setItem(TIMER_KEY, String(endTime));
    return { picked, endTime };
  };

  useEffect(() => {
    const cachedProduct = localStorage.getItem(PRODUCT_KEY);
    const cachedEnd = localStorage.getItem(TIMER_KEY);

    if (cachedProduct && cachedEnd) {
      const secondsLeft = Math.floor((Number(cachedEnd) - Date.now()) / 1000);

      if (secondsLeft > 0) {
        setProduct(JSON.parse(cachedProduct));
        setTimeLeft(secondsLeft);
        setTimeout(() => setVisible(true), 100);
      }
    }

    fetch(API_URL, {
      headers: { "x-api-key": API_KEY }
    })
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        const discounted = data.filter(
          p => p.oldPrice > p.newPrice && Number(p.inStock) > 0
        );
        allProductsRef.current = discounted;

        const end = Number(localStorage.getItem(TIMER_KEY));
        const secondsLeft = Math.floor((end - Date.now()) / 1000);

        if (!localStorage.getItem(PRODUCT_KEY) || secondsLeft <= 0) {
          const result = pickNewProduct(discounted);
          if (!result) return;
          setProduct(result.picked);
          setTimeLeft(DURATION);
          setTimeout(() => setVisible(true), 100);
        }
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          const products = allProductsRef.current;
          const result = pickNewProduct(products);
          if (result) {
            setProduct(result.picked);
            setVisible(false);
            setTimeout(() => setVisible(true), 100);
          }
          return DURATION;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const h = Math.floor(timeLeft / 3600).toString().padStart(2, "0");
    const m = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, "0");
    const s = (timeLeft % 60).toString().padStart(2, "0");

    const newFlipping = {
      h: h !== prevDigits.current.h,
      m: m !== prevDigits.current.m,
      s: s !== prevDigits.current.s,
    };

    if (newFlipping.h || newFlipping.m || newFlipping.s) {
      setFlipping(newFlipping);
      setTimeout(() => setFlipping({ h: false, m: false, s: false }), 400);
    }

    prevDigits.current = { h, m, s };
    setDigits({ h, m, s });
  }, [timeLeft]);

  const discount = product
    ? Math.round(((product.oldPrice - product.newPrice) / product.oldPrice) * 100)
    : 0;

  if (!product) return null;

  return (
    <section className="sale-timer container">
      <div className={`sale-wrapper ${visible ? "sale-wrapper--visible" : ""}`}>

        <div className="sale-label">
          <span className="sale-label__dot" />
          Обмежена пропозиція
        </div>

        <div className="sale-card">
          <div className="sale-img-wrap">
            <div className="sale-discount-badge">−{discount}%</div>
            <img src={product.images?.[0]} alt={product.name} className="sale-img" />
            <div className="sale-img-glow" />
          </div>

          <div className="sale-info">
            <h2 className="sale-title">Спеціальна пропозиція</h2>
            <h3 className="sale-product-name">{product.name}</h3>

            <div className="sale-prices">
              <span className="sale-old">{product.oldPrice} грн</span>
              <span className="sale-new">{product.newPrice} грн</span>
            </div>

            <div className="sale-timer-label">Акція закінчиться через:</div>

            <div className="flip-clock">
              <div className={`flip-unit ${flipping.h ? "flip-unit--flipping" : ""}`}>
                <div className="flip-card">
                  <span className="flip-top">{digits.h}</span>
                </div>
                <span className="flip-label">год</span>
              </div>
              <span className="flip-sep">:</span>
              <div className={`flip-unit ${flipping.m ? "flip-unit--flipping" : ""}`}>
                <div className="flip-card">
                  <span className="flip-top">{digits.m}</span>
                </div>
                <span className="flip-label">хв</span>
              </div>
              <span className="flip-sep">:</span>
              <div className={`flip-unit ${flipping.s ? "flip-unit--flipping" : ""}`}>
                <div className="flip-card">
                  <span className="flip-top">{digits.s}</span>
                </div>
                <span className="flip-label">сек</span>
              </div>
            </div>

            <button
              className="sale-btn"
              onClick={() => navigate("/products")}
            >
              <span>Перейти до товару</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}