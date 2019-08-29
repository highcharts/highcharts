Highcharts.chart('container', {
    title: {
        text: 'Chart with Annotations GUI'
    },
    subtitle: {
        text: 'Use the buttons to add or edit annotations'
    },
    navigation: {
        events: {
            selectButton: function (event) {
                event.button.classList.add('highcharts-active');
            },
            deselectButton: function (event) {
                event.button.classList.remove('highcharts-active');
            }
        }
    },
    series: [{
        data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 23.3, 18.3, 13.9, 9.6]
    }]
});
