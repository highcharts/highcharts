type Athlete = {
    sport: string;
    weight: number;
    height: number;
    continent: string;
};

const series: Highcharts.SeriesScatterOptions[] = [{
    name: 'Basketball',
    type: 'scatter',
    id: 'basketball',
    marker: {
        symbol: 'circle'
    }
},
{
    name: 'Triathlon',
    type: 'scatter',
    id: 'triathlon',
    marker: {
        symbol: 'triangle'
    }
},
{
    name: 'Volleyball',
    type: 'scatter',
    id: 'volleyball',
    marker: {
        symbol: 'square'
    }
}];

async function getData(): Promise<Athlete[]> {
    const response = await fetch(
        'https://www.highcharts.com/samples/data/olympic2012.json'
    );
    return response.json();
}

getData().then(data => {
    const getData = (sportName: string) => {
        const temp: [number, number][] = [];
        data.forEach(athlete => {
            if (
                athlete.sport === sportName &&
                athlete.weight > 0 && athlete.height > 0 &&
                athlete.continent === 'Europe'
            ) {
                temp.push([athlete.height, athlete.weight]);
            }
        });
        return temp;
    };
    series.forEach(s => {
        s.data = getData(s.id);
    });

    Highcharts.chart('container', {
        chart: {
            type: 'scatter',
            plotBorderColor: 'var(--highcharts-neutral-color-10, #e6e6e6)',
            plotBorderWidth: 1,
            plotBorderRadius: 5,
            zooming: {
                type: 'xy'
            }
        },
        title: {
            text: 'European olympic athletes by height and weight',
            align: 'left'
        },
        subtitle: {
            text: 'Source: <a href="https://www.theguardian.com/sport/datablo' +
                'g/2012/aug/07/olympics-2012-athletes-age-weight-height">The ' +
                'Guardian</a>',
            align: 'left'
        },
        xAxis: {
            labels: {
                format: '{value} m'
            },
            gridLineWidth: 1,
            lineWidth: 0,
            startOnTick: true,
            endOnTick: true,
            tickLength: 0
        },
        yAxis: {
            title: {
                text: 'Weight'
            },
            labels: {
                format: '{value} kg'
            }
        },
        legend: {
            enabled: true,
            padding: 0
        },
        plotOptions: {
            scatter: {
                marker: {
                    states: {
                        hover: {
                            enabled: true,
                            lineColor:
                                'var(--highcharts-neutral-color-60, #666)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                jitter: {
                    x: 0.005
                }
            }
        },
        tooltip: {
            pointFormat: 'Height: {point.x:.2f} m <br/> Weight: {point.y} kg'
        },
        series
    });
}
);
