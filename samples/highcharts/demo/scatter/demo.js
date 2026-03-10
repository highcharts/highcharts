const series = [{
    name: 'Basketball',
    id: 'basketball',
    marker: {
        symbol: 'circle'
    }
},
{
    name: 'Triathlon',
    id: 'triathlon',
    marker: {
        symbol: 'triangle'
    }
},
{
    name: 'Volleyball',
    id: 'volleyball',
    marker: {
        symbol: 'square'
    }
}];


async function getData() {
    const response = await fetch(
        'https://www.highcharts.com/samples/data/olympic2012.json'
    );
    return response.json();
}


getData().then(data => {
    const getData = sportName => {
        const temp = [];
        data.forEach(elm => {
            if (
                elm.sport === sportName &&
                elm.weight > 0 && elm.height > 0 &&
                elm.continent === "Europe"
            ) {
                temp.push([elm.height, elm.weight]);
            }
        });
        return temp;
    };
    series.forEach(s => {
        s.data = getData(s.id);
    });

    Highcharts.chart('container', {
        chart: {
            plotBorderWidth: 1,
            type: 'scatter',
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
            lineWidth: 0,
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true,
            tickColor: 'var(--highcharts-neutral-color-20, #ccc)'
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
            pointFormat: 'Height: {point.x} m <br/> Weight: {point.y} kg'
        },
        series
    });
}
);
