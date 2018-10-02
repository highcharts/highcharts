Highcharts.chart('container', {
    chart: {
        type: 'scatter',
        zoomType: 'xy'
    },
    title: {
        text: 'GDP per capita vs Self-reported Life Satisfaction, 2015'
    },
    subtitle: {
        useHTML: true,
        text: 'Source: <a href="	http://data.worldbank.org/data-catalog/world-development-indicators">Worldbank</a>'
    },
    yAxis: {
        title: {
            text: 'Life satisfaction (country average; 0-10)'
        }
    },
    xAxis: {
        title: {
            text: 'GDP per capita'
        }
    },

    tooltip: {
        useHTML: true,
        headerFormat: null,
        pointFormat: '<b>Country</b>: {point.name}<br><b>GDP per capita</b>: {point.x} $<br/><b>Life satisfaction</b>: {point.y}'

    },
    legend: {
        enabled: true
    },


    series: [{
        type: 'line',
        name: 'Regression Line',
        color: "#b6c1ff",
        data: [
            [750.5, 4.89E+00],
            [119749.43, 8.13E+00]
        ],
        marker: {
            enabled: false
        },
        states: {
            hover: {
                lineWidth: 0
            }
        },
        enableMouseTracking: false
    }, {
        keys: ['x', 'y', 'name'],
        color: "#FFB6C1",
        name: "Life Satisfaction",
        data: [
            [1747.98, 3.98, 'Afghanistan'],
            [11024.92, 4.61, 'Albania'],
            [19101.3, 6.7, 'Argentina'],
            [8180.05, 4.35, 'Armenia'],
            [43832.43, 7.31, 'Australia'],
            [44074.95, 7.08, 'Austria'],
            [16698.86, 5.15, 'Azerbaijan'],
            [44456.22, 6.01, 'Bahrain'],
            [3132.57, 4.63, 'Bangladesh'],
            [17229.55, 5.72, 'Belarus'],
            [41723.12, 6.9, 'Belgium'],
            [1987.17, 3.62, 'Benin'],
            [7735.63, 5.08, 'Bhutan'],
            [6531.52, 5.83, 'Bolivia'],
            [10902.12, 5.12, 'Bosnia and Herzegovina'],
            [15356.46, 3.76, 'Botswana'],
            [14666.02, 6.55, 'Brazil'],
            [17000.07, 4.87, 'Bulgaria'],
            [1550.85, 4.42, 'Burkina Faso'],
            [3290.95, 4.16, 'Cambodia'],
            [2991.19, 5.04, 'Cameroon'],
            [42983.1, 7.41, 'Canada'],
            [2047.64, 4.32, 'Chad'],
            [22536.62, 6.53, 'Chile'],
            [13569.89, 5.3, 'China'],
            [12985.38, 6.39, 'Colombia'],
            [5542.89, 4.69, 'Congo'],
            [14914.21, 6.85, 'Costa Rica'],
            [20635.98, 5.21, 'Croatia'],
            [30382.56, 5.44, 'Cyprus'],
            [30380.59, 6.61, 'Czech Republic'],
            [750.5, 3.9, 'Democratic Republic of Congo'],
            [45483.76, 7.51, 'Denmark'],
            [13371.52, 5.06, 'Dominican Republic'],
            [10776.57, 5.96, 'Ecuador'],
            [10095.61, 4.76, 'Egypt'],
            [7845.16, 6.02, 'El Salvador'],
            [27328.64, 5.63, 'Estonia'],
            [1533.11, 4.57, 'Ethiopia'],
            [38993.67, 7.45, 'Finland'],
            [37765.75, 6.36, 'France'],
            [16836.6, 4.66, 'Gabon'],
            [9025.13, 4.12, 'Georgia'],
            [43784.15, 7.04, 'Germany'],
            [3929.68, 3.99, 'Ghana'],
            [24094.79, 5.62, 'Greece'],
            [7292.72, 6.46, 'Guatemala'],
            [1184.04, 3.5, 'Guinea'],
            [1651.23, 3.57, 'Haiti'],
            [4311.18, 4.85, 'Honduras'],
            [24831.35, 5.34, 'Hungary'],
            [42674.42, 7.5, 'Iceland'],
            [5754.06, 4.34, 'India'],
            [10367.7, 5.04, 'Indonesia'],
            [16010.11, 4.75, 'Iran'],
            [14928.89, 4.49, 'Iraq'],
            [60944.02, 6.83, 'Ireland'],
            [31970.69, 7.08, 'Israel'],
            [34244.71, 5.85, 'Italy'],
            [3251.16, 4.45, 'Ivory Cost'],
            [37818.09, 5.88, 'Japan'],
            [8491.02, 5.4, 'Jordan'],
            [23522.29, 5.95, 'Kazakhstan'],
            [2835.64, 4.36, 'Kenya'],
            [9097.14, 5.08, 'Kosovo'],
            [69329.41, 6.15, 'Kuwait'],
            [3237.6, 4.91, 'Kyrgyzstan'],
            [23057.31, 5.88, 'Latvia'],
            [13087.37, 5.17, 'Lebanon'],
            [785.25, 2.7, 'Liberia'],
            [26970.81, 5.71, 'Lithuania'],
            [95311.11, 6.7, 'Luxembourg'],
            [12759.71, 4.98, 'Macedonia'],
            [1376.33, 3.59, 'Madagascar'],
            [1088.7, 3.87, 'Malawi'],
            [24988.83, 6.32, 'Malaysia'],
            [1919.23, 4.58, 'Mali'],
            [34380.06, 6.61, 'Malta'],
            [3601.61, 3.92, 'Mauritania'],
            [16667.84, 6.24, 'Mexico'],
            [4746.78, 6.02, 'Moldova'],
            [11409.42, 4.98, 'Mongolia'],
            [15291.48, 5.12, 'Montenegro'],
            [7285.66, 5.16, 'Morocco'],
            [1118.22, 4.55, 'Mozambique'],
            [5071.11, 4.22, 'Myanmar'],
            [2300.89, 4.81, 'Nepal'],
            [46353.85, 7.32, 'Netherlands'],
            [34646.31, 7.42, 'New Zealand'],
            [4960.91, 5.92, 'Nicaragua'],
            [897.49, 3.67, 'Niger'],
            [5670.64, 4.93, 'Nigeria'],
            [63669.53, 7.6, 'Norway'],
            [4694.86, 4.82, 'Pakistan'],
            [2654.41, 4.7, 'Palestine'],
            [20674.3, 6.61, 'Panama'],
            [8639.29, 5.56, 'Paraguay'],
            [11767.52, 5.58, 'Peru'],
            [6874.58, 5.55, 'Philippines'],
            [25299.05, 6.01, 'Poland'],
            [26548.33, 5.08, 'Portugal'],
            [119749.43, 6.37, 'Qatar'],
            [20537.88, 5.78, 'Romania'],
            [24124.33, 6, 'Russia'],
            [1715.89, 3.48, 'Rwanda'],
            [50723.71, 6.35, 'Saudi Arabia'],
            [2296.74, 4.62, 'Senegal'],
            [13277.71, 5.32, 'Serbia'],
            [1316.06, 4.91, 'Sierra Leone'],
            [80892.06, 6.62, 'Singapore'],
            [28254.26, 6.16, 'Slovakia'],
            [29097.34, 5.74, 'Slovenia'],
            [12425.34, 4.89, 'South Africa'],
            [34177.65, 5.78, 'South Korea'],
            [1808.16, 4.07, 'South Sudan'],
            [32215.97, 6.38, 'Spain'],
            [11061.84, 4.61, 'Sri Lanka'],
            [45488.29, 7.29, 'Sweden'],
            [56510.86, 7.57, 'Switzerland'],
            [2640.59, 5.12, 'Tajikistan'],
            [2490.96, 3.66, 'Tanzania'],
            [15236.71, 6.2, 'Thailand'],
            [1350.81, 3.77, 'Togo'],
            [10749.86, 5.13, 'Tunisia'],
            [23382.25, 5.51, 'Turkey'],
            [14992.32, 5.79, 'Turkmenistan'],
            [1692.53, 4.24, 'Uganda'],
            [7464.94, 3.96, 'Ukraine'],
            [65975.38, 6.57, 'United Arab Emirates'],
            [38509.21, 6.52, 'United Kingdom'],
            [52789.97, 6.86, 'United States'],
            [19831.45, 6.63, 'Uruguay'],
            [5700.24, 5.97, 'Uzbekistan'],
            [5667.41, 5.08, 'Vietnam'],
            [2641.05, 2.98, 'Yemen'],
            [3627.2, 4.84, 'Zambia'],
            [1890.78, 3.7, 'Zimbabwe']
        ]
    }]
});
