import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
    const savedTotal = JSON.parse(localStorage.getItem("totalPrice")) || 0;
    const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setTotalPrice(savedTotal);
    setCartItems(savedCart);
  }, []);

  const validateForm = () => {
    const phoneRegex = /^\+380\d{9}$/;
    const deptRegex = /^\d+$/;

    if (!name.trim()) return "Ім’я не може бути пустим";
    if (!surname.trim()) return "Прізвище не може бути пустим";
    if (!patronymic.trim()) return "По батькові не може бути пустим";
    if (!phoneRegex.test(phone)) return "Телефон повинен бути у форматі +380XXXXXXXXX";
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

const message = cartItems
  .map(
    (item, index) =>
      `Товар ${index + 1}:\nID: ${item.id}\nНазва: ${item.name}\nЦіна: ${item.price}\nКількість: ${item.quantity}\nРозмір: ${item.size}`
  )
  .join("\n\n");

    const formData = new FormData();
    formData.append("access_key", "88a6e90e-2834-4510-91c0-0ff59e95aec0");
    formData.append("name", name);
    formData.append("surname", surname);
    formData.append("patronymic", patronymic);
    formData.append("phone", phone);
    formData.append("mail", mail);
    formData.append("city", city);
    formData.append("department", department);
    formData.append(
      "message",
      `Замовлення:\n\n${message}\n\nІм’я: ${name}\nПрізвище: ${surname}\nПо батькові: ${patronymic}\nТелефон: ${phone}\nПошта: ${mail}\nМісто: ${city}\nВідділення: ${department}\nЗагальна сума: ${totalPrice} грн`
    );

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setErrorMessage("Дякуємо! Замовлення прийнято.");
        setShowModal(true);
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
      }
    } catch (error) {
      setErrorMessage("Сталася помилка при відправці замовлення");
      setShowModal(true);
      console.error(error);
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
            type="text"
            placeholder="Прізвище"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="По батькові"
            value={patronymic}
            onChange={(e) => setPatronymic(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="+380XXXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <select value={mail} onChange={(e) => setMail(e.target.value)}>
            <option value="УкрПошта">УкрПошта</option>
            <option value="Нова Пошта">Нова Пошта</option>
          </select>
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
            <button className="button" onClick={closeModal}>
              Закрити
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
