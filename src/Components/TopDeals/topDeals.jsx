import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import StarIcon from "../../assets/Icons/star.svg";
import StarFillIcon from "../../assets/Icons/starFill.svg";
import StarHalfIcon from "../../assets/Icons/starHalf.svg";
import LikeIcon from "../../assets/Icons/like.svg";
import LikeFillIcon from "../../assets/Icons/likeFill.svg";
import Loader from "../Loader/loader";
import "./topDeals.css";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const TOP_COUNT = 4;

function calcAvgRating(comments) {
  if (!Array.isArray(comments) || comments.length === 0) return null;
  const sum = comments.reduce((acc, c) => acc + (Number(c.rating) || 0), 0);
  return sum / comments.length;
}

function getDiscountPercent(product) {
  const oldPrice = Number(product.oldPrice);
  const newPrice = Number(product.newPrice);
  if (!oldPrice || !newPrice || newPrice >= oldPrice) return 0;
  return ((oldPrice - newPrice) / oldPrice) * 100;
}

function StarRow({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) stars.push("fill");
    else if (i - rating < 1 && i - rating >= 0.5) stars.push("half");
    else stars.push("empty");
  }
  return (
    <div className="pc-stars">
      {stars.map((type, i) => (
        <img
          key={i}
          src={
            type === "fill"
              ? StarFillIcon
              : type === "half"
                ? StarHalfIcon
                : StarIcon
          }
          alt=""
          width={14}
          height={14}
        />
      ))}
    </div>
  );
}

function DealCard({ product, liked, onToggleLike }) {
  const images =
    Array.isArray(product.images) && product.images.length
      ? product.images
      : product.image
        ? [product.image]
        : [];

  const mainImage = images[0];

  const available = Number(product.inStock) > 0;
  const discount = Math.round(getDiscountPercent(product));

  const hasComments =
    Array.isArray(product.comments) && product.comments.length > 0;
  const avgRating = calcAvgRating(product.comments) ?? product.rating ?? 0;
  const reviewCount = hasComments ? product.comments.length : 0;

  const hasDiscount = product.oldPrice && product.newPrice < product.oldPrice;

  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className={`pc-card ${!available ? "pc-card--oos" : ""}`}>
      {discount > 0 && (
        <span className="pc-badge pc-badge-sale">
          <i className="ti ti-tag" />
          {`-${discount}%`}
        </span>
      )}

      <button
        className={`pc-wishlist ${liked ? "active" : ""}`}
        onClick={(e) => {
          stop(e);
          onToggleLike(product.id);
        }}
        aria-label="Додати до обраного"
      >
        <img
          src={liked ? LikeFillIcon : LikeIcon}
          alt="like"
          width={20}
          height={20}
        />
      </button>

      <div className="pc-img-wrap">
        {mainImage ? (
          <img src={mainImage} alt={product.name} className="pc-img" />
        ) : (
          <div className="pc-img-placeholder">
            <i className="ti ti-photo" />
          </div>
        )}

        {!available && (
          <div className="pc-out-overlay">
            <span>Немає в наявності</span>
          </div>
        )}
      </div>

      <div className="pc-body">
        <div className="pc-label-rows">
          {product.category && (
            <span className="pc-label pc-label-cat">{product.category}</span>
          )}
          {product.brand && (
            <span className="pc-label pc-label-brand">{product.brand}</span>
          )}
        </div>

        <h3 className="pc-name">{product.name}</h3>
        <p
          className="pc-desc"
          dangerouslySetInnerHTML={{
            __html: product.description,
          }}
        />

        <div className="pc-rating-row">
          {hasComments ? (
            <>
              <StarRow rating={avgRating} />
              <span className="pc-rating-val">{avgRating.toFixed(1)}</span>
              <span className="pc-review-count">({reviewCount} відгуків)</span>
            </>
          ) : (
            <span className="pc-review-count pc-no-reviews">
              Поки немає відгуків
            </span>
          )}
        </div>

        <div className="pc-price-row">
          {hasDiscount && (
            <span className="pc-price-old">
              {Number(product.oldPrice).toLocaleString("uk-UA")} грн
            </span>
          )}
          <span className="pc-price-new">
            {Number(product.newPrice).toLocaleString("uk-UA")} грн
          </span>
        </div>
      </div>
    </div>
  );
}

export const TopDeals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [likedIds, setLikedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("likedItems")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    fetch(API_URL, {
      headers: { "x-api-key": API_KEY },
    })
      .then((res) => res.json())
      .then((data) => {
        const inStockWithDiscount = data.filter(
          (item) =>
            Number(item.oldPrice) > Number(item.newPrice) &&
            Number(item.inStock) > 0,
        );

        const top = inStockWithDiscount
          .sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a))
          .slice(0, TOP_COUNT);

        setProducts(top);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleLike = (id) => {
    const current = JSON.parse(localStorage.getItem("likedItems")) || [];
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];

    localStorage.setItem("likedItems", JSON.stringify(next));
    setLikedIds(next);

    window.dispatchEvent(new Event("localStorageUpdate"));
  };

  return (
    <section className="top-deals container">
      <h2>Топ пропозиції</h2>
      {loading ? (
        <Loader />
      ) : (
        <div className="deals-grid">
          {products.map((item) => (
            <NavLink
              key={item.id}
              to={`/product/${item.id}`}
              className="pc-card-link"
            >
              <DealCard
                product={item}
                liked={likedIds.includes(item.id)}
                onToggleLike={toggleLike}
              />
            </NavLink>
          ))}
        </div>
      )}
    </section>
  );
};
