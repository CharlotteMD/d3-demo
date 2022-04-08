import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css';
import StepOne from './containers/stepOne';
import Home from './containers/home';

function App() {
  return (
    <div className="App">
      <h1>D3 demo</h1>
      <Router>
        <Routes>
            <Route path="/step-one" element={<StepOne/>}/>
            <Route path="/" element={<Home/>}/>
          </Routes>
      </Router>
    </div>
  );
}

export default App;
