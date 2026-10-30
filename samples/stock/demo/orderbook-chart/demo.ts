function getRandomNumber(min: number, max: number): number {
    return Math.round(Math.random() * (max - min)) + min;
}

interface BidsAsksObject {
    x: number;
    y: number;
    price: number;
}

function generateBidAndAskData(
    n: number
): [BidsAsksObject[], BidsAsksObject[]] {
    const data: [BidsAsksObject[], BidsAsksObject[]] = [[], []];
    let bidPrice = getRandomNumber(29000, 30000),
        askPrice = bidPrice + 0.5;
    for (let i = 0; i < n; i++) {
        bidPrice -= ((i * getRandomNumber(8, 10)));
        askPrice += ((i * getRandomNumber(8, 10)));
        data[0].push({
            x: i,
            y: (i + 1) * getRandomNumber(70000, 110000),
            price: bidPrice
        });

        data[1].push({
            x: i,
            y: (i + 1) * getRandomNumber(70000, 110000),
            price: askPrice
        });
    }
    return data;
}

const [bidsData, asksData] = generateBidAndAskData(10);

function updateData(chart: Highcharts.Chart) {
    const data = generateBidAndAskData(10);
    chart.series.forEach((s, i) => {
        s.setData(data[i], false);
    });
    chart.redraw();
}

Highcharts.chart('container', {
    chart: {
        animation: {
            duration: 200
        },
        type: 'bar',
        backgroundColor: '#23232f',
        marginTop: 70,
        events: {
            load() {
                const toggleButton = document.getElementById(
                    'animation-toggle'
                ) as HTMLButtonElement;

                let intervalId: number;
                const toggleInterval = () => {
                    if (intervalId !== undefined) {
                        this.update({
                            accessibility: {
                                enabled: true
                            }
                        });
                        clearInterval(intervalId);
                        intervalId = undefined;
                        toggleButton.innerText = 'Start animation';
                    } else {
                        this.update({
                            accessibility: {
                                enabled: false
                            }
                        });
                        intervalId = setInterval(() => {
                            if (this.series) {
                                updateData(this);
                            }
                        }, 200);
                        toggleButton.innerText = 'Stop animation';
                    }
                };

                toggleButton.addEventListener('click', toggleInterval);
                toggleInterval();
            }
        }
    },

    accessibility: {
        point: {
            descriptionFormat: 'Price: {price:.1f}USD, ' +
                '{series.name}: {y}'
        }
    },

    title: {
        text: 'Order book live chart',
        style: {
            color: '#ffffff'
        }
    },

    tooltip: {
        headerFormat: 'Price: <b>${point.point.price:,.1f}</b></br>',
        pointFormat: '{series.name}: <b>{point.y:,.0f}</b>',
        shape: 'rect',
        positioner(labelWidth, _, point) {
            const chartCenter = this.chart.chartWidth / 2,
                { plotX, plotY } = point,
                negative = plotX < this.chart.yAxis[0].pos;

            return {
                x: negative ?
                    chartCenter - labelWidth - 10 :
                    chartCenter + 10,
                y: plotY
            };
        }
    },

    xAxis: [{
        reversed: true,
        visible: false,
        title: {
            text: 'Market depth / price'
        },
        accessibility: {
            description: 'Bid orders'
        }
    }, {
        opposite: true,
        visible: false,
        title: {
            text: 'Market depth / price'
        },
        accessibility: {
            description: 'Ask orders'
        }
    }],

    yAxis: [{
        offset: 0,
        visible: true,
        opposite: true,
        gridLineWidth: 0,
        tickAmount: 1,
        left: '50%',
        width: '50%',
        title: {
            text: 'Amount of ask orders',
            style: {
                visibility: 'hidden'
            }
        },
        min: 0,
        max: 1200000,
        labels: {
            enabled: true,
            format: '{#if isLast}Asks{/if}',
            style: {
                color: '#ffffff',
                fontSize: 16,
                fontWeight: 700
            },
            y: 10
        }
    }, {
        offset: 0,
        visible: true,
        opposite: true,
        gridLineWidth: 0,
        tickAmount: 2,
        left: '0%',
        width: '50%',
        reversed: true,
        title: {
            text: 'Amount of bid orders',
            style: {
                visibility: 'hidden'
            }
        },
        min: 0,
        max: 1200000,
        labels: {
            enabled: true,
            format: `
                {#if (eq pos 0)}Price ($){/if}
                {#if isLast}Bids{/if}
            `,
            style: {
                color: '#ffffff',
                fontSize: 16,
                fontWeight: '700'
            },
            y: 10
        }
    }],

    legend: {
        enabled: false
    },

    navigation: {
        buttonOptions: {
            theme: {
                fill: 'none'
            }
        }
    },

    plotOptions: {
        bar: {
            animation: false,
            pointPadding: 0,
            groupPadding: 0,
            dataLabels: {
                enabled: true,
                color: '#ffffff'
            },
            borderWidth: 0,
            crisp: false
        }
    },

    series: [{
        dataLabels: [{
            align: 'right',
            alignTo: 'plotEdges',
            style: {
                fontSize: 14,
                textOutline: 'none'
            },
            format: '{point.y:,.0f}'
        }, {
            align: 'left',
            inside: true,
            style: {
                fontSize: 13,
                textOutline: 'none'
            },
            format: '{point.price:,.1f}'
        }],
        name: 'Asks',
        color: '#ce4548',
        data: asksData
    }, {
        dataLabels: [{
            align: 'left',
            alignTo: 'plotEdges',
            style: {
                fontSize: 14,
                textOutline: 'none'
            },
            format: '{point.y:,.0f}'
        }, {
            align: 'right',
            inside: true,
            style: {
                fontSize: 13,
                textOutline: 'none'
            },
            format: '{point.price:,.1f}'
        }],
        name: 'Bids',
        color: '#107db7',
        data: bidsData,
        yAxis: 1
    }]
} satisfies Highcharts.Options);
