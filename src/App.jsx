import React, { useState } from 'react';
import AIChat from './components/AIChat';
import Calendar from './components/Calendar';
import TimeSlotPicker from './components/TimeSlotPicker';
import BookingForm from './components/BookingForm';
import NeuralNetworkBackground from './components/NeuralNetworkBackground';

function App() {
  const [currentView, setCurrentView] = useState('chat'); // 'chat' or 'booking'
  const [showBackground, setShowBackground] = useState(true);
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: null,
    time: null,
    details: null
  });

  const steps = [
    { number: 1, label: 'Date' },
    { number: 2, label: 'Time' },
    { number: 3, label: 'Details' },
    { number: 4, label: 'Confirm' }
  ];

  const handleDateSelect = (date) => {
    setBookingData({ ...bookingData, date });
    setStep(2);
  };

  const handleTimeSelect = (time) => {
    setBookingData({ ...bookingData, time });
    setStep(3);
  };

  const handleFormSubmit = (details) => {
    setBookingData({ ...bookingData, details });
    setStep(4);
  };

  const resetBooking = () => {
    setBookingData({ date: null, time: null, details: null });
    setStep(1);
    setCurrentView('chat');
  };

  const startBooking = () => {
    setCurrentView('booking');
    setStep(1);
  };

  const backToChat = () => {
    setCurrentView('chat');
    setStep(1);
  };

  const renderBookingStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="step-container">
            <div className="header">
              <h2>Select a Date</h2>
              <p>Choose the day for your coaching session</p>
            </div>
            <Calendar
              selectedDate={bookingData.date}
              onDateSelect={handleDateSelect}
            />
          </div>
        );
      case 2:
        return (
          <div className="step-container">
            <div className="header">
              <button className="back-link" onClick={() => setStep(1)}>← Back</button>
              <h2>Select Time</h2>
              <p>{bookingData.date?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
            <TimeSlotPicker
              selectedTime={bookingData.time}
              onTimeSelect={handleTimeSelect}
            />
          </div>
        );
      case 3:
        return (
          <div className="step-container">
            <div className="header">
              <h2>Complete Your Details</h2>
              <p>{bookingData.date?.toLocaleDateString('en-US')} at {bookingData.time}</p>
            </div>
            <BookingForm
              onSubmit={handleFormSubmit}
              onBack={() => setStep(2)}
            />
          </div>
        );
      case 4:
        return (
          <div className="success-container">
            <div className="success-icon">✓</div>
            <h2>Session Confirmed!</h2>
            <p>We have sent the confirmation to <strong>{bookingData.details?.email}</strong></p>
            <div className="summary-card">
              <div className="summary-item">
                <span>Date</span>
                <strong>{bookingData.date?.toLocaleDateString('en-US')}</strong>
              </div>
              <div className="summary-item">
                <span>Time</span>
                <strong>{bookingData.time}</strong>
              </div>
              <div className="summary-item">
                <span>Name</span>
                <strong>{bookingData.details?.name}</strong>
              </div>
            </div>
            <button className="btn-primary" onClick={resetBooking}>
              Back to Chat
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-wrapper">
      {showBackground && <NeuralNetworkBackground
        nodeColor="#8b5cf6"
        connectionColor="#6366f1"
        nodeCount={70}
        connectionDistance={150}
        pulseIntensity="strong"
      />}

      <div className={`container ${currentView === 'chat' ? 'chat-mode' : ''}`}>

        {/* Only show Header and Toggle in Booking Mode or if explicitly desired. 
                    User requested pure chat look, so we hide these in chat view. */}
        {currentView !== 'chat' && (
          <>
            {/* Header with Branding */}
            <div className="app-header">
              <div className="logo">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect width="40" height="40" rx="10" fill="url(#gradient)" />
                  <path d="M12 14h16M12 20h16M12 26h10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="28" cy="12" r="6" fill="#10b981" />
                  <path d="M26 12l1.5 1.5L31 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="40" y2="40">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="logo-text">
                  <span className="logo-title">DK Career</span>
                  <span className="logo-subtitle">AI Scheduler</span>
                </div>
              </div>
            </div>

            {/* View Toggle */}
            <div className="view-toggle">
              <button
                className={`toggle-btn ${currentView === 'chat' ? 'active' : ''}`}
                onClick={() => setCurrentView('chat')}
              >
                💬 AI Chat
              </button>
              <button
                className={`toggle-btn ${currentView === 'booking' ? 'active' : ''}`}
                onClick={startBooking}
              >
                📅 Schedule Session
              </button>
            </div>
          </>
        )}

        {/* Progress Indicator (only for booking view) */}
        {currentView === 'booking' && step < 4 && (
          <div className="progress-container">
            {steps.slice(0, 3).map((s, idx) => (
              <div key={s.number} className="progress-step-wrapper">
                <div className={`progress-step ${step >= s.number ? 'active' : ''} ${step > s.number ? 'completed' : ''}`}>
                  {step > s.number ? '✓' : s.number}
                </div>
                <span className="progress-label">{s.label}</span>
                {idx < 2 && <div className={`progress-line ${step > s.number ? 'completed' : ''}`} />}
              </div>
            ))}
          </div>
        )}

        {/* Main Content */}
        <div className="main-content">
          {currentView === 'chat' ? (
            <AIChat
              onBookingRequest={startBooking}
              setShowBackground={setShowBackground}
            />
          ) : (
            <div className="card">
              {renderBookingStep()}
            </div>
          )}
        </div>
      </div>
      <style>{`
        .app-wrapper {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative; /* Context for children */
        }
        /* Increase z-index of container to sit above background */
        .container {
            width: 100%;
            max-width: 600px;
            z-index: 10; 
            position: relative;
        }

        .container.chat-mode {
            /* In chat mode, the AIChat component takes over via fixed positioning, 
               but this container still wraps the logic. 
               We relax max-width constraints so AIChat can expand if needed, 
               although AIChat uses fixed positioning. */
             max-width: none;
             width: 100%;
        }
        
        /* Rest of styles */
        .app-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .logo {
          display: inline-flex;
          align-items: center;
          gap: 16px;
        }
        .logo-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .logo-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--color-text-main);
          line-height: 1;
        }
        .logo-subtitle {
          font-size: 0.875rem;
          color: var(--color-text-muted);
          font-weight: 500;
        }
        .view-toggle {
          display: flex;
          gap: 12px;
          margin-bottom: 2rem;
          background: rgba(255, 255, 255, 0.03);
          padding: 6px;
          border-radius: var(--radius-md);
          border: 1px solid var(--glass-border);
        }
        .toggle-btn {
          flex: 1;
          padding: 12px 20px;
          background: transparent;
          color: var(--color-text-muted);
          border: none;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .toggle-btn:hover {
          color: var(--color-text-main);
          background: rgba(255, 255, 255, 0.05);
        }
        .toggle-btn.active {
          background: var(--color-primary);
          color: white;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }
        .main-content {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .progress-container {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          margin-bottom: 2rem;
          gap: 0;
        }
        .progress-step-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          flex: 1;
          max-width: 120px;
        }
        .progress-step {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: var(--color-text-muted);
          transition: all 0.3s ease;
          position: relative;
          z-index: 2;
        }
        .progress-step.active {
          border-color: var(--color-primary);
          color: var(--color-primary);
          background: rgba(139, 92, 246, 0.1);
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
        }
        .progress-step.completed {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: white;
        }
        .progress-label {
          margin-top: 8px;
          font-size: 0.75rem;
          color: var(--color-text-muted);
          font-weight: 500;
        }
        .progress-line {
          position: absolute;
          top: 20px;
          left: 50%;
          width: 100%;
          height: 2px;
          background: var(--color-border);
          z-index: 1;
          transition: background 0.3s ease;
        }
        .progress-line.completed {
          background: var(--color-primary);
        }
        .header {
          margin-bottom: 2rem;
          text-align: center;
          position: relative;
        }
        .header h2 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .header p {
          color: var(--color-text-muted);
          font-size: 0.9rem;
        }
        .back-link {
          position: absolute;
          left: 0;
          top: 0;
          background: none;
          color: var(--color-text-muted);
          font-size: 0.9rem;
          padding: 0;
        }
        .back-link:hover {
          color: var(--color-primary);
        }
        .success-container {
          text-align: center;
          animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .success-icon {
          width: 64px;
          height: 64px;
          background: var(--color-primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin: 0 auto 1.5rem;
        }
        .summary-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          margin: 2rem 0;
          text-align: left;
        }
        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          font-size: 0.9rem;
        }
        .summary-item:last-child {
          margin-bottom: 0;
        }
        .summary-item span {
          color: var(--color-text-muted);
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default App;
