import { useState } from "react";
import "./contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const contacts = [
    { type: "Instagram", value: "@athelon.store" },
    { type: "Електронна пошта", value: "athelonstore@gmail.com" },
    { type: "Графік роботи", value: "Пн-Пт 9:00 - 18:00" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "a9274740-ad3b-4138-b4ee-d800da84ddda",
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        setError("Сталася помилка при відправці форми.");
      }
    } catch (err) {
      console.error(err);
      setError("Сталася помилка при відправці форми.");
    }
  };

  return (
    <div className="container">
      <h1 className="contact-title">Зв'яжіться з нами</h1>

      <div className="contact-info">
        {contacts.map((item, index) => (
          <div key={index} className="contact-item">
            <h3 className="contact-type">{item.type}</h3>
            <p className="contact-value">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="contact-form-section">
        <h2>Напишіть нам повідомлення</h2>

        {error && <p className="form-error">{error}</p>}

        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Ваше ім'я"
            value={formData.name}
            onChange={handleChange}
            required
            pattern=".{2,}"
            title="Мінімум 2 символи"
          />

          <input
            type="email"
            name="email"
            placeholder="Ваш email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Ваше повідомлення"
            value={formData.message}
            onChange={handleChange}
            required
            pattern=".{5,}"
            title="Мінімум 5 символів"
          />

          <button type="submit">Відправити</button>
        </form>
      </div>

      {submitted && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Дякуємо!</h3>
            <p>Ваше повідомлення успішно надіслано.</p>
            <button
              className="button"
              onClick={() => setSubmitted(false)}
            >
              Закрити
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
