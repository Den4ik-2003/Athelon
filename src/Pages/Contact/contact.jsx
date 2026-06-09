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
    { type: "Instagram", value: "@athelon.store", icon: "📸" },
    { type: "Електронна пошта", value: "athelonstore@gmail.com", icon: "✉️" },
    { type: "Графік роботи", value: "Пн–Пт, 9:00–18:00", icon: "🕐" },
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
            <div key={index} className="contact-card">
              <span className="contact-card-icon">{item.icon}</span>
              <div>
                <p className="contact-card-label">{item.type}</p>
                <p className="contact-card-value">{item.value}</p>
              </div>
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
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
        </div>
      </div>

      {submitted && (
        <div className="modal-overlay" onClick={() => setSubmitted(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-check">✓</div>
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