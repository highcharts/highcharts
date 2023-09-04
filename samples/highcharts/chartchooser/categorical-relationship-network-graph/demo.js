/* eslint-disable default-case */
const dirDist50 = '#E8544E',
    dirDist10 = '#FFD265',
    dirDistLess10 = '#2AA775';

Highcharts.chart('container', {
    chart: {
        type: 'networkgraph',
        marginTop: 80
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

    series: [
        {
            marker: {
                radius: 13
            },
            dataLabels: {
                enabled: true,
                linkFormat: '',
                allowOverlap: true,
                style: {
                    textOutline: false
                }
            },
            data: [
                ['Seoul ICN', 'Daegu'],
                ['Seoul ICN', 'Busan'],
                ['Busan', 'Seoul GMP'],
                ['Busan', 'Yangyang'],

                ['Daegu', 'Seoul GMP'],
                ['Daegu', 'Jeju'],

                ['Seoul GMP', 'Gwangju'],
                ['Seoul GMP', 'Yeosu'],
                ['Seoul GMP', 'Sacheon'],
                ['Seoul GMP', 'Ulsan'],
                ['Seoul GMP', 'Pohang'],

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
            nodes: [
                {
                    id: 'Seoul ICN',
                    marker: {
                        radius: 30
                    },
                    color: dirDist50
                },
                {
                    id: 'Daegu',
                    marker: {
                        radius: 10
                    },
                    color: dirDistLess10
                },
                {
                    id: 'Busan',
                    marker: {
                        radius: 30
                    },
                    color: dirDist50
                },
                {
                    id: 'Seoul GMP',
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
                },
                {
                    id: 'Gwangju',
                    marker: {
                        radius: 10
                    },
                    color: dirDistLess10
                },
                {
                    id: 'Yeosu',
                    marker: {
                        radius: 10
                    },
                    color: dirDistLess10
                },
                {
                    id: 'Sacheon',
                    marker: {
                        radius: 10
                    },
                    color: dirDistLess10
                },
                {
                    id: 'Ulsan',
                    marker: {
                        radius: 10
                    },
                    color: dirDistLess10
                },
                {
                    id: 'Pohang',
                    marker: {
                        radius: 20
                    },
                    color: dirDist10
                },
                {
                    id: 'Gunsan',
                    marker: {
                        radius: 10
                    },
                    color: dirDistLess10
                },
                {
                    id: 'Wonju',
                    marker: {
                        radius: 10
                    },
                    color: dirDistLess10
                },
                {
                    id: 'Yangyang',
                    marker: {
                        radius: 10
                    },
                    color: dirDistLess10
                },
                {
                    id: 'Cheongju',
                    marker: {
                        radius: 20
                    },
                    color: dirDist10
                }
            ]
        }
    ]
});
