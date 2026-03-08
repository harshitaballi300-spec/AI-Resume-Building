import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import { Download, Copy, CheckCircle2, AlertTriangle, ExternalLink, Github, Check } from 'lucide-react';
import TemplateSelector from '../components/TemplateSelector';
import AtsScoreCircular from '../components/AtsScoreCircular';

const DEFAULT_DATA = {
    personalInfo: { name: '', email: '', phone: '', location: '' },
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: { technical: [], soft: [], tools: [] },
    links: { github: '', linkedin: '' }
};

export default function Preview() {
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

    const [colorTheme, setColorTheme] = useState(() => {
        return localStorage.getItem('resumeColorTheme') || 'hsl(168, 60%, 40%)';
    });

    const [copied, setCopied] = useState(false);

    // Allow changing templates globally directly from the Preview page as well
    const handleTemplateChange = (newTemp) => {
        setTemplate(newTemp);
        localStorage.setItem('resumeTemplateChoice', newTemp);
    };

    const handleColorThemeChange = (newColor) => {
        setColorTheme(newColor);
        localStorage.setItem('resumeColorTheme', newColor);
    };

    const totalSkillsTracker = resumeData.skills.technical.length + resumeData.skills.soft.length + resumeData.skills.tools.length;
    const hasData = resumeData.personalInfo.name || resumeData.summary || resumeData.experience.length > 0 || resumeData.education.length > 0 || resumeData.projects.length > 0 || totalSkillsTracker > 0;
    const isMissingDataForWarning = !resumeData.personalInfo.name || (resumeData.projects.length === 0 && resumeData.experience.length === 0);

    const [toastMessage, setToastMessage] = useState('');

    const handlePrint = () => {
        setToastMessage("PDF export ready! Check your downloads.");
        setTimeout(() => setToastMessage(''), 3000);
        // Using requestAnimationFrame to ensure the toast renders before print blocks threading
        requestAnimationFrame(() => {
            setTimeout(() => {
                window.print();
            }, 100);
        });
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
                    let projectTitleLine = proj.name || '';
                    if (proj.liveUrl) projectTitleLine += ` | Live: ${proj.liveUrl}`;
                    if (proj.githubUrl) projectTitleLine += ` | Repo: ${proj.githubUrl}`;

                    text += `${projectTitleLine}\n`;
                    if (proj.techStack && proj.techStack.length > 0) {
                        text += `Tech: ${proj.techStack.join(', ')}\n`;
                    }
                    text += `${proj.description || ''}\n\n`;
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

        if (totalSkillsTracker > 0) {
            text += `SKILLS\n`;
            if (resumeData.skills.technical.length > 0) {
                text += `Technical: ${resumeData.skills.technical.join(', ')}\n`;
            }
            if (resumeData.skills.soft.length > 0) {
                text += `Soft Skills: ${resumeData.skills.soft.join(', ')}\n`;
            }
            if (resumeData.skills.tools.length > 0) {
                text += `Tools/Tech: ${resumeData.skills.tools.join(', ')}\n`;
            }
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
        if (isClassic) return "text-center mb-10 border-b-2 pb-8"; // Keep border color dynamic below with style
        if (isModern) return "flex justify-between items-end mb-10 border-b-4 pb-8 text-left";
        return "text-left mb-10 pb-4"; // minimal
    };

    const getNameClass = () => {
        if (isClassic) return "text-5xl font-serif font-black tracking-tight mb-3 uppercase break-words align-middle";
        if (isModern) return "text-6xl font-sans font-black tracking-tighter mb-2 uppercase break-words max-w-[60%] theme-text";
        return "text-5xl font-sans font-bold tracking-tight mb-4 theme-text";
    };

    const getContactClass = () => {
        if (isClassic) return "text-sm font-medium tracking-wide theme-text";
        if (isModern) return "text-[13px] font-bold tracking-wider text-right flex flex-col items-end gap-1.5 theme-text";
        return "text-sm font-medium text-gray-800 tracking-wide leading-relaxed";
    };

    const getSectionHeaderClass = () => {
        if (isClassic) return "text-sm font-black uppercase tracking-widest mb-4 border-b-2 pb-1 font-serif theme-border theme-text";
        if (isModern) return "text-sm font-black uppercase tracking-widest mb-5 border-b-2 pb-2 w-full font-sans theme-border theme-text";
        return "text-sm font-bold uppercase tracking-widest mb-4 mt-4 font-sans theme-text";
    };

    return (
        <AppLayout>
            <div className="flex flex-col items-center justify-start bg-gray-100 min-h-[calc(100vh-65px)] py-12 px-4 shadow-inner relative print:bg-white print:py-0 print:px-0 print:shadow-none">

                {/* Control Panel */}
                <TemplateSelector
                    template={template}
                    setTemplate={handleTemplateChange}
                    colorTheme={colorTheme}
                    setColorTheme={handleColorThemeChange}
                />

                <div className="w-full max-w-[850px] mb-6 print-hidden flex justify-between gap-4">
                    {/* Empty placeholder for flex layout if needed or move error msg here */}
                    {isMissingDataForWarning && hasData ? (
                        <div className="flex-1 flex items-center gap-3 bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm font-medium">Your resume may look incomplete. Consider adding your name and at least one project or experience entry.</p>
                        </div>
                    ) : <div className="flex-1"></div>}

                    <div className="flex items-center gap-3 justify-end shrink-0">
                        <button onClick={handleCopyText} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-800 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors hover:bg-gray-50 hover:border-gray-300 shadow-sm">
                            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied' : 'Copy Text'}
                        </button>
                        <button onClick={handlePrint} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 text-white border border-gray-900 text-xs font-bold uppercase tracking-widest rounded-lg transition-all hover:bg-black hover:shadow-lg hover:shadow-gray-900/20">
                            <Download className="w-4 h-4" /> Print / Save PDF
                        </button>
                    </div>
                </div>

                {/* Toast Notification */}
                {toastMessage && (
                    <div className="fixed bottom-6 right-6 z-50 print-hidden bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl shadow-gray-900/20 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        <span className="text-sm font-bold tracking-wide">{toastMessage}</span>
                    </div>
                )}

                {hasData && (
                    <AtsScoreCircular resumeData={resumeData} />
                )}

                {hasData ? (
                    <div
                        className="print-visible print:border-none print:-m-12 w-full max-w-[850px] bg-white lg:shadow-2xl shadow-black/10 border border-gray-200 min-h-[1100px] transition-all relative overflow-hidden"
                        style={{ '--resume-accent': colorTheme }}
                    >
                        {/* CSS variables logic injected into className or inline style */}
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            .theme-text { color: ${colorTheme} !important; }
                            .theme-border { border-color: ${colorTheme} !important; }
                            .theme-bg { background-color: ${colorTheme} !important; }
                        `}} />

                        {isModern ? (
                            <div className="flex w-full h-full min-h-[1100px]">
                                {/* Modern Left Sidebar */}
                                <div className="w-[30%] theme-bg text-white p-10 shrink-0 break-all h-full" style={{ minHeight: '1100px' }}>
                                    <div className="sticky top-10">
                                        <div className="mb-10">
                                            <h1 className="text-3xl font-sans font-black tracking-tighter mb-2 uppercase break-words leading-tight">{resumeData.personalInfo.name || 'Your Name'}</h1>
                                            <div className="text-[13px] font-bold tracking-wider flex flex-col items-start gap-1.5 opacity-90">
                                                {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                                                {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
                                                {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
                                                {resumeData.links.github && <span>{resumeData.links.github}</span>}
                                                {resumeData.links.linkedin && <span>{resumeData.links.linkedin}</span>}
                                            </div>
                                        </div>

                                        {totalSkillsTracker > 0 && (
                                            <div className="mt-10">
                                                <h2 className="text-sm font-black uppercase tracking-widest mb-5 border-b-2 border-white/20 pb-2 w-full font-sans">Skills</h2>
                                                <div className="space-y-6">
                                                    {resumeData.skills.technical.length > 0 && (
                                                        <div className="text-[13px] leading-relaxed">
                                                            <div className="font-bold mb-1 opacity-90 uppercase tracking-widest text-[10px]">Technical</div>
                                                            <div className="font-medium text-white/90">{resumeData.skills.technical.join('\n')}</div>
                                                        </div>
                                                    )}
                                                    {resumeData.skills.soft.length > 0 && (
                                                        <div className="text-[13px] leading-relaxed">
                                                            <div className="font-bold mb-1 opacity-90 uppercase tracking-widest text-[10px]">Soft Skills</div>
                                                            <div className="font-medium text-white/90">{resumeData.skills.soft.join('\n')}</div>
                                                        </div>
                                                    )}
                                                    {resumeData.skills.tools.length > 0 && (
                                                        <div className="text-[13px] leading-relaxed">
                                                            <div className="font-bold mb-1 opacity-90 uppercase tracking-widest text-[10px]">Tools / Tech</div>
                                                            <div className="font-medium text-white/90">{resumeData.skills.tools.join('\n')}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* Modern Right Content */}
                                <div className="w-[70%] bg-white p-10 pt-16 pr-16 h-full font-sans text-black flex flex-col">
                                    {resumeData.summary.trim() && (
                                        <section className="mb-10">
                                            <h2 className={getSectionHeaderClass()}>Professional Summary</h2>
                                            <p className="text-[15px] leading-relaxed text-gray-900 whitespace-pre-wrap">{resumeData.summary}</p>
                                        </section>
                                    )}

                                    {resumeData.experience.some(e => e.role || e.company || e.description) && (
                                        <section className="mb-10 shrink-0">
                                            <h2 className={getSectionHeaderClass()}>Experience</h2>
                                            {resumeData.experience.filter(e => e.role || e.company || e.description).map((exp, i) => (
                                                <div key={i} className="mb-8 page-break-avoid">
                                                    <div className="flex justify-between items-baseline mb-1">
                                                        <h3 className="font-bold text-base theme-text">{exp.role}</h3>
                                                        <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap ml-4 theme-text opacity-70">{exp.period}</span>
                                                    </div>
                                                    <p className="text-[15px] mb-3 font-bold italic text-gray-800">{exp.company}</p>
                                                    <p className="text-[15px] leading-relaxed text-gray-900 whitespace-pre-wrap">{exp.description}</p>
                                                </div>
                                            ))}
                                        </section>
                                    )}

                                    {resumeData.projects.some(p => p.name || p.description) && (
                                        <section className="mb-10 shrink-0">
                                            <h2 className={getSectionHeaderClass()}>Projects</h2>
                                            {resumeData.projects.filter(p => p.name || p.description).map((proj, i) => (
                                                <div key={i} className="mb-8 page-break-avoid">
                                                    <div className="flex justify-between items-baseline mb-1">
                                                        <h3 className="font-bold text-base flex items-center gap-2 theme-text">
                                                            {proj.name}
                                                            {(proj.githubUrl || proj.liveUrl) && (
                                                                <div className="flex items-center gap-1.5 opacity-60 ml-1">
                                                                    {proj.githubUrl && <Github className="w-4 h-4" />}
                                                                    {proj.liveUrl && <ExternalLink className="w-4 h-4" />}
                                                                </div>
                                                            )}
                                                        </h3>
                                                    </div>
                                                    <p className="text-[15px] leading-relaxed text-gray-900 whitespace-pre-wrap mb-3">{proj.description}</p>
                                                    {proj.techStack && proj.techStack.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            {proj.techStack.map((tech, idx) => (
                                                                <span key={idx} className="bg-gray-50 text-gray-800 text-xs font-bold uppercase tracking-widest px-2 py-1 rounded border border-gray-200">
                                                                    {tech}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
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
                                                        <h3 className={`font-bold text-base theme-text`}>{edu.institution}</h3>
                                                        <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap ml-4 theme-text opacity-70">{edu.year}</span>
                                                    </div>
                                                    <p className={`text-[15px] font-bold italic text-gray-800`}>{edu.degree}</p>
                                                </div>
                                            ))}
                                        </section>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className={`w-full h-full p-16 md:p-20 text-black flex flex-col ${isClassic ? 'font-serif' : 'font-sans'}`}>
                                <header className={`${getHeaderClass()} ${isClassic ? 'theme-border' : ''}`}>
                                    <h1 className={getNameClass()}>{resumeData.personalInfo.name || 'Your Name'}</h1>
                                    <div className={getContactClass()}>
                                        <p>
                                            {[resumeData.personalInfo.email, resumeData.personalInfo.phone, resumeData.personalInfo.location].filter(Boolean).join(' • ')}
                                            {([resumeData.personalInfo.email, resumeData.personalInfo.phone, resumeData.personalInfo.location].filter(Boolean).length > 0 && (resumeData.links.github || resumeData.links.linkedin)) && <br />}
                                            {[resumeData.links.github, resumeData.links.linkedin].filter(Boolean).join(' • ')}
                                        </p>
                                    </div>
                                </header>

                                <div className="font-sans">
                                    {resumeData.summary.trim() && (
                                        <section className="mb-10">
                                            <h2 className={getSectionHeaderClass()}>Professional Summary</h2>
                                            <p className="text-[15px] leading-relaxed text-gray-900 whitespace-pre-wrap">{resumeData.summary}</p>
                                        </section>
                                    )}

                                    {resumeData.experience.some(e => e.role || e.company || e.description) && (
                                        <section className="mb-10 shrink-0">
                                            <h2 className={getSectionHeaderClass()}>Experience</h2>
                                            {resumeData.experience.filter(e => e.role || e.company || e.description).map((exp, i) => (
                                                <div key={i} className="mb-6 page-break-avoid">
                                                    <div className="flex justify-between items-baseline mb-1">
                                                        <h3 className={`font-bold text-base ${isMinimal ? 'font-sans text-black tracking-tight' : 'theme-text'}`}>{exp.role}</h3>
                                                        <span className={`text-xs font-bold uppercase tracking-wider whitespace-nowrap ml-4 ${!isMinimal ? 'theme-text opacity-70' : ''}`}>{exp.period}</span>
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
                                                    <div className="flex justify-between items-baseline mb-1">
                                                        <h3 className={`font-bold text-base flex items-center gap-2 ${isMinimal ? 'font-sans text-black tracking-tight' : 'theme-text'}`}>
                                                            {proj.name}
                                                            {(proj.githubUrl || proj.liveUrl) && (
                                                                <div className="flex items-center gap-1.5 opacity-60 ml-1">
                                                                    {proj.githubUrl && <Github className="w-4 h-4" />}
                                                                    {proj.liveUrl && <ExternalLink className="w-4 h-4" />}
                                                                </div>
                                                            )}
                                                        </h3>
                                                    </div>
                                                    <p className="text-[15px] leading-relaxed text-gray-900 whitespace-pre-wrap mb-3">{proj.description}</p>
                                                    {proj.techStack && proj.techStack.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            {proj.techStack.map((tech, idx) => (
                                                                <span key={idx} className="bg-gray-100 text-gray-800 text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-md border border-gray-200">
                                                                    {tech}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
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
                                                        <h3 className={`font-bold text-base ${isMinimal ? 'font-sans text-black tracking-tight' : 'theme-text'}`}>{edu.institution}</h3>
                                                        <span className={`text-xs font-bold uppercase tracking-wider whitespace-nowrap ml-4 ${!isMinimal ? 'theme-text opacity-70' : ''}`}>{edu.year}</span>
                                                    </div>
                                                    <p className={`text-[15px] ${isMinimal ? 'text-gray-500 font-medium' : 'font-bold italic text-gray-800'}`}>{edu.degree}</p>
                                                </div>
                                            ))}
                                        </section>
                                    )}

                                    {totalSkillsTracker > 0 && (
                                        <section className="mb-10 shrink-0">
                                            <h2 className={getSectionHeaderClass()}>Skills</h2>
                                            <div className="space-y-4">
                                                {resumeData.skills.technical.length > 0 && (
                                                    <div className="text-[15px] leading-relaxed">
                                                        <span className="font-bold mr-2 inline-block">Technical:</span>
                                                        <span className="text-gray-900">{resumeData.skills.technical.join(isModern ? '  |  ' : ' • ')}</span>
                                                    </div>
                                                )}
                                                {resumeData.skills.soft.length > 0 && (
                                                    <div className="text-[15px] leading-relaxed">
                                                        <span className="font-bold mr-2 inline-block">Soft Skills:</span>
                                                        <span className="text-gray-900">{resumeData.skills.soft.join(isModern ? '  |  ' : ' • ')}</span>
                                                    </div>
                                                )}
                                                {resumeData.skills.tools.length > 0 && (
                                                    <div className="text-[15px] leading-relaxed">
                                                        <span className="font-bold mr-2 inline-block">Tools / Tech:</span>
                                                        <span className="text-gray-900">{resumeData.skills.tools.join(isModern ? '  |  ' : ' • ')}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </section>
                                    )}
                                </div>
                            </div>
                        )}
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
