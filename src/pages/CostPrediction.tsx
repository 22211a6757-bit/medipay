import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, TrendingUp, DollarSign, Calendar, AlertCircle } from 'lucide-react';

interface PredictionData {
  annualCost: number;
  monthlyEMI: number;
  monthlyData: Array<{ month: string; amount: number }>;
}

export default function CostPrediction() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (location.state) {
      setPrediction(location.state as PredictionData);
      setLoading(false);
    } else {
      loadPrediction();
    }
  }, [user, location.state, navigate]);

  const loadPrediction = async () => {
    try {
      const { data, error } = await supabase
        .from('cost_predictions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPrediction({
          annualCost: data.annual_cost,
          monthlyEMI: data.monthly_emi,
          monthlyData: data.prediction_data.monthly_breakdown || []
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading prediction:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading prediction...</div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <p className="text-gray-600">No cost prediction available. Add prescriptions first.</p>
            <button
              onClick={() => navigate('/prescriptions/new')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Prescription
            </button>
          </div>
        </div>
      </div>
    );
  }

  const affordabilityRisk = prediction.monthlyEMI > 300;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Annual Cost Prediction</h2>
          <p className="text-gray-600 mt-2">AI-driven prediction based on your current prescriptions</p>
        </div>

        {affordabilityRisk && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 text-lg">Affordability Risk Detected</h3>
              <p className="text-red-700 mt-1">
                Your monthly EMI of ${prediction.monthlyEMI.toFixed(2)} may be challenging. Consider discussing cost-reduction strategies with your healthcare provider.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Annual Predicted Cost</p>
                <p className="text-2xl font-bold text-gray-900">${prediction.annualCost.toFixed(2)}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Based on growth factors and seasonal trends</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly EMI</p>
                <p className="text-2xl font-bold text-gray-900">${prediction.monthlyEMI.toFixed(2)}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Equal monthly installments over 12 months</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Savings Needed</p>
                <p className="text-2xl font-bold text-gray-900">${(prediction.annualCost * 0.2).toFixed(2)}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Recommended emergency fund (20%)</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">12-Month Cost Projection</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={prediction.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ fill: '#2563eb', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Prediction Methodology</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
              <p><strong>Growth Factor Analysis:</strong> Applied variable growth rates (±5%) to account for price fluctuations</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
              <p><strong>Seasonal Adjustment:</strong> Incorporated seasonal patterns that may affect medication availability and pricing</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
              <p><strong>AI-Based Prediction:</strong> Used machine learning patterns to project future costs based on historical data</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => navigate('/payment-plan')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View Payment Plan
          </button>
          <button
            onClick={() => navigate('/prescriptions/new')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Add More Prescriptions
          </button>
        </div>
      </div>
    </div>
  );
}
