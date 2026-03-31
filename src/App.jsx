import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Registerform from './components/registration';
import authService from './services/authService';

function ProtectedRoute({ children }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Registerform />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
