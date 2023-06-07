Math.easeOutQuint = function (pos) {
    return (Math.pow((pos - 1), 5) + 1);
};

Highcharts.theme = {
    colors: ['#8087E8', '#A3EDBA', '#F19E53', '#6699A1',
        '#E1D369', '#87B4E7', '#DA6D85', '#BBBAC5'],
    chart: {
        style: {
            fontFamily: 'IBM Plex Sans, sans-serif'
        }
    },
    title: {
        style: {
            fontSize: '22px',
            fontWeight: '500',
            color: '#2F2B38'
        }
    },
    subtitle: {
        style: {
            fontSize: '16px',
            fontWeight: '400',
            color: '#2F2B38'
        }
    },
    tooltip: {
        borderWidth: 0,
        backgroundColor: '#46465C',
        style: {
            color: '#f0f0f0'
        },
        shadow: true
    },
    legend: {
        backgroundColor: '#f0f0f0',
        borderColor: '#BBBAC5',
        borderWidth: 1,
        borderRadius: 2,
        itemStyle: {
            fontWeight: '400',
            fontSize: '12px',
            color: '#2F2B38'
        },
        itemHoverStyle: {
            fontWeight: '700',
            color: '#46465C'
        }
    },
    plotOptions: {
        series: {
            borderWidth: 1,
            borderColor: '#BBBAC5',
            dataLabels: {
                color: '#46465C',
                style: {
                    fontSize: '13px'
                }
            },
            marker: {
                lineColor: '#46465C'
            }
        }
    }
};

Highcharts.setOptions(Highcharts.theme);


const data = [3.5, 3, 3.2, 3.1, 3.6, 3.9, 3.4, 3.4, 2.9, 3.1, 3.7, 3.4, 3, 3, 4,
    4.4, 3.9, 3.5, 3.8, 3.8, 3.4, 3.7, 3.6, 3.3, 3.4, 3, 3.4, 3.5, 3.4, 3.2,
    3.1, 3.4, 4.1, 4.2, 3.1, 3.2, 3.5, 3.6, 3, 3.4, 3.5, 2.3, 3.2, 3.5, 3.8, 3,
    3.8, 3.2, 3.7, 3.3, 3.2, 3.2, 3.1, 2.3, 2.8, 2.8, 3.3, 2.4, 2.9, 2.7, 2, 3,
    2.2, 2.9, 2.9, 3.1, 3, 2.7, 2.2, 2.5, 3.2, 2.8, 2.5, 2.8, 2.9, 3, 2.8, 3,
    2.9, 2.6, 2.4, 2.4, 2.7, 2.7, 3, 3.4, 3.1, 2.3, 3, 2.5, 2.6, 3, 2.6, 2.3,
    2.7, 3, 2.9, 2.9, 2.5, 2.8, 3.3, 2.7, 3, 2.9, 3, 3, 2.5, 2.9, 2.5, 3.6,
    3.2, 2.7, 3, 2.5, 2.8, 3.2, 3, 3.8, 2.6, 2.2, 3.2, 2.8, 2.8, 2.7, 3.3, 3.2,
    2.8, 3, 2.8, 3, 2.8, 3.8, 2.8, 2.8, 2.6, 3, 3.4, 3.1, 3, 3.1, 3.1, 3.1, 2.7,
    3.2, 3.3, 3, 2.5, 3, 3.4, 3];

const randomIntFromInterval = function (min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const big = window.matchMedia('(min-width: 500px)').matches;


const leftSide = {
    type: 'arearange',
    enableMouseTracking: false,
    visible: true,
    animation: false,
    color: 'lightcoral',
    zIndex: 2,
    yAxis: 1,
    xAxis: 1,
    fillOpacity: 1,
    data: [{
        x: 0,
        low: 0,
        high: 24
    },
    {
        x: 20,
        low: 0,
        high: 24
    }]
};

const rightSide = {
    type: 'arearange',
    enableMouseTracking: false,
    visible: true,
    animation: false,
    color: 'lightcoral',
    fillOpacity: 1,
    yAxis: 2,
    xAxis: 2,
    zIndex: 1,
    data: [
        {
            // x: 0,
            // low: 2,
            // high: 23
            x: 0,
            low: 0,
            high: 24
        },
        {
            x: 10,
            low: 0,
            high: 24
        }]
};

const xAxis1 =  {
    min: 0,
    max: 20,
    visible: false
};

const xAxis2 =  {
    min: 0,
    max: 160,
    visible: false,
    reversed: true
};

const yAxis1 = {
    min: 0,
    max: 20,
    visible: false
};

const yAxis2 =  {
    min: 0,
    max: 20,
    visible: false
};

const flip = function (chart, boxNum, pos, delay) {
    setTimeout(function () {
        chart.xAxis[1].setExtremes(0, 13);
        chart.xAxis[2].setExtremes(0, 40);
        chart.series[0].update({
            data: [{
                x: 0,
                low: 2,
                high: 23
            },
            {
                x: 10,
                low: 0,
                high: 24
            }]
        });
        if (boxNum !== -1) {
            const id = 'box' + boxNum;
            document.getElementById(id).style.opacity = 0;
        }
    }, 0 + delay);

    setTimeout(function () {
        chart.xAxis[1].setExtremes(0, 300);
        chart.xAxis[2].setExtremes(0, 20);

        chart.series[1].update({
            data: [{
                x: 0,
                low: 0,
                high: 24
            },
            {
                x: 20,
                low: 0,
                high: 24
            }]
        });
        if (boxNum !== -1) {
            const id = 'box' + boxNum;
            document.getElementById(id).style.opacity = 0;
            document.querySelector('.box-' + pos).classList.add('turn');
        }

    }, 500 + delay);

    setTimeout(function () {
        chart.series[0].hide();
        const lastSeries = chart.series.length - 1;
        const count = 1;
        for (let ii = lastSeries; ii > count; --ii) {
            chart.series[ii].show();
        }
    }, 1000 + delay);


};

let wordChart;

const words = function () {
    const text = 'Twas, Twas, Twas, Twas the night, night, night, night, night, before, before, before, before, Christmas, Christmas, Christmas, Christmas, Christmas, Christmas, not a creature was stirring, when all through the house not a creature was stirring, not even a mouse.',
        lines = text.split(/[,\. ]+/gu),
        data = lines.reduce((arr, word) => {
            let obj = Highcharts.find(arr, obj => obj.name === word);
            if (obj) {
                obj.weight += 1;
            } else {
                obj = {
                    name: word,
                    weight: 1
                };
                arr.push(obj);
            }
            return arr;
        }, []);

    wordChart = Highcharts.chart('word-chart', {
        chart: {
            margin: 0,
            style: {
                fontFamily: 'IBM Plex Sans'
            },
            backgroundColor: 'transparent',
            events: {
                load: function () {
                    const chart = this;

                    chart.series[1].update({
                        color: '#C9C8D1'
                    });
                }
            }
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        colors: ['#E04B44', '#51BFA7', '#6699A1', '#00786F', '#E04B44', '#A3EDBA'],
        accessibility: {
            screenReaderSection: {
                beforeChartFormat: '<h5>{chartTitle}</h5>' +
                    '<div>{chartSubtitle}</div>' +
                    '<div>{chartLongdesc}</div>' +
                    '<div>{viewTableButton}</div>'
            }
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
            }
        },
        xAxis: [
            // 0
            {
                min: 0,
                max: 20,
                visible: false
            },
            // 1
            xAxis1,
            // 2
            xAxis2
        ],
        yAxis: [
            // 0
            {
                min: 0,
                max: 20,
                visible: false
            },
            // 1
            yAxis1,
            // 2
            yAxis2
        ],
        series: [
            // 0 - left side
            leftSide,
            // 1 -- right side
            rightSide,
            {
                type: 'wordcloud',
                visible: false,
                data,
                name: 'Some words from a poem',
                zIndex: 10
            }],
        title: {
            text: ''
        }
    });
};

let bellChart;
const bell = function () {
    bellChart = Highcharts.chart('bell-chart', {
        chart: {
            margin: 0,
            spacing: 0,
            backgroundColor: 'transparent',
            animation: {
                enabled: true,
                duration: 2000,
                easing: 'easeOutQuint'
            },
            events: {
                load: function () {

                    const chart = this;

                    chart.series[1].update({
                        color: '#8BD6F3'
                    });

                    const bell = document.querySelector('#bell-chart  .highcharts-bellcurve-series');
                    const hammer = document.querySelector('#bell-chart .highcharts-series-4');
                    const bellLine = document.querySelector('#bell-chart .highcharts-series-5');
                    const bow = document.querySelector('#bell-chart .highcharts-series-6.highcharts-markers');

                    let transY = '-40px';
                    if (!big) {
                        transY = '-30px';
                    }

                    bell.style.transformOrigin = 'center';
                    bellLine.style.transformOrigin = 'center';

                    bell.style.transform = 'rotate(10deg) translateY(' + transY + ')';
                    bellLine.style.transform = 'rotate(10deg) translateY(0px)';
                    bow.style.transform = 'rotate(10deg) translate(10px, -10px)';
                    hammer.style.transform = 'translate(9px, -3px)';

                    let count = 0;
                    setInterval(function () {
                        bell.style.transition = 'all 1s';
                        bellLine.style.transition = 'all 1s';
                        bow.style.transition = 'all 1s';
                        hammer.style.transition = 'all 1s';

                        if (count % 2 === 0) {
                            bell.style.transform = 'rotate(-10deg) translateY(' + transY + ')';
                            bow.style.transform = 'rotate(-10deg) translate(-20px, 20px)';
                            bellLine.style.transform = 'rotate(-10deg) translateY(0px)';
                            hammer.style.transform = 'translate(-10px, -7px)';
                        } else {
                            bell.style.transform = 'rotate(10deg) translateY(' + transY + ')';
                            bellLine.style.transform = 'rotate(10deg) translateY(0px)';
                            bow.style.transform = 'rotate(10deg) translate(10px, -10px)';
                            hammer.style.transform = 'translate(9px, -3px)';

                        }
                        count = count + 1;

                    }, 1000);

                }
            }
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
        plotOptions: {
            arearange: {
                marker: {
                    enabled: false
                }
            }
        },
        xAxis: [
            // 0
            {
                title: {
                    text: 'Data'
                },
                alignTicks: false,
                visible: false
            },
            // 1
            {
                min: 0,
                max: 20,
                visible: false
            },
            // 2
            {
                min: 0,
                max: 20,
                visible: false,
                reversed: true
            },
            // 3
            {
                title: {
                    text: 'Bell curve'
                },
                alignTicks: false,
                opposite: true,
                visible: false,
                min: 1,
                max: 5
            },
            // 4
            {
                min: 0,
                max: 20
            },
            // 5
            {
                min: 0,
                max: 140,
                reversed: true
            }],
        yAxis: [
            // 0
            {
                title: { text: 'Data' },
                visible: true,
                tickInterval: 1,
                tickAmount: 7,
                offset: -30,
                gridLineColor: '#fff'
            },
            // 1
            {
                min: 0,
                max: 20,
                visible: false
            },
            // 2
            {
                min: 0,
                max: 20,
                visible: false
            },
            // 3
            {
                title: { text: 'Bell curve' },
                opposite: true,
                min: 0.1,
                visible: true,
                gridLineColor: '#fff'
            },
            // 4
            {
                min: 0,
                max: 20
            },
            // 5
            {
                min: 0,
                max: 20
            }],

        series: [
            // 0 - left side
            leftSide,
            // 1 -- right side
            rightSide,
            // 2 bell curve
            {
                name: 'Bell curve',
                visible: false,
                animation: false,
                type: 'bellcurve',
                xAxis: 3,
                yAxis: 3,
                baseSeries: 3,
                color: {
                    linearGradient: { x1: 0, x2: 1, y1: 0, y2: 0 },
                    stops: [
                        [0, '#FEDDB3'], // start
                        [0.5, '#FCAB42'], // middle
                        [1, '#FEDDB3'] // end
                    ]
                },
                fillOpacity: 1,
                lineWidth: 0,
                lineColor: '#BD8032',
                zIndex: 20,
                label: {
                    enabled: true
                }
            },
            // 3
            {
                name: 'Data',
                animation: false,
                visible: false,
                type: 'line',
                dashStyle: 'dash',
                color: '#FEDDB3',
                data: data,
                accessibility: {
                    exposeAsGroupOnly: true
                },
                zIndex: 21,
                marker: {
                    radius: 2
                }
            },
            // 4 -- ringer thing
            {
                type: 'pie',
                animation: false,
                enableMouseTracking: false,
                visible: false,
                borderWidth: 0,
                opacity: 1,
                zIndex: 18,
                data: [{
                    y: 100,
                    color: '#BD8032'
                }
                ],
                size: '5%',
                center: ['50%', '90%'],
                dataLabels: {
                    enabled: false
                }
            },
            // 5 --bell bottom
            {
                type: 'line',
                zIndex: 100,
                visible: false,
                enableMouseTracking: false,
                lineWidth: 2,
                xAxis: 4,
                yAxis: 4,
                color: '#BD8032',
                dragDrop: {
                    draggableX: true,
                    draggableY: true
                },
                marker: {
                    enabled: false
                },
                data: [{
                    x: 3.22,
                    y: 5.46
                },
                {
                    x: 17,
                    y: 5.46
                }]
            },
            // 6 scatter bow
            {
                type: 'scatter',
                visible: false,
                zIndex: 100,
                lineWidth: 2,
                lineColor: 'transparent',
                xAxis: 4,
                yAxis: 4,
                color: '#FF4540',
                marker: {
                    enabled: true,
                    symbol: 'triangle',
                    radius: 10
                },
                data: [{
                    x: 9.5,
                    y: 19.2
                },
                {
                    x: 10.5,
                    y: 18,
                    marker: {
                        enabled: true,
                        symbol: 'circle',
                        radius: 8
                    }
                },
                {
                    x: 11.5,
                    y: 19.2
                }]
            }]
    });
};


const tree = function () {
    Highcharts.chart('tree-chart', {

        chart: {
            type: 'columnrange',
            margin: 0,
            backgroundColor: 'transparent',
            inverted: true,
            events: {
                load: function () {
                    const chart = this;

                    let count = 0;
                    const treeData =  [
                        [10, 10],
                        [9, 14],
                        [6, 17],
                        [3, 20],
                        [0, 23],
                        [-3, 26],
                        [-7, 29],
                        [-10, 32],
                        [7, 17],
                        [7, 17],
                        [7, 17],
                        [10, 10],
                        [0, 0]
                    ];

                    const topTree = document.querySelector('#tree-chart .highcharts-series-2');

                    chart.series[0].update({
                        color: '#E05283'
                    });

                    topTree.style.opacity = 1;

                    setInterval(function () {
                        topTree.style.transition = 'all 500ms';
                        if (count % 2 === 0) {
                            chart.series[3].data.forEach(function (point) {
                                point.update({
                                    low: treeData[point.index][0],
                                    high: treeData[point.index][1]
                                }, false);
                            });
                            chart.redraw();
                            topTree.style.opacity = 0;
                        } else {
                            chart.series[3].data.forEach(function (point) {
                                point.update({
                                    low: -30,
                                    high: 60
                                }, false);
                            });
                            chart.redraw();
                            topTree.style.opacity = 1;
                        }
                        count = count + 1;
                    }, 2000);

                }
            }
        },
        credits: {
            enabled: false
        },
        colors: ['#00786f'],
        title: {
            text: ''
        },
        xAxis: [
            // 0
            {
                visible: true,
                min: 0,
                labels: {
                    style: {
                        color: '#fff'
                    }
                }
            },
            // 1
            xAxis1,
            // 2
            xAxis2
        ],
        yAxis: [
            // 0
            {
                visible: true,
                min: -20,
                max: 40,
                offset: -30,
                gridLineColor: '#fff',
                gridLineWidth: 0,
                tickAmount: 10,
                gridZIndex: 100,
                labels: {
                    style: {
                        color: '#fff'
                    }
                }
            },
            // 1
            yAxis1,
            // 2
            yAxis2
        ],

        tooltip: {
            valueSuffix: '°C'
        },

        plotOptions: {
            series: {
                enableMouseTracking: true,
                name: 'tree'
            },
            columnrange: {
                animation: false,
                name: 'tree',
                dataLabels: {
                    enabled: false,
                    format: '{y}°C'
                },
                borderWidth: 0,
                groupPadding: -0.5
            }
        },

        legend: {
            enabled: false
        },

        series: [
            // 0 - left side
            leftSide,
            // 1 -- right side
            rightSide,
            // 2 tree
            {
                color: '#A3ECBA',
                zIndex: 12,
                data: [
                    [0, 0],
                    [9, 14],
                    [6, 17],
                    [3, 20],
                    [0, 23],
                    [-3, 26],
                    [-7, 29],
                    [-10, 32],
                    [7, 17],
                    [7, 17],
                    [7, 17],
                    [0, 0]
                ]
            },
            // /3
            {
                zIndex: 11,
                keys: ['x', 'low', 'high', 'color'],
                data: [
                    [-1, -30, 60, '#00786f'],
                    [0, -30, 60, '#00786f'],
                    [1, -30.1, 60, '#00786f'],
                    [2, -30.2, 60, '#00786f'],
                    [3, -30.3, 60, '#00786f'],
                    [4, -30.4, 60, '#00786f'],
                    [5, -30.5, 60, '#00786f'],
                    [6, -30.6, 60, '#00786f'],
                    [7, -30.7, 60, '#00786f'],
                    [8, -30.1, 60, '#00786f'],
                    [9, -30.1, 60, '#00786f'],
                    [10, -30.1, 60, '#00786f'],
                    [11, -30.1, 60, '#00786f']
                ]
            }]

    });
};


// /Snow Globe
let snowglobeChart;

const snowglobe = function () {
    snowglobeChart = Highcharts.chart('snowglobe-chart', {
        chart: {
            margin: 0,
            spacing: 0,
            backgroundColor: 'transparent',
            events: {
                load: function () {
                    const chart = this;
                    chart.series[1].update({
                        color: '#FF4540'
                    });
                }
            }
        },
        title: {
            text: ''
        },
        tooltip: {
            useHTML: true,
            pointFormat: '<b>{point.name}:</b> {point.y}m CO<sub>2</sub>'
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        xAxis: [
            // 0
            {
                min: 0,
                max: 20,
                visible: false
            },
            // 1
            xAxis1,
            // 2
            xAxis2
        ],
        yAxis: [
            // 0
            {
                min: 0,
                max: 20,
                visible: false
            },
            // 1
            yAxis1,
            // 2
            yAxis2
        ],
        plotOptions: {
            series: {
                states: {
                    hover: {
                        enabled: false,
                        halo: {
                            opacity: 1
                        }
                    },
                    inactive: {
                        enabled: false
                    }
                }
            },
            arearange: {
                marker: {
                    enabled: false
                }
            },
            packedbubble: {
                marker: {
                    fillColor: {
                        radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
                        stops: [
                            [0, 'rgba(255,255,255,1)'],
                            [1, 'rgba(255,255,255,0.8)']
                        ]
                    },
                    lineWidth: 0
                },
                draggable: true,
                minSize: '10%',
                maxSize: '100%',
                opacity: 1,
                layoutAlgorithm: {
                    initialPositionRadius: 200,
                    bubblePadding: 5,
                    initialPositions: function () {
                        const chart = this.series[0].chart,
                            width = chart.plotWidth;
                        this.nodes.forEach(function (node) {
                            // If initial positions were set previously, use that
                            // positions. Otherwise use random position:
                            node.plotX = node.plotX === undefined ?
                                Math.random() * width : node.plotX;
                            node.plotY = 500;
                        });
                    },
                    gravitationalConstant: 0.01,
                    splitSeries: true,
                    parentNodeLimit: true,
                    parentNodeOptions: {
                        marker: {
                            fillColor: '#d9dbfb',
                            fillOpacity: 1,
                            lineWidth: 0,
                            radius: 200
                        },
                        initialPositions: function () {
                            const chart = this.series[0].chart,
                                width = chart.plotWidth,
                                height = chart.plotHeight;

                            this.nodes.forEach(function (node) {
                                // If initial positions were set previously, use that
                                // positions. Otherwise use random position:
                                node.plotX = node.plotX === undefined ?
                                    Math.random() * width : node.plotX;
                                node.plotY = 500;
                                node.plotX = width / 2;
                                node.plotY = height / 2;
                            });
                        },
                        gravitationalConstant: 0.01
                    }
                },
                dataLabels: {
                    enabled: false,
                    format: '{point.name}',
                    filter: {
                        property: 'y',
                        operator: '>',
                        value: 250
                    },
                    style: {
                        color: 'black',
                        textOutline: 'none',
                        fontWeight: 'normal'
                    }
                }
            }
        },
        series: [
            // 0 - left side
            leftSide,
            // 1 -- right side
            rightSide,
            // 2 -- snowglobe (pie)
            {
                type: 'pie',
                name: 'snowglobe',
                borderWidth: 0,
                dataLabels: {
                    enabled: false
                },
                animation: false,
                data: [{
                    y: 100,
                    color: '#8bd4f4'
                }],
                size: '80%',
                zIndex: 8,
                visible: false
            },
            // 3 -- packed bubble
            {
                type: 'packedbubble',
                name: 'bubbles',
                color: '#220000',
                data: [{
                    name: 'Germany',
                    value: 767.1
                }, {
                    name: 'Croatia',
                    value: 20.7
                },
                {
                    name: 'Belgium',
                    value: 97.2
                },
                {
                    name: 'Czech Republic',
                    value: 111.7
                },
                {
                    name: 'Netherlands',
                    value: 158.1
                },
                {
                    name: 'Spain',
                    value: 241.6
                },
                {
                    name: 'Ukraine',
                    value: 249.1
                },
                {
                    name: 'Poland',
                    value: 298.1
                },
                {
                    name: 'France',
                    value: 323.7
                },
                {
                    name: 'Romania',
                    value: 78.3
                },
                {
                    name: 'United Kingdom',
                    value: 415.4
                }, {
                    name: 'Turkey',
                    value: 353.2
                }, {
                    name: 'Italy',
                    value: 337.6
                },
                {
                    name: 'Greece',
                    value: 71.1
                },
                {
                    name: 'Austria',
                    value: 69.8
                },
                {
                    name: 'Belarus',
                    value: 67.7
                },
                {
                    name: 'Serbia',
                    value: 59.3
                },
                {
                    name: 'Finland',
                    value: 54.8
                },
                {
                    name: 'Bulgaria',
                    value: 51.2
                },
                {
                    name: 'Portugal',
                    value: 48.3
                },
                {
                    name: 'Norway',
                    value: 44.4
                },
                {
                    name: 'Sweden',
                    value: 44.3
                },
                {
                    name: 'Hungary',
                    value: 43.7
                },
                {
                    name: 'Switzerland',
                    value: 40.2
                },
                {
                    name: 'Denmark',
                    value: 40
                },
                {
                    name: 'Slovakia',
                    value: 34.7
                },
                {
                    name: 'Ireland',
                    value: 34.6
                },
                {
                    name: 'Croatia',
                    value: 20.7
                },
                {
                    name: 'Estonia',
                    value: 19.4
                },
                {
                    name: 'Slovenia',
                    value: 16.7
                },
                {
                    name: 'Lithuania',
                    value: 12.3
                },
                {
                    name: 'Luxembourg',
                    value: 10.4
                },
                {
                    name: 'Macedonia',
                    value: 9.5
                },
                {
                    name: 'Moldova',
                    value: 7.8
                },
                {
                    name: 'Latvia',
                    value: 7.5
                },
                {
                    name: 'Cyprus',
                    value: 7.2
                }],
                zIndex: 20,
                visible: false
            },
            // 4 - house
            {
                type: 'area',
                name: 'little red house inside a snowglobe',
                color: '#ff4540',
                fillOpacity: 1,
                marker: {
                    enabled: false
                },
                data: [
                    {
                        x: 7,
                        y: 6
                    },
                    {
                        x: 10,
                        y: 8
                    },
                    {
                        x: 13,
                        y: 6
                    },
                    {
                        x: 15,
                        y: 6
                    }


                ],
                zIndex: 10,
                visible: false
            },
            // 5 house
            {
                type: 'arearange',
                name: 'little red house inside a snowglobe',
                color: '#fff',
                fillOpacity: 1,
                marker: {
                    enabled: false
                },
                data: [
                    {
                        x: 10,
                        low: 8,
                        high: 8
                    },
                    {
                        x: 12.5,
                        low: 6,
                        high: 8
                    },
                    {
                        x: 15,
                        low: 6,
                        high: 6
                    }
                ],
                zIndex: 10,
                visible: false
            },
            // 6 window
            {
                type: 'scatter',
                name: 'little red house inside a snowglobe',
                color: '#fff',
                visible: false,
                fillOpacity: 1,
                data: [
                    {
                        x: 9,
                        y: 5,
                        marker: {
                            symbol: 'square',
                            radius: 4
                        }
                    },
                    {
                        x: 9.1,
                        y: 4,
                        marker: {
                            symbol: 'square',
                            radius: 4
                        }
                    },
                    {
                        x: 10,
                        y: 5,
                        marker: {
                            symbol: 'square',
                            radius: 4
                        }
                    },
                    {
                        x: 10.1,
                        y: 4,
                        marker: {
                            symbol: 'square',
                            radius: 4
                        }
                    }
                ],
                zIndex: 11
            }
        ]
    });
};

// Candy Cane
let candycaneChart;
const candycane = function () {
    candycaneChart = Highcharts.chart('cane-chart', {

        chart: {
            margin: 0,
            backgroundColor: 'transparent',
            events: {
                load: function () {
                    const chart = this;
                    chart.series[1].update({
                        color: '#8085ef'
                    });

                    if (!big) {
                        chart.series[2].points[1].update({
                            low: 0,
                            high: 18,
                            color: '#fff'
                        });
                        chart.series[3].points[1].update({
                            low: 0,
                            high: 18,
                            color: 'url(#redstripe)'
                        });
                    }

                }
            }
        },
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        xAxis: [{
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            visible: false,
            gridLineColor: '#fff',
            labels: {
                style: {
                    color: '#fff'
                }
            }
        },
        // 1
        xAxis1,
        // 2
        xAxis2
        ],
        yAxis: [{
            visible: true,
            title: {
                text: ''
            },
            zIndex: 5,
            offset: -30,
            tickInterval: 1,
            gridLineColor: '#fff',
            labels: {
                style: {
                    color: '#fff'
                }
            }
        },
        // 1
        yAxis1,
        // 2
        yAxis2
        ],

        tooltip: {
            valueSuffix: '°C'
        },

        plotOptions: {
            series: {
                animation: false,
                marker: {
                    enabled: false
                }
            },
            columnrange: {
                dataLabels: {
                    enabled: false,
                    format: '{y}°C'
                },
                grouping: false,
                borderWidth: 0
            }
        },

        legend: {
            enabled: false
        },

        series: [
            // 0 - left side
            leftSide,
            // 1 -- right side
            rightSide,
            // 2 - bottom of cane
            {
                type: 'columnrange',
                name: 'candycane',
                visible: false,
                animation: false,
                groupPadding: 0,
                pointPadding: 0,
                zIndex: 6,
                data: [
                    {
                        low: 0,
                        high: 0,
                        color: 'transparent'
                    },
                    {
                        low: 0,
                        high: 25,
                        color: '#fff'
                    },
                    {
                        high: 30,
                        low: 25,
                        color: 'transparent'
                    },
                    {
                        low: 24,
                        high: 25,
                        color: 'transparent'
                    },
                    {
                        low: 24,
                        high: 25,
                        color: 'transparent'
                    }
                ]
            },
            // 3 - bottom of cane
            {
                type: 'columnrange',
                name: 'candycane',
                visible: false,
                animation: false,
                zIndex: 7,
                groupPadding: 0,
                pointPadding: 0,
                data: [
                    {
                        low: 0,
                        high: 0,
                        color: 'transparent'
                    },
                    {
                        low: 0,
                        high: 25,
                        color: 'url(#redstripe)'
                    },
                    {
                        low: 25,
                        high: 30,
                        color: 'transparent'
                    },
                    {
                        low: 24,
                        high: 25,
                        color: 'transparent'
                    },
                    {
                        low: 24,
                        high: 25,
                        color: 'transparent'
                    }
                ]
            },
            // 4 - back of the top of the cane
            {
                type: 'pie',
                name: 'candycane',
                data: [{
                    y: 100,
                    color: '#fff'
                }],
                visible: false,
                dataLabels: {
                    enabled: false
                },
                zIndex: 2,
                startAngle: -90,
                endAngle: 90,
                borderWidth: 0,
                size: '80%',
                center: ['59.3%', '48%']

            },
            // 5 top of cane
            {
                type: 'pie',
                name: 'candycane',
                zIndex: 3,
                visible: false,
                dataLabels: {
                    enabled: false
                },
                data: [{
                    y: 100,
                    color: 'url(#redstripe)'
                }],
                startAngle: -90,
                endAngle: 90,
                borderWidth: 0,
                size: '80%',
                center: ['59.3%', '48%']

            },
            // 6 - cane cover
            {
                type: 'pie',
                zIndex: 4,
                startAngle: -90,
                endAngle: 90,
                enableMouseTracking: false,
                dataLabels: {
                    enabled: false
                },
                visible: false,
                data: [{
                    y: 100,
                    color: '#8085ef'
                }],
                borderWidth: 0,
                size: '33%',
                center: ['60%', '52%']

            }]

    });
};

let presentsChart;
const presents = function () {
    presentsChart = Highcharts.chart('presents-chart', {
        chart: {
            margin: 0,
            backgroundColor: 'transparent',
            events: {
                load: function () {
                    const chart = this;
                    chart.series[1].update({
                        color: '#d9dbfb'
                    });
                }
            }
        },
        colors: ['#00786F', '#00786F', '#00786F', 'url(#bluestripe)', 'url(#bluestripe)', 'url(#bluestripe)', 'url(#stars)', 'url(#stars)', 'url(#stars)', 'url(#redstripe2)'],
        title: {
            text: '',
            y: 30
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        xAxis: [
            // 0
            {
                min: -2,
                max: 18,
                visible: true,
                tickInterval: 1
            },
            // 1
            xAxis1,
            // 2
            xAxis2
        ],
        yAxis: [
            // 0
            {
                min: 0,
                max: 20,
                visible: false,
                tickInterval: 1,
                labels: {
                    style: {
                        color: '#000'
                    }
                }
            },
            // 1
            yAxis1,
            // 2
            yAxis2
        ],
        plotOptions: {
            series: {
                animation: false
            },
            arearange: {
                name: 'Presents!',
                borderWidth: 0,
                marker: {
                    enabled: false
                },
                zIndex: 20
            },
            scatter: {
                zIndex: 22,
                name: 'bow'
            }
        },
        tooltip: {
            enabled: true
        },
        series: [
            // 0 - left side
            leftSide,
            // 1 -- right side
            rightSide,
            // 2
            {
                type: 'arearange',
                className: 'present',
                data: [
                    {
                        x: 0,
                        low: 15,
                        high: 20
                    },
                    {
                        x: 2,
                        low: 15,
                        high: 20
                    },
                    {
                        x: 4,
                        low: 15,
                        high: 20
                    }
                ],
                visible: false
            },
            // 3
            {
                type: 'arearange',
                data: [
                    {
                        x: 6,
                        low: 15,
                        high: 20
                    },
                    {
                        x: 8,
                        low: 15,
                        high: 20
                    },
                    {
                        x: 10,
                        low: 15,
                        high: 20
                    }
                ],
                visible: false
            },
            // 4
            {
                type: 'arearange',
                data: [
                    // third
                    {
                        x: 12,
                        low: 15,
                        high: 20
                    },
                    {
                        x: 14,
                        low: 15,
                        high: 20
                    },
                    {
                        x: 16,
                        low: 15,
                        high: 20
                    }
                ],
                visible: false
            },
            // 5
            {
                type: 'arearange',
                data: [
                    {
                        x: 0,
                        low: 8,
                        high: 13
                    },
                    {
                        x: 2,
                        low: 8,
                        high: 13
                    },
                    {
                        x: 4,
                        low: 8,
                        high: 13
                    }
                ],
                visible: false
            },
            // 6
            {
                type: 'arearange',
                data: [
                    // ///second
                    {
                        x: 6,
                        low: 8,
                        high: 13
                    },
                    {
                        x: 8,
                        low: 8,
                        high: 13
                    },
                    {
                        x: 10,
                        low: 8,
                        high: 13
                    }
                ],
                visible: false
            },
            // 7
            {
                type: 'arearange',
                data: [
                    // //third
                    {
                        x: 12,
                        low: 8,
                        high: 13
                    },
                    {
                        x: 14,
                        low: 8,
                        high: 13
                    },
                    {
                        x: 16,
                        low: 8,
                        high: 13
                    }
                ],
                visible: false
            },
            // 8
            {
                type: 'arearange',
                data: [
                    {
                        x: 0,
                        low: 1,
                        high: 6
                    },
                    {
                        x: 2,
                        low: 1,
                        high: 6
                    },
                    {
                        x: 4,
                        low: 1,
                        high: 6
                    }
                ],
                visible: false
            },
            // 9
            {
                type: 'arearange',
                data: [
                    // /second
                    {
                        x: 6,
                        low: 1,
                        high: 6
                    },
                    {
                        x: 8,
                        low: 1,
                        high: 6
                    },
                    {
                        x: 10,
                        low: 1,
                        high: 6
                    }
                ],
                visible: false
            },
            // 10
            {
                type: 'arearange',
                data: [
                    // //third
                    {
                        x: 12,
                        low: 1,
                        high: 6
                    },
                    {
                        x: 14,
                        low: 1,
                        high: 6
                    },
                    {
                        x: 16,
                        low: 1,
                        high: 6
                    }
                ],
                visible: false
            },
            // 11
            {
                type: 'scatter',
                data: [
                    {
                        x: 1.75,
                        y: 20.5,
                        color: 'red',
                        marker: {
                            enabled: true,
                            symbol: 'triangle'
                        }
                    },
                    {
                        x: 2.25,
                        y: 20.5,
                        color: 'red',
                        marker: {
                            enabled: true,
                            symbol: 'triangle'
                        }
                    },
                    {
                        x: 7.75,
                        y: 20.5,
                        color: 'red',
                        marker: {
                            enabled: true,
                            symbol: 'triangle'
                        }
                    },
                    {
                        x: 8.25,
                        y: 20.5,
                        color: 'red',
                        marker: {
                            enabled: true,
                            symbol: 'triangle'
                        }
                    },
                    {
                        x: 13.75,
                        y: 20.5,
                        color: 'red',
                        marker: {
                            enabled: true,
                            symbol: 'triangle'
                        }
                    },
                    {
                        x: 14.25,
                        y: 20.5,
                        color: 'red',
                        marker: {
                            enabled: true,
                            symbol: 'triangle'
                        }
                    }
                ],
                visible: false
            },
            // 12
            {
                type: 'scatter',
                color: 'blue',
                data: [
                    {
                        x: 1.75,
                        y: 13.5,
                        marker: {
                            enabled: true,
                            symbol: 'triangle'
                        }
                    },
                    {
                        x: 2.25,
                        y: 13.5,
                        marker: {
                            enabled: true,
                            symbol: 'triangle'
                        }
                    },
                    {
                        x: 7.75,
                        y: 13.5,
                        marker: {
                            enabled: true,
                            symbol: 'triangle'
                        }
                    },
                    {
                        x: 8.25,
                        y: 13.5,
                        marker: {
                            enabled: true,
                            symbol: 'triangle'
                        }
                    },
                    {
                        x: 13.75,
                        y: 13.5,
                        marker: {
                            enabled: true,
                            symbol: 'triangle'
                        }
                    },
                    {
                        x: 14.25,
                        y: 13.5,
                        marker: {
                            enabled: true,
                            symbol: 'triangle'
                        }
                    }
                ],
                visible: false
            },
            // 13
            {
                type: 'scatter',
                color: '#8085EF',
                data: [
                    {
                        x: 1.75,
                        y: 6.5,
                        marker: {
                            enabled: true,
                            symbol: 'triangle'
                        }
                    },
                    {
                        x: 2.25,
                        y: 6.5,
                        marker: {
                            enabled: true,
                            symbol: 'triangle'
                        }
                    },
                    {
                        x: 7.75,
                        y: 6.5,
                        marker: {
                            enabled: true,
                            symbol: 'triangle'
                        }
                    },
                    {
                        x: 8.25,
                        y: 6.5,
                        marker: {
                            enabled: true,
                            symbol: 'triangle'
                        }
                    },
                    {
                        x: 13.75,
                        y: 6.5,
                        marker: {
                            enabled: true,
                            symbol: 'triangle'
                        }
                    },
                    {
                        x: 14.25,
                        y: 6.5,
                        marker: {
                            enabled: true,
                            symbol: 'triangle'
                        }
                    }
                ],
                visible: false
            }
        ]
    });
};

let wreathChart;
const wreath = function () {
    wreathChart = Highcharts.chart('donut', {
        chart: {
            margin: 0,
            backgroundColor: 'transparent',
            events: {
                load: function () {
                    const chart = this;
                    let count = 1;

                    chart.series[1].update({
                        color: '#a3edba'
                    });

                    if (!big) {
                        chart.series[5].points[1].update({
                            marker: {
                                radius: 5,
                                symbol: 'circle'
                            }
                        });
                    }

                    setInterval(function () {
                        if (count === 1) {
                            chart.series[3].hide();
                            chart.series[4].show();
                            count = 2;
                        } else {
                            chart.series[3].show();
                            chart.series[4].hide();
                            count = 1;
                        }
                    }, 400);
                }
            }
        },
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        xAxis: [{
            min: 0,
            max: 20
        },
        xAxis1,
        xAxis2
        ],
        yAxis: [{
            min: 0,
            max: 20
        },
        yAxis1,
        yAxis2],

        series: [
            // 0 left side
            leftSide,
            // 1 right side
            rightSide,
            // 2 - wreath
            {
                type: 'pie',
                name: 'wreath',
                animation: false,
                data: [{
                    y: 100,
                    color: '#8087e8'
                }
                ],
                dataLabels: {
                    enabled: false,
                    connectorColor: 'transparent'
                },
                innerSize: '40%',
                size: '80%',
                borderWidth: 0,
                zIndex: 10,
                visible: false

            },
            // 3 - item red
            {
                type: 'item',
                name: 'red lights',
                animation: false,
                visible: false,
                size: '80%',
                startAngle: 100,
                endAngle: 100,
                innerSize: '30%',
                borderWidth: 0,
                center: ['52%', '52%'],
                data: [{
                    y: 60,
                    color: '#e04b44'
                }],
                dataLabels: {
                    enabled: false,
                    connectorColor: 'transparent'
                },
                zIndex: 11

            },
            // 4 - item blue
            {
                type: 'item',
                name: 'blue lights',
                animation: false,
                visible: false,
                size: '80%',
                center: ['52%', '52%'],
                startAngle: 100,
                endAngle: 100,
                innerSize: '30%',
                borderWidth: 0,
                data: [{
                    y: 30,
                    color: 'blue'
                }],
                dataLabels: {
                    enabled: false,
                    connectorColor: 'transparent'
                },
                zIndex: 11

            },
            // 5 scatter bow
            {
                type: 'scatter',
                name: 'decorative bow',
                zIndex: 100,
                visible: false,
                lineWidth: 2,
                lineColor: 'transparent',
                color: '#FF4540',
                data: [{
                    x: 8,
                    y: 15
                },
                {
                    x: 10.5,
                    y: 17,
                    marker: {
                        enabled: true,
                        symbol: 'circle',
                        radius: 10
                    }
                },
                {
                    x: 13,
                    y: 15
                }]
            }
        ],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 179
                },
                chartOptions: {
                    plotOptions: {
                        item: {
                            marker: {
                                enabled: true,
                                radius: 3
                            }
                        },
                        scatter: {
                            marker: {
                                enabled: true,
                                symbol: 'triangle-down',
                                radius: 10
                            }
                        }
                    }
                }
            },
            {
                condition: {
                    minWidth: 180
                },
                chartOptions: {
                    plotOptions: {
                        item: {
                            marker: {
                                enabled: true,
                                radius: 5
                            }
                        },
                        scatter: {
                            marker: {
                                enabled: true,
                                symbol: 'triangle-down',
                                radius: 20
                            }
                        }
                    }
                }
            }]
        }

    });
};

const flake = function () {
    Highcharts.chart('flake-chart', {

        chart: {
            animation: {
                duration: 5000
            },
            margin: 10,
            backgroundColor: '#f0f0f0',
            spacing: 0,
            events: {
                load: function () {
                    const chart = this;
                    const seriesGroup = document.querySelector('#flake-chart .highcharts-series-group');
                    seriesGroup.style.transformOrigin = 'center';
                    seriesGroup.style.transform = 'translateY(-200px)';

                    const fall = function () {
                        setTimeout(function () {
                            seriesGroup.style.transition = 'all ease-out 3s';
                            seriesGroup.style.transform = 'translateY(0px) rotate(720deg)';
                        }, 200);

                        setTimeout(function () {
                            chart.update({
                                plotOptions: {
                                    line: {
                                        dataLabels: {
                                            enabled: true
                                        }
                                    }
                                }
                            });
                        }, 3500);

                        setTimeout(function () {
                            chart.update({
                                plotOptions: {
                                    line: {
                                        dataLabels: {
                                            enabled: false
                                        }
                                    }
                                }
                            });
                            seriesGroup.style.transform = 'translateY(300px) rotate(1180deg)';
                        }, 5000);

                        setTimeout(function () {
                            seriesGroup.style.transition = 'none';
                            seriesGroup.style.transform = 'translateY(-200px)';
                        }, 7000);
                    };

                    const fallAgain =  function () {
                        setInterval(function () {
                            fall();
                        }, 8000);
                    };

                    fall();
                    fallAgain();
                }
            }
        },
        title: {
            text: '',
            y: 30
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        tooltip: {
            enabled: true
        },
        plotOptions: {
            line: {
                color: '#8bd6f3',
                className: 'flake',
                animation: false,
                lineWidth: 10,
                linecap: 'square',
                marker: {
                    enabled: true,
                    fillColor: '#fff'
                },
                dataLabels: {
                    enabled: false,
                    useHTML: true,
                    formatter: function () {
                        const fontSize =  randomIntFromInterval(10, 20) + 'px';
                        const labelString = `
                            <p style='font-weight:300;color:#30426B;
                            font-size: ${fontSize}'>${this.point.y}
                            </p>
                        `;
                        return labelString;
                    },
                    style: {
                        color: '#fff',
                        textOutline: 'none',
                        fontSize: randomIntFromInterval(10, 30) + 'px'
                    }
                }
            },
            series: {
                name: 'Snow!',
                states: {
                    hover: {
                        enabled: false
                    },
                    inactive: {
                        enabled: false
                    }
                }
            }
        },
        xAxis: [
        // 0
            {
                min: -1,
                max: 20,
                visible: false
            },
            xAxis1,
            xAxis2,
            // 3
            {
                min: 0,
                max: 21,
                reversed: true,
                visible: false
            }],
        yAxis: [
        // 0
            {
                min: 0,
                max: 20,
                visible: true,
                gridLineColor: '#ccc',
                tickInterval: 2
            },
            yAxis1,
            yAxis2,
            // 3
            {
                min: 0,
                max: 20,
                reversed: true,
                visible: false
            }],
        series: [
            // 2
            {
                type: 'line',
                data: [{
                    x: -1,
                    y: 10
                },
                {
                    x: 20,
                    y: 10.22
                }]

            },
            // 3 vertical
            {
                type: 'line',
                xAxis: 3,
                zIndex: 20,
                data: [{
                    x: 5.8,
                    y: 0.77
                },
                {
                    x: 15.4,
                    y: 19.6
                }
                ]
            },
            // 4
            {
                type: 'line',
                zIndex: 2,
                data: [
                    {
                        x: 4.066,
                        y: 0
                    },
                    {
                        x: 14.73,
                        y: 20
                    }
                ]
            },
            // smaller sections
            // 5 -- left
            {
                type: 'line',
                visible: true,
                data: [
                    {
                        x: 0.76,
                        y: 14
                    },
                    {
                        x: 4.66,
                        y: 9.88
                    }
                ]
            },
            // 6
            {
                type: 'line',
                visible: true,
                data: [
                    {
                        x: 2.16,
                        y: 15.88
                    },
                    {
                        x: 7.34,
                        y: 14.32
                    },
                    {
                        x: 8.69,
                        y: 19.65
                    }
                ]
            },
            // 7
            {
                type: 'line',
                visible: true,
                data: [
                    {
                        x: 10.96,
                        y: 19.87
                    },
                    {
                        x: 11.73,
                        y: 14.63
                    },
                    {
                        x: 16.97,
                        y: 15.65
                    }
                ]
            },
            // 8
            {
                type: 'line',
                visible: true,
                data: [
                    {
                        x: 0.87,
                        y: 6.22
                    },
                    {
                        x: 4.66,
                        y: 9.88
                    },
                    {
                        x: 14.76,
                        y: 10.55
                    },
                    {
                        x: 18.07,
                        y: 14.1
                    }
                ]
            },
            // 9 - right
            {
                type: 'line',
                data: [
                    {
                        x: 0.87,
                        y: 6.22
                    },
                    {
                        x: 3.84,
                        y: 9.433
                    },
                    {
                        x: 14.68,
                        y: 10.55
                    },
                    {
                        x: 18.18,
                        y: 6.42
                    }
                ]
            },
            // 10
            {
                type: 'line',
                visible: true,
                data: [
                    {
                        x: 10,
                        y: 0.38
                    },
                    {
                        x: 11.63,
                        y: 5.76
                    },
                    {
                        x: 16.43,
                        y: 4.544
                    }
                ]
            },
            // 11
            {
                type: 'line',
                visible: true,
                data: [
                    {
                        x: 2,
                        y: 4.49
                    },
                    {
                        x: 6.7,
                        y: 5.53
                    },
                    {
                        x: 8.14,
                        y: 0.43
                    }
                ]
            }
        ]

    });
};

let ballChart;
const ball = function () {
    const data = [
        {
            name: 'United States of America',
            value: 1477
        },
        {
            name: 'Brazil',
            value: 490
        },
        {
            name: 'Mexico',
            value: 882
        },
        {
            name: 'Canada',
            value: 161
        },
        {
            name: 'Russia',
            value: 74
        },
        {
            name: 'Argentina',
            value: 416
        },
        {
            name: 'Bolivia',
            value: 789
        },
        {
            name: 'Colombia',
            value: 805
        },
        {
            name: 'Paraguay',
            value: 2011
        },
        {
            name: 'Indonesia',
            value: 372
        },
        {
            name: 'South Africa',
            value: 466
        },
        {
            name: 'Papua New Guinea',
            value: 1239
        },
        {
            name: 'Germany',
            value: 1546
        },
        {
            name: 'China',
            value: 54
        },
        {
            name: 'Chile',
            value: 647
        },
        {
            name: 'Australia',
            value: 62
        },
        {
            name: 'France',
            value: 844
        },
        {
            name: 'United Kingdom',
            value: 1901
        },
        {
            name: 'Venezuela',
            value: 503
        },
        {
            name: 'Ecuador',
            value: 1560
        },
        {
            name: 'India',
            value: 116
        },
        {
            name: 'Iran',
            value: 208
        },
        {
            name: 'Guatemala',
            value: 2716
        },
        {
            name: 'Philippines',
            value: 828
        },
        {
            name: 'Sweden',
            value: 563
        },
        {
            name: 'Saudi Arabia',
            value: 100
        },
        {
            name: 'Democratic Republic of the Congo',
            value: 87
        },
        {
            name: 'Kenya',
            value: 346
        },
        {
            name: 'Zimbabwe',
            value: 507
        },
        {
            name: 'Peru',
            value: 149
        },
        {
            name: 'Ukraine',
            value: 323
        },
        {
            name: 'Angola',
            value: 141
        },
        {
            name: 'Japan',
            value: 480
        },
        {
            name: 'United Republic of Tanzania',
            value: 187
        },
        {
            name: 'Costa Rica',
            value: 3153
        },
        {
            name: 'Algeria',
            value: 66
        },
        {
            name: 'Pakistan',
            value: 196
        },
        {
            name: 'Spain',
            value: 301
        },
        {
            name: 'Finland',
            value: 487
        },
        {
            name: 'Nicaragua',
            value: 1225
        },
        {
            name: 'Libya',
            value: 83
        },
        {
            name: 'Cuba',
            value: 1211
        },
        {
            name: 'Uruguay',
            value: 760
        },
        {
            name: 'Oman',
            value: 426
        },
        {
            name: 'Italy',
            value: 439
        },
        {
            name: 'Czech Republic',
            value: 1657
        },
        {
            name: 'Poland',
            value: 414
        },
        {
            name: 'New Zealand',
            value: 465
        },
        {
            name: 'Guyana',
            value: 594
        },
        {
            name: 'Panama',
            value: 1574
        },
        {
            name: 'Malaysia',
            value: 347
        },
        {
            name: 'Namibia',
            value: 136
        },
        {
            name: 'South Korea',
            value: 1145
        },
        {
            name: 'Honduras',
            value: 921
        },
        {
            name: 'Iraq',
            value: 233
        },
        {
            name: 'Thailand',
            value: 198
        },
        {
            name: 'Mozambique',
            value: 125
        },
        {
            name: 'Turkey',
            value: 127
        },
        {
            name: 'Iceland',
            value: 958
        },
        {
            name: 'Kazakhstan',
            value: 36
        },
        {
            name: 'Norway',
            value: 312
        },
        {
            name: 'Syria',
            value: 484
        },
        {
            name: 'Zambia',
            value: 118
        },
        {
            name: 'South Sudan',
            value: 132
        },
        {
            name: 'Egypt',
            value: 83
        },
        {
            name: 'Madagascar',
            value: 143
        },
        {
            name: 'North Korea',
            value: 681
        },
        {
            name: 'Denmark',
            value: 1885
        },
        {
            name: 'Greece',
            value: 589
        },
        {
            name: 'Botswana',
            value: 131
        },
        {
            name: 'Sudan',
            value: 43
        },
        {
            name: 'Croatia',
            value: 1233
        },
        {
            name: 'Bulgaria',
            value: 627
        },
        {
            name: 'El Salvador',
            value: 3282
        },
        {
            name: 'Belarus',
            value: 320
        },
        {
            name: 'Myanmar',
            value: 98
        },
        {
            name: 'Portugal',
            value: 700
        },
        {
            name: 'Switzerland',
            value: 1575
        },
        {
            name: 'The Bahamas',
            value: 6094
        },
        {
            name: 'Lithuania',
            value: 973
        },
        {
            name: 'Somalia',
            value: 97
        },
        {
            name: 'Chad',
            value: 47
        },
        {
            name: 'Ethiopia',
            value: 52
        },
        {
            name: 'Yemen',
            value: 108
        },
        {
            name: 'Morocco',
            value: 123
        },
        {
            name: 'Suriname',
            value: 353
        },
        {
            name: 'French Polynesia',
            value: 14110
        },
        {
            name: 'Nigeria',
            value: 59
        },
        {
            name: 'Uzbekistan',
            value: 125
        },
        {
            name: 'Afghanistan',
            value: 80
        },
        {
            name: 'Austria',
            value: 631
        },
        {
            name: 'Belize',
            value: 2061
        },
        {
            name: 'Israel',
            value: 2186
        },
        {
            name: 'Nepal',
            value: 328
        },
        {
            name: 'Uganda',
            value: 238
        },
        {
            name: 'Romania',
            value: 196
        },
        {
            name: 'Vietnam',
            value: 145
        },
        {
            name: 'Gabon',
            value: 171
        },
        {
            name: 'Mongolia',
            value: 28
        },
        {
            name: 'United Arab Emirates',
            value: 514
        },
        {
            name: 'Latvia',
            value: 675
        },
        {
            name: 'Belgium',
            value: 1354
        },
        {
            name: 'Hungary',
            value: 458
        },
        {
            name: 'Laos',
            value: 178
        },
        {
            name: 'Ireland',
            value: 581
        },
        {
            name: 'Central African Republic',
            value: 63
        },
        {
            name: 'Azerbaijan',
            value: 448
        },
        {
            name: 'Taiwan',
            value: 1147
        },
        {
            name: 'Dominican Republic',
            value: 745
        },
        {
            name: 'Solomon Islands',
            value: 1286
        },
        {
            name: 'Slovakia',
            value: 728
        },
        {
            name: 'Cameroon',
            value: 70
        },
        {
            name: 'Malawi',
            value: 340
        },
        {
            name: 'Vanuatu',
            value: 2543
        },
        {
            name: 'Mauritania',
            value: 29
        },
        {
            name: 'Niger',
            value: 24
        },
        {
            name: 'Liberia',
            value: 301
        },
        {
            name: 'Netherlands',
            value: 856
        },
        {
            name: 'Puerto Rico',
            value: 3237
        },
        {
            name: 'Tunisia',
            value: 187
        },
        {
            name: 'Fiji',
            value: 1532
        },
        {
            name: 'Jamaica',
            value: 2585
        },
        {
            name: 'Kyrgyzstan',
            value: 146
        },
        {
            name: 'Republic of the Congo',
            value: 79
        },
        {
            name: 'Ivory Coast',
            value: 85
        },
        {
            name: 'Republic of Serbia',
            value: 336
        },
        {
            name: 'Turkmenistan',
            value: 55
        },
        {
            name: 'Mali',
            value: 20
        },
        {
            name: 'New Caledonia',
            value: 1368
        },
        {
            name: 'Bosnia and Herzegovina',
            value: 469
        },
        {
            name: 'Lesotho',
            value: 791
        },
        {
            name: 'Tajikistan',
            value: 170
        },
        {
            name: 'Antarctica',
            value: 2
        },
        {
            name: 'Burkina Faso',
            value: 84
        },
        {
            name: 'Georgia',
            value: 316
        },
        {
            name: 'Senegal',
            value: 104
        },
        {
            name: 'Kiribati',
            value: 23428
        },
        {
            name: 'Sri Lanka',
            value: 294
        },
        {
            name: 'Bangladesh',
            value: 138
        },
        {
            name: 'Estonia',
            value: 425
        },
        {
            name: 'Jordan',
            value: 203
        },
        {
            name: 'Cambodia',
            value: 91
        },
        {
            name: 'Guinea',
            value: 65
        },
        {
            name: 'Slovenia',
            value: 794
        },
        {
            name: 'Northern Cyprus',
            value: 1623
        },
        {
            name: 'Greenland',
            value: 7
        },
        {
            name: 'Marshall Islands',
            value: 82873
        },
        {
            name: 'Swaziland',
            value: 814
        },
        {
            name: 'Haiti',
            value: 508
        },
        {
            name: 'Seychelles',
            value: 30769
        },
        {
            name: 'Djibouti',
            value: 561
        },
        {
            name: 'Eritrea',
            value: 129
        },
        {
            name: 'Armenia',
            value: 390
        },
        {
            name: 'Cook Islands',
            value: 46610
        },
        {
            name: 'Ghana',
            value: 44
        },
        {
            name: 'Macedonia',
            value: 393
        },
        {
            name: 'Cape Verde',
            value: 2232
        },
        {
            name: 'Maldives',
            value: 30201
        },
        {
            name: 'Singapore',
            value: 12690
        },
        {
            name: 'Guinea Bissau',
            value: 284
        },
        {
            name: 'Lebanon',
            value: 782
        },
        {
            name: 'Sierra Leone',
            value: 112
        },
        {
            name: 'Togo',
            value: 147
        },
        {
            name: 'Turks and Caicos Islands',
            value: 8439
        },
        {
            name: 'Burundi',
            value: 273
        },
        {
            name: 'Equatorial Guinea',
            value: 250
        },
        {
            name: 'Falkland Islands',
            value: 575
        },
        {
            name: 'Kuwait',
            value: 393
        },
        {
            name: 'Moldova',
            value: 213
        },
        {
            name: 'Rwanda',
            value: 284
        },
        {
            name: 'Benin',
            value: 54
        },
        {
            name: 'East Timor',
            value: 403
        },
        {
            name: 'Kosovo',
            value: 551
        },
        {
            name: 'Micronesia',
            value: 8547
        },
        {
            name: 'Qatar',
            value: 518
        },
        {
            name: 'Saint Vincent and the Grenadines',
            value: 15424
        },
        {
            name: 'Tonga',
            value: 8368
        },
        {
            name: 'Western Sahara',
            value: 23
        },
        {
            name: 'Guam',
            value: 9191
        },
        {
            name: 'Mauritius',
            value: 2463
        },
        {
            name: 'Montenegro',
            value: 372
        },
        {
            name: 'Northern Mariana Islands',
            value: 10776
        },
        {
            name: 'Albania',
            value: 146
        },
        {
            name: 'Bahrain',
            value: 5263
        },
        {
            name: 'British Virgin Islands',
            value: 26490
        },
        {
            name: 'Comoros',
            value: 1790
        },
        {
            name: 'French Southern and Antarctic Lands',
            value: 522
        },
        {
            name: 'Samoa',
            value: 1418
        },
        {
            name: 'Spratly Islands',
            value: 800000
        },
        {
            name: 'Svalbard',
            value: 64
        },
        {
            name: 'Trinidad and Tobago',
            value: 780
        },
        {
            name: 'American Samoa',
            value: 13393
        },
        {
            name: 'Antigua and Barbuda',
            value: 6778
        },
        {
            name: 'Cayman Islands',
            value: 11364
        },
        {
            name: 'Grenada',
            value: 8721
        },
        {
            name: 'Palau',
            value: 6536
        },
        {
            name: 'Palestinian Territories',
            value: 500
        },
        {
            name: 'Anguilla',
            value: 21978
        },
        {
            name: 'Bhutan',
            value: 52
        },
        {
            name: 'Dominica',
            value: 2663
        },
        {
            name: 'Guernsey',
            value: 25608
        },
        {
            name: 'Hong Kong',
            value: 1864
        },
        {
            name: 'Luxembourg',
            value: 773
        },
        {
            name: 'Saint Kitts and Nevis',
            value: 7663
        },
        {
            name: 'Saint Lucia',
            value: 3300
        },
        {
            name: 'Saint Pierre and Miquelon',
            value: 8264
        },
        {
            name: 'São Tomé and Príncipe',
            value: 2075
        },
        {
            name: 'Virgin Islands of the U.S.',
            value: 5780
        },
        {
            name: 'Wallis and Futuna',
            value: 14085
        },
        {
            name: 'Aruba',
            value: 5556
        },
        {
            name: 'Barbados',
            value: 2326
        },
        {
            name: 'Bermuda',
            value: 18657
        },
        {
            name: 'British Indian Ocean Territory',
            value: 16667
        },
        {
            name: 'Brunei',
            value: 190
        },
        {
            name: 'Faroe Islands',
            value: 718
        },
        {
            name: 'Gambia',
            value: 99
        },
        {
            name: 'Gibraltar',
            value: 153846
        },
        {
            name: 'Jan Mayen',
            value: 2653
        },
        {
            name: 'Jersey',
            value: 8621
        },
        {
            name: 'Macau',
            value: 35461
        },
        {
            name: 'Malta',
            value: 3165
        },
        {
            name: 'Isle of Man',
            value: 1748
        },
        {
            name: 'Montserrat',
            value: 9804
        },
        {
            name: 'Nauru',
            value: 47170
        },
        {
            name: 'Niue',
            value: 3846
        },
        {
            name: 'Paracel Islands',
            value: 129032
        },
        {
            name: 'Saint Barthelemy',
            value: 40000
        },
        {
            name: 'Saint Helena, Ascension and Tristan da Cunha',
            value: 2538
        },
        {
            name: 'Saint Martin',
            value: 18382
        },
        {
            name: 'Sint Maarten',
            value: 29412
        },
        {
            name: 'Tuvalu',
            value: 39063
        },
        {
            name: 'Wake Island',
            value: 153846
        }
    ];
    let chart;
    const getGraticule = () => {
        const data = [];

        // Meridians
        for (let x = -180; x <= 180; x += 15) {
            data.push({
                geometry: {
                    type: 'LineString',
                    coordinates: x % 90 === 0 ? [
                        [x, -90],
                        [x, 0],
                        [x, 90]
                    ] : [
                        [x, -80],
                        [x, 80]
                    ]
                },
                color: '#fff',
                lineWidth: 0
            });
        }

        // Latitudes
        for (let y = -90; y <= 90; y += 10) {
            const coordinates = [];
            for (let x = -180; x <= 180; x += 5) {
                coordinates.push([x, y]);
            }
            data.push({
                geometry: {
                    type: 'Polygon',
                    coordinates
                },
                lineWidth: y === 1 ? 0 : undefined
            });
        }

        return data;
    };

    const starData = [];
    const getStarData = function () {
        for (let ii = 0; ii <= 40; ++ii) {
            const newX = randomIntFromInterval(0, 10.5);
            const newY = randomIntFromInterval(5, 8);
            starData.push([newX, newY]);
        }

    };
    getStarData();

    Highcharts.getJSON(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts/samples/data/world-countries.topo.json',
        topology => {

            // Convert the topoJSON feature into geoJSON
            const geojson = window.topojson.feature(
                topology,
                // For this demo, get the first of the named objects
                topology.objects[Object.keys(topology.objects)[0]]
            );
            geojson.copyrightUrl = topology.copyrightUrl;
            geojson.copyrightShort = topology.copyrightShort;

            chart = Highcharts.mapChart('ball-chart', {
                chart: {
                    map: geojson,
                    animation: {
                        enabled: false
                    },
                    margin: 0,
                    backgroundColor: 'url(#bg-gradient)',
                    events: {
                        load: function () {
                            const chart = this;
                            let count = 0;

                            if (!big) {
                                chart.update({
                                    plotOptions: {
                                        pie: {
                                            center: [70, 155]

                                        }
                                    }
                                });
                            }

                            // spin
                            setTimeout(function () {
                                setInterval(function () {
                                    chart.update({
                                        mapView: {
                                            projection: {
                                                name: 'Orthographic',
                                                rotation: [count % 360, -30]
                                            }
                                        }
                                    }, true, false, false);
                                    count = count + 1;
                                }, 50);
                            }, 1500);


                            let noseCount = 0;
                            // nose
                            setInterval(function () {
                                if (noseCount === 0) {
                                    chart.series[2].points[0].setState('hover');
                                    noseCount = 1;
                                } else {
                                    chart.series[2].points[0].setState('normal');
                                    noseCount = 0;
                                }
                            }, 1000);

                        }

                    }
                },

                title: {
                    text: ''
                },
                legend: {
                    enabled: false
                },

                xAxis: [
                // 0
                    {
                        min: 0,
                        max: 20,
                        labels: {
                            style: {
                                color: '#fff'
                            }
                        },
                        visible: false
                    },
                    xAxis1,
                    xAxis2,
                    // 3
                    {
                        visible: false
                    }
                ],
                yAxis: [
                    // 0
                    {
                        min: 0,
                        max: 20,
                        labels: {
                            style: {
                                color: '#fff'
                            }
                        },
                        visible: false
                    },
                    yAxis1,
                    yAxis2,
                    // 3
                    {
                        visible: false
                    }],

                mapNavigation: {
                    enabled: false,
                    enableDoubleClickZoomTo: true,
                    buttonOptions: {
                        verticalAlign: 'bottom'
                    }
                },
                credits: {
                    enabled: false
                },
                mapView: {
                    maxZoom: 30,
                    zoom: 1.9,
                    projection: {
                        name: 'Orthographic',
                        rotation: [0, -30]
                    }
                },

                tooltip: {
                    enabled: true,
                    pointFormat: '{point.y} | {point.x}'
                },

                plotOptions: {
                    series: {
                        animation: false,
                        clip: false,
                        point: {
                            events: {
                                mouseOver: function () {
                                    chart.series[3].points[0].setState('hover');
                                },
                                mouseOut: function () {
                                    chart.series[3].points[0].setState('hover');
                                }

                            }
                        }
                    },
                    pie: {
                        center: [130, 185],
                        size: '6%'
                    },
                    bubble: {
                        minSize: 1,
                        maxSize: 3,
                        marker: {
                            lineWidth: 0
                        },
                        lineWidth: 0
                    }

                },
                series: [
                    // 0
                    {
                        name: 'Graticule',
                        id: 'graticule',
                        type: 'mapline',
                        color: '#fff',
                        lineWidth: 1,
                        data: getGraticule(),
                        nullColor: 'rgba(0, 0, 0, 0.05)'
                    },
                    // 1
                    {
                        data,
                        joinBy: 'name',
                        color: '#78758C',
                        opacity: 1,
                        name: 'Earth',
                        dataLabels: {
                            enabled: false,
                            format: '{point.name}'
                        }
                    },
                    // 2 -- sled (scatter)
                    {
                        type: 'scatter',
                        name: 'Santa & Rudolph',
                        animation: false,
                        data: [{
                            x: 14,
                            y: 8,
                            color: '#FF4540',
                            states: {
                                hover: {
                                    halo: {
                                        attributes: {
                                            fill: 'orange'
                                        },
                                        opacity: 1
                                    }
                                }
                            },
                            marker: {
                                radius: 3
                            },
                            dataLabels: {
                                enabled: true,
                                useHTML: true,
                                formatter: function () {
                                    return '<div id="sled"></div>';
                                }
                            }
                        }]
                    },
                    // 3 -- moon (pie)
                    {
                        type: 'pie',
                        name: 'The Moon',
                        animation: false,
                        visible: true,
                        dataLabels: {
                            enabled: false
                        },
                        states: {
                            normal: {
                                enabled: false
                            },
                            hover: {
                                halo: {
                                    size: 5
                                }
                            }
                        },
                        data: [
                            {
                                y: 100,
                                color: '#FFFAF0'
                            }
                        ]

                    },
                    // 4 --stars
                    {
                        type: 'bubble',
                        name: 'stars',
                        xAxis: 3,
                        yAxis: 3,
                        color: '#fff',
                        data: [[9, 81, 63],
                            [98, 5, 89],
                            [51, 50, 73],
                            [41, 22, 14],
                            [58, 24, 20],
                            [78, 37, 34],
                            [55, 56, 53],
                            [18, 45, 70],
                            [42, 44, 28],
                            [3, 52, 59],
                            [31, 18, 97],
                            [79, 91, 63],
                            [93, 23, 23],
                            [44, 83, 22]
                        ]
                    },
                    // 5 --stars
                    {
                        type: 'bubble',
                        color: '#fff',
                        name: 'stars',
                        xAxis: 3,
                        yAxis: 3,
                        data: [
                            [42, 38, 20],
                            [6, 18, 1],
                            [1, 93, 55],
                            [57, 2, 90],
                            [80, 76, 22],
                            [11, 74, 96],
                            [88, 56, 10],
                            [30, 47, 49],
                            [57, 62, 98],
                            [4, 16, 16],
                            [46, 10, 11],
                            [22, 87, 89],
                            [57, 91, 82],
                            [45, 15, 98]
                        ]
                    }]
            });

            ballChart = chart;

            // Render a circle filled with a radial gradient behind the globe to
            // make it appear as the sea around the continents
            const renderSea = () => {
                let verb = 'animate';
                if (!chart.sea) {
                    chart.sea = chart.renderer
                        .circle()
                        .attr({
                            fill: {
                                radialGradient: {
                                    cx: 0.4,
                                    cy: 0.4,
                                    r: 1
                                },
                                stops: [
                                    [0, 'lightblue'],
                                    [1, '#30416B']
                                ]
                            },
                            zIndex: -1
                        })
                        .add(chart.get('graticule').group);
                    verb = 'attr';
                }

                const bounds = chart.get('graticule').bounds,
                    p1 = chart.mapView.projectedUnitsToPixels({
                        x: bounds.x1,
                        y: bounds.y1
                    }),
                    p2 = chart.mapView.projectedUnitsToPixels({
                        x: bounds.x2,
                        y: bounds.y2
                    });
                chart.sea[verb]({
                    cx: (p1.x + p2.x) / 2,
                    cy: (p1.y + p2.y) / 2,
                    r: Math.min(p2.x - p1.x, p1.y - p2.y) / 2
                });
            };
            renderSea();
            Highcharts.addEvent(chart, 'redraw', renderSea);
        }
    );

};

snowglobe();
tree();
bell();
flake();
presents();
wreath();
candycane();
ball();
words();

document.getElementById('open').addEventListener('click',
    function () {

        [].forEach.call(
            document.querySelectorAll('.box'),
            function (elem, index) {
                if (index !== 4) {
                    elem.style.visibility = 'hidden';
                } else {
                    let boxTop = '260px';
                    if (!big) {
                        boxTop = '120px';
                    }
                    elem.style.top = boxTop;
                    elem.style.width = '180px';
                    elem.style.height = '100px';

                }
            }
        );

        this.style.display = 'none';
        document.getElementById('center-message').style.opacity = 0;
        document.getElementById('back').style.opacity = 1;

        flip(wordChart, 1, 'left', 0);
        flip(snowglobeChart, 2, 'center', 0);
        flip(bellChart, 4, 'left', 100);
        flip(candycaneChart, 6, 'right', 300);
        flip(presentsChart, 3, 'right', 300);
        flip(wreathChart, 9, 'right', 300);

        let sledY = 15;
        if (!big) {
            sledY = 12;
        }

        ballChart.series[2].points[0].update({
            x: 14,
            y: sledY
        });

        let moonCenter = [130, 5];

        if (!big) {
            moonCenter = [70, 5];
        }

        ballChart.update({
            plotOptions: {
                pie: {
                    center: moonCenter

                }
            }
        }, true);

        setTimeout(function () {
            ballChart.series[3].points[0].setState('hover');
        }, 500);

    }
);
