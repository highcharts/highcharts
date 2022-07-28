Highcharts.chart('container', {

    colorAxis: {
        stops: [
            [0.1, '#dceff5'],
            [0.3, '#87abd6'],
            [0.5, '#5c81b5'],
            [0.6, '#5470b3'],
            [0.9, '#2843b8'],
            [1, '#0f11a6']
        ]
    },

    series: [{
        type: 'column',
        data: [35, 22, 14, 9, 60, 7, 15, 30, 45, 12, 25]
    }]

}, chart => {

    document.getElementById('lightThemeBtn').addEventListener('click', () => {
        chart.update({
            colorAxis: {
                stops: [
                    [0.1, '#dceff5'],
                    [0.3, '#87abd6'],
                    [0.5, '#5c81b5'],
                    [0.6, '#5470b3'],
                    [0.9, '#2843b8'],
                    [1, '#0f11a6']
                ]
            }
        });
    });

    document.getElementById('darkThemeBtn').addEventListener('click', () => {
        chart.update({
            colorAxis: {
                stops: [
                    [0.1, '#dceff5'],
                    [0.2, '#87abd6'],
                    [0.3, '#5c81b5'],
                    [0.4, '#5470b3'],
                    [0.5, '#2843b8'],
                    [1, '#0f11a6']
                ]
            }
        });
    });

});
