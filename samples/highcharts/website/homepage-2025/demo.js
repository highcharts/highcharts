const DEBUG_ANIM = false;
function logAnim(msg) {
    if (DEBUG_ANIM) {
        console.log('[DemoAnim]', msg);
    }
}

// Set up the image path
const imagePath = 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@e9aa64ce242d425c3d2ef93a18e5a84cd7313101/samples/graphics/homepage/';

// reduced motion
// eslint-disable-next-line max-len
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let isPaused = false;
let gridControls = null;
let currentChart = null;
let dashboardsBuilt = false;

// Incremented on every slide change. Async demos capture it before loading
// and bail out if the carousel has moved on, so a slow request can never
// render into the container of a later slide.
let slideToken = 0;

// Remote data is fetched once and reused on later carousel cycles.
let morningstarDataPromise = null;
let mapTopologyPromise = null;

// All demos share styled mode. This used to be set inside dashboards(),
// which is now built lazily, so set it globally up front.
Highcharts.setOptions({
    chart: {
        styledMode: true
    }
});

// Track per-chart animation states (true = running)
const chartAnimationState = {
    stock: false,
    maps: false,
    grid: false
};
if (!reducedMotion) {
    // Start all animations by default for non-reduced-motion users
    chartAnimationState.stock = true;
    chartAnimationState.maps = true;
    chartAnimationState.grid = true;
}


// common data label format for the pie chart
function pieLabels() {
    let color = '#000';
    if (this.index === 0) {
        color = '#fff';
    }
    return `<span style="font-size:12px;
    color:${color};background:rgba(0,0,0,0.1);
    border-radius:3px;padding:2px 5px;">
    ${this.point.y}%</span>`;
}

// Seed real Orbit layers using the built-in tools' analysis operations.
const orbitLayerSeeds = new WeakSet();
// Offline visual tests do not load the external Orbit module.
Highcharts.orbit?.registerTool({
    id: 'homepage-analysis',
    name: 'Homepage analysis',
    description: 'Initialize the homepage chart analysis',
    group: 'analyze',
    behavior: 'action',
    contentTypes: ['chart'],
    create: () => ({
        canActivate: ctx => (
            ctx.originalOptions.orbit?.initialTool === 'homepage-analysis' &&
            !orbitLayerSeeds.has(ctx.content)
        ),
        activate(ctx) {
            orbitLayerSeeds.add(ctx.content);
            const params = { series: ['Target', 'Walmart'] };
            const tools = Highcharts.orbit.getRegisteredTools();
            [
                ['anomaly', 'Anomaly Detection'],
                ['trendline', 'Trend Line']
            ].forEach(([id, description]) => {
                const tool = tools.find(definition => definition.id === id)
                    .create();
                const ops = tool.apply(params, ctx);
                if (ops.length) {
                    ctx.ledger.upsertOps(
                        `tool:${id}:set`,
                        `tool:${id}`,
                        description,
                        ops,
                        params
                    );
                }
            });
        },
        deactivate() {}
    })
});

// Target and Walmart stock comparison with Orbit
const orbitChart = {
    chart: {
        styledMode: false,
        type: 'spline',
        events: {
            render() {
                // Shared styled-mode CSS overrides SVG presentation attributes.
                // Preserve Orbit's per-point anomaly colors with inline styles.
                this.series.forEach(series => {
                    series.points.forEach(point => {
                        const marker = point.options.marker;
                        if (marker && marker.fillColor && point.graphic) {
                            point.graphic.css({
                                fill: marker.fillColor,
                                stroke: marker.lineColor,
                                strokeWidth: marker.lineWidth
                            });
                        }
                    });
                });
            }
        }
    },
    orbit: {
        enabled: true,
        initialTool: 'homepage-analysis'
    },
    data: {
        csv: document.getElementById('csv').innerText
    },
    title: {
        text: 'Target vs Walmart Weekly Stock Prices'
    },
    subtitle: {
        text: 'Split adjusted, from Jan 2021 to Apr 2026.'
    },
    xAxis: {
        type: 'datetime',
        crosshair: true,
        labels: { format: '{value:%Y}' }
    },
    yAxis: {
        min: 0,
        title: { text: 'Close Price (USD)' },
        labels: { format: '${value:,.0f}' }
    },
    plotOptions: {
        spline: {
            marker: {
                enabled: false
            }
        }
    },
    series: [{}, {
        dashStyle: 'shortdash'
    }],
    tooltip: {
        shared: true,
        valuePrefix: '$',
        valueDecimals: 2
    }
};

// Core pie chart
const coreChart = {
    accessibility: {
        screenReaderSection: {
            beforeChartFormat: '',
            afterChartFormat: ''
        },
        keyboardNavigation: {
            enabled: false
        }
    },
    chart: {
        type: 'pie',
        backgroundColor: 'transparent'
    },
    credits: {
        enabled: false
    },
    title: {
        text: null
    },
    tooltip: {
        headerFormat: `<span style="font-size: 12px;">
        {point.series.name}</span><br>`,
        pointFormat: `<span style="color:{point.color}">\u25CF</span>
        <span style="font-weight:bold;
        font-size:14px;">{point.name}: {point.y}%</span>`,
        useHTML: true,
        outside: true
    },
    series: [
        {
            name: 'Favorite Waffle Toppings',
            showInLegend: true,
            allowPointSelect: true,
            size: '80%',
            center: ['50%', '55%'],
            borderWidth: 0,
            borderRadius: 0,
            data: [
                { name: 'Strawberry jam', y: 69 },
                { name: 'Brown cheese', y: 12 },
                { name: 'Sour cream', y: 9 },
                { name: 'Butter & sugar', y: 6 },
                { name: 'Other', y: 4 }
            ]
        }],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 530
            },
            chartOptions: {
                legend: {
                    enabled: true,
                    itemStyle: {
                        color: 'var(--text-primary)'
                    }
                },
                plotOptions: {
                    series: {
                        dataLabels: [{
                            enabled: false
                        },
                        {
                            enabled: true,
                            distance: '-26%',
                            useHTML: true,
                            formatter: function () {
                                return pieLabels.call(this);
                            }
                        }]
                    }
                }
            }
        },
        {
            condition: {
                minWidth: 531
            },
            chartOptions: {
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        dataLabels: [{
                            enabled: true,
                            distance: 20,
                            format: '{point.name}',
                            style: {
                                color: 'var(--text-primary)',
                                textOutline: 'none'
                            }
                        },
                        {
                            enabled: true,
                            allowOverlap: true,
                            distance: '-16%',
                            useHTML: true,
                            formatter: function () {
                                return pieLabels.call(this);
                            }
                        }]
                    }
                }
            }
        }]
    }
};

// Stock live candlestick
let csInterval;
// let stopped = false;
let csSeries;

// Imitate getting point from backend
function getNewPoint(i, data) {
    const lastPoint = data[data.length - 1];

    // Add new point
    if (i === 0 || i % 10 === 0) {
        return [
            lastPoint[0] + 60000,
            lastPoint[4],
            lastPoint[4],
            lastPoint[4],
            lastPoint[4]
        ];
    }
    const updatedLastPoint = data[data.length - 1],
        newClose = Highcharts.correctFloat(
            lastPoint[4] + Highcharts.correctFloat(Math.random() - 0.5, 2),
            4
        );

    // Modify last data point
    return [
        updatedLastPoint[0],
        data[data.length - 2][4],
        newClose >= updatedLastPoint[2] ? newClose : updatedLastPoint[2],
        newClose <= updatedLastPoint[3] ? newClose : updatedLastPoint[3],
        newClose
    ];
}

function animateCS() {
    if (!csSeries || !csSeries.options || !csSeries.options.data) {
        return;
    }

    let i = 0;
    csInterval = setInterval(() => {
        if (!csSeries || !csSeries.options || !csSeries.options.data) {
            clearInterval(csInterval);
            return;
        }

        const data = csSeries.options.data,
            newPoint = getNewPoint(i, data),
            lastPoint = data[data.length - 1];

        if (lastPoint[0] !== newPoint[0]) {
            csSeries.addPoint(newPoint);
        } else {
            csSeries.options.data[data.length - 1] = newPoint;
            csSeries.setData(data);
        }

        i++;
    }, 100);
}
function cs() {

    // Define a custom symbol path
    Highcharts.SVGRenderer.prototype.symbols.oval = function (x, y, w, h) {
        const r = w / 2;

        return [
            'M', x, y,
            'A', r, r, 0, 1, 1, x + w, y,
            'L', x + w, y + h,
            'A', r, r, 0, 1, 1, x, y + h,
            'L', x, y,
            'Z'
        ];
    };

    const options = {
        accessibility: {
            screenReaderSection: {
                beforeChartFormat: '',
                afterChartFormat: ''
            },
            keyboardNavigation: {
                enabled: false
            }
        },
        title: {
            text: ''
        },
        xAxis: {
            overscroll: 500000,
            range: 4 * 200000,
            gridLineWidth: 0,
            visible: false
        },

        yAxis: {
            // Keep the axis active so the last-price label can be positioned.
            visible: true,
            labels: {
                enabled: false
            },
            title: {
                text: null
            },
            gridLineWidth: 0,
            lineWidth: 0,
            tickLength: 0,
            height: '80%'
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            series: {
                accessibility: {
                    enabled: false
                }
            }
        },
        navigator: {
            series: [{
                color: 'red'
            }]
        },
        rangeSelector: {
            buttons: [{
                type: 'minute',
                count: 15,
                text: '15m'
            }, {
                type: 'hour',
                count: 1,
                text: '1h'
            }, {
                type: 'all',
                count: 1,
                text: 'All'
            }],
            selected: 1,
            inputEnabled: false
        },
        tooltip: {
            shadow: false,
            useHTML: true,
            borderColor: 'var(--tooltip-border-color)',
            formatter: function () {
                let color = 'var(--candlestick-up-text-color)';
                if (this.open < this.close) {
                    color = 'var(--candlestick-down-text-color)';
                }
                return ` <div style="display:flex;flex-direction:column;
                color:${color};">
                    <div class="tooltip-header"> Live Candlestick</div>
                    <div>
                        <span class="tooltip-label">O:</span>
                        <span class="tooltip-value">${this.open}</span>
                    </div>
                       <div>
                        <span class="tooltip-label">H:</span>
                        <span class="tooltip-value">${this.high}</span>
                    </div>
                    <div>
                        <span class="tooltip-label">C:</span>
                        <span class="tooltip-value">${this.close}</span>
                    </div>
                 
                    <div>
                        <span class="tooltip-label">L:</span>
                        <span class="tooltip-value">${this.low}</span>
                    </div>
                </div>`;
            }
        },

        series: [{
            type: 'candlestick',
            className: 'candlestick',
            valueDecimals: 2,
            lastPrice: {
                enabled: true,
                label: {
                    enabled: true
                    // backgroundColor: '#474554',
                    // borderColor: '#ACABBA'
                }
            }
        }]
    };

    // On load, start the interval that adds points
    options.chart = {
        animation: false,
        events: {
            load() {
                currentChart = this;
                csSeries = currentChart.series[0];
            }
        },
        margin: [50, 20, 0, 20]
    };

    // Apply the data to the options
    options.series[0].data = [
        [
            1317888000000,
            372.5101,
            375,
            372.2,
            372.52
        ],
        [
            1317888060000,
            372.4,
            373,
            372.01,
            372.16
        ],
        [
            1317888120000,
            372.16,
            372.4,
            371.39,
            371.62
        ],
        [
            1317888180000,
            371.62,
            372.16,
            371.55,
            371.75
        ],
        [
            1317888240000,
            371.75,
            372.4,
            371.57,
            372
        ],
        [
            1317888300000,
            372,
            372.3,
            371.8,
            372.24
        ],
        [
            1317888360000,
            372.22,
            372.45,
            372.22,
            372.3
        ],
        [
            1317888420000,
            372.3,
            373.25,
            372.3,
            373.15
        ],
        [
            1317888480000,
            373.01,
            373.5,
            373,
            373.24
        ],
        [
            1317888540000,
            373.36,
            373.88,
            373.19,
            373.88
        ],
        [
            1317888600000,
            373.8,
            374.34,
            373.75,
            374.29
        ],
        [
            1317888660000,
            374.29,
            374.43,
            374,
            374.01
        ],
        [
            1317888720000,
            374.05,
            374.35,
            373.76,
            374.35
        ],
        [
            1317888780000,
            374.41,
            375.24,
            374.37,
            374.9
        ],
        [
            1317888840000,
            374.83,
            375.73,
            374.81,
            374.96
        ],
        [
            1317888900000,
            374.81,
            375.4,
            374.81,
            375.25
        ],
        [
            1317888960000,
            375.2,
            375.7,
            375.14,
            375.19
        ],
        [
            1317889020000,
            375.43,
            375.43,
            374.75,
            374.76
        ],
        [
            1317889080000,
            374.94,
            375.5,
            374.81,
            375.13
        ],
        [
            1317889140000,
            375.12,
            375.48,
            375,
            375.04
        ],
        [
            1317889200000,
            375.24,
            375.24,
            375,
            375.08
        ],
        [
            1317889260000,
            375.16,
            375.16,
            374.51,
            374.51
        ],
        [
            1317889320000,
            374.51,
            374.75,
            374.2,
            374.27
        ],
        [
            1317889380000,
            374.22,
            374.55,
            373.83,
            374.55
        ],
        [
            1317889440000,
            374.69,
            374.86,
            374.01,
            374.2
        ],
        [
            1317889500000,
            374.32,
            374.65,
            374.31,
            374.51
        ],
        [
            1317889560000,
            374.65,
            375.12,
            374.51,
            375.12
        ],
        [
            1317889620000,
            375.13,
            375.25,
            374.83,
            375.22
        ],
        [
            1317889680000,
            375.16,
            375.22,
            375,
            375
        ],
        [
            1317889740000,
            375,
            375,
            374.66,
            374.8
        ],
        [
            1317889800000,
            374.88,
            375,
            374.5,
            374.85
        ],
        [
            1317889860000,
            374.41,
            374.67,
            374.25,
            374.67
        ],
        [
            1317889920000,
            374.5,
            374.75,
            374.27,
            374.42
        ],
        [
            1317889980000,
            374.4,
            374.93,
            374.38,
            374.85
        ],
        [
            1317890040000,
            374.86,
            375.3,
            374.8,
            375.09
        ],
        [
            1317890100000,
            375,
            375.18,
            374.9,
            375.02
        ],
        [
            1317890160000,
            375.02,
            375.08,
            374.86,
            374.87
        ],
        [
            1317890220000,
            374.93,
            375.75,
            374.93,
            375.75
        ],
        [
            1317890280000,
            375.75,
            376.5,
            375.75,
            376.31
        ],
        [
            1317890340000,
            376.31,
            377.2,
            376.19,
            377.04
        ],
        [
            1317890400000,
            377.2,
            377.33,
            376.45,
            376.47
        ],
        [
            1317890460000,
            376.75,
            376.99,
            376.53,
            376.54
        ],
        [
            1317890520000,
            376.54,
            376.67,
            376.08,
            376.35
        ],
        [
            1317890580000,
            376.41,
            376.94,
            376.2,
            376.5
        ],
        [
            1317890640000,
            376.46,
            376.51,
            376.06,
            376.09
        ],
        [
            1317890700000,
            376.38,
            376.84,
            376.09,
            376.78
        ],
        [
            1317890760000,
            376.55,
            376.6,
            376.41,
            376.44
        ],
        [
            1317890820000,
            376.45,
            376.87,
            376.31,
            376.87
        ],
        [
            1317890880000,
            376.83,
            377,
            376.63,
            376.95
        ],
        [
            1317890940000,
            376.95,
            377,
            376.1,
            376.1
        ],
        [
            1317891000000,
            376.1,
            376.17,
            375.64,
            375.65
        ],
        [
            1317891060000,
            375.68,
            376.05,
            375.32,
            376.05
        ],
        [
            1317891120000,
            376.03,
            376.04,
            375.5,
            375.72
        ],
        [
            1317891180000,
            375.83,
            376.195,
            375.7,
            376
        ],
        [
            1317891240000,
            376.01,
            376.6,
            376,
            376.5
        ],
        [
            1317891300000,
            376.5,
            376.53,
            376.11,
            376.21
        ],
        [
            1317891360000,
            376.17,
            376.3,
            376.1,
            376.25
        ],
        [
            1317891420000,
            376.4,
            376.4,
            376.13,
            376.29
        ],
        [
            1317891480000,
            376.15,
            376.39,
            376.1,
            376.39
        ],
        [
            1317891540000,
            376.4,
            377.11,
            376.4,
            377
        ],
        [
            1317891600000,
            377.01,
            377.15,
            376.79,
            377.15
        ],
        [
            1317891660000,
            377.02,
            377.15,
            376.55,
            376.88
        ],
        [
            1317891720000,
            376.67,
            376.76,
            376.52,
            376.53
        ],
        [
            1317891780000,
            376.78,
            376.91,
            376.53,
            376.82
        ],
        [
            1317891840000,
            376.73,
            376.86,
            376.7,
            376.75
        ],
        [
            1317891900000,
            376.7,
            376.71,
            376.5,
            376.57
        ],
        [
            1317891960000,
            376.53,
            376.74,
            376.2,
            376.2
        ],
        [
            1317892020000,
            376.17,
            376.17,
            375.91,
            376
        ],
        [
            1317892080000,
            376,
            376,
            375.77,
            375.77
        ],
        [
            1317892140000,
            375.78,
            375.88,
            375.51,
            375.57
        ],
        [
            1317892200000,
            375.57,
            375.79,
            375.34,
            375.63
        ],
        [
            1317892260000,
            375.63,
            375.78,
            375.35,
            375.41
        ],
        [
            1317892320000,
            375.38,
            375.61,
            375.35,
            375.58
        ],
        [
            1317892380000,
            375.55,
            375.57,
            375.34,
            375.48
        ],
        [
            1317892440000,
            375.43,
            375.57,
            375.12,
            375.13
        ],
        [
            1317892500000,
            375.15,
            375.3,
            374.86,
            375
        ],
        [
            1317892560000,
            374.9,
            375.31,
            374.72,
            375.14
        ],
        [
            1317892620000,
            375,
            375.2,
            374.9,
            375.06
        ],
        [
            1317892680000,
            375.18,
            375.6,
            375.12,
            375.6
        ],
        [
            1317892740000,
            375.6,
            375.87,
            375.5,
            375.5
        ],
        [
            1317892800000,
            375.49,
            375.49,
            375.04,
            375.25
        ],
        [
            1317892860000,
            375.25,
            375.46,
            375,
            375.24
        ],
        [
            1317892920000,
            375.38,
            375.45,
            375,
            375.1
        ],
        [
            1317892980000,
            375.09,
            375.24,
            374.83,
            374.97
        ],
        [
            1317893040000,
            375.01,
            375.01,
            374.8,
            374.87
        ],
        [
            1317893100000,
            374.98,
            375.12,
            374.98,
            375
        ],
        [
            1317893160000,
            374.9,
            374.95,
            374.75,
            374.87
        ],
        [
            1317893220000,
            374.89,
            375.44,
            374.87,
            375.12
        ],
        [
            1317893280000,
            375.06,
            375.12,
            373.56,
            374.05
        ],
        [
            1317893340000,
            374.1,
            374.3,
            373.16,
            373.21
        ],
        [
            1317893400000,
            373.39,
            375,
            372.58,
            374.8
        ],
        [
            1317893460000,
            374.899,
            375.23,
            374.33,
            374.75
        ],
        [
            1317893520000,
            374.79,
            376.71,
            374.69,
            376.31
        ],
        [
            1317893580000,
            376.32,
            376.37,
            375.27,
            375.331
        ],
        [
            1317893640000,
            375.3301,
            377.44,
            375.33,
            377.43
        ],
        [
            1317893700000,
            377.43,
            378.14,
            376.83,
            377.08
        ],
        [
            1317893760000,
            377.18,
            378,
            376.5,
            376.7
        ],
        [
            1317893820000,
            376.83,
            377,
            375.51,
            375.79
        ],
        [
            1317893880000,
            375.6501,
            376.74,
            375.23,
            376.39
        ],
        [
            1317893940000,
            376.38,
            378.75,
            376.25,
            378.5
        ],
        [
            1317894000000,
            378.54,
            378.63,
            376.75,
            376.87
        ],
        [
            1317894060000,
            376.8664,
            377.62,
            376.64,
            376.908
        ],
        [
            1317894120000,
            376.8336,
            377.88,
            376.8289,
            377.55
        ],
        [
            1317894180000,
            377.36,
            377.9,
            376.52,
            376.75
        ],
        [
            1317894240000,
            376.83,
            377.73,
            376.71,
            376.98
        ],
        [
            1317894300000,
            377,
            377.69,
            376.87,
            377.1212
        ],
        [
            1317894360000,
            377.225,
            377.33,
            376.01,
            376.26
        ],
        [
            1317894420000,
            376.42,
            376.64,
            375.55,
            375.5534
        ],
        [
            1317894480000,
            375.74,
            375.94,
            374.77,
            375.3
        ],
        [
            1317894540000,
            375.3313,
            376,
            374.92,
            375.06
        ],
        [
            1317894600000,
            375.11,
            375.46,
            374.82,
            374.92
        ],
        [
            1317894660000,
            374.82,
            375.68,
            374.64,
            375.668
        ],
        [
            1317894720000,
            375.62,
            376.13,
            375.46,
            376.13
        ],
        [
            1317894780000,
            376.14,
            376.6,
            375.89,
            376.34
        ],
        [
            1317894840000,
            376.39,
            376.39,
            375.55,
            375.99
        ],
        [
            1317894900000,
            376,
            376.28,
            375.42,
            376.21
        ],
        [
            1317894960000,
            376,
            377.38,
            375.7,
            376.591
        ],
        [
            1317895020000,
            376.59,
            377.46,
            376.57,
            376.9348
        ],
        [
            1317895080000,
            376.9481,
            377.749,
            376.84,
            377.563
        ],
        [
            1317895140000,
            377.452,
            377.65,
            376.43,
            376.78
        ],
        [
            1317895200000,
            376.94,
            377.01,
            375.75,
            375.98
        ],
        [
            1317895260000,
            376.27,
            377.29,
            375.95,
            376.98
        ],
        [
            1317895320000,
            376.9962,
            377.3,
            376.69,
            376.71
        ],
        [
            1317895380000,
            376.75,
            377.5,
            376.75,
            377.41
        ],
        [
            1317895440000,
            377.26,
            377.49,
            376.89,
            377.368
        ],
        [
            1317895500000,
            377.345,
            378,
            377.17,
            378
        ],
        [
            1317895560000,
            377.97,
            378.3199,
            377.68,
            377.97
        ],
        [
            1317895620000,
            378.01,
            378.07,
            377.25,
            377.37
        ],
        [
            1317895680000,
            377.37,
            377.75,
            377.05,
            377.12
        ],
        [
            1317895740000,
            377.16,
            377.79,
            377.01,
            377.4512
        ]
    ];

    // Create the chart
    Highcharts.stockChart('container', options);

}

// Stock chart with annotations
function loadMorningstarData() {
    if (!morningstarDataPromise) {
        const commonOptions = {
            api: {
                url: 'https://demo-live-data.highcharts.com',
                access: {
                    url: 'https://demo-live-data.highcharts.com/token/oauth',
                    token: 'token'
                }
            }
        };

        const TeslaISIN = 'US88160R1014';

        let connector;

        // Create the connector inside the promise chain, so a setup error
        // (e.g. the connector script was blocked) becomes a rejection rather
        // than an exception thrown at the caller.
        morningstarDataPromise = Promise.resolve().then(() => {
            // eslint-disable-next-line max-len
            connector = new HighchartsConnectors.Morningstar.TimeSeriesConnector({
                ...commonOptions,
                series: {
                    type: 'Price'
                },
                securities: [
                    {
                        id: TeslaISIN,
                        idType: 'ISIN'
                    }
                ],
                startDate: '2017-01-01',
                endDate: '2025-03-17',
                currencyId: 'USD'
            });
            return connector.load();
        }).then(() => {
            const cols = connector.getTable().getColumns();
            // eslint-disable-next-line max-len
            const name = Array.from(Object.keys(cols).filter(k => k !== 'Date'))[0];
            return cols[name].map((value, i) => [cols.Date[i], value]);
        }).catch(err => {
            // Allow a retry on the next carousel cycle
            morningstarDataPromise = null;
            throw err;
        });
    }
    return morningstarDataPromise;
}

// Start loading the Morningstar data before the Stock slide is shown, so it
// is usually ready by the time that slide comes up. Errors are ignored here:
// a failed request clears the cache, and the slide retries and reports it.
function prefetchMorningstarData() {
    loadMorningstarData().catch(() => {});
}

function stockWithAnnotations() {
    const token = slideToken;

    (async () => {
        const data = await loadMorningstarData();

        // The carousel moved on while the data was loading
        if (token !== slideToken) {
            return;
        }

        currentChart = Highcharts.chart('container', {
            chart: {
                type: 'area',
                zooming: {
                    type: 'x'
                },
                panning: true,
                panKey: 'shift',
                scrollablePlotArea: {
                    minWidth: 500,
                    scrollPositionX: 1
                }
            },

            defs: {
                tslaAreaGradient: {
                    tagName: 'linearGradient',
                    id: 'tsla-area-gradient',
                    x1: 0,
                    x2: 0,
                    y1: 0,
                    y2: 1,
                    children: [{
                        tagName: 'stop',
                        offset: 0
                    }, {
                        tagName: 'stop',
                        offset: 1
                    }]
                }
            },

            title: {
                text: 'TSLA Stock price 2017 - March 17, 2025',
                align: 'left'
            },

            accessibility: {
                landmarkVerbosity: 'one'
            },

            credits: {
                enabled: false
            },

            annotations: [
                {
                    draggable: '',
                    labelOptions: {
                        shape: 'connector',
                        useHTML: true
                    },
                    className: 'events-annotations',
                    labels: [
                        {
                            allowOverlap: false,
                            point: {
                                xAxis: 0,
                                yAxis: 0,
                                x: '2020-08-20',
                                y: 133.45
                            },
                            x: -100,
                            text: '5 for 1 Stock split announcement'
                        },
                        {
                            point: {
                                xAxis: 0,
                                yAxis: 0,
                                x: '2020-12-21',
                                y: 216.62
                            },
                            text: 'Inclusion to S&P 500 Index',
                            x: -70,
                            y: -20
                        },
                        {
                            point: {
                                xAxis: 0,
                                yAxis: 0,
                                x: '2021-04-01',
                                y: 220.58
                            },
                            text: 'Record earnings in Q1 2021',
                            y: -60,
                            x: -25
                        },
                        {
                            point: {
                                xAxis: 0,
                                yAxis: 0,
                                x: '2021-11-01',
                                y: 402.86
                            },
                            x: -100,
                            text: 'Stock Sale by Elon Musk'
                        },
                        {
                            point: {
                                xAxis: 0,
                                yAxis: 0,
                                x: '2022-03-22',
                                y: 331.33
                            },
                            text: 'Berlin\'s giga factory opening',
                            x: -15,
                            y: 120
                        },
                        {
                            point: {
                                xAxis: 0,
                                yAxis: 0,
                                x: '2022-04-12',
                                y: 328.98
                            },
                            text: 'Musk\'s Twitter aquisition',
                            x: 70
                        },
                        {
                            point: {
                                xAxis: 0,
                                yAxis: 0,
                                x: '2023-09-16',
                                y: 265.28
                            },
                            text: '5 million cars produced',
                            x: -15,
                            y: -15
                        },
                        {
                            point: {
                                xAxis: 0,
                                yAxis: 0,
                                x: '2024-11-05',
                                y: 251.44
                            },
                            text: 'Trump wins elections',
                            x: -50,
                            y: -120
                        }
                    ]
                },
                {
                    draggable: '',
                    labels: [
                        {
                            point: {
                                xAxis: 0,
                                yAxis: 0,
                                x: '2019-03-14',
                                y: 19.33
                            },
                            x: -60,
                            text: 'Tesla Model Y announced'
                        },
                        {
                            point: {
                                xAxis: 0,
                                yAxis: 0,
                                x: '2019-11-21',
                                y: 23.65
                            },
                            text: 'Tesla CyberTruck announced',
                            x: -80,
                            y: -40
                        },
                        {
                            point: {
                                xAxis: 0,
                                yAxis: 0,
                                x: '2020-09-22',
                                y: 141.41
                            },
                            x: 100,
                            y: 50,
                            text: 'Tesla Model S and X Plaid announced'
                        }, {
                            point: {
                                xAxis: 0,
                                yAxis: 0,
                                x: '2024-01-24',
                                y: 207.83
                            },
                            y: 70,
                            text: 'Tesla Model 2 announced'
                        }
                    ]
                }
            ],

            xAxis: {
                type: 'datetime'
            },

            yAxis: {
                startOnTick: true,
                endOnTick: false,
                title: {
                    text: null
                },
                labels: {
                    format: '{value} USD'
                },
                accessibility: {
                    description: 'Price',
                    rangeDescription: 'Price ranges from 0 to 480 USD.'
                }
            },

            tooltip: {
                pointFormat: '{point.y:.2f} USD',
                shared: true
            },

            legend: {
                enabled: false
            },

            series: [
                {
                    data,
                    className: 'stock-annotations',
                    color: '#cc0000',
                    fillColor: {
                        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                        stops: [
                            [0, 'var(--highcharts-neutral-color-40, #999999)'],
                            [1, 'var(--highcharts-neutral-color-3, #f7f7f7)']
                        ]
                    },
                    fillOpacity: 0.5,
                    name: 'TSLA Stock Price',
                    marker: {
                        enabled: false
                    },
                    threshold: null
                }
            ]
        });
    })().catch(err => {
        console.warn('Stock demo: could not load Morningstar data', err);
    });
}

function loadMapTopology() {
    if (!mapTopologyPromise) {
        mapTopologyPromise = fetch(
            'https://code.highcharts.com/mapdata/custom/world-highres.topo.json'
        ).then(response => {
            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }
            return response.json();
        }).catch(err => {
            // Allow a retry on the next carousel cycle
            mapTopologyPromise = null;
            throw err;
        });
    }
    return mapTopologyPromise;
}

// Maps animated map
function animatedMap() {
    const token = slideToken;

    (async () => {
        const topology = await loadMapTopology();

        // The carousel moved on while the map was loading
        if (token !== slideToken) {
            return;
        }

        const data = [
            {
                'hc-key': 'ye',
                info: 'Yemen is where coffee took off'
            },
            {
                'hc-key': 'br',
                info: 'Coffee came from La Reunion'
            },
            {
                'hc-key': 'fr',
                info: 'Coffee came from Java'
            },
            {
                'hc-key': 'gb',
                info: 'Coffee came from Java'
            },
            {
                'hc-key': 'id',
                info: 'Coffee came from Yemen'
            },
            {
                'hc-key': 'nl',
                info: 'Coffee came from Java'
            },
            {
                'hc-key': 'gu',
                info: 'Coffee came from France'
            },
            {
                'hc-key': 're',
                info: 'Coffee came from Yemen'
            },
            {
                'hc-key': 'in',
                info: 'Coffee came from Yemen'
            }
        ];

        // Initialize the chart
        Highcharts.mapChart('container', {
            accessibility: {
                point: {
                    descriptionFormat: '{point.name}: {point.info}'
                },
                screenReaderSection: {
                    beforeChartFormat: '',
                    afterChartFormat: ''
                },
                keyboardNavigation: {
                    enabled: false
                }
            },
            chart: {
                map: topology,
                events: {
                    load: function () {
                        currentChart = this;
                    }
                }
            },

            title: {
                text: 'The history of the coffee bean',
                align: 'center',
                verticalAlign: 'bottom',
                y: -15
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            tooltip: {
                useHTML: true,
                outside: true,
                headerFormat: `<span class="map-label-name">
                {point.key}</span><br/>`,
                pointFormat: `<span class="map-label-arrival">
                {point.info}</span>`
            },

            mapView: {
                fitToGeometry: {
                    type: 'MultiPoint',
                    coordinates: [
                    // Alaska west
                        [-164, 54],
                        // Greenland north
                        [-35, 84],
                        // New Zealand east
                        [179, -38],
                        // Chile south
                        [-68, -55]
                    ]
                }
            },

            series: [
                {
                    data,
                    keys: ['hc-key', 'info'],
                    name: 'Coffee'
                },
                {
                    type: 'mapline',
                    data: [
                        {
                            geometry: {
                                type: 'LineString',
                                coordinates: [
                                    [48.516388, 15.552727], // Yemen
                                    [110.004444, -7.491667] // Java
                                ]
                            },
                            className: 'animated-line'
                        },
                        {
                            geometry: {
                                type: 'LineString',
                                coordinates: [
                                    [48.516388, 15.552727], // Yemen
                                    [55.5325, -21.114444] // La reunion
                                ]
                            },
                            className: 'animated-line',
                            info: 'Connection from Yemen to La Reunion'

                        },
                        {
                            geometry: {
                                type: 'LineString',
                                coordinates: [
                                    [55.5325, -21.114444], // La reunion
                                    [-43.2, -22.9] // Brazil
                                ]
                            },
                            className: 'animated-line',
                            info: 'Connection from La Reunion to Brazil'

                        },
                        {
                            geometry: {
                                type: 'LineString',
                                coordinates: [
                                    [48.516388, 15.552727], // Yemen
                                    [78, 21] // India
                                ]
                            },
                            className: 'animated-line',
                            info: 'Connection from Yemen to India'
                        },
                        {
                            geometry: {
                                type: 'LineString',
                                info: 'Connection from India to Amsterdam',
                                coordinates: [
                                    [110.004444, -7.491667], // Java
                                    [4.9, 52.366667] // Amsterdam
                                ]
                            },
                            className: 'animated-line',
                            info: 'Connection from Java to Amsterdam'
                        },
                        {
                            geometry: {
                                type: 'LineString',
                                coordinates: [
                                    [-3, 55], // UK
                                    [-61.030556, 14.681944] // Antilles
                                ]
                            },
                            className: 'animated-line',
                            info: 'Connection from UK to Antilles'
                        },
                        {
                            geometry: {
                                type: 'LineString',
                                coordinates: [
                                    [2.352222, 48.856613], // Paris
                                    [-53, 4] // Guyane
                                ]
                            },
                            className: 'animated-line',
                            info: 'Connection from France to Guyane'
                        }
                    ],
                    lineWidth: 2,
                    enableMouseTracking: false
                },
                {
                    type: 'mappoint',
                    dataLabels: {
                        useHTML: true,
                        formatter: function () {
                            return '<div class="map-label">' +
                                // eslint-disable-next-line max-len
                                '<span class="map-label-name"><span style="font-size:14px">☕</span>' + this.point.name + '</span>' +
                                '<span class="map-label-arrival">Arrived: ' +
                                this.point.custom.arrival + '</span></div>';
                        },
                        align: 'left',
                        verticalAlign: 'middle'
                    },
                    data: [
                        {
                            name: 'Yemen',
                            info: 'Yemen is where coffee took off in 1414',
                            geometry: {
                                type: 'Point',
                                coordinates: [48.516388, 15.552727] // Yemen
                            },
                            custom: {
                                arrival: 1414
                            },
                            dataLabels: {
                                align: 'right'
                            }
                        },
                        {
                            name: 'Java',
                            info: 'Coffee came from Yemen in 1696',
                            geometry: {
                                type: 'Point',
                                coordinates: [110.004444, -7.491667] // Java
                            },
                            custom: {
                                arrival: 1696
                            },
                            dataLabels: {
                                verticalAlign: 'top',
                                align: 'center'
                            }
                        },
                        {
                            name: 'La Reunion',
                            info: 'Coffee came from Yemen in 1708',
                            geometry: {
                                type: 'Point',
                                coordinates: [55.5325, -21.114444] // La reunion
                            },
                            custom: {
                                arrival: 1708
                            },
                            dataLabels: {
                                verticalAlign: 'top',
                                align: 'right'
                            }
                        },
                        {
                            name: 'Brazil',
                            info: 'Coffee came from La Reunion in 1770',
                            geometry: {
                                type: 'Point',
                                coordinates: [-43.2, -22.9] // Brazil
                            },
                            custom: {
                                arrival: 1770
                            },
                            dataLabels: {
                                align: 'right'
                            }
                        },
                        {
                            name: 'India',
                            info: 'Coffee came from Yemen in 1670',
                            geometry: {
                                type: 'Point',
                                coordinates: [78, 21] // India
                            },
                            custom: {
                                arrival: 1670
                            }
                        },
                        {
                            name: 'Amsterdam',
                            info: 'Coffee came from India in 1696',
                            geometry: {
                                type: 'Point',
                                coordinates: [4.9, 52.366667] // Amsterdam
                            },
                            custom: {
                                arrival: 1696
                            }
                        },
                        {
                            name: 'Antilles',
                            info: 'Coffee came from the UK in 1714',
                            geometry: {
                                type: 'Point',
                                coordinates: [-61.030556, 14.681944] // Antilles
                            },
                            custom: {
                                arrival: 1714
                            },
                            dataLabels: {
                                align: 'right'
                            }
                        },
                        {
                            name: 'Guyane',
                            info: 'Coffee came from France in 1714',
                            geometry: {
                                type: 'Point',
                                coordinates: [-53, 4] // Guyane
                            },
                            custom: {
                                arrival: 1714
                            },
                            dataLabels: {
                                align: 'right'
                            }
                        }
                    ],
                    enableMouseTracking: false
                }
            ]
        });
    })().catch(err => {
        console.warn('Map demo: could not load map topology', err);
    });
}

// Gantt chart
// Not in the carousel while the Gantt demo is disabled (see products).
// eslint-disable-next-line no-unused-vars
const gantt = {
    accessibility: {
        screenReaderSection: {
            beforeChartFormat: '',
            afterChartFormat: ''
        },
        keyboardNavigation: {
            enabled: false
        }
    },
    chart: {
        type: 'xrange'
    },
    title: {
        text: ''
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    xAxis: {
        type: 'datetime',
        min: '2014-12-01',
        max: '2014-12-23',
        gridLineWidth: 0,
        lineWidth: 0,
        labels: {
            style: {
                color: 'var(--text-tertiary)'
            }
        }
    },
    yAxis: {
        title: '',
        categories: ['Prototyping', 'Development', 'Testing'],
        reversed: true,
        labels: {
            style: {
                color: 'var(--text-tertiary)'
            }
        }
    },
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                style: {
                    textOutline: 'none',
                    color: 'var(--text-primary)'
                }
            },
            // Set default connection options here
            connectors: {
                lineWidth: 2
            }
        }
    },
    series: [{
        name: 'Project 1',
        className: 'homepage-gantt',
        data: [{
            x: '2014-12-01',
            x2: '2014-12-04',
            partialFill: 0.95,
            y: 0,
            id: 'first'
        }, {
            x: '2014-12-04',
            x2: '2014-12-08',
            partialFill: 0.7,
            y: 1,
            dataLabels: {
                x: -5
            },
            id: 'second',
            connect: 'third' // Set a default connection to a point
        }, {
            x: '2014-12-08',
            x2: '2014-12-10',
            partialFill: 0.15,
            y: 2,
            dataLabels: {
                x: 5 // Shift label to avoid overlapping with connection line
            },
            id: 'third'
        }, {
            x: '2014-12-12',
            x2: '2014-12-19',
            partialFill: {
                amount: 0.3
            },
            y: 1,
            id: 'fourth',
            // Define custom connection options
            connect: {
                to: 'first', // Which point to connect to
                dashStyle: 'dash', // Dash style for line
                lineWidth: 2, // Width of line
                type: 'simpleConnect', // Algorithm type
                startMarker: {
                    align: 'right', // Where to start the line (horizontally)
                    enabled: true, // Add the marker symbol
                    symbol: 'square', // Use a square symbol
                    radius: 4, // Size of symbol
                    color: 'var(--highcharts-color-1)' // Color of symbol
                },
                endMarker: {
                    align: 'right', // Where to end the line (horizontally)
                    verticalAlign: 'top' // Where to end line (vertically)
                }
            }
        }, {
            x: '2014-12-14',
            x2: '2014-12-21',
            y: 2,
            id: 'fifth',
            // Define multiple connections from this point
            connect: [
                'fourth', // Simple default connection
                {
                    // Custom connection
                    to: 'second', // Which point to connect to
                    type: 'fastAvoid' // Algorithm
                }
            ]
        }]
    }]
};

// Dashboards personal finance
function dashboards() {

    Dashboards.board('dash-container', {
        dataPool: {
            connectors: [{
                id: 'transactions',
                type: 'JSON',
                firstRowAsNames: false,
                columnIds: ['id', 'Receiver', 'Amount', 'Balance'],
                data: [
                    ['rsf934fds', 'John Doe', 100, 1000],
                    ['f0efnakr', 'Anna Smith', 200, 800],
                    ['mfaiks12', 'Robert Johnson', 300, 500],
                    ['15fqmfk', 'Susan Williams', 400, 100]
                ]
            }]
        },
        gui: {
            layouts: [{
                rows: [{
                    id: 'row-1',
                    cells: [{
                        id: 'dashboard-row-1-cell-1'
                    }, {
                        id: 'dashboard-row-1-cell-2'
                    }, {
                        id: 'dashboard-row-1-cell-3'
                    }]
                }, {
                    cells: [{
                        id: 'dashboard-row-2-cell-1'
                    }]
                }, {
                    cells: [{
                        id: 'dashboard-row-3-cell-1'
                    }, {
                        id: 'dashboard-row-3-cell-2'
                    }, {
                        id: 'dashboard-row-3-cell-3'
                    }]
                }]
            }]
        },
        components: [{
            type: 'KPI',
            renderTo: 'dashboard-row-1-cell-1',
            title: 'Total balance',
            value: 1430,
            valueFormat: '$ {value}',
            subtitle: '43%',
            linkedValueTo: {
                enabled: false
            },
            chartOptions: {
                chart: {
                    styledMode: true
                },
                series: [{
                    type: 'spline',
                    enableMouseTracking: false,
                    dataLabels: {
                        enabled: false
                    },
                    data: [1870, 1210, 1500, 1900, 1430]
                }]
            }
        }, {
            type: 'KPI',
            renderTo: 'dashboard-row-1-cell-2',
            title: 'Savings',
            value: 6500,
            valueFormat: '$ {value}',
            subtitle: '22%',
            linkedValueTo: {
                enabled: false
            },
            chartOptions: {
                chart: {
                    styledMode: true
                },
                series: [{
                    type: 'spline',
                    enableMouseTracking: false,
                    dataLabels: {
                        enabled: false
                    },
                    data: [0, 1000, 1000, 4500, 5300, 6500]
                }]
            }
        }, {
            type: 'HTML',
            renderTo: 'dashboard-row-1-cell-3',
            elements: [{
                tagName: 'div',
                children: [{
                    tagName: 'h4',
                    textContent: 'Check how you can save more!',
                    attributes: {
                        class: 'main-title'
                    }
                }, {
                    tagName: 'button',
                    textContent: 'Go to the saving account',
                    attributes: {
                        id: 'saving-button'
                    }
                }]
            }]
        }, {
            type: 'Highcharts',
            renderTo: 'dashboard-row-2-cell-1',
            title: 'Earnings',
            chartOptions: {
                chart: {
                    marginTop: 50
                },
                defs: {
                    gradient0: {
                        tagName: 'linearGradient',
                        id: 'gradient-0',
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1,
                        children: [{
                            tagName: 'stop',
                            offset: 0
                        }, {
                            tagName: 'stop',
                            offset: 1
                        }]
                    }
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: ''
                },
                legend: {
                    enabled: false
                },
                xAxis: {
                    categories: [
                        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                    ]
                },
                yAxis: [{
                    title: '',
                    labels: {
                        format: '{value} k'
                    }
                }],
                series: [{
                    type: 'areaspline',
                    dataLabels: {
                        enabled: false
                    },
                    marker: {
                        enabled: false
                    },
                    name: 'Earnings',
                    data: [10, 20, 30, 40, 12, 11, 10, 23, 4, 34, 50, 20]
                }]
            }
        }, {
            type: 'KPI',
            renderTo: 'dashboard-row-3-cell-1',
            title: 'Spendings',
            value: 350,
            valueFormat: '$ {value}',
            linkedValueTo: {
                enabled: false
            },
            chartOptions: {
                series: [{
                    type: 'column',
                    enableMouseTracking: false,
                    dataLabels: {
                        enabled: false
                    },
                    name: 'Spendings',
                    data: [45, 30, 50, 80, 10, 45, 30, 59, 39, 15, 62]
                }]
            }
        }, {
            type: 'KPI',
            renderTo: 'dashboard-row-3-cell-2',
            title: 'Your wallet condition',
            value: '',
            subtitle: 'You saved 1450$ this month',
            linkedValueTo: {
                enabled: false
            },
            chartOptions: {
                title: {
                    verticalAlign: 'middle',
                    floating: true,
                    text: '58%'
                },
                series: [{
                    type: 'pie',
                    enableMouseTracking: false,
                    data: [58, 42],
                    size: '100%',
                    innerSize: '75%',
                    dataLabels: {
                        enabled: false
                    }
                }]
            }
        }, {
            renderTo: 'dashboard-row-3-cell-3',
            connector: {
                id: 'transactions'
            },
            title: 'Transactions',
            type: 'Grid',
            gridOptions: {
                credits: {
                    enabled: false
                },
                rendering: {
                    theme: 'hcg-custom-theme'
                }
            }
        }]
    }, true);
}

// Grid sparklines
function grid() {

    let gridUpdateTimeouts = [];
    let gridIsRunning = true;
    let manualOverride = false;

    // detect global carousel pause state if defined
    const globallyPaused = typeof isPaused !== 'undefined' ? isPaused : false;

    // If reduced motion or the carousel is paused when grid() initializes,
    // start with updates disabled.
    if (reducedMotion || globallyPaused) {
        gridIsRunning = false;
    }

    // Data preparation (from the Grid Pro basic-sparklines demo)
    const dataTable = new Grid.DataTable({
        columns: {
            server: [
                'Flux01', 'Nexus02', 'Vex03', 'Pulse04', 'Drift05', 'Ion06'
            ],
            region: [
                'USA', 'Africa', 'Europe', 'Asia', 'S. America', 'Australia'
            ],
            live: [
                true, true, true, true, false, true
            ],
            ip: [
                '203.0.113.45', '198.51.100.23', '128.11.120.26',
                '185.220.100.12', '200.100.50.88', '213.20.13315'
            ],
            disk: [
                4, 9, 80, 30, 0, 50
            ],
            cpu: [
                '15, 18, 29, 48, 56, 54, 34',
                '99, 96, 82, 53, 33, 22, 29',
                '1, 4, 24, 65, 79, 77, 52',
                '50, 54, 64, 78, 89, 96, 99',
                '',
                '20, 21, 22, 25, 28, 31, 35'
            ],
            ram: [
                '28, 35, 41, 41, 43, 80, 85, 90, 63, 100, 40, 25, 27, 34, 30',
                '76, 79, 77, 72, 67, 63, 63, 56, 54, 49, 42, 38, 42, 33, 28',
                '49, 55, 57, 67, 69, 72, 78, 78, 75, 72, 72, 67, 61, 61, 54',
                '90, 95, 100, 100, 70, 26, 20, 22, 28, 24, 29, 26, 39, 35, 55',
                '',
                '40, 40, 40, 41, 39, 38, 40, 42, 39, 69, 63, 67, 61, 65, 64'
            ]
        }
    });

    // Defined zones here to use in various sparkline options.
    const sharedPlotOptions = {
        series: {
            // The class names are colored in demo.css, because the
            // page's shared highcharts.css overrides option-based colors.
            zones: [{
                value: 0.5,
                className: 'grid-zone-0',
                color: '#9998'
            }, {
                value: 60,
                className: 'grid-zone-1',
                color: '#4caf50'
            }, {
                value: 85,
                className: 'grid-zone-2',
                color: '#ebcb3b'
            }, {
                className: 'grid-zone-3',
                color: '#f44336'
            }]
        }
    };

    // The homepage sets `styledMode: true` globally. The sparklines use
    // option-based colors, so they opt out of styled mode.
    const sparklineChart = {
        styledMode: false,
        backgroundColor: 'transparent'
    };

    const liveIcon = `
<svg width="19" height="18" fill="none" aria-hidden="true">
    <path d="M17.5026 7.50163L17.1073 4.33882C16.9522 3.09831 16.8747
    2.47804 16.5827 2.01062C16.3255 1.59881 15.954 1.2708 15.5134
    1.06666C15.0134 0.834961 14.3883 0.834961 13.1381 0.834961H5.2004C
    3.95022 0.834961 3.32514 0.834961 2.82512 1.06666C2.38458 1.2708
    2.01302 1.59881 1.75582 2.01062C1.46389 2.47804 1.38635 3.0983
    1.23129 4.33882L0.835938 7.50163M3.7526 10.835H14.5859M3.7526
    10.835C2.14177 10.835 0.835938 9.52912 0.835938 7.91829C0.835938
    6.30746 2.14177 5.00163 3.7526 5.00163H14.5859C16.1968 5.00163
    17.5026 6.30746 17.5026 7.91829C17.5026 9.52912 16.1968 10.835
    14.5859 10.835M3.7526 10.835C2.14177 10.835 0.835938 12.1408
    0.835938 13.7516C0.835938 15.3625 2.14177 16.6683 3.7526 16.6683H
    14.5859C16.1968 16.6683 17.5026 15.3625 17.5026 13.7516C17.5026
    12.1408 16.1968 10.835 14.5859 10.835M4.16927 7.91829H4.1776M
    4.16927 13.7516H4.1776M9.16927 7.91829H14.1693M9.16927 13.7516H
    14.1693" stroke="#00A96B" stroke-width="1.67" stroke-linecap="round" />
</svg>
`;

    const offlineIcon = `
<svg width="17" height="19" fill="none" aria-hidden="true">
    <path d="M5.0026 5.83508L1.74715 9.74163C1.45648 10.0904 1.31114 10.2648
    1.30892 10.4121C1.30699 10.5402 1.36405 10.662 1.46365 10.7425C1.57823
    10.8351 1.80525 10.8351 2.2593 10.8351H8.33594L7.5026 17.5017L11.6693
    12.5017M11.3776 7.50175H14.4126C14.8666 7.50175 15.0936 7.50175 15.2082
    7.59434C15.3078 7.67483 15.3649 7.79665 15.363 7.9247C15.3607 8.07199
    15.2154 8.2464 14.9247 8.59521L13.7945 9.9515M7.14657 3.26229L9.16924
    0.835083L8.66948 4.83318M15.8359 16.6684L0.835938 1.66842"
    stroke="#DC2626" stroke-width="1.67" stroke-linecap="round"/>
</svg>
`;

    const grid = Grid.grid('grid-container', {
        data: {
            dataTable
        },
        credits: {
            enabled: false
        },
        rendering: {
            theme: 'hcg-theme-default theme-servers'
        },
        columns: [{
            id: 'server',
            header: {
                format: 'Servers'
            },
            cells: {
                formatter() {
                    const icon = (this.row.data.live) ? liveIcon : offlineIcon;
                    const region = this.row.data.region;
                    return `
                        <div class="server">
                            <div class="icon">
                                ${icon}
                            </div>
                            <div class="text">
                                <div>${this.value}</div>
                                <div class="region">${region}</div>
                            </div>
                        </div>
                    `;
                }
            }
        }, {
            id: 'region',
            enabled: false
        }, {
            id: 'live',
            width: 150,
            header: {
                format: 'Status'
            },
            cells: {
                format: `{#if value}
                    <div class="status">Live</div>
                {else}
                    <div class="status offline">Offline</div>
                {/if}`
            }
        }, {
            id: 'ip',
            header: {
                format: 'IP'
            }
        }, {
            id: 'disk',
            width: 120,
            className: 'hcg-center',
            header: {
                format: 'Disk Usage'
            },
            cells: {
                renderer: {
                    type: 'sparkline',
                    chartOptions: function (data) {
                        const zone = sharedPlotOptions.series.zones.find(
                            z => data <= (z.value || Infinity)
                        );
                        return {
                            chart: {
                                ...sparklineChart,
                                type: 'pie',
                                height: 30
                            },
                            series: [{
                                innerSize: '70%',
                                data: [{
                                    y: data,
                                    className: zone.className,
                                    color: zone.color
                                }, {
                                    y: 100 - data,
                                    className: 'grid-free',
                                    color: '#9994'
                                }]
                            }]
                        };
                    }
                }
            }
        }, {
            id: 'cpu',
            width: 120,
            header: {
                format: 'CPU Usage'
            },
            cells: {
                renderer: {
                    type: 'sparkline',
                    chartOptions: function (data) {
                        const yData = data.split(',').map(Number);

                        // To make the sparkline animate like the points are
                        // added to the end of the series instead of updating
                        // the existing points, the x values are shifted too.
                        const firstX = (
                            // eslint-disable-next-line max-len
                            this.content?.chart?.series?.[0].points?.[0]?.x ?? -1
                        ) + 1;

                        return {
                            chart: sparklineChart,
                            yAxis: {
                                min: -5,
                                max: 105
                            },
                            plotOptions: sharedPlotOptions,
                            series: [{
                                data: yData.map((y, i) => ([firstX + i, y]))
                            }]
                        };
                    }
                }
            }
        }, {
            id: 'ram',
            width: 120,
            header: {
                format: 'RAM Usage'
            },
            cells: {
                renderer: {
                    type: 'sparkline',
                    chartOptions: function (data) {
                        const yData = data.split(',').map(Number);
                        const firstX = (
                            // eslint-disable-next-line max-len
                            this.content?.chart?.series?.[0].points?.[0]?.x ?? -1
                        ) + 1;

                        return {
                            chart: sparklineChart,
                            yAxis: {
                                min: 0,
                                max: 100
                            },
                            plotOptions: sharedPlotOptions,
                            series: [{
                                type: 'column',
                                data: yData.map((y, i) => ([firstX + i, y]))
                            }]
                        };
                    }
                }
            }
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 700
                },
                gridOptions: {
                    header: ['server', 'cpu', 'ram']
                }
            }]
        }
    });

    // --- Utility: fade sparkline visuals when paused ---
    const gridContainer = document.getElementById('grid-container');
    function setGridPausedVisual(paused) {
        gridContainer.classList.toggle('paused-grid', paused);
    }

    // --- Update scheduler ---
    // Simulates live data by changing each row's sparklines every 0.5-2s.
    function scheduleUpdate(rowIndex) {
        // Never start scheduling if paused, unless manually overridden
        if (!gridIsRunning) {
            return;
        }

        // If reduced motion, skip updates *unless manually overridden*
        if (reducedMotion && !manualOverride) {
            return;
        }

        const delay = Math.random() * 1500 + 500;
        const timeout = setTimeout(async () => {
            // Skip during reduced motion unless manually allowed
            if (!gridIsRunning || (reducedMotion && !manualOverride)) {
                return;
            }
            await updateInstanceStatus(rowIndex);
            scheduleUpdate(rowIndex);
        }, delay);

        gridUpdateTimeouts.push(timeout);
    }

    // Generate a new dummy sparkline data array based on the old one.
    function generateArrayFlow(stringArray) {
        const r = Math.random() * 2 - 1;
        const change = Math.floor(r * r * r * 30);

        const array = stringArray.split(',').map(Number);
        array.shift();
        array.push(
            Highcharts.clamp(array[array.length - 1] + change, 0, 100)
        );

        return array.join(', ');
    }

    // Update the instance status in the data table and refresh the cells.
    async function updateInstanceStatus(rowIndex) {
        const live = dataTable.getCell('live', rowIndex);
        if (!live) {
            return;
        }

        const oldRam = dataTable.getCell('ram', rowIndex);
        const oldCpu = dataTable.getCell('cpu', rowIndex);

        dataTable.setCell('disk', rowIndex, Math.round(Math.random() * 100));
        dataTable.setCell('cpu', rowIndex, generateArrayFlow(oldCpu));
        dataTable.setCell('ram', rowIndex, generateArrayFlow(oldRam));

        const row = grid?.viewport.getRow(rowIndex);
        if (!row) {
            return;
        }

        // Apply the modifiers to the data table.
        await grid.querying.proceed(true);

        // Reload the column caches from the provider's presentation table.
        for (const column of grid.viewport.columns) {
            column.loadData();
        }

        // Copy the updated row data, then refresh each cell from it.
        row.loadData();
        row.cells.forEach(cell => cell.setValue());
    }

    // --- Pause / Resume controls ---
    function clearGridUpdates() {
        gridIsRunning = false;
        gridUpdateTimeouts.forEach(timeout => clearTimeout(timeout));
        gridUpdateTimeouts = [];
        setGridPausedVisual(true);
    }

    function resumeGridUpdates() {
        if (gridIsRunning && !reducedMotion) {
            return;
        }
        gridIsRunning = true;

        // If reduced motion, treat this as explicit user opt-in
        if (reducedMotion) {
            manualOverride = true;
        }

        for (let i = 0, iEnd = dataTable.getRowCount(); i < iEnd; i++) {
            scheduleUpdate(i);
        }
        setGridPausedVisual(false);
    }

    // --- Initialize ---
    if (!reducedMotion && !globallyPaused) {
        for (let i = 0, iEnd = dataTable.getRowCount(); i < iEnd; i++) {
            scheduleUpdate(i);
        }
        gridIsRunning = true;
    } else {
        gridIsRunning = false;
        setGridPausedVisual(true);
    }

    return {
        gridInstance: grid,
        clearGridUpdates,
        resumeGridUpdates
    };
}


/* DEMO VIEWER */
// product info for demo viewer
const products = [
    {
        name: 'Highcharts Orbit',
        tagline: 'Analyze data inside the chart',
        id: 'orbitTitle',
        icon: 'icon-orbit.svg',
        chart: orbitChart,
        stopLink: null,
        demoTitle: 'Target vs Walmart Weekly Stock Prices',
        demoDesc: 'Compare weekly stock prices and explore data with Orbit.',
        description: `<p>Target vs Walmart Weekly Stock Prices</p>
        <div>A spline chart comparing split-adjusted weekly closing prices
        for Target and Walmart from January 2021 to April 2026.
        Walmart is shown with a dashed line.</div>`
    },
    {
        name: 'Highcharts Stock',
        tagline: 'Financial visualization and analysis tools',
        id: 'stockTitle',
        icon: 'icon-stock.svg',
        chart: stockWithAnnotations,
        // eslint-disable-next-line max-len
        demoTitle: 'Stock data with annotations',
        // eslint-disable-next-line max-len
        demoDesc: 'Use Highcharts Annotations feature to place labels at various points of interest',
        // eslint-disable-next-line max-len
        stopLink: '',
        description: `<p>Stock data with annotations</p>
        <div>A purely decorative stock chart that demonstrates the 
        use of annotations to highlight key points.</div>`
    },
    // Candlestick demo disabled. To restore it, uncomment this entry
    // and its pagination dot in demo.html.
    // {
    //     name: 'Highcharts Stock',
    //     tagline: 'Financial visualization and analysis tools',
    //     id: 'stockTitle',
    //     icon: 'icon-stock.svg',
    //     chart: cs,
    // eslint-disable-next-line max-len
    //     demoTitle: 'Candlestick chart',
    // eslint-disable-next-line max-len
    //     demoDesc: 'Candlesticks make it easy to spot trends over time.',
    // eslint-disable-next-line max-len
    //     stopLink: `<button class="stop-link"
    //     id="stop-stock">(Stop chart animation)</button>`,
    //     description: `<p>Dynamic Candlestick Chart</p>
    //     <div>A purely decorative candlestick chart that updates with
    //     new data every 100 milliseconds.</div>`
    // },
    {
        name: 'Highcharts Grid ',
        tagline: 'Tools for JavaScript data tables',
        id: 'gridTitle',
        chart: grid,
        icon: 'icon-grid.svg',
        // eslint-disable-next-line max-len
        stopLink: `<button class="stop-link" 
         id="stop-grid">(Stop chart animation)</button>`,
        demoTitle: 'Data grid with sparklines',
        demoDesc: `Combine tabular data and inline 
        charts for instant visual context.`,
        description: `<p>Data Grid with Sparklines</p>
        A purely decorative data grid
        displaying the status and performance metrics of 6 servers.
        Each row represents a server with columns for server name and
        region, live or offline status, IP address, a disk usage pie
        chart, a CPU usage line sparkline and a RAM usage column sparkline.`
    },
    {
        name: 'Highcharts Core',
        tagline: '40+ Chart Types',
        id: 'coreTitle',
        icon: 'icon-core.svg',
        chart: coreChart,
        stopLink: null,
        demoTitle: 'Pie Chart',
        demoDesc: `Pie charts 
        show a compact overview of a composition or comparison`,
        description: `<p>Pie Chart</p><div>A purely decorative pie 
        chart showing the five most 
        popular waffle toppings. Strawberry jam is the favorite at 
        69 percent, followed by brown cheese at 12 percent, 
        sour cream 9 percent, butter and sugar 6 percent, 
        and other toppings 5 percent.</div>`
    },
    // Dashboards demo disabled. To restore it, uncomment this entry
    // and its pagination dot in demo.html.
    // {
    //     name: 'Highcharts Dashboards',
    //     tagline: 'Time-saving dashboard tools',
    //     id: 'dashboardsTitle',
    //     chart: dashboards,
    //     icon: 'icon-dashboards.svg',
    //     demoTitle: 'Personal finance dashboard',
    //     stopLink: null,
    // eslint-disable-next-line max-len
    //     demoDesc: 'Use our data sync tools to create dynamic dashboards fast.',
    //     description: `<p>Personal Finance Dashboard</p>A purely decorative
    //     dashboard showing key financial metrics, including total
    //     balance, savings, earnings, spendings, and recent transactions.
    //     Line and area charts illustrate trends in balance,
    //     savings growth, and monthly earnings. A pie chart shows
    //     wallet condition, indicating 58 percent of income saved
    //     this month. A data table lists four recent transactions
    //     by receiver, amount, and remaining balance.`
    // },
    {
        name: 'Highcharts Maps',
        tagline: 'Data mapped to geography',
        id: 'mapsTitle',
        chart: animatedMap,
        icon: 'icon-maps.svg',
        demoTitle: 'Animated Map',
        demoDesc: 'Maps can tell stories when connected to data.',
        // eslint-disable-next-line max-len
        stopLink: `<button class="stop-link"  
        id="stop-maps">(Stop chart animation)</button>`,
        description: `<p>Animated line map</p>A purely decorative 
        world map showing the historical 
        spread of coffee cultivation. Animated lines trace the journey of 
        coffee from its origins in Yemen to other regions including Java, 
        La Réunion, India, Amsterdam, France, and the Caribbean. 
        Each route represents the path coffee took as it spread 
        globally between the 15th and 18th centuries.`
    }
    // Gantt demo disabled. To restore it, uncomment this entry
    // and its pagination dot in demo.html, and add a comma after the
    // Maps entry above.
    // {
    //     name: 'Highcharts Gantt',
    //     tagline: 'Resource and timeline management',
    //     id: 'ganttTitle',
    //     chart: gantt,
    //     stopLink: null,
    //     icon: 'icon-gantt.svg',
    //     demoTitle: 'Gantt chart',
    //     demoDesc: `Use Gantts to track tasks, dependencies, and
    //     progress.`,
    // eslint-disable-next-line max-len
    //     description: `<p>Gantt Chart</p>A purely decorative gantt chart showing
    //     three project phases: Prototyping, Development,
    //     and Testing. Each bar represents task progress,
    //     with dependencies shown as connecting lines.
    //     Prototyping is 95 percent complete, Development
    //     tasks are 70 and 30 percent complete, and
    //     Testing is 15 percent complete.`
    // }
];

const carousel = document.getElementById('carousel');
const chartWrapper = document.getElementById('chart-wrapper');


// --- Build header strip ---
const titleContainer = document.querySelector('.demo-title');
const titleInner = document.createElement('div');
titleInner.className = 'demo-title-inner';
titleContainer.innerHTML = '';
titleContainer.appendChild(titleInner);


// Add all products + one clone of first
// so the vertical loop seems infinite
products.forEach((p, index) => {
    const item = document.createElement('div');
    item.className = 'demo-title-item';
    item.id = 'title-' + index;
    item.ariaHidden = 'true';
    item.innerHTML = `
        <img src="${imagePath + p.icon}" width="28" height="28" alt="">
        <div><h2>${p.name}</h2><p>${p.tagline}</p></div>
    `;
    titleInner.appendChild(item);
});
const clone = titleInner.firstElementChild.cloneNode(true);
clone.id = 'title-' + products.length;
titleInner.appendChild(clone);

// --- Footer + pagination setup ---
const demoNameContainer = document.getElementById('demo-name-container');
const demoTitleEl = document.getElementById('demoName');
const demoDescEl = document.getElementById('demoDescription');
const pauseBtn = document.getElementById('pause');
// const pagination = document.getElementById('pagination');

let currentIndex = 0;
let carouselInterval;
let isResetting = false;

// Pagination dots
const dots = document.querySelectorAll('.dot');

dots.forEach((dot, i) => {
    dot.addEventListener('click', function () {
        goTo(i);
        if (!isPaused) {
            resetTimer(); // keeps autoplay going after manual navigation
        }
    });
});


// Initial footer state
demoTitleEl.innerHTML = products[0].demoTitle;
demoDescEl.textContent = products[0].demoDesc;

// --- vertical scroll of product names ---
function updateView() {

    let transition = 'all 1s cubic-bezier(0.45, 0, 0.2, 1)';
    let setTimeoutDuration = 1000;

    if (reducedMotion) {
        transition = 'none';
        setTimeoutDuration = 0;
    }
    if (isResetting) {
        return;
    }

    // hide all the product titles from screen readers
    products.forEach((p, index) => {
        // eslint-disable-next-line max-len
        document.getElementById('title-' + index).setAttribute('aria-hidden', 'true');
    });

    if (currentIndex === products.length) {
        currentIndex = 0;
        isResetting = true;
        titleInner.style.transform = `translateY(-${products.length * 40}px)`;
        titleInner.style.opacity = 1;

        updateFooter(currentIndex);
        updateChart(currentIndex);
        isResetting = false;

        setTimeout(() => {
            titleInner.style.transition = 'none';
            titleInner.style.transform = 'translateY(0)';
        }, setTimeoutDuration);

    } else {
        titleInner.style.transition = transition;
        titleInner.style.transform = `translateY(-${currentIndex * 40}px)`;
        titleInner.style.opacity = 1;
        updateFooter(currentIndex);
        updateChart(currentIndex);
    }

    // make the current product header visible to screen readers
    // eslint-disable-next-line max-len
    document.getElementById('title-' + currentIndex).setAttribute('aria-hidden', 'false');
}

function updateFooter(i) {
    const demoInfo = document.getElementById('demo-info');
    const p = products[i];
    let setTimeoutDuration = 400;
    if (reducedMotion) {
        setTimeoutDuration = 0;
    }
    demoInfo.classList.add('fade-out');
    setTimeout(() => {


        demoNameContainer.innerHTML = `<h3 id="demoName">${p.demoTitle}</h3>`;
        if (p.stopLink) {
            demoNameContainer.innerHTML += ' ' + p.stopLink;
        }
        demoDescEl.textContent = p.demoDesc;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[i % products.length].classList.add('active');
        demoInfo.classList.remove('fade-out');
        // Attach event listeners to stop/start links
        attachStopLinkListeners();

    }, setTimeoutDuration);
}

let stockLink, mapsLink, gridLink;


function attachStopLinkListeners() {

    stockLink = document.getElementById('stop-stock');
    mapsLink = document.getElementById('stop-maps');
    gridLink = document.getElementById('stop-grid');

    // Stock
    if (stockLink) {
        // eslint-disable-next-line max-len
        stockLink.addEventListener('click', () => toggleChartAnimation('stock', stockLink));
    }

    // Maps
    if (mapsLink) {
        // eslint-disable-next-line max-len
        mapsLink.addEventListener('click', () => toggleChartAnimation('maps', mapsLink));
    }

    // Grid
    if (gridLink) {
        // eslint-disable-next-line max-len
        gridLink.addEventListener('click', () => toggleChartAnimation('grid', gridLink));
    }
}

function updateAnimationLinkText() {

    if (stockLink) {
        stockLink.textContent = chartAnimationState.stock ?
            '(Stop chart animation)' :
            '(Start chart animation)';
    }
    if (mapsLink) {
        mapsLink.textContent = chartAnimationState.maps ?
            '(Stop chart animation)' :
            '(Start chart animation)';
    }
    if (gridLink) {
        gridLink.textContent = chartAnimationState.grid ?
            '(Stop chart animation)' :
            '(Start chart animation)';
    }
}


function toggleChartAnimation(chartType, link) {
    const isStarting = !chartAnimationState[chartType];
    chartAnimationState[chartType] = isStarting;

    // Update link text
    link.textContent = isStarting ?
        '(Stop chart animation)' :
        '(Start chart animation)';

    // Handle chart-specific animation
    if (chartType === 'stock') {
        if (isStarting) {
            startStockChartAnimation();
            announceChange('Stock chart animation started.');
        } else {
            stopStockChartAnimation();
            announceChange('Stock chart animation paused.');
        }
    } else if (chartType === 'maps') {
        if (isStarting) {
            startMapAnimation();
            announceChange('Map animation started.');
        } else {
            stopMapAnimation();
            announceChange('Map animation paused.');
        }
    } else if (chartType === 'grid') {
        if (!gridControls) {
            return;
        }
        if (isStarting) {
            if (typeof gridControls.resumeGridUpdates === 'function') {
                gridControls.resumeGridUpdates();
            } else if (typeof gridControls.startGridUpdates === 'function') {
                gridControls.startGridUpdates();
            } else {
                // nothing
            }
            announceChange('Grid chart animation started.');
        } else {
            if (typeof gridControls.clearGridUpdates === 'function') {
                gridControls.clearGridUpdates();
                announceChange('Grid chart animation paused.');
            }
        }
    }
}


function getChartDescription(i) {

    if (document.getElementById('chart-description') !== null) {
        document.getElementById('chart-description').remove();
    }

    const description = document.createElement('div');
    description.setAttribute('aria-hidden', 'false');
    description.setAttribute('id', 'chart-description');
    description.innerHTML = products[i].description;

    // Append the new div to the container
    chartWrapper.prepend(description);
    chartWrapper.setAttribute('aria-describedby', 'chart-description');

    announceChange('New Chart: ' + products[i].demoTitle);

}
// --- Stock Chart Animation Control ---
function startStockChartAnimation() {
    if (typeof animateCS === 'function') {
        // Prevent multiple intervals
        if (typeof csInterval !== 'undefined') {
            clearInterval(csInterval);
        }
        animateCS();
    }
}

function stopStockChartAnimation() {
    if (typeof csInterval !== 'undefined') {
        clearInterval(csInterval);
        logAnim('Stock animation stopped');
    }
}

// --- Map Animation Control ---
function startMapAnimation() {
    document.querySelectorAll('.animated-line').forEach(line => {
        line.classList.remove('paused');
    });
}

function stopMapAnimation() {
    document.querySelectorAll('.animated-line').forEach(line => {
        line.classList.add('paused');
    });
    logAnim('Map animation stopped');
}
// --- Animation Failsafe ---
function ensureCorrectAnimationState() {
    // When resuming, respect each chart's individual animation preference
    Object.keys(chartAnimationState).forEach(key => {
        const isActive = chartAnimationState[key];
        // stock chart
        if (key === 'stock' && products[currentIndex].chart === cs) {
            if (isActive) {
                startStockChartAnimation();
                logAnim('Stock animation resumed');
            } else {
                stopStockChartAnimation();
                logAnim('Stock animation paused');
            }
        }
        // map chart
        if (key === 'maps' && products[currentIndex].chart === animatedMap) {
            if (isActive) {
                startMapAnimation();
                logAnim('Map animation resumed');
            } else {
                stopMapAnimation();
                logAnim('Map animation paused');
            }
        }
        // grid
        // eslint-disable-next-line max-len
        if (key === 'grid' && gridControls && products[currentIndex].chart === grid) {
            if (isActive) {
                if (typeof gridControls.resumeGridUpdates === 'function') {
                    gridControls.resumeGridUpdates();
                    logAnim('Grid updates resumed');
                // eslint-disable-next-line max-len
                } else if (typeof gridControls.startGridUpdates === 'function') {
                    gridControls.startGridUpdates();
                    logAnim('Grid updates resumed (startGridUpdates fallback)');
                }
            } else {
                if (typeof gridControls.clearGridUpdates === 'function') {
                    gridControls.clearGridUpdates();
                    logAnim('Grid updates paused');
                }
            }
        }
    });
}

function announceChange(announcement) {
    if (isPaused) {
        const announce = document.getElementById('announce');
        announce.textContent = '';

        const newElem = document.createElement('span');
        newElem.textContent = announcement;
        announce.appendChild(newElem);
    }
}

function updateChart(i) {

    const p = products[i];

    // Invalidate pending swaps and async loads from previous slides
    const token = ++slideToken;

    let setTimeoutDuration = 250;
    if (reducedMotion) {
        setTimeoutDuration = 0;
    }

    // Hide the chart from screen readers while animating
    if (!isPaused) {
        chartWrapper.setAttribute('aria-hidden', 'true');
    }

    // fade transition between charts
    chartWrapper.classList.add('fade-out');

    setTimeout(() => {

        // A newer slide change superseded this one (e.g. fast dot clicks)
        if (token !== slideToken) {
            return;
        }

        try {

            // destroy current chart. It may already be destroyed if another
            // chart was rendered into the same container, in which case its
            // properties (including the renderer) have been deleted.
            if (currentChart && currentChart.renderer) {
                currentChart.destroy();
            }
            currentChart = null;

            // Grid row updates are expensive, only run them while it's visible
            if (p.chart !== grid && gridControls) {
                gridControls.clearGridUpdates();
            }

            // once faded out, swap charts
            if (p.chart) {
                // clear interval for stock chart
                clearInterval(csInterval);

                // dash and grid use their own containers
                if (typeof p.chart === 'function') {
                    if (p.chart === dashboards) {
                        // eslint-disable-next-line max-len
                        document.getElementById('container').style.display = 'none';
                        // eslint-disable-next-line max-len
                        document.getElementById('grid-container').style.display = 'none';
                        // eslint-disable-next-line max-len
                        document.getElementById('dash-container').style.display = 'block';
                        // Build on first visit, once the container is visible
                        if (!dashboardsBuilt) {
                            dashboardsBuilt = true;
                            dashboards();
                        }
                    } else if (p.chart === grid) {
                        // eslint-disable-next-line max-len
                        document.getElementById('container').style.display = 'none';
                        // eslint-disable-next-line max-len
                        document.getElementById('dash-container').style.display = 'none';
                        // eslint-disable-next-line max-len
                        document.getElementById('grid-container').style.display = 'block';
                        // Build on first visit, once the container is visible
                        if (!gridControls) {
                            gridControls = grid();
                        }
                    } else {
                        // eslint-disable-next-line max-len
                        document.getElementById('dash-container').style.display = 'none';
                        // eslint-disable-next-line max-len
                        document.getElementById('grid-container').style.display = 'none';
                        // eslint-disable-next-line max-len
                        document.getElementById('container').style.display = 'block';
                        p.chart();
                    }
                } else {
                    // eslint-disable-next-line max-len
                    document.getElementById('dash-container').style.display = 'none';
                    // eslint-disable-next-line max-len
                    document.getElementById('grid-container').style.display = 'none';
                    // eslint-disable-next-line max-len
                    document.getElementById('container').style.display = 'block';
                    currentChart = Highcharts.chart('container', p.chart);
                }
            }

        } finally {
            // Always fade back in, even if a demo failed to render, so one
            // broken slide can't hide all the following ones
            chartWrapper.classList.remove('fade-out');
        }

        // if the carousel is paused, update the chart description
        // and make the product title visible to screen readers
        if (isPaused) {
            getChartDescription(i);
        }

        if (p.chart === cs && !chartAnimationState.stock) {
            stopStockChartAnimation();
        }

        if (p.chart === animatedMap) {
            if (!chartAnimationState.maps) {
                // Wait briefly for map DOM to fully render
                // before stopping animation
                setTimeout(() => {
                    stopMapAnimation();
                }, 200); // give time for .animated-line elements to appear
            } else {
                // ensure they’re active if user turned them on
                setTimeout(() => {
                    startMapAnimation();
                }, 200);
            }
        }

        if (p.chart === grid && gridControls && !chartAnimationState.grid) {
            if (typeof gridControls.clearGridUpdates === 'function') {
                gridControls.clearGridUpdates();
            }
        }

    }, setTimeoutDuration);

    // final failsafe after chart transition completes
    setTimeout(() => {
        ensureCorrectAnimationState();
    }, 300);
}


// --- Controls ---
function next() {
    currentIndex++;
    updateView();
    resetTimer();
}

// when the user clicks a dot
// the carousel pauses
function goTo(i) {
    currentIndex = i;
    updateView();
}

function startAuto() {
    carouselInterval = setInterval(next, 6000);
}

function resetTimer() {
    clearInterval(carouselInterval);
    startAuto();
}

function pause() {
    isPaused = true;

    // stop the carousel interval
    clearInterval(carouselInterval);

    ensureCorrectAnimationState();

    // Update the animation control link text
    updateAnimationLinkText();
    // }

    // update aria label on carousel container
    carousel.setAttribute(
        'aria-label',
        // eslint-disable-next-line max-len
        'Demo carousel paused. You can now explore individual demos using keyboard navigation.'
    );

    // make charts visible to screen readers
    chartWrapper.removeAttribute('aria-hidden');

    // change the helper button text
    document.getElementById('accessibility-helper').innerHTML =
        'Click to play the carousel';

    // add the chart description since paused
    getChartDescription(currentIndex);

    // update carousel pause button
    pauseBtn.ariaLabel = 'Resume automatic slide show';
    pauseBtn.innerHTML =
        '<span class="hc-button_content">' +
        '<span>Resume</span>' +
        '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        // eslint-disable-next-line max-len
        '<path d="M1 5C1 5 2.00249 3.63411 2.81692 2.81912C3.63134 2.00413 4.7568 1.5 6 1.5C8.48528 1.5 10.5 3.51472 10.5 6C10.5 8.48528 8.48528 10.5 6 10.5C3.94845 10.5 2.21756 9.12714 1.67588 7.25M1 5V2M1 5H4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>';

    announceChange('Demo carousel paused');
}

function resume() {
    isPaused = false;

    // restart the carousel interval
    startAuto();

    // ensure correct animation running for current chart
    ensureCorrectAnimationState();
    updateAnimationLinkText();


    // update the carousel aria label
    carousel.setAttribute(
        'aria-label',
        // eslint-disable-next-line max-len
        'Highcharts product demos. Pause the carousel to explore demos individually and use the carousel controls to switch between demos.'
    );

    // update the helper button text
    document.getElementById('accessibility-helper').innerHTML =
        'Click to pause the carousel';

    // hide the charts from screen readers
    chartWrapper.setAttribute('aria-hidden', 'true');

    // update carousel pause button
    pauseBtn.ariaLabel = 'Pause automatic slide show';
    pauseBtn.innerHTML =
        '<span class="hc-button_content">' +
        '<span>Pause</span>' +
        '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        // eslint-disable-next-line max-len
        '<path d="M3.4 1.5H3.1C2.53995 1.5 2.25992 1.5 2.04601 1.60899C1.85785 1.70487 1.70487 1.85785 1.60899 2.04601C1.5 2.25992 1.5 2.53995 1.5 3.1V8.9C1.5 9.46005 1.5 9.74008 1.60899 9.95399C1.70487 10.1422 1.85785 10.2951 2.04601 10.391C2.25992 10.5 2.53995 10.5 3.1 10.5H3.4C3.96005 10.5 4.24008 10.5 4.45399 10.391C4.64215 10.2951 4.79513 10.1422 4.89101 9.95399C5 9.74008 5 9.46005 5 8.9V3.1C5 2.53995 5 2.25992 4.89101 2.04601C4.79513 1.85785 4.64215 1.70487 4.45399 1.60899C4.24008 1.5 3.96005 1.5 3.4 1.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>' +
        // eslint-disable-next-line max-len
        '<path d="M8.9 1.5H8.6C8.03995 1.5 7.75992 1.5 7.54601 1.60899C7.35785 1.70487 7.20487 1.85785 7.10899 2.04601C7 2.25992 7 2.53995 7 3.1V8.9C7 9.46005 7 9.74008 7.10899 9.95399C7.20487 10.1422 7.35785 10.2951 7.54601 10.391C7.75992 10.5 8.03995 10.5 8.6 10.5H8.9C9.46005 10.5 9.74008 10.5 9.95399 10.391C10.1422 10.2951 10.2951 10.1422 10.391 9.95399C10.5 9.74008 10.5 9.46005 10.5 8.9V3.1C10.5 2.53995 10.5 2.25992 10.391 2.04601C10.2951 1.85785 10.1422 1.70487 9.95399 1.60899C9.74008 1.5 9.46005 1.5 8.9 1.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>';

    // remove chart description since carousel is running
    if (document.getElementById('chart-description') !== null) {
        document.getElementById('chart-description').remove();
    }

    announceChange('Demo carousel playing');


}

function toggleCarousel() {
    if (!isPaused) {
        pause();
    } else {
        resume();
    }
}

document.getElementById('pause').addEventListener('click', toggleCarousel);

// eslint-disable-next-line max-len
document.getElementById('accessibility-helper').addEventListener('click', toggleCarousel);

function initializePauseButtonState() {
    const helper = document.getElementById('accessibility-helper');

    if (reducedMotion) {
        // Start paused, so button should show "Resume"
        isPaused = true;

        pauseBtn.ariaLabel = 'Resume automatic slide show';
        pauseBtn.innerHTML =
            '<span class="hc-button_content">' +
            '<span>Resume</span>' +
            '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            // eslint-disable-next-line max-len
            '<path d="M1 5C1 5 2.00249 3.63411 2.81692 2.81912C3.63134 2.00413 4.7568 1.5 6 1.5C8.48528 1.5 10.5 3.51472 10.5 6C10.5 8.48528 8.48528 10.5 6 10.5C3.94845 10.5 2.21756 9.12714 1.67588 7.25M1 5V2M1 5H4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>' +
            '</svg>';
        helper.innerHTML = 'Click to play the carousel';
    } else {
        // Normal autoplay state → button shows "Pause"
        isPaused = false;

        pauseBtn.ariaLabel = 'Pause automatic slide show';
        pauseBtn.innerHTML =
            '<span class="hc-button_content">' +
            '<span>Pause</span>' +
            '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            // eslint-disable-next-line max-len
            '<path d="M3.4 1.5H3.1C2.53995 1.5 2.25992 1.5 2.04601 1.60899C1.85785 1.70487 1.70487 1.85785 1.60899 2.04601C1.5 2.25992 1.5 2.53995 1.5 3.1V8.9C1.5 9.46005 1.5 9.74008 1.60899 9.95399C1.70487 10.1422 1.85785 10.2951 2.04601 10.391C2.25992 10.5 2.53995 10.5 3.1 10.5H3.4C3.96005 10.5 4.24008 10.5 4.45399 10.391C4.64215 10.2951 4.79513 10.1422 4.89101 9.95399C5 9.74008 5 9.46005 5 8.9V3.1C5 2.53995 5 2.25992 4.89101 2.04601C4.79513 1.85785 4.64215 1.70487 4.45399 1.60899C4.24008 1.5 3.96005 1.5 3.4 1.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>' +
            // eslint-disable-next-line max-len
            '<path d="M8.9 1.5H8.6C8.03995 1.5 7.75992 1.5 7.54601 1.60899C7.35785 1.70487 7.20487 1.85785 7.10899 2.04601C7 2.25992 7 2.53995 7 3.1V8.9C7 9.46005 7 9.74008 7.10899 9.95399C7.20487 10.1422 7.35785 10.2951 7.54601 10.391C7.75992 10.5 8.03995 10.5 8.6 10.5H8.9C9.46005 10.5 9.74008 10.5 9.95399 10.391C10.1422 10.2951 10.2951 10.1422 10.391 9.95399C10.5 9.74008 10.5 9.46005 10.5 8.9V3.1C10.5 2.53995 10.5 2.25992 10.391 2.04601C10.2951 1.85785 10.1422 1.70487 9.95399 1.60899C9.74008 1.5 9.46005 1.5 8.9 1.5Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>' +
            '</svg>';
        helper.innerHTML = 'Click to pause the carousel';
    }
}


document.addEventListener('DOMContentLoaded', function () {

    // --- Initialize button states first ---
    initializePauseButtonState();

    // --- Start carousel setup ---
    // Dashboards and Grid are built on their first visit (see updateChart)
    // so they don't compete with the first chart for the main thread.

    // create the first chart
    document.querySelector('.demo-title-inner').style.opacity = 1;
    document.getElementById('title-0').setAttribute('aria-hidden', 'false');
    updateChart(0);

    // Prefetch once the first chart is up, giving the request most of the
    // first slide's display time to complete.
    setTimeout(prefetchMorningstarData, 1000);

    if (reducedMotion) {
        // Start paused for users who prefer reduced motion
        isPaused = true;

        // Stop any intervals or animations
        clearInterval(carouselInterval);
        stopStockChartAnimation();
        stopMapAnimation();

        Object.keys(chartAnimationState).forEach(function (key) {
            chartAnimationState[key] = false;
        });

        // Make charts accessible to screen readers
        chartWrapper.removeAttribute('aria-hidden');
        getChartDescription(0);

        // Update accessibility and button states to "resume" mode
        carousel.setAttribute(
            'aria-label',
            `Demo carousel paused by default due to reduced motion preference. 
            You can explore demos manually or resume automatic playback.`
        );

        document.getElementById('accessibility-helper').innerHTML =
            'Click to play the carousel';

        pauseBtn.ariaLabel = 'Resume automatic slide show';
        pauseBtn.innerHTML =
            '<span class="hc-button_content">' +
            '<span>Resume</span>' +
            '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            // eslint-disable-next-line max-len
            '<path d="M1 5C1 5 2.00249 3.63411 2.81692 2.81912C3.63134 2.00413 4.7568 1.5 6 1.5C8.48528 1.5 10.5 3.51472 10.5 6C10.5 8.48528 8.48528 10.5 6 10.5C3.94845 10.5 2.21756 9.12714 1.67588 7.25M1 5V2M1 5H4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>' +
            '</svg>';

        // eslint-disable-next-line max-len
        announceChange('Demo carousel paused due to reduced motion preference.');
    } else {
        // Normal behavior for non-reduced motion users
        isPaused = false;
        startAuto();
    }
});
