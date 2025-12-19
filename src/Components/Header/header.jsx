import { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import Like from "../../assets/Icons/likeFill.svg";
import Basket from "../../assets/Icons/basket.svg";
import GoTopIcon from "../../assets/Icons/goTop.svg";
import "./header.css";

export default function Header() {
  const [likeCount, setLikeCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const updateCounts = () => {
    const likedItems = JSON.parse(localStorage.getItem("likedItems")) || [];
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setLikeCount(likedItems.length);
    setCartCount(cartItems.length);
  };

  useEffect(() => {
    updateCounts();
    const handleLocalUpdate = () => updateCounts();
    window.addEventListener("localStorageUpdate", handleLocalUpdate);
    return () => window.removeEventListener("localStorageUpdate", handleLocalUpdate);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    document.documentElement.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  const displayCount = (count) => (count > 9 ? "9+" : count);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleNavLinkClick = () => { if (window.innerWidth <= 950) setMenuOpen(false); };
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <div className="logo">
            <h1>Athelon</h1>
          </div>

          <div className={`burger ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <nav className={`nav ${menuOpen ? "open" : ""}`}>
            <NavLink className="nav-link" to="/home" onClick={handleNavLinkClick}>Головна</NavLink>
            <NavLink className="nav-link" to="/products" onClick={handleNavLinkClick}>Товари</NavLink>
            <NavLink className="nav-link" to="/about" onClick={handleNavLinkClick}>Про нас</NavLink>
            <NavLink className="nav-link" to="/contact" onClick={handleNavLinkClick}>Контакти</NavLink>
          </nav>

          <div className="header-actions">
            <NavLink to="/like" className="cart">
              <img src={Like} alt="Like" />
              <span className="cart-count">{displayCount(likeCount)}</span>
            </NavLink>
            <NavLink to="/cart" className="cart">
              <img src={Basket} alt="Basket" />
              <span className="cart-count">{displayCount(cartCount)}</span>
            </NavLink>
            <button className="button" onClick={() => navigate("/products")}>Купити</button>
          </div>
        </div>
      </header>

      {showScrollTop && (
        <button className="scroll-top-btn" onClick={scrollToTop}>
          <img src={GoTopIcon} alt="Go Top" />
        </button>
      )}
    </>
  );
}
