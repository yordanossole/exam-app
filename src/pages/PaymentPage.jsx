import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { paymentApi } from '../services/api';
import './PaymentPage.css';

export default function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const plan = location.state?.plan;

    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    if (!plan) {
        return <div className="error-msg">No plan selected.</div>;
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return alert('Please upload payment proof');

        setLoading(true);
        try {
            // 1. Submit payment record
            const res = await paymentApi.submitPayment({
                plan_id: plan.id,
                amount_etb: plan.price
            });

            const paymentId = res.data.id || res.data.data.id;

            // 2. Upload proof
            await paymentApi.uploadProof(paymentId, file);

            setSubmitted(true);
        } catch (err) {
            console.error('Payment failed', err);
            alert('Error submitting payment proof. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="payment-success">
                <div className="success-icon">✓</div>
                <h1>Payment Submitted!</h1>
                <p>Our team is reviewing your payment. Your subscription will be activated shortly.</p>
                <button className="home-btn" onClick={() => navigate('/')}>Back to Home</button>
            </div>
        );
    }

    return (
        <div className="payment-container">
            <header className="payment-header">
                <button className="back-btn" onClick={() => navigate(-1)}>←</button>
                <h1>Complete Payment</h1>
            </header>

            <div className="payment-content">
                <div className="bank-info">
                    <h3>Bank Transfer Details</h3>
                    <p>Transfer <strong>ETB {plan.price}</strong> to:</p>
                    <div className="account-details">
                        <p><strong>Bank:</strong> CBE (Commercial Bank of Ethiopia)</p>
                        <p><strong>Account Name:</strong> Exam Platform LLC</p>
                        <p><strong>Account Number:</strong> 1000123456789</p>
                    </div>
                </div>

                <form className="payment-form" onSubmit={handleSubmit}>
                    <h3>Upload Proof of Payment</h3>
                    <p className="form-help">Upload a screenshot of the transfer confirmation.</p>

                    <div className="file-upload">
                        <input
                            type="file"
                            id="proof"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                        />
                        <label htmlFor="proof">
                            {file ? file.name : "Tap to choose file"}
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="submit-payment-btn"
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit Proof"}
                    </button>
                </form>
            </div>
        </div>
    );
}
