tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                birchen: ['"Birchen"', 'sans-serif'],
                agrandir: ['"Agrandir"'],
                intro: ['"Instrument Serif"', 'serif'],

            },
            colors: {
                bg: 'var(--bg)',
                fg: 'var(--fg)',
                muted: 'var(--muted)',
                subtle: 'var(--subtle)',
                hairline: 'var(--border)',
                strong: 'var(--border-strong)',
                surface: 'var(--surface)',
                surfaceHover: 'var(--surface-hover)',
            },
        },
    },
};