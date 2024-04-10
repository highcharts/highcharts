// As I am using milliseconds in the data and would like to display a running
// number of hours, I am using the following function to convert from
// milliseconds to minutes and hours.

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
        text:
      'Source:<a href="https://www.mdpi.com/2072-6643/14/3/489" target="_blank">MDPI</a>'
    },
    xAxis: {
        title: {
            text: 'Time (hours)'
        },
        tickInterval: 10 * 60 * 60 * 1000,
        labels: {
            formatter: function () {
                return convertMsToHM(this.value).split(' ')[0];
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
    series: [
        {
            name: 'Food',
            data: [
                [828000, 3.19],
                [1008000, 38.09],
                [1440000, 69.63],
                [3456000, 73.93],
                [13680000, 55.13],
                [16956000, 40.64],
                [22464000, 18.62],
                [26928000, 8.69],
                [32256000, 2.52]
            ]
        },
        {
            name: 'Fatty Acid',
            data: [
                [3060000, 11.38],
                [11844000, 14.19],
                [22032000, 23.46],
                [30420000, 31.51],
                [45504000, 39.7],
                [61020000, 40.37],
                [75924000, 42.11],
                [124488000, 44.13],
                [160020000, 45.34],
                [218160000, 45.87],
                [260208000, 46.01]
            ]
        },
        {
            name: 'Glycogenolysis',
            data: [
                [8172000, 2.65],
                [9396000, 8.69],
                [13680000, 19.16],
                [18576000, 26.28],
                [27756000, 31.91],
                [36540000, 29.36],
                [43884000, 25.6],
                [54684000, 21.98],
                [67752000, 18.62],
                [79380000, 14.33],
                [90216000, 9.9],
                [103896000, 6.68],
                [117144000, 4.8],
                [129204000, 3.05],
                [139176000, 1.98]
            ]
        },
        {
            name: 'Gluconeogenesis',
            data: [
                [11628000, 2.65],
                [18360000, 5.34],
                [26136000, 8.83],
                [35496000, 13.26],
                [51012000, 18.36],
                [64296000, 21.31],
                [81036000, 23.32],
                [101844000, 24.66],
                [138996000, 27.08],
                [166752000, 27.75],
                [195516000, 27.75],
                [220428000, 27.62],
                [260208000, 27.48]
            ]
        },
        {
            name: 'Ketones',
            data: [
                [28980000, 2.11],
                [36324000, 3.46],
                [41652000, 4.53],
                [62028000, 10.7],
                [74304000, 13.26],
                [135108000, 20.23],
                [141840000, 21.17],
                [159588000, 22.11],
                [194292000, 22.79],
                [260208000, 22.79]
            ]
        },
        {
            name: 'Amino Acids',
            data: [
                [2448000, 15.54],
                [3672000, 18.36],
                [10008000, 21.04],
                [17136000, 21.58],
                [27144000, 19.03],
                [35928000, 16.21],
                [82044000, 11.11],
                [143064000, 8.56],
                [200232000, 7.62],
                [220824000, 7.35],
                [260208000, 7.48]
            ]
        }
    ]
});
