/**
 * Generic, product-agnostic measurement primitives, injected into the page.
 * Everything here runs in the browser and hangs off `window.__bench`.
 * Product-specific runtimes (e.g. grid/runtime.js) add their own namespaces.
 */
(function () {
    var B = window.__bench = window.__bench || {};

    /** Clears the root and returns a fresh, empty container element. */
    B.reset = function (width, height) {
        var root = document.getElementById('bench-root');
        root.innerHTML = '';
        var container = document.createElement('div');
        container.id = 'bench-container';
        container.style.width = (width || 900) + 'px';
        container.style.height = (height || 500) + 'px';
        root.appendChild(container);
        return container;
    };

    /** Resolves after two animation frames — i.e. after the browser has painted. */
    B.nextPaint = function () {
        return new Promise(function (resolve) {
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    resolve();
                });
            });
        });
    };

    /** Runs an async action and measures wall-clock time until the next paint. */
    B.time = async function (action) {
        var t0 = performance.now();
        await action();
        await B.nextPaint();
        return +(performance.now() - t0).toFixed(3);
    };

    /** Forces GC when Chromium is launched with --expose-gc (best effort). */
    B.gc = function () {
        if (typeof window.gc === 'function') {
            window.gc();
        }
    };

    /** Rough JS heap usage in MB (Chromium-only, coarse — informational). */
    B.heapUsedMb = function () {
        var mem = performance.memory;
        return mem ? +(mem.usedJSHeapSize / 1048576).toFixed(1) : 0;
    };

    /**
     * Deterministic column data (seeded LCG) so base and PR builds measure
     * against byte-identical datasets.
     */
    B.genColumns = function (rows, cols, seed) {
        var s = (seed || 1) >>> 0;
        var rnd = function () {
            s = (s * 1664525 + 1013904223) >>> 0;
            return s / 4294967296;
        };
        var columns = {};
        for (var c = 0; c < cols; c++) {
            var arr = new Array(rows);
            for (var r = 0; r < rows; r++) {
                arr[r] = c === 0 ? r :
                    (c % 2 ? Math.floor(rnd() * 1e6) :
                        'txt-' + Math.floor(rnd() * 1e6));
            }
            columns['col' + c] = arr;
        }
        return columns;
    };

    /** Finds the element with the largest overflow on the given axis. */
    B.findScrollable = function (axis) {
        var root = document.getElementById('bench-root');
        var best = null;
        var bestOverflow = 0;
        root.querySelectorAll('*').forEach(function (el) {
            var overflow = axis === 'x' ?
                el.scrollWidth - el.clientWidth :
                el.scrollHeight - el.clientHeight;
            if (overflow > bestOverflow) {
                bestOverflow = overflow;
                best = el;
            }
        });
        return best;
    };

    /**
     * Drives programmatic scrolling along an axis, sampling per-frame durations.
     * Returns frame-timing metrics plus total long-task time during the scroll.
     */
    B.scrollProfile = async function (opts) {
        var axis = opts.axis || 'y';
        var distance = opts.distance || 4000;
        var steps = opts.steps || 60;

        var el = B.findScrollable(axis);
        if (!el) {
            return { error: 'no-scrollable-element' };
        }

        var prop = axis === 'x' ? 'scrollLeft' : 'scrollTop';
        var frames = [];
        var longTaskMs = 0;
        var observer = null;
        try {
            observer = new PerformanceObserver(function (list) {
                list.getEntries().forEach(function (entry) {
                    longTaskMs += entry.duration;
                });
            });
            observer.observe({ entryTypes: ['longtask'] });
        } catch (e) { /* longtask unsupported — leave at 0 */ }

        var stepPx = distance / steps;
        var last = performance.now();
        for (var i = 0; i < steps; i++) {
            el[prop] += stepPx;
            await B.nextPaint();
            var now = performance.now();
            frames.push(now - last);
            last = now;
        }

        if (observer) {
            observer.disconnect();
        }

        frames.sort(function (a, b) { return a - b; });
        var sum = frames.reduce(function (a, b) { return a + b; }, 0);
        var avg = sum / frames.length;
        var p95 = frames[Math.floor(frames.length * 0.95)];
        var jank = frames.filter(function (f) { return f > 16.7; }).length;

        return {
            avgFrameMs: +avg.toFixed(3),
            p95FrameMs: +p95.toFixed(3),
            fps: +(1000 / avg).toFixed(1),
            jankFrames: jank,
            longTaskMs: +longTaskMs.toFixed(1)
        };
    };
})();
