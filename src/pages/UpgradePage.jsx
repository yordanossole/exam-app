import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentApi } from '../services/api';
import { useAppContext } from '../context/AppContext';
import './UpgradePage.css';

export default function UpgradePage() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { state } = useAppContext();

    useEffect(() => {
        // In a real app, plans might be fetched from a public endpoint
        // For now, mocking or fetching if available
        const fetchPlans = async () => {
            try {
                // Mocking plans if API fails or not yet exposed
                const mockPlans = [
                    { id: 'p1', name: 'Standard', price: 99, duration_days: 30, description: '30 days access to all exams' },
                    { id: 'p2', name: 'Premium', price: 250, duration_days: 90, description: '90 days access to all exams' },
                    { id: 'p3', name: 'Annual', price: 800, duration_days: 365, description: 'Full year access' },
                ];
                setPlans(mockPlans);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch plans', err);
            }
        };
        fetchPlans();
    }, []);

    const handleSelectPlan = (plan) => {
        navigate('/payment', { state: { plan } });
    };

    return (
        <div className="upgrade-container">
            <header className="upgrade-header">
                <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                <h1>Upgrade Your Plan</h1>
            </header>

            <div className="upgrade-content">
                <p className="upgrade-subtitle">Get full access to all past exams and detailed statistics.</p>

                {loading ? (
                    <div className="loader">Loading plans...</div>
                ) : (
                    <div className="plans-grid">
                        {plans.map(plan => (
                            <div key={plan.id} className="plan-card">
                                <h3>{plan.name}</h3>
                                <div className="plan-price">
                                    <span className="currency">ETB</span>
                                    <span className="amount">{plan.price}</span>
                                </div>
                                <p className="plan-duration">{plan.duration_days} Days</p>
                                <p className="plan-desc">{plan.description}</p>
                                <button
                                    className="select-plan-btn"
                                    onClick={() => handleSelectPlan(plan)}
                                >
                                    Choose Plan
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
