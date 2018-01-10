
// Set up the chart
var chart = new Highcharts.Chart({
    chart: {
        renderTo: 'container',
        margin: 100,
        type: 'scatter3d',
        options3d: {
            enabled: true,
            alpha: 10,
            beta: 30,
            depth: 250,
            viewDistance: 5,
            fitToPlot: false,
            frame: {
                bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
                back: { size: 1, color: 'rgba(0,0,0,0.04)' },
                side: { size: 1, color: 'rgba(0,0,0,0.06)' }
            }
        }
    },
    title: {
        text: 'Axis labels in perspective'
    },
    subtitle: {
        text: 'Click and drag the plot area to rotate in space'
    },
    plotOptions: {
        scatter: {
            width: 10,
            height: 10,
            depth: 10
        }
    },
    xAxis: {
        min: 0,
        max: 1000,
        gridLineWidth: 1,
        labels: {
            skew3d: true
        },
        title: {
            text: 'X axis title'
        }
    },
    yAxis: {
        min: 0,
        max: 1000,
        labels: {
            skew3d: true
        },
        title: {
            text: 'Y axis title'
        }
    },
    zAxis: {
        min: 0,
        max: 1000,
        showFirstLabel: false,
        labels: {
            skew3d: true
        },
        title: {
            text: 'Z axis title'
        }
    },
    legend: {
        enabled: false
    },
    series: [{
        name: 'Reading',
        colorByPoint: true,
        data: [
            [611, 138, 82],
            [304, 716, 717],
            [250, 196, 324],
            [309, 751, 146],
            [528, 724, 239],
            [51, 8, 341],
            [113, 414, 490],
            [194, 762, 536],
            [350, 939, 500],
            [339, 920, 386],
            [758, 314, 434],
            [144, 779, 960],
            [564, 464, 823],
            [312, 497, 148],
            [705, 669, 944],
            [306, 829, 993],
            [926, 211, 649],
            [887, 176, 630],
            [492, 572, 691],
            [440, 259, 283],
            [381, 268, 620],
            [282, 180, 626],
            [633, 519, 908],
            [779, 661, 512],
            [168, 50, 575],
            [730, 271, 655],
            [606, 135, 976],
            [45, 488, 930],
            [376, 127, 24],
            [169, 243, 552],
            [623, 535, 278],
            [860, 575, 376],
            [574, 261, 282],
            [559, 104, 112],
            [986, 498, 869],
            [953, 924, 217],
            [13, 808, 523],
            [109, 468, 998],
            [168, 871, 854],
            [21, 202, 940],
            [265, 761, 662],
            [331, 501, 536],
            [691, 150, 535],
            [425, 891, 79],
            [177, 151, 821],
            [461, 647, 889],
            [428, 979, 930],
            [251, 46, 996],
            [388, 428, 236],
            [205, 248, 534],
            [248, 430, 453],
            [967, 567, 988],
            [966, 737, 287],
            [150, 645, 602],
            [588, 358, 994],
            [272, 252, 434],
            [586, 196, 336],
            [627, 72, 294],
            [55, 159, 682],
            [116, 372, 926],
            [8, 258, 391],
            [627, 497, 993],
            [820, 775, 987],
            [488, 604, 65],
            [541, 557, 671],
            [591, 242, 88],
            [190, 163, 372],
            [573, 926, 548],
            [338, 98, 545],
            [974, 54, 684],
            [581, 805, 695],
            [993, 107, 540],
            [633, 109, 341],
            [413, 259, 941],
            [383, 800, 336],
            [583, 785, 651],
            [795, 589, 85],
            [263, 305, 251],
            [924, 773, 659],
            [824, 991, 948],
            [927, 983, 39],
            [923, 846, 621],
            [117, 555, 884],
            [641, 766, 374],
            [884, 167, 605],
            [511, 511, 652],
            [448, 609, 55],
            [436, 532, 567],
            [556, 305, 968],
            [66, 2, 270],
            [285, 517, 339],
            [749, 814, 627],
            [566, 569, 446],
            [19, 452, 16],
            [354, 899, 267],
            [992, 568, 12],
            [165, 27, 824],
            [302, 743, 215],
            [928, 188, 470],
            [748, 328, 931]
        ]
    }]
});


// Add mouse events for rotation
$(chart.container).on('mousedown.hc touchstart.hc', function (eStart) {
    eStart = chart.pointer.normalize(eStart);

    var posX = eStart.chartX,
        posY = eStart.chartY,
        alpha = chart.options.chart.options3d.alpha,
        beta = chart.options.chart.options3d.beta,
        newAlpha,
        newBeta,
        sensitivity = 5; // lower is more sensitive

    $(document).on({
        'mousemove.hc touchmove.hc': function (e) {
            // Run beta
            e = chart.pointer.normalize(e);
            newBeta = beta + (posX - e.chartX) / sensitivity;
            chart.options.chart.options3d.beta = newBeta;

            // Run alpha
            newAlpha = alpha + (e.chartY - posY) / sensitivity;
            chart.options.chart.options3d.alpha = newAlpha;

            chart.redraw(false);
        },
        'mouseup touchend': function () {
            $(document).off('.hc');
        }
    });
});
