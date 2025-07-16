const btn = document.getElementById('play-pause-button'),
    input = document.getElementById('play-range'),
    startYear = 1973,
    endYear = 2024,
    animationDuration = 400;

// General helper functions
const arrToAssociative = arr => {
    const tmp = {};
    arr.forEach(item => {
        tmp[item[0]] = item[1];
    });

    return tmp;
};

function getSubtitle() {
    return `<span style='font-size: 60px'>${input.value}</span>`;
}

const formatRevenue = [];

const chart = Highcharts.chart('container', {
    chart: {
        type: 'line',
        marginTop: 100,
        animation: {
            duration: animationDuration,
            easing: t => t
        }
    },
    title: {
        text: 'Music revenue race chart'
    },
    subtitle: {
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
        max: 20,
        title: {
            text: 'Revenue in the U.S.'
        },
        labels: {
            format: '${text} B'
        }
    },
    tooltip: {
        split: true,
        headerFormat: '<span style="font-size: 1.2em">{point.x}</span>',
        pointFormat:
            '{series.name}: <b>${point.y:,.1f} B</b> ({point.percentage:.1f}%)',
        crosshairs: true
    },
    plotOptions: {
        line: {
            animation: false,
            pointStart: startYear,
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
                allowOverlap: false,
                style: {
                    pointerEvents: 'none',
                    opacity: 1
                }
            },
            labels: [
                {
                    point: {
                        x: 0,
                        xAxis: 0,
                        y: 0,
                        yAxis: 0
                    },
                    id: 'vinyl-label'
                },
                {
                    point: {
                        x: 0,
                        xAxis: 0,
                        y: 0,
                        yAxis: 0
                    },
                    id: 'lpep-label'
                },
                {
                    point: {
                        x: 0,
                        xAxis: 0,
                        y: 0,
                        yAxis: 0
                    },
                    id: 'cassettes-label'
                },
                {
                    point: {
                        x: 0,
                        xAxis: 0,
                        y: 0,
                        yAxis: 0
                    },
                    id: 'cd-label'
                },
                {
                    point: {
                        x: 0,
                        xAxis: 0,
                        y: 0,
                        yAxis: 0
                    },
                    id: 'dl-label'
                },
                {
                    point: {
                        x: 0,
                        xAxis: 0,
                        y: 0,
                        yAxis: 0
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
                    title: {
                        align: 'left'
                    },
                    subtitle: {
                        y: -150,
                        x: -20
                    },
                    yAxis: {
                        labels: {
                            align: 'left',
                            x: 0,
                            y: -3
                        },
                        tickLength: 0,
                        title: {
                            align: 'high',
                            reserveSpace: false,
                            rotation: 0,
                            textAlign: 'left',
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

function update(sliderClicked) {
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
        labels = chart.annotations[0].labels,
        yearIndex = input.value - startYear,
        dataLength = series[0].options.data.length;

    // If slider moved back in time
    if (yearIndex < dataLength - 1) {
        for (let i = 0; i < series.length; i++) {
            const seriesData = series[i].options.data.slice(0, yearIndex);
            series[i].setData(seriesData, false);
        }
    }

    // If slider moved forward in time
    if (yearIndex > dataLength - 1) {
        const remainingYears = yearIndex - dataLength;
        for (let i = 0; i < series.length; i++) {
            for (let j = input.value - remainingYears; j < input.value; j++) {
                series[i].addPoint([formatRevenue[i][j]], false);
            }
        }
    }

    // Add current year, and update labels
    for (let i = 0; i < series.length; i++) {
        const newY = formatRevenue[i][input.value];
        series[i].addPoint([newY], false);
        console.log(labels[i]);
        labels[i].options.point.x = yearIndex + 1973;
        labels[i].options.point.y = newY;
        // labels[i].options.style = {
        //     '--num': (newY * 1000)
        // };
        // labels[i].options.text = (newY * 1000).toString();
    }

    if (sliderClicked) {
        chart.redraw(false);
    } else {
        chart.redraw();
    }

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
        update(false);
    }, animationDuration);
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
input.addEventListener('click', function () {
    update(true);
});
// Stop animation when clicking and dragging range bar
input.addEventListener('input', function () {
    pause(btn);
});
