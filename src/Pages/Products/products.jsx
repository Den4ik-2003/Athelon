import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Star from "../../assets/Icons/star.svg";
import StarFill from "../../assets/Icons/starFill.svg";
import StarHalf from "../../assets/Icons/starHalf.svg";
import Like from "../../assets/Icons/like.svg";
import LikeFill from "../../assets/Icons/likeFill.svg";
import "./products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    price: [0, 10000],
    rating: 0,
    inStock: "all"
  });
  const [visibleCount, setVisibleCount] = useState(50);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const searchTerm = query.get("search")?.toLowerCase() || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/products");
        const data = await res.json();
        setProducts(data);
        const uniqueCategories = Array.from(new Set(data.map(p => p.category).filter(Boolean)));
        const uniqueBrands = Array.from(new Set(data.map(p => p.brand).filter(Boolean)));
        setCategories(uniqueCategories);
        setBrands(uniqueBrands);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const updateLocalStorage = (key, id, add) => {
    let items = JSON.parse(localStorage.getItem(key)) || [];
    if (add) {
      if (!items.includes(id)) items.push(id);
    } else {
      items = items.filter(i => i !== id);
    }
    localStorage.setItem(key, JSON.stringify(items));
    window.dispatchEvent(new Event("localStorageUpdate"));
  };

  const toggleLike = id => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const newLiked = !p.liked;
          updateLocalStorage("likedItems", id, newLiked);
          return { ...p, liked: newLiked };
        }
        return p;
      })
    );
  };

  const renderStars = rating => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) stars.push(<img key={i} src={StarFill} className="star-icon" alt="" loading="lazy"/>);
      else if (i - rating >= 0.25 && i - rating < 0.75) stars.push(<img key={i} src={StarHalf} className="star-icon" alt="" loading="lazy"/>);
      else stars.push(<img key={i} src={Star} className="star-icon" alt="" loading="lazy"/>);
    }
    return stars;
  };

  const handleFilterChange = e => {
    const { name, value } = e.target;
    if (name === "priceMin") setFilters(prev => ({ ...prev, price: [Number(value), prev.price[1]] }));
    else if (name === "priceMax") setFilters(prev => ({ ...prev, price: [prev.price[0], Number(value)] }));
    else setFilters(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    let result = [...products];
    if (searchTerm) result = result.filter(p => p.name.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm));
    if (filters.category) result = result.filter(p => p.category === filters.category);
    if (filters.brand) result = result.filter(p => p.brand === filters.brand);
    result = result.filter(p => p.newPrice >= filters.price[0] && p.newPrice <= filters.price[1]);
    if (filters.rating) result = result.filter(p => p.rating >= filters.rating);
    if (filters.inStock === "yes") result = result.filter(p => p.inStock);
    else if (filters.inStock === "no") result = result.filter(p => !p.inStock);
    setFiltered(result);
  }, [filters, products, searchTerm]);

  const loadMore = () => setVisibleCount(prev => prev + 50);
  const visibleProducts = filtered.slice(0, visibleCount);

  return (
    <section className="top-deals container">
      <div className="filters">
        <select name="category" onChange={handleFilterChange} value={filters.category}>
          <option value="">Всі категорії</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select name="brand" onChange={handleFilterChange} value={filters.brand}>
          <option value="">Всі бренди</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>

        <input type="number" name="priceMin" value={filters.price[0]} onChange={handleFilterChange} min="0" />
        <input type="number" name="priceMax" value={filters.price[1]} onChange={handleFilterChange} min="0" />

        <select name="rating" value={filters.rating} onChange={handleFilterChange}>
          <option value={0}>Будь-який рейтинг</option>
          <option value={1}>1+ зірка</option>
          <option value={2}>2+ зірки</option>
          <option value={3}>3+ зірки</option>
          <option value={4}>4+ зірки</option>
          <option value={5}>5 зірок</option>
        </select>

        <select name="inStock" value={filters.inStock} onChange={handleFilterChange}>
          <option value="all">Всі</option>
          <option value="yes">В наявності</option>
          <option value="no">Немає в наявності</option>
        </select>
      </div>

      <div className="deals-grid">
        {visibleProducts.length === 0 ? (
          <p className="errorText">Товари за цим фільтром не знайдено</p>
        ) : (
          visibleProducts.map(item => (
            <NavLink key={item.id} to={`/product/${item.id}`} className="deal-card-link">
              <div className="deal-card">
                <div className="deal-img">
                  <img src={item.images?.[0]} alt={item.name} loading="lazy"/>
                </div>

                <h3>{item.name}</h3>

                <p className="description" dangerouslySetInnerHTML={{ __html: item.description }}></p>

                <div className="rating">{renderStars(item.rating)}</div>

                <p className="price">
                  {item.oldPrice !== item.newPrice && <span className="old">{item.oldPrice} грн</span>}
                  <span className="new">{item.newPrice} грн</span>
                </p>

                <div className="card-footer">
                  <button className="button">Купити</button>

                  <div className="card-icons">
                    <img
                      src={item.liked ? LikeFill : Like}
                      alt=""
                      className={`icon heart ${item.liked ? "active" : ""}`}
                      onClick={e => {
                        e.preventDefault();
                        toggleLike(item.id);
                      }}
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </NavLink>
          ))
        )}
      </div>

      {visibleProducts.length < filtered.length && (
        <div className="load-more-container">
          <button className="button load-more" onClick={loadMore}>Показати ще</button>
        </div>
      )}
    </section>
  );
}
