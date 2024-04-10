/* eslint-disable default-case */
const dirDist50 = 'rgba(20, 20, 20, .4)',
    dirDist10 = 'rgba(120, 120, 120, .4)',
    dirDistLess10 = 'rgba(200, 200, 200, .4)';

Highcharts.chart('container', {

    chart: {
        type: 'networkgraph',
        marginTop: 80
    // backgroundColor:"#F8F8F8"
    },

    title: {
        text: 'South Korea domestic flight routes'
    },
    tooltip: {
        formatter: function () {
            let info = '';
            switch (this.color) {
            case dirDist50:
                console.log(dirDist50);
                info = 'is an aiport <b>more than 50</b> direct distinations';
                break;
            case dirDist10:
                console.log(dirDist10);
                info = 'is an aiport <b>more than 10</b> direct distinations';
                break;
            case dirDistLess10:
                console.log(dirDistLess10);
                info = 'is an aiport <b>less than 10</b> direct distinations';
                break;
            }
            return '<b>' + this.key + '</b>: ' + info;
        }
    },
    plotOptions: {
        networkgraph: {
            keys: ['from', 'to'],
            layoutAlgorithm: {
                enableSimulation: true,
                integration: 'verlet',
                linkLength: 100
            }
        }
    },

    series: [{
        marker: {
            radius: 13
        },
        dataLabels: {
            enabled: true,
            linkFormat: '',
            allowOverlap: true,
            style: {
                color: 'black',
                textOutline: false
            }
        },
        data: [
            ['Seoul Metro', 'Daegu'],
            ['Seoul Metro', 'Busan'],
            ['Busan', 'Seoul'],
            ['Busan', 'Yangyang'],


            ['Daegu', 'Seoul'],
            ['Daegu', 'Jeju'],

            ['Seoul', 'Gwangju'],
            ['Seoul', 'Yeosu'],
            ['Seoul', 'Sacheon'],
            ['Seoul', 'Ulsan'],
            ['Seoul', 'Pohang'],

            ['Jeju', 'Gwangju'],
            ['Jeju', 'Gunsan'],
            ['Jeju', 'Wonju'],
            ['Jeju', 'Yangyang'],
            ['Jeju', 'Daegu'],
            ['Jeju', 'Yeosu'],
            ['Jeju', 'Sacheon'],
            ['Jeju', 'Ulsan'],
            ['Jeju', 'Busan'],
            ['Jeju', 'Cheongju']
        ],
        nodes: [{
            id: 'Seoul Metro',
            marker: {
                radius: 30
            },
            color: dirDist50
        }, {
            id: 'Daegu',
            marker: {
                radius: 10
            },
            color: dirDistLess10
        }, {
            id: 'Busan',
            marker: { radius: 30 },
            color: dirDist50
        }, {
            id: 'Seoul',
            marker: {
                radius: 20
            },
            color: dirDist10
        },
        {
            id: 'Jeju',
            marker: {
                radius: 30
            },
            color: dirDist50
        }, {
            id: 'Gwangju',
            marker: {
                radius: 10
            },
            color: dirDistLess10
        }, {
            id: 'Yeosu',
            marker: {
                radius: 10
            },
            color: dirDistLess10
        }, {
            id: 'Sacheon',
            marker: {
                radius: 10
            },
            color: dirDistLess10
        }, {
            id: 'Ulsan',
            marker: {
                radius: 10
            },
            color: dirDistLess10
        }, {
            id: 'Pohang',
            marker: {
                radius: 20
            },
            color: dirDist10
        }, {
            id: 'Gunsan',
            marker: {
                radius: 10
            },
            color: dirDistLess10
        }, {
            id: 'Wonju',
            marker: {
                radius: 10
            },
            color: dirDistLess10
        }, {
            id: 'Yangyang',
            marker: {
                radius: 10
            },
            color: dirDistLess10
        }, {
            id: 'Cheongju',
            marker: {
                radius: 20
            },
            color: dirDist10
        }]
    }]
});
