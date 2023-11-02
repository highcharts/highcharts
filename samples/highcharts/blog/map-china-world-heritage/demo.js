(async () => {
    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());
    const geojson = Highcharts.topo2geo(topology);

    // Find the geometry for one specific feature
    const countryGeometry = geojson.features.find(
        f => f.properties.name === 'China'
    ).geometry;

    // Create the chart
    Highcharts.mapChart('container', {
        chart: {
            margin: 0
        },

        title: {
            text: ''
        },

        subtitle: {
            text: ''
        },

        navigation: {
            buttonOptions: {
                align: 'left',
                theme: {
                    stroke: '#e6e6e6'
                }
            }
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                alignTo: 'spacingBox'
            }
        },

        mapView: {
            fitToGeometry: countryGeometry
        },

        tooltip: {
            useHTML: true,
            headerFormat: '{point.point.name}',
            pointFormat: '<br/><img src="{point.image}"/>'
        },

        legend: {
            enabled: true,
            title: {
                text: 'World heritage sites in China'
            },
            align: 'left',
            backgroundColor: 'rgba(255,255,255,0.8)',
            borderColor: '#e6e6e6',
            borderWidth: 1,
            borderRadius: 2,
            itemMarginBottom: 5
        },

        plotOptions: {
            mappoint: {
                dataLabels: {
                    enabled: false
                }
            }
        },

        series: [
            {
                type: 'tiledwebmap',
                name: 'Basemap Tiles',
                provider: {
                    type: 'OpenStreetMap'
                },
                showInLegend: false
            },
            {
                type: 'mappoint',
                name: 'Cultural',
                color: '#DE3163',
                marker: {
                    symbol: 'square'
                },
                data: [
                    {
                        name: 'The Great Wall',
                        image: 'https://whc.unesco.org/uploads/sites/site_438.jpg',
                        lon: 116.08333,
                        lat: 40.41667
                    },
                    {
                        name:
              'Imperial Palaces of the Ming and Qing Dynasties in Beijing and Shenyang',
                        image: 'https://whc.unesco.org/uploads/sites/site_439.jpg',
                        lon: 123.4469444,
                        lat: 41.79416667
                    },
                    {
                        name: 'Mogao Caves',
                        image: 'https://whc.unesco.org/uploads/sites/site_440.jpg',
                        lon: 94.81667,
                        lat: 40.13333
                    },
                    {
                        name: 'Mausoleum of the First Qin Emperor',
                        image: 'https://whc.unesco.org/uploads/sites/site_441.jpg',
                        lon: 109.259951,
                        lat: 34.381311
                    },
                    {
                        name: 'Peking Man Site at Zhoukoudian',
                        image: 'https://whc.unesco.org/uploads/sites/site_449.jpg',
                        lon: 115.922702,
                        lat: 39.689449
                    },
                    {
                        name: 'Mountain Resort and its Outlying Temples, Chengde',
                        image: 'https://whc.unesco.org/uploads/sites/site_703.jpg',
                        lon: 117.93833,
                        lat: 40.98694
                    },
                    {
                        name:
              'Temple and Cemetery of Confucius and the Kong Family Mansion in Qufu',
                        image: 'https://whc.unesco.org/uploads/sites/site_704.jpg',
                        lon: 116.994561,
                        lat: 35.613215
                    },
                    {
                        name: 'Ancient Building Complex in the Wudang Mountains',
                        image: 'https://whc.unesco.org/uploads/sites/site_705.jpg',
                        lon: 111,
                        lat: 32.46667
                    },
                    {
                        name: 'Historic Ensemble of the Potala Palace, Lhasa',
                        image: 'https://whc.unesco.org/uploads/sites/site_707.jpg',
                        lon: 91.11717,
                        lat: 29.65792
                    },
                    {
                        name: 'Lushan National Park',
                        image: 'https://whc.unesco.org/uploads/sites/site_778.jpg',
                        lon: 115.8666667,
                        lat: 29.43333333
                    },
                    {
                        name: 'Ancient City of Ping Yao',
                        image: 'https://whc.unesco.org/uploads/sites/site_812.jpg',
                        lon: 112.15444,
                        lat: 37.20139
                    },
                    {
                        name: 'Classical Gardens of Suzhou',
                        image: 'https://whc.unesco.org/uploads/sites/site_813.jpg',
                        lon: 120.45,
                        lat: 31.31666667
                    },
                    {
                        name: 'Summer Palace, an Imperial Garden in Beijing',
                        image: 'https://whc.unesco.org/uploads/sites/site_880.jpg',
                        lon: 116.1411111,
                        lat: 39.91055556
                    },
                    {
                        name: 'Temple of Heaven: an Imperial Sacrificial Altar in Beijing',
                        image: 'https://whc.unesco.org/uploads/sites/site_881.jpg',
                        lon: 116.4447222,
                        lat: 39.84555556
                    },
                    {
                        name: 'Dazu Rock Carvings',
                        image: 'https://whc.unesco.org/uploads/sites/site_912.jpg',
                        lon: 105.705,
                        lat: 29.70111
                    },
                    {
                        name: 'Mount Qingcheng and the Dujiangyan Irrigation System',
                        image: 'https://whc.unesco.org/uploads/sites/site_1001.jpg',
                        lon: 103.60528,
                        lat: 31.00167
                    },
                    {
                        name: 'Ancient Villages in Southern Anhui – Xidi and Hongcun',
                        image: 'https://whc.unesco.org/uploads/sites/site_1002.jpg',
                        lon: 117.9875,
                        lat: 29.90444444
                    },
                    {
                        name: 'Longmen Grottoes',
                        image: 'https://whc.unesco.org/uploads/sites/site_1003.jpg',
                        lon: 112.4666667,
                        lat: 34.46666667
                    },
                    {
                        name: 'Imperial Tombs of the Ming and Qing Dynasties',
                        image: 'https://whc.unesco.org/uploads/sites/site_1004.jpg',
                        lon: 124.7938889,
                        lat: 41.70722222
                    },
                    {
                        name: 'Yungang Grottoes',
                        image: 'https://whc.unesco.org/uploads/sites/site_1039.jpg',
                        lon: 113.12222,
                        lat: 40.10972
                    },
                    {
                        name: 'Historic Centre of Macao',
                        image: 'https://whc.unesco.org/uploads/sites/site_1110.jpg',
                        lon: 113.5364611111,
                        lat: 22.1912919444
                    },
                    {
                        name: 'Yin Xu',
                        image: 'https://whc.unesco.org/uploads/sites/site_1114.jpg',
                        lon: 114.3138888888,
                        lat: 36.1266666666
                    },
                    {
                        name: 'Capital Cities and Tombs of the Ancient Koguryo Kingdom',
                        image: 'https://whc.unesco.org/uploads/sites/site_1135.jpg',
                        lon: 126.1872222,
                        lat: 41.15694444
                    },
                    {
                        name: 'Kaiping Diaolou and Villages',
                        image: 'https://whc.unesco.org/uploads/sites/site_1112.jpg',
                        lon: 112.5658611111,
                        lat: 22.2855194444
                    },
                    {
                        name: 'Fujian Tulou',
                        image: 'https://whc.unesco.org/uploads/sites/site_1113.jpg',
                        lon: 117.6858333333,
                        lat: 25.0230555556
                    },
                    {
                        name: 'Mount Wutai',
                        image: 'https://whc.unesco.org/uploads/sites/site_1279.jpg',
                        lon: 113.5633333333,
                        lat: 39.0305555556
                    },
                    {
                        name:
              'Historic Monuments of Dengfeng in “The Centre of Heaven and Earth”',
                        image: 'https://whc.unesco.org/uploads/sites/site_1305.jpg',
                        lon: 113.0677194444,
                        lat: 34.4587472222
                    },
                    {
                        name: 'West Lake Cultural Landscape of Hangzhou',
                        image: 'https://whc.unesco.org/uploads/sites/site_1334.jpg',
                        lon: 120.1408333333,
                        lat: 30.2375
                    },
                    {
                        name: 'Site of Xanadu',
                        image: 'https://whc.unesco.org/uploads/sites/site_1389.jpg',
                        lon: 116.1851277778,
                        lat: 42.358
                    },
                    {
                        name: 'Cultural Landscape of Honghe Hani Rice Terraces',
                        image: 'https://whc.unesco.org/uploads/sites/site_1111.jpg',
                        lon: 102.7799805556,
                        lat: 23.0932777778
                    },
                    {
                        name: 'Old Town of Lijiang',
                        image: 'https://whc.unesco.org/uploads/sites/site_811.jpg',
                        lon: 100.23333,
                        lat: 26.86667
                    },
                    {
                        name: 'Tusi Sites',
                        image: 'https://whc.unesco.org/uploads/sites/site_1474.jpg',
                        lon: 109.9669444444,
                        lat: 28.9986111111
                    },
                    {
                        name: 'Zuojiang Huashan Rock Art Cultural Landscape',
                        image: 'https://whc.unesco.org/uploads/sites/site_1508.jpg',
                        lon: 107.0230555556,
                        lat: 22.2555555556
                    },
                    {
                        name: 'Kulangsu, a Historic International Settlement',
                        image: 'https://whc.unesco.org/uploads/sites/site_1541.jpg',
                        lon: 118.0619444444,
                        lat: 24.4475
                    },
                    {
                        name: 'The Grand Canal',
                        image: 'https://whc.unesco.org/uploads/sites/site_1443.jpg',
                        lon: 112.4683333333,
                        lat: 34.6938888889
                    },
                    {
                        name: 'Archaeological Ruins of Liangzhu City',
                        image: 'https://whc.unesco.org/uploads/sites/site_1592.jpg',
                        lon: 119.9908333333,
                        lat: 30.3955555556
                    },
                    {
                        name: 'Quanzhou: Emporium of the World in Song-Yuan China',
                        image: 'https://whc.unesco.org/uploads/sites/site_1561.jpg',
                        lon: 118.4441666667,
                        lat: 24.7102777778
                    }
                ]
            },
            {
                type: 'mappoint',
                name: 'Natural',
                color: '#088F8F',
                marker: {
                    symbol: 'triangle'
                },
                data: [
                    {
                        name: 'Jiuzhaigou Valley Scenic and Historic Interest Area',
                        image: 'https://whc.unesco.org/uploads/sites/site_637.jpg',
                        lon: 103.91667,
                        lat: 33.08333
                    },
                    {
                        name: 'Huanglong Scenic and Historic Interest Area',
                        image: 'https://whc.unesco.org/uploads/sites/site_638.jpg',
                        lon: 103.82222,
                        lat: 32.75417
                    },
                    {
                        name: 'Wulingyuan Scenic and Historic Interest Area',
                        image: 'https://whc.unesco.org/uploads/sites/site_640.jpg',
                        lon: 110.5,
                        lat: 29.33333
                    },
                    {
                        name:
              'Sichuan Giant Panda Sanctuaries - Wolong, Mt Siguniang and Jiajin Mountains',
                        image: 'https://whc.unesco.org/uploads/sites/site_1213.jpg',
                        lon: 103,
                        lat: 30.8333333333
                    },
                    {
                        name: 'Mount Sanqingshan National Park',
                        image: 'https://whc.unesco.org/uploads/sites/site_1292.jpg',
                        lon: 118.0644444444,
                        lat: 28.9158333333
                    },
                    {
                        name: 'China Danxia',
                        image: 'https://whc.unesco.org/uploads/sites/site_1335.jpg',
                        lon: 106.0425,
                        lat: 28.4219444444
                    },
                    {
                        name: 'Three Parallel Rivers of Yunnan Protected Areas',
                        image: 'https://whc.unesco.org/uploads/sites/site_1083.jpg',
                        lon: 98.40638889,
                        lat: 27.895
                    },
                    {
                        name: 'Chengjiang Fossil Site',
                        image: 'https://whc.unesco.org/uploads/sites/site_1388.jpg',
                        lon: 102.9772222222,
                        lat: 24.6688888889
                    },
                    {
                        name: 'Xinjiang Tianshan',
                        image: 'https://whc.unesco.org/uploads/sites/site_1414.jpg',
                        lon: 80.3541666667,
                        lat: 41.9683333333
                    },
                    {
                        name: 'South China Karst',
                        image: 'https://whc.unesco.org/uploads/sites/site_1248.jpg',
                        lon: 110.3544444444,
                        lat: 24.9233333333
                    },
                    {
                        name: 'Qinghai Hoh Xil',
                        image: 'https://whc.unesco.org/uploads/sites/site_1540.jpg',
                        lon: 92.4391666667,
                        lat: 35.3802777778
                    },
                    {
                        name: 'Fanjingshan',
                        image: 'https://whc.unesco.org/uploads/sites/site_1559.jpg',
                        lon: 108.68,
                        lat: 27.8955555556
                    },
                    {
                        name:
              'Migratory Bird Sanctuaries along the Coast of Yellow Sea-Bohai Gulf of China (Phase I)',
                        image: 'https://whc.unesco.org/uploads/sites/site_1606.jpg',
                        lon: 121.0168138889,
                        lat: 32.9319444444
                    },
                    {
                        name: 'Hubei Shennongjia',
                        image: 'https://whc.unesco.org/uploads/sites/site_1509.jpg',
                        lon: 110.2077777778,
                        lat: 31.4697222222
                    }
                ]
            },
            {
                type: 'mappoint',
                name: 'mixed',
                color: '#0096FF',
                marker: {
                    symbol: 'circle'
                },
                data: [
                    {
                        name: 'Mount Taishan',
                        image: 'https://whc.unesco.org/uploads/sites/site_437.jpg',
                        lon: 117.1,
                        lat: 36.26667
                    },
                    {
                        name:
              'Mount Emei Scenic Area, including Leshan Giant Buddha Scenic Area',
                        image: 'https://whc.unesco.org/uploads/sites/site_779.jpg',
                        lon: 103.76925,
                        lat: 29.5449
                    },
                    {
                        name: 'Mount Huangshan',
                        image: 'https://whc.unesco.org/uploads/sites/site_547.jpg',
                        lon: 118.155083,
                        lat: 30.145333
                    },
                    {
                        name: 'Mount Wuyi',
                        image: 'https://whc.unesco.org/uploads/sites/site_911.jpg',
                        lon: 117.7252777778,
                        lat: 27.7263888889
                    }
                ]
            }
        ]
    });
})();