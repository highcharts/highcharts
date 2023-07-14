var chart = Highcharts.chart('container', {
    title: {
        text: 'Logarithmic pitch mapping',
        align: 'left',
        margin: 25
    },
    legend: {
        enabled: false
    },
    sonification: {
        duration: 4000,
        defaultInstrumentOptions: {
            mapping: {
                pitch: {
                    min: 'c3',
                    max: 'c5',
                    mapFunction: 'logarithmic'
                }
            }
        }
    },
    series: [{
        data: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
            12, 13, 14, 15, 16, 17, 18, 19, 20,
            21, 22, 23, 24, 25
        ]
    }]
});


// ----------------------------------------------------
// Controls

document.getElementById('sonify').onclick = function () {
    chart.toggleSonify();
};

document.getElementById('logarithmicAxis').onclick = function () {
    chart.update({
        yAxis: {
            type: this.checked ? 'logarithmic' : 'linear'
        }
    });
};

document.getElementById('logarithmicMapping').onclick = function () {
    chart.update({
        sonification: {
            defaultInstrumentOptions: {
                mapping: {
                    pitch: {
                        mapFunction: this.checked ? 'logarithmic' : 'linear'
                    }
                }
            }
        }
    }, false);
};
