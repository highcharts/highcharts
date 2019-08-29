Highcharts.getJSON('https://www.highcharts.com/samples/data/aapl-c.json', function (data) {
    // Create the chart
    Highcharts.stockChart('container', {
        chart: {
            events: {
                load: function () {
                    var chart = this;

                    // Select the save button of the popup and assign a click event
                    document
                        .querySelectorAll('.highcharts-popup-annotations button')[0]
                        .addEventListener(
                            'click',
                            // Function which saves the new background color.
                            function () {
                                var color = document.querySelectorAll(
                                    '.highcharts-popup-annotations input[name="stroke"]'
                                )[0].value;

                                // Update the circle
                                chart.currentAnnotation.update({
                                    shapes: [{
                                        fill: color
                                    }]
                                });

                                // Close the popup
                                chart.annotationsPopupContainer.style.display = 'none';
                            }
                        );
                }
            }
        },
        navigation: {
            // Informs Stock Tools where to look for HTML elements for adding
            // technical indicators, annotations etc.
            bindingsClassName: 'tools-container',
            events: {
                // On selecting the annotation the showPopup event is fired
                showPopup: function (event) {
                    var chart = this.chart;

                    if (!chart.annotationsPopupContainer) {
                        // Get and store the popup annotations container
                        chart.annotationsPopupContainer = document
                            .getElementsByClassName('highcharts-popup-annotations')[0];
                    }

                    // Show the popup container, but not when we add the annotation.
                    if (
                        event.formType === 'annotation-toolbar' &&
                        !chart.activeButton
                    ) {
                        chart.currentAnnotation = event.annotation;
                        chart.annotationsPopupContainer.style.display = 'block';
                    }
                },

                closePopup: function () {
                    // Hide the popup container, and reset currentAnnotation
                    this.chart.annotationsPopupContainer.style.display = 'none';
                    this.chart.currentAnnotation = null;
                },

                selectButton: function (event) {
                    // Select button
                    event.button.classList.add('active');
                    // Register this is current button to indicate we're adding
                    // an annotation.
                    this.chart.activeButton = event.button;
                },

                deselectButton: function (event) {
                    // Unselect the button
                    event.button.classList.remove('active');
                    // Remove info about active button:
                    this.chart.activeButton = null;
                }
            }
        },
        stockTools: {
            gui: {
                enabled: false // disable the built-in toolbar
            }
        },

        series: [{
            id: 'aapl',
            name: 'AAPL',
            data: data,
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
});
