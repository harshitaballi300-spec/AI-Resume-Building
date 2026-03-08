import { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';

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
            try {
                return JSON.parse(saved);
            } catch (e) {
                return DEFAULT_DATA;
            }
        }
        return DEFAULT_DATA;
    });

    const hasData = resumeData.personalInfo.name || resumeData.summary || resumeData.experience.length > 0 || resumeData.education.length > 0 || resumeData.projects.length > 0 || resumeData.skills;

    return (
        <AppLayout>
            <div className="flex flex-col items-center justify-start bg-gray-100 min-h-[calc(100vh-65px)] py-12 px-4 shadow-inner">
                {hasData ? (
                    <div className="w-full max-w-[850px] bg-white shadow-2xl shadow-black/10 p-16 md:p-20 border border-gray-200 min-h-[1100px]">
                        {/* Clean resume layout - Premium typography, minimal black + white layout, no colors */}
                        <div className="w-full h-full text-black font-sans">
                            <header className="text-center mb-10 border-b-2 border-black pb-8">
                                <h1 className="text-5xl font-serif font-black tracking-tight mb-3 uppercase">{resumeData.personalInfo.name || 'Your Name'}</h1>
                                <p className="text-sm font-medium tracking-wide">
                                    {[resumeData.personalInfo.email, resumeData.personalInfo.phone, resumeData.personalInfo.location].filter(Boolean).join(' • ')}
                                    {([resumeData.personalInfo.email, resumeData.personalInfo.phone, resumeData.personalInfo.location].filter(Boolean).length > 0 && (resumeData.links.github || resumeData.links.linkedin)) && <br />}
                                    {[resumeData.links.github, resumeData.links.linkedin].filter(Boolean).join(' • ')}
                                </p>
                            </header>

                            {resumeData.summary.trim() && (
                                <section className="mb-10">
                                    <h2 className="text-sm font-black uppercase tracking-widest mb-4 border-b-2 border-black pb-1">Professional Summary</h2>
                                    <p className="text-[15px] leading-relaxed text-gray-900">{resumeData.summary}</p>
                                </section>
                            )}

                            {resumeData.experience.some(e => e.role || e.company || e.description) && (
                                <section className="mb-10">
                                    <h2 className="text-sm font-black uppercase tracking-widest mb-4 border-b-2 border-black pb-1">Experience</h2>
                                    {resumeData.experience.filter(e => e.role || e.company || e.description).map((exp, i) => (
                                        <div key={i} className="mb-6">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold text-base">{exp.role}</h3>
                                                <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap ml-4">{exp.period}</span>
                                            </div>
                                            <p className="text-[15px] font-bold italic text-gray-800 mb-3">{exp.company}</p>
                                            <p className="text-[15px] leading-relaxed text-gray-900 whitespace-pre-wrap">{exp.description}</p>
                                        </div>
                                    ))}
                                </section>
                            )}

                            {resumeData.projects.some(p => p.name || p.description) && (
                                <section className="mb-10">
                                    <h2 className="text-sm font-black uppercase tracking-widest mb-4 border-b-2 border-black pb-1">Projects</h2>
                                    {resumeData.projects.filter(p => p.name || p.description).map((proj, i) => (
                                        <div key={i} className="mb-6">
                                            <h3 className="font-bold text-base mb-1">{proj.name}</h3>
                                            <p className="text-[15px] leading-relaxed text-gray-900 whitespace-pre-wrap">{proj.description}</p>
                                        </div>
                                    ))}
                                </section>
                            )}

                            {resumeData.education.some(e => e.institution || e.degree) && (
                                <section className="mb-10">
                                    <h2 className="text-sm font-black uppercase tracking-widest mb-4 border-b-2 border-black pb-1">Education</h2>
                                    {resumeData.education.filter(e => e.institution || e.degree).map((edu, i) => (
                                        <div key={i} className="mb-6">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className="font-bold text-base">{edu.institution}</h3>
                                                <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap ml-4">{edu.year}</span>
                                            </div>
                                            <p className="text-[15px] font-bold italic text-gray-800">{edu.degree}</p>
                                        </div>
                                    ))}
                                </section>
                            )}

                            {resumeData.skills.trim() && (
                                <section className="mb-10">
                                    <h2 className="text-sm font-black uppercase tracking-widest mb-4 border-b-2 border-black pb-1">Skills</h2>
                                    <p className="text-[15px] leading-relaxed text-gray-900">
                                        {resumeData.skills.split(',').map(s => s.trim()).filter(Boolean).join(' • ')}
                                    </p>
                                </section>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-20 opacity-50 bg-white border border-gray-200 mt-10 rounded-2xl w-full max-w-2xl">
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
