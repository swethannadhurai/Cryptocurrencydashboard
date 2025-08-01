import { useParams }  from "react-router-dom";
import { useEffect, useState } from "react"; 
import {axiosInstance} from '../util/api';
import {Line} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function CoinDetail() {
    const {id} = useParams();
    const [coin, setCoin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        axiosInstance.get(`/coins/${id}`).then(res => {
            setCoin(res.data);
        });

        axiosInstance.get(`/coins/${id}/market_chart`, {
            params: {
                vs_currency: 'usd',
                days: '30',
                
            }
        }).then(res => {
            const prices = res.data.prices.map(price =>  price[1]);
            const labels = res.data.prices.map(price => new Date(price[0]).toLocaleDateString());
            setChartData({
                labels,
                datasets: [{
                    label: 'Price (USD)',
                    data: prices,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            });
            setLoading(false);
        }).catch(() => setLoading(false));
    },[id]);

    if(loading) {
        return <div className="p-4">Loading...</div>;
    }
    if(!coin) {
        return <div className="p-4">Coin not found..</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">{coin.name} ({coin.symbol.toUpperCase()})</h1>
            <div className="grid gap-2 mb-6">
                <p><strong>Current Price: </strong> ${coin.market_data.current_price.usd.toLocaleString()}</p>
                <p><strong>Market Cap: </strong> ${coin.market_data.market_cap.usd.toLocaleString()}</p>
                <p><strong>24h Volume: </strong> ${coin.market_data.total_volume.usd.toLocaleString()}</p>
                <p><strong>Rank:</strong> #{coin.market_cap_rank}</p>
                <p><strong>Circulating Supply: </strong> {coin.market_data.circulating_supply.toLocaleString()}</p>
                <p><strong>Total Supply: </strong> {coin.market_data.total_supply ? coin.market_data.total_supply.toLocaleString(): 'N/A'}</p>
            </div>

            {chartData && <Line data={chartData} />}
        </div>
    );

}