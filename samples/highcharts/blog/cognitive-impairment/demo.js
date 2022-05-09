function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function convertMsToHM(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    seconds = seconds % 60;
    minutes = seconds >= 30 ? minutes + 1 : minutes;
    minutes = minutes % 60;
    return `${padTo2Digits(hours)}h ${padTo2Digits(minutes)}m`;
}


Highcharts.chart('container', {
    chart: {
        type: 'spline'
    },
    title: {
        text: 'Metabolic provenance of energy'
    },
    subtitle: {
        text: 'Source:<a href="https://www.mdpi.com/2072-6643/14/3/489" target="_blank">MDPI</a>'
    },
    xAxis: {
        title: {
            text: 'Time (hours)'
        },
        tickInterval: 10 * 60 * 60 * 1000,
        labels: {
            formatter: function () {
                return convertMsToHM(this.value).split(" ")[0];
            }
        }
    },
    yAxis: {
        title: {
            text: 'Contribution to EE (%)'
        },
        labels: {
            format: '{text}%'
        }
    },
    tooltip: {
        formatter: function () {
            return `Time: ${convertMsToHM(this.x)}`;
        }
    },
    plotOptions: {
        spline: {
            dataLabels: {
                enabled: false
            },
            marker: {
                enabled: false
            }
        }
    },
    series: [{
        name: 'Food',
        data: [{ x: 828000, y: 3.19 },
            { x: 1008000, y: 38.09 },
            { x: 1440000, y: 69.63 },
            { x: 3456000, y: 73.93 },
            { x: 13680000, y: 55.13 },
            { x: 16956000, y: 40.64 },
            { x: 22464000, y: 18.62 },
            { x: 26928000, y: 8.69 },
            { x: 32256000, y: 2.52 }
        ]
    }, {
        name: 'Fatty Acid',
        data: [{ x: 3060000, y: 11.38 },
            { x: 11844000, y: 14.19 },
            { x: 22032000, y: 23.46 },
            { x: 30420000, y: 31.51 },
            { x: 45504000, y: 39.7 },
            { x: 61020000, y: 40.37 },
            { x: 75924000, y: 42.11 },
            { x: 124488000, y: 44.13 },
            { x: 160020000, y: 45.34 },
            { x: 218160000, y: 45.87 },
            { x: 260208000, y: 46.01 }
        ]
    }, {
        name: 'Glycogenolysis',
        data: [{ x: 8172000, y: 2.65 },
            { x: 9396000, y: 8.69 },
            { x: 13680000, y: 19.16 },
            { x: 18576000, y: 26.28 },
            { x: 27756000, y: 31.91 },
            { x: 36540000, y: 29.36 },
            { x: 43884000, y: 25.6 },
            { x: 54684000, y: 21.98 },
            { x: 67752000, y: 18.62 },
            { x: 79380000, y: 14.33 },
            { x: 90216000, y: 9.9 },
            { x: 103896000, y: 6.68 },
            { x: 117144000, y: 4.8 },
            { x: 129204000, y: 3.05 },
            { x: 139176000, y: 1.98 }
        ]
    }, {
        name: 'Gluconeogenesis',
        data: [{ x: 11628000, y: 2.65 },
            { x: 18360000, y: 5.34 },
            { x: 26136000, y: 8.83 },
            { x: 35496000, y: 13.26 },
            { x: 51012000, y: 18.36 },
            { x: 64296000, y: 21.31 },
            { x: 81036000, y: 23.32 },
            { x: 101844000, y: 24.66 },
            { x: 138996000, y: 27.08 },
            { x: 166752000, y: 27.75 },
            { x: 195516000, y: 27.75 },
            { x: 220428000, y: 27.62 },
            { x: 260208000, y: 27.48 }
        ]
    }, {
        name: 'Ketones',
        data: [{ x: 28980000, y: 2.11 },
            { x: 36324000, y: 3.46 },
            { x: 41652000, y: 4.53 },
            { x: 62028000, y: 10.7 },
            { x: 74304000, y: 13.26 },
            { x: 135108000, y: 20.23 },
            { x: 141840000, y: 21.17 },
            { x: 159588000, y: 22.11 },
            { x: 194292000, y: 22.79 },
            { x: 260208000, y: 22.79 }
        ]
    }, {
        name: 'Amino Acids',
        data: [{ x: 2448000, y: 15.54 },
            { x: 3672000, y: 18.36 },
            { x: 10008000, y: 21.04 },
            { x: 17136000, y: 21.58 },
            { x: 27144000, y: 19.03 },
            { x: 35928000, y: 16.21 },
            { x: 82044000, y: 11.11 },
            { x: 143064000, y: 8.56 },
            { x: 200232000, y: 7.62 },
            { x: 220824000, y: 7.35 },
            { x: 260208000, y: 7.48 }
        ]
    }]
});
