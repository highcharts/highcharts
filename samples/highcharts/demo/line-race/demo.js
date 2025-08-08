const btn = document.getElementById('play-pause-button'),
    input = document.getElementById('play-range'),
    startRound = 0,
    endRound = 20,
    animationDuration = 1000;

// General helper functions
const arrToAssociative = arr => {
    const tmp = {};
    arr.forEach(item => {
        tmp[item[0]] = item[1];
    });

    return tmp;
};

const formatPoints = [];

const chart = Highcharts.chart('container', {
    chart: {
        type: 'line',
        marginTop: 100,
        marginRight: 50,
        animation: {
            duration: animationDuration,
            easing: t => t
        }
    },
    title: {
        text: 'F1 2012 Top Ten Drivers'
    },
    data: {
        csv: document.getElementById('csv').innerHTML,
        itemDelimiter: '\t',
        complete: function (options) {
            for (let i = 0; i < options.series.length; i++) {
                formatPoints[i] = arrToAssociative(options.series[i].data);
                options.series[i].data = null;
            }
        }
    },
    xAxis: {
        allowDecimals: false,
        min: startRound,
        max: endRound
    },
    yAxis: {
        reversedStacks: false,
        max: 300,
        title: {
            text: 'Points'
        }
    },
    tooltip: {
        split: true,
        headerFormat: '<span style="font-size: 1.2em">{point.x}</span>',
        pointFormat:
            '{series.name}: {point.y} Points',
        crosshairs: true
    },
    plotOptions: {
        line: {
            animation: false,
            pointStart: startRound,
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
                crop: false,
                style: {
                    pointerEvents: 'none',
                    opacity: 1
                }
            },
            labels: [
                {
                    text: 0,
                    point: {
                        x: 0,
                        xAxis: 0,
                        y: 0,
                        yAxis: 0
                    }
                },
                {
                    text: 0,
                    point: {
                        x: 0,
                        xAxis: 0,
                        y: 0,
                        yAxis: 0
                    }
                },
                {
                    text: 0,
                    point: {
                        x: 0,
                        xAxis: 0,
                        y: 0,
                        yAxis: 0
                    }
                },
                {
                    text: 0,
                    point: {
                        x: 0,
                        xAxis: 0,
                        y: 0,
                        yAxis: 0
                    }
                },
                {
                    text: 0,
                    point: {
                        x: 0,
                        xAxis: 0,
                        y: 0,
                        yAxis: 0
                    }
                },
                {
                    text: 0,
                    point: {
                        x: 0,
                        xAxis: 0,
                        y: 0,
                        yAxis: 0
                    }
                },
                {
                    text: 0,
                    point: {
                        x: 0,
                        xAxis: 0,
                        y: 0,
                        yAxis: 0
                    }
                },
                {
                    text: 0,
                    point: {
                        x: 0,
                        xAxis: 0,
                        y: 0,
                        yAxis: 0
                    }
                },
                {
                    text: 0,
                    point: {
                        x: 0,
                        xAxis: 0,
                        y: 0,
                        yAxis: 0
                    }
                },
                {
                    text: 0,
                    point: {
                        x: 0,
                        xAxis: 0,
                        y: 0,
                        yAxis: 0
                    }
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

    const series = chart.series,
        labels = chart.annotations[0].labels,
        yearIndex = input.value - startRound,
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
                series[i].addPoint([formatPoints[i][j]], false);
            }
        }
    }

    const nextnums = [];
    // Add current year if applicable, and update labels
    for (let i = 0; i < series.length; i++) {
        const newY = formatPoints[i][input.value];
        labels[i].options.point.x = Math.min(yearIndex + 0.3, endRound);
        labels[i].options.point.y = Math.max(newY - 10, 0);
        nextnums.push(newY);
        if (series[i].options.data.length <= yearIndex) {
            series[i].addPoint([newY], false);
        }
    }


    const ease = {
        linear: t => t,
        inOutQuad: t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)
        // https://gist.github.com/gre/1650294
    };

    // https://stackoverflow.com/questions/70746105/animate-counter-from-start-to-end-value

    const counter = EL => {


        let start = parseInt(EL.textContent, 10); // Get start and end values
        let end = nextnums.pop();
        if (isNaN(start)) {
            start = 0;
        }
        if (isNaN(end)) {
            end = 0;
        }

        // If equal values, stop here.
        if (start === end) {
            return;
        }

        const range = end - start; // Get the range
        let curr = start; // Set current at start position

        const timeStart = Date.now();

        const loop = () => {
            let elaps = Date.now() - timeStart;
            // Stop the loop
            if (elaps > animationDuration) {
                elaps = animationDuration;
            }
            // normalised value + easing
            const norm = ease.linear(elaps / animationDuration);
            const step = norm * range; // Calculate the value step
            curr = start + step; // Increment or Decrement current value
            EL.textContent = Math.trunc(curr); // Apply to UI as integer
            if (elaps < animationDuration) {
                requestAnimationFrame(loop);
            } // Loop
        };

        requestAnimationFrame(loop); // Start the loop
    };

    document.querySelectorAll('g.highcharts-annotation-label > text')
        .forEach(counter);

    if (sliderClicked) {
        chart.redraw(false);
    } else {
        chart.redraw();
    }

    input.value = parseInt(input.value, 10) + 1;

    if (input.value > endRound) {
        // Auto-pause
        pause(btn);
    }
}

function play(button) {
    // Reset slider at the end
    if (input.value > endRound) {
        input.value = startRound;
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
