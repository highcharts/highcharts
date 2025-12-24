const dataSource = {
    country: [
        'United Arab Emirates',
        'Argentina',
        'Australia',
        'Azerbaijan',
        'Bahrain',
        'Brazil',
        'Canada',
        'Switzerland',
        'Chile',
        'China',
        'Colombia',
        'Costa Rica',
        'Czech Republic',
        'Denmark',
        'Egypt',
        'Euro area',
        'Britain',
        'Guatemala',
        'Hong Kong',
        'Honduras',
        'Hungary',
        'Indonesia',
        'India',
        'Israel',
        'Jordan',
        'Japan',
        'South Korea',
        'Kuwait',
        'Lebanon',
        'Moldova',
        'Mexico',
        'Malaysia',
        'Nicaragua',
        'Norway',
        'New Zealand',
        'Oman',
        'Pakistan',
        'Peru',
        'Philippines',
        'Poland',
        'Qatar',
        'Romania',
        'Saudi Arabia',
        'Singapore',
        'Sweden',
        'Thailand',
        'Turkey',
        'Taiwan',
        'Ukraine',
        'Uruguay',
        'United States',
        'Venezuela',
        'Vietnam',
        'South Africa'
    ],
    currency: [
        'AED',
        'ARS',
        'AUD',
        'AZN',
        'BHD',
        'BRL',
        'CAD',
        'CHF',
        'CLP',
        'CNY',
        'COP',
        'CRC',
        'CZK',
        'DKK',
        'EGP',
        'EUR',
        'GBP',
        'GTQ',
        'HKD',
        'HNL',
        'HUF',
        'IDR',
        'INR',
        'ILS',
        'JOD',
        'JPY',
        'KRW',
        'KWD',
        'LBP',
        'MDL',
        'MXN',
        'MYR',
        'NIO',
        'NOK',
        'NZD',
        'OMR',
        'PKR',
        'PEN',
        'PHP',
        'PLN',
        'QAR',
        'RON',
        'SAR',
        'SGD',
        'SEK',
        'THB',
        'TRY',
        'TWD',
        'UAH',
        'UYU',
        'USD',
        'VES',
        'VND',
        'ZAR'
    ],
    dollarEx: [
        3.6729, 1050, 1.591, 1.7, 0.377, 5.9367, 1.43845,
        0.9008, 987.25, 7.24785, 4232.22, 506.625, 23.8918, 7.1077, 50.25,
        0.9524, 0.801, 7.7215, 7.7877, 25.465, 389.43235, 16172.5, 86.3412,
        3.6057, 0.709, 154.355, 1431.2, 0.3081, 89550, 18.45, 20.647, 4.3785,
        36.6243, 11.2368, 1.759, 0.385, 278.85, 3.7313, 58.435,
        4.0111, 3.641, 4.73835, 3.7508, 1.3444, 10.9367, 33.6925, 35.7405,
        32.728, 42, 43.27, 1, 56.5814, 25078, 18.6913
    ],
    dollarPPP: [
        3.109, 1261, 1.339, 1.078, 0.2936, 4.128, 1.349, 1.244, 775.5, 4.404,
        3782, 516.4, 18.83, 6.736, 23.32, 0.9793, 0.7927, 5.354, 4.145, 18.13,
        245.3, 7081, 39.03, 2.936, 0.4318, 82.90, 949.9, 0.2418, 82900, 11.23,
        16.41, 2.271, 28.32, 12.95, 1.451, 0.2642, 181.3, 2.919, 29.19, 3.610,
        2.591, 2.807, 3.282, 1.200, 10.71, 23.32, 32.82, 13.47, 20.73, 51.64, 1,
        43.52, 13130, 8.964
    ],
    dollarRate: [
        3.67, 1050.0, 1.59, 1.7, 0.38, 5.94, 1.44, 0.9, 987.25, 7.25,
        4232.22, 506.63, 23.89, 7.11, 50.25, 0.95, 0.8, 7.72, 7.79,
        25.47, 389.43, 16172.5, 86.34, 3.61, 0.71, 154.36, 1431.2, 0.31,
        89550.0, 18.45, 20.65, 4.38, 36.62, 11.24, 1.76, 0.39, 278.85,
        3.73, 58.44, 4.01, 3.64, 4.74, 3.75, 1.34, 10.94, 33.69, 35.74,
        32.73, 42.0, 43.27, 1.0, 56.58, 25078.0, 18.69
    ],
    dollarPrice: [
        4.9, 6.95, 4.87, 3.67, 4.51, 4.03, 5.43, 7.99, 4.55, 3.52, 5.17,
        5.9, 4.56, 5.49, 2.69, 5.95, 5.73, 4.01, 3.08, 4.12, 3.65, 2.54,
        2.62, 4.71, 3.53, 3.11, 3.84, 4.54, 5.36, 3.52, 4.6, 3.0, 4.48,
        6.67, 4.77, 3.97, 3.77, 4.53, 2.89, 5.21, 4.12, 3.43, 5.07,
        5.17, 5.67, 4.01, 5.32, 2.38, 2.86, 6.91, 5.79, 4.45, 3.03, 2.78
    ]
};

const initGrid = data => {
    Grid.grid('container', {
        dataTable: data,
        caption: {
            text: '🍔 Big Mac Index 2025'
        },
        header: [
            'country',
            'currency',
            'dollarRate',
            'dollarPrice',
            'dollarValuation'
        ],
        columns: [{
            id: 'country',
            header: {
                format: 'Country'
            }
        }, {
            id: 'currency',
            width: 100,
            header: {
                format: 'Currency'
            }
        }, {
            id: 'dollarRate',
            header: {
                format: 'USD exchange ratio'
            }
        }, {
            id: 'dollarPrice',
            header: {
                format: 'Price of Big Mac (USD)'
            },
            cells: {
                format: '${value}'
            }
        }, {
            id: 'dollarValuation',
            header: {
                format: 'Undervalued / overvalued'
            },
            width: 350,
            cells: {
                renderer: {
                    type: 'sparkline',
                    chartOptions: {
                        chart: {
                            type: 'bar',
                            spacing: [0, 0, 0, 0],
                            margin: [0, 0, 0, 0],
                            height: 40
                        },
                        yAxis: {
                            min: -70,
                            max: 70,
                            crossing: 0
                        },
                        plotOptions: {
                            series: {
                                dataLabels: {
                                    crop: false,
                                    overflow: 'allow',
                                    useHTML: true,
                                    enabled: true,
                                    // eslint-disable-next-line max-len
                                    format: '<span class="spark-label">{y:.2f}%</span>'
                                },
                                negativeColor: '#f00'
                            }
                        }
                    }
                }
            }
        }],
        pagination: {
            enabled: true,
            controls: {
                pageButtons: {
                    count: 5
                }
            }
        }
    });
};

// Init
(async () => {
    // Setup data
    const dataTable = new Dashboards.DataTable({
        columns: dataSource
    });

    // Define modifier / formula calculation for sparkline
    const mathModifier = new Dashboards.DataModifier.types.Math({
        columnFormulas: [{
            column: 'dollarValuation',
            formula: '(D1-C1)/C1*100' // C1 = dollarEx, D1 = dollarPPP
        }]
    });

    // Add modified data to initial data source
    await dataTable.setModifier(mathModifier);

    // Init the grid with the combined data
    initGrid(dataTable.getModified());
})();
