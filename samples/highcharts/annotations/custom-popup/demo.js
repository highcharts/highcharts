Highcharts.chart('container', {
    chart: {
        events: {
            load: function () {
                const chart = this;

                // Select the save button of the popup and assign a
                // click event
                document
                    .querySelectorAll(
                        '.highcharts-popup-annotations ' +
                        'button'
                    )[0]
                    .addEventListener(
                        'click',
                        // Function which saves the new background color.
                        function () {
                            const color = document.querySelectorAll(
                                '.highcharts-popup-annotations ' +
                                'input[name="stroke"]'
                            )[0].value;

                            // Update the circle
                            chart.currentAnnotation.update({
                                shapes: [{
                                    fill: color
                                }]
                            });

                            // Close the popup
                            chart.annotationsPopupContainer.style.display =
                                'none';
                        }
                    );
            }
        }
    },
    navigation: {
        // Informs Annotations module where to look for HTML elements for adding
        // annotations etc.
        bindingsClassName: 'custom-gui-container',
        events: {
            // On selecting the annotation the showPopup event is fired
            showPopup: function (event) {
                const chart = this.chart;

                if (!chart.annotationsPopupContainer) {
                    // Get and store the popup annotations container
                    chart.annotationsPopupContainer = document
                        .getElementsByClassName(
                            'highcharts-popup-annotations'
                        )[0];
                }

                // Show the popup container, but not when we add the
                // annotation.
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
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ]
    },
    yAxis: {
        title: {
            text: 'Temperature (°C)'
        }
    },
    series: [{
        name: 'Reggane',
        data: [
            16.0, 18.2, 23.1, 27.9, 32.2, 36.4, 39.8, 38.4, 35.5, 29.2,
            22.0, 17.8
        ]
    }, {
        name: 'Tallinn',
        data: [
            -2.9, -3.6, -0.6, 4.8, 10.2, 14.5, 17.6, 16.5, 12.0, 6.5,
            2.0, -0.9
        ]
    }]
});