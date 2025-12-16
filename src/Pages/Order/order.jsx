import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./order.css";

export default function Order() {
  const [totalPrice, setTotalPrice] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [department, setDepartment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedTotal = JSON.parse(localStorage.getItem("totalPrice")) || 0;
    setTotalPrice(savedTotal);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderData = {
      name,
      phone,
      email,
      city,
      department,
      totalPrice,
    };
    console.log("Замовлення:", orderData);

    localStorage.setItem("cartItems", JSON.stringify([]));
    localStorage.setItem("totalPrice", JSON.stringify(0));
    alert("Дякуємо! Замовлення прийнято.");
  };

  return (
    <div className="container">
      <div className="order">
        <h2>Оформлення замовлення</h2>
        <p>
          Сума замовлення:{" "}
          <strong className="basket-price">{totalPrice} грн</strong>
        </p>

        <form className="order-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ім’я"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Телефон"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Місто"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Відділення"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />
          <button type="submit" className="order-btn">
            Оформити замовлення
          </button>
        </form>

        <button className="order-back-btn" onClick={() => navigate("/cart")}>
          Повернутися до кошика
        </button>
      </div>
    </div>
  );
}
