const btn = document.getElementById('play-pause-button'),
    input = document.getElementById('play-range'),
    startYear = 1973,
    endYear = 2021;

// General helper functions
const arrToAssociative = arr => {
    const tmp = {};
    arr.forEach(item => {
        if (item[1] !== null) {
            tmp[item[0]] = item[1];
        }
    });

    return tmp;
};

function getSubtitle() {
    return `<span style='font-size: 60px'>${input.value}</span>`;
}

const formatRevenue = [];

const chart = Highcharts.chart('container', {
    chart: {
        events: {
            // Some annotation labels need to be rotated to make room
            load: function () {
                const labels = this.annotations[0].labels;
                labels
                    .find(a => a.options.id === 'vinyl-label')
                    .graphic.attr({
                        rotation: -20
                    });
                labels
                    .find(a => a.options.id === 'cassettes-label')
                    .graphic.attr({
                        rotation: 20
                    });
            }
        },
        type: 'area',
        marginTop: 100,
        animation: {
            duration: 700,
            easing: function (t) {
                return t;
            }
        }
    },
    title: {
        text: 'Music revenue race chart'
    },
    subtitle: {
        useHTML: true,
        text: getSubtitle(),
        floating: true,
        align: 'right',
        verticalAlign: 'middle',
        x: -100,
        y: -110
    },
    data: {
        csv: document.getElementById('csv').innerHTML,
        itemDelimiter: '\t',
        complete: function (options) {
            for (let i = 0; i < options.series.length; i++) {
                formatRevenue[i] = arrToAssociative(options.series[i].data);
                options.series[i].data = null;
            }
        }
    },
    xAxis: {
        allowDecimals: false,
        min: startYear,
        max: endYear
    },
    yAxis: {
        reversedStacks: false,
        title: {
            text: 'Revenue in the U.S.'
        },
        labels: {
            format: '${text} B'
        }
    },
    tooltip: {
        pointFormat:
            '{series.name} had a revenue of <b>${point.y:,.1f} B</b><br/> in {point.x}'
    },
    plotOptions: {
        area: {
            stacking: 'normal',
            pointStart: startYear,
            pointEnd: endYear,
            marker: {
                enabled: false
            }
        }
    },

    annotations: [
        {
            labelOptions: {
                borderWidth: 0,
                backgroundColor: undefined,
                verticalAlign: 'middle',
                allowOverlap: true
            },
            labels: [
                {
                    text: 'Vnl',
                    backgroundColor: '#fff',
                    borderWidth: 2,
                    point: {
                        x: 1975,
                        xAxis: 0,
                        y: 1.6,
                        yAxis: 0
                    },
                    style: {
                        fontSize: '0.5em',
                        color: '#000'
                    },
                    id: 'vinyl-label'
                },
                {
                    text: 'LP-EP',
                    point: {
                        x: 1980,
                        xAxis: 0,
                        y: 0.2,
                        yAxis: 0
                    },
                    style: {
                        fontSize: '1.4em',
                        color: '#ffffff'
                    },
                    id: 'lpep-label'
                },
                {
                    text: 'Cass',
                    point: {
                        x: 1987,
                        xAxis: 0,
                        y: 2.6,
                        yAxis: 0
                    },
                    style: {
                        fontSize: '1.5em',
                        color: '#ffffff'
                    },
                    id: 'cassettes-label'
                },
                {
                    text: 'CD',
                    point: {
                        x: 1999,
                        xAxis: 0,
                        y: 6,
                        yAxis: 0
                    },
                    style: {
                        fontSize: '4em',
                        color: '#ffffff'
                    },
                    id: 'cd-label'
                },
                {
                    text: 'DL',
                    point: {
                        x: 2011,
                        xAxis: 0,
                        y: 4,
                        yAxis: 0
                    },
                    style: {
                        fontSize: '1.2em',
                        color: '#ffffff'
                    },
                    id: 'dl-label'
                },
                {
                    text: 'Strm',
                    point: {
                        x: 2018,
                        xAxis: 0,
                        y: 5,
                        yAxis: 0
                    },
                    style: {
                        fontSize: '1.5em',
                        color: '#ffffff'
                    },
                    id: 'streams-label'
                }
            ]
        }
    ],

    responsive: {
        rules: [
            {
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    subtitle: {
                        y: -150,
                        x: -20
                    },
                    yAxis: {
                        title: {
                            align: 'high',
                            rotation: 0,
                            offset: -80,
                            x: 0,
                            y: -20
                        }
                    }
                }
            }
        ]
    }
});

function pause(button) {
    button.title = 'play';
    button.className = 'fa fa-play';
    clearTimeout(chart.sequenceTimer);
    chart.sequenceTimer = undefined;
}

function update() {
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

    const series = chart.series,
        yearIndex = input.value - startYear,
        dataLength = series[0].data.length;

    // If slider moved back in time
    if (yearIndex < dataLength - 1) {
        for (let i = 0; i < series.length; i++) {
            const seriesData = series[i].data.slice(0, yearIndex);
            series[i].setData(seriesData, false);
        }
    }

    // If slider moved forward in time
    if (yearIndex > dataLength - 1) {
        const remainingYears = yearIndex - dataLength;
        for (let i = 0; i < series.length; i++) {
            for (let j = input.value - remainingYears; j < input.value; j++) {
                series[i].addPoint([formatRevenue[i][j] || 0], false);
            }
        }
    }

    // Add current year
    for (let i = 0; i < series.length; i++) {
        const newY = formatRevenue[i][input.value] || 0;
        series[i].addPoint([newY], false);
    }

    chart.redraw();

    input.value = parseInt(input.value, 10) + 1;

    if (input.value > endYear) {
        // Auto-pause
        pause(btn);
    }
}

function play(button) {
    // Reset slider at the end
    if (input.value > endYear) {
        input.value = startYear;
    }
    button.title = 'pause';
    button.className = 'fa fa-pause';
    chart.sequenceTimer = setInterval(function () {
        update();
    }, 700);
}

btn.addEventListener('click', function () {
    if (chart.sequenceTimer) {
        pause(this);
    } else {
        play(this);
    }
});

play(btn);

// Trigger the update on the range bar click.
input.addEventListener('input', function () {
    update();
});
