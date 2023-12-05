import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Profile from "./components/user/Profile";
import Cart from "./components/user/Cart";
import Orders from "./components/user/Orders";
import SavedProducts from "./components/user/SavedProducts";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/saved-products" element={<SavedProducts />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/my-orders" element={<Orders />} />
          </Route>
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
