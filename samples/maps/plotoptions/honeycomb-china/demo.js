Highcharts.chart('container', {
    chart: {
        type: 'tilemap',
        height: '90%',
        inverted: true
    },

    colors: [
        'rgba(255, 192, 77, 0.5)', 'rgba(255, 153, 255, 0.5)',
        'rgba(255, 77, 77, 0.5)', 'rgba(0, 200, 83, 0.5)',
        'rgba(41, 98, 255, 0.5)', 'rgba(41, 205, 255, 0.5)'
    ],

    title: {
        text: 'Provinces of China'
    },

    subtitle: {
        text: 'Source: <a href="https://en.wikipedia.org/wiki/Provinces_of_China">Wikipedia.org</a>'
    },

    xAxis: {
        visible: false
    },

    yAxis: {
        visible: false
    },

    legend: {
        enabled: true
    },

    tooltip: {
        headerFormat: null,
        pointFormat: '- The province of <b>{point.province}</b><br/>- <b>{point.capital}</b> is the captal<br/>- Chinese abbreviation <b>{point.abbreviation}</b><br/>- <b>{point.region}</b> region '
    },

    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                format: '{point.abbreviation}',
                color: '#000000',
                style: {
                    textOutline: false
                }
            }
        }
    },

    series: [{
        name: 'South Central China',
        data: [{
            'x': 7,
            'y': 5,
            abbreviation: '琼',
            capital: 'Haikou',
            province: 'Hainan',
            region: 'South Central China'
        }, {
            'x': 5,
            'y': 4,
            abbreviation: '桂',
            capital: 'Nanning',
            province: 'Guangxi',
            region: 'South Central China'
        }, {
            'x': 6,
            'y': 3,
            abbreviation: '粤',
            capital: 'Guangzhou',
            province: 'Guangdong',
            region: 'South Central China'
        }, {
            'x': 4,
            'y': 4,
            abbreviation: '湘',
            capital: 'Changsha',
            province: 'Hunan',
            region: 'South Central China'
        }, {
            'x': 5,
            'y': 3,
            abbreviation: '鄂',
            capital: 'Wuhan',
            province: 'Hubei',
            region: 'South Central China'
        }, {
            'x': 3,
            'y': 4,
            abbreviation: '豫',
            capital: 'Zhengzhou',
            province: 'Henan',
            region: 'South Central China'
        }, {
            'x': 6,
            'y': 5,
            abbreviation: '港',
            capital: 'Hong Kong',
            province: 'Hong Kong',
            region: 'South Central China'
        }, {
            x: 6,
            y: 4,
            abbreviation: '澳',
            capital: 'Macau',
            province: 'Macau',
            region: 'South Central China'
        }]
    }, {
        name: 'Southwest China',
        data: [{
            'x': 3,
            'y': 2,
            abbreviation: '云(滇)',
            capital: 'Kunming',
            province: 'Yunnan',
            region: 'Southwest China'
        }, {
            'x': 3,
            'y': 1,
            abbreviation: '川(蜀)',
            capital: 'Chengdu',
            province: 'Sichuan',
            region: 'Southwest China'
        }, {
            'x': 4,
            'y': 3,
            abbreviation: '贵(黔)',
            capital: 'Guiyang',
            province: 'Guizhou',
            region: 'Southwest China'
        }, {
            'x': 3,
            'y': 3,
            abbreviation: '渝',
            capital: 'Chongqing',
            province: 'Chongqing',
            region: 'Southwest China'
        }, {
            'x': 2,
            'y': 0,
            abbreviation: '藏',
            capital: 'Lhasa',
            province: 'Tibet',
            region: 'Southwest China'
        }]
    }, {
        name: 'East China',
        data: [{
            'x': 6,
            'y': 6,
            abbreviation: '闽',
            capital: 'Fuzhou',
            province: 'Fujian',
            region: 'East China'
        }, {
            'x': 4,
            'y': 6,
            abbreviation: '赣',
            capital: 'Nanchang',
            province: 'Jiangxi',
            region: 'East China'
        }, {
            'x': 5,
            'y': 6,
            abbreviation: '浙',
            capital: 'Hangzhou',
            province: 'Zhejiang',
            region: 'East China'
        }, {
            'x': 3,
            'y': 5,
            abbreviation: '皖',
            capital: 'Hefei',
            province: 'Anhui',
            region: 'East China'
        }, {
            'x': 4,
            'y': 5,
            abbreviation: '苏',
            capital: 'Nanjing',
            province: 'Jiangsu',
            region: 'East China'
        }, {
            'x': 5,
            'y': 7,
            abbreviation: '沪',
            capital: 'Shanghai',
            province: 'Shanghai',
            region: 'East China'
        }, {
            'x': 5,
            'y': 5,
            abbreviation: '鲁',
            capital: 'Jinan',
            province: 'Shandong',
            region: 'East China'
        }, {
            'x': 7,
            'y': 8,
            abbreviation: '台',
            capital: 'Taipei',
            province: 'Taiwan',
            region: 'East China'
        }]
    }, {
        name: 'Northwest China',
        data: [{
            'x': 2,
            'y': 1,
            abbreviation: '青',
            capital: 'Xining',
            province: 'Qinghai',
            region: 'Northwest China'
        }, {
            'x': 2,
            'y': 2,
            abbreviation: '甘(陇)',
            capital: 'Lanzhou',
            province: 'Gansu',
            region: 'Northwest China'
        }, {
            'x': 1,
            'y': 2,
            abbreviation: '陕(秦)',
            capital: "Xi'an",
            province: 'Shaanxi',
            region: 'Northwest China'
        }, {
            'x': 1,
            'y': 1,
            abbreviation: '新',
            capital: 'Ürümqi',
            province: 'Xinjiang',
            region: 'Northwest China'
        }, {
            'x': 2,
            'y': 3,
            abbreviation: '宁',
            capital: 'Yinchuan',
            province: 'Ningxia',
            region: 'Northwest China'
        }]
    }, {
        name: 'Northeast China',
        data: [{
            'x': 1,
            'y': 7,
            abbreviation: '辽',
            capital: 'Shenyang',
            province: 'Liaoning',
            region: 'Northeast China'
        }, {
            'x': 0,
            'y': 8,
            abbreviation: '黑',
            capital: 'Harbin',
            province: 'Heilongjiang',
            region: 'Northeast China'
        }, {
            'x': 1,
            'y': 8,
            abbreviation: '吉',
            capital: 'Changchun',
            province: 'Jilin',
            region: 'Northeast China'
        }]
    }, {
        name: 'North China',
        data: [{
            'x': 1,
            'y': 6,
            abbreviation: '冀',
            capital: 'Shijiazhuang',
            province: 'Hebei',
            region: 'North China'
        }, {
            'x': 3,
            'y': 6,
            abbreviation: '津',
            capital: 'Tianjin',
            province: 'Tianjin',
            region: 'North China'
        }, {
            'x': 2,
            'y': 5,
            abbreviation: '晋',
            capital: 'Taiyuan',
            province: 'Shanxi',
            region: 'North China'
        }, {
            'x': 2,
            'y': 6,
            abbreviation: '京',
            capital: 'Beijing',
            province: 'Beijing',
            region: 'North China'
        }, {
            'x': 2,
            'y': 4,
            abbreviation: '內蒙古(蒙)',
            capital: 'Hohhot',
            province: 'Inner Mongolia Autonomous',
            region: 'North China'
        }]
    }]
});
