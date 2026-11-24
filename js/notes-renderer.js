/**
 * Notes Renderer Module
 * 
 * Handles dynamic rendering of:
 * 1. Homepage featured note(s) from NotesStore (exactly one most recent note marked featured: true & published: true).
 * 2. Dedicated /notes page listing all published notes in reverse-chronological order.
 * 3. Individual note reading view when a note is selected via URL query (?note=slug) or clicked.
 */
(function (global) {
    'use strict';

    // Homepage limit: configured to 1 note per user requirement ("Display exactly one most recent notes")
    const HOMEPAGE_FEATURED_LIMIT = 1;

    /**
     * Render the featured note(s) on the homepage.
     */
    function renderHomepageFeaturedNotes() {
        const container = document.getElementById('featured-notes-container');
        if (!container || !global.NotesStore) return;

        const isFile = window.location.protocol === 'file:';
        const notesBase = isFile ? 'notes.html' : '/notes';

        // Update "View all notes ↗" link if on file protocol so local file browsing works
        const viewAllLink = document.getElementById('view-all-notes-link');
        if (viewAllLink && isFile) {
            viewAllLink.setAttribute('href', 'notes.html');
        }

        const featuredNotes = global.NotesStore.getFeaturedPublished(HOMEPAGE_FEATURED_LIMIT);

        if (!featuredNotes || featuredNotes.length === 0) {
            container.innerHTML = `
                <div class="py-8 text-center border-y border-hairline text-sm text-subtle font-arial">
                    No notes currently published. Check back soon.
                </div>
            `;
            return;
        }

        const html = featuredNotes.map((note, index) => {
            const indexFormatted = String(index + 1).padStart(2, '0');
            const dateFormatted = global.NotesStore.formatDate(note.date);
            const noteUrl = `${notesBase}?note=${encodeURIComponent(note.slug)}`;

            return `
                <a href="${noteUrl}" 
                   data-note-slug="${note.slug}"
                   class="note-entry group block py-6 sm:py-7 border-t border-hairline first:border-t last:border-b transition-colors hover:bg-surface/50 -mx-3 px-3 sm:-mx-4 sm:px-4 rounded-md cursor-pointer"
                   aria-label="Read note: ${note.title}">
                    <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2 sm:mb-2.5">
                        <div class="flex items-baseline gap-3 sm:gap-4">
                            <span class="font-intro text-sm text-subtle font-normal tracking-wider">${indexFormatted}</span>
                            <h3 class="text-lg sm:text-xl font-agrandir font-semibold text-fg tracking-tight group-hover:opacity-70 transition-opacity">
                                ${note.title}
                            </h3>
                        </div>
                        <div class="flex items-center gap-2.5 text-xs text-subtle font-arial shrink-0 pl-7 sm:pl-0">
                            <time datetime="${note.date}">${dateFormatted}</time>
                            <span aria-hidden="true" class="text-hairline">·</span>
                            <span>${note.readingTime}</span>
                        </div>
                    </div>
                    <p class="text-sm leading-relaxed text-muted max-w-2xl pl-7 sm:pl-8">
                        ${note.description}
                    </p>
                </a>
            `;
        }).join('');

        container.innerHTML = html;
    }

    /**
     * Render the full listing of published notes on the dedicated /notes page.
     */
    function renderNotesListingPage() {
        const listContainer = document.getElementById('notes-list-container');
        const counterEl = document.getElementById('notes-counter');
        const readerContainer = document.getElementById('note-reader-container');
        const listingSection = document.getElementById('notes-listing-section');

        if (!listContainer || !global.NotesStore) return;

        const allPublished = global.NotesStore.getAllPublished();

        // Update published notes counter
        if (counterEl) {
            const count = allPublished.length;
            counterEl.textContent = count === 1 ? '1 published note' : `${count} published notes`;
        }

        if (allPublished.length === 0) {
            listContainer.innerHTML = `
                <div class="py-12 text-center border-y border-hairline text-sm text-subtle font-arial">
                    No notes currently published.
                </div>
            `;
            return;
        }

        const html = allPublished.map((note, index) => {
            const indexFormatted = String(index + 1).padStart(2, '0');
            const dateFormatted = global.NotesStore.formatDate(note.date);
            const noteUrl = `/notes?note=${encodeURIComponent(note.slug)}`;

            const tagsHtml = note.tags && note.tags.length ? `
                <div class="flex flex-wrap gap-1.5 mt-3">
                    ${note.tags.map(t => `<span class="font-arial text-[11px] px-2 py-0.5 rounded border border-hairline text-subtle">${t}</span>`).join('')}
                </div>
            ` : '';

            return `
                <article class="note-entry group border-t border-hairline py-7 sm:py-8 last:border-b transition-colors hover:bg-surface/50 -mx-3 px-3 sm:-mx-4 sm:px-4 rounded-md">
                    <a href="${noteUrl}" 
                       data-note-slug="${note.slug}"
                       class="note-link block focus:outline-none cursor-pointer"
                       aria-label="Read complete note: ${note.title}">
                        <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2.5">
                            <div class="flex items-baseline gap-3 sm:gap-4">
                                <span class="font-intro text-sm text-subtle font-normal tracking-wider">${indexFormatted}</span>
                                <h2 class="text-xl sm:text-2xl font-agrandir font-semibold text-fg tracking-tight group-hover:opacity-70 transition-opacity">
                                    ${note.title}
                                </h2>
                            </div>
                            <div class="flex items-center gap-2.5 text-xs text-subtle font-arial shrink-0 pl-7 sm:pl-0">
                                <time datetime="${note.date}">${dateFormatted}</time>
                                <span aria-hidden="true" class="text-hairline">·</span>
                                <span>${note.readingTime}</span>
                            </div>
                        </div>

                        <p class="text-[15px] leading-relaxed text-muted max-w-3xl pl-7 sm:pl-8">
                            ${note.description}
                        </p>

                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pl-7 sm:pl-8 mt-3 pt-2">
                            ${tagsHtml}
                            <span class="inline-flex items-center gap-1.5 text-xs font-agrandir text-fg group-hover:opacity-70 transition-opacity self-start sm:self-auto py-1">
                                <span>Read complete note</span>
                                <span aria-hidden="true">↗</span>
                            </span>
                        </div>
                    </a>
                </article>
            `;
        }).join('');

        listContainer.innerHTML = html;

        // Check if a specific note was requested via URL query (?note=slug)
        checkUrlForActiveNote();

        // Intercept clicks on note links to show reader in place with history update
        attachNoteClickListeners();
    }

    /**
     * Check current URL query parameter for active note
     */
    function checkUrlForActiveNote() {
        const readerContainer = document.getElementById('note-reader-container');
        const listingSection = document.getElementById('notes-listing-section');
        if (!readerContainer || !listingSection) return;

        const urlParams = new URLSearchParams(window.location.search);
        const noteSlug = urlParams.get('note');

        if (noteSlug && global.NotesStore) {
            const note = global.NotesStore.getBySlug(noteSlug);
            if (note && note.published) {
                renderSingleNoteView(note);
                return;
            }
        }

        // Show listing, hide reader
        readerContainer.classList.add('hidden');
        listingSection.classList.remove('hidden');
    }

    /**
     * Render the single complete note view
     * @param {Object} note
     */
    function renderSingleNoteView(note) {
        const readerContainer = document.getElementById('note-reader-container');
        const listingSection = document.getElementById('notes-listing-section');
        if (!readerContainer || !listingSection) return;

        const dateFormatted = global.NotesStore.formatDate(note.date);
        const tagsHtml = note.tags && note.tags.length ? `
            <div class="flex flex-wrap gap-1.5 mb-8">
                ${note.tags.map(t => `<span class="font-arial text-[11px] px-2.5 py-1 rounded border border-hairline text-muted bg-surface">${t}</span>`).join('')}
            </div>
        ` : '';

        readerContainer.innerHTML = `
            <div class="max-w-3xl mx-auto py-8 sm:py-12">
                <button type="button" id="back-to-notes-btn" 
                    class="inline-flex items-center gap-2 text-xs sm:text-sm font-agrandir text-muted hover:text-fg transition-colors mb-10 py-1.5 cursor-pointer">
                    <span aria-hidden="true">←</span>
                    <span>Back to all notes</span>
                </button>

                <div class="border-b border-hairline pb-8 mb-8">
                    <div class="flex items-center gap-3 text-xs text-subtle font-arial mb-4">
                        <time datetime="${note.date}">${dateFormatted}</time>
                        <span aria-hidden="true" class="text-hairline">·</span>
                        <span>${note.readingTime}</span>
                        ${note.featured ? `<span class="px-2 py-0.5 rounded-full border border-hairline text-[10px] text-fg bg-surface">Featured</span>` : ''}
                    </div>

                    <h1 class="text-3xl sm:text-4xl md:text-5xl font-agrandir font-bold tracking-tight text-fg leading-tight mb-5">
                        ${note.title}
                    </h1>

                    <p class="text-base sm:text-lg text-muted leading-relaxed font-normal">
                        ${note.description}
                    </p>
                </div>

                ${tagsHtml}

                <div class="note-full-content space-y-6 text-fg leading-relaxed text-[15px] sm:text-base">
                    ${note.content || '<p class="text-muted italic">Complete content available in repository archive.</p>'}
                </div>

                <div class="mt-14 pt-8 border-t border-hairline flex items-center justify-between">
                    <button type="button" id="bottom-back-btn" 
                        class="mono-pill-btn inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-arial cursor-pointer">
                        <span aria-hidden="true">←</span>
                        <span>Back to all notes</span>
                    </button>
                    <a href="#top" class="text-xs font-arial text-subtle hover:text-fg transition-colors">
                        Back to top ↑
                    </a>
                </div>
            </div>
        `;

        listingSection.classList.add('hidden');
        readerContainer.classList.remove('hidden');

        // Scroll top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Bind back buttons
        const handleBack = () => {
            const url = new URL(window.location);
            url.searchParams.delete('note');
            window.history.pushState({}, '', url);
            readerContainer.classList.add('hidden');
            listingSection.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        const topBackBtn = document.getElementById('back-to-notes-btn');
        const bottomBackBtn = document.getElementById('bottom-back-btn');
        if (topBackBtn) topBackBtn.addEventListener('click', handleBack);
        if (bottomBackBtn) bottomBackBtn.addEventListener('click', handleBack);
    }

    /**
     * Attach click event listeners to note links for seamless in-page reading
     */
    function attachNoteClickListeners() {
        document.querySelectorAll('.note-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const slug = link.getAttribute('data-note-slug');
                if (slug && global.NotesStore) {
                    const note = global.NotesStore.getBySlug(slug);
                    if (note) {
                        e.preventDefault();
                        const url = new URL(window.location);
                        url.searchParams.set('note', slug);
                        window.history.pushState({ slug }, '', url);
                        renderSingleNoteView(note);
                    }
                }
            });
        });
    }

    // Handle browser forward/back buttons
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
        window.addEventListener('popstate', () => {
            if (document.getElementById('notes-list-container')) {
                checkUrlForActiveNote();
            }
        });
    }

    // Run automatically when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            renderHomepageFeaturedNotes();
            renderNotesListingPage();
        });
    } else {
        renderHomepageFeaturedNotes();
        renderNotesListingPage();
    }

    // Expose helpers
    global.NotesRenderer = {
        renderHomepageFeaturedNotes,
        renderNotesListingPage
    };

})(typeof window !== 'undefined' ? window : this);
