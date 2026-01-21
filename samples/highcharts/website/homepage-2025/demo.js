const DEBUG_ANIM = false;
function logAnim(msg) {
    if (DEBUG_ANIM) {
        console.log('[DemoAnim]', msg);
    }
}

// Set up the image path
const imagePath = 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@8967ac2dfa99c53005e2aa6221a03f3f6445e376/samples/graphics/homepage/';

// reduced motion
// eslint-disable-next-line max-len
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let isPaused = false;
let gridControls = null;
let currentChart = null;

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
    let color = '--var(text-primary)';
    if (this.index === 0) {
        color = '#fff';
    }
    return `<span style="font-size:12px;
    color:${color};background:rgba(0,0,0,0.1);
    border-radius:3px;padding:2px 5px;">
    ${this.point.y}%</span>`;
}

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
    let i = 0;
    csInterval = setInterval(() => {
        const data = csSeries.options.data,
            newPoint = getNewPoint(i, data),
            lastPoint = data[data.length - 1];

        // Different x-value, we need to add a new point
        if (lastPoint[0] !== newPoint[0]) {
            csSeries.addPoint(newPoint);
        } else {
        // Existing point, update it
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
            visible: false,
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

// Maps animated map
function animatedMap() {
    (async () => {
        const topology = await fetch(
            'https://code.highcharts.com/mapdata/custom/world-highres.topo.json'
        ).then(response => response.json());

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
    })();
}

// Gantt chart
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

    Highcharts.setOptions({
        chart: {
            styledMode: true
        }
    });
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

    // Data preparation
    const data = new Grid.DataTable({
        columns: {
            // instanceId: [
            //     'i-18cd0d5', 'i-2b3f4e6', 'i-3c5d6e3',
            // 'i-4d7e8f6', 'i-5e9f0a7',
            //     'i-6f1a2b2', 'i-7a2b3c4', 'i-8b3c4d8',
            //  'i-9c4d5e3', 'i-0d5e6f2',
            //     'i-1f2g3h4', 'i-2g3h4i5', 'i-3h4i5j6',
            //  'i-4i5j6k7', 'i-5j6k7l8',
            //     'i-6k7l8m9', 'i-7l8m9n0', 'i-8m9n0o1',
            //  'i-9n0o1p2', 'i-0o1p2q3',
            //     'i-1p2q3r4', 'i-2q3r4s5', 'i-3r4s5t6',
            //  'i-4s5t6u7', 'i-5t6u7v8',
            //     'i-6u7v8w9', 'i-7v8w9x0', 'i-8w9x0y1',
            //  'i-9x0y1z2', 'i-0y1z2a3'
            // ],
            running: [
                true, true, true, true, true, false, true, true, false, true,
                true, false, true, true, true, true, false, true, true, false,
                true, true, false, true, true, true, true, false, true, true
            ],
            cpuUtilization: [
                '15, 18, 29, 48, 56, 54, 34, 28, 23, 13, 8, 5, 9, 15, 25',
                '99, 96, 82, 53, 33, 22, 29, 38, 52, 73, 84, 91, 97, 89, 70',
                '1, 4, 24, 65, 79, 77, 52, 38, 29, 22, 16, 10, 6, 9, 15',
                '50, 54, 64, 78, 89, 96, 99, 95, 89, 86, 83, 80, 76, 73, 70',
                '20, 21, 22, 25, 28, 31, 35, 43, 51, 58, 58, 55, 59, 58, 54',
                '0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0',
                '97, 92, 89, 85, 82, 81, 85, 88, 91, 97, 97, 94, 93, 92, 91',
                '5, 2, 1, 2, 4, 7, 9, 6, 4, 3, 3, 2, 1, 1, 0',
                '0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0',
                '86, 73, 57, 38, 35, 44, 70, 56, 33, 23, 18, 15, 11, 8, 5',
                '45, 48, 52, 58, 64, 70, 75, 78, 74, 68, 62, 55, 48, 42, 38',
                '0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0',
                '30, 35, 42, 51, 58, 64, 68, 65, 59, 52, 46, 39, 33, 28, 24',
                '88, 85, 80, 75, 71, 68, 66, 64, 62, 61, 60, 59, 58, 57, 56',
                '12, 15, 19, 25, 32, 40, 48, 55, 61, 65, 67, 66, 63, 58, 52',
                '95, 93, 90, 87, 84, 82, 80, 78, 76, 75, 74, 73, 72, 71, 70',
                '0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0',
                '60, 58, 55, 52, 49, 47, 45, 44, 43, 42, 42, 43, 44, 45, 46',
                '25, 28, 32, 37, 43, 50, 58, 65, 71, 75, 77, 76, 73, 69, 64',
                '0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0',
                '70, 68, 65, 61, 57, 53, 49, 46, 43, 41, 39, 38, 37, 36, 35',
                '35, 38, 42, 47, 53, 60, 67, 73, 78, 81, 82, 81, 78, 74, 69',
                '0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0',
                '92, 89, 85, 81, 77, 74, 71, 69, 67, 66, 65, 64, 63, 62, 61',
                '8, 11, 16, 23, 31, 40, 49, 57, 63, 67, 69, 68, 65, 60, 54',
                '55, 58, 62, 67, 73, 79, 84, 88, 90, 90, 88, 85, 81, 76, 71',
                '18, 21, 25, 30, 36, 43, 51, 59, 66, 71, 74, 75, 73, 69, 64',
                '0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0',
                '78, 75, 71, 66, 61, 56, 52, 48, 45, 43, 41, 40, 39, 38, 37',
                '42, 45, 49, 54, 60, 67, 74, 80, 85, 88, 89, 88, 85, 81, 76'
            ],
            memoryUtilization: [
                '28, 35, 41, 41, 43, 41, 47, 53, 63, 64, 64, 65, 75, 74, 79',
                '76, 79, 77, 72, 67, 63, 63, 56, 54, 49, 42, 38, 42, 33, 28',
                '49, 55, 57, 67, 69, 72, 78, 78, 75, 72, 72, 67, 61, 61, 54',
                '48, 49, 40, 35, 38, 26, 20, 22, 28, 24, 29, 26, 39, 35, 55',
                '40, 40, 40, 41, 39, 38, 40, 42, 39, 69, 63, 67, 61, 65, 64',
                '0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0',
                '50, 48, 52, 51, 50, 48, 50, 53, 50, 50, 49, 50, 52, 51, 50',
                '45, 47, 46, 44, 47, 48, 71, 46, 43, 44, 47, 45, 49, 44, 44',
                '0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0',
                '100, 86, 89, 78, 72, 64, 61, 52, 50, 49, 42, 35, 36, 33, 32',
                '35, 38, 42, 45, 48, 51, 54, 56, 58, 60, 61, 62, 63, 64, 65',
                '0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0',
                '55, 58, 61, 63, 65, 67, 68, 69, 68, 66, 64, 62, 60, 58, 56',
                '72, 70, 68, 66, 64, 62, 60, 59, 58, 57, 56, 55, 54, 53, 52',
                '30, 32, 35, 38, 42, 46, 50, 54, 58, 61, 63, 64, 65, 65, 65',
                '80, 78, 76, 74, 72, 70, 68, 67, 66, 65, 64, 63, 62, 61, 60',
                '0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0',
                '52, 54, 56, 58, 59, 60, 61, 62, 62, 62, 61, 60, 59, 58, 57',
                '44, 46, 49, 52, 55, 58, 61, 64, 66, 68, 69, 70, 70, 70, 69',
                '0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0',
                '68, 66, 64, 62, 60, 58, 56, 55, 54, 53, 52, 51, 50, 50, 50',
                '38, 40, 43, 46, 50, 54, 58, 62, 65, 68, 70, 71, 72, 72, 71',
                '0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0',
                '85, 83, 81, 79, 77, 75, 73, 71, 70, 69, 68, 67, 66, 65, 64',
                '25, 27, 30, 33, 37, 41, 45, 49, 53, 57, 60, 62, 64, 65, 66',
                '58, 60, 62, 64, 66, 68, 70, 71, 72, 73, 73, 73, 72, 71, 70',
                '42, 44, 47, 50, 53, 56, 59, 62, 64, 66, 67, 68, 68, 68, 67',
                '0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0',
                '75, 73, 71, 69, 67, 65, 63, 61, 60, 59, 58, 57, 56, 55, 54',
                '48, 50, 53, 56, 59, 62, 65, 68, 70, 72, 73, 74, 74, 74, 73'
            ],
            publicIP: [
                '54.123.456.78', '152.234.567.89', '203.123.456.90',
                '198.123.456.91', '172.123.456.92', '192.123.456.93',
                '10.123.456.94', '203.123.456.95', '198.123.456.96',
                '172.123.456.97',
                '54.234.567.100', '152.123.456.101', '203.234.567.102',
                '198.234.567.103', '172.234.567.104', '192.234.567.105',
                '10.234.567.106', '203.123.456.107', '198.123.456.108',
                '172.123.456.109',
                '54.123.789.110', '152.234.890.111', '203.123.789.112',
                '198.234.890.113', '172.123.789.114', '192.234.890.115',
                '10.123.789.116', '203.234.890.117', '198.123.789.118',
                '172.234.890.119'
            ],
            // diskOperationsIn: [
            //     10, 20, 1, 30, 40, 0, 25, 60, 0, 70,
            //     15, 0, 35, 45, 50, 55, 0, 40, 65, 0,
            //     12, 28, 0, 38, 48, 52, 58, 0, 42, 68
            // ],
            // diskOperationsOut: [
            //     80, 70, 36, 60, 50, 0, 36, 30, 0, 20,
            //     75, 0, 55, 65, 45, 40, 0, 50, 35, 0,
            //     78, 72, 0, 62, 48, 42, 38, 0, 52, 25
            // ],
            diskUsage: [
                4, 9, 80, 30, 95, 0, 15, 8, 0, 90,
                12, 0, 65, 45, 88, 75, 0, 22, 55, 0,
                18, 35, 0, 50, 92, 70, 28, 0, 60, 85
            ]
        }
    });

    // Defined zones here to use in various sparkline options.
    const percentageZones = [{
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
    }];

    // Create the grid with the data table and configure the columns.
    const grid = Grid.grid('grid-container', {
        dataTable: data,
        rendering: {
            rows: {
                strictHeights: true
            }
        },
        credits: {
            enabled: false
        },
        columns: [{
            id: 'running',
            header: {
                format: 'Status'
            },
            cells: {
                format: `{#if value}
                <div class="status running">running</div>
            {else}
                <div class="status stopped">stopped</div>
            {/if}`
            },
            width: 100
        }, {
            id: 'cpuUtilization',
            header: {
                format: 'CPU Utilization'
            },
            cells: {
                renderer: {
                    type: 'sparkline',
                    chartOptions: {
                        chart: {
                            type: 'line',
                            // Take note that the animation is enabled by
                            // default for sparkline charts, but we can disable
                            // it if we want to.
                            animation: false
                        },
                        yAxis: {
                            min: 0,
                            max: 100.1
                        },
                        plotOptions: {
                            series: {
                                zones: percentageZones,
                                label: {
                                    enabled: false
                                }
                            }
                        }
                    }
                }
            }
        }, {
            id: 'memoryUtilization',
            header: {
                format: 'Memory Utilization'
            },
            cells: {
                renderer: {
                    type: 'sparkline',
                    chartOptions: function (data) {
                        const yData = data.split(',').map(Number);

                        // To make the sparkline animate like the
                        // points are added
                        // to the end of the series isntead of
                        // updating the existing
                        // points, we need to update also the x values of the
                        // points. It can be done in the dataset directly, or
                        // calculated here, in the `chartOptions` callback.
                        const firstX = (
                            // eslint-disable-next-line max-len
                            this.content?.chart?.series?.[0].points?.[0]?.x ?? -1
                        ) + 1;

                        return {
                            yAxis: {
                                min: 0,
                                max: 100
                            },
                            series: [{
                                type: 'column',
                                data: yData.map((y, i) => ([firstX + i, y])),
                                borderRadius: 0,
                                // Columns rendered on a sparkline are usually
                                // very thin, so crisp edges make the spaces
                                // between points irregular. Turning crisp off
                                // makes them evenly spaced, but with slightly
                                // blurred edges.
                                crisp: false,
                                zones: percentageZones
                            }]
                        };
                    }
                }
            }
        }, {
            id: 'publicIP',
            header: {
                format: 'Public IP'
            },
            width: 110
        },
        // {
        //     id: 'diskOperationsIn',
        //     header: {
        //         format: 'Disk Operations'
        //     },
        //     cells: {
        //         renderer: {
        //             type: 'sparkline',
        //             // This sparkline uses two columns of
        //             // data to render a bar chart
        //             // with two bars, one for disk
        //             // operations in and one for disk
        //             // operations out. That's why the `chartOptions` is a
        // eslint-disable-next-line max-len
        //             // function that returns the options based on the row data.
        //             // The context of the function is the cell, so we can
        //             // access the row data using `this.row.data`.
        //             chartOptions: function () {
        //                 return {
        //                     chart: {
        //                         type: 'bar',
        //                         marginLeft: 35
        //                     },
        //                     yAxis: {
        //                         min: 0,
        //                         max: 100
        //                     },
        //                     xAxis: {
        // eslint-disable-next-line max-len
        //                     // Axes are not rendered on sparklines, by default,
        //                     // but we can turn them on in the chart options.
        //                         visible: true,
        //                         categories: ['in', 'out'],
        //                         lineColor: '#999',
        //                         labels: {
        //                             enabled: true,
        //                             allowOverlap: true,
        //                             distance: 3,
        //                             style: {
        //                                 color: '#999'
        //                             }
        //                         }
        //                     },
        //                     series: [{
        //                         colorByPoint: true,
        //                         label: {
        //                             enabled: false
        //                         },
        //                         data: [
        //                             this.row.data.diskOperationsIn,
        //                             this.row.data.diskOperationsOut
        //                         ],
        //                         dataLabels: {
        //                             enabled: true,
        //                             allowOverlap: true,
        //                             useHTML: true,
        // eslint-disable-next-line max-len, max-len
        //                             format: '<span class="spark-label">{y}</span>'
        //                         }
        //                     }]
        //                 };
        //             }
        //         }
        //     }
        // }, {
        //     id: 'diskOperationsOut',
        //     // This column is not rendered, but it is used by the
        //     // `diskOperationsIn` column to render the sparkline.
        //     enabled: false
        // },
        {
            id: 'diskUsage',
            width: 120,
            header: {
                format: 'Disk Usage'
            },
            cells: {
                renderer: {
                    type: 'sparkline',
                    // The first argument of the `chartOptions` function is the
                    // raw data value of the cell, so we can use it to set the
                    // chart options based on the value.
                    chartOptions: function (data) {
                        return {
                            chart: {
                                type: 'pie'
                            },
                            series: [{
                                data: [{
                                    name: 'Used',
                                    label: {
                                        enabled: false
                                    },
                                    y: data,
                                    className: percentageZones.find(
                                        zone => data <= (zone.value || Infinity)
                                    ).className
                                }, {
                                    name: 'Free',
                                    y: 100 - data,
                                    color: '#9994'
                                }]
                            }]
                        };
                    }
                }
            }
        }],
        pagination: {
            enabled: true,
            pageSize: 10,
            controls: {
                pageSizeSelector: {
                    enabled: false,
                    options: [10, 25, 50, 100]
                },
                pageInfo: {
                    enabled: false
                },
                firstLastButtons: {
                    enabled: true
                },
                previousNextButtons: {
                    enabled: true
                },
                pageButtons: {
                    enabled: true,
                    count: 5
                }
            }
        }
    });

    // --- Utility: fade sparkline visuals when paused ---
    const gridContainer = document.getElementById('grid-container');
    function setGridPausedVisual(paused) {
        gridContainer.classList.toggle('paused-grid', paused);
    }

    // --- Update scheduler ---
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


    function generateArrayFlow(stringArray) {
        const r = Math.random() * 2 - 1;
        const change = Math.floor(r * r * r * 30);
        const array = stringArray.split(',').map(Number);
        array.shift();
        array.push(Highcharts.clamp(array[array.length - 1] + change, 0, 100));
        return array.join(', ');
    }

    async function updateInstanceStatus(rowIndex) {
        const running = data.getCell('running', rowIndex);
        if (!running) {
            return;
        }

        const cpuUtilization = data.getCell('cpuUtilization', rowIndex);
        const memoryUtilization = data.getCell('memoryUtilization', rowIndex);

        // eslint-disable-next-line max-len
        data.setCell('cpuUtilization', rowIndex, generateArrayFlow(cpuUtilization));
        // eslint-disable-next-line max-len
        data.setCell('memoryUtilization', rowIndex, generateArrayFlow(memoryUtilization));
        // eslint-disable-next-line max-len
        // data.setCell('diskOperationsIn', rowIndex, Math.round(Math.random() * 100));
        // eslint-disable-next-line max-len
        // data.setCell('diskOperationsOut', rowIndex, Math.round(Math.random() * 100));
        data.setCell('diskUsage', rowIndex, Math.round(Math.random() * 100));

        const row = grid?.viewport.getRow(rowIndex);
        if (!row) {
            return;
        }

        await grid.querying.proceed(true);
        grid.viewport.dataTable = grid.presentationTable;
        for (const column of grid.viewport.columns) {
            column.loadData();
        }
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

        for (let i = 0, iEnd = data.getRowCount(); i < iEnd; i++) {
            scheduleUpdate(i);
        }
        setGridPausedVisual(false);
    }


    // --- Initialize ---
    if (!reducedMotion && !globallyPaused) {
        for (let i = 0, iEnd = data.getRowCount(); i < iEnd; i++) {
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
        name: 'Highcharts Stock',
        tagline: 'Financial visualization and analysis tools',
        id: 'stockTitle',
        icon: 'icon-stock.svg',
        chart: cs,
        // eslint-disable-next-line max-len
        demoTitle: 'Candlestick chart',
        // eslint-disable-next-line max-len
        demoDesc: 'Candlesticks make it easy to spot trends over time.',
        // eslint-disable-next-line max-len
        stopLink: `<button class="stop-link" 
        id="stop-stock">(Stop chart animation)</button>`,
        description: `<p>Dynamic Candlestick Chart</p>
        <div>A purely decorative candlestick chart that updates with 
        new data every 100 milliseconds.</div>`
    },
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
        displaying the status and performance metrics of 30 virtual 
        server instances. Each row represents an instance with columns 
        for running status, CPU and memory utilization sparklines, 
        public IP address, disk operations bar chart, and disk usage pie chart.`
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
    {
        name: 'Highcharts Dashboards',
        tagline: 'Time-saving dashboard tools',
        id: 'dashboardsTitle',
        chart: dashboards,
        icon: 'icon-dashboards.svg',
        demoTitle: 'Personal finance dashboard',
        stopLink: null,
        demoDesc: 'Use our data sync tools to create dynamic dashboards fast.',
        description: `<p>Personal Finance Dashboard</p>A purely decorative  
        dashboard showing key financial metrics, including total 
        balance, savings, earnings, spendings, and recent transactions. 
        Line and area charts illustrate trends in balance, 
        savings growth, and monthly earnings. A pie chart shows 
        wallet condition, indicating 58 percent of income saved 
        this month. A data table lists four recent transactions 
        by receiver, amount, and remaining balance.`
    },
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
    },
    {
        name: 'Highcharts Gantt',
        tagline: 'Resource and timeline management',
        id: 'ganttTitle',
        chart: gantt,
        stopLink: null,
        icon: 'icon-gantt.svg',
        demoTitle: 'Gantt chart',
        demoDesc: `Use Gantts to track tasks, dependencies, and 
        progress.`,
        description: `<p>Gantt Chart</p>A purely decorative gantt chart showing 
        three project phases: Prototyping, Development, 
        and Testing. Each bar represents task progress, 
        with dependencies shown as connecting lines. 
        Prototyping is 95 percent complete, Development 
        tasks are 70 and 30 percent complete, and 
        Testing is 15 percent complete.`
    }
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
clone.id = 'title-6';
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
        titleInner.style.transform = 'translateY(-240px)';
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
        if (key === 'stock' && currentIndex === 0) { // stock index is 0
            if (isActive) {
                startStockChartAnimation();
                logAnim('Stock animation resumed');
            } else {
                stopStockChartAnimation();
                logAnim('Stock animation paused');
            }
        }
        // map chart
        if (key === 'maps' && currentIndex === 4) { // maps index is 4
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
        if (key === 'grid' && gridControls && currentIndex === 1) { // grid index is 1
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

        // destroy current chart
        if (currentChart !== null) {
            currentChart.destroy();
            currentChart = null;
        }

        // once faded out, swap charts
        if (p.chart) {
            // clear interval for stock chart
            clearInterval(csInterval);

            // dash and grid use their own containers
            if (typeof p.chart === 'function') {
                if (p.chart === dashboards) {
                    document.getElementById('container').style.display = 'none';
                    // eslint-disable-next-line max-len
                    document.getElementById('grid-container').style.display = 'none';
                    // eslint-disable-next-line max-len
                    document.getElementById('dash-container').style.display = 'block';
                } else if (p.chart === grid) {
                    document.getElementById('container').style.display = 'none';
                    // eslint-disable-next-line max-len
                    document.getElementById('dash-container').style.display = 'none';
                    // eslint-disable-next-line max-len
                    document.getElementById('grid-container').style.display = 'block';
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
                document.getElementById('container').style.display = 'block';
                currentChart = Highcharts.chart('container', p.chart);
            }
        }

        // if the carousel is paused, update the chart description
        // and make the product title visible to screen readers
        if (isPaused) {
            getChartDescription(i);
        }

        // fade back in
        chartWrapper.classList.remove('fade-out');

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
    dashboards();
    gridControls = grid();

    // create the first chart
    document.querySelector('.demo-title-inner').style.opacity = 1;
    document.getElementById('title-0').setAttribute('aria-hidden', 'false');
    updateChart(0);

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
