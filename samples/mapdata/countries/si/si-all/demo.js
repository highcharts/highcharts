$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "si-1439",
            "value": 0
        },
        {
            "hc-key": "si-457",
            "value": 1
        },
        {
            "hc-key": "si-1395",
            "value": 2
        },
        {
            "hc-key": "si-1396",
            "value": 3
        },
        {
            "hc-key": "si-1451",
            "value": 4
        },
        {
            "hc-key": "si-1457",
            "value": 5
        },
        {
            "hc-key": "si-1416",
            "value": 6
        },
        {
            "hc-key": "si-1460",
            "value": 7
        },
        {
            "hc-key": "si-1404",
            "value": 8
        },
        {
            "hc-key": "si-423",
            "value": 9
        },
        {
            "hc-key": "si-425",
            "value": 10
        },
        {
            "hc-key": "si-448",
            "value": 11
        },
        {
            "hc-key": "si-426",
            "value": 12
        },
        {
            "hc-key": "si-471",
            "value": 13
        },
        {
            "hc-key": "si-436",
            "value": 14
        },
        {
            "hc-key": "si-438",
            "value": 15
        },
        {
            "hc-key": "si-442",
            "value": 16
        },
        {
            "hc-key": "si-443",
            "value": 17
        },
        {
            "hc-key": "si-1441",
            "value": 18
        },
        {
            "hc-key": "si-1405",
            "value": 19
        },
        {
            "hc-key": "si-1380",
            "value": 20
        },
        {
            "hc-key": "si-446",
            "value": 21
        },
        {
            "hc-key": "si-447",
            "value": 22
        },
        {
            "hc-key": "si-449",
            "value": 23
        },
        {
            "hc-key": "si-450",
            "value": 24
        },
        {
            "hc-key": "si-452",
            "value": 25
        },
        {
            "hc-key": "si-453",
            "value": 26
        },
        {
            "hc-key": "si-475",
            "value": 27
        },
        {
            "hc-key": "si-456",
            "value": 28
        },
        {
            "hc-key": "si-460",
            "value": 29
        },
        {
            "hc-key": "si-458",
            "value": 30
        },
        {
            "hc-key": "si-461",
            "value": 31
        },
        {
            "hc-key": "si-462",
            "value": 32
        },
        {
            "hc-key": "si-465",
            "value": 33
        },
        {
            "hc-key": "si-459",
            "value": 34
        },
        {
            "hc-key": "si-455",
            "value": 35
        },
        {
            "hc-key": "si-469",
            "value": 36
        },
        {
            "hc-key": "si-427",
            "value": 37
        },
        {
            "hc-key": "si-472",
            "value": 38
        },
        {
            "hc-key": "si-473",
            "value": 39
        },
        {
            "hc-key": "si-474",
            "value": 40
        },
        {
            "hc-key": "si-1443",
            "value": 41
        },
        {
            "hc-key": "si-479",
            "value": 42
        },
        {
            "hc-key": "si-480",
            "value": 43
        },
        {
            "hc-key": "si-481",
            "value": 44
        },
        {
            "hc-key": "si-482",
            "value": 45
        },
        {
            "hc-key": "si-485",
            "value": 46
        },
        {
            "hc-key": "si-486",
            "value": 47
        },
        {
            "hc-key": "si-487",
            "value": 48
        },
        {
            "hc-key": "si-874",
            "value": 49
        },
        {
            "hc-key": "si-416",
            "value": 50
        },
        {
            "hc-key": "si-877",
            "value": 51
        },
        {
            "hc-key": "si-878",
            "value": 52
        },
        {
            "hc-key": "si-483",
            "value": 53
        },
        {
            "hc-key": "si-1373",
            "value": 54
        },
        {
            "hc-key": "si-1372",
            "value": 55
        },
        {
            "hc-key": "si-1374",
            "value": 56
        },
        {
            "hc-key": "si-415",
            "value": 57
        },
        {
            "hc-key": "si-1379",
            "value": 58
        },
        {
            "hc-key": "si-1375",
            "value": 59
        },
        {
            "hc-key": "si-1381",
            "value": 60
        },
        {
            "hc-key": "si-1402",
            "value": 61
        },
        {
            "hc-key": "si-451",
            "value": 62
        },
        {
            "hc-key": "si-1382",
            "value": 63
        },
        {
            "hc-key": "si-1385",
            "value": 64
        },
        {
            "hc-key": "si-1386",
            "value": 65
        },
        {
            "hc-key": "si-1390",
            "value": 66
        },
        {
            "hc-key": "si-1463",
            "value": 67
        },
        {
            "hc-key": "si-1392",
            "value": 68
        },
        {
            "hc-key": "si-445",
            "value": 69
        },
        {
            "hc-key": "si-1394",
            "value": 70
        },
        {
            "hc-key": "si-1377",
            "value": 71
        },
        {
            "hc-key": "si-470",
            "value": 72
        },
        {
            "hc-key": "si-1398",
            "value": 73
        },
        {
            "hc-key": "si-7300",
            "value": 74
        },
        {
            "hc-key": "si-1400",
            "value": 75
        },
        {
            "hc-key": "si-1393",
            "value": 76
        },
        {
            "hc-key": "si-1401",
            "value": 77
        },
        {
            "hc-key": "si-454",
            "value": 78
        },
        {
            "hc-key": "si-1406",
            "value": 79
        },
        {
            "hc-key": "si-1408",
            "value": 80
        },
        {
            "hc-key": "si-1409",
            "value": 81
        },
        {
            "hc-key": "si-1411",
            "value": 82
        },
        {
            "hc-key": "si-1387",
            "value": 83
        },
        {
            "hc-key": "si-1413",
            "value": 84
        },
        {
            "hc-key": "si-1417",
            "value": 85
        },
        {
            "hc-key": "si-1418",
            "value": 86
        },
        {
            "hc-key": "si-1412",
            "value": 87
        },
        {
            "hc-key": "si-1419",
            "value": 88
        },
        {
            "hc-key": "si-429",
            "value": 89
        },
        {
            "hc-key": "si-1420",
            "value": 90
        },
        {
            "hc-key": "si-1423",
            "value": 91
        },
        {
            "hc-key": "si-7301",
            "value": 92
        },
        {
            "hc-key": "si-1424",
            "value": 93
        },
        {
            "hc-key": "si-1427",
            "value": 94
        },
        {
            "hc-key": "si-1429",
            "value": 95
        },
        {
            "hc-key": "si-1430",
            "value": 96
        },
        {
            "hc-key": "si-1431",
            "value": 97
        },
        {
            "hc-key": "si-1432",
            "value": 98
        },
        {
            "hc-key": "si-1434",
            "value": 99
        },
        {
            "hc-key": "si-1399",
            "value": 100
        },
        {
            "hc-key": "si-1437",
            "value": 101
        },
        {
            "hc-key": "si-1440",
            "value": 102
        },
        {
            "hc-key": "si-1445",
            "value": 103
        },
        {
            "hc-key": "si-444",
            "value": 104
        },
        {
            "hc-key": "si-477",
            "value": 105
        },
        {
            "hc-key": "si-1446",
            "value": 106
        },
        {
            "hc-key": "si-478",
            "value": 107
        },
        {
            "hc-key": "si-1450",
            "value": 108
        },
        {
            "hc-key": "si-1447",
            "value": 109
        },
        {
            "hc-key": "si-1452",
            "value": 110
        },
        {
            "hc-key": "si-476",
            "value": 111
        },
        {
            "hc-key": "si-1453",
            "value": 112
        },
        {
            "hc-key": "si-1462",
            "value": 113
        },
        {
            "hc-key": "si-1464",
            "value": 114
        },
        {
            "hc-key": "si-1465",
            "value": 115
        },
        {
            "hc-key": "si-1467",
            "value": 116
        },
        {
            "hc-key": "si-1468",
            "value": 117
        },
        {
            "hc-key": "si-1471",
            "value": 118
        },
        {
            "hc-key": "si-1469",
            "value": 119
        },
        {
            "hc-key": "si-1470",
            "value": 120
        },
        {
            "hc-key": "si-1473",
            "value": 121
        },
        {
            "hc-key": "si-1476",
            "value": 122
        },
        {
            "hc-key": "si-875",
            "value": 123
        },
        {
            "hc-key": "si-1475",
            "value": 124
        },
        {
            "hc-key": "si-1478",
            "value": 125
        },
        {
            "hc-key": "si-1479",
            "value": 126
        },
        {
            "hc-key": "si-1474",
            "value": 127
        },
        {
            "hc-key": "si-1477",
            "value": 128
        },
        {
            "hc-key": "si-1482",
            "value": 129
        },
        {
            "hc-key": "si-1483",
            "value": 130
        },
        {
            "hc-key": "si-1484",
            "value": 131
        },
        {
            "hc-key": "si-1485",
            "value": 132
        },
        {
            "hc-key": "si-414",
            "value": 133
        },
        {
            "hc-key": "si-417",
            "value": 134
        },
        {
            "hc-key": "si-418",
            "value": 135
        },
        {
            "hc-key": "si-419",
            "value": 136
        },
        {
            "hc-key": "si-420",
            "value": 137
        },
        {
            "hc-key": "si-421",
            "value": 138
        },
        {
            "hc-key": "si-1442",
            "value": 139
        },
        {
            "hc-key": "si-422",
            "value": 140
        },
        {
            "hc-key": "si-424",
            "value": 141
        },
        {
            "hc-key": "si-1444",
            "value": 142
        },
        {
            "hc-key": "si-1410",
            "value": 143
        },
        {
            "hc-key": "si-428",
            "value": 144
        },
        {
            "hc-key": "si-430",
            "value": 145
        },
        {
            "hc-key": "si-431",
            "value": 146
        },
        {
            "hc-key": "si-433",
            "value": 147
        },
        {
            "hc-key": "si-434",
            "value": 148
        },
        {
            "hc-key": "si-435",
            "value": 149
        },
        {
            "hc-key": "si-466",
            "value": 150
        },
        {
            "hc-key": "si-1438",
            "value": 151
        },
        {
            "hc-key": "si-1428",
            "value": 152
        },
        {
            "hc-key": "si-1426",
            "value": 153
        },
        {
            "hc-key": "si-1435",
            "value": 154
        },
        {
            "hc-key": "si-1421",
            "value": 155
        },
        {
            "hc-key": "si-439",
            "value": 156
        },
        {
            "hc-key": "si-437",
            "value": 157
        },
        {
            "hc-key": "si-440",
            "value": 158
        },
        {
            "hc-key": "si-441",
            "value": 159
        },
        {
            "hc-key": "si-463",
            "value": 160
        },
        {
            "hc-key": "si-1376",
            "value": 161
        },
        {
            "hc-key": "si-1378",
            "value": 162
        },
        {
            "hc-key": "si-1383",
            "value": 163
        },
        {
            "hc-key": "si-1391",
            "value": 164
        },
        {
            "hc-key": "si-1403",
            "value": 165
        },
        {
            "hc-key": "si-1407",
            "value": 166
        },
        {
            "hc-key": "si-1415",
            "value": 167
        },
        {
            "hc-key": "si-1422",
            "value": 168
        },
        {
            "hc-key": "si-1425",
            "value": 169
        },
        {
            "hc-key": "si-1433",
            "value": 170
        },
        {
            "hc-key": "si-1454",
            "value": 171
        },
        {
            "hc-key": "si-1455",
            "value": 172
        },
        {
            "hc-key": "si-1448",
            "value": 173
        },
        {
            "hc-key": "si-1456",
            "value": 174
        },
        {
            "hc-key": "si-1458",
            "value": 175
        },
        {
            "hc-key": "si-1461",
            "value": 176
        },
        {
            "hc-key": "si-1466",
            "value": 177
        },
        {
            "hc-key": "si-1472",
            "value": 178
        },
        {
            "hc-key": "si-468",
            "value": 179
        },
        {
            "hc-key": "si-432",
            "value": 180
        },
        {
            "hc-key": "si-467",
            "value": 181
        },
        {
            "hc-key": "si-1481",
            "value": 182
        },
        {
            "hc-key": "si-484",
            "value": 183
        },
        {
            "hc-key": "si-876",
            "value": 184
        },
        {
            "hc-key": "si-1388",
            "value": 185
        },
        {
            "hc-key": "si-1389",
            "value": 186
        },
        {
            "hc-key": "si-1397",
            "value": 187
        },
        {
            "hc-key": "si-1384",
            "value": 188
        },
        {
            "hc-key": "si-1459",
            "value": 189
        },
        {
            "hc-key": "si-1414",
            "value": 190
        },
        {
            "hc-key": "si-1449",
            "value": 191
        },
        {
            "hc-key": "si-1480",
            "value": 192
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/si/si-all.js">Slovenia</a>'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 0
        },

        series : [{
            data : data,
            mapData: Highcharts.maps['countries/si/si-all'],
            joinBy: 'hc-key',
            name: 'Random data',
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });
});
