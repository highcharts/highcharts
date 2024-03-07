Highcharts.chart('container', {
    accessibility: {
        enabled: false
    },
    chart: {
        type: 'gauge',
        height: '80%',
        marginTop: 20
    },
    title: {
        text: 'Coffee Consumption'
    },

    pane: {
        startAngle: -90,
        endAngle: 89.9,
        background: null,
        center: ['50%', '75%'],
        size: '110%'
    },

    yAxis: {
        min: 0,
        max: 12,
        tickInterval: 4,
        tickColor: '#000000',
        tickLength: 20,
        tickWidth: 2,
        minorTicks: true,
        minorTickWidth: 2,
        minorTicksPerMajor: 4,
        minorTickColor: '#000000',
        labels: {
            distance: 20,
            style: {
                fontSize: '16px'
            }
        },
        lineColor: '#000000',
        lineWidth: 2,
        plotBands: [{
            from: 0,
            to: 4,
            color: '#2A9D8F', // teal
            thickness: 20
        }, {
            from: 4,
            to: 8,
            color: '#F9C74F', // yellow
            thickness: 20
        }, {
            from: 8,
            to: 12,
            color: '#FF5733', // red
            thickness: 20
        }]
    },

    series: [{
        name: 'Coffee',
        data: [0],
        tooltip: {
            pointFormat: '{series.name}: <b>{point.y} cups/day</b>'
        },
        dataLabels: {
            format: '{y} cups/day',
            borderWidth: 0,
            color: '#000000',
            style: {
                fontSize: '16px'
            }
        },
        dial: {
            radius: '80%',
            backgroundColor: '#000000',
            baseWidth: 12,
            baseLength: '0%',
            rearLength: '0%'
        },
        pivot: {
            backgroundColor: '#000000',
            radius: 6
        }

    }]
});

const svg = document.getElementsByClassName('highcharts-root')[0];
const container = document.getElementById('container');

// Adding a title to the SVG
document.getElementById('container').setAttribute('aria-hidden', 'false');
svg.querySelector('desc').remove();
svg.setAttribute('aria-label', '0 cups per day. Coffee consumption. Gauge chart.');

// Creating button and div for details
const detailsButton = document.createElement('button');
const announcerDiv = document.createElement('div');
announcerDiv.className = 'visually-hidden';
detailsButton.className = 'visually-hidden';
detailsButton.setAttribute('aria-label', 'Gauge details');
detailsButton.setAttribute('aria-expanded', 'false');
announcerDiv.setAttribute('aria-live', 'assertive');
container.insertAdjacentElement('afterend', detailsButton);
detailsButton.insertAdjacentElement('afterend', announcerDiv);


let detailsDiv;

// Adding logic to clicking  button
detailsButton.addEventListener('click', function () {
    const isExpanded = detailsButton.getAttribute('aria-expanded') === 'true';
    detailsButton.setAttribute('aria-expanded', !isExpanded);

    if (!detailsDiv) {
        detailsDiv = document.createElement('div');
        const detailsText = document.createElement('p');

        detailsText.className = 'visually-hidden';
        detailsText.innerText = 'A gauge chart shows a single value on an axis. The gauge is divided into three color-coded areas, green (0-4 cups), yellow (4-8 cups) and red (8-12 cups) coffee consumption. The current value is 0 cups per day.';

        detailsDiv.appendChild(detailsText);
        detailsButton.insertAdjacentElement('afterend', detailsDiv);
    }

    if (isExpanded) {
        detailsDiv.remove();
        detailsDiv = null;
    }
});

let lastInterval = null;
let updateInterval = null;
let updatesRunning = false;
let currentValue = 0;

const toggleButton = document.getElementById('toggle');

toggleButton.addEventListener('click', function () {
    if (updatesRunning) {
        clearInterval(updateInterval);
        updatesRunning = false;
        toggleButton.setAttribute('aria-pressed', 'false');
    } else {
        updateInterval = setInterval(updateFunction, 3000);
        updatesRunning = true;
        toggleButton.setAttribute('aria-pressed', 'true');
    }
});

function updateFunction() {
    const chart = Highcharts.charts[0];
    if (chart && !chart.renderer.forExport) {
        const point = chart.series[0].points[0];

        currentValue = (currentValue + 1) % 13;

        point.update(currentValue);

        let announcement;
        let currentInterval;
        if (currentValue <= 4) {
            announcement = 'Green zone, ' + currentValue + ' cups.';
            currentInterval = 'green';
        } else if (currentValue <= 8) {
            announcement = 'Yellow zone, ' + currentValue + ' cups.';
            currentInterval = 'yellow';
        } else {
            announcement = 'Red zone, ' + currentValue + ' cups.';
            currentInterval = 'red';
        }

        if (currentInterval === lastInterval) {
            announcement = '';
        }
        announcerDiv.innerText = announcement;
        lastInterval = currentInterval;

        svg.setAttribute('aria-label', currentValue + ' cups per day. Coffee consumption. Gauge chart.');
    }
}