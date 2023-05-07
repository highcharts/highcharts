(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/custom/us-all-mainland.topo.json'
    ).then(response => response.json());


    Highcharts.mapChart('container', {

        chart: {
            map: topology,
            height: (9 / 16 * 100) + '%' // 16:9 ratio
        },

        title: {
            text: 'USA earthquakes from 2000 to 2019 (mag 4.5+)',
            style: {
                fontSize: 13
            }
        },
        subtitle: {
            text: 'Source <a href="https://earthquake.usgs.gov/" target="_blank">USGS</a>'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            visible: false,
            start: 1,
            min: 1,
            max: 40,
            minColor: '#ffcccc',
            maxColor: '#cc0000'
        },

        legend: {
            enabled: false
        },
        tooltip: {
            headerFormat: '',
            pointFormat: '<b>{point.name}</b><br>Lat: {point.lat}, Lon: {point.lon}'
        },
        plotOptions: {
            mappoint: {
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        if (typeof (this.point.clusterPointsAmount) === 'undefined') {
                            return '';
                        }
                        return this.point.clusterPointsAmount;

                    }
                },
                cluster: {
                    enabled: true,
                    allowOverlap: false,
                    animation: {
                        duration: 450
                    },
                    layoutAlgorithm: {
                        type: 'grid',
                        gridSize: 70
                    },
                    zones: [{
                        from: 1,
                        to: 10,
                        marker: {
                            radius: 15
                        }
                    }, {
                        from: 11,
                        to: 20,
                        marker: {
                            radius: 15
                        }
                    }, {
                        from: 21,
                        to: 30,
                        marker: {
                            radius: 15
                        }
                    }, {
                        from: 31,
                        to: 200,
                        marker: {
                            radius: 15
                        }
                    }]
                }
            }
        },
        series: [{
            name: 'Basemap',
            borderColor: '#A0A0A0',
            nullColor: 'rgba(200, 200, 200, 0.3)',
            showInLegend: false
        }, {
            // Specify points using lat/lon
            type: 'mappoint',
            name: 'Earthquake',
            colorKey: 'clusterPointsAmount',
            color: '#ffcccc',
            data: [{
                name: '6km NE of Port Orford, Oregon',
                lat: 42.776,
                lon: -124.476666666667
            },
            {
                name: '17km SSE of Tres Pinos, CA',
                lat: 36.6455,
                lon: -121.274
            },
            {
                name: '44km E of Austin, Nevada',
                lat: 39.5419,
                lon: -116.5599
            },
            {
                name: '18km E of Little Lake, CA',
                lat: 35.9073333,
                lon: -117.709
            },
            {
                name: '18km E of Little Lake, CA',
                lat: 35.9261667,
                lon: -117.7075
            },
            {
                name: '9km NE of Coso Junction, CA',
                lat: 36.1126667,
                lon: -117.8868333
            },
            {
                name: '8km ENE of Ridgecrest, CA',
                lat: 35.6383333,
                lon: -117.5853333
            },
            {
                name: '3km WNW of Monroe, Washington',
                lat: 47.8728333333333,
                lon: -122.016333333333
            },
            {
                name: '16km NNE of Coso Junction, CA',
                lat: 36.1768333,
                lon: -117.884
            },
            {
                name: '16km W of Searles Valley, CA',
                lat: 35.7681667,
                lon: -117.5778333
            },
            {
                name: '23km N of Ridgecrest, CA',
                lat: 35.8235,
                lon: -117.663
            },
            {
                name: '18km E of Little Lake, CA',
                lat: 35.9283333,
                lon: -117.705
            },
            {
                name: '18km ESE of Little Lake, CA',
                lat: 35.8815,
                lon: -117.7173333
            },
            {
                name: '17km ESE of Little Lake, CA',
                lat: 35.898,
                lon: -117.7271667
            },
            {
                name: '16km SSW of Searles Valley, CA',
                lat: 35.639,
                lon: -117.4913333
            },
            {
                name: '15km E of Little Lake, CA',
                lat: 35.911,
                lon: -117.7385
            },
            {
                name: '16km ESE of Little Lake, CA',
                lat: 35.9,
                lon: -117.7376667
            },
            {
                name: '20km E of Little Lake, CA',
                lat: 35.9101667,
                lon: -117.6848333
            },
            {
                name: '7km SE of Ridgecrest, CA',
                lat: 35.5846667,
                lon: -117.6145
            },
            {
                name: '16km ESE of Ridgecrest, CA',
                lat: 35.5551667,
                lon: -117.5216667
            },
            {
                name: '19km E of Little Lake, CA',
                lat: 35.9035,
                lon: -117.7001667
            },
            {
                name: '15km ESE of Little Lake, CA',
                lat: 35.9011667,
                lon: -117.7495
            },
            {
                name: '18km ESE of Little Lake, CA',
                lat: 35.9028333,
                lon: -117.7115
            },
            {
                name: '24km ESE of Ridgecrest, CA',
                lat: 35.5303333,
                lon: -117.4313333
            },
            {
                name: '16km E of Little Lake, CA',
                lat: 35.9138333,
                lon: -117.7258333
            },
            {
                name: '23km ESE of Little Lake, CA',
                lat: 35.8606667,
                lon: -117.6708333
            },
            {
                name: '20km WNW of Searles Valley, CA',
                lat: 35.8031667,
                lon: -117.6178333
            },
            {
                name: '22km ESE of Little Lake, CA',
                lat: 35.861,
                lon: -117.6778333
            },
            {
                name: '16km ESE of Little Lake, CA',
                lat: 35.891,
                lon: -117.7365
            },
            {
                name: '17km S of Searles Valley, CA',
                lat: 35.6166667,
                lon: -117.4301667
            },
            {
                name: '13km W of Searles Valley, CA',
                lat: 35.748,
                lon: -117.5456667
            },
            {
                name: '16km E of Little Lake, CA',
                lat: 35.9216667,
                lon: -117.729
            },
            {
                name: '15km E of Little Lake, CA',
                lat: 35.9496667,
                lon: -117.7376667
            },
            {
                name: '2019 Ridgecrest Earthquake Sequence',
                lat: 35.7695,
                lon: -117.5993333
            },
            {
                name: '14km WSW of Searles Valley, CA',
                lat: 35.7253333,
                lon: -117.5535
            },
            {
                name: '16km W of Searles Valley, CA',
                lat: 35.7603333,
                lon: -117.575
            },
            {
                name: '13km SSW of Searles Valley, CA',
                lat: 35.6715,
                lon: -117.4788333
            },
            {
                name: '15km NE of Ridgecrest, CA',
                lat: 35.716,
                lon: -117.56
            },
            {
                name: '7km ESE of Ridgecrest, CA',
                lat: 35.6013333,
                lon: -117.597
            },
            {
                name: 'Ridgecrest Earthquake Sequence',
                lat: 35.7053333,
                lon: -117.5038333
            },
            {
                name: '6km SSW of Petrolia, CA',
                lat: 40.2735,
                lon: -124.3003333
            },
            {
                name: '11km W of Plainville, Kansas',
                lat: 39.216,
                lon: -99.4259
            },
            {
                name: '65km NNE of Camalu, Mexico',
                lat: 31.3428,
                lon: -115.6838
            },
            {
                name: '9km NE of Lima, Montana',
                lat: 44.6972,
                lon: -112.5078
            },
            {
                name: '71km SW of Puerto Penasco, Mexico',
                lat: 30.8278,
                lon: -114.0297
            },
            {
                name: '138km NNW of San Luis, Mexico',
                lat: 29.6356,
                lon: -114.1301
            },
            {
                name: '220km ESE of Ocean City, Maryland',
                lat: 37.2318,
                lon: -73.0097
            },
            {
                name: '70km ENE of Loreto, Mexico',
                lat: 26.1622,
                lon: -110.6621
            },
            {
                name: '71km ENE of Loreto, Mexico',
                lat: 26.3588,
                lon: -110.7377
            },
            {
                name: '8km WSW of Alberto Oviedo Mota, B.C., MX',
                lat: 32.2065,
                lon: -115.2535
            },
            {
                name: '91km E of Loreto, Mexico',
                lat: 25.9824,
                lon: -110.4898
            },
            {
                name: '63km NE of San Felipe, Mexico',
                lat: 31.3986,
                lon: -114.3941
            },
            {
                name: '15km WNW of Sandy Valley, Nevada',
                lat: 35.8945,
                lon: -115.7758
            },
            {
                name: '182km SSE of Buras-Triumph, Louisiana',
                lat: 27.871,
                lon: -88.6778
            },
            {
                name: '26km WSW of Perry, Oklahoma',
                lat: 36.2185,
                lon: -97.5735
            },
            {
                name: '20km W of Perry, Oklahoma',
                lat: 36.2896,
                lon: -97.5166
            },
            {
                name: '29km SW of Santa Cruz Is. (E end), CA',
                lat: 33.8375,
                lon: -119.7258333
            },
            {
                name: '22km WNW of Petrolia, CA',
                lat: 40.4278333,
                lon: -124.5108333
            },
            {
                name: '57km E of San Felipe, Mexico',
                lat: 31.0935,
                lon: -114.275
            },
            {
                name: '103km SE of San Felipe, Mexico',
                lat: 30.2302,
                lon: -114.2468
            },
            {
                name: '75km NNE of Loreto, Mexico',
                lat: 26.6362,
                lon: -111.0263
            },
            {
                name: '68km NNE of Loreto, Mexico',
                lat: 26.6067,
                lon: -111.1312
            },
            {
                name: '78km NNE of Loreto, Mexico',
                lat: 26.6862,
                lon: -111.0785
            },
            {
                name: '22km NE of Gonzales, California',
                lat: 36.6305,
                lon: -121.2443333
            },
            {
                name: '18km SE of Soda Springs, Idaho',
                lat: 42.547,
                lon: -111.4397
            },
            {
                name: '12km ESE of Soda Springs, Idaho',
                lat: 42.6074,
                lon: -111.4701
            },
            {
                name: '18km ESE of Soda Springs, Idaho',
                lat: 42.5629,
                lon: -111.4155
            },
            {
                name: '16km SE of Soda Springs, Idaho',
                lat: 42.572,
                lon: -111.4444
            },
            {
                name: '13km ESE of Soda Springs, Idaho',
                lat: 42.6213,
                lon: -111.4516
            },
            {
                name: '10km E of Soda Springs, Idaho',
                lat: 42.6381,
                lon: -111.474
            },
            {
                name: '15km ESE of Soda Springs, Idaho',
                lat: 42.6137,
                lon: -111.4287
            },
            {
                name: '12km E of Soda Springs, Idaho',
                lat: 42.6474,
                lon: -111.4492
            },
            {
                name: '15km S of Lincoln, Montana',
                lat: 46.8128,
                lon: -112.665
            },
            {
                name: '11km SE of Lincoln, Montana',
                lat: 46.8811,
                lon: -112.5753
            },
            {
                name: '78km WSW of Higuera de Zaragoza, Mexico',
                lat: 25.7127,
                lon: -110.0237
            },
            {
                name: '28km SW of Hawthorne, Nevada',
                lat: 38.3777,
                lon: -118.8957
            },
            {
                name: '26km SW of Hawthorne, Nevada',
                lat: 38.3904,
                lon: -118.8972
            },
            {
                name: '27km SW of Hawthorne, Nevada',
                lat: 38.3755,
                lon: -118.8989
            },
            {
                name: '8km NW of The Geysers, California',
                lat: 38.8221667,
                lon: -122.8413333
            },
            {
                name: '69km SW of Topolobampo, Mexico',
                lat: 25.1174,
                lon: -109.4987
            },
            {
                name: '103km S of Topolobampo, Mexico',
                lat: 24.673,
                lon: -109.1901
            },
            {
                name: '3km W of Cushing, Oklahoma',
                lat: 35.9907,
                lon: -96.803
            },
            {
                name: '81km SW of Topolobampo, Mexico',
                lat: 25.0912,
                lon: -109.6315
            },
            {
                name: '69km SW of Higuera de Zaragoza, Mexico',
                lat: 25.476,
                lon: -109.7346
            },
            {
                name: '14km NW of Pawnee, Oklahoma',
                lat: 36.4251,
                lon: -96.9291
            },
            {
                name: '35km E of Hoback, Wyoming',
                lat: 43.2226,
                lon: -110.3593
            },
            {
                name: '66km SE of San Felipe, Mexico',
                lat: 30.6368,
                lon: -114.3145
            },
            {
                name: '20km NNE of Upper Lake, California',
                lat: 39.3293333,
                lon: -122.8018333
            },
            {
                name: '19km SSE of Blue Lake, CA',
                lat: 40.7243333,
                lon: -123.8918333
            },
            {
                name: '20km NW of Hawthorne, Nevada',
                lat: 38.6516,
                lon: -118.7943
            },
            {
                name: '20km NNW of Borrego Springs, CA',
                lat: 33.4315,
                lon: -116.4426667
            },
            {
                name: '102km SSE of San Felipe, Mexico',
                lat: 30.2073,
                lon: -114.3078
            },
            {
                name: '103km SSE of San Felipe, Mexico',
                lat: 30.2219,
                lon: -114.2783
            },
            {
                name: '6km SSW of Wasco, CA',
                lat: 35.5423333,
                lon: -119.3728333
            },
            {
                name: '10km WNW of Big Pine, California',
                lat: 37.2023333,
                lon: -118.4035
            },
            {
                name: '31km NW of Fairview, Oklahoma',
                lat: 36.4898,
                lon: -98.709
            },
            {
                name: '33km NW of Fairview, Oklahoma',
                lat: 36.4955,
                lon: -98.7254
            },
            {
                name: '17km NNE of Victoria, Canada',
                lat: 48.5865,
                lon: -123.3003333
            },
            {
                name: 'North Pacific Ocean',
                lat: 25.6559,
                lon: -120.9243
            },
            {
                name: '26km E of Cherokee, Oklahoma',
                lat: 36.7509,
                lon: -98.0561
            },
            {
                name: '13km SW of Cherokee, Oklahoma',
                lat: 36.6602,
                lon: -98.4594
            },
            {
                name: '69km ESE of Lakeview, Oregon',
                lat: 41.8594,
                lon: -119.6271
            },
            {
                name: '81km SSW of Topolobampo, Mexico',
                lat: 24.9039,
                lon: -109.3154
            },
            {
                name: '97km SW of Topolobampo, Mexico',
                lat: 24.9529,
                lon: -109.7119
            },
            {
                name: '95km SW of Topolobampo, Mexico',
                lat: 24.913,
                lon: -109.6226
            },
            {
                name: '99km SSW of Topolobampo, Mexico',
                lat: 24.8094,
                lon: -109.5138
            },
            {
                name: '100km SW of Topolobampo, Mexico',
                lat: 24.9056,
                lon: -109.6985
            },
            {
                name: '4km NNE of Crescent, Oklahoma',
                lat: 35.9889,
                lon: -97.5717
            },
            {
                name: '68km ESE of Lakeview, Oregon',
                lat: 41.8875,
                lon: -119.6226
            },
            {
                name: '66km WSW of Topolobampo, Mexico',
                lat: 25.4348,
                lon: -109.6859
            },
            {
                name: '66km ESE of Lakeview, Oregon',
                lat: 41.8986,
                lon: -119.6367
            },
            {
                name: '37km SSW of Caliente, Nevada',
                lat: 37.2925,
                lon: -114.6546
            },
            {
                name: '51km WNW of Beatty, Nevada',
                lat: 37.1418,
                lon: -117.2618
            },
            {
                name: '87km ESE of Maneadero, B.C., MX',
                lat: 31.5236667,
                lon: -115.6743333
            },
            {
                name: '40km SW of Ferndale, California',
                lat: 40.3178333,
                lon: -124.6066667
            },
            {
                name: '68km ESE of Lakeview, Oregon',
                lat: 41.8833,
                lon: -119.6332
            },
            {
                name: '9km E of Challis, Idaho',
                lat: 44.5074,
                lon: -114.112
            },
            {
                name: '6km SSW of Kachina Village, Arizona',
                lat: 35.0423,
                lon: -111.7276
            },
            {
                name: '67km ESE of Lakeview, Oregon',
                lat: 41.9009,
                lon: -119.6224
            },
            {
                name: '13km S of Conway Springs, Kansas',
                lat: 37.2713,
                lon: -97.6206
            },
            {
                name: '68km ESE of Lakeview, Oregon',
                lat: 41.8805,
                lon: -119.6299
            },
            {
                name: '65km ESE of Lakeview, Oregon',
                lat: 41.9061,
                lon: -119.6573
            },
            {
                name: '67km ESE of Lakeview, Oregon',
                lat: 41.9078,
                lon: -119.6202
            },
            {
                name: '73km SE of San Felipe, Mexico',
                lat: 30.5637,
                lon: -114.2865
            },
            {
                name: '73km SE of San Felipe, Mexico',
                lat: 30.6303,
                lon: -114.2304
            },
            {
                name: '62km SSW of Puerto Penasco, Mexico',
                lat: 30.8316,
                lon: -113.8574
            },
            {
                name: '85km SE of San Felipe, Mexico',
                lat: 30.4209,
                lon: -114.2749
            },
            {
                name: '228km SSE of Estacion Coahuila, B.C., MX',
                lat: 30.3355,
                lon: -113.9963333
            },
            {
                name: '75km SE of San Felipe, Mexico',
                lat: 30.5825,
                lon: -114.2381
            },
            {
                name: '73km SE of San Felipe, Mexico',
                lat: 30.5697,
                lon: -114.2873
            },
            {
                name: 'South Napa',
                lat: 38.2151667,
                lon: -122.3123333
            },
            {
                name: '76km ENE of Santa Rosalia, Mexico',
                lat: 27.6814,
                lon: -111.6319
            },
            {
                name: '90km E of Loreto, Mexico',
                lat: 25.8955,
                lon: -110.4592
            },
            {
                name: '11km NE of Running Springs, CA',
                lat: 34.2823333,
                lon: -117.0266667
            },
            {
                name: '50km WNW of Lordsburg, New Mexico',
                lat: 32.5822,
                lon: -109.1682
            },
            {
                name: '15km NNW of Challis, Idaho',
                lat: 44.62,
                lon: -114.33
            },
            {
                name: '35km ENE of West Yellowstone, Montana',
                lat: 44.7721667,
                lon: -110.6846667
            },
            {
                name: '2km NW of Brea, CA',
                lat: 33.9325,
                lon: -117.9158333
            },
            {
                name: '98km SE of San Felipe, Mexico',
                lat: 30.44,
                lon: -114.0633
            },
            {
                name: '100km SE of San Felipe, Mexico',
                lat: 30.419,
                lon: -114.062
            },
            {
                name: '99km SE of San Felipe, Mexico',
                lat: 30.4075,
                lon: -114.0828
            },
            {
                name: '246km SSW of Avalon, California',
                lat: 31.3228,
                lon: -119.4094
            },
            {
                name: '29km SW of Naica, Mexico',
                lat: 27.6833,
                lon: -105.7118
            },
            {
                name: '6km NW of The Geysers, California',
                lat: 38.8135,
                lon: -122.8161667
            },
            {
                name: '71km NNE of Santa Rosalia, Mexico',
                lat: 27.8908,
                lon: -111.9607
            },
            {
                name: 'North Atlantic Ocean',
                lat: 25.7194,
                lon: -66.6056
            },
            {
                name: '43km NNE of Camalu, Mexico',
                lat: 31.22,
                lon: -115.908
            },
            {
                name: '9km ESE of Edmond, Oklahoma',
                lat: 35.6073,
                lon: -97.3863
            },
            {
                name: '80km WNW of La Libertad, Mexico',
                lat: 30.0798,
                lon: -113.5066
            },
            {
                name: '99km SW of Etchoropo, Mexico',
                lat: 26.0913,
                lon: -110.3209
            },
            {
                name: '53km WNW of Eureka, California',
                lat: 40.9835,
                lon: -124.7498333
            },
            {
                name: '16km WSW of Naica, Mexico',
                lat: 27.8173,
                lon: -105.642
            },
            {
                name: '20km W of Fort Washakie, Wyoming',
                lat: 42.9745,
                lon: -109.128
            },
            {
                name: '17km W of Naica, Mexico',
                lat: 27.8448,
                lon: -105.6603
            },
            {
                name: '20km WSW of Naica, Mexico',
                lat: 27.8013,
                lon: -105.6794
            },
            {
                name: '23km WSW of Naica, Mexico',
                lat: 27.7858,
                lon: -105.7104
            },
            {
                name: '124km SE of San Felipe, Mexico',
                lat: 30.055,
                lon: -114.161
            },
            {
                name: '6km W of Isla Vista, CA',
                lat: 34.4061667,
                lon: -119.9198333
            },
            {
                name: '1km NNW of Canyondam, CA',
                lat: 40.1795,
                lon: -121.0781667
            },
            {
                name: '10km WNW of Greenville, California',
                lat: 40.1918333,
                lon: -121.0595
            },
            {
                name: '19km NNE of Shawville, Canada',
                lat: 45.7568333,
                lon: -76.3533333
            },
            {
                name: '21km ESE of Anza, CA',
                lat: 33.5008333,
                lon: -116.4581667
            },
            {
                name: '72km W of Tonopah, Nevada',
                lat: 38.0222,
                lon: -118.0553
            },
            {
                name: 'Gulf of California',
                lat: 25.773,
                lon: -110.126
            },
            {
                name: 'Gulf of California',
                lat: 25.891,
                lon: -110.103
            },
            {
                name: 'Gulf of California',
                lat: 27.412,
                lon: -111.6
            },
            {
                name: 'off the west coast of Baja California',
                lat: 31.095,
                lon: -119.66
            },
            {
                name: 'Central California',
                lat: 36.3096667,
                lon: -120.856
            },
            {
                name: 'Maine',
                lat: 43.5973333,
                lon: -70.656
            },
            {
                name: 'offshore Baja California Sur, Mexico',
                lat: 25.162,
                lon: -113.055
            },
            {
                name: 'Gulf of California',
                lat: 25.127,
                lon: -109.574
            },
            {
                name: 'Baja California Sur, Mexico',
                lat: 24.84,
                lon: -110.25
            },
            {
                name: 'Baja California Sur, Mexico',
                lat: 24.627,
                lon: -110.25
            },
            {
                name: 'Baja California Sur, Mexico',
                lat: 24.666,
                lon: -110.173
            },
            {
                name: 'Northern California',
                lat: 39.1678333,
                lon: -123.1658333
            },
            {
                name: 'Gulf of California',
                lat: 30.357,
                lon: -113.997
            },
            {
                name: 'Gulf of California',
                lat: 30.545,
                lon: -113.909
            },
            {
                name: 'Gulf of California',
                lat: 30.551,
                lon: -113.89
            },
            {
                name: '5km NNE of Brawley, CA',
                lat: 33.0211667,
                lon: -115.5195
            },
            {
                name: '6km N of Brawley, CA',
                lat: 33.028,
                lon: -115.5305
            },
            {
                name: '4km NNW of Brawley, CA',
                lat: 33.0185,
                lon: -115.5403333
            },
            {
                name: '5km NW of Brawley, CA',
                lat: 33.0135,
                lon: -115.5591667
            },
            {
                name: '5km NNW of Brawley, CA',
                lat: 33.0171667,
                lon: -115.5536667
            },
            {
                name: '4km N of Brawley, CA',
                lat: 33.0158333,
                lon: -115.5363333
            },
            {
                name: 'Gulf of California',
                lat: 24.999,
                lon: -109.391
            },
            {
                name: '11km W of Alberto Oviedo Mota, B.C., MX',
                lat: 32.2131667,
                lon: -115.2886667
            },
            {
                name: '16km W of Alberto Oviedo Mota, B.C., MX',
                lat: 32.2071667,
                lon: -115.3431667
            },
            {
                name: 'eastern Texas',
                lat: 31.926,
                lon: -94.369
            },
            {
                name: 'Baja California Sur, Mexico',
                lat: 26.882,
                lon: -111.447
            },
            {
                name: 'Baja California, Mexico',
                lat: 28.714,
                lon: -113.07
            },
            {
                name: 'Baja California, Mexico',
                lat: 28.696,
                lon: -113.104
            },
            {
                name: 'Baja California, Mexico',
                lat: 28.723,
                lon: -113.146
            },
            {
                name: 'Baja California, Mexico',
                lat: 28.837,
                lon: -113.027
            },
            {
                name: 'Baja California, Mexico',
                lat: 28.682,
                lon: -113.084
            },
            {
                name: 'North Atlantic Ocean',
                lat: 41.927,
                lon: -65.762
            },
            {
                name: '5km SW of Alberto Oviedo Mota, B.C., MX',
                lat: 32.1991667,
                lon: -115.2085
            },
            {
                name: 'Northern California',
                lat: 41.1431667,
                lon: -123.7903333
            },
            {
                name: 'Baja California, Mexico',
                lat: 30.289,
                lon: -114.141
            },
            {
                name: 'Gulf of California',
                lat: 30.603,
                lon: -113.974
            },
            {
                name: 'Baja California Sur, Mexico',
                lat: 26.006,
                lon: -111.811
            },
            {
                name: 'Washington',
                lat: 48.4693333,
                lon: -119.6075
            },
            {
                name: 'Oklahoma',
                lat: 35.531,
                lon: -96.788
            },
            {
                name: 'Oklahoma',
                lat: 35.532,
                lon: -96.765
            },
            {
                name: 'Oklahoma',
                lat: 35.55,
                lon: -96.764
            },
            {
                name: 'Northern California',
                lat: 39.6055,
                lon: -120.4715
            },
            {
                name: 'southern Texas',
                lat: 28.865,
                lon: -98.079
            },
            {
                name: 'Bermuda region',
                lat: 31.157,
                lon: -65.065
            },
            {
                name: 'Nevada',
                lat: 38.8967,
                lon: -118.7657
            },
            {
                name: 'Gulf of California',
                lat: 28.094,
                lon: -112.141
            },
            {
                name: 'Durango, Mexico',
                lat: 25.013,
                lon: -106.715
            },
            {
                name: 'Central California',
                lat: 36.5843333,
                lon: -121.1808333
            },
            {
                name: '9km SSE of Louisa, Virginia',
                lat: 37.9468333,
                lon: -77.9671667
            },
            {
                name: '14km SSE of Louisa, Virginia',
                lat: 37.9096667,
                lon: -77.9363333
            },
            {
                name: 'Colorado',
                lat: 37.063,
                lon: -104.701
            },
            {
                name: 'Colorado',
                lat: 37.032,
                lon: -104.554
            },
            {
                name: 'Gulf of California',
                lat: 24.957,
                lon: -109.533
            },
            {
                name: 'Gulf of California',
                lat: 25.101,
                lon: -109.525
            },
            {
                name: 'Gulf of California',
                lat: 27.585,
                lon: -111.563
            },
            {
                name: 'Chihuahua, Mexico',
                lat: 30.758,
                lon: -105.751
            },
            {
                name: 'Baja California, Mexico',
                lat: 28.738,
                lon: -113.125
            },
            {
                name: 'Gulf of California',
                lat: 27.463,
                lon: -111.533
            },
            {
                name: 'Gulf of California',
                lat: 27.424,
                lon: -111.367
            },
            {
                name: 'Bermuda region',
                lat: 32.461,
                lon: -65.597
            },
            {
                name: '17km SW of Hawthorne, Nevada',
                lat: 38.3891,
                lon: -118.7433
            },
            {
                name: 'Gulf of California',
                lat: 24.993,
                lon: -109.682
            },
            {
                name: 'Gulf of California',
                lat: 25.295,
                lon: -110.065
            },
            {
                name: 'Gulf of California',
                lat: 25.399,
                lon: -109.687
            },
            {
                name: 'Gulf of California',
                lat: 25.324,
                lon: -109.773
            },
            {
                name: 'Gulf of California',
                lat: 25.33,
                lon: -109.521
            },
            {
                name: 'Gulf of California',
                lat: 25.298,
                lon: -109.767
            },
            {
                name: 'Gulf of California',
                lat: 25.236,
                lon: -109.815
            },
            {
                name: 'Gulf of California',
                lat: 25.331,
                lon: -109.465
            },
            {
                name: 'Gulf of California',
                lat: 25.391,
                lon: -109.719
            },
            {
                name: 'Gulf of California',
                lat: 25.379,
                lon: -109.695
            },
            {
                name: 'Gulf of California',
                lat: 25.25,
                lon: -109.544
            },
            {
                name: 'Gulf of California',
                lat: 25.317,
                lon: -109.738
            },
            {
                name: 'Gulf of California',
                lat: 25.209,
                lon: -109.82
            },
            {
                name: 'Gulf of California',
                lat: 25.165,
                lon: -109.894
            },
            {
                name: 'Gulf of California',
                lat: 25.138,
                lon: -109.793
            },
            {
                name: '4km NE of Greenbrier, Arkansas',
                lat: 35.2686667,
                lon: -92.3545
            },
            {
                name: '22km SSW of Alberto Oviedo Mota, B.C., MX',
                lat: 32.0468333,
                lon: -115.2518333
            },
            {
                name: '17km SSW of Estacion Coahuila, B.C., MX',
                lat: 32.047,
                lon: -115.0621667
            },
            {
                name: 'Baja California, Mexico',
                lat: 31.236,
                lon: -115.653
            },
            {
                name: 'Central California',
                lat: 36.7711667,
                lon: -121.4963333
            },
            {
                name: 'Gulf of California',
                lat: 27.01,
                lon: -111.414
            },
            {
                name: 'Gulf of California',
                lat: 27.149,
                lon: -111.546
            },
            {
                name: 'Gulf of California',
                lat: 25.912,
                lon: -110.558
            },
            {
                name: 'Utah',
                lat: 38.2471667,
                lon: -112.3451667
            },
            {
                name: '11km SW of Alberto Oviedo Mota, B.C., MX',
                lat: 32.1633333,
                lon: -115.2638333
            },
            {
                name: 'Gulf of California',
                lat: 25.433,
                lon: -109.904
            },
            {
                name: '14km N of Ocotillo, CA',
                lat: 32.8645,
                lon: -115.9973333
            },
            {
                name: 'Gulf of California',
                lat: 24.752,
                lon: -109.26
            },
            {
                name: 'Gulf of California',
                lat: 24.696,
                lon: -109.156
            },
            {
                name: 'Gulf of California',
                lat: 24.631,
                lon: -109.186
            },
            {
                name: 'Gulf of California',
                lat: 24.722,
                lon: -108.892
            },
            {
                name: '21km SSW of Estacion Coahuila, B.C., MX',
                lat: 32.0261667,
                lon: -115.1083333
            },
            {
                name: 'Baja California, Mexico',
                lat: 29.787,
                lon: -114.141
            },
            {
                name: '20km S of Alberto Oviedo Mota, B.C., MX',
                lat: 32.0485,
                lon: -115.1981667
            },
            {
                name: 'Wyoming',
                lat: 43.596,
                lon: -110.391
            },
            {
                name: '20km NNW of Borrego Springs, CA',
                lat: 33.4173333,
                lon: -116.4746667
            },
            {
                name: 'Ontario-Quebec border region, Canada',
                lat: 45.8835,
                lon: -75.475
            },
            {
                name: '8km ESE of Ocotillo, CA',
                lat: 32.705,
                lon: -115.9113333
            },
            {
                name: 'Gulf of California',
                lat: 25.498,
                lon: -109.829
            },
            {
                name: '18km WNW of Progreso, B.C., MX',
                lat: 32.6243333,
                lon: -115.7683333
            },
            {
                name: '17km WNW of Progreso, B.C., MX',
                lat: 32.6168333,
                lon: -115.7563333
            },
            {
                name: '18km ESE of Ocotillo, CA',
                lat: 32.6601667,
                lon: -115.8253333
            },
            {
                name: 'offshore Baja California Sur, Mexico',
                lat: 27.763,
                lon: -115.23
            },
            {
                name: 'offshore Baja California Sur, Mexico',
                lat: 27.674,
                lon: -115.191
            },
            {
                name: '18km ESE of Ocotillo, CA',
                lat: 32.6755,
                lon: -115.8101667
            },
            {
                name: '19km ESE of Ocotillo, CA',
                lat: 32.6815,
                lon: -115.7971667
            },
            {
                name: '12km WNW of Alberto Oviedo Mota, B.C., MX',
                lat: 32.2636667,
                lon: -115.2866667
            },
            {
                name: '14km ESE of Ocotillo, CA',
                lat: 32.6921667,
                lon: -115.8465
            },
            {
                name: '19km ESE of Ocotillo, CA',
                lat: 32.6595,
                lon: -115.8075
            },
            {
                name: 'Utah',
                lat: 41.7133333,
                lon: -111.094
            },
            {
                name: 'Utah',
                lat: 41.703,
                lon: -111.09
            },
            {
                name: '11km S of Estacion Coahuila, B.C., MX',
                lat: 32.096,
                lon: -115.0111667
            },
            {
                name: '20km WNW of Progreso, B.C., MX',
                lat: 32.6753333,
                lon: -115.7581667
            },
            {
                name: '9km SW of Alberto Oviedo Mota, B.C., MX',
                lat: 32.1818333,
                lon: -115.245
            },
            {
                name: '12km SW of Alberto Oviedo Mota, B.C., MX',
                lat: 32.1646667,
                lon: -115.2683333
            },
            {
                name: '19km ESE of Ocotillo, CA',
                lat: 32.6651667,
                lon: -115.8106667
            },
            {
                name: '40km S of Estacion Coahuila, B.C., MX',
                lat: 31.8315,
                lon: -115.0126667
            },
            {
                name: '18km W of Progreso, B.C., MX',
                lat: 32.5936667,
                lon: -115.7738333
            },
            {
                name: '7km WNW of Estacion Coahuila, B.C., MX',
                lat: 32.2151667,
                lon: -115.0715
            },
            {
                name: '21km ESE of Ocotillo, CA',
                lat: 32.6401667,
                lon: -115.8018333
            },
            {
                name: '19km ESE of Ocotillo, CA',
                lat: 32.6638333,
                lon: -115.8088333
            },
            {
                name: '20km ESE of Ocotillo, CA',
                lat: 32.6465,
                lon: -115.8055
            },
            {
                name: '13km SW of Delta, B.C., MX',
                lat: 32.2851667,
                lon: -115.3025
            },
            {
                name: '18km W of Progreso, B.C., MX',
                lat: 32.5933333,
                lon: -115.7733333
            },
            {
                name: '11km SSE of Alberto Oviedo Mota, B.C., MX',
                lat: 32.1445,
                lon: -115.1148333
            },
            {
                name: '27km SSW of Estacion Coahuila, B.C., MX',
                lat: 31.9788333,
                lon: -115.1341667
            },
            {
                name: '13km S of Progreso, B.C., MX',
                lat: 32.4623333,
                lon: -115.5978333
            },
            {
                name: '12km WNW of Alberto Oviedo Mota, B.C., MX',
                lat: 32.2661667,
                lon: -115.2925
            },
            {
                name: '11km W of Alberto Oviedo Mota, B.C., MX',
                lat: 32.2211667,
                lon: -115.2906667
            },
            {
                name: '9km SW of Delta, B.C., MX',
                lat: 32.3,
                lon: -115.2595
            },
            {
                name: '16km W of Alberto Oviedo Mota, B.C., MX',
                lat: 32.204,
                lon: -115.3328333
            },
            {
                name: '12km SSW of Estacion Coahuila, B.C., MX',
                lat: 32.0986667,
                lon: -115.0481667
            },
            {
                name: '15km SSW of Progreso, B.C., MX',
                lat: 32.4533333,
                lon: -115.632
            },
            {
                name: '12km SW of Delta, B.C., MX',
                lat: 32.2861667,
                lon: -115.2953333
            },
            {
                name: 'Baja California-Sonora border region, Mexico',
                lat: 31.276,
                lon: -114.049
            },
            {
                name: '49km SW of Ferndale, CA',
                lat: 40.32,
                lon: -124.733
            },
            {
                name: 'offshore Northern California',
                lat: 40.3198333,
                lon: -124.7333333
            },
            {
                name: '61km WSW of Ferndale, California',
                lat: 40.4123333,
                lon: -124.9613333
            },
            {
                name: 'offshore Northern California',
                lat: 40.652,
                lon: -124.6925
            },
            {
                name: '14km ESE of Puebla, B.C., MX',
                lat: 32.5323333,
                lon: -115.2081667
            },
            {
                name: '12km N of Delta, B.C., MX',
                lat: 32.464,
                lon: -115.1891667
            },
            {
                name: 'Baja California, Mexico',
                lat: 28.939,
                lon: -113.125
            },
            {
                name: 'Gulf of California',
                lat: 26.291,
                lon: -110.559
            },
            {
                name: '26km SSE of Trona, CA',
                lat: 35.5485,
                lon: -117.2745
            },
            {
                name: 'Sinaloa, Mexico',
                lat: 25.512,
                lon: -107.567
            },
            {
                name: 'Gulf of California',
                lat: 30.045,
                lon: -113.931
            },
            {
                name: 'Baja California, Mexico',
                lat: 30.301,
                lon: -114.11
            },
            {
                name: 'Baja California, Mexico',
                lat: 30.061,
                lon: -114.073
            },
            {
                name: 'Baja California, Mexico',
                lat: 30.07,
                lon: -114.166
            },
            {
                name: 'Gulf of California',
                lat: 30.284,
                lon: -113.781
            },
            {
                name: 'Baja California, Mexico',
                lat: 30.304,
                lon: -114.031
            },
            {
                name: '18km NE of Olancha, CA',
                lat: 36.39,
                lon: -117.8635
            },
            {
                name: '18km NE of Olancha, CA',
                lat: 36.391,
                lon: -117.8608333
            },
            {
                name: '17km NE of Olancha, CA',
                lat: 36.3863333,
                lon: -117.8681667
            },
            {
                name: '18km NE of Olancha, CA',
                lat: 36.391,
                lon: -117.8638333
            },
            {
                name: '18km NE of Olancha, CA',
                lat: 36.3878333,
                lon: -117.8586667
            },
            {
                name: '7km WNW of Delta, B.C., MX',
                lat: 32.3706667,
                lon: -115.2611667
            },
            {
                name: 'Baja California, Mexico',
                lat: 29.446,
                lon: -113.599
            },
            {
                name: 'offshore Northern California',
                lat: 40.3098333,
                lon: -124.637
            },
            {
                name: 'Baja California, Mexico',
                lat: 29.615,
                lon: -113.789
            },
            {
                name: 'Baja California, Mexico',
                lat: 29.31,
                lon: -113.728
            },
            {
                name: 'Baja California, Mexico',
                lat: 28.977,
                lon: -113.019
            },
            {
                name: 'Baja California, Mexico',
                lat: 29.045,
                lon: -113.123
            },
            {
                name: 'Sonora, Mexico',
                lat: 29.039,
                lon: -112.903
            },
            {
                name: 'Gulf of California',
                lat: 28.904,
                lon: -112.997
            },
            {
                name: 'Gulf of California',
                lat: 24.978,
                lon: -109.425
            },
            {
                name: 'Durango, Mexico',
                lat: 25.043,
                lon: -106.679
            },
            {
                name: 'Gulf of California',
                lat: 25.226,
                lon: -109.76
            },
            {
                name: 'Gulf of California',
                lat: 25.131,
                lon: -109.754
            },
            {
                name: 'Gulf of California',
                lat: 25.389,
                lon: -109.687
            },
            {
                name: '20km NE of Olancha, CA',
                lat: 36.3961667,
                lon: -117.8376667
            },
            {
                name: '2km E of Lennox, CA',
                lat: 33.9376667,
                lon: -118.3356667
            },
            {
                name: '4km S of Bombay Beach, CA',
                lat: 33.3171667,
                lon: -115.7281667
            },
            {
                name: 'Baja California, Mexico',
                lat: 30.104,
                lon: -114.348
            },
            {
                name: 'Seattle-Tacoma urban area, Washington',
                lat: 47.7865,
                lon: -122.5846667
            },
            {
                name: '4km ESE of Progreso, B.C., MX',
                lat: 32.5681667,
                lon: -115.5428333
            },
            {
                name: '3km NE of East Quincy, California',
                lat: 39.9598333,
                lon: -120.8688333
            },
            {
                name: '26km WNW of Ludlow, CA',
                lat: 34.8133333,
                lon: -116.4188333
            },
            {
                name: '13km WSW of Delta, B.C., MX',
                lat: 32.3288333,
                lon: -115.3318333
            },
            {
                name: 'offshore Northern California',
                lat: 40.3138333,
                lon: -124.6026667
            },
            {
                name: 'Gulf of California',
                lat: 25.687,
                lon: -110.243
            },
            {
                name: 'Gulf of California',
                lat: 26.646,
                lon: -110.927
            },
            {
                name: 'offshore Northern California',
                lat: 40.3368333,
                lon: -124.6288333
            },
            {
                name: '4km WSW of Delta, B.C., MX',
                lat: 32.3468333,
                lon: -115.2295
            },
            {
                name: 'offshore Northern California',
                lat: 41.1885,
                lon: -124.216
            },
            {
                name: 'Gulf of California',
                lat: 26.64,
                lon: -111
            },
            {
                name: '5km S of Chino Hills, CA',
                lat: 33.9485,
                lon: -117.7663333
            },
            {
                name: 'Baja California, Mexico',
                lat: 30.25,
                lon: -114.3
            },
            {
                name: 'Gulf of California',
                lat: 24.803,
                lon: -109.577
            },
            {
                name: 'Northern California',
                lat: 40.8358333,
                lon: -123.4968333
            },
            {
                name: '27km SE of Smith Valley, NV',
                lat: 38.6103333,
                lon: -119.1331667
            },
            {
                name: '1km NW of Mogul, Nevada',
                lat: 39.5231,
                lon: -119.9393
            },
            {
                name: '0km N of Mogul, Nevada',
                lat: 39.5212,
                lon: -119.9279
            },
            {
                name: '10km WNW of Mount Carmel, Illinois',
                lat: 38.4585,
                lon: -87.8691667
            },
            {
                name: '11km WNW of Mount Carmel, Illinois',
                lat: 38.4515,
                lon: -87.8861667
            },
            {
                name: '3km ENE of Wells, Nevada',
                lat: 41.1279,
                lon: -114.9215
            },
            {
                name: '8km WNW of Delta, B.C., MX',
                lat: 32.3901667,
                lon: -115.2698333
            },
            {
                name: '11km NW of Delta, B.C., MX',
                lat: 32.421,
                lon: -115.2853333
            },
            {
                name: '4km NNE of Wells, Nevada',
                lat: 41.1463,
                lon: -114.9313
            },
            {
                name: '10km ENE of Wells, Nevada',
                lat: 41.137,
                lon: -114.8398
            },
            {
                name: '6km E of Wells, Nevada',
                lat: 41.1165,
                lon: -114.9011
            },
            {
                name: '8km ENE of Wells, Nevada',
                lat: 41.1444,
                lon: -114.8721
            },
            {
                name: '13km NW of Delta, B.C., MX',
                lat: 32.4261667,
                lon: -115.3063333
            },
            {
                name: '14km NW of Delta, B.C., MX',
                lat: 32.4325,
                lon: -115.313
            },
            {
                name: 'Baja California, Mexico',
                lat: 29.785,
                lon: -114.063
            },
            {
                name: 'Baja California, Mexico',
                lat: 29.199,
                lon: -114.505
            },
            {
                name: '13km SSE of Puebla, B.C., MX',
                lat: 32.4475,
                lon: -115.3175
            },
            {
                name: '7km WSW of Delta, B.C., MX',
                lat: 32.3271667,
                lon: -115.2568333
            },
            {
                name: '8km W of Delta, B.C., MX',
                lat: 32.3595,
                lon: -115.2773333
            },
            {
                name: 'Northern California',
                lat: 40.1776667,
                lon: -122.7036667
            },
            {
                name: 'Northern California',
                lat: 40.1671667,
                lon: -122.7593333
            },
            {
                name: 'off the east coast of the United States',
                lat: 27.679,
                lon: -71.076
            },
            {
                name: 'San Francisco Bay area, California',
                lat: 37.4335,
                lon: -121.7743333
            },
            {
                name: 'Gulf of California',
                lat: 24.772,
                lon: -109.732
            },
            {
                name: '13km NE of Trabuco Canyon, CA',
                lat: 33.7321667,
                lon: -117.477
            },
            {
                name: 'Gulf of California',
                lat: 24.615,
                lon: -109.824
            },
            {
                name: 'Gulf of California',
                lat: 24.606,
                lon: -109.905
            },
            {
                name: 'Baja California Sur, Mexico',
                lat: 24.773,
                lon: -110.232
            },
            {
                name: 'Gulf of California',
                lat: 24.697,
                lon: -109.941
            },
            {
                name: 'Gulf of California',
                lat: 24.902,
                lon: -109.689
            },
            {
                name: 'Gulf of California',
                lat: 24.743,
                lon: -109.671
            },
            {
                name: '5km NNW of Chatsworth, CA',
                lat: 34.2995,
                lon: -118.6195
            },
            {
                name: '22km NE of Caliente, NV',
                lat: 37.761,
                lon: -114.339
            },
            {
                name: 'offshore Northern California',
                lat: 41.1155,
                lon: -124.8245
            },
            {
                name: 'Central California',
                lat: 37.5375,
                lon: -118.864
            },
            {
                name: 'offshore Northern California',
                lat: 40.3841667,
                lon: -124.9553333
            },
            {
                name: 'Northern California',
                lat: 39.4645,
                lon: -123.1073333
            },
            {
                name: 'Gulf of California',
                lat: 25.497,
                lon: -109.633
            },
            {
                name: 'Gulf of California',
                lat: 25.423,
                lon: -109.707
            },
            {
                name: 'Gulf of California',
                lat: 26.261,
                lon: -110.537
            },
            {
                name: '22km NNW of Bridgeport, California',
                lat: 38.4293333,
                lon: -119.3606667
            },
            {
                name: 'Gulf of California',
                lat: 26.003,
                lon: -110.248
            },
            {
                name: 'Gulf of California',
                lat: 25.981,
                lon: -110.46
            },
            {
                name: '52km W of Ferndale, CA',
                lat: 40.642,
                lon: -124.87
            },
            {
                name: 'offshore Northern California',
                lat: 40.6428333,
                lon: -124.8628333
            },
            {
                name: 'Gulf of California',
                lat: 26.029,
                lon: -110.613
            },
            {
                name: 'Gulf of California',
                lat: 26.146,
                lon: -110.421
            },
            {
                name: 'Gulf of California',
                lat: 26.002,
                lon: -110.461
            },
            {
                name: 'Gulf of California',
                lat: 25.988,
                lon: -110.495
            },
            {
                name: 'Gulf of California',
                lat: 25.955,
                lon: -110.522
            },
            {
                name: 'Gulf of California',
                lat: 25.974,
                lon: -110.352
            },
            {
                name: 'Baja California, Mexico',
                lat: 30.493,
                lon: -114.086
            },
            {
                name: 'Gulf of California',
                lat: 27.593,
                lon: -111.295
            },
            {
                name: 'offshore Baja California Sur, Mexico',
                lat: 26.716,
                lon: -114.199
            },
            {
                name: 'offshore Baja California Sur, Mexico',
                lat: 26.786,
                lon: -114.198
            },
            {
                name: 'offshore Baja California Sur, Mexico',
                lat: 26.728,
                lon: -114.161
            },
            {
                name: '8km SW of Ocotillo, CA',
                lat: 32.676,
                lon: -116.0481667
            },
            {
                name: 'Northern California',
                lat: 38.8666667,
                lon: -122.7873333
            },
            {
                name: 'Washington',
                lat: 46.8498333,
                lon: -121.6001667
            },
            {
                name: 'Gulf of Mexico',
                lat: 26.319,
                lon: -86.606
            },
            {
                name: 'Northern California',
                lat: 38.3635,
                lon: -122.5886667
            },
            {
                name: 'Baja California Sur, Mexico',
                lat: 26.864,
                lon: -111.209
            },
            {
                name: 'offshore Northern California',
                lat: 40.2806667,
                lon: -124.4331667
            },
            {
                name: 'Baja California Sur, Mexico',
                lat: 26.698,
                lon: -111.227
            },
            {
                name: 'Baja California Sur, Mexico',
                lat: 26.779,
                lon: -111.089
            },
            {
                name: 'Baja California Sur, Mexico',
                lat: 26.752,
                lon: -111.206
            },
            {
                name: '6km SSW of Delta, B.C., MX',
                lat: 32.3066667,
                lon: -115.2278333
            },
            {
                name: 'Northern California',
                lat: 38.8171667,
                lon: -122.8138333
            },
            {
                name: 'Baja California, Mexico',
                lat: 30.199,
                lon: -114.332
            },
            {
                name: 'Baja California, Mexico',
                lat: 29.809,
                lon: -114.588
            },
            {
                name: 'offshore Northern California',
                lat: 40.2778333,
                lon: -124.449
            },
            {
                name: 'Gulf of Mexico',
                lat: 27.828,
                lon: -90.21
            },
            {
                name: 'Gulf of California',
                lat: 28.003,
                lon: -112.468
            },
            {
                name: 'Gulf of California',
                lat: 28.164,
                lon: -112.117
            },
            {
                name: 'Gulf of California',
                lat: 28.001,
                lon: -112.255
            },
            {
                name: 'Baja California Sur, Mexico',
                lat: 27.953,
                lon: -112.135
            },
            {
                name: 'Baja California Sur, Mexico',
                lat: 27.959,
                lon: -112.143
            },
            {
                name: 'western Montana',
                lat: 44.874,
                lon: -113.399
            },
            {
                name: '44km SSE of San Clemente Is. (SE tip), CA',
                lat: 32.4545,
                lon: -118.1633333
            },
            {
                name: '14km NW of Grapevine, CA',
                lat: 35.0433333,
                lon: -119.0143333
            },
            {
                name: '13km WNW of Calipatria, CA',
                lat: 33.1533333,
                lon: -115.6463333
            },
            {
                name: '12km WNW of Calipatria, CA',
                lat: 33.1748333,
                lon: -115.6311667
            },
            {
                name: '10km SW of Niland, CA',
                lat: 33.1896667,
                lon: -115.603
            },
            {
                name: '12km WNW of Calipatria, CA',
                lat: 33.1663333,
                lon: -115.6351667
            },
            {
                name: 'New Mexico',
                lat: 36.947,
                lon: -104.833
            },
            {
                name: 'western Montana',
                lat: 45.365,
                lon: -112.615
            },
            {
                name: 'offshore Baja California Sur, Mexico',
                lat: 24.821,
                lon: -112.206
            },
            {
                name: '7km N of Tahoe Vista, California',
                lat: 39.305,
                lon: -120.0928333
            },
            {
                name: '4km NE of Yucaipa, CA',
                lat: 34.058,
                lon: -117.0113333
            },
            {
                name: '10km ESE of Anza, CA',
                lat: 33.5325,
                lon: -116.5666667
            },
            {
                name: 'Baja California, Mexico',
                lat: 30.253,
                lon: -114.132
            },
            {
                name: '20km ESE of Maricopa, CA',
                lat: 35.0223333,
                lon: -119.191
            },
            {
                name: 'offshore Northern California',
                lat: 40.3706667,
                lon: -124.972
            },
            {
                name: 'St. Lawrence Valley region, Quebec, Canada',
                lat: 47.75,
                lon: -69.73
            },
            {
                name: 'Arizona',
                lat: 34.715,
                lon: -110.97
            },
            {
                name: 'Gulf of California',
                lat: 25.669,
                lon: -109.97
            },
            {
                name: '45km NE of Mammoth Lakes, California',
                lat: 37.9788333,
                lon: -118.6588333
            },
            {
                name: 'Central California',
                lat: 35.988,
                lon: -120.5378333
            },
            {
                name: '25km SSW of Bodfish, California',
                lat: 35.3898333,
                lon: -118.6235
            },
            {
                name: 'Central California',
                lat: 35.9536667,
                lon: -120.5021667
            },
            {
                name: 'Central California',
                lat: 35.8045,
                lon: -120.3498333
            },
            {
                name: '18km N of Shandon, California',
                lat: 35.8181667,
                lon: -120.366
            },
            {
                name: 'Gulf of California',
                lat: 28.565,
                lon: -112.725
            },
            {
                name: 'Central California',
                lat: 38.0276667,
                lon: -118.6425
            },
            {
                name: '49km NE of Mammoth Lakes, California',
                lat: 38.0233333,
                lon: -118.658
            },
            {
                name: '47km NNE of Mammoth Lakes, California',
                lat: 38.0095,
                lon: -118.6785
            },
            {
                name: 'offshore Baja California, Mexico',
                lat: 29.519,
                lon: -116.554
            },
            {
                name: '8km N of Soledad, CA',
                lat: 36.493,
                lon: -121.3134995
            },
            {
                name: 'Baja California, Mexico',
                lat: 28.218,
                lon: -113.12
            },
            {
                name: 'Baja California, Mexico',
                lat: 29.861,
                lon: -114.047
            },
            {
                name: 'offshore Oregon',
                lat: 44.6645,
                lon: -124.3003333
            },
            {
                name: 'offshore Oregon',
                lat: 44.3338333,
                lon: -124.4888333
            },
            {
                name: 'Gulf of California',
                lat: 25.079,
                lon: -109.277
            },
            {
                name: '67km SE of San Clemente Is. (SE tip), CA',
                lat: 32.3428333,
                lon: -117.9141667
            },
            {
                name: 'Nevada',
                lat: 37.2798,
                lon: -114.84
            },
            {
                name: 'Nuevo Leon, Mexico',
                lat: 25.172,
                lon: -99.532
            },
            {
                name: 'Central California',
                lat: 35.7306667,
                lon: -121.075
            },
            {
                name: 'Northern California',
                lat: 38.8366667,
                lon: -122.7671667
            },
            {
                name: 'offshore Baja California Sur, Mexico',
                lat: 24.814,
                lon: -112.51
            },
            {
                name: 'offshore Baja California Sur, Mexico',
                lat: 24.897,
                lon: -112.393
            },
            {
                name: 'Wyoming',
                lat: 43.571,
                lon: -110.383
            },
            {
                name: 'Central California',
                lat: 35.6456667,
                lon: -121.0536667
            },
            {
                name: '10km N of Cambria, CA',
                lat: 35.6511667,
                lon: -121.0716667
            },
            {
                name: 'Central California',
                lat: 35.6318333,
                lon: -121.0551667
            },
            {
                name: 'Central California',
                lat: 35.7005,
                lon: -121.1005
            },
            {
                name: '16km E of Weber City, Virginia',
                lat: 37.774,
                lon: -78.1
            },
            {
                name: 'Baja California, Mexico',
                lat: 28.872,
                lon: -113.183
            },
            {
                name: 'Nevada',
                lat: 40.729,
                lon: -115.148
            },
            {
                name: 'Baja California, Mexico',
                lat: 28.967,
                lon: -113.219
            },
            {
                name: 'Northern California',
                lat: 39.2058333,
                lon: -120.0303333
            },
            {
                name: 'Baja California, Mexico',
                lat: 28.15,
                lon: -113.223
            },
            {
                name: '9km NE of Fort Payne, Alabama',
                lat: 34.4938333,
                lon: -85.6298333
            },
            {
                name: 'Olympic Peninsula, Washington',
                lat: 47.6705,
                lon: -123.25
            },
            {
                name: 'Gulf of California',
                lat: 25.031,
                lon: -109.429
            },
            {
                name: 'Gulf of California',
                lat: 26.307,
                lon: -110.638
            },
            {
                name: 'Gulf of California',
                lat: 26.403,
                lon: -110.41
            },
            {
                name: 'Gulf of California',
                lat: 26.556,
                lon: -110.587
            },
            {
                name: '25km NNW of Twentynine Palms, CA',
                lat: 34.3591667,
                lon: -116.1331667
            },
            {
                name: '6km N of Big Bear City, CA',
                lat: 34.3155,
                lon: -116.8445
            },
            {
                name: '5km N of Big Bear City, CA',
                lat: 34.3096667,
                lon: -116.8503333
            },
            {
                name: '6km N of Big Bear City, CA',
                lat: 34.312,
                lon: -116.8448333
            },
            {
                name: '74km SSW of Alberto Oviedo Mota, B.C., MX',
                lat: 31.6281667,
                lon: -115.5106667
            },
            {
                name: '20km NE of Arvin, CA',
                lat: 35.3175,
                lon: -118.6538333
            },
            {
                name: '44km SSW of Progreso, B.C., MX',
                lat: 32.2316667,
                lon: -115.7981667
            },
            {
                name: '13km NW of Ludlow, CA',
                lat: 34.8026667,
                lon: -116.2665
            },
            {
                name: '4km NE of Yorba Linda, CA',
                lat: 33.9123333,
                lon: -117.7833333
            },
            {
                name: 'British Columbia, Canada',
                lat: 49.96,
                lon: -120.29
            },
            {
                name: 'Mount Hood area, Oregon',
                lat: 45.3348333,
                lon: -121.6863333
            },
            {
                name: '14km ENE of Mount Vernon, Indiana',
                lat: 38.0001667,
                lon: -87.7563333
            },
            {
                name: 'offshore Northern California',
                lat: 40.8098333,
                lon: -124.552
            },
            {
                name: 'Northern California',
                lat: 36.9668333,
                lon: -121.5983333
            },
            {
                name: 'offshore Northern California',
                lat: 40.6021667,
                lon: -124.4496667
            },
            {
                name: 'New York',
                lat: 44.5123333,
                lon: -73.6973333
            },
            {
                name: 'Gulf of California',
                lat: 25.762,
                lon: -109.991
            },
            {
                name: 'Baja California, Mexico',
                lat: 30.216,
                lon: -114.011
            },
            {
                name: '33km NW of Santa Barbara Is., CA',
                lat: 33.666,
                lon: -119.33
            },
            {
                name: '13km WSW of Delta, B.C., MX',
                lat: 32.3188333,
                lon: -115.3215
            },
            {
                name: 'off the east coast of the United States',
                lat: 28.279,
                lon: -69.566
            },
            {
                name: 'Central California',
                lat: 36.6401667,
                lon: -121.251
            },
            {
                name: '21km S of Estacion Coahuila, B.C., MX',
                lat: 32.0035,
                lon: -115.01
            },
            {
                name: '22km S of Estacion Coahuila, B.C., MX',
                lat: 31.9976667,
                lon: -115.0016667
            },
            {
                name: '16km ESE of Anza, CA',
                lat: 33.5083333,
                lon: -116.5143333
            },
            {
                name: 'Colorado',
                lat: 37.143,
                lon: -104.618
            },
            {
                name: 'Gulf of California',
                lat: 25.47,
                lon: -109.605
            },
            {
                name: 'Northern California',
                lat: 39.8111667,
                lon: -120.6166667
            },
            {
                name: 'Gulf of California',
                lat: 25.865,
                lon: -109.821
            },
            {
                name: '7km ESE of Coso Junction, CA',
                lat: 36.017,
                lon: -117.8823333
            },
            {
                name: '7km ESE of Coso Junction, CA',
                lat: 36.0163333,
                lon: -117.8743333
            },
            {
                name: 'Olympic Peninsula, Washington',
                lat: 47.1675,
                lon: -123.5025
            },
            {
                name: 'southern Idaho',
                lat: 42.925,
                lon: -111.395
            },
            {
                name: 'Puget Sound region, Washington',
                lat: 47.149,
                lon: -122.7266667
            },
            {
                name: '6km NNW of Big Bear Lake, CA',
                lat: 34.2895,
                lon: -116.9458333
            },
            {
                name: 'Gulf of California',
                lat: 26.074,
                lon: -110.315
            },
            {
                name: 'Gulf of California',
                lat: 30.339,
                lon: -113.778
            },
            {
                name: 'Baja California, Mexico',
                lat: 28.19,
                lon: -112.987
            },
            {
                name: 'Gulf of California',
                lat: 24.982,
                lon: -109.456
            },
            {
                name: 'Gulf of California',
                lat: 25.185,
                lon: -109.458
            },
            {
                name: 'Northern California',
                lat: 38.3788333,
                lon: -122.4133333
            },
            {
                name: '14km WNW of Ludlow, CA',
                lat: 34.7821667,
                lon: -116.2968333
            },
            {
                name: 'Saltillo urban area, Coahuila, Mexico',
                lat: 25.45,
                lon: -100.999
            },
            {
                name: '7km NE of Imperial, CA',
                lat: 32.8896667,
                lon: -115.5091667
            },
            {
                name: 'offshore Northern California',
                lat: 40.3283333,
                lon: -124.6921667
            },
            {
                name: '14km SSE of Alberto Oviedo Mota, B.C., MX',
                lat: 32.111,
                lon: -115.119
            },
            {
                name: '11km SW of Estacion Coahuila, B.C., MX',
                lat: 32.1306667,
                lon: -115.0958333
            },
            {
                name: 'Gulf of California',
                lat: 27.551,
                lon: -111.303
            },
            {
                name: 'British Columbia, Canada',
                lat: 49.17,
                lon: -114.03
            },
            {
                name: 'Northern California',
                lat: 38.7693333,
                lon: -122.9138333
            },
            {
                name: 'southern Quebec, Canada',
                lat: 46.888,
                lon: -78.93
            }
            ]
        }]
    });
})();
