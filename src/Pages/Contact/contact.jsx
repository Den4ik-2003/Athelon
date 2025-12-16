import { useState } from "react";
import { ethers } from "ethers"; 
import "./contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

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

    if (!window.ethereum) {
      alert("Встановіть MetaMask!");
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const message = `Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`;
      const signature = await signer.signMessage(message);

      console.log("Підписане повідомлення:", message);
      console.log("Signature:", signature);

      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      alert("Сталася помилка при підписі повідомлення.");
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
        {submitted && <p className="form-success">Дякуємо! Ваше повідомлення підписано.</p>}
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Ваше ім'я"
            value={formData.name}
            onChange={handleChange}
            required
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
          />
          <button type="submit">Відправити</button>
        </form>
      </div>
    </div>
  );
}
