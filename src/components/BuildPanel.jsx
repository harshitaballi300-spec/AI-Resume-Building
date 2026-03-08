import { useState } from 'react';
import { Copy, ExternalLink, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';

export default function BuildPanel({ stepId, onArtifactUpload }) {
    const [lovableText, setLovableText] = useState(`Prompt for step ${stepId}...`);
    const [copied, setCopied] = useState(false);
    const [status, setStatus] = useState(null); // 'worked', 'error', 'screenshot'

    const handleCopy = () => {
        navigator.clipboard.writeText(lovableText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleAction = (type) => {
        setStatus(type);
        if (type === 'worked' || type === 'screenshot') {
            onArtifactUpload(type);
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6 bg-white border border-gray-200 rounded-xl shadow-sm h-full overflow-y-auto">
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                    Copy This Into Lovable
                </label>
                <textarea
                    className="w-full h-48 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none resize-none"
                    value={lovableText}
                    onChange={(e) => setLovableText(e.target.value)}
                />
                <button
                    onClick={handleCopy}
                    className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm"
                >
                    {copied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
            </div>

            <a
                href="https://lovable.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-white rounded-lg font-bold transition-all hover:bg-accent/90 shadow-lg shadow-accent/10 group"
            >
                Build in Lovable <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <div className="pt-6 border-t border-gray-100">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">
                    Verify Implementation
                </label>
                <div className="grid grid-cols-1 gap-2">
                    <button
                        onClick={() => handleAction('worked')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-sm font-medium ${status === 'worked' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-200 hover:bg-emerald-50/30'}`}
                    >
                        <CheckCircle className={`w-5 h-5 ${status === 'worked' ? 'text-emerald-500' : 'text-gray-400'}`} />
                        It Worked
                    </button>
                    <button
                        onClick={() => handleAction('error')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-sm font-medium ${status === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-gray-200 text-gray-600 hover:border-red-200 hover:bg-red-50/30'}`}
                    >
                        <AlertCircle className={`w-5 h-5 ${status === 'error' ? 'text-red-500' : 'text-gray-400'}`} />
                        Error / Debug
                    </button>
                    <button
                        onClick={() => handleAction('screenshot')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-sm font-medium ${status === 'screenshot' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-200 hover:bg-indigo-50/30'}`}
                    >
                        <ImageIcon className={`w-5 h-5 ${status === 'screenshot' ? 'text-indigo-500' : 'text-gray-400'}`} />
                        Add Screenshot
                    </button>
                </div>
            </div>
        </div>
    );
}
