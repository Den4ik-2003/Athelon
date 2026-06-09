import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
 
export default function Routing() {
  return (
    <div className="routing">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductInfo />} />
          <Route path="/like" element={<Liked />} />
          <Route path="/cart" element={<Basket />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

