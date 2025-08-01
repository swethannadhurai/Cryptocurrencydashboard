import { useEffect, useState, useMemo } from 'react';
import { axiosInstance } from '../util/api';
import { Link } from 'react-router-dom';
import debounce from 'lodash.debounce';

export default function Home() {
    const [coins, setCoins] = useState([]);
    const [filteredCoins, setFilteredCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [watchlist, setWatchlist] = useState(() => JSON.parse(localStorage.getItem('watchlist')) || []);

    useEffect(() => {
        axiosInstance.get('/coins/markets', {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 50,
                page: 1,
        
            },
        }).then(res => {
            setCoins(res.data);
            setFilteredCoins(res.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const debounceFilter = useMemo(() => debounce((value) => {
        const filtered = coins.filter(coin => coin.name.toLowerCase().includes(value.toLowerCase()) || coin.symbol.toLowerCase().includes(value.toLowerCase()));
        setFilteredCoins(filtered);

    }, 300), [coins]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        debounceFilter(value);
    };

    const toggleWatchlist = (id) => {
        const updatedWatchlist = watchlist.includes(id)
            ? watchlist.filter(item => item !== id)
            : [...watchlist, id];

        setWatchlist(updatedWatchlist);
        localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
    };


    return (
        <div className="p-4">
            <h1 className="text-2xl text-center font-semibold mb-4">Top 50 cryptocurrencies</h1>
            <input type='text' placeholder="Search coins.." value={search} onChange={handleSearch} className="mb-4 p-2 w-full border rounded" />
            {loading ? (
                <div className='space-y-2'>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className='bg-gray-200 h-6 rounded animate-pulse'></div>

                    ))}
                </div>
            ) : (
                <div className='overflow-x-auto'>
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-gray-100">
                            <tr className="border-b">
                                <th>#</th>
                                <th>Coin</th>
                                <th>Price</th>
                                <th>24h %</th>
                                <th>Market Cap</th>
                                <th>Volume</th>
                                <th>star⭐</th>
                            </tr>
                        </thead>
                        <tbody>

                            {filteredCoins.map((coin, i) => (
                                <tr key={coin.id} className="border-b hover:bg-gray-50">
                                    <td>{i + 1}</td>
                                    <td className='flex items-center gap-2 py-2'>
                                        <img src={coin.image} alt={coin.name} className="w-5 h-5" />
                                        <Link to={`/coin/${coin.id}`} className="text-blue-600 hover:underline">
                                            {coin.name} ({coin.symbol.toUpperCase()})
                                        </Link>
                                    </td>
                                    <td>
                                        ${coin.current_price.toLocaleString()}
                                    </td>
                                    <td className={`py-2 ${coin.price_change_percentage_24h < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        {coin.price_change_percentage_24h?.toFixed(2)}%
                                    </td>
                                    <td>
                                        ${coin.market_cap.toLocaleString()}
                                    </td>
                                    <td>
                                        ${coin.total_volume.toLocaleString()}
                                    </td>
                                    <td>
                                        <button onClick={() => toggleWatchlist(coin.id)}>
                                            {watchlist.includes(coin.id) ? '★' : '☆'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            )}
        </div>
    );
}
















































