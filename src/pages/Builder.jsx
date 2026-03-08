import { useState, useEffect, useMemo } from 'react';
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

export default function Builder() {
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

    useEffect(() => {
        localStorage.setItem('resumeBuilderData', JSON.stringify(resumeData));
    }, [resumeData]);

    const loadSampleData = () => {
        setResumeData({
            personalInfo: { name: 'Harshita Developer', email: 'harshita@example.com', phone: '+91 98765 43210', location: 'Bangalore, India' },
            summary: 'A highly motivated Software Engineer with experience building scalable web applications. Passionate about creating premium, user-centric experiences and solving complex technical challenges efficiently while delivering continuous results and deploying robust architectural patterns in fast-paced software development environments globally.',
            education: [{ institution: 'Institute of Technology', degree: 'B.Tech in Computer Science', year: '2020-2024' }],
            experience: [
                { company: 'Tech Corp', role: 'Frontend Engineer', period: '2024-Present', description: 'Led the frontend team in rebuilding the core platform, resulting in a 40% performance increase and 20k new active users.' },
                { company: 'Startup Inc', role: 'Software Intern', period: '2023-2024', description: 'Developed full-stack web features and optimized API response times.' }
            ],
            projects: [
                { name: 'KodNest Premium Hub', description: 'Built an integrated placement and resume building platform with dynamic data rendering and seamless user experience.' },
                { name: 'Algorithm Visualizer', description: 'Interactive web app demonstrating sorting algorithms for educational purposes.' }
            ],
            skills: 'JavaScript, React, Node.js, Next.js, PostgreSQL, TailwindCSS, TypeScript, Redis',
            links: { github: 'github.com/harshitaballi300-spec', linkedin: 'linkedin.com/in/harshita' }
        });
    };

    const updatePersonalInfo = (field, value) => {
        setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));
    };

    const updateLinks = (field, value) => {
        setResumeData(prev => ({ ...prev, links: { ...prev.links, [field]: value } }));
    };

    const handleAddList = (listName, template) => {
        setResumeData(prev => ({ ...prev, [listName]: [...prev[listName], template] }));
    };

    const handleUpdateList = (listName, index, field, value) => {
        setResumeData(prev => {
            const newList = [...prev[listName]];
            newList[index] = { ...newList[index], [field]: value };
            return { ...prev, [listName]: newList };
        });
    };

    const handleRemoveList = (listName, index) => {
        setResumeData(prev => {
            const newList = [...prev[listName]];
            newList.splice(index, 1);
            return { ...prev, [listName]: newList };
        });
    };

    // ATS Scoring Logic
    const atsEvaluation = useMemo(() => {
        let score = 20; // Base score
        let suggestions = [];

        // Summary 40-120 words
        const summaryWords = resumeData.summary.trim().split(/\s+/).filter(w => w.length > 0).length;
        if (summaryWords >= 40 && summaryWords <= 120) {
            score += 15;
        } else {
            suggestions.push("Write a stronger summary (40–120 words).");
        }

        // At least 2 projects
        if (resumeData.projects.length >= 2) {
            score += 10;
        } else {
            suggestions.push("Add at least 2 projects.");
        }

        // At least 1 experience
        if (resumeData.experience.length >= 1) {
            score += 10;
        } else {
            suggestions.push("Add at least 1 experience entry.");
        }

        // Skills list >= 8 items
        const skillsCount = resumeData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0).length;
        if (skillsCount >= 8) {
            score += 10;
        } else {
            suggestions.push("Add more skills (target 8+).");
        }

        // GitHub or LinkedIn link
        if (resumeData.links.github.trim() !== '' || resumeData.links.linkedin.trim() !== '') {
            score += 10;
        } else {
            suggestions.push("Add your GitHub or LinkedIn profile link.");
        }

        // Number in any exp/proj description
        const hasNumber = [...resumeData.experience, ...resumeData.projects].some(item => /\d/.test(item.description));
        if (hasNumber) {
            score += 15;
        } else {
            suggestions.push("Add measurable impact (numbers/metrics) in descriptions.");
        }

        // Education has complete fields (at least one valid entry)
        const hasCompleteEdu = resumeData.education.length > 0 && resumeData.education.some(e => e.institution.trim() !== '' && e.degree.trim() !== '' && e.year.trim() !== '');
        if (hasCompleteEdu) {
            score += 10;
        } else {
            suggestions.push("Complete your education details.");
        }

        return {
            score: Math.min(score, 100),
            suggestions: suggestions.slice(0, 3) // Max 3 suggestions
        };
    }, [resumeData]);

    const hasData = resumeData.personalInfo.name || resumeData.summary || resumeData.experience.length > 0 || resumeData.education.length > 0 || resumeData.projects.length > 0 || resumeData.skills;

    return (
        <AppLayout>
            <div className="flex flex-1 overflow-hidden h-[calc(100vh-65px)]">
                {/* Left Column: Form (50%) */}
                <div className="w-1/2 overflow-y-auto p-10 border-r border-gray-200 bg-white relative">
                    <div className="flex justify-between items-end mb-8 pb-6 border-b border-gray-100">
                        <div>
                            <h2 className="text-3xl font-serif font-black text-gray-900 tracking-tight mb-2">Editor</h2>
                            <p className="text-gray-500 font-medium tracking-wide text-sm">Input your professional details below. Autosaved securely.</p>
                        </div>
                        <button onClick={loadSampleData} className="button-secondary text-xs font-bold uppercase tracking-widest px-4 py-2 border-2 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors bg-white text-gray-900 border-gray-200 shadow-sm rounded-lg">
                            Load Sample Data
                        </button>
                    </div>

                    {/* ATS Scoring Panel */}
                    <div className="mb-10 bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">ATS Readiness Score</h3>
                            <div className="flex items-center gap-3">
                                <div className="text-3xl font-black tracking-tighter" style={{ color: atsEvaluation.score >= 80 ? '#10B981' : atsEvaluation.score >= 50 ? '#F59E0B' : '#EF4444' }}>
                                    {atsEvaluation.score}
                                </div>
                                <div className="text-gray-400 text-sm font-bold mt-1">/ 100</div>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6 overflow-hidden">
                            <div className="h-2.5 rounded-full transition-all duration-500" style={{ width: `${atsEvaluation.score}%`, backgroundColor: atsEvaluation.score >= 80 ? '#10B981' : atsEvaluation.score >= 50 ? '#F59E0B' : '#EF4444' }}></div>
                        </div>

                        {atsEvaluation.suggestions.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Priority Suggestions ({atsEvaluation.suggestions.length})</p>
                                {atsEvaluation.suggestions.map((sug, i) => (
                                    <div key={i} className="flex items-start gap-2 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                                        <p className="text-sm font-medium text-gray-700">{sug}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        {atsEvaluation.score === 100 && (
                            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 p-3 rounded-lg border border-emerald-100">
                                <p className="text-sm font-bold">Perfect score! Your resume is highly optimized for ATS.</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-10">
                        {/* Personal Info */}
                        <section>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 pl-1">Personal Info</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Full Name" className="input bg-white font-medium shadow-sm" value={resumeData.personalInfo.name} onChange={(e) => updatePersonalInfo('name', e.target.value)} />
                                <input type="email" placeholder="Email Address" className="input bg-white font-medium shadow-sm" value={resumeData.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} />
                                <input type="tel" placeholder="Phone Number" className="input bg-white font-medium shadow-sm" value={resumeData.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} />
                                <input type="text" placeholder="Location" className="input bg-white font-medium shadow-sm" value={resumeData.personalInfo.location} onChange={(e) => updatePersonalInfo('location', e.target.value)} />
                            </div>
                        </section>

                        {/* Summary */}
                        <section>
                            <div className="flex justify-between items-center mb-4 pl-1 pr-1">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Professional Summary</h3>
                                <div className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">{resumeData.summary.trim().split(/\s+/).filter(w => w.length > 0).length} words</div>
                            </div>
                            <textarea placeholder="Write a compelling summary..." className="input bg-white font-medium shadow-sm h-32 resize-none leading-relaxed" value={resumeData.summary} onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))} />
                        </section>

                        {/* Experience */}
                        <section>
                            <div className="flex justify-between items-center mb-4 pl-1 pr-1">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Experience</h3>
                                <button onClick={() => handleAddList('experience', { company: '', role: '', period: '', description: '' })} className="text-xs font-black text-accent hover:text-red-900 transition-colors">+ Add Entry</button>
                            </div>

                            <div className="space-y-4">
                                {resumeData.experience.map((exp, i) => (
                                    <div key={i} className="p-5 bg-gray-50 border border-gray-200 rounded-xl relative group">
                                        <button onClick={() => handleRemoveList('experience', i)} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100">✕</button>
                                        <div className="grid grid-cols-2 gap-3 mb-3">
                                            <input type="text" placeholder="Job Title" className="input bg-white text-sm" value={exp.role} onChange={(e) => handleUpdateList('experience', i, 'role', e.target.value)} />
                                            <input type="text" placeholder="Company Name" className="input bg-white text-sm" value={exp.company} onChange={(e) => handleUpdateList('experience', i, 'company', e.target.value)} />
                                        </div>
                                        <input type="text" placeholder="Time Period (e.g. 2021-Present)" className="input bg-white text-sm mb-3" value={exp.period} onChange={(e) => handleUpdateList('experience', i, 'period', e.target.value)} />
                                        <textarea placeholder="Description & Achievements..." className="input bg-white text-sm h-24 resize-none" value={exp.description} onChange={(e) => handleUpdateList('experience', i, 'description', e.target.value)} />
                                    </div>
                                ))}
                                {resumeData.experience.length === 0 && (
                                    <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-center text-gray-400 text-sm font-bold cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleAddList('experience', { company: '', role: '', period: '', description: '' })}>
                                        Click '+ Add Entry' to add experience.
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Projects */}
                        <section>
                            <div className="flex justify-between items-center mb-4 pl-1 pr-1">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Projects</h3>
                                <button onClick={() => handleAddList('projects', { name: '', description: '' })} className="text-xs font-black text-accent hover:text-red-900 transition-colors">+ Add Entry</button>
                            </div>
                            <div className="space-y-4">
                                {resumeData.projects.map((proj, i) => (
                                    <div key={i} className="p-5 bg-gray-50 border border-gray-200 rounded-xl relative group">
                                        <button onClick={() => handleRemoveList('projects', i)} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100">✕</button>
                                        <input type="text" placeholder="Project Name" className="input bg-white text-sm mb-3" value={proj.name} onChange={(e) => handleUpdateList('projects', i, 'name', e.target.value)} />
                                        <textarea placeholder="Project Description..." className="input bg-white text-sm h-20 resize-none" value={proj.description} onChange={(e) => handleUpdateList('projects', i, 'description', e.target.value)} />
                                    </div>
                                ))}
                                {resumeData.projects.length === 0 && (
                                    <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-center text-gray-400 text-sm font-bold cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleAddList('projects', { name: '', description: '' })}>
                                        Click '+ Add Entry' to add projects.
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Education */}
                        <section>
                            <div className="flex justify-between items-center mb-4 pl-1 pr-1">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Education</h3>
                                <button onClick={() => handleAddList('education', { institution: '', degree: '', year: '' })} className="text-xs font-black text-accent hover:text-red-900 transition-colors">+ Add Entry</button>
                            </div>
                            <div className="space-y-4">
                                {resumeData.education.map((edu, i) => (
                                    <div key={i} className="p-5 bg-gray-50 border border-gray-200 rounded-xl relative group">
                                        <button onClick={() => handleRemoveList('education', i)} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100">✕</button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                            <input type="text" placeholder="Institution Name" className="input bg-white text-sm" value={edu.institution} onChange={(e) => handleUpdateList('education', i, 'institution', e.target.value)} />
                                            <input type="text" placeholder="Degree / Certification" className="input bg-white text-sm" value={edu.degree} onChange={(e) => handleUpdateList('education', i, 'degree', e.target.value)} />
                                        </div>
                                        <input type="text" placeholder="Year (e.g. 2020-2024)" className="input bg-white text-sm" value={edu.year} onChange={(e) => handleUpdateList('education', i, 'year', e.target.value)} />
                                    </div>
                                ))}
                                {resumeData.education.length === 0 && (
                                    <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-center text-gray-400 text-sm font-bold cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleAddList('education', { institution: '', degree: '', year: '' })}>
                                        Click '+ Add Entry' to add education.
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Skills */}
                        <section>
                            <div className="flex justify-between items-center mb-4 pl-1 pr-1">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Skills</h3>
                                <div className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">{resumeData.skills.split(',').filter(s => s.trim().length > 0).length} items</div>
                            </div>
                            <input type="text" placeholder="e.g. React, Node.js, Python (comma separated)" className="input bg-white font-medium shadow-sm" value={resumeData.skills} onChange={(e) => setResumeData(prev => ({ ...prev, skills: e.target.value }))} />
                        </section>

                        {/* Links */}
                        <section>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 pl-1">Links</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="GitHub URL" className="input bg-white font-medium shadow-sm" value={resumeData.links.github} onChange={(e) => updateLinks('github', e.target.value)} />
                                <input type="text" placeholder="LinkedIn URL" className="input bg-white font-medium shadow-sm" value={resumeData.links.linkedin} onChange={(e) => updateLinks('linkedin', e.target.value)} />
                            </div>
                        </section>
                    </div>

                    {/* Extra padding buffer */}
                    <div className="h-20"></div>
                </div>

                {/* Right Column: Live Preview Panel (50%) */}
                <div className="w-1/2 overflow-y-auto p-10 xl:p-14 bg-gray-100 flex justify-center items-start border-l border-gray-200">
                    <div className="w-full max-w-[800px] aspect-[1/1.414] bg-white shadow-2xl p-10 lg:p-14 flex flex-col items-center justify-start text-gray-300 font-serif border border-gray-200 transition-all duration-300 relative overflow-hidden">
                        {hasData ? (
                            <div className="w-full h-full text-black font-sans leading-relaxed flex flex-col scale-[0.95] origin-top">
                                {/* Header */}
                                <header className="text-center mb-6 border-b-2 border-black pb-6">
                                    <h1 className="text-3xl font-serif font-black tracking-tight mb-2 uppercase break-words align-middle">{resumeData.personalInfo.name || 'Your Name'}</h1>
                                    <p className="text-xs font-medium tracking-wide">
                                        {[resumeData.personalInfo.email, resumeData.personalInfo.phone, resumeData.personalInfo.location].filter(Boolean).join(' • ')}
                                        {([resumeData.personalInfo.email, resumeData.personalInfo.phone, resumeData.personalInfo.location].filter(Boolean).length > 0 && (resumeData.links.github || resumeData.links.linkedin)) && <br />}
                                        {[resumeData.links.github, resumeData.links.linkedin].filter(Boolean).join(' • ')}
                                    </p>
                                </header>

                                {/* Summary */}
                                {resumeData.summary.trim() && (
                                    <section className="mb-5">
                                        <h2 className="text-xs font-black uppercase tracking-widest mb-2 border-b-2 border-black pb-1">Professional Summary</h2>
                                        <p className="text-xs leading-relaxed">{resumeData.summary}</p>
                                    </section>
                                )}

                                {/* Experience */}
                                {resumeData.experience.some(e => e.role || e.company || e.description) && (
                                    <section className="mb-5">
                                        <h2 className="text-xs font-black uppercase tracking-widest mb-2 border-b-2 border-black pb-1">Experience</h2>
                                        {resumeData.experience.filter(e => e.role || e.company || e.description).map((exp, i) => (
                                            <div key={i} className="mb-3">
                                                <div className="flex justify-between items-baseline mb-0.5">
                                                    <h3 className="font-bold text-[13px]">{exp.role}</h3>
                                                    <span className="text-[11px] font-bold uppercase tracking-wider whitespace-nowrap ml-4">{exp.period}</span>
                                                </div>
                                                <p className="text-xs font-bold italic text-gray-800 mb-1">{exp.company}</p>
                                                <p className="text-[11.5px] leading-relaxed break-words">{exp.description}</p>
                                            </div>
                                        ))}
                                    </section>
                                )}

                                {/* Projects */}
                                {resumeData.projects.some(p => p.name || p.description) && (
                                    <section className="mb-5">
                                        <h2 className="text-xs font-black uppercase tracking-widest mb-2 border-b-2 border-black pb-1">Projects</h2>
                                        {resumeData.projects.filter(p => p.name || p.description).map((proj, i) => (
                                            <div key={i} className="mb-2">
                                                <h3 className="font-bold text-[13px] mb-0.5">{proj.name}</h3>
                                                <p className="text-[11.5px] leading-relaxed break-words">{proj.description}</p>
                                            </div>
                                        ))}
                                    </section>
                                )}

                                {/* Education */}
                                {resumeData.education.some(e => e.institution || e.degree) && (
                                    <section className="mb-5">
                                        <h2 className="text-xs font-black uppercase tracking-widest mb-2 border-b-2 border-black pb-1">Education</h2>
                                        {resumeData.education.filter(e => e.institution || e.degree).map((edu, i) => (
                                            <div key={i} className="mb-2">
                                                <div className="flex justify-between items-baseline mb-0.5">
                                                    <h3 className="font-bold text-[13px]">{edu.institution}</h3>
                                                    <span className="text-[11px] font-bold uppercase tracking-wider whitespace-nowrap ml-4">{edu.year}</span>
                                                </div>
                                                <p className="text-xs font-medium italic text-gray-800">{edu.degree}</p>
                                            </div>
                                        ))}
                                    </section>
                                )}

                                {/* Skills */}
                                {resumeData.skills.trim() && (
                                    <section className="mb-5">
                                        <h2 className="text-xs font-black uppercase tracking-widest mb-2 border-b-2 border-black pb-1">Skills</h2>
                                        <p className="text-xs font-medium leading-relaxed">{
                                            resumeData.skills.split(',').map(s => s.trim()).filter(Boolean).join(' • ')
                                        }</p>
                                    </section>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full opacity-60">
                                <div className="w-20 h-20 mb-6 border-4 border-dashed border-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-gray-200 text-2xl">▤</span>
                                </div>
                                <h3 className="text-xl font-black text-gray-300 font-sans tracking-tight mb-2 uppercase">Empty Canvas</h3>
                                <p className="text-sm font-sans mt-1 text-gray-300 max-w-[200px] text-center font-medium">Auto-save is active. Start typing to visualize your layout.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
