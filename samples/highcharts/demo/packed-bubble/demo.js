Highcharts.chart('container', {
    chart: {
        type: 'packedbubble',
        height: '80%'
    },
    title: {
        text: 'Carbon emissions around the world (2014)'
    },
    tooltip: {
        useHTML: true,
        pointFormat: '<b>{point.name}:</b> {point.y}m CO<sub>2</sub>'
    },
    plotOptions: {
        packedbubble: {
            dataLabels: {
                enabled: true,
                format: '{point.name}',
                filter: {
                    property: 'y',
                    operator: '>',
                    value: 250
                },
                style: {
                    color: 'black',
                    textOutline: 'none',
                    fontWeight: 'normal'
                }
            },
            minPointSize: 5
        }
    },
    series: [{
        name: 'Europe',
        data: [{
            name: 'Germany',
            y: 767.1
        }, {
            name: 'Croatia',
            y: 20.7
        },
        {
            name: "Belgium",
            y: 97.2
        },
        {
            name: "Czech Republic",
            y: 111.7
        },
        {
            name: "Netherlands",
            y: 158.1
        },
        {
            name: "Spain",
            y: 241.6
        },
        {
            name: "Ukraine",
            y: 249.1
        },
        {
            name: "Poland",
            y: 298.1
        },
        {
            name: "France",
            y: 323.7
        },
        {
            name: "Romania",
            y: 78.3
        },
        {
            name: "United Kingdom",
            y: 415.4
        }, {
            name: "Turkey",
            y: 353.2
        }, {
            name: "Italy",
            y: 337.6
        },
        {
            name: "Greece",
            y: 71.1
        },
        {
            name: "Austria",
            y: 69.8
        },
        {
            name: "Belarus",
            y: 67.7
        },
        {
            name: "Serbia",
            y: 59.3
        },
        {
            name: "Finland",
            y: 54.8
        },
        {
            name: "Bulgaria",
            y: 51.2
        },
        {
            name: "Portugal",
            y: 48.3
        },
        {
            name: "Norway",
            y: 44.4
        },
        {
            name: "Sweden",
            y: 44.3
        },
        {
            name: "Hungary",
            y: 43.7
        },
        {
            name: "Switzerland",
            y: 40.2
        },
        {
            name: "Denmark",
            y: 40
        },
        {
            name: "Slovakia",
            y: 34.7
        },
        {
            name: "Ireland",
            y: 34.6
        },
        {
            name: "Croatia",
            y: 20.7
        },
        {
            name: "Estonia",
            y: 19.4
        },
        {
            name: "Slovenia",
            y: 16.7
        },
        {
            name: "Lithuania",
            y: 12.3
        },
        {
            name: "Luxembourg",
            y: 10.4
        },
        {
            name: "Macedonia",
            y: 9.5
        },
        {
            name: "Moldova",
            y: 7.8
        },
        {
            name: "Latvia",
            y: 7.5
        },
        {
            name: "Cyprus",
            y: 7.2
        }]
    }, {
        name: 'Africa',
        data: [{
            name: "Senegal",
            y: 8.2
        },
        {
            name: "Cameroon",
            y: 9.2
        },
        {
            name: "Zimbabwe",
            y: 13.1
        },
        {
            name: "Ghana",
            y: 14.1
        },
        {
            name: "Kenya",
            y: 14.1
        },
        {
            name: "Sudan",
            y: 17.3
        },
        {
            name: "Tunisia",
            y: 24.3
        },
        {
            name: "Angola",
            y: 25
        },
        {
            name: "Libya",
            y: 50.6
        },
        {
            name: "Ivory Coast",
            y: 7.3
        },
        {
            name: "Morocco",
            y: 60.7
        },
        {
            name: "Ethiopia",
            y: 8.9
        },
        {
            name: "United Republic of Tanzania",
            y: 9.1
        },
        {
            name: "Nigeria",
            y: 93.9
        },
        {
            name: "South Africa",
            y: 392.7
        }, {
            name: "Egypt",
            y: 225.1
        }, {
            name: "Algeria",
            y: 141.5
        }]
    }, {
        name: 'Oceania',
        data: [{
            name: "Australia",
            y: 409.4
        },
        {
            name: "New Zealand",
            y: 34.1
        },
        {
            name: "Papua New Guinea",
            y: 7.1
        }]
    }, {
        name: 'North America',
        data: [{
            name: "Costa Rica",
            y: 7.6
        },
        {
            name: "Honduras",
            y: 8.4
        },
        {
            name: "Jamaica",
            y: 8.3
        },
        {
            name: "Panama",
            y: 10.2
        },
        {
            name: "Guatemala",
            y: 12
        },
        {
            name: "Dominican Republic",
            y: 23.4
        },
        {
            name: "Cuba",
            y: 30.2
        },
        {
            name: "USA",
            y: 5334.5
        }, {
            name: "Canada",
            y: 566
        }, {
            name: "Mexico",
            y: 456.3
        }]
    }, {
        name: 'South America',
        data: [{
            name: "El Salvador",
            y: 7.2
        },
        {
            name: "Uruguay",
            y: 8.1
        },
        {
            name: "Bolivia",
            y: 17.8
        },
        {
            name: "Trinidad and Tobago",
            y: 34
        },
        {
            name: "Ecuador",
            y: 43
        },
        {
            name: "Chile",
            y: 78.6
        },
        {
            name: "Peru",
            y: 52
        },
        {
            name: "Colombia",
            y: 74.1
        },
        {
            name: "Brazil",
            y: 501.1
        }, {
            name: "Argentina",
            y: 199
        },
        {
            name: "Venezuela",
            y: 195.2
        }]
    }, {
        name: 'Asia',
        data: [{
            name: "Nepal",
            y: 6.5
        },
        {
            name: "Georgia",
            y: 6.5
        },
        {
            name: "Brunei Darussalam",
            y: 7.4
        },
        {
            name: "Kyrgyzstan",
            y: 7.4
        },
        {
            name: "Afghanistan",
            y: 7.9
        },
        {
            name: "Myanmar",
            y: 9.1
        },
        {
            name: "Mongolia",
            y: 14.7
        },
        {
            name: "Sri Lanka",
            y: 16.6
        },
        {
            name: "Bahrain",
            y: 20.5
        },
        {
            name: "Yemen",
            y: 22.6
        },
        {
            name: "Jordan",
            y: 22.3
        },
        {
            name: "Lebanon",
            y: 21.1
        },
        {
            name: "Azerbaijan",
            y: 31.7
        },
        {
            name: "Singapore",
            y: 47.8
        },
        {
            name: "Hong Kong",
            y: 49.9
        },
        {
            name: "Syria",
            y: 52.7
        },
        {
            name: "DPR Korea",
            y: 59.9
        },
        {
            name: "Israel",
            y: 64.8
        },
        {
            name: "Turkmenistan",
            y: 70.6
        },
        {
            name: "Oman",
            y: 74.3
        },
        {
            name: "Qatar",
            y: 88.8
        },
        {
            name: "Philippines",
            y: 96.9
        },
        {
            name: "Kuwait",
            y: 98.6
        },
        {
            name: "Uzbekistan",
            y: 122.6
        },
        {
            name: "Iraq",
            y: 139.9
        },
        {
            name: "Pakistan",
            y: 158.1
        },
        {
            name: "Vietnam",
            y: 190.2
        },
        {
            name: "United Arab Emirates",
            y: 201.1
        },
        {
            name: "Malaysia",
            y: 227.5
        },
        {
            name: "Kazakhstan",
            y: 236.2
        },
        {
            name: "Thailand",
            y: 272
        },
        {
            name: "Taiwan",
            y: 276.7
        },
        {
            name: "Indonesia",
            y: 453
        },
        {
            name: "Saudi Arabia",
            y: 494.8
        },
        {
            name: "Japan",
            y: 1278.9
        },
        {
            name: "China",
            y: 10540.8
        },
        {
            name: "India",
            y: 2341.9
        },
        {
            name: "Russia",
            y: 1766.4
        },
        {
            name: "Iran",
            y: 618.2
        },
        {
            name: "Korea",
            y: 610.1
        }]
    }]
});
