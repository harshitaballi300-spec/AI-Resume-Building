import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';

export default function Home() {
    const navigate = useNavigate();
    return (
        <AppLayout>
            <div className="flex flex-col items-center justify-center flex-1 text-center px-4 bg-bg">
                <h1 className="text-6xl md:text-7xl font-serif font-black text-gray-900 mb-6 tracking-tight">
                    Build a Resume <br /><span className="italic font-light">That Gets Read.</span>
                </h1>
                <p className="text-xl text-gray-500 mb-10 max-w-2xl font-sans font-medium">
                    Create a clean, professional, and optimized resume designed to pass ATS systems and impress recruiters.
                </p>
                <button
                    onClick={() => navigate('/builder')}
                    className="button-primary text-xl font-bold px-10 py-5 shadow-2xl shadow-accent/20 hover:scale-105 transition-transform"
                >
                    Start Building
                </button>
            </div>
        </AppLayout>
    );
}
