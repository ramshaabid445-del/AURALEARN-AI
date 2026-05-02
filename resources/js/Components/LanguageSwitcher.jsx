export default function LanguageSwitcher({ locale, onChange }) {
    const options = [
        { value: 'en', label: 'English' },
        { value: 'ur', label: 'اردو' },
    ];

    return (
        <div className="inline-flex overflow-hidden rounded-full border border-slate-800 bg-slate-900/95 shadow-sm">
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    onClick={() => onChange(option.value)}
                    className={`px-4 py-2 text-sm font-semibold transition ${locale === option.value ? 'bg-violet-500 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}
