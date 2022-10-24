Highcharts.chart('container', {
    title: {
        text: 'Chart with Annotations GUI'
    },
    subtitle: {
        text: 'Use the dropdown to add or edit annotations'
    },
    navigation: {
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
            }
        }
    },

    series: [{
        data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 23.3, 18.3, 13.9, 9.6]
    }]
});
