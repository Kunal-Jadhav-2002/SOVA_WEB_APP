import { useState, useEffect } from 'react';
import axios from 'axios';

const Timer = () => {
    const [targetDate, setTargetDate] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
    });

    useEffect(() => {
        const fetchTargetDate = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/target-date'); // Replace with your API endpoint
                console.log('Fetched target date:', response.data.targetDate);
                setTargetDate(new Date(response.data.targetDate));
            } catch (error) {
                console.error('Error fetching target date:', error);
            }
        };

        fetchTargetDate();
    }, []);

    useEffect(() => {
        if (!targetDate) return;

        const updateTimer = () => {
            const now = new Date();
            const diff = targetDate - now;

            if (diff <= 0) {
                setTimeRemaining({
                    days: '00',
                    hours: '00',
                    minutes: '00',
                    seconds: '00',
                });
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeRemaining({
                days: String(days).padStart(2, '0'),
                hours: String(hours).padStart(2, '0'),
                minutes: String(minutes).padStart(2, '0'),
                seconds: String(seconds).padStart(2, '0'),
            });
        };

        updateTimer();
        const intervalId = setInterval(updateTimer, 1000);

        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, [targetDate]);

    return (
        <div id="timer-container">
            <h2>Mission ends in</h2>
            <div id="timer">
                <div className="time-box">
                    <span id="days">{timeRemaining.days}</span>
                    <div className="label">Days</div>
                </div>
                <div className="time-box">
                    <span id="hours">{timeRemaining.hours}</span>
                    <div className="label">Hours</div>
                </div>
                <div className="time-box">
                    <span id="minutes">{timeRemaining.minutes}</span>
                    <div className="label">Minutes</div>
                </div>
                <div className="time-box">
                    <span id="seconds">{timeRemaining.seconds}</span>
                    <div className="label">Seconds</div>
                </div>
            </div>
        </div>
    );
};

export default Timer;