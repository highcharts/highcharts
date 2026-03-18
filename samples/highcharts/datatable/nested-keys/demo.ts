Highcharts.chart('container', {
    dataTable: {
        columns: {
            year: [2023, 2024, 2025, 2026],
            revenue: [12, 15, 14, 13],
            label: ['', 'Max', '', 'Last']
        }
    },
    chart: {
        type: 'column'
    },
    title: {
        text: 'Nested data mapping keys'
    },
    subtitle: {
        text: 'Mapping to nested keys, e.g. <em>dataLabels.format</em>'
    },
    series: [{
        name: 'Revenue',
        dataLabels: {
            enabled: true
        },
        dataMapping: {
            x: 'year',
            y: 'revenue',
            'dataLabels.format': 'label'
        }
    }]
});
