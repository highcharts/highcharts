Highcharts.chart('container', {
    chart: {
        zooming: {
            type: 'xy'
        }
    },
    title: {
        text: 'Average Monthly Weather Data for Tokyo'
    },
    subtitle: {
        text: 'Source: WorldClimate.com'
    },
    xAxis: [{
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        crosshair: true
    }],
    yAxis: [{ // Primary yAxis
        labels: {
            format: '{value}°C'
        },
        title: {
            text: 'Temperature'
        },
        opposite: true

    }, { // Secondary yAxis
        gridLineWidth: 0,
        title: {
            text: 'Rainfall'
        },
        labels: {
            format: '{value} mm'
        }

    }, { // Tertiary yAxis
        gridLineWidth: 0,
        title: {
            text: 'Sea-Level Pressure'
        },
        labels: {
            format: '{value} mb'
        },
        opposite: true
    }],
    tooltip: {
        shared: true
    },
    legend: {
        layout: 'vertical',
        align: 'left',
        x: 80,
        verticalAlign: 'top',
        y: 55,
        floating: true,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || // theme
            'rgba(255,255,255,0.25)'
    },
    series: [{
        name: 'Rainfall',
        type: 'column',
        yAxis: 1,
        data: [
            49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4
        ],
        tooltip: {
            valueSuffix: ' mm'
        }

    }, {
        name: 'Sea-Level Pressure',
        type: 'spline',
        yAxis: 2,
        data: [
            1016, 1016, 1015.9, 1015.5, 1012.3, 1009.5, 1009.6, 1010.2, 1013.1,
            1016.9, 1018.2, 1016.7
        ],
        marker: {
            enabled: false
        },
        dashStyle: 'shortdot',
        tooltip: {
            valueSuffix: ' mb'
        }

    }, {
        name: 'Temperature',
        type: 'spline',
        data: [
            7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6
        ],
        tooltip: {
            valueSuffix: ' °C'
        }
    }],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    floating: false,
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                    x: 0,
                    y: 0
                },
                yAxis: [{
                    labels: {
                        align: 'right',
                        x: 0,
                        y: -6
                    },
                    showLastLabel: false
                }, {
                    labels: {
                        align: 'left',
                        x: 0,
                        y: -6
                    },
                    showLastLabel: false
                }, {
                    visible: false
                }]
            }
        }]
    }
});

const announce = document.getElementById('announce');

const demoContainer = document.getElementById('chart-wrapper');
const demoButtons = document.querySelectorAll('.demo-button');
let bodyTheme = 'light';

const themeNames = ['Light Mode', 'Dark Mode', 'System Settings'];

function changeTheme(theme) {
    let nameIndex;

    // remove active state from all buttons
    demoButtons.forEach(function (btn, index) {
        btn.classList.remove('active');
        btn.ariaLabel = themeNames[index];
        if (btn.id === theme) {
            nameIndex = index;
        }
    });

    // add active state to the selected button
    document.getElementById(theme).classList.add('active');
    // eslint-disable-next-line max-len
    document.getElementById(theme).ariaLabel = themeNames[nameIndex] + ' selected';

    demoContainer.classList.remove('highcharts-light', 'highcharts-dark');
    demoContainer.classList.add(`highcharts-${theme}`);

    announce.textContent = '';
    announce.textContent = 'Chart theme changed to ' + themeNames[nameIndex];
}

document.getElementById('light').addEventListener('click', function () {
    changeTheme('light');

});

document.getElementById('dark').addEventListener('click', function () {
    changeTheme('dark');
});

document.getElementById('system').addEventListener('click', function () {
    changeTheme('system');
});

document.addEventListener('DOMContentLoaded', function () {
    // check if the body has 'highcharts-dark' class
    if (document.body.classList.contains('highcharts-dark')) {
        bodyTheme = 'dark';
    } else if (document.body.classList.contains('highcharts-light')) {
        bodyTheme = 'light';
    } else {
        bodyTheme = 'system';
    }
    changeTheme(bodyTheme);
});