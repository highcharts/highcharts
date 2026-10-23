Highcharts.chart('container', {
    dataTable: {
        columns: {
            Year: [2023, 2024, 2025, 2026],
            Revenue: [12, 15, 14, 13],
            Label: ['', 'Max', '', 'Last']
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
        dataLabels: {
            enabled: true
        },
        dataMapping: {
            x: 'Year',
            y: 'Revenue',
            'dataLabels.format': 'Label'
        }
    }]
});
