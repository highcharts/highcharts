Highcharts.chart('container', {

    colorAxis: {
        min: 0,
        max: 10,
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
        colorKey: 'colorValue',
        data: [{
            colorValue: 0,
            y: 35
        }, {
            colorValue: 3,
            y: 22
        }, {
            colorValue: 5,
            y: 14
        }, {
            colorValue: 7,
            y: 9
        }, {
            colorValue: 10,
            y: 60
        }, {
            colorValue: 10,
            y: 7
        }, {
            colorValue: 7,
            y: 15
        }, {
            colorValue: 5,
            y: 30
        }, {
            colorValue: 3,
            y: 45
        }, {
            colorValue: 0,
            y: 12
        }, {
            colorValue: 10,
            y: 25
        }]
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
