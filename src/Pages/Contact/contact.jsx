import { useState } from "react";
import { Helmet } from "react-helmet-async";
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
    { type: "Графік роботи", value: "Пн–Пт, 9:00–18:00" },
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
          access_key: "66339d3f-6627-46ad-840b-d4995661f188",
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        setError("Сталася помилка при відправці форми.");
      }
    } catch (err) {
      console.error(err);
      setError("Сталася помилка при відправці форми.");
    }
  };

  return (
    <div className="contact-page">
      <Helmet>
        <title>Контакти — Athleon | Зв'яжіться з нами</title>
        <meta name="description" content="Зв'яжіться з Athleon — футбольне екіпірування в Україні. Instagram, email athelonstore@gmail.com. Відповімо протягом одного робочого дня." />
        <meta property="og:title" content="Контакти — Athleon" />
        <meta property="og:description" content="Напишіть нам — відповімо протягом одного робочого дня. Instagram @athelon.store, email athelonstore@gmail.com." />
        <meta property="og:url" content="https://athelon.netlify.app/contact" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://athelon.netlify.app/contact" />
      </Helmet>

      <div className="contact-hero">
        <span className="contact-eyebrow">Підтримка</span>
        <h1 className="contact-title">Зв'яжіться з нами</h1>
        <p className="contact-subtitle">
          Відповімо протягом одного робочого дня
        </p>
      </div>

      <div className="contact-grid">
        <aside className="contact-sidebar">
          {contacts.map((item, index) => (
            <div key={index} className="contact-row">
              <p className="contact-row-label">{item.type}</p>
              <p className="contact-row-value">{item.value}</p>
            </div>
          ))}
        </aside>

        <div className="contact-form-wrap">
          <h2 className="form-heading">Напишіть нам</h2>

          {error && <p className="form-error">{error}</p>}

          <form className="contact-form" onSubmit={handleSubmit}>
            <input type="hidden" name="access_key" value="66339d3f-6627-46ad-840b-d4995661f188" />

            <div className="field">
              <label className="field-label" htmlFor="name">Ім'я</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Як до вас звертатись?"
                value={formData.name}
                onChange={handleChange}
                required
                pattern=".{2,}"
                title="Мінімум 2 символи"
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="message">Повідомлення</label>
              <textarea
                id="message"
                name="message"
                placeholder="Розкажіть про ваше питання..."
                value={formData.message}
                onChange={handleChange}
                required
                pattern=".{5,}"
                title="Мінімум 5 символів"
              />
            </div>

            <button type="submit" className="submit-btn">
              <span>Надіслати</span>
            </button>
          </form>
        </div>
      </div>

      {submitted && (
        <div className="modal-overlay" onClick={() => setSubmitted(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p className="modal-mark">Готово</p>
            <h3>Дякуємо!</h3>
            <p>Ваше повідомлення успішно надіслано. Ми відповімо найближчим часом.</p>
            <button className="modal-close-btn" onClick={() => setSubmitted(false)}>
              Закрити
            </button>
          </div>
        </div>
      )}
    </div>
  );
}