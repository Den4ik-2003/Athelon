import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./reviews.css";

const API_URL = import.meta.env.VITE_API_URL;
const COMMENTS_URL = import.meta.env.VITE_COMMENTS_URL;

const AVATAR_COLORS = [
  "#16A34A",
  "#F59E0B",
  "#2563EB",
  "#DC2626",
  "#7C3AED",
  "#0EA5E9",
  "#DB2777",
  "#65A30D",
];

function getAvatarColor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function pluralizeReviews(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod100 >= 11 && mod100 <= 14) return "відгуків";
  if (mod10 === 1) return "відгук";
  if (mod10 >= 2 && mod10 <= 4) return "відгуки";
  return "відгуків";
}

function Stars({ rating }) {
  return (
    <div className="review-stars" aria-label={`Оцінка ${rating} з 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? "star filled" : "star"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function Reviews() {
  const [products, setProducts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [brokenAvatars, setBrokenAvatars] = useState(new Set());

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        setLoading(true);
        const [productsRes, commentsRes] = await Promise.all([
          fetch(API_URL),
          fetch(COMMENTS_URL),
        ]);

        if (!productsRes.ok || !commentsRes.ok) {
          throw new Error("Failed to load reviews data");
        }

        const productsData = await productsRes.json();
        const commentsData = await commentsRes.json();

        if (!ignore) {
          setProducts(productsData);
          setComments(commentsData);
          setError(false);
        }
      } catch (err) {
        if (!ignore) setError(true);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadData();
    return () => {
      ignore = true;
    };
  }, []);

  const handleAvatarError = (id) => {
    setBrokenAvatars((prev) => new Set(prev).add(id));
  };

  const getProduct = (productId) =>
    products.find((product) => product.id === productId);

  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  const averageRating = comments.length
    ? (
        comments.reduce((sum, comment) => sum + comment.rating, 0) /
        comments.length
      ).toFixed(1)
    : 0;

  return (
    <section className="reviews-section">
      <Helmet>
        <title>Відгуки покупців | Реальні оцінки товарів | Athelon</title>
        <meta
          name="description"
          content={`Чесні відгуки покупців про брендовий чоловічий одяг Athelon. ${
            comments.length
              ? `${comments.length} ${pluralizeReviews(comments.length)} із середньою оцінкою ${averageRating} з 5. `
              : ""
          }Реальні думки клієнтів про якість, посадку та доставку Stone Island та інших преміум брендів.`}
        />
        <meta
          name="keywords"
          content="відгуки покупців, відгуки про Stone Island, оцінки товарів, чоловічий одяг відгуки, Athelon відгуки, рейтинг товарів"
        />
        <link rel="canonical" href="https://athelon.netlify.app/reviews" />
      </Helmet>

      <div className="container reviews-container">
        <div className="reviews-head">
          <span className="reviews-eyebrow">Думка наших клієнтів</span>
          <h2>
            Відгуки <span className="accent">покупців</span>
          </h2>

          {!loading && !error && comments.length > 0 && (
            <div className="reviews-summary">
              <span className="summary-score">{averageRating}</span>
              <div className="summary-meta">
                <Stars rating={Math.round(averageRating)} />
                <span className="summary-count">
                  {comments.length} {pluralizeReviews(comments.length)}
                </span>
              </div>
            </div>
          )}
        </div>

        {loading && (
          <div className="reviews-grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="review-card skeleton" />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="reviews-state">
            <p>Не вдалося завантажити відгуки. Спробуйте пізніше.</p>
          </div>
        )}

        {!loading && !error && sortedComments.length === 0 && (
          <div className="reviews-state">
            <p>Поки немає відгуків.</p>
          </div>
        )}

        {!loading && !error && sortedComments.length > 0 && (
          <div className="reviews-grid">
            {sortedComments.map((comment) => {
              const product = getProduct(comment.productId);
              const showAvatarImage =
                comment.avatar && !brokenAvatars.has(comment._id);

              return (
                <article key={comment._id} className="review-card">
                  <div className="review-top">
                    {showAvatarImage ? (
                      <img
                        src={comment.avatar}
                        alt={comment.authorName}
                        className="review-avatar"
                        onError={() => handleAvatarError(comment._id)}
                      />
                    ) : (
                      <div
                        className="review-avatar review-avatar-fallback"
                        style={{
                          backgroundColor: getAvatarColor(comment.authorName),
                        }}
                      >
                        {comment.authorName?.charAt(0).toUpperCase() || "?"}
                      </div>
                    )}
                    <div className="review-author">
                      <span className="author-name">{comment.authorName}</span>
                      <span className="review-date">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <Stars rating={comment.rating} />
                  </div>

                  <p className="review-text">{comment.text}</p>

                  {product && (
                    <Link
                      to={`/product/${product.id}`}
                      className="review-product"
                    >
                      <img src={product.images?.[0]} alt={product.name} />
                      <div className="review-product-info">
                        <span className="review-product-label">Товар</span>
                        <span className="review-product-name">
                          {product.name}
                        </span>
                      </div>
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}