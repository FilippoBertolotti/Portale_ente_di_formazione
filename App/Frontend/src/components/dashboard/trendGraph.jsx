import { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { studentiService } from '../../services/studentiService';
import Loader from '../common/Loader';

// Registra componenti Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const TrendGraph = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Generare ultimi 12 mesi
    const getUltimi12Mesi = () => {
        const nomiMesi = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu',
            'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
        const mesi = [];
        const oggi = new Date();

        for (let i = 11; i >= 0; i--) {
            const data = new Date(oggi.getFullYear(), oggi.getMonth() - i, 1);
            const annoCorrente = data.getFullYear();
            const meseCorrente = data.getMonth(); // 0-11

            mesi.push({
                anno: annoCorrente,
                mese: meseCorrente + 1, // 1-12 per query
                label: `${nomiMesi[meseCorrente]} ${annoCorrente}` // "Gen 2024"
            });
        }

        return mesi;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await studentiService.getTrend();

                const ultimi12Mesi = getUltimi12Mesi();

                // Crea mappa dei dati reali
                const datiReali = new Map();
                response.data.forEach(item => {
                    const chiave = `${item.anno}-${item.mese}`;
                    datiReali.set(chiave, item.totale);
                });

                // Riempi con 0 dove mancano dati
                const labels = ultimi12Mesi.map(m => m.label);
                const valori = ultimi12Mesi.map(m => {
                    const chiave = `${m.anno}-${m.mese}`;
                    return datiReali.get(chiave) || 0; // 0 se non ci sono dati
                });

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Iscrizioni',
                            data: valori,
                            borderColor: '#2B7BB4',
                            backgroundColor: 'rgba(43, 123, 180, 0.1)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4,
                            pointRadius: 6,
                            pointHoverRadius: 8,
                            pointBackgroundColor: '#2B7BB4',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                        }
                    ]
                });

                setError(null);
            } catch (err) {
                console.error('Errore caricamento grafico:', err);
                setError('Impossibile caricare i dati');
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
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 13
                },
                callbacks: {
                    label: function (context) {
                        return `Iscrizioni: ${context.parsed.y}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    font: {
                        size: 12
                    },
                    color: '#777'
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                ticks: {
                    font: {
                        size: 12
                    },
                    color: '#777',
                    maxRotation: 45,
                    minRotation: 45
                },
                grid: {
                    display: false
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[100%] w-[100%]">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-[100%] w-[100%]">
                <p className="text-red-500 text-center">{error}</p>
            </div>
        );
    }

    if (!chartData || chartData.labels.length === 0) {
        return (
            <div className="flex items-center justify-center h-[100%] w-[100%]">
                <p className="text-gray-500 text-center">Nessun dato disponibile</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[30px] p-[1vh] h-[25vh]">
            <Line data={chartData} options={options} />
        </div>
    );
};

export default TrendGraph;
