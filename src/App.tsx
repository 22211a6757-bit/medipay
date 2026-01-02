import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrescriptionForm from './pages/PrescriptionForm';
import CostPrediction from './pages/CostPrediction';
import PaymentPlan from './pages/PaymentPlan';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/prescriptions/new" element={<PrescriptionForm />} />
          <Route path="/cost-prediction" element={<CostPrediction />} />
          <Route path="/payment-plan" element={<PaymentPlan />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
