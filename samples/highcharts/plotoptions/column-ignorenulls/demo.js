Highcharts.chart('container', {

    chart: {
        type: 'column'
    },

    plotOptions: {
        column: {
            minPointLength: 2
        }
    },

    title: {
        text: '8 biggest airlines\' fleet size by aircraft type'
    },

    subtitle: {
        text: 'May 23, 2019'
    },

    xAxis: {
        title: {
            text: 'Aircraft type',
            y: 5
        },
        categories: ['Widebody', 'Narrowbody', 'Regional aircraft'],
        tickWidth: 1
    },

    yAxis: {
        title: 'Fleet size'
    },

    series: [{
        name: '1. American Airlines',
        data: [155, 782, 20]
    }, {
        name: '2. Delta Air Lines',
        data: [151, 729, null]
    }, {
        name: '3. United Airlines',
        data: [191, 586, null]
    }, {
        name: '4. Southwest Airlines',
        data: [null, 753, null]
    }, {
        name: '5. China Southern Airlines',
        data: [97, 463, 19]
    }, {
        name: '6. China Eastern Airlines',
        data: [91, 513, 3]
    }, {
        name: '7. SkyWest',
        data: [null, null, 486]
    }, {
        name: '8. Ryanair',
        data: [null, 456, null]
    }]

}, function (chart) {
    const options = [false, 'normal', 'evenlySpaced', 'fillSpace'],
        buttons = [...document.getElementsByTagName('button')];

    buttons.forEach(function (btn, i) {
        btn.addEventListener('click', function () {
            chart.update({
                plotOptions: {
                    series: {
                        ignoreNulls: options[i]
                    }
                }
            });
        });
    });

});