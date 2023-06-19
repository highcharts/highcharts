const startYear = 1965,
    endYear = 2020,
    btn = document.getElementById('play-pause-button'),
    input = document.getElementById('play-range'),
    nbr = 6;

let dataset, chart;

function getData(year) {
    const output = Object.entries(dataset).map(country => {
        const [countryName, countryData] = country;
        return [countryName, Number(countryData[year])];
    });
    return [output[0], output.slice(1, nbr)];
}

function getSubtitle() {
    const totalNumber = getData(input.value)[0][1].toFixed(2);
    return `<span style="font-size: 80px">${input.value}</span>
        <br>
        <span style="font-size: 22px">
            Total: <b> ${totalNumber}</b> TWh
        </span>`;
}

(async () => {
    dataset = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@88f2067/samples/data/nuclear-energy-production.json'
    ).then(response => response.json());

    chart = Highcharts.chart('container', {
        title: {
            text: 'Nuclear energy production from 1965 to 2021 in US, UK, France, Germany, and Japan',
            align: 'center'
        },
        subtitle: {
            useHTML: true,
            text: getSubtitle(),
            floating: true,
            verticalAlign: 'middle',
            y: 30
        },

        legend: {
            enabled: false
        },

        tooltip: {
            valueDecimals: 2,
            valueSuffix: ' TWh'
        },

        plotOptions: {
            series: {
                borderWidth: 0,
                colorByPoint: true,
                type: 'pie',
                size: '100%',
                innerSize: '80%',
                dataLabels: {
                    enabled: true,
                    crop: false,
                    distance: '-10%',
                    style: {
                        fontWeight: 'bold',
                        fontSize: '16px'
                    },
                    connectorWidth: 0
                }
            }
        },
        colors: ['#FCE700', '#F8C4B4', '#f6e1ea', '#B8E8FC', '#BCE29E'],
        series: [
            {
                type: 'pie',
                name: startYear,
                data: getData(startYear)[1]
            }
        ]
    });
})();

/*
 * Pause the timeline, either when the range is ended, or when clicking the pause button.
 * Pausing stops the timer and resets the button to play mode.
 */
function pause(button) {
    button.title = 'play';
    button.className = 'fa fa-play';
    clearTimeout(chart.sequenceTimer);
    chart.sequenceTimer = undefined;
}

/*
 * Update the chart. This happens either on updating (moving) the range input,
 * or from a timer when the timeline is playing.
 */
function update(increment) {
    if (increment) {
        input.value = parseInt(input.value, 10) + increment;
    }
    if (input.value >= endYear) {
        // Auto-pause
        pause(btn);
    }

    chart.update(
        {
            subtitle: {
                text: getSubtitle()
            }
        },
        false,
        false,
        false
    );

    chart.series[0].update({
        name: input.value,
        data: getData(input.value)[1]
    });
}

/*
 * Play the timeline.
 */
function play(button) {
    button.title = 'pause';
    button.className = 'fa fa-pause';
    chart.sequenceTimer = setInterval(function () {
        update(1);
    }, 500);
}

btn.addEventListener('click', function () {
    if (chart.sequenceTimer) {
        pause(this);
    } else {
        play(this);
    }
});
/*
 * Trigger the update on the range bar click.
 */
input.addEventListener('input', function () {
    update();
});
