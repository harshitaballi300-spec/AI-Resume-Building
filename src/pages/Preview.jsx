import AppLayout from '../components/AppLayout';

export default function Preview() {
    return (
        <AppLayout>
            <div className="flex flex-col items-center justify-start bg-gray-100 min-h-[calc(100vh-65px)] py-12 px-4 shadow-inner">
                <div className="w-full max-w-[850px] bg-white shadow-2xl shadow-black/10 p-16 md:p-20 border border-gray-200 aspect-[1/1.414]">
                    {/* Clean resume layout - Premium typography, minimal black + white layout, no colors */}
                    <div className="w-full h-full text-black font-sans">
                        <header className="text-center mb-10 border-b-2 border-black pb-8">
                            <h1 className="text-5xl font-serif font-black tracking-tight mb-3 uppercase">Your Name</h1>
                            <p className="text-sm font-medium tracking-wide">
                                email@example.com • +1 234 567 8900 • City, State
                                <br />github.com/username • linkedin.com/in/username
                            </p>
                        </header>

                        <section className="mb-10">
                            <h2 className="text-sm font-black uppercase tracking-widest mb-4 border-b-2 border-black pb-1">Professional Summary</h2>
                            <p className="text-[15px] leading-relaxed text-gray-900">
                                Result-oriented professional with extensive experience deploying scalable enterprise applications. Dedicated to optimizing workflows, engineering premium products, and implementing sophisticated design systems using modern technologies.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-sm font-black uppercase tracking-widest mb-4 border-b-2 border-black pb-1">Experience</h2>
                            <div className="mb-6">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-base">Senior Engineer</h3>
                                    <span className="text-xs font-bold uppercase tracking-wider">2021—Present</span>
                                </div>
                                <p className="text-[15px] font-bold italic text-gray-800 mb-3">Company Name, Location</p>
                                <ul className="list-disc list-outside ml-5 text-[15px] space-y-2 text-gray-900 leading-relaxed">
                                    <li>Architected robust user interfaces for core platforms.</li>
                                    <li>Improved conversion rates by 25% through performance audits.</li>
                                </ul>
                            </div>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-sm font-black uppercase tracking-widest mb-4 border-b-2 border-black pb-1">Education</h2>
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="font-bold text-base">University Name</h3>
                                <span className="text-xs font-bold uppercase tracking-wider">2016—2020</span>
                            </div>
                            <p className="text-[15px] font-bold italic text-gray-800">B.S. in Computer Science</p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-sm font-black uppercase tracking-widest mb-4 border-b-2 border-black pb-1">Skills</h2>
                            <p className="text-[15px] leading-relaxed text-gray-900">
                                <span className="font-black">Languages:</span> JavaScript, TypeScript, Python, HTML, CSS<br />
                                <span className="font-black">Frameworks:</span> React, Node.js, Express, Next.js<br />
                                <span className="font-black">Tools:</span> Git, Docker, Figma, AWS
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
