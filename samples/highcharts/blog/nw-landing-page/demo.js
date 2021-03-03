Math.easeInQuint =  function (pos) {
    return Math.pow(pos, 5);
};

const dirDist50 = '#E8544E',
    dirDist10 = '#FFD265',
    dirDistLess10 = '#2AA775';

/*DONUT CHART*/
const gases = ['Carbon Dioxide', 'Nitrogen', 'Oxygen', 'Argon', 'Methane',
    'Sodium', 'Hydrogen', 'Helium', 'Other'];

const planets = [
    'Sun',
    'Mercury',
    'Venus',
    'Earth',
    'Moon',
    'Mars',
    'Jupiter',
    'Saturn',
    'Titan',
    'Uranus',
    'Neptune',
    'Pluto'
];

const atmosphereData = [
    [0, 0, 0, 0, 0, 0, 71, 26, 3],
    [0, 0, 42, 0, 0, 22, 22, 6, 8],
    [96, 4, 0, 0, 0, 0, 0, 0, 0],
    [0, 78, 21, 1, 0, 0, 0, 0, 1],
    [0, 0, 0, 70, 0, 1, 0, 29, 0],
    [95, 2.7, 0, 1.6, 0, 0, 0, 0, 0.7],
    [0, 0, 0, 0, 0, 0, 89.8, 10.2, 0],
    [0, 0, 0, 0, 0, 0, 96.3, 3.2, 0.5],
    [0, 97, 0, 0, 2, 0, 0, 0, 1],
    [0, 0, 0, 0, 2.3, 0, 82.5, 15.2, 0],
    [0, 0, 0, 0, 1.0, 0, 80, 19, 0],
    [8, 90, 0, 0, 2, 0, 0, 0, 0]
];

let planetAtmosphere = [];

function buildData(atmosphere) {
    planetAtmosphere = [];
    let count = 0;
    const planetIndex = planets.findIndex(function (planet) {
        return planet === atmosphere;
    });
    const tempAtmosphere = atmosphereData[planetIndex];
    tempAtmosphere.forEach(function (item, index) {
        planetAtmosphere.push([gases[index], item]);
        count = count + 1;
    });
    return planetAtmosphere;
}
buildData('Mars');

Highcharts.setOptions({
    colors: [
        Highcharts.getOptions().colors[4],
        Highcharts.getOptions().colors[2],
        Highcharts.getOptions().colors[0],
        Highcharts.getOptions().colors[7],
        Highcharts.getOptions().colors[3],
        Highcharts.getOptions().colors[8],
        Highcharts.getOptions().colors[6],
        Highcharts.getOptions().colors[9],
        Highcharts.getOptions().colors[1]
    ]
});

Highcharts.chart('donut', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        backgroundColor: 'transparent',
        margin: 0,
        spacing: 0
    },
    title: {
        text: '',
        y: 225
    },
    legend: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    tooltip: {
        enabled: false
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
    },
    series: [{
        name: 'Composition',
        keys: ['name', 'y'],
        colorByPoint: true,
        innerSize: '70%',
        data: planetAtmosphere
    }]
},
function () {
    const chart = this,
        series = chart.series[0];
    let newData = [];
    let count = 0;
    setInterval(function () {
        const pname = planets[count];
        newData = buildData(pname);
        series.update({
            data: newData
        });
        count = count + 1;
        if (count === planets.length - 1) {
            count = 0;
        }
    }, 3000);
}
);

/*LINE GRAPH*/
Highcharts.chart('graph', {
    chart: {
        margin: 0,
        animation: {
            duration: 1000,
            easing: 'easeInQuint'
        },
        events: {
            load: function () {
                const chart = this;
                let reversed = false;
                setInterval(function () {
                    if (reversed === false) {
                        reversed = true;
                    } else {
                        reversed = false;
                    }
                    chart.yAxis[0].update({
                        reversed: reversed
                    });
                }, 5000);
            }
        }
    },
    title: {
        text: ''
    },
    exporting: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    xAxis: {
        gridLineWidth: 1,
        min: -5,
        max: 5,
        tickInterval: 1,
        lineColor: 'transparent',
        offset: -150
    },
    yAxis: {
        min: -5,
        max: 5,
        tickInterval: 1,
        lineWidth: 1,
        lineColor: 'transparent',
        offset: -150,
        title: {
            text: null
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        enabled: false
    },
    series: [{
        label: {
            enabled: false
        },
        data: [
            [-3, 3],
            [-2, 2],
            [-1, 1],
            [0, 0],
            [1, 1],
            [2, 2],
            [3, 3]
        ]
    }]
});

/*NETWOR GRAPH*/
Highcharts.chart('network', {
    chart: {
        type: 'networkgraph',
        marginTop: 0,
        animation: {
            duration: 1000,
            easing: 'easeInQuint'
        },
        events: {
            load: function () {
                const chart = this;
                let mass = 10;
                setInterval(function () {
                    if (mass === 10) {
                        mass = 1000;
                    } else {
                        mass = 10;
                    }
                    chart.series[0].nodes[0].update({
                        mass: mass
                    });
                }, 5000);
            }
        }
    },
    exporting: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    title: {
        text: ''
    },
    tooltip: {
        enabled: false,
        formatter: function () {
            var info = '';
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
            default:
             //
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
                linkLength: 20
            }
        }
    },
    series: [{
        marker: {
            radius: 13
        },
        dataLabels: {
            enabled: false,
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
                    radius: 10
                },
                color: dirDist50
            }, {
                id: 'Daegu',
                marker: {
                    radius: 2
                },
                color: dirDistLess10
            }, {
                id: 'Busan',
                marker: { radius: 10 },
                color: dirDist50
            }, {
                id: 'Seoul GMP',
                marker: {
                    radius: 5
                },
                color: dirDist10
            },
            {
                id: 'Jeju',
                marker: {
                    radius: 10
                },
                color: dirDist50
            }, {
                id: 'Gwangju',
                marker: {
                    radius: 2
                },
                color: dirDistLess10
            }, {
                id: 'Yeosu',
                marker: {
                    radius: 2
                },
                color: dirDistLess10
            }, {
                id: 'Sacheon',
                marker: {
                    radius: 2
                },
                color: dirDistLess10
            }, {
                id: 'Ulsan',
                marker: {
                    radius: 2
                },
                color: dirDistLess10
            }, {
                id: 'Pohang',
                marker: {
                    radius: 5
                },
                color: dirDist10
            }, {
                id: 'Gunsan',
                marker: {
                    radius: 2
                },
                color: dirDistLess10
            }, {
                id: 'Wonju',
                marker: {
                    radius: 2
                },
                color: dirDistLess10
            }, {
                id: 'Yangyang',
                marker: {
                    radius: 2
                },
                color: dirDistLess10
            }, {
                id: 'Cheongju',
                marker: {
                    radius: 5
                },
                color: dirDist10
            }]
    }]
});

/*DENSITY SCATTER*/

/*
Density function
Author: Mustapha Mekhatria
*/
function scatter() {
    //new scatter chart here
}
scatter();

/*SMALL PACKED BUBBLE*/
Highcharts.chart('soloBubble', {
    chart: {
        type: 'packedbubble',
        height: 120,
        margin: 0,
        animation: {
            duration: 1000,
            easing: 'easeInQuint'
        },
        events: {
            load: function () {
                const chart = this;
                let mass = 2;
                let value = 10;
                setInterval(function () {
                    if (value === 10) {
                        value = 150;
                        mass = 100;
                    } else {
                        value = 10;
                        mass = 2;
                    }
                    chart.series[0].points[0].update({
                        value: value,
                        mass: mass
                    });
                }, 6000);
            }
        }
    },
    title: {
        text: ''
    },
    subTitle: {
        text: ''
    },
    credits: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    tooltip: {
        useHTML: true,
        enabled: false,
        pointFormat: '<b>{point.name}:</b> {point.y}</sub>'
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        packedbubble: {
            dataLabels: {
                enabled: false,
                format: '{point.name}',
                style: {
                    color: 'black',
                    textOutline: 'none',
                    fontWeight: 'normal'
                }
            },
            minPointSize: 5
        }
    },
    series: [{
        name: 'Coffee',
        data:
    [
        {
            value: 8,
            name: 'Bert'
        }, {
            value: 2,
            name: 'Sam'
        }, {
            value: 8,
            name: 'John'
        }, {
            value: 5,
            name: 'Dick'
        }
    ]
    }, {
        name: 'Energy drinks',
        data: [{
            value: 8,
            name: 'Ma'
        }]
    }, {
        name: 'Tea',
        data: [2, 4, 5, {
            value: 8,
            name: 'Mustapha',
            color: 'pink'
        }]
    }]
});

/*ITEM CHART*/
Highcharts.chart('item', {
    chart: {
        type: 'item',
        margin: [0, 30, 0, 0],
        animation: {
            duration: 1000,
            easing: 'easeInQuint'
        },
        events: {
            load: function () {
                const chart = this;
                let innerSize = 0;
                setInterval(function () {
                    if (innerSize < 60) {
                        innerSize = innerSize + 10;
                        chart.update({
                            plotOptions: {
                                item: {
                                    innerSize: innerSize + '%'
                                }
                            }

                        });
                    } else {
                        innerSize = 0;
                    }
                }, 2000);
            }
        }
    },
    title: {
        text: ''
    },
    tooltip: {
        enabled: false
    },
    legend: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    plotOptions: {
        item: {
            center: ['30%', '5%'],
            innerSize: '0%',
            size: '50%',
            startAngle: -100,
            endAngle: -100
        }
    },
    series: [{
        name: 'Representatives',
        keys: ['name', 'y', 'color', 'label'],
        data: [
            {
                name: 'The Left',
                y: 20,
                label: 'DIE LINKE',
                color: 'rgba(127,133,233,.1)',
                borderColor: '#8bafb2',
                lineWidth: 1,
                marker: {
                    radius: 30,
                    lineWidth: 1
                }
            }
        ],
        dataLabels: {
            enabled: false
        }
    }]
});
