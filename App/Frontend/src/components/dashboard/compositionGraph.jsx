import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { studentiService } from '../../services/studentiService';
import Loader from '../common/Loader';

// Registra componenti Chart.js
ChartJS.register(
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const CompositionGraph = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await studentiService.getComposition();
                const labels = response.data.map(item => item.progetto);
                const data = response.data.map(item => item.studenti_corso);
                setChartData({
                    labels,
                    datasets: [ {
                        label: 'Studenti per Progetto',
                        data,
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.8)',
                            'rgba(255, 99, 132, 0.8)',
                            'rgba(255, 206, 86, 0.8)',
                            'rgba(54, 162, 235, 0.8)',
                            'rgba(153, 102, 255, 0.8)',
                            'rgba(255, 159, 64, 0.8)',
                        ],
                        borderColor: '#fff',
                        borderWidth: 2,
                    } ]
                });
            } catch (err) {
                console.error('Errore dettagliato:', err);
                setError(`Errore: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const totale = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentuale = ((context.parsed / totale) * 100).toFixed(1);
                        return `${context.label}: ${context.parsed} studenti (${percentuale}%)`;
                    }
                }
            }
        }
    };

    if (loading) return <Loader />;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!chartData) return null;
    return (
        <div style={{ height: '100%' }}>
            <Pie data={chartData} options={options} />
        </div>
    );
};

export default CompositionGraph;
