import { useEffect, useState, useRef } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Star from "../../assets/Icons/star.svg";
import StarFill from "../../assets/Icons/starFill.svg";
import StarHalf from "../../assets/Icons/starHalf.svg";
import Like from "../../assets/Icons/like.svg";
import LikeFill from "../../assets/Icons/likeFill.svg";
import Loader from "../../Components/Loader/loader";
import "./productInfo.css";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

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
    fetch(API_URL, {
      cache: "no-store",
      headers: { "x-api-key": API_KEY },
    })
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

        const likedItems = JSON.parse(localStorage.getItem("likedItems")) || [];
        const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

        setProduct(data);
        setMainImage(data.images?.[0] || "");
        setLiked(likedItems.includes(data.id));
        setInCart(cartItems.some((i) => i.id === data.id));

        const rec = allProducts
          .filter(
            (p) =>
              p.id !== data.id &&
              (p.brand === data.brand || p.category === data.category)
          )
          .slice(0, 8)
          .map((p) => ({
            ...p,
            liked: likedItems.includes(p.id),
            image: p.images?.[0] || "",
          }));

        setRecommended(rec);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const updateCartLocalStorage = () => {
    if (!selectedSize) {
      setShowModal(true);
      return;
    }

    let items = JSON.parse(localStorage.getItem("cartItems")) || [];
    let total = JSON.parse(localStorage.getItem("totalPrice")) || 0;

    const existing = items.find(
      (i) => i.id === product.id && i.size === selectedSize
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        size: selectedSize,
        price: product.newPrice,
        quantity: 1,
      });
    }

    total += Number(product.newPrice);

    localStorage.setItem("cartItems", JSON.stringify(items));
    localStorage.setItem("totalPrice", JSON.stringify(total));
    window.dispatchEvent(new Event("localStorageUpdate"));

    setInCart(true);
    setShowAddedModal(true);
    setTimeout(() => setShowAddedModal(false), 2000);
  };

  const toggleLike = () => {
    let items = JSON.parse(localStorage.getItem("likedItems")) || [];
    if (liked) items = items.filter((i) => i !== product.id);
    else items.push(product.id);
    localStorage.setItem("likedItems", JSON.stringify(items));
    setLiked(!liked);
    window.dispatchEvent(new Event("localStorageUpdate"));
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setShowModal(true);
      return;
    }
    updateCartLocalStorage();
    navigate("/order");
  };

  const toggleRecLike = (pId) => {
    let items = JSON.parse(localStorage.getItem("likedItems")) || [];
    const exists = items.includes(pId);
    if (exists) items = items.filter((i) => i !== pId);
    else items.push(pId);
    localStorage.setItem("likedItems", JSON.stringify(items));

    setRecommended((prev) =>
      prev.map((p) => (p.id === pId ? { ...p, liked: !p.liked } : p))
    );
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating))
        stars.push(<img key={i} src={StarFill} className="star-icon" alt="" />);
      else if (i - rating < 1)
        stars.push(<img key={i} src={StarHalf} className="star-icon" alt="" />);
      else
        stars.push(<img key={i} src={Star} className="star-icon" alt="" />);
    }
    return stars;
  };

  if (loading) return <Loader />;

  if (!product)
    return (
      <div className="no-product">
        <Helmet>
          <title>Товар не знайдено — Athleon</title>
          <meta name="description" content="На жаль, такого товару немає в каталозі Athleon. Перегляньте інші пропозиції футбольного екіпірування." />
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <p>Товар не знайдено 😔</p>
      </div>
    );

  const showOldPrice = product.oldPrice && product.oldPrice !== product.newPrice;
  const outOfStock = Number(product.inStock) === 0;

  const seoTitle = `${product.name} — купити в Athleon`;
  const seoDescription = `${product.name} за ціною ${product.newPrice} грн. ${
    outOfStock ? "Тимчасово немає в наявності." : "В наявності, доставка по всій Україні."
  } Оригінальне футбольне екіпірування від Athleon.`;
  const seoUrl = `https://athelon.netlify.app/product/${product.id}`;
  const seoImage = product.images?.[0] || "";

  return (
    <div className="product-page container">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={seoUrl} />
        <meta property="og:type" content="product" />
        {seoImage && <meta property="og:image" content={seoImage} />}
        <link rel="canonical" href={seoUrl} />
      </Helmet>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <h3>Будь ласка, оберіть розмір 🏷️</h3>
            <p>Щоб продовжити, потрібно вибрати розмір товару.</p>
            <button className="button" onClick={() => setShowModal(false)}>
              Закрити
            </button>
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

      <div className="product-top container">
        <div className="image-section">
          <div style={{ position: "relative" }}>
            <img
              ref={mainImageRef}
              src={mainImage}
              alt={product.name}
              className="main-img"
              style={outOfStock ? { filter: "grayscale(100%)", opacity: 0.6 } : {}}
            />
            {outOfStock && (
              <div className="out-of-stock-badge">Немає в наявності</div>
            )}
          </div>
          <div className="side-images">
            {product.images?.slice(0, 4).map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className={`small-img ${mainImage === img ? "active" : ""}`}
                style={{
                  height: mainImageRef.current?.clientHeight || "auto",
                  ...(outOfStock ? { filter: "grayscale(100%)", opacity: 0.6 } : {}),
                }}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        <div className="info-section">
          <h2 className="product-name">{product.name}</h2>
          <div className="price-row">
            <div className="price-block">
              {showOldPrice && (
                <span className="old-price">{product.oldPrice} грн</span>
              )}
              <span className="new-price">{product.newPrice} грн</span>
            </div>
            <div className="icon-group">
              <img
                src={liked ? LikeFill : Like}
                alt="like"
                className={`icon heart ${liked ? "active" : ""}`}
                onClick={toggleLike}
              />
            </div>
          </div>

          <div className="rating">{renderStars(product.rating)}</div>

          <p
            className="description2"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />

          {product.sizes?.length > 0 && (
            <div className="size-block">
              <h4>Оберіть розмір:</h4>
              <div className="sizes">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? "active" : ""}`}
                    onClick={() => !outOfStock && setSelectedSize(size)}
                    disabled={outOfStock}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="buttons">
            <button
              className="buy-btn3"
              onClick={updateCartLocalStorage}
              disabled={outOfStock}
              style={outOfStock ? { background: "#444", color: "#888", cursor: "default" } : {}}
            >
              {outOfStock ? "Немає в наявності" : "Додати в кошик"}
            </button>
            <button
              className="cart-btn"
              onClick={handleBuyNow}
              disabled={outOfStock}
              style={outOfStock ? { background: "#444", color: "#888", cursor: "default" } : {}}
            >
              {outOfStock ? "Немає в наявності" : "Купити"}
            </button>
          </div>
        </div>
      </div>

      {recommended.length > 0 ? (
        <div className="recommended-section container">
          <h2>Подібні товари</h2>
          <div className="deals-grid">
            {recommended.map((item) => {
              const showRecOld = item.oldPrice && item.oldPrice !== item.newPrice;
              const recOutOfStock = Number(item.inStock) === 0;
              return (
                <NavLink
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="deal-card-link"
                >
                  <div className={`deal-card deal-card-top ${recOutOfStock ? "deal-card--out-of-stock" : ""}`}>
                    <div className="deal-img">
                      <img src={item.image} alt={item.name} />
                      {recOutOfStock && (
                        <div className="out-of-stock-badge">Немає в наявності</div>
                      )}
                    </div>
                    <h3>{item.name}</h3>
                    <div className="rating">{renderStars(item.rating)}</div>
                    <p className="price">
                      {showRecOld && (
                        <span className="old">{item.oldPrice} грн</span>
                      )}
                      <span className="new">{item.newPrice} грн</span>
                    </p>
                    <div className="card-footer">
                      <button
                        className="button"
                        disabled={recOutOfStock}
                        onClick={(e) => recOutOfStock && e.preventDefault()}
                      >
                        {recOutOfStock ? "Немає в наявності" : "Купити"}
                      </button>
                      <div className="card-icons">
                        <img
                          src={item.liked ? LikeFill : Like}
                          alt="heart"
                          className={`icon heart ${item.liked ? "active" : ""}`}
                          onClick={(e) => {
                            e.preventDefault();
                            toggleRecLike(item.id);
                          }}
                        />
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