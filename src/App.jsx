import React, { useEffect, useState } from "react";
// import Routes from "./routes";
import "./App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DetailsPage from "./pages/DetailsPage";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(prevDarkMode => !prevDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDarkMode);
    document.documentElement.classList.toggle('dark', prefersDarkMode);
  }, []);

  return (
    <Routes>
      <Route path="*" element={<Navigate to={'/'} />}/>
      <Route path="/" element={<HomePage toggleDarkMode={toggleDarkMode} />}/>
      <Route path="/details" element={<DetailsPage toggleDarkMode={toggleDarkMode} />}/>
    </Routes>
  );
}

export default App;
