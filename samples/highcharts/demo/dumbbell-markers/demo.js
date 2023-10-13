// Define custom SVG symbols for left and right triangles
Highcharts.SVGRenderer.prototype.symbols.triangleLeft = (x, y, w, h) =>
    ['M', x, y + h / 2, 'L', x + w, y, 'L', x + w, y + h, 'Z'];

Highcharts.SVGRenderer.prototype.symbols.triangleRight = (x, y, w, h) =>
    ['M', x + w, y + h / 2, 'L', x, y, 'L', x, y + h, 'Z'];

// Process and transform the data for the chart
const data = [{
    name: 'wall-breakers',
    previous: 47,
    current: 128
}, {
    name: 'electro-giant',
    previous: 99,
    current: 88
}, {
    name: 'mortar',
    previous: 66,
    current: 79
}, {
    name: 'hog-rider',
    previous: 84,
    current: 78
}, {
    name: 'royal-giant',
    previous: 104,
    current: 73
}, {
    name: 'graveyars',
    previous: 101,
    current: 70
}, {
    name: 'test',
    previous: 51,
    current: 50
}, {
    name: 'giant',
    previous: 41,
    current: 49
}, {
    name: 'royal-hogs',
    previous: 39,
    current: 48
}, {
    name: 'balloon',
    previous: 62,
    current: 47
}, {
    name: 'lava-hound',
    previous: 54,
    current: 42
}, {
    name: 'goblin-drill',
    previous: 19,
    current: 41
}, {
    name: 'golem',
    previous: 49,
    current: 40
}, {
    name: 'x-bow',
    previous: 55,
    current: 36
}, {
    name: 'miner',
    previous: 9,
    current: 31
}, {
    name: 'battle-ram',
    previous: 48,
    current: 30
}, {
    name: 'goblin-giant',
    previous: 10,
    current: 30
}, {
    name: 'three-musketeers',
    previous: 18,
    current: 28
}, {
    name: 'goblin-barrel',
    previous: 57,
    current: 21
}, {
    name: 'ram-rider',
    previous: 23,
    current: 20
}, {
    name: 'elixir-golem',
    previous: 4,
    current: 7
}, {
    name: 'skeleton-barrel',
    previous: 4,
    current: 3
}].map(dataPoint => {
    const isIncrease = dataPoint.previous < dataPoint.current;
    return {
        ...dataPoint,
        low: isIncrease ? dataPoint.previous : dataPoint.current,
        high: isIncrease ? dataPoint.current : dataPoint.previous
    };
});

// Separate the data into increasing and decreasing series
const increasingData = [],
    decreasingData = [];
data.forEach((dataPoint, index) => {
    const isIncrease = dataPoint.previous < dataPoint.current,
        transformedDataPoint = {
            ...dataPoint,
            x: index
        };

    if (isIncrease) {
        increasingData.push(transformedDataPoint);
    } else {
        decreasingData.push(transformedDataPoint);
    }
});

// Create the chart
Highcharts.chart('container', {
    chart: {
        type: 'dumbbell',
        inverted: true
    },
    title: {
        text: 'Change in Card Usage'
    },

    subtitle: {
        text: 'Season 21 vs Season 22 <br>Top 1000'
    },

    tooltip: {
        pointFormat: 'Season 21: used in deck by ' +
            '<strong>{point.previous}</strong> of 1000 top players<br>' +
            'Season 22: used in deck by <strong>{point.current}</strong> ' +
            'of 1000 top players',
        shared: true
    },

    xAxis: {
        type: 'category',
        opposite: true
    },

    yAxis: {
        title: ''
    },

    legend: {
        enabled: false
    },

    plotOptions: {
        series: {
            connectorWidth: 3,
            marker: {
                radius: 5,
                states: {
                    hover: {
                        lineWidth: 0
                    }
                }
            },
            dataLabels: {
                enabled: true,
                color: 'contrast',
                crop: false,
                overflow: 'allow'
            }
        }
    },

    series: [{
        name: 'Increase',
        data: increasingData,
        color: Highcharts.getOptions().colors[2],
        marker: {
            enabled: true,
            symbol: 'triangleRight'
        },
        lowMarker: {
            enabled: false
        }
    },
    {
        name: 'Decrease',
        data: decreasingData,
        color: Highcharts.getOptions().colors[5],
        marker: {
            enabled: false
        },
        lowColor: undefined,
        lowMarker: {
            enabled: true,
            symbol: 'triangleLeft'
        }
    }]
});
