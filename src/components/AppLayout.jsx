import { Link, useLocation } from 'react-router-dom';

export default function AppLayout({ children }) {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-bg flex flex-col font-sans text-primary-text">
            {/* Top Nav */}
            <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <Link to="/" className="text-xl font-black tracking-tight text-gray-900">
                        AI Resume <span className="text-accent">Builder</span>
                    </Link>
                </div>
                <nav className="flex items-center gap-8">
                    <Link to="/builder" className={`text-sm font-bold uppercase tracking-widest transition-colors ${location.pathname === '/builder' ? 'text-accent' : 'text-gray-500 hover:text-gray-900'}`}>Builder</Link>
                    <Link to="/preview" className={`text-sm font-bold uppercase tracking-widest transition-colors ${location.pathname === '/preview' ? 'text-accent' : 'text-gray-500 hover:text-gray-900'}`}>Preview</Link>
                    <Link to="/proof" className={`text-sm font-bold uppercase tracking-widest transition-colors ${location.pathname === '/proof' ? 'text-accent' : 'text-gray-500 hover:text-gray-900'}`}>Proof</Link>
                </nav>
            </header>

            <main className="flex-1 flex flex-col">
                {children}
            </main>
        </div>
    );
}
