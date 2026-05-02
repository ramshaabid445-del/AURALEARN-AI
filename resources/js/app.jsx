import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const rootId = 'app';
const pages = import.meta.glob('./Pages/**/*.jsx');

function showBootError(message, error = null) {
    console.error(message, error);

    document.body.innerHTML = `
        <div style="min-height:100vh;background:#0f172a;color:#f8fafc;padding:32px;font-family:Arial,sans-serif;">
            <h1 style="font-size:24px;margin:0 0 12px;">Inertia boot failed</h1>
            <pre style="white-space:pre-wrap;background:#020617;border:1px solid #334155;border-radius:8px;padding:16px;line-height:1.5;">${message}</pre>
        </div>
    `;
}

function parsePageJson(source, label) {
    if (!source) {
        return null;
    }

    try {
        return JSON.parse(source);
    } catch (error) {
        showBootError(`Could not parse Inertia page JSON from ${label}.\n\n${error.message}`, error);
        throw error;
    }
}

function getInitialPage() {
    const root = document.getElementById(rootId);
    const script = document.querySelector(`script[data-page="${rootId}"][type="application/json"], script[data-page="${rootId}"]`);

    const pageFromRoot = parsePageJson(root?.dataset?.page, `#${rootId}[data-page]`);
    const pageFromScript = parsePageJson(script?.textContent?.trim(), `script[data-page="${rootId}"]`);
    const page = pageFromRoot || pageFromScript;

    if (!root) {
        showBootError(`Inertia root element #${rootId} was not found. Check resources/views/app.blade.php and the @inertia directive.`);
        return null;
    }

    if (!page) {
        showBootError(`Inertia page data was not found. Expected JSON either on #${rootId}[data-page] or inside script[data-page="${rootId}"].`);
        return null;
    }

    root.dataset.page = JSON.stringify(page);

    return page;
}

const initialPage = getInitialPage();

if (initialPage) {
    createInertiaApp({
        id: rootId,
        page: initialPage,
        resolve: (name) => {
            const pagePath = `./Pages/${name}.jsx`;

            if (!pages[pagePath]) {
                const knownPages = Object.keys(pages)
                    .map((path) => path.replace('./Pages/', '').replace('.jsx', ''))
                    .sort()
                    .join(', ');

                throw new Error(`Inertia page not found: ${pagePath}. Known pages: ${knownPages}`);
            }

            return resolvePageComponent(pagePath, pages);
        },
        setup({ el, App, props }) {
            createRoot(el).render(<App {...props} />);
        },
        progress: {
            color: '#7c3aed',
        },
    }).catch((error) => {
        showBootError(error.message || 'Unknown Inertia boot error.', error);
    });
}
