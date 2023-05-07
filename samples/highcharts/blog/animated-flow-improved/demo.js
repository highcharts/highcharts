Highcharts.chart('container', {
    colors: [
        '#293462', '#a64942', '#fe5f55', '#fff1c1', '#5bd1d7', '#ff502f',
        '#004d61', '#ff8a5c', '#fff591', '#f5587b', '#fad3cf', '#a696c8',
        '#5BE7C4', '#266A2E', '#593E1A'
    ],

    legend: {
        enabled: false
    },

    tooltip: {
        valueSuffix: ' Mbit/s'
    },

    title: {
        text: 'Cellular network download speed in years'
    },

    subtitle: {
        text: `With mobile phone generations | Source:
            <a href="https://wikipedia.org/" target="_blank">Wikipedia</a>`
    },

    xAxis: {
        type: 'datetime',
        plotLines: [{
            color: Highcharts.defaultOptions.colors[0],
            value: Date.UTC(1981, 0, 1),
            label: {
                text: '1G',
                rotation: 0
            }
        }, {
            color: Highcharts.defaultOptions.colors[1],
            value: Date.UTC(1991, 0, 1),
            label: {
                text: '2G',
                rotation: 0
            }
        }, {
            color: Highcharts.defaultOptions.colors[2],
            value: Date.UTC(1998, 0, 1),
            label: {
                text: '3G',
                rotation: 0
            }
        }, {
            color: Highcharts.defaultOptions.colors[3],
            value: Date.UTC(2007, 0, 1),
            label: {
                text: '4G',
                rotation: 0
            }
        }, {
            color: Highcharts.defaultOptions.colors[4],
            value: Date.UTC(2017, 0, 1),
            label: {
                text: '5G',
                rotation: 0
            }
        }]
    },

    yAxis: {
        type: 'logarithmic',
        title: {
            text: 'Download speed Mbit/s'
        }
    },

    series: [{
        type: 'spline',
        name: 'Download Speed',
        data: [{
            name: 'NMT',
            x: 347155200000,
            y: 0.0003624
        }, {
            name: 'D-AMPS TIA/EIA IS-54',
            x: 631152000000,
            y: 0.0486
        }, {
            name: 'GSM',
            x: 662688000000,
            y: 0.0096
        }, {
            name: 'cdmaOne TIA/EIA IS-95',
            x: 662688000001,
            y: 0.109863
        }, {
            name: 'D-AMPS TIA.EIA IS-136',
            x: 725846400000,
            y: 0.046349
        }, {
            name: 'UMTS',
            x: 915148800000,
            y: 0.384
        }, {
            name: 'GPRS',
            x: 946684800000,
            y: 0.12
        }, {
            name: 'cdma2000 1xEV-DO REV.0',
            x: 946684800001,
            y: 2.45
        }, {
            name: 'HSDPA',
            x: 978307200000,
            y: 21.6
        }, {
            name: 'cdma2000 1xEV-DO REV. A',
            x: 1041379200000,
            y: 3.1
        }, {
            name: 'HSUPA',
            x: 1041379200001,
            y: 5.73
        }, {
            name: 'WiMax 802.16e',
            x: 1104537600000,
            y: 10
        }, {
            name: 'cdma2000 1xEV-DO REV. B',
            x: 1136073600000,
            y: 4.9
        }, {
            name: 'HSPA+',
            x: 1167609600000,
            y: 42
        }, {
            name: 'LTE',
            x: 1199145600000,
            y: 100
        }, {
            name: 'cdma2000 1xEV-DO REV. C',
            x: 1230768000000,
            y: 200
        }, {
            name: 'WiMax 802.16m',
            x: 1262304000000,
            y: 100
        }, {
            name: 'LTE-Advanced',
            x: 1293840000000,
            y: 300
        }, {
            name: 'LTE-Advanced Pro',
            x: 1420070400000,
            y: 500
        }, {
            name: '5G',
            x: 1514764800000,
            y: 1000
        }, {
            name: '5G Advanced',
            x: 1609459200000,
            y: 1000
        }]
    }]
});
