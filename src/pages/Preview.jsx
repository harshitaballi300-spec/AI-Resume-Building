import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { Download, Copy, CheckCircle2, AlertTriangle } from 'lucide-react';

const DEFAULT_DATA = {
    personalInfo: { name: '', email: '', phone: '', location: '' },
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: '',
    links: { github: '', linkedin: '' }
};

export default function Preview() {
    const [resumeData, setResumeData] = useState(() => {
        const saved = localStorage.getItem('resumeBuilderData');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { return DEFAULT_DATA; }
        }
        return DEFAULT_DATA;
    });

    const [template, setTemplate] = useState(() => {
        return localStorage.getItem('resumeTemplateChoice') || 'classic';
    });

    const [copied, setCopied] = useState(false);

    // Allow changing templates globally directly from the Preview page as well
    const handleTemplateChange = (newTemp) => {
        setTemplate(newTemp);
        localStorage.setItem('resumeTemplateChoice', newTemp);
    };

    const hasData = resumeData.personalInfo.name || resumeData.summary || resumeData.experience.length > 0 || resumeData.education.length > 0 || resumeData.projects.length > 0 || resumeData.skills;
    const isMissingDataForWarning = !resumeData.personalInfo.name || (resumeData.projects.length === 0 && resumeData.experience.length === 0);

    const handlePrint = () => {
        window.print();
    };

    const handleCopyText = () => {
        let text = `${resumeData.personalInfo.name || 'Your Name'}\n`;
        let contacts = [resumeData.personalInfo.email, resumeData.personalInfo.phone, resumeData.personalInfo.location].filter(Boolean).join(' • ');
        if (contacts) text += `${contacts}\n`;
        let links = [resumeData.links.github, resumeData.links.linkedin].filter(Boolean).join(' • ');
        if (links) text += `${links}\n`;
        text += `\n`;

        if (resumeData.summary.trim()) {
            text += `PROFESSIONAL SUMMARY\n${resumeData.summary}\n\n`;
        }

        if (resumeData.experience.length > 0) {
            text += `EXPERIENCE\n`;
            resumeData.experience.forEach(exp => {
                if (exp.role || exp.company || exp.description) {
                    text += `${exp.role || ''} | ${exp.company || ''} | ${exp.period || ''}\n${exp.description || ''}\n\n`;
                }
            });
        }

        if (resumeData.projects.length > 0) {
            text += `PROJECTS\n`;
            resumeData.projects.forEach(proj => {
                if (proj.name || proj.description) {
                    text += `${proj.name || ''}\n${proj.description || ''}\n\n`;
                }
            });
        }

        if (resumeData.education.length > 0) {
            text += `EDUCATION\n`;
            resumeData.education.forEach(edu => {
                if (edu.institution || edu.degree) {
                    text += `${edu.institution || ''} | ${edu.degree || ''} | ${edu.year || ''}\n\n`;
                }
            });
        }

        if (resumeData.skills.trim()) {
            text += `SKILLS\n${resumeData.skills.split(',').map(s => s.trim()).filter(Boolean).join(' • ')}\n`;
        }

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Layout configuration variables for templates
    const isClassic = template === 'classic';
    const isModern = template === 'modern';
    const isMinimal = template === 'minimal';

    const getHeaderClass = () => {
        if (isClassic) return "text-center mb-10 border-b-2 border-black pb-8";
        if (isModern) return "flex justify-between items-end mb-10 border-b-4 border-black pb-8 text-left";
        return "text-left mb-10 pb-4"; // minimal
    };

    const getNameClass = () => {
        if (isClassic) return "text-5xl font-serif font-black tracking-tight mb-3 uppercase break-words align-middle";
        if (isModern) return "text-6xl font-sans font-black tracking-tighter mb-2 uppercase text-black break-words max-w-[60%]";
        return "text-5xl font-sans font-bold tracking-tight mb-4 text-black";
    };

    const getContactClass = () => {
        if (isClassic) return "text-sm font-medium tracking-wide";
        if (isModern) return "text-[13px] font-bold tracking-wider text-right flex flex-col items-end gap-1.5";
        return "text-sm font-medium text-gray-800 tracking-wide leading-relaxed";
    };

    const getSectionHeaderClass = () => {
        if (isClassic) return "text-sm font-black uppercase tracking-widest mb-4 border-b-2 border-black pb-1 font-serif";
        if (isModern) return "text-sm font-black uppercase tracking-widest mb-5 border-b-2 border-gray-300 text-gray-900 pb-2 w-full font-sans";
        return "text-sm font-bold uppercase tracking-widest mb-4 mt-4 font-sans text-black";
    };

    return (
        <AppLayout>
            <div className="flex flex-col items-center justify-start bg-gray-100 min-h-[calc(100vh-65px)] py-12 px-4 shadow-inner relative print:bg-white print:py-0 print:px-0 print:shadow-none">

                {/* Control Panel */}
                <div className="w-full max-w-[850px] mb-6 print-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm gap-4">
                        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto">
                            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 whitespace-nowrap hidden md:block">Format</h2>
                            <div className="bg-gray-50 p-1 rounded-lg border border-gray-200 inline-flex flex-1 md:flex-none">
                                <button onClick={() => handleTemplateChange('classic')} className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold uppercase tracking-widest rounded transition-all ${isClassic ? 'bg-gray-900 text-white shadow' : 'text-gray-500 hover:text-gray-900'}`}>Classic</button>
                                <button onClick={() => handleTemplateChange('modern')} className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold uppercase tracking-widest rounded transition-all ${isModern ? 'bg-gray-900 text-white shadow' : 'text-gray-500 hover:text-gray-900'}`}>Modern</button>
                                <button onClick={() => handleTemplateChange('minimal')} className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold uppercase tracking-widest rounded transition-all ${isMinimal ? 'bg-gray-900 text-white shadow' : 'text-gray-500 hover:text-gray-900'}`}>Minimal</button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button onClick={handleCopyText} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-800 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors hover:bg-gray-50 hover:border-gray-300 shadow-sm">
                                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Copied' : 'Copy Text'}
                            </button>
                            <button onClick={handlePrint} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 text-white border border-gray-900 text-xs font-bold uppercase tracking-widest rounded-lg transition-all hover:bg-black hover:shadow-lg hover:shadow-gray-900/20">
                                <Download className="w-4 h-4" /> Print / Save PDF
                            </button>
                        </div>
                    </div>

                    {isMissingDataForWarning && hasData && (
                        <div className="mt-4 flex items-center gap-3 bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm font-medium">Your resume may look incomplete. Consider adding your name and at least one project or experience entry.</p>
                        </div>
                    )}
                </div>

                {hasData ? (
                    <div className="print-visible print:border-none print:-m-12 w-full max-w-[850px] bg-white lg:shadow-2xl shadow-black/10 p-16 md:p-20 border border-gray-200 min-h-[1100px] transition-all">
                        {/* Clean resume layout - Premium typography, minimal black + white layout, no colors */}
                        <div className={`w-full h-full text-black flex flex-col ${isClassic ? 'font-serif' : 'font-sans'}`}>
                            <header className={getHeaderClass()}>
                                <h1 className={getNameClass()}>{resumeData.personalInfo.name || 'Your Name'}</h1>
                                <div className={getContactClass()}>
                                    {isModern ? (
                                        <>
                                            {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                                            {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
                                            {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
                                            {resumeData.links.github && <span>{resumeData.links.github}</span>}
                                            {resumeData.links.linkedin && <span>{resumeData.links.linkedin}</span>}
                                        </>
                                    ) : (
                                        <p>
                                            {[resumeData.personalInfo.email, resumeData.personalInfo.phone, resumeData.personalInfo.location].filter(Boolean).join(' • ')}
                                            {([resumeData.personalInfo.email, resumeData.personalInfo.phone, resumeData.personalInfo.location].filter(Boolean).length > 0 && (resumeData.links.github || resumeData.links.linkedin)) && <br />}
                                            {[resumeData.links.github, resumeData.links.linkedin].filter(Boolean).join(' • ')}
                                        </p>
                                    )}
                                </div>
                            </header>

                            <div className="font-sans">
                                {resumeData.summary.trim() && (
                                    <section className="mb-10">
                                        <h2 className={getSectionHeaderClass()}>Professional Summary</h2>
                                        <p className="text-[15px] leading-relaxed text-gray-900">{resumeData.summary}</p>
                                    </section>
                                )}

                                {resumeData.experience.some(e => e.role || e.company || e.description) && (
                                    <section className="mb-10 shrink-0">
                                        <h2 className={getSectionHeaderClass()}>Experience</h2>
                                        {resumeData.experience.filter(e => e.role || e.company || e.description).map((exp, i) => (
                                            <div key={i} className="mb-6 page-break-avoid">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h3 className={`font-bold text-base ${isMinimal ? 'font-sans text-black tracking-tight' : ''}`}>{exp.role}</h3>
                                                    <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap ml-4">{exp.period}</span>
                                                </div>
                                                <p className={`text-[15px] mb-3 ${isMinimal ? 'text-gray-500 font-medium' : 'font-bold italic text-gray-800'}`}>{exp.company}</p>
                                                <p className="text-[15px] leading-relaxed text-gray-900 whitespace-pre-wrap">{exp.description}</p>
                                            </div>
                                        ))}
                                    </section>
                                )}

                                {resumeData.projects.some(p => p.name || p.description) && (
                                    <section className="mb-10 shrink-0">
                                        <h2 className={getSectionHeaderClass()}>Projects</h2>
                                        {resumeData.projects.filter(p => p.name || p.description).map((proj, i) => (
                                            <div key={i} className="mb-6 page-break-avoid">
                                                <h3 className={`font-bold text-base mb-1 ${isMinimal ? 'font-sans text-black tracking-tight' : ''}`}>{proj.name}</h3>
                                                <p className="text-[15px] leading-relaxed text-gray-900 whitespace-pre-wrap">{proj.description}</p>
                                            </div>
                                        ))}
                                    </section>
                                )}

                                {resumeData.education.some(e => e.institution || e.degree) && (
                                    <section className="mb-10 shrink-0">
                                        <h2 className={getSectionHeaderClass()}>Education</h2>
                                        {resumeData.education.filter(e => e.institution || e.degree).map((edu, i) => (
                                            <div key={i} className="mb-4 page-break-avoid">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h3 className={`font-bold text-base ${isMinimal ? 'font-sans text-black tracking-tight' : ''}`}>{edu.institution}</h3>
                                                    <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap ml-4">{edu.year}</span>
                                                </div>
                                                <p className={`text-[15px] ${isMinimal ? 'text-gray-500 font-medium' : 'font-bold italic text-gray-800'}`}>{edu.degree}</p>
                                            </div>
                                        ))}
                                    </section>
                                )}

                                {resumeData.skills.trim() && (
                                    <section className="mb-10 shrink-0">
                                        <h2 className={getSectionHeaderClass()}>Skills</h2>
                                        <p className="text-[15px] leading-relaxed text-gray-900">
                                            {resumeData.skills.split(',').map(s => s.trim()).filter(Boolean).join(isModern ? '  |  ' : ' • ')}
                                        </p>
                                    </section>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="print-hidden flex flex-col items-center justify-center p-20 opacity-50 bg-white border border-gray-200 mt-10 rounded-2xl w-full max-w-2xl">
                        <div className="w-24 h-24 mb-6 border-4 border-dashed border-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-200 text-3xl">▤</span>
                        </div>
                        <h3 className="text-2xl font-black text-gray-400 font-sans tracking-tight mb-2 uppercase">Empty Draft</h3>
                        <p className="text-base font-sans mt-1 text-gray-400 max-w-[300px] text-center font-medium">Head back to the builder to input your details. They will show up here automatically.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
