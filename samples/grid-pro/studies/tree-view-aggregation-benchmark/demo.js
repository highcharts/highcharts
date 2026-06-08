const MAX_SOURCE_ROWS = 100000;
const ROOT_SEGMENT = 'Company';
const riskLabels = ['Low', 'Guarded', 'Elevated', 'High', 'Critical'];
const statIds = [
    'source-rows',
    'tree-nodes',
    'generated-parents',
    'visible-nodes',
    'build-time',
    'status'
];
const statElements = Object.fromEntries(
    statIds.map(id => [id, document.getElementById(id)])
);
const rowCountSelect = document.getElementById('row-count');
const buildGridButton = document.getElementById('build-grid');
const expandAllButton = document.getElementById('expand-all');
const collapseAllButton = document.getElementById('collapse-all');
const actionButtons = [
    buildGridButton,
    expandAllButton,
    collapseAllButton
];
const levelLabels = {
    divisions: Array.from({ length: 10 }, (_, i) => `Division ${i + 1}`),
    regions: Array.from({ length: 10 }, (_, i) => `Region ${i + 1}`),
    markets: Array.from({ length: 10 }, (_, i) => `Market ${i + 1}`),
    teams: Array.from({ length: 10 }, (_, i) => `Team ${i + 1}`),
    reps: Array.from({ length: 10 }, (_, i) => `Rep ${i + 1}`)
};
const state = {
    buildDuration: void 0,
    generatedParentCount: 0,
    grid: void 0,
    lastStatus: 'Idle',
    sourceRowCount: 0,
    totalTreeNodeCount: 0
};

function formatCount(value) {
    return typeof value === 'number' ? value.toLocaleString('en-US') : '-';
}

function formatDuration(value) {
    return typeof value === 'number' ? `${value.toFixed(1)} ms` : '-';
}

function setActionButtonsDisabled(disabled) {
    for (let i = 0, iEnd = actionButtons.length; i < iEnd; ++i) {
        actionButtons[i].disabled = disabled;
    }
}

function updateStats(status) {
    if (typeof status === 'string') {
        state.lastStatus = status;
    }

    const projectionState = state.grid?.treeView?.getProjectionState();

    statElements['source-rows'].textContent = formatCount(state.sourceRowCount);
    statElements['tree-nodes'].textContent = formatCount(
        state.totalTreeNodeCount
    );
    statElements['generated-parents'].textContent = formatCount(
        state.generatedParentCount
    );
    statElements['visible-nodes'].textContent = formatCount(
        projectionState?.rowIds.length
    );
    statElements['build-time'].textContent = formatDuration(
        state.buildDuration
    );
    statElements.status.textContent = state.lastStatus;
}

function afterRender() {
    return new Promise(resolve => {
        requestAnimationFrame(() => {
            requestAnimationFrame(resolve);
        });
    });
}

function createSourceColumns(rowCount) {
    const columns = {
        path: new Array(rowCount),
        budget: new Array(rowCount),
        actual: new Array(rowCount),
        headcount: new Array(rowCount),
        utilization: new Array(rowCount),
        risk: new Array(rowCount)
    };
    const generatedParentPaths = new Set();

    for (let rowIndex = 0; rowIndex < rowCount; ++rowIndex) {
        const divisionIndex = Math.floor(rowIndex / 10000) % 10;
        const regionIndex = Math.floor(rowIndex / 1000) % 10;
        const marketIndex = Math.floor(rowIndex / 100) % 10;
        const teamIndex = Math.floor(rowIndex / 10) % 10;
        const repIndex = rowIndex % 10;
        const segments = [
            ROOT_SEGMENT,
            levelLabels.divisions[divisionIndex],
            levelLabels.regions[regionIndex],
            levelLabels.markets[marketIndex],
            levelLabels.teams[teamIndex],
            levelLabels.reps[repIndex]
        ];
        let parentPath = '';

        for (let i = 0, iEnd = segments.length - 1; i < iEnd; ++i) {
            parentPath = parentPath ?
                `${parentPath}/${segments[i]}` :
                segments[i];
            generatedParentPaths.add(parentPath);
        }

        const budget = (
            260 +
            divisionIndex * 42 +
            regionIndex * 27 +
            marketIndex * 16 +
            teamIndex * 10 +
            repIndex * 7
        );
        const actual = (
            budget +
            ((rowIndex % 7) - 3) * 8 +
            marketIndex * 3 -
            teamIndex
        );

        columns.path[rowIndex] = segments.join('/');
        columns.budget[rowIndex] = budget;
        columns.actual[rowIndex] = actual;
        columns.headcount[rowIndex] = 1 + (repIndex % 4);
        columns.utilization[rowIndex] = (
            0.55 +
            (
                (
                    divisionIndex * 5 +
                    regionIndex * 3 +
                    marketIndex * 2 +
                    teamIndex +
                    repIndex
                ) % 32
            ) / 100
        );
        columns.risk[rowIndex] = (
            divisionIndex +
            marketIndex +
            repIndex
        ) % 5;
    }

    return {
        columns,
        generatedParentCount: generatedParentPaths.size,
        totalTreeNodeCount: rowCount + generatedParentPaths.size
    };
}

async function buildGrid() {
    const sourceRowCount = Math.min(
        MAX_SOURCE_ROWS,
        Number(rowCountSelect.value) || MAX_SOURCE_ROWS
    );
    const sourceData = createSourceColumns(sourceRowCount);

    setActionButtonsDisabled(true);
    updateStats('Building...');

    if (state.grid) {
        state.grid.destroy();
        state.grid = void 0;
    }

    const start = performance.now();
    state.grid = await Grid.grid('container', {
        data: {
            columns: sourceData.columns,
            treeView: {
                input: {
                    type: 'path',
                    showFullPath: false
                },
                treeColumn: 'path',
                expandedRowIds: []
            }
        },
        columnDefaults: {
            width: 118,
            cells: {
                editMode: {
                    enabled: true
                }
            }
        },
        columns: [{
            id: 'path',
            width: 'auto',
            header: {
                format: 'Org unit'
            }
        }, {
            id: 'budget',
            header: {
                format: 'Budget'
            },
            cells: {
                format: '${value:,0f}'
            },
            treeView: {
                aggregate: 'SUM'
            }
        }, {
            id: 'actual',
            header: {
                format: 'Actual'
            },
            cells: {
                format: '${value:,0f}'
            },
            treeView: {
                aggregate: 'SUM'
            }
        }, {
            id: 'headcount',
            header: {
                format: 'Headcount'
            },
            cells: {
                format: '{value:,0f}'
            },
            treeView: {
                aggregate: 'SUM'
            }
        }, {
            id: 'utilization',
            header: {
                format: 'Utilization'
            },
            cells: {
                format: '{(multiply 100 value):.1f}%'
            },
            treeView: {
                aggregate: 'AVERAGE'
            }
        }, {
            id: 'risk',
            header: {
                format: 'Risk'
            },
            cells: {
                formatter() {
                    const value = this.value;

                    if (typeof value !== 'number') {
                        return '';
                    }

                    const level = Math.max(
                        0,
                        Math.min(4, Math.round(value))
                    );

                    return (
                        '<span class="risk-pill risk-' +
                        level +
                        '">' +
                        riskLabels[level] +
                        '</span>'
                    );
                }
            },
            treeView: {
                aggregate: 'MAX'
            }
        }],
        header: [
            'path',
            'budget',
            'actual',
            'headcount',
            'utilization',
            'risk'
        ],
        rendering: {
            rows: {
                virtualization: true
            }
        }
    }, true);

    await afterRender();

    state.sourceRowCount = sourceRowCount;
    state.generatedParentCount = sourceData.generatedParentCount;
    state.totalTreeNodeCount = sourceData.totalTreeNodeCount;
    state.buildDuration = performance.now() - start;

    setActionButtonsDisabled(false);
    updateStats('Ready');

    window.grid = state.grid;
}

async function runTreeAction(label, action) {
    if (!state.grid?.treeView) {
        return;
    }

    setActionButtonsDisabled(true);
    updateStats(`${label}...`);

    const start = performance.now();
    await action();
    await afterRender();
    updateStats(`${label} (${formatDuration(performance.now() - start)})`);

    setActionButtonsDisabled(false);
}

buildGridButton.addEventListener('click', () => {
    void buildGrid();
});

expandAllButton.addEventListener('click', () => {
    void runTreeAction('Expanded all', () => state.grid.treeView.expandAll());
});

collapseAllButton.addEventListener('click', () => {
    void runTreeAction(
        'Collapsed all',
        () => state.grid.treeView.collapseAll()
    );
});

window.rebuildTreeViewAggregationBenchmark = buildGrid;
window.getTreeViewAggregationBenchmarkStats = function () {
    const projectionState = state.grid?.treeView?.getProjectionState();

    return {
        buildDuration: state.buildDuration,
        generatedParentCount: state.generatedParentCount,
        renderedRows: document.querySelectorAll('#container tbody .hcg-row')
            .length,
        status: state.lastStatus,
        sourceRowCount: state.sourceRowCount,
        totalTreeNodeCount: state.totalTreeNodeCount,
        visibleNodes: projectionState?.rowIds.length ?? 0
    };
};

void buildGrid();
