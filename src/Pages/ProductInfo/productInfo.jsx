import { useEffect, useState, useRef } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import Star from "../../assets/Icons/star.svg";
import StarFill from "../../assets/Icons/starFill.svg";
import StarHalf from "../../assets/Icons/starHalf.svg";
import Basket from "../../assets/Icons/basketGreen.svg";
import BasketFill from "../../assets/Icons/basketFill.svg";
import Like from "../../assets/Icons/like.svg";
import LikeFill from "../../assets/Icons/likeFill.svg";
import Loader from "../../Components/Loader/loader";
import "./productInfo.css";

export default function ProductInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [liked, setLiked] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [recommended, setRecommended] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAddedModal, setShowAddedModal] = useState(false);
  const mainImageRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    fetch("https://athelonservers.onrender.com/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("error");
        return res.json();
      })
      .then((allProducts) => {
        const data = allProducts.find((p) => String(p.id) === id);
        if (!data) {
          setProduct(null);
          setLoading(false);
          return;
        }
        setProduct(data);
        setMainImage(data.images?.[0] || "");
        const likedItems = JSON.parse(localStorage.getItem("likedItems")) || [];
        const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        setLiked(likedItems.includes(data.id));
        setInCart(cartItems.some((i) => i.id === data.id));
        if (data.category) {
          const rec = allProducts
            .filter((p) => p.id !== data.id && p.category === data.category)
            .slice(0, 8)
            .map((p) => ({
              ...p,
              liked: likedItems.includes(p.id),
              inCart: cartItems.some((i) => i.id === p.id),
              image: p.images?.[0] || "",
            }));
          setRecommended(rec);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const updateTotalPrice = (price) => {
    let total = JSON.parse(localStorage.getItem("totalPrice")) || 0;
    total += Number(price);
    localStorage.setItem("totalPrice", JSON.stringify(total));
    window.dispatchEvent(new Event("localStorageUpdate"));
  };

  const updateCartLocalStorage = (productId, size, add = true) => {
    let items = JSON.parse(localStorage.getItem("cartItems")) || [];
    if (add) {
      const existing = items.find((i) => i.id === productId && i.size === size);
      if (existing) existing.quantity = (existing.quantity || 1) + 1;
      else items.push({
        id: productId,
        size,
        quantity: 1,
        name: product.name,
        price: product.newPrice,
      });
      updateTotalPrice(product.newPrice);
    }
    localStorage.setItem("cartItems", JSON.stringify(items));
    window.dispatchEvent(new Event("localStorageUpdate"));
  };

  const updateLikeLocalStorage = (productId, add) => {
    let items = JSON.parse(localStorage.getItem("likedItems")) || [];
    if (add) {
      if (!items.includes(productId)) items.push(productId);
    } else {
      items = items.filter((i) => i !== productId);
    }
    localStorage.setItem("likedItems", JSON.stringify(items));
    window.dispatchEvent(new Event("localStorageUpdate"));
  };

  const toggleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    updateLikeLocalStorage(product.id, newLiked);
  };

  const toggleCart = () => {
    if (!selectedSize && !inCart) {
      setShowModal(true);
      return;
    }
    if (selectedSize) {
      updateCartLocalStorage(product.id, selectedSize, true);
      setInCart(true);
      setShowAddedModal(true);
      setTimeout(() => setShowAddedModal(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setShowModal(true);
      return;
    }
    updateCartLocalStorage(product.id, selectedSize, true);
    setInCart(true);
    navigate("/order");
  };

  const toggleRecLike = (pId) => {
    setRecommended((prev) =>
      prev.map((p) => {
        if (p.id === pId) {
          const newLiked = !p.liked;
          updateLikeLocalStorage(p.id, newLiked);
          return { ...p, liked: newLiked };
        }
        return p;
      })
    );
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating))
        stars.push(<img key={i} src={StarFill} className="star-icon" alt="" loading="lazy" />);
      else if (i - rating >= 0.25 && i - rating < 0.75)
        stars.push(<img key={i} src={StarHalf} className="star-icon" alt="" loading="lazy" />);
      else stars.push(<img key={i} src={Star} className="star-icon" alt="" loading="lazy" />);
    }
    return stars;
  };

  if (loading) return <Loader />;

  if (!product)
    return (
      <div className="no-product">
        <p>Товар не знайдено 😔</p>
      </div>
    );

  const showOldPrice = product.oldPrice && product.oldPrice !== product.newPrice;

  return (
    <div className="product-page container">
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <h3>Будь ласка, оберіть розмір 🏷️</h3>
            <p>Щоб продовжити, потрібно вибрати розмір товару.</p>
            <button className="button" onClick={() => setShowModal(false)}>Закрити</button>
          </div>
        </div>
      )}

      {showAddedModal && (
        <div className="added-modal">
          <div className="added-content">
            <p>✅ Товар додано в кошик!</p>
          </div>
        </div>
      )}

      <div className="product-top">
        <div className="image-section">
          <img ref={mainImageRef} src={mainImage} alt={product.name} className="main-img" loading="lazy" />
          <div className="side-images">
            {product.images?.slice(0, 4).map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${product.name}-${i}`}
                className={`small-img ${mainImage === img ? "active" : ""}`}
                style={{ height: mainImageRef.current?.clientHeight || "auto" }}
                onClick={() => setMainImage(img)}
                loading="lazy"
              />
            ))}
          </div>
        </div>

        <div className="info-section">
          <h2 className="product-name">{product.name}</h2>
          <div className="price-row">
            <div className="price-block">
              {showOldPrice && <span className="old-price">{product.oldPrice} грн</span>}
              <span className="new-price">{product.newPrice} грн</span>
            </div>
            <div className="icon-group">
              <img src={liked ? LikeFill : Like} alt="like" className={`icon heart ${liked ? "active" : ""}`} onClick={toggleLike} loading="lazy" />
              <img src={inCart ? BasketFill : Basket} alt="basket" className={`icon basket ${inCart ? "active" : ""}`} onClick={toggleCart} loading="lazy" />
            </div>
          </div>
          <div className="rating">{renderStars(product.rating)}</div>
          <p className="description2" dangerouslySetInnerHTML={{ __html: product.description }} />
          {product.sizes?.length > 0 && (
            <div className="size-block">
              <h4>Оберіть розмір:</h4>
              <div className="sizes">
                {product.sizes.map((size) => (
                  <button key={size} className={`size-btn ${selectedSize === size ? "active" : ""}`} onClick={() => setSelectedSize(size)}>{size}</button>
                ))}
              </div>
            </div>
          )}
          <div className="buttons">
            <button className="buy-btn3" onClick={toggleCart}>Додати в кошик</button>
            <button className="cart-btn" onClick={handleBuyNow}>Купити</button>
          </div>
        </div>
      </div>

      {recommended.length > 0 ? (
        <div className="recommended-section container">
          <h2>Подібні товари</h2>
          <div className="deals-grid">
            {recommended.map((item) => {
              const showRecOld = item.oldPrice && item.oldPrice !== item.newPrice;
              return (
                <NavLink key={item.id} to={`/product/${item.id}`} className="deal-card-link">
                  <div className="deal-card deal-card-top">
                    <div className="deal-img">
                      <img src={item.image} alt={item.name} loading="lazy" />
                    </div>
                    <h3>{item.name}</h3>
                    <div className="rating">{renderStars(item.rating)}</div>
                    <p className="price">
                      {showRecOld && <span className="old">{item.oldPrice} грн</span>}
                      <span className="new">{item.newPrice} грн</span>
                    </p>
                    <div className="card-footer">
                      <button className="button">Купити</button>
                      <div className="card-icons">
                        <img src={item.liked ? LikeFill : Like} alt="heart" className={`icon heart ${item.liked ? "active" : ""}`} onClick={(e) => { e.preventDefault(); toggleRecLike(item.id); }} loading="lazy" />
                      </div>
                    </div>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="no-recommended">
          <p>Товарів за цим фільтром не знайдено</p>
        </div>
      )}
    </div>
  );
}
