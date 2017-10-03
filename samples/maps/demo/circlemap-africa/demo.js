Highcharts.chart('container', {
    chart: {
        type: 'tilemap',
        height: '125%'
    },

    title: {
        text: 'Africa Real GDP Growth Forcasts for 2017'
    },

    xAxis: {
        visible: false
    },

    yAxis: {
        visible: false
    },

    legend: {
        enabled: true,
        layout: 'vertical',
        align: 'left',
        y: -20,
        floating: true
    },

    colorAxis: {
        dataClasses: [{
            to: 2,
            color: '#e8f5e9',
            name: 'Weak'
        }, {
            from: 2,
            to: 5,
            color: '#81c784',
            name: 'Average'
        }, {
            from: 5,
            to: 6,
            color: '#43a047',
            name: 'Strong'
        }, {
            from: 6,
            color: '#1b5e20',
            name: 'Stellar'
        }]
    },

    tooltip: {
        headerFormat: '',
        pointFormat: 'The real GDP growth of <b>{point.name}</b> is <b>{point.value}</b> %'
    },

    plotOptions: {
        series: {
            tileShape: 'circle',
            dataLabels: {
                enabled: true,
                format: '{point.iso-a3}',
                color: '#000000',
                style: {
                    textOutline: false
                }
            }
        }
    },

    series: [{
        data: [{
            id: 'ZW',
            name: 'Zimbabwe',
            subregion: 'Eastern Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'ZWE',
            'iso-a2': 'ZW',
            x: 12,
            y: 1,
            value: 1.7
        }, {
            id: 'ZM',
            name: 'Zambia',
            subregion: 'Eastern Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'ZMB',
            'iso-a2': 'ZM',
            x: 11,
            y: 2,
            value: 3.2
        }, {
            id: 'MG',
            name: 'Madagascar',
            subregion: 'Eastern Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'MDG',
            'iso-a2': 'MG',
            x: 17,
            y: 2,
            value: 4.6
        }, {
            id: 'MW',
            name: 'Malawi',
            subregion: 'Eastern Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'MWI',
            'iso-a2': 'MW',
            x: 12,
            y: 2,
            value: 3.7
        }, {
            id: 'MZ',
            name: 'Mozambique',
            subregion: 'Eastern Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'MOZ',
            'iso-a2': 'MZ',
            x: 13,
            y: 2,
            value: 5.5
        }, {
            id: 'BI',
            name: 'Burundi',
            subregion: 'Eastern Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'BDI',
            'iso-a2': 'BI',
            x: 10,
            y: 2,
            value: 2
        }, {
            id: 'TZ',
            name: 'United Republic of Tanzania',
            subregion: 'Eastern Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'TZA',
            'iso-a2': 'TZ',
            x: 13,
            y: 3,
            value: 6.9
        }, {
            id: 'RW',
            name: 'Rwanda',
            subregion: 'Eastern Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'RWA',
            'iso-a2': 'RW',
            x: 11,
            y: 3,
            value: 6.6
        }, {
            id: 'KE',
            name: 'Kenya',
            subregion: 'Eastern Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'KEN',
            'iso-a2': 'KE',
            x: 12,
            y: 3,
            value: 6.4
        }, {
            id: 'UG',
            name: 'Uganda',
            subregion: 'Eastern Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'UGA',
            'iso-a2': 'UG',
            x: 10,
            y: 3,
            value: 5.8
        }, {
            id: 'SO',
            name: 'Somalia',
            subregion: 'Eastern Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'SOM',
            'iso-a2': 'SO',
            x: 17,
            y: 4,
            value: 2.5
        }, {
            id: 'ET',
            name: 'Ethiopia',
            subregion: 'Eastern Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'ETH',
            'iso-a2': 'ET',
            x: 12,
            y: 4,
            value: 3.3
        }, {
            id: 'SX',
            name: 'Somaliland',
            subregion: 'Eastern Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'SX',
            'iso-a2': 'SX',
            x: 15,
            y: 4,
            value: 2.5
        }, {
            id: 'SS',
            name: 'South Sudan',
            subregion: 'Eastern Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'SSD',
            'iso-a2': 'SS',
            x: 10,
            y: 4,
            value: 3.5
        }, {
            id: 'DJ',
            name: 'Djibouti',
            subregion: 'Eastern Africa',
            'region-web': 'Middle East & North Africa',
            'iso-a3': 'DJI',
            'iso-a2': 'DJ',
            x: 14,
            y: 4,
            value: 7
        }, {
            id: 'ER',
            name: 'Eritrea',
            subregion: 'Eastern Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'ERI',
            'iso-a2': 'ER',
            x: 13,
            y: 5,
            value: 3.3
        }, {
            id: 'AO',
            name: 'Angola',
            subregion: 'Middle Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'AGO',
            'iso-a2': 'AO',
            x: 9,
            y: 2,
            value: 1.2
        }, {
            id: 'CD',
            name: 'Democratic Republic of the Congo',
            subregion: 'Middle Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'COD',
            'iso-a2': 'CD',
            x: 8,
            y: 2,
            value: 4.5
        }, {
            id: 'GA',
            name: 'Gabon',
            subregion: 'Middle Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'GAB',
            'iso-a2': 'GA',
            x: 8,
            y: 3,
            value: 3
        }, {
            id: 'GQ',
            name: 'Equatorial Guinea',
            subregion: 'Middle Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'GNQ',
            'iso-a2': 'GQ',
            x: 6,
            y: 3,
            value: 5.8
        }, {
            id: 'CG',
            name: 'Republic of Congo',
            subregion: 'Middle Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'COG',
            'iso-a2': 'CG',
            x: 9,
            y: 3,
            value: 4.4
        }, {
            id: 'CM',
            name: 'Cameroon',
            subregion: 'Middle Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'CMR',
            'iso-a2': 'CM',
            x: 9,
            y: 4,
            value: 5.5
        }, {
            id: 'CF',
            name: 'Central African Republic',
            subregion: 'Middle Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'CAF',
            'iso-a2': 'CF',
            x: 11,
            y: 4,
            value: 4
        }, {
            id: 'TD',
            name: 'Chad',
            subregion: 'Middle Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'TCD',
            'iso-a2': 'TD',
            x: 13,
            y: 4,
            value: 1.7
        }, {
            id: 'SD',
            name: 'Sudan',
            subregion: 'Northern Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'SDN',
            'iso-a2': 'SD',
            x: 11,
            y: 5,
            value: 3.5
        }, {
            id: 'EH',
            name: 'Western Sahara',
            subregion: 'Northern Africa',
            'region-web': 'Middle East & North Africa',
            'iso-a3': 'ESH',
            'iso-a2': 'EH',
            x: 2,
            y: 5,
            value: 3.5
        }, {
            id: 'DZ',
            name: 'Algeria',
            subregion: 'Northern Africa',
            'region-web': 'Middle East & North Africa',
            'iso-a3': 'DZA',
            'iso-a2': 'DZ',
            x: 6,
            y: 5,
            value: 2.3
        }, {
            id: 'LY',
            name: 'Libya',
            subregion: 'Northern Africa',
            'region-web': 'Middle East & North Africa',
            'iso-a3': 'LBY',
            'iso-a2': 'LY',
            x: 10,
            y: 5,
            value: 19.3
        }, {
            id: 'EG',
            name: 'Egypt',
            subregion: 'Northern Africa',
            'region-web': 'Middle East & North Africa',
            'iso-a3': 'EGY',
            'iso-a2': 'EG',
            x: 12,
            y: 5,
            value: 3.2
        }, {
            id: 'MA',
            name: 'Morocco',
            subregion: 'Northern Africa',
            'region-web': 'Middle East & North Africa',
            'iso-a3': 'MAR',
            'iso-a2': 'MA',
            x: 4,
            y: 5,
            value: 3.7
        }, {
            id: 'TN',
            name: 'Tunisia',
            subregion: 'Northern Africa',
            'region-web': 'Middle East & North Africa',
            'iso-a3': 'TUN',
            'iso-a2': 'TN',
            x: 8,
            y: 5,
            value: 1.9
        }, {
            id: 'ZA',
            name: 'South Africa',
            subregion: 'Southern Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'ZAF',
            'iso-a2': 'ZA',
            x: 9,
            y: 1,
            value: 1.2
        }, {
            id: 'LS',
            name: 'Lesotho',
            subregion: 'Southern Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'LSO',
            'iso-a2': 'LS',
            x: 11,
            y: 1,
            value: 2.5
        }, {
            id: 'SZ',
            name: 'Swaziland',
            subregion: 'Southern Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'SWZ',
            'iso-a2': 'SZ',
            x: 13,
            y: 1,
            value: 0.9
        }, {
            id: 'NA',
            name: 'Namibia',
            subregion: 'Southern Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'NAM',
            'iso-a2': 'NA',
            x: 8,
            y: 1,
            value: 4
        }, {
            id: 'BW',
            name: 'Botswana',
            subregion: 'Southern Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'BWA',
            'iso-a2': 'BW',
            x: 10,
            y: 1,
            value: 4.1
        }, {
            id: 'LR',
            name: 'Liberia',
            subregion: 'Western Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'LBR',
            'iso-a2': 'LR',
            x: 2,
            y: 4,
            value: 4
        }, {
            id: 'TG',
            name: 'Togo',
            subregion: 'Western Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'TGO',
            'iso-a2': 'TG',
            x: 3,
            y: 4,
            value: 5.5
        }, {
            id: 'SL',
            name: 'Sierra Leone',
            subregion: 'Western Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'SLE',
            'iso-a2': 'SL',
            x: 0,
            y: 4,
            value: 4
        }, {
            id: 'CI',
            name: 'Ivory Coast',
            subregion: 'Western Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'CIV',
            'iso-a2': 'CI',
            x: 4,
            y: 4,
            value: 8
        }, {
            id: 'GH',
            name: 'Ghana',
            subregion: 'Western Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'GHA',
            'iso-a2': 'GH',
            x: 6,
            y: 4,
            value: 6.3
        }, {
            id: 'NG',
            name: 'Nigeria',
            subregion: 'Western Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'NGA',
            'iso-a2': 'NG',
            x: 7,
            y: 4,
            value: 1.5
        }, {
            id: 'SN',
            name: 'Senegal',
            subregion: 'Western Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'SEN',
            'iso-a2': 'SN',
            x: 1,
            y: 5,
            value: 6.7
        }, {
            id: 'GM',
            name: 'Gambia',
            subregion: 'Western Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'GMB',
            'iso-a2': 'GM',
            x: 1,
            y: 4,
            value: 4
        }, {
            id: 'GN',
            name: 'Guinea',
            subregion: 'Western Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'GIN',
            'iso-a2': 'GN',
            x: 9,
            y: 5,
            value: 4
        }, {
            id: 'BF',
            name: 'Burkina Faso',
            subregion: 'Western Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'BFA',
            'iso-a2': 'BF',
            x: 5,
            y: 5,
            value: 4
        }, {
            id: 'BJ',
            name: 'Benin',
            subregion: 'Western Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'BEN',
            'iso-a2': 'BJ',
            x: 5,
            y: 4,
            value: 5.5
        }, {
            id: 'GW',
            name: 'Guinea Bissau',
            subregion: 'Western Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'GNB',
            'iso-a2': 'GW',
            x: 7,
            y: 5,
            value: 5.5
        }, {
            id: 'ML',
            name: 'Mali',
            subregion: 'Western Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'MLI',
            'iso-a2': 'ML',
            x: 3,
            y: 5,
            value: 4.8
        }, {
            id: 'NE',
            name: 'Niger',
            subregion: 'Western Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'NER',
            'iso-a2': 'NE',
            x: 8,
            y: 4,
            value: 5.5
        }, {
            id: 'MR',
            name: 'Mauritania',
            subregion: 'Western Africa',
            'region-web': 'Sub-Saharan Africa',
            'iso-a3': 'MRT',
            'iso-a2': 'MR',
            x: -1,
            y: 5,
            value: 4.3
        }]
    }]
});
