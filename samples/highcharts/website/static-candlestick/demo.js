Math.easeInSine = function (pos) {
    return -Math.cos(pos * (Math.PI / 2)) + 1;
};

Math.easeOutQuint = function (pos) {
    return (Math.pow((pos - 1), 5) + 1);
};

Math.easeOutBounce = pos => {
    if ((pos) < (1 / 2.75)) {
        return (7.5625 * pos * pos);
    }
    if (pos < (2 / 2.75)) {
        return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
    }
    if (pos < (2.5 / 2.75)) {
        return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
    }
    return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
};


const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const big = window.matchMedia("(min-width: 500px)").matches;


const updateStyle = function (selector, property, value, duration) {
    [].forEach.call(
        document.querySelectorAll('.' + selector),
        function (elem) {
            elem.style.transition = property + ' ' + duration;
            elem.style[property] = value;
        }
    );
};


const candlestick = function (type) {
    Highcharts.getJSON('https://demo-live-data.highcharts.com/aapl-ohlc.json', function (data) {
    // create the chart
        Highcharts.stockChart('hero', {
            chart: {
                styledMode: (true),
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

                        if (type === 'static') {
                            chart.update({
                                navigator: {
                                    enabled: true
                                }
                            });
                            updateStyle('candlestick', 'transform', 'rotate(0deg)', '0s');
                            if (big) {
                                chart.rangeSelector.clickButton(3);
                            } else {
                                chart.rangeSelector.clickButton(1);
                            }
                        }

                        const p1 = function () {
                            chart.xAxis[0].update({ visible: true });
                            updateStyle('highcharts-axis-labels', 'opacity', 1, '800ms');
                            updateStyle('candlestick', 'opacity', 0, '0s');
                            updateStyle('candlestick', 'opacity', 1, '1s');
                            updateStyle('highcharts-point-up', 'fillOpacity', 1, '1s');
                            updateStyle('highcharts-point-down', 'fillOpacity', 1, '1s');
                            updateStyle('highcharts-range-selector-buttons', 'opacity', 1, '1s');
                            if (!reduced) {
                                updateStyle('candlestick', 'transform', 'rotate(0deg)', '1s');
                            }

                        };
                        setTimeout(p1, 700);

                        if (type === 'animated') {
                            const p2 = function () {
                                if (big) {
                                    chart.rangeSelector.clickButton(3);
                                } else {
                                    chart.rangeSelector.clickButton(1);
                                }

                            };
                            setTimeout(p2, 3000);

                            const p21 = function () {
                                updateStyle('highcharts-range-selector-buttons', 'opacity', 0, '1s');
                                updateStyle('highcharts-axis-labels', 'opacity', 0, '800ms');
                                updateStyle('highcharts-xaxis', 'opacity', 0, '800ms');
                                updateStyle('candlestick', 'stroke', 'transparent', '800ms');
                                updateStyle('candlestick', 'opacity', 0, '1s');
                            };
                            setTimeout(p21, 5500);
                        }
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
                data: data,
                tooltip: {
                    valueDecimals: 2
                }
            }]
        });
    });
};

candlestick('static');