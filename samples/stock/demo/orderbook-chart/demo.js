function getRandomNumber(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

function generateBidAndAskData(n) {
    const data = [[], []];
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

function updateData(chart) {
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
                setInterval(() => {
                    if (this.series) {
                        updateData(this);
                    }
                }, 200);
            }
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
            const { plotX, plotY, h } = point,
                negative = plotX < this.chart.yAxis[0].left;

            return {
                x: negative ? plotX + h - labelWidth + 10 : plotX - h + 10,
                y: plotY
            };
        }
    },

    xAxis: [{
        reversed: true,
        visible: false,
        title: {
            text: 'Market depth / price'
        }
    }, {
        opposite: true,
        visible: false,
        title: {
            text: 'Market depth / price'
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
                fontWeight: 700
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
        series: {
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
                textOutline: 0
            },
            format: '{point.y:,.0f}'
        }, {
            align: 'left',
            inside: true,
            style: {
                fontSize: 13,
                textOutline: 0
            },
            format: '{point.price:,.1f}'
        }],
        name: 'Asks',
        color: '#d76769',
        data: asksData
    }, {
        dataLabels: [{
            align: 'left',
            alignTo: 'plotEdges',
            style: {
                fontSize: 14,
                textOutline: 0
            },
            format: '{point.y:,.0f}'
        }, {
            align: 'right',
            inside: true,
            style: {
                fontSize: 13,
                textOutline: 0
            },
            format: '{point.price:,.1f}'
        }],
        name: 'Bids',
        color: '#42b3f0',
        data: bidsData,
        yAxis: 1
    }]
});
