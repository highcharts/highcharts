import * as Highcharts from 'highcharts';
import DrilldownModule from 'highcharts/modules/drilldown';

DrilldownModule(Highcharts);

test_drillUp();
test_labelStyling();

function test_drillUp() {
    const chart = Highcharts.chart('container', {});
    chart.drillUp();// #13037
}

function test_labelStyling() {
    enum relativeToValues {
        plotBox = 'plotBox',
        spacingBox = 'spacingBox'
    }
    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Drilldown label styling'
        },
        xAxis: {
            type: 'category'
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                // borderWidth: 0,
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [{
            type: 'column',
            name: 'Things',
            colorByPoint: true,
            data: [{
                name: 'Dieren',
                y: 5,
                drilldown: 'animals'
            }, {
                name: 'Fruit',
                y: 2,
                drilldown: 'fruits'
            }, {
                name: 'Auto\'s',
                y: 4
            }]
        }],
        drilldown: {
            breadcrumbs: {
                relativeTo: relativeToValues.spacingBox,
                position: {
                    align: 'right',
                    verticalAlign: 'top',
                    y: 0,
                    x: 0
                },
                buttonTheme: {
                    fill: 'white',
                    'stroke-width': 1,
                    stroke: 'silver',
                    r: 0,
                    states: {
                        hover: {
                            fill: '#a4edba'
                        },
                        select: {
                            stroke: '#039',
                            fill: '#a4edba'
                        }
                    }
                }
            },
            series: [{
                type: 'column',
                id: 'animals',
                data: [
                    ['Katten', 4],
                    ['Honden', 2],
                    ['Koeien', 1],
                    ['Schapen', 2],
                    ['Varkens', 1]
                ]
            }, {
                type: 'column',
                id: 'fruits',
                data: [
                    ['Appels', 4],
                    ['Sinaasappels', 2]
                ]
            }]
        }
    });
}
