const ROW_COUNT = 100000;
const COLUMN_COUNT = 20;
const DEFAULT_ROWS_PER_SECOND = 5000;

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

function generateColumns(rowCount, colCount) {
    const random = createSeededRandom(1337);
    const columns = {};

    for (let c = 0; c < colCount; c++) {
        columns[`Col ${c + 1}`] = new Array(rowCount);
    }

    for (let r = 0; r < rowCount; r++) {
        columns['Col 1'][r] = r + 1;
        columns['Col 2'][r] = `Row ${r + 1}`;
        for (let c = 2; c < colCount; c++) {
            columns[`Col ${c + 1}`][r] = Math.floor(random() * 1000);
        }
    }

    return columns;
}

const els = {
    run: document.getElementById('run'),
    stop: document.getElementById('stop'),
    reset: document.getElementById('reset'),
    rowsPerSec: document.getElementById('rows-per-sec'),
    adaptiveMode: document.getElementById('adaptive-mode'),
    targetFps: document.getElementById('target-fps'),
    stepRowsPerSec: document.getElementById('step-rows-per-sec'),
    status: document.getElementById('status'),
    visibleRows: document.getElementById('visible-rows'),
    rowHeight: document.getElementById('row-height'),
    bufferSize: document.getElementById('buffer-size'),
    renderCount: document.getElementById('render-count'),
    avgRender: document.getElementById('avg-render'),
    p95Render: document.getElementById('p95-render'),
    maxRender: document.getElementById('max-render'),
    totalRender: document.getElementById('total-render'),
    avgScroll: document.getElementById('avg-scroll'),
    p95Scroll: document.getElementById('p95-scroll'),
    maxScroll: document.getElementById('max-scroll'),
    totalScroll: document.getElementById('total-scroll'),
    avgFps: document.getElementById('avg-fps'),
    p95Fps: document.getElementById('p95-fps'),
    medianFps: document.getElementById('median-fps'),
    p5Fps: document.getElementById('p5-fps'),
    minFps: document.getElementById('min-fps'),
    maxStableRows: document.getElementById('max-stable-rows'),
    rowsAdvanced: document.getElementById('rows-advanced'),
    rendersPerSec: document.getElementById('renders-per-sec'),
    rowsPerSecOut: document.getElementById('rows-per-sec-out'),
    runTime: document.getElementById('run-time')
};

const stats = {
    durations: [],
    scrollDurations: [],
    renderCount: 0,
    scrollCount: 0,
    totalDuration: 0,
    totalScrollDuration: 0,
    maxDuration: 0,
    maxScrollDuration: 0,
    fpsSamples: [],
    avgFps: null,
    p95Fps: null,
    medianFps: null,
    p5Fps: null,
    minFps: null,
    maxStableRowsPerSec: null,
    rowsAdvanced: 0,
    startTime: 0,
    endTime: 0,
    p95: null,
    p95Scroll: null
};

let grid;
let rowsVirtualizer;
let tbodyElement;
let rowHeight;
let isRunning = false;
let isMeasuring = false;
let rafId;
let fpsRafId;
let lastFrameTime;
let lastRowCursor;
let lastFpsTime;
let fpsFrameCount = 0;
let adaptiveLastChangeTime = 0;
let adaptiveRowsPerSec = 0;
let readyResolve;
const readyPromise = new Promise(resolve => {
    readyResolve = resolve;
});

const benchmark = {
    ready: false,
    status: 'Idle',
    whenReady: readyPromise
};

function formatMs(value) {
    if (!Number.isFinite(value)) {
        return '-';
    }
    return `${value.toFixed(2)} ms`;
}

function formatNumber(value) {
    if (!Number.isFinite(value)) {
        return '-';
    }
    return value.toFixed(1);
}

function resetStats() {
    stats.durations = [];
    stats.scrollDurations = [];
    stats.renderCount = 0;
    stats.scrollCount = 0;
    stats.totalDuration = 0;
    stats.totalScrollDuration = 0;
    stats.maxDuration = 0;
    stats.maxScrollDuration = 0;
    stats.fpsSamples = [];
    stats.avgFps = null;
    stats.p95Fps = null;
    stats.medianFps = null;
    stats.p5Fps = null;
    stats.minFps = null;
    stats.maxStableRowsPerSec = null;
    stats.rowsAdvanced = 0;
    stats.startTime = 0;
    stats.endTime = 0;
    stats.p95 = null;
    stats.p95Scroll = null;
    lastRowCursor = void 0;
    updateStats();
}

function updateStats() {
    let totalTime = 0;
    if (stats.endTime) {
        totalTime = stats.endTime - stats.startTime;
    } else if (stats.startTime) {
        totalTime = performance.now() - stats.startTime;
    }

    const average = stats.renderCount ?
        stats.totalDuration / stats.renderCount :
        0;
    const rendersPerSec = totalTime ?
        stats.renderCount / (totalTime / 1000) :
        0;

    const rowsPerSec = totalTime ?
        stats.rowsAdvanced / (totalTime / 1000) :
        0;
    const averageScroll = stats.scrollCount ?
        stats.totalScrollDuration / stats.scrollCount :
        0;
    const avgFps = stats.avgFps;
    const p95Fps = stats.p95Fps;
    const medianFps = stats.medianFps;
    const p5Fps = stats.p5Fps;
    const minFps = stats.minFps;
    const maxStableRows = stats.maxStableRowsPerSec;

    els.renderCount.textContent = stats.renderCount.toString();
    els.avgRender.textContent = stats.renderCount ?
        formatMs(average) :
        '-';
    els.avgScroll.textContent = stats.scrollCount ?
        formatMs(averageScroll) :
        '-';
    els.p95Render.textContent = stats.p95 === null ?
        '-' :
        formatMs(stats.p95);
    els.p95Scroll.textContent = stats.p95Scroll === null ?
        '-' :
        formatMs(stats.p95Scroll);
    els.maxRender.textContent = stats.renderCount ?
        formatMs(stats.maxDuration) :
        '-';
    els.maxScroll.textContent = stats.scrollCount ?
        formatMs(stats.maxScrollDuration) :
        '-';
    els.totalRender.textContent = stats.renderCount ?
        formatMs(stats.totalDuration) :
        '-';
    els.totalScroll.textContent = stats.scrollCount ?
        formatMs(stats.totalScrollDuration) :
        '-';
    els.avgFps.textContent = avgFps === null ?
        '-' :
        avgFps.toFixed(1);
    els.p95Fps.textContent = p95Fps === null ?
        '-' :
        p95Fps.toFixed(1);
    els.medianFps.textContent = medianFps === null ?
        '-' :
        medianFps.toFixed(1);
    els.p5Fps.textContent = p5Fps === null ?
        '-' :
        p5Fps.toFixed(1);
    els.minFps.textContent = minFps === null ?
        '-' :
        minFps.toFixed(1);
    els.maxStableRows.textContent = maxStableRows === null ?
        '-' :
        String(Math.max(0, Math.round(maxStableRows)));
    els.rowsAdvanced.textContent = stats.rowsAdvanced.toString();
    els.rendersPerSec.textContent = stats.renderCount ?
        formatNumber(rendersPerSec) :
        '-';
    els.rowsPerSecOut.textContent = stats.renderCount ?
        formatNumber(rowsPerSec) :
        '-';
    els.runTime.textContent = totalTime ?
        formatMs(totalTime) :
        '-';
}

function updateGridMeta() {
    const visibleRows = grid?.viewport?.rows?.length || 0;
    const bufferSize = grid?.options?.rendering?.rows?.bufferSize ?? 10;
    els.visibleRows.textContent = visibleRows.toString();
    els.rowHeight.textContent = rowHeight ?
        `${rowHeight}px` :
        '-';
    els.bufferSize.textContent = bufferSize.toString();
}

function setStatus(text) {
    els.status.textContent = text;
    benchmark.status = text;
}

function percentile(values, ratio) {
    if (!values.length) {
        return 0;
    }
    const sorted = values.slice().sort((a, b) => a - b);
    const index = Math.min(
        sorted.length - 1,
        Math.max(0, Math.ceil(sorted.length * ratio) - 1)
    );
    return sorted[index];
}

function startBenchmark() {
    if (!tbodyElement || !rowHeight) {
        return;
    }

    stopBenchmark();
    resetStats();

    isRunning = true;
    isMeasuring = true;
    stats.startTime = performance.now();
    lastFrameTime = stats.startTime;
    startFpsTracking();
    startAdaptiveMode();

    tbodyElement.scrollTop = 0;

    els.run.disabled = true;
    els.stop.disabled = false;
    setStatus('Running');

    rafId = requestAnimationFrame(tick);
}

function startManualBenchmark() {
    if (!tbodyElement || !rowHeight) {
        return;
    }

    stopBenchmark();
    resetStats();

    isRunning = true;
    isMeasuring = true;
    stats.startTime = performance.now();

    tbodyElement.scrollTop = 0;

    els.run.disabled = true;
    els.stop.disabled = false;
    setStatus('Running');
}

function stopBenchmark() {
    if (!isRunning) {
        setStatus('Idle');
        return;
    }

    isRunning = false;
    isMeasuring = false;
    stats.endTime = performance.now();
    stats.p95 = percentile(stats.durations, 0.95);
    stats.p95Scroll = percentile(stats.scrollDurations, 0.95);
    finalizeFps();

    if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = void 0;
    }

    if (fpsRafId) {
        cancelAnimationFrame(fpsRafId);
        fpsRafId = void 0;
    }

    els.run.disabled = false;
    els.stop.disabled = true;
    setStatus('Done');
    updateStats();
}

function stepBenchmark(deltaMs) {
    if (!isRunning || !rowHeight) {
        return true;
    }

    const rowsPerSecond = Number(els.rowsPerSec.value) ||
        DEFAULT_ROWS_PER_SECOND;
    const pixelsPerSecond = rowsPerSecond * rowHeight;
    const delta = pixelsPerSecond * (deltaMs / 1000);

    const maxScrollTop = tbodyElement.scrollHeight -
        tbodyElement.clientHeight;
    const nextScrollTop = Math.min(
        maxScrollTop,
        tbodyElement.scrollTop + delta
    );

    tbodyElement.scrollTop = nextScrollTop;
    const virtualizer = grid?.viewport?.rowsVirtualizer;
    if (virtualizer) {
        const start = performance.now();
        const applyScroll = virtualizer.applyScroll;
        if (typeof applyScroll === 'function') {
            applyScroll.call(virtualizer);
        } else {
            virtualizer.scroll();
        }
        const duration = performance.now() - start;
        stats.scrollDurations.push(duration);
        stats.scrollCount += 1;
        stats.totalScrollDuration += duration;
        stats.maxScrollDuration = Math.max(stats.maxScrollDuration, duration);
    }

    if (nextScrollTop >= maxScrollTop) {
        stopBenchmark();
        return true;
    }

    updateStats();
    return false;
}

function tick(timestamp) {
    if (!isRunning) {
        return;
    }

    const elapsed = timestamp - lastFrameTime;
    const rowsPerSecond = Number(els.rowsPerSec.value) ||
        DEFAULT_ROWS_PER_SECOND;
    const pixelsPerSecond = rowsPerSecond * rowHeight;
    const delta = pixelsPerSecond * (elapsed / 1000);

    lastFrameTime = timestamp;

    const maxScrollTop = tbodyElement.scrollHeight -
        tbodyElement.clientHeight;
    const nextScrollTop = Math.min(
        maxScrollTop,
        tbodyElement.scrollTop + delta
    );

    tbodyElement.scrollTop = nextScrollTop;

    if (nextScrollTop >= maxScrollTop) {
        stopBenchmark();
        return;
    }

    updateStats();
    updateAdaptiveMode();
    rafId = requestAnimationFrame(tick);
}

function startFpsTracking() {
    lastFpsTime = performance.now();
    fpsFrameCount = 0;

    const track = () => {
        if (!isRunning) {
            return;
        }

        fpsFrameCount += 1;
        const now = performance.now();
        const elapsed = now - lastFpsTime;
        if (elapsed >= 1000) {
            const fps = fpsFrameCount / (elapsed / 1000);
            stats.fpsSamples.push(fps);
            lastFpsTime = now;
            fpsFrameCount = 0;
        }

        fpsRafId = requestAnimationFrame(track);
    };

    fpsRafId = requestAnimationFrame(track);
}

function startAdaptiveMode() {
    if (!els.adaptiveMode.checked) {
        return;
    }

    adaptiveLastChangeTime = performance.now();
    adaptiveRowsPerSec = Number(els.rowsPerSec.value) ||
        DEFAULT_ROWS_PER_SECOND;
}

function updateAdaptiveMode() {
    if (!els.adaptiveMode.checked) {
        return;
    }

    const now = performance.now();
    if (now - adaptiveLastChangeTime < 1000) {
        return;
    }

    const targetFps = Number(els.targetFps.value) || 30;
    const stepRows = Number(els.stepRowsPerSec.value) || 1000;
    const samples = stats.fpsSamples;
    const windowSize = 3;
    if (samples.length < windowSize) {
        adaptiveLastChangeTime = now;
        return;
    }

    const recent = samples.slice(-windowSize);
    const avgRecent = recent.reduce((sum, value) => sum + value, 0) /
        recent.length;

    if (avgRecent < targetFps) {
        stats.maxStableRowsPerSec = adaptiveRowsPerSec - stepRows;
        stopBenchmark();
        return;
    }

    adaptiveRowsPerSec += stepRows;
    els.rowsPerSec.value = String(adaptiveRowsPerSec);
    adaptiveLastChangeTime = now;
}

function finalizeFps() {
    if (!stats.fpsSamples.length) {
        stats.avgFps = null;
        stats.p95Fps = null;
        return;
    }

    const total = stats.fpsSamples.reduce((sum, value) => sum + value, 0);
    stats.avgFps = total / stats.fpsSamples.length;
    stats.p95Fps = percentile(stats.fpsSamples, 0.95);
    stats.medianFps = percentile(stats.fpsSamples, 0.5);
    stats.p5Fps = percentile(stats.fpsSamples, 0.05);
    stats.minFps = Math.min.apply(null, stats.fpsSamples);
}

function patchVirtualizer() {
    const originalRenderRows = rowsVirtualizer.renderRows.bind(rowsVirtualizer);

    rowsVirtualizer.renderRows = function (rowCursor) {
        if (!isMeasuring) {
            return originalRenderRows(rowCursor);
        }

        const start = performance.now();
        const result = originalRenderRows(rowCursor);
        const duration = performance.now() - start;

        stats.durations.push(duration);
        stats.renderCount += 1;
        stats.totalDuration += duration;
        stats.maxDuration = Math.max(stats.maxDuration, duration);

        if (lastRowCursor !== void 0) {
            stats.rowsAdvanced += Math.abs(rowCursor - lastRowCursor);
        }
        lastRowCursor = rowCursor;

        return result;
    };

    benchmark.isPatched = true;
}

function init() {
    els.rowsPerSec.value = DEFAULT_ROWS_PER_SECOND.toString();

    grid = Grid.grid('container', {
        dataTable: {
            columns: generateColumns(ROW_COUNT, COLUMN_COUNT)
        },
        rendering: {
            rows: {
                bufferSize: 10,
                minVisibleRows: null,
                strictHeights: false,
                virtualization: true
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
    }, true);

    Promise.resolve(grid).then(gridInstance => {
        grid = gridInstance;
        window.grid = grid;

        rowsVirtualizer = grid.viewport.rowsVirtualizer;
        tbodyElement = grid.viewport.tbodyElement;
        rowHeight = rowsVirtualizer.defaultRowHeight;

        patchVirtualizer();
        updateGridMeta();

        benchmark.ready = true;
        readyResolve();
    });
}

els.run.addEventListener('click', startBenchmark);
els.stop.addEventListener('click', stopBenchmark);
els.reset.addEventListener('click', () => {
    stopBenchmark();
    resetStats();
    setStatus('Idle');
});

benchmark.start = startBenchmark;
benchmark.startManual = startManualBenchmark;
benchmark.stop = stopBenchmark;
benchmark.reset = resetStats;
benchmark.step = stepBenchmark;
benchmark.setRowsPerSecond = value => {
    els.rowsPerSec.value = String(value);
};
benchmark.getStats = () => {
    let totalTime = 0;
    if (stats.endTime) {
        totalTime = stats.endTime - stats.startTime;
    } else if (stats.startTime) {
        totalTime = performance.now() - stats.startTime;
    }

    const average = stats.renderCount ?
        stats.totalDuration / stats.renderCount :
        0;
    const rendersPerSec = totalTime ?
        stats.renderCount / (totalTime / 1000) :
        0;
    const rowsPerSec = totalTime ?
        stats.rowsAdvanced / (totalTime / 1000) :
        0;
    const averageScroll = stats.scrollCount ?
        stats.totalScrollDuration / stats.scrollCount :
        0;
    const avgFps = stats.avgFps;
    const p95Fps = stats.p95Fps;
    const medianFps = stats.medianFps;
    const p5Fps = stats.p5Fps;
    const minFps = stats.minFps;
    const maxStableRowsPerSec = stats.maxStableRowsPerSec;

    return {
        status: benchmark.status,
        rowCount: ROW_COUNT,
        columnCount: COLUMN_COUNT,
        visibleRows: grid?.viewport?.rows?.length || 0,
        rowHeight,
        bufferSize: grid?.options?.rendering?.rows?.bufferSize ?? 10,
        renderCount: stats.renderCount,
        totalDuration: stats.totalDuration,
        averageDuration: average,
        p95Duration: stats.p95 ??
            percentile(stats.durations, 0.95),
        maxDuration: stats.maxDuration,
        totalScrollDuration: stats.totalScrollDuration,
        averageScrollDuration: averageScroll,
        p95ScrollDuration: stats.p95Scroll ??
            percentile(stats.scrollDurations, 0.95),
        maxScrollDuration: stats.maxScrollDuration,
        averageFps: avgFps,
        p95Fps,
        medianFps,
        p5Fps,
        minFps,
        maxStableRowsPerSec,
        rowsAdvanced: stats.rowsAdvanced,
        rendersPerSec,
        rowsPerSec,
        runTime: totalTime
    };
};

window.gridBenchmark = benchmark;

init();
