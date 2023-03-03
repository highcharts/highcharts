Math.easeOutQuint = function (pos) {
    return (Math.pow((pos - 1), 5) + 1);
};

const big = window.matchMedia('(min-width: 500px)').matches;

const updateStyle = function (selector, property, value, duration) {
    [].forEach.call(
        document.querySelectorAll('.' + selector),
        function (elem) {
            elem.style.transition = property + ' ' + duration;
            elem.style[property] = value;
        }
    );
};

const candlestick = function () {
    Highcharts.getJSON('https://demo-live-data.highcharts.com/aapl-ohlc.json', function (data) {
    // create the chart
        Highcharts.stockChart('hero', {
            chart: {
                styledMode: true,
                margin: [0, 0, 0, 0],
                height: 430,
                animation: {
                    enabled: true,
                    duration: 1000,
                    easing: 'easeOutQuint'
                },
                events: {
                    load: function () {
                        const chart = this;
                        updateStyle('highcharts-title', 'opacity', 0, '0s');
                        updateStyle('candlestick', 'opacity', 0, '0s');
                        updateStyle('highcharts-yaxis-labels', 'opacity', 0, '0s');
                        chart.update({
                            navigator: {
                                enabled: true
                            }
                        });
                        chart.update({
                            tooltip: {
                                enabled: true
                            }
                        });
                        updateStyle('candlestick', 'transform', 'rotate(0deg)', '0s');
                        if (big) {
                            chart.rangeSelector.clickButton(3);
                        } else {
                            chart.rangeSelector.clickButton(1);
                        }

                        const p1 = function () {
                            chart.xAxis[0].update({ visible: true });
                            updateStyle('highcharts-axis-labels', 'opacity', 1, '800ms');
                            updateStyle('candlestick', 'opacity', 0, '0s');
                            updateStyle('candlestick', 'opacity', 1, '1s');
                            updateStyle('highcharts-point-up', 'fillOpacity', 1, '1s');
                            updateStyle('highcharts-point-down', 'fillOpacity', 1, '1s');
                            updateStyle('highcharts-range-selector-buttons', 'opacity', 1, '1s');
                        };
                        setTimeout(p1, 100);
                    }
                }
            },
            title: {
                text: '',
                y: 110

            },
            exporting: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            tooltip: {
                enabled: true,
                valueDecimals: 2
            },
            navigator: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            rangeSelector: {
                enabled: true,
                inputEnabled: false,
                selected: 0,
                buttons: [{
                    type: 'week',
                    count: 1,
                    text: '1w',
                    title: 'View 1 week'
                },
                {
                    type: 'week',
                    count: 4,
                    text: '1m',
                    title: 'View 1 month'
                }, {
                    type: 'month',
                    count: 2,
                    text: '2m',
                    title: 'View 2 months'
                },
                {
                    type: 'month',
                    count: 3,
                    text: '3m',
                    title: 'View 3 months'
                },

                {
                    type: 'month',
                    count: 4,
                    text: '4m',
                    title: 'View 4 months'
                }],
                floating: true,
                verticalAlign: 'middle',
                y: -130,
                buttonPosition: {
                    align: 'center'
                }
            },
            xAxis: [{
                visible: false,
                offset: -30,
                events: {
                    afterSetExtremes: function () {
                        // document.querySelector('.highcharts-candlestick-series.candlestick').classList.add('h');
                        updateStyle('highcharts-point-up', 'fillOpacity', 1, '1s');
                        updateStyle('highcharts-point-down', 'fillOpacity', 1, '1s');
                    }
                }
            }],
            yAxis: [{
                visible: false
            }],
            plotOptions: {
                series: {
                    enableMouseTracking: true
                }
            },
            series: [{
                name: 'AAPL',
                animation: {
                    enabled: true
                },
                type: 'candlestick',
                className: 'candlestick',
                dataGrouping: {
                    units: [
                        [
                            'week',
                            [1, 2, 3, 4, 6, 52]
                        ],
                        [
                            'month',
                            [12]
                        ]
                    ]
                },
                data: data
            }]
        });
    });
};

candlestick();
