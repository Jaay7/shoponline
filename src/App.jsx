import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Profile from "./components/user/Profile";
import Cart from "./components/user/Cart";
import Orders from "./components/user/Orders";
import SavedProducts from "./components/user/SavedProducts";
import Checkout from "./components/user/Checkout";
import NotFound from "./components/utils/NotFound";
import OrderScreen from "./components/user/OrderScreen";
import { useQuery, gql } from "@apollo/client";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminHome from "./components/admin/AdminHome";
import AdminCheckOrders from "./components/admin/AdminCheckOrders";
import AdminManageProducts from "./components/admin/AdminManageProducts";
import AddNewProduct from "./components/admin/AddNewProduct";
import AdminOrderView from "./components/admin/AdminOrderView";

const get_user_data = gql`
  query {
    me {
      id
      username
      email
      userType
    }
  }
`;

function App() {
  const { data, loading } = useQuery(get_user_data, {
    context: {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    },
    pollInterval: 500,
  });

  return (
    <div>
      <BrowserRouter>
        <Routes>
          {data && data.me.userType === "admin" ? (
            <>
              <Route path="/" element={<AdminDashboard />}>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<AdminHome />} />
                <Route path="/orders" element={<AdminCheckOrders />} />
                <Route path="/products" element={<AdminManageProducts />} />
                <Route path="/add-product" element={<AddNewProduct />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/order/:orderId" element={<AdminOrderView />} />
              </Route>
            </>
          ) : (
            <>
              <Route path="/" element={<Dashboard />}>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/saved-products" element={<SavedProducts />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/my-orders" element={<Orders />} />
              </Route>
              <Route path="/order/:orderId" element={<OrderScreen />} />
            </>
          )}
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
