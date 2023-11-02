let itemChart;
let chartToChange;
let seriesNum;
const imagePath = 'https://cdn.rawgit.com/highcharts/highcharts/4b2b993a59d2358c85dbef61bfcd9e02547ce83a/samples/graphics/xmas-card-2020/';
// let imagePath = '../../../graphics/xmas-card-2020/';
let direction = 'forward';

const msgColors = [
    ['#b4141c', '#DF8B81'],
    ['#e01b22', '#f7f3cd'],
    ['#344916', '#85be3d'],
    ['#85be3d', '#344916'],
    ['#b4141c', '#f06e70'],
    ['#e01b22', '#f7f3cd'],
    ['#344916', '#85be3d'],
    ['#b4141c', '#f06e70'],
    ['#85be3d', '#344916'],
    ['#e01b22', '#f7f3cd'],
    ['#344916', '#85be3d'],
    ['#b4141c', '#f06e70'],
    ['#e01b22', '#f7f3cd']
];

Math.easeOutQuint = function (pos) {
    return (Math.pow((pos - 1), 5) + 1);
};
Math.easeOutBounce = pos => {
    if ((pos) < (1 / 2.75)) {
        return (7.5625 * pos * pos);
    }
    if (pos < (2 / 2.75)) {
        return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
    }
    if (pos < (2.5 / 2.75)) {
        return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
    }
    return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
};

// Sonification options
const sdInstruments = [{
        instrument: 'sineMajor',
        instrumentMapping: {
            duration: 200,
            frequency: 'y',
            volume: 0.0,
            pan: -1
        },
        instrumentOptions: {
            minFrequency: 220,
            maxFrequency: 1900
        }
    }],
    nyInstruments = [{
        instrument: 'triangleMajor',
        instrumentMapping: {
            duration: 200,
            frequency: 'y',
            volume: 0.4,
            pan: 1
        },
        instrumentOptions: {
            minFrequency: 220,
            maxFrequency: 1900
        }
    }];


// Utility function that highlights a point
function highlightPoint(event, point) {
    const chart = point.series.chart,
        hasVisibleSeries = chart.series.some(function (series) {
            return series.visible;
        });
    if (!point.isNull && hasVisibleSeries) {
        point.onMouseOver(); // Show the hover marker and tooltip
    } else {
        if (chart.tooltip) {
            chart.tooltip.hide(0);
        }
    }
}

itemChart = Highcharts.chart('container', {
    chart: {
        type: 'scatter',
        backgroundColor: 'transparent',
        animation: {
            duration: 500,
            easing: 'easeOutBounce'
        },
        margin: [0, 0, 0, 0],
        spacing: 0,
        events: {
            load: function () {
                itemChart = this;
                chartToChange = itemChart.series.findIndex(
                    series => series.options.type === 'item');

                $('#item1').attr('value', chartToChange);
                $('#item2').attr('value', chartToChange + 1);


                seriesNum = chartToChange;

                $('.highcharts-area-series').hide();
                $('.highcharts-areaspline-series').hide();
                $('.highcharts-line-series').hide();
                $('.highcharts-spline-series').hide();
                $('.highcharts-series-5').hide();
                $('.highcharts-annotation').hide();

            }
        }
    },
    title: {
        floating: true,
        align: 'center',
        useHTML: true,
        y: 110,
        x: -310,
        text: '<div class="cardTitle"><div>May your charts be merry and bright!</div><div ><img src="https://www.highcharts.com/media/templates/highsoft_2015/images/logo.svg"></div></div>'
    },
    credits: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    plotOptions: {
        series: {
            states: {
                hover: {
                    enabled: false
                },
                inactive: {
                    enabled: false
                }
            }
        },
        scatter: {
            dataLabels: {
                useHTML: true,
                enabled: false,
                x: 0,
                y: 20,
                formatter: function () {

                    const index = this.point.index;
                    const name = this.point.name;
                    return '<div class="message"' +
                    ' style="background-color:#fff;' +
                    'color:' + msgColors[index][0] + '">' + name + '</div>';
                }
            },
            marker: {
                enabled: false,
                symbol: 'square',
                radius: 2
            }
        },
        area: {
            fillOpacity: 1,
            marker: {
                enabled: false
            }

        },
        areaspline: {
            marker: {
                enabled: false,
                radius: 10,
                symbol: 'triangle',
                fillColor: '#fff'
            },
            borderWidth: 1,
            borderRadius: 12
        },
        item: {
            dataLabels: {
                enabled: false
            },
            borderWidth: 0,
            marker: {
                radius: 4
            }
        }
    },
    legend: {
        enabled: false
    },
    xAxis: [{
        // 0
        visible: false
    },
    {    // /1
        startOnTick: false,
        min: 0,
        max: 6,
        visible: false

    },
    {    // /2
        startOnTick: false,
        visible: true,
        min: 0,
        max: 12
    },
    { // 3
        startOnTick: false,
        visible: true,
        min: 0,
        max: 12

    },
    {    // /4
        startOnTick: true,
        visible: true,
        min: -1,
        max: 12,
        plotBands: [{
            from: 11,
            to: 12,
            color: '#D9DCD6'

        }],
        gridLineColor: 'transparent'
    },
    {    // /5
        startOnTick: false,
        visible: false,
        min: -1,
        max: 12

    },
    {    // /6
        startOnTick: false,
        visible: false,
        min: 0,
        max: 12

    }],
    yAxis: [
        { // 0
            min: 0,
            max: 1,
            visible: false
        },
        { // 1
            min: -8, // -8
            max: 1,
            reversed: false,
            visible: false
        },
        { // 2
            min: 0,
            max: 2.5,
            visible: false

        },
        { // 3
            min: 0,
            max: 14,
            visible: false

        },
        { // 4
            min: 0,
            max: 2.5,
            visible: false

        },
        { // 5
            min: 0,
            max: 2.5,
            visible: false

        },
        { // 6
            min: 0,
            max: 2.5,
            visible: false

        }],
    series: [{
        // 0 xAxis 2, yAxis 2
        xAxis: 0,
        yAxis: 0,
        id: 'sd',
        visible: false,
        type: 'scatter',
        color: 'green',
        marker: {
            enabled: true,
            radius: 10
        },
        data: [
            { x: 4, y: 0.7638 },
            { x: 5, y: 0.72 },
            { x: 15, y: 0.72 }
        ]
    },
    {
        // /1 -card bottom xAxis 4, yAxis 4
        type: 'area', // regular
        color: '#fff',
        fillOpacity: 1,
        zIndex: 30,
        shadow: false,
        lineWidth: 0,
        data: [
            { x: -2, y: 3 },
            { x: 4.55, y: 3 },
            { x: 4.6, y: 3 },
            { x: 10.98, y: 3 },
            { x: 10.985, y: 3 },
            { x: 12, y: 3 }
        ],
        zones: [
            {
                // beige
                value: 11.5,
                color: '#D9DCD6'
            }
        ],
        xAxis: 4,
        yAxis: 4,
        marker: {
            enabled: false,
            radius: 10,
            fillColor: 'gray'
        }
    },
    {
        // /2 -card bottom corner xAxis 4, yAxis 4
        type: 'area',
        color: {
            linearGradient: {
                x1: 0, x2: 0, y1: 0, y2: 1
            },
            stops: [
                [0, '#b3d1d5'],
                [1, '#fff']
            ]
        },
        fillOpacity: 1,
        zIndex: 30,
        shadow: false,
        lineWidth: 0,
        data: [{ x: 10.94, y: 0.4 }, { x: 11.83, y: 0.15 }],
        xAxis: 4,
        yAxis: 4,
        zoneAxis: 'y',
        zones: [
            {
                // beige
                value: 0.13,
                color: '#D9DCD6'
            }
        ],
        marker: {
            enabled: false,
            radius: 10,
            fillColor: 'gray'
        }
    },
    {
        // /3- card bottom shadow xAxis 4, yAxis 4
        type: 'line',
        color: '#868f7d',
        fillOpacity: 1,
        shadow: false,
        lineWidth: 5,
        zIndex: 30,
        data: [
            { x: -2, y: 2.8 },
            { x: -1.96, y: 0.47 },
            { x: 0.782, y: 0.106 },
            { x: 11.76, y: 0.12 }
        ],
        xAxis: 4,
        yAxis: 4,
        marker: {
            enabled: false,
            radius: 10,
            fillColor: 'gray'
        }
    },
    {
        // /4 - white hills shadow xAxis 2, yAxis 3
        type: 'areaspline', // regular
        color: '#333',
        fillOpacity: 0.3,
        shadow: false,
        zIndex: 2,
        lineWidth: 0,
        data: [
            { x: 1, y: 0 },
            { x: 1.33, y: 1.9 },
            { x: 2.78, y: 1.5 },
            { x: 3.7, y: 2 },
            { x: 8, y: 1.2 },
            { x: 9.78, y: 2 },
            { x: 11, y: 0 }],
        xAxis: 2,
        yAxis: 3
    },
    {    // 5 Santa xAxis 6, yAxis 6
        type: 'scatter',
        marker: {
            enabled: true,
            symbol: 'url(' + imagePath + 'santa.svg)',
            height: 30,
            width: 30
        },
        zIndex: 40,
        xAxis: 6,
        yAxis: 6,
        data: [{ x: 1.14, y: 0.43 }]
    },
    {
        // /6- white hills xAxis 2, yAxis 3
        type: 'areaspline', // regular
        color: '#fff',
        fillOpacity: 1,
        zIndex: 2,
        shadow: false,
        lineWidth: 0,
        data: [
            { x: 1, y: 0 },
            { x: 1.74, y: 1.95 },
            { x: 2.73, y: 1.4 },
            { x: 4.17, y: 1.92 },
            { x: 8, y: 1.2 },
            { x: 10, y: 1.86 },
            { x: 11, y: 0 }],
        xAxis: 2,
        yAxis: 3
    },
    {
        // /7 - white hills front xAxis 2, yAxis 3
        type: 'areaspline', // regular
        color: '#f7f7f7',
        zIndex: 2,
        marker: {
            enabled: false,
            radius: 10,
            fillColor: '#52978a'
        },
        fillOpacity: 1,
        shadow: false,
        lineWidth: 0,
        data: [
            { x: 1, y: 0 },
            { x: 2, y: 1.6 },
            { x: 2.8, y: 0.42 },
            { x: 4.5, y: 1.3 },
            { x: 8.13, y: 0.76 },
            { x: 9.9, y: 1.78 },
            { x: 11, y: 0 }],
        xAxis: 2,
        yAxis: 3
    },
    {
        // 8 road xAxis 2, yAxis 2
        type: 'spline',
        zIndex: 2,
        xAxis: 2,
        yAxis: 2,
        opacity: 1,
        lineWidth: 10,
        color: '#ebebeb',
        marker: {
            enabled: true,
            radius: 0,
            symbol: 'triangle'
        },
        data: [
            {
                x: 1.49,
                y: 0.26,
                marker: {
                    symbol: 'url(' + imagePath + 'pines.svg)',
                    width: 30,
                    height: 40
                }
            },
            {
                x: 2,
                y: 0,
                marker: {
                    symbol: 'url(' + imagePath + 'red-house.svg)',
                    width: 37,
                    height: 30
                }
            },
            {
                x: 2.6,
                y: 0,
                marker: {
                    symbol: 'url(' + imagePath + 'pines.svg)',
                    width: 40,
                    height: 50
                }
            },
            {
                x: 2.78,
                y: 0.4,
                marker: {
                    symbol: 'url(' + imagePath + 'hill.svg)',
                    width: 100,
                    height: 100
                }
            },
            {
                x: 3.12,
                y: -0.54,
                marker: {

                    symbol: 'url(' + imagePath + 'pond-skate.svg)',
                    width: 171,
                    height: 120
                }
            },
            {
                x: 4.34,
                y: -0.3,
                marker: {

                    symbol: 'url(' + imagePath + 'car-tree.svg)',
                    width: 40,
                    height: 20
                }
            },
            {
                x: 5,
                y: 0.44,
                marker: {
                    symbol: 'url(' + imagePath + 'hill2.svg)',
                    width: 140,
                    height: 180
                }
            },
            { x: 6.3, y: 0.4 },
            {
                x: 6.9,
                y: 0.15,
                marker: {
                    symbol: 'url(' + imagePath + 'pines.svg)',
                    width: 30,
                    height: 40
                }
            },
            {
                x: 7.57,
                y: -0.23,
                marker: {
                    symbol: 'url(' + imagePath + 'people.svg)',
                    width: 171,
                    height: 130
                }
            },
            { x: 8.14, y: -0.33, marker: { fillColor: 'transparent' } },
            {
                x: 9,
                y: -0.32,
                marker: {

                    symbol: 'url(' + imagePath + 'tree-cluster.svg)',
                    width: 100,
                    height: 140
                }
            },
            {
                x: 9.1,
                y: 0,
                marker: {
                    symbol: 'url(' + imagePath + 'pines.svg)',
                    width: 40,
                    height: 50
                }
            },
            {
                x: 9.3,
                y: 0.29,
                marker: {
                    symbol: 'url(' + imagePath + 'horse.svg)',
                    width: 40,
                    height: 30
                }
            },
            {
                x: 9.52,
                y: 0.53,
                marker: {
                    symbol: 'url(' + imagePath + 'hill.svg)',
                    width: 100,
                    height: 80
                }
            }
        ]
    },
    {
        // 9 message xAxis 3, yAxis 2
        xAxis: 5,
        yAxis: 5,
        shadow: true,
        zIndex: 5,
        type: 'scatter',
        marker: {
            enabled: true,
            radius: 0
        },
        dataLabels: {
            enabled: true,
            allowOverlap: true
        },
        data: [
            {
                name: 'H',
                x: 0.6,
                y: 1.5,
                marker: {
                    fillColor: msgColors[0][1]
                }
            },
            {
                name: 'A',
                x: 1.2,
                y: 1.5,
                marker: {
                    fillColor: msgColors[1][1]
                }
            },
            {
                name: 'P',
                x: 1.8,
                y: 1.5,
                marker: {
                    fillColor: msgColors[2][1]
                }
            },
            {
                name: 'P',
                x: 2.4,
                y: 1.5,
                marker: {
                    fillColor: msgColors[3][1]
                }
            },
            {
                name: 'Y',
                x: 3,
                y: 1.5,
                marker: {
                    fillColor: msgColors[4][1]
                }
            },
            {
                name: 'H',
                x: 6,
                y: 1.5,
                marker: {
                    fillColor: msgColors[5][1]
                }
            },
            {
                name: 'O',
                x: 6.6,
                y: 1.5,
                marker: {
                    fillColor: msgColors[6][1]
                }
            },
            {
                name: 'L',
                x: 7.2,
                y: 1.5,
                marker: {
                    fillColor: msgColors[7][1]
                }
            },
            {
                name: 'I',
                x: 7.8,
                y: 1.5,
                marker: {
                    fillColor: msgColors[8][1]
                }
            },
            {
                name: 'D',
                x: 8.4,
                y: 1.5,
                marker: {
                    fillColor: msgColors[9][1]
                }
            },
            {
                name: 'A',
                x: 9.0,
                y: 1.5,
                marker: {
                    fillColor: msgColors[10][1]
                }
            },
            {
                name: 'Y',
                x: 9.6,
                y: 1.5,
                marker: {
                    fillColor: msgColors[11][1]
                }
            },
            {
                name: 'S',
                x: 10.2,
                y: 1.5,
                marker: {
                    fillColor: msgColors[12][1]
                }
            }]
    },
    { // 10
        type: 'item',
        name: 'Christmas Tree',
        zIndex: 6,
        keys: ['name', 'y', 'color', 'label'],
        data: [
            {
                name: 'white star',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'white-star-big.svg)',
                    radius: 20
                }
            },
            {
                name: 'red star',
                y: 2,
                color: '#64A12D',
                marker: {
                    symbol: 'url(' + imagePath + 'red-star.svg)',
                    radius: 20
                }
            },
            { name: 'white dot', y: 1, color: '#fff' },
            {
                name: 'big blue star',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'blue-star-big.svg)',
                    radius: 20
                }
            },
            {
                name: 'green dot',
                y: 1,
                color: Highcharts.getOptions().colors[4]
            },
            {
                name: 'big green flake',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'green-flake-big.svg)',
                    radius: 20
                }
            },
            { name: 'red dot', y: 1, color: Highcharts.getOptions().colors[5] },
            {
                name: 'big white flake',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'green-flake-big.svg)',
                    radius: 20
                }
            },
            {
                name: 'big blueflake',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'blue-flake-big.svg)',
                    radius: 20
                }
            },
            {
                name: 'purple dot',
                y: 1,
                color: Highcharts.getOptions().colors[4]
            },
            // 10
            {
                name: 'green star 1',
                y: 1,
                marker: {
                    symbol: 'url(' + imagePath + 'green-star.svg)',
                    radius: 20
                }
            },
            // 11
            {
                name: 'sun disk',
                y: 1,
                marker: {
                    symbol: 'url(' + imagePath + 'sun-disk.svg)',
                    radius: 20
                }
            },
            {
                name: 'orange dot',
                y: 1,
                color: Highcharts.getOptions().colors[3]
            },
            {
                name: 'red flake',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'red-flake.svg)',
                    radius: 20
                }
            },
            {
                name: 'white star',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'blue-star-big.svg)',
                    radius: 20
                }
            },
            {
                name: 'red star',
                y: 2,
                color: '#64A12D',
                marker: {
                    symbol: 'url(' + imagePath + 'red-star.svg)',
                    radius: 20
                }
            },
            { name: 'white dot', y: 1, color: '#fff' },
            {
                name: 'big blue star',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'blue-star-big.svg)',
                    radius: 20
                }
            },
            {
                name: 'green dot',
                y: 1,
                color: Highcharts.getOptions().colors[4]
            },
            {
                name: 'big green flake 1',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'green-flake-big.svg)',
                    radius: 20
                }
            },
            {
                name: 'red dot',
                y: 1,
                color: Highcharts.getOptions().colors[5]
            },
            {
                name: 'big green flake 2',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'green-flake-big.svg)',
                    radius: 20
                }
            },
            {
                name: 'big blueflake',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'blue-flake-big.svg)',
                    radius: 20
                }
            },
            {
                name: 'purple dot',
                y: 1,
                color: Highcharts.getOptions().colors[4]
            },
            {
                name: 'green star 2',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'green-star.svg)',
                    radius: 20
                }
            },
            {
                name: 'big red star',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'red-star-big.svg)',
                    radius: 20
                }
            },
            {
                name: 'orange dot',
                y: 1,
                color: Highcharts.getOptions().colors[3]
            },
            {
                name: 'red flake',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'red-flake.svg)',
                    radius: 20
                }
            },
            {
                name: 'white star',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'red-star-big.svg)',
                    radius: 20
                }
            },
            {
                name: 'red star',
                y: 2,
                color: '#64A12D',
                marker: {
                    symbol: 'url(' + imagePath + 'red-star.svg)',
                    radius: 20
                }
            },
            { name: 'white dot', y: 1, color: '#fff' },
            {
                name: 'big blue star',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'blue-star-big.svg)',
                    radius: 20
                }
            },
            {
                name: 'green dot',
                y: 1,
                color: Highcharts.getOptions().colors[4]
            },
            {
                name: 'big green flake 3',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'green-flake-big.svg)',
                    radius: 20
                }
            },
            {
                name: 'red dot',
                y: 1,
                color: Highcharts.getOptions().colors[5]
            },
            {
                name: 'big green flake 4',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'green-flake-big.svg)',
                    radius: 20
                }
            },
            {
                name: 'big blueflake',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'blue-flake-big.svg)',
                    radius: 20
                }
            },
            {
                name: 'purple dot',
                y: 1,
                color: Highcharts.getOptions().colors[4]
            },
            {
                name: 'green star 2',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'green-star.svg)',
                    radius: 20
                }
            },
            {
                name: 'big red star',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'red-star-big.svg)',
                    radius: 20
                }
            },
            {
                name: 'orange dot',
                y: 1,
                color: Highcharts.getOptions().colors[3]
            },
            {
                name: 'red flake',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'red-flake.svg)',
                    radius: 20
                }
            },
            {
                name: 'white star',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'blue-star-big.svg)',
                    radius: 20
                }
            },
            {
                name: 'red star',
                y: 2,
                color: '#64A12D',
                marker: {
                    symbol: 'url(' + imagePath + 'red-star.svg)',
                    radius: 20
                }
            },
            { name: 'white dot', y: 1, color: '#fff' },
            {
                name: 'big blue star',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'blue-star-big.svg)',
                    radius: 20
                }
            },
            {
                name: 'green dot',
                y: 1,
                color: Highcharts.getOptions().colors[4]
            },
            {
                name: 'big green flake',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'green-flake-big.svg)',
                    radius: 20
                }
            },
            {
                name: 'red dot',
                y: 1,
                color: Highcharts.getOptions().colors[5]
            },
            {
                name: 'big white flake',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'green-flake-big.svg)',
                    radius: 20
                }
            },
            {
                name: 'big blueflake',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'blue-flake-big.svg)',
                    radius: 20
                }
            },
            {
                name: 'purple dot',
                y: 1,
                color: Highcharts.getOptions().colors[4]
            },
            {
                name: 'green star',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'green-star.svg)',
                    radius: 20
                }
            },
            {
                name: 'big red star',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'red-star-big.svg)',
                    radius: 20
                }
            },
            {
                name: 'orange dot',
                y: 1,
                color: Highcharts.getOptions().colors[3]
            },
            {
                name: 'red flake',
                y: 2,
                marker: {
                    symbol: 'url(' + imagePath + 'red-flake.svg)',
                    radius: 20
                }
            }

        ], // Circular options
        startAngle: 100,
        endAngle: 100,
        size: '23%',
        innerSize: '50%',
        center: ['5%', '23%']
    }]
});

const soundChart = Highcharts.chart('soundContainer', {
    chart: {
        type: 'scatter'
    },
    title: {
        text: 'Play chart as sound'
    },
    subtitle: {
        text: 'Weekly temperature averages'
    },
    yAxis: {
        min: 0,
        max: 1,
        title: {
            text: 'Temperature (°F)'
        },
        tickInterval: 0.1,
        zoomEnabled: false
    },
    xAxis: {
        type: 'linear'
    },
    tooltip: {
        split: true,
        enabled: true,
        pointFormatter: function () {
            const pointDate = new Date(this.options.x);
            return pointDate + ' | ' + this.options.y;
        },
        valueDecimals: 4,
        positioner: function () {
            return { x: 80, y: 350 };
        }
    },
    plotOptions: {
        series: {
            marker: {
                enabled: true
            },
            // Sonify points on click
            point: {
                events: {
                    click: function () {
                        // Sonify all points at this x value
                        const targetX = this.x,
                            chart = this.series.chart;
                        chart.series.forEach(function (series) {
                            // Map instruments to the options for this series
                            const instruments = series.options.id === 'sd' ?
                                sdInstruments : nyInstruments;
                            // See if we have a point with the targetX
                            series.points.some(function (point) {
                                if (point.x === targetX) {
                                    point.sonify({
                                        instruments: instruments
                                    });
                                    return true;
                                }
                                return false;
                            });
                        });
                    }
                }
            }
        }
    },
    // Data source: https://www.ncdc.noaa.gov
    series: [
        {
            name: 'San Diego',
            id: 'sd',
            visible: true,
            data: [
                { x: 4, y: 0.7638 },
                { x: 5, y: 0.72 },
                { x: 15, y: 0.72 }
            ],
            color: '#f4b042'
        },
        {
            name: 'New York',
            id: 'ny',
            color: '#41aff4',
            data: [
                { x: 0, y: 0.7342 },
                { x: 1, y: 0.7426 },
                { x: 2, y: 0.7426 },
                { x: 2.5, y: 0.7464 },
                { x: 3, y: 0.7425 },
                { x: 3.5, y: 0.7402 },
                { x: 4, y: 0.7374 },
                { x: 5, y: 0.7374 },
                { x: 6, y: 0.7374 },
                { x: 7, y: 0.7450 },
                { x: 8, y: 0.7450 },
                { x: 8.5, y: 0.7477 },
                { x: 9, y: 0.7450 },
                { x: 9.5, y: 0.7417 },
                { x: 10, y: 0.7393 },
                { x: 11, y: 0.7343 },
                { x: 12, y: 0.7343 },
                { x: 13, y: 0.7472 },
                { x: 14, y: 0.7472 },
                { x: 14.5, y: 0.7499 },
                { x: 15, y: 0.7472 },
                { x: 15.5, y: 0.7450 },
                { x: 16, y: 0.7417 },
                { x: 17, y: 0.7370 },
                { x: 18, y: 0.7343 },
                { x: 18.5, y: 0.7343 },
                { x: 19, y: 0.7383 },
                { x: 20, y: 0.7428 },
                { x: 21, y: 0.7400 },
                { x: 22, y: 0.7428 }
            ]
        }]
});

function ski1() {
    $('.highcharts-series-5').show();
    itemChart.series[5].points[0].update({ x: 1.6, y: 1.4 });
}
function ski2() {
    itemChart.series[5].points[0].update({ x: 3, y: 1 });
}
function ski3() {
    itemChart.series[5].points[0].update({ x: 4, y: 1.4 });
}
function ski4() {
    itemChart.update({
        chart: {
            animation: {
                duration: 3000,
                easing: 'easeOutQuint'
            }
        }
    });
    itemChart.series[5].points[0].update({ x: 8, y: 1 });

}

function ski5() {
    itemChart.update({
        chart: {
            animation: {
                duration: 1000,
                easing: 'easeOutQuint'
            }
        }
    });
    itemChart.series[5].points[0].update({ x: 10, y: 1.3 });

}

function ski6() {
    itemChart.series[5].points[0].update({ x: 10.8, y: 0.5 });
}

function ski(direction) {

    if (direction === 'forward') {
        itemChart.series[5].points[0].update({
            marker: {
                symbol: 'url(' + imagePath + 'santa.svg)',
                height: 30,
                width: 30
            }
        });
        ski1();
        setTimeout(function () {
            ski2();
        }, 1000);
        setTimeout(function () {
            ski3();
        }, 2000);
        setTimeout(function () {
            ski4();
        }, 3000);
        setTimeout(function () {
            ski5();
        }, 5000);
        setTimeout(function () {
            ski6();
        }, 6000);
    } else {
        itemChart.series[5].points[0].update({
            marker: {
                symbol: 'url(' + imagePath + 'santa-b.svg)',
                height: 30,
                width: 30
            }
        });
        ski5();
        setTimeout(function () {
            ski4();
        }, 1000);
        setTimeout(function () {
            ski3();
        }, 3000);
        setTimeout(function () {
            ski2();
        }, 4000);
        setTimeout(function () {
            ski1();
        }, 5000);
    }
}

function skiInterval() {
    if (direction === 'forward') {
        direction = 'backward';
    } else {
        direction = 'forward';
    }
    ski(direction);
}

function openCard() {

    $('#container').addClass('over');
    $('#controls').addClass('over');

    setTimeout(function () {

        $('.highcharts-area-series[class!="highcharts-series-2"]').fadeIn(100);
        $('.highcharts-areaspline-series').show();

        itemChart.update({
            chart: {
                backgroundColor: {
                    linearGradient: {
                        x1: 0, x2: 0, y1: 0, y2: 1
                    },
                    stops: [
                        [0.4, '#2a555a'],
                        [0.7, '#579ba4'],
                        [1, '#fff']
                    ]
                }
            }
        });


        itemChart.yAxis[2].setExtremes(-1, 3.0);

        itemChart.series[1].points[0].update({ x: -2, y: 0.47 });
        itemChart.series[1].points[1].update({ x: 0.8, y: 0.1 });
        itemChart.series[1].points[2].update({ x: 2.72, y: 0.13 });
        itemChart.series[1].points[3].update({ x: 10.38, y: 0.13 });
        itemChart.series[1].points[4].update({ x: 10.97, y: 0.13 });
        itemChart.series[1].points[5].update({ x: 11.77, y: 0.13 });
    }, 100);

    setTimeout(function () {
        $('.highcharts-line-series').fadeIn(100);
        $('.highcharts-spline-series').fadeIn(100);

        itemChart.yAxis[5].setExtremes(0, 1.5);
        itemChart.yAxis[3].setExtremes(-0.5, 4);

        itemChart.series[9].update({
            data: [
                {
                    name: 'H',
                    x: 1.6,
                    y: 1.5,
                    marker: {

                        fillColor: msgColors[0][1]
                    }
                },
                {
                    name: 'A',
                    x: 2.2,
                    y: 1.5,
                    marker: {
                        fillColor: msgColors[1][1]
                    }
                },
                {
                    name: 'P',
                    x: 2.8,
                    y: 1.5,
                    marker: {

                        fillColor: msgColors[2][1]
                    }
                },
                {
                    name: 'P',
                    x: 3.4,
                    y: 1.5,
                    marker: {

                        fillColor: msgColors[3][1]
                    }
                },
                {
                    name: 'Y',
                    x: 4,
                    y: 1.5,
                    marker: {

                        fillColor: msgColors[4][1]
                    }
                },
                {
                    name: 'H',
                    x: 5.2,
                    y: 1.5,
                    marker: {

                        fillColor: msgColors[5][1]
                    }
                },
                {
                    name: 'O',
                    x: 5.8,
                    y: 1.5,
                    marker: {

                        fillColor: msgColors[6][1]
                    }
                },
                {
                    name: 'L',
                    x: 6.4,
                    y: 1.5,
                    marker: {

                        fillColor: msgColors[7][1]
                    }
                },
                {
                    name: 'I',
                    x: 7.0,
                    y: 1.5,
                    marker: {

                        fillColor: msgColors[8][1]
                    }
                },
                {
                    name: 'D',
                    x: 7.6,
                    y: 1.5,
                    marker: {

                        fillColor: msgColors[9][1]
                    }
                },
                {
                    name: 'A',
                    x: 8.2,
                    y: 1.5,
                    marker: {

                        fillColor: msgColors[10][1]
                    }
                },
                {
                    name: 'Y',
                    x: 8.8,
                    y: 1.5,
                    marker: {

                        fillColor: msgColors[11][1]
                    }
                },
                {
                    name: 'S',
                    x: 9.4,
                    y: 1.5,
                    marker: {

                        fillColor: msgColors[12][1]
                    }
                }]
        });

        itemChart.series[seriesNum].update({
            startAngle: -100,
            endAngle: -76,
            size: '87%',
            innerSize: '0%',
            center: ['3%', '40%']
        });

        $('.highcharts-point > image').css({
            transform: 'translate(-20px,-45px)'
        });
    }, 1000);

    setTimeout(function () {

        itemChart.update({
            chart: {
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuint'
                }
            }
        });

        $('.cardTitle').fadeIn();

        itemChart.series[10].points[11].update({
            marker: {
                radius: 60
            }
        });
        ski(direction);

        setInterval(skiInterval, 7500);
        $('g.highcharts-color-1[aria-label~="Christmas Tree."]')
            .css({ transform: 'translate(30px, -20px)' });
    }, 2000);
}

// On speed change we reset the sonification
document.getElementById('speed').onchange = function () {
    soundChart.cancelSonify();
};


// Add sonification button handlers
document.getElementById('play').onclick = function () {
    openCard();
    if (!soundChart.sonification.timeline ||
        soundChart.sonification.timeline.atStart()) {
        soundChart.sonify({
            duration: 5000 / document.getElementById('speed').value,
            order: 'simultaneous',
            pointPlayTime: 'x',
            seriesOptions: [{
                id: 'ny',
                instruments: nyInstruments,
                onPointStart: highlightPoint
            }],
            // Delete timeline on end
            onEnd: function () {
                if (soundChart.sonification.timeline) {
                    delete soundChart.sonification.timeline;
                }
            }
        });
    } else {
        soundChart.resumeSonify();
    }
};
document.getElementById('pause').onclick = function () {
    soundChart.pauseSonify();
};
document.getElementById('rewind').onclick = function () {
    soundChart.rewindSonify();
};

// Scale to mobile
function scaleContainer() {
    const width = $(document.body).width();
    let scale = 1;
    if (width < 800) {
        scale = (width - 46) / 800;
    }
    document.getElementById('container').style.transform = `scale(${scale})`;
}
document.addEventListener('DOMContentLoaded', scaleContainer);
window.addEventListener('orientationchange', scaleContainer);
window.addEventListener('resize', scaleContainer);