import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className='bg-gray-900 text-white p-4 flex justify-between flex-wrap'>
            <Link to ="/" className='font-bold text-xl'>CryptoDashboard</Link>
            <div className='flex gap-4 mt-2 md:mt-0'>
                <Link to="/" className='hover:underline'>Home</Link>
                <Link to="/watchlist" className='hover:underline'>WatchList</Link>
            </div>
        </nav>
    )
}