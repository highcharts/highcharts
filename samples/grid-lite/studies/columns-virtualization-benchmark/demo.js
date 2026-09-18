const ROW_COUNT = 300;
const COLUMN_COUNT = 500;
const COLUMN_WIDTH = 120;

const benchmarkCases = [{
    id: 'no-virtualization',
    name: 'No column virtualization',
    virtualization: false,
    strictWidths: false
}, {
    id: 'virtualization',
    name: 'Column virtualization',
    virtualization: true,
    strictWidths: false
}, {
    id: 'virtualization-strict-widths',
    name: 'Column virtualization + strict widths',
    virtualization: true,
    strictWidths: true
}];

const elements = {
    container: document.getElementById('container'),
    results: document.getElementById('benchmark-results'),
    run: document.getElementById('run-benchmark'),
    status: document.getElementById('benchmark-status')
};

const resultRows = {};
const dataColumns = generateColumns(ROW_COUNT, COLUMN_COUNT);
let grid;
let activeRunId = 0;

function getColumnId(columnIndex) {
    return 'Metric ' + (columnIndex + 1);
}

function generateColumns(rowCount, columnCount) {
    const columns = {};

    for (let columnIndex = 0; columnIndex < columnCount; ++columnIndex) {
        const values = new Array(rowCount);

        for (let rowIndex = 0; rowIndex < rowCount; ++rowIndex) {
            values[rowIndex] = (
                ((rowIndex + 1) * (columnIndex + 3)) % 1000
            );
        }

        columns[getColumnId(columnIndex)] = values;
    }

    return columns;
}

function formatDuration(value) {
    return value.toFixed(2) + ' ms';
}

function formatBoolean(value) {
    return value ? 'On' : 'Off';
}

function waitForFrame() {
    return new Promise(resolve => requestAnimationFrame(resolve));
}

function destroyGrid() {
    if (grid) {
        grid.destroy();
        grid = void 0;
    }

    elements.container.innerHTML = '';
}

function getGridOptions(benchmarkCase) {
    return {
        caption: {
            text: benchmarkCase.name
        },
        data: {
            columns: dataColumns
        },
        columnDefaults: {
            width: COLUMN_WIDTH
        },
        rendering: {
            columns: {
                bufferSize: 2,
                strictWidths: benchmarkCase.strictWidths,
                virtualization: benchmarkCase.virtualization
            },
            rows: {
                strictHeights: true,
                virtualization: true
            }
        }
    };
}

function getRenderedGridStats() {
    const bodyRows = elements.container.querySelectorAll('tbody tr');
    const bodyColumnCount = bodyRows[0]?.children.length || 0;
    const bodyRowCount = bodyRows.length;

    return {
        bodyRows: bodyRowCount,
        bodyColumns: bodyColumnCount,
        bodyCells: bodyRowCount * bodyColumnCount
    };
}

function createResultRows() {
    for (const benchmarkCase of benchmarkCases) {
        const row = elements.results.insertRow();
        const cells = {
            name: row.insertCell(),
            virtualization: row.insertCell(),
            strictWidths: row.insertCell(),
            init: row.insertCell(),
            nextFrame: row.insertCell(),
            secondFrame: row.insertCell(),
            rows: row.insertCell(),
            columns: row.insertCell(),
            cells: row.insertCell()
        };

        cells.name.textContent = benchmarkCase.name;
        cells.virtualization.textContent = formatBoolean(
            benchmarkCase.virtualization
        );
        cells.strictWidths.textContent = formatBoolean(
            benchmarkCase.strictWidths
        );

        resultRows[benchmarkCase.id] = {
            row,
            cells
        };
    }
}

function resetResultRows() {
    for (const benchmarkCase of benchmarkCases) {
        const { row, cells } = resultRows[benchmarkCase.id];

        row.classList.remove('benchmark-result-running');
        cells.init.textContent = '-';
        cells.nextFrame.textContent = '-';
        cells.secondFrame.textContent = '-';
        cells.rows.textContent = '-';
        cells.columns.textContent = '-';
        cells.cells.textContent = '-';
    }
}

function setCaseRunning(benchmarkCase) {
    for (const currentCase of benchmarkCases) {
        resultRows[currentCase.id].row.classList.toggle(
            'benchmark-result-running',
            currentCase === benchmarkCase
        );
    }
}

function updateResultRow(benchmarkCase, result) {
    const { row, cells } = resultRows[benchmarkCase.id];

    row.classList.remove('benchmark-result-running');
    cells.init.textContent = formatDuration(result.initDuration);
    cells.nextFrame.textContent = formatDuration(result.nextFrameDuration);
    cells.secondFrame.textContent = formatDuration(
        result.secondFrameDuration
    );
    cells.rows.textContent = result.bodyRows.toString();
    cells.columns.textContent = result.bodyColumns.toString();
    cells.cells.textContent = result.bodyCells.toString();
}

async function measureCase(benchmarkCase) {
    destroyGrid();
    await waitForFrame();

    const startTime = performance.now();

    grid = await Grid.grid(
        elements.container,
        getGridOptions(benchmarkCase),
        true
    );
    const initializedTime = performance.now();

    await waitForFrame();
    const nextFrameTime = performance.now();

    await waitForFrame();
    const secondFrameTime = performance.now();

    return {
        initDuration: initializedTime - startTime,
        nextFrameDuration: nextFrameTime - startTime,
        secondFrameDuration: secondFrameTime - startTime,
        ...getRenderedGridStats()
    };
}

async function runBenchmark() {
    const runId = ++activeRunId;

    elements.run.disabled = true;
    elements.status.textContent = 'Running...';
    resetResultRows();

    try {
        for (const benchmarkCase of benchmarkCases) {
            if (runId !== activeRunId) {
                return;
            }

            elements.status.textContent = 'Running: ' + benchmarkCase.name;
            setCaseRunning(benchmarkCase);

            const result = await measureCase(benchmarkCase);

            if (runId !== activeRunId) {
                return;
            }

            updateResultRow(benchmarkCase, result);
        }

        elements.status.textContent = 'Done';
    } catch (error) {
        elements.status.textContent = 'Failed';
        throw error;
    } finally {
        if (runId === activeRunId) {
            setCaseRunning();
            elements.run.disabled = false;
        }
    }
}

createResultRows();
resetResultRows();

elements.run.addEventListener('click', () => {
    void runBenchmark();
});

window.columnVirtualizationBenchmark = {
    cases: benchmarkCases,
    run: runBenchmark
};
