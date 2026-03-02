Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Pattern Fill: Global vs Anchored to Point'
    },
    subtitle: {
        text: 'Compare pattern consistency across different column widths'
    },
    xAxis: {
        categories: ['Small', 'Medium', 'Large', 'Extra Large', 'Tiny']
    },
    yAxis: {
        title: {
            text: 'Values'
        }
    },
    legend: {
        enabled: true
    },
    plotOptions: {
        column: {
            borderRadius: 5
        }
    },
    series: [{
        name: 'Global Pattern (Default)',
        data: [5, 10, 15, 20, 2],
        color: {
            pattern: {
                path: 'M 0 0 L 5 5 M 4.5 -0.5 L 5.5 0.5 M -0.5 4.5 L 0.5 5.5',
                color: '#102045',
                width: 10,
                height: 10,
                anchorToPoint: false // Traditional global pattern
            }
        }
    }, {
        name: 'Anchored to Point',
        data: [3, 8, 13, 18, 1],
        color: {
            pattern: {
                path: 'M 0 0 L 5 5 M 4.5 -0.5 L 5.5 0.5 M -0.5 4.5 L 0.5 5.5',
                color: '#900000',
                width: 10,
                height: 10,
                anchorToPoint: true // NEW: Each column gets its own pattern
            }
        }
    }, {
        name: 'Different Pattern Anchored',
        data: [2, 6, 11, 16, 0.5],
        color: {
            pattern: {
                path: 'M 2 0 L 2 5 M 4 0 L 4 5',
                color: '#006600',
                width: 8,
                height: 8,
                anchorToPoint: true
            }
        }
    }]
});