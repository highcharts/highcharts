import * as Highcharts from 'highcharts';
import 'highcharts/modules/data';

function test_beforeParse() {
    const options: Highcharts.Options = {
        chart: {
            scrollablePlotArea: {
                minWidth: 700
            }
        },

        data: {
            csvURL: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/analytics.csv',
            beforeParse: (csv: string) => {
                return csv.replace(/\n\n/g, '\n');
            }
        },

        title: {
            text: 'Daily sessions at www.highcharts.com'
        },

        subtitle: {
            text: 'Source: Google Analytics'
        },

        xAxis: {
            tickInterval: 7 * 24 * 3600 * 1000, // one week
            tickWidth: 0,
            gridLineWidth: 1,
            labels: {
                align: 'left',
                x: 3,
                y: -3
            }
        },

        yAxis: [{ // left y axis
            crosshair: true,
            title: {
                text: undefined
            },
            labels: {
                align: 'left',
                x: 3,
                y: 16,
                format: '{value:.,0f}'
            },
            showFirstLabel: false
        }, { // right y axis
            linkedTo: 0,
            gridLineWidth: 0,
            opposite: true,
            title: {
                text: undefined
            },
            labels: {
                align: 'right',
                x: -3,
                y: 16,
                format: '{value:.,0f}'
            },
            showFirstLabel: false
        }],

        legend: {
            align: 'left',
            verticalAlign: 'top',
            borderWidth: 0
        },

        tooltip: {
            shared: true
        },

        plotOptions: {
            series: {
                cursor: 'pointer',
                point: {
                    events: {
                        click: (e) => {
                            console.log('click', e);
                        }
                    }
                },
                marker: {
                    lineWidth: 1
                }
            }
        },

        series: [{
            type: 'line',
            name: 'All sessions',
            lineWidth: 4,
            marker: {
                radius: 4
            }
        }, {
            type: 'line',
            name: 'New users'
        }]
    };

    Highcharts.chart('container', options);
}
