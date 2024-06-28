Highcharts.chart('container', {
    tooltip: {
        headerFormat: '',
        pointFormat: '' +
            '{#if (eq 1 point.sets.length)}' +
                'Product:<br><b>Highcharts {point.sets.0}</b>' +
            '{else}' +
                'Products:<br>' +
                '{#each point.sets}' +
                    'Highcharts <b>{this}</b>{#unless @last} and {/unless}' +
                '{/each}<br><br>' +
                'Shared components:<br>' +
                '<b>{point.name}</b><br>' +
            '{/if}'
    },
    series: [{
        type: 'venn',
        colors: [
            'rgb(180, 210, 255)',
            'rgb(180, 255, 210)',
            'rgb(180, 235, 235)',
            'rgb(200, 200, 200)',
            'rgb(170, 230, 250)',
            'rgb(170, 250, 230)',
            'rgb(170, 240, 240)',
            'rgb(190, 190, 190)',
            'rgb(160, 220, 245)',
            'rgb(160, 245, 220)'
        ],
        data: [{
            sets: ['Core'],
            value: 10,
            name: 'Highcharts Core',
            dataLabels: {
                style: {
                    fontSize: 15
                }
            }
        }, {
            sets: ['Stock'],
            value: 3,
            dataLabels: {
                style: {
                    fontSize: 13
                }
            }
        }, {
            sets: ['Dashboards'],
            value: 3,
            dataLabels: {
                style: {
                    fontSize: 13
                }
            }
        }, {
            sets: ['Gantt'],
            value: 2.5,
            dataLabels: {
                style: {
                    fontSize: 13
                }
            }
        }, {
            sets: ['Maps'],
            value: 3,
            dataLabels: {
                style: {
                    fontSize: 13
                }
            }
        }, {
            sets: ['Gantt', 'Maps', 'Stock'],
            value: 1,
            name: 'Core'
        }, {
            sets: ['Stock', 'Core'],
            value: 1,
            name: 'DateTime Series and Axis'
        }, {
            sets: ['Gantt', 'Core'],
            value: 1,
            name: 'X-range Series and DateTime Axis'
        }, {
            sets: ['Maps', 'Core'],
            value: 1,
            name: 'Heatmap and ColorAxis'
        }, {
            sets: ['Stock', 'Gantt'],
            value: 0.25,
            name: 'Navigator & RangeSelector'
        }, {
            sets: ['Dashboards', 'Core'],
            value: 1,
            name: 'Data Layer'
        }, {
            sets: ['Dashboards', 'DataGrid'],
            value: 0.5,
            name: 'DataGrid'
        }, {
            sets: ['Dashboards', 'KPI'],
            value: 0.5,
            name: 'KPI'
        }, {
            sets: ['DataGrid'],
            value: 0.5,
            name: ''
        }, {
            sets: ['KPI'],
            value: 0.2,
            name: 'KPI'
        }, {
            sets: ['Custom'],
            value: 2,
            name: 'Custom component'
        }, {
            sets: ['Custom', 'Dashboards'],
            value: 0.3,
            name: 'Sync API'
        }],
        dataLabels: {
            style: {
                textOutline: 'none'
            }
        }
    }],
    title: {
        text: 'Highsoft products relationships'
    },
    subtitle: {
        text: 'Highcharts Core, Stock, Maps, Gantt, and Dashboards'
    },
    accessibility: {
        point: {
            valueDescriptionFormat: '' +
                '{#if (eq 1 point.sets.length)}' +
                    'Product: Highcharts {point.sets.0}' +
                '{else}' +
                    'Products: ' +
                    '{#each point.sets}' +
                        'Highcharts {this}{#unless @last} and {/unless}' +
                    '{/each}' +
                    ', Shared components: ' +
                    '{point.name}' +
                '{/if}'
        },
        series: {
            describeSingleSeries: true,
            descriptionFormat: 'Venn diagram with ' +
                '{series.points.length} relations.'
        }
    }
});
