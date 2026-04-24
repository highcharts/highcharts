// ============================================================
// 1. Default gauge — shows what you get out of the box.
//    New defaults: arc background, labels outside, modern dial.
// ============================================================
Highcharts.chart('gauge-01', {
    chart: { type: 'gauge' },
    title: { text: 'Default look' },
    yAxis: {
        min: 0,
        max: 100,
        plotBands: [
            { from: 0,  to: 50,  color: '#55BF3B' },
            { from: 50, to: 75,  color: '#DDDF0D' },
            { from: 75, to: 100, color: '#DF5353' }
        ]
    },
    series: [{
        name: 'Score',
        data: [68],
        tooltip: { valueSuffix: ' / 100' }
    }],
    credits: { enabled: false }
});


// ============================================================
// 2. Rounded pane — pane.borderRadius: '50%' rounds the arc
//    ends. Grid lines splits up the arc into segments.
// ============================================================
Highcharts.chart('gauge-02', {
    chart: { type: 'gauge' },
    title: { text: 'Rounded ends' },
    pane: {
        innerSize: '75%',
        borderRadius: '50%'
    },
    yAxis: {
        min: 0,
        max: 100,
        gridLineWidth: 1,
        tickWidth: 0,
        minorTickWidth: 0,
        plotBands: [
            { from: 0,  to: 60,  color: '#85c1e9' }, // light blue
            { from: 60, to: 80,  color: '#2980b9' }, // blue
            { from: 80, to: 100, color: '#1a5276' }  // dark blue
        ]
    },
    series: [{
        name: 'Score',
        data: [72],
        tooltip: { valueSuffix: ' / 100' },
        // Slim elongated needle — long reach, barely any width,
        // large flat disc pivot that anchors it visually.
        dial: {
            radius: '80%',
            backgroundColor: '#2980b9',
            baseWidth: '5%',
            topWidth: '1%',
            rearLength: '0%',
            borderRadius: '50%'
        },
        pivot: {
            radius: '5%',
            backgroundColor: '#2980b9',
            borderWidth: 0
        }
    }],
    credits: { enabled: false }
});


// ============================================================
// 3. Thin ring of plot bands inside the pane. Visible axis
//    line and ticks on the outside.
// ============================================================
Highcharts.chart('gauge-03', {
    chart: { type: 'gauge' },
    title: { text: 'Thin ring' },
    pane: {
        borderRadius: '50%',
        background: null,
        margin: 20
    },
    yAxis: {
        labels: {
            distance: '20%'
        },
        lineWidth: 1,
        min: 0,
        max: 100,
        offset: 0,
        tickPosition: 'outside',
        minorTickPosition: 'outside',
        plotBands: [
            // light purple
            {
                from: 0,
                to: 70,
                color: '#d2b4de',
                outerRadius: '90%',
                innerRadius: '80%'
            },
            // deep purple
            {
                from: 70,
                to: 100,
                color: '#8e44ad',
                outerRadius: '90%',
                innerRadius: '80%'
            }
        ]
    },
    plotOptions: {
        gauge: {
            dial: {
                baseWidth: 6
            }
        }
    },
    series: [{
        name: 'Score',
        data: [45],
        tooltip: { valueSuffix: ' / 100' }
    }],
    credits: { enabled: false }
});


// ============================================================
// 4. Wide semicircle — classic dashboard gauge.
//    Explicit startAngle / endAngle; labels outside by default.
// ============================================================
Highcharts.chart('gauge-04', {
    chart: { type: 'gauge' },
    title: { text: 'Semicircle' },
    pane: {
        startAngle: -90,
        endAngle: 90,
        borderRadius: '50%'
    },
    yAxis: {
        min: 0,
        max: 200,
        labels: { distance: 20 },
        plotBands: [
            { from: 0,   to: 120, color: '#f0b429' }, // amber
            { from: 120, to: 160, color: '#e07b39' }, // orange
            { from: 160, to: 200, color: '#c0392b' }  // deep red
        ]
    },
    series: [{
        name: 'Speed',
        data: [110],
        tooltip: { valueSuffix: ' km/h' },
        dataLabels: { format: '{y} km/h' },
        // Broad spade — wide base that narrows sharply to a fine
        // tip; sits low for a classic speedometer look.
        dial: {
            radius: '80%',
            baseWidth: '12%',
            topWidth: '1%',
            baseLength: '15%',
            rearLength: '0%',
            borderRadius: '4%',
            backgroundColor: '#c0392b'
        },
        pivot: {
            radius: '5%',
            backgroundColor: '#c0392b',
            borderWidth: 0
        }
    }],
    credits: { enabled: false }
});


// ============================================================
// 5. Custom pivot — big hollowed pivot, short dial radius.
//    Demonstrates pivot.radius as percentage + hollow border.
// ============================================================
Highcharts.chart('gauge-05', {
    chart: { type: 'gauge' },
    title: { text: 'Custom pivot' },
    pane: {
        startAngle: -150,
        endAngle: 150,
        innerSize: '70%',
        borderRadius: 0
    },
    yAxis: {
        min: 0,
        max: 100,
        tickWidth: 0,
        minorTickWidth: 0,
        plotBands: [
            { from: 0,  to: 60,  color: '#76d7c4' }, // light teal
            { from: 60, to: 100, color: '#148f77' }  // deep teal
        ]
    },
    plotOptions: {
        gauge: {
            dataLabels: {
                verticalAlign: 'middle',
                y: 0,
                zIndex: 3,
                style: {
                    color: 'light-dark(#148f77, #76d7c4)',
                    textOutline: 'none'
                }
            },
            dial: {
                radius: '60%',
                backgroundColor: 'light-dark(#148f77, #76d7c4)',
                baseLength: '70%',
                baseWidth: '60%',
                borderRadius: 0,
                topWidth: 0
            },
            pivot: {
                radius: '50%',
                borderWidth: 5,
                borderColor: 'light-dark(#148f77, #76d7c4)',
                backgroundColor: 'var(--highcharts-background-color)'
            }
        }
    },
    series: [{
        name: 'Score',
        data: [78],
        tooltip: { valueSuffix: ' / 100' }
    }],
    credits: { enabled: false }
});


// ============================================================
// 6. Gauge + solidgauge combo — dial on top of a solid fill.
//    Both share the same pane; solidgauge carries the threshold.
// ============================================================
Highcharts.chart('gauge-06', {
    chart: { height: '100%' },
    title: { text: 'Combo' },
    pane: {
        borderRadius: '50%'
    },
    yAxis: {
        min: 0,
        max: 100,
        stops: [
            [0.3, '#1abc9c'], // teal
            [0.6, '#2980b9'], // blue
            [0.9, '#8e44ad']  // purple
        ]
    },
    plotOptions: {
        gauge: {
            // Hair-line needle: zero base width, pointed tip,
            // full length — the solid fill does all the visual work.
            dial: {
                radius: '80%',
                baseWidth: '1%',
                topWidth: '1%',
                rearLength: 0,
                borderRadius: 0,
                backgroundColor: 'var(--highcharts-neutral-color-100)'
            }
        }
    },
    series: [{
        type: 'solidgauge',
        name: 'Target',
        data: [60],
        dataLabels: { enabled: false }
    }, {
        type: 'gauge',
        name: 'Actual',
        data: [74]
    }],
    credits: { enabled: false }
});


// ============================================================
// 7. Solid semicircle — fuel/battery style.
//    innerSize on the pane drives the hollow; stop colors.
// ============================================================
Highcharts.chart('gauge-07', {
    chart: { type: 'solidgauge', height: '80%' },
    title: { text: 'Fuel level' },
    pane: {
        startAngle: -90,
        endAngle: 90,
        innerSize: '60%'
    },
    tooltip: { enabled: false },
    yAxis: {
        min: 0,
        max: 100,
        stops: [
            [0.1, '#DF5353'],
            [0.5, '#DDDF0D'],
            [0.9, '#55BF3B']
        ],
        tickAmount: 2,
        title: { text: 'Fuel', y: -60 }
    },
    plotOptions: {
        solidgauge: {
            dataLabels: {
                format: '{y}%',
                style: {
                    fontSize: '1.4em',
                    fontWeight: 'bold'
                },
                y: -8
            }
        }
    },
    series: [{ name: 'Fuel', data: [64] }],
    credits: { enabled: false }
});


// ============================================================
// 8. Full-circle ring — single ring activity gauge.
//    pane.startAngle 0 → 360; rounded ends; subtitle label.
// ============================================================
Highcharts.chart('gauge-08', {
    chart: { type: 'solidgauge', height: '100%' },
    title: { text: 'Activity' },
    pane: {
        startAngle: 0,
        endAngle: 360,
        innerSize: '75%',
        margin: 0
    },
    tooltip: { enabled: false },
    yAxis: { min: 0, max: 100, lineWidth: 0, tickPositions: [] },
    series: [{
        name: 'Steps',
        data: [{
            color: {
                linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 },
                stops: [
                    [0, '#e91e8c'],
                    [1, '#ff6b6b']
                ]
            },
            y: 79
        }],
        dataLabels: {
            format: '{y}%<br><span style="font-size:0.8em;color:#888">' +
                'steps</span>'
        },
        rounded: true
    }],
    credits: { enabled: false }
});


// ============================================================
// 9. Multi-ring KPI — three concentric solidgauge rings.
//    Each ring is a series; pane.background provides tracks.
//    Updated percentages to match new pane defaults (no 112%).
// ============================================================
Highcharts.chart('gauge-09', {
    chart: { type: 'solidgauge', height: '100%' },
    title: { text: 'KPI Overview' },
    tooltip: {
        backgroundColor: 'none',
        borderWidth: 0,
        shadow: false,
        pointFormat:
            '<span style="color:{point.color};font-weight:bold">' +
            '{series.name}: {point.y}%</span>'
    },
    pane: {
        startAngle: 0,
        endAngle: 360,
        margin: 0,
        background: [{
            outerRadius: '100%',
            innerRadius: '78%',
            backgroundColor: `color-mix(
                in srgb,
                var(--highcharts-color-0) 25%,
                transparent
            )`,
            borderWidth: 0
        }, {
            outerRadius: '77%',
            innerRadius: '56%',
            backgroundColor: `color-mix(
                in srgb,
                var(--highcharts-color-1) 25%,
                transparent
            )`,
            borderWidth: 0
        }, {
            outerRadius: '55%',
            innerRadius: '34%',
            backgroundColor: `color-mix(
                in srgb,
                var(--highcharts-color-2) 25%,
                transparent
            )`,
            borderWidth: 0
        }]
    },
    yAxis: { min: 0, max: 100, lineWidth: 0, tickPositions: [] },
    plotOptions: {
        solidgauge: {
            dataLabels: { enabled: false },
            linecap: 'round',
            rounded: true
        }
    },
    series: [{
        name: 'Conversion',
        data: [{
            color: 'var(--highcharts-color-0)',
            radius: '100%',
            innerRadius: '78%',
            y: 82
        }]
    }, {
        name: 'Engagement',
        data: [{
            color: 'var(--highcharts-color-1)',
            radius: '77%',
            innerRadius: '56%',
            y: 59
        }]
    }, {
        name: 'Retention',
        data: [{
            color: 'var(--highcharts-color-2)',
            radius: '55%',
            innerRadius: '34%',
            y: 71
        }]
    }],
    credits: { enabled: false }
});


// ============================================================
// 10. Wide arc, individual corner radius for plot bands
// ============================================================
Highcharts.chart('gauge-10', {
    chart: { type: 'gauge' },
    title: { text: 'Rounded bands' },
    pane: {
        startAngle: -150,
        endAngle: 150,
        background: null,
        borderRadius: '25%'
    },
    yAxis: {
        min: 0,
        max: 100,
        plotBands: [
            { from: 0,  to: 49.8,  color: '#a9cce3' }, // pale blue
            { from: 50, to: 74.8,  color: '#5dade2' }, // sky blue
            { from: 75, to: 100, color: '#8e44ad' }  // violet
        ]
    },
    series: [{
        name: 'Value',
        data: [55],
        tooltip: { valueSuffix: ' / 100' }
    }],
    credits: { enabled: false }
});


// ============================================================
// 11. Solid gauge with threshold — negative range, below zero
//     turns red. Uses the new `threshold: 0` default behavior.
// ============================================================
Highcharts.chart('gauge-11', {
    chart: { type: 'solidgauge' },
    title: { text: 'Threshold' },
    pane: {
        borderRadius: 0,
        innerSize: '80%'
    },
    tooltip: { enabled: false },
    yAxis: {
        min: -4,
        max: 4,
        tickAmount: 2,
        stops: [
            [0.4999, '#55BF3B'],
            [0.5,    '#DF5353']
        ],
        title: { text: 'Loss', y: 20 },
        plotLines: [{
            value: 0,
            color: 'var(--highcharts-neutral-color-100)',
            width: 2,
            zIndex: 5
        }]
    },
    series: [{
        name: 'Loss',
        data: [-1.2],
        threshold: 0,
        dataLabels: {
            style: {
                fontSize: '1.2em',
                fontWeight: 'bold'
            }
        },
        tooltip: { valueSuffix: ' %' }
    }],
    credits: { enabled: false }
});


// ============================================================
// 12. Custom dial path — a circular dot instead of a needle.
//     Demonstrates dial.path for fully custom dial shapes.
// ============================================================
Highcharts.chart('gauge-12', {
    chart: { type: 'gauge' },
    title: { text: 'Custom dial' },
    pane: {
        startAngle: -120,
        endAngle: 120,
        innerSize: 160,
        borderRadius: '50%',
        size: 180
    },
    yAxis: {
        min: 0,
        max: 100,
        tickWidth: 0,
        minorTickWidth: 0,
        labels: { style: { color: '#fff', fontWeight: 'bold' } }
    },
    series: [{
        type: 'solidgauge',
        data: [75],
        enableMouseTracking: false
    }, {
        name: 'Value',
        data: [{
            className: 'linked-to-primary',
            y: 75
        }],
        tooltip: { valueSuffix: ' / 100' },
        dial: {
            // A small dot that travels along the ring
            path: [
                ['M', 78, 0],
                ['a', 6, 6, 0, 1, 1, 12, 12],
                ['a', 6, 6, 0, 1, 1, -12, -12]
            ],
            backgroundColor: 'var(--highcharts-background-color)',
            borderColor: 'var(--highcharts-color-0)',
            borderWidth: 5,
            radius: '100%'
        },
        pivot: { radius: 0 },
        dataLabels: {
            verticalAlign: 'middle',
            y: 0
        }
    }],
    credits: { enabled: false }
});

// Add some life to all gauges
setInterval(() => {
    Highcharts.charts.forEach(chart => {
        chart?.series.forEach(series => {
            series.points.forEach(point => {
                const { max, min } = point.series.yAxis;
                const newVal = Math.round(
                    point.y + (Math.random() - 0.5) * (max - min) * 0.2
                );
                point.update(
                    Math.max(min, Math.min(max, newVal)),
                    false
                );

                if (point.options.className === 'linked-to-primary') {
                    point.update(chart.series[0].points[0].y, false);
                }
            });
        });
        chart?.redraw();
    });
}, 2000);
