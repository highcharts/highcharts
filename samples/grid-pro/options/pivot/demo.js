Grid.grid('container', {
    data: {
        columns: {
            region: [
                'Europe', 'Europe', 'Europe', 'Europe',
                'Asia', 'Asia', 'Asia'
            ],
            country: [
                'Norway', 'Norway', 'Poland', 'Poland',
                'Japan', 'Japan', 'India'
            ],
            year: [2025, 2026, 2025, 2026, 2025, 2026, 2026],
            sales: [100, 140, 80, 60, 200, 160, 90],
            units: [3, 4, 2, 1, 5, 4, 2]
        }
    },
    pivot: {
        enabled: true,
        rows: ['region', 'country'],
        columns: ['year'],
        values: [{
            columnId: 'sales',
            aggregator: 'SUM'
        }, {
            columnId: 'units',
            aggregator: 'AVERAGE'
        }],
        totals: {
            subtotals: true,
            grandTotalRow: 'bottom',
            grandTotalColumn: 'end'
        }
    },
    columns: [{
        id: 'pivotRows',
        header: {
            format: 'Region / country'
        },
        width: 190
    }, {
        id: 'sales',
        header: {
            format: 'Sales'
        },
        cells: {
            format: '${value:,0f}'
        }
    }, {
        id: 'units',
        header: {
            format: 'Units'
        },
        cells: {
            format: '{value:.2f}'
        }
    }],
    rendering: {
        rows: {
            expandedLevels: 'all'
        }
    }
});
