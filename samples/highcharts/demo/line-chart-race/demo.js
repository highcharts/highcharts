const startInt = 1,
    endInt = 20,
    animationSpeed = Math.floor(2000 / (endInt - startInt));

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
            text: 'Points'
        },
        max: 300
    },
    plotOptions: {
        series: {
            animation: true,

            // With the series label pointIndex feature
            label: {
                enabled: false
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
    },
    annotations: [
        {
            labels: [
                {
                    text: 'Vettel',
                    verticalAlign: 'right',
                    point: {
                        x: 1,
                        xAxis: 0,
                        y: 0,
                        yAxis: 0
                    },
                    id: 'sebastian_vettel'
                },
                {
                    text: 'Alonso',
                    verticalAlign: 'right',
                    point: {
                        x: 1,
                        xAxis: 0,
                        y: 0,
                        yAxis: 0
                    },
                    id: 'fernando_alonso'
                },
                {
                    text: 'Räikkönen',
                    verticalAlign: 'right',
                    point: {
                        x: 1,
                        xAxis: 0,
                        y: 0,
                        yAxis: 0
                    },
                    id: 'kimi_räikkönen'
                },
                {
                    text: 'Hamilton',
                    verticalAlign: 'right',
                    point: {
                        x: 1,
                        xAxis: 0,
                        y: 0,
                        yAxis: 0
                    },
                    id: 'lewis_hamilton'
                },
                {
                    text: 'Button',
                    verticalAlign: 'right',
                    point: {
                        x: 1,
                        xAxis: 0,
                        y: 0,
                        yAxis: 0
                    },
                    id: 'jenson_button'
                }
            ],
            labelOptions: {
                allowOverlap: true,
                backgroundColor: undefined,
                borderColor: undefined
            },
            draggable: ''
        }
    ]
});

let currentXVal = 1;

function update() {
    if (currentXVal > endInt) {
        pause();
        return;
    }
    const series = chart.series;
    const annotations = chart.annotations;

    for (let i = 0; i < series.length; i++) {
        const newP = formatPoints[i][currentXVal];
        series[i].addPoint([currentXVal, newP]);
        console.log('x = ' + currentXVal);
        console.log('y = ' + newP);
        chart.annotations[0].labels[i].update({
            point: {
                x: currentXVal,
                y: newP,
                xAxis: 0,
                yAxis: 0
            }
        }, true);
        console.log('------------------');
    }

    chart.redraw(true);

    if (currentXVal > endInt) {
        pause();
    }

    currentXVal++;
}

function play() {
    chart.sequenceTimer = setInterval(function () {
        update();
    }, animationSpeed - 10);
}

function pause() {
    clearTimeout(chart.sequenceTimer);
    chart.sequenceTimer = undefined;
}

play();