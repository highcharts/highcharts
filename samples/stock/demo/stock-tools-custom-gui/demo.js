function addPopupEvents(chart) {
    var closePopupButtons = document.getElementsByClassName('highcharts-close-popup');
    // Close popup button:
    Highcharts.addEvent(
        closePopupButtons[0],
        'click',
        function () {
            this.parentNode.style.display = 'none';
        }
    );

    Highcharts.addEvent(
        closePopupButtons[1],
        'click',
        function () {
            this.parentNode.style.display = 'none';
        }
    );

    // Add an indicator from popup
    Highcharts.addEvent(
        document.querySelectorAll('.highcharts-popup-indicators button')[0],
        'click',
        function () {
            var typeSelect = document.querySelectorAll(
                    '.highcharts-popup-indicators select'
                )[0],
                type = typeSelect.options[typeSelect.selectedIndex].value,
                period = document.querySelectorAll(
                    '.highcharts-popup-indicators input'
                )[0].value || 14;

            chart.addSeries({
                linkedTo: 'aapl-ohlc',
                type: type,
                params: {
                    period: parseInt(period, 10)
                }
            });

            chart.stockToolbar.indicatorsPopupContainer.style.display = 'none';
        }
    );

    // Update an annotaiton from popup
    Highcharts.addEvent(
        document.querySelectorAll('.highcharts-popup-annotations button')[0],
        'click',
        function () {
            var strokeWidth = parseInt(
                    document.querySelectorAll(
                        '.highcharts-popup-annotations input[name="stroke-width"]'
                    )[0].value,
                    10
                ),
                strokeColor = document.querySelectorAll(
                    '.highcharts-popup-annotations input[name="stroke"]'
                )[0].value;

            // Stock/advanced annotations have common options under typeOptions
            if (chart.currentAnnotation.options.typeOptions) {
                chart.currentAnnotation.update({
                    typeOptions: {
                        lineColor: strokeColor,
                        lineWidth: strokeWidth,
                        line: {
                            strokeWidth: strokeWidth,
                            stroke: strokeColor
                        },
                        background: {
                            strokeWidth: strokeWidth,
                            stroke: strokeColor
                        },
                        innerBackground: {
                            strokeWidth: strokeWidth,
                            stroke: strokeColor
                        },
                        outerBackground: {
                            strokeWidth: strokeWidth,
                            stroke: strokeColor
                        },
                        connector: {
                            strokeWidth: strokeWidth,
                            stroke: strokeColor
                        }
                    }
                });
            } else {
                // Basic annotations:
                chart.currentAnnotation.update({
                    shapes: [{
                        'stroke-width': strokeWidth,
                        stroke: strokeColor
                    }],
                    labels: [{
                        borderWidth: strokeWidth,
                        borderColor: strokeColor
                    }]
                });
            }
            chart.stockToolbar.annotationsPopupContainer.style.display = 'none';
        }
    );
}

$.getJSON('https://www.highcharts.com/samples/data/aapl-ohlcv.json', function (data) {

    // split the data set into ohlc and volume
    var ohlc = [],
        volume = [],
        dataLength = data.length,
        i = 0;

    for (i; i < dataLength; i += 1) {
        ohlc.push([
            data[i][0], // the date
            data[i][1], // open
            data[i][2], // high
            data[i][3], // low
            data[i][4] // close
        ]);

        volume.push([
            data[i][0], // the date
            data[i][5] // the volume
        ]);
    }

    Highcharts.stockChart('container', {
        chart: {
            events: {
                load: function () {
                    addPopupEvents(this);
                }
            }
        },
        yAxis: [{
            labels: {
                align: 'left'
            },
            height: '80%',
            resize: {
                enabled: true
            }
        }, {
            labels: {
                align: 'left'
            },
            top: '80%',
            height: '20%',
            offset: 0
        }],
        navigationBindings: {
            events: {
                selectButton: function (event) {
                    var newClassName = event.button.className + ' highcharts-active',
                        topButton = event.button.parentNode.parentNode;

                    if (topButton.classList.contains('right')) {
                        newClassName += ' right';
                    }

                    // If this is a button with sub buttons,
                    // change main icon to the current one:
                    if (!topButton.classList.contains('highcharts-menu-wrapper')) {
                        topButton.className = newClassName;
                    }

                    // Store info about active button:
                    this.chart.activeButton = event.button;
                },
                deselectButton: function (event) {
                    event.button.parentNode.parentNode.classList.remove('highcharts-active');

                    // Remove info about active button:
                    this.chart.activeButton = null;
                },
                showPopup: function (event) {

                    if (!this.indicatorsPopupContainer) {
                        this.indicatorsPopupContainer = document
                            .getElementsByClassName('highcharts-popup-indicators')[0];
                    }

                    if (!this.annotationsPopupContainer) {
                        this.annotationsPopupContainer = document
                            .getElementsByClassName('highcharts-popup-annotations')[0];
                    }

                    if (event.formType === 'indicators') {
                        this.indicatorsPopupContainer.style.display = 'block';
                    } else if (event.formType === 'annotation-toolbar') {
                        // If user is still adding an annotation, don't show popup:
                        if (!this.chart.activeButton) {
                            this.chart.currentAnnotation = event.annotation;
                            this.annotationsPopupContainer.style.display = 'block';
                        }
                    }

                },
                closePopup: function () {
                    this.indicatorsPopupContainer.style.display = 'none';
                    this.annotationsPopupContainer.style.display = 'none';
                }
            }
        },
        stockTools: {
            gui: {
                enabled: false
            }
        },
        series: [{
            type: 'ohlc',
            id: 'aapl-ohlc',
            name: 'AAPL Stock Price',
            data: ohlc
        }, {
            type: 'column',
            id: 'aapl-volume',
            name: 'AAPL Volume',
            data: volume,
            yAxis: 1
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 800
                },
                chartOptions: {
                    rangeSelector: {
                        inputEnabled: false
                    }
                }
            }]
        }
    });
});
