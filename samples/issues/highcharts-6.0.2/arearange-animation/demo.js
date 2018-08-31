var chart;
var x = 0;



var clock = TestUtilities.lolexInstall();

chart = Highcharts.chart('container', {

    title: {
        text: 'Arearange animation'
    },

    subtitle: {
        text: 'Comparing how the elements look in the middle of animation'
    },

    chart: {
        type: 'arearange',
        animation: {
            duration: 50
        }
    },

    series: [{
        data: [
            [x++, 9, 18],
            [x++, 1, 8]
        ],
        lineColor: 'black',
        lineWidth: 2
    }]
});

chart.series[0].addPoint([
    x++,
    10,
    20
]);

clock.tick(26);

TestUtilities.lolexUninstall(clock);

