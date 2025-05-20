// filepath: c:\Users\top\Desktop\UWAYO_David_National_Practice_Exam_2025\frontend-project\src\App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateAccount from './component/createAccount';
import Login from './component/login';
import View from './component/view';
import AddCar from './component/addcar';


function App() {
  return (
    <>
     <AddCar/>
    <Router>
      <Routes>
    <Route path="/register" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} /> 
    
      </Routes>
    </Router>
    </>
  );
}

export default App;