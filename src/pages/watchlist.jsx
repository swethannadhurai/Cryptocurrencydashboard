import {useEffect, useState} from 'react';
import {axiosInstance} from '../util/api';
import {Link} from 'react-router-dom';

export default function Watchlist() {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [watchlist, setWatchlist] = useState(() => JSON.parse(localStorage.getItem('watchlist')) || []);

    useEffect(() => {
        if (watchlist.length === 0) {
            setCoins([])
            setLoading(false);
            return;
        }

        axiosInstance.get('/coins/markets', {
            params: {
                vs_currency: 'usd',
                ids: watchlist.join(','),
                
            },
        }).then(res => {
            setCoins(res.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [watchlist]);


    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">Your Watchlist</h1>
            {loading ? <p>Loading..</p> : coins.length===0?(
                <p>No coins in the watchlist..</p>
            ):(
                <table className='w-full text-left text-sm'>
                    <thead>
                        <tr className='border-b'>
                            <th>#</th>
                            <th>Coin</th>
                            <th>Current Price</th>
                            <th>24h %</th>
                            <th>Market Cap</th>
                            <th>Volume</th>
                        
                        </tr>
                    </thead>
                    <tbody>
                        {coins.map(coin =>(
                            <tr key={coin.id} className='border-b hover:bg-gray-50'>
                                <td className='flex items-center gap-2 py-2'>
                                    <img src={coin.image} alt={coin.name} className="w-5 h-5" />
                                    <Link to={`/coin/${coin.id}`} className="text-blue-600 hover:underline">
                                        {coin.name} ({coin.symbol.toUpperCase()})
                                    </Link>
                                </td>
                                <td>${coin.current_price.toLocaleString()} </td>
                                <td className={coin.price_change_percentage_24h < 0 ? 'text-red-500' : 'text-green-500'}>
                                    {coin.price_change_percentage_24h?.toFixed(2)}%
                                    </td>
                                <td>${coin.market_cap.toLocaleString()}</td>
                                <td>${coin.total_volume.toLocaleString()}</td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
             )}
        </div>
    );

}