import React from 'react';

const Calendar = ({ selectedDate, onDateSelect }) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(currentYear, currentMonth, i);
        const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
        const isPast = date < new Date(today.setHours(0, 0, 0, 0));

        days.push(
            <button
                key={i}
                className={`calendar-day ${isSelected ? 'selected' : ''} ${isPast ? 'disabled' : ''}`}
                onClick={() => !isPast && onDateSelect(date)}
                disabled={isPast}
            >
                {i}
            </button>
        );
    }

    return (
        <div className="calendar-container">
            <h3>Select a Date</h3>
            <div className="calendar-grid">
                <div className="day-label">Su</div>
                <div className="day-label">Mo</div>
                <div className="day-label">Tu</div>
                <div className="day-label">We</div>
                <div className="day-label">Th</div>
                <div className="day-label">Fr</div>
                <div className="day-label">Sa</div>
                {days}
            </div>
            <style>{`
        .calendar-container {
          margin-bottom: 2rem;
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
          margin-top: 1rem;
        }
        .day-label {
          text-align: center;
          font-size: 0.875rem;
          color: var(--color-text-muted);
          font-weight: 600;
        }
        .calendar-day {
          aspect-ratio: 1;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          color: var(--color-text-main);
          font-weight: 500;
          transition: all 0.2s;
        }
        .calendar-day:hover:not(.disabled) {
          background: rgba(255, 255, 255, 0.1);
        }
        .calendar-day.selected {
          background: var(--color-primary);
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.5);
        }
        .calendar-day.disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
      `}</style>
        </div>
    );
};

export default Calendar;
