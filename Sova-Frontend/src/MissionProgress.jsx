import { useState, useEffect } from 'react';
import axios from 'axios';

const MissionProgress = () => {
    const [stats, setStats] = useState({
        totalDonation: 0,
        totalFarmersReached: 0,
        totalContributions: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND}/api/get-stats`); // Replace with your API endpoint
                setStats({
                    totalDonation: response.data.totalDonation,
                    totalFarmersReached: response.data.totalFarmersReached,
                    totalContributions: response.data.totalContributions,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, []); // Empty dependency array ensures this runs once on mount

    return (
        <div className="container-scroll">
            <h1>Sova Mission Progress</h1>
            <div className="indicator-section" id="indicatorSection">
                <div className="indicator-card" id="donationsCard">
                    <div className="indicator-logo">
                        <i className="fas fa-donate"></i>
                    </div>
                    <h2 id="donations">INR {stats.totalDonation}</h2>
                    <p>Total Contributions</p>
                </div>
                <div className="indicator-card" id="farmersCard">
                    <div className="indicator-logo">
                        <i className="fas fa-users"></i>
                    </div>
                    <h2 id="farmers">{stats.totalFarmersReached}</h2>
                    <p>Farmers Reached</p>
                </div>
                <div className="indicator-card" id="supportersCard">
                    <div className="indicator-logo">
                        <i className="fas fa-handshake"></i>
                    </div>
                    <h2 id="supporters">{stats.totalContributions}</h2>
                    <p>People Cooperated</p>
                </div>
            </div>
        </div>
    );
};

export default MissionProgress;