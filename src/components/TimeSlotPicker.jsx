import React from 'react';

const TimeSlotPicker = ({ selectedTime, onTimeSelect }) => {
    const timeSlots = [
        '09:00', '10:00', '11:00', '12:00',
        '14:00', '15:00', '16:00', '17:00'
    ];

    return (
        <div className="time-picker-container">
            <h3>Select a Time</h3>
            <div className="time-grid">
                {timeSlots.map((time) => (
                    <button
                        key={time}
                        className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                        onClick={() => onTimeSelect(time)}
                    >
                        {time}
                    </button>
                ))}
            </div>
            <style>{`
        .time-picker-container {
          margin-bottom: 2rem;
          animation: fadeIn 0.5s ease-out;
        }
        .time-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 1rem;
        }
        .time-slot {
          padding: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid transparent;
          border-radius: 8px;
          color: var(--color-text-main);
          transition: all 0.2s;
        }
        .time-slot:hover {
          border-color: var(--color-primary);
          background: rgba(139, 92, 246, 0.1);
        }
        .time-slot.selected {
          background: var(--color-primary);
          color: white;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default TimeSlotPicker;
