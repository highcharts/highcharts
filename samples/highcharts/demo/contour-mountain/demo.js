const data = (() => {
    const rawData = JSON.parse(document.getElementById('data').textContent);

    const latMin = 49.05829266067379;
    const latMax = 49.12906842129129;
    const lonMin = 22.76165556276483;
    const lonMax = 22.82816857111412;

    const res = [];
    for (let i = 0; i < 100; ++i) {
        for (let j = 0; j < 100; ++j) {
            const lat = latMin + (latMax - latMin) * i / 100;
            const lon = lonMin + (lonMax - lonMin) * j / 100;
            res.push([lon, lat, rawData[i * 100 + j]]);
        }
    }
    return res;
})();

const chart = Highcharts.chart('container', {
    chart: {
        zooming: {
            type: 'xy'
        }
    },
    title: {
        text: 'Mountain elevation'
    },
    xAxis: {
        tickInterval: 0.01,
        gridLineWidth: 1,
        title: {
            text: 'longitude'
        },
        gridLineColor: '#fff4',
        gridZIndex: 4,
        minPadding: 0,
        maxPadding: 0,
        endOnTick: false,
        startOnTick: false,
        tickWidth: 1,
        lineWidth: 1
    },
    yAxis: {
        tickInterval: 0.01,
        gridLineWidth: 1,
        title: {
            text: 'latitude'
        },
        gridLineColor: '#fff4',
        gridZIndex: 4,
        minPadding: 0,
        maxPadding: 0,
        endOnTick: false,
        startOnTick: false,
        tickWidth: 1,
        lineWidth: 1
    },
    colorAxis: {
        stops: [
            [0, '#3060cf'],
            [0.5, '#fffbbc'],
            [0.9, '#c4463a']
        ]
    },
    tooltip: {
        pointFormat: `
            lat: <strong>{point.x:.2f}</strong>,<br/>
            lon: <strong>{point.y:.2f}</strong>,<br/>
            elevation: <strong>{point.value} m</strong>
        `
    },
    series: [{
        contourInterval: 50,
        clip: true,
        type: 'contour',
        name: 'Elevation',
        data,
        marker: {
            states: {
                hover: {
                    lineColor: 'white',
                    lineWidth: 2
                }
            }
        },
        states: {
            hover: {
                opacity: 1
            }
        }
    }, {
        type: 'scatter',
        name: 'Peaks',
        keys: ['x', 'y', 'value', 'name'],
        colorAxis: false,
        showInLegend: false,
        data: [
            [22.7688, 49.072, 1333, 'Halicz'],
            [22.7702, 49.062, 1280, 'Rozsypaniec']
        ],
        dataLabels: {
            enabled: true,
            format: '{point.name}'
        },
        marker: {
            symbol: 'triangle',
            fillColor: '#000'
        }
    }]
});

const contourIntervalRange = document.getElementById('contour-interval');
const contourOffsetRange = document.getElementById('contour-offset');
const showLinesCbx = document.getElementById('show-lines');
const smoothColoringCbx = document.getElementById('smooth-coloring');
const contourIntervalSpan = document.getElementById('contour-interval-span');
const contourOffsetSpan = document.getElementById('contour-offset-span');

contourIntervalRange.addEventListener('input', () => {
    chart.series[0].update({
        contourInterval: parseInt(contourIntervalRange.value, 10)
    });
    contourIntervalSpan.textContent = contourIntervalRange.value;
});

contourOffsetRange.addEventListener('input', () => {
    chart.series[0].update({
        contourOffset: parseInt(contourOffsetRange.value, 10)
    });
    contourOffsetSpan.textContent = contourOffsetRange.value;
});

showLinesCbx.addEventListener('click', () => {
    chart.series[0].update({
        showContourLines: showLinesCbx.checked
    });
});

smoothColoringCbx.addEventListener('click', () => {
    chart.series[0].update({
        smoothColoring: smoothColoringCbx.checked
    });
});
