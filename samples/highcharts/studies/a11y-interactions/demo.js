Highcharts.patterns[0].color = '#ccc';
Highcharts.setOptions({
    chart: {
        marginTop: 80
    },
    accessibility: {
        enabled: false
    },
    title: {
        align: 'left'
    },
    credits: {
        enabled: false
    }
});


// Bar chart
Highcharts.chart('delays', {
    chart: {
        type: 'bar',
        marginTop: 40
    },
    title: {
        text: 'Flights delayed on average'
    },
    subtitle: {
        text: 'Source: Bureau of Transportation Statistics'
    },
    xAxis: {
        visible: false
    },
    yAxis: {
        visible: false,
        max: 100,
        endOnTick: false
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            stacking: 'percentage',
            borderRadius: 5,
            borderWidth: 3,
            enableMouseTracking: false,
            dataLabels: {
                enabled: true,
                y: 80,
                format: '{series.name}<br><b>{point.y:.2f}%</b>',
                style: {
                    color: '#222',
                    textOutline: 'none',
                    fontWeight: 'normal'
                }
            }
        }
    },
    series: [{
        name: 'On time',
        color: '#16A27F',
        data: [77.89]
    }, {
        name: 'Delayed (>15 min)',
        color: '#DB3D6D',
        data: [22.11]
    }]
});


// Pie chart
Highcharts.chart('accidents', {
    chart: {
        marginTop: 50,
        marginBottom: 0
    },
    title: {
        text: 'Accident causes for large aircrafts'
    },
    subtitle: {
        text: '2023 numbers. Source: National Transportation Safety Board'
    },
    colors: [
        '#393B3C', '#258AE9', '#E23689', '#B78D1A', '#6D9C82',
        { patternIndex: 0 }
    ],
    tooltip: {
        headerFormat: '',
        pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        series: {
            innerSize: '50%',
            borderWidth: 3,
            dataLabels: {
                enabled: true,
                format: '{point.name}: {point.percentage:.1f}%'
            }
        }
    },
    series: [{
        type: 'pie',
        data: [
            {
                name: 'Turbulence encounter',
                y: 16,
                dataLabels: {
                    distance: -25,
                    backgroundColor: 'rgba(250, 250, 250, 0.75)',
                    borderRadius: 8,
                    style: {
                        textOutline: 'none',
                        color: '#222',
                        padding: 8
                    }
                }
            },
            ['Abnormal Runway Contact', 6],
            ['System/component failure', 2],
            ['Bird strike', 1],
            ['Ground collision', 1],
            ['Other', 5]
        ]
    }]
});


// Line chart
const historicalData = document.getElementById('historical-data')
    .textContent.split('\n').map(line =>
        line.split(',').map(
            (val, i) => (i ? parseFloat(val) : val)
        )
    );

Highcharts.chart('historical', {
    chart: {
        type: 'spline',
        marginTop: 60
    },
    colors: ['#3B73ED', '#16a34a', '#d97706', '#dc2626'],
    title: {
        text: 'Average airfare prices in the US'
    },
    subtitle: {
        text: 'Source: Bureau of Transportation Statistics'
    },
    yAxis: {
        title: {
            enabled: false
        },
        labels: {
            format: '${value}'
        },
        max: 550,
        endOnTick: false
    },
    plotOptions: {
        series: {
            pointStart: 1993,
            marker: {
                enabled: false
            }
        }
    },
    legend: {
        layout: 'proximate',
        align: 'right',
        verticalAlign: 'middle'
    },
    series: historicalData.slice(1).map(s => ({ name: s[0], data: s.slice(1) }))
});


// Network graph
const links = document.getElementById('airline-routes')
        .textContent.split('\n').map(line => line.split(',')),
    // Define nodes based on links, bigger nodes for more connections
    nodesObj = links.reduce((acc, [src, dest]) => {
        acc[src] = acc[src] || [];
        if (!acc[src].includes(dest)) {
            acc[src].push(dest);
        }
        return acc;
    }, {}),
    maxLen = Math.max(...Object.values(nodesObj).map(val => val.length)),
    colors = ['#0D47A1', '#2D4791', '#1976D2', '#0097A7', '#00796B'],
    nodes = Object.entries(nodesObj).map(([key, val]) => ({
        id: key,
        marker: {
            radius: Math.max(2, Math.round(val.length / maxLen * 20))
        },
        color: colors[Math.round(val.length / maxLen * (colors.length - 1))]
    }));

// Create the chart
Highcharts.chart('network', {
    chart: {
        marginTop: 30
    },
    title: {
        text: 'Airline routes in the US'
    },
    subtitle: {
        text: 'Selected airports and routes<br>Source: OpenFlight'
    },
    series: [{
        type: 'networkgraph',
        keys: ['from', 'to'],
        draggable: false,
        color: colors[0],
        layoutAlgorithm: {
            enableSimulation: true,
            maxIterations: 120,
            approximation: 'barnes-hut',
            integration: 'verlet',
            linkLength: 260,
            friction: -0.6,
            maxSpeed: 0.5,
            repulsiveForce: (d, k) => (k - d) / d * (k > d ? 1 : 0.1)
        },
        link: {
            color: '#689',
            opacity: 0.15
        },
        states: {
            inactive: {
                opacity: 0.3,
                linkOpacity: 0.05
            },
            hover: {
                linkOpacity: 0.5,
                lineWidthPlus: 2,
                halo: false
            }
        },
        dataLabels: {
            enabled: true,
            filter: {
                operator: '>',
                property: 'mass',
                value: 12
            },
            linkFormat: ''
        },
        nodes,
        data: links
    }]
});


// Wordcloud
const wordcloudData = document.getElementById('wordcloud-data')
    .textContent.split('\n').map(line => {
        const arr = line.split(',');
        return [arr[0], parseFloat(arr[1])];
    });

Highcharts.chart('wordcloud', {
    colors: ['#4a5a6a', '#8b6a58', '#3b5c5c', '#7a6b42', '#5e4630', '#2a3b4e'],
    title: {
        text: 'Word cloud of recent travel news'
    },
    subtitle: {
        text: 'From a collection of news articles across the web'
    },
    tooltip: {
        enabled: false
    },
    series: [{
        type: 'wordcloud',
        data: wordcloudData,
        inactiveOtherPoints: true,
        states: {
            inactive: {
                opacity: 0.4
            },
            hover: {
                color: '#222'
            }
        },
        name: 'Occurrences',
        rotation: {
            to: 0
        },
        maxFontSize: 42
    }]
});
