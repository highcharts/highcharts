(async () => {

    // Colors used for neon glow
    const lightColor = '#ffffff',
        ambientColor = '#83FF45',
        candleUpColor = '#664666',
        candleUpAmbience = '#F429FF';

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlcv.json'
    ).then(response => response.json());

    // Glowing particles sparkling upwards from a position in the plot area
    let sparkleTimer;

    function sparkle(chart, x, y, groupName) {
        if (!chart[groupName]) {
            chart[groupName] = chart.renderer.g(groupName)
                .addClass('highcharts-sparkles')
                .attr({ zIndex: 10 })
                .add();
        }

        const particle = chart.renderer
            .circle(
                x + chart.plotLeft,
                y + chart.plotTop,
                0.5 + Math.random() * 1.5
            )
            .add(chart[groupName]);

        // Random drift and lifetime, picked up by the CSS animation
        const style = particle.element.style;
        style.setProperty('--drift-x', `${(Math.random() - 0.5) * 30}px`);
        style.setProperty('--drift-y', `${-20 - Math.random() * 40}px`);
        style.setProperty('--duration', `${0.6 + Math.random() * 0.8}s`);

        particle.element.addEventListener(
            'animationend',
            () => particle.destroy()
        );
    }

    // Let a few random visible candles emit a particle from their top (the
    // high) on each tick
    function emitCandleSparkles(chart) {
        const points = chart.series[0].points.filter(
            point => point.graphic && point.isInside
        );

        for (let i = 0; i < 1 && points.length; i++) {
            const point = points[Math.floor(Math.random() * points.length)];

            sparkle(chart, point.plotX, point.plotHigh, 'candle-sparkles');
        }
    }

    // Allow radialGradient and gradientUnits in defs, they are stripped by the
    // AST sanitizer by default
    Highcharts.AST.allowedTags.push('radialGradient');
    Highcharts.AST.allowedAttributes.push('gradientUnits');

    // Each candle is a single path including the wicks, so a shared gradient
    // would span from high to low. Give each candle its own copy of the
    // gradient, fitted from the top to the bottom of the body.
    const candleGradients = [];

    function fitCandleGradients() {
        const template = this.container.querySelector('#candle-up');

        this.series[0].points.forEach((point, i) => {
            const { open, high, low, close, graphic } = point;

            if (!graphic) {
                return;
            }

            if (!candleGradients[i]) {
                candleGradients[i] = template.cloneNode(true);
                candleGradients[i].id = 'candle-up-' + i;
                template.parentNode.appendChild(candleGradients[i]);
            }

            const range = high - low || 1;

            candleGradients[i].setAttribute(
                'y1',
                (high - Math.max(open, close)) / range
            );
            candleGradients[i].setAttribute(
                'y2',
                (high - Math.min(open, close)) / range
            );
            graphic.css({ fill: `url(#candle-up-${i})` });
        });
    }

    const chart = Highcharts.stockChart('container', {
        chart: {
            styledMode: true,
            events: {
                render: fitCandleGradients
            }
        },
        xAxis: {
            gridLineWidth: 1,
            labels: {
                enabled: false
            }
        },
        yAxis: {
            gridLineWidth: 1,
            labels: {
                enabled: false
            }
        },
        rangeSelector: false,
        navigator: false,
        tooltip: {
            enabled: false
        },
        defs: {
            // Grid line gradient, brightest in the centre of the chart and
            // fading out in all directions, for both horizontal and vertical
            // lines. Grid lines have no height or width, so the gradient uses
            // user space coordinates spanning the whole chart instead of the
            // bounding box.
            grid: {
                tagName: 'radialGradient',
                attributes: {
                    id: 'grid',
                    gradientUnits: 'userSpaceOnUse',
                    cx: '50%',
                    cy: '50%',
                    r: '60%'
                },
                children: [{
                    tagName: 'stop',
                    attributes: {
                        offset: 0,
                        'stop-color': lightColor,
                        'stop-opacity': 0.2
                    }
                }, {
                    tagName: 'stop',
                    attributes: {
                        offset: 1,
                        'stop-color': lightColor,
                        'stop-opacity': 0
                    }
                }]
            },

            // Gradient fill for up candles, top to bottom
            candleUp: {
                tagName: 'linearGradient',
                attributes: {
                    id: 'candle-up',
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                children: [{
                    tagName: 'stop',
                    attributes: {
                        offset: 0,
                        'stop-color': candleUpColor
                    }
                }, {
                    tagName: 'stop',
                    attributes: {
                        offset: 1,
                        'stop-color': candleUpColor,
                        'stop-opacity': 0
                    }
                }]
            },

            // Graph glow effect
            neon: {
                tagName: 'filter',
                attributes: {
                    id: 'neon'
                },
                children: [{
                    tagName: 'feDropShadow',
                    attributes: {
                        dx: 0,
                        dy: 0,
                        stdDeviation: 2,
                        'flood-color': lightColor,
                        'flood-opacity': 1
                    }
                }, {
                    tagName: 'feDropShadow',
                    attributes: {
                        dx: 0,
                        dy: 0,
                        stdDeviation: 4,
                        'flood-color': lightColor,
                        'flood-opacity': 0.3
                    }
                }, {
                    tagName: 'feDropShadow',
                    attributes: {
                        dx: 0,
                        dy: 0,
                        stdDeviation: 3.5,
                        'flood-color': ambientColor,
                        'flood-opacity': 0.3
                    }
                }, {
                    tagName: 'feDropShadow',
                    attributes: {
                        dx: 0,
                        dy: 0,
                        stdDeviation: 7,
                        'flood-color': ambientColor,
                        'flood-opacity': 0.4
                    }
                }]
            },
            // Candle up glow effect
            candleUpGlow: {
                tagName: 'filter',
                attributes: {
                    id: 'candle-up-glow'
                },
                children: [{
                    tagName: 'feDropShadow',
                    attributes: {
                        dx: 0,
                        dy: 0,
                        stdDeviation: 2,
                        'flood-color': lightColor,
                        'flood-opacity': 1
                    }
                }, {
                    tagName: 'feDropShadow',
                    attributes: {
                        dx: 0,
                        dy: 0,
                        stdDeviation: 3.5,
                        'flood-color': lightColor,
                        'flood-opacity': 1
                    }
                }, {
                    tagName: 'feDropShadow',
                    attributes: {
                        dx: 0,
                        dy: 0,
                        stdDeviation: 6.5,
                        'flood-color': candleUpAmbience,
                        'flood-opacity': 0.8
                    }
                }, {
                    tagName: 'feDropShadow',
                    attributes: {
                        dx: 0,
                        dy: 0,
                        stdDeviation: 10,
                        'flood-color': candleUpAmbience,
                        'flood-opacity': 0.9
                    }
                }]
            }
        },

        series: [{
            type: 'candlestick',
            name: 'Candlestick',
            id: 'aapl',
            data: data
        }, {
            type: 'sma',
            linkedTo: 'aapl',
            zIndex: 1,
            point: {
                events: {
                    mouseOver() {
                        clearInterval(sparkleTimer);
                        sparkleTimer = setInterval(() => sparkle(
                            this.series.chart,
                            this.plotX,
                            this.plotY,
                            'sma-sparkles'
                        ), 50);
                    },
                    mouseOut() {
                        clearInterval(sparkleTimer);
                    }
                }
            }
        }]
    });

    setInterval(() => emitCandleSparkles(chart), 100);

    // Update the stdDeviation and flood-opacity of each drop shadow from the
    // sliders
    const shadows = chart.container.querySelectorAll('#neon feDropShadow');

    document.querySelectorAll('#controls input').forEach(input => {
        const shadow = shadows[input.dataset.shadow],
            attr = input.dataset.attr;

        // Start from the values defined in the filter
        input.value = shadow.getAttribute(attr) ?? 1;
        input.nextElementSibling.value = input.value;

        input.addEventListener('input', () => {
            shadow.setAttribute(attr, input.value);
            input.nextElementSibling.value = input.value;
        });
    });
})();