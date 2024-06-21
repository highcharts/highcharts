const startInt = 1,
    endInt = 20,
    animationSpeed = Math.floor(10000 / (endInt - startInt));

// General helper functions
const arrToAssociative = arr => {
    const tmp = {};
    arr.forEach(item => {
        tmp[item[0]] = item[1];
    });

    return tmp;
};

const formatPoints = [];

const chart = Highcharts.chart('container', {
    data: {
        csvURL: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@0dbb5d2/samples/data/race_data.csv',
        beforeParse: function (csv) {
            return csv.replace(/\n\n/g, '\n');
        },
        complete: function (options) {
            for (let i = 0; i < options.series.length; i++) {
                formatPoints[i] = arrToAssociative(options.series[i].data);
                options.series[i].data = null;
            }
        }
    },
    chart: {
        marginRight: 150,
        // events: {
        //    load: loadfunc()
        // }
        animation: {
            duration: animationSpeed,
            easing: t => t
        }
    },
    title: {
        text: 'Line chart race'
    },
    xAxis: {
        allowDecimals: false,
        min: startInt,
        max: endInt
    },
    yAxis: {
        title: {
            text: 'Goals'
        }
        // max: 200
    },
    plotOptions: {
        series: {
            animation: true,

            // With the series label pointIndex feature
            label: {
                enabled: true,
                pointIndex: -1
            },

            // With the data labels keyPoints feature
            dataLabels: {
                enabled: false
            },
            marker: {
                enabled: false
            }
            // step: true
        }
    }
});

let currentXVal = 1;

function update() {
    const series = chart.series;

    for (let i = 0; i < series.length; i++) {
        const newP = formatPoints[i][currentXVal];
        series[i].addPoint([newP]);
    }

    chart.redraw();

    currentXVal++;

    if (currentXVal > endInt) {
        pause();
    }
}

function play() {
    chart.sequenceTimer = setInterval(function () {
        update();
    }, animationSpeed);
}

function pause() {
    clearTimeout(chart.sequenceTimer);
    chart.sequenceTimer = undefined;
}

play();