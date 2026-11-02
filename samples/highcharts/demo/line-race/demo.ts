declare namespace Highcharts {
    interface Chart {
        sequenceTimer?: number;
    }
}

type StringNumberTuple = [string, number];

const btn = document.getElementById('play-pause-button') as HTMLButtonElement,
    input = document.getElementById('play-range') as HTMLInputElement,
    startRound = 0,
    endRound = 20,
    animationDuration = 1000;

// General helper functions
const arrToAssociative = (arr: StringNumberTuple[]): Record<string, number> => {
    const tmp: Record<string, number> = {};
    arr.forEach((item: StringNumberTuple) => {
        tmp[item[0]] = item[1];
    });

    return tmp;
};

const formatPoints: Array<Record<string, number>> = [];

const chart = Highcharts.chart('container', {
    chart: {
        type: 'line',
        marginRight: 110,
        animation: {
            duration: animationDuration,
            easing: (t: number): number => t
        }
    },
    title: {
        text: 'F1 2012 Top Ten Drivers',
        floating: true,
        align: 'left',
        x: 70,
        y: 50
    },
    data: {
        csv: (document.getElementById('csv') as HTMLElement)
            .innerText,
        itemDelimiter: '\t',
        complete: function (options) {
            // Store the data for later use, and remove it from the series
            for (let i = 0; i < options.series.length; i++) {
                const seriesOptions =
                    options.series[i] as Highcharts.SeriesLineOptions;
                formatPoints[i] = arrToAssociative(
                    seriesOptions.data as StringNumberTuple[]
                );
                seriesOptions.data = [] as Array<never>;
            }
        }
    },
    xAxis: {
        allowDecimals: false,
        min: startRound,
        max: endRound,
        title: {
            text: 'Round #',
            align: 'high',
            textAlign: 'left',
            x: 20,
            y: -20
        }
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
        pointFormat: '{series.name}: {point.y} Points',
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
            crop: false,
            labelOptions: {
                borderWidth: 0,
                backgroundColor: undefined,
                align: 'left',
                verticalAlign: 'middle',
                overflow: 'allow',
                style: {
                    pointerEvents: 'none',
                    transition: 'opacity 0.5s'
                },
                x: -8,
                y: -1
            },
            labels: new Array(10).fill({
                text: 0,
                point: {
                    x: 0,
                    xAxis: 0,
                    y: 0,
                    yAxis: 0
                }
            })
        }
    ],

    responsive: {
        rules: [
            {
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    chart: {
                        marginTop: 80
                    },
                    title: {
                        floating: false,
                        x: 0,
                        y: 20
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
} satisfies Highcharts.Options);

function pause(button: HTMLButtonElement): void {
    button.title = 'play';
    button.className = 'fa fa-play';
    clearTimeout(chart.sequenceTimer);
    chart.sequenceTimer = undefined;
}

function update(sliderClicked: boolean): void {

    const series = chart.series,
        labels = chart.annotations[0].labels,
        yearIndex = Number(input.value) - startRound,
        dataLength = (
            series[0].options as Highcharts.SeriesLineOptions
        ).data.length;

    // If slider moved back in time
    if (yearIndex < dataLength - 1) {
        for (let i = 0; i < series.length; i++) {
            const seriesData = (
                series[i].options as Highcharts.SeriesLineOptions
            ).data.slice(0, yearIndex);
            series[i].setData(seriesData, false);
        }
    }

    // If slider moved forward in time
    if (yearIndex > dataLength - 1) {
        const remainingYears = yearIndex - dataLength;
        const currentValue = Number(input.value);
        for (let i = 0; i < series.length; i++) {
            for (let j = currentValue - remainingYears; j < currentValue; j++) {
                series[i].addPoint([formatPoints[i][String(j)]], false);
            }
        }
    }

    const nextnums: number[] = [];
    // Add current year if applicable, and update labels
    for (let i = 0; i < series.length; i++) {
        const newY = formatPoints[i][String(input.value)];
        labels[i].options.point.x = yearIndex;
        labels[i].options.point.y = newY;

        if (yearIndex === 0) {
            const seriesColor = (series[i].color as string) || '';
            labels[i].options.text =
                '<span style="color:' + seriesColor + '">●</span>' +
                ' ' + String(series[i].name) + '</span>';
        }
        nextnums.push(newY);
        if ((
            series[i].options as Highcharts.SeriesLineOptions
        ).data.length <= yearIndex) {
            series[i].addPoint(newY, false);
        }
    }

    if (sliderClicked) {
        chart.redraw(false);
    } else {
        chart.redraw();
    }

    input.value = String(parseInt(input.value, 10) + 1);

    if (parseInt(input.value, 10) > endRound) {
        // Auto-pause
        pause(btn);
    }
}

function play(button: HTMLButtonElement): void {
    // Reset slider at the end
    if (parseInt(input.value, 10) > endRound) {
        input.value = String(startRound);
    }
    button.title = 'pause';
    button.className = 'fa fa-pause';
    chart.sequenceTimer = setInterval(function () {
        update(false);
    }, animationDuration);
}

btn.addEventListener('click', function () {
    if (chart.sequenceTimer) {
        pause(this as HTMLButtonElement);
    } else {
        play(this as HTMLButtonElement);
    }
});

update(true); // Move to initial position
update(false); // Animate to the first point immediately
play(btn); // Start the animation

// Trigger the update on the range bar click.
input.addEventListener('click', function () {
    update(true);
});
// Stop animation when clicking and dragging range bar
input.addEventListener('input', function () {
    pause(btn);
    update(true);
});
