import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ArrowLeft, AlertCircle } from 'lucide-react';

const COST_THRESHOLD = 500;

export default function PrescriptionForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [formData, setFormData] = useState({
    medicine_name: '',
    dosage: '',
    frequency: '',
    monthly_cost: '',
    disease_type: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'monthly_cost') {
      const cost = parseFloat(value);
      setShowWarning(cost > COST_THRESHOLD);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('prescriptions')
        .insert({
          user_id: user?.id,
          medicine_name: formData.medicine_name,
          dosage: formData.dosage,
          frequency: formData.frequency,
          monthly_cost: parseFloat(formData.monthly_cost),
          disease_type: formData.disease_type,
        })
        .select()
        .single();

      if (error) throw error;

      if (parseFloat(formData.monthly_cost) > COST_THRESHOLD) {
        await supabase.from('alerts').insert({
          user_id: user?.id,
          alert_type: 'high_cost',
          message: `High cost prescription added: ${formData.medicine_name} - $${formData.monthly_cost}/month`,
        });
      }

      const { data: allPrescriptions } = await supabase
        .from('prescriptions')
        .select('monthly_cost')
        .eq('user_id', user?.id);

      if (allPrescriptions) {
        const totalMonthlyCost = allPrescriptions.reduce((sum, p) => sum + Number(p.monthly_cost), 0);

        const monthlyData = [];
        let currentCost = totalMonthlyCost;
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        for (let i = 0; i < 12; i++) {
          const growthFactor = 1 + (Math.random() * 0.1 - 0.05);
          const seasonalAdjustment = 1 + (Math.sin(i / 2) * 0.05);
          currentCost = currentCost * growthFactor * seasonalAdjustment;
          monthlyData.push({
            month: months[i],
            amount: parseFloat(currentCost.toFixed(2))
          });
        }

        const annualCost = monthlyData.reduce((sum, m) => sum + m.amount, 0);
        const monthlyEMI = annualCost / 12;

        await supabase.from('cost_predictions').insert({
          user_id: user?.id,
          annual_cost: annualCost,
          monthly_emi: monthlyEMI,
          prediction_data: { monthly_breakdown: monthlyData }
        });

        navigate('/cost-prediction', { state: { annualCost, monthlyEMI, monthlyData } });
      }
    } catch (error) {
      console.error('Error saving prescription:', error);
      alert('Failed to save prescription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Add Prescription</h2>
          <p className="text-gray-600 mb-8">Enter your prescription details to track costs</p>

          {showWarning && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-semibold text-orange-900">High Cost Warning</p>
                <p className="text-sm text-orange-700 mt-1">
                  This prescription exceeds ${COST_THRESHOLD}/month. Consider discussing alternatives with your healthcare provider.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medicine Name
              </label>
              <input
                type="text"
                name="medicine_name"
                value={formData.medicine_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Metformin"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dosage
                </label>
                <input
                  type="text"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 500mg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select frequency</option>
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="As needed">As needed</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Cost ($)
                </label>
                <input
                  type="number"
                  name="monthly_cost"
                  value={formData.monthly_cost}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disease Type
                </label>
                <select
                  name="disease_type"
                  value={formData.disease_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select disease type</option>
                  <option value="Diabetes">Diabetes</option>
                  <option value="Hypertension">Hypertension</option>
                  <option value="Heart Disease">Heart Disease</option>
                  <option value="Asthma">Asthma</option>
                  <option value="Arthritis">Arthritis</option>
                  <option value="Mental Health">Mental Health</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Prescription'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Cost Pre-check:</strong> If your monthly cost exceeds ${COST_THRESHOLD}, we'll show a warning and create an alert for you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
