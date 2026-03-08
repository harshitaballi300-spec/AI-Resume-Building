import { useState } from 'react';
import AppLayout from '../components/AppLayout';

export default function Builder() {
    const [resumeData, setResumeData] = useState({
        personalInfo: { name: '', email: '', phone: '', location: '' },
        summary: '',
        education: [],
        experience: [],
        projects: [],
        skills: '',
        links: { github: '', linkedin: '' }
    });

    const loadSampleData = () => {
        setResumeData({
            personalInfo: { name: 'Harshita Developer', email: 'harshita@example.com', phone: '+91 98765 43210', location: 'Bangalore, India' },
            summary: 'A highly motivated Software Engineer with experience building scalable web applications. Passionate about creating premium, user-centric experiences and solving complex technical challenges efficiently.',
            education: [{ institution: 'Institute of Technology', degree: 'B.Tech in Computer Science', year: '2020-2024' }],
            experience: [
                { company: 'Tech Corp', role: 'Frontend Engineer', period: '2024-Present', description: 'Led the frontend team in rebuilding the core platform, resulting in a 40% performance increase.' },
                { company: 'Startup Inc', role: 'Software Intern', period: '2023-2024', description: 'Developed full-stack web features and optimized API response times.' }
            ],
            projects: [
                { name: 'KodNest Premium Hub', description: 'Built an integrated placement and resume building platform with dynamic data rendering and seamless user experience.' }
            ],
            skills: 'JavaScript, React, Node.js, Next.js, PostgreSQL, TailwindCSS',
            links: { github: 'github.com/harshitaballi300-spec', linkedin: 'linkedin.com/in/harshita' }
        });
    };

    return (
        <AppLayout>
            <div className="flex flex-1 overflow-hidden h-[calc(100vh-65px)]">
                {/* Left Column: Form (50%) */}
                <div className="w-1/2 overflow-y-auto p-10 border-r border-gray-200 bg-white">
                    <div className="flex justify-between items-end mb-10 pb-6 border-b border-gray-100">
                        <div>
                            <h2 className="text-3xl font-serif font-black text-gray-900 tracking-tight mb-2">Editor</h2>
                            <p className="text-gray-500 font-medium">Input your professional details below.</p>
                        </div>
                        <button onClick={loadSampleData} className="button-secondary text-sm font-bold uppercase tracking-widest px-6 py-3">
                            Load Sample Data
                        </button>
                    </div>

                    <div className="space-y-10">
                        {/* Personal Info */}
                        <section>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 pl-1">Personal Info</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Full Name" className="input bg-gray-50 font-medium hover:bg-gray-100 transition-colors" value={resumeData.personalInfo.name} readOnly />
                                <input type="email" placeholder="Email Address" className="input bg-gray-50 font-medium hover:bg-gray-100 transition-colors" value={resumeData.personalInfo.email} readOnly />
                                <input type="tel" placeholder="Phone Number" className="input bg-gray-50 font-medium hover:bg-gray-100 transition-colors" value={resumeData.personalInfo.phone} readOnly />
                                <input type="text" placeholder="Location" className="input bg-gray-50 font-medium hover:bg-gray-100 transition-colors" value={resumeData.personalInfo.location} readOnly />
                            </div>
                        </section>

                        {/* Summary */}
                        <section>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 pl-1">Professional Summary</h3>
                            <textarea placeholder="Write a compelling summary..." className="input bg-gray-50 font-medium hover:bg-gray-100 transition-colors h-32 resize-none" value={resumeData.summary} readOnly />
                        </section>

                        {/* Education */}
                        <section>
                            <div className="flex justify-between items-center mb-4 pl-1 pr-1">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Education</h3>
                                <button className="text-xs font-black text-accent hover:text-red-900 transition-colors">+ Add Entry</button>
                            </div>
                            <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-center text-gray-400 text-sm font-bold">
                                {resumeData.education.length > 0 ? (
                                    <div className="text-left text-gray-900 space-y-3">
                                        {resumeData.education.map((edu, i) => (
                                            <div key={i} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                                <div className="font-black text-base">{edu.degree}</div>
                                                <div className="text-gray-500">{edu.institution} | {edu.year}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    'No education entries yet.'
                                )}
                            </div>
                        </section>

                        {/* Experience */}
                        <section>
                            <div className="flex justify-between items-center mb-4 pl-1 pr-1">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Experience</h3>
                                <button className="text-xs font-black text-accent hover:text-red-900 transition-colors">+ Add Entry</button>
                            </div>
                            <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-center text-gray-400 text-sm font-bold">
                                {resumeData.experience.length > 0 ? (
                                    <div className="text-left text-gray-900 space-y-3">
                                        {resumeData.experience.map((exp, i) => (
                                            <div key={i} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                                <div className="font-black text-base">{exp.role} <span className="font-medium text-gray-400 ml-1">at {exp.company}</span></div>
                                                <div className="text-gray-500 mt-1">{exp.period}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    'No experience entries yet.'
                                )}
                            </div>
                        </section>

                        {/* Projects */}
                        <section>
                            <div className="flex justify-between items-center mb-4 pl-1 pr-1">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Projects</h3>
                                <button className="text-xs font-black text-accent hover:text-red-900 transition-colors">+ Add Entry</button>
                            </div>
                            <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-center text-gray-400 text-sm font-bold">
                                {resumeData.projects.length > 0 ? (
                                    <div className="text-left text-gray-900 space-y-3">
                                        {resumeData.projects.map((proj, i) => (
                                            <div key={i} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                                <div className="font-black text-base">{proj.name}</div>
                                                <div className="text-gray-500 mt-1 line-clamp-2">{proj.description}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    'No projects yet.'
                                )}
                            </div>
                        </section>

                        {/* Skills */}
                        <section>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 pl-1">Skills</h3>
                            <input type="text" placeholder="e.g. React, Node.js, Python (comma separated)" className="input bg-gray-50 font-medium hover:bg-gray-100 transition-colors" value={resumeData.skills} readOnly />
                        </section>

                        {/* Links */}
                        <section>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 pl-1">Links</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="GitHub URL" className="input bg-gray-50 font-medium hover:bg-gray-100 transition-colors" value={resumeData.links.github} readOnly />
                                <input type="text" placeholder="LinkedIn URL" className="input bg-gray-50 font-medium hover:bg-gray-100 transition-colors" value={resumeData.links.linkedin} readOnly />
                            </div>
                        </section>
                    </div>

                    {/* Extra padding buffer */}
                    <div className="h-20"></div>
                </div>

                {/* Right Column: Live Preview Panel (50%) */}
                <div className="w-1/2 overflow-y-auto p-12 bg-gray-100 flex justify-center items-start border-l border-gray-200">
                    <div className="w-full max-w-[800px] aspect-[1/1.414] bg-white shadow-2xl p-10 lg:p-14 flex flex-col items-center justify-center text-gray-300 font-serif border border-gray-200 transition-all duration-500">
                        {resumeData.personalInfo.name ? (
                            <div className="w-full h-full text-black font-sans leading-relaxed flex flex-col scale-[0.85] origin-top">
                                {/* Simple minimal render for builder preview placeholder */}
                                <header className="text-center mb-8 border-b-2 border-black pb-8">
                                    <h1 className="text-4xl font-serif font-black tracking-tight mb-2 uppercase">{resumeData.personalInfo.name}</h1>
                                    <p className="text-sm font-medium tracking-wide">
                                        {resumeData.personalInfo.email} • {resumeData.personalInfo.phone} • {resumeData.personalInfo.location}
                                        <br />{resumeData.links.github} • {resumeData.links.linkedin}
                                    </p>
                                </header>

                                <section className="mb-6">
                                    <h2 className="text-sm font-black uppercase tracking-widest mb-2 border-b-2 border-black pb-1">Professional Summary</h2>
                                    <p className="text-sm">{resumeData.summary}</p>
                                </section>

                                {resumeData.experience.length > 0 && (
                                    <section className="mb-6">
                                        <h2 className="text-sm font-black uppercase tracking-widest mb-2 border-b-2 border-black pb-1">Experience</h2>
                                        {resumeData.experience.map((exp, i) => (
                                            <div key={i} className="mb-4">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h3 className="font-bold text-base">{exp.role}</h3>
                                                    <span className="text-sm font-medium uppercase tracking-wider">{exp.period}</span>
                                                </div>
                                                <p className="text-sm font-bold italic text-gray-800 mb-1">{exp.company}</p>
                                                <p className="text-sm">{exp.description}</p>
                                            </div>
                                        ))}
                                    </section>
                                )}

                                {resumeData.education.length > 0 && (
                                    <section className="mb-6">
                                        <h2 className="text-sm font-black uppercase tracking-widest mb-2 border-b-2 border-black pb-1">Education</h2>
                                        {resumeData.education.map((edu, i) => (
                                            <div key={i} className="mb-3">
                                                <div className="flex justify-between items-baseline mb-0.5">
                                                    <h3 className="font-bold text-base">{edu.institution}</h3>
                                                    <span className="text-sm font-medium uppercase tracking-wider">{edu.year}</span>
                                                </div>
                                                <p className="text-sm font-bold italic text-gray-800">{edu.degree}</p>
                                            </div>
                                        ))}
                                    </section>
                                )}

                                {resumeData.projects.length > 0 && (
                                    <section className="mb-6">
                                        <h2 className="text-sm font-black uppercase tracking-widest mb-2 border-b-2 border-black pb-1">Projects</h2>
                                        {resumeData.projects.map((proj, i) => (
                                            <div key={i} className="mb-3">
                                                <h3 className="font-bold text-base mb-1">{proj.name}</h3>
                                                <p className="text-sm">{proj.description}</p>
                                            </div>
                                        ))}
                                    </section>
                                )}

                                <section className="mb-6">
                                    <h2 className="text-sm font-black uppercase tracking-widest mb-2 border-b-2 border-black pb-1">Skills</h2>
                                    <p className="text-sm font-medium leading-relaxed">{resumeData.skills}</p>
                                </section>
                            </div>
                        ) : (
                            <>
                                <div className="w-24 h-24 mb-6 border-4 border-dashed border-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-gray-200">▤</span>
                                </div>
                                <h3 className="text-2xl font-black text-gray-300 font-sans tracking-tight mb-2">Live Preview Area</h3>
                                <p className="text-base font-sans mt-2 opacity-50 max-w-[250px] text-center">Load sample data or start typing to see your resume come to life.</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
