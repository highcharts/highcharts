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
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        reversed: true,
        tickPositions: false,
        labels: {
            format: '{value}',
            useHTML: true
        }
    },
    credits: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    plotOptions: {
        series: {
            turboThreshold: 0,
            boderWidth: 0,
            dataLabels: {
                enabled: false
            }
        }
    },
    chart: {
        type: 'heatmap'
    },
    series: [{
        data: [{
            x: 0,
            y: 0,
            value: -0.702,
            name: '1850 ~ Jan'
        }, {
            x: 0,
            y: 1,
            value: -0.284,
            name: '1850 ~ Feb'
        }, {
            x: 0,
            y: 2,
            value: -0.732,
            name: '1850 ~ Mar'
        }, {
            x: 0,
            y: 3,
            value: -0.57,
            name: '1850 ~ Apr'
        }, {
            x: 0,
            y: 4,
            value: -0.325,
            name: '1850 ~ May'
        }, {
            x: 0,
            y: 5,
            value: -0.213,
            name: '1850 ~ Jun'
        }, {
            x: 0,
            y: 6,
            value: -0.128,
            name: '1850 ~ Jul'
        }, {
            x: 0,
            y: 7,
            value: -0.233,
            name: '1850 ~ Aug'
        }, {
            x: 0,
            y: 8,
            value: -0.444,
            name: '1850 ~ Sep'
        }, {
            x: 0,
            y: 9,
            value: -0.452,
            name: '1850 ~ Oct'
        }, {
            x: 0,
            y: 10,
            value: -0.19,
            name: '1850 ~ Nov'
        }, {
            x: 0,
            y: 11,
            value: -0.268,
            name: '1850 ~ Dec'
        }, {
            x: 1,
            y: 0,
            value: -0.303,
            name: '1851 ~ Jan'
        }, {
            x: 1,
            y: 1,
            value: -0.362,
            name: '1851 ~ Feb'
        }, {
            x: 1,
            y: 2,
            value: -0.485,
            name: '1851 ~ Mar'
        }, {
            x: 1,
            y: 3,
            value: -0.445,
            name: '1851 ~ Apr'
        }, {
            x: 1,
            y: 4,
            value: -0.302,
            name: '1851 ~ May'
        }, {
            x: 1,
            y: 5,
            value: -0.189,
            name: '1851 ~ Jun'
        }, {
            x: 1,
            y: 6,
            value: -0.215,
            name: '1851 ~ Jul'
        }, {
            x: 1,
            y: 7,
            value: -0.153,
            name: '1851 ~ Aug'
        }, {
            x: 1,
            y: 8,
            value: -0.108,
            name: '1851 ~ Sep'
        }, {
            x: 1,
            y: 9,
            value: -0.063,
            name: '1851 ~ Oct'
        }, {
            x: 1,
            y: 10,
            value: -0.03,
            name: '1851 ~ Nov'
        }, {
            x: 1,
            y: 11,
            value: -0.067,
            name: '1851 ~ Dec'
        }, {
            x: 2,
            y: 0,
            value: -0.308,
            name: '1852 ~ Jan'
        }, {
            x: 2,
            y: 1,
            value: -0.477,
            name: '1852 ~ Feb'
        }, {
            x: 2,
            y: 2,
            value: -0.505,
            name: '1852 ~ Mar'
        }, {
            x: 2,
            y: 3,
            value: -0.559,
            name: '1852 ~ Apr'
        }, {
            x: 2,
            y: 4,
            value: -0.209,
            name: '1852 ~ May'
        }, {
            x: 2,
            y: 5,
            value: -0.038,
            name: '1852 ~ Jun'
        }, {
            x: 2,
            y: 6,
            value: -0.016,
            name: '1852 ~ Jul'
        }, {
            x: 2,
            y: 7,
            value: -0.195,
            name: '1852 ~ Aug'
        }, {
            x: 2,
            y: 8,
            value: -0.125,
            name: '1852 ~ Sep'
        }, {
            x: 2,
            y: 9,
            value: -0.216,
            name: '1852 ~ Oct'
        }, {
            x: 2,
            y: 10,
            value: -0.187,
            name: '1852 ~ Nov'
        }, {
            x: 2,
            y: 11,
            value: 0.083,
            name: '1852 ~ Dec'
        }, {
            x: 3,
            y: 0,
            value: -0.177,
            name: '1853 ~ Jan'
        }, {
            x: 3,
            y: 1,
            value: -0.33,
            name: '1853 ~ Feb'
        }, {
            x: 3,
            y: 2,
            value: -0.318,
            name: '1853 ~ Mar'
        }, {
            x: 3,
            y: 3,
            value: -0.352,
            name: '1853 ~ Apr'
        }, {
            x: 3,
            y: 4,
            value: -0.268,
            name: '1853 ~ May'
        }, {
            x: 3,
            y: 5,
            value: -0.179,
            name: '1853 ~ Jun'
        }, {
            x: 3,
            y: 6,
            value: -0.059,
            name: '1853 ~ Jul'
        }, {
            x: 3,
            y: 7,
            value: -0.148,
            name: '1853 ~ Aug'
        }, {
            x: 3,
            y: 8,
            value: -0.409,
            name: '1853 ~ Sep'
        }, {
            x: 3,
            y: 9,
            value: -0.359,
            name: '1853 ~ Oct'
        }, {
            x: 3,
            y: 10,
            value: -0.256,
            name: '1853 ~ Nov'
        }, {
            x: 3,
            y: 11,
            value: -0.444,
            name: '1853 ~ Dec'
        }, {
            x: 4,
            y: 0,
            value: -0.36,
            name: '1854 ~ Jan'
        }, {
            x: 4,
            y: 1,
            value: -0.28,
            name: '1854 ~ Feb'
        }, {
            x: 4,
            y: 2,
            value: -0.284,
            name: '1854 ~ Mar'
        }, {
            x: 4,
            y: 3,
            value: -0.349,
            name: '1854 ~ Apr'
        }, {
            x: 4,
            y: 4,
            value: -0.23,
            name: '1854 ~ May'
        }, {
            x: 4,
            y: 5,
            value: -0.215,
            name: '1854 ~ Jun'
        }, {
            x: 4,
            y: 6,
            value: -0.228,
            name: '1854 ~ Jul'
        }, {
            x: 4,
            y: 7,
            value: -0.163,
            name: '1854 ~ Aug'
        }, {
            x: 4,
            y: 8,
            value: -0.115,
            name: '1854 ~ Sep'
        }, {
            x: 4,
            y: 9,
            value: -0.188,
            name: '1854 ~ Oct'
        }, {
            x: 4,
            y: 10,
            value: -0.369,
            name: '1854 ~ Nov'
        }, {
            x: 4,
            y: 11,
            value: -0.232,
            name: '1854 ~ Dec'
        }, {
            x: 5,
            y: 0,
            value: -0.176,
            name: '1855 ~ Jan'
        }, {
            x: 5,
            y: 1,
            value: -0.4,
            name: '1855 ~ Feb'
        }, {
            x: 5,
            y: 2,
            value: -0.303,
            name: '1855 ~ Mar'
        }, {
            x: 5,
            y: 3,
            value: -0.217,
            name: '1855 ~ Apr'
        }, {
            x: 5,
            y: 4,
            value: -0.336,
            name: '1855 ~ May'
        }, {
            x: 5,
            y: 5,
            value: -0.16,
            name: '1855 ~ Jun'
        }, {
            x: 5,
            y: 6,
            value: -0.268,
            name: '1855 ~ Jul'
        }, {
            x: 5,
            y: 7,
            value: -0.159,
            name: '1855 ~ Aug'
        }, {
            x: 5,
            y: 8,
            value: -0.339,
            name: '1855 ~ Sep'
        }, {
            x: 5,
            y: 9,
            value: -0.211,
            name: '1855 ~ Oct'
        }, {
            x: 5,
            y: 10,
            value: -0.212,
            name: '1855 ~ Nov'
        }, {
            x: 5,
            y: 11,
            value: -0.51,
            name: '1855 ~ Dec'
        }, {
            x: 6,
            y: 0,
            value: -0.119,
            name: '1856 ~ Jan'
        }, {
            x: 6,
            y: 1,
            value: -0.373,
            name: '1856 ~ Feb'
        }, {
            x: 6,
            y: 2,
            value: -0.513,
            name: '1856 ~ Mar'
        }, {
            x: 6,
            y: 3,
            value: -0.371,
            name: '1856 ~ Apr'
        }, {
            x: 6,
            y: 4,
            value: -0.119,
            name: '1856 ~ May'
        }, {
            x: 6,
            y: 5,
            value: -0.288,
            name: '1856 ~ Jun'
        }, {
            x: 6,
            y: 6,
            value: -0.297,
            name: '1856 ~ Jul'
        }, {
            x: 6,
            y: 7,
            value: -0.305,
            name: '1856 ~ Aug'
        }, {
            x: 6,
            y: 8,
            value: -0.459,
            name: '1856 ~ Sep'
        }, {
            x: 6,
            y: 9,
            value: -0.384,
            name: '1856 ~ Oct'
        }, {
            x: 6,
            y: 10,
            value: -0.608,
            name: '1856 ~ Nov'
        }, {
            x: 6,
            y: 11,
            value: -0.44,
            name: '1856 ~ Dec'
        }, {
            x: 7,
            y: 0,
            value: -0.512,
            name: '1857 ~ Jan'
        }, {
            x: 7,
            y: 1,
            value: -0.344,
            name: '1857 ~ Feb'
        }, {
            x: 7,
            y: 2,
            value: -0.434,
            name: '1857 ~ Mar'
        }, {
            x: 7,
            y: 3,
            value: -0.646,
            name: '1857 ~ Apr'
        }, {
            x: 7,
            y: 4,
            value: -0.567,
            name: '1857 ~ May'
        }, {
            x: 7,
            y: 5,
            value: -0.31,
            name: '1857 ~ Jun'
        }, {
            x: 7,
            y: 6,
            value: -0.544,
            name: '1857 ~ Jul'
        }, {
            x: 7,
            y: 7,
            value: -0.327,
            name: '1857 ~ Aug'
        }, {
            x: 7,
            y: 8,
            value: -0.393,
            name: '1857 ~ Sep'
        }, {
            x: 7,
            y: 9,
            value: -0.467,
            name: '1857 ~ Oct'
        }, {
            x: 7,
            y: 10,
            value: -0.665,
            name: '1857 ~ Nov'
        }, {
            x: 7,
            y: 11,
            value: -0.356,
            name: '1857 ~ Dec'
        }, {
            x: 8,
            y: 0,
            value: -0.532,
            name: '1858 ~ Jan'
        }, {
            x: 8,
            y: 1,
            value: -0.707,
            name: '1858 ~ Feb'
        }, {
            x: 8,
            y: 2,
            value: -0.55,
            name: '1858 ~ Mar'
        }, {
            x: 8,
            y: 3,
            value: -0.517,
            name: '1858 ~ Apr'
        }, {
            x: 8,
            y: 4,
            value: -0.651,
            name: '1858 ~ May'
        }, {
            x: 8,
            y: 5,
            value: -0.58,
            name: '1858 ~ Jun'
        }, {
            x: 8,
            y: 6,
            value: -0.324,
            name: '1858 ~ Jul'
        }, {
            x: 8,
            y: 7,
            value: -0.28,
            name: '1858 ~ Aug'
        }, {
            x: 8,
            y: 8,
            value: -0.339,
            name: '1858 ~ Sep'
        }, {
            x: 8,
            y: 9,
            value: -0.2,
            name: '1858 ~ Oct'
        }, {
            x: 8,
            y: 10,
            value: -0.644,
            name: '1858 ~ Nov'
        }, {
            x: 8,
            y: 11,
            value: -0.3,
            name: '1858 ~ Dec'
        }, {
            x: 9,
            y: 0,
            value: -0.307,
            name: '1859 ~ Jan'
        }, {
            x: 9,
            y: 1,
            value: -0.192,
            name: '1859 ~ Feb'
        }, {
            x: 9,
            y: 2,
            value: -0.334,
            name: '1859 ~ Mar'
        }, {
            x: 9,
            y: 3,
            value: -0.203,
            name: '1859 ~ Apr'
        }, {
            x: 9,
            y: 4,
            value: -0.31,
            name: '1859 ~ May'
        }, {
            x: 9,
            y: 5,
            value: -0.25,
            name: '1859 ~ Jun'
        }, {
            x: 9,
            y: 6,
            value: -0.285,
            name: '1859 ~ Jul'
        }, {
            x: 9,
            y: 7,
            value: -0.104,
            name: '1859 ~ Aug'
        }, {
            x: 9,
            y: 8,
            value: -0.575,
            name: '1859 ~ Sep'
        }, {
            x: 9,
            y: 9,
            value: -0.255,
            name: '1859 ~ Oct'
        }, {
            x: 9,
            y: 10,
            value: -0.316,
            name: '1859 ~ Nov'
        }, {
            x: 9,
            y: 11,
            value: -0.363,
            name: '1859 ~ Dec'
        }, {
            x: 10,
            y: 0,
            value: -0.186,
            name: '1860 ~ Jan'
        }, {
            x: 10,
            y: 1,
            value: -0.428,
            name: '1860 ~ Feb'
        }, {
            x: 10,
            y: 2,
            value: -0.643,
            name: '1860 ~ Mar'
        }, {
            x: 10,
            y: 3,
            value: -0.335,
            name: '1860 ~ Apr'
        }, {
            x: 10,
            y: 4,
            value: -0.29,
            name: '1860 ~ May'
        }, {
            x: 10,
            y: 5,
            value: -0.307,
            name: '1860 ~ Jun'
        }, {
            x: 10,
            y: 6,
            value: -0.116,
            name: '1860 ~ Jul'
        }, {
            x: 10,
            y: 7,
            value: -0.193,
            name: '1860 ~ Aug'
        }, {
            x: 10,
            y: 8,
            value: -0.229,
            name: '1860 ~ Sep'
        }, {
            x: 10,
            y: 9,
            value: -0.198,
            name: '1860 ~ Oct'
        }, {
            x: 10,
            y: 10,
            value: -0.508,
            name: '1860 ~ Nov'
        }, {
            x: 10,
            y: 11,
            value: -0.752,
            name: '1860 ~ Dec'
        }, {
            x: 11,
            y: 0,
            value: -0.89,
            name: '1861 ~ Jan'
        }, {
            x: 11,
            y: 1,
            value: -0.506,
            name: '1861 ~ Feb'
        }, {
            x: 11,
            y: 2,
            value: -0.465,
            name: '1861 ~ Mar'
        }, {
            x: 11,
            y: 3,
            value: -0.395,
            name: '1861 ~ Apr'
        }, {
            x: 11,
            y: 4,
            value: -0.761,
            name: '1861 ~ May'
        }, {
            x: 11,
            y: 5,
            value: -0.183,
            name: '1861 ~ Jun'
        }, {
            x: 11,
            y: 6,
            value: -0.221,
            name: '1861 ~ Jul'
        }, {
            x: 11,
            y: 7,
            value: -0.107,
            name: '1861 ~ Aug'
        }, {
            x: 11,
            y: 8,
            value: -0.331,
            name: '1861 ~ Sep'
        }, {
            x: 11,
            y: 9,
            value: -0.355,
            name: '1861 ~ Oct'
        }, {
            x: 11,
            y: 10,
            value: -0.424,
            name: '1861 ~ Nov'
        }, {
            x: 11,
            y: 11,
            value: -0.253,
            name: '1861 ~ Dec'
        }, {
            x: 12,
            y: 0,
            value: -0.749,
            name: '1862 ~ Jan'
        }, {
            x: 12,
            y: 1,
            value: -0.773,
            name: '1862 ~ Feb'
        }, {
            x: 12,
            y: 2,
            value: -0.402,
            name: '1862 ~ Mar'
        }, {
            x: 12,
            y: 3,
            value: -0.24,
            name: '1862 ~ Apr'
        }, {
            x: 12,
            y: 4,
            value: -0.232,
            name: '1862 ~ May'
        }, {
            x: 12,
            y: 5,
            value: -0.338,
            name: '1862 ~ Jun'
        }, {
            x: 12,
            y: 6,
            value: -0.34,
            name: '1862 ~ Jul'
        }, {
            x: 12,
            y: 7,
            value: -0.694,
            name: '1862 ~ Aug'
        }, {
            x: 12,
            y: 8,
            value: -0.413,
            name: '1862 ~ Sep'
        }, {
            x: 12,
            y: 9,
            value: -0.42,
            name: '1862 ~ Oct'
        }, {
            x: 12,
            y: 10,
            value: -0.753,
            name: '1862 ~ Nov'
        }, {
            x: 12,
            y: 11,
            value: -0.889,
            name: '1862 ~ Dec'
        }, {
            x: 13,
            y: 0,
            value: 0.131,
            name: '1863 ~ Jan'
        }, {
            x: 13,
            y: 1,
            value: -0.02,
            name: '1863 ~ Feb'
        }, {
            x: 13,
            y: 2,
            value: -0.356,
            name: '1863 ~ Mar'
        }, {
            x: 13,
            y: 3,
            value: -0.241,
            name: '1863 ~ Apr'
        }, {
            x: 13,
            y: 4,
            value: -0.32,
            name: '1863 ~ May'
        }, {
            x: 13,
            y: 5,
            value: -0.402,
            name: '1863 ~ Jun'
        }, {
            x: 13,
            y: 6,
            value: -0.416,
            name: '1863 ~ Jul'
        }, {
            x: 13,
            y: 7,
            value: -0.321,
            name: '1863 ~ Aug'
        }, {
            x: 13,
            y: 8,
            value: -0.324,
            name: '1863 ~ Sep'
        }, {
            x: 13,
            y: 9,
            value: -0.381,
            name: '1863 ~ Oct'
        }, {
            x: 13,
            y: 10,
            value: -0.333,
            name: '1863 ~ Nov'
        }, {
            x: 13,
            y: 11,
            value: -0.351,
            name: '1863 ~ Dec'
        }, {
            x: 14,
            y: 0,
            value: -0.937,
            name: '1864 ~ Jan'
        }, {
            x: 14,
            y: 1,
            value: -0.63,
            name: '1864 ~ Feb'
        }, {
            x: 14,
            y: 2,
            value: -0.509,
            name: '1864 ~ Mar'
        }, {
            x: 14,
            y: 3,
            value: -0.538,
            name: '1864 ~ Apr'
        }, {
            x: 14,
            y: 4,
            value: -0.449,
            name: '1864 ~ May'
        }, {
            x: 14,
            y: 5,
            value: -0.162,
            name: '1864 ~ Jun'
        }, {
            x: 14,
            y: 6,
            value: -0.146,
            name: '1864 ~ Jul'
        }, {
            x: 14,
            y: 7,
            value: -0.31,
            name: '1864 ~ Aug'
        }, {
            x: 14,
            y: 8,
            value: -0.439,
            name: '1864 ~ Sep'
        }, {
            x: 14,
            y: 9,
            value: -0.701,
            name: '1864 ~ Oct'
        }, {
            x: 14,
            y: 10,
            value: -0.468,
            name: '1864 ~ Nov'
        }, {
            x: 14,
            y: 11,
            value: -0.602,
            name: '1864 ~ Dec'
        }, {
            x: 15,
            y: 0,
            value: -0.093,
            name: '1865 ~ Jan'
        }, {
            x: 15,
            y: 1,
            value: -0.602,
            name: '1865 ~ Feb'
        }, {
            x: 15,
            y: 2,
            value: -0.639,
            name: '1865 ~ Mar'
        }, {
            x: 15,
            y: 3,
            value: -0.224,
            name: '1865 ~ Apr'
        }, {
            x: 15,
            y: 4,
            value: -0.26,
            name: '1865 ~ May'
        }, {
            x: 15,
            y: 5,
            value: -0.27,
            name: '1865 ~ Jun'
        }, {
            x: 15,
            y: 6,
            value: -0.128,
            name: '1865 ~ Jul'
        }, {
            x: 15,
            y: 7,
            value: -0.207,
            name: '1865 ~ Aug'
        }, {
            x: 15,
            y: 8,
            value: -0.075,
            name: '1865 ~ Sep'
        }, {
            x: 15,
            y: 9,
            value: -0.272,
            name: '1865 ~ Oct'
        }, {
            x: 15,
            y: 10,
            value: -0.191,
            name: '1865 ~ Nov'
        }, {
            x: 15,
            y: 11,
            value: -0.338,
            name: '1865 ~ Dec'
        }, {
            x: 16,
            y: 0,
            value: 0.039,
            name: '1866 ~ Jan'
        }, {
            x: 16,
            y: 1,
            value: -0.212,
            name: '1866 ~ Feb'
        }, {
            x: 16,
            y: 2,
            value: -0.595,
            name: '1866 ~ Mar'
        }, {
            x: 16,
            y: 3,
            value: -0.263,
            name: '1866 ~ Apr'
        }, {
            x: 16,
            y: 4,
            value: -0.528,
            name: '1866 ~ May'
        }, {
            x: 16,
            y: 5,
            value: 0.108,
            name: '1866 ~ Jun'
        }, {
            x: 16,
            y: 6,
            value: 0.027,
            name: '1866 ~ Jul'
        }, {
            x: 16,
            y: 7,
            value: -0.261,
            name: '1866 ~ Aug'
        }, {
            x: 16,
            y: 8,
            value: -0.225,
            name: '1866 ~ Sep'
        }, {
            x: 16,
            y: 9,
            value: -0.417,
            name: '1866 ~ Oct'
        }, {
            x: 16,
            y: 10,
            value: -0.301,
            name: '1866 ~ Nov'
        }, {
            x: 16,
            y: 11,
            value: -0.337,
            name: '1866 ~ Dec'
        }, {
            x: 17,
            y: 0,
            value: -0.305,
            name: '1867 ~ Jan'
        }, {
            x: 17,
            y: 1,
            value: 0.022,
            name: '1867 ~ Feb'
        }, {
            x: 17,
            y: 2,
            value: -0.714,
            name: '1867 ~ Mar'
        }, {
            x: 17,
            y: 3,
            value: -0.251,
            name: '1867 ~ Apr'
        }, {
            x: 17,
            y: 4,
            value: -0.542,
            name: '1867 ~ May'
        }, {
            x: 17,
            y: 5,
            value: -0.295,
            name: '1867 ~ Jun'
        }, {
            x: 17,
            y: 6,
            value: -0.231,
            name: '1867 ~ Jul'
        }, {
            x: 17,
            y: 7,
            value: -0.225,
            name: '1867 ~ Aug'
        }, {
            x: 17,
            y: 8,
            value: -0.095,
            name: '1867 ~ Sep'
        }, {
            x: 17,
            y: 9,
            value: -0.179,
            name: '1867 ~ Oct'
        }, {
            x: 17,
            y: 10,
            value: -0.309,
            name: '1867 ~ Nov'
        }, {
            x: 17,
            y: 11,
            value: -0.624,
            name: '1867 ~ Dec'
        }, {
            x: 18,
            y: 0,
            value: -0.704,
            name: '1868 ~ Jan'
        }, {
            x: 18,
            y: 1,
            value: -0.466,
            name: '1868 ~ Feb'
        }, {
            x: 18,
            y: 2,
            value: -0.07,
            name: '1868 ~ Mar'
        }, {
            x: 18,
            y: 3,
            value: -0.371,
            name: '1868 ~ Apr'
        }, {
            x: 18,
            y: 4,
            value: -0.069,
            name: '1868 ~ May'
        }, {
            x: 18,
            y: 5,
            value: -0.176,
            name: '1868 ~ Jun'
        }, {
            x: 18,
            y: 6,
            value: 0.147,
            name: '1868 ~ Jul'
        }, {
            x: 18,
            y: 7,
            value: -0.037,
            name: '1868 ~ Aug'
        }, {
            x: 18,
            y: 8,
            value: -0.196,
            name: '1868 ~ Sep'
        }, {
            x: 18,
            y: 9,
            value: -0.232,
            name: '1868 ~ Oct'
        }, {
            x: 18,
            y: 10,
            value: -0.5,
            name: '1868 ~ Nov'
        }, {
            x: 18,
            y: 11,
            value: -0.12,
            name: '1868 ~ Dec'
        }, {
            x: 19,
            y: 0,
            value: -0.259,
            name: '1869 ~ Jan'
        }, {
            x: 19,
            y: 1,
            value: 0.27,
            name: '1869 ~ Feb'
        }, {
            x: 19,
            y: 2,
            value: -0.589,
            name: '1869 ~ Mar'
        }, {
            x: 19,
            y: 3,
            value: -0.224,
            name: '1869 ~ Apr'
        }, {
            x: 19,
            y: 4,
            value: -0.281,
            name: '1869 ~ May'
        }, {
            x: 19,
            y: 5,
            value: -0.37,
            name: '1869 ~ Jun'
        }, {
            x: 19,
            y: 6,
            value: -0.286,
            name: '1869 ~ Jul'
        }, {
            x: 19,
            y: 7,
            value: -0.072,
            name: '1869 ~ Aug'
        }, {
            x: 19,
            y: 8,
            value: -0.186,
            name: '1869 ~ Sep'
        }, {
            x: 19,
            y: 9,
            value: -0.422,
            name: '1869 ~ Oct'
        }, {
            x: 19,
            y: 10,
            value: -0.375,
            name: '1869 ~ Nov'
        }, {
            x: 19,
            y: 11,
            value: -0.355,
            name: '1869 ~ Dec'
        }, {
            x: 20,
            y: 0,
            value: -0.078,
            name: '1870 ~ Jan'
        }, {
            x: 20,
            y: 1,
            value: -0.45,
            name: '1870 ~ Feb'
        }, {
            x: 20,
            y: 2,
            value: -0.406,
            name: '1870 ~ Mar'
        }, {
            x: 20,
            y: 3,
            value: -0.214,
            name: '1870 ~ Apr'
        }, {
            x: 20,
            y: 4,
            value: -0.165,
            name: '1870 ~ May'
        }, {
            x: 20,
            y: 5,
            value: -0.209,
            name: '1870 ~ Jun'
        }, {
            x: 20,
            y: 6,
            value: 0.016,
            name: '1870 ~ Jul'
        }, {
            x: 20,
            y: 7,
            value: -0.262,
            name: '1870 ~ Aug'
        }, {
            x: 20,
            y: 8,
            value: -0.263,
            name: '1870 ~ Sep'
        }, {
            x: 20,
            y: 9,
            value: -0.393,
            name: '1870 ~ Oct'
        }, {
            x: 20,
            y: 10,
            value: -0.164,
            name: '1870 ~ Nov'
        }, {
            x: 20,
            y: 11,
            value: -0.723,
            name: '1870 ~ Dec'
        }, {
            x: 21,
            y: 0,
            value: -0.527,
            name: '1871 ~ Jan'
        }, {
            x: 21,
            y: 1,
            value: -0.546,
            name: '1871 ~ Feb'
        }, {
            x: 21,
            y: 2,
            value: 0.013,
            name: '1871 ~ Mar'
        }, {
            x: 21,
            y: 3,
            value: -0.144,
            name: '1871 ~ Apr'
        }, {
            x: 21,
            y: 4,
            value: -0.315,
            name: '1871 ~ May'
        }, {
            x: 21,
            y: 5,
            value: -0.223,
            name: '1871 ~ Jun'
        }, {
            x: 21,
            y: 6,
            value: -0.011,
            name: '1871 ~ Jul'
        }, {
            x: 21,
            y: 7,
            value: -0.221,
            name: '1871 ~ Aug'
        }, {
            x: 21,
            y: 8,
            value: -0.457,
            name: '1871 ~ Sep'
        }, {
            x: 21,
            y: 9,
            value: -0.479,
            name: '1871 ~ Oct'
        }, {
            x: 21,
            y: 10,
            value: -0.54,
            name: '1871 ~ Nov'
        }, {
            x: 21,
            y: 11,
            value: -0.56,
            name: '1871 ~ Dec'
        }, {
            x: 22,
            y: 0,
            value: -0.305,
            name: '1872 ~ Jan'
        }, {
            x: 22,
            y: 1,
            value: -0.402,
            name: '1872 ~ Feb'
        }, {
            x: 22,
            y: 2,
            value: -0.471,
            name: '1872 ~ Mar'
        }, {
            x: 22,
            y: 3,
            value: -0.15,
            name: '1872 ~ Apr'
        }, {
            x: 22,
            y: 4,
            value: -0.039,
            name: '1872 ~ May'
        }, {
            x: 22,
            y: 5,
            value: -0.208,
            name: '1872 ~ Jun'
        }, {
            x: 22,
            y: 6,
            value: -0.115,
            name: '1872 ~ Jul'
        }, {
            x: 22,
            y: 7,
            value: -0.027,
            name: '1872 ~ Aug'
        }, {
            x: 22,
            y: 8,
            value: -0.128,
            name: '1872 ~ Sep'
        }, {
            x: 22,
            y: 9,
            value: -0.225,
            name: '1872 ~ Oct'
        }, {
            x: 22,
            y: 10,
            value: -0.243,
            name: '1872 ~ Nov'
        }, {
            x: 22,
            y: 11,
            value: -0.424,
            name: '1872 ~ Dec'
        }, {
            x: 23,
            y: 0,
            value: -0.018,
            name: '1873 ~ Jan'
        }, {
            x: 23,
            y: 1,
            value: -0.345,
            name: '1873 ~ Feb'
        }, {
            x: 23,
            y: 2,
            value: -0.275,
            name: '1873 ~ Mar'
        }, {
            x: 23,
            y: 3,
            value: -0.521,
            name: '1873 ~ Apr'
        }, {
            x: 23,
            y: 4,
            value: -0.411,
            name: '1873 ~ May'
        }, {
            x: 23,
            y: 5,
            value: -0.258,
            name: '1873 ~ Jun'
        }, {
            x: 23,
            y: 6,
            value: -0.162,
            name: '1873 ~ Jul'
        }, {
            x: 23,
            y: 7,
            value: -0.161,
            name: '1873 ~ Aug'
        }, {
            x: 23,
            y: 8,
            value: -0.357,
            name: '1873 ~ Sep'
        }, {
            x: 23,
            y: 9,
            value: -0.402,
            name: '1873 ~ Oct'
        }, {
            x: 23,
            y: 10,
            value: -0.466,
            name: '1873 ~ Nov'
        }, {
            x: 23,
            y: 11,
            value: -0.277,
            name: '1873 ~ Dec'
        }, {
            x: 24,
            y: 0,
            value: 0.054,
            name: '1874 ~ Jan'
        }, {
            x: 24,
            y: 1,
            value: -0.44,
            name: '1874 ~ Feb'
        }, {
            x: 24,
            y: 2,
            value: -0.562,
            name: '1874 ~ Mar'
        }, {
            x: 24,
            y: 3,
            value: -0.507,
            name: '1874 ~ Apr'
        }, {
            x: 24,
            y: 4,
            value: -0.466,
            name: '1874 ~ May'
        }, {
            x: 24,
            y: 5,
            value: -0.458,
            name: '1874 ~ Jun'
        }, {
            x: 24,
            y: 6,
            value: -0.174,
            name: '1874 ~ Jul'
        }, {
            x: 24,
            y: 7,
            value: -0.368,
            name: '1874 ~ Aug'
        }, {
            x: 24,
            y: 8,
            value: -0.212,
            name: '1874 ~ Sep'
        }, {
            x: 24,
            y: 9,
            value: -0.436,
            name: '1874 ~ Oct'
        }, {
            x: 24,
            y: 10,
            value: -0.503,
            name: '1874 ~ Nov'
        }, {
            x: 24,
            y: 11,
            value: -0.407,
            name: '1874 ~ Dec'
        }, {
            x: 25,
            y: 0,
            value: -0.577,
            name: '1875 ~ Jan'
        }, {
            x: 25,
            y: 1,
            value: -0.613,
            name: '1875 ~ Feb'
        }, {
            x: 25,
            y: 2,
            value: -0.598,
            name: '1875 ~ Mar'
        }, {
            x: 25,
            y: 3,
            value: -0.462,
            name: '1875 ~ Apr'
        }, {
            x: 25,
            y: 4,
            value: -0.176,
            name: '1875 ~ May'
        }, {
            x: 25,
            y: 5,
            value: -0.234,
            name: '1875 ~ Jun'
        }, {
            x: 25,
            y: 6,
            value: -0.302,
            name: '1875 ~ Jul'
        }, {
            x: 25,
            y: 7,
            value: -0.183,
            name: '1875 ~ Aug'
        }, {
            x: 25,
            y: 8,
            value: -0.274,
            name: '1875 ~ Sep'
        }, {
            x: 25,
            y: 9,
            value: -0.371,
            name: '1875 ~ Oct'
        }, {
            x: 25,
            y: 10,
            value: -0.5,
            name: '1875 ~ Nov'
        }, {
            x: 25,
            y: 11,
            value: -0.495,
            name: '1875 ~ Dec'
        }, {
            x: 26,
            y: 0,
            value: -0.311,
            name: '1876 ~ Jan'
        }, {
            x: 26,
            y: 1,
            value: -0.265,
            name: '1876 ~ Feb'
        }, {
            x: 26,
            y: 2,
            value: -0.383,
            name: '1876 ~ Mar'
        }, {
            x: 26,
            y: 3,
            value: -0.3,
            name: '1876 ~ Apr'
        }, {
            x: 26,
            y: 4,
            value: -0.53,
            name: '1876 ~ May'
        }, {
            x: 26,
            y: 5,
            value: -0.284,
            name: '1876 ~ Jun'
        }, {
            x: 26,
            y: 6,
            value: -0.134,
            name: '1876 ~ Jul'
        }, {
            x: 26,
            y: 7,
            value: -0.241,
            name: '1876 ~ Aug'
        }, {
            x: 26,
            y: 8,
            value: -0.434,
            name: '1876 ~ Sep'
        }, {
            x: 26,
            y: 9,
            value: -0.385,
            name: '1876 ~ Oct'
        }, {
            x: 26,
            y: 10,
            value: -0.575,
            name: '1876 ~ Nov'
        }, {
            x: 26,
            y: 11,
            value: -0.71,
            name: '1876 ~ Dec'
        }, {
            x: 27,
            y: 0,
            value: -0.325,
            name: '1877 ~ Jan'
        }, {
            x: 27,
            y: 1,
            value: 0.057,
            name: '1877 ~ Feb'
        }, {
            x: 27,
            y: 2,
            value: -0.293,
            name: '1877 ~ Mar'
        }, {
            x: 27,
            y: 3,
            value: -0.325,
            name: '1877 ~ Apr'
        }, {
            x: 27,
            y: 4,
            value: -0.449,
            name: '1877 ~ May'
        }, {
            x: 27,
            y: 5,
            value: -0.088,
            name: '1877 ~ Jun'
        }, {
            x: 27,
            y: 6,
            value: 0.01,
            name: '1877 ~ Jul'
        }, {
            x: 27,
            y: 7,
            value: 0.15,
            name: '1877 ~ Aug'
        }, {
            x: 27,
            y: 8,
            value: 0.028,
            name: '1877 ~ Sep'
        }, {
            x: 27,
            y: 9,
            value: 0.055,
            name: '1877 ~ Oct'
        }, {
            x: 27,
            y: 10,
            value: 0.104,
            name: '1877 ~ Nov'
        }, {
            x: 27,
            y: 11,
            value: 0.172,
            name: '1877 ~ Dec'
        }, {
            x: 28,
            y: 0,
            value: 0.173,
            name: '1878 ~ Jan'
        }, {
            x: 28,
            y: 1,
            value: 0.404,
            name: '1878 ~ Feb'
        }, {
            x: 28,
            y: 2,
            value: 0.342,
            name: '1878 ~ Mar'
        }, {
            x: 28,
            y: 3,
            value: 0.324,
            name: '1878 ~ Apr'
        }, {
            x: 28,
            y: 4,
            value: -0.083,
            name: '1878 ~ May'
        }, {
            x: 28,
            y: 5,
            value: 0.015,
            name: '1878 ~ Jun'
        }, {
            x: 28,
            y: 6,
            value: -0.05,
            name: '1878 ~ Jul'
        }, {
            x: 28,
            y: 7,
            value: -0.024,
            name: '1878 ~ Aug'
        }, {
            x: 28,
            y: 8,
            value: 0.018,
            name: '1878 ~ Sep'
        }, {
            x: 28,
            y: 9,
            value: -0.12,
            name: '1878 ~ Oct'
        }, {
            x: 28,
            y: 10,
            value: -0.203,
            name: '1878 ~ Nov'
        }, {
            x: 28,
            y: 11,
            value: -0.36,
            name: '1878 ~ Dec'
        }, {
            x: 29,
            y: 0,
            value: -0.197,
            name: '1879 ~ Jan'
        }, {
            x: 29,
            y: 1,
            value: -0.154,
            name: '1879 ~ Feb'
        }, {
            x: 29,
            y: 2,
            value: -0.097,
            name: '1879 ~ Mar'
        }, {
            x: 29,
            y: 3,
            value: -0.215,
            name: '1879 ~ Apr'
        }, {
            x: 29,
            y: 4,
            value: -0.211,
            name: '1879 ~ May'
        }, {
            x: 29,
            y: 5,
            value: -0.27,
            name: '1879 ~ Jun'
        }, {
            x: 29,
            y: 6,
            value: -0.233,
            name: '1879 ~ Jul'
        }, {
            x: 29,
            y: 7,
            value: -0.169,
            name: '1879 ~ Aug'
        }, {
            x: 29,
            y: 8,
            value: -0.213,
            name: '1879 ~ Sep'
        }, {
            x: 29,
            y: 9,
            value: -0.121,
            name: '1879 ~ Oct'
        }, {
            x: 29,
            y: 10,
            value: -0.386,
            name: '1879 ~ Nov'
        }, {
            x: 29,
            y: 11,
            value: -0.517,
            name: '1879 ~ Dec'
        }, {
            x: 30,
            y: 0,
            value: -0.064,
            name: '1880 ~ Jan'
        }, {
            x: 30,
            y: 1,
            value: -0.176,
            name: '1880 ~ Feb'
        }, {
            x: 30,
            y: 2,
            value: -0.105,
            name: '1880 ~ Mar'
        }, {
            x: 30,
            y: 3,
            value: -0.147,
            name: '1880 ~ Apr'
        }, {
            x: 30,
            y: 4,
            value: -0.241,
            name: '1880 ~ May'
        }, {
            x: 30,
            y: 5,
            value: -0.308,
            name: '1880 ~ Jun'
        }, {
            x: 30,
            y: 6,
            value: -0.25,
            name: '1880 ~ Jul'
        }, {
            x: 30,
            y: 7,
            value: -0.115,
            name: '1880 ~ Aug'
        }, {
            x: 30,
            y: 8,
            value: -0.233,
            name: '1880 ~ Sep'
        }, {
            x: 30,
            y: 9,
            value: -0.387,
            name: '1880 ~ Oct'
        }, {
            x: 30,
            y: 10,
            value: -0.408,
            name: '1880 ~ Nov'
        }, {
            x: 30,
            y: 11,
            value: -0.295,
            name: '1880 ~ Dec'
        }, {
            x: 31,
            y: 0,
            value: -0.362,
            name: '1881 ~ Jan'
        }, {
            x: 31,
            y: 1,
            value: -0.238,
            name: '1881 ~ Feb'
        }, {
            x: 31,
            y: 2,
            value: -0.187,
            name: '1881 ~ Mar'
        }, {
            x: 31,
            y: 3,
            value: -0.133,
            name: '1881 ~ Apr'
        }, {
            x: 31,
            y: 4,
            value: -0.03,
            name: '1881 ~ May'
        }, {
            x: 31,
            y: 5,
            value: -0.229,
            name: '1881 ~ Jun'
        }, {
            x: 31,
            y: 6,
            value: -0.151,
            name: '1881 ~ Jul'
        }, {
            x: 31,
            y: 7,
            value: -0.128,
            name: '1881 ~ Aug'
        }, {
            x: 31,
            y: 8,
            value: -0.244,
            name: '1881 ~ Sep'
        }, {
            x: 31,
            y: 9,
            value: -0.284,
            name: '1881 ~ Oct'
        }, {
            x: 31,
            y: 10,
            value: -0.341,
            name: '1881 ~ Nov'
        }, {
            x: 31,
            y: 11,
            value: -0.138,
            name: '1881 ~ Dec'
        }, {
            x: 32,
            y: 0,
            value: 0.114,
            name: '1882 ~ Jan'
        }, {
            x: 32,
            y: 1,
            value: -0.009,
            name: '1882 ~ Feb'
        }, {
            x: 32,
            y: 2,
            value: -0.053,
            name: '1882 ~ Mar'
        }, {
            x: 32,
            y: 3,
            value: -0.283,
            name: '1882 ~ Apr'
        }, {
            x: 32,
            y: 4,
            value: -0.373,
            name: '1882 ~ May'
        }, {
            x: 32,
            y: 5,
            value: -0.317,
            name: '1882 ~ Jun'
        }, {
            x: 32,
            y: 6,
            value: -0.185,
            name: '1882 ~ Jul'
        }, {
            x: 32,
            y: 7,
            value: -0.221,
            name: '1882 ~ Aug'
        }, {
            x: 32,
            y: 8,
            value: -0.155,
            name: '1882 ~ Sep'
        }, {
            x: 32,
            y: 9,
            value: -0.337,
            name: '1882 ~ Oct'
        }, {
            x: 32,
            y: 10,
            value: -0.313,
            name: '1882 ~ Nov'
        }, {
            x: 32,
            y: 11,
            value: -0.463,
            name: '1882 ~ Dec'
        }, {
            x: 33,
            y: 0,
            value: -0.409,
            name: '1883 ~ Jan'
        }, {
            x: 33,
            y: 1,
            value: -0.322,
            name: '1883 ~ Feb'
        }, {
            x: 33,
            y: 2,
            value: -0.342,
            name: '1883 ~ Mar'
        }, {
            x: 33,
            y: 3,
            value: -0.394,
            name: '1883 ~ Apr'
        }, {
            x: 33,
            y: 4,
            value: -0.253,
            name: '1883 ~ May'
        }, {
            x: 33,
            y: 5,
            value: -0.119,
            name: '1883 ~ Jun'
        }, {
            x: 33,
            y: 6,
            value: -0.195,
            name: '1883 ~ Jul'
        }, {
            x: 33,
            y: 7,
            value: -0.209,
            name: '1883 ~ Aug'
        }, {
            x: 33,
            y: 8,
            value: -0.278,
            name: '1883 ~ Sep'
        }, {
            x: 33,
            y: 9,
            value: -0.381,
            name: '1883 ~ Oct'
        }, {
            x: 33,
            y: 10,
            value: -0.305,
            name: '1883 ~ Nov'
        }, {
            x: 33,
            y: 11,
            value: -0.324,
            name: '1883 ~ Dec'
        }, {
            x: 34,
            y: 0,
            value: -0.418,
            name: '1884 ~ Jan'
        }, {
            x: 34,
            y: 1,
            value: -0.217,
            name: '1884 ~ Feb'
        }, {
            x: 34,
            y: 2,
            value: -0.459,
            name: '1884 ~ Mar'
        }, {
            x: 34,
            y: 3,
            value: -0.529,
            name: '1884 ~ Apr'
        }, {
            x: 34,
            y: 4,
            value: -0.392,
            name: '1884 ~ May'
        }, {
            x: 34,
            y: 5,
            value: -0.413,
            name: '1884 ~ Jun'
        }, {
            x: 34,
            y: 6,
            value: -0.424,
            name: '1884 ~ Jul'
        }, {
            x: 34,
            y: 7,
            value: -0.41,
            name: '1884 ~ Aug'
        }, {
            x: 34,
            y: 8,
            value: -0.342,
            name: '1884 ~ Sep'
        }, {
            x: 34,
            y: 9,
            value: -0.322,
            name: '1884 ~ Oct'
        }, {
            x: 34,
            y: 10,
            value: -0.558,
            name: '1884 ~ Nov'
        }, {
            x: 34,
            y: 11,
            value: -0.416,
            name: '1884 ~ Dec'
        }, {
            x: 35,
            y: 0,
            value: -0.508,
            name: '1885 ~ Jan'
        }, {
            x: 35,
            y: 1,
            value: -0.411,
            name: '1885 ~ Feb'
        }, {
            x: 35,
            y: 2,
            value: -0.484,
            name: '1885 ~ Mar'
        }, {
            x: 35,
            y: 3,
            value: -0.472,
            name: '1885 ~ Apr'
        }, {
            x: 35,
            y: 4,
            value: -0.521,
            name: '1885 ~ May'
        }, {
            x: 35,
            y: 5,
            value: -0.488,
            name: '1885 ~ Jun'
        }, {
            x: 35,
            y: 6,
            value: -0.311,
            name: '1885 ~ Jul'
        }, {
            x: 35,
            y: 7,
            value: -0.51,
            name: '1885 ~ Aug'
        }, {
            x: 35,
            y: 8,
            value: -0.333,
            name: '1885 ~ Sep'
        }, {
            x: 35,
            y: 9,
            value: -0.249,
            name: '1885 ~ Oct'
        }, {
            x: 35,
            y: 10,
            value: -0.261,
            name: '1885 ~ Nov'
        }, {
            x: 35,
            y: 11,
            value: -0.156,
            name: '1885 ~ Dec'
        }, {
            x: 36,
            y: 0,
            value: -0.401,
            name: '1886 ~ Jan'
        }, {
            x: 36,
            y: 1,
            value: -0.455,
            name: '1886 ~ Feb'
        }, {
            x: 36,
            y: 2,
            value: -0.415,
            name: '1886 ~ Mar'
        }, {
            x: 36,
            y: 3,
            value: -0.336,
            name: '1886 ~ Apr'
        }, {
            x: 36,
            y: 4,
            value: -0.191,
            name: '1886 ~ May'
        }, {
            x: 36,
            y: 5,
            value: -0.387,
            name: '1886 ~ Jun'
        }, {
            x: 36,
            y: 6,
            value: -0.285,
            name: '1886 ~ Jul'
        }, {
            x: 36,
            y: 7,
            value: -0.341,
            name: '1886 ~ Aug'
        }, {
            x: 36,
            y: 8,
            value: -0.433,
            name: '1886 ~ Sep'
        }, {
            x: 36,
            y: 9,
            value: -0.363,
            name: '1886 ~ Oct'
        }, {
            x: 36,
            y: 10,
            value: -0.422,
            name: '1886 ~ Nov'
        }, {
            x: 36,
            y: 11,
            value: -0.427,
            name: '1886 ~ Dec'
        }, {
            x: 37,
            y: 0,
            value: -0.566,
            name: '1887 ~ Jan'
        }, {
            x: 37,
            y: 1,
            value: -0.556,
            name: '1887 ~ Feb'
        }, {
            x: 37,
            y: 2,
            value: -0.458,
            name: '1887 ~ Mar'
        }, {
            x: 37,
            y: 3,
            value: -0.436,
            name: '1887 ~ Apr'
        }, {
            x: 37,
            y: 4,
            value: -0.354,
            name: '1887 ~ May'
        }, {
            x: 37,
            y: 5,
            value: -0.406,
            name: '1887 ~ Jun'
        }, {
            x: 37,
            y: 6,
            value: -0.267,
            name: '1887 ~ Jul'
        }, {
            x: 37,
            y: 7,
            value: -0.367,
            name: '1887 ~ Aug'
        }, {
            x: 37,
            y: 8,
            value: -0.343,
            name: '1887 ~ Sep'
        }, {
            x: 37,
            y: 9,
            value: -0.506,
            name: '1887 ~ Oct'
        }, {
            x: 37,
            y: 10,
            value: -0.408,
            name: '1887 ~ Nov'
        }, {
            x: 37,
            y: 11,
            value: -0.397,
            name: '1887 ~ Dec'
        }, {
            x: 38,
            y: 0,
            value: -0.603,
            name: '1888 ~ Jan'
        }, {
            x: 38,
            y: 1,
            value: -0.453,
            name: '1888 ~ Feb'
        }, {
            x: 38,
            y: 2,
            value: -0.543,
            name: '1888 ~ Mar'
        }, {
            x: 38,
            y: 3,
            value: -0.243,
            name: '1888 ~ Apr'
        }, {
            x: 38,
            y: 4,
            value: -0.349,
            name: '1888 ~ May'
        }, {
            x: 38,
            y: 5,
            value: -0.291,
            name: '1888 ~ Jun'
        }, {
            x: 38,
            y: 6,
            value: -0.308,
            name: '1888 ~ Jul'
        }, {
            x: 38,
            y: 7,
            value: -0.281,
            name: '1888 ~ Aug'
        }, {
            x: 38,
            y: 8,
            value: -0.216,
            name: '1888 ~ Sep'
        }, {
            x: 38,
            y: 9,
            value: -0.106,
            name: '1888 ~ Oct'
        }, {
            x: 38,
            y: 10,
            value: -0.197,
            name: '1888 ~ Nov'
        }, {
            x: 38,
            y: 11,
            value: -0.176,
            name: '1888 ~ Dec'
        }, {
            x: 39,
            y: 0,
            value: -0.054,
            name: '1889 ~ Jan'
        }, {
            x: 39,
            y: 1,
            value: -0.095,
            name: '1889 ~ Feb'
        }, {
            x: 39,
            y: 2,
            value: -0.068,
            name: '1889 ~ Mar'
        }, {
            x: 39,
            y: 3,
            value: 0.013,
            name: '1889 ~ Apr'
        }, {
            x: 39,
            y: 4,
            value: -0.079,
            name: '1889 ~ May'
        }, {
            x: 39,
            y: 5,
            value: -0.149,
            name: '1889 ~ Jun'
        }, {
            x: 39,
            y: 6,
            value: -0.196,
            name: '1889 ~ Jul'
        }, {
            x: 39,
            y: 7,
            value: -0.227,
            name: '1889 ~ Aug'
        }, {
            x: 39,
            y: 8,
            value: -0.381,
            name: '1889 ~ Sep'
        }, {
            x: 39,
            y: 9,
            value: -0.299,
            name: '1889 ~ Oct'
        }, {
            x: 39,
            y: 10,
            value: -0.399,
            name: '1889 ~ Nov'
        }, {
            x: 39,
            y: 11,
            value: -0.175,
            name: '1889 ~ Dec'
        }, {
            x: 40,
            y: 0,
            value: -0.324,
            name: '1890 ~ Jan'
        }, {
            x: 40,
            y: 1,
            value: -0.366,
            name: '1890 ~ Feb'
        }, {
            x: 40,
            y: 2,
            value: -0.46,
            name: '1890 ~ Mar'
        }, {
            x: 40,
            y: 3,
            value: -0.319,
            name: '1890 ~ Apr'
        }, {
            x: 40,
            y: 4,
            value: -0.425,
            name: '1890 ~ May'
        }, {
            x: 40,
            y: 5,
            value: -0.378,
            name: '1890 ~ Jun'
        }, {
            x: 40,
            y: 6,
            value: -0.414,
            name: '1890 ~ Jul'
        }, {
            x: 40,
            y: 7,
            value: -0.421,
            name: '1890 ~ Aug'
        }, {
            x: 40,
            y: 8,
            value: -0.477,
            name: '1890 ~ Sep'
        }, {
            x: 40,
            y: 9,
            value: -0.504,
            name: '1890 ~ Oct'
        }, {
            x: 40,
            y: 10,
            value: -0.57,
            name: '1890 ~ Nov'
        }, {
            x: 40,
            y: 11,
            value: -0.407,
            name: '1890 ~ Dec'
        }, {
            x: 41,
            y: 0,
            value: -0.515,
            name: '1891 ~ Jan'
        }, {
            x: 41,
            y: 1,
            value: -0.467,
            name: '1891 ~ Feb'
        }, {
            x: 41,
            y: 2,
            value: -0.371,
            name: '1891 ~ Mar'
        }, {
            x: 41,
            y: 3,
            value: -0.36,
            name: '1891 ~ Apr'
        }, {
            x: 41,
            y: 4,
            value: -0.207,
            name: '1891 ~ May'
        }, {
            x: 41,
            y: 5,
            value: -0.3,
            name: '1891 ~ Jun'
        }, {
            x: 41,
            y: 6,
            value: -0.332,
            name: '1891 ~ Jul'
        }, {
            x: 41,
            y: 7,
            value: -0.318,
            name: '1891 ~ Aug'
        }, {
            x: 41,
            y: 8,
            value: -0.204,
            name: '1891 ~ Sep'
        }, {
            x: 41,
            y: 9,
            value: -0.332,
            name: '1891 ~ Oct'
        }, {
            x: 41,
            y: 10,
            value: -0.546,
            name: '1891 ~ Nov'
        }, {
            x: 41,
            y: 11,
            value: -0.124,
            name: '1891 ~ Dec'
        }, {
            x: 42,
            y: 0,
            value: -0.407,
            name: '1892 ~ Jan'
        }, {
            x: 42,
            y: 1,
            value: -0.121,
            name: '1892 ~ Feb'
        }, {
            x: 42,
            y: 2,
            value: -0.459,
            name: '1892 ~ Mar'
        }, {
            x: 42,
            y: 3,
            value: -0.483,
            name: '1892 ~ Apr'
        }, {
            x: 42,
            y: 4,
            value: -0.401,
            name: '1892 ~ May'
        }, {
            x: 42,
            y: 5,
            value: -0.466,
            name: '1892 ~ Jun'
        }, {
            x: 42,
            y: 6,
            value: -0.535,
            name: '1892 ~ Jul'
        }, {
            x: 42,
            y: 7,
            value: -0.445,
            name: '1892 ~ Aug'
        }, {
            x: 42,
            y: 8,
            value: -0.325,
            name: '1892 ~ Sep'
        }, {
            x: 42,
            y: 9,
            value: -0.444,
            name: '1892 ~ Oct'
        }, {
            x: 42,
            y: 10,
            value: -0.627,
            name: '1892 ~ Nov'
        }, {
            x: 42,
            y: 11,
            value: -0.794,
            name: '1892 ~ Dec'
        }, {
            x: 43,
            y: 0,
            value: -0.962,
            name: '1893 ~ Jan'
        }, {
            x: 43,
            y: 1,
            value: -0.723,
            name: '1893 ~ Feb'
        }, {
            x: 43,
            y: 2,
            value: -0.374,
            name: '1893 ~ Mar'
        }, {
            x: 43,
            y: 3,
            value: -0.562,
            name: '1893 ~ Apr'
        }, {
            x: 43,
            y: 4,
            value: -0.551,
            name: '1893 ~ May'
        }, {
            x: 43,
            y: 5,
            value: -0.463,
            name: '1893 ~ Jun'
        }, {
            x: 43,
            y: 6,
            value: -0.278,
            name: '1893 ~ Jul'
        }, {
            x: 43,
            y: 7,
            value: -0.288,
            name: '1893 ~ Aug'
        }, {
            x: 43,
            y: 8,
            value: -0.44,
            name: '1893 ~ Sep'
        }, {
            x: 43,
            y: 9,
            value: -0.271,
            name: '1893 ~ Oct'
        }, {
            x: 43,
            y: 10,
            value: -0.415,
            name: '1893 ~ Nov'
        }, {
            x: 43,
            y: 11,
            value: -0.352,
            name: '1893 ~ Dec'
        }, {
            x: 44,
            y: 0,
            value: -0.454,
            name: '1894 ~ Jan'
        }, {
            x: 44,
            y: 1,
            value: -0.379,
            name: '1894 ~ Feb'
        }, {
            x: 44,
            y: 2,
            value: -0.38,
            name: '1894 ~ Mar'
        }, {
            x: 44,
            y: 3,
            value: -0.379,
            name: '1894 ~ Apr'
        }, {
            x: 44,
            y: 4,
            value: -0.426,
            name: '1894 ~ May'
        }, {
            x: 44,
            y: 5,
            value: -0.493,
            name: '1894 ~ Jun'
        }, {
            x: 44,
            y: 6,
            value: -0.316,
            name: '1894 ~ Jul'
        }, {
            x: 44,
            y: 7,
            value: -0.343,
            name: '1894 ~ Aug'
        }, {
            x: 44,
            y: 8,
            value: -0.465,
            name: '1894 ~ Sep'
        }, {
            x: 44,
            y: 9,
            value: -0.443,
            name: '1894 ~ Oct'
        }, {
            x: 44,
            y: 10,
            value: -0.424,
            name: '1894 ~ Nov'
        }, {
            x: 44,
            y: 11,
            value: -0.404,
            name: '1894 ~ Dec'
        }, {
            x: 45,
            y: 0,
            value: -0.497,
            name: '1895 ~ Jan'
        }, {
            x: 45,
            y: 1,
            value: -0.678,
            name: '1895 ~ Feb'
        }, {
            x: 45,
            y: 2,
            value: -0.527,
            name: '1895 ~ Mar'
        }, {
            x: 45,
            y: 3,
            value: -0.408,
            name: '1895 ~ Apr'
        }, {
            x: 45,
            y: 4,
            value: -0.415,
            name: '1895 ~ May'
        }, {
            x: 45,
            y: 5,
            value: -0.332,
            name: '1895 ~ Jun'
        }, {
            x: 45,
            y: 6,
            value: -0.359,
            name: '1895 ~ Jul'
        }, {
            x: 45,
            y: 7,
            value: -0.267,
            name: '1895 ~ Aug'
        }, {
            x: 45,
            y: 8,
            value: -0.286,
            name: '1895 ~ Sep'
        }, {
            x: 45,
            y: 9,
            value: -0.343,
            name: '1895 ~ Oct'
        }, {
            x: 45,
            y: 10,
            value: -0.302,
            name: '1895 ~ Nov'
        }, {
            x: 45,
            y: 11,
            value: -0.318,
            name: '1895 ~ Dec'
        }, {
            x: 46,
            y: 0,
            value: -0.224,
            name: '1896 ~ Jan'
        }, {
            x: 46,
            y: 1,
            value: -0.233,
            name: '1896 ~ Feb'
        }, {
            x: 46,
            y: 2,
            value: -0.384,
            name: '1896 ~ Mar'
        }, {
            x: 46,
            y: 3,
            value: -0.35,
            name: '1896 ~ Apr'
        }, {
            x: 46,
            y: 4,
            value: -0.207,
            name: '1896 ~ May'
        }, {
            x: 46,
            y: 5,
            value: -0.124,
            name: '1896 ~ Jun'
        }, {
            x: 46,
            y: 6,
            value: -0.112,
            name: '1896 ~ Jul'
        }, {
            x: 46,
            y: 7,
            value: -0.068,
            name: '1896 ~ Aug'
        }, {
            x: 46,
            y: 8,
            value: -0.111,
            name: '1896 ~ Sep'
        }, {
            x: 46,
            y: 9,
            value: -0.13,
            name: '1896 ~ Oct'
        }, {
            x: 46,
            y: 10,
            value: -0.293,
            name: '1896 ~ Nov'
        }, {
            x: 46,
            y: 11,
            value: -0.032,
            name: '1896 ~ Dec'
        }, {
            x: 47,
            y: 0,
            value: -0.203,
            name: '1897 ~ Jan'
        }, {
            x: 47,
            y: 1,
            value: -0.124,
            name: '1897 ~ Feb'
        }, {
            x: 47,
            y: 2,
            value: -0.276,
            name: '1897 ~ Mar'
        }, {
            x: 47,
            y: 3,
            value: -0.07,
            name: '1897 ~ Apr'
        }, {
            x: 47,
            y: 4,
            value: -0.028,
            name: '1897 ~ May'
        }, {
            x: 47,
            y: 5,
            value: -0.162,
            name: '1897 ~ Jun'
        }, {
            x: 47,
            y: 6,
            value: -0.165,
            name: '1897 ~ Jul'
        }, {
            x: 47,
            y: 7,
            value: -0.16,
            name: '1897 ~ Aug'
        }, {
            x: 47,
            y: 8,
            value: -0.142,
            name: '1897 ~ Sep'
        }, {
            x: 47,
            y: 9,
            value: -0.262,
            name: '1897 ~ Oct'
        }, {
            x: 47,
            y: 10,
            value: -0.46,
            name: '1897 ~ Nov'
        }, {
            x: 47,
            y: 11,
            value: -0.484,
            name: '1897 ~ Dec'
        }, {
            x: 48,
            y: 0,
            value: -0.084,
            name: '1898 ~ Jan'
        }, {
            x: 48,
            y: 1,
            value: -0.378,
            name: '1898 ~ Feb'
        }, {
            x: 48,
            y: 2,
            value: -0.752,
            name: '1898 ~ Mar'
        }, {
            x: 48,
            y: 3,
            value: -0.569,
            name: '1898 ~ Apr'
        }, {
            x: 48,
            y: 4,
            value: -0.471,
            name: '1898 ~ May'
        }, {
            x: 48,
            y: 5,
            value: -0.322,
            name: '1898 ~ Jun'
        }, {
            x: 48,
            y: 6,
            value: -0.383,
            name: '1898 ~ Jul'
        }, {
            x: 48,
            y: 7,
            value: -0.309,
            name: '1898 ~ Aug'
        }, {
            x: 48,
            y: 8,
            value: -0.335,
            name: '1898 ~ Sep'
        }, {
            x: 48,
            y: 9,
            value: -0.561,
            name: '1898 ~ Oct'
        }, {
            x: 48,
            y: 10,
            value: -0.454,
            name: '1898 ~ Nov'
        }, {
            x: 48,
            y: 11,
            value: -0.361,
            name: '1898 ~ Dec'
        }, {
            x: 49,
            y: 0,
            value: -0.212,
            name: '1899 ~ Jan'
        }, {
            x: 49,
            y: 1,
            value: -0.501,
            name: '1899 ~ Feb'
        }, {
            x: 49,
            y: 2,
            value: -0.542,
            name: '1899 ~ Mar'
        }, {
            x: 49,
            y: 3,
            value: -0.347,
            name: '1899 ~ Apr'
        }, {
            x: 49,
            y: 4,
            value: -0.311,
            name: '1899 ~ May'
        }, {
            x: 49,
            y: 5,
            value: -0.392,
            name: '1899 ~ Jun'
        }, {
            x: 49,
            y: 6,
            value: -0.283,
            name: '1899 ~ Jul'
        }, {
            x: 49,
            y: 7,
            value: -0.15,
            name: '1899 ~ Aug'
        }, {
            x: 49,
            y: 8,
            value: -0.14,
            name: '1899 ~ Sep'
        }, {
            x: 49,
            y: 9,
            value: -0.189,
            name: '1899 ~ Oct'
        }, {
            x: 49,
            y: 10,
            value: 0.027,
            name: '1899 ~ Nov'
        }, {
            x: 49,
            y: 11,
            value: -0.457,
            name: '1899 ~ Dec'
        }, {
            x: 50,
            y: 0,
            value: -0.246,
            name: '1900 ~ Jan'
        }, {
            x: 50,
            y: 1,
            value: -0.164,
            name: '1900 ~ Feb'
        }, {
            x: 50,
            y: 2,
            value: -0.276,
            name: '1900 ~ Mar'
        }, {
            x: 50,
            y: 3,
            value: -0.252,
            name: '1900 ~ Apr'
        }, {
            x: 50,
            y: 4,
            value: -0.276,
            name: '1900 ~ May'
        }, {
            x: 50,
            y: 5,
            value: -0.184,
            name: '1900 ~ Jun'
        }, {
            x: 50,
            y: 6,
            value: -0.193,
            name: '1900 ~ Jul'
        }, {
            x: 50,
            y: 7,
            value: -0.184,
            name: '1900 ~ Aug'
        }, {
            x: 50,
            y: 8,
            value: -0.223,
            name: '1900 ~ Sep'
        }, {
            x: 50,
            y: 9,
            value: -0.06,
            name: '1900 ~ Oct'
        }, {
            x: 50,
            y: 10,
            value: -0.262,
            name: '1900 ~ Nov'
        }, {
            x: 50,
            y: 11,
            value: -0.087,
            name: '1900 ~ Dec'
        }, {
            x: 51,
            y: 0,
            value: -0.182,
            name: '1901 ~ Jan'
        }, {
            x: 51,
            y: 1,
            value: -0.27,
            name: '1901 ~ Feb'
        }, {
            x: 51,
            y: 2,
            value: -0.246,
            name: '1901 ~ Mar'
        }, {
            x: 51,
            y: 3,
            value: -0.193,
            name: '1901 ~ Apr'
        }, {
            x: 51,
            y: 4,
            value: -0.197,
            name: '1901 ~ May'
        }, {
            x: 51,
            y: 5,
            value: -0.159,
            name: '1901 ~ Jun'
        }, {
            x: 51,
            y: 6,
            value: -0.194,
            name: '1901 ~ Jul'
        }, {
            x: 51,
            y: 7,
            value: -0.199,
            name: '1901 ~ Aug'
        }, {
            x: 51,
            y: 8,
            value: -0.349,
            name: '1901 ~ Sep'
        }, {
            x: 51,
            y: 9,
            value: -0.298,
            name: '1901 ~ Oct'
        }, {
            x: 51,
            y: 10,
            value: -0.446,
            name: '1901 ~ Nov'
        }, {
            x: 51,
            y: 11,
            value: -0.442,
            name: '1901 ~ Dec'
        }, {
            x: 52,
            y: 0,
            value: -0.239,
            name: '1902 ~ Jan'
        }, {
            x: 52,
            y: 1,
            value: -0.27,
            name: '1902 ~ Feb'
        }, {
            x: 52,
            y: 2,
            value: -0.393,
            name: '1902 ~ Mar'
        }, {
            x: 52,
            y: 3,
            value: -0.449,
            name: '1902 ~ Apr'
        }, {
            x: 52,
            y: 4,
            value: -0.405,
            name: '1902 ~ May'
        }, {
            x: 52,
            y: 5,
            value: -0.449,
            name: '1902 ~ Jun'
        }, {
            x: 52,
            y: 6,
            value: -0.392,
            name: '1902 ~ Jul'
        }, {
            x: 52,
            y: 7,
            value: -0.369,
            name: '1902 ~ Aug'
        }, {
            x: 52,
            y: 8,
            value: -0.37,
            name: '1902 ~ Sep'
        }, {
            x: 52,
            y: 9,
            value: -0.486,
            name: '1902 ~ Oct'
        }, {
            x: 52,
            y: 10,
            value: -0.534,
            name: '1902 ~ Nov'
        }, {
            x: 52,
            y: 11,
            value: -0.524,
            name: '1902 ~ Dec'
        }, {
            x: 53,
            y: 0,
            value: -0.274,
            name: '1903 ~ Jan'
        }, {
            x: 53,
            y: 1,
            value: -0.204,
            name: '1903 ~ Feb'
        }, {
            x: 53,
            y: 2,
            value: -0.355,
            name: '1903 ~ Mar'
        }, {
            x: 53,
            y: 3,
            value: -0.472,
            name: '1903 ~ Apr'
        }, {
            x: 53,
            y: 4,
            value: -0.464,
            name: '1903 ~ May'
        }, {
            x: 53,
            y: 5,
            value: -0.551,
            name: '1903 ~ Jun'
        }, {
            x: 53,
            y: 6,
            value: -0.496,
            name: '1903 ~ Jul'
        }, {
            x: 53,
            y: 7,
            value: -0.593,
            name: '1903 ~ Aug'
        }, {
            x: 53,
            y: 8,
            value: -0.528,
            name: '1903 ~ Sep'
        }, {
            x: 53,
            y: 9,
            value: -0.658,
            name: '1903 ~ Oct'
        }, {
            x: 53,
            y: 10,
            value: -0.627,
            name: '1903 ~ Nov'
        }, {
            x: 53,
            y: 11,
            value: -0.604,
            name: '1903 ~ Dec'
        }, {
            x: 54,
            y: 0,
            value: -0.641,
            name: '1904 ~ Jan'
        }, {
            x: 54,
            y: 1,
            value: -0.603,
            name: '1904 ~ Feb'
        }, {
            x: 54,
            y: 2,
            value: -0.659,
            name: '1904 ~ Mar'
        }, {
            x: 54,
            y: 3,
            value: -0.553,
            name: '1904 ~ Apr'
        }, {
            x: 54,
            y: 4,
            value: -0.538,
            name: '1904 ~ May'
        }, {
            x: 54,
            y: 5,
            value: -0.526,
            name: '1904 ~ Jun'
        }, {
            x: 54,
            y: 6,
            value: -0.53,
            name: '1904 ~ Jul'
        }, {
            x: 54,
            y: 7,
            value: -0.483,
            name: '1904 ~ Aug'
        }, {
            x: 54,
            y: 8,
            value: -0.485,
            name: '1904 ~ Sep'
        }, {
            x: 54,
            y: 9,
            value: -0.48,
            name: '1904 ~ Oct'
        }, {
            x: 54,
            y: 10,
            value: -0.386,
            name: '1904 ~ Nov'
        }, {
            x: 54,
            y: 11,
            value: -0.417,
            name: '1904 ~ Dec'
        }, {
            x: 55,
            y: 0,
            value: -0.471,
            name: '1905 ~ Jan'
        }, {
            x: 55,
            y: 1,
            value: -0.697,
            name: '1905 ~ Feb'
        }, {
            x: 55,
            y: 2,
            value: -0.461,
            name: '1905 ~ Mar'
        }, {
            x: 55,
            y: 3,
            value: -0.555,
            name: '1905 ~ Apr'
        }, {
            x: 55,
            y: 4,
            value: -0.343,
            name: '1905 ~ May'
        }, {
            x: 55,
            y: 5,
            value: -0.329,
            name: '1905 ~ Jun'
        }, {
            x: 55,
            y: 6,
            value: -0.298,
            name: '1905 ~ Jul'
        }, {
            x: 55,
            y: 7,
            value: -0.309,
            name: '1905 ~ Aug'
        }, {
            x: 55,
            y: 8,
            value: -0.322,
            name: '1905 ~ Sep'
        }, {
            x: 55,
            y: 9,
            value: -0.37,
            name: '1905 ~ Oct'
        }, {
            x: 55,
            y: 10,
            value: -0.224,
            name: '1905 ~ Nov'
        }, {
            x: 55,
            y: 11,
            value: -0.205,
            name: '1905 ~ Dec'
        }, {
            x: 56,
            y: 0,
            value: -0.073,
            name: '1906 ~ Jan'
        }, {
            x: 56,
            y: 1,
            value: -0.238,
            name: '1906 ~ Feb'
        }, {
            x: 56,
            y: 2,
            value: -0.293,
            name: '1906 ~ Mar'
        }, {
            x: 56,
            y: 3,
            value: -0.114,
            name: '1906 ~ Apr'
        }, {
            x: 56,
            y: 4,
            value: -0.336,
            name: '1906 ~ May'
        }, {
            x: 56,
            y: 5,
            value: -0.296,
            name: '1906 ~ Jun'
        }, {
            x: 56,
            y: 6,
            value: -0.321,
            name: '1906 ~ Jul'
        }, {
            x: 56,
            y: 7,
            value: -0.324,
            name: '1906 ~ Aug'
        }, {
            x: 56,
            y: 8,
            value: -0.388,
            name: '1906 ~ Sep'
        }, {
            x: 56,
            y: 9,
            value: -0.353,
            name: '1906 ~ Oct'
        }, {
            x: 56,
            y: 10,
            value: -0.43,
            name: '1906 ~ Nov'
        }, {
            x: 56,
            y: 11,
            value: -0.283,
            name: '1906 ~ Dec'
        }, {
            x: 57,
            y: 0,
            value: -0.443,
            name: '1907 ~ Jan'
        }, {
            x: 57,
            y: 1,
            value: -0.519,
            name: '1907 ~ Feb'
        }, {
            x: 57,
            y: 2,
            value: -0.343,
            name: '1907 ~ Mar'
        }, {
            x: 57,
            y: 3,
            value: -0.508,
            name: '1907 ~ Apr'
        }, {
            x: 57,
            y: 4,
            value: -0.552,
            name: '1907 ~ May'
        }, {
            x: 57,
            y: 5,
            value: -0.528,
            name: '1907 ~ Jun'
        }, {
            x: 57,
            y: 6,
            value: -0.407,
            name: '1907 ~ Jul'
        }, {
            x: 57,
            y: 7,
            value: -0.461,
            name: '1907 ~ Aug'
        }, {
            x: 57,
            y: 8,
            value: -0.413,
            name: '1907 ~ Sep'
        }, {
            x: 57,
            y: 9,
            value: -0.359,
            name: '1907 ~ Oct'
        }, {
            x: 57,
            y: 10,
            value: -0.581,
            name: '1907 ~ Nov'
        }, {
            x: 57,
            y: 11,
            value: -0.535,
            name: '1907 ~ Dec'
        }, {
            x: 58,
            y: 0,
            value: -0.423,
            name: '1908 ~ Jan'
        }, {
            x: 58,
            y: 1,
            value: -0.417,
            name: '1908 ~ Feb'
        }, {
            x: 58,
            y: 2,
            value: -0.636,
            name: '1908 ~ Mar'
        }, {
            x: 58,
            y: 3,
            value: -0.545,
            name: '1908 ~ Apr'
        }, {
            x: 58,
            y: 4,
            value: -0.474,
            name: '1908 ~ May'
        }, {
            x: 58,
            y: 5,
            value: -0.478,
            name: '1908 ~ Jun'
        }, {
            x: 58,
            y: 6,
            value: -0.478,
            name: '1908 ~ Jul'
        }, {
            x: 58,
            y: 7,
            value: -0.539,
            name: '1908 ~ Aug'
        }, {
            x: 58,
            y: 8,
            value: -0.458,
            name: '1908 ~ Sep'
        }, {
            x: 58,
            y: 9,
            value: -0.586,
            name: '1908 ~ Oct'
        }, {
            x: 58,
            y: 10,
            value: -0.595,
            name: '1908 ~ Nov'
        }, {
            x: 58,
            y: 11,
            value: -0.577,
            name: '1908 ~ Dec'
        }, {
            x: 59,
            y: 0,
            value: -0.583,
            name: '1909 ~ Jan'
        }, {
            x: 59,
            y: 1,
            value: -0.543,
            name: '1909 ~ Feb'
        }, {
            x: 59,
            y: 2,
            value: -0.689,
            name: '1909 ~ Mar'
        }, {
            x: 59,
            y: 3,
            value: -0.609,
            name: '1909 ~ Apr'
        }, {
            x: 59,
            y: 4,
            value: -0.589,
            name: '1909 ~ May'
        }, {
            x: 59,
            y: 5,
            value: -0.52,
            name: '1909 ~ Jun'
        }, {
            x: 59,
            y: 6,
            value: -0.585,
            name: '1909 ~ Jul'
        }, {
            x: 59,
            y: 7,
            value: -0.325,
            name: '1909 ~ Aug'
        }, {
            x: 59,
            y: 8,
            value: -0.402,
            name: '1909 ~ Sep'
        }, {
            x: 59,
            y: 9,
            value: -0.48,
            name: '1909 ~ Oct'
        }, {
            x: 59,
            y: 10,
            value: -0.432,
            name: '1909 ~ Nov'
        }, {
            x: 59,
            y: 11,
            value: -0.6,
            name: '1909 ~ Dec'
        }, {
            x: 60,
            y: 0,
            value: -0.359,
            name: '1910 ~ Jan'
        }, {
            x: 60,
            y: 1,
            value: -0.517,
            name: '1910 ~ Feb'
        }, {
            x: 60,
            y: 2,
            value: -0.485,
            name: '1910 ~ Mar'
        }, {
            x: 60,
            y: 3,
            value: -0.453,
            name: '1910 ~ Apr'
        }, {
            x: 60,
            y: 4,
            value: -0.473,
            name: '1910 ~ May'
        }, {
            x: 60,
            y: 5,
            value: -0.486,
            name: '1910 ~ Jun'
        }, {
            x: 60,
            y: 6,
            value: -0.469,
            name: '1910 ~ Jul'
        }, {
            x: 60,
            y: 7,
            value: -0.443,
            name: '1910 ~ Aug'
        }, {
            x: 60,
            y: 8,
            value: -0.443,
            name: '1910 ~ Sep'
        }, {
            x: 60,
            y: 9,
            value: -0.484,
            name: '1910 ~ Oct'
        }, {
            x: 60,
            y: 10,
            value: -0.653,
            name: '1910 ~ Nov'
        }, {
            x: 60,
            y: 11,
            value: -0.669,
            name: '1910 ~ Dec'
        }, {
            x: 61,
            y: 0,
            value: -0.558,
            name: '1911 ~ Jan'
        }, {
            x: 61,
            y: 1,
            value: -0.767,
            name: '1911 ~ Feb'
        }, {
            x: 61,
            y: 2,
            value: -0.701,
            name: '1911 ~ Mar'
        }, {
            x: 61,
            y: 3,
            value: -0.719,
            name: '1911 ~ Apr'
        }, {
            x: 61,
            y: 4,
            value: -0.602,
            name: '1911 ~ May'
        }, {
            x: 61,
            y: 5,
            value: -0.574,
            name: '1911 ~ Jun'
        }, {
            x: 61,
            y: 6,
            value: -0.516,
            name: '1911 ~ Jul'
        }, {
            x: 61,
            y: 7,
            value: -0.501,
            name: '1911 ~ Aug'
        }, {
            x: 61,
            y: 8,
            value: -0.511,
            name: '1911 ~ Sep'
        }, {
            x: 61,
            y: 9,
            value: -0.465,
            name: '1911 ~ Oct'
        }, {
            x: 61,
            y: 10,
            value: -0.378,
            name: '1911 ~ Nov'
        }, {
            x: 61,
            y: 11,
            value: -0.291,
            name: '1911 ~ Dec'
        }, {
            x: 62,
            y: 0,
            value: -0.362,
            name: '1912 ~ Jan'
        }, {
            x: 62,
            y: 1,
            value: -0.297,
            name: '1912 ~ Feb'
        }, {
            x: 62,
            y: 2,
            value: -0.385,
            name: '1912 ~ Mar'
        }, {
            x: 62,
            y: 3,
            value: -0.336,
            name: '1912 ~ Apr'
        }, {
            x: 62,
            y: 4,
            value: -0.377,
            name: '1912 ~ May'
        }, {
            x: 62,
            y: 5,
            value: -0.32,
            name: '1912 ~ Jun'
        }, {
            x: 62,
            y: 6,
            value: -0.458,
            name: '1912 ~ Jul'
        }, {
            x: 62,
            y: 7,
            value: -0.561,
            name: '1912 ~ Aug'
        }, {
            x: 62,
            y: 8,
            value: -0.563,
            name: '1912 ~ Sep'
        }, {
            x: 62,
            y: 9,
            value: -0.643,
            name: '1912 ~ Oct'
        }, {
            x: 62,
            y: 10,
            value: -0.515,
            name: '1912 ~ Nov'
        }, {
            x: 62,
            y: 11,
            value: -0.487,
            name: '1912 ~ Dec'
        }, {
            x: 63,
            y: 0,
            value: -0.465,
            name: '1913 ~ Jan'
        }, {
            x: 63,
            y: 1,
            value: -0.515,
            name: '1913 ~ Feb'
        }, {
            x: 63,
            y: 2,
            value: -0.534,
            name: '1913 ~ Mar'
        }, {
            x: 63,
            y: 3,
            value: -0.433,
            name: '1913 ~ Apr'
        }, {
            x: 63,
            y: 4,
            value: -0.509,
            name: '1913 ~ May'
        }, {
            x: 63,
            y: 5,
            value: -0.51,
            name: '1913 ~ Jun'
        }, {
            x: 63,
            y: 6,
            value: -0.443,
            name: '1913 ~ Jul'
        }, {
            x: 63,
            y: 7,
            value: -0.395,
            name: '1913 ~ Aug'
        }, {
            x: 63,
            y: 8,
            value: -0.428,
            name: '1913 ~ Sep'
        }, {
            x: 63,
            y: 9,
            value: -0.429,
            name: '1913 ~ Oct'
        }, {
            x: 63,
            y: 10,
            value: -0.27,
            name: '1913 ~ Nov'
        }, {
            x: 63,
            y: 11,
            value: -0.238,
            name: '1913 ~ Dec'
        }, {
            x: 64,
            y: 0,
            value: -0.092,
            name: '1914 ~ Jan'
        }, {
            x: 64,
            y: 1,
            value: -0.226,
            name: '1914 ~ Feb'
        }, {
            x: 64,
            y: 2,
            value: -0.335,
            name: '1914 ~ Mar'
        }, {
            x: 64,
            y: 3,
            value: -0.388,
            name: '1914 ~ Apr'
        }, {
            x: 64,
            y: 4,
            value: -0.28,
            name: '1914 ~ May'
        }, {
            x: 64,
            y: 5,
            value: -0.29,
            name: '1914 ~ Jun'
        }, {
            x: 64,
            y: 6,
            value: -0.337,
            name: '1914 ~ Jul'
        }, {
            x: 64,
            y: 7,
            value: -0.215,
            name: '1914 ~ Aug'
        }, {
            x: 64,
            y: 8,
            value: -0.261,
            name: '1914 ~ Sep'
        }, {
            x: 64,
            y: 9,
            value: -0.153,
            name: '1914 ~ Oct'
        }, {
            x: 64,
            y: 10,
            value: -0.176,
            name: '1914 ~ Nov'
        }, {
            x: 64,
            y: 11,
            value: -0.245,
            name: '1914 ~ Dec'
        }, {
            x: 65,
            y: 0,
            value: -0.117,
            name: '1915 ~ Jan'
        }, {
            x: 65,
            y: 1,
            value: -0.057,
            name: '1915 ~ Feb'
        }, {
            x: 65,
            y: 2,
            value: -0.193,
            name: '1915 ~ Mar'
        }, {
            x: 65,
            y: 3,
            value: -0.056,
            name: '1915 ~ Apr'
        }, {
            x: 65,
            y: 4,
            value: -0.218,
            name: '1915 ~ May'
        }, {
            x: 65,
            y: 5,
            value: -0.221,
            name: '1915 ~ Jun'
        }, {
            x: 65,
            y: 6,
            value: -0.118,
            name: '1915 ~ Jul'
        }, {
            x: 65,
            y: 7,
            value: -0.076,
            name: '1915 ~ Aug'
        }, {
            x: 65,
            y: 8,
            value: -0.141,
            name: '1915 ~ Sep'
        }, {
            x: 65,
            y: 9,
            value: -0.259,
            name: '1915 ~ Oct'
        }, {
            x: 65,
            y: 10,
            value: -0.14,
            name: '1915 ~ Nov'
        }, {
            x: 65,
            y: 11,
            value: -0.256,
            name: '1915 ~ Dec'
        }, {
            x: 66,
            y: 0,
            value: -0.245,
            name: '1916 ~ Jan'
        }, {
            x: 66,
            y: 1,
            value: -0.186,
            name: '1916 ~ Feb'
        }, {
            x: 66,
            y: 2,
            value: -0.405,
            name: '1916 ~ Mar'
        }, {
            x: 66,
            y: 3,
            value: -0.344,
            name: '1916 ~ Apr'
        }, {
            x: 66,
            y: 4,
            value: -0.363,
            name: '1916 ~ May'
        }, {
            x: 66,
            y: 5,
            value: -0.473,
            name: '1916 ~ Jun'
        }, {
            x: 66,
            y: 6,
            value: -0.38,
            name: '1916 ~ Jul'
        }, {
            x: 66,
            y: 7,
            value: -0.348,
            name: '1916 ~ Aug'
        }, {
            x: 66,
            y: 8,
            value: -0.343,
            name: '1916 ~ Sep'
        }, {
            x: 66,
            y: 9,
            value: -0.403,
            name: '1916 ~ Oct'
        }, {
            x: 66,
            y: 10,
            value: -0.573,
            name: '1916 ~ Nov'
        }, {
            x: 66,
            y: 11,
            value: -0.627,
            name: '1916 ~ Dec'
        }, {
            x: 67,
            y: 0,
            value: -0.684,
            name: '1917 ~ Jan'
        }, {
            x: 67,
            y: 1,
            value: -0.762,
            name: '1917 ~ Feb'
        }, {
            x: 67,
            y: 2,
            value: -0.826,
            name: '1917 ~ Mar'
        }, {
            x: 67,
            y: 3,
            value: -0.476,
            name: '1917 ~ Apr'
        }, {
            x: 67,
            y: 4,
            value: -0.655,
            name: '1917 ~ May'
        }, {
            x: 67,
            y: 5,
            value: -0.351,
            name: '1917 ~ Jun'
        }, {
            x: 67,
            y: 6,
            value: -0.12,
            name: '1917 ~ Jul'
        }, {
            x: 67,
            y: 7,
            value: -0.223,
            name: '1917 ~ Aug'
        }, {
            x: 67,
            y: 8,
            value: -0.123,
            name: '1917 ~ Sep'
        }, {
            x: 67,
            y: 9,
            value: -0.39,
            name: '1917 ~ Oct'
        }, {
            x: 67,
            y: 10,
            value: -0.396,
            name: '1917 ~ Nov'
        }, {
            x: 67,
            y: 11,
            value: -0.624,
            name: '1917 ~ Dec'
        }, {
            x: 68,
            y: 0,
            value: -0.505,
            name: '1918 ~ Jan'
        }, {
            x: 68,
            y: 1,
            value: -0.524,
            name: '1918 ~ Feb'
        }, {
            x: 68,
            y: 2,
            value: -0.446,
            name: '1918 ~ Mar'
        }, {
            x: 68,
            y: 3,
            value: -0.492,
            name: '1918 ~ Apr'
        }, {
            x: 68,
            y: 4,
            value: -0.424,
            name: '1918 ~ May'
        }, {
            x: 68,
            y: 5,
            value: -0.332,
            name: '1918 ~ Jun'
        }, {
            x: 68,
            y: 6,
            value: -0.342,
            name: '1918 ~ Jul'
        }, {
            x: 68,
            y: 7,
            value: -0.364,
            name: '1918 ~ Aug'
        }, {
            x: 68,
            y: 8,
            value: -0.238,
            name: '1918 ~ Sep'
        }, {
            x: 68,
            y: 9,
            value: -0.098,
            name: '1918 ~ Oct'
        }, {
            x: 68,
            y: 10,
            value: -0.033,
            name: '1918 ~ Nov'
        }, {
            x: 68,
            y: 11,
            value: -0.227,
            name: '1918 ~ Dec'
        }, {
            x: 69,
            y: 0,
            value: -0.098,
            name: '1919 ~ Jan'
        }, {
            x: 69,
            y: 1,
            value: -0.079,
            name: '1919 ~ Feb'
        }, {
            x: 69,
            y: 2,
            value: -0.302,
            name: '1919 ~ Mar'
        }, {
            x: 69,
            y: 3,
            value: -0.074,
            name: '1919 ~ Apr'
        }, {
            x: 69,
            y: 4,
            value: -0.265,
            name: '1919 ~ May'
        }, {
            x: 69,
            y: 5,
            value: -0.252,
            name: '1919 ~ Jun'
        }, {
            x: 69,
            y: 6,
            value: -0.364,
            name: '1919 ~ Jul'
        }, {
            x: 69,
            y: 7,
            value: -0.33,
            name: '1919 ~ Aug'
        }, {
            x: 69,
            y: 8,
            value: -0.232,
            name: '1919 ~ Sep'
        }, {
            x: 69,
            y: 9,
            value: -0.305,
            name: '1919 ~ Oct'
        }, {
            x: 69,
            y: 10,
            value: -0.531,
            name: '1919 ~ Nov'
        }, {
            x: 69,
            y: 11,
            value: -0.456,
            name: '1919 ~ Dec'
        }, {
            x: 70,
            y: 0,
            value: -0.244,
            name: '1920 ~ Jan'
        }, {
            x: 70,
            y: 1,
            value: -0.425,
            name: '1920 ~ Feb'
        }, {
            x: 70,
            y: 2,
            value: -0.123,
            name: '1920 ~ Mar'
        }, {
            x: 70,
            y: 3,
            value: -0.265,
            name: '1920 ~ Apr'
        }, {
            x: 70,
            y: 4,
            value: -0.191,
            name: '1920 ~ May'
        }, {
            x: 70,
            y: 5,
            value: -0.215,
            name: '1920 ~ Jun'
        }, {
            x: 70,
            y: 6,
            value: -0.291,
            name: '1920 ~ Jul'
        }, {
            x: 70,
            y: 7,
            value: -0.231,
            name: '1920 ~ Aug'
        }, {
            x: 70,
            y: 8,
            value: -0.137,
            name: '1920 ~ Sep'
        }, {
            x: 70,
            y: 9,
            value: -0.224,
            name: '1920 ~ Oct'
        }, {
            x: 70,
            y: 10,
            value: -0.284,
            name: '1920 ~ Nov'
        }, {
            x: 70,
            y: 11,
            value: -0.345,
            name: '1920 ~ Dec'
        }, {
            x: 71,
            y: 0,
            value: -0.137,
            name: '1921 ~ Jan'
        }, {
            x: 71,
            y: 1,
            value: -0.179,
            name: '1921 ~ Feb'
        }, {
            x: 71,
            y: 2,
            value: -0.251,
            name: '1921 ~ Mar'
        }, {
            x: 71,
            y: 3,
            value: -0.228,
            name: '1921 ~ Apr'
        }, {
            x: 71,
            y: 4,
            value: -0.204,
            name: '1921 ~ May'
        }, {
            x: 71,
            y: 5,
            value: -0.117,
            name: '1921 ~ Jun'
        }, {
            x: 71,
            y: 6,
            value: -0.138,
            name: '1921 ~ Jul'
        }, {
            x: 71,
            y: 7,
            value: -0.279,
            name: '1921 ~ Aug'
        }, {
            x: 71,
            y: 8,
            value: -0.162,
            name: '1921 ~ Sep'
        }, {
            x: 71,
            y: 9,
            value: -0.139,
            name: '1921 ~ Oct'
        }, {
            x: 71,
            y: 10,
            value: -0.301,
            name: '1921 ~ Nov'
        }, {
            x: 71,
            y: 11,
            value: -0.153,
            name: '1921 ~ Dec'
        }, {
            x: 72,
            y: 0,
            value: -0.398,
            name: '1922 ~ Jan'
        }, {
            x: 72,
            y: 1,
            value: -0.273,
            name: '1922 ~ Feb'
        }, {
            x: 72,
            y: 2,
            value: -0.269,
            name: '1922 ~ Mar'
        }, {
            x: 72,
            y: 3,
            value: -0.235,
            name: '1922 ~ Apr'
        }, {
            x: 72,
            y: 4,
            value: -0.382,
            name: '1922 ~ May'
        }, {
            x: 72,
            y: 5,
            value: -0.32,
            name: '1922 ~ Jun'
        }, {
            x: 72,
            y: 6,
            value: -0.229,
            name: '1922 ~ Jul'
        }, {
            x: 72,
            y: 7,
            value: -0.347,
            name: '1922 ~ Aug'
        }, {
            x: 72,
            y: 8,
            value: -0.283,
            name: '1922 ~ Sep'
        }, {
            x: 72,
            y: 9,
            value: -0.322,
            name: '1922 ~ Oct'
        }, {
            x: 72,
            y: 10,
            value: -0.288,
            name: '1922 ~ Nov'
        }, {
            x: 72,
            y: 11,
            value: -0.304,
            name: '1922 ~ Dec'
        }, {
            x: 73,
            y: 0,
            value: -0.23,
            name: '1923 ~ Jan'
        }, {
            x: 73,
            y: 1,
            value: -0.414,
            name: '1923 ~ Feb'
        }, {
            x: 73,
            y: 2,
            value: -0.408,
            name: '1923 ~ Mar'
        }, {
            x: 73,
            y: 3,
            value: -0.361,
            name: '1923 ~ Apr'
        }, {
            x: 73,
            y: 4,
            value: -0.321,
            name: '1923 ~ May'
        }, {
            x: 73,
            y: 5,
            value: -0.244,
            name: '1923 ~ Jun'
        }, {
            x: 73,
            y: 6,
            value: -0.347,
            name: '1923 ~ Jul'
        }, {
            x: 73,
            y: 7,
            value: -0.378,
            name: '1923 ~ Aug'
        }, {
            x: 73,
            y: 8,
            value: -0.321,
            name: '1923 ~ Sep'
        }, {
            x: 73,
            y: 9,
            value: -0.264,
            name: '1923 ~ Oct'
        }, {
            x: 73,
            y: 10,
            value: -0.02,
            name: '1923 ~ Nov'
        }, {
            x: 73,
            y: 11,
            value: -0.004,
            name: '1923 ~ Dec'
        }, {
            x: 74,
            y: 0,
            value: -0.315,
            name: '1924 ~ Jan'
        }, {
            x: 74,
            y: 1,
            value: -0.202,
            name: '1924 ~ Feb'
        }, {
            x: 74,
            y: 2,
            value: -0.27,
            name: '1924 ~ Mar'
        }, {
            x: 74,
            y: 3,
            value: -0.28,
            name: '1924 ~ Apr'
        }, {
            x: 74,
            y: 4,
            value: -0.239,
            name: '1924 ~ May'
        }, {
            x: 74,
            y: 5,
            value: -0.216,
            name: '1924 ~ Jun'
        }, {
            x: 74,
            y: 6,
            value: -0.264,
            name: '1924 ~ Jul'
        }, {
            x: 74,
            y: 7,
            value: -0.276,
            name: '1924 ~ Aug'
        }, {
            x: 74,
            y: 8,
            value: -0.279,
            name: '1924 ~ Sep'
        }, {
            x: 74,
            y: 9,
            value: -0.313,
            name: '1924 ~ Oct'
        }, {
            x: 74,
            y: 10,
            value: -0.362,
            name: '1924 ~ Nov'
        }, {
            x: 74,
            y: 11,
            value: -0.526,
            name: '1924 ~ Dec'
        }, {
            x: 75,
            y: 0,
            value: -0.398,
            name: '1925 ~ Jan'
        }, {
            x: 75,
            y: 1,
            value: -0.305,
            name: '1925 ~ Feb'
        }, {
            x: 75,
            y: 2,
            value: -0.223,
            name: '1925 ~ Mar'
        }, {
            x: 75,
            y: 3,
            value: -0.276,
            name: '1925 ~ Apr'
        }, {
            x: 75,
            y: 4,
            value: -0.258,
            name: '1925 ~ May'
        }, {
            x: 75,
            y: 5,
            value: -0.254,
            name: '1925 ~ Jun'
        }, {
            x: 75,
            y: 6,
            value: -0.217,
            name: '1925 ~ Jul'
        }, {
            x: 75,
            y: 7,
            value: -0.13,
            name: '1925 ~ Aug'
        }, {
            x: 75,
            y: 8,
            value: -0.189,
            name: '1925 ~ Sep'
        }, {
            x: 75,
            y: 9,
            value: -0.305,
            name: '1925 ~ Oct'
        }, {
            x: 75,
            y: 10,
            value: -0.056,
            name: '1925 ~ Nov'
        }, {
            x: 75,
            y: 11,
            value: 0.007,
            name: '1925 ~ Dec'
        }, {
            x: 76,
            y: 0,
            value: 0.09,
            name: '1926 ~ Jan'
        }, {
            x: 76,
            y: 1,
            value: -0.042,
            name: '1926 ~ Feb'
        }, {
            x: 76,
            y: 2,
            value: -0.022,
            name: '1926 ~ Mar'
        }, {
            x: 76,
            y: 3,
            value: -0.169,
            name: '1926 ~ Apr'
        }, {
            x: 76,
            y: 4,
            value: -0.219,
            name: '1926 ~ May'
        }, {
            x: 76,
            y: 5,
            value: -0.092,
            name: '1926 ~ Jun'
        }, {
            x: 76,
            y: 6,
            value: -0.235,
            name: '1926 ~ Jul'
        }, {
            x: 76,
            y: 7,
            value: -0.087,
            name: '1926 ~ Aug'
        }, {
            x: 76,
            y: 8,
            value: -0.104,
            name: '1926 ~ Sep'
        }, {
            x: 76,
            y: 9,
            value: -0.085,
            name: '1926 ~ Oct'
        }, {
            x: 76,
            y: 10,
            value: -0.109,
            name: '1926 ~ Nov'
        }, {
            x: 76,
            y: 11,
            value: -0.234,
            name: '1926 ~ Dec'
        }, {
            x: 77,
            y: 0,
            value: -0.254,
            name: '1927 ~ Jan'
        }, {
            x: 77,
            y: 1,
            value: -0.146,
            name: '1927 ~ Feb'
        }, {
            x: 77,
            y: 2,
            value: -0.326,
            name: '1927 ~ Mar'
        }, {
            x: 77,
            y: 3,
            value: -0.26,
            name: '1927 ~ Apr'
        }, {
            x: 77,
            y: 4,
            value: -0.259,
            name: '1927 ~ May'
        }, {
            x: 77,
            y: 5,
            value: -0.238,
            name: '1927 ~ Jun'
        }, {
            x: 77,
            y: 6,
            value: -0.146,
            name: '1927 ~ Jul'
        }, {
            x: 77,
            y: 7,
            value: -0.144,
            name: '1927 ~ Aug'
        }, {
            x: 77,
            y: 8,
            value: -0.132,
            name: '1927 ~ Sep'
        }, {
            x: 77,
            y: 9,
            value: -0.04,
            name: '1927 ~ Oct'
        }, {
            x: 77,
            y: 10,
            value: -0.173,
            name: '1927 ~ Nov'
        }, {
            x: 77,
            y: 11,
            value: -0.425,
            name: '1927 ~ Dec'
        }, {
            x: 78,
            y: 0,
            value: -0.05,
            name: '1928 ~ Jan'
        }, {
            x: 78,
            y: 1,
            value: -0.138,
            name: '1928 ~ Feb'
        }, {
            x: 78,
            y: 2,
            value: -0.339,
            name: '1928 ~ Mar'
        }, {
            x: 78,
            y: 3,
            value: -0.255,
            name: '1928 ~ Apr'
        }, {
            x: 78,
            y: 4,
            value: -0.286,
            name: '1928 ~ May'
        }, {
            x: 78,
            y: 5,
            value: -0.344,
            name: '1928 ~ Jun'
        }, {
            x: 78,
            y: 6,
            value: -0.165,
            name: '1928 ~ Jul'
        }, {
            x: 78,
            y: 7,
            value: -0.176,
            name: '1928 ~ Aug'
        }, {
            x: 78,
            y: 8,
            value: -0.223,
            name: '1928 ~ Sep'
        }, {
            x: 78,
            y: 9,
            value: -0.169,
            name: '1928 ~ Oct'
        }, {
            x: 78,
            y: 10,
            value: -0.157,
            name: '1928 ~ Nov'
        }, {
            x: 78,
            y: 11,
            value: -0.235,
            name: '1928 ~ Dec'
        }, {
            x: 79,
            y: 0,
            value: -0.479,
            name: '1929 ~ Jan'
        }, {
            x: 79,
            y: 1,
            value: -0.666,
            name: '1929 ~ Feb'
        }, {
            x: 79,
            y: 2,
            value: -0.406,
            name: '1929 ~ Mar'
        }, {
            x: 79,
            y: 3,
            value: -0.389,
            name: '1929 ~ Apr'
        }, {
            x: 79,
            y: 4,
            value: -0.389,
            name: '1929 ~ May'
        }, {
            x: 79,
            y: 5,
            value: -0.35,
            name: '1929 ~ Jun'
        }, {
            x: 79,
            y: 6,
            value: -0.362,
            name: '1929 ~ Jul'
        }, {
            x: 79,
            y: 7,
            value: -0.189,
            name: '1929 ~ Aug'
        }, {
            x: 79,
            y: 8,
            value: -0.267,
            name: '1929 ~ Sep'
        }, {
            x: 79,
            y: 9,
            value: -0.18,
            name: '1929 ~ Oct'
        }, {
            x: 79,
            y: 10,
            value: -0.074,
            name: '1929 ~ Nov'
        }, {
            x: 79,
            y: 11,
            value: -0.473,
            name: '1929 ~ Dec'
        }, {
            x: 80,
            y: 0,
            value: -0.33,
            name: '1930 ~ Jan'
        }, {
            x: 80,
            y: 1,
            value: -0.293,
            name: '1930 ~ Feb'
        }, {
            x: 80,
            y: 2,
            value: -0.155,
            name: '1930 ~ Mar'
        }, {
            x: 80,
            y: 3,
            value: -0.193,
            name: '1930 ~ Apr'
        }, {
            x: 80,
            y: 4,
            value: -0.197,
            name: '1930 ~ May'
        }, {
            x: 80,
            y: 5,
            value: -0.162,
            name: '1930 ~ Jun'
        }, {
            x: 80,
            y: 6,
            value: -0.12,
            name: '1930 ~ Jul'
        }, {
            x: 80,
            y: 7,
            value: -0.057,
            name: '1930 ~ Aug'
        }, {
            x: 80,
            y: 8,
            value: -0.078,
            name: '1930 ~ Sep'
        }, {
            x: 80,
            y: 9,
            value: -0.093,
            name: '1930 ~ Oct'
        }, {
            x: 80,
            y: 10,
            value: 0.076,
            name: '1930 ~ Nov'
        }, {
            x: 80,
            y: 11,
            value: -0.072,
            name: '1930 ~ Dec'
        }, {
            x: 81,
            y: 0,
            value: -0.002,
            name: '1931 ~ Jan'
        }, {
            x: 81,
            y: 1,
            value: -0.151,
            name: '1931 ~ Feb'
        }, {
            x: 81,
            y: 2,
            value: -0.12,
            name: '1931 ~ Mar'
        }, {
            x: 81,
            y: 3,
            value: -0.18,
            name: '1931 ~ Apr'
        }, {
            x: 81,
            y: 4,
            value: -0.165,
            name: '1931 ~ May'
        }, {
            x: 81,
            y: 5,
            value: -0.036,
            name: '1931 ~ Jun'
        }, {
            x: 81,
            y: 6,
            value: 0.007,
            name: '1931 ~ Jul'
        }, {
            x: 81,
            y: 7,
            value: -0.047,
            name: '1931 ~ Aug'
        }, {
            x: 81,
            y: 8,
            value: -0.047,
            name: '1931 ~ Sep'
        }, {
            x: 81,
            y: 9,
            value: -0.04,
            name: '1931 ~ Oct'
        }, {
            x: 81,
            y: 10,
            value: -0.148,
            name: '1931 ~ Nov'
        }, {
            x: 81,
            y: 11,
            value: -0.101,
            name: '1931 ~ Dec'
        }, {
            x: 82,
            y: 0,
            value: 0.162,
            name: '1932 ~ Jan'
        }, {
            x: 82,
            y: 1,
            value: -0.191,
            name: '1932 ~ Feb'
        }, {
            x: 82,
            y: 2,
            value: -0.237,
            name: '1932 ~ Mar'
        }, {
            x: 82,
            y: 3,
            value: -0.066,
            name: '1932 ~ Apr'
        }, {
            x: 82,
            y: 4,
            value: -0.168,
            name: '1932 ~ May'
        }, {
            x: 82,
            y: 5,
            value: -0.194,
            name: '1932 ~ Jun'
        }, {
            x: 82,
            y: 6,
            value: -0.128,
            name: '1932 ~ Jul'
        }, {
            x: 82,
            y: 7,
            value: -0.196,
            name: '1932 ~ Aug'
        }, {
            x: 82,
            y: 8,
            value: -0.037,
            name: '1932 ~ Sep'
        }, {
            x: 82,
            y: 9,
            value: -0.172,
            name: '1932 ~ Oct'
        }, {
            x: 82,
            y: 10,
            value: -0.231,
            name: '1932 ~ Nov'
        }, {
            x: 82,
            y: 11,
            value: -0.192,
            name: '1932 ~ Dec'
        }, {
            x: 83,
            y: 0,
            value: -0.285,
            name: '1933 ~ Jan'
        }, {
            x: 83,
            y: 1,
            value: -0.315,
            name: '1933 ~ Feb'
        }, {
            x: 83,
            y: 2,
            value: -0.341,
            name: '1933 ~ Mar'
        }, {
            x: 83,
            y: 3,
            value: -0.218,
            name: '1933 ~ Apr'
        }, {
            x: 83,
            y: 4,
            value: -0.211,
            name: '1933 ~ May'
        }, {
            x: 83,
            y: 5,
            value: -0.26,
            name: '1933 ~ Jun'
        }, {
            x: 83,
            y: 6,
            value: -0.185,
            name: '1933 ~ Jul'
        }, {
            x: 83,
            y: 7,
            value: -0.176,
            name: '1933 ~ Aug'
        }, {
            x: 83,
            y: 8,
            value: -0.234,
            name: '1933 ~ Sep'
        }, {
            x: 83,
            y: 9,
            value: -0.198,
            name: '1933 ~ Oct'
        }, {
            x: 83,
            y: 10,
            value: -0.31,
            name: '1933 ~ Nov'
        }, {
            x: 83,
            y: 11,
            value: -0.525,
            name: '1933 ~ Dec'
        }, {
            x: 84,
            y: 0,
            value: -0.218,
            name: '1934 ~ Jan'
        }, {
            x: 84,
            y: 1,
            value: -0.16,
            name: '1934 ~ Feb'
        }, {
            x: 84,
            y: 2,
            value: -0.388,
            name: '1934 ~ Mar'
        }, {
            x: 84,
            y: 3,
            value: -0.249,
            name: '1934 ~ Apr'
        }, {
            x: 84,
            y: 4,
            value: -0.079,
            name: '1934 ~ May'
        }, {
            x: 84,
            y: 5,
            value: -0.042,
            name: '1934 ~ Jun'
        }, {
            x: 84,
            y: 6,
            value: -0.064,
            name: '1934 ~ Jul'
        }, {
            x: 84,
            y: 7,
            value: -0.058,
            name: '1934 ~ Aug'
        }, {
            x: 84,
            y: 8,
            value: -0.094,
            name: '1934 ~ Sep'
        }, {
            x: 84,
            y: 9,
            value: -0.084,
            name: '1934 ~ Oct'
        }, {
            x: 84,
            y: 10,
            value: 0.024,
            name: '1934 ~ Nov'
        }, {
            x: 84,
            y: 11,
            value: -0.132,
            name: '1934 ~ Dec'
        }, {
            x: 85,
            y: 0,
            value: -0.223,
            name: '1935 ~ Jan'
        }, {
            x: 85,
            y: 1,
            value: 0.105,
            name: '1935 ~ Feb'
        }, {
            x: 85,
            y: 2,
            value: -0.222,
            name: '1935 ~ Mar'
        }, {
            x: 85,
            y: 3,
            value: -0.267,
            name: '1935 ~ Apr'
        }, {
            x: 85,
            y: 4,
            value: -0.242,
            name: '1935 ~ May'
        }, {
            x: 85,
            y: 5,
            value: -0.185,
            name: '1935 ~ Jun'
        }, {
            x: 85,
            y: 6,
            value: -0.144,
            name: '1935 ~ Jul'
        }, {
            x: 85,
            y: 7,
            value: -0.153,
            name: '1935 ~ Aug'
        }, {
            x: 85,
            y: 8,
            value: -0.136,
            name: '1935 ~ Sep'
        }, {
            x: 85,
            y: 9,
            value: -0.076,
            name: '1935 ~ Oct'
        }, {
            x: 85,
            y: 10,
            value: -0.299,
            name: '1935 ~ Nov'
        }, {
            x: 85,
            y: 11,
            value: -0.264,
            name: '1935 ~ Dec'
        }, {
            x: 86,
            y: 0,
            value: -0.298,
            name: '1936 ~ Jan'
        }, {
            x: 86,
            y: 1,
            value: -0.354,
            name: '1936 ~ Feb'
        }, {
            x: 86,
            y: 2,
            value: -0.293,
            name: '1936 ~ Mar'
        }, {
            x: 86,
            y: 3,
            value: -0.202,
            name: '1936 ~ Apr'
        }, {
            x: 86,
            y: 4,
            value: -0.15,
            name: '1936 ~ May'
        }, {
            x: 86,
            y: 5,
            value: -0.162,
            name: '1936 ~ Jun'
        }, {
            x: 86,
            y: 6,
            value: -0.022,
            name: '1936 ~ Jul'
        }, {
            x: 86,
            y: 7,
            value: -0.043,
            name: '1936 ~ Aug'
        }, {
            x: 86,
            y: 8,
            value: -0.105,
            name: '1936 ~ Sep'
        }, {
            x: 86,
            y: 9,
            value: -0.003,
            name: '1936 ~ Oct'
        }, {
            x: 86,
            y: 10,
            value: -0.07,
            name: '1936 ~ Nov'
        }, {
            x: 86,
            y: 11,
            value: -0.009,
            name: '1936 ~ Dec'
        }, {
            x: 87,
            y: 0,
            value: -0.121,
            name: '1937 ~ Jan'
        }, {
            x: 87,
            y: 1,
            value: 0.039,
            name: '1937 ~ Feb'
        }, {
            x: 87,
            y: 2,
            value: -0.273,
            name: '1937 ~ Mar'
        }, {
            x: 87,
            y: 3,
            value: -0.128,
            name: '1937 ~ Apr'
        }, {
            x: 87,
            y: 4,
            value: -0.079,
            name: '1937 ~ May'
        }, {
            x: 87,
            y: 5,
            value: -0.008,
            name: '1937 ~ Jun'
        }, {
            x: 87,
            y: 6,
            value: 0.051,
            name: '1937 ~ Jul'
        }, {
            x: 87,
            y: 7,
            value: 0.082,
            name: '1937 ~ Aug'
        }, {
            x: 87,
            y: 8,
            value: 0.112,
            name: '1937 ~ Sep'
        }, {
            x: 87,
            y: 9,
            value: 0.121,
            name: '1937 ~ Oct'
        }, {
            x: 87,
            y: 10,
            value: 0.002,
            name: '1937 ~ Nov'
        }, {
            x: 87,
            y: 11,
            value: -0.101,
            name: '1937 ~ Dec'
        }, {
            x: 88,
            y: 0,
            value: 0.019,
            name: '1938 ~ Jan'
        }, {
            x: 88,
            y: 1,
            value: 0.019,
            name: '1938 ~ Feb'
        }, {
            x: 88,
            y: 2,
            value: 0.064,
            name: '1938 ~ Mar'
        }, {
            x: 88,
            y: 3,
            value: 0.085,
            name: '1938 ~ Apr'
        }, {
            x: 88,
            y: 4,
            value: -0.087,
            name: '1938 ~ May'
        }, {
            x: 88,
            y: 5,
            value: -0.059,
            name: '1938 ~ Jun'
        }, {
            x: 88,
            y: 6,
            value: -0.045,
            name: '1938 ~ Jul'
        }, {
            x: 88,
            y: 7,
            value: 0.013,
            name: '1938 ~ Aug'
        }, {
            x: 88,
            y: 8,
            value: 0.063,
            name: '1938 ~ Sep'
        }, {
            x: 88,
            y: 9,
            value: 0.147,
            name: '1938 ~ Oct'
        }, {
            x: 88,
            y: 10,
            value: 0.019,
            name: '1938 ~ Nov'
        }, {
            x: 88,
            y: 11,
            value: -0.293,
            name: '1938 ~ Dec'
        }, {
            x: 89,
            y: 0,
            value: -0.066,
            name: '1939 ~ Jan'
        }, {
            x: 89,
            y: 1,
            value: -0.043,
            name: '1939 ~ Feb'
        }, {
            x: 89,
            y: 2,
            value: -0.26,
            name: '1939 ~ Mar'
        }, {
            x: 89,
            y: 3,
            value: -0.095,
            name: '1939 ~ Apr'
        }, {
            x: 89,
            y: 4,
            value: -0.027,
            name: '1939 ~ May'
        }, {
            x: 89,
            y: 5,
            value: 0.062,
            name: '1939 ~ Jun'
        }, {
            x: 89,
            y: 6,
            value: 0.052,
            name: '1939 ~ Jul'
        }, {
            x: 89,
            y: 7,
            value: 0.04,
            name: '1939 ~ Aug'
        }, {
            x: 89,
            y: 8,
            value: -0.072,
            name: '1939 ~ Sep'
        }, {
            x: 89,
            y: 9,
            value: -0.273,
            name: '1939 ~ Oct'
        }, {
            x: 89,
            y: 10,
            value: -0.121,
            name: '1939 ~ Nov'
        }, {
            x: 89,
            y: 11,
            value: 0.216,
            name: '1939 ~ Dec'
        }, {
            x: 90,
            y: 0,
            value: -0.185,
            name: '1940 ~ Jan'
        }, {
            x: 90,
            y: 1,
            value: -0.033,
            name: '1940 ~ Feb'
        }, {
            x: 90,
            y: 2,
            value: -0.107,
            name: '1940 ~ Mar'
        }, {
            x: 90,
            y: 3,
            value: 0.065,
            name: '1940 ~ Apr'
        }, {
            x: 90,
            y: 4,
            value: 0.026,
            name: '1940 ~ May'
        }, {
            x: 90,
            y: 5,
            value: 0.037,
            name: '1940 ~ Jun'
        }, {
            x: 90,
            y: 6,
            value: 0.142,
            name: '1940 ~ Jul'
        }, {
            x: 90,
            y: 7,
            value: 0.05,
            name: '1940 ~ Aug'
        }, {
            x: 90,
            y: 8,
            value: 0.124,
            name: '1940 ~ Sep'
        }, {
            x: 90,
            y: 9,
            value: 0.013,
            name: '1940 ~ Oct'
        }, {
            x: 90,
            y: 10,
            value: -0.06,
            name: '1940 ~ Nov'
        }, {
            x: 90,
            y: 11,
            value: 0.159,
            name: '1940 ~ Dec'
        }, {
            x: 91,
            y: 0,
            value: -0.096,
            name: '1941 ~ Jan'
        }, {
            x: 91,
            y: 1,
            value: -0.019,
            name: '1941 ~ Feb'
        }, {
            x: 91,
            y: 2,
            value: -0.141,
            name: '1941 ~ Mar'
        }, {
            x: 91,
            y: 3,
            value: 0.023,
            name: '1941 ~ Apr'
        }, {
            x: 91,
            y: 4,
            value: -0.02,
            name: '1941 ~ May'
        }, {
            x: 91,
            y: 5,
            value: 0.123,
            name: '1941 ~ Jun'
        }, {
            x: 91,
            y: 6,
            value: 0.116,
            name: '1941 ~ Jul'
        }, {
            x: 91,
            y: 7,
            value: 0.019,
            name: '1941 ~ Aug'
        }, {
            x: 91,
            y: 8,
            value: -0.129,
            name: '1941 ~ Sep'
        }, {
            x: 91,
            y: 9,
            value: 0.219,
            name: '1941 ~ Oct'
        }, {
            x: 91,
            y: 10,
            value: 0.053,
            name: '1941 ~ Nov'
        }, {
            x: 91,
            y: 11,
            value: 0.101,
            name: '1941 ~ Dec'
        }, {
            x: 92,
            y: 0,
            value: 0.212,
            name: '1942 ~ Jan'
        }, {
            x: 92,
            y: 1,
            value: -0.078,
            name: '1942 ~ Feb'
        }, {
            x: 92,
            y: 2,
            value: -0.087,
            name: '1942 ~ Mar'
        }, {
            x: 92,
            y: 3,
            value: -0.061,
            name: '1942 ~ Apr'
        }, {
            x: 92,
            y: 4,
            value: -0.01,
            name: '1942 ~ May'
        }, {
            x: 92,
            y: 5,
            value: 0.034,
            name: '1942 ~ Jun'
        }, {
            x: 92,
            y: 6,
            value: -0.074,
            name: '1942 ~ Jul'
        }, {
            x: 92,
            y: 7,
            value: -0.061,
            name: '1942 ~ Aug'
        }, {
            x: 92,
            y: 8,
            value: 0.005,
            name: '1942 ~ Sep'
        }, {
            x: 92,
            y: 9,
            value: -0.076,
            name: '1942 ~ Oct'
        }, {
            x: 92,
            y: 10,
            value: -0.072,
            name: '1942 ~ Nov'
        }, {
            x: 92,
            y: 11,
            value: 0.013,
            name: '1942 ~ Dec'
        }, {
            x: 93,
            y: 0,
            value: -0.202,
            name: '1943 ~ Jan'
        }, {
            x: 93,
            y: 1,
            value: 0.068,
            name: '1943 ~ Feb'
        }, {
            x: 93,
            y: 2,
            value: -0.2,
            name: '1943 ~ Mar'
        }, {
            x: 93,
            y: 3,
            value: 0.006,
            name: '1943 ~ Apr'
        }, {
            x: 93,
            y: 4,
            value: -0.013,
            name: '1943 ~ May'
        }, {
            x: 93,
            y: 5,
            value: -0.094,
            name: '1943 ~ Jun'
        }, {
            x: 93,
            y: 6,
            value: 0,
            name: '1943 ~ Jul'
        }, {
            x: 93,
            y: 7,
            value: -0.001,
            name: '1943 ~ Aug'
        }, {
            x: 93,
            y: 8,
            value: -0.014,
            name: '1943 ~ Sep'
        }, {
            x: 93,
            y: 9,
            value: 0.237,
            name: '1943 ~ Oct'
        }, {
            x: 93,
            y: 10,
            value: 0.027,
            name: '1943 ~ Nov'
        }, {
            x: 93,
            y: 11,
            value: 0.198,
            name: '1943 ~ Dec'
        }, {
            x: 94,
            y: 0,
            value: 0.29,
            name: '1944 ~ Jan'
        }, {
            x: 94,
            y: 1,
            value: 0.14,
            name: '1944 ~ Feb'
        }, {
            x: 94,
            y: 2,
            value: 0.148,
            name: '1944 ~ Mar'
        }, {
            x: 94,
            y: 3,
            value: 0.056,
            name: '1944 ~ Apr'
        }, {
            x: 94,
            y: 4,
            value: 0.068,
            name: '1944 ~ May'
        }, {
            x: 94,
            y: 5,
            value: 0.152,
            name: '1944 ~ Jun'
        }, {
            x: 94,
            y: 6,
            value: 0.221,
            name: '1944 ~ Jul'
        }, {
            x: 94,
            y: 7,
            value: 0.238,
            name: '1944 ~ Aug'
        }, {
            x: 94,
            y: 8,
            value: 0.303,
            name: '1944 ~ Sep'
        }, {
            x: 94,
            y: 9,
            value: 0.212,
            name: '1944 ~ Oct'
        }, {
            x: 94,
            y: 10,
            value: 0.009,
            name: '1944 ~ Nov'
        }, {
            x: 94,
            y: 11,
            value: -0.02,
            name: '1944 ~ Dec'
        }, {
            x: 95,
            y: 0,
            value: -0.003,
            name: '1945 ~ Jan'
        }, {
            x: 95,
            y: 1,
            value: -0.086,
            name: '1945 ~ Feb'
        }, {
            x: 95,
            y: 2,
            value: -0.039,
            name: '1945 ~ Mar'
        }, {
            x: 95,
            y: 3,
            value: 0.167,
            name: '1945 ~ Apr'
        }, {
            x: 95,
            y: 4,
            value: -0.099,
            name: '1945 ~ May'
        }, {
            x: 95,
            y: 5,
            value: 0.006,
            name: '1945 ~ Jun'
        }, {
            x: 95,
            y: 6,
            value: -0.08,
            name: '1945 ~ Jul'
        }, {
            x: 95,
            y: 7,
            value: 0.364,
            name: '1945 ~ Aug'
        }, {
            x: 95,
            y: 8,
            value: 0.162,
            name: '1945 ~ Sep'
        }, {
            x: 95,
            y: 9,
            value: 0.185,
            name: '1945 ~ Oct'
        }, {
            x: 95,
            y: 10,
            value: -0.012,
            name: '1945 ~ Nov'
        }, {
            x: 95,
            y: 11,
            value: -0.206,
            name: '1945 ~ Dec'
        }, {
            x: 96,
            y: 0,
            value: 0.101,
            name: '1946 ~ Jan'
        }, {
            x: 96,
            y: 1,
            value: 0.046,
            name: '1946 ~ Feb'
        }, {
            x: 96,
            y: 2,
            value: -0.063,
            name: '1946 ~ Mar'
        }, {
            x: 96,
            y: 3,
            value: 0.135,
            name: '1946 ~ Apr'
        }, {
            x: 96,
            y: 4,
            value: -0.121,
            name: '1946 ~ May'
        }, {
            x: 96,
            y: 5,
            value: -0.266,
            name: '1946 ~ Jun'
        }, {
            x: 96,
            y: 6,
            value: -0.048,
            name: '1946 ~ Jul'
        }, {
            x: 96,
            y: 7,
            value: -0.146,
            name: '1946 ~ Aug'
        }, {
            x: 96,
            y: 8,
            value: -0.007,
            name: '1946 ~ Sep'
        }, {
            x: 96,
            y: 9,
            value: -0.048,
            name: '1946 ~ Oct'
        }, {
            x: 96,
            y: 10,
            value: -0.091,
            name: '1946 ~ Nov'
        }, {
            x: 96,
            y: 11,
            value: -0.357,
            name: '1946 ~ Dec'
        }, {
            x: 97,
            y: 0,
            value: -0.116,
            name: '1947 ~ Jan'
        }, {
            x: 97,
            y: 1,
            value: -0.18,
            name: '1947 ~ Feb'
        }, {
            x: 97,
            y: 2,
            value: -0.066,
            name: '1947 ~ Mar'
        }, {
            x: 97,
            y: 3,
            value: 0.096,
            name: '1947 ~ Apr'
        }, {
            x: 97,
            y: 4,
            value: -0.06,
            name: '1947 ~ May'
        }, {
            x: 97,
            y: 5,
            value: 0.007,
            name: '1947 ~ Jun'
        }, {
            x: 97,
            y: 6,
            value: -0.006,
            name: '1947 ~ Jul'
        }, {
            x: 97,
            y: 7,
            value: -0.038,
            name: '1947 ~ Aug'
        }, {
            x: 97,
            y: 8,
            value: -0.075,
            name: '1947 ~ Sep'
        }, {
            x: 97,
            y: 9,
            value: 0.077,
            name: '1947 ~ Oct'
        }, {
            x: 97,
            y: 10,
            value: 0.043,
            name: '1947 ~ Nov'
        }, {
            x: 97,
            y: 11,
            value: -0.175,
            name: '1947 ~ Dec'
        }, {
            x: 98,
            y: 0,
            value: 0.089,
            name: '1948 ~ Jan'
        }, {
            x: 98,
            y: 1,
            value: -0.126,
            name: '1948 ~ Feb'
        }, {
            x: 98,
            y: 2,
            value: -0.175,
            name: '1948 ~ Mar'
        }, {
            x: 98,
            y: 3,
            value: -0.042,
            name: '1948 ~ Apr'
        }, {
            x: 98,
            y: 4,
            value: 0.109,
            name: '1948 ~ May'
        }, {
            x: 98,
            y: 5,
            value: 0.075,
            name: '1948 ~ Jun'
        }, {
            x: 98,
            y: 6,
            value: -0.109,
            name: '1948 ~ Jul'
        }, {
            x: 98,
            y: 7,
            value: -0.001,
            name: '1948 ~ Aug'
        }, {
            x: 98,
            y: 8,
            value: -0.057,
            name: '1948 ~ Sep'
        }, {
            x: 98,
            y: 9,
            value: 0.031,
            name: '1948 ~ Oct'
        }, {
            x: 98,
            y: 10,
            value: -0.051,
            name: '1948 ~ Nov'
        }, {
            x: 98,
            y: 11,
            value: -0.203,
            name: '1948 ~ Dec'
        }, {
            x: 99,
            y: 0,
            value: 0.15,
            name: '1949 ~ Jan'
        }, {
            x: 99,
            y: 1,
            value: -0.145,
            name: '1949 ~ Feb'
        }, {
            x: 99,
            y: 2,
            value: -0.178,
            name: '1949 ~ Mar'
        }, {
            x: 99,
            y: 3,
            value: 0.009,
            name: '1949 ~ Apr'
        }, {
            x: 99,
            y: 4,
            value: -0.043,
            name: '1949 ~ May'
        }, {
            x: 99,
            y: 5,
            value: -0.186,
            name: '1949 ~ Jun'
        }, {
            x: 99,
            y: 6,
            value: -0.089,
            name: '1949 ~ Jul'
        }, {
            x: 99,
            y: 7,
            value: -0.038,
            name: '1949 ~ Aug'
        }, {
            x: 99,
            y: 8,
            value: -0.072,
            name: '1949 ~ Sep'
        }, {
            x: 99,
            y: 9,
            value: -0.032,
            name: '1949 ~ Oct'
        }, {
            x: 99,
            y: 10,
            value: -0.077,
            name: '1949 ~ Nov'
        }, {
            x: 99,
            y: 11,
            value: -0.188,
            name: '1949 ~ Dec'
        }, {
            x: 100,
            y: 0,
            value: -0.333,
            name: '1950 ~ Jan'
        }, {
            x: 100,
            y: 1,
            value: -0.245,
            name: '1950 ~ Feb'
        }, {
            x: 100,
            y: 2,
            value: -0.178,
            name: '1950 ~ Mar'
        }, {
            x: 100,
            y: 3,
            value: -0.165,
            name: '1950 ~ Apr'
        }, {
            x: 100,
            y: 4,
            value: -0.087,
            name: '1950 ~ May'
        }, {
            x: 100,
            y: 5,
            value: -0.074,
            name: '1950 ~ Jun'
        }, {
            x: 100,
            y: 6,
            value: -0.039,
            name: '1950 ~ Jul'
        }, {
            x: 100,
            y: 7,
            value: -0.112,
            name: '1950 ~ Aug'
        }, {
            x: 100,
            y: 8,
            value: -0.106,
            name: '1950 ~ Sep'
        }, {
            x: 100,
            y: 9,
            value: -0.125,
            name: '1950 ~ Oct'
        }, {
            x: 100,
            y: 10,
            value: -0.391,
            name: '1950 ~ Nov'
        }, {
            x: 100,
            y: 11,
            value: -0.254,
            name: '1950 ~ Dec'
        }, {
            x: 101,
            y: 0,
            value: -0.355,
            name: '1951 ~ Jan'
        }, {
            x: 101,
            y: 1,
            value: -0.463,
            name: '1951 ~ Feb'
        }, {
            x: 101,
            y: 2,
            value: -0.298,
            name: '1951 ~ Mar'
        }, {
            x: 101,
            y: 3,
            value: -0.105,
            name: '1951 ~ Apr'
        }, {
            x: 101,
            y: 4,
            value: -0.013,
            name: '1951 ~ May'
        }, {
            x: 101,
            y: 5,
            value: 0.037,
            name: '1951 ~ Jun'
        }, {
            x: 101,
            y: 6,
            value: 0.049,
            name: '1951 ~ Jul'
        }, {
            x: 101,
            y: 7,
            value: 0.142,
            name: '1951 ~ Aug'
        }, {
            x: 101,
            y: 8,
            value: 0.093,
            name: '1951 ~ Sep'
        }, {
            x: 101,
            y: 9,
            value: 0.129,
            name: '1951 ~ Oct'
        }, {
            x: 101,
            y: 10,
            value: -0.038,
            name: '1951 ~ Nov'
        }, {
            x: 101,
            y: 11,
            value: 0.174,
            name: '1951 ~ Dec'
        }, {
            x: 102,
            y: 0,
            value: 0.182,
            name: '1952 ~ Jan'
        }, {
            x: 102,
            y: 1,
            value: 0.135,
            name: '1952 ~ Feb'
        }, {
            x: 102,
            y: 2,
            value: -0.13,
            name: '1952 ~ Mar'
        }, {
            x: 102,
            y: 3,
            value: 0.055,
            name: '1952 ~ Apr'
        }, {
            x: 102,
            y: 4,
            value: 0.04,
            name: '1952 ~ May'
        }, {
            x: 102,
            y: 5,
            value: 0.04,
            name: '1952 ~ Jun'
        }, {
            x: 102,
            y: 6,
            value: 0.099,
            name: '1952 ~ Jul'
        }, {
            x: 102,
            y: 7,
            value: 0.094,
            name: '1952 ~ Aug'
        }, {
            x: 102,
            y: 8,
            value: 0.098,
            name: '1952 ~ Sep'
        }, {
            x: 102,
            y: 9,
            value: -0.009,
            name: '1952 ~ Oct'
        }, {
            x: 102,
            y: 10,
            value: -0.189,
            name: '1952 ~ Nov'
        }, {
            x: 102,
            y: 11,
            value: -0.06,
            name: '1952 ~ Dec'
        }, {
            x: 103,
            y: 0,
            value: 0.067,
            name: '1953 ~ Jan'
        }, {
            x: 103,
            y: 1,
            value: 0.146,
            name: '1953 ~ Feb'
        }, {
            x: 103,
            y: 2,
            value: 0.13,
            name: '1953 ~ Mar'
        }, {
            x: 103,
            y: 3,
            value: 0.195,
            name: '1953 ~ Apr'
        }, {
            x: 103,
            y: 4,
            value: 0.138,
            name: '1953 ~ May'
        }, {
            x: 103,
            y: 5,
            value: 0.164,
            name: '1953 ~ Jun'
        }, {
            x: 103,
            y: 6,
            value: 0.054,
            name: '1953 ~ Jul'
        }, {
            x: 103,
            y: 7,
            value: 0.095,
            name: '1953 ~ Aug'
        }, {
            x: 103,
            y: 8,
            value: 0.076,
            name: '1953 ~ Sep'
        }, {
            x: 103,
            y: 9,
            value: 0.073,
            name: '1953 ~ Oct'
        }, {
            x: 103,
            y: 10,
            value: -0.073,
            name: '1953 ~ Nov'
        }, {
            x: 103,
            y: 11,
            value: 0.09,
            name: '1953 ~ Dec'
        }, {
            x: 104,
            y: 0,
            value: -0.237,
            name: '1954 ~ Jan'
        }, {
            x: 104,
            y: 1,
            value: -0.088,
            name: '1954 ~ Feb'
        }, {
            x: 104,
            y: 2,
            value: -0.155,
            name: '1954 ~ Mar'
        }, {
            x: 104,
            y: 3,
            value: -0.151,
            name: '1954 ~ Apr'
        }, {
            x: 104,
            y: 4,
            value: -0.207,
            name: '1954 ~ May'
        }, {
            x: 104,
            y: 5,
            value: -0.13,
            name: '1954 ~ Jun'
        }, {
            x: 104,
            y: 6,
            value: -0.198,
            name: '1954 ~ Jul'
        }, {
            x: 104,
            y: 7,
            value: -0.094,
            name: '1954 ~ Aug'
        }, {
            x: 104,
            y: 8,
            value: -0.087,
            name: '1954 ~ Sep'
        }, {
            x: 104,
            y: 9,
            value: -0.036,
            name: '1954 ~ Oct'
        }, {
            x: 104,
            y: 10,
            value: 0.022,
            name: '1954 ~ Nov'
        }, {
            x: 104,
            y: 11,
            value: -0.235,
            name: '1954 ~ Dec'
        }, {
            x: 105,
            y: 0,
            value: 0.125,
            name: '1955 ~ Jan'
        }, {
            x: 105,
            y: 1,
            value: -0.166,
            name: '1955 ~ Feb'
        }, {
            x: 105,
            y: 2,
            value: -0.405,
            name: '1955 ~ Mar'
        }, {
            x: 105,
            y: 3,
            value: -0.244,
            name: '1955 ~ Apr'
        }, {
            x: 105,
            y: 4,
            value: -0.235,
            name: '1955 ~ May'
        }, {
            x: 105,
            y: 5,
            value: -0.168,
            name: '1955 ~ Jun'
        }, {
            x: 105,
            y: 6,
            value: -0.2,
            name: '1955 ~ Jul'
        }, {
            x: 105,
            y: 7,
            value: -0.063,
            name: '1955 ~ Aug'
        }, {
            x: 105,
            y: 8,
            value: -0.117,
            name: '1955 ~ Sep'
        }, {
            x: 105,
            y: 9,
            value: -0.164,
            name: '1955 ~ Oct'
        }, {
            x: 105,
            y: 10,
            value: -0.313,
            name: '1955 ~ Nov'
        }, {
            x: 105,
            y: 11,
            value: -0.336,
            name: '1955 ~ Dec'
        }, {
            x: 106,
            y: 0,
            value: -0.248,
            name: '1956 ~ Jan'
        }, {
            x: 106,
            y: 1,
            value: -0.348,
            name: '1956 ~ Feb'
        }, {
            x: 106,
            y: 2,
            value: -0.311,
            name: '1956 ~ Mar'
        }, {
            x: 106,
            y: 3,
            value: -0.335,
            name: '1956 ~ Apr'
        }, {
            x: 106,
            y: 4,
            value: -0.28,
            name: '1956 ~ May'
        }, {
            x: 106,
            y: 5,
            value: -0.225,
            name: '1956 ~ Jun'
        }, {
            x: 106,
            y: 6,
            value: -0.211,
            name: '1956 ~ Jul'
        }, {
            x: 106,
            y: 7,
            value: -0.243,
            name: '1956 ~ Aug'
        }, {
            x: 106,
            y: 8,
            value: -0.281,
            name: '1956 ~ Sep'
        }, {
            x: 106,
            y: 9,
            value: -0.23,
            name: '1956 ~ Oct'
        }, {
            x: 106,
            y: 10,
            value: -0.259,
            name: '1956 ~ Nov'
        }, {
            x: 106,
            y: 11,
            value: -0.207,
            name: '1956 ~ Dec'
        }, {
            x: 107,
            y: 0,
            value: -0.167,
            name: '1957 ~ Jan'
        }, {
            x: 107,
            y: 1,
            value: -0.129,
            name: '1957 ~ Feb'
        }, {
            x: 107,
            y: 2,
            value: -0.185,
            name: '1957 ~ Mar'
        }, {
            x: 107,
            y: 3,
            value: -0.064,
            name: '1957 ~ Apr'
        }, {
            x: 107,
            y: 4,
            value: 0.052,
            name: '1957 ~ May'
        }, {
            x: 107,
            y: 5,
            value: 0.084,
            name: '1957 ~ Jun'
        }, {
            x: 107,
            y: 6,
            value: 0.003,
            name: '1957 ~ Jul'
        }, {
            x: 107,
            y: 7,
            value: 0.094,
            name: '1957 ~ Aug'
        }, {
            x: 107,
            y: 8,
            value: 0.038,
            name: '1957 ~ Sep'
        }, {
            x: 107,
            y: 9,
            value: -0.013,
            name: '1957 ~ Oct'
        }, {
            x: 107,
            y: 10,
            value: 0.056,
            name: '1957 ~ Nov'
        }, {
            x: 107,
            y: 11,
            value: 0.158,
            name: '1957 ~ Dec'
        }, {
            x: 108,
            y: 0,
            value: 0.269,
            name: '1958 ~ Jan'
        }, {
            x: 108,
            y: 1,
            value: 0.183,
            name: '1958 ~ Feb'
        }, {
            x: 108,
            y: 2,
            value: -0.004,
            name: '1958 ~ Mar'
        }, {
            x: 108,
            y: 3,
            value: 0.038,
            name: '1958 ~ Apr'
        }, {
            x: 108,
            y: 4,
            value: 0.035,
            name: '1958 ~ May'
        }, {
            x: 108,
            y: 5,
            value: -0.016,
            name: '1958 ~ Jun'
        }, {
            x: 108,
            y: 6,
            value: 0.041,
            name: '1958 ~ Jul'
        }, {
            x: 108,
            y: 7,
            value: 0.01,
            name: '1958 ~ Aug'
        }, {
            x: 108,
            y: 8,
            value: -0.052,
            name: '1958 ~ Sep'
        }, {
            x: 108,
            y: 9,
            value: 0.015,
            name: '1958 ~ Oct'
        }, {
            x: 108,
            y: 10,
            value: 0.012,
            name: '1958 ~ Nov'
        }, {
            x: 108,
            y: 11,
            value: 0.027,
            name: '1958 ~ Dec'
        }, {
            x: 109,
            y: 0,
            value: 0.087,
            name: '1959 ~ Jan'
        }, {
            x: 109,
            y: 1,
            value: 0.03,
            name: '1959 ~ Feb'
        }, {
            x: 109,
            y: 2,
            value: 0.08,
            name: '1959 ~ Mar'
        }, {
            x: 109,
            y: 3,
            value: 0.046,
            name: '1959 ~ Apr'
        }, {
            x: 109,
            y: 4,
            value: -0.012,
            name: '1959 ~ May'
        }, {
            x: 109,
            y: 5,
            value: 0.063,
            name: '1959 ~ Jun'
        }, {
            x: 109,
            y: 6,
            value: 0.03,
            name: '1959 ~ Jul'
        }, {
            x: 109,
            y: 7,
            value: 0.048,
            name: '1959 ~ Aug'
        }, {
            x: 109,
            y: 8,
            value: 0.038,
            name: '1959 ~ Sep'
        }, {
            x: 109,
            y: 9,
            value: -0.035,
            name: '1959 ~ Oct'
        }, {
            x: 109,
            y: 10,
            value: -0.112,
            name: '1959 ~ Nov'
        }, {
            x: 109,
            y: 11,
            value: -0.07,
            name: '1959 ~ Dec'
        }, {
            x: 110,
            y: 0,
            value: -0.029,
            name: '1960 ~ Jan'
        }, {
            x: 110,
            y: 1,
            value: 0.102,
            name: '1960 ~ Feb'
        }, {
            x: 110,
            y: 2,
            value: -0.316,
            name: '1960 ~ Mar'
        }, {
            x: 110,
            y: 3,
            value: -0.176,
            name: '1960 ~ Apr'
        }, {
            x: 110,
            y: 4,
            value: -0.154,
            name: '1960 ~ May'
        }, {
            x: 110,
            y: 5,
            value: -0.029,
            name: '1960 ~ Jun'
        }, {
            x: 110,
            y: 6,
            value: -0.027,
            name: '1960 ~ Jul'
        }, {
            x: 110,
            y: 7,
            value: 0.007,
            name: '1960 ~ Aug'
        }, {
            x: 110,
            y: 8,
            value: 0.062,
            name: '1960 ~ Sep'
        }, {
            x: 110,
            y: 9,
            value: -0.027,
            name: '1960 ~ Oct'
        }, {
            x: 110,
            y: 10,
            value: -0.15,
            name: '1960 ~ Nov'
        }, {
            x: 110,
            y: 11,
            value: 0.141,
            name: '1960 ~ Dec'
        }, {
            x: 111,
            y: 0,
            value: 0.046,
            name: '1961 ~ Jan'
        }, {
            x: 111,
            y: 1,
            value: 0.185,
            name: '1961 ~ Feb'
        }, {
            x: 111,
            y: 2,
            value: 0.096,
            name: '1961 ~ Mar'
        }, {
            x: 111,
            y: 3,
            value: 0.097,
            name: '1961 ~ Apr'
        }, {
            x: 111,
            y: 4,
            value: 0.087,
            name: '1961 ~ May'
        }, {
            x: 111,
            y: 5,
            value: 0.108,
            name: '1961 ~ Jun'
        }, {
            x: 111,
            y: 6,
            value: 0.016,
            name: '1961 ~ Jul'
        }, {
            x: 111,
            y: 7,
            value: 0.03,
            name: '1961 ~ Aug'
        }, {
            x: 111,
            y: 8,
            value: -0.029,
            name: '1961 ~ Sep'
        }, {
            x: 111,
            y: 9,
            value: -0.031,
            name: '1961 ~ Oct'
        }, {
            x: 111,
            y: 10,
            value: -0.02,
            name: '1961 ~ Nov'
        }, {
            x: 111,
            y: 11,
            value: -0.112,
            name: '1961 ~ Dec'
        }, {
            x: 112,
            y: 0,
            value: 0.055,
            name: '1962 ~ Jan'
        }, {
            x: 112,
            y: 1,
            value: 0.139,
            name: '1962 ~ Feb'
        }, {
            x: 112,
            y: 2,
            value: 0.027,
            name: '1962 ~ Mar'
        }, {
            x: 112,
            y: 3,
            value: 0.025,
            name: '1962 ~ Apr'
        }, {
            x: 112,
            y: 4,
            value: -0.044,
            name: '1962 ~ May'
        }, {
            x: 112,
            y: 5,
            value: -0.054,
            name: '1962 ~ Jun'
        }, {
            x: 112,
            y: 6,
            value: 0.016,
            name: '1962 ~ Jul'
        }, {
            x: 112,
            y: 7,
            value: -0.003,
            name: '1962 ~ Aug'
        }, {
            x: 112,
            y: 8,
            value: -0.014,
            name: '1962 ~ Sep'
        }, {
            x: 112,
            y: 9,
            value: 0.045,
            name: '1962 ~ Oct'
        }, {
            x: 112,
            y: 10,
            value: 0.009,
            name: '1962 ~ Nov'
        }, {
            x: 112,
            y: 11,
            value: -0.01,
            name: '1962 ~ Dec'
        }, {
            x: 113,
            y: 0,
            value: -0.05,
            name: '1963 ~ Jan'
        }, {
            x: 113,
            y: 1,
            value: 0.152,
            name: '1963 ~ Feb'
        }, {
            x: 113,
            y: 2,
            value: -0.142,
            name: '1963 ~ Mar'
        }, {
            x: 113,
            y: 3,
            value: -0.067,
            name: '1963 ~ Apr'
        }, {
            x: 113,
            y: 4,
            value: -0.021,
            name: '1963 ~ May'
        }, {
            x: 113,
            y: 5,
            value: -0.033,
            name: '1963 ~ Jun'
        }, {
            x: 113,
            y: 6,
            value: 0.11,
            name: '1963 ~ Jul'
        }, {
            x: 113,
            y: 7,
            value: 0.127,
            name: '1963 ~ Aug'
        }, {
            x: 113,
            y: 8,
            value: 0.126,
            name: '1963 ~ Sep'
        }, {
            x: 113,
            y: 9,
            value: 0.224,
            name: '1963 ~ Oct'
        }, {
            x: 113,
            y: 10,
            value: 0.161,
            name: '1963 ~ Nov'
        }, {
            x: 113,
            y: 11,
            value: -0.007,
            name: '1963 ~ Dec'
        }, {
            x: 114,
            y: 0,
            value: -0.045,
            name: '1964 ~ Jan'
        }, {
            x: 114,
            y: 1,
            value: -0.124,
            name: '1964 ~ Feb'
        }, {
            x: 114,
            y: 2,
            value: -0.276,
            name: '1964 ~ Mar'
        }, {
            x: 114,
            y: 3,
            value: -0.244,
            name: '1964 ~ Apr'
        }, {
            x: 114,
            y: 4,
            value: -0.175,
            name: '1964 ~ May'
        }, {
            x: 114,
            y: 5,
            value: -0.159,
            name: '1964 ~ Jun'
        }, {
            x: 114,
            y: 6,
            value: -0.171,
            name: '1964 ~ Jul'
        }, {
            x: 114,
            y: 7,
            value: -0.258,
            name: '1964 ~ Aug'
        }, {
            x: 114,
            y: 8,
            value: -0.284,
            name: '1964 ~ Sep'
        }, {
            x: 114,
            y: 9,
            value: -0.268,
            name: '1964 ~ Oct'
        }, {
            x: 114,
            y: 10,
            value: -0.297,
            name: '1964 ~ Nov'
        }, {
            x: 114,
            y: 11,
            value: -0.356,
            name: '1964 ~ Dec'
        }, {
            x: 115,
            y: 0,
            value: -0.103,
            name: '1965 ~ Jan'
        }, {
            x: 115,
            y: 1,
            value: -0.244,
            name: '1965 ~ Feb'
        }, {
            x: 115,
            y: 2,
            value: -0.215,
            name: '1965 ~ Mar'
        }, {
            x: 115,
            y: 3,
            value: -0.255,
            name: '1965 ~ Apr'
        }, {
            x: 115,
            y: 4,
            value: -0.159,
            name: '1965 ~ May'
        }, {
            x: 115,
            y: 5,
            value: -0.11,
            name: '1965 ~ Jun'
        }, {
            x: 115,
            y: 6,
            value: -0.181,
            name: '1965 ~ Jul'
        }, {
            x: 115,
            y: 7,
            value: -0.112,
            name: '1965 ~ Aug'
        }, {
            x: 115,
            y: 8,
            value: -0.095,
            name: '1965 ~ Sep'
        }, {
            x: 115,
            y: 9,
            value: -0.03,
            name: '1965 ~ Oct'
        }, {
            x: 115,
            y: 10,
            value: -0.14,
            name: '1965 ~ Nov'
        }, {
            x: 115,
            y: 11,
            value: -0.066,
            name: '1965 ~ Dec'
        }, {
            x: 116,
            y: 0,
            value: -0.096,
            name: '1966 ~ Jan'
        }, {
            x: 116,
            y: 1,
            value: -0.094,
            name: '1966 ~ Feb'
        }, {
            x: 116,
            y: 2,
            value: -0.063,
            name: '1966 ~ Mar'
        }, {
            x: 116,
            y: 3,
            value: -0.107,
            name: '1966 ~ Apr'
        }, {
            x: 116,
            y: 4,
            value: -0.141,
            name: '1966 ~ May'
        }, {
            x: 116,
            y: 5,
            value: 0.035,
            name: '1966 ~ Jun'
        }, {
            x: 116,
            y: 6,
            value: 0.031,
            name: '1966 ~ Jul'
        }, {
            x: 116,
            y: 7,
            value: -0.022,
            name: '1966 ~ Aug'
        }, {
            x: 116,
            y: 8,
            value: -0.04,
            name: '1966 ~ Sep'
        }, {
            x: 116,
            y: 9,
            value: -0.105,
            name: '1966 ~ Oct'
        }, {
            x: 116,
            y: 10,
            value: -0.096,
            name: '1966 ~ Nov'
        }, {
            x: 116,
            y: 11,
            value: -0.144,
            name: '1966 ~ Dec'
        }, {
            x: 117,
            y: 0,
            value: -0.167,
            name: '1967 ~ Jan'
        }, {
            x: 117,
            y: 1,
            value: -0.235,
            name: '1967 ~ Feb'
        }, {
            x: 117,
            y: 2,
            value: -0.052,
            name: '1967 ~ Mar'
        }, {
            x: 117,
            y: 3,
            value: -0.068,
            name: '1967 ~ Apr'
        }, {
            x: 117,
            y: 4,
            value: 0.073,
            name: '1967 ~ May'
        }, {
            x: 117,
            y: 5,
            value: -0.086,
            name: '1967 ~ Jun'
        }, {
            x: 117,
            y: 6,
            value: -0.066,
            name: '1967 ~ Jul'
        }, {
            x: 117,
            y: 7,
            value: -0.065,
            name: '1967 ~ Aug'
        }, {
            x: 117,
            y: 8,
            value: -0.097,
            name: '1967 ~ Sep'
        }, {
            x: 117,
            y: 9,
            value: 0.06,
            name: '1967 ~ Oct'
        }, {
            x: 117,
            y: 10,
            value: -0.064,
            name: '1967 ~ Nov'
        }, {
            x: 117,
            y: 11,
            value: -0.151,
            name: '1967 ~ Dec'
        }, {
            x: 118,
            y: 0,
            value: -0.242,
            name: '1968 ~ Jan'
        }, {
            x: 118,
            y: 1,
            value: -0.214,
            name: '1968 ~ Feb'
        }, {
            x: 118,
            y: 2,
            value: 0.036,
            name: '1968 ~ Mar'
        }, {
            x: 118,
            y: 3,
            value: -0.17,
            name: '1968 ~ Apr'
        }, {
            x: 118,
            y: 4,
            value: -0.221,
            name: '1968 ~ May'
        }, {
            x: 118,
            y: 5,
            value: -0.106,
            name: '1968 ~ Jun'
        }, {
            x: 118,
            y: 6,
            value: -0.103,
            name: '1968 ~ Jul'
        }, {
            x: 118,
            y: 7,
            value: -0.06,
            name: '1968 ~ Aug'
        }, {
            x: 118,
            y: 8,
            value: -0.086,
            name: '1968 ~ Sep'
        }, {
            x: 118,
            y: 9,
            value: -0.018,
            name: '1968 ~ Oct'
        }, {
            x: 118,
            y: 10,
            value: -0.07,
            name: '1968 ~ Nov'
        }, {
            x: 118,
            y: 11,
            value: -0.11,
            name: '1968 ~ Dec'
        }, {
            x: 119,
            y: 0,
            value: -0.171,
            name: '1969 ~ Jan'
        }, {
            x: 119,
            y: 1,
            value: -0.17,
            name: '1969 ~ Feb'
        }, {
            x: 119,
            y: 2,
            value: -0.004,
            name: '1969 ~ Mar'
        }, {
            x: 119,
            y: 3,
            value: 0.108,
            name: '1969 ~ Apr'
        }, {
            x: 119,
            y: 4,
            value: 0.126,
            name: '1969 ~ May'
        }, {
            x: 119,
            y: 5,
            value: 0.023,
            name: '1969 ~ Jun'
        }, {
            x: 119,
            y: 6,
            value: 0.038,
            name: '1969 ~ Jul'
        }, {
            x: 119,
            y: 7,
            value: 0.051,
            name: '1969 ~ Aug'
        }, {
            x: 119,
            y: 8,
            value: 0.015,
            name: '1969 ~ Sep'
        }, {
            x: 119,
            y: 9,
            value: 0.023,
            name: '1969 ~ Oct'
        }, {
            x: 119,
            y: 10,
            value: 0.132,
            name: '1969 ~ Nov'
        }, {
            x: 119,
            y: 11,
            value: 0.194,
            name: '1969 ~ Dec'
        }, {
            x: 120,
            y: 0,
            value: 0.072,
            name: '1970 ~ Jan'
        }, {
            x: 120,
            y: 1,
            value: 0.143,
            name: '1970 ~ Feb'
        }, {
            x: 120,
            y: 2,
            value: -0.069,
            name: '1970 ~ Mar'
        }, {
            x: 120,
            y: 3,
            value: 0.058,
            name: '1970 ~ Apr'
        }, {
            x: 120,
            y: 4,
            value: -0.036,
            name: '1970 ~ May'
        }, {
            x: 120,
            y: 5,
            value: -0.014,
            name: '1970 ~ Jun'
        }, {
            x: 120,
            y: 6,
            value: -0.049,
            name: '1970 ~ Jul'
        }, {
            x: 120,
            y: 7,
            value: -0.09,
            name: '1970 ~ Aug'
        }, {
            x: 120,
            y: 8,
            value: -0.039,
            name: '1970 ~ Sep'
        }, {
            x: 120,
            y: 9,
            value: -0.074,
            name: '1970 ~ Oct'
        }, {
            x: 120,
            y: 10,
            value: -0.049,
            name: '1970 ~ Nov'
        }, {
            x: 120,
            y: 11,
            value: -0.165,
            name: '1970 ~ Dec'
        }, {
            x: 121,
            y: 0,
            value: -0.097,
            name: '1971 ~ Jan'
        }, {
            x: 121,
            y: 1,
            value: -0.291,
            name: '1971 ~ Feb'
        }, {
            x: 121,
            y: 2,
            value: -0.286,
            name: '1971 ~ Mar'
        }, {
            x: 121,
            y: 3,
            value: -0.237,
            name: '1971 ~ Apr'
        }, {
            x: 121,
            y: 4,
            value: -0.215,
            name: '1971 ~ May'
        }, {
            x: 121,
            y: 5,
            value: -0.233,
            name: '1971 ~ Jun'
        }, {
            x: 121,
            y: 6,
            value: -0.129,
            name: '1971 ~ Jul'
        }, {
            x: 121,
            y: 7,
            value: -0.168,
            name: '1971 ~ Aug'
        }, {
            x: 121,
            y: 8,
            value: -0.123,
            name: '1971 ~ Sep'
        }, {
            x: 121,
            y: 9,
            value: -0.16,
            name: '1971 ~ Oct'
        }, {
            x: 121,
            y: 10,
            value: -0.08,
            name: '1971 ~ Nov'
        }, {
            x: 121,
            y: 11,
            value: -0.204,
            name: '1971 ~ Dec'
        }, {
            x: 122,
            y: 0,
            value: -0.376,
            name: '1972 ~ Jan'
        }, {
            x: 122,
            y: 1,
            value: -0.287,
            name: '1972 ~ Feb'
        }, {
            x: 122,
            y: 2,
            value: -0.134,
            name: '1972 ~ Mar'
        }, {
            x: 122,
            y: 3,
            value: -0.079,
            name: '1972 ~ Apr'
        }, {
            x: 122,
            y: 4,
            value: -0.065,
            name: '1972 ~ May'
        }, {
            x: 122,
            y: 5,
            value: 0.003,
            name: '1972 ~ Jun'
        }, {
            x: 122,
            y: 6,
            value: -0.025,
            name: '1972 ~ Jul'
        }, {
            x: 122,
            y: 7,
            value: 0.013,
            name: '1972 ~ Aug'
        }, {
            x: 122,
            y: 8,
            value: -0.059,
            name: '1972 ~ Sep'
        }, {
            x: 122,
            y: 9,
            value: 0.002,
            name: '1972 ~ Oct'
        }, {
            x: 122,
            y: 10,
            value: -0.005,
            name: '1972 ~ Nov'
        }, {
            x: 122,
            y: 11,
            value: 0.183,
            name: '1972 ~ Dec'
        }, {
            x: 123,
            y: 0,
            value: 0.146,
            name: '1973 ~ Jan'
        }, {
            x: 123,
            y: 1,
            value: 0.276,
            name: '1973 ~ Feb'
        }, {
            x: 123,
            y: 2,
            value: 0.226,
            name: '1973 ~ Mar'
        }, {
            x: 123,
            y: 3,
            value: 0.162,
            name: '1973 ~ Apr'
        }, {
            x: 123,
            y: 4,
            value: 0.086,
            name: '1973 ~ May'
        }, {
            x: 123,
            y: 5,
            value: 0.11,
            name: '1973 ~ Jun'
        }, {
            x: 123,
            y: 6,
            value: 0.025,
            name: '1973 ~ Jul'
        }, {
            x: 123,
            y: 7,
            value: 0.018,
            name: '1973 ~ Aug'
        }, {
            x: 123,
            y: 8,
            value: -0.038,
            name: '1973 ~ Sep'
        }, {
            x: 123,
            y: 9,
            value: -0.041,
            name: '1973 ~ Oct'
        }, {
            x: 123,
            y: 10,
            value: -0.095,
            name: '1973 ~ Nov'
        }, {
            x: 123,
            y: 11,
            value: -0.108,
            name: '1973 ~ Dec'
        }, {
            x: 124,
            y: 0,
            value: -0.376,
            name: '1974 ~ Jan'
        }, {
            x: 124,
            y: 1,
            value: -0.406,
            name: '1974 ~ Feb'
        }, {
            x: 124,
            y: 2,
            value: -0.233,
            name: '1974 ~ Mar'
        }, {
            x: 124,
            y: 3,
            value: -0.179,
            name: '1974 ~ Apr'
        }, {
            x: 124,
            y: 4,
            value: -0.195,
            name: '1974 ~ May'
        }, {
            x: 124,
            y: 5,
            value: -0.151,
            name: '1974 ~ Jun'
        }, {
            x: 124,
            y: 6,
            value: -0.125,
            name: '1974 ~ Jul'
        }, {
            x: 124,
            y: 7,
            value: -0.082,
            name: '1974 ~ Aug'
        }, {
            x: 124,
            y: 8,
            value: -0.129,
            name: '1974 ~ Sep'
        }, {
            x: 124,
            y: 9,
            value: -0.215,
            name: '1974 ~ Oct'
        }, {
            x: 124,
            y: 10,
            value: -0.211,
            name: '1974 ~ Nov'
        }, {
            x: 124,
            y: 11,
            value: -0.237,
            name: '1974 ~ Dec'
        }, {
            x: 125,
            y: 0,
            value: -0.071,
            name: '1975 ~ Jan'
        }, {
            x: 125,
            y: 1,
            value: -0.092,
            name: '1975 ~ Feb'
        }, {
            x: 125,
            y: 2,
            value: -0.075,
            name: '1975 ~ Mar'
        }, {
            x: 125,
            y: 3,
            value: -0.088,
            name: '1975 ~ Apr'
        }, {
            x: 125,
            y: 4,
            value: -0.083,
            name: '1975 ~ May'
        }, {
            x: 125,
            y: 5,
            value: -0.084,
            name: '1975 ~ Jun'
        }, {
            x: 125,
            y: 6,
            value: -0.109,
            name: '1975 ~ Jul'
        }, {
            x: 125,
            y: 7,
            value: -0.179,
            name: '1975 ~ Aug'
        }, {
            x: 125,
            y: 8,
            value: -0.126,
            name: '1975 ~ Sep'
        }, {
            x: 125,
            y: 9,
            value: -0.228,
            name: '1975 ~ Oct'
        }, {
            x: 125,
            y: 10,
            value: -0.313,
            name: '1975 ~ Nov'
        }, {
            x: 125,
            y: 11,
            value: -0.304,
            name: '1975 ~ Dec'
        }, {
            x: 126,
            y: 0,
            value: -0.23,
            name: '1976 ~ Jan'
        }, {
            x: 126,
            y: 1,
            value: -0.323,
            name: '1976 ~ Feb'
        }, {
            x: 126,
            y: 2,
            value: -0.442,
            name: '1976 ~ Mar'
        }, {
            x: 126,
            y: 3,
            value: -0.196,
            name: '1976 ~ Apr'
        }, {
            x: 126,
            y: 4,
            value: -0.317,
            name: '1976 ~ May'
        }, {
            x: 126,
            y: 5,
            value: -0.25,
            name: '1976 ~ Jun'
        }, {
            x: 126,
            y: 6,
            value: -0.185,
            name: '1976 ~ Jul'
        }, {
            x: 126,
            y: 7,
            value: -0.201,
            name: '1976 ~ Aug'
        }, {
            x: 126,
            y: 8,
            value: -0.164,
            name: '1976 ~ Sep'
        }, {
            x: 126,
            y: 9,
            value: -0.313,
            name: '1976 ~ Oct'
        }, {
            x: 126,
            y: 10,
            value: -0.176,
            name: '1976 ~ Nov'
        }, {
            x: 126,
            y: 11,
            value: -0.081,
            name: '1976 ~ Dec'
        }, {
            x: 127,
            y: 0,
            value: -0.081,
            name: '1977 ~ Jan'
        }, {
            x: 127,
            y: 1,
            value: 0.079,
            name: '1977 ~ Feb'
        }, {
            x: 127,
            y: 2,
            value: 0.104,
            name: '1977 ~ Mar'
        }, {
            x: 127,
            y: 3,
            value: 0.094,
            name: '1977 ~ Apr'
        }, {
            x: 127,
            y: 4,
            value: 0.069,
            name: '1977 ~ May'
        }, {
            x: 127,
            y: 5,
            value: 0.109,
            name: '1977 ~ Jun'
        }, {
            x: 127,
            y: 6,
            value: 0.06,
            name: '1977 ~ Jul'
        }, {
            x: 127,
            y: 7,
            value: -0.001,
            name: '1977 ~ Aug'
        }, {
            x: 127,
            y: 8,
            value: 0.032,
            name: '1977 ~ Sep'
        }, {
            x: 127,
            y: 9,
            value: -0.006,
            name: '1977 ~ Oct'
        }, {
            x: 127,
            y: 10,
            value: 0.137,
            name: '1977 ~ Nov'
        }, {
            x: 127,
            y: 11,
            value: -0.056,
            name: '1977 ~ Dec'
        }, {
            x: 128,
            y: 0,
            value: 0.014,
            name: '1978 ~ Jan'
        }, {
            x: 128,
            y: 1,
            value: -0.038,
            name: '1978 ~ Feb'
        }, {
            x: 128,
            y: 2,
            value: 0.027,
            name: '1978 ~ Mar'
        }, {
            x: 128,
            y: 3,
            value: -0.062,
            name: '1978 ~ Apr'
        }, {
            x: 128,
            y: 4,
            value: -0.089,
            name: '1978 ~ May'
        }, {
            x: 128,
            y: 5,
            value: -0.133,
            name: '1978 ~ Jun'
        }, {
            x: 128,
            y: 6,
            value: -0.063,
            name: '1978 ~ Jul'
        }, {
            x: 128,
            y: 7,
            value: -0.188,
            name: '1978 ~ Aug'
        }, {
            x: 128,
            y: 8,
            value: -0.054,
            name: '1978 ~ Sep'
        }, {
            x: 128,
            y: 9,
            value: -0.116,
            name: '1978 ~ Oct'
        }, {
            x: 128,
            y: 10,
            value: 0.045,
            name: '1978 ~ Nov'
        }, {
            x: 128,
            y: 11,
            value: -0.1,
            name: '1978 ~ Dec'
        }, {
            x: 129,
            y: 0,
            value: -0.038,
            name: '1979 ~ Jan'
        }, {
            x: 129,
            y: 1,
            value: -0.14,
            name: '1979 ~ Feb'
        }, {
            x: 129,
            y: 2,
            value: 0.014,
            name: '1979 ~ Mar'
        }, {
            x: 129,
            y: 3,
            value: -0.048,
            name: '1979 ~ Apr'
        }, {
            x: 129,
            y: 4,
            value: -0.03,
            name: '1979 ~ May'
        }, {
            x: 129,
            y: 5,
            value: 0.058,
            name: '1979 ~ Jun'
        }, {
            x: 129,
            y: 6,
            value: 0.054,
            name: '1979 ~ Jul'
        }, {
            x: 129,
            y: 7,
            value: 0.08,
            name: '1979 ~ Aug'
        }, {
            x: 129,
            y: 8,
            value: 0.092,
            name: '1979 ~ Sep'
        }, {
            x: 129,
            y: 9,
            value: 0.131,
            name: '1979 ~ Oct'
        }, {
            x: 129,
            y: 10,
            value: 0.147,
            name: '1979 ~ Nov'
        }, {
            x: 129,
            y: 11,
            value: 0.356,
            name: '1979 ~ Dec'
        }, {
            x: 130,
            y: 0,
            value: 0.133,
            name: '1980 ~ Jan'
        }, {
            x: 130,
            y: 1,
            value: 0.219,
            name: '1980 ~ Feb'
        }, {
            x: 130,
            y: 2,
            value: 0.072,
            name: '1980 ~ Mar'
        }, {
            x: 130,
            y: 3,
            value: 0.14,
            name: '1980 ~ Apr'
        }, {
            x: 130,
            y: 4,
            value: 0.139,
            name: '1980 ~ May'
        }, {
            x: 130,
            y: 5,
            value: 0.07,
            name: '1980 ~ Jun'
        }, {
            x: 130,
            y: 6,
            value: 0.06,
            name: '1980 ~ Jul'
        }, {
            x: 130,
            y: 7,
            value: 0.036,
            name: '1980 ~ Aug'
        }, {
            x: 130,
            y: 8,
            value: 0.037,
            name: '1980 ~ Sep'
        }, {
            x: 130,
            y: 9,
            value: 0.007,
            name: '1980 ~ Oct'
        }, {
            x: 130,
            y: 10,
            value: 0.131,
            name: '1980 ~ Nov'
        }, {
            x: 130,
            y: 11,
            value: 0.058,
            name: '1980 ~ Dec'
        }, {
            x: 131,
            y: 0,
            value: 0.334,
            name: '1981 ~ Jan'
        }, {
            x: 131,
            y: 1,
            value: 0.196,
            name: '1981 ~ Feb'
        }, {
            x: 131,
            y: 2,
            value: 0.207,
            name: '1981 ~ Mar'
        }, {
            x: 131,
            y: 3,
            value: 0.128,
            name: '1981 ~ Apr'
        }, {
            x: 131,
            y: 4,
            value: 0.066,
            name: '1981 ~ May'
        }, {
            x: 131,
            y: 5,
            value: 0.123,
            name: '1981 ~ Jun'
        }, {
            x: 131,
            y: 6,
            value: 0.094,
            name: '1981 ~ Jul'
        }, {
            x: 131,
            y: 7,
            value: 0.122,
            name: '1981 ~ Aug'
        }, {
            x: 131,
            y: 8,
            value: 0.072,
            name: '1981 ~ Sep'
        }, {
            x: 131,
            y: 9,
            value: 0.003,
            name: '1981 ~ Oct'
        }, {
            x: 131,
            y: 10,
            value: 0.071,
            name: '1981 ~ Nov'
        }, {
            x: 131,
            y: 11,
            value: 0.267,
            name: '1981 ~ Dec'
        }, {
            x: 132,
            y: 0,
            value: -0.048,
            name: '1982 ~ Jan'
        }, {
            x: 132,
            y: 1,
            value: 0.005,
            name: '1982 ~ Feb'
        }, {
            x: 132,
            y: 2,
            value: -0.127,
            name: '1982 ~ Mar'
        }, {
            x: 132,
            y: 3,
            value: 0.026,
            name: '1982 ~ Apr'
        }, {
            x: 132,
            y: 4,
            value: 0.043,
            name: '1982 ~ May'
        }, {
            x: 132,
            y: 5,
            value: -0.049,
            name: '1982 ~ Jun'
        }, {
            x: 132,
            y: 6,
            value: -0.019,
            name: '1982 ~ Jul'
        }, {
            x: 132,
            y: 7,
            value: -0.009,
            name: '1982 ~ Aug'
        }, {
            x: 132,
            y: 8,
            value: 0.074,
            name: '1982 ~ Sep'
        }, {
            x: 132,
            y: 9,
            value: 0.005,
            name: '1982 ~ Oct'
        }, {
            x: 132,
            y: 10,
            value: -0.01,
            name: '1982 ~ Nov'
        }, {
            x: 132,
            y: 11,
            value: 0.253,
            name: '1982 ~ Dec'
        }, {
            x: 133,
            y: 0,
            value: 0.431,
            name: '1983 ~ Jan'
        }, {
            x: 133,
            y: 1,
            value: 0.31,
            name: '1983 ~ Feb'
        }, {
            x: 133,
            y: 2,
            value: 0.209,
            name: '1983 ~ Mar'
        }, {
            x: 133,
            y: 3,
            value: 0.115,
            name: '1983 ~ Apr'
        }, {
            x: 133,
            y: 4,
            value: 0.135,
            name: '1983 ~ May'
        }, {
            x: 133,
            y: 5,
            value: 0.136,
            name: '1983 ~ Jun'
        }, {
            x: 133,
            y: 6,
            value: 0.151,
            name: '1983 ~ Jul'
        }, {
            x: 133,
            y: 7,
            value: 0.198,
            name: '1983 ~ Aug'
        }, {
            x: 133,
            y: 8,
            value: 0.188,
            name: '1983 ~ Sep'
        }, {
            x: 133,
            y: 9,
            value: 0.099,
            name: '1983 ~ Oct'
        }, {
            x: 133,
            y: 10,
            value: 0.257,
            name: '1983 ~ Nov'
        }, {
            x: 133,
            y: 11,
            value: 0.083,
            name: '1983 ~ Dec'
        }, {
            x: 134,
            y: 0,
            value: 0.12,
            name: '1984 ~ Jan'
        }, {
            x: 134,
            y: 1,
            value: 0.017,
            name: '1984 ~ Feb'
        }, {
            x: 134,
            y: 2,
            value: 0.05,
            name: '1984 ~ Mar'
        }, {
            x: 134,
            y: 3,
            value: -0.041,
            name: '1984 ~ Apr'
        }, {
            x: 134,
            y: 4,
            value: 0.09,
            name: '1984 ~ May'
        }, {
            x: 134,
            y: 5,
            value: -0.014,
            name: '1984 ~ Jun'
        }, {
            x: 134,
            y: 6,
            value: -0.034,
            name: '1984 ~ Jul'
        }, {
            x: 134,
            y: 7,
            value: 0.04,
            name: '1984 ~ Aug'
        }, {
            x: 134,
            y: 8,
            value: 0.036,
            name: '1984 ~ Sep'
        }, {
            x: 134,
            y: 9,
            value: -0.023,
            name: '1984 ~ Oct'
        }, {
            x: 134,
            y: 10,
            value: -0.124,
            name: '1984 ~ Nov'
        }, {
            x: 134,
            y: 11,
            value: -0.277,
            name: '1984 ~ Dec'
        }, {
            x: 135,
            y: 0,
            value: 0.008,
            name: '1985 ~ Jan'
        }, {
            x: 135,
            y: 1,
            value: -0.138,
            name: '1985 ~ Feb'
        }, {
            x: 135,
            y: 2,
            value: -0.026,
            name: '1985 ~ Mar'
        }, {
            x: 135,
            y: 3,
            value: -0.035,
            name: '1985 ~ Apr'
        }, {
            x: 135,
            y: 4,
            value: -0.002,
            name: '1985 ~ May'
        }, {
            x: 135,
            y: 5,
            value: -0.059,
            name: '1985 ~ Jun'
        }, {
            x: 135,
            y: 6,
            value: -0.057,
            name: '1985 ~ Jul'
        }, {
            x: 135,
            y: 7,
            value: 0.03,
            name: '1985 ~ Aug'
        }, {
            x: 135,
            y: 8,
            value: -0.03,
            name: '1985 ~ Sep'
        }, {
            x: 135,
            y: 9,
            value: 0.021,
            name: '1985 ~ Oct'
        }, {
            x: 135,
            y: 10,
            value: -0.077,
            name: '1985 ~ Nov'
        }, {
            x: 135,
            y: 11,
            value: 0.013,
            name: '1985 ~ Dec'
        }, {
            x: 136,
            y: 0,
            value: 0.127,
            name: '1986 ~ Jan'
        }, {
            x: 136,
            y: 1,
            value: 0.089,
            name: '1986 ~ Feb'
        }, {
            x: 136,
            y: 2,
            value: 0.076,
            name: '1986 ~ Mar'
        }, {
            x: 136,
            y: 3,
            value: 0.082,
            name: '1986 ~ Apr'
        }, {
            x: 136,
            y: 4,
            value: 0.044,
            name: '1986 ~ May'
        }, {
            x: 136,
            y: 5,
            value: 0.051,
            name: '1986 ~ Jun'
        }, {
            x: 136,
            y: 6,
            value: 0,
            name: '1986 ~ Jul'
        }, {
            x: 136,
            y: 7,
            value: 0.005,
            name: '1986 ~ Aug'
        }, {
            x: 136,
            y: 8,
            value: 0.013,
            name: '1986 ~ Sep'
        }, {
            x: 136,
            y: 9,
            value: 0.064,
            name: '1986 ~ Oct'
        }, {
            x: 136,
            y: 10,
            value: -0.004,
            name: '1986 ~ Nov'
        }, {
            x: 136,
            y: 11,
            value: 0.01,
            name: '1986 ~ Dec'
        }, {
            x: 137,
            y: 0,
            value: 0.112,
            name: '1987 ~ Jan'
        }, {
            x: 137,
            y: 1,
            value: 0.302,
            name: '1987 ~ Feb'
        }, {
            x: 137,
            y: 2,
            value: 0.024,
            name: '1987 ~ Mar'
        }, {
            x: 137,
            y: 3,
            value: 0.093,
            name: '1987 ~ Apr'
        }, {
            x: 137,
            y: 4,
            value: 0.143,
            name: '1987 ~ May'
        }, {
            x: 137,
            y: 5,
            value: 0.125,
            name: '1987 ~ Jun'
        }, {
            x: 137,
            y: 6,
            value: 0.266,
            name: '1987 ~ Jul'
        }, {
            x: 137,
            y: 7,
            value: 0.233,
            name: '1987 ~ Aug'
        }, {
            x: 137,
            y: 8,
            value: 0.272,
            name: '1987 ~ Sep'
        }, {
            x: 137,
            y: 9,
            value: 0.2,
            name: '1987 ~ Oct'
        }, {
            x: 137,
            y: 10,
            value: 0.196,
            name: '1987 ~ Nov'
        }, {
            x: 137,
            y: 11,
            value: 0.322,
            name: '1987 ~ Dec'
        }, {
            x: 138,
            y: 0,
            value: 0.39,
            name: '1988 ~ Jan'
        }, {
            x: 138,
            y: 1,
            value: 0.229,
            name: '1988 ~ Feb'
        }, {
            x: 138,
            y: 2,
            value: 0.268,
            name: '1988 ~ Mar'
        }, {
            x: 138,
            y: 3,
            value: 0.228,
            name: '1988 ~ Apr'
        }, {
            x: 138,
            y: 4,
            value: 0.21,
            name: '1988 ~ May'
        }, {
            x: 138,
            y: 5,
            value: 0.224,
            name: '1988 ~ Jun'
        }, {
            x: 138,
            y: 6,
            value: 0.181,
            name: '1988 ~ Jul'
        }, {
            x: 138,
            y: 7,
            value: 0.179,
            name: '1988 ~ Aug'
        }, {
            x: 138,
            y: 8,
            value: 0.188,
            name: '1988 ~ Sep'
        }, {
            x: 138,
            y: 9,
            value: 0.146,
            name: '1988 ~ Oct'
        }, {
            x: 138,
            y: 10,
            value: 0.03,
            name: '1988 ~ Nov'
        }, {
            x: 138,
            y: 11,
            value: 0.149,
            name: '1988 ~ Dec'
        }, {
            x: 139,
            y: 0,
            value: 0.015,
            name: '1989 ~ Jan'
        }, {
            x: 139,
            y: 1,
            value: 0.147,
            name: '1989 ~ Feb'
        }, {
            x: 139,
            y: 2,
            value: 0.135,
            name: '1989 ~ Mar'
        }, {
            x: 139,
            y: 3,
            value: 0.08,
            name: '1989 ~ Apr'
        }, {
            x: 139,
            y: 4,
            value: 0.079,
            name: '1989 ~ May'
        }, {
            x: 139,
            y: 5,
            value: 0.079,
            name: '1989 ~ Jun'
        }, {
            x: 139,
            y: 6,
            value: 0.162,
            name: '1989 ~ Jul'
        }, {
            x: 139,
            y: 7,
            value: 0.181,
            name: '1989 ~ Aug'
        }, {
            x: 139,
            y: 8,
            value: 0.145,
            name: '1989 ~ Sep'
        }, {
            x: 139,
            y: 9,
            value: 0.154,
            name: '1989 ~ Oct'
        }, {
            x: 139,
            y: 10,
            value: 0.062,
            name: '1989 ~ Nov'
        }, {
            x: 139,
            y: 11,
            value: 0.21,
            name: '1989 ~ Dec'
        }, {
            x: 140,
            y: 0,
            value: 0.222,
            name: '1990 ~ Jan'
        }, {
            x: 140,
            y: 1,
            value: 0.307,
            name: '1990 ~ Feb'
        }, {
            x: 140,
            y: 2,
            value: 0.562,
            name: '1990 ~ Mar'
        }, {
            x: 140,
            y: 3,
            value: 0.367,
            name: '1990 ~ Apr'
        }, {
            x: 140,
            y: 4,
            value: 0.28,
            name: '1990 ~ May'
        }, {
            x: 140,
            y: 5,
            value: 0.279,
            name: '1990 ~ Jun'
        }, {
            x: 140,
            y: 6,
            value: 0.234,
            name: '1990 ~ Jul'
        }, {
            x: 140,
            y: 7,
            value: 0.252,
            name: '1990 ~ Aug'
        }, {
            x: 140,
            y: 8,
            value: 0.175,
            name: '1990 ~ Sep'
        }, {
            x: 140,
            y: 9,
            value: 0.33,
            name: '1990 ~ Oct'
        }, {
            x: 140,
            y: 10,
            value: 0.316,
            name: '1990 ~ Nov'
        }, {
            x: 140,
            y: 11,
            value: 0.247,
            name: '1990 ~ Dec'
        }, {
            x: 141,
            y: 0,
            value: 0.288,
            name: '1991 ~ Jan'
        }, {
            x: 141,
            y: 1,
            value: 0.292,
            name: '1991 ~ Feb'
        }, {
            x: 141,
            y: 2,
            value: 0.19,
            name: '1991 ~ Mar'
        }, {
            x: 141,
            y: 3,
            value: 0.385,
            name: '1991 ~ Apr'
        }, {
            x: 141,
            y: 4,
            value: 0.302,
            name: '1991 ~ May'
        }, {
            x: 141,
            y: 5,
            value: 0.306,
            name: '1991 ~ Jun'
        }, {
            x: 141,
            y: 6,
            value: 0.312,
            name: '1991 ~ Jul'
        }, {
            x: 141,
            y: 7,
            value: 0.261,
            name: '1991 ~ Aug'
        }, {
            x: 141,
            y: 8,
            value: 0.243,
            name: '1991 ~ Sep'
        }, {
            x: 141,
            y: 9,
            value: 0.187,
            name: '1991 ~ Oct'
        }, {
            x: 141,
            y: 10,
            value: 0.158,
            name: '1991 ~ Nov'
        }, {
            x: 141,
            y: 11,
            value: 0.125,
            name: '1991 ~ Dec'
        }, {
            x: 142,
            y: 0,
            value: 0.366,
            name: '1992 ~ Jan'
        }, {
            x: 142,
            y: 1,
            value: 0.321,
            name: '1992 ~ Feb'
        }, {
            x: 142,
            y: 2,
            value: 0.252,
            name: '1992 ~ Mar'
        }, {
            x: 142,
            y: 3,
            value: 0.144,
            name: '1992 ~ Apr'
        }, {
            x: 142,
            y: 4,
            value: 0.178,
            name: '1992 ~ May'
        }, {
            x: 142,
            y: 5,
            value: 0.127,
            name: '1992 ~ Jun'
        }, {
            x: 142,
            y: 6,
            value: -0.013,
            name: '1992 ~ Jul'
        }, {
            x: 142,
            y: 7,
            value: 0.006,
            name: '1992 ~ Aug'
        }, {
            x: 142,
            y: 8,
            value: -0.059,
            name: '1992 ~ Sep'
        }, {
            x: 142,
            y: 9,
            value: -0.05,
            name: '1992 ~ Oct'
        }, {
            x: 142,
            y: 10,
            value: -0.089,
            name: '1992 ~ Nov'
        }, {
            x: 142,
            y: 11,
            value: 0.078,
            name: '1992 ~ Dec'
        }, {
            x: 143,
            y: 0,
            value: 0.312,
            name: '1993 ~ Jan'
        }, {
            x: 143,
            y: 1,
            value: 0.252,
            name: '1993 ~ Feb'
        }, {
            x: 143,
            y: 2,
            value: 0.244,
            name: '1993 ~ Mar'
        }, {
            x: 143,
            y: 3,
            value: 0.131,
            name: '1993 ~ Apr'
        }, {
            x: 143,
            y: 4,
            value: 0.179,
            name: '1993 ~ May'
        }, {
            x: 143,
            y: 5,
            value: 0.177,
            name: '1993 ~ Jun'
        }, {
            x: 143,
            y: 6,
            value: 0.133,
            name: '1993 ~ Jul'
        }, {
            x: 143,
            y: 7,
            value: 0.096,
            name: '1993 ~ Aug'
        }, {
            x: 143,
            y: 8,
            value: 0.062,
            name: '1993 ~ Sep'
        }, {
            x: 143,
            y: 9,
            value: 0.098,
            name: '1993 ~ Oct'
        }, {
            x: 143,
            y: 10,
            value: -0.046,
            name: '1993 ~ Nov'
        }, {
            x: 143,
            y: 11,
            value: 0.119,
            name: '1993 ~ Dec'
        }, {
            x: 144,
            y: 0,
            value: 0.178,
            name: '1994 ~ Jan'
        }, {
            x: 144,
            y: 1,
            value: -0.052,
            name: '1994 ~ Feb'
        }, {
            x: 144,
            y: 2,
            value: 0.22,
            name: '1994 ~ Mar'
        }, {
            x: 144,
            y: 3,
            value: 0.206,
            name: '1994 ~ Apr'
        }, {
            x: 144,
            y: 4,
            value: 0.271,
            name: '1994 ~ May'
        }, {
            x: 144,
            y: 5,
            value: 0.265,
            name: '1994 ~ Jun'
        }, {
            x: 144,
            y: 6,
            value: 0.173,
            name: '1994 ~ Jul'
        }, {
            x: 144,
            y: 7,
            value: 0.182,
            name: '1994 ~ Aug'
        }, {
            x: 144,
            y: 8,
            value: 0.187,
            name: '1994 ~ Sep'
        }, {
            x: 144,
            y: 9,
            value: 0.307,
            name: '1994 ~ Oct'
        }, {
            x: 144,
            y: 10,
            value: 0.308,
            name: '1994 ~ Nov'
        }, {
            x: 144,
            y: 11,
            value: 0.245,
            name: '1994 ~ Dec'
        }, {
            x: 145,
            y: 0,
            value: 0.419,
            name: '1995 ~ Jan'
        }, {
            x: 145,
            y: 1,
            value: 0.595,
            name: '1995 ~ Feb'
        }, {
            x: 145,
            y: 2,
            value: 0.325,
            name: '1995 ~ Mar'
        }, {
            x: 145,
            y: 3,
            value: 0.284,
            name: '1995 ~ Apr'
        }, {
            x: 145,
            y: 4,
            value: 0.216,
            name: '1995 ~ May'
        }, {
            x: 145,
            y: 5,
            value: 0.308,
            name: '1995 ~ Jun'
        }, {
            x: 145,
            y: 6,
            value: 0.327,
            name: '1995 ~ Jul'
        }, {
            x: 145,
            y: 7,
            value: 0.354,
            name: '1995 ~ Aug'
        }, {
            x: 145,
            y: 8,
            value: 0.252,
            name: '1995 ~ Sep'
        }, {
            x: 145,
            y: 9,
            value: 0.329,
            name: '1995 ~ Oct'
        }, {
            x: 145,
            y: 10,
            value: 0.322,
            name: '1995 ~ Nov'
        }, {
            x: 145,
            y: 11,
            value: 0.127,
            name: '1995 ~ Dec'
        }, {
            x: 146,
            y: 0,
            value: 0.115,
            name: '1996 ~ Jan'
        }, {
            x: 146,
            y: 1,
            value: 0.323,
            name: '1996 ~ Feb'
        }, {
            x: 146,
            y: 2,
            value: 0.186,
            name: '1996 ~ Mar'
        }, {
            x: 146,
            y: 3,
            value: 0.13,
            name: '1996 ~ Apr'
        }, {
            x: 146,
            y: 4,
            value: 0.216,
            name: '1996 ~ May'
        }, {
            x: 146,
            y: 5,
            value: 0.17,
            name: '1996 ~ Jun'
        }, {
            x: 146,
            y: 6,
            value: 0.221,
            name: '1996 ~ Jul'
        }, {
            x: 146,
            y: 7,
            value: 0.205,
            name: '1996 ~ Aug'
        }, {
            x: 146,
            y: 8,
            value: 0.099,
            name: '1996 ~ Sep'
        }, {
            x: 146,
            y: 9,
            value: 0.135,
            name: '1996 ~ Oct'
        }, {
            x: 146,
            y: 10,
            value: 0.149,
            name: '1996 ~ Nov'
        }, {
            x: 146,
            y: 11,
            value: 0.234,
            name: '1996 ~ Dec'
        }, {
            x: 147,
            y: 0,
            value: 0.206,
            name: '1997 ~ Jan'
        }, {
            x: 147,
            y: 1,
            value: 0.318,
            name: '1997 ~ Feb'
        }, {
            x: 147,
            y: 2,
            value: 0.347,
            name: '1997 ~ Mar'
        }, {
            x: 147,
            y: 3,
            value: 0.273,
            name: '1997 ~ Apr'
        }, {
            x: 147,
            y: 4,
            value: 0.286,
            name: '1997 ~ May'
        }, {
            x: 147,
            y: 5,
            value: 0.402,
            name: '1997 ~ Jun'
        }, {
            x: 147,
            y: 6,
            value: 0.366,
            name: '1997 ~ Jul'
        }, {
            x: 147,
            y: 7,
            value: 0.438,
            name: '1997 ~ Aug'
        }, {
            x: 147,
            y: 8,
            value: 0.475,
            name: '1997 ~ Sep'
        }, {
            x: 147,
            y: 9,
            value: 0.554,
            name: '1997 ~ Oct'
        }, {
            x: 147,
            y: 10,
            value: 0.498,
            name: '1997 ~ Nov'
        }, {
            x: 147,
            y: 11,
            value: 0.505,
            name: '1997 ~ Dec'
        }, {
            x: 148,
            y: 0,
            value: 0.483,
            name: '1998 ~ Jan'
        }, {
            x: 148,
            y: 1,
            value: 0.763,
            name: '1998 ~ Feb'
        }, {
            x: 148,
            y: 2,
            value: 0.558,
            name: '1998 ~ Mar'
        }, {
            x: 148,
            y: 3,
            value: 0.636,
            name: '1998 ~ Apr'
        }, {
            x: 148,
            y: 4,
            value: 0.573,
            name: '1998 ~ May'
        }, {
            x: 148,
            y: 5,
            value: 0.592,
            name: '1998 ~ Jun'
        }, {
            x: 148,
            y: 6,
            value: 0.672,
            name: '1998 ~ Jul'
        }, {
            x: 148,
            y: 7,
            value: 0.603,
            name: '1998 ~ Aug'
        }, {
            x: 148,
            y: 8,
            value: 0.392,
            name: '1998 ~ Sep'
        }, {
            x: 148,
            y: 9,
            value: 0.404,
            name: '1998 ~ Oct'
        }, {
            x: 148,
            y: 10,
            value: 0.295,
            name: '1998 ~ Nov'
        }, {
            x: 148,
            y: 11,
            value: 0.473,
            name: '1998 ~ Dec'
        }, {
            x: 149,
            y: 0,
            value: 0.347,
            name: '1999 ~ Jan'
        }, {
            x: 149,
            y: 1,
            value: 0.589,
            name: '1999 ~ Feb'
        }, {
            x: 149,
            y: 2,
            value: 0.228,
            name: '1999 ~ Mar'
        }, {
            x: 149,
            y: 3,
            value: 0.327,
            name: '1999 ~ Apr'
        }, {
            x: 149,
            y: 4,
            value: 0.245,
            name: '1999 ~ May'
        }, {
            x: 149,
            y: 5,
            value: 0.273,
            name: '1999 ~ Jun'
        }, {
            x: 149,
            y: 6,
            value: 0.291,
            name: '1999 ~ Jul'
        }, {
            x: 149,
            y: 7,
            value: 0.223,
            name: '1999 ~ Aug'
        }, {
            x: 149,
            y: 8,
            value: 0.298,
            name: '1999 ~ Sep'
        }, {
            x: 149,
            y: 9,
            value: 0.254,
            name: '1999 ~ Oct'
        }, {
            x: 149,
            y: 10,
            value: 0.237,
            name: '1999 ~ Nov'
        }, {
            x: 149,
            y: 11,
            value: 0.383,
            name: '1999 ~ Dec'
        }, {
            x: 150,
            y: 0,
            value: 0.227,
            name: '2000 ~ Jan'
        }, {
            x: 150,
            y: 1,
            value: 0.455,
            name: '2000 ~ Feb'
        }, {
            x: 150,
            y: 2,
            value: 0.382,
            name: '2000 ~ Mar'
        }, {
            x: 150,
            y: 3,
            value: 0.479,
            name: '2000 ~ Apr'
        }, {
            x: 150,
            y: 4,
            value: 0.28,
            name: '2000 ~ May'
        }, {
            x: 150,
            y: 5,
            value: 0.275,
            name: '2000 ~ Jun'
        }, {
            x: 150,
            y: 6,
            value: 0.262,
            name: '2000 ~ Jul'
        }, {
            x: 150,
            y: 7,
            value: 0.358,
            name: '2000 ~ Aug'
        }, {
            x: 150,
            y: 8,
            value: 0.307,
            name: '2000 ~ Sep'
        }, {
            x: 150,
            y: 9,
            value: 0.222,
            name: '2000 ~ Oct'
        }, {
            x: 150,
            y: 10,
            value: 0.162,
            name: '2000 ~ Nov'
        }, {
            x: 150,
            y: 11,
            value: 0.151,
            name: '2000 ~ Dec'
        }, {
            x: 151,
            y: 0,
            value: 0.363,
            name: '2001 ~ Jan'
        }, {
            x: 151,
            y: 1,
            value: 0.325,
            name: '2001 ~ Feb'
        }, {
            x: 151,
            y: 2,
            value: 0.515,
            name: '2001 ~ Mar'
        }, {
            x: 151,
            y: 3,
            value: 0.453,
            name: '2001 ~ Apr'
        }, {
            x: 151,
            y: 4,
            value: 0.414,
            name: '2001 ~ May'
        }, {
            x: 151,
            y: 5,
            value: 0.43,
            name: '2001 ~ Jun'
        }, {
            x: 151,
            y: 6,
            value: 0.465,
            name: '2001 ~ Jul'
        }, {
            x: 151,
            y: 7,
            value: 0.5,
            name: '2001 ~ Aug'
        }, {
            x: 151,
            y: 8,
            value: 0.418,
            name: '2001 ~ Sep'
        }, {
            x: 151,
            y: 9,
            value: 0.417,
            name: '2001 ~ Oct'
        }, {
            x: 151,
            y: 10,
            value: 0.611,
            name: '2001 ~ Nov'
        }, {
            x: 151,
            y: 11,
            value: 0.37,
            name: '2001 ~ Dec'
        }, {
            x: 152,
            y: 0,
            value: 0.661,
            name: '2002 ~ Jan'
        }, {
            x: 152,
            y: 1,
            value: 0.705,
            name: '2002 ~ Feb'
        }, {
            x: 152,
            y: 2,
            value: 0.699,
            name: '2002 ~ Mar'
        }, {
            x: 152,
            y: 3,
            value: 0.465,
            name: '2002 ~ Apr'
        }, {
            x: 152,
            y: 4,
            value: 0.425,
            name: '2002 ~ May'
        }, {
            x: 152,
            y: 5,
            value: 0.476,
            name: '2002 ~ Jun'
        }, {
            x: 152,
            y: 6,
            value: 0.487,
            name: '2002 ~ Jul'
        }, {
            x: 152,
            y: 7,
            value: 0.445,
            name: '2002 ~ Aug'
        }, {
            x: 152,
            y: 8,
            value: 0.42,
            name: '2002 ~ Sep'
        }, {
            x: 152,
            y: 9,
            value: 0.407,
            name: '2002 ~ Oct'
        }, {
            x: 152,
            y: 10,
            value: 0.449,
            name: '2002 ~ Nov'
        }, {
            x: 152,
            y: 11,
            value: 0.327,
            name: '2002 ~ Dec'
        }, {
            x: 153,
            y: 0,
            value: 0.596,
            name: '2003 ~ Jan'
        }, {
            x: 153,
            y: 1,
            value: 0.453,
            name: '2003 ~ Feb'
        }, {
            x: 153,
            y: 2,
            value: 0.459,
            name: '2003 ~ Mar'
        }, {
            x: 153,
            y: 3,
            value: 0.437,
            name: '2003 ~ Apr'
        }, {
            x: 153,
            y: 4,
            value: 0.477,
            name: '2003 ~ May'
        }, {
            x: 153,
            y: 5,
            value: 0.46,
            name: '2003 ~ Jun'
        }, {
            x: 153,
            y: 6,
            value: 0.477,
            name: '2003 ~ Jul'
        }, {
            x: 153,
            y: 7,
            value: 0.55,
            name: '2003 ~ Aug'
        }, {
            x: 153,
            y: 8,
            value: 0.542,
            name: '2003 ~ Sep'
        }, {
            x: 153,
            y: 9,
            value: 0.612,
            name: '2003 ~ Oct'
        }, {
            x: 153,
            y: 10,
            value: 0.459,
            name: '2003 ~ Nov'
        }, {
            x: 153,
            y: 11,
            value: 0.595,
            name: '2003 ~ Dec'
        }, {
            x: 154,
            y: 0,
            value: 0.502,
            name: '2004 ~ Jan'
        }, {
            x: 154,
            y: 1,
            value: 0.611,
            name: '2004 ~ Feb'
        }, {
            x: 154,
            y: 2,
            value: 0.525,
            name: '2004 ~ Mar'
        }, {
            x: 154,
            y: 3,
            value: 0.479,
            name: '2004 ~ Apr'
        }, {
            x: 154,
            y: 4,
            value: 0.315,
            name: '2004 ~ May'
        }, {
            x: 154,
            y: 5,
            value: 0.328,
            name: '2004 ~ Jun'
        }, {
            x: 154,
            y: 6,
            value: 0.358,
            name: '2004 ~ Jul'
        }, {
            x: 154,
            y: 7,
            value: 0.397,
            name: '2004 ~ Aug'
        }, {
            x: 154,
            y: 8,
            value: 0.442,
            name: '2004 ~ Sep'
        }, {
            x: 154,
            y: 9,
            value: 0.472,
            name: '2004 ~ Oct'
        }, {
            x: 154,
            y: 10,
            value: 0.6,
            name: '2004 ~ Nov'
        }, {
            x: 154,
            y: 11,
            value: 0.359,
            name: '2004 ~ Dec'
        }, {
            x: 155,
            y: 0,
            value: 0.55,
            name: '2005 ~ Jan'
        }, {
            x: 155,
            y: 1,
            value: 0.395,
            name: '2005 ~ Feb'
        }, {
            x: 155,
            y: 2,
            value: 0.56,
            name: '2005 ~ Mar'
        }, {
            x: 155,
            y: 3,
            value: 0.603,
            name: '2005 ~ Apr'
        }, {
            x: 155,
            y: 4,
            value: 0.52,
            name: '2005 ~ May'
        }, {
            x: 155,
            y: 5,
            value: 0.552,
            name: '2005 ~ Jun'
        }, {
            x: 155,
            y: 6,
            value: 0.55,
            name: '2005 ~ Jul'
        }, {
            x: 155,
            y: 7,
            value: 0.54,
            name: '2005 ~ Aug'
        }, {
            x: 155,
            y: 8,
            value: 0.566,
            name: '2005 ~ Sep'
        }, {
            x: 155,
            y: 9,
            value: 0.608,
            name: '2005 ~ Oct'
        }, {
            x: 155,
            y: 10,
            value: 0.629,
            name: '2005 ~ Nov'
        }, {
            x: 155,
            y: 11,
            value: 0.472,
            name: '2005 ~ Dec'
        }, {
            x: 156,
            y: 0,
            value: 0.385,
            name: '2006 ~ Jan'
        }, {
            x: 156,
            y: 1,
            value: 0.562,
            name: '2006 ~ Feb'
        }, {
            x: 156,
            y: 2,
            value: 0.463,
            name: '2006 ~ Mar'
        }, {
            x: 156,
            y: 3,
            value: 0.407,
            name: '2006 ~ Apr'
        }, {
            x: 156,
            y: 4,
            value: 0.401,
            name: '2006 ~ May'
        }, {
            x: 156,
            y: 5,
            value: 0.525,
            name: '2006 ~ Jun'
        }, {
            x: 156,
            y: 6,
            value: 0.488,
            name: '2006 ~ Jul'
        }, {
            x: 156,
            y: 7,
            value: 0.532,
            name: '2006 ~ Aug'
        }, {
            x: 156,
            y: 8,
            value: 0.499,
            name: '2006 ~ Sep'
        }, {
            x: 156,
            y: 9,
            value: 0.562,
            name: '2006 ~ Oct'
        }, {
            x: 156,
            y: 10,
            value: 0.541,
            name: '2006 ~ Nov'
        }, {
            x: 156,
            y: 11,
            value: 0.698,
            name: '2006 ~ Dec'
        }, {
            x: 157,
            y: 0,
            value: 0.832,
            name: '2007 ~ Jan'
        }, {
            x: 157,
            y: 1,
            value: 0.56,
            name: '2007 ~ Feb'
        }, {
            x: 157,
            y: 2,
            value: 0.524,
            name: '2007 ~ Mar'
        }, {
            x: 157,
            y: 3,
            value: 0.581,
            name: '2007 ~ Apr'
        }, {
            x: 157,
            y: 4,
            value: 0.447,
            name: '2007 ~ May'
        }, {
            x: 157,
            y: 5,
            value: 0.419,
            name: '2007 ~ Jun'
        }, {
            x: 157,
            y: 6,
            value: 0.441,
            name: '2007 ~ Jul'
        }, {
            x: 157,
            y: 7,
            value: 0.443,
            name: '2007 ~ Aug'
        }, {
            x: 157,
            y: 8,
            value: 0.459,
            name: '2007 ~ Sep'
        }, {
            x: 157,
            y: 9,
            value: 0.481,
            name: '2007 ~ Oct'
        }, {
            x: 157,
            y: 10,
            value: 0.387,
            name: '2007 ~ Nov'
        }, {
            x: 157,
            y: 11,
            value: 0.349,
            name: '2007 ~ Dec'
        }, {
            x: 158,
            y: 0,
            value: 0.171,
            name: '2008 ~ Jan'
        }, {
            x: 158,
            y: 1,
            value: 0.245,
            name: '2008 ~ Feb'
        }, {
            x: 158,
            y: 2,
            value: 0.55,
            name: '2008 ~ Mar'
        }, {
            x: 158,
            y: 3,
            value: 0.331,
            name: '2008 ~ Apr'
        }, {
            x: 158,
            y: 4,
            value: 0.34,
            name: '2008 ~ May'
        }, {
            x: 158,
            y: 5,
            value: 0.362,
            name: '2008 ~ Jun'
        }, {
            x: 158,
            y: 6,
            value: 0.451,
            name: '2008 ~ Jul'
        }, {
            x: 158,
            y: 7,
            value: 0.432,
            name: '2008 ~ Aug'
        }, {
            x: 158,
            y: 8,
            value: 0.406,
            name: '2008 ~ Sep'
        }, {
            x: 158,
            y: 9,
            value: 0.547,
            name: '2008 ~ Oct'
        }, {
            x: 158,
            y: 10,
            value: 0.524,
            name: '2008 ~ Nov'
        }, {
            x: 158,
            y: 11,
            value: 0.391,
            name: '2008 ~ Dec'
        }, {
            x: 159,
            y: 0,
            value: 0.481,
            name: '2009 ~ Jan'
        }, {
            x: 159,
            y: 1,
            value: 0.441,
            name: '2009 ~ Feb'
        }, {
            x: 159,
            y: 2,
            value: 0.406,
            name: '2009 ~ Mar'
        }, {
            x: 159,
            y: 3,
            value: 0.515,
            name: '2009 ~ Apr'
        }, {
            x: 159,
            y: 4,
            value: 0.441,
            name: '2009 ~ May'
        }, {
            x: 159,
            y: 5,
            value: 0.554,
            name: '2009 ~ Jun'
        }, {
            x: 159,
            y: 6,
            value: 0.539,
            name: '2009 ~ Jul'
        }, {
            x: 159,
            y: 7,
            value: 0.589,
            name: '2009 ~ Aug'
        }, {
            x: 159,
            y: 8,
            value: 0.564,
            name: '2009 ~ Sep'
        }, {
            x: 159,
            y: 9,
            value: 0.515,
            name: '2009 ~ Oct'
        }, {
            x: 159,
            y: 10,
            value: 0.545,
            name: '2009 ~ Nov'
        }, {
            x: 159,
            y: 11,
            value: 0.474,
            name: '2009 ~ Dec'
        }, {
            x: 160,
            y: 0,
            value: 0.561,
            name: '2010 ~ Jan'
        }, {
            x: 160,
            y: 1,
            value: 0.577,
            name: '2010 ~ Feb'
        }, {
            x: 160,
            y: 2,
            value: 0.678,
            name: '2010 ~ Mar'
        }, {
            x: 160,
            y: 3,
            value: 0.679,
            name: '2010 ~ Apr'
        }, {
            x: 160,
            y: 4,
            value: 0.591,
            name: '2010 ~ May'
        }, {
            x: 160,
            y: 5,
            value: 0.587,
            name: '2010 ~ Jun'
        }, {
            x: 160,
            y: 6,
            value: 0.619,
            name: '2010 ~ Jul'
        }, {
            x: 160,
            y: 7,
            value: 0.543,
            name: '2010 ~ Aug'
        }, {
            x: 160,
            y: 8,
            value: 0.442,
            name: '2010 ~ Sep'
        }, {
            x: 160,
            y: 9,
            value: 0.496,
            name: '2010 ~ Oct'
        }, {
            x: 160,
            y: 10,
            value: 0.593,
            name: '2010 ~ Nov'
        }, {
            x: 160,
            y: 11,
            value: 0.343,
            name: '2010 ~ Dec'
        }, {
            x: 161,
            y: 0,
            value: 0.313,
            name: '2011 ~ Jan'
        }, {
            x: 161,
            y: 1,
            value: 0.327,
            name: '2011 ~ Feb'
        }, {
            x: 161,
            y: 2,
            value: 0.425,
            name: '2011 ~ Mar'
        }, {
            x: 161,
            y: 3,
            value: 0.48,
            name: '2011 ~ Apr'
        }, {
            x: 161,
            y: 4,
            value: 0.384,
            name: '2011 ~ May'
        }, {
            x: 161,
            y: 5,
            value: 0.489,
            name: '2011 ~ Jun'
        }, {
            x: 161,
            y: 6,
            value: 0.51,
            name: '2011 ~ Jul'
        }, {
            x: 161,
            y: 7,
            value: 0.488,
            name: '2011 ~ Aug'
        }, {
            x: 161,
            y: 8,
            value: 0.454,
            name: '2011 ~ Sep'
        }, {
            x: 161,
            y: 9,
            value: 0.453,
            name: '2011 ~ Oct'
        }, {
            x: 161,
            y: 10,
            value: 0.347,
            name: '2011 ~ Nov'
        }, {
            x: 161,
            y: 11,
            value: 0.401,
            name: '2011 ~ Dec'
        }, {
            x: 162,
            y: 0,
            value: 0.306,
            name: '2012 ~ Jan'
        }, {
            x: 162,
            y: 1,
            value: 0.302,
            name: '2012 ~ Feb'
        }, {
            x: 162,
            y: 2,
            value: 0.358,
            name: '2012 ~ Mar'
        }, {
            x: 162,
            y: 3,
            value: 0.575,
            name: '2012 ~ Apr'
        }, {
            x: 162,
            y: 4,
            value: 0.574,
            name: '2012 ~ May'
        }, {
            x: 162,
            y: 5,
            value: 0.557,
            name: '2012 ~ Jun'
        }, {
            x: 162,
            y: 6,
            value: 0.51,
            name: '2012 ~ Jul'
        }, {
            x: 162,
            y: 7,
            value: 0.536,
            name: '2012 ~ Aug'
        }, {
            x: 162,
            y: 8,
            value: 0.553,
            name: '2012 ~ Sep'
        }, {
            x: 162,
            y: 9,
            value: 0.556,
            name: '2012 ~ Oct'
        }, {
            x: 162,
            y: 10,
            value: 0.554,
            name: '2012 ~ Nov'
        }, {
            x: 162,
            y: 11,
            value: 0.275,
            name: '2012 ~ Dec'
        }, {
            x: 163,
            y: 0,
            value: 0.45,
            name: '2013 ~ Jan'
        }, {
            x: 163,
            y: 1,
            value: 0.486,
            name: '2013 ~ Feb'
        }, {
            x: 163,
            y: 2,
            value: 0.401,
            name: '2013 ~ Mar'
        }, {
            x: 163,
            y: 3,
            value: 0.439,
            name: '2013 ~ Apr'
        }, {
            x: 163,
            y: 4,
            value: 0.52,
            name: '2013 ~ May'
        }, {
            x: 163,
            y: 5,
            value: 0.487,
            name: '2013 ~ Jun'
        }, {
            x: 163,
            y: 6,
            value: 0.514,
            name: '2013 ~ Jul'
        }, {
            x: 163,
            y: 7,
            value: 0.533,
            name: '2013 ~ Aug'
        }, {
            x: 163,
            y: 8,
            value: 0.535,
            name: '2013 ~ Sep'
        }, {
            x: 163,
            y: 9,
            value: 0.497,
            name: '2013 ~ Oct'
        }, {
            x: 163,
            y: 10,
            value: 0.639,
            name: '2013 ~ Nov'
        }, {
            x: 163,
            y: 11,
            value: 0.508,
            name: '2013 ~ Dec'
        }, {
            x: 164,
            y: 0,
            value: 0.523,
            name: '2014 ~ Jan'
        }, {
            x: 164,
            y: 1,
            value: 0.313,
            name: '2014 ~ Feb'
        }, {
            x: 164,
            y: 2,
            value: 0.561,
            name: '2014 ~ Mar'
        }, {
            x: 164,
            y: 3,
            value: 0.657,
            name: '2014 ~ Apr'
        }, {
            x: 164,
            y: 4,
            value: 0.599,
            name: '2014 ~ May'
        }, {
            x: 164,
            y: 5,
            value: 0.618,
            name: '2014 ~ Jun'
        }, {
            x: 164,
            y: 6,
            value: 0.541,
            name: '2014 ~ Jul'
        }, {
            x: 164,
            y: 7,
            value: 0.666,
            name: '2014 ~ Aug'
        }, {
            x: 164,
            y: 8,
            value: 0.589,
            name: '2014 ~ Sep'
        }, {
            x: 164,
            y: 9,
            value: 0.626,
            name: '2014 ~ Oct'
        }, {
            x: 164,
            y: 10,
            value: 0.489,
            name: '2014 ~ Nov'
        }, {
            x: 164,
            y: 11,
            value: 0.634,
            name: '2014 ~ Dec'
        }, {
            x: 165,
            y: 0,
            value: 0.688,
            name: '2015 ~ Jan'
        }, {
            x: 165,
            y: 1,
            value: 0.66,
            name: '2015 ~ Feb'
        }, {
            x: 165,
            y: 2,
            value: 0.681,
            name: '2015 ~ Mar'
        }, {
            x: 165,
            y: 3,
            value: 0.656,
            name: '2015 ~ Apr'
        }, {
            x: 165,
            y: 4,
            value: 0.696,
            name: '2015 ~ May'
        }, {
            x: 165,
            y: 5,
            value: 0.73,
            name: '2015 ~ Jun'
        }, {
            x: 165,
            y: 6,
            value: 0.696,
            name: '2015 ~ Jul'
        }, {
            x: 165,
            y: 7,
            value: 0.732,
            name: '2015 ~ Aug'
        }, {
            x: 165,
            y: 8,
            value: 0.784,
            name: '2015 ~ Sep'
        }, {
            x: 165,
            y: 9,
            value: 0.82,
            name: '2015 ~ Oct'
        }, {
            x: 165,
            y: 10,
            value: 0.81,
            name: '2015 ~ Nov'
        }, {
            x: 165,
            y: 11,
            value: 1.01,
            name: '2015 ~ Dec'
        }],
        showInLegend: false
    }],
    tooltip: {
        format: '{point.name}: {point.value:.2f}'
    },
    legend: {
        enabled: true
    },
    colorAxis: {
        auxarg: true,
        stops: [
            [
                0,
                '#000004'
            ],
            [0.1111,
                '#1B0C42'
            ],
            [0.2222,
                '#4B0C6B'
            ],
            [0.3333,
                '#781C6D'
            ],
            [0.4444,
                '#A52C60'
            ],
            [0.5556,
                '#CF4446'
            ],
            [0.6667,
                '#ED6925'
            ],
            [0.7778,
                '#FB9A06'
            ],
            [0.8889,
                '#F7D03C'
            ],
            [1,
                '#FCFFA4'
            ]
        ],
        min: -1,
        max: 1
    },
    xAxis: {
        categories: ['1850', '1851', '1852', '1853', '1854', '1855', '1856', '1857', '1858', '1859', '1860', '1861', '1862', '1863', '1864', '1865', '1866', '1867', '1868', '1869', '1870', '1871', '1872', '1873', '1874', '1875', '1876', '1877', '1878', '1879', '1880', '1881', '1882', '1883', '1884', '1885', '1886', '1887', '1888', '1889', '1890', '1891', '1892', '1893', '1894', '1895', '1896', '1897', '1898', '1899', '1900', '1901', '1902', '1903', '1904', '1905', '1906', '1907', '1908', '1909', '1910', '1911', '1912', '1913', '1914', '1915', '1916', '1917', '1918', '1919', '1920', '1921', '1922', '1923', '1924', '1925', '1926', '1927', '1928', '1929', '1930', '1931', '1932', '1933', '1934', '1935', '1936', '1937', '1938', '1939', '1940', '1941', '1942', '1943', '1944', '1945', '1946', '1947', '1948', '1949', '1950', '1951', '1952', '1953', '1954', '1955', '1956', '1957', '1958', '1959', '1960', '1961', '1962', '1963', '1964', '1965', '1966', '1967', '1968', '1969', '1970', '1971', '1972', '1973', '1974', '1975', '1976', '1977', '1978', '1979', '1980', '1981', '1982', '1983', '1984', '1985', '1986', '1987', '1988', '1989', '1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015'],
        title: {
            text: ''
        },
        opposite: true
    }
});
