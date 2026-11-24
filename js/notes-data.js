/**
 * Notes Content System for Madhuparna Biswas Portfolio
 * 
 * Centralized content repository and query store for technical notes,
 * architecture essays, and learnings. Supports publication status,
 * featured flags, reading time estimation, date sorting, and querying.
 */
(function (global) {
    'use strict';

    const NOTES_DATA = [
        {
            id: 'note-01',
            slug: 'attention-is-all-you-need',
            title: '"Attention Is All You Need" (Vaswani et al., 2017) — A Deep Dive',
            description: 'A comprehensive breakdown of the foundational Transformer architecture: sequence transduction, multi-head attention, residual connections, and scaled dot-product mathematics.',
            date: '2026-11-24',
            readingTime: '10 min read',
            featured: true,
            published: true,
            tags: ['AI/ML', 'Transformers', 'Deep Learning', 'Attention', 'NLP'],
            content: `
                <div class="mb-8 p-4 rounded-md border border-hairline bg-surface/60 text-sm">
                    <span class="text-subtle font-arial uppercase tracking-wider text-[11px] block mb-1">Paper Reference</span>
                    <a href="https://arxiv.org/abs/1706.03762" target="_blank" rel="noopener noreferrer" class="font-medium text-fg inline-flex items-center gap-1.5 hover:underline underline-offset-4">
                        <span>Paper — Attention Is All You Need Notes (arXiv:1706.03762)</span>
                        <span aria-hidden="true">↗</span>
                    </a>
                </div>

                <h3>Abstract</h3>
                <blockquote class="border-l-2 border-hairline pl-4 py-2 italic text-muted text-sm sm:text-[15px] leading-relaxed my-5 bg-surface/30">
                    The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train. Our model achieves 28.4 BLEU on the WMT 2014 English-to-German translation task, improving over the existing best results, including ensembles, by over 2 BLEU. On the WMT 2014 English-to-French translation task, our model establishes a new single-model state-of-the-art BLEU score of 41.0 after training for 3.5 days on eight GPUs, a small fraction of the training costs of the best models from the literature.
                </blockquote>

                <h3>Summary</h3>
                <p>
                    Older AI used slow, complicated methods to translate languages word by word. This paper introduces a new, simpler AI called the <strong>"Transformer."</strong> By using a mathematical trick called <em>"attention,"</em> it looks at a whole sentence at once instead of reading it in order. This new design made the AI much faster, cheaper to train, and far better at translating than any system before it.
                </p>

                <h4>Key Foundations</h4>
                <ul class="space-y-3 my-4 list-disc list-inside text-muted text-sm sm:text-[15px]">
                    <li><strong>Sequence transduction:</strong> Converting one sequence of data into another. In this context, it means translating a sequence of English words into a sequence of French words.</li>
                    <li><strong>Recurrent Neural Networks (RNNs):</strong> An older type of AI that processes data sequentially (word-by-word). Because it has to wait for word 1 to finish before looking at word 2, it is very slow.</li>
                    <li><strong>Attention Mechanism:</strong> A mathematical technique that allows the AI to weigh the importance of different words in a sentence, regardless of how far apart they are. For example, in the sentence <em>"The bank of the river,"</em> attention helps the AI realize <em>"bank"</em> is related to <em>"river,"</em> not a place that holds money.</li>
                </ul>

                <h3>Background</h3>
                <p>
                    Previous models tried to speed up processing using parallel networks, but they struggled to connect words that were far apart in a sentence because it required too many calculations. The Transformer solves this by instantly linking any two words, regardless of distance, using a technique called <strong>"Multi-Head Attention."</strong>
                </p>
                <p>
                    This is powered by <strong>self-attention</strong>—a proven method that helps an AI understand a text by looking at how words within the exact same sentence relate to one another.
                </p>

                <h3>Model Architecture</h3>

                <h4>Encoder</h4>
                <p>
                    <strong>Core function:</strong> <code>symbol sequence (original English sentence) → continuous representations (complex list of numbers and mathematical patterns)</code>
                </p>
                <p>
                    Consists of <strong>N = 6</strong> stacks of identical layers with 2 sublayers for performing multi-head attention.
                </p>

                <div class="p-5 rounded-md border border-hairline bg-surface/50 my-5 text-sm">
                    <h5 class="font-semibold text-fg mb-2">Why One Head Isn't Enough</h5>
                    <p class="text-muted mb-3 italic">Imagine the sentence: "The animal didn't cross the street because it was too tired."</p>
                    <p class="text-muted mb-3">If the model only had one attention head, it would have to average every relationship into a single set of weights. With multiple heads, each head can specialize in a different linguistic pattern simultaneously:</p>
                    <ul class="space-y-1.5 text-muted list-disc list-inside">
                        <li><strong>Head 1:</strong> Might focus on pronoun resolution (<code>"it"</code> → <code>"animal"</code>).</li>
                        <li><strong>Head 2:</strong> Might focus on cause and effect (<code>"tired"</code> → <code>"didn't cross"</code>).</li>
                        <li><strong>Head 3:</strong> Might focus on basic grammar and verb structure (<code>"didn't"</code> → <code>"cross"</code>).</li>
                    </ul>
                </div>

                <p>
                    When data passes through complex math (a sub-layer), sometimes the AI accidentally destroys or "forgets" important parts of the original sentence. To stop this, the authors built a bypass road (a <strong>residual connection</strong>). They take a copy of the raw data before it enters the checkpoint, skip over the checkpoint, and add it back to the processed data at the end (represented mathematically as <code>x + Sublayer(x)</code>). Afterward, they tidy up the resulting numbers so they don't get wildly large (<strong>layer normalization</strong>).
                </p>

                <h4>Decoder</h4>
                <p>
                    Translates the input one word at a time from the mathematical summary.
                </p>
                <ul class="space-y-2.5 my-4 text-muted text-sm sm:text-[15px] list-disc list-inside">
                    <li><strong>N = 6</strong> stacks of identical layers with 3 sublayers for performing multi-head attention over the output of the encoder stack.</li>
                    <li>Similar to the encoder, employs residual connections around each of the sub-layers, followed by layer normalization.</li>
                    <li>The predictions for position <em>i</em> can depend only on the known outputs at positions less than <em>i</em>.</li>
                    <li>At each step the model is <strong>auto-regressive</strong>, consuming the previously generated symbols as additional input when generating the next. The AI uses its own past answers to figure out the next one. When guessing the third word, it looks back at the first two words it just generated to ensure the grammar makes sense.</li>
                </ul>

                <h3>Attention: Queries, Keys &amp; Values</h3>
                <p>
                    The search (query <em>q</em>), the labels being searched through (keys <em>K<sub>i</sub></em>), the actual content attached to those labels (values <em>V<sub>i</sub></em>), and the final result (output)—is just a list of numbers (a vector).
                </p>
                <p>
                    The query is matched with keys and their values (the context), and the output is the weighted sum of all the key-value pairs where the weight is how closely the query matches the key using a <strong>compatibility function</strong> (a mathematical rule to find out how closely the query matches).
                </p>

                <h4>Scaled Dot Product Attention</h4>
                <p>
                    Queries <em>Q</em>, Keys <em>K</em>, and values <em>V</em> are matrices. We compute the dot product of the query with all keys and find the weights. The query is checked against all keys simultaneously (optimized matrix multiplication).
                </p>
                <p>
                    While for small values of <em>d<sub>k</sub></em> the two mechanisms perform similarly, additive attention outperforms dot product attention without scaling for larger values of <em>d<sub>k</sub></em> (where <em>d<sub>k</sub></em> = dimension of keys).
                </p>

                <div class="my-5 p-4 rounded border border-hairline bg-surface font-mono text-sm text-fg overflow-x-auto text-center">
                    Attention(Q, K, V) = softmax( (Q Kᵀ) / √d_k ) V
                </div>

                <h4>Multi-Head Attention &amp; Linear Projections</h4>
                <p>
                    <strong>Linearly project q, k &amp; v:</strong> Rather than running attention once on the full 512-number vectors (<em>d</em><sub>model</sub> = 512), the model passes <em>Q</em>, <em>K</em>, and <em>V</em> through <em>h</em> different sets of weight matrices (<em>h</em> = 8 in the paper). Each set of matrices compresses the 512-dimensional vectors down into smaller 64-dimensional vectors (<em>d<sub>k</sub></em> = <em>d<sub>v</sub></em> = 64). Because each of the 8 sets has its own learned weights, every head gets a slightly different "lens" or perspective on the exact same words.
                </p>

                <div class="p-5 rounded-md border border-hairline bg-surface/50 my-5 text-sm">
                    <h5 class="font-semibold text-fg mb-2">The Flashlight Analogy</h5>
                    <p class="text-muted leading-relaxed">
                        Think of shining a flashlight on a 3D object to cast a 2D shadow on a wall. You are taking a high-dimensional object and mapping it onto a lower-dimensional space from a specific angle. Here, the model takes a rich 512-dimensional word vector and casts a 64-dimensional "shadow" of it. Each head's weight matrix acts like a different camera angle—one angle might capture grammatical tense, while another captures who is doing the action.
                    </p>
                </div>

                <p>
                    On each of the projected vectors, attention is applied simultaneously, giving 8 separate 64D values which are concatenated and then again projected, resulting in the final values.
                </p>
                <p>
                    Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions. With a single attention head, averaging inhibits this.
                </p>
                <p>
                    Due to the reduced dimension of each head, the total computational cost is similar to that of single-head attention with full dimensionality.
                </p>
            `
        },

        {
            id: 'note-02',
            slug: 'vision-transformer-patch-compression',
            title: 'Draft: Explorations in Vision Transformer Patch Compression',
            description: 'Early experimental notes on reducing computational complexity in high-resolution ViT self-attention matrices using learned spatial downsampling.',
            date: '2026-11-24',
            readingTime: '7 min read',
            featured: true,
            published: false,
            tags: ['Research', 'Computer Vision'],
            content: `<p>Draft in progress...</p>`
        }
    ];

    /**
     * Notes Content Store API
     */
    const NotesStore = {
        /**
         * Get all raw notes data.
         * @returns {Array}
         */
        getAll() {
            return [...NOTES_DATA];
        },

        /**
         * Retrieve all published notes sorted in reverse chronological order (newest first).
         * Excludes unpublished notes (published: false).
         * @returns {Array}
         */
        getAllPublished() {
            return NOTES_DATA
                .filter(note => note.published === true)
                .sort((a, b) => new Date(b.date) - new Date(a.date));
        },

        /**
         * Retrieve published notes marked featured: true in reverse chronological order.
         * @param {number} limit Number of featured notes to return (defaults to 1 as specified)
         * @returns {Array}
         */
        getFeaturedPublished(limit = 1) {
            const featured = NOTES_DATA
                .filter(note => note.published === true && note.featured === true)
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            return limit ? featured.slice(0, limit) : featured;
        },

        /**
         * Find a note by its slug or ID.
         * @param {string} slugOrId
         * @returns {Object|null}
         */
        getBySlug(slugOrId) {
            if (!slugOrId) return null;
            return NOTES_DATA.find(
                note => note.slug === slugOrId || note.id === slugOrId
            ) || null;
        },

        /**
         * Format ISO date string to human-readable format (e.g., "Nov 20, 2026").
         * @param {string} dateString
         * @returns {string}
         */
        formatDate(dateString) {
            try {
                const parts = dateString.split('-');
                if (parts.length === 3) {
                    const year = parseInt(parts[0], 10);
                    const monthIdx = parseInt(parts[1], 10) - 1;
                    const day = parseInt(parts[2], 10);
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    return `${months[monthIdx]} ${day}, ${year}`;
                }
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            } catch (e) {
                return dateString;
            }
        }
    };

    // Expose store to global scope
    global.NotesStore = NotesStore;

})(typeof window !== 'undefined' ? window : this);
