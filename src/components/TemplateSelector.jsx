import React from 'react';
import { Palette, Check } from 'lucide-react';

export const THEME_COLORS = [
    { id: 'teal', value: 'hsl(168, 60%, 40%)' },
    { id: 'navy', value: 'hsl(220, 60%, 35%)' },
    { id: 'burgundy', value: 'hsl(345, 60%, 35%)' },
    { id: 'forest', value: 'hsl(150, 50%, 30%)' },
    { id: 'charcoal', value: 'hsl(0, 0%, 25%)' }
];

export const TEMPLATES = [
    {
        id: 'classic',
        name: 'Classic',
        description: 'Serif headings, horizontal rules',
        preview: (
            <div className="w-[120px] aspect-[1/1.4] p-3 bg-white border border-gray-200 flex flex-col gap-1.5 mx-auto">
                <div className="w-full text-center border-b border-black pb-1 mb-1 relative flex flex-col items-center">
                    <div className="w-2/3 h-1.5 bg-gray-800 rounded-sm mb-0.5"></div>
                    <div className="w-1/3 h-0.5 bg-gray-400 rounded-sm"></div>
                </div>
                <div className="w-full border-b border-gray-300 pb-0.5 mb-1.5 flex flex-col items-start gap-1">
                    <div className="w-1/3 h-1 bg-gray-600 rounded-sm"></div>
                    <div className="w-full h-0.5 bg-gray-200 rounded-sm"></div>
                    <div className="w-4/5 h-0.5 bg-gray-200 rounded-sm"></div>
                </div>
                <div className="w-full border-b border-gray-300 pb-0.5 mt-auto flex flex-col items-start gap-1">
                    <div className="w-1/4 h-1 bg-gray-600 rounded-sm"></div>
                    <div className="w-full h-0.5 bg-gray-200 rounded-sm"></div>
                </div>
            </div>
        )
    },
    {
        id: 'modern',
        name: 'Modern',
        description: 'Two-column colored sidebar',
        preview: (
            <div className="w-[120px] aspect-[1/1.4] bg-white border border-gray-200 flex overflow-hidden mx-auto">
                <div className="w-1/3 h-full p-1.5 flex flex-col gap-1.5 items-center justify-start theme-bg" style={{ backgroundColor: 'var(--resume-accent, hsl(168, 60%, 40%))' }}>
                    <div className="w-full h-1 bg-white/50 rounded-full mt-2"></div>
                    <div className="w-2/3 h-0.5 bg-white/30 rounded-full"></div>
                </div>
                <div className="w-2/3 h-full p-2.5 flex flex-col gap-1.5 bg-gray-50">
                    <div className="w-3/4 h-1.5 bg-gray-800 rounded-sm"></div>
                    <div className="w-full h-0.5 bg-gray-300 mt-0.5 border-b border-gray-200 mb-1"></div>

                    <div className="w-full h-0.5 bg-gray-300 rounded-sm mt-1"></div>
                    <div className="w-full h-0.5 bg-gray-300 rounded-sm"></div>
                    <div className="w-4/5 h-0.5 bg-gray-300 rounded-sm"></div>
                </div>
            </div>
        )
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Clean sans-serif layout',
        preview: (
            <div className="w-[120px] aspect-[1/1.4] p-3 bg-white border border-gray-200 flex flex-col gap-2 mx-auto">
                <div className="flex flex-col gap-1 mb-2">
                    <div className="w-1/2 h-1.5 bg-gray-900 rounded-sm"></div>
                    <div className="w-1/3 h-0.5 bg-gray-400 rounded-sm"></div>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="w-1/4 h-1 bg-gray-800 rounded-sm mt-1 mb-1"></div>
                    <div className="w-full h-0.5 bg-gray-200 rounded-sm"></div>
                    <div className="w-[90%] h-0.5 bg-gray-200 rounded-sm"></div>
                    <div className="w-[85%] h-0.5 bg-gray-200 rounded-sm"></div>
                </div>
            </div>
        )
    }
];

export default function TemplateSelector({ template, setTemplate, colorTheme, setColorTheme }) {
    return (
        <div className="w-full max-w-[850px] flex flex-col items-center justify-center bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-6 print-hidden transition-all duration-300 mx-auto">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-4 text-center">Format & Style Explorer</h2>

            {/* Template Thumbnails Carousel/Grid */}
            <div className="flex flex-wrap justify-center items-end gap-5 mb-6 w-full px-4">
                {TEMPLATES.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTemplate(t.id)}
                        className={`relative flex flex-col items-center gap-2.5 group transition-all group focus:outline-none`}
                    >
                        <div className={`rounded-lg shadow-sm overflow-hidden transition-all duration-300 transform-gpu ${template === t.id ? 'ring-[3px] ring-blue-500 scale-105 shadow-md' : 'hover:scale-105 hover:shadow-lg opacity-85 hover:opacity-100 ring-1 ring-gray-200 hover:ring-gray-300'}`}>
                            {t.preview}
                        </div>
                        <span className={`text-[11px] font-black uppercase tracking-wider transition-colors ${template === t.id ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-900'}`}>{t.name}</span>
                        {template === t.id && (
                            <div className="absolute top-1.5 right-1.5 bg-blue-500 rounded-full p-0.5 shadow-sm transform scale-110">
                                <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Color Theme Picker Inline Row */}
            <div className="flex flex-col sm:flex-row items-center justify-center pt-5 border-t border-gray-100 gap-4 w-full">
                <div className="flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Layout Accent</span>
                </div>
                <div className="flex justify-center items-center gap-3.5">
                    {THEME_COLORS.map(c => (
                        <button
                            key={c.id}
                            onClick={() => setColorTheme(c.value)}
                            className={`w-7 h-7 rounded-full transition-all duration-200 focus:outline-none ${colorTheme === c.value ? 'ring-[3px] ring-offset-2 ring-gray-900 scale-110 shadow-sm' : 'hover:scale-110 hover:shadow-md opacity-80 hover:opacity-100 ring-1 ring-black/10'}`}
                            style={{ backgroundColor: c.value }}
                            title={c.id.charAt(0).toUpperCase() + c.id.slice(1)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
