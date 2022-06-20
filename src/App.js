import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import FileUploadScreen from './pages/FileUploadScreen';
import Home from './pages/Home';

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/file-upload" element={<FileUploadScreen />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
