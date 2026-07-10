const form = document.getElementById('grid-options');
const columnCountInput = document.getElementById('column-count');
const rowCountInput = document.getElementById('row-count');
const columnBufferSizeInput = document.getElementById('column-buffer-size');
const strictWidthsInput = document.getElementById('strict-widths');
const columnsVirtualizationInput = document.getElementById(
    'columns-virtualization'
);
const multiRowHeaderInput = document.getElementById('multi-row-header');

let grid;
const appliedInputOptions = {
    columnCount: columnCountInput.valueAsNumber,
    rowCount: rowCountInput.valueAsNumber,
    columnBufferSize: columnBufferSizeInput.valueAsNumber
};

function getColumnId(columnIndex) {
    return 'metric-' + (columnIndex + 1);
}

function generateColumns(columnCount, rowCount) {
    const columns = {};

    for (let columnIndex = 0; columnIndex < columnCount; ++columnIndex) {
        const columnId = getColumnId(columnIndex);

        columns[columnId] = Array.from(
            { length: rowCount },
            (_value, rowIndex) => (
                ((rowIndex + 1) * (columnIndex + 3)) % 1000
            )
        );
    }

    return columns;
}

function generateMultiRowHeader(columnCount) {
    const groupSize = 12;
    const subgroupSize = 4;
    const header = [];

    for (
        let groupStart = 0;
        groupStart < columnCount;
        groupStart += groupSize
    ) {
        const groupEnd = Math.min(groupStart + groupSize, columnCount);
        const group = {
            format: 'Group ' + (header.length + 1),
            columns: []
        };

        for (
            let subgroupStart = groupStart;
            subgroupStart < groupEnd;
            subgroupStart += subgroupSize
        ) {
            const subgroupEnd = Math.min(
                subgroupStart + subgroupSize,
                groupEnd
            );

            group.columns.push({
                format: 'Set ' + (group.columns.length + 1),
                columns: Array.from(
                    { length: subgroupEnd - subgroupStart },
                    (_value, offset) => {
                        const columnIndex = subgroupStart + offset;

                        return {
                            columnId: getColumnId(columnIndex),
                            format: 'Metric ' + (columnIndex + 1)
                        };
                    }
                )
            });
        }

        header.push(group);
    }

    return header;
}

function getGridOptions() {
    const { columnCount, rowCount, columnBufferSize } = appliedInputOptions;
    const options = {
        data: {
            columns: generateColumns(columnCount, rowCount)
        },
        columnDefaults: {
            width: 100
        },
        rendering: {
            columns: {
                bufferSize: columnBufferSize,
                strictWidths: strictWidthsInput.checked,
                virtualization: columnsVirtualizationInput.checked
            },
            rows: {
                strictHeights: true
            }
        }
    };

    if (multiRowHeaderInput.checked) {
        options.header = generateMultiRowHeader(columnCount);
    }

    return options;
}

function renderGrid() {
    if (grid) {
        grid.destroy();
    }

    grid = Grid.grid('container', getGridOptions());
}

form.addEventListener('submit', event => {
    event.preventDefault();
    appliedInputOptions.columnCount = columnCountInput.valueAsNumber;
    appliedInputOptions.rowCount = rowCountInput.valueAsNumber;
    appliedInputOptions.columnBufferSize = columnBufferSizeInput.valueAsNumber;

    renderGrid();
});

strictWidthsInput.addEventListener('change', renderGrid);
columnsVirtualizationInput.addEventListener('change', renderGrid);
multiRowHeaderInput.addEventListener('change', renderGrid);

renderGrid();
