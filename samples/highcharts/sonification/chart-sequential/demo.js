const chart = Highcharts.chart('container', {
    title: {
        text: 'Chart sonified in sequence',
        align: 'left',
        margin: 25
    },
    legend: {
        enabled: false
    },
    sonification: {
        order: 'sequential', // This is the default
        duration: 3000
    },
    accessibility: {
        landmarkVerbosity: 'one'
    },
    series: [{
        data: [4, 5, 6, 5, 7, 9, 11, 13]
    }, {
        data: [1, 3, 4, 2]
    }]
});

document.getElementById('sonify').onclick = function () {
    chart.toggleSonify();
};
