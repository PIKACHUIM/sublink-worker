/** @jsxRuntime automatic */
/** @jsxImportSource hono/jsx */
import { APP_NAME, APP_VERSION, GITHUB_REPO, DOCS_URL } from '../constants.js';

const NAV_LINKS = [
    { key: 'landing', href: '/', label: 'OVERVIEW' },
    { key: 'converter', href: '/app', label: 'CONVERTER' }
];

const linkClass = (active, display) =>
    [
        display,
        'px-3 py-2 rounded-full font-mono text-[10px] tracking-[0.14em] uppercase transition-colors min-h-[36px] items-center',
        active
            ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
    ].join(' ');

export const Navbar = ({ current } = {}) => {
    return (
        <nav class="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800 z-50 transition-all duration-300">
            <div class="container mx-auto px-4">
                <div class="flex items-center justify-between h-16 gap-3">
                    <a href="/" class="flex shrink-0 items-center gap-2 text-lg md:text-xl font-bold text-gray-900 dark:text-white hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                        <img src="/favicon.ico" alt={`${APP_NAME} logo`} class="w-6 h-6" />
                        <span class="whitespace-nowrap">{APP_NAME}</span>
                        <span class="hidden md:inline font-mono text-[9px] tracking-[0.14em] font-normal text-gray-400 dark:text-gray-500">
                            v{APP_VERSION}
                        </span>
                    </a>
                    <div class="flex items-center gap-1 md:gap-2">
                        <div class="flex items-center gap-1 mr-1">
                            {NAV_LINKS.map((link) => (
                                <a
                                    href={link.href}
                                    // Keep the converter reachable on phones, where the overview link is redundant.
                                    class={linkClass(
                                        current === link.key,
                                        link.key === 'landing' ? 'hidden sm:inline-flex' : 'inline-flex'
                                    )}
                                    aria-current={current === link.key ? 'page' : undefined}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                        <a
                            href={DOCS_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="px-2 md:px-3 py-2 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                            <i class="fas fa-book"></i>
                            <span class="hidden md:inline">Docs</span>
                        </a>
                        <a
                            href={GITHUB_REPO}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="px-2 md:px-3 py-2 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium"
                        >
                            <i class="fab fa-github"></i>
                            <span class="hidden md:inline">GitHub</span>
                        </a>
                        <button
                            class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                            x-on:click="toggleDarkMode()"
                            aria-label="Toggle dark mode"
                        >
                            <i class="fas" x-bind:class="darkMode ? 'fa-sun' : 'fa-moon'"></i>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
