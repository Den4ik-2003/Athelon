import { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import Like from "../../assets/Icons/likeFill.svg";
import Basket from "../../assets/Icons/basket.svg";
import SearchIcon from "../../assets/Icons/search.svg";
import GoTopIcon from "../../assets/Icons/goTop.svg";
import "./header.css";

export default function Header() {
  const [likeCount, setLikeCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [searchText, setSearchText] = useState("");
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

    return () => {
      window.removeEventListener("localStorageUpdate", handleLocalUpdate);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchText(params.get("search") || "");
  }, [location.search]);

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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (location.pathname === "/products") {
      const params = new URLSearchParams(location.search);

      if (value.trim()) params.set("search", value);
      else params.delete("search");

      navigate({ pathname: "/products", search: params.toString() }, { replace: true });
    }
  };

  const handleSearchSubmit = () => {
    if (searchText.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchText.trim())}`);
    } else {
      navigate("/products");
    }

    if (window.innerWidth <= 950) setMenuOpen(false);
  };

  const handleSearchKey = (e) => {
    if (e.key === "Enter") handleSearchSubmit();
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleNavLinkClick = () => {
    if (window.innerWidth <= 950) setMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
            <NavLink className="nav-link" to="/home" onClick={handleNavLinkClick}>
              Головна
            </NavLink>
            <NavLink className="nav-link" to="/products" onClick={handleNavLinkClick}>
              Товари
            </NavLink>
            <NavLink className="nav-link" to="/about" onClick={handleNavLinkClick}>
              Про нас
            </NavLink>
            <NavLink className="nav-link" to="/contact" onClick={handleNavLinkClick}>
              Контакти
            </NavLink>

            <div className="mobile-menu-extra">
              <div className="search">
                <input
                  type="text"
                  placeholder="Пошук..."
                  value={searchText}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKey}
                />
                <button type="button" className="search-btn" onClick={handleSearchSubmit}>
                  <img src={SearchIcon} alt="Search" />
                </button>
              </div>
              <div className="icons-mobile">
                <NavLink onClick={handleNavLinkClick} to="/like" className="cart">
                  <img src={Like} alt="Like" />
                  <span className="cart-count">{displayCount(likeCount)}</span>
                </NavLink>
                <NavLink onClick={handleNavLinkClick} to="/cart" className="cart cart-end">
                  <img src={Basket} alt="Basket" />
                  <span className="cart-count">{displayCount(cartCount)}</span>
                </NavLink>
              </div>
            </div>
          </nav>

          <div className="header-actions">
            <div className="search">
              <input
                type="text"
                placeholder="Пошук..."
                value={searchText}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKey}
              />
              <button type="button" className="search-btn" onClick={handleSearchSubmit}>
                <img src={SearchIcon} alt="Search" />
              </button>
            </div>
            <NavLink to="/like" className="cart">
              <img src={Like} alt="Like" />
              <span className="cart-count">{displayCount(likeCount)}</span>
            </NavLink>
            <NavLink to="/cart" className="cart">
              <img src={Basket} alt="Basket" />
              <span className="cart-count">{displayCount(cartCount)}</span>
            </NavLink>
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
