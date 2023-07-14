// Start at this time
let currentTime = Date.UTC(2022, 6, 3, 20);

// Get the data class of a lightning strike based on the time ago
const getDataClass = (now, datetime) => {
    if (now - datetime > 20 * 60000) {
        return 3;
    }
    if (now - datetime > 10 * 60000) {
        return 2;
    }
    if (now - datetime > 60000) {
        return 1;
    }
    return 0;
};

// Parse the data which comes in the ualf format, a subset of CSV
const parseData = () => {
    const ualf = document.getElementById('data').innerText,
        lines = ualf.split('\n');

    const data = lines
        .map(line => {
            const values = line.split(' ');

            const p = {
                lon: parseFloat(values[9]),
                lat: parseFloat(values[8]),
                datetime: Date.UTC(
                    values[1],
                    parseInt(values[2], 10) - 1,
                    values[3],
                    values[4],
                    values[5],
                    values[6]
                ),
                peakCurrent: parseFloat(values[10]),
                cloudIndicator: Boolean(+values[21]),
                z: Math.round(parseFloat(values[10])),
                colorValue: 0
            };

            return p.cloudIndicator ? undefined : p;
        })
        .filter(p => p !== undefined)
        .sort((a, b) => a.datetime - b.datetime);

    return data;
};

const ualf = parseData();

// Get the data for the initial time
const getInitialData = time => ualf.slice(
    ualf.findIndex(p => p.datetime > time - 30 * 60000),
    ualf.findLastIndex(p => p.datetime <= time)
).map(p => {
    p.colorValue = getDataClass(time, p.datetime);
    return p;
});

const displayTime = time => {
    document.getElementById('report-time').innerText = Highcharts.dateFormat(
        '%B %e, %Y %H:%M',
        time
    );
};

(async () => {

    // Load the map
    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/europe.topo.json'
    ).then(response => response.json());

    // Create the chart
    const chart = Highcharts.mapChart('container', {
        chart: {
            map: topology,
            height: '80%',
            margin: 0,
            backgroundColor: '#222',
            animation: false
        },

        accessibility: {
            enabled: false
        },

        title: {
            text: 'Lightning strikes',
            align: 'left',
            style: {
                color: 'rgba(255,255,196,1)'
            }
        },

        subtitle: {
            text: 'Source: <a href="https://frost.met.no/api.html#!/lightning/getLightning" style="color: inherit">frost.met.no</a>',
            align: 'left',
            style: {
                color: '#aaa'
            }
        },

        legend: {
            align: 'right',
            verticalAlign: 'top',
            layout: 'vertical',
            itemStyle: {
                color: '#ddd'
            }
        },

        mapView: {
            center: [12, 56.8],
            zoom: 7,
            projection: {
                rotation: [-15]
            }
        },

        colorAxis: {
            dataClasses: [{
                from: 0,
                to: 0,
                color: 'rgba(255,255,196,1)',
                name: '< 1 min'
            }, {
                from: 1,
                to: 1,
                color: 'rgba(255,196,0,1)',
                name: '1 - 10 min'
            }, {
                from: 2,
                to: 2,
                color: 'rgba(196,128,0,1)',
                name: '10 - 20 min'
            }, {
                from: 3,
                to: 3,
                color: 'rgba(196,64,0,1)',
                name: '20 - 30 min'
            }]
        },

        series: [{
            name: 'Map',
            nullColor: '#444',
            borderColor: '#666',
            dataLabels: {
                enabled: true,
                nullFormat: '{point.name}',
                style: {
                    color: '#888',
                    textOutline: 'none',
                    fontSize: '16px',
                    fontWeight: 'normal'
                }
            }
        }, {
            name: 'Lightning strike',
            id: 'lightnings',
            type: 'mapbubble',
            turboThreshold: Infinity,
            animation: false,
            data: getInitialData(currentTime),
            tooltip: {
                pointFormat: '{point.datetime:%Y-%m-%d %H:%M:%S}'
            },
            minSize: 4,
            maxSize: 8,
            marker: {
                lineWidth: 0,
                radius: 3
            },
            colorKey: 'colorValue'
        }]
    });
    displayTime(currentTime);

    // Update the colors of the data points
    const updateColors = time => {
        let redraw = false;
        // Modify older points
        chart.get('lightnings').points.forEach(p => {
            let colorValue;
            if (time - p.options.datetime > 30 * 60000) {
                p.remove();
            } else  {
                colorValue = getDataClass(time, p.options.datetime);
            }

            if (colorValue && colorValue !== p.options.colorValue) {
                p.update({ colorValue }, false);
                redraw = true;
            }
        });
        return redraw;
    };

    // For the strongest lightning strikes, light up the chart with a temporary
    // flash
    const flash = point => {
        const pos = chart.mapView.lonLatToPixels(point);

        chart.renderer.circle(pos.x, pos.y, point.z * 2)
            .attr({
                fill: {
                    radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
                    stops: [
                        [0, 'rgba(255, 255, 0, 0.25)'],
                        [0.1, 'rgba(255, 255, 0, 0.125)'],
                        [1, 'rgba(255, 255, 0, 0)']
                    ]
                },
                zIndex: 10
            })
            .add()
            .animate(
                { opacity: 0 },
                { duration: 250 },
                function () {
                    this.destroy();
                }
            );
    };

    if (updateColors(currentTime)) {
        chart.redraw();
    }

    // The remainder of the data after currentTime
    let data = ualf.slice(ualf.findIndex(p => p.datetime > currentTime));

    const endTime = data.at(-1).datetime,
        step = 10000,
        series = chart.get('lightnings');

    let timer;

    const pause = () => {
        clearTimeout(timer);
        document.getElementById('play-pause').textContent = '▶︎';
    };

    // Add the lightning strikes for the last n minutes
    const addPoints = time => {

        const rangeInput = document.getElementById('date-range');

        // Internal Highcharts CI sample verification
        if (!rangeInput) {
            return;
        }

        currentTime = time;
        let redraw = false;

        displayTime(time);
        rangeInput.value = time;

        if (updateColors(time)) {
            redraw = true;
        }

        // Add new points
        const points = [];
        while (data[0] && data[0].datetime <= time) {
            points.push(data.shift());
        }
        points.forEach(point => {

            redraw = true;

            series.addPoint(point, false);

            if (point.z > 10) {
                flash(point);
            }
        });

        if (redraw) {
            chart.redraw();
        }

        if (time + step <= endTime) {
            timer = setTimeout(() => addPoints(time + step), 25);
        } else {
            pause();
        }

    };

    const play = () => {
        document.getElementById('play-pause').textContent = '▮▮';
        data = ualf.slice(ualf.findIndex(p => p.datetime > currentTime));
        timer = setTimeout(() => addPoints(currentTime + step), 25);
    };

    const setUpInputs = () => {
        // Range input
        const input = document.getElementById('date-range');
        input.min = ualf[0].datetime;
        input.max = ualf.at(-1).datetime;
        input.value = currentTime;

        input.addEventListener('input', () => {
            pause();
            currentTime = Number(input.value);
            chart.series[1].setData(getInitialData(input.value));
            displayTime(currentTime);
        });

        // Play/pause
        document.getElementById('play-pause').addEventListener(
            'click',
            function () {
                if (this.textContent === '▶︎') {
                    play();
                } else {
                    pause();
                }
            }
        );
    };
    setUpInputs();
    // eslint-disable-next-line no-underscore-dangle
    if (!window.__karma__) { // CI tests
        // Wait a bit for Visual review tool
        setTimeout(() => play(), 100);
    }

})();
