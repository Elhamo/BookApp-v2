import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import DoctorApp from './components/DoctorApp.jsx'
import HomePage from './components/HomePage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/eislaufen" element={<App />} />
        <Route path="/arzt" element={<DoctorApp />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
