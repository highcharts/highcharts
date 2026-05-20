const riskLabels = ['Low', 'Guarded', 'Elevated', 'High', 'Critical'];

const columns = {
    path: [
        'Company/Sales/Americas/East',
        'Company/Sales/Americas/West',
        'Company/Sales/EMEA/Germany',
        'Company/Sales/EMEA/France',
        'Company/Marketing/Brand',
        'Company/Marketing/Demand Gen',
        'Company/Engineering/Platform',
        'Company/Engineering/Applications',
        'Company/Engineering/Infrastructure'
    ],
    budget: [
        480, 420, 390, 340, 260,
        340, 550, 610, 480
    ],
    actual: [
        460, 418, 401, 382, 248,
        351, 570, 632, 498
    ],
    headcount: [
        10, 8, 9, 7, 6,
        7, 13, 14, 12
    ],
    utilization: [
        0.71, 0.76, 0.82, 0.78, 0.63,
        0.68, 0.79, 0.76, 0.84
    ],
    risk: [
        0, 1, 0, 3, 0,
        0, 1, 2, 4
    ],
    id: [
        'amw', 'ame', 'ger', 'fra', 'bra',
        'dem', 'pla', 'app', 'inf'
    ]
};

Grid.grid('container', {
    data: {
        columns,
        idColumn: 'id',
        treeView: {
            enabled: true,
            expandedRowIds: 'all'
        }
    },
    columnDefaults: {
        width: 124,
        cells: {
            editMode: {
                enabled: true
            }
        }
    },
    columns: [{
        id: 'path',
        header: {
            format: 'Team / Department'
        },
        width: 'auto'
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

                if (!value && value !== 0) {
                    return '';
                }

                const level = Math.max(0, Math.min(4, Math.round(+value)));

                return (
                    level +
                    ' <span class="risk-label risk-label-' + level + '">' +
                    riskLabels[level] +
                    '</span>'
                );
            }
        },
        treeView: {
            aggregate(context) {
                return context.depth === 0 ? false : 'MAX';
            }
        }
    }],
    header: [
        'path',
        'budget',
        'actual',
        'headcount',
        'utilization',
        'risk'
    ]
});
