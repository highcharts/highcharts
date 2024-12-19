(async () => {
    try {
    // Data for the top 100 cities
        const data = [
            {
                city: 'New York City',
                stateAbbr: 'NY',
                lat: 40.7128,
                lon: -74.006,
                population: 8419600
            },
            {
                city: 'Los Angeles',
                stateAbbr: 'CA',
                lat: 34.0522,
                lon: -118.2437,
                population: 3980400
            },
            {
                city: 'Chicago',
                stateAbbr: 'IL',
                lat: 41.8781,
                lon: -87.6298,
                population: 2716000
            },
            {
                city: 'Houston',
                stateAbbr: 'TX',
                lat: 29.7604,
                lon: -95.3698,
                population: 2328000
            },
            {
                city: 'Phoenix',
                stateAbbr: 'AZ',
                lat: 33.4484,
                lon: -112.074,
                population: 1690000
            },
            {
                city: 'Philadelphia',
                stateAbbr: 'PA',
                lat: 39.9526,
                lon: -75.1652,
                population: 1584200
            },
            {
                city: 'San Antonio',
                stateAbbr: 'TX',
                lat: 29.4241,
                lon: -98.4936,
                population: 1547200
            },
            {
                city: 'San Diego',
                stateAbbr: 'CA',
                lat: 32.7157,
                lon: -117.1611,
                population: 1423800
            },
            {
                city: 'Dallas',
                stateAbbr: 'TX',
                lat: 32.7767,
                lon: -96.797,
                population: 1341000
            },
            {
                city: 'San Jose',
                stateAbbr: 'CA',
                lat: 37.3382,
                lon: -121.8863,
                population: 1035300
            },
            {
                city: 'Austin',
                stateAbbr: 'TX',
                lat: 30.2672,
                lon: -97.7431,
                population: 995484
            },
            {
                city: 'Jacksonville',
                stateAbbr: 'FL',
                lat: 30.3322,
                lon: -81.6557,
                population: 911507
            },
            {
                city: 'Fort Worth',
                stateAbbr: 'TX',
                lat: 32.7555,
                lon: -97.3308,
                population: 902938
            },
            {
                city: 'Columbus',
                stateAbbr: 'OH',
                lat: 39.9612,
                lon: -82.9988,
                population: 905748
            },
            {
                city: 'San Francisco',
                stateAbbr: 'CA',
                lat: 37.7749,
                lon: -122.4194,
                population: 883305
            },
            {
                city: 'Charlotte',
                stateAbbr: 'NC',
                lat: 35.2271,
                lon: -80.8431,
                population: 872498
            },
            {
                city: 'Indianapolis',
                stateAbbr: 'IN',
                lat: 39.7684,
                lon: -86.1581,
                population: 867125
            },
            {
                city: 'Seattle',
                stateAbbr: 'WA',
                lat: 47.6062,
                lon: -122.3321,
                population: 744955
            },
            {
                city: 'Denver',
                stateAbbr: 'CO',
                lat: 39.7392,
                lon: -104.9903,
                population: 716492
            },
            {
                city: 'Washington',
                stateAbbr: 'DC',
                lat: 38.9072,
                lon: -77.0369,
                population: 702455
            },
            {
                city: 'Boston',
                stateAbbr: 'MA',
                lat: 42.3601,
                lon: -71.0589,
                population: 694583
            },
            {
                city: 'El Paso',
                stateAbbr: 'TX',
                lat: 31.7619,
                lon: -106.485,
                population: 682669
            },
            {
                city: 'Nashville',
                stateAbbr: 'TN',
                lat: 36.1627,
                lon: -86.7816,
                population: 669053
            },
            {
                city: 'Detroit',
                stateAbbr: 'MI',
                lat: 42.3314,
                lon: -83.0458,
                population: 672662
            },
            {
                city: 'Oklahoma City',
                stateAbbr: 'OK',
                lat: 35.4676,
                lon: -97.5164,
                population: 649021
            },
            {
                city: 'Portland',
                stateAbbr: 'OR',
                lat: 45.5051,
                lon: -122.675,
                population: 653115
            },
            {
                city: 'Las Vegas',
                stateAbbr: 'NV',
                lat: 36.1699,
                lon: -115.1398,
                population: 644644
            },
            {
                city: 'Memphis',
                stateAbbr: 'TN',
                lat: 35.1495,
                lon: -90.049,
                population: 650618
            },
            {
                city: 'Louisville',
                stateAbbr: 'KY',
                lat: 38.2527,
                lon: -85.7585,
                population: 620118
            },
            {
                city: 'Baltimore',
                stateAbbr: 'MD',
                lat: 39.2904,
                lon: -76.6122,
                population: 602495
            },
            {
                city: 'Milwaukee',
                stateAbbr: 'WI',
                lat: 43.0389,
                lon: -87.9065,
                population: 592025
            },
            {
                city: 'Albuquerque',
                stateAbbr: 'NM',
                lat: 35.0844,
                lon: -106.6504,
                population: 560218
            },
            {
                city: 'Tucson',
                stateAbbr: 'AZ',
                lat: 32.2226,
                lon: -110.9747,
                population: 545975
            },
            {
                city: 'Fresno',
                stateAbbr: 'CA',
                lat: 36.7378,
                lon: -119.7871,
                population: 530093
            },
            {
                city: 'Mesa',
                stateAbbr: 'AZ',
                lat: 33.4152,
                lon: -111.8315,
                population: 508958
            },
            {
                city: 'Sacramento',
                stateAbbr: 'CA',
                lat: 38.5816,
                lon: -121.4944,
                population: 508529
            },
            {
                city: 'Atlanta',
                stateAbbr: 'GA',
                lat: 33.749,
                lon: -84.388,
                population: 498044
            },
            {
                city: 'Kansas City',
                stateAbbr: 'MO',
                lat: 39.0997,
                lon: -94.5786,
                population: 491918
            },
            {
                city: 'Colorado Springs',
                stateAbbr: 'CO',
                lat: 38.8339,
                lon: -104.8214,
                population: 472688
            },
            {
                city: 'Miami',
                stateAbbr: 'FL',
                lat: 25.7617,
                lon: -80.1918,
                population: 470914
            },
            {
                city: 'Raleigh',
                stateAbbr: 'NC',
                lat: 35.7796,
                lon: -78.6382,
                population: 469298
            },
            {
                city: 'Omaha',
                stateAbbr: 'NE',
                lat: 41.2565,
                lon: -95.9345,
                population: 468262
            },
            {
                city: 'Long Beach',
                stateAbbr: 'CA',
                lat: 33.7701,
                lon: -118.1937,
                population: 467354
            },
            {
                city: 'Virginia Beach',
                stateAbbr: 'VA',
                lat: 36.8529,
                lon: -75.978,
                population: 450189
            },
            {
                city: 'Oakland',
                stateAbbr: 'CA',
                lat: 37.8044,
                lon: -122.2711,
                population: 429082
            },
            {
                city: 'Minneapolis',
                stateAbbr: 'MN',
                lat: 44.9778,
                lon: -93.265,
                population: 425403
            },
            {
                city: 'Tulsa',
                stateAbbr: 'OK',
                lat: 36.1539,
                lon: -95.9928,
                population: 401190
            },
            {
                city: 'Arlington',
                stateAbbr: 'TX',
                lat: 32.7357,
                lon: -97.1081,
                population: 398854
            },
            {
                city: 'Tampa',
                stateAbbr: 'FL',
                lat: 27.9506,
                lon: -82.4572,
                population: 392890
            },
            {
                city: 'New Orleans',
                stateAbbr: 'LA',
                lat: 29.9511,
                lon: -90.0715,
                population: 391006
            },
            {
                city: 'Wichita',
                stateAbbr: 'KS',
                lat: 37.6872,
                lon: -97.3301,
                population: 389255
            },
            {
                city: 'Cleveland',
                stateAbbr: 'OH',
                lat: 41.4993,
                lon: -81.6944,
                population: 383793
            },
            {
                city: 'Bakersfield',
                stateAbbr: 'CA',
                lat: 35.3733,
                lon: -119.0187,
                population: 383579
            },
            {
                city: 'Aurora',
                stateAbbr: 'CO',
                lat: 39.7294,
                lon: -104.8319,
                population: 374114
            },
            {
                city: 'Anaheim',
                stateAbbr: 'CA',
                lat: 33.8366,
                lon: -117.9143,
                population: 352005
            },
            {
                city: 'Honolulu',
                stateAbbr: 'HI',
                lat: 21.3069,
                lon: -157.8583,
                population: 347397
            },
            {
                city: 'Santa Ana',
                stateAbbr: 'CA',
                lat: 33.7455,
                lon: -117.8677,
                population: 332318
            },
            {
                city: 'Riverside',
                stateAbbr: 'CA',
                lat: 33.9806,
                lon: -117.3755,
                population: 331360
            },
            {
                city: 'Corpus Christi',
                stateAbbr: 'TX',
                lat: 27.8006,
                lon: -97.3964,
                population: 326554
            },
            {
                city: 'Lexington',
                stateAbbr: 'KY',
                lat: 38.0406,
                lon: -84.5037,
                population: 323780
            },
            {
                city: 'Stockton',
                stateAbbr: 'CA',
                lat: 37.9577,
                lon: -121.2908,
                population: 311178
            },
            {
                city: 'Henderson',
                stateAbbr: 'NV',
                lat: 36.0395,
                lon: -114.9817,
                population: 310390
            },
            {
                city: 'Saint Paul',
                stateAbbr: 'MN',
                lat: 44.9537,
                lon: -93.09,
                population: 307695
            },
            {
                city: 'St. Louis',
                stateAbbr: 'MO',
                lat: 38.627,
                lon: -90.1994,
                population: 302838
            },
            {
                city: 'Cincinnati',
                stateAbbr: 'OH',
                lat: 39.1031,
                lon: -84.512,
                population: 302605
            },
            {
                city: 'Pittsburgh',
                stateAbbr: 'PA',
                lat: 40.4406,
                lon: -79.9959,
                population: 301048
            },
            {
                city: 'Greensboro',
                stateAbbr: 'NC',
                lat: 36.0726,
                lon: -79.792,
                population: 294722
            },
            {
                city: 'Anchorage',
                stateAbbr: 'AK',
                lat: 61.2181,
                lon: -149.9003,
                population: 291538
            },
            {
                city: 'Plano',
                stateAbbr: 'TX',
                lat: 33.0198,
                lon: -96.6989,
                population: 288061
            },
            {
                city: 'Lincoln',
                stateAbbr: 'NE',
                lat: 40.8136,
                lon: -96.7026,
                population: 287401
            },
            {
                city: 'Orlando',
                stateAbbr: 'FL',
                lat: 28.5383,
                lon: -81.3792,
                population: 285713
            },
            {
                city: 'Irvine',
                stateAbbr: 'CA',
                lat: 33.6846,
                lon: -117.8265,
                population: 282572
            },
            {
                city: 'Newark',
                stateAbbr: 'NJ',
                lat: 40.7357,
                lon: -74.1724,
                population: 282011
            },
            {
                city: 'Toledo',
                stateAbbr: 'OH',
                lat: 41.6528,
                lon: -83.5379,
                population: 274975
            },
            {
                city: 'Durham',
                stateAbbr: 'NC',
                lat: 35.994,
                lon: -78.8986,
                population: 274291
            },
            {
                city: 'Chula Vista',
                stateAbbr: 'CA',
                lat: 32.6401,
                lon: -117.0842,
                population: 270471
            },
            {
                city: 'Fort Wayne',
                stateAbbr: 'IN',
                lat: 41.0793,
                lon: -85.1394,
                population: 267633
            },
            {
                city: 'Jersey City',
                stateAbbr: 'NJ',
                lat: 40.7178,
                lon: -74.0431,
                population: 265549
            },
            {
                city: 'St. Petersburg',
                stateAbbr: 'FL',
                lat: 27.7676,
                lon: -82.6403,
                population: 265351
            },
            {
                city: 'Laredo',
                stateAbbr: 'TX',
                lat: 27.5306,
                lon: -99.4803,
                population: 262491
            },
            {
                city: 'Madison',
                stateAbbr: 'WI',
                lat: 43.0731,
                lon: -89.4012,
                population: 258054
            },
            {
                city: 'Chandler',
                stateAbbr: 'AZ',
                lat: 33.3062,
                lon: -111.8413,
                population: 257165
            },
            {
                city: 'Buffalo',
                stateAbbr: 'NY',
                lat: 42.8864,
                lon: -78.8784,
                population: 256902
            },
            {
                city: 'Lubbock',
                stateAbbr: 'TX',
                lat: 33.5779,
                lon: -101.8552,
                population: 255885
            },
            {
                city: 'Scottsdale',
                stateAbbr: 'AZ',
                lat: 33.4942,
                lon: -111.9261,
                population: 255310
            },
            {
                city: 'Reno',
                stateAbbr: 'NV',
                lat: 39.5296,
                lon: -119.8138,
                population: 250998
            },
            {
                city: 'Glendale',
                stateAbbr: 'AZ',
                lat: 33.5387,
                lon: -112.186,
                population: 250702
            },
            {
                city: 'Gilbert',
                stateAbbr: 'AZ',
                lat: 33.3528,
                lon: -111.789,
                population: 248279
            },
            {
                city: 'Winston-Salem',
                stateAbbr: 'NC',
                lat: 36.0999,
                lon: -80.2442,
                population: 246328
            },
            {
                city: 'North Las Vegas',
                stateAbbr: 'NV',
                lat: 36.1989,
                lon: -115.1175,
                population: 245949
            },
            {
                city: 'Norfolk',
                stateAbbr: 'VA',
                lat: 36.8508,
                lon: -76.2859,
                population: 242742
            },
            {
                city: 'Chesapeake',
                stateAbbr: 'VA',
                lat: 36.7682,
                lon: -76.2875,
                population: 242634
            },
            {
                city: 'Garland',
                stateAbbr: 'TX',
                lat: 32.9126,
                lon: -96.6389,
                population: 242507
            },
            {
                city: 'Irving',
                stateAbbr: 'TX',
                lat: 32.814,
                lon: -96.9489,
                population: 242242
            },
            {
                city: 'Hialeah',
                stateAbbr: 'FL',
                lat: 25.8576,
                lon: -80.2781,
                population: 239673
            },
            {
                city: 'Fremont',
                stateAbbr: 'CA',
                lat: 37.5483,
                lon: -121.9886,
                population: 234962
            },
            {
                city: 'Boise',
                stateAbbr: 'ID',
                lat: 43.615,
                lon: -116.2023,
                population: 228959
            },
            {
                city: 'Richmond',
                stateAbbr: 'VA',
                lat: 37.5407,
                lon: -77.436,
                population: 228783
            },
            {
                city: 'Baton Rouge',
                stateAbbr: 'LA',
                lat: 30.4515,
                lon: -91.1871,
                population: 221599
            },
            {
                city: 'Spokane',
                stateAbbr: 'WA',
                lat: 47.6588,
                lon: -117.426,
                population: 219190
            },
            {
                city: 'Des Moines',
                stateAbbr: 'IA',
                lat: 41.5868,
                lon: -93.625,
                population: 216853
            },
            {
                city: 'Tacoma',
                stateAbbr: 'WA',
                lat: 47.2529,
                lon: -122.4443,
                population: 217827
            },
            {
                city: 'San Bernardino',
                stateAbbr: 'CA',
                lat: 34.1083,
                lon: -117.2898,
                population: 216995
            },
            {
                city: 'Modesto',
                stateAbbr: 'CA',
                lat: 37.6391,
                lon: -120.9969,
                population: 215030
            },
            {
                city: 'Fontana',
                stateAbbr: 'CA',
                lat: 34.0922,
                lon: -117.435,
                population: 213739
            },
            {
                city: 'Santa Clarita',
                stateAbbr: 'CA',
                lat: 34.3917,
                lon: -118.5426,
                population: 210089
            },
            {
                city: 'Birmingham',
                stateAbbr: 'AL',
                lat: 33.5186,
                lon: -86.8104,
                population: 209880
            },
            {
                city: 'Oxnard',
                stateAbbr: 'CA',
                lat: 34.1975,
                lon: -119.1771,
                population: 209877
            },
            {
                city: 'Fayetteville',
                stateAbbr: 'NC',
                lat: 35.0527,
                lon: -78.8784,
                population: 209468
            },
            {
                city: 'Rochester',
                stateAbbr: 'NY',
                lat: 43.1566,
                lon: -77.6088,
                population: 206284
            },
            {
                city: 'Moreno Valley',
                stateAbbr: 'CA',
                lat: 33.9425,
                lon: -117.2297,
                population: 205499
            },
            {
                city: 'Glendale',
                stateAbbr: 'CA',
                lat: 34.1425,
                lon: -118.2551,
                population: 201361
            },
            {
                city: 'Yonkers',
                stateAbbr: 'NY',
                lat: 40.9312,
                lon: -73.8988,
                population: 200807
            }
        ];

        // Create the map chart
        Highcharts.mapChart('container', {
            title: {
                text: 'US map of top 100 cities by population'
            },
            mapNavigation: {
                enabled: true,
                enableMouseWheelZoom: true,
                enableDoubleClickZoom: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },
            legend: {
                enabled: false
            },
            mapView: {
                center: [-98.6, 39.8],
                zoom: 4
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '<b>{point.name}</b><br>Population: {point.z:,f}'
            },
            plotOptions: {
                mapbubble: {
                    minSize: '5%',
                    maxSize: '15%',
                    allAreas: false,
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            series: [
                {
                    type: 'tiledwebmap',
                    provider: {
                        type: 'OpenStreetMap',
                        theme: 'Standard'
                    }
                },
                {
                    type: 'mapbubble',
                    name: 'Cities',
                    color: Highcharts.getOptions().colors[1],
                    data: data.map(city => ({
                        name: `${city.city}, ${city.stateAbbr}`,
                        lat: city.lat,
                        lon: city.lon,
                        z: city.population // Population used for bubble size
                    })),
                    marker: {
                        symbol: 'circle',
                        lineWidth: 1,
                        lineColor: '#ffffff'
                    }
                }
            ],
            chartOptions: {
                legend: {
                    enabled: false
                }
            }
        });
    } catch (error) {
        console.error('Error creating map chart:', error);
    }
})();
