import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./order.css";

export default function Order() {
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [phone, setPhone] = useState("");
  const [mail, setMail] = useState("УкрПошта");
  const [city, setCity] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const API_URL_ORDERS = import.meta.env.VITE_API_URL_ORDERS;
  const API_URL_PRODUCTS = import.meta.env.VITE_API_URL;
  const TELEGRAM_TOKEN = import.meta.env.VITE_TELEGRAM_TOKEN;
  const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  useEffect(() => {
    const savedTotal = JSON.parse(localStorage.getItem("totalPrice")) || 0;
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setTotalPrice(savedTotal);
    setCartItems(savedCart);
  }, []);

  const validateForm = () => {
    const phoneRegex = /^(\+380\d{9}|380\d{9}|0\d{9})$/;
    const deptRegex = /^\d+$/;

    if (!name.trim()) return "Ім'я не може бути пустим";
    if (!surname.trim()) return "Прізвище не може бути пустим";
    if (!patronymic.trim()) return "По батькові не може бути пустим";
    if (!phoneRegex.test(phone)) return "Телефон повинен починатись з +380, 380 або 0";
    if (!city.trim()) return "Місто не може бути пустим";
    if (!deptRegex.test(department)) return "Відділення повинно містити тільки цифри";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      setErrorMessage(error);
      setShowModal(true);
      return;
    }

    setLoading(true);

    try {
      const orderResponse = await fetch(API_URL_ORDERS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          total: totalPrice,
          name,
          surname,
          patronymic,
          phone,
          mail,
          city,
          department,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || "Помилка створення замовлення");
      }

      await Promise.all(
        cartItems.map((item) =>
          fetch(`${API_URL_PRODUCTS}/${item.id}/stock`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: item.quantity }),
          })
        )
      );

      const message = cartItems
        .map(
          (item, index) =>
            `Товар ${index + 1}\nID: ${item.id}\nНазва: ${item.name}\nЦіна: ${item.price} грн\nКількість: ${item.quantity}\nРозмір: ${item.size}`
        )
        .join("\n\n");

      const fullMessage = `🛒 НОВЕ ЗАМОВЛЕННЯ\n\n${message}\n\n👤 ${surname} ${name} ${patronymic}\n📞 ${phone}\n📦 ${mail}\n🏙 ${city}\n🏤 Відділення: ${department}\n💰 Сума: ${totalPrice} грн`;

      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: fullMessage }),
      });

      localStorage.removeItem("cartItems");
      localStorage.removeItem("totalPrice");

      setCartItems([]);
      setTotalPrice(0);
      setName("");
      setSurname("");
      setPatronymic("");
      setPhone("");
      setMail("УкрПошта");
      setCity("");
      setDepartment("");

      window.dispatchEvent(new Event("localStorageUpdate"));

      setErrorMessage("Дякуємо! Замовлення прийнято.");
      setShowModal(true);
    } catch (err) {
      setErrorMessage(err.message || "Сталася помилка при оформленні замовлення");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    if (errorMessage === "Дякуємо! Замовлення прийнято.") {
      navigate("/home");
    }
  };

  return (
    <div className="container">
      <Helmet>
        <title>Оформлення замовлення — Athleon</title>
        <meta name="description" content="Оформіть замовлення на футбольне екіпірування від Athleon. Доставка Новою Поштою та УкрПоштою по всій Україні." />
        <meta property="og:title" content="Оформлення замовлення — Athleon" />
        <meta property="og:description" content="Швидке оформлення замовлення. Доставка по всій Україні." />
        <meta property="og:url" content="https://athelon.netlify.app/order" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://athelon.netlify.app/order" />
      </Helmet>

      <div className="order">
        <h2>Оформлення замовлення</h2>

        <p>
          Сума замовлення:{" "}
          <strong className="basket-price">{totalPrice} грн</strong>
        </p>

        <form className="order-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Ім'я" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="text" placeholder="Прізвище" value={surname} onChange={(e) => setSurname(e.target.value)} required />
          <input type="text" placeholder="По батькові" value={patronymic} onChange={(e) => setPatronymic(e.target.value)} required />
          <input type="tel" placeholder="+380XXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} required />

          <select value={mail} onChange={(e) => setMail(e.target.value)}>
            <option value="УкрПошта">УкрПошта</option>
            <option value="Нова Пошта">Нова Пошта</option>
          </select>

          <input type="text" placeholder="Місто" value={city} onChange={(e) => setCity(e.target.value)} required />
          <input type="text" placeholder="Відділення" value={department} onChange={(e) => setDepartment(e.target.value)} required />

          <button type="submit" className="order-btn" disabled={loading}>
            {loading ? "Відправка..." : "Оформити замовлення"}
          </button>
        </form>

        <button className="order-back-btn" onClick={() => navigate("/cart")}>
          Повернутися до кошика
        </button>
      </div>

      {showModal && (
        <div className="modal2">
          <div className="modal-content2">
            <h3>{errorMessage}</h3>
            <button className="button" onClick={closeModal}>Закрити</button>
          </div>
        </div>
      )}
    </div>
  );
}