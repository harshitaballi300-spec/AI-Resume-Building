import { useState, useEffect, useMemo } from 'react';
import AppLayout from '../components/AppLayout';
import { X, Loader2, Sparkles, ChevronDown, ChevronUp, ExternalLink, Github, Plus } from 'lucide-react';

const DEFAULT_DATA = {
    personalInfo: { name: '', email: '', phone: '', location: '' },
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: { technical: [], soft: [], tools: [] },
    links: { github: '', linkedin: '' }
};

const getBulletGuidance = (text) => {
    if (!text || !text.trim()) return [];
    const suggestions = [];
    const hasVerb = /^(Built|Developed|Designed|Implemented|Led|Improved|Created|Optimized|Automated)\b/i.test(text.trim());
    if (!hasVerb) suggestions.push("Start with a strong action verb.");
    const hasNum = /\d|%|k\b|x\b/i.test(text);
    if (!hasNum) suggestions.push("Add measurable impact (numbers).");
    return suggestions;
};

export default function Builder() {
    const [resumeData, setResumeData] = useState(() => {
        const saved = localStorage.getItem('resumeBuilderData');
        if (saved) {
            try {
                let parsed = JSON.parse(saved);
                // Migrate skills if it's the old string format
                if (typeof parsed.skills === 'string') {
                    parsed.skills = {
                        technical: parsed.skills.split(',').map(s => s.trim()).filter(Boolean),
                        soft: [],
                        tools: []
                    };
                }
                if (!parsed.skills) parsed.skills = { technical: [], soft: [], tools: [] };

                // Migrate projects
                if (parsed.projects && Array.isArray(parsed.projects)) {
                    parsed.projects = parsed.projects.map(p => ({
                        ...p,
                        techStack: Array.isArray(p.techStack) ? p.techStack : [],
                        liveUrl: p.liveUrl || '',
                        githubUrl: p.githubUrl || ''
                    }));
                }

                return parsed;
            } catch (e) { return DEFAULT_DATA; }
        }
        return DEFAULT_DATA;
    });

    const [template, setTemplate] = useState(() => {
        return localStorage.getItem('resumeTemplateChoice') || 'classic';
    });

    const [skillInputs, setSkillInputs] = useState({ technical: '', soft: '', tools: '' });
    const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);

    // UI states solely for Accordion toggles
    const [openProjects, setOpenProjects] = useState({});
    const [projectTechInputs, setProjectTechInputs] = useState({});

    useEffect(() => {
        localStorage.setItem('resumeBuilderData', JSON.stringify(resumeData));
    }, [resumeData]);

    useEffect(() => {
        localStorage.setItem('resumeTemplateChoice', template);
    }, [template]);

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
                { name: 'KodNest Premium Hub', description: 'Built an integrated placement and resume building platform with dynamic data rendering and seamless user experience.', techStack: ['React', 'Node.js', 'TailwindCSS'], liveUrl: 'https://demo.com', githubUrl: 'https://github.com' },
                { name: 'Algorithm Visualizer', description: 'Interactive web app demonstrating sorting algorithms for educational purposes.', techStack: ['TypeScript', 'Vite'], liveUrl: '', githubUrl: 'https://github.com/harshitaballi300-spec' }
            ],
            skills: {
                technical: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'TypeScript'],
                soft: ['Problem Solving', 'Team Leadership'],
                tools: ['Git', 'Docker', 'AWS']
            },
            links: { github: 'github.com/harshitaballi300-spec', linkedin: 'linkedin.com/in/harshita' }
        });
    };

    const updatePersonalInfo = (field, value) => setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));
    const updateLinks = (field, value) => setResumeData(prev => ({ ...prev, links: { ...prev.links, [field]: value } }));

    const handleAddList = (listName, templateObj) => {
        setResumeData(prev => {
            const newList = [...prev[listName], templateObj];
            if (listName === 'projects') {
                setOpenProjects(p => ({ ...p, [newList.length - 1]: true }));
            }
            return { ...prev, [listName]: newList };
        });
    };

    const handleUpdateList = (listName, index, field, value) => {
        setResumeData(prev => {
            const newList = [...prev[listName]];
            // Enforce max 200 chars on project descriptions
            if (listName === 'projects' && field === 'description' && value.length > 200) {
                return prev;
            }
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

    // SKILLS LOGIC
    const handleSkillKeyDown = (e, category) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = skillInputs[category].trim();
            if (val && !resumeData.skills[category].includes(val)) {
                setResumeData(prev => ({ ...prev, skills: { ...prev.skills, [category]: [...prev.skills[category], val] } }));
                setSkillInputs(prev => ({ ...prev, [category]: '' }));
            }
        }
    };

    const removeSkill = (category, idx) => {
        setResumeData(prev => {
            const newCat = [...prev.skills[category]];
            newCat.splice(idx, 1);
            return { ...prev, skills: { ...prev.skills, [category]: newCat } };
        });
    };

    const handleSuggestSkills = () => {
        setIsSuggestingSkills(true);
        setTimeout(() => {
            setResumeData(prev => {
                const s = prev.skills;
                const newTech = ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'GraphQL'].filter(x => !s.technical.includes(x));
                const newSoft = ['Team Leadership', 'Problem Solving'].filter(x => !s.soft.includes(x));
                const newTools = ['Git', 'Docker', 'AWS'].filter(x => !s.tools.includes(x));

                return {
                    ...prev,
                    skills: {
                        technical: [...s.technical, ...newTech],
                        soft: [...s.soft, ...newSoft],
                        tools: [...s.tools, ...newTools]
                    }
                };
            });
            setIsSuggestingSkills(false);
        }, 1000);
    };

    // PROJECT TECH TAG LOGIC
    const handleProjTechKeyDown = (e, index) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const tk = (projectTechInputs[index] || '').trim();
            if (tk && !resumeData.projects[index].techStack.includes(tk)) {
                setResumeData(prev => {
                    const list = [...prev.projects];
                    list[index].techStack.push(tk);
                    return { ...prev, projects: list };
                });
                setProjectTechInputs(prev => ({ ...prev, [index]: '' }));
            }
        }
    };

    const removeProjTech = (projIdx, techIdx) => {
        setResumeData(prev => {
            const list = [...prev.projects];
            list[projIdx].techStack.splice(techIdx, 1);
            return { ...prev, projects: list };
        });
    };

    const toggleProjectAccordion = (i) => setOpenProjects(p => ({ ...p, [i]: !p[i] }));

    // ATS Scoring Logic
    const atsEvaluation = useMemo(() => {
        let score = 20;
        let topImprovements = [];

        const summaryWords = resumeData.summary.trim().split(/\s+/).filter(w => w.length > 0).length;
        if (summaryWords >= 40 && summaryWords <= 120) {
            score += 15;
        } else {
            topImprovements.push("Write a stronger summary (40–120 words).");
        }

        if (resumeData.projects.length >= 2) {
            score += 10;
        } else {
            topImprovements.push("Add at least 2 projects.");
        }

        if (resumeData.experience.length >= 1) {
            score += 10;
        } else {
            topImprovements.push("Add internship or project experience.");
        }

        const totalSkills = resumeData.skills.technical.length + resumeData.skills.soft.length + resumeData.skills.tools.length;
        if (totalSkills >= 8) {
            score += 10;
        } else {
            topImprovements.push(`Add more skills (currently ${totalSkills}, target 8+).`);
        }

        if (resumeData.links.github.trim() !== '' || resumeData.links.linkedin.trim() !== '') {
            score += 10;
        }

        const hasNumber = [...resumeData.experience, ...resumeData.projects].some(item => /\d/.test(item.description));
        if (hasNumber) {
            score += 15;
        } else {
            topImprovements.push("Add measurable impact (numbers) in bullets.");
        }

        const hasCompleteEdu = resumeData.education.length > 0 && resumeData.education.some(e => e.institution.trim() !== '' && e.degree.trim() !== '' && e.year.trim() !== '');
        if (hasCompleteEdu) {
            score += 10;
        }

        return {
            score: Math.min(score, 100),
            topImprovements: topImprovements.slice(0, 3)
        };
    }, [resumeData]);

    const totalSkillsTracker = resumeData.skills.technical.length + resumeData.skills.soft.length + resumeData.skills.tools.length;
    const hasData = resumeData.personalInfo.name || resumeData.summary || resumeData.experience.length > 0 || resumeData.education.length > 0 || resumeData.projects.length > 0 || totalSkillsTracker > 0;

    const isClassic = template === 'classic';
    const isModern = template === 'modern';
    const isMinimal = template === 'minimal';

    const getHeaderClass = () => {
        if (isClassic) return "text-center mb-6 border-b-2 border-black pb-6";
        if (isModern) return "flex justify-between items-end mb-6 border-b-4 border-black pb-6 text-left";
        return "text-left mb-6 pb-4";
    };

    const getNameClass = () => {
        if (isClassic) return "text-3xl font-serif font-black tracking-tight mb-2 uppercase break-words align-middle";
        if (isModern) return "text-4xl font-sans font-black tracking-tighter mb-1 uppercase text-black break-words max-w-[60%]";
        return "text-3xl font-sans font-bold tracking-tight mb-3 text-black";
    };

    const getContactClass = () => {
        if (isClassic) return "text-xs font-medium tracking-wide";
        if (isModern) return "text-[11px] font-bold tracking-wider text-right flex flex-col items-end gap-1";
        return "text-xs font-medium text-gray-800 tracking-wide";
    };

    const getSectionHeaderClass = () => {
        if (isClassic) return "text-xs font-black uppercase tracking-widest mb-2 border-b-2 border-black pb-1 font-serif";
        if (isModern) return "text-xs font-black uppercase tracking-widest mb-3 border-b-2 border-gray-300 text-gray-900 pb-1 w-full font-sans";
        return "text-xs font-bold uppercase tracking-widest mb-2 mt-2 font-sans text-black";
    };

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

                        {atsEvaluation.topImprovements.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Top 3 Improvements</p>
                                {atsEvaluation.topImprovements.map((sug, i) => (
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

                        {/* Skills */}
                        <section>
                            <div className="flex justify-between items-center mb-4 pl-1 pr-1">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Skills Matrix</h3>
                                <button onClick={handleSuggestSkills} disabled={isSuggestingSkills} className="flex items-center gap-2 text-xs font-bold bg-white border border-gray-200 text-gray-800 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50">
                                    {isSuggestingSkills ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-accent" />}
                                    Suggest Skills
                                </button>
                            </div>

                            <div className="space-y-5 bg-gray-50 p-5 border border-gray-200 rounded-xl">
                                {/* Category Map */}
                                {[
                                    { key: 'technical', label: 'Technical Skills' },
                                    { key: 'soft', label: 'Soft Skills' },
                                    { key: 'tools', label: 'Tools & Technologies' }
                                ].map(cat => (
                                    <div key={cat.key}>
                                        <div className="flex justify-between items-center mb-2 pl-1">
                                            <label className="text-xs font-medium text-gray-600 tracking-wide">{cat.label} ({resumeData.skills[cat.key].length})</label>
                                        </div>
                                        <div className="min-h-[46px] bg-white border border-gray-200 rounded-lg p-1.5 flex flex-wrap gap-2 items-center shadow-inner cursor-text transition-colors focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400">
                                            {resumeData.skills[cat.key].map((sk, idx) => (
                                                <div key={idx} className="flex items-center gap-1 bg-gray-900 text-white text-xs font-medium px-2.5 py-1 rounded-full shrink-0">
                                                    {sk}
                                                    <button onClick={() => removeSkill(cat.key, idx)} className="hover:text-red-300 transition-colors focus:outline-none"><X className="w-3 h-3" /></button>
                                                </div>
                                            ))}
                                            <input
                                                type="text"
                                                placeholder={resumeData.skills[cat.key].length === 0 ? "Type and press Enter..." : ""}
                                                className="flex-1 min-w-[120px] text-sm bg-transparent border-none outline-none focus:ring-0 px-2 text-black"
                                                value={skillInputs[cat.key]}
                                                onChange={(e) => setSkillInputs(p => ({ ...p, [cat.key]: e.target.value }))}
                                                onKeyDown={(e) => handleSkillKeyDown(e, cat.key)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Experience */}
                        <section>
                            <div className="flex justify-between items-center mb-4 pl-1 pr-1">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Experience</h3>
                                <button onClick={() => handleAddList('experience', { company: '', role: '', period: '', description: '' })} className="flex items-center gap-1 text-xs font-black text-accent hover:text-red-900 transition-colors"><Plus className="w-3.5 h-3.5" /> Add Entry</button>
                            </div>

                            <div className="space-y-4">
                                {resumeData.experience.map((exp, i) => {
                                    const guidance = getBulletGuidance(exp.description);
                                    return (
                                        <div key={i} className="p-5 bg-gray-50 border border-gray-200 rounded-xl relative group">
                                            <button onClick={() => handleRemoveList('experience', i)} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"><X className="w-5 h-5" /></button>
                                            <div className="grid grid-cols-2 gap-3 mb-3">
                                                <input type="text" placeholder="Job Title" className="input bg-white text-sm" value={exp.role} onChange={(e) => handleUpdateList('experience', i, 'role', e.target.value)} />
                                                <input type="text" placeholder="Company Name" className="input bg-white text-sm" value={exp.company} onChange={(e) => handleUpdateList('experience', i, 'company', e.target.value)} />
                                            </div>
                                            <input type="text" placeholder="Time Period (e.g. 2021-Present)" className="input bg-white text-sm mb-3" value={exp.period} onChange={(e) => handleUpdateList('experience', i, 'period', e.target.value)} />
                                            <textarea placeholder="Bullet Description & Achievements..." className="input bg-white text-sm h-24 resize-none" value={exp.description} onChange={(e) => handleUpdateList('experience', i, 'description', e.target.value)} />

                                            {guidance.length > 0 && exp.description.trim() && (
                                                <div className="mt-2 space-y-1">
                                                    {guidance.map((g, idx) => (
                                                        <p key={idx} className="text-[11px] font-bold text-amber-600 flex items-center gap-1.5 opacity-80">
                                                            <span>✨</span> {g}
                                                        </p>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                {resumeData.experience.length === 0 && (
                                    <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-center text-gray-400 text-sm font-bold cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleAddList('experience', { company: '', role: '', period: '', description: '' })}>
                                        Click '+ Add Entry' to add experience.
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Projects Accordion */}
                        <section>
                            <div className="flex justify-between items-center mb-4 pl-1 pr-1">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Projects</h3>
                                <button onClick={() => handleAddList('projects', { name: '', description: '', techStack: [], liveUrl: '', githubUrl: '' })} className="flex items-center gap-1 text-xs font-black text-accent hover:text-red-900 transition-colors">
                                    <Plus className="w-3.5 h-3.5" /> Add Project
                                </button>
                            </div>
                            <div className="space-y-4">
                                {resumeData.projects.map((proj, i) => {
                                    const guidance = getBulletGuidance(proj.description);
                                    const isOpen = openProjects[i];

                                    return (
                                        <div key={i} className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all ${isOpen ? 'border-gray-300' : 'border-gray-200 hover:border-gray-300'}`}>
                                            {/* Accordion Header */}
                                            <div className="flex items-center justify-between p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors" onClick={() => toggleProjectAccordion(i)}>
                                                <div className="flex items-center gap-3">
                                                    {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                                    <h4 className="font-bold text-gray-900 text-sm">{proj.name || 'Untitled Project'}</h4>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {proj.techStack.length > 0 && !isOpen && (
                                                        <span className="hidden md:inline-flex px-2 py-0.5 bg-gray-200 text-gray-600 text-[10px] font-bold rounded-full">{proj.techStack.length} techs</span>
                                                    )}
                                                    <button onClick={(e) => { e.stopPropagation(); handleRemoveList('projects', i); }} className="p-1 text-gray-400 hover:text-red-600 hover:bg-white rounded transition-colors"><X className="w-4 h-4" /></button>
                                                </div>
                                            </div>

                                            {/* Accordion Body */}
                                            {isOpen && (
                                                <div className="p-5 border-t border-gray-100 bg-white space-y-4 relative">
                                                    <div>
                                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Project Info</label>
                                                        <input type="text" placeholder="Project Title" className="input bg-gray-50 text-sm mb-3" value={proj.name} onChange={(e) => handleUpdateList('projects', i, 'name', e.target.value)} />

                                                        <div className="relative">
                                                            <textarea placeholder="Description & Achievements..." className="input bg-gray-50 text-sm h-20 resize-none pb-6" value={proj.description} onChange={(e) => handleUpdateList('projects', i, 'description', e.target.value)} />
                                                            <div className={`absolute bottom-2 right-3 text-[10px] font-bold ${proj.description.length >= 200 ? 'text-red-500' : 'text-gray-400'}`}>
                                                                {proj.description.length} / 200
                                                            </div>
                                                        </div>
                                                        {guidance.length > 0 && proj.description.trim() && (
                                                            <div className="mt-2 space-y-1">
                                                                {guidance.map((g, idx) => (
                                                                    <p key={idx} className="text-[11px] font-bold text-amber-600 flex items-center gap-1.5 opacity-80">
                                                                        <span>✨</span> {g}
                                                                    </p>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Live URL / Demo (Optional)</label>
                                                            <div className="relative">
                                                                <ExternalLink className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                                                                <input type="text" placeholder="https://" className="input bg-gray-50 pl-9 text-xs" value={proj.liveUrl} onChange={(e) => handleUpdateList('projects', i, 'liveUrl', e.target.value)} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Repository (Optional)</label>
                                                            <div className="relative">
                                                                <Github className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                                                                <input type="text" placeholder="https://github.com/..." className="input bg-gray-50 pl-9 text-xs" value={proj.githubUrl} onChange={(e) => handleUpdateList('projects', i, 'githubUrl', e.target.value)} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Tech Stack ({proj.techStack.length})</label>
                                                        <div className="min-h-[42px] bg-gray-50 border border-gray-200 rounded-lg p-1.5 flex flex-wrap gap-2 items-center cursor-text transition-colors focus-within:border-gray-400 focus-within:ring-1">
                                                            {proj.techStack.map((tk, idx) => (
                                                                <div key={idx} className="flex items-center gap-1 bg-gray-200 text-gray-800 text-[11px] font-bold px-2 py-1 rounded-md shrink-0 border border-gray-300">
                                                                    {tk}
                                                                    <button onClick={() => removeProjTech(i, idx)} className="hover:text-red-500 transition-colors focus:outline-none"><X className="w-3 h-3" /></button>
                                                                </div>
                                                            ))}
                                                            <input
                                                                type="text"
                                                                placeholder={proj.techStack.length === 0 ? "Add tech and press Enter" : ""}
                                                                className="flex-1 min-w-[120px] text-xs bg-transparent border-none outline-none focus:ring-0 px-2 text-black"
                                                                value={projectTechInputs[i] || ''}
                                                                onChange={(e) => setProjectTechInputs(p => ({ ...p, [i]: e.target.value }))}
                                                                onKeyDown={(e) => handleProjTechKeyDown(e, i)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                {resumeData.projects.length === 0 && (
                                    <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-center text-gray-400 text-sm font-bold cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleAddList('projects', { name: '', description: '', techStack: [], liveUrl: '', githubUrl: '' })}>
                                        Click '+ Add Project' to build your portfolio.
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Education */}
                        <section>
                            <div className="flex justify-between items-center mb-4 pl-1 pr-1">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Education</h3>
                                <button onClick={() => handleAddList('education', { institution: '', degree: '', year: '' })} className="flex items-center gap-1 text-xs font-black text-accent hover:text-red-900 transition-colors"><Plus className="w-3.5 h-3.5" /> Add Entry</button>
                            </div>
                            <div className="space-y-4">
                                {resumeData.education.map((edu, i) => (
                                    <div key={i} className="p-5 bg-gray-50 border border-gray-200 rounded-xl relative group">
                                        <button onClick={() => handleRemoveList('education', i)} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"><X className="w-5 h-5" /></button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                            <input type="text" placeholder="Institution Name" className="input bg-white text-sm" value={edu.institution} onChange={(e) => handleUpdateList('education', i, 'institution', e.target.value)} />
                                            <input type="text" placeholder="Degree / Certification" className="input bg-white text-sm" value={edu.degree} onChange={(e) => handleUpdateList('education', i, 'degree', e.target.value)} />
                                        </div>
                                        <input type="text" placeholder="Year (e.g. 2020-2024)" className="input bg-white text-sm" value={edu.year} onChange={(e) => handleUpdateList('education', i, 'year', e.target.value)} />
                                    </div>
                                ))}
                            </div>
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

                    <div className="h-20"></div>
                </div>

                {/* Right Column: Live Preview Panel */}
                <div className="w-1/2 overflow-y-auto p-10 xl:p-14 bg-gray-100 flex flex-col items-center justify-start border-l border-gray-200">
                    <div className="w-full max-w-[800px] mb-6 flex justify-center">
                        <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm inline-flex">
                            <button onClick={() => setTemplate('classic')} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded transition-all ${isClassic ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'}`}>Classic</button>
                            <button onClick={() => setTemplate('modern')} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded transition-all ${isModern ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'}`}>Modern</button>
                            <button onClick={() => setTemplate('minimal')} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded transition-all ${isMinimal ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'}`}>Minimal</button>
                        </div>
                    </div>

                    <div className="w-full max-w-[800px] aspect-[1/1.414] bg-white shadow-2xl p-10 lg:p-14 flex flex-col items-center justify-start border border-gray-200 transition-all duration-300 relative overflow-hidden">
                        {hasData ? (
                            <div className={`w-full h-full text-black flex flex-col scale-[0.95] origin-top ${isClassic ? 'font-serif' : 'font-sans'}`}>
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
                                        <section className="mb-5">
                                            <h2 className={getSectionHeaderClass()}>Professional Summary</h2>
                                            <p className="text-xs leading-relaxed">{resumeData.summary}</p>
                                        </section>
                                    )}

                                    {resumeData.experience.some(e => e.role || e.company || e.description) && (
                                        <section className="mb-5">
                                            <h2 className={getSectionHeaderClass()}>Experience</h2>
                                            {resumeData.experience.filter(e => e.role || e.company || e.description).map((exp, i) => (
                                                <div key={i} className="mb-3">
                                                    <div className="flex justify-between items-baseline mb-0.5">
                                                        <h3 className={`font-bold text-[13px] ${isMinimal ? 'font-sans text-black tracking-tight' : ''}`}>{exp.role}</h3>
                                                        <span className="text-[11px] font-bold uppercase tracking-wider whitespace-nowrap ml-4">{exp.period}</span>
                                                    </div>
                                                    <p className={`text-xs mb-1 ${isMinimal ? 'text-gray-500 font-medium' : 'font-bold italic text-gray-800'}`}>{exp.company}</p>
                                                    <p className="text-[11.5px] leading-relaxed break-words whitespace-pre-wrap">{exp.description}</p>
                                                </div>
                                            ))}
                                        </section>
                                    )}

                                    {resumeData.projects.some(p => p.name || p.description) && (
                                        <section className="mb-5">
                                            <h2 className={getSectionHeaderClass()}>Projects</h2>
                                            <div className="space-y-3">
                                                {resumeData.projects.filter(p => p.name || p.description).map((proj, i) => (
                                                    <div key={i} className="mb-1">
                                                        <div className="flex justify-between items-baseline mb-0.5">
                                                            <h3 className={`font-bold text-[13px] flex items-center gap-1.5 ${isMinimal ? 'font-sans text-black tracking-tight' : ''}`}>
                                                                {proj.name}
                                                                {(proj.githubUrl || proj.liveUrl) && (
                                                                    <div className="flex items-center gap-1 opacity-60 ml-1">
                                                                        {proj.githubUrl && <Github className="w-3 h-3" />}
                                                                        {proj.liveUrl && <ExternalLink className="w-3 h-3" />}
                                                                    </div>
                                                                )}
                                                            </h3>
                                                        </div>
                                                        <p className="text-[11.5px] leading-relaxed break-words whitespace-pre-wrap mb-1.5">{proj.description}</p>
                                                        {proj.techStack && proj.techStack.length > 0 && (
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {proj.techStack.map((tech, idx) => (
                                                                    <span key={idx} className="bg-gray-100 text-gray-700 text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border border-gray-200">
                                                                        {tech}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    )}

                                    {resumeData.education.some(e => e.institution || e.degree) && (
                                        <section className="mb-5">
                                            <h2 className={getSectionHeaderClass()}>Education</h2>
                                            {resumeData.education.filter(e => e.institution || e.degree).map((edu, i) => (
                                                <div key={i} className="mb-2">
                                                    <div className="flex justify-between items-baseline mb-0.5">
                                                        <h3 className={`font-bold text-[13px] ${isMinimal ? 'font-sans text-black tracking-tight' : ''}`}>{edu.institution}</h3>
                                                        <span className="text-[11px] font-bold uppercase tracking-wider whitespace-nowrap ml-4">{edu.year}</span>
                                                    </div>
                                                    <p className={`text-xs ${isMinimal ? 'text-gray-500 font-medium' : 'font-medium italic text-gray-800'}`}>{edu.degree}</p>
                                                </div>
                                            ))}
                                        </section>
                                    )}

                                    {totalSkillsTracker > 0 && (
                                        <section className="mb-5">
                                            <h2 className={getSectionHeaderClass()}>Skills</h2>
                                            <div className="space-y-2">
                                                {resumeData.skills.technical.length > 0 && (
                                                    <div className="text-[11.5px] leading-relaxed">
                                                        <span className="font-bold mr-1">Technical:</span>
                                                        <span className="text-gray-800">{resumeData.skills.technical.join(isModern ? '  |  ' : ' • ')}</span>
                                                    </div>
                                                )}
                                                {resumeData.skills.soft.length > 0 && (
                                                    <div className="text-[11.5px] leading-relaxed">
                                                        <span className="font-bold mr-1">Soft Skills:</span>
                                                        <span className="text-gray-800">{resumeData.skills.soft.join(isModern ? '  |  ' : ' • ')}</span>
                                                    </div>
                                                )}
                                                {resumeData.skills.tools.length > 0 && (
                                                    <div className="text-[11.5px] leading-relaxed">
                                                        <span className="font-bold mr-1">Tools / Tech:</span>
                                                        <span className="text-gray-800">{resumeData.skills.tools.join(isModern ? '  |  ' : ' • ')}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </section>
                                    )}
                                </div>
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
