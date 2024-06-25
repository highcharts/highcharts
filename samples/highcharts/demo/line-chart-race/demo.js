const startInt = 0,
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
        },

        events: {
            redraw: function () {
                const labels = this.annotations[0].labels;
                labels
                    .find(a => a.options.id === 'sebastian_vettel')
                    .graphic.attr({
                        rotation: this.series[0].yData[0]
                    });
                console.log(this.series[0].yData[this.series[0].length - 1]);
            }
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
                    verticalAlign: 'top',
                    point: {
                        x: 12,
                        xAxis: 0,
                        y: 120,
                        yAxis: 0
                    },
                    id: 'sebastian_vettel'
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
    const series = chart.series;

    for (let i = 0; i < series.length; i++) {
        const newP = formatPoints[i][currentXVal];
        series[i].addPoint([newP]);
    }

    chart.redraw();

    if (currentXVal > endInt) {
        pause();
    }

    currentXVal++;
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