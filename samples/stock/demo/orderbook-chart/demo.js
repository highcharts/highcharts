Highcharts.Templating.helpers.abs = value => Math.abs(value);

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
            y: (-i - 1) * getRandomNumber(70000, 110000),
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
                this.titles = [];
                setInterval(() => {
                    updateData(this);
                }, 200);
            },
            render() {
                // Create and align titles
                if (this.titles.length) {
                    this.titles.forEach(title => {
                        title.destroy();
                    });
                    this.titles.length = 0;
                }

                const { plotLeft, plotTop, plotWidth, renderer } = this;

                this.titles.push(
                    renderer.text(
                        'Bids', plotLeft, plotTop - 5
                    )
                        .attr({ fill: '#ffffff' })
                        .css({
                            fontWeight: 700,
                            fontSize: 18
                        })
                        .add()
                );

                this.titles.push(
                    renderer.text(
                        'Asks', plotWidth - 35, plotTop - 5
                    )
                        .attr({ fill: '#ffffff' })
                        .css({
                            fontWeight: 700,
                            fontSize: 18
                        })
                        .add()
                );

                this.titles.push(
                    renderer.text(
                        'Price ($)', plotWidth / 2 - plotLeft, plotTop - 5
                    )
                        .attr({ fill: '#ffffff' })
                        .css({
                            fontWeight: 700,
                            fontSize: 18
                        })
                        .add()
                );
            }
        }
    },

    title: {
        text: 'Orderbook live chart',
        style: {
            color: '#ffffff'
        }
    },

    tooltip: {
        headerFormat: 'Price: <b>{point.point.price}$</b></br>',
        pointFormat: '{series.name}: <b>{(abs point.y):,.0f}</b>',
        shape: 'rect',
        positioner(labelWidth, _, point) {
            const { plotX, plotY, h, negative } = point;
            return {
                x: negative ? plotX + h - labelWidth : plotX - h,
                y: plotY
            };
        }
    },

    xAxis: [{
        reversed: true,
        visible: false
    }, {
        opposite: true,
        visible: false
    }],

    yAxis: {
        visible: false,
        min: -1200000,
        max: 1200000
    },

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
            stacking: 'normal',
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
            x: -999,
            style: {
                fontSize: 14,
                textOutline: 0
            },
            format: '{(abs point.y):,.0f}'
        }, {
            align: 'right',
            style: {
                fontSize: 13,
                textOutline: 0
            },
            format: '{point.price}'
        }],
        name: 'Bids',
        color: '#42b3f0',
        data: bidsData
    }, {
        dataLabels: [{
            x: 999,
            align: 'right',
            style: {
                fontSize: 14,
                textOutline: 0
            }
        }, {
            align: 'left',
            style: {
                fontSize: 13,
                textOutline: 0
            },
            format: '{point.price}'
        }],
        name: 'Asks',
        color: '#d76769',
        data: asksData
    }]
});
