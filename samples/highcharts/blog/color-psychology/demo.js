Highcharts.chart('container', {
    chart: {
        type: 'line',
        backgroundColor: '#fafafa'
    },

    title: {
        text: 'Business Performance Dashboard',
        style: {
            color: '#333333',
            fontSize: '24px',
            fontWeight: 'bold'
        }
    },

    subtitle: {
        text: `Psychologically-informed color coding 
        for intuitive data interpretation`
    },

    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May',
            'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ]
    },

    yAxis: {
        min: 0,
        title: {
            text: 'Performance Index'
        },
        plotBands: [{
            from: 0,
            to: 30,
            color: 'rgba(220, 53, 69, 0.1)',
            label: {
                text: 'Critical Zone',
                style: { color: '#dc3545' },
                y: 0
            }
        }, {
            from: 30,
            to: 70,
            color: 'rgba(255, 193, 7, 0.1)',
            label: {
                text: 'Warning Zone',
                style: { color: '#ffc107' },
                y: -10
            }
        }, {
            from: 70,
            to: 100,
            color: 'rgba(40, 167, 69, 0.1)',
            label: {
                text: 'Optimal Zone',
                style: { color: '#28a745' },
                y: -10
            }
        }]
    },

    colors: [
        '#28a745', // Green for revenue (growth, positive)
        '#17a2b8', // Blue for customer satisfaction (trust, stability)
        '#6f42c1', // Purple for market share (premium, aspirational)
        '#fd7e14', // Orange for operational efficiency (energy, attention)
        '#dc3545'  // Red for cost ratio (concern, action needed)
    ],

    legend: {
        symbolWidth: 40
    },

    plotOptions: {
        line: {
            lineWidth: 3,
            marker: {
                enabled: true,
                radius: 6,
                lineWidth: 2,
                lineColor: '#ffffff'
            }
        }
    },

    tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        formatter: function () {
            let fillColor = '#28a745';

            if (this.y < 30) {
                fillColor = '#dc3545';
            } else if (this.y < 70) {
                fillColor = '#ffc107';
            }

            return `<b>${this.series.name}</b>
                <br/>${this.key}:
                <span style="fill: ${fillColor}; font-weight: bold;">
                    ${this.y}
                </span>`;
        }
    },

    series: [{
        name: 'Revenue Growth',
        data: [45, 52, 61, 58, 67, 73, 78, 82, 79, 85, 88, 92],
        color: '#28a745'
    }, {
        name: 'Customer Satisfaction',
        data: [72, 75, 73, 76, 78, 82, 79, 83, 85, 87, 84, 89],
        color: '#17a2b8'
    }, {
        name: 'Market Share',
        data: [22, 35, 42, 48, 52, 55, 58, 62, 59, 65, 68, 71],
        color: '#6f42c1'
    }, {
        name: 'Operational Efficiency',
        data: [65, 63, 68, 71, 69, 74, 77, 75, 79, 81, 83, 86],
        color: '#fd7e14'
    }, {
        name: 'Cost Ratio',
        data: [82, 79, 76, 73, 69, 65, 62, 58, 55, 52, 48, 45],
        color: '#dc3545'
    }],

    accessibility: {
        enabled: true,
        description: `Business performance dashboard showing 
        five key metrics over twelve months`
    }
});