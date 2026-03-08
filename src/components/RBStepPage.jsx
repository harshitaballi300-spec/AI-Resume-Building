import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import BuildPanel from '../components/BuildPanel';

export default function RBStepPage({ stepId, title, description, workspaceContent }) {
    const [uploaded, setUploaded] = useState(false);

    useEffect(() => {
        setUploaded(!!localStorage.getItem(`rb_step_${stepId}_artifact`));
    }, [stepId]);

    const handleArtifactUpload = (type) => {
        localStorage.setItem(`rb_step_${stepId}_artifact`, type);
        setUploaded(true);
        // Force re-render of layout by triggering a state change if needed, 
        // but here we just need the next button to enable.
        window.dispatchEvent(new Event('storage'));
    };

    return (
        <Layout currentStep={stepId} title={title} description={description}>
            <div className="flex gap-6 h-full">
                {/* Main Workspace (70%) */}
                <div className="primary-workspace bg-white overflow-hidden rounded-xl border border-gray-200 shadow-sm flex flex-col">
                    <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Workspace</span>
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-100"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-100"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-100"></div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8">
                        {workspaceContent}
                    </div>
                </div>

                {/* Secondary Build Panel (30%) */}
                <div className="secondary-panel">
                    <BuildPanel stepId={stepId} onArtifactUpload={handleArtifactUpload} />
                </div>
            </div>
        </Layout>
    );
}
