const DEFAULTS = {
    rows: 1000,
    columns: 20,
    scrollRowsPerSec: 12000,
    scrollDurationMs: 1500,
    resizeIterations: 3,
    bufferSize: 10,
    shellWidth: 960,
    shellHeight: 560,
    resizeTimeoutMs: 1500
};
const MAX_FULL_DOM_CELLS = 20000;

const PROFILES = [{
    id: 'virtualized',
    label: 'Virtualized',
    virtualization: true
}, {
    id: 'full-dom',
    label: 'Full DOM',
    virtualization: false
}];

const els = {
    runSuite: document.getElementById('run-suite'),
    runVirtualized: document.getElementById('run-virtualized'),
    runFullDom: document.getElementById('run-full-dom'),
    clearResults: document.getElementById('clear-results'),
    rows: document.getElementById('rows'),
    columns: document.getElementById('columns'),
    scrollRowsPerSec: document.getElementById('scroll-rows-per-sec'),
    scrollDuration: document.getElementById('scroll-duration'),
    resizeIterations: document.getElementById('resize-iterations'),
    bufferSize: document.getElementById('buffer-size'),
    status: document.getElementById('status'),
    currentProfile: document.getElementById('current-profile'),
    gridVersion: document.getElementById('grid-version'),
    resultsBody: document.getElementById('results-body'),
    detailsOutput: document.getElementById('details-output'),
    container: document.getElementById('container')
};

const state = {
    running: false,
    currentGrid: null,
    datasetCache: null,
    datasetCacheKey: '',
    results: {},
    lastResultId: null
};

function createSeededRandom(seed) {
    let value = seed % 2147483647;

    if (value <= 0) {
        value += 2147483646;
    }

    return function () {
        value = value * 16807 % 2147483647;

        return (value - 1) / 2147483646;
    };
}

function generateColumns(rowCount, columnCount) {
    const random = createSeededRandom(1337);
    const columns = {};

    for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
        columns[`Column ${columnIndex + 1}`] = new Array(rowCount);
    }

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        columns['Column 1'][rowIndex] = rowIndex + 1;
        columns['Column 2'][rowIndex] = `Row ${rowIndex + 1}`;

        for (let columnIndex = 2; columnIndex < columnCount; columnIndex++) {
            columns[`Column ${columnIndex + 1}`][rowIndex] = Math.round(
                random() * 100000
            );
        }
    }

    return columns;
}

function cloneColumns(columns) {
    const clone = {};

    Object.keys(columns).forEach(columnName => {
        clone[columnName] = columns[columnName].slice();
    });

    return clone;
}

function getDataset(rowCount, columnCount) {
    const cacheKey = `${rowCount}x${columnCount}`;

    if (state.datasetCacheKey !== cacheKey) {
        state.datasetCache = generateColumns(rowCount, columnCount);
        state.datasetCacheKey = cacheKey;
    }

    return cloneColumns(state.datasetCache);
}

function average(values) {
    if (!values.length) {
        return null;
    }

    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function percentile(values, ratio) {
    if (!values.length) {
        return null;
    }

    const sorted = values.slice().sort((a, b) => a - b);
    const index = Math.min(
        sorted.length - 1,
        Math.max(0, Math.ceil(sorted.length * ratio) - 1)
    );

    return sorted[index];
}

function formatMs(value) {
    if (!Number.isFinite(value)) {
        return '-';
    }

    return `${value.toFixed(1)} ms`;
}

function formatNumber(value, digits = 1) {
    if (!Number.isFinite(value)) {
        return '-';
    }

    return value.toFixed(digits);
}

function formatCount(value) {
    if (!Number.isFinite(value)) {
        return '-';
    }

    return Math.round(value).toLocaleString();
}

function nextPaint(frames = 2) {
    return new Promise(resolve => {
        function waitFrame(remaining) {
            requestAnimationFrame(() => {
                if (remaining <= 1) {
                    resolve();
                    return;
                }

                waitFrame(remaining - 1);
            });
        }

        waitFrame(frames);
    });
}

function getPositiveInt(value, fallback, min) {
    const parsed = parseInt(value, 10);

    if (!Number.isFinite(parsed) || parsed < min) {
        return fallback;
    }

    return parsed;
}

function getConfig() {
    const config = {
        rows: getPositiveInt(els.rows.value, DEFAULTS.rows, 100),
        columns: getPositiveInt(els.columns.value, DEFAULTS.columns, 4),
        scrollRowsPerSec: getPositiveInt(
            els.scrollRowsPerSec.value,
            DEFAULTS.scrollRowsPerSec,
            500
        ),
        scrollDurationMs: getPositiveInt(
            els.scrollDuration.value,
            DEFAULTS.scrollDurationMs,
            500
        ),
        resizeIterations: getPositiveInt(
            els.resizeIterations.value,
            DEFAULTS.resizeIterations,
            2
        ),
        bufferSize: getPositiveInt(
            els.bufferSize.value,
            DEFAULTS.bufferSize,
            0
        )
    };

    els.rows.value = String(config.rows);
    els.columns.value = String(config.columns);
    els.scrollRowsPerSec.value = String(config.scrollRowsPerSec);
    els.scrollDuration.value = String(config.scrollDurationMs);
    els.resizeIterations.value = String(config.resizeIterations);
    els.bufferSize.value = String(config.bufferSize);

    return config;
}

function normalizeConfigForProfiles(config, profiles) {
    const normalized = {
        ...config
    };

    if (!profiles.some(profile => !profile.virtualization)) {
        return normalized;
    }

    const cellCount = normalized.rows * normalized.columns;

    if (cellCount <= MAX_FULL_DOM_CELLS) {
        return normalized;
    }

    normalized.requestedRows = normalized.rows;
    normalized.rows = Math.max(
        100,
        Math.floor(MAX_FULL_DOM_CELLS / normalized.columns)
    );
    normalized.clampedForFullDom = true;

    return normalized;
}

function setStatus(text) {
    els.status.textContent = text;
}

function setCurrentProfile(profileLabel) {
    els.currentProfile.textContent = profileLabel || '-';
}

function setButtonsDisabled(disabled) {
    [
        els.runSuite,
        els.runVirtualized,
        els.runFullDom,
        els.clearResults
    ].forEach(button => {
        button.disabled = disabled;
    });
}

function setShellSize(width, height) {
    els.container.style.width = `${width}px`;
    els.container.style.height = `${height}px`;
}

function pause(ms = 0) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

function buildResizeSequence(iterations) {
    const presets = [{
        width: Math.round(DEFAULTS.shellWidth * 0.72),
        height: Math.round(DEFAULTS.shellHeight * 0.84)
    }, {
        width: Math.round(DEFAULTS.shellWidth * 1.08),
        height: Math.round(DEFAULTS.shellHeight * 1.02)
    }, {
        width: Math.round(DEFAULTS.shellWidth * 0.82),
        height: Math.round(DEFAULTS.shellHeight * 0.76)
    }, {
        width: Math.round(DEFAULTS.shellWidth * 1.14),
        height: Math.round(DEFAULTS.shellHeight * 0.94)
    }, {
        width: Math.round(DEFAULTS.shellWidth * 0.9),
        height: Math.round(DEFAULTS.shellHeight * 1.08)
    }];

    return new Array(iterations).fill(0).map((value, index) => {
        const preset = presets[index % presets.length];

        return {
            width: Math.max(480, preset.width),
            height: Math.max(360, preset.height)
        };
    });
}

function getRowHeight(grid) {
    const virtualizer = grid?.viewport?.rowsVirtualizer;
    const defaultRowHeight = virtualizer?.defaultRowHeight;

    if (Number.isFinite(defaultRowHeight) && defaultRowHeight > 0) {
        return defaultRowHeight;
    }

    return grid?.viewport?.rows?.[0]?.htmlElement?.offsetHeight || 1;
}

function buildGridOptions(profile, config) {
    return {
        data: {
            columns: getDataset(config.rows, config.columns)
        },
        rendering: {
            rows: {
                bufferSize: config.bufferSize,
                strictHeights: false,
                virtualization: profile.virtualization
            },
            columns: {
                resizing: {
                    mode: 'independent'
                }
            }
        },
        columnDefaults: {
            width: 120
        }
    };
}

async function destroyCurrentGrid() {
    if (state.currentGrid && typeof state.currentGrid.destroy === 'function') {
        state.currentGrid.destroy();
    }

    state.currentGrid = null;
    window.grid = void 0;
    els.container.innerHTML = '';

    await pause();
    await nextPaint();
}

async function createGrid(profile, config) {
    await destroyCurrentGrid();

    setShellSize(DEFAULTS.shellWidth, DEFAULTS.shellHeight);
    setCurrentProfile(profile.label);
    setStatus(`Initializing ${profile.label}`);

    await pause();
    await nextPaint();

    const started = performance.now();
    const grid = await Grid.grid(
        'container',
        buildGridOptions(profile, config),
        true
    );
    const readyMs = performance.now() - started;

    await nextPaint();

    const paintMs = performance.now() - started;

    state.currentGrid = grid;
    window.grid = grid;

    return {
        grid,
        init: {
            readyMs,
            paintMs,
            domRows: grid?.viewport?.rows?.length || 0,
            enabledColumns: grid?.enabledColumns?.length || config.columns,
            rowHeight: getRowHeight(grid)
        }
    };
}

function instrumentScroll(grid) {
    const virtualizer = grid?.viewport?.rowsVirtualizer;
    const stats = {
        renderDurations: [],
        scrollDurations: []
    };

    if (!virtualizer) {
        return {
            stats,
            restore() {}
        };
    }

    const originalRenderRows = virtualizer.renderRows;
    const originalScroll = virtualizer.scroll;

    if (typeof originalRenderRows === 'function') {
        virtualizer.renderRows = async function () {
            const started = performance.now();
            const result = await originalRenderRows.apply(this, arguments);

            stats.renderDurations.push(performance.now() - started);

            return result;
        };
    }

    if (typeof originalScroll === 'function') {
        virtualizer.scroll = async function () {
            const started = performance.now();
            const result = await originalScroll.apply(this, arguments);

            stats.scrollDurations.push(performance.now() - started);

            return result;
        };
    }

    return {
        stats,
        restore() {
            if (typeof originalRenderRows === 'function') {
                virtualizer.renderRows = originalRenderRows;
            }

            if (typeof originalScroll === 'function') {
                virtualizer.scroll = originalScroll;
            }
        }
    };
}

async function measureScroll(grid, config) {
    const tbody = grid?.viewport?.tbodyElement;

    if (!tbody) {
        return {
            durationMs: 0,
            rowsAdvanced: 0,
            achievedRowsPerSec: null,
            avgFps: null,
            p5Fps: null,
            minFps: null,
            avgRenderMs: null,
            p95RenderMs: null,
            maxRenderMs: null,
            avgScrollMs: null,
            p95ScrollMs: null,
            maxScrollMs: null,
            renderCount: 0,
            scrollCount: 0
        };
    }

    tbody.scrollTop = 0;
    await nextPaint();

    const maxScrollTop = Math.max(0, tbody.scrollHeight - tbody.clientHeight);

    if (!maxScrollTop) {
        return {
            durationMs: 0,
            rowsAdvanced: 0,
            achievedRowsPerSec: 0,
            avgFps: null,
            p5Fps: null,
            minFps: null,
            avgRenderMs: null,
            p95RenderMs: null,
            maxRenderMs: null,
            avgScrollMs: null,
            p95ScrollMs: null,
            maxScrollMs: null,
            renderCount: 0,
            scrollCount: 0
        };
    }

    const rowHeight = getRowHeight(grid);
    const pixelsPerMs = config.scrollRowsPerSec * rowHeight / 1000;
    const frameDurations = [];
    const instrumented = instrumentScroll(grid);

    let rowsAdvanced = 0;
    let direction = 1;
    let startTs = 0;
    let lastTs = 0;
    let lastScrollTop = 0;

    const started = performance.now();

    await new Promise(resolve => {
        function step(timestamp) {
            if (!startTs) {
                startTs = timestamp;
                lastTs = timestamp;
                lastScrollTop = tbody.scrollTop;
            }

            const delta = timestamp - lastTs;

            if (delta > 0) {
                frameDurations.push(delta);
            }

            lastTs = timestamp;

            let nextScrollTop =
                tbody.scrollTop +
                direction * pixelsPerMs * delta;

            if (nextScrollTop >= maxScrollTop) {
                nextScrollTop = maxScrollTop;
                direction = -1;
            } else if (nextScrollTop <= 0) {
                nextScrollTop = 0;
                direction = 1;
            }

            tbody.scrollTop = nextScrollTop;
            rowsAdvanced += Math.abs(nextScrollTop - lastScrollTop) / rowHeight;
            lastScrollTop = nextScrollTop;

            if (timestamp - startTs >= config.scrollDurationMs) {
                resolve();
                return;
            }

            requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    });

    await nextPaint();
    instrumented.restore();

    const durationMs = performance.now() - started;
    const fpsSamples = frameDurations
        .filter(duration => duration > 0)
        .map(duration => 1000 / duration);

    return {
        durationMs,
        rowsAdvanced,
        achievedRowsPerSec: durationMs ?
            rowsAdvanced / (durationMs / 1000) :
            null,
        avgFps: average(fpsSamples),
        p5Fps: percentile(fpsSamples, 0.05),
        minFps: fpsSamples.length ? Math.min.apply(null, fpsSamples) : null,
        avgRenderMs: average(instrumented.stats.renderDurations),
        p95RenderMs: percentile(instrumented.stats.renderDurations, 0.95),
        maxRenderMs: instrumented.stats.renderDurations.length ?
            Math.max.apply(null, instrumented.stats.renderDurations) :
            null,
        avgScrollMs: average(instrumented.stats.scrollDurations),
        p95ScrollMs: percentile(instrumented.stats.scrollDurations, 0.95),
        maxScrollMs: instrumented.stats.scrollDurations.length ?
            Math.max.apply(null, instrumented.stats.scrollDurations) :
            null,
        renderCount: instrumented.stats.renderDurations.length,
        scrollCount: instrumented.stats.scrollDurations.length
    };
}

function waitForNextReflow(viewport) {
    return new Promise(resolve => {
        const originalReflow = viewport.reflow;
        let resolved = false;
        let timerId = null;

        viewport.reflow = function () {
            const started = performance.now();
            const result = originalReflow.apply(this, arguments);
            const durationMs = performance.now() - started;

            if (!resolved) {
                resolved = true;
                clearTimeout(timerId);
                viewport.reflow = originalReflow;
                resolve({
                    durationMs,
                    timedOut: false
                });
            }

            return result;
        };

        timerId = setTimeout(() => {
            if (resolved) {
                return;
            }

            resolved = true;
            viewport.reflow = originalReflow;
            resolve({
                durationMs: null,
                timedOut: true
            });
        }, DEFAULTS.resizeTimeoutMs);
    });
}

async function measureResize(grid, config) {
    const viewport = grid?.viewport;

    if (!viewport) {
        return {
            avgLatencyMs: null,
            p95LatencyMs: null,
            maxLatencyMs: null,
            avgReflowMs: null,
            p95ReflowMs: null,
            maxReflowMs: null,
            timedOutCount: 0
        };
    }

    const latencies = [];
    const reflowDurations = [];
    let timedOutCount = 0;

    for (const size of buildResizeSequence(config.resizeIterations)) {
        const pendingReflow = waitForNextReflow(viewport);
        const started = performance.now();

        setShellSize(size.width, size.height);
        window.dispatchEvent(new Event('resize'));

        const reflowResult = await pendingReflow;

        await nextPaint();

        latencies.push(performance.now() - started);

        if (reflowResult.timedOut) {
            timedOutCount += 1;
        } else if (Number.isFinite(reflowResult.durationMs)) {
            reflowDurations.push(reflowResult.durationMs);
        }
    }

    const resetReflow = waitForNextReflow(viewport);

    setShellSize(DEFAULTS.shellWidth, DEFAULTS.shellHeight);
    window.dispatchEvent(new Event('resize'));
    await resetReflow;
    await nextPaint();

    return {
        avgLatencyMs: average(latencies),
        p95LatencyMs: percentile(latencies, 0.95),
        maxLatencyMs: latencies.length ? Math.max.apply(null, latencies) : null,
        avgReflowMs: average(reflowDurations),
        p95ReflowMs: percentile(reflowDurations, 0.95),
        maxReflowMs: reflowDurations.length ?
            Math.max.apply(null, reflowDurations) :
            null,
        timedOutCount
    };
}

function renderResults() {
    els.resultsBody.innerHTML = PROFILES.map(profile => {
        const result = state.results[profile.id];

        return `
            <tr data-profile-id="${profile.id}">
                <td class="bench-profile-name">${profile.label}</td>
                <td>${result ? formatCount(result.init.domRows) : '-'}</td>
                <td>${result ? formatMs(result.init.readyMs) : '-'}</td>
                <td>${result ? formatMs(result.init.paintMs) : '-'}</td>
                <td>${result ? formatNumber(result.scroll.avgFps) : '-'}</td>
                <td>${result ? formatNumber(result.scroll.p5Fps) : '-'}</td>
                <td>${result ? formatMs(result.scroll.p95RenderMs) : '-'}</td>
                <td>${result ? formatMs(result.scroll.p95ScrollMs) : '-'}</td>
                <td>${result ? formatMs(result.resize.avgLatencyMs) : '-'}</td>
                <td>${result ? formatMs(result.resize.p95LatencyMs) : '-'}</td>
            </tr>
        `;
    }).join('');
}

function renderDetails(result) {
    if (!result) {
        els.detailsOutput.textContent =
            'Run a benchmark to populate results.';
        return;
    }

    els.detailsOutput.textContent = [
        `${result.label}`,
        '',
        `Rows x columns: ${result.config.rows} x ${result.config.columns}`,
        result.config.clampedForFullDom ?
            `Requested rows: ${formatCount(result.config.requestedRows)}` :
            null,
        `Virtualization: ${result.profile.virtualization ? 'on' : 'off'}`,
        `Buffer size: ${result.config.bufferSize}`,
        '',
        '[Init]',
        `Ready: ${formatMs(result.init.readyMs)}`,
        `Ready + paint: ${formatMs(result.init.paintMs)}`,
        `Rows in DOM after init: ${formatCount(result.init.domRows)}`,
        `Enabled columns: ${formatCount(result.init.enabledColumns)}`,
        `Measured row height: ${formatNumber(result.init.rowHeight, 0)} px`,
        '',
        '[Fast scroll]',
        `Duration: ${formatMs(result.scroll.durationMs)}`,
        `Target rows/sec: ${formatCount(result.config.scrollRowsPerSec)}`,
        `Achieved rows/sec: ${formatNumber(
            result.scroll.achievedRowsPerSec
        )}`,
        `Rows advanced: ${formatCount(result.scroll.rowsAdvanced)}`,
        `Average FPS: ${formatNumber(result.scroll.avgFps)}`,
        `P5 FPS: ${formatNumber(result.scroll.p5Fps)}`,
        `Min FPS: ${formatNumber(result.scroll.minFps)}`,
        `Render calls: ${formatCount(result.scroll.renderCount)}`,
        `Scroll handler calls: ${formatCount(result.scroll.scrollCount)}`,
        `Average renderRows: ${formatMs(result.scroll.avgRenderMs)}`,
        `P95 renderRows: ${formatMs(result.scroll.p95RenderMs)}`,
        `Max renderRows: ${formatMs(result.scroll.maxRenderMs)}`,
        `Average scroll handler: ${formatMs(result.scroll.avgScrollMs)}`,
        `P95 scroll handler: ${formatMs(result.scroll.p95ScrollMs)}`,
        `Max scroll handler: ${formatMs(result.scroll.maxScrollMs)}`,
        '',
        '[Resize / reflow]',
        `Iterations: ${formatCount(result.config.resizeIterations)}`,
        `Average resize latency: ${formatMs(result.resize.avgLatencyMs)}`,
        `P95 resize latency: ${formatMs(result.resize.p95LatencyMs)}`,
        `Max resize latency: ${formatMs(result.resize.maxLatencyMs)}`,
        `Average reflow body: ${formatMs(result.resize.avgReflowMs)}`,
        `P95 reflow body: ${formatMs(result.resize.p95ReflowMs)}`,
        `Max reflow body: ${formatMs(result.resize.maxReflowMs)}`,
        `Resize timeouts: ${formatCount(result.resize.timedOutCount)}`
    ].filter(Boolean).join('\n');
}

async function runProfile(profile, config) {
    setStatus(`Running ${profile.label}`);

    const { grid, init } = await createGrid(profile, config);
    await pause();
    const scroll = await measureScroll(grid, config);
    await pause();
    const resize = await measureResize(grid, config);

    const result = {
        profile,
        label: profile.label,
        config,
        init,
        scroll,
        resize
    };

    state.results[profile.id] = result;
    state.lastResultId = profile.id;

    renderResults();
    renderDetails(result);
    setStatus(`Cleaning up ${profile.label}`);
    await destroyCurrentGrid();
    await pause(50);

    return result;
}

async function runBenchmarks(profiles) {
    if (state.running) {
        return [];
    }

    const requestedConfig = getConfig();
    const config = normalizeConfigForProfiles(requestedConfig, profiles);
    const results = [];

    state.running = true;
    setButtonsDisabled(true);

    if (config.clampedForFullDom) {
        setStatus(
            `Clamped rows to ${config.rows} to keep Full DOM responsive`
        );
        await pause(100);
    }

    try {
        for (const profile of profiles) {
            results.push(await runProfile(profile, config));
        }

        setStatus('Done');
        return results;
    } catch (error) {
        setStatus('Failed');
        els.detailsOutput.textContent =
            `${error && error.message ? error.message : error}`;
        return [];
    } finally {
        state.running = false;
        setButtonsDisabled(false);
    }
}

function clearResults() {
    state.results = {};
    state.lastResultId = null;
    renderResults();
    renderDetails(null);
    setStatus('Idle');
    setCurrentProfile(state.currentGrid ? els.currentProfile.textContent : '-');
}

els.runSuite.addEventListener('click', () => {
    void runBenchmarks(PROFILES);
});

els.runVirtualized.addEventListener('click', () => {
    void runBenchmarks([PROFILES[0]]);
});

els.runFullDom.addEventListener('click', () => {
    void runBenchmarks([PROFILES[1]]);
});

els.clearResults.addEventListener('click', clearResults);

els.gridVersion.textContent = Grid.version || 'unknown';
setShellSize(DEFAULTS.shellWidth, DEFAULTS.shellHeight);
renderResults();
renderDetails(null);

window.benchmark = {
    ready: true,
    run: async profileId => {
        const profile = PROFILES.find(item => item.id === profileId);

        if (!profile) {
            throw new Error(`Unknown profile: ${profileId}`);
        }

        const results = await runBenchmarks([profile]);

        return results[0];
    },
    runSuite: async () => runBenchmarks(PROFILES),
    clear: clearResults,
    getResults: () => JSON.parse(JSON.stringify(state.results))
};
