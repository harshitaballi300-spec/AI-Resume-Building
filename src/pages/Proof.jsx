import AppLayout from '../components/AppLayout';

export default function Proof() {
    return (
        <AppLayout>
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-65px)] text-center px-4 bg-bg">
                <div className="max-w-xl w-full bg-white border border-gray-200 shadow-xl rounded-2xl p-12">
                    <h1 className="text-4xl font-serif font-black text-gray-900 mb-4 tracking-tight">Proof Details</h1>
                    <p className="text-gray-500 mb-10 font-medium text-lg leading-relaxed">Placeholder for eventual artifacts, ATS scores, and sharing links. Features will be implemented down the line.</p>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="p-10 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest text-sm">
                            Artifact Area Placeholder
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
