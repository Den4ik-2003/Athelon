import { useEffect, useState, useRef } from "react";
import "./stats.css";

export default function Stats() {
  const stats = [
    { value: 2500, label: "Проданих футболок" },
    { value: 350, label: "Задоволених клієнтів" },
    { value: 12, label: "Роки досвіду" },
    { value: 99, label: "Позитивних відгуків", suffix: "%" },
  ];

  const sectionRef = useRef(null);
  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCount(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
  }, []);

  return (
    <section className="stats" ref={sectionRef}>
      {stats.map((s, i) => (
        <Counter key={i} {...s} start={startCount} />
      ))}
    </section>
  );
}

function Counter({ value, label, suffix = "", start }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startNum = 0;
    const duration = 1500;
    const stepTime = 20;
    const increment = value / (duration / stepTime);

    const timer = setInterval(() => {
      startNum += increment;
      if (startNum >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(startNum));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [start, value]);

  return (
    <div className="stat-card">
      <span>
        {count}
        {suffix}
      </span>
      <p>{label}</p>
    </div>
  );
}
