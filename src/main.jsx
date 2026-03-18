import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'

// StrictMode removed — it double-fires useEffect in dev which permanently
// breaks all GSAP animations that start from opacity:0 or scale:0.9
ReactDOM.createRoot(document.getElementById('root')).render(<App />)