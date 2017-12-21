/* global highchartsData */

var colors = ['#992222', '#229922', '#229922'];

function createSnow() {
    var arr = [];
    for (var i = 0; i < 100; i++) {
        arr.push({
            x: Math.random() * 100,
            y: Math.random() * 100,
            z: Math.random() * 100
        });
    }
    return arr;
}

highchartsData.forEach(function (chan) {
    chan.sort(function (a, b) {
        return a.x - b.x;
    });
});

var snowman = document.getElementById('snowman'),
    tooltip = document.getElementById('tooltip'),
    clickToStart = document.getElementById('click-to-start'),
    bubble = clickToStart.getElementsByClassName('bubble')[0];

var chart = Highcharts.chart('highcharts-container', {
    colors: colors,
    chart: {
        alignTicks: false,
        spacingRight: 110,
        spacingTop: 30,
        type: 'line',
        animation: false,
        backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
            stops: [[0, 'rgb(48, 48, 96)'], [1, 'rgb(0, 0, 0)']]
        }
    },
    exporting: {
        enabled: false
    },
    title: {
        text: 'Happy Holidays!',
        style: {
            fontFamily: 'Great Vibes, cursive',
            fontSize: '36px',
            color: '#Fafafa',
            whiteSpace: 'nowrap'
        }
    },
    subtitle: {
        text: '...from your friends at Highcharts',
        style: {
            fontFamily: 'verdana, sans-serif',
            fontSize: '18px',
            color: '#Fafafa'
        }
    },
    sonification: {
        maxDuration: 1000000,
        minPointDuration: 40,
        mode: 'musical',
        polyphonic: true,
        waveType: 'sine',
        maxPointDuration: 200,
        startRampTime: 0.01,
        endRampTime: 0.01,
        maxFrequency: 1661.2187903197805,
        minFrequency: 155.56349186104046
    },
    plotOptions: {
        line: {
            step: 'center'
        },
        series: {
            turboThreshold: 1000000
        }
    },

    legend: {
        enabled: false
    },
    series: [
        {
            sonification: {
                enabled: false
            },
            name: 'Snow',
            type: 'scatter',
            data: createSnow(),
            minSize: 30,
            maxSize: 50,
            color: 'rgba(255, 255, 255, 1)',
            xAxis: 1,
            yAxis: 1,
            enableMouseTracking: false
        },
        {
            sonification: {
                waveType: 'sine',
                showCursor: true
            },

            data: highchartsData[0]
        },
        {
            sonification: {
                showCursor: true,
                waveType: 'square',
                pan: -0.2
            },

            data: highchartsData[1]
        },
        {
            sonification: {
                showCursor: true,
                waveType: 'triangle',
                pan: 0.2
            },
            data: highchartsData[2]
        }
    ],
    xAxis: [
        {
            type: 'datetime',
            gridLineWidth: 0,
            lineWidth: 0,
            tickWidth: 0,
            labels: {
                format: '{value:%S}s',
                style: {
                    color: '#afafaf'
                }
            }
        },
        {
            min: 0,
            max: 100,
            visible: false
        }
    ],
    yAxis: [
        {
            max: 1800,
            gridLineWidth: 0,
            title: {
                text: 'Frequency',
                style: {
                    color: '#afafaf'
                }
            },
            labels: {
                format: '{value} Hz',
                style: {
                    color: '#afafaf'
                }
            }
        },
        {
            visible: false,
            min: 0,
            max: 100
        }
    ],
    tooltip: {
        shared: true,
        useHTML: true,
        backgroundColor: 'rgba(0,0,0,0)',
        pointFormatter: function () {
            if (this.series.index === 2) {
                snowman.style.transform =
                  'rotate(' + Math.cos(this.x * 0.3) * 30 + 'deg)';
                tooltip.style.bottom = 60 + Math.sin(this.x / 10) * 10 + 'px';
            }
            return '';
        },
        headerFormat: '',
        borderWidth: 0,
        shadow: false
    },
    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                yAxis: {
                    visible: false
                }
            }
        }]
    }
});

function togglePlay() {
    if (chart.series[1].isSonifying) {
        clearTimeout(chart.clickToPlayTimeout);
        clickToStart.style.display = '';
    } else {
        clickToStart.style.display = 'none';
        chart.clickToPlayTimeout = setTimeout(function () {
            clickToStart.style.display = '';
        }, 39000);
    }
    chart.sonify();
}

if (Highcharts.supportsSonification) {
    clickToStart.onclick = snowman.onclick = togglePlay;
} else {
    bubble.innerHTML = 'Your browser does not support audio';
    bubble.className += ' unsupported';
}

setInterval(function () {
    // Let it snow
    if (chart.series[0].points) {
        chart.series[0].points.forEach(function (point) {
            if (!point) {
                return;
            }

            var y = point.y - 0.25 - point.z / 500;

            if (y < 0) {
                y = 100;
            }

            point.update({
                color: 'rgba(255, 255, 255, ' + point.y / 200 + ')',
                x: point.x - 0.1 + 0.2 * Math.random(),
                y: y
            }, false);
        });

        chart.redraw();
    }
}, 80);