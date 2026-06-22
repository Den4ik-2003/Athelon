import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "../Components/Header/header";
import Home from "../Pages/Home/home";
import ProductInfo from "../Pages/ProductInfo/productInfo";
import Products from "../Pages/Products/products";
import Liked from "../Pages/Liked/liked";
import AboutUs from "../Pages/AboutUs/aboutUs";
import Contact from "../Pages/Contact/contact";
import Footer from "../Components/Footer/footer";
import Basket from "../Pages/Basket/basket";
import NotFound from "../Pages/NotFound/notfound";
import Order from "../Pages/Order/order";
import Reviews from "../Pages/Reviews/reviews";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function Routing() {
  return (
    <div className="routing">
      <Router>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/product/:id" element={<ProductInfo />} />
          <Route path="/like" element={<Liked />} />
          <Route path="/cart" element={<Basket />} />
          <Route path="/order" element={<Order />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}