import React, { useState } from 'react';

const BookingForm = ({ onSubmit, onBack }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="booking-form-container">
            <h3>Your Details</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                    />
                </div>
                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                    />
                </div>
                <div className="form-group">
                    <label>Notes (Optional)</label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Any special requests?"
                        rows={3}
                    />
                </div>
                <div className="button-group">
                    <button type="button" className="btn-secondary" onClick={onBack}>
                        Back
                    </button>
                    <button type="submit" className="btn-primary">
                        Confirm Booking
                    </button>
                </div>
            </form>
            <style>{`
        .booking-form-container {
          animation: fadeIn 0.5s ease-out;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: var(--color-text-muted);
        }
        .button-group {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }
        .btn-secondary {
          background: transparent;
          border: 1px solid var(--color-border);
          color: var(--color-text-muted);
          padding: 12px 24px;
          border-radius: var(--radius-md);
          flex: 1;
          transition: all 0.2s;
        }
        .btn-secondary:hover {
          border-color: var(--color-text-main);
          color: var(--color-text-main);
        }
      `}</style>
        </div>
    );
};

export default BookingForm;
