import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App'; // Import the useAuth hook

function AuthPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form states
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [registerData, setRegisterData] = useState({
        name: '',
        username: '',
        email: '',
        password: ''
    });

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(loginData.email, loginData.password);

        if (result.success) {
            navigate('/chat');
        } else {
            setError(result.message || 'Login failed');
        }
        setLoading(false);
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await register(
            registerData.name,
            registerData.username,
            registerData.email,
            registerData.password
        );

        if (result.success) {
            navigate('/chat');
        } else {
            setError(result.message || 'Registration failed');
        }
        setLoading(false);
    };

    const handleLoginChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegisterChange = (e) => {
        setRegisterData({
            ...registerData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="w-full h-screen flex items-center justify-center bg-cover bg-center bg-gray-950" style={{ backgroundImage: "url('/Guardian.jpg')" }}>
            <div className="relative w-[700px] h-[500px] bg-gray-900 shadow-2xl rounded-xl overflow-hidden transition-all duration-300 ease-in-out">

                {/* Error message */}
                {error && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Sliding panel with sunset-toned gradient */}
                <div className={`absolute top-0 h-full w-1/2 bg-gradient-to-tr from-yellow-900 via-orange-800 to-amber-700 text-white flex flex-col items-center justify-center transition-all duration-300 ease-in-out z-20 ${isRegister ? 'translate-x-full' : 'translate-x-0'}`}>
                    <h2 className="text-3xl font-bold mb-4 font-serif text-amber-200">{isRegister ? 'Not yet a guildmate?' : 'One of us?'}</h2>
                    <p className="mb-6 text-sm italic text-amber-100">{isRegister ? 'Swear your oath!' : 'Take your place!'}</p>
                    <button
                        onClick={() => {
                            setIsRegister(!isRegister);
                            setError('');
                        }}
                        className="px-6 py-2 bg-gray-200 text-amber-800 font-semibold rounded-full shadow-md transition-all duration-300 hover:bg-gray-300"
                        disabled={loading}
                    >
                        {isRegister ? 'Register' : 'Login'}
                    </button>
                </div>

                {/* Login Form */}
                <div className={`absolute top-0 left-0 w-1/2 h-full px-8 py-10 transition-opacity duration-300 ease-in-out z-10 ${isRegister ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <h2 className="text-2xl font-bold mb-6 text-amber-300 font-serif">Welcome Back! Adventurer</h2>
                    <form onSubmit={handleLoginSubmit}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={loginData.email}
                            onChange={handleLoginChange}
                            required
                            disabled={loading}
                            className="w-full mb-4 p-2 border border-amber-600 rounded bg-gray-800 text-white placeholder-amber-400 disabled:opacity-50"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            required
                            disabled={loading}
                            className="w-full mb-6 p-2 border border-amber-600 rounded bg-gray-800 text-white placeholder-amber-400 disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-yellow-900 to-orange-800 text-white py-2 rounded hover:from-yellow-800 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>

                {/* Register Form */}
                <div className={`absolute top-0 right-0 w-1/2 h-full px-8 py-6 transition-opacity duration-300 ease-in-out z-10 ${isRegister ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <h2 className="text-2xl font-bold mb-4 text-amber-300 font-serif">Register for the Quest</h2>
                    <form onSubmit={handleRegisterSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={registerData.name}
                            onChange={handleRegisterChange}
                            required
                            disabled={loading}
                            className="w-full mb-3 p-2 border border-amber-600 rounded bg-gray-800 text-white placeholder-amber-400 disabled:opacity-50"
                        />
                        <input
                            type="text"
                            name="username"
                            placeholder="Username (for chat)"
                            value={registerData.username}
                            onChange={handleRegisterChange}
                            required
                            disabled={loading}
                            className="w-full mb-3 p-2 border border-amber-600 rounded bg-gray-800 text-white placeholder-amber-400 disabled:opacity-50"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={registerData.email}
                            onChange={handleRegisterChange}
                            required
                            disabled={loading}
                            className="w-full mb-3 p-2 border border-amber-600 rounded bg-gray-800 text-white placeholder-amber-400 disabled:opacity-50"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={registerData.password}
                            onChange={handleRegisterChange}
                            required
                            disabled={loading}
                            className="w-full mb-4 p-2 border border-amber-600 rounded bg-gray-800 text-white placeholder-amber-400 disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-yellow-900 to-orange-800 text-white py-2 rounded hover:from-yellow-800 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default AuthPage;