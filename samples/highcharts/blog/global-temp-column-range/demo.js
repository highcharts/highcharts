Highcharts.theme = {
    chart: {
        style: {
            fontFamily: 'Roboto Condensed'
        },
        backgroundColor: '#323331'
    },
    yAxis: {
        gridLineColor: '#B71C1C',
        labels: {
            format: '{value} C',
            useHTML: true
        }
    },
    plotOptions: {
        series: {
            showInLegend: false
        }
    }
};

Highcharts.setOptions(Highcharts.theme);

Highcharts.chart('container', {
    title: {
        text: ''
    },
    yAxis: {
        title: {
            text: ''
        },
        tickPositions: [-2, 0, 1.5, 2]
    },
    credits: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    plotOptions: {
        series: {
            turboThreshold: 0
        }
    },
    xAxis: {
        type: 'datetime'
    },
    series: [{
        data: [{
            x: -3.7868e+012,
            low: -1.102,
            high: -0.299,
            name: '1850 Jan',
            color: 'rgba(2,1,10,0.65)'
        }, {
            x: -3.7841e+012,
            low: -0.675,
            high: 0.114,
            name: '1850 Feb',
            color: 'rgba(107,23,108,0.65)'
        }, {
            x: -3.7817e+012,
            low: -1.08,
            high: -0.383,
            name: '1850 Mar',
            color: 'rgba(1,0,8,0.65)'
        }, {
            x: -3.779e+012,
            low: -0.903,
            high: -0.237,
            name: '1850 Apr',
            color: 'rgba(9,4,26,0.65)'
        }, {
            x: -3.7765e+012,
            low: -0.662,
            high: 0.006,
            name: '1850 May',
            color: 'rgba(84,15,107,0.65)'
        }, {
            x: -3.7738e+012,
            low: -0.515,
            high: 0.084,
            name: '1850 Jun',
            color: 'rgba(148,38,100,0.65)'
        }, {
            x: -3.7712e+012,
            low: -0.458,
            high: 0.199,
            name: '1850 Jul',
            color: 'rgba(192,59,78,0.65)'
        }, {
            x: -3.7685e+012,
            low: -0.596,
            high: 0.132,
            name: '1850 Aug',
            color: 'rgba(135,33,104,0.65)'
        }, {
            x: -3.7658e+012,
            low: -0.818,
            high: -0.071,
            name: '1850 Sep',
            color: 'rgba(32,12,70,0.65)'
        }, {
            x: -3.7632e+012,
            low: -0.794,
            high: -0.105,
            name: '1850 Oct',
            color: 'rgba(29,12,68,0.65)'
        }, {
            x: -3.7606e+012,
            low: -0.49,
            high: 0.108,
            name: '1850 Nov',
            color: 'rgba(161,42,97,0.65)'
        }, {
            x: -3.758e+012,
            low: -0.573,
            high: 0.04,
            name: '1850 Dec',
            color: 'rgba(116,26,108,0.65)'
        }, {
            x: -3.7553e+012,
            low: -0.708,
            high: 0.103,
            name: '1850 Jan',
            color: 'rgba(97,19,107,0.65)'
        }, {
            x: -3.7526e+012,
            low: -0.74,
            high: 0.027,
            name: '1850 Feb',
            color: 'rgba(65,12,98,0.65)'
        }, {
            x: -3.7502e+012,
            low: -0.812,
            high: -0.155,
            name: '1850 Mar',
            color: 'rgba(21,9,52,0.65)'
        }, {
            x: -3.7475e+012,
            low: -0.749,
            high: -0.138,
            name: '1850 Apr',
            color: 'rgba(31,12,70,0.65)'
        }, {
            x: -3.7449e+012,
            low: -0.615,
            high: 0.005,
            name: '1850 May',
            color: 'rgba(97,20,108,0.65)'
        }, {
            x: -3.7422e+012,
            low: -0.487,
            high: 0.102,
            name: '1850 Jun',
            color: 'rgba(162,43,96,0.65)'
        }, {
            x: -3.7397e+012,
            low: -0.546,
            high: 0.116,
            name: '1850 Jul',
            color: 'rgba(147,37,100,0.65)'
        }, {
            x: -3.737e+012,
            low: -0.491,
            high: 0.185,
            name: '1850 Aug',
            color: 'rgba(181,53,85,0.65)'
        }, {
            x: -3.7343e+012,
            low: -0.475,
            high: 0.26,
            name: '1850 Sep',
            color: 'rgba(202,65,72,0.65)'
        }, {
            x: -3.7317e+012,
            low: -0.4,
            high: 0.28,
            name: '1850 Oct',
            color: 'rgba(220,84,54,0.65)'
        }, {
            x: -3.729e+012,
            low: -0.359,
            high: 0.298,
            name: '1850 Nov',
            color: 'rgba(232,99,42,0.65)'
        }, {
            x: -3.7264e+012,
            low: -0.391,
            high: 0.254,
            name: '1850 Dec',
            color: 'rgba(218,82,57,0.65)'
        }, {
            x: -3.7238e+012,
            low: -0.72,
            high: 0.108,
            name: '1850 Jan',
            color: 'rgba(94,18,107,0.65)'
        }, {
            x: -3.7211e+012,
            low: -0.841,
            high: -0.112,
            name: '1850 Feb',
            color: 'rgba(22,10,56,0.65)'
        }, {
            x: -3.7186e+012,
            low: -0.825,
            high: -0.183,
            name: '1850 Mar',
            color: 'rgba(19,8,47,0.65)'
        }, {
            x: -3.7159e+012,
            low: -0.866,
            high: -0.249,
            name: '1850 Apr',
            color: 'rgba(10,4,29,0.65)'
        }, {
            x: -3.7133e+012,
            low: -0.52,
            high: 0.099,
            name: '1850 May',
            color: 'rgba(150,38,100,0.65)'
        }, {
            x: -3.7106e+012,
            low: -0.327,
            high: 0.241,
            name: '1850 Jun',
            color: 'rgba(229,96,44,0.65)'
        }, {
            x: -3.708e+012,
            low: -0.328,
            high: 0.298,
            name: '1850 Jul',
            color: 'rgba(235,103,38,0.65)'
        }, {
            x: -3.7054e+012,
            low: -0.541,
            high: 0.146,
            name: '1850 Aug',
            color: 'rgba(158,41,97,0.65)'
        }, {
            x: -3.7027e+012,
            low: -0.487,
            high: 0.241,
            name: '1850 Sep',
            color: 'rgba(193,60,78,0.65)'
        }, {
            x: -3.7001e+012,
            low: -0.526,
            high: 0.097,
            name: '1850 Oct',
            color: 'rgba(146,37,101,0.65)'
        }, {
            x: -3.6974e+012,
            low: -0.479,
            high: 0.103,
            name: '1850 Nov',
            color: 'rgba(163,43,96,0.65)'
        }, {
            x: -3.6948e+012,
            low: -0.244,
            high: 0.407,
            name: '1850 Dec',
            color: 'rgba(249,148,9,0.65)'
        }, {
            x: -3.6921e+012,
            low: -0.539,
            high: 0.189,
            name: '1850 Jan',
            color: 'rgba(168,46,93,0.65)'
        }, {
            x: -3.6895e+012,
            low: -0.671,
            high: 0.013,
            name: '1850 Feb',
            color: 'rgba(83,14,107,0.65)'
        }, {
            x: -3.687e+012,
            low: -0.606,
            high: -0.026,
            name: '1850 Mar',
            color: 'rgba(88,16,107,0.65)'
        }, {
            x: -3.6844e+012,
            low: -0.649,
            high: -0.051,
            name: '1850 Apr',
            color: 'rgba(70,12,103,0.65)'
        }, {
            x: -3.6818e+012,
            low: -0.58,
            high: 0.038,
            name: '1850 May',
            color: 'rgba(116,26,108,0.65)'
        }, {
            x: -3.6791e+012,
            low: -0.451,
            high: 0.089,
            name: '1850 Jun',
            color: 'rgba(168,45,93,0.65)'
        }, {
            x: -3.6765e+012,
            low: -0.369,
            high: 0.255,
            name: '1850 Jul',
            color: 'rgba(222,87,53,0.65)'
        }, {
            x: -3.6738e+012,
            low: -0.499,
            high: 0.198,
            name: '1850 Aug',
            color: 'rgba(183,54,84,0.65)'
        }, {
            x: -3.6711e+012,
            low: -0.756,
            high: -0.059,
            name: '1850 Sep',
            color: 'rgba(44,12,80,0.65)'
        }, {
            x: -3.6685e+012,
            low: -0.658,
            high: -0.055,
            name: '1850 Oct',
            color: 'rgba(67,12,100,0.65)'
        }, {
            x: -3.6659e+012,
            low: -0.537,
            high: 0.023,
            name: '1850 Nov',
            color: 'rgba(122,28,108,0.65)'
        }, {
            x: -3.6633e+012,
            low: -0.742,
            high: -0.147,
            name: '1850 Dec',
            color: 'rgba(32,12,70,0.65)'
        }, {
            x: -3.6606e+012,
            low: -0.709,
            high: -0.005,
            name: '1850 Jan',
            color: 'rgba(66,12,99,0.65)'
        }, {
            x: -3.6579e+012,
            low: -0.623,
            high: 0.065,
            name: '1850 Feb',
            color: 'rgba(109,24,108,0.65)'
        }, {
            x: -3.6555e+012,
            low: -0.554,
            high: -0.01,
            name: '1850 Mar',
            color: 'rgba(107,23,108,0.65)'
        }, {
            x: -3.6528e+012,
            low: -0.624,
            high: -0.074,
            name: '1850 Apr',
            color: 'rgba(72,12,104,0.65)'
        }, {
            x: -3.6502e+012,
            low: -0.524,
            high: 0.058,
            name: '1850 May',
            color: 'rgba(138,34,103,0.65)'
        }, {
            x: -3.6475e+012,
            low: -0.46,
            high: 0.029,
            name: '1850 Jun',
            color: 'rgba(147,37,100,0.65)'
        }, {
            x: -3.645e+012,
            low: -0.508,
            high: 0.059,
            name: '1850 Jul',
            color: 'rgba(138,34,103,0.65)'
        }, {
            x: -3.6423e+012,
            low: -0.476,
            high: 0.144,
            name: '1850 Aug',
            color: 'rgba(176,50,88,0.65)'
        }, {
            x: -3.6396e+012,
            low: -0.432,
            high: 0.206,
            name: '1850 Sep',
            color: 'rgba(199,63,74,0.65)'
        }, {
            x: -3.637e+012,
            low: -0.472,
            high: 0.104,
            name: '1850 Oct',
            color: 'rgba(162,43,96,0.65)'
        }, {
            x: -3.6343e+012,
            low: -0.64,
            high: -0.099,
            name: '1850 Nov',
            color: 'rgba(62,12,96,0.65)'
        }, {
            x: -3.6317e+012,
            low: -0.545,
            high: 0.079,
            name: '1850 Dec',
            color: 'rgba(136,33,104,0.65)'
        }, {
            x: -3.6291e+012,
            low: -0.549,
            high: 0.203,
            name: '1850 Jan',
            color: 'rgba(170,47,92,0.65)'
        }, {
            x: -3.6264e+012,
            low: -0.731,
            high: -0.063,
            name: '1850 Feb',
            color: 'rgba(49,12,85,0.65)'
        }, {
            x: -3.624e+012,
            low: -0.602,
            high: -0.001,
            name: '1850 Mar',
            color: 'rgba(97,19,107,0.65)'
        }, {
            x: -3.6213e+012,
            low: -0.487,
            high: 0.055,
            name: '1850 Apr',
            color: 'rgba(145,36,101,0.65)'
        }, {
            x: -3.6187e+012,
            low: -0.609,
            high: -0.066,
            name: '1850 May',
            color: 'rgba(79,13,107,0.65)'
        }, {
            x: -3.616e+012,
            low: -0.409,
            high: 0.085,
            name: '1850 Jun',
            color: 'rgba(178,51,87,0.65)'
        }, {
            x: -3.6134e+012,
            low: -0.518,
            high: -0.018,
            name: '1850 Jul',
            color: 'rgba(116,26,108,0.65)'
        }, {
            x: -3.6107e+012,
            low: -0.481,
            high: 0.157,
            name: '1850 Aug',
            color: 'rgba(179,52,87,0.65)'
        }, {
            x: -3.6081e+012,
            low: -0.65,
            high: -0.021,
            name: '1850 Sep',
            color: 'rgba(77,12,107,0.65)'
        }, {
            x: -3.6055e+012,
            low: -0.508,
            high: 0.089,
            name: '1850 Oct',
            color: 'rgba(150,38,100,0.65)'
        }, {
            x: -3.6028e+012,
            low: -0.495,
            high: 0.076,
            name: '1850 Nov',
            color: 'rgba(149,38,100,0.65)'
        }, {
            x: -3.6002e+012,
            low: -0.848,
            high: -0.174,
            name: '1850 Dec',
            color: 'rgba(17,7,44,0.65)'
        }, {
            x: -3.5975e+012,
            low: -0.544,
            high: 0.314,
            name: '1850 Jan',
            color: 'rgba(197,62,75,0.65)'
        }, {
            x: -3.5948e+012,
            low: -0.721,
            high: -0.015,
            name: '1850 Feb',
            color: 'rgba(60,12,94,0.65)'
        }, {
            x: -3.5923e+012,
            low: -0.813,
            high: -0.214,
            name: '1850 Mar',
            color: 'rgba(17,7,43,0.65)'
        }, {
            x: -3.5897e+012,
            low: -0.642,
            high: -0.099,
            name: '1850 Apr',
            color: 'rgba(61,12,95,0.65)'
        }, {
            x: -3.5871e+012,
            low: -0.394,
            high: 0.151,
            name: '1850 May',
            color: 'rgba(197,62,75,0.65)'
        }, {
            x: -3.5844e+012,
            low: -0.542,
            high: -0.04,
            name: '1850 Jun',
            color: 'rgba(104,22,108,0.65)'
        }, {
            x: -3.5818e+012,
            low: -0.574,
            high: -0.018,
            name: '1850 Jul',
            color: 'rgba(100,21,108,0.65)'
        }, {
            x: -3.5791e+012,
            low: -0.632,
            high: 0.024,
            name: '1850 Aug',
            color: 'rgba(96,19,107,0.65)'
        }, {
            x: -3.5764e+012,
            low: -0.773,
            high: -0.138,
            name: '1850 Sep',
            color: 'rgba(26,11,65,0.65)'
        }, {
            x: -3.5738e+012,
            low: -0.676,
            high: -0.086,
            name: '1850 Oct',
            color: 'rgba(56,12,90,0.65)'
        }, {
            x: -3.5712e+012,
            low: -0.866,
            high: -0.344,
            name: '1850 Nov',
            color: 'rgba(6,2,18,0.65)'
        }, {
            x: -3.5686e+012,
            low: -0.742,
            high: -0.137,
            name: '1850 Dec',
            color: 'rgba(34,12,72,0.65)'
        }, {
            x: -3.5659e+012,
            low: -0.876,
            high: -0.142,
            name: '1850 Jan',
            color: 'rgba(17,7,43,0.65)'
        }, {
            x: -3.5632e+012,
            low: -0.743,
            high: 0.065,
            name: '1850 Feb',
            color: 'rgba(74,12,106,0.65)'
        }, {
            x: -3.5608e+012,
            low: -0.735,
            high: -0.131,
            name: '1850 Mar',
            color: 'rgba(35,12,73,0.65)'
        }, {
            x: -3.5581e+012,
            low: -0.9,
            high: -0.392,
            name: '1850 Apr',
            color: 'rgba(4,2,14,0.65)'
        }, {
            x: -3.5555e+012,
            low: -0.834,
            high: -0.304,
            name: '1850 May',
            color: 'rgba(9,4,26,0.65)'
        }, {
            x: -3.5529e+012,
            low: -0.552,
            high: -0.073,
            name: '1850 Jun',
            color: 'rgba(93,18,107,0.65)'
        }, {
            x: -3.5503e+012,
            low: -0.798,
            high: -0.289,
            name: '1850 Jul',
            color: 'rgba(12,5,32,0.65)'
        }, {
            x: -3.5476e+012,
            low: -0.64,
            high: -0.014,
            name: '1850 Aug',
            color: 'rgba(83,15,107,0.65)'
        }, {
            x: -3.5449e+012,
            low: -0.697,
            high: -0.083,
            name: '1850 Sep',
            color: 'rgba(52,12,87,0.65)'
        }, {
            x: -3.5423e+012,
            low: -0.753,
            high: -0.18,
            name: '1850 Oct',
            color: 'rgba(24,10,60,0.65)'
        }, {
            x: -3.5396e+012,
            low: -0.947,
            high: -0.383,
            name: '1850 Nov',
            color: 'rgba(3,1,12,0.65)'
        }, {
            x: -3.537e+012,
            low: -0.687,
            high: -0.031,
            name: '1850 Dec',
            color: 'rgba(68,12,101,0.65)'
        }, {
            x: -3.5344e+012,
            low: -0.909,
            high: -0.148,
            name: '1850 Jan',
            color: 'rgba(13,6,36,0.65)'
        }, {
            x: -3.5317e+012,
            low: -1.074,
            high: -0.334,
            name: '1850 Feb',
            color: 'rgba(2,1,9,0.65)'
        }, {
            x: -3.5293e+012,
            low: -0.856,
            high: -0.25,
            name: '1850 Mar',
            color: 'rgba(11,5,31,0.65)'
        }, {
            x: -3.5266e+012,
            low: -0.779,
            high: -0.253,
            name: '1850 Apr',
            color: 'rgba(16,7,41,0.65)'
        }, {
            x: -3.524e+012,
            low: -0.925,
            high: -0.383,
            name: '1850 May',
            color: 'rgba(4,2,14,0.65)'
        }, {
            x: -3.5213e+012,
            low: -0.849,
            high: -0.32,
            name: '1850 Jun',
            color: 'rgba(8,3,23,0.65)'
        }, {
            x: -3.5187e+012,
            low: -0.584,
            high: -0.06,
            name: '1850 Jul',
            color: 'rgba(85,15,107,0.65)'
        }, {
            x: -3.516e+012,
            low: -0.612,
            high: 0.051,
            name: '1850 Aug',
            color: 'rgba(109,24,108,0.65)'
        }, {
            x: -3.5134e+012,
            low: -0.662,
            high: -0.015,
            name: '1850 Sep',
            color: 'rgba(77,12,107,0.65)'
        }, {
            x: -3.5108e+012,
            low: -0.507,
            high: 0.105,
            name: '1850 Oct',
            color: 'rgba(155,40,98,0.65)'
        }, {
            x: -3.5081e+012,
            low: -0.941,
            high: -0.349,
            name: '1850 Nov',
            color: 'rgba(4,2,15,0.65)'
        }, {
            x: -3.5055e+012,
            low: -0.629,
            high: 0.029,
            name: '1850 Dec',
            color: 'rgba(99,20,108,0.65)'
        }, {
            x: -3.5028e+012,
            low: -0.733,
            high: 0.12,
            name: '1850 Jan',
            color: 'rgba(94,19,107,0.65)'
        }, {
            x: -3.5002e+012,
            low: -0.62,
            high: 0.235,
            name: '1850 Feb',
            color: 'rgba(160,42,97,0.65)'
        }, {
            x: -3.4977e+012,
            low: -0.668,
            high: -0.005,
            name: '1850 Mar',
            color: 'rgba(80,13,107,0.65)'
        }, {
            x: -3.4951e+012,
            low: -0.49,
            high: 0.089,
            name: '1850 Apr',
            color: 'rgba(154,40,99,0.65)'
        }, {
            x: -3.4925e+012,
            low: -0.596,
            high: -0.027,
            name: '1850 May',
            color: 'rgba(93,18,107,0.65)'
        }, {
            x: -3.4898e+012,
            low: -0.528,
            high: 0.019,
            name: '1850 Jun',
            color: 'rgba(125,30,107,0.65)'
        }, {
            x: -3.4872e+012,
            low: -0.564,
            high: -0.008,
            name: '1850 Jul',
            color: 'rgba(105,22,108,0.65)'
        }, {
            x: -3.4845e+012,
            low: -0.42,
            high: 0.208,
            name: '1850 Aug',
            color: 'rgba(204,66,71,0.65)'
        }, {
            x: -3.4818e+012,
            low: -0.907,
            high: -0.241,
            name: '1850 Sep',
            color: 'rgba(9,4,24,0.65)'
        }, {
            x: -3.4792e+012,
            low: -0.563,
            high: 0.052,
            name: '1850 Oct',
            color: 'rgba(123,29,108,0.65)'
        }, {
            x: -3.4766e+012,
            low: -0.647,
            high: 0.01,
            name: '1850 Nov',
            color: 'rgba(89,17,107,0.65)'
        }, {
            x: -3.474e+012,
            low: -0.718,
            high: -0.013,
            name: '1850 Dec',
            color: 'rgba(64,12,98,0.65)'
        }, {
            x: -3.4713e+012,
            low: -0.611,
            high: 0.24,
            name: '1860 Jan',
            color: 'rgba(164,43,96,0.65)'
        }, {
            x: -3.4686e+012,
            low: -0.844,
            high: -0.014,
            name: '1860 Feb',
            color: 'rgba(37,12,74,0.65)'
        }, {
            x: -3.4661e+012,
            low: -1.014,
            high: -0.278,
            name: '1860 Mar',
            color: 'rgba(5,2,15,0.65)'
        }, {
            x: -3.4634e+012,
            low: -0.618,
            high: -0.052,
            name: '1860 Apr',
            color: 'rgba(80,13,107,0.65)'
        }, {
            x: -3.4608e+012,
            low: -0.589,
            high: 0.006,
            name: '1860 May',
            color: 'rgba(103,22,108,0.65)'
        }, {
            x: -3.4582e+012,
            low: -0.593,
            high: -0.028,
            name: '1860 Jun',
            color: 'rgba(94,19,107,0.65)'
        }, {
            x: -3.4556e+012,
            low: -0.383,
            high: 0.149,
            name: '1860 Jul',
            color: 'rgba(199,63,74,0.65)'
        }, {
            x: -3.4529e+012,
            low: -0.53,
            high: 0.141,
            name: '1860 Aug',
            color: 'rgba(160,42,97,0.65)'
        }, {
            x: -3.4502e+012,
            low: -0.557,
            high: 0.104,
            name: '1860 Sep',
            color: 'rgba(138,34,103,0.65)'
        }, {
            x: -3.4476e+012,
            low: -0.511,
            high: 0.108,
            name: '1860 Oct',
            color: 'rgba(156,40,98,0.65)'
        }, {
            x: -3.4449e+012,
            low: -0.827,
            high: -0.195,
            name: '1860 Nov',
            color: 'rgba(18,8,46,0.65)'
        }, {
            x: -3.4423e+012,
            low: -1.16,
            high: -0.352,
            name: '1860 Dec',
            color: 'rgba(1,0,7,0.65)'
        }, {
            x: -3.4397e+012,
            low: -1.37,
            high: -0.415,
            name: '1860 Jan',
            color: 'rgba(0,0,4,0.65)'
        }, {
            x: -3.437e+012,
            low: -1.038,
            high: 0.022,
            name: '1860 Feb',
            color: 'rgba(18,8,47,0.65)'
        }, {
            x: -3.4346e+012,
            low: -0.925,
            high: -0.009,
            name: '1860 Mar',
            color: 'rgba(25,11,62,0.65)'
        }, {
            x: -3.4319e+012,
            low: -0.73,
            high: -0.064,
            name: '1860 Apr',
            color: 'rgba(51,12,87,0.65)'
        }, {
            x: -3.4293e+012,
            low: -1.091,
            high: -0.427,
            name: '1860 May',
            color: 'rgba(1,0,6,0.65)'
        }, {
            x: -3.4266e+012,
            low: -0.501,
            high: 0.134,
            name: '1860 Jun',
            color: 'rgba(166,44,95,0.65)'
        }, {
            x: -3.424e+012,
            low: -0.528,
            high: 0.091,
            name: '1860 Jul',
            color: 'rgba(143,36,102,0.65)'
        }, {
            x: -3.4214e+012,
            low: -0.471,
            high: 0.248,
            name: '1860 Aug',
            color: 'rgba(202,65,72,0.65)'
        }, {
            x: -3.4187e+012,
            low: -0.69,
            high: 0.023,
            name: '1860 Sep',
            color: 'rgba(82,14,107,0.65)'
        }, {
            x: -3.4161e+012,
            low: -0.714,
            high: -0.007,
            name: '1860 Oct',
            color: 'rgba(69,12,102,0.65)'
        }, {
            x: -3.4134e+012,
            low: -0.797,
            high: -0.06,
            name: '1860 Nov',
            color: 'rgba(39,12,76,0.65)'
        }, {
            x: -3.4108e+012,
            low: -0.709,
            high: 0.198,
            name: '1860 Dec',
            color: 'rgba(124,29,107,0.65)'
        }, {
            x: -3.4081e+012,
            low: -1.325,
            high: -0.176,
            name: '1860 Jan',
            color: 'rgba(1,0,7,0.65)'
        }, {
            x: -3.4055e+012,
            low: -1.405,
            high: -0.15,
            name: '1860 Feb',
            color: 'rgba(0,0,5,0.65)'
        }, {
            x: -3.403e+012,
            low: -0.84,
            high: 0.03,
            name: '1860 Mar',
            color: 'rgba(49,12,85,0.65)'
        }, {
            x: -3.4004e+012,
            low: -0.566,
            high: 0.084,
            name: '1860 Apr',
            color: 'rgba(130,31,105,0.65)'
        }, {
            x: -3.3978e+012,
            low: -0.537,
            high: 0.074,
            name: '1860 May',
            color: 'rgba(136,33,104,0.65)'
        }, {
            x: -3.3951e+012,
            low: -0.629,
            high: -0.049,
            name: '1860 Jun',
            color: 'rgba(78,13,107,0.65)'
        }, {
            x: -3.3925e+012,
            low: -0.646,
            high: -0.04,
            name: '1860 Jul',
            color: 'rgba(77,12,107,0.65)'
        }, {
            x: -3.3898e+012,
            low: -1.05,
            high: -0.348,
            name: '1860 Aug',
            color: 'rgba(3,1,10,0.65)'
        }, {
            x: -3.3871e+012,
            low: -0.768,
            high: -0.057,
            name: '1860 Sep',
            color: 'rgba(43,12,80,0.65)'
        }, {
            x: -3.3845e+012,
            low: -0.814,
            high: -0.03,
            name: '1860 Oct',
            color: 'rgba(40,12,77,0.65)'
        }, {
            x: -3.3819e+012,
            low: -1.181,
            high: -0.335,
            name: '1860 Nov',
            color: 'rgba(1,0,6,0.65)'
        }, {
            x: -3.3793e+012,
            low: -1.368,
            high: -0.415,
            name: '1860 Dec',
            color: 'rgba(0,0,4,0.65)'
        }, {
            x: -3.3766e+012,
            low: -0.437,
            high: 0.702,
            name: '1860 Jan',
            color: 'rgba(250,165,17,0.65)'
        }, {
            x: -3.3739e+012,
            low: -0.623,
            high: 0.574,
            name: '1860 Feb',
            color: 'rgba(235,103,38,0.65)'
        }, {
            x: -3.3715e+012,
            low: -0.8,
            high: 0.085,
            name: '1860 Mar',
            color: 'rgba(68,12,101,0.65)'
        }, {
            x: -3.3688e+012,
            low: -0.577,
            high: 0.098,
            name: '1860 Apr',
            color: 'rgba(130,31,106,0.65)'
        }, {
            x: -3.3662e+012,
            low: -0.633,
            high: -0.014,
            name: '1860 May',
            color: 'rgba(88,16,107,0.65)'
        }, {
            x: -3.3636e+012,
            low: -0.706,
            high: -0.102,
            name: '1860 Jun',
            color: 'rgba(49,12,85,0.65)'
        }, {
            x: -3.361e+012,
            low: -0.733,
            high: -0.103,
            name: '1860 Jul',
            color: 'rgba(41,12,78,0.65)'
        }, {
            x: -3.3583e+012,
            low: -0.687,
            high: 0.039,
            name: '1860 Aug',
            color: 'rgba(87,16,107,0.65)'
        }, {
            x: -3.3556e+012,
            low: -0.702,
            high: 0.052,
            name: '1860 Sep',
            color: 'rgba(85,15,107,0.65)'
        }, {
            x: -3.353e+012,
            low: -0.791,
            high: 0.015,
            name: '1860 Oct',
            color: 'rgba(57,12,92,0.65)'
        }, {
            x: -3.3503e+012,
            low: -0.749,
            high: 0.072,
            name: '1860 Nov',
            color: 'rgba(81,14,107,0.65)'
        }, {
            x: -3.3477e+012,
            low: -0.816,
            high: 0.112,
            name: '1860 Dec',
            color: 'rgba(70,12,103,0.65)'
        }, {
            x: -3.3451e+012,
            low: -1.504,
            high: -0.373,
            name: '1860 Jan',
            color: 'rgba(0,0,4,0.65)'
        }, {
            x: -3.3424e+012,
            low: -1.202,
            high: -0.07,
            name: '1860 Feb',
            color: 'rgba(5,2,16,0.65)'
        }, {
            x: -3.3399e+012,
            low: -0.936,
            high: -0.085,
            name: '1860 Mar',
            color: 'rgba(18,8,45,0.65)'
        }, {
            x: -3.3372e+012,
            low: -0.849,
            high: -0.225,
            name: '1860 Apr',
            color: 'rgba(13,5,34,0.65)'
        }, {
            x: -3.3346e+012,
            low: -0.778,
            high: -0.125,
            name: '1860 May',
            color: 'rgba(30,12,69,0.65)'
        }, {
            x: -3.3319e+012,
            low: -0.455,
            high: 0.125,
            name: '1860 Jun',
            color: 'rgba(177,51,88,0.65)'
        }, {
            x: -3.3293e+012,
            low: -0.445,
            high: 0.145,
            name: '1860 Jul',
            color: 'rgba(184,55,83,0.65)'
        }, {
            x: -3.3267e+012,
            low: -0.655,
            high: 0.028,
            name: '1860 Aug',
            color: 'rgba(93,18,107,0.65)'
        }, {
            x: -3.324e+012,
            low: -0.831,
            high: -0.049,
            name: '1860 Sep',
            color: 'rgba(34,12,72,0.65)'
        }, {
            x: -3.3214e+012,
            low: -1.091,
            high: -0.322,
            name: '1860 Oct',
            color: 'rgba(3,1,10,0.65)'
        }, {
            x: -3.3187e+012,
            low: -0.826,
            high: -0.117,
            name: '1860 Nov',
            color: 'rgba(24,10,59,0.65)'
        }, {
            x: -3.3161e+012,
            low: -1.041,
            high: -0.171,
            name: '1860 Dec',
            color: 'rgba(7,3,20,0.65)'
        }, {
            x: -3.3134e+012,
            low: -0.667,
            high: 0.478,
            name: '1860 Jan',
            color: 'rgba(208,70,68,0.65)'
        }, {
            x: -3.3108e+012,
            low: -1.293,
            high: 0.08,
            name: '1860 Feb',
            color: 'rgba(7,3,20,0.65)'
        }, {
            x: -3.3083e+012,
            low: -1.101,
            high: -0.182,
            name: '1860 Mar',
            color: 'rgba(5,2,16,0.65)'
        }, {
            x: -3.3057e+012,
            low: -0.546,
            high: 0.097,
            name: '1860 Apr',
            color: 'rgba(141,35,102,0.65)'
        }, {
            x: -3.3031e+012,
            low: -0.582,
            high: 0.063,
            name: '1860 May',
            color: 'rgba(120,28,108,0.65)'
        }, {
            x: -3.3004e+012,
            low: -0.582,
            high: 0.036,
            name: '1860 Jun',
            color: 'rgba(115,26,108,0.65)'
        }, {
            x: -3.2978e+012,
            low: -0.449,
            high: 0.191,
            name: '1860 Jul',
            color: 'rgba(192,59,78,0.65)'
        }, {
            x: -3.2951e+012,
            low: -0.565,
            high: 0.144,
            name: '1860 Aug',
            color: 'rgba(151,39,99,0.65)'
        }, {
            x: -3.2924e+012,
            low: -0.473,
            high: 0.318,
            name: '1860 Sep',
            color: 'rgba(215,78,61,0.65)'
        }, {
            x: -3.2899e+012,
            low: -0.714,
            high: 0.154,
            name: '1860 Oct',
            color: 'rgba(113,25,108,0.65)'
        }, {
            x: -3.2872e+012,
            low: -0.611,
            high: 0.217,
            name: '1860 Nov',
            color: 'rgba(161,42,97,0.65)'
        }, {
            x: -3.2846e+012,
            low: -0.785,
            high: 0.1,
            name: '1860 Dec',
            color: 'rgba(78,13,107,0.65)'
        }, {
            x: -3.2819e+012,
            low: -0.504,
            high: 0.578,
            name: '1860 Jan',
            color: 'rgba(244,132,19,0.65)'
        }, {
            x: -3.2792e+012,
            low: -0.775,
            high: 0.336,
            name: '1860 Feb',
            color: 'rgba(149,38,100,0.65)'
        }, {
            x: -3.2768e+012,
            low: -1.017,
            high: -0.18,
            name: '1860 Mar',
            color: 'rgba(7,3,21,0.65)'
        }, {
            x: -3.2741e+012,
            low: -0.599,
            high: 0.068,
            name: '1860 Apr',
            color: 'rgba(118,27,108,0.65)'
        }, {
            x: -3.2715e+012,
            low: -0.869,
            high: -0.194,
            name: '1860 May',
            color: 'rgba(14,6,38,0.65)'
        }, {
            x: -3.2689e+012,
            low: -0.207,
            high: 0.413,
            name: '1860 Jun',
            color: 'rgba(250,156,8,0.65)'
        }, {
            x: -3.2663e+012,
            low: -0.286,
            high: 0.335,
            name: '1860 Jul',
            color: 'rgba(243,126,23,0.65)'
        }, {
            x: -3.2636e+012,
            low: -0.62,
            high: 0.089,
            name: '1860 Aug',
            color: 'rgba(119,27,108,0.65)'
        }, {
            x: -3.2609e+012,
            low: -0.598,
            high: 0.149,
            name: '1860 Sep',
            color: 'rgba(140,35,103,0.65)'
        }, {
            x: -3.2583e+012,
            low: -0.82,
            high: -0.021,
            name: '1860 Oct',
            color: 'rgba(41,12,78,0.65)'
        }, {
            x: -3.2556e+012,
            low: -0.738,
            high: 0.126,
            name: '1860 Nov',
            color: 'rgba(98,20,108,0.65)'
        }, {
            x: -3.253e+012,
            low: -0.834,
            high: 0.147,
            name: '1860 Dec',
            color: 'rgba(78,13,107,0.65)'
        }, {
            x: -3.2504e+012,
            low: -0.865,
            high: 0.253,
            name: '1860 Jan',
            color: 'rgba(96,19,107,0.65)'
        }, {
            x: -3.2477e+012,
            low: -0.605,
            high: 0.638,
            name: '1860 Feb',
            color: 'rgba(242,123,25,0.65)'
        }, {
            x: -3.2453e+012,
            low: -1.154,
            high: -0.283,
            name: '1860 Mar',
            color: 'rgba(2,1,9,0.65)'
        }, {
            x: -3.2426e+012,
            low: -0.568,
            high: 0.058,
            name: '1860 Apr',
            color: 'rgba(124,29,107,0.65)'
        }, {
            x: -3.24e+012,
            low: -0.864,
            high: -0.224,
            name: '1860 May',
            color: 'rgba(12,5,33,0.65)'
        }, {
            x: -3.2373e+012,
            low: -0.6,
            high: 0.002,
            name: '1860 Jun',
            color: 'rgba(101,21,108,0.65)'
        }, {
            x: -3.2347e+012,
            low: -0.527,
            high: 0.067,
            name: '1860 Jul',
            color: 'rgba(137,34,104,0.65)'
        }, {
            x: -3.2321e+012,
            low: -0.585,
            high: 0.124,
            name: '1860 Aug',
            color: 'rgba(140,35,103,0.65)'
        }, {
            x: -3.2294e+012,
            low: -0.464,
            high: 0.274,
            name: '1860 Sep',
            color: 'rgba(207,68,69,0.65)'
        }, {
            x: -3.2268e+012,
            low: -0.575,
            high: 0.208,
            name: '1860 Oct',
            color: 'rgba(168,45,93,0.65)'
        }, {
            x: -3.2241e+012,
            low: -0.73,
            high: 0.104,
            name: '1860 Nov',
            color: 'rgba(94,18,107,0.65)'
        }, {
            x: -3.2215e+012,
            low: -1.061,
            high: -0.199,
            name: '1860 Dec',
            color: 'rgba(6,2,17,0.65)'
        }, {
            x: -3.2188e+012,
            low: -1.332,
            high: -0.084,
            name: '1860 Jan',
            color: 'rgba(2,1,9,0.65)'
        }, {
            x: -3.2162e+012,
            low: -1.168,
            high: 0.229,
            name: '1860 Feb',
            color: 'rgba(25,11,61,0.65)'
        }, {
            x: -3.2136e+012,
            low: -0.56,
            high: 0.414,
            name: '1860 Mar',
            color: 'rgba(217,81,58,0.65)'
        }, {
            x: -3.211e+012,
            low: -0.677,
            high: -0.062,
            name: '1860 Apr',
            color: 'rgba(61,12,95,0.65)'
        }, {
            x: -3.2084e+012,
            low: -0.389,
            high: 0.24,
            name: '1860 May',
            color: 'rgba(217,81,58,0.65)'
        }, {
            x: -3.2057e+012,
            low: -0.483,
            high: 0.124,
            name: '1860 Jun',
            color: 'rgba(170,47,92,0.65)'
        }, {
            x: -3.2031e+012,
            low: -0.142,
            high: 0.436,
            name: '1860 Jul',
            color: 'rgba(249,172,24,0.65)'
        }, {
            x: -3.2004e+012,
            low: -0.374,
            high: 0.288,
            name: '1860 Aug',
            color: 'rgba(230,96,44,0.65)'
        }, {
            x: -3.1978e+012,
            low: -0.531,
            high: 0.139,
            name: '1860 Sep',
            color: 'rgba(157,41,98,0.65)'
        }, {
            x: -3.1952e+012,
            low: -0.578,
            high: 0.109,
            name: '1860 Oct',
            color: 'rgba(136,33,104,0.65)'
        }, {
            x: -3.1925e+012,
            low: -0.851,
            high: -0.152,
            name: '1860 Nov',
            color: 'rgba(19,8,49,0.65)'
        }, {
            x: -3.1899e+012,
            low: -0.546,
            high: 0.299,
            name: '1860 Dec',
            color: 'rgba(197,62,76,0.65)'
        }, {
            x: -3.1872e+012,
            low: -0.839,
            high: 0.318,
            name: '1860 Jan',
            color: 'rgba(121,28,108,0.65)'
        }, {
            x: -3.1845e+012,
            low: -0.255,
            high: 0.783,
            name: '1860 Feb',
            color: 'rgba(247,199,51,0.65)'
        }, {
            x: -3.1821e+012,
            low: -0.947,
            high: -0.225,
            name: '1860 Mar',
            color: 'rgba(8,3,22,0.65)'
        }, {
            x: -3.1794e+012,
            low: -0.501,
            high: 0.054,
            name: '1860 Apr',
            color: 'rgba(141,35,102,0.65)'
        }, {
            x: -3.1768e+012,
            low: -0.584,
            high: 0.021,
            name: '1860 May',
            color: 'rgba(108,24,108,0.65)'
        }, {
            x: -3.1742e+012,
            low: -0.65,
            high: -0.095,
            name: '1860 Jun',
            color: 'rgba(62,12,96,0.65)'
        }, {
            x: -3.1716e+012,
            low: -0.568,
            high: -0.01,
            name: '1860 Jul',
            color: 'rgba(105,22,108,0.65)'
        }, {
            x: -3.1689e+012,
            low: -0.412,
            high: 0.262,
            name: '1860 Aug',
            color: 'rgba(216,80,59,0.65)'
        }, {
            x: -3.1662e+012,
            low: -0.508,
            high: 0.14,
            name: '1860 Sep',
            color: 'rgba(164,43,96,0.65)'
        }, {
            x: -3.1636e+012,
            low: -0.752,
            high: -0.094,
            name: '1860 Oct',
            color: 'rgba(39,12,76,0.65)'
        }, {
            x: -3.1609e+012,
            low: -0.684,
            high: -0.064,
            name: '1860 Nov',
            color: 'rgba(60,12,94,0.65)'
        }, {
            x: -3.1584e+012,
            low: -0.723,
            high: 0.012,
            name: '1860 Dec',
            color: 'rgba(69,12,102,0.65)'
        }, {
            x: -3.1557e+012,
            low: -0.532,
            high: 0.373,
            name: '1870 Jan',
            color: 'rgba(213,76,62,0.65)'
        }, {
            x: -3.153e+012,
            low: -0.871,
            high: -0.041,
            name: '1870 Feb',
            color: 'rgba(29,12,68,0.65)'
        }, {
            x: -3.1506e+012,
            low: -0.721,
            high: -0.093,
            name: '1870 Mar',
            color: 'rgba(47,12,83,0.65)'
        }, {
            x: -3.1479e+012,
            low: -0.478,
            high: 0.054,
            name: '1870 Apr',
            color: 'rgba(148,38,100,0.65)'
        }, {
            x: -3.1453e+012,
            low: -0.447,
            high: 0.116,
            name: '1870 May',
            color: 'rgba(175,50,89,0.65)'
        }, {
            x: -3.1426e+012,
            low: -0.461,
            high: 0.039,
            name: '1870 Jun',
            color: 'rgba(150,38,100,0.65)'
        }, {
            x: -3.14e+012,
            low: -0.242,
            high: 0.277,
            name: '1870 Jul',
            color: 'rgba(241,121,26,0.65)'
        }, {
            x: -3.1374e+012,
            low: -0.586,
            high: 0.055,
            name: '1870 Aug',
            color: 'rgba(119,27,108,0.65)'
        }, {
            x: -3.1347e+012,
            low: -0.582,
            high: 0.054,
            name: '1870 Sep',
            color: 'rgba(118,27,108,0.65)'
        }, {
            x: -3.1321e+012,
            low: -0.742,
            high: -0.047,
            name: '1870 Oct',
            color: 'rgba(52,12,87,0.65)'
        }, {
            x: -3.1294e+012,
            low: -0.468,
            high: 0.147,
            name: '1870 Nov',
            color: 'rgba(176,50,89,0.65)'
        }, {
            x: -3.1268e+012,
            low: -1.104,
            high: -0.349,
            name: '1870 Dec',
            color: 'rgba(2,0,8,0.65)'
        }, {
            x: -3.1241e+012,
            low: -1.043,
            high: -0.008,
            name: '1870 Jan',
            color: 'rgba(15,6,38,0.65)'
        }, {
            x: -3.1215e+012,
            low: -1.07,
            high: -0.025,
            name: '1870 Feb',
            color: 'rgba(12,5,31,0.65)'
        }, {
            x: -3.119e+012,
            low: -0.375,
            high: 0.396,
            name: '1870 Mar',
            color: 'rgba(241,119,27,0.65)'
        }, {
            x: -3.1164e+012,
            low: -0.416,
            high: 0.129,
            name: '1870 Apr',
            color: 'rgba(185,55,83,0.65)'
        }, {
            x: -3.1138e+012,
            low: -0.604,
            high: -0.026,
            name: '1870 May',
            color: 'rgba(90,17,107,0.65)'
        }, {
            x: -3.1111e+012,
            low: -0.486,
            high: 0.038,
            name: '1870 Jun',
            color: 'rgba(142,36,102,0.65)'
        }, {
            x: -3.1085e+012,
            low: -0.265,
            high: 0.248,
            name: '1870 Jul',
            color: 'rgba(237,106,36,0.65)'
        }, {
            x: -3.1058e+012,
            low: -0.524,
            high: 0.077,
            name: '1870 Aug',
            color: 'rgba(143,36,102,0.65)'
        }, {
            x: -3.1031e+012,
            low: -0.777,
            high: -0.138,
            name: '1870 Sep',
            color: 'rgba(28,12,66,0.65)'
        }, {
            x: -3.1006e+012,
            low: -0.805,
            high: -0.159,
            name: '1870 Oct',
            color: 'rgba(22,9,55,0.65)'
        }, {
            x: -3.0979e+012,
            low: -0.86,
            high: -0.221,
            name: '1870 Nov',
            color: 'rgba(12,5,33,0.65)'
        }, {
            x: -3.0953e+012,
            low: -0.919,
            high: -0.215,
            name: '1870 Dec',
            color: 'rgba(10,4,28,0.65)'
        }, {
            x: -3.0926e+012,
            low: -0.762,
            high: 0.15,
            name: '1870 Jan',
            color: 'rgba(96,19,107,0.65)'
        }, {
            x: -3.0899e+012,
            low: -0.852,
            high: 0.037,
            name: '1870 Feb',
            color: 'rgba(49,12,85,0.65)'
        }, {
            x: -3.0874e+012,
            low: -0.83,
            high: -0.117,
            name: '1870 Mar',
            color: 'rgba(24,10,59,0.65)'
        }, {
            x: -3.0847e+012,
            low: -0.412,
            high: 0.115,
            name: '1870 Apr',
            color: 'rgba(183,54,84,0.65)'
        }, {
            x: -3.0821e+012,
            low: -0.313,
            high: 0.234,
            name: '1870 May',
            color: 'rgba(228,95,45,0.65)'
        }, {
            x: -3.0795e+012,
            low: -0.445,
            high: 0.028,
            name: '1870 Jun',
            color: 'rgba(151,39,100,0.65)'
        }, {
            x: -3.0769e+012,
            low: -0.376,
            high: 0.148,
            name: '1870 Jul',
            color: 'rgba(199,63,74,0.65)'
        }, {
            x: -3.0742e+012,
            low: -0.334,
            high: 0.272,
            name: '1870 Aug',
            color: 'rgba(233,100,40,0.65)'
        }, {
            x: -3.0715e+012,
            low: -0.425,
            high: 0.171,
            name: '1870 Sep',
            color: 'rgba(192,59,78,0.65)'
        }, {
            x: -3.0689e+012,
            low: -0.524,
            high: 0.072,
            name: '1870 Oct',
            color: 'rgba(140,35,103,0.65)'
        }, {
            x: -3.0662e+012,
            low: -0.527,
            high: 0.041,
            name: '1870 Nov',
            color: 'rgba(129,31,106,0.65)'
        }, {
            x: -3.0637e+012,
            low: -0.749,
            high: -0.102,
            name: '1870 Dec',
            color: 'rgba(39,12,76,0.65)'
        }, {
            x: -3.061e+012,
            low: -0.437,
            high: 0.4,
            name: '1870 Jan',
            color: 'rgba(235,103,38,0.65)'
        }, {
            x: -3.0583e+012,
            low: -0.815,
            high: 0.118,
            name: '1870 Feb',
            color: 'rgba(73,12,105,0.65)'
        }, {
            x: -3.0559e+012,
            low: -0.62,
            high: 0.064,
            name: '1870 Mar',
            color: 'rgba(112,25,108,0.65)'
        }, {
            x: -3.0532e+012,
            low: -0.79,
            high: -0.249,
            name: '1870 Apr',
            color: 'rgba(15,7,40,0.65)'
        }, {
            x: -3.0506e+012,
            low: -0.683,
            high: -0.141,
            name: '1870 May',
            color: 'rgba(43,12,80,0.65)'
        }, {
            x: -3.0479e+012,
            low: -0.511,
            high: -0.001,
            name: '1870 Jun',
            color: 'rgba(121,28,108,0.65)'
        }, {
            x: -3.0453e+012,
            low: -0.416,
            high: 0.097,
            name: '1870 Jul',
            color: 'rgba(177,51,88,0.65)'
        }, {
            x: -3.0427e+012,
            low: -0.455,
            high: 0.133,
            name: '1870 Aug',
            color: 'rgba(177,51,88,0.65)'
        }, {
            x: -3.04e+012,
            low: -0.649,
            high: -0.063,
            name: '1870 Sep',
            color: 'rgba(67,12,100,0.65)'
        }, {
            x: -3.0374e+012,
            low: -0.703,
            high: -0.103,
            name: '1870 Oct',
            color: 'rgba(49,12,85,0.65)'
        }, {
            x: -3.0347e+012,
            low: -0.736,
            high: -0.191,
            name: '1870 Nov',
            color: 'rgba(25,11,61,0.65)'
        }, {
            x: -3.0321e+012,
            low: -0.588,
            high: 0.032,
            name: '1870 Dec',
            color: 'rgba(110,24,108,0.65)'
        }, {
            x: -3.0294e+012,
            low: -0.422,
            high: 0.522,
            name: '1870 Jan',
            color: 'rgba(246,137,16,0.65)'
        }, {
            x: -3.0268e+012,
            low: -0.841,
            high: -0.051,
            name: '1870 Feb',
            color: 'rgba(34,12,72,0.65)'
        }, {
            x: -3.0243e+012,
            low: -0.886,
            high: -0.243,
            name: '1870 Mar',
            color: 'rgba(10,4,27,0.65)'
        }, {
            x: -3.0217e+012,
            low: -0.767,
            high: -0.242,
            name: '1870 Apr',
            color: 'rgba(18,8,46,0.65)'
        }, {
            x: -3.0191e+012,
            low: -0.751,
            high: -0.176,
            name: '1870 May',
            color: 'rgba(25,11,61,0.65)'
        }, {
            x: -3.0164e+012,
            low: -0.723,
            high: -0.194,
            name: '1870 Jun',
            color: 'rgba(27,12,66,0.65)'
        }, {
            x: -3.0138e+012,
            low: -0.434,
            high: 0.086,
            name: '1870 Jul',
            color: 'rgba(171,47,92,0.65)'
        }, {
            x: -3.0111e+012,
            low: -0.68,
            high: -0.063,
            name: '1870 Aug',
            color: 'rgba(62,12,96,0.65)'
        }, {
            x: -3.0084e+012,
            low: -0.492,
            high: 0.066,
            name: '1870 Sep',
            color: 'rgba(149,38,100,0.65)'
        }, {
            x: -3.0059e+012,
            low: -0.712,
            high: -0.164,
            name: '1870 Oct',
            color: 'rgba(35,12,73,0.65)'
        }, {
            x: -3.0032e+012,
            low: -0.773,
            high: -0.227,
            name: '1870 Nov',
            color: 'rgba(19,8,48,0.65)'
        }, {
            x: -3.0006e+012,
            low: -0.707,
            high: -0.108,
            name: '1870 Dec',
            color: 'rgba(46,12,82,0.65)'
        }, {
            x: -2.9979e+012,
            low: -0.957,
            high: -0.197,
            name: '1870 Jan',
            color: 'rgba(8,3,24,0.65)'
        }, {
            x: -2.9952e+012,
            low: -1.042,
            high: -0.195,
            name: '1870 Feb',
            color: 'rgba(6,2,18,0.65)'
        }, {
            x: -2.9928e+012,
            low: -0.897,
            high: -0.302,
            name: '1870 Mar',
            color: 'rgba(7,3,20,0.65)'
        }, {
            x: -2.9901e+012,
            low: -0.72,
            high: -0.207,
            name: '1870 Apr',
            color: 'rgba(26,11,63,0.65)'
        }, {
            x: -2.9875e+012,
            low: -0.434,
            high: 0.086,
            name: '1870 May',
            color: 'rgba(170,47,92,0.65)'
        }, {
            x: -2.9849e+012,
            low: -0.482,
            high: 0.013,
            name: '1870 Jun',
            color: 'rgba(134,33,104,0.65)'
        }, {
            x: -2.9823e+012,
            low: -0.544,
            high: -0.057,
            name: '1870 Jul',
            color: 'rgba(97,20,108,0.65)'
        }, {
            x: -2.9796e+012,
            low: -0.485,
            high: 0.112,
            name: '1870 Aug',
            color: 'rgba(166,44,95,0.65)'
        }, {
            x: -2.9769e+012,
            low: -0.575,
            high: 0.023,
            name: '1870 Sep',
            color: 'rgba(112,25,108,0.65)'
        }, {
            x: -2.9743e+012,
            low: -0.66,
            high: -0.083,
            name: '1870 Oct',
            color: 'rgba(61,12,95,0.65)'
        }, {
            x: -2.9716e+012,
            low: -0.765,
            high: -0.235,
            name: '1870 Nov',
            color: 'rgba(19,8,49,0.65)'
        }, {
            x: -2.969e+012,
            low: -0.782,
            high: -0.21,
            name: '1870 Dec',
            color: 'rgba(20,8,50,0.65)'
        }, {
            x: -2.9664e+012,
            low: -0.707,
            high: 0.083,
            name: '1870 Jan',
            color: 'rgba(92,18,107,0.65)'
        }, {
            x: -2.9637e+012,
            low: -0.607,
            high: 0.072,
            name: '1870 Feb',
            color: 'rgba(117,27,108,0.65)'
        }, {
            x: -2.9612e+012,
            low: -0.701,
            high: -0.07,
            name: '1870 Mar',
            color: 'rgba(56,12,91,0.65)'
        }, {
            x: -2.9585e+012,
            low: -0.56,
            high: -0.037,
            name: '1870 Apr',
            color: 'rgba(99,20,108,0.65)'
        }, {
            x: -2.9559e+012,
            low: -0.791,
            high: -0.277,
            name: '1870 May',
            color: 'rgba(14,6,37,0.65)'
        }, {
            x: -2.9532e+012,
            low: -0.535,
            high: -0.033,
            name: '1870 Jun',
            color: 'rgba(107,23,108,0.65)'
        }, {
            x: -2.9506e+012,
            low: -0.395,
            high: 0.127,
            name: '1870 Jul',
            color: 'rgba(189,57,81,0.65)'
        }, {
            x: -2.948e+012,
            low: -0.541,
            high: 0.057,
            name: '1870 Aug',
            color: 'rgba(130,31,106,0.65)'
        }, {
            x: -2.9453e+012,
            low: -0.736,
            high: -0.138,
            name: '1870 Sep',
            color: 'rgba(35,12,73,0.65)'
        }, {
            x: -2.9427e+012,
            low: -0.661,
            high: -0.114,
            name: '1870 Oct',
            color: 'rgba(55,12,90,0.65)'
        }, {
            x: -2.94e+012,
            low: -0.829,
            high: -0.319,
            name: '1870 Nov',
            color: 'rgba(9,4,24,0.65)'
        }, {
            x: -2.9374e+012,
            low: -1.008,
            high: -0.416,
            name: '1870 Dec',
            color: 'rgba(2,1,9,0.65)'
        }, {
            x: -2.9347e+012,
            low: -0.73,
            high: 0.074,
            name: '1870 Jan',
            color: 'rgba(84,15,107,0.65)'
        }, {
            x: -2.9321e+012,
            low: -0.303,
            high: 0.413,
            name: '1870 Feb',
            color: 'rgba(246,139,15,0.65)'
        }, {
            x: -2.9297e+012,
            low: -0.612,
            high: 0.026,
            name: '1870 Mar',
            color: 'rgba(102,21,108,0.65)'
        }, {
            x: -2.927e+012,
            low: -0.574,
            high: -0.078,
            name: '1870 Apr',
            color: 'rgba(84,15,107,0.65)'
        }, {
            x: -2.9244e+012,
            low: -0.703,
            high: -0.197,
            name: '1870 May',
            color: 'rgba(30,12,69,0.65)'
        }, {
            x: -2.9217e+012,
            low: -0.337,
            high: 0.16,
            name: '1870 Jun',
            color: 'rgba(210,72,66,0.65)'
        }, {
            x: -2.9191e+012,
            low: -0.263,
            high: 0.283,
            name: '1870 Jul',
            color: 'rgba(240,117,29,0.65)'
        }, {
            x: -2.9164e+012,
            low: -0.145,
            high: 0.441,
            name: '1870 Aug',
            color: 'rgba(249,173,25,0.65)'
        }, {
            x: -2.9138e+012,
            low: -0.253,
            high: 0.307,
            name: '1870 Sep',
            color: 'rgba(243,126,23,0.65)'
        }, {
            x: -2.9112e+012,
            low: -0.212,
            high: 0.323,
            name: '1870 Oct',
            color: 'rgba(246,138,15,0.65)'
        }, {
            x: -2.9085e+012,
            low: -0.147,
            high: 0.361,
            name: '1870 Nov',
            color: 'rgba(250,156,8,0.65)'
        }, {
            x: -2.9059e+012,
            low: -0.111,
            high: 0.458,
            name: '1870 Dec',
            color: 'rgba(249,178,30,0.65)'
        }, {
            x: -2.9032e+012,
            low: -0.2,
            high: 0.543,
            name: '1870 Jan',
            color: 'rgba(249,178,30,0.65)'
        }, {
            x: -2.9005e+012,
            low: 0.074,
            high: 0.733,
            name: '1870 Feb',
            color: 'rgba(248,219,84,0.65)'
        }, {
            x: -2.8981e+012,
            low: 0.048,
            high: 0.631,
            name: '1870 Mar',
            color: 'rgba(247,211,68,0.65)'
        }, {
            x: -2.8954e+012,
            low: 0.077,
            high: 0.572,
            name: '1870 Apr',
            color: 'rgba(247,209,62,0.65)'
        }, {
            x: -2.8928e+012,
            low: -0.34,
            high: 0.167,
            name: '1870 May',
            color: 'rgba(212,74,64,0.65)'
        }, {
            x: -2.8902e+012,
            low: -0.232,
            high: 0.261,
            name: '1870 Jun',
            color: 'rgba(241,120,27,0.65)'
        }, {
            x: -2.8876e+012,
            low: -0.311,
            high: 0.21,
            name: '1870 Jul',
            color: 'rgba(224,90,50,0.65)'
        }, {
            x: -2.8849e+012,
            low: -0.319,
            high: 0.269,
            name: '1870 Aug',
            color: 'rgba(233,101,40,0.65)'
        }, {
            x: -2.8822e+012,
            low: -0.244,
            high: 0.276,
            name: '1870 Sep',
            color: 'rgba(241,121,26,0.65)'
        }, {
            x: -2.8796e+012,
            low: -0.392,
            high: 0.156,
            name: '1870 Oct',
            color: 'rgba(197,62,76,0.65)'
        }, {
            x: -2.8769e+012,
            low: -0.455,
            high: 0.052,
            name: '1870 Nov',
            color: 'rgba(154,40,99,0.65)'
        }, {
            x: -2.8744e+012,
            low: -0.635,
            high: -0.084,
            name: '1870 Dec',
            color: 'rgba(66,12,99,0.65)'
        }, {
            x: -2.8717e+012,
            low: -0.594,
            high: 0.195,
            name: '1870 Jan',
            color: 'rgba(157,41,98,0.65)'
        }, {
            x: -2.869e+012,
            low: -0.481,
            high: 0.164,
            name: '1870 Feb',
            color: 'rgba(180,53,86,0.65)'
        }, {
            x: -2.8666e+012,
            low: -0.378,
            high: 0.177,
            name: '1870 Mar',
            color: 'rgba(206,67,70,0.65)'
        }, {
            x: -2.8639e+012,
            low: -0.455,
            high: 0.026,
            name: '1870 Apr',
            color: 'rgba(147,37,100,0.65)'
        }, {
            x: -2.8613e+012,
            low: -0.451,
            high: 0.029,
            name: '1870 May',
            color: 'rgba(150,38,100,0.65)'
        }, {
            x: -2.8586e+012,
            low: -0.495,
            high: -0.049,
            name: '1870 Jun',
            color: 'rgba(115,26,108,0.65)'
        }, {
            x: -2.856e+012,
            low: -0.479,
            high: 0.011,
            name: '1870 Jul',
            color: 'rgba(135,33,104,0.65)'
        }, {
            x: -2.8534e+012,
            low: -0.449,
            high: 0.113,
            name: '1870 Aug',
            color: 'rgba(173,48,90,0.65)'
        }, {
            x: -2.8507e+012,
            low: -0.484,
            high: 0.055,
            name: '1870 Sep',
            color: 'rgba(148,38,100,0.65)'
        }, {
            x: -2.8481e+012,
            low: -0.381,
            high: 0.142,
            name: '1870 Oct',
            color: 'rgba(196,61,76,0.65)'
        }, {
            x: -2.8454e+012,
            low: -0.627,
            high: -0.144,
            name: '1870 Nov',
            color: 'rgba(55,12,90,0.65)'
        }, {
            x: -2.8428e+012,
            low: -0.781,
            high: -0.253,
            name: '1870 Dec',
            color: 'rgba(16,7,41,0.65)'
        }, {
            x: -2.8401e+012,
            low: -0.436,
            high: 0.306,
            name: '1880 Jan',
            color: 'rgba(219,83,55,0.65)'
        }, {
            x: -2.8375e+012,
            low: -0.47,
            high: 0.115,
            name: '1880 Feb',
            color: 'rgba(170,47,92,0.65)'
        }, {
            x: -2.835e+012,
            low: -0.384,
            high: 0.172,
            name: '1880 Mar',
            color: 'rgba(204,66,71,0.65)'
        }, {
            x: -2.8323e+012,
            low: -0.385,
            high: 0.094,
            name: '1880 Apr',
            color: 'rgba(184,54,84,0.65)'
        }, {
            x: -2.8297e+012,
            low: -0.497,
            high: 0.013,
            name: '1880 May',
            color: 'rgba(130,31,106,0.65)'
        }, {
            x: -2.827e+012,
            low: -0.533,
            high: -0.085,
            name: '1880 Jun',
            color: 'rgba(94,18,107,0.65)'
        }, {
            x: -2.8244e+012,
            low: -0.496,
            high: -0.005,
            name: '1880 Jul',
            color: 'rgba(125,30,107,0.65)'
        }, {
            x: -2.8217e+012,
            low: -0.399,
            high: 0.162,
            name: '1880 Aug',
            color: 'rgba(199,63,74,0.65)'
        }, {
            x: -2.8191e+012,
            low: -0.509,
            high: 0.04,
            name: '1880 Sep',
            color: 'rgba(135,33,104,0.65)'
        }, {
            x: -2.8165e+012,
            low: -0.653,
            high: -0.119,
            name: '1880 Oct',
            color: 'rgba(54,12,89,0.65)'
        }, {
            x: -2.8138e+012,
            low: -0.637,
            high: -0.174,
            name: '1880 Nov',
            color: 'rgba(45,12,81,0.65)'
        }, {
            x: -2.8112e+012,
            low: -0.556,
            high: -0.037,
            name: '1880 Dec',
            color: 'rgba(101,21,108,0.65)'
        }, {
            x: -2.8085e+012,
            low: -0.7,
            high: -0.031,
            name: '1880 Jan',
            color: 'rgba(65,12,98,0.65)'
        }, {
            x: -2.8058e+012,
            low: -0.54,
            high: 0.062,
            name: '1880 Feb',
            color: 'rgba(131,32,105,0.65)'
        }, {
            x: -2.8034e+012,
            low: -0.449,
            high: 0.072,
            name: '1880 Mar',
            color: 'rgba(163,43,96,0.65)'
        }, {
            x: -2.8007e+012,
            low: -0.376,
            high: 0.107,
            name: '1880 Apr',
            color: 'rgba(189,58,80,0.65)'
        }, {
            x: -2.7982e+012,
            low: -0.275,
            high: 0.216,
            name: '1880 May',
            color: 'rgba(232,99,42,0.65)'
        }, {
            x: -2.7955e+012,
            low: -0.455,
            high: -0.004,
            name: '1880 Jun',
            color: 'rgba(138,34,103,0.65)'
        }, {
            x: -2.7929e+012,
            low: -0.377,
            high: 0.079,
            name: '1880 Jul',
            color: 'rgba(182,53,85,0.65)'
        }, {
            x: -2.7902e+012,
            low: -0.417,
            high: 0.162,
            name: '1880 Aug',
            color: 'rgba(192,59,78,0.65)'
        }, {
            x: -2.7875e+012,
            low: -0.52,
            high: 0.027,
            name: '1880 Sep',
            color: 'rgba(128,30,106,0.65)'
        }, {
            x: -2.7849e+012,
            low: -0.543,
            high: -0.02,
            name: '1880 Oct',
            color: 'rgba(107,23,108,0.65)'
        }, {
            x: -2.7823e+012,
            low: -0.569,
            high: -0.111,
            name: '1880 Nov',
            color: 'rgba(76,12,107,0.65)'
        }, {
            x: -2.7797e+012,
            low: -0.39,
            high: 0.116,
            name: '1880 Dec',
            color: 'rgba(188,57,81,0.65)'
        }, {
            x: -2.777e+012,
            low: -0.211,
            high: 0.437,
            name: '1880 Jan',
            color: 'rgba(250,159,11,0.65)'
        }, {
            x: -2.7743e+012,
            low: -0.292,
            high: 0.268,
            name: '1880 Feb',
            color: 'rgba(237,107,35,0.65)'
        }, {
            x: -2.7719e+012,
            low: -0.32,
            high: 0.214,
            name: '1880 Mar',
            color: 'rgba(224,89,51,0.65)'
        }, {
            x: -2.7692e+012,
            low: -0.511,
            high: -0.055,
            name: '1880 Apr',
            color: 'rgba(108,23,108,0.65)'
        }, {
            x: -2.7666e+012,
            low: -0.609,
            high: -0.137,
            name: '1880 May',
            color: 'rgba(60,12,94,0.65)'
        }, {
            x: -2.7639e+012,
            low: -0.532,
            high: -0.106,
            name: '1880 Jun',
            color: 'rgba(89,17,107,0.65)'
        }, {
            x: -2.7613e+012,
            low: -0.42,
            high: 0.05,
            name: '1880 Jul',
            color: 'rgba(165,44,95,0.65)'
        }, {
            x: -2.7587e+012,
            low: -0.501,
            high: 0.06,
            name: '1880 Aug',
            color: 'rgba(143,36,102,0.65)'
        }, {
            x: -2.756e+012,
            low: -0.421,
            high: 0.104,
            name: '1880 Sep',
            color: 'rgba(180,52,86,0.65)'
        }, {
            x: -2.7534e+012,
            low: -0.592,
            high: -0.076,
            name: '1880 Oct',
            color: 'rgba(78,13,107,0.65)'
        }, {
            x: -2.7507e+012,
            low: -0.539,
            high: -0.086,
            name: '1880 Nov',
            color: 'rgba(91,17,107,0.65)'
        }, {
            x: -2.7481e+012,
            low: -0.718,
            high: -0.207,
            name: '1880 Dec',
            color: 'rgba(26,11,63,0.65)'
        }, {
            x: -2.7454e+012,
            low: -0.717,
            high: -0.108,
            name: '1880 Jan',
            color: 'rgba(44,12,80,0.65)'
        }, {
            x: -2.7428e+012,
            low: -0.596,
            high: -0.048,
            name: '1880 Feb',
            color: 'rgba(86,16,107,0.65)'
        }, {
            x: -2.7403e+012,
            low: -0.587,
            high: -0.1,
            name: '1880 Mar',
            color: 'rgba(76,12,107,0.65)'
        }, {
            x: -2.7377e+012,
            low: -0.616,
            high: -0.168,
            name: '1880 Apr',
            color: 'rgba(51,12,87,0.65)'
        }, {
            x: -2.7351e+012,
            low: -0.478,
            high: -0.024,
            name: '1880 May',
            color: 'rgba(124,29,107,0.65)'
        }, {
            x: -2.7324e+012,
            low: -0.324,
            high: 0.087,
            name: '1880 Jun',
            color: 'rgba(197,62,75,0.65)'
        }, {
            x: -2.7298e+012,
            low: -0.411,
            high: 0.024,
            name: '1880 Jul',
            color: 'rgba(158,41,97,0.65)'
        }, {
            x: -2.7271e+012,
            low: -0.482,
            high: 0.06,
            name: '1880 Aug',
            color: 'rgba(150,38,100,0.65)'
        }, {
            x: -2.7245e+012,
            low: -0.532,
            high: -0.03,
            name: '1880 Sep',
            color: 'rgba(110,24,108,0.65)'
        }, {
            x: -2.7219e+012,
            low: -0.621,
            high: -0.14,
            name: '1880 Oct',
            color: 'rgba(57,12,92,0.65)'
        }, {
            x: -2.7192e+012,
            low: -0.513,
            high: -0.095,
            name: '1880 Nov',
            color: 'rgba(96,19,107,0.65)'
        }, {
            x: -2.7166e+012,
            low: -0.552,
            high: -0.096,
            name: '1880 Dec',
            color: 'rgba(85,15,107,0.65)'
        }, {
            x: -2.7139e+012,
            low: -0.752,
            high: -0.091,
            name: '1880 Jan',
            color: 'rgba(40,12,77,0.65)'
        }, {
            x: -2.7112e+012,
            low: -0.489,
            high: 0.053,
            name: '1880 Feb',
            color: 'rgba(145,36,101,0.65)'
        }, {
            x: -2.7087e+012,
            low: -0.707,
            high: -0.213,
            name: '1880 Mar',
            color: 'rgba(26,11,65,0.65)'
        }, {
            x: -2.706e+012,
            low: -0.751,
            high: -0.31,
            name: '1880 Apr',
            color: 'rgba(14,6,37,0.65)'
        }, {
            x: -2.7035e+012,
            low: -0.616,
            high: -0.171,
            name: '1880 May',
            color: 'rgba(52,12,88,0.65)'
        }, {
            x: -2.7008e+012,
            low: -0.613,
            high: -0.215,
            name: '1880 Jun',
            color: 'rgba(43,12,80,0.65)'
        }, {
            x: -2.6982e+012,
            low: -0.656,
            high: -0.196,
            name: '1880 Jul',
            color: 'rgba(39,12,76,0.65)'
        }, {
            x: -2.6955e+012,
            low: -0.681,
            high: -0.14,
            name: '1880 Aug',
            color: 'rgba(43,12,80,0.65)'
        }, {
            x: -2.6928e+012,
            low: -0.605,
            high: -0.084,
            name: '1880 Sep',
            color: 'rgba(76,12,107,0.65)'
        }, {
            x: -2.6902e+012,
            low: -0.562,
            high: -0.08,
            name: '1880 Oct',
            color: 'rgba(86,16,107,0.65)'
        }, {
            x: -2.6876e+012,
            low: -0.759,
            high: -0.356,
            name: '1880 Nov',
            color: 'rgba(11,4,29,0.65)'
        }, {
            x: -2.685e+012,
            low: -0.64,
            high: -0.192,
            name: '1880 Dec',
            color: 'rgba(41,12,78,0.65)'
        }, {
            x: -2.6823e+012,
            low: -0.797,
            high: -0.224,
            name: '1880 Jan',
            color: 'rgba(18,8,46,0.65)'
        }, {
            x: -2.6796e+012,
            low: -0.668,
            high: -0.155,
            name: '1880 Feb',
            color: 'rgba(43,12,80,0.65)'
        }, {
            x: -2.6772e+012,
            low: -0.721,
            high: -0.251,
            name: '1880 Mar',
            color: 'rgba(21,9,53,0.65)'
        }, {
            x: -2.6745e+012,
            low: -0.686,
            high: -0.256,
            name: '1880 Apr',
            color: 'rgba(23,10,58,0.65)'
        }, {
            x: -2.6719e+012,
            low: -0.741,
            high: -0.301,
            name: '1880 May',
            color: 'rgba(15,7,40,0.65)'
        }, {
            x: -2.6692e+012,
            low: -0.686,
            high: -0.29,
            name: '1880 Jun',
            color: 'rgba(20,9,51,0.65)'
        }, {
            x: -2.6666e+012,
            low: -0.534,
            high: -0.086,
            name: '1880 Jul',
            color: 'rgba(92,18,107,0.65)'
        }, {
            x: -2.664e+012,
            low: -0.791,
            high: -0.229,
            name: '1880 Aug',
            color: 'rgba(17,7,44,0.65)'
        }, {
            x: -2.6613e+012,
            low: -0.587,
            high: -0.081,
            name: '1880 Sep',
            color: 'rgba(81,14,107,0.65)'
        }, {
            x: -2.6587e+012,
            low: -0.48,
            high: -0.015,
            name: '1880 Oct',
            color: 'rgba(126,30,107,0.65)'
        }, {
            x: -2.656e+012,
            low: -0.464,
            high: -0.057,
            name: '1880 Nov',
            color: 'rgba(119,27,108,0.65)'
        }, {
            x: -2.6534e+012,
            low: -0.365,
            high: 0.059,
            name: '1880 Dec',
            color: 'rgba(179,52,86,0.65)'
        }, {
            x: -2.6508e+012,
            low: -0.684,
            high: -0.122,
            name: '1880 Jan',
            color: 'rgba(49,12,85,0.65)'
        }, {
            x: -2.6481e+012,
            low: -0.71,
            high: -0.205,
            name: '1880 Feb',
            color: 'rgba(28,12,67,0.65)'
        }, {
            x: -2.6457e+012,
            low: -0.649,
            high: -0.184,
            name: '1880 Mar',
            color: 'rgba(42,12,79,0.65)'
        }, {
            x: -2.643e+012,
            low: -0.554,
            high: -0.12,
            name: '1880 Apr',
            color: 'rgba(79,13,107,0.65)'
        }, {
            x: -2.6404e+012,
            low: -0.417,
            high: 0.039,
            name: '1880 May',
            color: 'rgba(161,42,97,0.65)'
        }, {
            x: -2.6377e+012,
            low: -0.581,
            high: -0.193,
            name: '1880 Jun',
            color: 'rgba(54,12,89,0.65)'
        }, {
            x: -2.6351e+012,
            low: -0.515,
            high: -0.052,
            name: '1880 Jul',
            color: 'rgba(105,22,108,0.65)'
        }, {
            x: -2.6324e+012,
            low: -0.614,
            high: -0.066,
            name: '1880 Aug',
            color: 'rgba(76,12,107,0.65)'
        }, {
            x: -2.6298e+012,
            low: -0.691,
            high: -0.177,
            name: '1880 Sep',
            color: 'rgba(36,12,73,0.65)'
        }, {
            x: -2.6272e+012,
            low: -0.592,
            high: -0.129,
            name: '1880 Oct',
            color: 'rgba(64,12,98,0.65)'
        }, {
            x: -2.6245e+012,
            low: -0.628,
            high: -0.22,
            name: '1880 Nov',
            color: 'rgba(39,12,76,0.65)'
        }, {
            x: -2.6219e+012,
            low: -0.641,
            high: -0.21,
            name: '1880 Dec',
            color: 'rgba(37,12,74,0.65)'
        }, {
            x: -2.6192e+012,
            low: -0.851,
            high: -0.284,
            name: '1880 Jan',
            color: 'rgba(9,4,26,0.65)'
        }, {
            x: -2.6165e+012,
            low: -0.814,
            high: -0.302,
            name: '1880 Feb',
            color: 'rgba(11,4,29,0.65)'
        }, {
            x: -2.6141e+012,
            low: -0.701,
            high: -0.218,
            name: '1880 Mar',
            color: 'rgba(27,12,66,0.65)'
        }, {
            x: -2.6114e+012,
            low: -0.656,
            high: -0.219,
            name: '1880 Apr',
            color: 'rgba(35,12,73,0.65)'
        }, {
            x: -2.6088e+012,
            low: -0.577,
            high: -0.126,
            name: '1880 May',
            color: 'rgba(70,12,102,0.65)'
        }, {
            x: -2.6062e+012,
            low: -0.601,
            high: -0.211,
            name: '1880 Jun',
            color: 'rgba(47,12,83,0.65)'
        }, {
            x: -2.6036e+012,
            low: -0.496,
            high: -0.041,
            name: '1880 Jul',
            color: 'rgba(116,26,108,0.65)'
        }, {
            x: -2.6009e+012,
            low: -0.643,
            high: -0.098,
            name: '1880 Aug',
            color: 'rgba(63,12,97,0.65)'
        }, {
            x: -2.5982e+012,
            low: -0.597,
            high: -0.091,
            name: '1880 Sep',
            color: 'rgba(75,12,107,0.65)'
        }, {
            x: -2.5956e+012,
            low: -0.736,
            high: -0.268,
            name: '1880 Oct',
            color: 'rgba(18,8,47,0.65)'
        }, {
            x: -2.593e+012,
            low: -0.6,
            high: -0.214,
            name: '1880 Nov',
            color: 'rgba(45,12,81,0.65)'
        }, {
            x: -2.5904e+012,
            low: -0.619,
            high: -0.178,
            name: '1880 Dec',
            color: 'rgba(50,12,86,0.65)'
        }, {
            x: -2.5877e+012,
            low: -0.915,
            high: -0.295,
            name: '1880 Jan',
            color: 'rgba(6,3,19,0.65)'
        }, {
            x: -2.585e+012,
            low: -0.731,
            high: -0.177,
            name: '1880 Feb',
            color: 'rgba(29,12,68,0.65)'
        }, {
            x: -2.5825e+012,
            low: -0.787,
            high: -0.3,
            name: '1880 Mar',
            color: 'rgba(12,5,33,0.65)'
        }, {
            x: -2.5798e+012,
            low: -0.459,
            high: -0.028,
            name: '1880 Apr',
            color: 'rgba(129,31,106,0.65)'
        }, {
            x: -2.5772e+012,
            low: -0.572,
            high: -0.12,
            name: '1880 May',
            color: 'rgba(72,12,104,0.65)'
        }, {
            x: -2.5745e+012,
            low: -0.486,
            high: -0.097,
            name: '1880 Jun',
            color: 'rgba(103,22,108,0.65)'
        }, {
            x: -2.572e+012,
            low: -0.535,
            high: -0.076,
            name: '1880 Jul',
            color: 'rgba(94,18,107,0.65)'
        }, {
            x: -2.5693e+012,
            low: -0.562,
            high: -0.005,
            name: '1880 Aug',
            color: 'rgba(108,24,108,0.65)'
        }, {
            x: -2.5666e+012,
            low: -0.467,
            high: 0.028,
            name: '1880 Sep',
            color: 'rgba(146,37,101,0.65)'
        }, {
            x: -2.564e+012,
            low: -0.34,
            high: 0.137,
            name: '1880 Oct',
            color: 'rgba(203,65,72,0.65)'
        }, {
            x: -2.5613e+012,
            low: -0.408,
            high: 0.014,
            name: '1880 Nov',
            color: 'rgba(157,41,98,0.65)'
        }, {
            x: -2.5587e+012,
            low: -0.417,
            high: 0.062,
            name: '1880 Dec',
            color: 'rgba(170,47,92,0.65)'
        }, {
            x: -2.5561e+012,
            low: -0.373,
            high: 0.26,
            name: '1880 Jan',
            color: 'rgba(223,88,51,0.65)'
        }, {
            x: -2.5534e+012,
            low: -0.379,
            high: 0.18,
            name: '1880 Feb',
            color: 'rgba(207,68,69,0.65)'
        }, {
            x: -2.551e+012,
            low: -0.324,
            high: 0.187,
            name: '1880 Mar',
            color: 'rgba(218,81,57,0.65)'
        }, {
            x: -2.5483e+012,
            low: -0.213,
            high: 0.235,
            name: '1880 Apr',
            color: 'rgba(241,119,27,0.65)'
        }, {
            x: -2.5457e+012,
            low: -0.303,
            high: 0.149,
            name: '1880 May',
            color: 'rgba(213,76,62,0.65)'
        }, {
            x: -2.543e+012,
            low: -0.346,
            high: 0.049,
            name: '1880 Jun',
            color: 'rgba(183,54,84,0.65)'
        }, {
            x: -2.5404e+012,
            low: -0.426,
            high: 0.035,
            name: '1880 Jul',
            color: 'rgba(157,41,98,0.65)'
        }, {
            x: -2.5377e+012,
            low: -0.51,
            high: 0.051,
            name: '1880 Aug',
            color: 'rgba(139,34,103,0.65)'
        }, {
            x: -2.5351e+012,
            low: -0.644,
            high: -0.126,
            name: '1880 Sep',
            color: 'rgba(57,12,92,0.65)'
        }, {
            x: -2.5325e+012,
            low: -0.547,
            high: -0.046,
            name: '1880 Oct',
            color: 'rgba(99,20,108,0.65)'
        }, {
            x: -2.5298e+012,
            low: -0.624,
            high: -0.17,
            name: '1880 Nov',
            color: 'rgba(50,12,85,0.65)'
        }, {
            x: -2.5272e+012,
            low: -0.421,
            high: 0.07,
            name: '1880 Dec',
            color: 'rgba(171,47,92,0.65)'
        }, {
            x: -2.5245e+012,
            low: -0.635,
            high: -0.017,
            name: '1890 Jan',
            color: 'rgba(85,15,107,0.65)'
        }, {
            x: -2.5218e+012,
            low: -0.655,
            high: -0.08,
            name: '1890 Feb',
            color: 'rgba(63,12,97,0.65)'
        }, {
            x: -2.5194e+012,
            low: -0.717,
            high: -0.203,
            name: '1890 Mar',
            color: 'rgba(26,11,65,0.65)'
        }, {
            x: -2.5167e+012,
            low: -0.542,
            high: -0.094,
            name: '1890 Apr',
            color: 'rgba(88,16,107,0.65)'
        }, {
            x: -2.5142e+012,
            low: -0.654,
            high: -0.192,
            name: '1890 May',
            color: 'rgba(38,12,75,0.65)'
        }, {
            x: -2.5115e+012,
            low: -0.583,
            high: -0.177,
            name: '1890 Jun',
            color: 'rgba(59,12,93,0.65)'
        }, {
            x: -2.5089e+012,
            low: -0.645,
            high: -0.185,
            name: '1890 Jul',
            color: 'rgba(43,12,79,0.65)'
        }, {
            x: -2.5062e+012,
            low: -0.699,
            high: -0.149,
            name: '1890 Aug',
            color: 'rgba(40,12,77,0.65)'
        }, {
            x: -2.5035e+012,
            low: -0.738,
            high: -0.224,
            name: '1890 Sep',
            color: 'rgba(22,10,56,0.65)'
        }, {
            x: -2.5009e+012,
            low: -0.762,
            high: -0.24,
            name: '1890 Oct',
            color: 'rgba(19,8,48,0.65)'
        }, {
            x: -2.4983e+012,
            low: -0.792,
            high: -0.347,
            name: '1890 Nov',
            color: 'rgba(9,4,26,0.65)'
        }, {
            x: -2.4957e+012,
            low: -0.652,
            high: -0.165,
            name: '1890 Dec',
            color: 'rgba(46,12,82,0.65)'
        }, {
            x: -2.493e+012,
            low: -0.848,
            high: -0.188,
            name: '1890 Jan',
            color: 'rgba(16,7,43,0.65)'
        }, {
            x: -2.4903e+012,
            low: -0.771,
            high: -0.168,
            name: '1890 Feb',
            color: 'rgba(24,10,60,0.65)'
        }, {
            x: -2.4879e+012,
            low: -0.64,
            high: -0.106,
            name: '1890 Mar',
            color: 'rgba(61,12,95,0.65)'
        }, {
            x: -2.4852e+012,
            low: -0.595,
            high: -0.128,
            name: '1890 Apr',
            color: 'rgba(66,12,99,0.65)'
        }, {
            x: -2.4826e+012,
            low: -0.428,
            high: 0.011,
            name: '1890 May',
            color: 'rgba(151,39,99,0.65)'
        }, {
            x: -2.4799e+012,
            low: -0.494,
            high: -0.108,
            name: '1890 Jun',
            color: 'rgba(99,20,108,0.65)'
        }, {
            x: -2.4773e+012,
            low: -0.561,
            high: -0.099,
            name: '1890 Jul',
            color: 'rgba(82,14,107,0.65)'
        }, {
            x: -2.4747e+012,
            low: -0.609,
            high: -0.035,
            name: '1890 Aug',
            color: 'rgba(88,16,107,0.65)'
        }, {
            x: -2.472e+012,
            low: -0.473,
            high: 0.058,
            name: '1890 Sep',
            color: 'rgba(153,39,99,0.65)'
        }, {
            x: -2.4694e+012,
            low: -0.602,
            high: -0.061,
            name: '1890 Oct',
            color: 'rgba(82,14,107,0.65)'
        }, {
            x: -2.4667e+012,
            low: -0.76,
            high: -0.328,
            name: '1890 Nov',
            color: 'rgba(12,5,31,0.65)'
        }, {
            x: -2.4641e+012,
            low: -0.374,
            high: 0.126,
            name: '1890 Dec',
            color: 'rgba(194,60,77,0.65)'
        }, {
            x: -2.4614e+012,
            low: -0.744,
            high: -0.079,
            name: '1890 Jan',
            color: 'rgba(46,12,82,0.65)'
        }, {
            x: -2.4588e+012,
            low: -0.418,
            high: 0.169,
            name: '1890 Feb',
            color: 'rgba(196,61,76,0.65)'
        }, {
            x: -2.4563e+012,
            low: -0.716,
            high: -0.205,
            name: '1890 Mar',
            color: 'rgba(26,11,65,0.65)'
        }, {
            x: -2.4536e+012,
            low: -0.708,
            high: -0.262,
            name: '1890 Apr',
            color: 'rgba(21,9,54,0.65)'
        }, {
            x: -2.451e+012,
            low: -0.63,
            high: -0.174,
            name: '1890 May',
            color: 'rgba(49,12,85,0.65)'
        }, {
            x: -2.4483e+012,
            low: -0.678,
            high: -0.253,
            name: '1890 Jun',
            color: 'rgba(25,11,61,0.65)'
        }, {
            x: -2.4457e+012,
            low: -0.773,
            high: -0.297,
            name: '1890 Jul',
            color: 'rgba(13,6,35,0.65)'
        }, {
            x: -2.443e+012,
            low: -0.73,
            high: -0.167,
            name: '1890 Aug',
            color: 'rgba(31,12,70,0.65)'
        }, {
            x: -2.4404e+012,
            low: -0.598,
            high: -0.064,
            name: '1890 Sep',
            color: 'rgba(84,15,107,0.65)'
        }, {
            x: -2.4378e+012,
            low: -0.705,
            high: -0.183,
            name: '1890 Oct',
            color: 'rgba(32,12,70,0.65)'
        }, {
            x: -2.4351e+012,
            low: -0.861,
            high: -0.393,
            name: '1890 Nov',
            color: 'rgba(5,2,17,0.65)'
        }, {
            x: -2.4325e+012,
            low: -1.047,
            high: -0.548,
            name: '1890 Dec',
            color: 'rgba(0,0,5,0.65)'
        }, {
            x: -2.4298e+012,
            low: -1.305,
            high: -0.628,
            name: '1890 Jan',
            color: 'rgba(0,0,4,0.65)'
        }, {
            x: -2.4271e+012,
            low: -1.005,
            high: -0.45,
            name: '1890 Feb',
            color: 'rgba(2,0,8,0.65)'
        }, {
            x: -2.4247e+012,
            low: -0.635,
            high: -0.117,
            name: '1890 Mar',
            color: 'rgba(60,12,94,0.65)'
        }, {
            x: -2.4221e+012,
            low: -0.795,
            high: -0.335,
            name: '1890 Apr',
            color: 'rgba(10,4,27,0.65)'
        }, {
            x: -2.4195e+012,
            low: -0.779,
            high: -0.328,
            name: '1890 May',
            color: 'rgba(11,5,31,0.65)'
        }, {
            x: -2.4168e+012,
            low: -0.676,
            high: -0.253,
            name: '1890 Jun',
            color: 'rgba(26,11,63,0.65)'
        }, {
            x: -2.4142e+012,
            low: -0.514,
            high: -0.042,
            name: '1890 Jul',
            color: 'rgba(110,24,108,0.65)'
        }, {
            x: -2.4115e+012,
            low: -0.576,
            high: -0.014,
            name: '1890 Aug',
            color: 'rgba(104,22,108,0.65)'
        }, {
            x: -2.4088e+012,
            low: -0.704,
            high: -0.182,
            name: '1890 Sep',
            color: 'rgba(34,12,72,0.65)'
        }, {
            x: -2.4062e+012,
            low: -0.523,
            high: -0.021,
            name: '1890 Oct',
            color: 'rgba(113,25,108,0.65)'
        }, {
            x: -2.4036e+012,
            low: -0.64,
            high: -0.192,
            name: '1890 Nov',
            color: 'rgba(42,12,79,0.65)'
        }, {
            x: -2.401e+012,
            low: -0.603,
            high: -0.1,
            name: '1890 Dec',
            color: 'rgba(70,12,103,0.65)'
        }, {
            x: -2.3983e+012,
            low: -0.78,
            high: -0.133,
            name: '1890 Jan',
            color: 'rgba(29,12,67,0.65)'
        }, {
            x: -2.3956e+012,
            low: -0.673,
            high: -0.088,
            name: '1890 Feb',
            color: 'rgba(58,12,92,0.65)'
        }, {
            x: -2.3932e+012,
            low: -0.643,
            high: -0.12,
            name: '1890 Mar',
            color: 'rgba(57,12,92,0.65)'
        }, {
            x: -2.3905e+012,
            low: -0.604,
            high: -0.158,
            name: '1890 Apr',
            color: 'rgba(58,12,92,0.65)'
        }, {
            x: -2.3879e+012,
            low: -0.659,
            high: -0.199,
            name: '1890 May',
            color: 'rgba(37,12,75,0.65)'
        }, {
            x: -2.3852e+012,
            low: -0.699,
            high: -0.286,
            name: '1890 Jun',
            color: 'rgba(20,9,50,0.65)'
        }, {
            x: -2.3827e+012,
            low: -0.556,
            high: -0.082,
            name: '1890 Jul',
            color: 'rgba(89,17,107,0.65)'
        }, {
            x: -2.38e+012,
            low: -0.625,
            high: -0.069,
            name: '1890 Aug',
            color: 'rgba(75,12,107,0.65)'
        }, {
            x: -2.3773e+012,
            low: -0.729,
            high: -0.204,
            name: '1890 Sep',
            color: 'rgba(25,11,62,0.65)'
        }, {
            x: -2.3747e+012,
            low: -0.692,
            high: -0.196,
            name: '1890 Oct',
            color: 'rgba(33,12,71,0.65)'
        }, {
            x: -2.372e+012,
            low: -0.656,
            high: -0.194,
            name: '1890 Nov',
            color: 'rgba(39,12,76,0.65)'
        }, {
            x: -2.3694e+012,
            low: -0.651,
            high: -0.163,
            name: '1890 Dec',
            color: 'rgba(47,12,83,0.65)'
        }, {
            x: -2.3668e+012,
            low: -0.816,
            high: -0.188,
            name: '1890 Jan',
            color: 'rgba(19,8,49,0.65)'
        }, {
            x: -2.3641e+012,
            low: -0.957,
            high: -0.403,
            name: '1890 Feb',
            color: 'rgba(3,1,12,0.65)'
        }, {
            x: -2.3617e+012,
            low: -0.792,
            high: -0.266,
            name: '1890 Mar',
            color: 'rgba(15,6,38,0.65)'
        }, {
            x: -2.359e+012,
            low: -0.646,
            high: -0.173,
            name: '1890 Apr',
            color: 'rgba(45,12,81,0.65)'
        }, {
            x: -2.3564e+012,
            low: -0.652,
            high: -0.179,
            name: '1890 May',
            color: 'rgba(42,12,79,0.65)'
        }, {
            x: -2.3537e+012,
            low: -0.541,
            high: -0.125,
            name: '1890 Jun',
            color: 'rgba(82,14,107,0.65)'
        }, {
            x: -2.3511e+012,
            low: -0.589,
            high: -0.128,
            name: '1890 Jul',
            color: 'rgba(67,12,100,0.65)'
        }, {
            x: -2.3484e+012,
            low: -0.549,
            high: 0.008,
            name: '1890 Aug',
            color: 'rgba(116,26,108,0.65)'
        }, {
            x: -2.3458e+012,
            low: -0.546,
            high: -0.032,
            name: '1890 Sep',
            color: 'rgba(105,22,108,0.65)'
        }, {
            x: -2.3432e+012,
            low: -0.586,
            high: -0.1,
            name: '1890 Oct',
            color: 'rgba(75,12,107,0.65)'
        }, {
            x: -2.3405e+012,
            low: -0.529,
            high: -0.077,
            name: '1890 Nov',
            color: 'rgba(97,20,108,0.65)'
        }, {
            x: -2.3379e+012,
            low: -0.562,
            high: -0.078,
            name: '1890 Dec',
            color: 'rgba(88,16,107,0.65)'
        }, {
            x: -2.3352e+012,
            low: -0.535,
            high: 0.083,
            name: '1890 Jan',
            color: 'rgba(141,35,102,0.65)'
        }, {
            x: -2.3325e+012,
            low: -0.511,
            high: 0.044,
            name: '1890 Feb',
            color: 'rgba(135,33,104,0.65)'
        }, {
            x: -2.33e+012,
            low: -0.628,
            high: -0.143,
            name: '1890 Mar',
            color: 'rgba(56,12,90,0.65)'
        }, {
            x: -2.3274e+012,
            low: -0.577,
            high: -0.124,
            name: '1890 Apr',
            color: 'rgba(71,12,103,0.65)'
        }, {
            x: -2.3248e+012,
            low: -0.443,
            high: 0.024,
            name: '1890 May',
            color: 'rgba(151,39,99,0.65)'
        }, {
            x: -2.3221e+012,
            low: -0.318,
            high: 0.074,
            name: '1890 Jun',
            color: 'rgba(194,60,77,0.65)'
        }, {
            x: -2.3195e+012,
            low: -0.345,
            high: 0.122,
            name: '1890 Jul',
            color: 'rgba(200,64,73,0.65)'
        }, {
            x: -2.3168e+012,
            low: -0.349,
            high: 0.208,
            name: '1890 Aug',
            color: 'rgba(218,81,57,0.65)'
        }, {
            x: -2.3141e+012,
            low: -0.389,
            high: 0.159,
            name: '1890 Sep',
            color: 'rgba(200,64,73,0.65)'
        }, {
            x: -2.3115e+012,
            low: -0.378,
            high: 0.117,
            name: '1890 Oct',
            color: 'rgba(190,58,80,0.65)'
        }, {
            x: -2.3089e+012,
            low: -0.512,
            high: -0.076,
            name: '1890 Nov',
            color: 'rgba(102,21,108,0.65)'
        }, {
            x: -2.3063e+012,
            low: -0.273,
            high: 0.203,
            name: '1890 Dec',
            color: 'rgba(231,98,42,0.65)'
        }, {
            x: -2.3036e+012,
            low: -0.528,
            high: 0.12,
            name: '1890 Jan',
            color: 'rgba(154,40,99,0.65)'
        }, {
            x: -2.3009e+012,
            low: -0.405,
            high: 0.153,
            name: '1890 Feb',
            color: 'rgba(194,60,77,0.65)'
        }, {
            x: -2.2985e+012,
            low: -0.531,
            high: -0.025,
            name: '1890 Mar',
            color: 'rgba(112,25,108,0.65)'
        }, {
            x: -2.2958e+012,
            low: -0.297,
            high: 0.157,
            name: '1890 Apr',
            color: 'rgba(217,81,58,0.65)'
        }, {
            x: -2.2932e+012,
            low: -0.248,
            high: 0.19,
            name: '1890 May',
            color: 'rgba(232,99,41,0.65)'
        }, {
            x: -2.2906e+012,
            low: -0.363,
            high: 0.037,
            name: '1890 Jun',
            color: 'rgba(177,51,88,0.65)'
        }, {
            x: -2.288e+012,
            low: -0.392,
            high: 0.065,
            name: '1890 Jul',
            color: 'rgba(175,50,89,0.65)'
        }, {
            x: -2.2853e+012,
            low: -0.449,
            high: 0.123,
            name: '1890 Aug',
            color: 'rgba(178,51,87,0.65)'
        }, {
            x: -2.2826e+012,
            low: -0.409,
            high: 0.119,
            name: '1890 Sep',
            color: 'rgba(186,56,83,0.65)'
        }, {
            x: -2.28e+012,
            low: -0.503,
            high: -0.02,
            name: '1890 Oct',
            color: 'rgba(119,27,108,0.65)'
        }, {
            x: -2.2773e+012,
            low: -0.683,
            high: -0.237,
            name: '1890 Nov',
            color: 'rgba(26,11,65,0.65)'
        }, {
            x: -2.2747e+012,
            low: -0.716,
            high: -0.255,
            name: '1890 Dec',
            color: 'rgba(21,9,53,0.65)'
        }, {
            x: -2.2721e+012,
            low: -0.386,
            high: 0.213,
            name: '1890 Jan',
            color: 'rgba(212,74,64,0.65)'
        }, {
            x: -2.2694e+012,
            low: -0.658,
            high: -0.113,
            name: '1890 Feb',
            color: 'rgba(59,12,93,0.65)'
        }, {
            x: -2.267e+012,
            low: -1.004,
            high: -0.5,
            name: '1890 Mar',
            color: 'rgba(1,0,7,0.65)'
        }, {
            x: -2.2643e+012,
            low: -0.795,
            high: -0.341,
            name: '1890 Apr',
            color: 'rgba(9,4,26,0.65)'
        }, {
            x: -2.2617e+012,
            low: -0.702,
            high: -0.245,
            name: '1890 May',
            color: 'rgba(24,10,59,0.65)'
        }, {
            x: -2.259e+012,
            low: -0.516,
            high: -0.132,
            name: '1890 Jun',
            color: 'rgba(86,16,107,0.65)'
        }, {
            x: -2.2564e+012,
            low: -0.62,
            high: -0.144,
            name: '1890 Jul',
            color: 'rgba(56,12,91,0.65)'
        }, {
            x: -2.2537e+012,
            low: -0.595,
            high: -0.031,
            name: '1890 Aug',
            color: 'rgba(94,18,107,0.65)'
        }, {
            x: -2.2511e+012,
            low: -0.601,
            high: -0.074,
            name: '1890 Sep',
            color: 'rgba(80,13,107,0.65)'
        }, {
            x: -2.2485e+012,
            low: -0.798,
            high: -0.324,
            name: '1890 Oct',
            color: 'rgba(10,4,28,0.65)'
        }, {
            x: -2.2458e+012,
            low: -0.674,
            high: -0.23,
            name: '1890 Nov',
            color: 'rgba(29,12,67,0.65)'
        }, {
            x: -2.2432e+012,
            low: -0.578,
            high: -0.145,
            name: '1890 Dec',
            color: 'rgba(66,12,99,0.65)'
        }, {
            x: -2.2405e+012,
            low: -0.513,
            high: 0.085,
            name: '1890 Jan',
            color: 'rgba(149,38,100,0.65)'
        }, {
            x: -2.2378e+012,
            low: -0.766,
            high: -0.242,
            name: '1890 Feb',
            color: 'rgba(19,8,48,0.65)'
        }, {
            x: -2.2354e+012,
            low: -0.783,
            high: -0.304,
            name: '1890 Mar',
            color: 'rgba(12,5,33,0.65)'
        }, {
            x: -2.2327e+012,
            low: -0.568,
            high: -0.127,
            name: '1890 Apr',
            color: 'rgba(73,12,105,0.65)'
        }, {
            x: -2.2302e+012,
            low: -0.539,
            high: -0.081,
            name: '1890 May',
            color: 'rgba(92,18,107,0.65)'
        }, {
            x: -2.2275e+012,
            low: -0.592,
            high: -0.195,
            name: '1890 Jun',
            color: 'rgba(52,12,88,0.65)'
        }, {
            x: -2.2249e+012,
            low: -0.516,
            high: -0.044,
            name: '1890 Jul',
            color: 'rgba(108,23,108,0.65)'
        }, {
            x: -2.2222e+012,
            low: -0.439,
            high: 0.13,
            name: '1890 Aug',
            color: 'rgba(183,54,84,0.65)'
        }, {
            x: -2.2195e+012,
            low: -0.404,
            high: 0.124,
            name: '1890 Sep',
            color: 'rgba(187,56,82,0.65)'
        }, {
            x: -2.2169e+012,
            low: -0.426,
            high: 0.05,
            name: '1890 Oct',
            color: 'rgba(162,43,96,0.65)'
        }, {
            x: -2.2143e+012,
            low: -0.187,
            high: 0.238,
            name: '1890 Nov',
            color: 'rgba(243,126,23,0.65)'
        }, {
            x: -2.2117e+012,
            low: -0.678,
            high: -0.238,
            name: '1890 Dec',
            color: 'rgba(28,12,66,0.65)'
        }, {
            x: -2.209e+012,
            low: -0.552,
            high: 0.058,
            name: '1900 Jan',
            color: 'rgba(126,30,107,0.65)'
        }, {
            x: -2.2063e+012,
            low: -0.438,
            high: 0.097,
            name: '1900 Feb',
            color: 'rgba(176,50,89,0.65)'
        }, {
            x: -2.2039e+012,
            low: -0.526,
            high: -0.028,
            name: '1900 Mar',
            color: 'rgba(112,25,108,0.65)'
        }, {
            x: -2.2012e+012,
            low: -0.482,
            high: -0.021,
            name: '1900 Apr',
            color: 'rgba(124,29,107,0.65)'
        }, {
            x: -2.1986e+012,
            low: -0.509,
            high: -0.046,
            name: '1900 May',
            color: 'rgba(112,25,108,0.65)'
        }, {
            x: -2.1959e+012,
            low: -0.403,
            high: 0.036,
            name: '1900 Jun',
            color: 'rgba(165,44,95,0.65)'
        }, {
            x: -2.1934e+012,
            low: -0.434,
            high: 0.044,
            name: '1900 Jul',
            color: 'rgba(160,42,97,0.65)'
        }, {
            x: -2.1907e+012,
            low: -0.455,
            high: 0.082,
            name: '1900 Aug',
            color: 'rgba(165,44,95,0.65)'
        }, {
            x: -2.188e+012,
            low: -0.496,
            high: 0.041,
            name: '1900 Sep',
            color: 'rgba(142,36,102,0.65)'
        }, {
            x: -2.1854e+012,
            low: -0.309,
            high: 0.187,
            name: '1900 Oct',
            color: 'rgba(221,85,53,0.65)'
        }, {
            x: -2.1827e+012,
            low: -0.484,
            high: -0.043,
            name: '1900 Nov',
            color: 'rgba(119,27,108,0.65)'
        }, {
            x: -2.1801e+012,
            low: -0.318,
            high: 0.14,
            name: '1900 Dec',
            color: 'rgba(210,72,65,0.65)'
        }, {
            x: -2.1775e+012,
            low: -0.462,
            high: 0.099,
            name: '1900 Jan',
            color: 'rgba(166,44,95,0.65)'
        }, {
            x: -2.1748e+012,
            low: -0.518,
            high: -0.032,
            name: '1900 Feb',
            color: 'rgba(115,26,108,0.65)'
        }, {
            x: -2.1724e+012,
            low: -0.482,
            high: -0.013,
            name: '1900 Mar',
            color: 'rgba(126,30,107,0.65)'
        }, {
            x: -2.1697e+012,
            low: -0.421,
            high: 0.034,
            name: '1900 Apr',
            color: 'rgba(160,42,97,0.65)'
        }, {
            x: -2.1671e+012,
            low: -0.433,
            high: 0.031,
            name: '1900 May',
            color: 'rgba(157,41,98,0.65)'
        }, {
            x: -2.1644e+012,
            low: -0.366,
            high: 0.047,
            name: '1900 Jun',
            color: 'rgba(179,52,87,0.65)'
        }, {
            x: -2.1618e+012,
            low: -0.435,
            high: 0.045,
            name: '1900 Jul',
            color: 'rgba(159,41,97,0.65)'
        }, {
            x: -2.1591e+012,
            low: -0.482,
            high: 0.077,
            name: '1900 Aug',
            color: 'rgba(155,40,98,0.65)'
        }, {
            x: -2.1565e+012,
            low: -0.614,
            high: -0.092,
            name: '1900 Sep',
            color: 'rgba(72,12,104,0.65)'
        }, {
            x: -2.1539e+012,
            low: -0.538,
            high: -0.059,
            name: '1900 Oct',
            color: 'rgba(99,20,108,0.65)'
        }, {
            x: -2.1512e+012,
            low: -0.658,
            high: -0.232,
            name: '1900 Nov',
            color: 'rgba(31,12,69,0.65)'
        }, {
            x: -2.1486e+012,
            low: -0.669,
            high: -0.219,
            name: '1900 Dec',
            color: 'rgba(34,12,71,0.65)'
        }, {
            x: -2.1459e+012,
            low: -0.522,
            high: 0.04,
            name: '1900 Jan',
            color: 'rgba(130,31,105,0.65)'
        }, {
            x: -2.1432e+012,
            low: -0.528,
            high: -0.02,
            name: '1900 Feb',
            color: 'rgba(115,26,108,0.65)'
        }, {
            x: -2.1408e+012,
            low: -0.62,
            high: -0.17,
            name: '1900 Mar',
            color: 'rgba(52,12,87,0.65)'
        }, {
            x: -2.1381e+012,
            low: -0.66,
            high: -0.234,
            name: '1900 Apr',
            color: 'rgba(30,12,69,0.65)'
        }, {
            x: -2.1355e+012,
            low: -0.626,
            high: -0.189,
            name: '1900 May',
            color: 'rgba(47,12,83,0.65)'
        }, {
            x: -2.1329e+012,
            low: -0.651,
            high: -0.246,
            name: '1900 Jun',
            color: 'rgba(30,12,69,0.65)'
        }, {
            x: -2.1303e+012,
            low: -0.618,
            high: -0.162,
            name: '1900 Jul',
            color: 'rgba(52,12,88,0.65)'
        }, {
            x: -2.1276e+012,
            low: -0.644,
            high: -0.101,
            name: '1900 Aug',
            color: 'rgba(62,12,96,0.65)'
        }, {
            x: -2.1249e+012,
            low: -0.637,
            high: -0.111,
            name: '1900 Sep',
            color: 'rgba(62,12,96,0.65)'
        }, {
            x: -2.1223e+012,
            low: -0.719,
            high: -0.249,
            name: '1900 Oct',
            color: 'rgba(20,9,51,0.65)'
        }, {
            x: -2.1197e+012,
            low: -0.741,
            high: -0.328,
            name: '1900 Nov',
            color: 'rgba(13,6,36,0.65)'
        }, {
            x: -2.1171e+012,
            low: -0.745,
            high: -0.304,
            name: '1900 Dec',
            color: 'rgba(15,6,40,0.65)'
        }, {
            x: -2.1144e+012,
            low: -0.559,
            high: 0.01,
            name: '1900 Jan',
            color: 'rgba(112,25,108,0.65)'
        }, {
            x: -2.1117e+012,
            low: -0.455,
            high: 0.038,
            name: '1900 Feb',
            color: 'rgba(153,39,99,0.65)'
        }, {
            x: -2.1093e+012,
            low: -0.58,
            high: -0.134,
            name: '1900 Mar',
            color: 'rgba(69,12,102,0.65)'
        }, {
            x: -2.1066e+012,
            low: -0.686,
            high: -0.258,
            name: '1900 Apr',
            color: 'rgba(23,10,58,0.65)'
        }, {
            x: -2.104e+012,
            low: -0.688,
            high: -0.243,
            name: '1900 May',
            color: 'rgba(25,11,62,0.65)'
        }, {
            x: -2.1013e+012,
            low: -0.748,
            high: -0.356,
            name: '1900 Jun',
            color: 'rgba(11,5,31,0.65)'
        }, {
            x: -2.0987e+012,
            low: -0.721,
            high: -0.266,
            name: '1900 Jul',
            color: 'rgba(20,8,50,0.65)'
        }, {
            x: -2.0961e+012,
            low: -0.868,
            high: -0.326,
            name: '1900 Aug',
            color: 'rgba(7,3,22,0.65)'
        }, {
            x: -2.0934e+012,
            low: -0.787,
            high: -0.276,
            name: '1900 Sep',
            color: 'rgba(14,6,38,0.65)'
        }, {
            x: -2.0908e+012,
            low: -0.892,
            high: -0.426,
            name: '1900 Oct',
            color: 'rgba(4,1,13,0.65)'
        }, {
            x: -2.0881e+012,
            low: -0.834,
            high: -0.424,
            name: '1900 Nov',
            color: 'rgba(5,2,17,0.65)'
        }, {
            x: -2.0855e+012,
            low: -0.814,
            high: -0.39,
            name: '1900 Dec',
            color: 'rgba(6,2,19,0.65)'
        }, {
            x: -2.0828e+012,
            low: -0.916,
            high: -0.364,
            name: '1900 Jan',
            color: 'rgba(5,2,15,0.65)'
        }, {
            x: -2.0802e+012,
            low: -0.852,
            high: -0.366,
            name: '1900 Feb',
            color: 'rgba(6,3,19,0.65)'
        }, {
            x: -2.0777e+012,
            low: -0.886,
            high: -0.432,
            name: '1900 Mar',
            color: 'rgba(4,1,13,0.65)'
        }, {
            x: -2.075e+012,
            low: -0.778,
            high: -0.329,
            name: '1900 Apr',
            color: 'rgba(11,5,30,0.65)'
        }, {
            x: -2.0724e+012,
            low: -0.763,
            high: -0.32,
            name: '1900 May',
            color: 'rgba(13,5,34,0.65)'
        }, {
            x: -2.0697e+012,
            low: -0.716,
            high: -0.341,
            name: '1900 Jun',
            color: 'rgba(15,6,39,0.65)'
        }, {
            x: -2.0671e+012,
            low: -0.755,
            high: -0.301,
            name: '1900 Jul',
            color: 'rgba(14,6,37,0.65)'
        }, {
            x: -2.0644e+012,
            low: -0.75,
            high: -0.223,
            name: '1900 Aug',
            color: 'rgba(21,9,54,0.65)'
        }, {
            x: -2.0618e+012,
            low: -0.749,
            high: -0.227,
            name: '1900 Sep',
            color: 'rgba(21,9,52,0.65)'
        }, {
            x: -2.0592e+012,
            low: -0.707,
            high: -0.252,
            name: '1900 Oct',
            color: 'rgba(22,9,54,0.65)'
        }, {
            x: -2.0565e+012,
            low: -0.592,
            high: -0.185,
            name: '1900 Nov',
            color: 'rgba(55,12,90,0.65)'
        }, {
            x: -2.0539e+012,
            low: -0.631,
            high: -0.205,
            name: '1900 Dec',
            color: 'rgba(41,12,78,0.65)'
        }, {
            x: -2.0512e+012,
            low: -0.739,
            high: -0.199,
            name: '1900 Jan',
            color: 'rgba(24,10,59,0.65)'
        }, {
            x: -2.0485e+012,
            low: -0.938,
            high: -0.469,
            name: '1900 Feb',
            color: 'rgba(3,1,10,0.65)'
        }, {
            x: -2.0461e+012,
            low: -0.688,
            high: -0.237,
            name: '1900 Mar',
            color: 'rgba(26,11,64,0.65)'
        }, {
            x: -2.0434e+012,
            low: -0.766,
            high: -0.338,
            name: '1900 Apr',
            color: 'rgba(11,5,30,0.65)'
        }, {
            x: -2.0409e+012,
            low: -0.57,
            high: -0.123,
            name: '1900 May',
            color: 'rgba(75,12,107,0.65)'
        }, {
            x: -2.0382e+012,
            low: -0.517,
            high: -0.144,
            name: '1900 Jun',
            color: 'rgba(83,14,107,0.65)'
        }, {
            x: -2.0356e+012,
            low: -0.515,
            high: -0.074,
            name: '1900 Jul',
            color: 'rgba(99,20,108,0.65)'
        }, {
            x: -2.0329e+012,
            low: -0.577,
            high: -0.046,
            name: '1900 Aug',
            color: 'rgba(94,18,107,0.65)'
        }, {
            x: -2.0302e+012,
            low: -0.58,
            high: -0.067,
            name: '1900 Sep',
            color: 'rgba(86,16,107,0.65)'
        }, {
            x: -2.0276e+012,
            low: -0.593,
            high: -0.144,
            name: '1900 Oct',
            color: 'rgba(62,12,96,0.65)'
        }, {
            x: -2.025e+012,
            low: -0.427,
            high: -0.024,
            name: '1900 Nov',
            color: 'rgba(141,35,102,0.65)'
        }, {
            x: -2.0224e+012,
            low: -0.411,
            high: 0.003,
            name: '1900 Dec',
            color: 'rgba(152,39,99,0.65)'
        }, {
            x: -2.0197e+012,
            low: -0.353,
            high: 0.201,
            name: '1900 Jan',
            color: 'rgba(215,79,60,0.65)'
        }, {
            x: -2.017e+012,
            low: -0.481,
            high: -0.001,
            name: '1900 Feb',
            color: 'rgba(131,32,105,0.65)'
        }, {
            x: -2.0146e+012,
            low: -0.518,
            high: -0.069,
            name: '1900 Mar',
            color: 'rgba(102,21,108,0.65)'
        }, {
            x: -2.0119e+012,
            low: -0.333,
            high: 0.108,
            name: '1900 Apr',
            color: 'rgba(199,63,74,0.65)'
        }, {
            x: -2.0093e+012,
            low: -0.561,
            high: -0.119,
            name: '1900 May',
            color: 'rgba(79,13,107,0.65)'
        }, {
            x: -2.0066e+012,
            low: -0.478,
            high: -0.118,
            name: '1900 Jun',
            color: 'rgba(100,21,108,0.65)'
        }, {
            x: -2.004e+012,
            low: -0.54,
            high: -0.096,
            name: '1900 Jul',
            color: 'rgba(87,16,107,0.65)'
        }, {
            x: -2.0014e+012,
            low: -0.585,
            high: -0.067,
            name: '1900 Aug',
            color: 'rgba(85,15,107,0.65)'
        }, {
            x: -1.9987e+012,
            low: -0.638,
            high: -0.142,
            name: '1900 Sep',
            color: 'rgba(54,12,89,0.65)'
        }, {
            x: -1.9961e+012,
            low: -0.59,
            high: -0.111,
            name: '1900 Oct',
            color: 'rgba(70,12,102,0.65)'
        }, {
            x: -1.9934e+012,
            low: -0.638,
            high: -0.226,
            name: '1900 Nov',
            color: 'rgba(36,12,74,0.65)'
        }, {
            x: -1.9908e+012,
            low: -0.488,
            high: -0.076,
            name: '1900 Dec',
            color: 'rgba(108,23,108,0.65)'
        }, {
            x: -1.9882e+012,
            low: -0.687,
            high: -0.197,
            name: '1900 Jan',
            color: 'rgba(33,12,71,0.65)'
        }, {
            x: -1.9855e+012,
            low: -0.756,
            high: -0.288,
            name: '1900 Feb',
            color: 'rgba(16,7,41,0.65)'
        }, {
            x: -1.9831e+012,
            low: -0.563,
            high: -0.126,
            name: '1900 Mar',
            color: 'rgba(75,12,107,0.65)'
        }, {
            x: -1.9804e+012,
            low: -0.719,
            high: -0.293,
            name: '1900 Apr',
            color: 'rgba(18,8,46,0.65)'
        }, {
            x: -1.9778e+012,
            low: -0.774,
            high: -0.339,
            name: '1900 May',
            color: 'rgba(11,5,30,0.65)'
        }, {
            x: -1.9751e+012,
            low: -0.714,
            high: -0.347,
            name: '1900 Jun',
            color: 'rgba(14,6,38,0.65)'
        }, {
            x: -1.9725e+012,
            low: -0.623,
            high: -0.184,
            name: '1900 Jul',
            color: 'rgba(46,12,82,0.65)'
        }, {
            x: -1.9698e+012,
            low: -0.728,
            high: -0.206,
            name: '1900 Aug',
            color: 'rgba(26,11,64,0.65)'
        }, {
            x: -1.9672e+012,
            low: -0.657,
            high: -0.174,
            name: '1900 Sep',
            color: 'rgba(43,12,80,0.65)'
        }, {
            x: -1.9646e+012,
            low: -0.591,
            high: -0.124,
            name: '1900 Oct',
            color: 'rgba(67,12,100,0.65)'
        }, {
            x: -1.9619e+012,
            low: -0.776,
            high: -0.395,
            name: '1900 Nov',
            color: 'rgba(8,3,23,0.65)'
        }, {
            x: -1.9593e+012,
            low: -0.729,
            high: -0.339,
            name: '1900 Dec',
            color: 'rgba(13,6,35,0.65)'
        }, {
            x: -1.9566e+012,
            low: -0.686,
            high: -0.162,
            name: '1900 Jan',
            color: 'rgba(39,12,76,0.65)'
        }, {
            x: -1.9539e+012,
            low: -0.645,
            high: -0.2,
            name: '1900 Feb',
            color: 'rgba(41,12,78,0.65)'
        }, {
            x: -1.9514e+012,
            low: -0.853,
            high: -0.42,
            name: '1900 Mar',
            color: 'rgba(5,2,16,0.65)'
        }, {
            x: -1.9488e+012,
            low: -0.747,
            high: -0.336,
            name: '1900 Apr',
            color: 'rgba(12,5,32,0.65)'
        }, {
            x: -1.9462e+012,
            low: -0.692,
            high: -0.258,
            name: '1900 May',
            color: 'rgba(23,10,57,0.65)'
        }, {
            x: -1.9435e+012,
            low: -0.671,
            high: -0.293,
            name: '1900 Jun',
            color: 'rgba(22,10,55,0.65)'
        }, {
            x: -1.9409e+012,
            low: -0.695,
            high: -0.255,
            name: '1900 Jul',
            color: 'rgba(22,10,55,0.65)'
        }, {
            x: -1.9382e+012,
            low: -0.803,
            high: -0.28,
            name: '1900 Aug',
            color: 'rgba(13,5,34,0.65)'
        }, {
            x: -1.9355e+012,
            low: -0.709,
            high: -0.208,
            name: '1900 Sep',
            color: 'rgba(27,12,66,0.65)'
        }, {
            x: -1.9329e+012,
            low: -0.804,
            high: -0.367,
            name: '1900 Oct',
            color: 'rgba(8,3,22,0.65)'
        }, {
            x: -1.9303e+012,
            low: -0.79,
            high: -0.409,
            name: '1900 Nov',
            color: 'rgba(7,3,21,0.65)'
        }, {
            x: -1.9277e+012,
            low: -0.769,
            high: -0.382,
            name: '1900 Dec',
            color: 'rgba(8,3,24,0.65)'
        }, {
            x: -1.925e+012,
            low: -0.834,
            high: -0.329,
            name: '1900 Jan',
            color: 'rgba(8,3,23,0.65)'
        }, {
            x: -1.9223e+012,
            low: -0.774,
            high: -0.322,
            name: '1900 Feb',
            color: 'rgba(12,5,33,0.65)'
        }, {
            x: -1.9199e+012,
            low: -0.904,
            high: -0.471,
            name: '1900 Mar',
            color: 'rgba(3,1,11,0.65)'
        }, {
            x: -1.9172e+012,
            low: -0.811,
            high: -0.405,
            name: '1900 Apr',
            color: 'rgba(6,2,18,0.65)'
        }, {
            x: -1.9146e+012,
            low: -0.805,
            high: -0.381,
            name: '1900 May',
            color: 'rgba(8,3,22,0.65)'
        }, {
            x: -1.9119e+012,
            low: -0.7,
            high: -0.345,
            name: '1900 Jun',
            color: 'rgba(16,7,41,0.65)'
        }, {
            x: -1.9094e+012,
            low: -0.805,
            high: -0.364,
            name: '1900 Jul',
            color: 'rgba(8,3,23,0.65)'
        }, {
            x: -1.9067e+012,
            low: -0.588,
            high: -0.065,
            name: '1900 Aug',
            color: 'rgba(84,15,107,0.65)'
        }, {
            x: -1.904e+012,
            low: -0.651,
            high: -0.155,
            name: '1900 Sep',
            color: 'rgba(49,12,85,0.65)'
        }, {
            x: -1.9014e+012,
            low: -0.701,
            high: -0.26,
            name: '1900 Oct',
            color: 'rgba(22,9,54,0.65)'
        }, {
            x: -1.8987e+012,
            low: -0.614,
            high: -0.261,
            name: '1900 Nov',
            color: 'rgba(36,12,73,0.65)'
        }, {
            x: -1.8961e+012,
            low: -0.795,
            high: -0.403,
            name: '1900 Dec',
            color: 'rgba(7,3,20,0.65)'
        }, {
            x: -1.8935e+012,
            low: -0.612,
            high: -0.106,
            name: '1910 Jan',
            color: 'rgba(67,12,100,0.65)'
        }, {
            x: -1.8908e+012,
            low: -0.742,
            high: -0.294,
            name: '1910 Feb',
            color: 'rgba(16,7,41,0.65)'
        }, {
            x: -1.8884e+012,
            low: -0.706,
            high: -0.263,
            name: '1910 Mar',
            color: 'rgba(21,9,52,0.65)'
        }, {
            x: -1.8857e+012,
            low: -0.658,
            high: -0.245,
            name: '1910 Apr',
            color: 'rgba(29,12,68,0.65)'
        }, {
            x: -1.8831e+012,
            low: -0.683,
            high: -0.267,
            name: '1910 May',
            color: 'rgba(23,10,57,0.65)'
        }, {
            x: -1.8804e+012,
            low: -0.661,
            high: -0.314,
            name: '1910 Jun',
            color: 'rgba(20,9,51,0.65)'
        }, {
            x: -1.8778e+012,
            low: -0.686,
            high: -0.247,
            name: '1910 Jul',
            color: 'rgba(24,10,59,0.65)'
        }, {
            x: -1.8751e+012,
            low: -0.712,
            high: -0.179,
            name: '1910 Aug',
            color: 'rgba(33,12,71,0.65)'
        }, {
            x: -1.8725e+012,
            low: -0.686,
            high: -0.199,
            name: '1910 Sep',
            color: 'rgba(33,12,71,0.65)'
        }, {
            x: -1.8699e+012,
            low: -0.7,
            high: -0.269,
            name: '1910 Oct',
            color: 'rgba(21,9,53,0.65)'
        }, {
            x: -1.8672e+012,
            low: -0.837,
            high: -0.473,
            name: '1910 Nov',
            color: 'rgba(4,1,13,0.65)'
        }, {
            x: -1.8646e+012,
            low: -0.864,
            high: -0.47,
            name: '1910 Dec',
            color: 'rgba(3,1,12,0.65)'
        }, {
            x: -1.8619e+012,
            low: -0.798,
            high: -0.313,
            name: '1910 Jan',
            color: 'rgba(11,4,29,0.65)'
        }, {
            x: -1.8592e+012,
            low: -0.981,
            high: -0.555,
            name: '1910 Feb',
            color: 'rgba(0,0,5,0.65)'
        }, {
            x: -1.8568e+012,
            low: -0.909,
            high: -0.491,
            name: '1910 Mar',
            color: 'rgba(3,1,10,0.65)'
        }, {
            x: -1.8541e+012,
            low: -0.916,
            high: -0.516,
            name: '1910 Apr',
            color: 'rgba(2,0,8,0.65)'
        }, {
            x: -1.8516e+012,
            low: -0.806,
            high: -0.402,
            name: '1910 May',
            color: 'rgba(7,3,20,0.65)'
        }, {
            x: -1.8489e+012,
            low: -0.753,
            high: -0.395,
            name: '1910 Jun',
            color: 'rgba(9,4,25,0.65)'
        }, {
            x: -1.8463e+012,
            low: -0.734,
            high: -0.295,
            name: '1910 Jul',
            color: 'rgba(16,7,42,0.65)'
        }, {
            x: -1.8436e+012,
            low: -0.762,
            high: -0.244,
            name: '1910 Aug',
            color: 'rgba(19,8,48,0.65)'
        }, {
            x: -1.8409e+012,
            low: -0.764,
            high: -0.262,
            name: '1910 Sep',
            color: 'rgba(17,7,44,0.65)'
        }, {
            x: -1.8383e+012,
            low: -0.687,
            high: -0.243,
            name: '1910 Oct',
            color: 'rgba(25,11,62,0.65)'
        }, {
            x: -1.8357e+012,
            low: -0.566,
            high: -0.194,
            name: '1910 Nov',
            color: 'rgba(59,12,93,0.65)'
        }, {
            x: -1.8331e+012,
            low: -0.477,
            high: -0.101,
            name: '1910 Dec',
            color: 'rgba(103,22,108,0.65)'
        }, {
            x: -1.8304e+012,
            low: -0.597,
            high: -0.128,
            name: '1910 Jan',
            color: 'rgba(65,12,98,0.65)'
        }, {
            x: -1.8277e+012,
            low: -0.511,
            high: -0.087,
            name: '1910 Feb',
            color: 'rgba(100,21,108,0.65)'
        }, {
            x: -1.8252e+012,
            low: -0.595,
            high: -0.175,
            name: '1910 Mar',
            color: 'rgba(55,12,90,0.65)'
        }, {
            x: -1.8225e+012,
            low: -0.542,
            high: -0.129,
            name: '1910 Apr',
            color: 'rgba(79,13,107,0.65)'
        }, {
            x: -1.8199e+012,
            low: -0.583,
            high: -0.179,
            name: '1910 May',
            color: 'rgba(59,12,93,0.65)'
        }, {
            x: -1.8173e+012,
            low: -0.497,
            high: -0.143,
            name: '1910 Jun',
            color: 'rgba(88,16,107,0.65)'
        }, {
            x: -1.8147e+012,
            low: -0.663,
            high: -0.251,
            name: '1910 Jul',
            color: 'rgba(27,12,66,0.65)'
        }, {
            x: -1.812e+012,
            low: -0.82,
            high: -0.299,
            name: '1910 Aug',
            color: 'rgba(10,4,28,0.65)'
        }, {
            x: -1.8093e+012,
            low: -0.804,
            high: -0.325,
            name: '1910 Sep',
            color: 'rgba(10,4,27,0.65)'
        }, {
            x: -1.8067e+012,
            low: -0.865,
            high: -0.423,
            name: '1910 Oct',
            color: 'rgba(5,2,15,0.65)'
        }, {
            x: -1.804e+012,
            low: -0.71,
            high: -0.323,
            name: '1910 Nov',
            color: 'rgba(16,7,43,0.65)'
        }, {
            x: -1.8014e+012,
            low: -0.674,
            high: -0.291,
            name: '1910 Dec',
            color: 'rgba(20,9,51,0.65)'
        }, {
            x: -1.7988e+012,
            low: -0.703,
            high: -0.225,
            name: '1910 Jan',
            color: 'rgba(25,11,62,0.65)'
        }, {
            x: -1.7961e+012,
            low: -0.725,
            high: -0.306,
            name: '1910 Feb',
            color: 'rgba(16,7,43,0.65)'
        }, {
            x: -1.7937e+012,
            low: -0.745,
            high: -0.326,
            name: '1910 Mar',
            color: 'rgba(13,6,36,0.65)'
        }, {
            x: -1.791e+012,
            low: -0.636,
            high: -0.224,
            name: '1910 Apr',
            color: 'rgba(36,12,73,0.65)'
        }, {
            x: -1.7884e+012,
            low: -0.713,
            high: -0.312,
            name: '1910 May',
            color: 'rgba(18,8,45,0.65)'
        }, {
            x: -1.7857e+012,
            low: -0.683,
            high: -0.334,
            name: '1910 Jun',
            color: 'rgba(17,7,44,0.65)'
        }, {
            x: -1.7831e+012,
            low: -0.664,
            high: -0.221,
            name: '1910 Jul',
            color: 'rgba(33,12,71,0.65)'
        }, {
            x: -1.7804e+012,
            low: -0.656,
            high: -0.133,
            name: '1910 Aug',
            color: 'rgba(51,12,87,0.65)'
        }, {
            x: -1.7778e+012,
            low: -0.668,
            high: -0.189,
            name: '1910 Sep',
            color: 'rgba(37,12,74,0.65)'
        }, {
            x: -1.7752e+012,
            low: -0.64,
            high: -0.221,
            name: '1910 Oct',
            color: 'rgba(36,12,74,0.65)'
        }, {
            x: -1.7725e+012,
            low: -0.458,
            high: -0.084,
            name: '1910 Nov',
            color: 'rgba(115,26,108,0.65)'
        }, {
            x: -1.7699e+012,
            low: -0.422,
            high: -0.043,
            name: '1910 Dec',
            color: 'rgba(131,32,105,0.65)'
        }, {
            x: -1.7672e+012,
            low: -0.333,
            high: 0.15,
            name: '1910 Jan',
            color: 'rgba(209,70,67,0.65)'
        }, {
            x: -1.7645e+012,
            low: -0.442,
            high: -0.016,
            name: '1910 Feb',
            color: 'rgba(139,35,103,0.65)'
        }, {
            x: -1.7621e+012,
            low: -0.551,
            high: -0.12,
            name: '1910 Mar',
            color: 'rgba(80,13,107,0.65)'
        }, {
            x: -1.7594e+012,
            low: -0.588,
            high: -0.185,
            name: '1910 Apr',
            color: 'rgba(54,12,89,0.65)'
        }, {
            x: -1.7569e+012,
            low: -0.488,
            high: -0.081,
            name: '1910 May',
            color: 'rgba(109,24,108,0.65)'
        }, {
            x: -1.7542e+012,
            low: -0.465,
            high: -0.117,
            name: '1910 Jun',
            color: 'rgba(103,22,108,0.65)'
        }, {
            x: -1.7516e+012,
            low: -0.558,
            high: -0.116,
            name: '1910 Jul',
            color: 'rgba(78,13,107,0.65)'
        }, {
            x: -1.7489e+012,
            low: -0.483,
            high: 0.048,
            name: '1910 Aug',
            color: 'rgba(147,37,100,0.65)'
        }, {
            x: -1.7462e+012,
            low: -0.532,
            high: 0.005,
            name: '1910 Sep',
            color: 'rgba(119,27,108,0.65)'
        }, {
            x: -1.7436e+012,
            low: -0.383,
            high: 0.079,
            name: '1910 Oct',
            color: 'rgba(181,53,85,0.65)'
        }, {
            x: -1.741e+012,
            low: -0.387,
            high: 0.03,
            name: '1910 Nov',
            color: 'rgba(170,47,92,0.65)'
        }, {
            x: -1.7384e+012,
            low: -0.441,
            high: -0.047,
            name: '1910 Dec',
            color: 'rgba(127,30,106,0.65)'
        }, {
            x: -1.7357e+012,
            low: -0.369,
            high: 0.139,
            name: '1910 Jan',
            color: 'rgba(198,63,75,0.65)'
        }, {
            x: -1.733e+012,
            low: -0.285,
            high: 0.169,
            name: '1910 Feb',
            color: 'rgba(223,87,52,0.65)'
        }, {
            x: -1.7306e+012,
            low: -0.427,
            high: 0.035,
            name: '1910 Mar',
            color: 'rgba(160,42,97,0.65)'
        }, {
            x: -1.7279e+012,
            low: -0.274,
            high: 0.165,
            name: '1910 Apr',
            color: 'rgba(223,88,51,0.65)'
        }, {
            x: -1.7253e+012,
            low: -0.448,
            high: 0.003,
            name: '1910 May',
            color: 'rgba(144,36,101,0.65)'
        }, {
            x: -1.7226e+012,
            low: -0.426,
            high: -0.019,
            name: '1910 Jun',
            color: 'rgba(143,36,102,0.65)'
        }, {
            x: -1.7201e+012,
            low: -0.367,
            high: 0.135,
            name: '1910 Jul',
            color: 'rgba(197,62,75,0.65)'
        }, {
            x: -1.7174e+012,
            low: -0.356,
            high: 0.198,
            name: '1910 Aug',
            color: 'rgba(214,77,61,0.65)'
        }, {
            x: -1.7147e+012,
            low: -0.399,
            high: 0.11,
            name: '1910 Sep',
            color: 'rgba(186,56,82,0.65)'
        }, {
            x: -1.7121e+012,
            low: -0.495,
            high: -0.021,
            name: '1910 Oct',
            color: 'rgba(121,28,108,0.65)'
        }, {
            x: -1.7094e+012,
            low: -0.347,
            high: 0.067,
            name: '1910 Nov',
            color: 'rgba(187,56,82,0.65)'
        }, {
            x: -1.7068e+012,
            low: -0.467,
            high: -0.037,
            name: '1910 Dec',
            color: 'rgba(122,28,108,0.65)'
        }, {
            x: -1.7042e+012,
            low: -0.507,
            high: 0.025,
            name: '1910 Jan',
            color: 'rgba(127,30,106,0.65)'
        }, {
            x: -1.7015e+012,
            low: -0.412,
            high: 0.037,
            name: '1910 Feb',
            color: 'rgba(164,43,96,0.65)'
        }, {
            x: -1.699e+012,
            low: -0.632,
            high: -0.175,
            name: '1910 Mar',
            color: 'rgba(47,12,83,0.65)'
        }, {
            x: -1.6963e+012,
            low: -0.564,
            high: -0.12,
            name: '1910 Apr',
            color: 'rgba(74,12,106,0.65)'
        }, {
            x: -1.6937e+012,
            low: -0.591,
            high: -0.139,
            name: '1910 May',
            color: 'rgba(64,12,98,0.65)'
        }, {
            x: -1.691e+012,
            low: -0.673,
            high: -0.271,
            name: '1910 Jun',
            color: 'rgba(23,10,57,0.65)'
        }, {
            x: -1.6884e+012,
            low: -0.617,
            high: -0.139,
            name: '1910 Jul',
            color: 'rgba(57,12,92,0.65)'
        }, {
            x: -1.6858e+012,
            low: -0.614,
            high: -0.082,
            name: '1910 Aug',
            color: 'rgba(72,12,104,0.65)'
        }, {
            x: -1.6831e+012,
            low: -0.585,
            high: -0.101,
            name: '1910 Sep',
            color: 'rgba(75,12,107,0.65)'
        }, {
            x: -1.6805e+012,
            low: -0.631,
            high: -0.18,
            name: '1910 Oct',
            color: 'rgba(48,12,84,0.65)'
        }, {
            x: -1.6778e+012,
            low: -0.768,
            high: -0.377,
            name: '1910 Nov',
            color: 'rgba(9,4,25,0.65)'
        }, {
            x: -1.6752e+012,
            low: -0.848,
            high: -0.399,
            name: '1910 Dec',
            color: 'rgba(5,2,17,0.65)'
        }, {
            x: -1.6725e+012,
            low: -0.935,
            high: -0.429,
            name: '1910 Jan',
            color: 'rgba(3,1,11,0.65)'
        }, {
            x: -1.6699e+012,
            low: -1.001,
            high: -0.52,
            name: '1910 Feb',
            color: 'rgba(1,0,6,0.65)'
        }, {
            x: -1.6674e+012,
            low: -1.054,
            high: -0.596,
            name: '1910 Mar',
            color: 'rgba(0,0,5,0.65)'
        }, {
            x: -1.6648e+012,
            low: -0.696,
            high: -0.254,
            name: '1910 Apr',
            color: 'rgba(22,10,56,0.65)'
        }, {
            x: -1.6622e+012,
            low: -0.889,
            high: -0.43,
            name: '1910 May',
            color: 'rgba(4,1,13,0.65)'
        }, {
            x: -1.6595e+012,
            low: -0.554,
            high: -0.15,
            name: '1910 Jun',
            color: 'rgba(70,12,103,0.65)'
        }, {
            x: -1.6569e+012,
            low: -0.366,
            high: 0.126,
            name: '1910 Jul',
            color: 'rgba(197,62,76,0.65)'
        }, {
            x: -1.6542e+012,
            low: -0.512,
            high: 0.065,
            name: '1910 Aug',
            color: 'rgba(142,36,102,0.65)'
        }, {
            x: -1.6515e+012,
            low: -0.382,
            high: 0.132,
            name: '1910 Sep',
            color: 'rgba(195,61,77,0.65)'
        }, {
            x: -1.6489e+012,
            low: -0.618,
            high: -0.161,
            name: '1910 Oct',
            color: 'rgba(53,12,88,0.65)'
        }, {
            x: -1.6463e+012,
            low: -0.596,
            high: -0.195,
            name: '1910 Nov',
            color: 'rgba(51,12,86,0.65)'
        }, {
            x: -1.6437e+012,
            low: -0.838,
            high: -0.408,
            name: '1910 Dec',
            color: 'rgba(6,2,17,0.65)'
        }, {
            x: -1.641e+012,
            low: -0.771,
            high: -0.235,
            name: '1910 Jan',
            color: 'rgba(19,8,47,0.65)'
        }, {
            x: -1.6383e+012,
            low: -0.749,
            high: -0.3,
            name: '1910 Feb',
            color: 'rgba(15,6,40,0.65)'
        }, {
            x: -1.6359e+012,
            low: -0.694,
            high: -0.2,
            name: '1910 Mar',
            color: 'rgba(31,12,69,0.65)'
        }, {
            x: -1.6332e+012,
            low: -0.733,
            high: -0.25,
            name: '1910 Apr',
            color: 'rgba(20,9,50,0.65)'
        }, {
            x: -1.6306e+012,
            low: -0.669,
            high: -0.189,
            name: '1910 May',
            color: 'rgba(39,12,76,0.65)'
        }, {
            x: -1.6279e+012,
            low: -0.557,
            high: -0.107,
            name: '1910 Jun',
            color: 'rgba(82,14,107,0.65)'
        }, {
            x: -1.6254e+012,
            low: -0.596,
            high: -0.087,
            name: '1910 Jul',
            color: 'rgba(76,12,107,0.65)'
        }, {
            x: -1.6227e+012,
            low: -0.649,
            high: -0.077,
            name: '1910 Aug',
            color: 'rgba(63,12,97,0.65)'
        }, {
            x: -1.62e+012,
            low: -0.51,
            high: 0.023,
            name: '1910 Sep',
            color: 'rgba(131,32,105,0.65)'
        }, {
            x: -1.6174e+012,
            low: -0.351,
            high: 0.156,
            name: '1910 Oct',
            color: 'rgba(206,67,70,0.65)'
        }, {
            x: -1.6147e+012,
            low: -0.255,
            high: 0.187,
            name: '1910 Nov',
            color: 'rgba(231,98,43,0.65)'
        }, {
            x: -1.6121e+012,
            low: -0.466,
            high: 0.018,
            name: '1910 Dec',
            color: 'rgba(139,34,103,0.65)'
        }, {
            x: -1.6095e+012,
            low: -0.381,
            high: 0.189,
            name: '1910 Jan',
            color: 'rgba(206,67,70,0.65)'
        }, {
            x: -1.6068e+012,
            low: -0.319,
            high: 0.16,
            name: '1910 Feb',
            color: 'rgba(213,76,62,0.65)'
        }, {
            x: -1.6044e+012,
            low: -0.554,
            high: -0.055,
            name: '1910 Mar',
            color: 'rgba(97,20,108,0.65)'
        }, {
            x: -1.6017e+012,
            low: -0.314,
            high: 0.167,
            name: '1910 Apr',
            color: 'rgba(215,78,60,0.65)'
        }, {
            x: -1.5991e+012,
            low: -0.484,
            high: -0.05,
            name: '1910 May',
            color: 'rgba(117,27,108,0.65)'
        }, {
            x: -1.5964e+012,
            low: -0.454,
            high: -0.052,
            name: '1910 Jun',
            color: 'rgba(124,29,107,0.65)'
        }, {
            x: -1.5938e+012,
            low: -0.602,
            high: -0.12,
            name: '1910 Jul',
            color: 'rgba(63,12,97,0.65)'
        }, {
            x: -1.5911e+012,
            low: -0.612,
            high: -0.054,
            name: '1910 Aug',
            color: 'rgba(83,14,107,0.65)'
        }, {
            x: -1.5885e+012,
            low: -0.485,
            high: 0.015,
            name: '1910 Sep',
            color: 'rgba(136,33,104,0.65)'
        }, {
            x: -1.5859e+012,
            low: -0.538,
            high: -0.072,
            name: '1910 Oct',
            color: 'rgba(96,19,107,0.65)'
        }, {
            x: -1.5832e+012,
            low: -0.731,
            high: -0.334,
            name: '1910 Nov',
            color: 'rgba(14,6,36,0.65)'
        }, {
            x: -1.5806e+012,
            low: -0.671,
            high: -0.238,
            name: '1910 Dec',
            color: 'rgba(28,12,67,0.65)'
        }, {
            x: -1.5779e+012,
            low: -0.503,
            high: 0.02,
            name: '1920 Jan',
            color: 'rgba(128,30,106,0.65)'
        }, {
            x: -1.5752e+012,
            low: -0.652,
            high: -0.205,
            name: '1920 Feb',
            color: 'rgba(38,12,75,0.65)'
        }, {
            x: -1.5727e+012,
            low: -0.351,
            high: 0.11,
            name: '1920 Mar',
            color: 'rgba(195,61,77,0.65)'
        }, {
            x: -1.5701e+012,
            low: -0.498,
            high: -0.027,
            name: '1920 Apr',
            color: 'rgba(117,27,108,0.65)'
        }, {
            x: -1.5675e+012,
            low: -0.408,
            high: 0.018,
            name: '1920 May',
            color: 'rgba(161,42,97,0.65)'
        }, {
            x: -1.5648e+012,
            low: -0.421,
            high: -0.003,
            name: '1920 Jun',
            color: 'rgba(147,37,100,0.65)'
        }, {
            x: -1.5622e+012,
            low: -0.535,
            high: -0.05,
            name: '1920 Jul',
            color: 'rgba(103,22,108,0.65)'
        }, {
            x: -1.5595e+012,
            low: -0.497,
            high: 0.037,
            name: '1920 Aug',
            color: 'rgba(137,34,104,0.65)'
        }, {
            x: -1.5568e+012,
            low: -0.391,
            high: 0.109,
            name: '1920 Sep',
            color: 'rgba(188,57,81,0.65)'
        }, {
            x: -1.5542e+012,
            low: -0.456,
            high: 0.008,
            name: '1920 Oct',
            color: 'rgba(141,35,102,0.65)'
        }, {
            x: -1.5516e+012,
            low: -0.479,
            high: -0.086,
            name: '1920 Nov',
            color: 'rgba(107,23,108,0.65)'
        }, {
            x: -1.549e+012,
            low: -0.555,
            high: -0.131,
            name: '1920 Dec',
            color: 'rgba(73,12,105,0.65)'
        }, {
            x: -1.5463e+012,
            low: -0.386,
            high: 0.12,
            name: '1920 Jan',
            color: 'rgba(188,57,81,0.65)'
        }, {
            x: -1.5436e+012,
            low: -0.401,
            high: 0.039,
            name: '1920 Feb',
            color: 'rgba(168,45,93,0.65)'
        }, {
            x: -1.5412e+012,
            low: -0.474,
            high: -0.026,
            name: '1920 Mar',
            color: 'rgba(124,29,107,0.65)'
        }, {
            x: -1.5385e+012,
            low: -0.43,
            high: -0.019,
            name: '1920 Apr',
            color: 'rgba(138,34,103,0.65)'
        }, {
            x: -1.5359e+012,
            low: -0.417,
            high: 0,
            name: '1920 May',
            color: 'rgba(153,39,99,0.65)'
        }, {
            x: -1.5333e+012,
            low: -0.313,
            high: 0.073,
            name: '1920 Jun',
            color: 'rgba(198,63,75,0.65)'
        }, {
            x: -1.5307e+012,
            low: -0.364,
            high: 0.087,
            name: '1920 Jul',
            color: 'rgba(188,57,81,0.65)'
        }, {
            x: -1.528e+012,
            low: -0.544,
            high: -0.01,
            name: '1920 Aug',
            color: 'rgba(110,24,108,0.65)'
        }, {
            x: -1.5253e+012,
            low: -0.404,
            high: 0.076,
            name: '1920 Sep',
            color: 'rgba(177,51,88,0.65)'
        }, {
            x: -1.5227e+012,
            low: -0.349,
            high: 0.069,
            name: '1920 Oct',
            color: 'rgba(187,56,82,0.65)'
        }, {
            x: -1.52e+012,
            low: -0.491,
            high: -0.111,
            name: '1920 Nov',
            color: 'rgba(98,20,108,0.65)'
        }, {
            x: -1.5174e+012,
            low: -0.355,
            high: 0.051,
            name: '1920 Dec',
            color: 'rgba(181,53,85,0.65)'
        }, {
            x: -1.5148e+012,
            low: -0.629,
            high: -0.163,
            name: '1920 Jan',
            color: 'rgba(50,12,86,0.65)'
        }, {
            x: -1.5121e+012,
            low: -0.488,
            high: -0.066,
            name: '1920 Feb',
            color: 'rgba(113,25,108,0.65)'
        }, {
            x: -1.5097e+012,
            low: -0.483,
            high: -0.051,
            name: '1920 Mar',
            color: 'rgba(115,26,108,0.65)'
        }, {
            x: -1.507e+012,
            low: -0.437,
            high: -0.025,
            name: '1920 Apr',
            color: 'rgba(133,32,105,0.65)'
        }, {
            x: -1.5044e+012,
            low: -0.596,
            high: -0.172,
            name: '1920 May',
            color: 'rgba(57,12,91,0.65)'
        }, {
            x: -1.5017e+012,
            low: -0.512,
            high: -0.133,
            name: '1920 Jun',
            color: 'rgba(88,16,107,0.65)'
        }, {
            x: -1.4991e+012,
            low: -0.453,
            high: -0.005,
            name: '1920 Jul',
            color: 'rgba(138,34,103,0.65)'
        }, {
            x: -1.4964e+012,
            low: -0.605,
            high: -0.083,
            name: '1920 Aug',
            color: 'rgba(73,12,105,0.65)'
        }, {
            x: -1.4938e+012,
            low: -0.512,
            high: -0.059,
            name: '1920 Sep',
            color: 'rgba(108,23,108,0.65)'
        }, {
            x: -1.4912e+012,
            low: -0.532,
            high: -0.111,
            name: '1920 Oct',
            color: 'rgba(86,16,107,0.65)'
        }, {
            x: -1.4885e+012,
            low: -0.471,
            high: -0.106,
            name: '1920 Nov',
            color: 'rgba(104,22,108,0.65)'
        }, {
            x: -1.4859e+012,
            low: -0.504,
            high: -0.104,
            name: '1920 Dec',
            color: 'rgba(96,19,107,0.65)'
        }, {
            x: -1.4832e+012,
            low: -0.451,
            high: -0.003,
            name: '1920 Jan',
            color: 'rgba(138,34,103,0.65)'
        }, {
            x: -1.4806e+012,
            low: -0.626,
            high: -0.208,
            name: '1920 Feb',
            color: 'rgba(43,12,79,0.65)'
        }, {
            x: -1.4781e+012,
            low: -0.613,
            high: -0.199,
            name: '1920 Mar',
            color: 'rgba(45,12,81,0.65)'
        }, {
            x: -1.4755e+012,
            low: -0.56,
            high: -0.156,
            name: '1920 Apr',
            color: 'rgba(66,12,99,0.65)'
        }, {
            x: -1.4729e+012,
            low: -0.526,
            high: -0.119,
            name: '1920 May',
            color: 'rgba(87,16,107,0.65)'
        }, {
            x: -1.4702e+012,
            low: -0.429,
            high: -0.072,
            name: '1920 Jun',
            color: 'rgba(128,30,106,0.65)'
        }, {
            x: -1.4676e+012,
            low: -0.565,
            high: -0.135,
            name: '1920 Jul',
            color: 'rgba(73,12,105,0.65)'
        }, {
            x: -1.4649e+012,
            low: -0.642,
            high: -0.113,
            name: '1920 Aug',
            color: 'rgba(59,12,93,0.65)'
        }, {
            x: -1.4622e+012,
            low: -0.555,
            high: -0.093,
            name: '1920 Sep',
            color: 'rgba(87,16,107,0.65)'
        }, {
            x: -1.4596e+012,
            low: -0.47,
            high: -0.055,
            name: '1920 Oct',
            color: 'rgba(118,27,108,0.65)'
        }, {
            x: -1.457e+012,
            low: -0.197,
            high: 0.155,
            name: '1920 Nov',
            color: 'rgba(235,103,38,0.65)'
        }, {
            x: -1.4544e+012,
            low: -0.195,
            high: 0.187,
            name: '1920 Dec',
            color: 'rgba(238,109,33,0.65)'
        }, {
            x: -1.4517e+012,
            low: -0.542,
            high: -0.08,
            name: '1920 Jan',
            color: 'rgba(90,17,107,0.65)'
        }, {
            x: -1.449e+012,
            low: -0.409,
            high: 0.002,
            name: '1920 Feb',
            color: 'rgba(154,40,99,0.65)'
        }, {
            x: -1.4465e+012,
            low: -0.483,
            high: -0.056,
            name: '1920 Mar',
            color: 'rgba(115,26,108,0.65)'
        }, {
            x: -1.4438e+012,
            low: -0.479,
            high: -0.073,
            name: '1920 Apr',
            color: 'rgba(109,24,108,0.65)'
        }, {
            x: -1.4412e+012,
            low: -0.45,
            high: -0.031,
            name: '1920 May',
            color: 'rgba(130,31,105,0.65)'
        }, {
            x: -1.4386e+012,
            low: -0.401,
            high: -0.039,
            name: '1920 Jun',
            color: 'rgba(146,37,101,0.65)'
        }, {
            x: -1.436e+012,
            low: -0.492,
            high: -0.041,
            name: '1920 Jul',
            color: 'rgba(118,27,108,0.65)'
        }, {
            x: -1.4333e+012,
            low: -0.537,
            high: -0.014,
            name: '1920 Aug',
            color: 'rgba(112,25,108,0.65)'
        }, {
            x: -1.4306e+012,
            low: -0.519,
            high: -0.036,
            name: '1920 Sep',
            color: 'rgba(110,24,108,0.65)'
        }, {
            x: -1.428e+012,
            low: -0.531,
            high: -0.096,
            name: '1920 Oct',
            color: 'rgba(91,17,107,0.65)'
        }, {
            x: -1.4253e+012,
            low: -0.544,
            high: -0.185,
            name: '1920 Nov',
            color: 'rgba(65,12,98,0.65)'
        }, {
            x: -1.4227e+012,
            low: -0.728,
            high: -0.325,
            name: '1920 Dec',
            color: 'rgba(15,6,39,0.65)'
        }, {
            x: -1.4201e+012,
            low: -0.631,
            high: -0.164,
            name: '1920 Jan',
            color: 'rgba(50,12,86,0.65)'
        }, {
            x: -1.4174e+012,
            low: -0.512,
            high: -0.098,
            name: '1920 Feb',
            color: 'rgba(96,19,107,0.65)'
        }, {
            x: -1.415e+012,
            low: -0.435,
            high: -0.009,
            name: '1920 Mar',
            color: 'rgba(142,36,102,0.65)'
        }, {
            x: -1.4123e+012,
            low: -0.471,
            high: -0.07,
            name: '1920 Apr',
            color: 'rgba(112,25,108,0.65)'
        }, {
            x: -1.4097e+012,
            low: -0.47,
            high: -0.051,
            name: '1920 May',
            color: 'rgba(121,28,108,0.65)'
        }, {
            x: -1.407e+012,
            low: -0.441,
            high: -0.078,
            name: '1920 Jun',
            color: 'rgba(123,29,107,0.65)'
        }, {
            x: -1.4044e+012,
            low: -0.438,
            high: 0.001,
            name: '1920 Jul',
            color: 'rgba(145,36,101,0.65)'
        }, {
            x: -1.4018e+012,
            low: -0.393,
            high: 0.14,
            name: '1920 Aug',
            color: 'rgba(190,58,80,0.65)'
        }, {
            x: -1.3991e+012,
            low: -0.433,
            high: 0.054,
            name: '1920 Sep',
            color: 'rgba(162,43,96,0.65)'
        }, {
            x: -1.3965e+012,
            low: -0.509,
            high: -0.103,
            name: '1920 Oct',
            color: 'rgba(96,19,107,0.65)'
        }, {
            x: -1.3938e+012,
            low: -0.238,
            high: 0.12,
            name: '1920 Nov',
            color: 'rgba(223,88,51,0.65)'
        }, {
            x: -1.3912e+012,
            low: -0.187,
            high: 0.204,
            name: '1920 Dec',
            color: 'rgba(240,115,30,0.65)'
        }, {
            x: -1.3885e+012,
            low: -0.141,
            high: 0.32,
            name: '1920 Jan',
            color: 'rgba(250,151,7,0.65)'
        }, {
            x: -1.3859e+012,
            low: -0.247,
            high: 0.163,
            name: '1920 Feb',
            color: 'rgba(227,93,47,0.65)'
        }, {
            x: -1.3834e+012,
            low: -0.232,
            high: 0.187,
            name: '1920 Mar',
            color: 'rgba(234,101,39,0.65)'
        }, {
            x: -1.3808e+012,
            low: -0.37,
            high: 0.035,
            name: '1920 Apr',
            color: 'rgba(173,48,90,0.65)'
        }, {
            x: -1.3782e+012,
            low: -0.427,
            high: -0.014,
            name: '1920 May',
            color: 'rgba(143,36,102,0.65)'
        }, {
            x: -1.3755e+012,
            low: -0.276,
            high: 0.089,
            name: '1920 Jun',
            color: 'rgba(209,70,67,0.65)'
        }, {
            x: -1.3729e+012,
            low: -0.459,
            high: -0.011,
            name: '1920 Jul',
            color: 'rgba(133,32,105,0.65)'
        }, {
            x: -1.3702e+012,
            low: -0.347,
            high: 0.179,
            name: '1920 Aug',
            color: 'rgba(210,72,65,0.65)'
        }, {
            x: -1.3675e+012,
            low: -0.341,
            high: 0.134,
            name: '1920 Sep',
            color: 'rgba(204,66,71,0.65)'
        }, {
            x: -1.3649e+012,
            low: -0.285,
            high: 0.117,
            name: '1920 Oct',
            color: 'rgba(211,73,65,0.65)'
        }, {
            x: -1.3623e+012,
            low: -0.287,
            high: 0.066,
            name: '1920 Nov',
            color: 'rgba(201,65,73,0.65)'
        }, {
            x: -1.3597e+012,
            low: -0.425,
            high: -0.048,
            name: '1920 Dec',
            color: 'rgba(134,33,104,0.65)'
        }, {
            x: -1.357e+012,
            low: -0.483,
            high: -0.015,
            name: '1920 Jan',
            color: 'rgba(123,29,107,0.65)'
        }, {
            x: -1.3543e+012,
            low: -0.351,
            high: 0.057,
            name: '1920 Feb',
            color: 'rgba(184,55,83,0.65)'
        }, {
            x: -1.3519e+012,
            low: -0.534,
            high: -0.119,
            name: '1920 Mar',
            color: 'rgba(83,15,107,0.65)'
        }, {
            x: -1.3492e+012,
            low: -0.454,
            high: -0.059,
            name: '1920 Apr',
            color: 'rgba(120,28,108,0.65)'
        }, {
            x: -1.3466e+012,
            low: -0.461,
            high: -0.06,
            name: '1920 May',
            color: 'rgba(121,28,108,0.65)'
        }, {
            x: -1.344e+012,
            low: -0.418,
            high: -0.062,
            name: '1920 Jun',
            color: 'rgba(131,32,105,0.65)'
        }, {
            x: -1.3414e+012,
            low: -0.366,
            high: 0.073,
            name: '1920 Jul',
            color: 'rgba(184,55,83,0.65)'
        }, {
            x: -1.3387e+012,
            low: -0.396,
            high: 0.114,
            name: '1920 Aug',
            color: 'rgba(185,55,83,0.65)'
        }, {
            x: -1.336e+012,
            low: -0.368,
            high: 0.104,
            name: '1920 Sep',
            color: 'rgba(189,58,80,0.65)'
        }, {
            x: -1.3334e+012,
            low: -0.236,
            high: 0.158,
            name: '1920 Oct',
            color: 'rgba(228,94,46,0.65)'
        }, {
            x: -1.3307e+012,
            low: -0.351,
            high: 0.001,
            name: '1920 Nov',
            color: 'rgba(171,47,91,0.65)'
        }, {
            x: -1.3281e+012,
            low: -0.619,
            high: -0.237,
            name: '1920 Dec',
            color: 'rgba(38,12,75,0.65)'
        }, {
            x: -1.3255e+012,
            low: -0.274,
            high: 0.179,
            name: '1920 Jan',
            color: 'rgba(224,90,50,0.65)'
        }, {
            x: -1.3228e+012,
            low: -0.337,
            high: 0.058,
            name: '1920 Feb',
            color: 'rgba(188,57,81,0.65)'
        }, {
            x: -1.3203e+012,
            low: -0.545,
            high: -0.13,
            name: '1920 Mar',
            color: 'rgba(77,12,107,0.65)'
        }, {
            x: -1.3176e+012,
            low: -0.45,
            high: -0.053,
            name: '1920 Apr',
            color: 'rgba(123,29,108,0.65)'
        }, {
            x: -1.315e+012,
            low: -0.485,
            high: -0.091,
            name: '1920 May',
            color: 'rgba(105,22,108,0.65)'
        }, {
            x: -1.3123e+012,
            low: -0.524,
            high: -0.17,
            name: '1920 Jun',
            color: 'rgba(74,12,106,0.65)'
        }, {
            x: -1.3097e+012,
            low: -0.383,
            high: 0.052,
            name: '1920 Jul',
            color: 'rgba(175,50,89,0.65)'
        }, {
            x: -1.3071e+012,
            low: -0.424,
            high: 0.084,
            name: '1920 Aug',
            color: 'rgba(170,47,92,0.65)'
        }, {
            x: -1.3044e+012,
            low: -0.463,
            high: 0.017,
            name: '1920 Sep',
            color: 'rgba(142,36,102,0.65)'
        }, {
            x: -1.3018e+012,
            low: -0.367,
            high: 0.033,
            name: '1920 Oct',
            color: 'rgba(173,48,90,0.65)'
        }, {
            x: -1.2991e+012,
            low: -0.342,
            high: 0.021,
            name: '1920 Nov',
            color: 'rgba(179,52,86,0.65)'
        }, {
            x: -1.2965e+012,
            low: -0.426,
            high: -0.045,
            name: '1920 Dec',
            color: 'rgba(133,32,105,0.65)'
        }, {
            x: -1.2938e+012,
            low: -0.705,
            high: -0.251,
            name: '1920 Jan',
            color: 'rgba(22,9,55,0.65)'
        }, {
            x: -1.2912e+012,
            low: -0.865,
            high: -0.468,
            name: '1920 Feb',
            color: 'rgba(3,1,12,0.65)'
        }, {
            x: -1.2887e+012,
            low: -0.611,
            high: -0.195,
            name: '1920 Mar',
            color: 'rgba(47,12,83,0.65)'
        }, {
            x: -1.2861e+012,
            low: -0.584,
            high: -0.189,
            name: '1920 Apr',
            color: 'rgba(53,12,88,0.65)'
        }, {
            x: -1.2835e+012,
            low: -0.597,
            high: -0.184,
            name: '1920 May',
            color: 'rgba(53,12,88,0.65)'
        }, {
            x: -1.2808e+012,
            low: -0.529,
            high: -0.176,
            name: '1920 Jun',
            color: 'rgba(71,12,103,0.65)'
        }, {
            x: -1.2782e+012,
            low: -0.579,
            high: -0.147,
            name: '1920 Jul',
            color: 'rgba(65,12,98,0.65)'
        }, {
            x: -1.2755e+012,
            low: -0.452,
            high: 0.076,
            name: '1920 Aug',
            color: 'rgba(162,43,96,0.65)'
        }, {
            x: -1.2728e+012,
            low: -0.499,
            high: -0.031,
            name: '1920 Sep',
            color: 'rgba(116,26,108,0.65)'
        }, {
            x: -1.2703e+012,
            low: -0.379,
            high: 0.021,
            name: '1920 Oct',
            color: 'rgba(167,45,94,0.65)'
        }, {
            x: -1.2676e+012,
            low: -0.253,
            high: 0.1,
            name: '1920 Nov',
            color: 'rgba(215,78,60,0.65)'
        }, {
            x: -1.265e+012,
            low: -0.669,
            high: -0.286,
            name: '1920 Dec',
            color: 'rgba(23,10,57,0.65)'
        }, {
            x: -1.2623e+012,
            low: -0.559,
            high: -0.101,
            name: '1930 Jan',
            color: 'rgba(83,14,107,0.65)'
        }, {
            x: -1.2596e+012,
            low: -0.486,
            high: -0.098,
            name: '1930 Feb',
            color: 'rgba(102,21,108,0.65)'
        }, {
            x: -1.2572e+012,
            low: -0.364,
            high: 0.06,
            name: '1930 Mar',
            color: 'rgba(180,52,86,0.65)'
        }, {
            x: -1.2545e+012,
            low: -0.397,
            high: 0.009,
            name: '1930 Apr',
            color: 'rgba(160,42,97,0.65)'
        }, {
            x: -1.2519e+012,
            low: -0.405,
            high: 0.005,
            name: '1930 May',
            color: 'rgba(157,41,98,0.65)'
        }, {
            x: -1.2493e+012,
            low: -0.345,
            high: 0.021,
            name: '1930 Jun',
            color: 'rgba(177,51,88,0.65)'
        }, {
            x: -1.2467e+012,
            low: -0.343,
            high: 0.111,
            name: '1930 Jul',
            color: 'rgba(197,62,76,0.65)'
        }, {
            x: -1.244e+012,
            low: -0.322,
            high: 0.212,
            name: '1930 Aug',
            color: 'rgba(223,87,52,0.65)'
        }, {
            x: -1.2413e+012,
            low: -0.324,
            high: 0.164,
            name: '1930 Sep',
            color: 'rgba(213,76,62,0.65)'
        }, {
            x: -1.2387e+012,
            low: -0.289,
            high: 0.11,
            name: '1930 Oct',
            color: 'rgba(208,70,68,0.65)'
        }, {
            x: -1.236e+012,
            low: -0.109,
            high: 0.259,
            name: '1930 Nov',
            color: 'rgba(248,146,10,0.65)'
        }, {
            x: -1.2334e+012,
            low: -0.274,
            high: 0.118,
            name: '1930 Dec',
            color: 'rgba(216,80,59,0.65)'
        }, {
            x: -1.2308e+012,
            low: -0.225,
            high: 0.219,
            name: '1930 Jan',
            color: 'rgba(238,110,33,0.65)'
        }, {
            x: -1.2281e+012,
            low: -0.345,
            high: 0.044,
            name: '1930 Feb',
            color: 'rgba(182,53,85,0.65)'
        }, {
            x: -1.2257e+012,
            low: -0.325,
            high: 0.093,
            name: '1930 Mar',
            color: 'rgba(197,62,76,0.65)'
        }, {
            x: -1.223e+012,
            low: -0.384,
            high: 0.025,
            name: '1930 Apr',
            color: 'rgba(167,45,94,0.65)'
        }, {
            x: -1.2204e+012,
            low: -0.371,
            high: 0.035,
            name: '1930 May',
            color: 'rgba(175,50,89,0.65)'
        }, {
            x: -1.2177e+012,
            low: -0.217,
            high: 0.146,
            name: '1930 Jun',
            color: 'rgba(230,97,44,0.65)'
        }, {
            x: -1.2151e+012,
            low: -0.225,
            high: 0.24,
            name: '1930 Jul',
            color: 'rgba(240,115,30,0.65)'
        }, {
            x: -1.2125e+012,
            low: -0.308,
            high: 0.224,
            name: '1930 Aug',
            color: 'rgba(226,91,48,0.65)'
        }, {
            x: -1.2098e+012,
            low: -0.284,
            high: 0.184,
            name: '1930 Sep',
            color: 'rgba(226,91,48,0.65)'
        }, {
            x: -1.2072e+012,
            low: -0.249,
            high: 0.177,
            name: '1930 Oct',
            color: 'rgba(228,94,46,0.65)'
        }, {
            x: -1.2045e+012,
            low: -0.332,
            high: 0.029,
            name: '1930 Nov',
            color: 'rgba(183,54,84,0.65)'
        }, {
            x: -1.2019e+012,
            low: -0.302,
            high: 0.086,
            name: '1930 Dec',
            color: 'rgba(205,67,71,0.65)'
        }, {
            x: -1.1992e+012,
            low: -0.062,
            high: 0.385,
            name: '1930 Jan',
            color: 'rgba(249,177,29,0.65)'
        }, {
            x: -1.1966e+012,
            low: -0.39,
            high: 0.009,
            name: '1930 Feb',
            color: 'rgba(161,42,97,0.65)'
        }, {
            x: -1.194e+012,
            low: -0.444,
            high: -0.025,
            name: '1930 Mar',
            color: 'rgba(132,32,105,0.65)'
        }, {
            x: -1.1914e+012,
            low: -0.262,
            high: 0.131,
            name: '1930 Apr',
            color: 'rgba(219,82,56,0.65)'
        }, {
            x: -1.1888e+012,
            low: -0.37,
            high: 0.027,
            name: '1930 May',
            color: 'rgba(173,49,90,0.65)'
        }, {
            x: -1.1861e+012,
            low: -0.37,
            high: -0.016,
            name: '1930 Jun',
            color: 'rgba(159,41,97,0.65)'
        }, {
            x: -1.1835e+012,
            low: -0.348,
            high: 0.098,
            name: '1930 Jul',
            color: 'rgba(192,59,78,0.65)'
        }, {
            x: -1.1808e+012,
            low: -0.468,
            high: 0.082,
            name: '1930 Aug',
            color: 'rgba(157,41,98,0.65)'
        }, {
            x: -1.1782e+012,
            low: -0.273,
            high: 0.193,
            name: '1930 Sep',
            color: 'rgba(230,96,44,0.65)'
        }, {
            x: -1.1756e+012,
            low: -0.365,
            high: 0.031,
            name: '1930 Oct',
            color: 'rgba(171,47,91,0.65)'
        }, {
            x: -1.1729e+012,
            low: -0.404,
            high: -0.065,
            name: '1930 Nov',
            color: 'rgba(137,34,104,0.65)'
        }, {
            x: -1.1703e+012,
            low: -0.388,
            high: -0.009,
            name: '1930 Dec',
            color: 'rgba(160,42,97,0.65)'
        }, {
            x: -1.1676e+012,
            low: -0.513,
            high: -0.059,
            name: '1930 Jan',
            color: 'rgba(105,22,108,0.65)'
        }, {
            x: -1.1649e+012,
            low: -0.512,
            high: -0.123,
            name: '1930 Feb',
            color: 'rgba(90,17,107,0.65)'
        }, {
            x: -1.1625e+012,
            low: -0.53,
            high: -0.146,
            name: '1930 Mar',
            color: 'rgba(76,12,107,0.65)'
        }, {
            x: -1.1598e+012,
            low: -0.419,
            high: -0.019,
            name: '1930 Apr',
            color: 'rgba(144,36,101,0.65)'
        }, {
            x: -1.1572e+012,
            low: -0.411,
            high: -0.013,
            name: '1930 May',
            color: 'rgba(150,38,100,0.65)'
        }, {
            x: -1.1546e+012,
            low: -0.442,
            high: -0.077,
            name: '1930 Jun',
            color: 'rgba(120,28,108,0.65)'
        }, {
            x: -1.152e+012,
            low: -0.407,
            high: 0.04,
            name: '1930 Jul',
            color: 'rgba(165,44,95,0.65)'
        }, {
            x: -1.1493e+012,
            low: -0.432,
            high: 0.088,
            name: '1930 Aug',
            color: 'rgba(170,47,92,0.65)'
        }, {
            x: -1.1466e+012,
            low: -0.466,
            high: -0.006,
            name: '1930 Sep',
            color: 'rgba(134,33,104,0.65)'
        }, {
            x: -1.144e+012,
            low: -0.389,
            high: 0.004,
            name: '1930 Oct',
            color: 'rgba(156,40,98,0.65)'
        }, {
            x: -1.1413e+012,
            low: -0.486,
            high: -0.141,
            name: '1930 Nov',
            color: 'rgba(93,18,107,0.65)'
        }, {
            x: -1.1388e+012,
            low: -0.715,
            high: -0.347,
            name: '1930 Dec',
            color: 'rgba(15,6,39,0.65)'
        }, {
            x: -1.1361e+012,
            low: -0.436,
            high: -0.003,
            name: '1930 Jan',
            color: 'rgba(144,36,101,0.65)'
        }, {
            x: -1.1334e+012,
            low: -0.346,
            high: 0.023,
            name: '1930 Feb',
            color: 'rgba(178,51,87,0.65)'
        }, {
            x: -1.131e+012,
            low: -0.578,
            high: -0.192,
            name: '1930 Mar',
            color: 'rgba(54,12,89,0.65)'
        }, {
            x: -1.1283e+012,
            low: -0.446,
            high: -0.052,
            name: '1930 Apr',
            color: 'rgba(126,30,107,0.65)'
        }, {
            x: -1.1257e+012,
            low: -0.279,
            high: 0.113,
            name: '1930 May',
            color: 'rgba(213,76,62,0.65)'
        }, {
            x: -1.123e+012,
            low: -0.224,
            high: 0.143,
            name: '1930 Jun',
            color: 'rgba(227,93,47,0.65)'
        }, {
            x: -1.1204e+012,
            low: -0.285,
            high: 0.159,
            name: '1930 Jul',
            color: 'rgba(219,83,55,0.65)'
        }, {
            x: -1.1178e+012,
            low: -0.321,
            high: 0.212,
            name: '1930 Aug',
            color: 'rgba(222,87,53,0.65)'
        }, {
            x: -1.1151e+012,
            low: -0.326,
            high: 0.134,
            name: '1930 Sep',
            color: 'rgba(208,69,68,0.65)'
        }, {
            x: -1.1125e+012,
            low: -0.277,
            high: 0.117,
            name: '1930 Oct',
            color: 'rgba(212,74,64,0.65)'
        }, {
            x: -1.1098e+012,
            low: -0.144,
            high: 0.187,
            name: '1930 Nov',
            color: 'rgba(242,124,24,0.65)'
        }, {
            x: -1.1072e+012,
            low: -0.323,
            high: 0.049,
            name: '1930 Dec',
            color: 'rgba(189,58,80,0.65)'
        }, {
            x: -1.1045e+012,
            low: -0.442,
            high: -0.005,
            name: '1930 Jan',
            color: 'rgba(142,36,102,0.65)'
        }, {
            x: -1.1019e+012,
            low: -0.081,
            high: 0.292,
            name: '1930 Feb',
            color: 'rgba(250,156,8,0.65)'
        }, {
            x: -1.0994e+012,
            low: -0.406,
            high: -0.031,
            name: '1930 Mar',
            color: 'rgba(143,36,102,0.65)'
        }, {
            x: -1.0968e+012,
            low: -0.461,
            high: -0.072,
            name: '1930 Apr',
            color: 'rgba(116,26,108,0.65)'
        }, {
            x: -1.0942e+012,
            low: -0.442,
            high: -0.046,
            name: '1930 May',
            color: 'rgba(129,31,106,0.65)'
        }, {
            x: -1.0915e+012,
            low: -0.366,
            high: -0.002,
            name: '1930 Jun',
            color: 'rgba(165,44,95,0.65)'
        }, {
            x: -1.0889e+012,
            low: -0.359,
            high: 0.076,
            name: '1930 Jul',
            color: 'rgba(185,55,83,0.65)'
        }, {
            x: -1.0862e+012,
            low: -0.412,
            high: 0.113,
            name: '1930 Aug',
            color: 'rgba(181,53,85,0.65)'
        }, {
            x: -1.0835e+012,
            low: -0.369,
            high: 0.095,
            name: '1930 Sep',
            color: 'rgba(188,57,81,0.65)'
        }, {
            x: -1.081e+012,
            low: -0.264,
            high: 0.121,
            name: '1930 Oct',
            color: 'rgba(214,77,61,0.65)'
        }, {
            x: -1.0783e+012,
            low: -0.465,
            high: -0.133,
            name: '1930 Nov',
            color: 'rgba(99,20,108,0.65)'
        }, {
            x: -1.0757e+012,
            low: -0.46,
            high: -0.079,
            name: '1930 Dec',
            color: 'rgba(118,27,108,0.65)'
        }, {
            x: -1.073e+012,
            low: -0.51,
            high: -0.087,
            name: '1930 Jan',
            color: 'rgba(99,20,108,0.65)'
        }, {
            x: -1.0703e+012,
            low: -0.536,
            high: -0.172,
            name: '1930 Feb',
            color: 'rgba(70,12,102,0.65)'
        }, {
            x: -1.0678e+012,
            low: -0.472,
            high: -0.105,
            name: '1930 Mar',
            color: 'rgba(102,21,108,0.65)'
        }, {
            x: -1.0651e+012,
            low: -0.384,
            high: -0.02,
            name: '1930 Apr',
            color: 'rgba(154,40,99,0.65)'
        }, {
            x: -1.0625e+012,
            low: -0.347,
            high: 0.038,
            name: '1930 May',
            color: 'rgba(183,54,84,0.65)'
        }, {
            x: -1.0599e+012,
            low: -0.335,
            high: 0.015,
            name: '1930 Jun',
            color: 'rgba(177,51,88,0.65)'
        }, {
            x: -1.0573e+012,
            low: -0.232,
            high: 0.191,
            name: '1930 Jul',
            color: 'rgba(234,101,39,0.65)'
        }, {
            x: -1.0546e+012,
            low: -0.298,
            high: 0.217,
            name: '1930 Aug',
            color: 'rgba(227,92,47,0.65)'
        }, {
            x: -1.0519e+012,
            low: -0.335,
            high: 0.124,
            name: '1930 Sep',
            color: 'rgba(204,66,71,0.65)'
        }, {
            x: -1.0493e+012,
            low: -0.187,
            high: 0.189,
            name: '1930 Oct',
            color: 'rgba(238,110,33,0.65)'
        }, {
            x: -1.0466e+012,
            low: -0.234,
            high: 0.096,
            name: '1930 Nov',
            color: 'rgba(217,81,58,0.65)'
        }, {
            x: -1.0441e+012,
            low: -0.202,
            high: 0.172,
            name: '1930 Dec',
            color: 'rgba(237,107,35,0.65)'
        }, {
            x: -1.0414e+012,
            low: -0.346,
            high: 0.099,
            name: '1930 Jan',
            color: 'rgba(196,61,76,0.65)'
        }, {
            x: -1.0387e+012,
            low: -0.146,
            high: 0.224,
            name: '1930 Feb',
            color: 'rgba(244,132,19,0.65)'
        }, {
            x: -1.0363e+012,
            low: -0.454,
            high: -0.082,
            name: '1930 Mar',
            color: 'rgba(113,25,108,0.65)'
        }, {
            x: -1.0336e+012,
            low: -0.312,
            high: 0.056,
            name: '1930 Apr',
            color: 'rgba(192,59,78,0.65)'
        }, {
            x: -1.031e+012,
            low: -0.271,
            high: 0.106,
            name: '1930 May',
            color: 'rgba(213,76,62,0.65)'
        }, {
            x: -1.0283e+012,
            low: -0.182,
            high: 0.171,
            name: '1930 Jun',
            color: 'rgba(237,107,35,0.65)'
        }, {
            x: -1.0257e+012,
            low: -0.162,
            high: 0.263,
            name: '1930 Jul',
            color: 'rgba(245,136,17,0.65)'
        }, {
            x: -1.0231e+012,
            low: -0.171,
            high: 0.34,
            name: '1930 Aug',
            color: 'rgba(249,148,9,0.65)'
        }, {
            x: -1.0204e+012,
            low: -0.119,
            high: 0.341,
            name: '1930 Sep',
            color: 'rgba(250,158,10,0.65)'
        }, {
            x: -1.0178e+012,
            low: -0.063,
            high: 0.317,
            name: '1930 Oct',
            color: 'rgba(250,160,12,0.65)'
        }, {
            x: -1.0151e+012,
            low: -0.161,
            high: 0.161,
            name: '1930 Nov',
            color: 'rgba(239,112,32,0.65)'
        }, {
            x: -1.0125e+012,
            low: -0.3,
            high: 0.086,
            name: '1930 Dec',
            color: 'rgba(205,67,71,0.65)'
        }, {
            x: -1.0098e+012,
            low: -0.202,
            high: 0.237,
            name: '1930 Jan',
            color: 'rgba(242,122,25,0.65)'
        }, {
            x: -1.0072e+012,
            low: -0.164,
            high: 0.201,
            name: '1930 Feb',
            color: 'rgba(242,122,25,0.65)'
        }, {
            x: -1.0047e+012,
            low: -0.111,
            high: 0.249,
            name: '1930 Mar',
            color: 'rgba(247,142,13,0.65)'
        }, {
            x: -1.0021e+012,
            low: -0.103,
            high: 0.271,
            name: '1930 Apr',
            color: 'rgba(249,149,8,0.65)'
        }, {
            x: -9.9948e+011,
            low: -0.284,
            high: 0.1,
            name: '1930 May',
            color: 'rgba(210,72,65,0.65)'
        }, {
            x: -9.968e+011,
            low: -0.233,
            high: 0.118,
            name: '1930 Jun',
            color: 'rgba(222,87,53,0.65)'
        }, {
            x: -9.942e+011,
            low: -0.26,
            high: 0.169,
            name: '1930 Jul',
            color: 'rgba(226,92,48,0.65)'
        }, {
            x: -9.9153e+011,
            low: -0.243,
            high: 0.276,
            name: '1930 Aug',
            color: 'rgba(241,119,27,0.65)'
        }, {
            x: -9.8885e+011,
            low: -0.179,
            high: 0.3,
            name: '1930 Sep',
            color: 'rgba(247,141,13,0.65)'
        }, {
            x: -9.8626e+011,
            low: -0.045,
            high: 0.346,
            name: '1930 Oct',
            color: 'rgba(249,172,24,0.65)'
        }, {
            x: -9.8358e+011,
            low: -0.149,
            high: 0.181,
            name: '1930 Nov',
            color: 'rgba(242,122,25,0.65)'
        }, {
            x: -9.8099e+011,
            low: -0.487,
            high: -0.108,
            name: '1930 Dec',
            color: 'rgba(102,21,108,0.65)'
        }, {
            x: -9.7831e+011,
            low: -0.29,
            high: 0.157,
            name: '1930 Jan',
            color: 'rgba(219,82,56,0.65)'
        }, {
            x: -9.7563e+011,
            low: -0.228,
            high: 0.138,
            name: '1930 Feb',
            color: 'rgba(227,92,47,0.65)'
        }, {
            x: -9.7321e+011,
            low: -0.441,
            high: -0.073,
            name: '1930 Mar',
            color: 'rgba(120,28,108,0.65)'
        }, {
            x: -9.7053e+011,
            low: -0.275,
            high: 0.087,
            name: '1930 Apr',
            color: 'rgba(207,68,69,0.65)'
        }, {
            x: -9.6794e+011,
            low: -0.224,
            high: 0.161,
            name: '1930 May',
            color: 'rgba(233,100,40,0.65)'
        }, {
            x: -9.6526e+011,
            low: -0.114,
            high: 0.24,
            name: '1930 Jun',
            color: 'rgba(247,141,13,0.65)'
        }, {
            x: -9.6267e+011,
            low: -0.165,
            high: 0.267,
            name: '1930 Jul',
            color: 'rgba(246,136,16,0.65)'
        }, {
            x: -9.5999e+011,
            low: -0.223,
            high: 0.306,
            name: '1930 Aug',
            color: 'rgba(244,132,19,0.65)'
        }, {
            x: -9.5731e+011,
            low: -0.317,
            high: 0.173,
            name: '1930 Sep',
            color: 'rgba(216,80,59,0.65)'
        }, {
            x: -9.5472e+011,
            low: -0.482,
            high: -0.064,
            name: '1930 Oct',
            color: 'rgba(113,25,108,0.65)'
        }, {
            x: -9.5204e+011,
            low: -0.302,
            high: 0.055,
            name: '1930 Nov',
            color: 'rgba(196,61,76,0.65)'
        }, {
            x: -9.4945e+011,
            low: 0.029,
            high: 0.401,
            name: '1930 Dec',
            color: 'rgba(248,188,40,0.65)'
        }, {
            x: -9.4677e+011,
            low: -0.418,
            high: 0.049,
            name: '1940 Jan',
            color: 'rgba(165,44,95,0.65)'
        }, {
            x: -9.4409e+011,
            low: -0.206,
            high: 0.138,
            name: '1940 Feb',
            color: 'rgba(231,98,43,0.65)'
        }, {
            x: -9.4159e+011,
            low: -0.3,
            high: 0.089,
            name: '1940 Mar',
            color: 'rgba(202,65,72,0.65)'
        }, {
            x: -9.3891e+011,
            low: -0.135,
            high: 0.265,
            name: '1940 Apr',
            color: 'rgba(247,142,13,0.65)'
        }, {
            x: -9.3632e+011,
            low: -0.181,
            high: 0.232,
            name: '1940 May',
            color: 'rgba(242,125,24,0.65)'
        }, {
            x: -9.3364e+011,
            low: -0.153,
            high: 0.231,
            name: '1940 Jun',
            color: 'rgba(244,130,20,0.65)'
        }, {
            x: -9.3105e+011,
            low: -0.085,
            high: 0.364,
            name: '1940 Jul',
            color: 'rgba(249,170,22,0.65)'
        }, {
            x: -9.2837e+011,
            low: -0.209,
            high: 0.31,
            name: '1940 Aug',
            color: 'rgba(245,135,17,0.65)'
        }, {
            x: -9.2569e+011,
            low: -0.125,
            high: 0.378,
            name: '1940 Sep',
            color: 'rgba(250,161,13,0.65)'
        }, {
            x: -9.231e+011,
            low: -0.196,
            high: 0.222,
            name: '1940 Oct',
            color: 'rgba(241,119,27,0.65)'
        }, {
            x: -9.2042e+011,
            low: -0.251,
            high: 0.123,
            name: '1940 Nov',
            color: 'rgba(221,85,53,0.65)'
        }, {
            x: -9.1783e+011,
            low: -0.055,
            high: 0.372,
            name: '1940 Dec',
            color: 'rgba(249,175,27,0.65)'
        }, {
            x: -9.1515e+011,
            low: -0.322,
            high: 0.132,
            name: '1940 Jan',
            color: 'rgba(207,68,69,0.65)'
        }, {
            x: -9.1247e+011,
            low: -0.188,
            high: 0.15,
            name: '1940 Feb',
            color: 'rgba(235,103,38,0.65)'
        }, {
            x: -9.1005e+011,
            low: -0.33,
            high: 0.047,
            name: '1940 Mar',
            color: 'rgba(186,56,82,0.65)'
        }, {
            x: -9.0737e+011,
            low: -0.171,
            high: 0.213,
            name: '1940 Apr',
            color: 'rgba(242,124,24,0.65)'
        }, {
            x: -9.0478e+011,
            low: -0.215,
            high: 0.167,
            name: '1940 May',
            color: 'rgba(235,103,38,0.65)'
        }, {
            x: -9.021e+011,
            low: -0.055,
            high: 0.296,
            name: '1940 Jun',
            color: 'rgba(250,161,13,0.65)'
        }, {
            x: -8.9951e+011,
            low: -0.1,
            high: 0.331,
            name: '1940 Jul',
            color: 'rgba(250,159,11,0.65)'
        }, {
            x: -8.9683e+011,
            low: -0.225,
            high: 0.264,
            name: '1940 Aug',
            color: 'rgba(242,122,25,0.65)'
        }, {
            x: -8.9415e+011,
            low: -0.366,
            high: 0.106,
            name: '1940 Sep',
            color: 'rgba(191,59,79,0.65)'
        }, {
            x: -8.9156e+011,
            low: 0.027,
            high: 0.405,
            name: '1940 Oct',
            color: 'rgba(248,189,41,0.65)'
        }, {
            x: -8.8888e+011,
            low: -0.128,
            high: 0.228,
            name: '1940 Nov',
            color: 'rgba(246,137,16,0.65)'
        }, {
            x: -8.8629e+011,
            low: -0.13,
            high: 0.325,
            name: '1940 Dec',
            color: 'rgba(250,155,7,0.65)'
        }, {
            x: -8.8361e+011,
            low: -0.034,
            high: 0.455,
            name: '1940 Jan',
            color: 'rgba(248,187,39,0.65)'
        }, {
            x: -8.8093e+011,
            low: -0.272,
            high: 0.115,
            name: '1940 Feb',
            color: 'rgba(213,76,62,0.65)'
        }, {
            x: -8.7852e+011,
            low: -0.295,
            high: 0.111,
            name: '1940 Mar',
            color: 'rgba(210,72,65,0.65)'
        }, {
            x: -8.7584e+011,
            low: -0.255,
            high: 0.126,
            name: '1940 Apr',
            color: 'rgba(221,85,54,0.65)'
        }, {
            x: -8.7324e+011,
            low: -0.219,
            high: 0.19,
            name: '1940 May',
            color: 'rgba(237,106,36,0.65)'
        }, {
            x: -8.7057e+011,
            low: -0.163,
            high: 0.232,
            name: '1940 Jun',
            color: 'rgba(243,129,21,0.65)'
        }, {
            x: -8.6797e+011,
            low: -0.296,
            high: 0.147,
            name: '1940 Jul',
            color: 'rgba(215,78,60,0.65)'
        }, {
            x: -8.653e+011,
            low: -0.329,
            high: 0.202,
            name: '1940 Aug',
            color: 'rgba(221,85,54,0.65)'
        }, {
            x: -8.6262e+011,
            low: -0.239,
            high: 0.246,
            name: '1940 Sep',
            color: 'rgba(239,113,31,0.65)'
        }, {
            x: -8.6003e+011,
            low: -0.291,
            high: 0.131,
            name: '1940 Oct',
            color: 'rgba(214,77,61,0.65)'
        }, {
            x: -8.5735e+011,
            low: -0.255,
            high: 0.108,
            name: '1940 Nov',
            color: 'rgba(216,80,59,0.65)'
        }, {
            x: -8.5476e+011,
            low: -0.199,
            high: 0.218,
            name: '1940 Dec',
            color: 'rgba(241,119,27,0.65)'
        }, {
            x: -8.5208e+011,
            low: -0.451,
            high: 0.044,
            name: '1940 Jan',
            color: 'rgba(154,40,99,0.65)'
        }, {
            x: -8.494e+011,
            low: -0.139,
            high: 0.278,
            name: '1940 Feb',
            color: 'rgba(247,143,12,0.65)'
        }, {
            x: -8.4698e+011,
            low: -0.399,
            high: -0.005,
            name: '1940 Mar',
            color: 'rgba(155,40,98,0.65)'
        }, {
            x: -8.443e+011,
            low: -0.184,
            high: 0.193,
            name: '1940 Apr',
            color: 'rgba(239,114,30,0.65)'
        }, {
            x: -8.4171e+011,
            low: -0.219,
            high: 0.188,
            name: '1940 May',
            color: 'rgba(237,105,36,0.65)'
        }, {
            x: -8.3903e+011,
            low: -0.295,
            high: 0.106,
            name: '1940 Jun',
            color: 'rgba(208,69,68,0.65)'
        }, {
            x: -8.3644e+011,
            low: -0.242,
            high: 0.24,
            name: '1940 Jul',
            color: 'rgba(239,112,32,0.65)'
        }, {
            x: -8.3376e+011,
            low: -0.268,
            high: 0.267,
            name: '1940 Aug',
            color: 'rgba(238,111,32,0.65)'
        }, {
            x: -8.3108e+011,
            low: -0.262,
            high: 0.23,
            name: '1940 Sep',
            color: 'rgba(236,104,37,0.65)'
        }, {
            x: -8.2849e+011,
            low: 0.022,
            high: 0.445,
            name: '1940 Oct',
            color: 'rgba(248,193,45,0.65)'
        }, {
            x: -8.2581e+011,
            low: -0.158,
            high: 0.21,
            name: '1940 Nov',
            color: 'rgba(243,126,23,0.65)'
        }, {
            x: -8.2322e+011,
            low: -0.002,
            high: 0.391,
            name: '1940 Dec',
            color: 'rgba(248,185,37,0.65)'
        }, {
            x: -8.2054e+011,
            low: 0.064,
            high: 0.516,
            name: '1940 Jan',
            color: 'rgba(247,202,54,0.65)'
        }, {
            x: -8.1786e+011,
            low: -0.042,
            high: 0.325,
            name: '1940 Feb',
            color: 'rgba(249,169,21,0.65)'
        }, {
            x: -8.1536e+011,
            low: -0.046,
            high: 0.337,
            name: '1940 Mar',
            color: 'rgba(249,172,24,0.65)'
        }, {
            x: -8.1268e+011,
            low: -0.129,
            high: 0.237,
            name: '1940 Apr',
            color: 'rgba(246,138,15,0.65)'
        }, {
            x: -8.1009e+011,
            low: -0.13,
            high: 0.262,
            name: '1940 May',
            color: 'rgba(247,143,12,0.65)'
        }, {
            x: -8.0741e+011,
            low: -0.035,
            high: 0.332,
            name: '1940 Jun',
            color: 'rgba(249,174,26,0.65)'
        }, {
            x: -8.0482e+011,
            low: -0.013,
            high: 0.453,
            name: '1940 Jul',
            color: 'rgba(248,189,41,0.65)'
        }, {
            x: -8.0214e+011,
            low: -0.029,
            high: 0.5,
            name: '1940 Aug',
            color: 'rgba(248,194,46,0.65)'
        }, {
            x: -7.9946e+011,
            low: 0.062,
            high: 0.542,
            name: '1940 Sep',
            color: 'rgba(247,204,56,0.65)'
        }, {
            x: -7.9687e+011,
            low: 0,
            high: 0.417,
            name: '1940 Oct',
            color: 'rgba(248,187,39,0.65)'
        }, {
            x: -7.9419e+011,
            low: -0.186,
            high: 0.2,
            name: '1940 Nov',
            color: 'rgba(240,116,29,0.65)'
        }, {
            x: -7.916e+011,
            low: -0.226,
            high: 0.18,
            name: '1940 Dec',
            color: 'rgba(235,103,38,0.65)'
        }, {
            x: -7.8892e+011,
            low: -0.232,
            high: 0.224,
            name: '1940 Jan',
            color: 'rgba(238,110,33,0.65)'
        }, {
            x: -7.8624e+011,
            low: -0.286,
            high: 0.115,
            name: '1940 Feb',
            color: 'rgba(211,73,65,0.65)'
        }, {
            x: -7.8382e+011,
            low: -0.234,
            high: 0.152,
            name: '1940 Mar',
            color: 'rgba(228,95,45,0.65)'
        }, {
            x: -7.8114e+011,
            low: -0.017,
            high: 0.344,
            name: '1940 Apr',
            color: 'rgba(249,177,29,0.65)'
        }, {
            x: -7.7855e+011,
            low: -0.308,
            high: 0.111,
            name: '1940 May',
            color: 'rgba(205,67,70,0.65)'
        }, {
            x: -7.7587e+011,
            low: -0.187,
            high: 0.196,
            name: '1940 Jun',
            color: 'rgba(239,114,30,0.65)'
        }, {
            x: -7.7328e+011,
            low: -0.323,
            high: 0.16,
            name: '1940 Jul',
            color: 'rgba(212,75,63,0.65)'
        }, {
            x: -7.706e+011,
            low: 0.105,
            high: 0.621,
            name: '1940 Aug',
            color: 'rgba(247,214,75,0.65)'
        }, {
            x: -7.6792e+011,
            low: -0.107,
            high: 0.432,
            name: '1940 Sep',
            color: 'rgba(249,177,29,0.65)'
        }, {
            x: -7.6533e+011,
            low: -0.053,
            high: 0.415,
            name: '1940 Oct',
            color: 'rgba(248,182,34,0.65)'
        }, {
            x: -7.6265e+011,
            low: -0.204,
            high: 0.179,
            name: '1940 Nov',
            color: 'rgba(237,105,36,0.65)'
        }, {
            x: -7.6006e+011,
            low: -0.394,
            high: -0.016,
            name: '1940 Dec',
            color: 'rgba(152,39,99,0.65)'
        }, {
            x: -7.5738e+011,
            low: -0.132,
            high: 0.335,
            name: '1940 Jan',
            color: 'rgba(250,155,7,0.65)'
        }, {
            x: -7.547e+011,
            low: -0.145,
            high: 0.24,
            name: '1940 Feb',
            color: 'rgba(245,135,17,0.65)'
        }, {
            x: -7.5228e+011,
            low: -0.248,
            high: 0.124,
            name: '1940 Mar',
            color: 'rgba(220,84,54,0.65)'
        }, {
            x: -7.4961e+011,
            low: -0.045,
            high: 0.316,
            name: '1940 Apr',
            color: 'rgba(249,167,19,0.65)'
        }, {
            x: -7.4701e+011,
            low: -0.318,
            high: 0.07,
            name: '1940 May',
            color: 'rgba(196,61,76,0.65)'
        }, {
            x: -7.4434e+011,
            low: -0.449,
            high: -0.078,
            name: '1940 Jun',
            color: 'rgba(116,26,108,0.65)'
        }, {
            x: -7.4174e+011,
            low: -0.264,
            high: 0.171,
            name: '1940 Jul',
            color: 'rgba(226,91,48,0.65)'
        }, {
            x: -7.3907e+011,
            low: -0.391,
            high: 0.093,
            name: '1940 Aug',
            color: 'rgba(184,55,83,0.65)'
        }, {
            x: -7.3639e+011,
            low: -0.248,
            high: 0.226,
            name: '1940 Sep',
            color: 'rgba(237,108,34,0.65)'
        }, {
            x: -7.338e+011,
            low: -0.241,
            high: 0.15,
            name: '1940 Oct',
            color: 'rgba(226,91,48,0.65)'
        }, {
            x: -7.3112e+011,
            low: -0.254,
            high: 0.065,
            name: '1940 Nov',
            color: 'rgba(209,70,67,0.65)'
        }, {
            x: -7.2852e+011,
            low: -0.54,
            high: -0.181,
            name: '1940 Dec',
            color: 'rgba(67,12,100,0.65)'
        }, {
            x: -7.2585e+011,
            low: -0.339,
            high: 0.105,
            name: '1940 Jan',
            color: 'rgba(199,63,74,0.65)'
        }, {
            x: -7.2317e+011,
            low: -0.351,
            high: -0.004,
            name: '1940 Feb',
            color: 'rgba(167,45,94,0.65)'
        }, {
            x: -7.2075e+011,
            low: -0.251,
            high: 0.119,
            name: '1940 Mar',
            color: 'rgba(219,82,56,0.65)'
        }, {
            x: -7.1807e+011,
            low: -0.083,
            high: 0.277,
            name: '1940 Apr',
            color: 'rgba(250,153,6,0.65)'
        }, {
            x: -7.1548e+011,
            low: -0.263,
            high: 0.138,
            name: '1940 May',
            color: 'rgba(221,85,53,0.65)'
        }, {
            x: -7.128e+011,
            low: -0.17,
            high: 0.184,
            name: '1940 Jun',
            color: 'rgba(240,115,30,0.65)'
        }, {
            x: -7.1021e+011,
            low: -0.222,
            high: 0.214,
            name: '1940 Jul',
            color: 'rgba(238,108,34,0.65)'
        }, {
            x: -7.0753e+011,
            low: -0.283,
            high: 0.202,
            name: '1940 Aug',
            color: 'rgba(229,96,44,0.65)'
        }, {
            x: -7.0485e+011,
            low: -0.309,
            high: 0.159,
            name: '1940 Sep',
            color: 'rgba(215,78,61,0.65)'
        }, {
            x: -7.0226e+011,
            low: -0.127,
            high: 0.288,
            name: '1940 Oct',
            color: 'rgba(248,146,10,0.65)'
        }, {
            x: -6.9958e+011,
            low: -0.129,
            high: 0.203,
            name: '1940 Nov',
            color: 'rgba(245,133,18,0.65)'
        }, {
            x: -6.9699e+011,
            low: -0.359,
            high: 0.001,
            name: '1940 Dec',
            color: 'rgba(171,47,92,0.65)'
        }, {
            x: -6.9431e+011,
            low: -0.117,
            high: 0.297,
            name: '1940 Jan',
            color: 'rgba(250,150,8,0.65)'
        }, {
            x: -6.9163e+011,
            low: -0.312,
            high: 0.068,
            name: '1940 Feb',
            color: 'rgba(193,60,78,0.65)'
        }, {
            x: -6.8913e+011,
            low: -0.351,
            high: 0.005,
            name: '1940 Mar',
            color: 'rgba(171,47,92,0.65)'
        }, {
            x: -6.8645e+011,
            low: -0.224,
            high: 0.138,
            name: '1940 Apr',
            color: 'rgba(227,93,47,0.65)'
        }, {
            x: -6.8386e+011,
            low: -0.091,
            high: 0.304,
            name: '1940 May',
            color: 'rgba(250,157,9,0.65)'
        }, {
            x: -6.8118e+011,
            low: -0.101,
            high: 0.25,
            name: '1940 Jun',
            color: 'rgba(248,145,11,0.65)'
        }, {
            x: -6.7859e+011,
            low: -0.323,
            high: 0.11,
            name: '1940 Jul',
            color: 'rgba(201,65,73,0.65)'
        }, {
            x: -6.7591e+011,
            low: -0.24,
            high: 0.237,
            name: '1940 Aug',
            color: 'rgba(238,111,32,0.65)'
        }, {
            x: -6.7323e+011,
            low: -0.284,
            high: 0.165,
            name: '1940 Sep',
            color: 'rgba(223,87,52,0.65)'
        }, {
            x: -6.7064e+011,
            low: -0.159,
            high: 0.23,
            name: '1940 Oct',
            color: 'rgba(243,128,22,0.65)'
        }, {
            x: -6.6796e+011,
            low: -0.214,
            high: 0.108,
            name: '1940 Nov',
            color: 'rgba(224,89,50,0.65)'
        }, {
            x: -6.6537e+011,
            low: -0.39,
            high: -0.018,
            name: '1940 Dec',
            color: 'rgba(154,40,99,0.65)'
        }, {
            x: -6.6269e+011,
            low: -0.044,
            high: 0.342,
            name: '1940 Jan',
            color: 'rgba(249,173,25,0.65)'
        }, {
            x: -6.6001e+011,
            low: -0.301,
            high: 0.015,
            name: '1940 Feb',
            color: 'rgba(184,55,83,0.65)'
        }, {
            x: -6.5759e+011,
            low: -0.332,
            high: -0.019,
            name: '1940 Mar',
            color: 'rgba(168,46,93,0.65)'
        }, {
            x: -6.5491e+011,
            low: -0.16,
            high: 0.177,
            name: '1940 Apr',
            color: 'rgba(240,116,29,0.65)'
        }, {
            x: -6.5232e+011,
            low: -0.228,
            high: 0.138,
            name: '1940 May',
            color: 'rgba(227,92,47,0.65)'
        }, {
            x: -6.4964e+011,
            low: -0.353,
            high: -0.018,
            name: '1940 Jun',
            color: 'rgba(164,43,96,0.65)'
        }, {
            x: -6.4705e+011,
            low: -0.299,
            high: 0.121,
            name: '1940 Jul',
            color: 'rgba(209,71,66,0.65)'
        }, {
            x: -6.4437e+011,
            low: -0.289,
            high: 0.209,
            name: '1940 Aug',
            color: 'rgba(229,96,44,0.65)'
        }, {
            x: -6.4169e+011,
            low: -0.295,
            high: 0.145,
            name: '1940 Sep',
            color: 'rgba(216,80,59,0.65)'
        }, {
            x: -6.391e+011,
            low: -0.206,
            high: 0.144,
            name: '1940 Oct',
            color: 'rgba(231,98,42,0.65)'
        }, {
            x: -6.3642e+011,
            low: -0.228,
            high: 0.073,
            name: '1940 Nov',
            color: 'rgba(214,76,62,0.65)'
        }, {
            x: -6.3383e+011,
            low: -0.358,
            high: -0.018,
            name: '1940 Dec',
            color: 'rgba(162,43,96,0.65)'
        }, {
            x: -6.3115e+011,
            low: -0.52,
            high: -0.144,
            name: '1950 Jan',
            color: 'rgba(81,14,107,0.65)'
        }, {
            x: -6.2847e+011,
            low: -0.402,
            high: -0.083,
            name: '1950 Feb',
            color: 'rgba(127,30,106,0.65)'
        }, {
            x: -6.2605e+011,
            low: -0.335,
            high: -0.019,
            name: '1950 Mar',
            color: 'rgba(168,46,93,0.65)'
        }, {
            x: -6.2338e+011,
            low: -0.332,
            high: 0.001,
            name: '1950 Apr',
            color: 'rgba(175,50,89,0.65)'
        }, {
            x: -6.2078e+011,
            low: -0.267,
            high: 0.09,
            name: '1950 May',
            color: 'rgba(210,72,65,0.65)'
        }, {
            x: -6.1811e+011,
            low: -0.239,
            high: 0.096,
            name: '1950 Jun',
            color: 'rgba(215,78,60,0.65)'
        }, {
            x: -6.1551e+011,
            low: -0.237,
            high: 0.17,
            name: '1950 Jul',
            color: 'rgba(228,95,45,0.65)'
        }, {
            x: -6.1284e+011,
            low: -0.352,
            high: 0.13,
            name: '1950 Aug',
            color: 'rgba(200,64,73,0.65)'
        }, {
            x: -6.1016e+011,
            low: -0.328,
            high: 0.116,
            name: '1950 Sep',
            color: 'rgba(203,65,72,0.65)'
        }, {
            x: -6.0756e+011,
            low: -0.297,
            high: 0.052,
            name: '1950 Oct',
            color: 'rgba(193,60,78,0.65)'
        }, {
            x: -6.0489e+011,
            low: -0.536,
            high: -0.246,
            name: '1950 Nov',
            color: 'rgba(53,12,88,0.65)'
        }, {
            x: -6.0229e+011,
            low: -0.41,
            high: -0.096,
            name: '1950 Dec',
            color: 'rgba(123,29,107,0.65)'
        }, {
            x: -5.9962e+011,
            low: -0.531,
            high: -0.176,
            name: '1950 Jan',
            color: 'rgba(69,12,102,0.65)'
        }, {
            x: -5.9694e+011,
            low: -0.607,
            high: -0.311,
            name: '1950 Feb',
            color: 'rgba(26,11,63,0.65)'
        }, {
            x: -5.9452e+011,
            low: -0.453,
            high: -0.142,
            name: '1950 Mar',
            color: 'rgba(99,20,108,0.65)'
        }, {
            x: -5.9184e+011,
            low: -0.272,
            high: 0.06,
            name: '1950 Apr',
            color: 'rgba(204,66,71,0.65)'
        }, {
            x: -5.8925e+011,
            low: -0.192,
            high: 0.162,
            name: '1950 May',
            color: 'rgba(237,105,36,0.65)'
        }, {
            x: -5.8657e+011,
            low: -0.124,
            high: 0.198,
            name: '1950 Jun',
            color: 'rgba(244,130,20,0.65)'
        }, {
            x: -5.8398e+011,
            low: -0.164,
            high: 0.268,
            name: '1950 Jul',
            color: 'rgba(245,135,17,0.65)'
        }, {
            x: -5.813e+011,
            low: -0.096,
            high: 0.381,
            name: '1950 Aug',
            color: 'rgba(249,170,22,0.65)'
        }, {
            x: -5.7862e+011,
            low: -0.122,
            high: 0.312,
            name: '1950 Sep',
            color: 'rgba(250,151,7,0.65)'
        }, {
            x: -5.7603e+011,
            low: -0.041,
            high: 0.304,
            name: '1950 Oct',
            color: 'rgba(250,164,16,0.65)'
        }, {
            x: -5.7335e+011,
            low: -0.179,
            high: 0.103,
            name: '1950 Nov',
            color: 'rgba(229,96,44,0.65)'
        }, {
            x: -5.7076e+011,
            low: 0.028,
            high: 0.325,
            name: '1950 Dec',
            color: 'rgba(249,179,31,0.65)'
        }, {
            x: -5.6808e+011,
            low: 0.006,
            high: 0.362,
            name: '1950 Jan',
            color: 'rgba(248,181,33,0.65)'
        }, {
            x: -5.654e+011,
            low: -0.003,
            high: 0.281,
            name: '1950 Feb',
            color: 'rgba(249,167,19,0.65)'
        }, {
            x: -5.629e+011,
            low: -0.278,
            high: 0.019,
            name: '1950 Mar',
            color: 'rgba(190,58,80,0.65)'
        }, {
            x: -5.6022e+011,
            low: -0.107,
            high: 0.218,
            name: '1950 Apr',
            color: 'rgba(246,138,15,0.65)'
        }, {
            x: -5.5763e+011,
            low: -0.138,
            high: 0.215,
            name: '1950 May',
            color: 'rgba(244,132,19,0.65)'
        }, {
            x: -5.5495e+011,
            low: -0.117,
            high: 0.199,
            name: '1950 Jun',
            color: 'rgba(244,132,19,0.65)'
        }, {
            x: -5.5236e+011,
            low: -0.103,
            high: 0.306,
            name: '1950 Jul',
            color: 'rgba(250,154,6,0.65)'
        }, {
            x: -5.4968e+011,
            low: -0.145,
            high: 0.333,
            name: '1950 Aug',
            color: 'rgba(250,152,6,0.65)'
        }, {
            x: -5.47e+011,
            low: -0.12,
            high: 0.32,
            name: '1950 Sep',
            color: 'rgba(250,154,6,0.65)'
        }, {
            x: -5.4441e+011,
            low: -0.175,
            high: 0.163,
            name: '1950 Oct',
            color: 'rgba(237,107,35,0.65)'
        }, {
            x: -5.4173e+011,
            low: -0.336,
            high: -0.045,
            name: '1950 Nov',
            color: 'rgba(162,43,96,0.65)'
        }, {
            x: -5.3914e+011,
            low: -0.207,
            high: 0.094,
            name: '1950 Dec',
            color: 'rgba(221,85,53,0.65)'
        }, {
            x: -5.3646e+011,
            low: -0.102,
            high: 0.237,
            name: '1950 Jan',
            color: 'rgba(247,142,13,0.65)'
        }, {
            x: -5.3378e+011,
            low: 0.006,
            high: 0.291,
            name: '1950 Feb',
            color: 'rgba(249,171,23,0.65)'
        }, {
            x: -5.3136e+011,
            low: -0.021,
            high: 0.284,
            name: '1950 Mar',
            color: 'rgba(250,164,16,0.65)'
        }, {
            x: -5.2868e+011,
            low: 0.035,
            high: 0.357,
            name: '1950 Apr',
            color: 'rgba(248,184,36,0.65)'
        }, {
            x: -5.2609e+011,
            low: -0.037,
            high: 0.317,
            name: '1950 May',
            color: 'rgba(249,168,20,0.65)'
        }, {
            x: -5.2341e+011,
            low: 0.001,
            high: 0.327,
            name: '1950 Jun',
            color: 'rgba(249,177,29,0.65)'
        }, {
            x: -5.2082e+011,
            low: -0.145,
            high: 0.257,
            name: '1950 Jul',
            color: 'rgba(246,137,16,0.65)'
        }, {
            x: -5.1814e+011,
            low: -0.143,
            high: 0.332,
            name: '1950 Aug',
            color: 'rgba(250,153,6,0.65)'
        }, {
            x: -5.1546e+011,
            low: -0.135,
            high: 0.293,
            name: '1950 Sep',
            color: 'rgba(248,146,10,0.65)'
        }, {
            x: -5.1287e+011,
            low: -0.098,
            high: 0.245,
            name: '1950 Oct',
            color: 'rgba(248,145,11,0.65)'
        }, {
            x: -5.1019e+011,
            low: -0.219,
            high: 0.07,
            name: '1950 Nov',
            color: 'rgba(215,79,60,0.65)'
        }, {
            x: -5.076e+011,
            low: -0.065,
            high: 0.253,
            name: '1950 Dec',
            color: 'rgba(250,151,7,0.65)'
        }, {
            x: -5.0492e+011,
            low: -0.413,
            high: -0.057,
            name: '1950 Jan',
            color: 'rgba(132,32,105,0.65)'
        }, {
            x: -5.0224e+011,
            low: -0.23,
            high: 0.059,
            name: '1950 Feb',
            color: 'rgba(210,72,66,0.65)'
        }, {
            x: -4.9982e+011,
            low: -0.309,
            high: 0.004,
            name: '1950 Mar',
            color: 'rgba(180,52,86,0.65)'
        }, {
            x: -4.9715e+011,
            low: -0.314,
            high: 0.011,
            name: '1950 Apr',
            color: 'rgba(182,53,85,0.65)'
        }, {
            x: -4.9455e+011,
            low: -0.38,
            high: -0.036,
            name: '1950 May',
            color: 'rgba(151,39,99,0.65)'
        }, {
            x: -4.9188e+011,
            low: -0.288,
            high: 0.027,
            name: '1950 Jun',
            color: 'rgba(190,58,80,0.65)'
        }, {
            x: -4.8928e+011,
            low: -0.398,
            high: 0.008,
            name: '1950 Jul',
            color: 'rgba(156,40,98,0.65)'
        }, {
            x: -4.866e+011,
            low: -0.331,
            high: 0.142,
            name: '1950 Aug',
            color: 'rgba(208,69,68,0.65)'
        }, {
            x: -4.8393e+011,
            low: -0.302,
            high: 0.131,
            name: '1950 Sep',
            color: 'rgba(210,72,65,0.65)'
        }, {
            x: -4.8133e+011,
            low: -0.202,
            high: 0.133,
            name: '1950 Oct',
            color: 'rgba(230,97,44,0.65)'
        }, {
            x: -4.7866e+011,
            low: -0.118,
            high: 0.162,
            name: '1950 Nov',
            color: 'rgba(242,123,25,0.65)'
        }, {
            x: -4.7606e+011,
            low: -0.385,
            high: -0.08,
            name: '1950 Dec',
            color: 'rgba(133,32,105,0.65)'
        }, {
            x: -4.7339e+011,
            low: -0.04,
            high: 0.294,
            name: '1950 Jan',
            color: 'rgba(250,162,14,0.65)'
        }, {
            x: -4.7071e+011,
            low: -0.302,
            high: -0.022,
            name: '1950 Feb',
            color: 'rgba(174,49,90,0.65)'
        }, {
            x: -4.6829e+011,
            low: -0.554,
            high: -0.258,
            name: '1950 Mar',
            color: 'rgba(47,12,83,0.65)'
        }, {
            x: -4.6561e+011,
            low: -0.405,
            high: -0.085,
            name: '1950 Apr',
            color: 'rgba(128,30,106,0.65)'
        }, {
            x: -4.6302e+011,
            low: -0.406,
            high: -0.066,
            name: '1950 May',
            color: 'rgba(133,32,105,0.65)'
        }, {
            x: -4.6034e+011,
            low: -0.32,
            high: -0.014,
            name: '1950 Jun',
            color: 'rgba(173,49,90,0.65)'
        }, {
            x: -4.5775e+011,
            low: -0.397,
            high: 0.003,
            name: '1950 Jul',
            color: 'rgba(155,40,98,0.65)'
        }, {
            x: -4.5507e+011,
            low: -0.297,
            high: 0.17,
            name: '1950 Aug',
            color: 'rgba(220,84,54,0.65)'
        }, {
            x: -4.5239e+011,
            low: -0.327,
            high: 0.097,
            name: '1950 Sep',
            color: 'rgba(198,63,75,0.65)'
        }, {
            x: -4.498e+011,
            low: -0.327,
            high: 0.003,
            name: '1950 Oct',
            color: 'rgba(176,50,89,0.65)'
        }, {
            x: -4.4712e+011,
            low: -0.446,
            high: -0.182,
            name: '1950 Nov',
            color: 'rgba(91,17,107,0.65)'
        }, {
            x: -4.4453e+011,
            low: -0.48,
            high: -0.187,
            name: '1950 Dec',
            color: 'rgba(79,13,107,0.65)'
        }, {
            x: -4.4185e+011,
            low: -0.41,
            high: -0.081,
            name: '1950 Jan',
            color: 'rgba(126,30,107,0.65)'
        }, {
            x: -4.3917e+011,
            low: -0.482,
            high: -0.208,
            name: '1950 Feb',
            color: 'rgba(72,12,104,0.65)'
        }, {
            x: -4.3667e+011,
            low: -0.453,
            high: -0.168,
            name: '1950 Mar',
            color: 'rgba(92,18,107,0.65)'
        }, {
            x: -4.3399e+011,
            low: -0.491,
            high: -0.18,
            name: '1950 Apr',
            color: 'rgba(80,13,107,0.65)'
        }, {
            x: -4.314e+011,
            low: -0.443,
            high: -0.115,
            name: '1950 May',
            color: 'rgba(109,24,108,0.65)'
        }, {
            x: -4.2872e+011,
            low: -0.374,
            high: -0.077,
            name: '1950 Jun',
            color: 'rgba(140,35,103,0.65)'
        }, {
            x: -4.2612e+011,
            low: -0.402,
            high: -0.017,
            name: '1950 Jul',
            color: 'rgba(150,38,100,0.65)'
        }, {
            x: -4.2345e+011,
            low: -0.473,
            high: -0.009,
            name: '1950 Aug',
            color: 'rgba(129,31,106,0.65)'
        }, {
            x: -4.2077e+011,
            low: -0.488,
            high: -0.072,
            name: '1950 Sep',
            color: 'rgba(108,24,108,0.65)'
        }, {
            x: -4.1818e+011,
            low: -0.392,
            high: -0.067,
            name: '1950 Oct',
            color: 'rgba(138,34,103,0.65)'
        }, {
            x: -4.155e+011,
            low: -0.391,
            high: -0.128,
            name: '1950 Nov',
            color: 'rgba(121,28,108,0.65)'
        }, {
            x: -4.1291e+011,
            low: -0.348,
            high: -0.064,
            name: '1950 Dec',
            color: 'rgba(151,39,99,0.65)'
        }, {
            x: -4.1023e+011,
            low: -0.317,
            high: -0.013,
            name: '1950 Jan',
            color: 'rgba(174,49,90,0.65)'
        }, {
            x: -4.0755e+011,
            low: -0.258,
            high: 0.003,
            name: '1950 Feb',
            color: 'rgba(191,59,79,0.65)'
        }, {
            x: -4.0513e+011,
            low: -0.327,
            high: -0.04,
            name: '1950 Mar',
            color: 'rgba(165,44,95,0.65)'
        }, {
            x: -4.0245e+011,
            low: -0.21,
            high: 0.085,
            name: '1950 Apr',
            color: 'rgba(219,83,55,0.65)'
        }, {
            x: -3.9986e+011,
            low: -0.111,
            high: 0.214,
            name: '1950 May',
            color: 'rgba(246,136,16,0.65)'
        }, {
            x: -3.9718e+011,
            low: -0.058,
            high: 0.225,
            name: '1950 Jun',
            color: 'rgba(249,149,8,0.65)'
        }, {
            x: -3.9459e+011,
            low: -0.182,
            high: 0.193,
            name: '1950 Jul',
            color: 'rgba(239,112,31,0.65)'
        }, {
            x: -3.9191e+011,
            low: -0.126,
            high: 0.318,
            name: '1950 Aug',
            color: 'rgba(250,152,6,0.65)'
        }, {
            x: -3.8923e+011,
            low: -0.163,
            high: 0.243,
            name: '1950 Sep',
            color: 'rgba(244,131,20,0.65)'
        }, {
            x: -3.8664e+011,
            low: -0.172,
            high: 0.148,
            name: '1950 Oct',
            color: 'rgba(237,105,36,0.65)'
        }, {
            x: -3.8396e+011,
            low: -0.066,
            high: 0.18,
            name: '1950 Nov',
            color: 'rgba(246,138,15,0.65)'
        }, {
            x: -3.8137e+011,
            low: 0.026,
            high: 0.295,
            name: '1950 Dec',
            color: 'rgba(249,175,27,0.65)'
        }, {
            x: -3.7869e+011,
            low: 0.121,
            high: 0.423,
            name: '1950 Jan',
            color: 'rgba(247,198,50,0.65)'
        }, {
            x: -3.7601e+011,
            low: 0.055,
            high: 0.313,
            name: '1950 Feb',
            color: 'rgba(248,182,34,0.65)'
        }, {
            x: -3.7359e+011,
            low: -0.14,
            high: 0.135,
            name: '1950 Mar',
            color: 'rgba(238,109,33,0.65)'
        }, {
            x: -3.7092e+011,
            low: -0.105,
            high: 0.182,
            name: '1950 Apr',
            color: 'rgba(244,131,20,0.65)'
        }, {
            x: -3.6832e+011,
            low: -0.125,
            high: 0.195,
            name: '1950 May',
            color: 'rgba(244,129,21,0.65)'
        }, {
            x: -3.6564e+011,
            low: -0.156,
            high: 0.124,
            name: '1950 Jun',
            color: 'rgba(235,103,38,0.65)'
        }, {
            x: -3.6305e+011,
            low: -0.144,
            high: 0.229,
            name: '1950 Jul',
            color: 'rgba(245,133,19,0.65)'
        }, {
            x: -3.6037e+011,
            low: -0.214,
            high: 0.233,
            name: '1950 Aug',
            color: 'rgba(240,117,29,0.65)'
        }, {
            x: -3.577e+011,
            low: -0.25,
            high: 0.153,
            name: '1950 Sep',
            color: 'rgba(224,89,50,0.65)'
        }, {
            x: -3.551e+011,
            low: -0.136,
            high: 0.17,
            name: '1950 Oct',
            color: 'rgba(241,120,27,0.65)'
        }, {
            x: -3.5243e+011,
            low: -0.109,
            high: 0.137,
            name: '1950 Nov',
            color: 'rgba(240,117,29,0.65)'
        }, {
            x: -3.4983e+011,
            low: -0.111,
            high: 0.169,
            name: '1950 Dec',
            color: 'rgba(243,126,23,0.65)'
        }, {
            x: -3.4716e+011,
            low: -0.056,
            high: 0.232,
            name: '1950 Jan',
            color: 'rgba(249,150,8,0.65)'
        }, {
            x: -3.4448e+011,
            low: -0.09,
            high: 0.15,
            name: '1950 Feb',
            color: 'rgba(243,128,22,0.65)'
        }, {
            x: -3.4206e+011,
            low: -0.049,
            high: 0.207,
            name: '1950 Mar',
            color: 'rgba(249,147,9,0.65)'
        }, {
            x: -3.3938e+011,
            low: -0.101,
            high: 0.191,
            name: '1950 Apr',
            color: 'rgba(245,135,17,0.65)'
        }, {
            x: -3.3679e+011,
            low: -0.166,
            high: 0.143,
            name: '1950 May',
            color: 'rgba(237,105,36,0.65)'
        }, {
            x: -3.3411e+011,
            low: -0.076,
            high: 0.2,
            name: '1950 Jun',
            color: 'rgba(247,141,13,0.65)'
        }, {
            x: -3.3152e+011,
            low: -0.15,
            high: 0.21,
            name: '1950 Jul',
            color: 'rgba(243,128,22,0.65)'
        }, {
            x: -3.2884e+011,
            low: -0.17,
            high: 0.265,
            name: '1950 Aug',
            color: 'rgba(245,135,17,0.65)'
        }, {
            x: -3.2616e+011,
            low: -0.161,
            high: 0.238,
            name: '1950 Sep',
            color: 'rgba(244,131,20,0.65)'
        }, {
            x: -3.2357e+011,
            low: -0.184,
            high: 0.116,
            name: '1950 Oct',
            color: 'rgba(230,97,43,0.65)'
        }, {
            x: -3.2089e+011,
            low: -0.234,
            high: 0.009,
            name: '1950 Nov',
            color: 'rgba(200,64,73,0.65)'
        }, {
            x: -3.183e+011,
            low: -0.202,
            high: 0.064,
            name: '1950 Dec',
            color: 'rgba(217,81,58,0.65)'
        }, {
            x: -3.1562e+011,
            low: -0.178,
            high: 0.122,
            name: '1960 Jan',
            color: 'rgba(232,99,41,0.65)'
        }, {
            x: -3.1294e+011,
            low: -0.02,
            high: 0.226,
            name: '1960 Feb',
            color: 'rgba(250,155,7,0.65)'
        }, {
            x: -3.1044e+011,
            low: -0.447,
            high: -0.181,
            name: '1960 Mar',
            color: 'rgba(89,17,107,0.65)'
        }, {
            x: -3.0776e+011,
            low: -0.319,
            high: -0.033,
            name: '1960 Apr',
            color: 'rgba(170,47,92,0.65)'
        }, {
            x: -3.0516e+011,
            low: -0.309,
            high: 0.001,
            name: '1960 May',
            color: 'rgba(180,53,86,0.65)'
        }, {
            x: -3.0249e+011,
            low: -0.167,
            high: 0.11,
            name: '1960 Jun',
            color: 'rgba(232,99,41,0.65)'
        }, {
            x: -2.9989e+011,
            low: -0.205,
            high: 0.151,
            name: '1960 Jul',
            color: 'rgba(233,100,40,0.65)'
        }, {
            x: -2.9722e+011,
            low: -0.212,
            high: 0.226,
            name: '1960 Aug',
            color: 'rgba(240,115,30,0.65)'
        }, {
            x: -2.9454e+011,
            low: -0.137,
            high: 0.261,
            name: '1960 Sep',
            color: 'rgba(247,141,13,0.65)'
        }, {
            x: -2.9195e+011,
            low: -0.172,
            high: 0.121,
            name: '1960 Oct',
            color: 'rgba(233,100,40,0.65)'
        }, {
            x: -2.8927e+011,
            low: -0.265,
            high: -0.032,
            name: '1960 Nov',
            color: 'rgba(183,54,84,0.65)'
        }, {
            x: -2.8668e+011,
            low: 0.011,
            high: 0.274,
            name: '1960 Dec',
            color: 'rgba(249,169,21,0.65)'
        }, {
            x: -2.84e+011,
            low: -0.094,
            high: 0.182,
            name: '1960 Jan',
            color: 'rgba(245,135,17,0.65)'
        }, {
            x: -2.8132e+011,
            low: 0.068,
            high: 0.302,
            name: '1960 Feb',
            color: 'rgba(248,182,34,0.65)'
        }, {
            x: -2.789e+011,
            low: -0.033,
            high: 0.228,
            name: '1960 Mar',
            color: 'rgba(250,153,6,0.65)'
        }, {
            x: -2.7622e+011,
            low: -0.044,
            high: 0.236,
            name: '1960 Apr',
            color: 'rgba(250,153,6,0.65)'
        }, {
            x: -2.7363e+011,
            low: -0.067,
            high: 0.242,
            name: '1960 May',
            color: 'rgba(249,150,8,0.65)'
        }, {
            x: -2.7095e+011,
            low: -0.026,
            high: 0.241,
            name: '1960 Jun',
            color: 'rgba(250,156,8,0.65)'
        }, {
            x: -2.6836e+011,
            low: -0.163,
            high: 0.197,
            name: '1960 Jul',
            color: 'rgba(241,121,26,0.65)'
        }, {
            x: -2.6568e+011,
            low: -0.185,
            high: 0.246,
            name: '1960 Aug',
            color: 'rgba(243,128,22,0.65)'
        }, {
            x: -2.63e+011,
            low: -0.227,
            high: 0.17,
            name: '1960 Sep',
            color: 'rgba(232,99,41,0.65)'
        }, {
            x: -2.6041e+011,
            low: -0.181,
            high: 0.116,
            name: '1960 Oct',
            color: 'rgba(231,98,42,0.65)'
        }, {
            x: -2.5773e+011,
            low: -0.138,
            high: 0.095,
            name: '1960 Nov',
            color: 'rgba(235,103,38,0.65)'
        }, {
            x: -2.5514e+011,
            low: -0.245,
            high: 0.022,
            name: '1960 Dec',
            color: 'rgba(200,64,73,0.65)'
        }, {
            x: -2.5246e+011,
            low: -0.082,
            high: 0.192,
            name: '1960 Jan',
            color: 'rgba(246,138,15,0.65)'
        }, {
            x: -2.4978e+011,
            low: 0.019,
            high: 0.259,
            name: '1960 Feb',
            color: 'rgba(249,168,20,0.65)'
        }, {
            x: -2.4736e+011,
            low: -0.101,
            high: 0.16,
            name: '1960 Mar',
            color: 'rgba(243,126,23,0.65)'
        }, {
            x: -2.4468e+011,
            low: -0.115,
            high: 0.161,
            name: '1960 Apr',
            color: 'rgba(242,124,24,0.65)'
        }, {
            x: -2.4209e+011,
            low: -0.202,
            high: 0.114,
            name: '1960 May',
            color: 'rgba(226,92,48,0.65)'
        }, {
            x: -2.3941e+011,
            low: -0.191,
            high: 0.085,
            name: '1960 Jun',
            color: 'rgba(223,88,51,0.65)'
        }, {
            x: -2.3682e+011,
            low: -0.165,
            high: 0.199,
            name: '1960 Jul',
            color: 'rgba(241,121,26,0.65)'
        }, {
            x: -2.3414e+011,
            low: -0.221,
            high: 0.213,
            name: '1960 Aug',
            color: 'rgba(238,110,33,0.65)'
        }, {
            x: -2.3147e+011,
            low: -0.214,
            high: 0.184,
            name: '1960 Sep',
            color: 'rgba(236,104,37,0.65)'
        }, {
            x: -2.2887e+011,
            low: -0.103,
            high: 0.188,
            name: '1960 Oct',
            color: 'rgba(245,134,18,0.65)'
        }, {
            x: -2.262e+011,
            low: -0.111,
            high: 0.128,
            name: '1960 Nov',
            color: 'rgba(240,116,29,0.65)'
        }, {
            x: -2.236e+011,
            low: -0.151,
            high: 0.129,
            name: '1960 Dec',
            color: 'rgba(237,106,36,0.65)'
        }, {
            x: -2.2092e+011,
            low: -0.191,
            high: 0.089,
            name: '1960 Jan',
            color: 'rgba(224,90,50,0.65)'
        }, {
            x: -2.1825e+011,
            low: 0.032,
            high: 0.27,
            name: '1960 Feb',
            color: 'rgba(249,174,26,0.65)'
        }, {
            x: -2.1583e+011,
            low: -0.275,
            high: -0.009,
            name: '1960 Mar',
            color: 'rgba(186,56,83,0.65)'
        }, {
            x: -2.1315e+011,
            low: -0.208,
            high: 0.071,
            name: '1960 Apr',
            color: 'rgba(218,82,57,0.65)'
        }, {
            x: -2.1056e+011,
            low: -0.178,
            high: 0.134,
            name: '1960 May',
            color: 'rgba(234,101,39,0.65)'
        }, {
            x: -2.0788e+011,
            low: -0.168,
            high: 0.105,
            name: '1960 Jun',
            color: 'rgba(231,98,43,0.65)'
        }, {
            x: -2.0529e+011,
            low: -0.07,
            high: 0.294,
            name: '1960 Jul',
            color: 'rgba(250,158,10,0.65)'
        }, {
            x: -2.0261e+011,
            low: -0.092,
            high: 0.344,
            name: '1960 Aug',
            color: 'rgba(250,163,15,0.65)'
        }, {
            x: -1.9993e+011,
            low: -0.078,
            high: 0.331,
            name: '1960 Sep',
            color: 'rgba(250,162,14,0.65)'
        }, {
            x: -1.9734e+011,
            low: 0.074,
            high: 0.375,
            name: '1960 Oct',
            color: 'rgba(248,190,42,0.65)'
        }, {
            x: -1.9466e+011,
            low: 0.036,
            high: 0.29,
            name: '1960 Nov',
            color: 'rgba(249,176,28,0.65)'
        }, {
            x: -1.9207e+011,
            low: -0.141,
            high: 0.129,
            name: '1960 Dec',
            color: 'rgba(237,108,34,0.65)'
        }, {
            x: -1.8939e+011,
            low: -0.185,
            high: 0.092,
            name: '1960 Jan',
            color: 'rgba(226,92,48,0.65)'
        }, {
            x: -1.8671e+011,
            low: -0.245,
            high: -0.005,
            name: '1960 Feb',
            color: 'rgba(194,60,77,0.65)'
        }, {
            x: -1.842e+011,
            low: -0.407,
            high: -0.139,
            name: '1960 Mar',
            color: 'rgba(112,25,108,0.65)'
        }, {
            x: -1.8153e+011,
            low: -0.383,
            high: -0.101,
            name: '1960 Apr',
            color: 'rgba(128,30,106,0.65)'
        }, {
            x: -1.7893e+011,
            low: -0.33,
            high: -0.02,
            name: '1960 May',
            color: 'rgba(171,47,92,0.65)'
        }, {
            x: -1.7626e+011,
            low: -0.29,
            high: -0.025,
            name: '1960 Jun',
            color: 'rgba(179,52,87,0.65)'
        }, {
            x: -1.7366e+011,
            low: -0.347,
            high: 0.009,
            name: '1960 Jul',
            color: 'rgba(172,48,91,0.65)'
        }, {
            x: -1.7099e+011,
            low: -0.476,
            high: -0.038,
            name: '1960 Aug',
            color: 'rgba(121,28,108,0.65)'
        }, {
            x: -1.6831e+011,
            low: -0.481,
            high: -0.084,
            name: '1960 Sep',
            color: 'rgba(107,23,108,0.65)'
        }, {
            x: -1.6572e+011,
            low: -0.415,
            high: -0.119,
            name: '1960 Oct',
            color: 'rgba(116,26,108,0.65)'
        }, {
            x: -1.6304e+011,
            low: -0.419,
            high: -0.171,
            name: '1960 Nov',
            color: 'rgba(100,21,108,0.65)'
        }, {
            x: -1.6044e+011,
            low: -0.487,
            high: -0.225,
            name: '1960 Dec',
            color: 'rgba(68,12,101,0.65)'
        }, {
            x: -1.5777e+011,
            low: -0.243,
            high: 0.038,
            name: '1960 Jan',
            color: 'rgba(204,66,71,0.65)'
        }, {
            x: -1.5509e+011,
            low: -0.363,
            high: -0.126,
            name: '1960 Feb',
            color: 'rgba(128,30,106,0.65)'
        }, {
            x: -1.5267e+011,
            low: -0.348,
            high: -0.08,
            name: '1960 Mar',
            color: 'rgba(147,37,100,0.65)'
        }, {
            x: -1.4999e+011,
            low: -0.391,
            high: -0.118,
            name: '1960 Apr',
            color: 'rgba(123,29,108,0.65)'
        }, {
            x: -1.474e+011,
            low: -0.316,
            high: -0.001,
            name: '1960 May',
            color: 'rgba(179,52,87,0.65)'
        }, {
            x: -1.4472e+011,
            low: -0.247,
            high: 0.027,
            name: '1960 Jun',
            color: 'rgba(201,64,73,0.65)'
        }, {
            x: -1.4213e+011,
            low: -0.359,
            high: 0.002,
            name: '1960 Jul',
            color: 'rgba(166,44,94,0.65)'
        }, {
            x: -1.3945e+011,
            low: -0.331,
            high: 0.11,
            name: '1960 Aug',
            color: 'rgba(200,64,73,0.65)'
        }, {
            x: -1.3677e+011,
            low: -0.296,
            high: 0.109,
            name: '1960 Sep',
            color: 'rgba(207,68,69,0.65)'
        }, {
            x: -1.3418e+011,
            low: -0.178,
            high: 0.119,
            name: '1960 Oct',
            color: 'rgba(232,99,42,0.65)'
        }, {
            x: -1.315e+011,
            low: -0.26,
            high: -0.015,
            name: '1960 Nov',
            color: 'rgba(187,56,82,0.65)'
        }, {
            x: -1.2891e+011,
            low: -0.192,
            high: 0.061,
            name: '1960 Dec',
            color: 'rgba(219,82,56,0.65)'
        }, {
            x: -1.2623e+011,
            low: -0.234,
            high: 0.041,
            name: '1960 Jan',
            color: 'rgba(207,68,69,0.65)'
        }, {
            x: -1.2355e+011,
            low: -0.209,
            high: 0.021,
            name: '1960 Feb',
            color: 'rgba(208,69,68,0.65)'
        }, {
            x: -1.2113e+011,
            low: -0.196,
            high: 0.072,
            name: '1960 Mar',
            color: 'rgba(220,84,54,0.65)'
        }, {
            x: -1.1845e+011,
            low: -0.248,
            high: 0.036,
            name: '1960 Apr',
            color: 'rgba(202,65,72,0.65)'
        }, {
            x: -1.1586e+011,
            low: -0.292,
            high: 0.013,
            name: '1960 May',
            color: 'rgba(186,56,82,0.65)'
        }, {
            x: -1.1318e+011,
            low: -0.102,
            high: 0.173,
            name: '1960 Jun',
            color: 'rgba(244,129,21,0.65)'
        }, {
            x: -1.1059e+011,
            low: -0.15,
            high: 0.214,
            name: '1960 Jul',
            color: 'rgba(243,128,22,0.65)'
        }, {
            x: -1.0791e+011,
            low: -0.239,
            high: 0.199,
            name: '1960 Aug',
            color: 'rgba(234,101,39,0.65)'
        }, {
            x: -1.0524e+011,
            low: -0.236,
            high: 0.155,
            name: '1960 Sep',
            color: 'rgba(228,94,46,0.65)'
        }, {
            x: -1.0264e+011,
            low: -0.249,
            high: 0.044,
            name: '1960 Oct',
            color: 'rgba(204,66,71,0.65)'
        }, {
            x: -9.9965e+010,
            low: -0.217,
            high: 0.026,
            name: '1960 Nov',
            color: 'rgba(207,68,69,0.65)'
        }, {
            x: -9.7373e+010,
            low: -0.277,
            high: -0.009,
            name: '1960 Dec',
            color: 'rgba(185,55,83,0.65)'
        }, {
            x: -9.4694e+010,
            low: -0.302,
            high: -0.032,
            name: '1960 Jan',
            color: 'rgba(174,49,90,0.65)'
        }, {
            x: -9.2016e+010,
            low: -0.351,
            high: -0.119,
            name: '1960 Feb',
            color: 'rgba(133,32,105,0.65)'
        }, {
            x: -8.9597e+010,
            low: -0.187,
            high: 0.08,
            name: '1960 Mar',
            color: 'rgba(224,89,50,0.65)'
        }, {
            x: -8.6918e+010,
            low: -0.21,
            high: 0.074,
            name: '1960 Apr',
            color: 'rgba(218,81,57,0.65)'
        }, {
            x: -8.4326e+010,
            low: -0.08,
            high: 0.228,
            name: '1960 May',
            color: 'rgba(248,145,11,0.65)'
        }, {
            x: -8.1648e+010,
            low: -0.221,
            high: 0.051,
            name: '1960 Jun',
            color: 'rgba(211,73,65,0.65)'
        }, {
            x: -7.9056e+010,
            low: -0.243,
            high: 0.117,
            name: '1960 Jul',
            color: 'rgba(219,82,56,0.65)'
        }, {
            x: -7.6378e+010,
            low: -0.282,
            high: 0.156,
            name: '1960 Aug',
            color: 'rgba(219,83,56,0.65)'
        }, {
            x: -7.3699e+010,
            low: -0.289,
            high: 0.095,
            name: '1960 Sep',
            color: 'rgba(206,67,70,0.65)'
        }, {
            x: -7.1107e+010,
            low: -0.082,
            high: 0.203,
            name: '1960 Oct',
            color: 'rgba(247,140,14,0.65)'
        }, {
            x: -6.8429e+010,
            low: -0.184,
            high: 0.055,
            name: '1960 Nov',
            color: 'rgba(219,83,55,0.65)'
        }, {
            x: -6.5837e+010,
            low: -0.278,
            high: -0.023,
            name: '1960 Dec',
            color: 'rgba(182,53,85,0.65)'
        }, {
            x: -6.3158e+010,
            low: -0.376,
            high: -0.106,
            name: '1960 Jan',
            color: 'rgba(129,31,106,0.65)'
        }, {
            x: -6.048e+010,
            low: -0.328,
            high: -0.099,
            name: '1960 Feb',
            color: 'rgba(148,38,100,0.65)'
        }, {
            x: -5.7974e+010,
            low: -0.098,
            high: 0.171,
            name: '1960 Mar',
            color: 'rgba(244,130,21,0.65)'
        }, {
            x: -5.5296e+010,
            low: -0.304,
            high: -0.037,
            name: '1960 Apr',
            color: 'rgba(172,48,91,0.65)'
        }, {
            x: -5.2704e+010,
            low: -0.369,
            high: -0.072,
            name: '1960 May',
            color: 'rgba(143,36,102,0.65)'
        }, {
            x: -5.0026e+010,
            low: -0.239,
            high: 0.028,
            name: '1960 Jun',
            color: 'rgba(203,65,72,0.65)'
        }, {
            x: -4.7434e+010,
            low: -0.279,
            high: 0.074,
            name: '1960 Jul',
            color: 'rgba(204,66,71,0.65)'
        }, {
            x: -4.4755e+010,
            low: -0.277,
            high: 0.158,
            name: '1960 Aug',
            color: 'rgba(221,85,53,0.65)'
        }, {
            x: -4.2077e+010,
            low: -0.277,
            high: 0.104,
            name: '1960 Sep',
            color: 'rgba(211,73,65,0.65)'
        }, {
            x: -3.9485e+010,
            low: -0.164,
            high: 0.13,
            name: '1960 Oct',
            color: 'rgba(235,103,38,0.65)'
        }, {
            x: -3.6806e+010,
            low: -0.189,
            high: 0.047,
            name: '1960 Nov',
            color: 'rgba(217,81,58,0.65)'
        }, {
            x: -3.4214e+010,
            low: -0.238,
            high: 0.021,
            name: '1960 Dec',
            color: 'rgba(201,64,73,0.65)'
        }, {
            x: -3.1536e+010,
            low: -0.303,
            high: -0.041,
            name: '1960 Jan',
            color: 'rgba(172,48,91,0.65)'
        }, {
            x: -2.8858e+010,
            low: -0.281,
            high: -0.059,
            name: '1960 Feb',
            color: 'rgba(172,48,91,0.65)'
        }, {
            x: -2.6438e+010,
            low: -0.137,
            high: 0.131,
            name: '1960 Mar',
            color: 'rgba(238,109,33,0.65)'
        }, {
            x: -2.376e+010,
            low: -0.024,
            high: 0.24,
            name: '1960 Apr',
            color: 'rgba(250,156,8,0.65)'
        }, {
            x: -2.1168e+010,
            low: -0.024,
            high: 0.277,
            name: '1960 May',
            color: 'rgba(250,162,14,0.65)'
        }, {
            x: -1.849e+010,
            low: -0.112,
            high: 0.157,
            name: '1960 Jun',
            color: 'rgba(242,124,24,0.65)'
        }, {
            x: -1.5898e+010,
            low: -0.139,
            high: 0.212,
            name: '1960 Jul',
            color: 'rgba(244,131,20,0.65)'
        }, {
            x: -1.3219e+010,
            low: -0.165,
            high: 0.268,
            name: '1960 Aug',
            color: 'rgba(245,136,17,0.65)'
        }, {
            x: -1.0541e+010,
            low: -0.181,
            high: 0.21,
            name: '1960 Sep',
            color: 'rgba(241,120,27,0.65)'
        }, {
            x: -7.9488e+009,
            low: -0.119,
            high: 0.165,
            name: '1960 Oct',
            color: 'rgba(242,124,24,0.65)'
        }, {
            x: -5.2704e+009,
            low: 0.013,
            high: 0.25,
            name: '1960 Nov',
            color: 'rgba(250,165,17,0.65)'
        }, {
            x: -2.6784e+009,
            low: 0.069,
            high: 0.32,
            name: '1960 Dec',
            color: 'rgba(248,184,36,0.65)'
        }, {
            x: 0,
            low: -0.063,
            high: 0.205,
            name: '1970 Jan',
            color: 'rgba(248,144,11,0.65)'
        }, {
            x: 2678400000,
            low: 0.028,
            high: 0.258,
            name: '1970 Feb',
            color: 'rgba(249,170,22,0.65)'
        }, {
            x: 5097600000,
            low: -0.195,
            high: 0.056,
            name: '1970 Mar',
            color: 'rgba(217,81,58,0.65)'
        }, {
            x: 7776000000,
            low: -0.075,
            high: 0.195,
            name: '1970 Apr',
            color: 'rgba(246,139,15,0.65)'
        }, {
            x: 10368000000,
            low: -0.182,
            high: 0.114,
            name: '1970 May',
            color: 'rgba(230,97,44,0.65)'
        }, {
            x: 13046400000,
            low: -0.152,
            high: 0.124,
            name: '1970 Jun',
            color: 'rgba(236,104,37,0.65)'
        }, {
            x: 15638400000,
            low: -0.228,
            high: 0.131,
            name: '1970 Jul',
            color: 'rgba(225,90,49,0.65)'
        }, {
            x: 18316800000,
            low: -0.307,
            high: 0.127,
            name: '1970 Aug',
            color: 'rgba(209,71,67,0.65)'
        }, {
            x: 20995200000,
            low: -0.234,
            high: 0.158,
            name: '1970 Sep',
            color: 'rgba(228,95,45,0.65)'
        }, {
            x: 23587200000,
            low: -0.217,
            high: 0.069,
            name: '1970 Oct',
            color: 'rgba(215,78,60,0.65)'
        }, {
            x: 26265600000,
            low: -0.163,
            high: 0.066,
            name: '1970 Nov',
            color: 'rgba(225,90,49,0.65)'
        }, {
            x: 28857600000,
            low: -0.286,
            high: -0.041,
            name: '1970 Dec',
            color: 'rgba(175,50,89,0.65)'
        }, {
            x: 31536000000,
            low: -0.237,
            high: 0.042,
            name: '1970 Jan',
            color: 'rgba(206,67,70,0.65)'
        }, {
            x: 34214400000,
            low: -0.404,
            high: -0.176,
            name: '1970 Feb',
            color: 'rgba(103,22,108,0.65)'
        }, {
            x: 36633600000,
            low: -0.414,
            high: -0.155,
            name: '1970 Mar',
            color: 'rgba(105,22,108,0.65)'
        }, {
            x: 39312000000,
            low: -0.369,
            high: -0.101,
            name: '1970 Apr',
            color: 'rgba(132,32,105,0.65)'
        }, {
            x: 41904000000,
            low: -0.361,
            high: -0.065,
            name: '1970 May',
            color: 'rgba(147,37,100,0.65)'
        }, {
            x: 44582400000,
            low: -0.366,
            high: -0.1,
            name: '1970 Jun',
            color: 'rgba(135,33,104,0.65)'
        }, {
            x: 47174400000,
            low: -0.307,
            high: 0.05,
            name: '1970 Jul',
            color: 'rgba(191,59,79,0.65)'
        }, {
            x: 49852800000,
            low: -0.384,
            high: 0.051,
            name: '1970 Aug',
            color: 'rgba(173,49,90,0.65)'
        }, {
            x: 52531200000,
            low: -0.317,
            high: 0.074,
            name: '1970 Sep',
            color: 'rgba(195,61,77,0.65)'
        }, {
            x: 55123200000,
            low: -0.306,
            high: -0.013,
            name: '1970 Oct',
            color: 'rgba(178,51,87,0.65)'
        }, {
            x: 57801600000,
            low: -0.196,
            high: 0.037,
            name: '1970 Nov',
            color: 'rgba(212,75,63,0.65)'
        }, {
            x: 60393600000,
            low: -0.327,
            high: -0.079,
            name: '1970 Dec',
            color: 'rgba(153,39,99,0.65)'
        }, {
            x: 63072000000,
            low: -0.51,
            high: -0.242,
            name: '1970 Jan',
            color: 'rgba(60,12,94,0.65)'
        }, {
            x: 65750400000,
            low: -0.401,
            high: -0.172,
            name: '1970 Feb',
            color: 'rgba(104,22,108,0.65)'
        }, {
            x: 68256000000,
            low: -0.254,
            high: -0.009,
            name: '1970 Mar',
            color: 'rgba(189,57,81,0.65)'
        }, {
            x: 70934400000,
            low: -0.213,
            high: 0.058,
            name: '1970 Apr',
            color: 'rgba(213,76,62,0.65)'
        }, {
            x: 73526400000,
            low: -0.212,
            high: 0.085,
            name: '1970 May',
            color: 'rgba(219,83,56,0.65)'
        }, {
            x: 76204800000,
            low: -0.131,
            high: 0.137,
            name: '1970 Jun',
            color: 'rgba(239,112,31,0.65)'
        }, {
            x: 78796800000,
            low: -0.199,
            high: 0.151,
            name: '1970 Jul',
            color: 'rgba(233,100,40,0.65)'
        }, {
            x: 81475200000,
            low: -0.204,
            high: 0.235,
            name: '1970 Aug',
            color: 'rgba(241,119,27,0.65)'
        }, {
            x: 84153600000,
            low: -0.257,
            high: 0.142,
            name: '1970 Sep',
            color: 'rgba(222,87,53,0.65)'
        }, {
            x: 86745600000,
            low: -0.147,
            high: 0.152,
            name: '1970 Oct',
            color: 'rgba(239,112,32,0.65)'
        }, {
            x: 89424000000,
            low: -0.12,
            high: 0.114,
            name: '1970 Nov',
            color: 'rgba(238,108,34,0.65)'
        }, {
            x: 92016000000,
            low: 0.061,
            high: 0.308,
            name: '1970 Dec',
            color: 'rgba(248,182,34,0.65)'
        }, {
            x: 94694400000,
            low: 0.014,
            high: 0.28,
            name: '1970 Jan',
            color: 'rgba(249,171,23,0.65)'
        }, {
            x: 97372800000,
            low: 0.166,
            high: 0.389,
            name: '1970 Feb',
            color: 'rgba(247,200,52,0.65)'
        }, {
            x: 99792000000,
            low: 0.098,
            high: 0.356,
            name: '1970 Mar',
            color: 'rgba(248,191,43,0.65)'
        }, {
            x: 102470400000,
            low: 0.028,
            high: 0.297,
            name: '1970 Apr',
            color: 'rgba(249,177,29,0.65)'
        }, {
            x: 105062400000,
            low: -0.062,
            high: 0.237,
            name: '1970 May',
            color: 'rgba(249,149,8,0.65)'
        }, {
            x: 107740800000,
            low: -0.018,
            high: 0.237,
            name: '1970 Jun',
            color: 'rgba(250,158,10,0.65)'
        }, {
            x: 110332800000,
            low: -0.141,
            high: 0.192,
            name: '1970 Jul',
            color: 'rgba(242,124,24,0.65)'
        }, {
            x: 113011200000,
            low: -0.194,
            high: 0.233,
            name: '1970 Aug',
            color: 'rgba(241,121,26,0.65)'
        }, {
            x: 115689600000,
            low: -0.234,
            high: 0.158,
            name: '1970 Sep',
            color: 'rgba(229,96,44,0.65)'
        }, {
            x: 118281600000,
            low: -0.189,
            high: 0.108,
            name: '1970 Oct',
            color: 'rgba(228,93,46,0.65)'
        }, {
            x: 120960000000,
            low: -0.208,
            high: 0.02,
            name: '1970 Nov',
            color: 'rgba(207,68,69,0.65)'
        }, {
            x: 123552000000,
            low: -0.233,
            high: 0.017,
            name: '1970 Dec',
            color: 'rgba(202,65,72,0.65)'
        }, {
            x: 126230400000,
            low: -0.503,
            high: -0.248,
            name: '1970 Jan',
            color: 'rgba(60,12,94,0.65)'
        }, {
            x: 128908800000,
            low: -0.517,
            high: -0.295,
            name: '1970 Feb',
            color: 'rgba(47,12,83,0.65)'
        }, {
            x: 131328000000,
            low: -0.361,
            high: -0.106,
            name: '1970 Mar',
            color: 'rgba(135,33,104,0.65)'
        }, {
            x: 134006400000,
            low: -0.315,
            high: -0.041,
            name: '1970 Apr',
            color: 'rgba(168,45,93,0.65)'
        }, {
            x: 136598400000,
            low: -0.346,
            high: -0.045,
            name: '1970 May',
            color: 'rgba(158,41,97,0.65)'
        }, {
            x: 139276800000,
            low: -0.287,
            high: -0.015,
            name: '1970 Jun',
            color: 'rgba(182,53,85,0.65)'
        }, {
            x: 141868800000,
            low: -0.299,
            high: 0.049,
            name: '1970 Jul',
            color: 'rgba(193,60,78,0.65)'
        }, {
            x: 144547200000,
            low: -0.295,
            high: 0.133,
            name: '1970 Aug',
            color: 'rgba(212,74,64,0.65)'
        }, {
            x: 147225600000,
            low: -0.324,
            high: 0.065,
            name: '1970 Sep',
            color: 'rgba(191,59,79,0.65)'
        }, {
            x: 149817600000,
            low: -0.36,
            high: -0.072,
            name: '1970 Oct',
            color: 'rgba(147,37,100,0.65)'
        }, {
            x: 152496000000,
            low: -0.329,
            high: -0.093,
            name: '1970 Nov',
            color: 'rgba(150,38,100,0.65)'
        }, {
            x: 155088000000,
            low: -0.361,
            high: -0.111,
            name: '1970 Dec',
            color: 'rgba(132,32,105,0.65)'
        }, {
            x: 157766400000,
            low: -0.207,
            high: 0.065,
            name: '1970 Jan',
            color: 'rgba(216,80,59,0.65)'
        }, {
            x: 160444800000,
            low: -0.203,
            high: 0.019,
            name: '1970 Feb',
            color: 'rgba(209,70,67,0.65)'
        }, {
            x: 162864000000,
            low: -0.208,
            high: 0.058,
            name: '1970 Mar',
            color: 'rgba(215,78,61,0.65)'
        }, {
            x: 165542400000,
            low: -0.222,
            high: 0.045,
            name: '1970 Apr',
            color: 'rgba(210,72,66,0.65)'
        }, {
            x: 168134400000,
            low: -0.229,
            high: 0.066,
            name: '1970 May',
            color: 'rgba(212,74,64,0.65)'
        }, {
            x: 170812800000,
            low: -0.215,
            high: 0.048,
            name: '1970 Jun',
            color: 'rgba(212,74,64,0.65)'
        }, {
            x: 173404800000,
            low: -0.285,
            high: 0.067,
            name: '1970 Jul',
            color: 'rgba(201,65,73,0.65)'
        }, {
            x: 176083200000,
            low: -0.396,
            high: 0.039,
            name: '1970 Aug',
            color: 'rgba(168,45,93,0.65)'
        }, {
            x: 178761600000,
            low: -0.321,
            high: 0.071,
            name: '1970 Sep',
            color: 'rgba(193,60,78,0.65)'
        }, {
            x: 181353600000,
            low: -0.373,
            high: -0.083,
            name: '1970 Oct',
            color: 'rgba(138,34,103,0.65)'
        }, {
            x: 184032000000,
            low: -0.427,
            high: -0.196,
            name: '1970 Nov',
            color: 'rgba(91,17,107,0.65)'
        }, {
            x: 186624000000,
            low: -0.432,
            high: -0.177,
            name: '1970 Dec',
            color: 'rgba(96,19,107,0.65)'
        }, {
            x: 189302400000,
            low: -0.366,
            high: -0.094,
            name: '1970 Jan',
            color: 'rgba(138,34,103,0.65)'
        }, {
            x: 191980800000,
            low: -0.434,
            high: -0.211,
            name: '1970 Feb',
            color: 'rgba(85,15,107,0.65)'
        }, {
            x: 194486400000,
            low: -0.576,
            high: -0.31,
            name: '1970 Mar',
            color: 'rgba(34,12,71,0.65)'
        }, {
            x: 197164800000,
            low: -0.335,
            high: -0.058,
            name: '1970 Apr',
            color: 'rgba(157,41,98,0.65)'
        }, {
            x: 199756800000,
            low: -0.466,
            high: -0.168,
            name: '1970 May',
            color: 'rgba(89,17,107,0.65)'
        }, {
            x: 202435200000,
            low: -0.381,
            high: -0.119,
            name: '1970 Jun',
            color: 'rgba(125,30,107,0.65)'
        }, {
            x: 205027200000,
            low: -0.361,
            high: -0.01,
            name: '1970 Jul',
            color: 'rgba(165,44,95,0.65)'
        }, {
            x: 207705600000,
            low: -0.418,
            high: 0.015,
            name: '1970 Aug',
            color: 'rgba(154,40,98,0.65)'
        }, {
            x: 210384000000,
            low: -0.357,
            high: 0.03,
            name: '1970 Sep',
            color: 'rgba(176,50,89,0.65)'
        }, {
            x: 212976000000,
            low: -0.454,
            high: -0.172,
            name: '1970 Oct',
            color: 'rgba(91,17,107,0.65)'
        }, {
            x: 215654400000,
            low: -0.292,
            high: -0.06,
            name: '1970 Nov',
            color: 'rgba(170,47,92,0.65)'
        }, {
            x: 218246400000,
            low: -0.208,
            high: 0.046,
            name: '1970 Dec',
            color: 'rgba(212,74,63,0.65)'
        }, {
            x: 220924800000,
            low: -0.214,
            high: 0.054,
            name: '1970 Jan',
            color: 'rgba(212,74,63,0.65)'
        }, {
            x: 223603200000,
            low: -0.032,
            high: 0.188,
            name: '1970 Feb',
            color: 'rgba(249,147,10,0.65)'
        }, {
            x: 226022400000,
            low: -0.023,
            high: 0.231,
            name: '1970 Mar',
            color: 'rgba(250,156,8,0.65)'
        }, {
            x: 228700800000,
            low: -0.038,
            high: 0.228,
            name: '1970 Apr',
            color: 'rgba(250,152,6,0.65)'
        }, {
            x: 231292800000,
            low: -0.075,
            high: 0.215,
            name: '1970 May',
            color: 'rgba(248,143,12,0.65)'
        }, {
            x: 233971200000,
            low: -0.021,
            high: 0.242,
            name: '1970 Jun',
            color: 'rgba(250,157,9,0.65)'
        }, {
            x: 236563200000,
            low: -0.115,
            high: 0.235,
            name: '1970 Jul',
            color: 'rgba(247,140,14,0.65)'
        }, {
            x: 239241600000,
            low: -0.219,
            high: 0.217,
            name: '1970 Aug',
            color: 'rgba(238,111,32,0.65)'
        }, {
            x: 241920000000,
            low: -0.165,
            high: 0.232,
            name: '1970 Sep',
            color: 'rgba(243,128,22,0.65)'
        }, {
            x: 244512000000,
            low: -0.151,
            high: 0.138,
            name: '1970 Oct',
            color: 'rgba(238,108,34,0.65)'
        }, {
            x: 247190400000,
            low: 0.025,
            high: 0.249,
            name: '1970 Nov',
            color: 'rgba(249,168,20,0.65)'
        }, {
            x: 249782400000,
            low: -0.179,
            high: 0.068,
            name: '1970 Dec',
            color: 'rgba(223,88,51,0.65)'
        }, {
            x: 252460800000,
            low: -0.116,
            high: 0.145,
            name: '1970 Jan',
            color: 'rgba(241,119,27,0.65)'
        }, {
            x: 255139200000,
            low: -0.15,
            high: 0.074,
            name: '1970 Feb',
            color: 'rgba(229,96,44,0.65)'
        }, {
            x: 257558400000,
            low: -0.097,
            high: 0.153,
            name: '1970 Mar',
            color: 'rgba(243,126,23,0.65)'
        }, {
            x: 260236800000,
            low: -0.186,
            high: 0.065,
            name: '1970 Apr',
            color: 'rgba(220,84,54,0.65)'
        }, {
            x: 262828800000,
            low: -0.238,
            high: 0.061,
            name: '1970 May',
            color: 'rgba(209,71,66,0.65)'
        }, {
            x: 265507200000,
            low: -0.27,
            high: 0.003,
            name: '1970 Jun',
            color: 'rgba(189,58,80,0.65)'
        }, {
            x: 268099200000,
            low: -0.244,
            high: 0.117,
            name: '1970 Jul',
            color: 'rgba(220,84,54,0.65)'
        }, {
            x: 270777600000,
            low: -0.404,
            high: 0.03,
            name: '1970 Aug',
            color: 'rgba(162,43,96,0.65)'
        }, {
            x: 273456000000,
            low: -0.247,
            high: 0.141,
            name: '1970 Sep',
            color: 'rgba(223,88,51,0.65)'
        }, {
            x: 276048000000,
            low: -0.258,
            high: 0.027,
            name: '1970 Oct',
            color: 'rgba(199,63,74,0.65)'
        }, {
            x: 278726400000,
            low: -0.072,
            high: 0.164,
            name: '1970 Nov',
            color: 'rgba(245,134,18,0.65)'
        }, {
            x: 281318400000,
            low: -0.222,
            high: 0.019,
            name: '1970 Dec',
            color: 'rgba(205,67,70,0.65)'
        }, {
            x: 283996800000,
            low: -0.166,
            high: 0.091,
            name: '1970 Jan',
            color: 'rgba(229,96,44,0.65)'
        }, {
            x: 286675200000,
            low: -0.247,
            high: -0.033,
            name: '1970 Feb',
            color: 'rgba(187,56,82,0.65)'
        }, {
            x: 289094400000,
            low: -0.106,
            high: 0.135,
            name: '1970 Mar',
            color: 'rgba(241,119,27,0.65)'
        }, {
            x: 291772800000,
            low: -0.175,
            high: 0.079,
            name: '1970 Apr',
            color: 'rgba(226,91,48,0.65)'
        }, {
            x: 294364800000,
            low: -0.176,
            high: 0.116,
            name: '1970 May',
            color: 'rgba(232,99,42,0.65)'
        }, {
            x: 297043200000,
            low: -0.078,
            high: 0.192,
            name: '1970 Jun',
            color: 'rgba(246,139,15,0.65)'
        }, {
            x: 299635200000,
            low: -0.123,
            high: 0.229,
            name: '1970 Jul',
            color: 'rgba(246,137,16,0.65)'
        }, {
            x: 302313600000,
            low: -0.127,
            high: 0.287,
            name: '1970 Aug',
            color: 'rgba(249,147,9,0.65)'
        }, {
            x: 304992000000,
            low: -0.099,
            high: 0.281,
            name: '1970 Sep',
            color: 'rgba(250,151,7,0.65)'
        }, {
            x: 307584000000,
            low: -0.009,
            high: 0.267,
            name: '1970 Oct',
            color: 'rgba(250,165,17,0.65)'
        }, {
            x: 310262400000,
            low: 0.043,
            high: 0.252,
            name: '1970 Nov',
            color: 'rgba(249,172,24,0.65)'
        }, {
            x: 312854400000,
            low: 0.24,
            high: 0.469,
            name: '1970 Dec',
            color: 'rgba(247,213,72,0.65)'
        }, {
            x: 315532800000,
            low: 0.003,
            high: 0.262,
            name: '1980 Jan',
            color: 'rgba(250,166,18,0.65)'
        }, {
            x: 318211200000,
            low: 0.112,
            high: 0.323,
            name: '1980 Feb',
            color: 'rgba(248,189,41,0.65)'
        }, {
            x: 320716800000,
            low: -0.046,
            high: 0.189,
            name: '1980 Mar',
            color: 'rgba(248,144,11,0.65)'
        }, {
            x: 323395200000,
            low: 0.01,
            high: 0.267,
            name: '1980 Apr',
            color: 'rgba(249,169,21,0.65)'
        }, {
            x: 325987200000,
            low: -0.012,
            high: 0.289,
            name: '1980 May',
            color: 'rgba(249,168,20,0.65)'
        }, {
            x: 328665600000,
            low: -0.062,
            high: 0.199,
            name: '1980 Jun',
            color: 'rgba(248,143,12,0.65)'
        }, {
            x: 331257600000,
            low: -0.122,
            high: 0.241,
            name: '1980 Jul',
            color: 'rgba(247,140,14,0.65)'
        }, {
            x: 333936000000,
            low: -0.187,
            high: 0.257,
            name: '1980 Aug',
            color: 'rgba(244,130,21,0.65)'
        }, {
            x: 336614400000,
            low: -0.156,
            high: 0.229,
            name: '1980 Sep',
            color: 'rgba(244,130,20,0.65)'
        }, {
            x: 339206400000,
            low: -0.14,
            high: 0.152,
            name: '1980 Oct',
            color: 'rgba(240,115,30,0.65)'
        }, {
            x: 341884800000,
            low: 0.018,
            high: 0.245,
            name: '1980 Nov',
            color: 'rgba(250,165,17,0.65)'
        }, {
            x: 344476800000,
            low: -0.057,
            high: 0.172,
            name: '1980 Dec',
            color: 'rgba(246,139,15,0.65)'
        }, {
            x: 347155200000,
            low: 0.208,
            high: 0.458,
            name: '1980 Jan',
            color: 'rgba(247,211,67,0.65)'
        }, {
            x: 349833600000,
            low: 0.086,
            high: 0.303,
            name: '1980 Feb',
            color: 'rgba(248,184,36,0.65)'
        }, {
            x: 352252800000,
            low: 0.102,
            high: 0.311,
            name: '1980 Mar',
            color: 'rgba(248,186,38,0.65)'
        }, {
            x: 354931200000,
            low: 0.004,
            high: 0.25,
            name: '1980 Apr',
            color: 'rgba(250,163,15,0.65)'
        }, {
            x: 357523200000,
            low: -0.085,
            high: 0.217,
            name: '1980 May',
            color: 'rgba(247,142,13,0.65)'
        }, {
            x: 360201600000,
            low: -0.012,
            high: 0.257,
            name: '1980 Jun',
            color: 'rgba(250,161,13,0.65)'
        }, {
            x: 362793600000,
            low: -0.091,
            high: 0.276,
            name: '1980 Jul',
            color: 'rgba(250,152,6,0.65)'
        }, {
            x: 365472000000,
            low: -0.101,
            high: 0.345,
            name: '1980 Aug',
            color: 'rgba(250,160,12,0.65)'
        }, {
            x: 368150400000,
            low: -0.127,
            high: 0.269,
            name: '1980 Sep',
            color: 'rgba(248,144,11,0.65)'
        }, {
            x: 370742400000,
            low: -0.146,
            high: 0.149,
            name: '1980 Oct',
            color: 'rgba(239,112,31,0.65)'
        }, {
            x: 373420800000,
            low: -0.042,
            high: 0.183,
            name: '1980 Nov',
            color: 'rgba(248,144,12,0.65)'
        }, {
            x: 376012800000,
            low: 0.147,
            high: 0.385,
            name: '1980 Dec',
            color: 'rgba(247,198,50,0.65)'
        }, {
            x: 378691200000,
            low: -0.19,
            high: 0.093,
            name: '1980 Jan',
            color: 'rgba(226,91,48,0.65)'
        }, {
            x: 381369600000,
            low: -0.112,
            high: 0.117,
            name: '1980 Feb',
            color: 'rgba(239,113,31,0.65)'
        }, {
            x: 383788800000,
            low: -0.244,
            high: -0.012,
            name: '1980 Mar',
            color: 'rgba(192,59,78,0.65)'
        }, {
            x: 386467200000,
            low: -0.107,
            high: 0.156,
            name: '1980 Apr',
            color: 'rgba(242,125,24,0.65)'
        }, {
            x: 389059200000,
            low: -0.108,
            high: 0.193,
            name: '1980 May',
            color: 'rgba(245,133,18,0.65)'
        }, {
            x: 391737600000,
            low: -0.191,
            high: 0.088,
            name: '1980 Jun',
            color: 'rgba(225,90,49,0.65)'
        }, {
            x: 394329600000,
            low: -0.201,
            high: 0.16,
            name: '1980 Jul',
            color: 'rgba(235,103,38,0.65)'
        }, {
            x: 397008000000,
            low: -0.228,
            high: 0.206,
            name: '1980 Aug',
            color: 'rgba(237,107,35,0.65)'
        }, {
            x: 399686400000,
            low: -0.126,
            high: 0.273,
            name: '1980 Sep',
            color: 'rgba(248,145,11,0.65)'
        }, {
            x: 402278400000,
            low: -0.144,
            high: 0.15,
            name: '1980 Oct',
            color: 'rgba(239,113,31,0.65)'
        }, {
            x: 404956800000,
            low: -0.125,
            high: 0.103,
            name: '1980 Nov',
            color: 'rgba(237,106,36,0.65)'
        }, {
            x: 407548800000,
            low: 0.129,
            high: 0.371,
            name: '1980 Dec',
            color: 'rgba(247,196,48,0.65)'
        }, {
            x: 410227200000,
            low: 0.292,
            high: 0.567,
            name: '1980 Jan',
            color: 'rgba(248,222,91,0.65)'
        }, {
            x: 412905600000,
            low: 0.195,
            high: 0.421,
            name: '1980 Feb',
            color: 'rgba(247,206,58,0.65)'
        }, {
            x: 415324800000,
            low: 0.091,
            high: 0.324,
            name: '1980 Mar',
            color: 'rgba(248,186,38,0.65)'
        }, {
            x: 418003200000,
            low: -0.009,
            high: 0.237,
            name: '1980 Apr',
            color: 'rgba(250,159,11,0.65)'
        }, {
            x: 420595200000,
            low: -0.012,
            high: 0.282,
            name: '1980 May',
            color: 'rgba(249,167,19,0.65)'
        }, {
            x: 423273600000,
            low: -0.001,
            high: 0.274,
            name: '1980 Jun',
            color: 'rgba(249,167,19,0.65)'
        }, {
            x: 425865600000,
            low: -0.031,
            high: 0.332,
            name: '1980 Jul',
            color: 'rgba(249,174,26,0.65)'
        }, {
            x: 428544000000,
            low: -0.023,
            high: 0.418,
            name: '1980 Aug',
            color: 'rgba(248,185,37,0.65)'
        }, {
            x: 431222400000,
            low: -0.01,
            high: 0.383,
            name: '1980 Sep',
            color: 'rgba(248,183,35,0.65)'
        }, {
            x: 433814400000,
            low: -0.051,
            high: 0.247,
            name: '1980 Oct',
            color: 'rgba(250,154,6,0.65)'
        }, {
            x: 436492800000,
            low: 0.141,
            high: 0.374,
            name: '1980 Nov',
            color: 'rgba(247,197,49,0.65)'
        }, {
            x: 439084800000,
            low: -0.038,
            high: 0.203,
            name: '1980 Dec',
            color: 'rgba(249,148,9,0.65)'
        }, {
            x: 441763200000,
            low: -0.014,
            high: 0.256,
            name: '1980 Jan',
            color: 'rgba(250,160,12,0.65)'
        }, {
            x: 444441600000,
            low: -0.1,
            high: 0.133,
            name: '1980 Feb',
            color: 'rgba(241,121,26,0.65)'
        }, {
            x: 446947200000,
            low: -0.071,
            high: 0.17,
            name: '1980 Mar',
            color: 'rgba(245,135,17,0.65)'
        }, {
            x: 449625600000,
            low: -0.167,
            high: 0.083,
            name: '1980 Apr',
            color: 'rgba(228,93,46,0.65)'
        }, {
            x: 452217600000,
            low: -0.065,
            high: 0.244,
            name: '1980 May',
            color: 'rgba(250,151,7,0.65)'
        }, {
            x: 454896000000,
            low: -0.156,
            high: 0.127,
            name: '1980 Jun',
            color: 'rgba(236,104,37,0.65)'
        }, {
            x: 457488000000,
            low: -0.217,
            high: 0.147,
            name: '1980 Jul',
            color: 'rgba(230,97,43,0.65)'
        }, {
            x: 460166400000,
            low: -0.179,
            high: 0.259,
            name: '1980 Aug',
            color: 'rgba(244,132,19,0.65)'
        }, {
            x: 462844800000,
            low: -0.161,
            high: 0.23,
            name: '1980 Sep',
            color: 'rgba(244,130,21,0.65)'
        }, {
            x: 465436800000,
            low: -0.173,
            high: 0.124,
            name: '1980 Oct',
            color: 'rgba(233,101,40,0.65)'
        }, {
            x: 468115200000,
            low: -0.236,
            high: -0.01,
            name: '1980 Nov',
            color: 'rgba(194,60,77,0.65)'
        }, {
            x: 470707200000,
            low: -0.397,
            high: -0.157,
            name: '1980 Dec',
            color: 'rgba(110,24,108,0.65)'
        }, {
            x: 473385600000,
            low: -0.127,
            high: 0.146,
            name: '1980 Jan',
            color: 'rgba(240,115,30,0.65)'
        }, {
            x: 476064000000,
            low: -0.252,
            high: -0.026,
            name: '1980 Feb',
            color: 'rgba(188,57,81,0.65)'
        }, {
            x: 478483200000,
            low: -0.149,
            high: 0.098,
            name: '1980 Mar',
            color: 'rgba(233,100,40,0.65)'
        }, {
            x: 481161600000,
            low: -0.162,
            high: 0.09,
            name: '1980 Apr',
            color: 'rgba(230,97,43,0.65)'
        }, {
            x: 483753600000,
            low: -0.15,
            high: 0.144,
            name: '1980 May',
            color: 'rgba(238,110,33,0.65)'
        }, {
            x: 486432000000,
            low: -0.193,
            high: 0.073,
            name: '1980 Jun',
            color: 'rgba(222,87,53,0.65)'
        }, {
            x: 489024000000,
            low: -0.232,
            high: 0.118,
            name: '1980 Jul',
            color: 'rgba(223,87,52,0.65)'
        }, {
            x: 491702400000,
            low: -0.183,
            high: 0.243,
            name: '1980 Aug',
            color: 'rgba(243,128,22,0.65)'
        }, {
            x: 494380800000,
            low: -0.227,
            high: 0.167,
            name: '1980 Sep',
            color: 'rgba(232,99,42,0.65)'
        }, {
            x: 496972800000,
            low: -0.129,
            high: 0.169,
            name: '1980 Oct',
            color: 'rgba(242,123,25,0.65)'
        }, {
            x: 499651200000,
            low: -0.187,
            high: 0.034,
            name: '1980 Nov',
            color: 'rgba(214,76,62,0.65)'
        }, {
            x: 502243200000,
            low: -0.1,
            high: 0.124,
            name: '1980 Dec',
            color: 'rgba(241,119,27,0.65)'
        }, {
            x: 504921600000,
            low: -0.006,
            high: 0.258,
            name: '1980 Jan',
            color: 'rgba(250,163,15,0.65)'
        }, {
            x: 507600000000,
            low: -0.019,
            high: 0.195,
            name: '1980 Feb',
            color: 'rgba(250,150,8,0.65)'
        }, {
            x: 510019200000,
            low: -0.05,
            high: 0.197,
            name: '1980 Mar',
            color: 'rgba(248,146,10,0.65)'
        }, {
            x: 512697600000,
            low: -0.045,
            high: 0.204,
            name: '1980 Apr',
            color: 'rgba(249,148,9,0.65)'
        }, {
            x: 515289600000,
            low: -0.108,
            high: 0.194,
            name: '1980 May',
            color: 'rgba(245,133,18,0.65)'
        }, {
            x: 517968000000,
            low: -0.087,
            high: 0.19,
            name: '1980 Jun',
            color: 'rgba(245,136,17,0.65)'
        }, {
            x: 520560000000,
            low: -0.178,
            high: 0.174,
            name: '1980 Jul',
            color: 'rgba(239,112,32,0.65)'
        }, {
            x: 523238400000,
            low: -0.207,
            high: 0.214,
            name: '1980 Aug',
            color: 'rgba(239,113,31,0.65)'
        }, {
            x: 525916800000,
            low: -0.187,
            high: 0.211,
            name: '1980 Sep',
            color: 'rgba(241,119,27,0.65)'
        }, {
            x: 528508800000,
            low: -0.078,
            high: 0.203,
            name: '1980 Oct',
            color: 'rgba(247,142,13,0.65)'
        }, {
            x: 531187200000,
            low: -0.113,
            high: 0.109,
            name: '1980 Nov',
            color: 'rgba(238,109,33,0.65)'
        }, {
            x: 533779200000,
            low: -0.11,
            high: 0.128,
            name: '1980 Dec',
            color: 'rgba(240,117,29,0.65)'
        }, {
            x: 536457600000,
            low: -0.021,
            high: 0.244,
            name: '1980 Jan',
            color: 'rgba(250,158,10,0.65)'
        }, {
            x: 539136000000,
            low: 0.185,
            high: 0.416,
            name: '1980 Feb',
            color: 'rgba(247,204,56,0.65)'
        }, {
            x: 541555200000,
            low: -0.096,
            high: 0.144,
            name: '1980 Mar',
            color: 'rgba(242,124,24,0.65)'
        }, {
            x: 544233600000,
            low: -0.038,
            high: 0.224,
            name: '1980 Apr',
            color: 'rgba(250,151,7,0.65)'
        }, {
            x: 546825600000,
            low: -0.009,
            high: 0.294,
            name: '1980 May',
            color: 'rgba(249,170,22,0.65)'
        }, {
            x: 549504000000,
            low: -0.011,
            high: 0.262,
            name: '1980 Jun',
            color: 'rgba(250,162,14,0.65)'
        }, {
            x: 552096000000,
            low: 0.091,
            high: 0.443,
            name: '1980 Jul',
            color: 'rgba(247,198,50,0.65)'
        }, {
            x: 554774400000,
            low: 0.01,
            high: 0.454,
            name: '1980 Aug',
            color: 'rgba(248,192,44,0.65)'
        }, {
            x: 557452800000,
            low: 0.076,
            high: 0.466,
            name: '1980 Sep',
            color: 'rgba(247,199,51,0.65)'
        }, {
            x: 560044800000,
            low: 0.054,
            high: 0.346,
            name: '1980 Oct',
            color: 'rgba(248,185,37,0.65)'
        }, {
            x: 562723200000,
            low: 0.085,
            high: 0.306,
            name: '1980 Nov',
            color: 'rgba(248,184,36,0.65)'
        }, {
            x: 565315200000,
            low: 0.205,
            high: 0.439,
            name: '1980 Dec',
            color: 'rgba(247,208,61,0.65)'
        }, {
            x: 567993600000,
            low: 0.254,
            high: 0.525,
            name: '1980 Jan',
            color: 'rgba(247,217,79,0.65)'
        }, {
            x: 570672000000,
            low: 0.118,
            high: 0.338,
            name: '1980 Feb',
            color: 'rgba(248,192,44,0.65)'
        }, {
            x: 573177600000,
            low: 0.143,
            high: 0.389,
            name: '1980 Mar',
            color: 'rgba(247,198,50,0.65)'
        }, {
            x: 575856000000,
            low: 0.094,
            high: 0.358,
            name: '1980 Apr',
            color: 'rgba(248,191,43,0.65)'
        }, {
            x: 578448000000,
            low: 0.059,
            high: 0.357,
            name: '1980 May',
            color: 'rgba(248,187,39,0.65)'
        }, {
            x: 581126400000,
            low: 0.086,
            high: 0.36,
            name: '1980 Jun',
            color: 'rgba(248,190,42,0.65)'
        }, {
            x: 583718400000,
            low: 0.003,
            high: 0.358,
            name: '1980 Jul',
            color: 'rgba(248,181,33,0.65)'
        }, {
            x: 586396800000,
            low: -0.046,
            high: 0.401,
            name: '1980 Aug',
            color: 'rgba(249,180,32,0.65)'
        }, {
            x: 589075200000,
            low: -0.011,
            high: 0.386,
            name: '1980 Sep',
            color: 'rgba(248,183,35,0.65)'
        }, {
            x: 591667200000,
            low: -0.001,
            high: 0.291,
            name: '1980 Oct',
            color: 'rgba(249,171,23,0.65)'
        }, {
            x: 594345600000,
            low: -0.084,
            high: 0.145,
            name: '1980 Nov',
            color: 'rgba(243,128,22,0.65)'
        }, {
            x: 596937600000,
            low: 0.026,
            high: 0.272,
            name: '1980 Dec',
            color: 'rgba(249,173,25,0.65)'
        }, {
            x: 599616000000,
            low: -0.121,
            high: 0.152,
            name: '1980 Jan',
            color: 'rgba(241,120,27,0.65)'
        }, {
            x: 602294400000,
            low: 0.034,
            high: 0.26,
            name: '1980 Feb',
            color: 'rgba(249,172,24,0.65)'
        }, {
            x: 604713600000,
            low: 0.013,
            high: 0.256,
            name: '1980 Mar',
            color: 'rgba(249,167,19,0.65)'
        }, {
            x: 607392000000,
            low: -0.053,
            high: 0.211,
            name: '1980 Apr',
            color: 'rgba(249,147,9,0.65)'
        }, {
            x: 609984000000,
            low: -0.071,
            high: 0.23,
            name: '1980 May',
            color: 'rgba(249,147,10,0.65)'
        }, {
            x: 612662400000,
            low: -0.057,
            high: 0.216,
            name: '1980 Jun',
            color: 'rgba(249,147,10,0.65)'
        }, {
            x: 615254400000,
            low: -0.019,
            high: 0.342,
            name: '1980 Jul',
            color: 'rgba(249,177,29,0.65)'
        }, {
            x: 617932800000,
            low: -0.043,
            high: 0.404,
            name: '1980 Aug',
            color: 'rgba(248,181,33,0.65)'
        }, {
            x: 620611200000,
            low: -0.049,
            high: 0.337,
            name: '1980 Sep',
            color: 'rgba(249,170,22,0.65)'
        }, {
            x: 623203200000,
            low: 0.012,
            high: 0.297,
            name: '1980 Oct',
            color: 'rgba(249,175,27,0.65)'
        }, {
            x: 625881600000,
            low: -0.051,
            high: 0.178,
            name: '1980 Nov',
            color: 'rgba(247,141,13,0.65)'
        }, {
            x: 628473600000,
            low: 0.087,
            high: 0.33,
            name: '1980 Dec',
            color: 'rgba(248,187,39,0.65)'
        }, {
            x: 631152000000,
            low: 0.083,
            high: 0.361,
            name: '1990 Jan',
            color: 'rgba(248,190,42,0.65)'
        }, {
            x: 633830400000,
            low: 0.192,
            high: 0.421,
            name: '1990 Feb',
            color: 'rgba(247,205,57,0.65)'
        }, {
            x: 636249600000,
            low: 0.441,
            high: 0.684,
            name: '1990 Mar',
            color: 'rgba(250,243,138,0.65)'
        }, {
            x: 638928000000,
            low: 0.235,
            high: 0.497,
            name: '1990 Apr',
            color: 'rgba(247,215,76,0.65)'
        }, {
            x: 641520000000,
            low: 0.137,
            high: 0.424,
            name: '1990 May',
            color: 'rgba(247,201,53,0.65)'
        }, {
            x: 644198400000,
            low: 0.139,
            high: 0.417,
            name: '1990 Jun',
            color: 'rgba(247,201,53,0.65)'
        }, {
            x: 646790400000,
            low: 0.051,
            high: 0.417,
            name: '1990 Jul',
            color: 'rgba(248,193,45,0.65)'
        }, {
            x: 649468800000,
            low: 0.027,
            high: 0.477,
            name: '1990 Aug',
            color: 'rgba(247,196,48,0.65)'
        }, {
            x: 652147200000,
            low: -0.026,
            high: 0.374,
            name: '1990 Sep',
            color: 'rgba(249,179,31,0.65)'
        }, {
            x: 654739200000,
            low: 0.186,
            high: 0.475,
            name: '1990 Oct',
            color: 'rgba(247,210,66,0.65)'
        }, {
            x: 657417600000,
            low: 0.202,
            high: 0.431,
            name: '1990 Nov',
            color: 'rgba(247,207,59,0.65)'
        }, {
            x: 660009600000,
            low: 0.122,
            high: 0.37,
            name: '1990 Dec',
            color: 'rgba(247,195,47,0.65)'
        }, {
            x: 662688000000,
            low: 0.145,
            high: 0.432,
            name: '1990 Jan',
            color: 'rgba(247,202,54,0.65)'
        }, {
            x: 665366400000,
            low: 0.173,
            high: 0.408,
            name: '1990 Feb',
            color: 'rgba(247,203,55,0.65)'
        }, {
            x: 667785600000,
            low: 0.064,
            high: 0.317,
            name: '1990 Mar',
            color: 'rgba(248,183,35,0.65)'
        }, {
            x: 670464000000,
            low: 0.249,
            high: 0.52,
            name: '1990 Apr',
            color: 'rgba(247,216,78,0.65)'
        }, {
            x: 673056000000,
            low: 0.15,
            high: 0.455,
            name: '1990 May',
            color: 'rgba(247,204,56,0.65)'
        }, {
            x: 675734400000,
            low: 0.163,
            high: 0.448,
            name: '1990 Jun',
            color: 'rgba(247,204,56,0.65)'
        }, {
            x: 678326400000,
            low: 0.138,
            high: 0.486,
            name: '1990 Jul',
            color: 'rgba(247,206,58,0.65)'
        }, {
            x: 681004800000,
            low: 0.038,
            high: 0.485,
            name: '1990 Aug',
            color: 'rgba(247,197,49,0.65)'
        }, {
            x: 683683200000,
            low: 0.045,
            high: 0.442,
            name: '1990 Sep',
            color: 'rgba(248,194,46,0.65)'
        }, {
            x: 686275200000,
            low: 0.046,
            high: 0.328,
            name: '1990 Oct',
            color: 'rgba(248,183,35,0.65)'
        }, {
            x: 688953600000,
            low: 0.041,
            high: 0.276,
            name: '1990 Nov',
            color: 'rgba(249,175,27,0.65)'
        }, {
            x: 691545600000,
            low: -0.006,
            high: 0.256,
            name: '1990 Dec',
            color: 'rgba(250,162,14,0.65)'
        }, {
            x: 694224000000,
            low: 0.223,
            high: 0.51,
            name: '1990 Jan',
            color: 'rgba(247,215,76,0.65)'
        }, {
            x: 696902400000,
            low: 0.202,
            high: 0.438,
            name: '1990 Feb',
            color: 'rgba(247,208,60,0.65)'
        }, {
            x: 699408000000,
            low: 0.123,
            high: 0.381,
            name: '1990 Mar',
            color: 'rgba(247,196,48,0.65)'
        }, {
            x: 702086400000,
            low: 0.008,
            high: 0.278,
            name: '1990 Apr',
            color: 'rgba(249,170,22,0.65)'
        }, {
            x: 704678400000,
            low: 0.018,
            high: 0.337,
            name: '1990 May',
            color: 'rgba(249,180,32,0.65)'
        }, {
            x: 707356800000,
            low: -0.011,
            high: 0.267,
            name: '1990 Jun',
            color: 'rgba(250,163,15,0.65)'
        }, {
            x: 709948800000,
            low: -0.194,
            high: 0.162,
            name: '1990 Jul',
            color: 'rgba(237,105,36,0.65)'
        }, {
            x: 712627200000,
            low: -0.215,
            high: 0.228,
            name: '1990 Aug',
            color: 'rgba(239,114,30,0.65)'
        }, {
            x: 715305600000,
            low: -0.259,
            high: 0.143,
            name: '1990 Sep',
            color: 'rgba(222,87,53,0.65)'
        }, {
            x: 717897600000,
            low: -0.2,
            high: 0.099,
            name: '1990 Oct',
            color: 'rgba(224,90,50,0.65)'
        }, {
            x: 720576000000,
            low: -0.206,
            high: 0.026,
            name: '1990 Nov',
            color: 'rgba(209,71,66,0.65)'
        }, {
            x: 723168000000,
            low: -0.047,
            high: 0.201,
            name: '1990 Dec',
            color: 'rgba(248,146,10,0.65)'
        }, {
            x: 725846400000,
            low: 0.166,
            high: 0.46,
            name: '1990 Jan',
            color: 'rgba(247,206,58,0.65)'
        }, {
            x: 728524800000,
            low: 0.134,
            high: 0.368,
            name: '1990 Feb',
            color: 'rgba(247,196,48,0.65)'
        }, {
            x: 730944000000,
            low: 0.116,
            high: 0.371,
            name: '1990 Mar',
            color: 'rgba(247,194,46,0.65)'
        }, {
            x: 733622400000,
            low: -0.006,
            high: 0.265,
            name: '1990 Apr',
            color: 'rgba(250,165,17,0.65)'
        }, {
            x: 736214400000,
            low: 0.021,
            high: 0.337,
            name: '1990 May',
            color: 'rgba(249,180,32,0.65)'
        }, {
            x: 738892800000,
            low: 0.036,
            high: 0.316,
            name: '1990 Jun',
            color: 'rgba(249,179,31,0.65)'
        }, {
            x: 741484800000,
            low: -0.051,
            high: 0.316,
            name: '1990 Jul',
            color: 'rgba(250,166,18,0.65)'
        }, {
            x: 744163200000,
            low: -0.13,
            high: 0.322,
            name: '1990 Aug',
            color: 'rgba(250,153,6,0.65)'
        }, {
            x: 746841600000,
            low: -0.138,
            high: 0.262,
            name: '1990 Sep',
            color: 'rgba(247,141,13,0.65)'
        }, {
            x: 749433600000,
            low: -0.052,
            high: 0.248,
            name: '1990 Oct',
            color: 'rgba(250,154,6,0.65)'
        }, {
            x: 752112000000,
            low: -0.166,
            high: 0.074,
            name: '1990 Nov',
            color: 'rgba(226,91,48,0.65)'
        }, {
            x: 754704000000,
            low: -0.011,
            high: 0.244,
            name: '1990 Dec',
            color: 'rgba(250,160,12,0.65)'
        }, {
            x: 757382400000,
            low: 0.037,
            high: 0.321,
            name: '1990 Jan',
            color: 'rgba(249,180,32,0.65)'
        }, {
            x: 760060800000,
            low: -0.174,
            high: 0.065,
            name: '1990 Feb',
            color: 'rgba(224,89,50,0.65)'
        }, {
            x: 762480000000,
            low: 0.088,
            high: 0.347,
            name: '1990 Mar',
            color: 'rgba(248,189,41,0.65)'
        }, {
            x: 765158400000,
            low: 0.063,
            high: 0.348,
            name: '1990 Apr',
            color: 'rgba(248,186,38,0.65)'
        }, {
            x: 767750400000,
            low: 0.114,
            high: 0.425,
            name: '1990 May',
            color: 'rgba(247,199,51,0.65)'
        }, {
            x: 770428800000,
            low: 0.125,
            high: 0.405,
            name: '1990 Jun',
            color: 'rgba(247,197,49,0.65)'
        }, {
            x: 773020800000,
            low: -0.007,
            high: 0.352,
            name: '1990 Jul',
            color: 'rgba(249,178,30,0.65)'
        }, {
            x: 775699200000,
            low: -0.044,
            high: 0.409,
            name: '1990 Aug',
            color: 'rgba(248,181,33,0.65)'
        }, {
            x: 778377600000,
            low: -0.001,
            high: 0.38,
            name: '1990 Sep',
            color: 'rgba(248,183,35,0.65)'
        }, {
            x: 780969600000,
            low: 0.159,
            high: 0.458,
            name: '1990 Oct',
            color: 'rgba(247,205,57,0.65)'
        }, {
            x: 783648000000,
            low: 0.186,
            high: 0.428,
            name: '1990 Nov',
            color: 'rgba(247,206,58,0.65)'
        }, {
            x: 786240000000,
            low: 0.111,
            high: 0.372,
            name: '1990 Dec',
            color: 'rgba(247,195,47,0.65)'
        }, {
            x: 788918400000,
            low: 0.277,
            high: 0.564,
            name: '1990 Jan',
            color: 'rgba(248,221,88,0.65)'
        }, {
            x: 791596800000,
            low: 0.479,
            high: 0.71,
            name: '1990 Feb',
            color: 'rgba(251,247,146,0.65)'
        }, {
            x: 794016000000,
            low: 0.192,
            high: 0.454,
            name: '1990 Mar',
            color: 'rgba(247,209,63,0.65)'
        }, {
            x: 796694400000,
            low: 0.15,
            high: 0.416,
            name: '1990 Apr',
            color: 'rgba(247,201,53,0.65)'
        }, {
            x: 799286400000,
            low: 0.06,
            high: 0.365,
            name: '1990 May',
            color: 'rgba(248,188,40,0.65)'
        }, {
            x: 801964800000,
            low: 0.167,
            high: 0.452,
            name: '1990 Jun',
            color: 'rgba(247,206,58,0.65)'
        }, {
            x: 804556800000,
            low: 0.143,
            high: 0.508,
            name: '1990 Jul',
            color: 'rgba(247,210,65,0.65)'
        }, {
            x: 807235200000,
            low: 0.134,
            high: 0.575,
            name: '1990 Aug',
            color: 'rgba(247,213,71,0.65)'
        }, {
            x: 809913600000,
            low: 0.057,
            high: 0.449,
            name: '1990 Sep',
            color: 'rgba(247,196,48,0.65)'
        }, {
            x: 812505600000,
            low: 0.181,
            high: 0.476,
            name: '1990 Oct',
            color: 'rgba(247,210,66,0.65)'
        }, {
            x: 815184000000,
            low: 0.204,
            high: 0.437,
            name: '1990 Nov',
            color: 'rgba(247,208,61,0.65)'
        }, {
            x: 817776000000,
            low: -0.003,
            high: 0.252,
            name: '1990 Dec',
            color: 'rgba(250,163,15,0.65)'
        }, {
            x: 820454400000,
            low: -0.03,
            high: 0.257,
            name: '1990 Jan',
            color: 'rgba(250,159,11,0.65)'
        }, {
            x: 823132800000,
            low: 0.204,
            high: 0.437,
            name: '1990 Feb',
            color: 'rgba(247,209,62,0.65)'
        }, {
            x: 825638400000,
            low: 0.049,
            high: 0.316,
            name: '1990 Mar',
            color: 'rgba(248,182,34,0.65)'
        }, {
            x: 828316800000,
            low: -0.009,
            high: 0.265,
            name: '1990 Apr',
            color: 'rgba(250,164,16,0.65)'
        }, {
            x: 830908800000,
            low: 0.055,
            high: 0.369,
            name: '1990 May',
            color: 'rgba(248,188,40,0.65)'
        }, {
            x: 833587200000,
            low: 0.029,
            high: 0.309,
            name: '1990 Jun',
            color: 'rgba(249,177,29,0.65)'
        }, {
            x: 836179200000,
            low: 0.044,
            high: 0.392,
            name: '1990 Jul',
            color: 'rgba(248,189,41,0.65)'
        }, {
            x: 838857600000,
            low: -0.025,
            high: 0.433,
            name: '1990 Aug',
            color: 'rgba(248,185,37,0.65)'
        }, {
            x: 841536000000,
            low: -0.105,
            high: 0.303,
            name: '1990 Sep',
            color: 'rgba(250,154,6,0.65)'
        }, {
            x: 844128000000,
            low: -0.014,
            high: 0.281,
            name: '1990 Oct',
            color: 'rgba(249,167,19,0.65)'
        }, {
            x: 846806400000,
            low: 0.03,
            high: 0.265,
            name: '1990 Nov',
            color: 'rgba(249,173,25,0.65)'
        }, {
            x: 849398400000,
            low: 0.102,
            high: 0.361,
            name: '1990 Dec',
            color: 'rgba(248,193,45,0.65)'
        }, {
            x: 852076800000,
            low: 0.062,
            high: 0.352,
            name: '1990 Jan',
            color: 'rgba(248,186,38,0.65)'
        }, {
            x: 854755200000,
            low: 0.198,
            high: 0.433,
            name: '1990 Feb',
            color: 'rgba(247,208,60,0.65)'
        }, {
            x: 857174400000,
            low: 0.216,
            high: 0.474,
            name: '1990 Mar',
            color: 'rgba(247,212,70,0.65)'
        }, {
            x: 859852800000,
            low: 0.136,
            high: 0.411,
            name: '1990 Apr',
            color: 'rgba(247,200,52,0.65)'
        }, {
            x: 862444800000,
            low: 0.128,
            high: 0.438,
            name: '1990 May',
            color: 'rgba(247,202,54,0.65)'
        }, {
            x: 865123200000,
            low: 0.269,
            high: 0.535,
            name: '1990 Jun',
            color: 'rgba(248,218,83,0.65)'
        }, {
            x: 867715200000,
            low: 0.2,
            high: 0.53,
            name: '1990 Jul',
            color: 'rgba(247,215,76,0.65)'
        }, {
            x: 870393600000,
            low: 0.215,
            high: 0.661,
            name: '1990 Aug',
            color: 'rgba(248,222,92,0.65)'
        }, {
            x: 873072000000,
            low: 0.278,
            high: 0.674,
            name: '1990 Sep',
            color: 'rgba(249,228,106,0.65)'
        }, {
            x: 875664000000,
            low: 0.408,
            high: 0.699,
            name: '1990 Oct',
            color: 'rgba(250,241,133,0.65)'
        }, {
            x: 878342400000,
            low: 0.379,
            high: 0.617,
            name: '1990 Nov',
            color: 'rgba(249,232,115,0.65)'
        }, {
            x: 880934400000,
            low: 0.372,
            high: 0.634,
            name: '1990 Dec',
            color: 'rgba(249,233,117,0.65)'
        }, {
            x: 883612800000,
            low: 0.336,
            high: 0.632,
            name: '1990 Jan',
            color: 'rgba(249,231,111,0.65)'
        }, {
            x: 886291200000,
            low: 0.639,
            high: 0.882,
            name: '1990 Feb',
            color: 'rgba(251,254,162,0.65)'
        }, {
            x: 888710400000,
            low: 0.428,
            high: 0.689,
            name: '1990 Mar',
            color: 'rgba(250,242,135,0.65)'
        }, {
            x: 891388800000,
            low: 0.496,
            high: 0.772,
            name: '1990 Apr',
            color: 'rgba(251,250,153,0.65)'
        }, {
            x: 893980800000,
            low: 0.426,
            high: 0.716,
            name: '1990 May',
            color: 'rgba(250,243,139,0.65)'
        }, {
            x: 896659200000,
            low: 0.451,
            high: 0.729,
            name: '1990 Jun',
            color: 'rgba(251,246,144,0.65)'
        }, {
            x: 899251200000,
            low: 0.492,
            high: 0.845,
            name: '1990 Jul',
            color: 'rgba(251,251,156,0.65)'
        }, {
            x: 901929600000,
            low: 0.387,
            high: 0.818,
            name: '1990 Aug',
            color: 'rgba(251,247,148,0.65)'
        }, {
            x: 904608000000,
            low: 0.191,
            high: 0.594,
            name: '1990 Sep',
            color: 'rgba(248,217,80,0.65)'
        }, {
            x: 907200000000,
            low: 0.251,
            high: 0.557,
            name: '1990 Oct',
            color: 'rgba(248,219,84,0.65)'
        }, {
            x: 909878400000,
            low: 0.172,
            high: 0.417,
            name: '1990 Nov',
            color: 'rgba(247,203,55,0.65)'
        }, {
            x: 912470400000,
            low: 0.33,
            high: 0.608,
            name: '1990 Dec',
            color: 'rgba(249,228,105,0.65)'
        }, {
            x: 915148800000,
            low: 0.2,
            high: 0.491,
            name: '1990 Jan',
            color: 'rgba(247,212,70,0.65)'
        }, {
            x: 917827200000,
            low: 0.463,
            high: 0.703,
            name: '1990 Feb',
            color: 'rgba(251,245,143,0.65)'
        }, {
            x: 920246400000,
            low: 0.094,
            high: 0.357,
            name: '1990 Mar',
            color: 'rgba(248,191,43,0.65)'
        }, {
            x: 922924800000,
            low: 0.187,
            high: 0.463,
            name: '1990 Apr',
            color: 'rgba(247,210,65,0.65)'
        }, {
            x: 925516800000,
            low: 0.095,
            high: 0.387,
            name: '1990 May',
            color: 'rgba(247,195,47,0.65)'
        }, {
            x: 928195200000,
            low: 0.134,
            high: 0.412,
            name: '1990 Jun',
            color: 'rgba(247,200,52,0.65)'
        }, {
            x: 930787200000,
            low: 0.117,
            high: 0.461,
            name: '1990 Jul',
            color: 'rgba(247,202,54,0.65)'
        }, {
            x: 933465600000,
            low: 0,
            high: 0.446,
            name: '1990 Aug',
            color: 'rgba(248,190,42,0.65)'
        }, {
            x: 936144000000,
            low: 0.094,
            high: 0.505,
            name: '1990 Sep',
            color: 'rgba(247,203,55,0.65)'
        }, {
            x: 938736000000,
            low: 0.11,
            high: 0.401,
            name: '1990 Oct',
            color: 'rgba(247,196,48,0.65)'
        }, {
            x: 941414400000,
            low: 0.111,
            high: 0.361,
            name: '1990 Nov',
            color: 'rgba(248,193,45,0.65)'
        }, {
            x: 944006400000,
            low: 0.251,
            high: 0.509,
            name: '1990 Dec',
            color: 'rgba(247,216,78,0.65)'
        }, {
            x: 946684800000,
            low: 0.083,
            high: 0.37,
            name: '2000 Jan',
            color: 'rgba(248,191,43,0.65)'
        }, {
            x: 949363200000,
            low: 0.33,
            high: 0.572,
            name: '2000 Feb',
            color: 'rgba(248,226,101,0.65)'
        }, {
            x: 951868800000,
            low: 0.251,
            high: 0.509,
            name: '2000 Mar',
            color: 'rgba(247,215,77,0.65)'
        }, {
            x: 954547200000,
            low: 0.335,
            high: 0.623,
            name: '2000 Apr',
            color: 'rgba(249,230,109,0.65)'
        }, {
            x: 957139200000,
            low: 0.121,
            high: 0.435,
            name: '2000 May',
            color: 'rgba(247,201,53,0.65)'
        }, {
            x: 959817600000,
            low: 0.137,
            high: 0.41,
            name: '2000 Jun',
            color: 'rgba(247,200,52,0.65)'
        }, {
            x: 962409600000,
            low: 0.084,
            high: 0.44,
            name: '2000 Jul',
            color: 'rgba(247,197,49,0.65)'
        }, {
            x: 965088000000,
            low: 0.144,
            high: 0.576,
            name: '2000 Aug',
            color: 'rgba(247,213,73,0.65)'
        }, {
            x: 967766400000,
            low: 0.11,
            high: 0.509,
            name: '2000 Sep',
            color: 'rgba(247,205,57,0.65)'
        }, {
            x: 970358400000,
            low: 0.071,
            high: 0.376,
            name: '2000 Oct',
            color: 'rgba(248,190,42,0.65)'
        }, {
            x: 973036800000,
            low: 0.037,
            high: 0.289,
            name: '2000 Nov',
            color: 'rgba(249,177,29,0.65)'
        }, {
            x: 975628800000,
            low: 0.017,
            high: 0.28,
            name: '2000 Dec',
            color: 'rgba(249,174,26,0.65)'
        }, {
            x: 978307200000,
            low: 0.21,
            high: 0.518,
            name: '2000 Jan',
            color: 'rgba(247,214,75,0.65)'
        }, {
            x: 980985600000,
            low: 0.203,
            high: 0.443,
            name: '2000 Feb',
            color: 'rgba(247,209,63,0.65)'
        }, {
            x: 983404800000,
            low: 0.384,
            high: 0.643,
            name: '2000 Mar',
            color: 'rgba(249,235,121,0.65)'
        }, {
            x: 986083200000,
            low: 0.314,
            high: 0.593,
            name: '2000 Apr',
            color: 'rgba(248,226,100,0.65)'
        }, {
            x: 988675200000,
            low: 0.257,
            high: 0.567,
            name: '2000 May',
            color: 'rgba(248,220,87,0.65)'
        }, {
            x: 991353600000,
            low: 0.284,
            high: 0.575,
            name: '2000 Jun',
            color: 'rgba(248,221,90,0.65)'
        }, {
            x: 993945600000,
            low: 0.278,
            high: 0.648,
            name: '2000 Jul',
            color: 'rgba(249,228,104,0.65)'
        }, {
            x: 996624000000,
            low: 0.275,
            high: 0.725,
            name: '2000 Aug',
            color: 'rgba(249,233,116,0.65)'
        }, {
            x: 999302400000,
            low: 0.218,
            high: 0.624,
            name: '2000 Sep',
            color: 'rgba(248,221,88,0.65)'
        }, {
            x: 1001894400000,
            low: 0.265,
            high: 0.574,
            name: '2000 Oct',
            color: 'rgba(248,220,87,0.65)'
        }, {
            x: 1004572800000,
            low: 0.492,
            high: 0.732,
            name: '2000 Nov',
            color: 'rgba(251,248,150,0.65)'
        }, {
            x: 1007164800000,
            low: 0.234,
            high: 0.502,
            name: '2000 Dec',
            color: 'rgba(247,215,77,0.65)'
        }, {
            x: 1009843200000,
            low: 0.505,
            high: 0.82,
            name: '2000 Jan',
            color: 'rgba(251,251,155,0.65)'
        }, {
            x: 1012521600000,
            low: 0.583,
            high: 0.828,
            name: '2000 Feb',
            color: 'rgba(251,253,161,0.65)'
        }, {
            x: 1014940800000,
            low: 0.566,
            high: 0.831,
            name: '2000 Mar',
            color: 'rgba(251,253,160,0.65)'
        }, {
            x: 1017619200000,
            low: 0.32,
            high: 0.61,
            name: '2000 Apr',
            color: 'rgba(249,228,104,0.65)'
        }, {
            x: 1020211200000,
            low: 0.259,
            high: 0.587,
            name: '2000 May',
            color: 'rgba(248,221,90,0.65)'
        }, {
            x: 1022889600000,
            low: 0.329,
            high: 0.625,
            name: '2000 Jun',
            color: 'rgba(249,229,107,0.65)'
        }, {
            x: 1025481600000,
            low: 0.303,
            high: 0.671,
            name: '2000 Jul',
            color: 'rgba(249,231,112,0.65)'
        }, {
            x: 1028160000000,
            low: 0.223,
            high: 0.669,
            name: '2000 Aug',
            color: 'rgba(248,224,96,0.65)'
        }, {
            x: 1030838400000,
            low: 0.22,
            high: 0.625,
            name: '2000 Sep',
            color: 'rgba(248,221,89,0.65)'
        }, {
            x: 1033430400000,
            low: 0.261,
            high: 0.555,
            name: '2000 Oct',
            color: 'rgba(248,220,86,0.65)'
        }, {
            x: 1036108800000,
            low: 0.33,
            high: 0.572,
            name: '2000 Nov',
            color: 'rgba(248,224,97,0.65)'
        }, {
            x: 1038700800000,
            low: 0.195,
            high: 0.454,
            name: '2000 Dec',
            color: 'rgba(247,210,65,0.65)'
        }, {
            x: 1041379200000,
            low: 0.448,
            high: 0.745,
            name: '2000 Jan',
            color: 'rgba(251,247,146,0.65)'
        }, {
            x: 1044057600000,
            low: 0.33,
            high: 0.574,
            name: '2000 Feb',
            color: 'rgba(248,226,100,0.65)'
        }, {
            x: 1046476800000,
            low: 0.329,
            high: 0.589,
            name: '2000 Mar',
            color: 'rgba(249,227,102,0.65)'
        }, {
            x: 1049155200000,
            low: 0.293,
            high: 0.58,
            name: '2000 Apr',
            color: 'rgba(248,222,92,0.65)'
        }, {
            x: 1051747200000,
            low: 0.317,
            high: 0.635,
            name: '2000 May',
            color: 'rgba(249,229,108,0.65)'
        }, {
            x: 1054425600000,
            low: 0.316,
            high: 0.606,
            name: '2000 Jun',
            color: 'rgba(249,227,102,0.65)'
        }, {
            x: 1057017600000,
            low: 0.288,
            high: 0.665,
            name: '2000 Jul',
            color: 'rgba(249,229,108,0.65)'
        }, {
            x: 1059696000000,
            low: 0.324,
            high: 0.782,
            name: '2000 Aug',
            color: 'rgba(250,240,131,0.65)'
        }, {
            x: 1062374400000,
            low: 0.34,
            high: 0.748,
            name: '2000 Sep',
            color: 'rgba(250,238,127,0.65)'
        }, {
            x: 1064966400000,
            low: 0.465,
            high: 0.764,
            name: '2000 Oct',
            color: 'rgba(251,248,150,0.65)'
        }, {
            x: 1067644800000,
            low: 0.344,
            high: 0.58,
            name: '2000 Nov',
            color: 'rgba(249,227,102,0.65)'
        }, {
            x: 1070236800000,
            low: 0.462,
            high: 0.722,
            name: '2000 Dec',
            color: 'rgba(251,247,146,0.65)'
        }, {
            x: 1072915200000,
            low: 0.36,
            high: 0.65,
            name: '2000 Jan',
            color: 'rgba(249,233,117,0.65)'
        }, {
            x: 1075593600000,
            low: 0.491,
            high: 0.731,
            name: '2000 Feb',
            color: 'rgba(251,248,150,0.65)'
        }, {
            x: 1078099200000,
            low: 0.394,
            high: 0.655,
            name: '2000 Mar',
            color: 'rgba(250,236,123,0.65)'
        }, {
            x: 1080777600000,
            low: 0.338,
            high: 0.62,
            name: '2000 Apr',
            color: 'rgba(249,230,109,0.65)'
        }, {
            x: 1083369600000,
            low: 0.158,
            high: 0.469,
            name: '2000 May',
            color: 'rgba(247,207,59,0.65)'
        }, {
            x: 1086048000000,
            low: 0.18,
            high: 0.478,
            name: '2000 Jun',
            color: 'rgba(247,210,65,0.65)'
        }, {
            x: 1088640000000,
            low: 0.173,
            high: 0.543,
            name: '2000 Jul',
            color: 'rgba(247,213,73,0.65)'
        }, {
            x: 1091318400000,
            low: 0.177,
            high: 0.619,
            name: '2000 Aug',
            color: 'rgba(248,217,81,0.65)'
        }, {
            x: 1093996800000,
            low: 0.242,
            high: 0.646,
            name: '2000 Sep',
            color: 'rgba(248,224,95,0.65)'
        }, {
            x: 1096588800000,
            low: 0.319,
            high: 0.627,
            name: '2000 Oct',
            color: 'rgba(249,228,105,0.65)'
        }, {
            x: 1099267200000,
            low: 0.483,
            high: 0.719,
            name: '2000 Nov',
            color: 'rgba(251,247,147,0.65)'
        }, {
            x: 1101859200000,
            low: 0.226,
            high: 0.487,
            name: '2000 Dec',
            color: 'rgba(247,214,74,0.65)'
        }, {
            x: 1104537600000,
            low: 0.41,
            high: 0.693,
            name: '2000 Jan',
            color: 'rgba(250,240,131,0.65)'
        }, {
            x: 1107216000000,
            low: 0.277,
            high: 0.513,
            name: '2000 Feb',
            color: 'rgba(248,217,81,0.65)'
        }, {
            x: 1109635200000,
            low: 0.422,
            high: 0.696,
            name: '2000 Mar',
            color: 'rgba(250,242,136,0.65)'
        }, {
            x: 1112313600000,
            low: 0.456,
            high: 0.749,
            name: '2000 Apr',
            color: 'rgba(251,247,148,0.65)'
        }, {
            x: 1114905600000,
            low: 0.358,
            high: 0.678,
            name: '2000 May',
            color: 'rgba(249,236,121,0.65)'
        }, {
            x: 1117584000000,
            low: 0.404,
            high: 0.699,
            name: '2000 Jun',
            color: 'rgba(250,240,131,0.65)'
        }, {
            x: 1120176000000,
            low: 0.359,
            high: 0.737,
            name: '2000 Jul',
            color: 'rgba(250,240,131,0.65)'
        }, {
            x: 1122854400000,
            low: 0.314,
            high: 0.769,
            name: '2000 Aug',
            color: 'rgba(250,238,126,0.65)'
        }, {
            x: 1125532800000,
            low: 0.364,
            high: 0.774,
            name: '2000 Sep',
            color: 'rgba(250,243,139,0.65)'
        }, {
            x: 1128124800000,
            low: 0.456,
            high: 0.764,
            name: '2000 Oct',
            color: 'rgba(251,248,149,0.65)'
        }, {
            x: 1130803200000,
            low: 0.512,
            high: 0.748,
            name: '2000 Nov',
            color: 'rgba(251,249,152,0.65)'
        }, {
            x: 1133395200000,
            low: 0.336,
            high: 0.6,
            name: '2000 Dec',
            color: 'rgba(249,228,105,0.65)'
        }, {
            x: 1136073600000,
            low: 0.234,
            high: 0.54,
            name: '2000 Jan',
            color: 'rgba(247,216,78,0.65)'
        }, {
            x: 1138752000000,
            low: 0.439,
            high: 0.681,
            name: '2000 Feb',
            color: 'rgba(250,243,138,0.65)'
        }, {
            x: 1141171200000,
            low: 0.338,
            high: 0.588,
            name: '2000 Mar',
            color: 'rgba(249,227,103,0.65)'
        }, {
            x: 1143849600000,
            low: 0.262,
            high: 0.55,
            name: '2000 Apr',
            color: 'rgba(248,220,86,0.65)'
        }, {
            x: 1146441600000,
            low: 0.238,
            high: 0.564,
            name: '2000 May',
            color: 'rgba(248,218,83,0.65)'
        }, {
            x: 1149120000000,
            low: 0.374,
            high: 0.678,
            name: '2000 Jun',
            color: 'rgba(250,236,123,0.65)'
        }, {
            x: 1151712000000,
            low: 0.304,
            high: 0.67,
            name: '2000 Jul',
            color: 'rgba(249,232,113,0.65)'
        }, {
            x: 1154390400000,
            low: 0.31,
            high: 0.754,
            name: '2000 Aug',
            color: 'rgba(250,237,124,0.65)'
        }, {
            x: 1157068800000,
            low: 0.298,
            high: 0.703,
            name: '2000 Sep',
            color: 'rgba(249,233,116,0.65)'
        }, {
            x: 1159660800000,
            low: 0.421,
            high: 0.708,
            name: '2000 Oct',
            color: 'rgba(250,243,138,0.65)'
        }, {
            x: 1162339200000,
            low: 0.421,
            high: 0.664,
            name: '2000 Nov',
            color: 'rgba(250,238,127,0.65)'
        }, {
            x: 1164931200000,
            low: 0.571,
            high: 0.827,
            name: '2000 Dec',
            color: 'rgba(251,253,160,0.65)'
        }, {
            x: 1167609600000,
            low: 0.689,
            high: 0.977,
            name: '2000 Jan',
            color: 'rgba(252,255,164,0.65)'
        }, {
            x: 1170288000000,
            low: 0.442,
            high: 0.678,
            name: '2000 Feb',
            color: 'rgba(250,242,136,0.65)'
        }, {
            x: 1172707200000,
            low: 0.399,
            high: 0.648,
            name: '2000 Mar',
            color: 'rgba(250,236,122,0.65)'
        }, {
            x: 1175385600000,
            low: 0.441,
            high: 0.716,
            name: '2000 Apr',
            color: 'rgba(250,244,141,0.65)'
        }, {
            x: 1177977600000,
            low: 0.292,
            high: 0.602,
            name: '2000 May',
            color: 'rgba(248,224,97,0.65)'
        }, {
            x: 1180656000000,
            low: 0.273,
            high: 0.565,
            name: '2000 Jun',
            color: 'rgba(248,221,88,0.65)'
        }, {
            x: 1183248000000,
            low: 0.26,
            high: 0.623,
            name: '2000 Jul',
            color: 'rgba(248,223,94,0.65)'
        }, {
            x: 1185926400000,
            low: 0.221,
            high: 0.665,
            name: '2000 Aug',
            color: 'rgba(248,224,96,0.65)'
        }, {
            x: 1188604800000,
            low: 0.265,
            high: 0.657,
            name: '2000 Sep',
            color: 'rgba(249,227,102,0.65)'
        }, {
            x: 1191196800000,
            low: 0.331,
            high: 0.634,
            name: '2000 Oct',
            color: 'rgba(249,230,110,0.65)'
        }, {
            x: 1193875200000,
            low: 0.274,
            high: 0.502,
            name: '2000 Nov',
            color: 'rgba(247,217,79,0.65)'
        }, {
            x: 1196467200000,
            low: 0.223,
            high: 0.472,
            name: '2000 Dec',
            color: 'rgba(247,213,71,0.65)'
        }, {
            x: 1199145600000,
            low: 0.024,
            high: 0.317,
            name: '2000 Jan',
            color: 'rgba(249,178,30,0.65)'
        }, {
            x: 1201824000000,
            low: 0.122,
            high: 0.364,
            name: '2000 Feb',
            color: 'rgba(247,195,47,0.65)'
        }, {
            x: 1204329600000,
            low: 0.423,
            high: 0.674,
            name: '2000 Mar',
            color: 'rgba(250,240,131,0.65)'
        }, {
            x: 1207008000000,
            low: 0.195,
            high: 0.462,
            name: '2000 Apr',
            color: 'rgba(247,211,67,0.65)'
        }, {
            x: 1209600000000,
            low: 0.181,
            high: 0.497,
            name: '2000 May',
            color: 'rgba(247,211,68,0.65)'
        }, {
            x: 1212278400000,
            low: 0.216,
            high: 0.51,
            name: '2000 Jun',
            color: 'rgba(247,214,74,0.65)'
        }, {
            x: 1214870400000,
            low: 0.27,
            high: 0.635,
            name: '2000 Jul',
            color: 'rgba(248,225,98,0.65)'
        }, {
            x: 1217548800000,
            low: 0.211,
            high: 0.655,
            name: '2000 Aug',
            color: 'rgba(248,222,91,0.65)'
        }, {
            x: 1220227200000,
            low: 0.211,
            high: 0.605,
            name: '2000 Sep',
            color: 'rgba(248,219,85,0.65)'
        }, {
            x: 1222819200000,
            low: 0.406,
            high: 0.693,
            name: '2000 Oct',
            color: 'rgba(250,239,129,0.65)'
        }, {
            x: 1225497600000,
            low: 0.411,
            high: 0.64,
            name: '2000 Nov',
            color: 'rgba(250,236,122,0.65)'
        }, {
            x: 1228089600000,
            low: 0.262,
            high: 0.515,
            name: '2000 Dec',
            color: 'rgba(248,217,80,0.65)'
        }, {
            x: 1230768000000,
            low: 0.334,
            high: 0.63,
            name: '2000 Jan',
            color: 'rgba(249,230,110,0.65)'
        }, {
            x: 1233446400000,
            low: 0.318,
            high: 0.562,
            name: '2000 Feb',
            color: 'rgba(248,223,94,0.65)'
        }, {
            x: 1235865600000,
            low: 0.27,
            high: 0.538,
            name: '2000 Mar',
            color: 'rgba(248,219,85,0.65)'
        }, {
            x: 1238544000000,
            low: 0.376,
            high: 0.653,
            name: '2000 Apr',
            color: 'rgba(249,235,121,0.65)'
        }, {
            x: 1241136000000,
            low: 0.282,
            high: 0.599,
            name: '2000 May',
            color: 'rgba(248,223,94,0.65)'
        }, {
            x: 1243814400000,
            low: 0.408,
            high: 0.7,
            name: '2000 Jun',
            color: 'rgba(250,241,133,0.65)'
        }, {
            x: 1246406400000,
            low: 0.351,
            high: 0.725,
            name: '2000 Jul',
            color: 'rgba(250,238,126,0.65)'
        }, {
            x: 1249084800000,
            low: 0.368,
            high: 0.811,
            name: '2000 Aug',
            color: 'rgba(251,245,143,0.65)'
        }, {
            x: 1251763200000,
            low: 0.365,
            high: 0.765,
            name: '2000 Sep',
            color: 'rgba(250,243,139,0.65)'
        }, {
            x: 1254355200000,
            low: 0.375,
            high: 0.661,
            name: '2000 Oct',
            color: 'rgba(249,235,121,0.65)'
        }, {
            x: 1257033600000,
            low: 0.434,
            high: 0.659,
            name: '2000 Nov',
            color: 'rgba(250,239,128,0.65)'
        }, {
            x: 1259625600000,
            low: 0.345,
            high: 0.599,
            name: '2000 Dec',
            color: 'rgba(249,228,106,0.65)'
        }, {
            x: 1262304000000,
            low: 0.412,
            high: 0.712,
            name: '2010 Jan',
            color: 'rgba(250,243,137,0.65)'
        }, {
            x: 1264982400000,
            low: 0.448,
            high: 0.706,
            name: '2010 Feb',
            color: 'rgba(250,244,141,0.65)'
        }, {
            x: 1267401600000,
            low: 0.546,
            high: 0.808,
            name: '2010 Mar',
            color: 'rgba(251,251,157,0.65)'
        }, {
            x: 1270080000000,
            low: 0.534,
            high: 0.823,
            name: '2010 Apr',
            color: 'rgba(251,251,157,0.65)'
        }, {
            x: 1272672000000,
            low: 0.432,
            high: 0.75,
            name: '2010 May',
            color: 'rgba(251,246,144,0.65)'
        }, {
            x: 1275350400000,
            low: 0.438,
            high: 0.738,
            name: '2010 Jun',
            color: 'rgba(250,245,142,0.65)'
        }, {
            x: 1277942400000,
            low: 0.435,
            high: 0.803,
            name: '2010 Jul',
            color: 'rgba(251,249,151,0.65)'
        }, {
            x: 1280620800000,
            low: 0.32,
            high: 0.767,
            name: '2010 Aug',
            color: 'rgba(250,239,128,0.65)'
        }, {
            x: 1283299200000,
            low: 0.241,
            high: 0.645,
            name: '2010 Sep',
            color: 'rgba(248,224,95,0.65)'
        }, {
            x: 1285891200000,
            low: 0.351,
            high: 0.645,
            name: '2010 Oct',
            color: 'rgba(249,232,114,0.65)'
        }, {
            x: 1288569600000,
            low: 0.478,
            high: 0.706,
            name: '2010 Nov',
            color: 'rgba(251,246,145,0.65)'
        }, {
            x: 1291161600000,
            low: 0.214,
            high: 0.467,
            name: '2010 Dec',
            color: 'rgba(247,212,69,0.65)'
        }, {
            x: 1293840000000,
            low: 0.169,
            high: 0.458,
            name: '2010 Jan',
            color: 'rgba(247,207,59,0.65)'
        }, {
            x: 1296518400000,
            low: 0.209,
            high: 0.447,
            name: '2010 Feb',
            color: 'rgba(247,210,65,0.65)'
        }, {
            x: 1298937600000,
            low: 0.295,
            high: 0.553,
            name: '2010 Mar',
            color: 'rgba(248,221,90,0.65)'
        }, {
            x: 1301616000000,
            low: 0.344,
            high: 0.613,
            name: '2010 Apr',
            color: 'rgba(249,230,109,0.65)'
        }, {
            x: 1304208000000,
            low: 0.222,
            high: 0.546,
            name: '2010 May',
            color: 'rgba(247,216,78,0.65)'
        }, {
            x: 1306886400000,
            low: 0.337,
            high: 0.639,
            name: '2010 Jun',
            color: 'rgba(249,232,114,0.65)'
        }, {
            x: 1309478400000,
            low: 0.321,
            high: 0.701,
            name: '2010 Jul',
            color: 'rgba(249,234,119,0.65)'
        }, {
            x: 1312156800000,
            low: 0.264,
            high: 0.715,
            name: '2010 Aug',
            color: 'rgba(249,232,113,0.65)'
        }, {
            x: 1314835200000,
            low: 0.259,
            high: 0.655,
            name: '2010 Sep',
            color: 'rgba(248,226,100,0.65)'
        }, {
            x: 1317427200000,
            low: 0.318,
            high: 0.595,
            name: '2010 Oct',
            color: 'rgba(248,226,100,0.65)'
        }, {
            x: 1320105600000,
            low: 0.235,
            high: 0.459,
            name: '2010 Nov',
            color: 'rgba(247,212,70,0.65)'
        }, {
            x: 1322697600000,
            low: 0.272,
            high: 0.53,
            name: '2010 Dec',
            color: 'rgba(248,218,83,0.65)'
        }, {
            x: 1325376000000,
            low: 0.158,
            high: 0.455,
            name: '2010 Jan',
            color: 'rgba(247,204,56,0.65)'
        }, {
            x: 1328054400000,
            low: 0.183,
            high: 0.424,
            name: '2010 Feb',
            color: 'rgba(247,204,56,0.65)'
        }, {
            x: 1330560000000,
            low: 0.229,
            high: 0.483,
            name: '2010 Mar',
            color: 'rgba(247,213,73,0.65)'
        }, {
            x: 1333238400000,
            low: 0.433,
            high: 0.715,
            name: '2010 Apr',
            color: 'rgba(250,244,140,0.65)'
        }, {
            x: 1335830400000,
            low: 0.411,
            high: 0.735,
            name: '2010 May',
            color: 'rgba(250,244,140,0.65)'
        }, {
            x: 1338508800000,
            low: 0.409,
            high: 0.706,
            name: '2010 Jun',
            color: 'rgba(250,241,134,0.65)'
        }, {
            x: 1341100800000,
            low: 0.322,
            high: 0.695,
            name: '2010 Jul',
            color: 'rgba(249,234,119,0.65)'
        }, {
            x: 1343779200000,
            low: 0.308,
            high: 0.763,
            name: '2010 Aug',
            color: 'rgba(250,237,125,0.65)'
        }, {
            x: 1346457600000,
            low: 0.353,
            high: 0.754,
            name: '2010 Sep',
            color: 'rgba(250,240,132,0.65)'
        }, {
            x: 1349049600000,
            low: 0.411,
            high: 0.704,
            name: '2010 Oct',
            color: 'rgba(250,241,134,0.65)'
        }, {
            x: 1351728000000,
            low: 0.438,
            high: 0.67,
            name: '2010 Nov',
            color: 'rgba(250,241,133,0.65)'
        }, {
            x: 1354320000000,
            low: 0.139,
            high: 0.408,
            name: '2010 Dec',
            color: 'rgba(247,200,52,0.65)'
        }, {
            x: 1356998400000,
            low: 0.301,
            high: 0.599,
            name: '2010 Jan',
            color: 'rgba(248,225,98,0.65)'
        }, {
            x: 1359676800000,
            low: 0.355,
            high: 0.614,
            name: '2010 Feb',
            color: 'rgba(249,231,111,0.65)'
        }, {
            x: 1362096000000,
            low: 0.27,
            high: 0.527,
            name: '2010 Mar',
            color: 'rgba(248,218,83,0.65)'
        }, {
            x: 1364774400000,
            low: 0.295,
            high: 0.581,
            name: '2010 Apr',
            color: 'rgba(248,223,93,0.65)'
        }, {
            x: 1367366400000,
            low: 0.363,
            high: 0.68,
            name: '2010 May',
            color: 'rgba(249,236,121,0.65)'
        }, {
            x: 1370044800000,
            low: 0.336,
            high: 0.638,
            name: '2010 Jun',
            color: 'rgba(249,231,112,0.65)'
        }, {
            x: 1372636800000,
            low: 0.328,
            high: 0.698,
            name: '2010 Jul',
            color: 'rgba(249,234,119,0.65)'
        }, {
            x: 1375315200000,
            low: 0.307,
            high: 0.76,
            name: '2010 Aug',
            color: 'rgba(250,237,124,0.65)'
        }, {
            x: 1377993600000,
            low: 0.341,
            high: 0.731,
            name: '2010 Sep',
            color: 'rgba(250,237,125,0.65)'
        }, {
            x: 1380585600000,
            low: 0.359,
            high: 0.635,
            name: '2010 Oct',
            color: 'rgba(249,232,115,0.65)'
        }, {
            x: 1383264000000,
            low: 0.519,
            high: 0.759,
            name: '2010 Nov',
            color: 'rgba(251,250,153,0.65)'
        }, {
            x: 1385856000000,
            low: 0.373,
            high: 0.641,
            name: '2010 Dec',
            color: 'rgba(249,234,118,0.65)'
        }, {
            x: 1388534400000,
            low: 0.368,
            high: 0.679,
            name: '2010 Jan',
            color: 'rgba(249,236,121,0.65)'
        }, {
            x: 1391212800000,
            low: 0.184,
            high: 0.441,
            name: '2010 Feb',
            color: 'rgba(247,207,59,0.65)'
        }, {
            x: 1393632000000,
            low: 0.417,
            high: 0.703,
            name: '2010 Mar',
            color: 'rgba(250,243,137,0.65)'
        }, {
            x: 1396310400000,
            low: 0.513,
            high: 0.798,
            name: '2010 Apr',
            color: 'rgba(251,250,154,0.65)'
        }, {
            x: 1398902400000,
            low: 0.44,
            high: 0.756,
            name: '2010 May',
            color: 'rgba(251,247,147,0.65)'
        }, {
            x: 1401580800000,
            low: 0.471,
            high: 0.766,
            name: '2010 Jun',
            color: 'rgba(251,249,151,0.65)'
        }, {
            x: 1404172800000,
            low: 0.35,
            high: 0.731,
            name: '2010 Jul',
            color: 'rgba(250,238,127,0.65)'
        }, {
            x: 1406851200000,
            low: 0.446,
            high: 0.886,
            name: '2010 Aug',
            color: 'rgba(251,251,156,0.65)'
        }, {
            x: 1409529600000,
            low: 0.402,
            high: 0.778,
            name: '2010 Sep',
            color: 'rgba(251,245,143,0.65)'
        }, {
            x: 1412121600000,
            low: 0.491,
            high: 0.766,
            name: '2010 Oct',
            color: 'rgba(251,249,152,0.65)'
        }, {
            x: 1414800000000,
            low: 0.37,
            high: 0.612,
            name: '2010 Nov',
            color: 'rgba(249,232,114,0.65)'
        }, {
            x: 1417392000000,
            low: 0.493,
            high: 0.773,
            name: '2010 Dec',
            color: 'rgba(251,249,152,0.65)'
        }, {
            x: 1420070400000,
            low: 0.539,
            high: 0.837,
            name: '2010 Jan',
            color: 'rgba(251,252,158,0.65)'
        }, {
            x: 1422748800000,
            low: 0.525,
            high: 0.796,
            name: '2010 Feb',
            color: 'rgba(251,251,155,0.65)'
        }, {
            x: 1425168000000,
            low: 0.536,
            high: 0.82,
            name: '2010 Mar',
            color: 'rgba(251,252,158,0.65)'
        }, {
            x: 1427846400000,
            low: 0.512,
            high: 0.797,
            name: '2010 Apr',
            color: 'rgba(251,250,154,0.65)'
        }, {
            x: 1430438400000,
            low: 0.537,
            high: 0.856,
            name: '2010 May',
            color: 'rgba(251,252,159,0.65)'
        }, {
            x: 1433116800000,
            low: 0.584,
            high: 0.877,
            name: '2010 Jun',
            color: 'rgba(251,253,161,0.65)'
        }, {
            x: 1435708800000,
            low: 0.507,
            high: 0.884,
            name: '2010 Jul',
            color: 'rgba(251,252,159,0.65)'
        }, {
            x: 1438387200000,
            low: 0.506,
            high: 0.958,
            name: '2010 Aug',
            color: 'rgba(251,254,162,0.65)'
        }, {
            x: 1441065600000,
            low: 0.594,
            high: 0.976,
            name: '2010 Sep',
            color: 'rgba(251,254,163,0.65)'
        }, {
            x: 1443657600000,
            low: 0.685,
            high: 0.959,
            name: '2010 Oct',
            color: 'rgba(252,255,164,0.65)'
        }, {
            x: 1446336000000,
            low: 0.692,
            high: 0.932,
            name: '2010 Nov',
            color: 'rgba(251,254,163,0.65)'
        }, {
            x: 1448928000000,
            low: 0.877,
            high: 1.139,
            name: '2010 Dec',
            color: 'rgba(252,255,164,0.65)'
        }],
        name: 'Global Temperature',
        type: 'columnrange'
    }]
});
