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
        minorTicksPerMajor: 3,
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
        data: [7],
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

// Adding a title to the SVG
document.getElementById('container').setAttribute('aria-hidden', 'false');
svg.querySelector('desc').remove();
svg.setAttribute('aria-label', '7 cups per day. Coffee consumption. Gauge chart.');

// Creating button
const detailsButton = document.createElement('button');
detailsButton.className = 'visually-hidden';
detailsButton.setAttribute('aria-label', 'Gauge details');
detailsButton.setAttribute('aria-expanded', 'false');
svg.insertAdjacentElement('afterend', detailsButton);

let detailsDiv;

// Adding logic to clicking button
detailsButton.addEventListener('click', function () {
    const isExpanded = detailsButton.getAttribute('aria-expanded') === 'true';
    detailsButton.setAttribute('aria-expanded', !isExpanded);

    if (!detailsDiv) {
        detailsDiv = document.createElement('div');
        const detailsText = document.createElement('p');

        detailsText.className = 'visually-hidden';
        detailsText.innerText = 'The gauge is divided into three color-coded areas, green (0-4 cups), yellow (4-8 cups) and red (8-12 cups) coffee consumption. The current value is 7 cups per day.';

        detailsDiv.appendChild(detailsText);
        detailsButton.insertAdjacentElement('afterend', detailsDiv);
    }

    if (isExpanded) {
        detailsDiv.remove();
        detailsDiv = null;
    }
});