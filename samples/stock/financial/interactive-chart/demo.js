const findPoint = Highcharts.OrdinalAxis.Additions.findIndexOf;
const buttons = document.querySelectorAll('#range-selector button');
const currentDate = document.querySelector('.date');

Highcharts.timeUnits = {
    ...Highcharts.timeUnits,
    '5year': 31449600000 * 5
};

const timeFormatter = timestamp => {
    const time = new Highcharts.Time({
        locale: 'en-US'
    });

    return time.dateFormat({
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h23',
        timeZone: 'UTC',
        timeZoneName: 'short'
    }, timestamp);
};

const calculateChange = (series, lastPoint, range) => {
    const lastVal = lastPoint.y;
    const lastPos = lastPoint.x;
    const index = findPoint(
        series.dataTable.getColumn('x'),
        lastPos - range,
        true
    );

    const currVal = series.dataTable.getRow(index, ['y'])[0];
    const increase = (100 * (lastVal - currVal) / currVal).toFixed(2);
    return increase;
};

const updatePercentageChange = (series, lastPoint, extremes) => {
    const { min, max } = extremes;
    const titleIndicator = document.querySelector(
        '.top-container .rounded-border'
    );
    const currentChange = calculateChange(series, lastPoint, max - min);
    const isPositive = currentChange >= 0;

    titleIndicator.className = `title-indicator rounded-border ${isPositive ?
        'plus plus-border' : 'minus minus-border'}`;
    titleIndicator.textContent = `${isPositive ? '+' : ''}${currentChange}%`;

    for (const button of buttons) {
        const buttonRange = button.getAttribute('data-range');
        const range = Highcharts.timeUnits[buttonRange] ?? NaN;
        const increase = calculateChange(series, lastPoint, range);
        const extraInfo = button.querySelector('.change');

        extraInfo.className = `change ${increase >= 0 ? 'plus' : 'minus'}`;
        extraInfo.textContent = `${increase >= 0 ? '+' : ''}${increase}%`;
    }
};

renderChart();

// Set current date
currentDate.textContent = timeFormatter(new Date());
setInterval(() => {
    currentDate.textContent = timeFormatter(new Date());
}, 1000);

// Create chart
const chart = Highcharts.stockChart('container', {
    chart: {
        plotBorderColor: '#E1E1E1',
        plotBorderWidth: 2,
        height: 600,
        marginTop: 0,
        events: {
            render: function () {
                if (!this.hasLoaded) {
                    this.plotBorder.attr({
                        rx: 10,
                        ry: 10
                    });
                }

                if (this.series[0].points.length) {
                    const { min, max } = this.xAxis[0].getExtremes();
                    const series = this.series[0];
                    const lastPoint = series.points.at(-1);

                    updatePercentageChange(series, lastPoint, {
                        min,
                        max
                    });

                    this.update({
                        caption: {
                            text: `${timeFormatter(new Date(min))} -
                                ${timeFormatter(new Date(max))}<br>
                                FSPGX: ${Number(lastPoint.y).toFixed(2)}$`
                        }
                    }, false);
                }
            }
        }
    },
    colors: ['#274FE0'],
    lang: {
        decimalPoint: '.',
        thousandsSep: ','
    },
    xAxis: {
        minRange: 36e6,
        lineWidth: 0,
        lineColor: 'blue',
        tickColor: '#E1E1E1',
        events: {
            afterSetExtremes: function (e) {
                if (e.trigger === 'navigator') {
                    document
                        .querySelector('.selected')
                        ?.classList.remove('selected');
                }
            }
        }
    },
    yAxis: {
        gridLineColor: 'rgba(0, 0, 0, 0.04)',
        opposite: false,
        showLastLabel: true,
        startOnTick: false,
        endOnTick: false,
        labels: {
            format: '${value:.2f}'
        }
    },
    title: {
        text: ''
    },
    subtitle: {
        text: ''
    },
    tooltip: {
        valueDecimals: 2,
        valuePrefix: '$'
    },
    rangeSelector: {
        enabled: false
    },
    scrollbar: {
        height: 0,
        trackBorderWidth: 0
    },
    plotOptions: {
        series: {
            lastPrice: {
                enabled: true,
                label: {
                    enabled: true,
                    format: '${value:.2f}'
                }
            }
        }
    },
    series: [{
        name: 'FSPGX'
    }],
    navigator: {
        maskFill: '#274FE026',
        outlineColor: '#C0C0C0',
        series: {
            type: 'area',
            fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, 'rgba(0, 117, 219, 0.12)'],
                    [0.575, 'rgba(0, 113, 219, 0)']
                ]
            }
        },
        height: 70,
        handles: {
            backgroundColor: '#F7F7F7',
            borderColor: '#C0C0C0',
            borderRadius: 2,
            width: 9,
            height: 17
        }
    },
    caption: {
        align: 'center',
        margin: 30,
        text: ''
    }
});

const handleRangeSelection = () => {
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            document
                .querySelector('button.selected')
                ?.classList.remove('selected');
            const xAxis = chart.xAxis[0];
            const range = button.getAttribute('data-range');
            const min = xAxis.max - Highcharts.timeUnits[range];

            xAxis.setExtremes(
                min ? min : xAxis.dataMin,
                min ? xAxis.max : xAxis.dataMax
            );
            button.classList.add('selected');
        });

        // Set 1 year range on data load
        if (button.id === '1y') {
            button.click();
        }
    });
};

async function renderChart() {

    // Configure the connector
    const timeSeriesConnector =
        new HighchartsConnectors.Morningstar.TimeSeriesConnector({
            api: {
                url: 'https://demo-live-data.highcharts.com',
                access: {
                    url: 'https://demo-live-data.highcharts.com/token/oauth',
                    token: 'token'
                }
            },
            series: {
                type: 'Price'
            },
            securities: [{
                id: '0P0001F5J3',
                idType: 'MSID'
            }],
            startDate: '2020-01-01',
            currencyId: 'USD'
        });

    // Load data
    await timeSeriesConnector.load();

    // Set series data
    chart.series[0].setData(timeSeriesConnector.getTable().getRows(0));

    handleRangeSelection();
}
