import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import FileUploadScreen from './pages/FileUploadScreen';
import Home from './pages/Home';
import { gql, useQuery } from '@apollo/client';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import SavedProducts from './pages/SavedProducts';
import MyCart from './pages/MyCart';
import MyOrders from './pages/MyOrders';
import AdminOrdersScreen from './pages/AdminOrdersScreen';

const get_auth_user = gql`
  query Query {
    me {
      id
      email
      userType
    }
  }
`;

const App = () => {
  const { data, loading, error } = useQuery(get_auth_user, {
    context: {
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    }
  });
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {
            loading ? console.log("loading") :
            error ? console.log(error.message) :
            data && <>
            <Route path="/profile" element={<Profile />} />
            <Route path="/saved" element={<SavedProducts />} />
            <Route path="/cart" element={<MyCart />} />
            <Route path="/orders" element={<MyOrders />} />
            {data.me.userType === 'admin' ?
            <>
              <Route path="/file-upload" element={<FileUploadScreen />} /> 
              <Route path="/received-orders" element={<AdminOrdersScreen />} />
            </>
              : <></>
            }</>
          }
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
