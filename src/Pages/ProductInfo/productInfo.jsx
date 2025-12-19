import { useEffect, useState, useRef } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import Star from "../../assets/Icons/star.svg";
import StarFill from "../../assets/Icons/starFill.svg";
import StarHalf from "../../assets/Icons/starHalf.svg";
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
      .then((res) => res.json())
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

        let rec = allProducts
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
      prev.map((p) =>
        p.id === pId ? { ...p, liked: !p.liked } : p
      )
    );
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating))
        stars.push(<img key={i} src={StarFill} className="star-icon" alt="" />);
      else if (i - rating < 1)
        stars.push(<img key={i} src={StarHalf} className="star-icon" alt="" />);
      else stars.push(<img key={i} src={Star} className="star-icon" alt="" />);
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
          <img
            ref={mainImageRef}
            src={mainImage}
            alt={product.name}
            className="main-img"
          />
          <div className="side-images">
            {product.images?.slice(0, 4).map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className={`small-img ${mainImage === img ? "active" : ""}`}
                style={{ height: mainImageRef.current?.clientHeight || "auto" }}
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
                    className={`size-btn ${
                      selectedSize === size ? "active" : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="buttons">
            <button className="buy-btn3" onClick={updateCartLocalStorage}>
              Додати в кошик
            </button>
            <button className="cart-btn" onClick={handleBuyNow}>
              Купити
            </button>
          </div>
        </div>
      </div>

      {recommended.length > 0 ? (
        <div className="recommended-section container">
          <h2>Подібні товари</h2>
          <div className="deals-grid">
            {recommended.map((item) => {
              const showRecOld =
                item.oldPrice && item.oldPrice !== item.newPrice;
              return (
                <NavLink
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="deal-card-link"
                >
                  <div className="deal-card deal-card-top">
                    <div className="deal-img">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <h3>{item.name}</h3>
                    <div className="rating">
                      {renderStars(item.rating)}
                    </div>
                    <p className="price">
                      {showRecOld && (
                        <span className="old">{item.oldPrice} грн</span>
                      )}
                      <span className="new">{item.newPrice} грн</span>
                    </p>
                    <div className="card-footer">
                      <button className="button">Купити</button>
                      <div className="card-icons">
                        <img
                          src={item.liked ? LikeFill : Like}
                          alt="heart"
                          className={`icon heart ${
                            item.liked ? "active" : ""
                          }`}
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
