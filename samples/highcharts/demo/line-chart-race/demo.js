Highcharts.chart('container', {
    data: {
        csvURL: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@0dbb5d2/samples/data/race_data.csv',
        beforeParse: function (csv) {
            return csv.replace(/\n\n/g, '\n');
        }
    },
    chart: {
        marginRight: 150
        // events: {
        //    load: loadfunc()
        // }
    },
    title: {
        text: 'Line chart race'
    },
    Axis: {
        allowDecimals: false
        // min: 100,
        // max: 101
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
                enabled: false,
                pointIndex: -1
            },

            // With the data labels keyPoints feature
            dataLabels: {
                align: 'left',
                verticalAlign: 'middle',
                allowOverlap: true,
                enabled: true,
                format: '{series.name}: {point.y}',
                keyPoints: {
                    last: false
                },
                overflow: 'allow',
                crop: false
            },
            marker: {
                enabled: false
            }
            // step: true
        }
    },
    series: [{
        name: 'Sebastian Vettel'
    }, {
        name: 'Fernando Alonso'
    }, {
        name: 'Kimi Räikkönen'
    }, {
        name: 'Lewis Hamilton'
    }, {
        name: 'Jenson Button'
    }]
});

let i = 0;
let n = 0;
const timeBetweenPoints = 500;


function loadfunc() {
    for (let j = 0; j < 5; j++) {
        Highcharts.charts[0].series[j].data.forEach(point => {
            point.update({
                visible: false
            });
        });
    }

    Highcharts.charts[0].update({
        plotOptions: {
            series: {
                animation: {
                    duration: timeBetweenPoints * 10
                }
            }
        }
    });
}


const increment = series => {
    const last = series.points.at(n - 1);

    series.points.at(n).update({
        visible: true
        //marker: {
        //    enabled: true
        //}
    });

    if (last) {
        last.update({
            dataLabels: {
                enabled: false
            }
            //marker: {
            //    enabled: false
            //}
        }, true);
    }

    console.log(n);
};


const timer = setInterval(() => {

    if (i === 0) {
        loadfunc();
    }

    const chart = Highcharts.charts[0];

    for (let j = 0; j < 5; j++) {
        increment(chart.series[j]);
    }
    chart.redraw();
    n++;

    if (i++ > chart.series[0].data.length - 2) {
        clearInterval(timer);
    }
}, timeBetweenPoints);
