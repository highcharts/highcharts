const type = 'grid',
    gridSize = 70;

Highcharts.chart('container', {
    chart: {
        type: 'scatter',
        zoomType: 'xy'
    },
    accessibility: {
        description: ''
    },
    title: {
        text: 'Olympics 2012 by height and weight'
    },
    subtitle: {
        text: 'Source: <a href="https://www.theguardian.com/sport/datablog/2012/aug/07/olympics-2012-athletes-age-weight-height">The Guardian</a>'
    },
    xAxis: {
        title: {
            text: 'Height'
        },
        labels: {
            format: '{value} cm'
        },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true
    },
    yAxis: {
        title: {
            text: 'Weight'
        },
        labels: {
            format: '{value} kg'
        }
    },
    legend: {
        enabled: false
    },

    series: [
    // Marker clusters
        {
            name: 'Weight and height by country',
            dataLabels: {
                enabled: true,
                color: '#ffffff',
                formatter: function () {
                    if (typeof (this.point.clusterPointsAmount) === 'undefined') {
                        return '';
                    }
                    return this.point.clusterPointsAmount;

                },
                style: {
                    fontSize: '10px',
                    textOutline: false
                }
            },
            marker: {
                radius: 5,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            },
            cluster: {
                enabled: true,
                allowOverlap: false,
                animation: {
                    duration: 450
                },
                layoutAlgorithm: {
                    type: type,
                    gridSize: gridSize
                },
                zones: [{
                    from: 1,
                    to: 4,
                    marker: {
                        radius: 13,
                        fillColor: '#7695aa'
                    }
                }, {
                    from: 5,
                    to: 9,
                    marker: {
                        radius: 15,
                        fillColor: '#5DADE2'
                    }
                }, {
                    from: 10,
                    to: 20,
                    marker: {
                        radius: 17,
                        fillColor: '#2E86C1 '
                    }
                }, {
                    from: 21,
                    to: 100,
                    marker: {
                        radius: 21,
                        fillColor: '#1B4F72'
                    }
                }]

            },

            tooltip: {
                formatter: function () {
                    if (typeof (this.point.clusterPointsAmount) === 'undefined') {
                        return this.point.country + '<br/> Height: ' + this.x + 'cm <br/> Weight: ' + this.y + 'kg';
                    }
                    return 'There are <b>' + this.point.clusterPointsAmount + '</b> points';
                }
            },
            data: [{
                x: 172,
                y: 60.3,
                country: 'Afghanistan'
            },
            {
                x: 177.2,
                y: 78.3,
                country: 'Albania'
            },
            {
                x: 173.9,
                y: 66.8,
                country: 'Algeria'
            },
            {
                x: 173.2,
                y: 81.4,
                country: 'American Samoa'
            },
            {
                x: 172,
                y: 67.3,
                country: 'Andorra'
            },
            {
                x: 174.7,
                y: 69.2,
                country: 'Angola'
            },
            {
                x: 176.7,
                y: 71.7,
                country: 'Antigua and Barbuda'
            },
            {
                x: 179.9,
                y: 77.8,
                country: 'Argentina'
            },
            {
                x: 175,
                y: 78.1,
                country: 'Armenia'
            },
            {
                x: 172.5,
                y: 76.8,
                country: 'Aruba'
            },
            {
                x: 179.1,
                y: 75.5,
                country: 'Australia'
            },
            {
                x: 177.2,
                y: 70.8,
                country: 'Austria'
            },
            {
                x: 173.5,
                y: 75.4,
                country: 'Azerbaijan'
            },
            {
                x: 179,
                y: 73.7,
                country: 'Bahamas'
            },
            {
                x: 167,
                y: 53.4,
                country: 'Bahrain'
            },
            {
                x: 166.8,
                y: 64.5,
                country: 'Bangladesh'
            },
            {
                x: 183.5,
                y: 74.2,
                country: 'Barbados'
            },
            {
                x: 177,
                y: 74.6,
                country: 'Belarus'
            },
            {
                x: 177.8,
                y: 71,
                country: 'Belgium'
            },
            {
                x: 164,
                y: 66.7,
                country: 'Belize'
            },
            {
                x: 174.6,
                y: 69,
                country: 'Benin'
            },
            {
                x: 175.2,
                y: 67.7,
                country: 'Bermuda'
            },
            {
                x: 155,
                y: 60,
                country: 'Bhutan'
            },
            {
                x: 178,
                y: 80,
                country: 'Bolivia'
            },
            {
                x: 182.5,
                y: 81,
                country: 'Bosnia and Herzegovina'
            },
            {
                x: 179,
                y: 60,
                country: 'Botswana'
            },
            {
                x: 178.5,
                y: 74.6,
                country: 'Brazil'
            },
            {
                x: 168,
                y: 59,
                country: 'Brunei Darussalam'
            },
            {
                x: 177.2,
                y: 73.3,
                country: 'Bulgaria'
            },
            {
                x: 173.4,
                y: 67.4,
                country: 'Burkina Faso'
            },
            {
                x: 173.5,
                y: 64.4,
                country: 'Burundi'
            },
            {
                x: 172.5,
                y: 65.7,
                country: 'Ivory Cost'
            },
            {
                x: 169.5,
                y: 57.8,
                country: 'Cambodia'
            },
            {
                x: 167.4,
                y: 67.8,
                country: 'Cameroon'
            },
            {
                x: 175.8,
                y: 72.4,
                country: 'Canada'
            },
            {
                x: 176.3,
                y: 75.3,
                country: 'Cape Verde'
            },
            {
                x: 183,
                y: 78.8,
                country: 'Cayman Islands'
            },
            {
                x: 171.3,
                y: 67.3,
                country: 'Chad'
            },
            {
                x: 171.8,
                y: 71.5,
                country: 'Chile'
            },
            {
                x: 170.3,
                y: 63.4,
                country: 'Colombia'
            },
            {
                x: 165.3,
                y: 56.7,
                country: 'Comoros'
            },
            {
                x: 173.9,
                y: 71.8,
                country: 'Congo'
            },
            {
                x: 164.3,
                y: 72.9,
                country: 'Cook Islands'
            },
            {
                x: 175,
                y: 67.8,
                country: 'Costa Rica'
            },
            {
                x: 185.1,
                y: 84,
                country: 'Croatia'
            },
            {
                x: 177.3,
                y: 73,
                country: 'Cyprus'
            },
            {
                x: 180.7,
                y: 76.3,
                country: 'Czech Republic'
            },
            {
                x: 162.9,
                y: 57.7,
                country: 'Democratic People Republic of Korea'
            },
            {
                x: 177.8,
                y: 78,
                country: 'Democratic Republic of the Congo'
            },
            {
                x: 159.5,
                y: 53,
                country: 'Democratic Republic of Timor-Leste'
            },
            {
                x: 180.9,
                y: 75.9,
                country: 'Denmark'
            },
            {
                x: 169,
                y: 59,
                country: 'Dominica'
            },
            {
                x: 175.6,
                y: 66.2,
                country: 'Dominican Republic'
            },
            {
                x: 171.6,
                y: 63.6,
                country: 'Ecuador'
            },
            {
                x: 174.7,
                y: 75.9,
                country: 'Egypt'
            },
            {
                x: 169.8,
                y: 65.5,
                country: 'El Salvador'
            },
            {
                x: 176,
                y: 68,
                country: 'Equatorial Guinea'
            },
            {
                x: 173.4,
                y: 59.5,
                country: 'Eritrea'
            },
            {
                x: 183.3,
                y: 85.8,
                country: 'Estonia'
            },
            {
                x: 170,
                y: 54.1,
                country: 'Ethiopia'
            },
            {
                x: 165.5,
                y: 69,
                country: 'Federated States of Micronesia'
            },
            {
                x: 175,
                y: 79.4,
                country: 'Fiji'
            },
            {
                x: 175.6,
                y: 70,
                country: 'Finland'
            },
            {
                x: 177.5,
                y: 68,
                country: 'Former Yugoslav Republic of Macedonia'
            },
            {
                x: 178,
                y: 72,
                country: 'France'
            },
            {
                x: 172.7,
                y: 72.6,
                country: 'Gabon'
            },
            {
                x: 155,
                y: 68,
                country: 'Gambia'
            },
            {
                x: 177.2,
                y: 77.7,
                country: 'Georgia'
            },
            {
                x: 179.6,
                y: 76,
                country: 'Germany'
            },
            {
                x: 168.8,
                y: 69.8,
                country: 'Ghana'
            },
            {
                x: 178.9,
                y: 74.5,
                country: 'Great Britain'
            },
            {
                x: 179.7,
                y: 76.6,
                country: 'Greece'
            },
            {
                x: 177.8,
                y: 62.3,
                country: 'Grenada'
            },
            {
                x: 176.1,
                y: 85.6,
                country: 'Guam'
            },
            {
                x: 172.1,
                y: 73.9,
                country: 'Guatemala'
            },
            {
                x: 169.5,
                y: 79.8,
                country: 'Guinea'
            },
            {
                x: 168.2,
                y: 67,
                country: 'Guinea-Bissau'
            },
            {
                x: 172.7,
                y: 63.8,
                country: 'Guyana'
            },
            {
                x: 160,
                y: 52,
                country: 'Haiti'
            },
            {
                x: 168.6,
                y: 69.8,
                country: 'Honduras'
            },
            {
                x: 170.2,
                y: 64.4,
                country: 'Hong Kong, China'
            },
            {
                x: 181.2,
                y: 78.7,
                country: 'Hungary'
            },
            {
                x: 190.9,
                y: 94.9,
                country: 'Iceland'
            },
            {
                x: 177,
                y: 72.8,
                country: 'Independent Olympic Athletes'
            },
            {
                x: 170,
                y: 66.7,
                country: 'India'
            },
            {
                x: 165.6,
                y: 62.8,
                country: 'Indonesia'
            },
            {
                x: 171.3,
                y: 75.2,
                country: 'Iraq'
            },
            {
                x: 175.4,
                y: 67.4,
                country: 'Ireland'
            },
            {
                x: 178.7,
                y: 82.5,
                country: 'Islamic Republic of Iran'
            },
            {
                x: 174.7,
                y: 71.8,
                country: 'Israel'
            },
            {
                x: 177.9,
                y: 72.8,
                country: 'Italy'
            },
            {
                x: 175,
                y: 71.1,
                country: 'Jamaica'
            },
            {
                x: 169.3,
                y: 64.2,
                country: 'Japan'
            },
            {
                x: 173,
                y: 64.8,
                country: 'Jordan'
            },
            {
                x: 177.1,
                y: 74,
                country: 'Kazakhstan'
            },
            {
                x: 169.2,
                y: 58.2,
                country: 'Kenya'
            },
            {
                x: 164.3,
                y: 76,
                country: 'Kiribati'
            },
            {
                x: 179.3,
                y: 79.1,
                country: 'Kuwait'
            },
            {
                x: 175.5,
                y: 73.2,
                country: 'Kyrgyzstan'
            },
            {
                x: 166,
                y: 58.3,
                country: 'Lao People Democratic Republic'
            },
            {
                x: 181.4,
                y: 77.9,
                country: 'Latvia'
            },
            {
                x: 174.2,
                y: 69.1,
                country: 'Lebanon'
            },
            {
                x: 169.5,
                y: 58.5,
                country: 'Lesotho'
            },
            {
                x: 173.3,
                y: 71,
                country: 'Liberia'
            },
            {
                x: 172.5,
                y: 62.5,
                country: 'Libya'
            },
            {
                x: 174.7,
                y: 67.3,
                country: 'Liechtenstein'
            },
            {
                x: 183.8,
                y: 80.8,
                country: 'Lithuania'
            },
            {
                x: 177,
                y: 67.3,
                country: 'Luxembourg'
            },
            {
                x: 169.4,
                y: 64.6,
                country: 'Madagascar'
            },
            {
                x: 171.3,
                y: 71.3,
                country: 'Malawi'
            },
            {
                x: 168.8,
                y: 62.7,
                country: 'Malaysia'
            },
            {
                x: 164.6,
                y: 54.2,
                country: 'Maldives'
            },
            {
                x: 168,
                y: 77,
                country: 'Mali'
            },
            {
                x: 173.2,
                y: 72,
                country: 'Malta'
            },
            {
                x: 173.2,
                y: 74.5,
                country: 'Marshall Islands'
            },
            {
                x: 165,
                y: 55.5,
                country: 'Mauritania'
            },
            {
                x: 171,
                y: 63.8,
                country: 'Mauritius'
            },
            {
                x: 171.9,
                y: 67.9,
                country: 'Mexico'
            },
            {
                x: 180.3,
                y: 73.2,
                country: 'Monaco'
            },
            {
                x: 169.6,
                y: 67.2,
                country: 'Mongolia'
            },
            {
                x: 183.3,
                y: 82.6,
                country: 'Montenegro'
            },
            {
                x: 175.2,
                y: 66.8,
                country: 'Morocco'
            },
            {
                x: 172.2,
                y: 65.6,
                country: 'Mozambique'
            },
            {
                x: 167.7,
                y: 61,
                country: 'Myanmar'
            },
            {
                x: 169.9,
                y: 57.4,
                country: 'Namibia'
            },
            {
                x: 172,
                y: 106.5,
                country: 'Nauru'
            },
            {
                x: 164,
                y: 62,
                country: 'Nepal'
            },
            {
                x: 180.4,
                y: 73.7,
                country: 'Netherlands'
            },
            {
                x: 177.6,
                y: 73.6,
                country: 'New Zealand'
            },
            {
                x: 174,
                y: 58.2,
                country: 'Nicaragua'
            },
            {
                x: 172.8,
                y: 64.6,
                country: 'Niger'
            },
            {
                x: 180.8,
                y: 66.7,
                country: 'Nigeria'
            },
            {
                x: 178.2,
                y: 86.5,
                country: 'Norway'
            },
            {
                x: 168.2,
                y: 65.5,
                country: 'Oman'
            },
            {
                x: 163.4,
                y: 57.4,
                country: 'Palau'
            },
            {
                x: 171.2,
                y: 63,
                country: 'Palestine'
            },
            {
                x: 175.3,
                y: 73.2,
                country: 'Panama'
            },
            {
                x: 166.7,
                y: 66,
                country: 'Papua New Guinea'
            },
            {
                x: 174,
                y: 68,
                country: 'Paraguay'
            },
            {
                x: 176.6,
                y: 71.3,
                country: 'People Republic of China'
            },
            {
                x: 170,
                y: 62.9,
                country: 'Peru'
            },
            {
                x: 168.7,
                y: 71.1,
                country: 'Philippines'
            },
            {
                x: 180.5,
                y: 76.4,
                country: 'Poland'
            },
            {
                x: 174.4,
                y: 69,
                country: 'Portugal'
            },
            {
                x: 179.7,
                y: 75.1,
                country: 'Puerto Rico'
            },
            {
                x: 170.8,
                y: 63.7,
                country: 'Qatar'
            },
            {
                x: 173.7,
                y: 69,
                country: 'Republic of Korea'
            },
            {
                x: 176.7,
                y: 73.2,
                country: 'Republic of Moldova'
            },
            {
                x: 176.8,
                y: 75.4,
                country: 'Romania'
            },
            {
                x: 179,
                y: 74.4,
                country: 'Russian Federation'
            },
            {
                x: 164.2,
                y: 59,
                country: 'Rwanda'
            },
            {
                x: 172,
                y: 70.4,
                country: 'Saint Kitts and Nevis'
            },
            {
                x: 170.5,
                y: 64.5,
                country: 'Saint Lucia'
            },
            {
                x: 178,
                y: 78.8,
                country: 'Samoa'
            },
            {
                x: 169,
                y: 69.3,
                country: 'San Marino'
            },
            {
                x: 173.5,
                y: 64.5,
                country: 'Sao Tome and Principe'
            },
            {
                x: 180.5,
                y: 74.1,
                country: 'Senegal'
            },
            {
                x: 186,
                y: 82.7,
                country: 'Serbia'
            },
            {
                x: 172.6,
                y: 71.8,
                country: 'Seychelles'
            },
            {
                x: 176,
                y: 64,
                country: 'Sierra Leone'
            },
            {
                x: 166.9,
                y: 63,
                country: 'Singapore'
            },
            {
                x: 177.6,
                y: 71.7,
                country: 'Slovakia'
            },
            {
                x: 176.8,
                y: 71.4,
                country: 'Slovenia'
            },
            {
                x: 175,
                y: 69,
                country: 'South Africa'
            },
            {
                x: 177.4,
                y: 73.3,
                country: 'Spain'
            },
            {
                x: 171,
                y: 61.4,
                country: 'Sri Lanka'
            },
            {
                x: 180.5,
                y: 73.5,
                country: 'St Vincent and the Grenadines'
            },
            {
                x: 175.8,
                y: 61.7,
                country: 'Sudan'
            },
            {
                x: 168.2,
                y: 65,
                country: 'Suriname'
            },
            {
                x: 175.3,
                y: 72.7,
                country: 'Swaziland'
            },
            {
                x: 177.9,
                y: 73,
                country: 'Sweden'
            },
            {
                x: 179.3,
                y: 73.9,
                country: 'Switzerland'
            },
            {
                x: 178.2,
                y: 80.9,
                country: 'Syrian Arab Republic'
            },
            {
                x: 170.2,
                y: 69.9,
                country: 'Taipei (Chinese Taipei)'
            },
            {
                x: 175.1,
                y: 79,
                country: 'Tajikistan'
            },
            {
                x: 167.9,
                y: 65.8,
                country: 'Thailand'
            },
            {
                x: 173.6,
                y: 68.8,
                country: 'Togo'
            },
            {
                x: 183,
                y: 79,
                country: 'Tonga'
            },
            {
                x: 174.1,
                y: 77.5,
                country: 'Trinidad and Tobago'
            },
            {
                x: 183.4,
                y: 81.6,
                country: 'Tunisia'
            },
            {
                x: 174.8,
                y: 71,
                country: 'Turkey'
            },
            {
                x: 174.7,
                y: 72.6,
                country: 'Turkmenistan'
            },
            {
                x: 158,
                y: 68,
                country: 'Tuvalu'
            },
            {
                x: 170.2,
                y: 58.8,
                country: 'Uganda'
            },
            {
                x: 177.1,
                y: 73.6,
                country: 'Ukraine'
            },
            {
                x: 174.7,
                y: 69.9,
                country: 'United Arab Emirates'
            },
            {
                x: 171.3,
                y: 56.2,
                country: 'United Republic of Tanzania'
            },
            {
                x: 179,
                y: 75.9,
                country: 'United States of America'
            },
            {
                x: 179.6,
                y: 74.6,
                country: 'Uruguay'
            },
            {
                x: 175.3,
                y: 76.1,
                country: 'Uzbekistan'
            },
            {
                x: 172,
                y: 73,
                country: 'Vanuatu'
            },
            {
                x: 170.7,
                y: 69.7,
                country: 'Venezuela'
            },
            {
                x: 163.3,
                y: 57.3,
                country: 'Vietnam'
            },
            {
                x: 179.6,
                y: 73.4,
                country: 'Virgin Islands, US'
            },
            {
                x: 170.2,
                y: 58,
                country: 'Yemen'
            },
            {
                x: 176,
                y: 75.2,
                country: 'Zambia'
            },
            {
                x: 174.5,
                y: 69,
                country: 'Zimbabwe'
            },
            {
                x: 176.9,
                y: 72.8,
                country: 'Average',
                color: 'red',
                zIndex: 9
            }
            ]
        },
        // Normal scatter chart
        {
            name: 'Weight and height by country',
            dataLabels: {
                enabled: true,
                formatter: function () {
                    if (typeof (this.point.clusterPointsAmount) === 'undefined') {
                        return '';
                    }
                    return this.point.clusterPointsAmount;

                },
                style: {
                    fontSize: '10px',
                    textOutline: false
                }
            },
            marker: {
                radius: 3,
                fillColor: 'rgb(202, 25, 25, 0.5)',
                symbol: 'circle',
                states: {
                    hover: {
                        enabled: true
                    }
                }
            },
            tooltip: {
                formatter: function () {
                    if (typeof (this.point.clusterPointsAmount) === 'undefined') {
                        return this.point.country + '<br/> Height: ' + this.x + 'cm <br/> Weight: ' + this.y + 'kg';
                    }
                    return 'There are <b>' + this.point.clusterPointsAmount + '</b> points';
                }
            },
            data: [{
                x: 172,
                y: 60.3,
                country: 'Afghanistan'
            },
            {
                x: 177.2,
                y: 78.3,
                country: 'Albania'
            },
            {
                x: 173.9,
                y: 66.8,
                country: 'Algeria'
            },
            {
                x: 173.2,
                y: 81.4,
                country: 'American Samoa'
            },
            {
                x: 172,
                y: 67.3,
                country: 'Andorra'
            },
            {
                x: 174.7,
                y: 69.2,
                country: 'Angola'
            },
            {
                x: 176.7,
                y: 71.7,
                country: 'Antigua and Barbuda'
            },
            {
                x: 179.9,
                y: 77.8,
                country: 'Argentina'
            },
            {
                x: 175,
                y: 78.1,
                country: 'Armenia'
            },
            {
                x: 172.5,
                y: 76.8,
                country: 'Aruba'
            },
            {
                x: 179.1,
                y: 75.5,
                country: 'Australia'
            },
            {
                x: 177.2,
                y: 70.8,
                country: 'Austria'
            },
            {
                x: 173.5,
                y: 75.4,
                country: 'Azerbaijan'
            },
            {
                x: 179,
                y: 73.7,
                country: 'Bahamas'
            },
            {
                x: 167,
                y: 53.4,
                country: 'Bahrain'
            },
            {
                x: 166.8,
                y: 64.5,
                country: 'Bangladesh'
            },
            {
                x: 183.5,
                y: 74.2,
                country: 'Barbados'
            },
            {
                x: 177,
                y: 74.6,
                country: 'Belarus'
            },
            {
                x: 177.8,
                y: 71,
                country: 'Belgium'
            },
            {
                x: 164,
                y: 66.7,
                country: 'Belize'
            },
            {
                x: 174.6,
                y: 69,
                country: 'Benin'
            },
            {
                x: 175.2,
                y: 67.7,
                country: 'Bermuda'
            },
            {
                x: 155,
                y: 60,
                country: 'Bhutan'
            },
            {
                x: 178,
                y: 80,
                country: 'Bolivia'
            },
            {
                x: 182.5,
                y: 81,
                country: 'Bosnia and Herzegovina'
            },
            {
                x: 179,
                y: 60,
                country: 'Botswana'
            },
            {
                x: 178.5,
                y: 74.6,
                country: 'Brazil'
            },
            {
                x: 168,
                y: 59,
                country: 'Brunei Darussalam'
            },
            {
                x: 177.2,
                y: 73.3,
                country: 'Bulgaria'
            },
            {
                x: 173.4,
                y: 67.4,
                country: 'Burkina Faso'
            },
            {
                x: 173.5,
                y: 64.4,
                country: 'Burundi'
            },
            {
                x: 172.5,
                y: 65.7,
                country: 'Ivory Cost'
            },
            {
                x: 169.5,
                y: 57.8,
                country: 'Cambodia'
            },
            {
                x: 167.4,
                y: 67.8,
                country: 'Cameroon'
            },
            {
                x: 175.8,
                y: 72.4,
                country: 'Canada'
            },
            {
                x: 176.3,
                y: 75.3,
                country: 'Cape Verde'
            },
            {
                x: 183,
                y: 78.8,
                country: 'Cayman Islands'
            },
            {
                x: 171.3,
                y: 67.3,
                country: 'Chad'
            },
            {
                x: 171.8,
                y: 71.5,
                country: 'Chile'
            },
            {
                x: 170.3,
                y: 63.4,
                country: 'Colombia'
            },
            {
                x: 165.3,
                y: 56.7,
                country: 'Comoros'
            },
            {
                x: 173.9,
                y: 71.8,
                country: 'Congo'
            },
            {
                x: 164.3,
                y: 72.9,
                country: 'Cook Islands'
            },
            {
                x: 175,
                y: 67.8,
                country: 'Costa Rica'
            },
            {
                x: 185.1,
                y: 84,
                country: 'Croatia'
            },
            {
                x: 177.3,
                y: 73,
                country: 'Cyprus'
            },
            {
                x: 180.7,
                y: 76.3,
                country: 'Czech Republic'
            },
            {
                x: 162.9,
                y: 57.7,
                country: 'Democratic People Republic of Korea'
            },
            {
                x: 177.8,
                y: 78,
                country: 'Democratic Republic of the Congo'
            },
            {
                x: 159.5,
                y: 53,
                country: 'Democratic Republic of Timor-Leste'
            },
            {
                x: 180.9,
                y: 75.9,
                country: 'Denmark'
            },
            {
                x: 169,
                y: 59,
                country: 'Dominica'
            },
            {
                x: 175.6,
                y: 66.2,
                country: 'Dominican Republic'
            },
            {
                x: 171.6,
                y: 63.6,
                country: 'Ecuador'
            },
            {
                x: 174.7,
                y: 75.9,
                country: 'Egypt'
            },
            {
                x: 169.8,
                y: 65.5,
                country: 'El Salvador'
            },
            {
                x: 176,
                y: 68,
                country: 'Equatorial Guinea'
            },
            {
                x: 173.4,
                y: 59.5,
                country: 'Eritrea'
            },
            {
                x: 183.3,
                y: 85.8,
                country: 'Estonia'
            },
            {
                x: 170,
                y: 54.1,
                country: 'Ethiopia'
            },
            {
                x: 165.5,
                y: 69,
                country: 'Federated States of Micronesia'
            },
            {
                x: 175,
                y: 79.4,
                country: 'Fiji'
            },
            {
                x: 175.6,
                y: 70,
                country: 'Finland'
            },
            {
                x: 177.5,
                y: 68,
                country: 'Former Yugoslav Republic of Macedonia'
            },
            {
                x: 178,
                y: 72,
                country: 'France'
            },
            {
                x: 172.7,
                y: 72.6,
                country: 'Gabon'
            },
            {
                x: 155,
                y: 68,
                country: 'Gambia'
            },
            {
                x: 177.2,
                y: 77.7,
                country: 'Georgia'
            },
            {
                x: 179.6,
                y: 76,
                country: 'Germany'
            },
            {
                x: 168.8,
                y: 69.8,
                country: 'Ghana'
            },
            {
                x: 178.9,
                y: 74.5,
                country: 'Great Britain'
            },
            {
                x: 179.7,
                y: 76.6,
                country: 'Greece'
            },
            {
                x: 177.8,
                y: 62.3,
                country: 'Grenada'
            },
            {
                x: 176.1,
                y: 85.6,
                country: 'Guam'
            },
            {
                x: 172.1,
                y: 73.9,
                country: 'Guatemala'
            },
            {
                x: 169.5,
                y: 79.8,
                country: 'Guinea'
            },
            {
                x: 168.2,
                y: 67,
                country: 'Guinea-Bissau'
            },
            {
                x: 172.7,
                y: 63.8,
                country: 'Guyana'
            },
            {
                x: 160,
                y: 52,
                country: 'Haiti'
            },
            {
                x: 168.6,
                y: 69.8,
                country: 'Honduras'
            },
            {
                x: 170.2,
                y: 64.4,
                country: 'Hong Kong, China'
            },
            {
                x: 181.2,
                y: 78.7,
                country: 'Hungary'
            },
            {
                x: 190.9,
                y: 94.9,
                country: 'Iceland'
            },
            {
                x: 177,
                y: 72.8,
                country: 'Independent Olympic Athletes'
            },
            {
                x: 170,
                y: 66.7,
                country: 'India'
            },
            {
                x: 165.6,
                y: 62.8,
                country: 'Indonesia'
            },
            {
                x: 171.3,
                y: 75.2,
                country: 'Iraq'
            },
            {
                x: 175.4,
                y: 67.4,
                country: 'Ireland'
            },
            {
                x: 178.7,
                y: 82.5,
                country: 'Islamic Republic of Iran'
            },
            {
                x: 174.7,
                y: 71.8,
                country: 'Israel'
            },
            {
                x: 177.9,
                y: 72.8,
                country: 'Italy'
            },
            {
                x: 175,
                y: 71.1,
                country: 'Jamaica'
            },
            {
                x: 169.3,
                y: 64.2,
                country: 'Japan'
            },
            {
                x: 173,
                y: 64.8,
                country: 'Jordan'
            },
            {
                x: 177.1,
                y: 74,
                country: 'Kazakhstan'
            },
            {
                x: 169.2,
                y: 58.2,
                country: 'Kenya'
            },
            {
                x: 164.3,
                y: 76,
                country: 'Kiribati'
            },
            {
                x: 179.3,
                y: 79.1,
                country: 'Kuwait'
            },
            {
                x: 175.5,
                y: 73.2,
                country: 'Kyrgyzstan'
            },
            {
                x: 166,
                y: 58.3,
                country: 'Lao People Democratic Republic'
            },
            {
                x: 181.4,
                y: 77.9,
                country: 'Latvia'
            },
            {
                x: 174.2,
                y: 69.1,
                country: 'Lebanon'
            },
            {
                x: 169.5,
                y: 58.5,
                country: 'Lesotho'
            },
            {
                x: 173.3,
                y: 71,
                country: 'Liberia'
            },
            {
                x: 172.5,
                y: 62.5,
                country: 'Libya'
            },
            {
                x: 174.7,
                y: 67.3,
                country: 'Liechtenstein'
            },
            {
                x: 183.8,
                y: 80.8,
                country: 'Lithuania'
            },
            {
                x: 177,
                y: 67.3,
                country: 'Luxembourg'
            },
            {
                x: 169.4,
                y: 64.6,
                country: 'Madagascar'
            },
            {
                x: 171.3,
                y: 71.3,
                country: 'Malawi'
            },
            {
                x: 168.8,
                y: 62.7,
                country: 'Malaysia'
            },
            {
                x: 164.6,
                y: 54.2,
                country: 'Maldives'
            },
            {
                x: 168,
                y: 77,
                country: 'Mali'
            },
            {
                x: 173.2,
                y: 72,
                country: 'Malta'
            },
            {
                x: 173.2,
                y: 74.5,
                country: 'Marshall Islands'
            },
            {
                x: 165,
                y: 55.5,
                country: 'Mauritania'
            },
            {
                x: 171,
                y: 63.8,
                country: 'Mauritius'
            },
            {
                x: 171.9,
                y: 67.9,
                country: 'Mexico'
            },
            {
                x: 180.3,
                y: 73.2,
                country: 'Monaco'
            },
            {
                x: 169.6,
                y: 67.2,
                country: 'Mongolia'
            },
            {
                x: 183.3,
                y: 82.6,
                country: 'Montenegro'
            },
            {
                x: 175.2,
                y: 66.8,
                country: 'Morocco'
            },
            {
                x: 172.2,
                y: 65.6,
                country: 'Mozambique'
            },
            {
                x: 167.7,
                y: 61,
                country: 'Myanmar'
            },
            {
                x: 169.9,
                y: 57.4,
                country: 'Namibia'
            },
            {
                x: 172,
                y: 106.5,
                country: 'Nauru'
            },
            {
                x: 164,
                y: 62,
                country: 'Nepal'
            },
            {
                x: 180.4,
                y: 73.7,
                country: 'Netherlands'
            },
            {
                x: 177.6,
                y: 73.6,
                country: 'New Zealand'
            },
            {
                x: 174,
                y: 58.2,
                country: 'Nicaragua'
            },
            {
                x: 172.8,
                y: 64.6,
                country: 'Niger'
            },
            {
                x: 180.8,
                y: 66.7,
                country: 'Nigeria'
            },
            {
                x: 178.2,
                y: 86.5,
                country: 'Norway'
            },
            {
                x: 168.2,
                y: 65.5,
                country: 'Oman'
            },
            {
                x: 163.4,
                y: 57.4,
                country: 'Palau'
            },
            {
                x: 171.2,
                y: 63,
                country: 'Palestine'
            },
            {
                x: 175.3,
                y: 73.2,
                country: 'Panama'
            },
            {
                x: 166.7,
                y: 66,
                country: 'Papua New Guinea'
            },
            {
                x: 174,
                y: 68,
                country: 'Paraguay'
            },
            {
                x: 176.6,
                y: 71.3,
                country: 'People Republic of China'
            },
            {
                x: 170,
                y: 62.9,
                country: 'Peru'
            },
            {
                x: 168.7,
                y: 71.1,
                country: 'Philippines'
            },
            {
                x: 180.5,
                y: 76.4,
                country: 'Poland'
            },
            {
                x: 174.4,
                y: 69,
                country: 'Portugal'
            },
            {
                x: 179.7,
                y: 75.1,
                country: 'Puerto Rico'
            },
            {
                x: 170.8,
                y: 63.7,
                country: 'Qatar'
            },
            {
                x: 173.7,
                y: 69,
                country: 'Republic of Korea'
            },
            {
                x: 176.7,
                y: 73.2,
                country: 'Republic of Moldova'
            },
            {
                x: 176.8,
                y: 75.4,
                country: 'Romania'
            },
            {
                x: 179,
                y: 74.4,
                country: 'Russian Federation'
            },
            {
                x: 164.2,
                y: 59,
                country: 'Rwanda'
            },
            {
                x: 172,
                y: 70.4,
                country: 'Saint Kitts and Nevis'
            },
            {
                x: 170.5,
                y: 64.5,
                country: 'Saint Lucia'
            },
            {
                x: 178,
                y: 78.8,
                country: 'Samoa'
            },
            {
                x: 169,
                y: 69.3,
                country: 'San Marino'
            },
            {
                x: 173.5,
                y: 64.5,
                country: 'Sao Tome and Principe'
            },
            {
                x: 180.5,
                y: 74.1,
                country: 'Senegal'
            },
            {
                x: 186,
                y: 82.7,
                country: 'Serbia'
            },
            {
                x: 172.6,
                y: 71.8,
                country: 'Seychelles'
            },
            {
                x: 176,
                y: 64,
                country: 'Sierra Leone'
            },
            {
                x: 166.9,
                y: 63,
                country: 'Singapore'
            },
            {
                x: 177.6,
                y: 71.7,
                country: 'Slovakia'
            },
            {
                x: 176.8,
                y: 71.4,
                country: 'Slovenia'
            },
            {
                x: 175,
                y: 69,
                country: 'South Africa'
            },
            {
                x: 177.4,
                y: 73.3,
                country: 'Spain'
            },
            {
                x: 171,
                y: 61.4,
                country: 'Sri Lanka'
            },
            {
                x: 180.5,
                y: 73.5,
                country: 'St Vincent and the Grenadines'
            },
            {
                x: 175.8,
                y: 61.7,
                country: 'Sudan'
            },
            {
                x: 168.2,
                y: 65,
                country: 'Suriname'
            },
            {
                x: 175.3,
                y: 72.7,
                country: 'Swaziland'
            },
            {
                x: 177.9,
                y: 73,
                country: 'Sweden'
            },
            {
                x: 179.3,
                y: 73.9,
                country: 'Switzerland'
            },
            {
                x: 178.2,
                y: 80.9,
                country: 'Syrian Arab Republic'
            },
            {
                x: 170.2,
                y: 69.9,
                country: 'Taipei (Chinese Taipei)'
            },
            {
                x: 175.1,
                y: 79,
                country: 'Tajikistan'
            },
            {
                x: 167.9,
                y: 65.8,
                country: 'Thailand'
            },
            {
                x: 173.6,
                y: 68.8,
                country: 'Togo'
            },
            {
                x: 183,
                y: 79,
                country: 'Tonga'
            },
            {
                x: 174.1,
                y: 77.5,
                country: 'Trinidad and Tobago'
            },
            {
                x: 183.4,
                y: 81.6,
                country: 'Tunisia'
            },
            {
                x: 174.8,
                y: 71,
                country: 'Turkey'
            },
            {
                x: 174.7,
                y: 72.6,
                country: 'Turkmenistan'
            },
            {
                x: 158,
                y: 68,
                country: 'Tuvalu'
            },
            {
                x: 170.2,
                y: 58.8,
                country: 'Uganda'
            },
            {
                x: 177.1,
                y: 73.6,
                country: 'Ukraine'
            },
            {
                x: 174.7,
                y: 69.9,
                country: 'United Arab Emirates'
            },
            {
                x: 171.3,
                y: 56.2,
                country: 'United Republic of Tanzania'
            },
            {
                x: 179,
                y: 75.9,
                country: 'United States of America'
            },
            {
                x: 179.6,
                y: 74.6,
                country: 'Uruguay'
            },
            {
                x: 175.3,
                y: 76.1,
                country: 'Uzbekistan'
            },
            {
                x: 172,
                y: 73,
                country: 'Vanuatu'
            },
            {
                x: 170.7,
                y: 69.7,
                country: 'Venezuela'
            },
            {
                x: 163.3,
                y: 57.3,
                country: 'Vietnam'
            },
            {
                x: 179.6,
                y: 73.4,
                country: 'Virgin Islands, US'
            },
            {
                x: 170.2,
                y: 58,
                country: 'Yemen'
            },
            {
                x: 176,
                y: 75.2,
                country: 'Zambia'
            },
            {
                x: 174.5,
                y: 69,
                country: 'Zimbabwe'
            },
            {
                x: 176.9,
                y: 72.8,
                country: 'Average',
                color: 'red',
                zIndex: 9
            }
            ]
        }
    ]
});
