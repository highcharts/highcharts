const chart = Highcharts.chart('container', {
    title: {
        text: 'Dynamic data'
    },
    subtitle: {
        text: 'Click button to animate or explore chart'
    },
    accessibility: {
        enabled: false
    },
    tooltip: {
        dateTimeLabelFormats: {
            day: '%H:%M',
            hour: '%H:%M'
        }
    },
    xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
            day: '%H:%M',
            hour: '%H:%M'
        }
    },
    plotOptions: {
        series: {
            pointStart: 0,
            pointInterval: 1000 * 60 * 60
        }
    },
    series: [{
        name: 'Random data',
        data: [1, 3, 4, 6, 7, 5, 3, 4, 8, 9, 7, 6, 4, 3]
    }]
});

let intervalId;
let isAnimating = false;

const toggleButton = document.getElementById('toggle');
toggleButton.onclick = function () {
    toggleAnimation();
};

function toggleAnimation() {
    if (isAnimating) {
        clearInterval(intervalId);
        chart.update({
            accessibility: {
                enabled: true
            }
        });
        toggleButton.textContent = 'Start animating';
    } else {
        intervalId = setInterval(function () {
            chart.series[0].addPoint(Math.round(Math.random() * 10));
        }, 500);
        chart.update({
            accessibility: {
                enabled: false
            }
        });
        toggleButton.textContent = 'Stop animating';
    }
    isAnimating = !isAnimating;
}

// Start animating by default
toggleAnimation();
