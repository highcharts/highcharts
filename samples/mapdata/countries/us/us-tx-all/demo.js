$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-tx-179",
            "value": 0
        },
        {
            "hc-key": "us-tx-393",
            "value": 1
        },
        {
            "hc-key": "us-tx-311",
            "value": 2
        },
        {
            "hc-key": "us-tx-131",
            "value": 3
        },
        {
            "hc-key": "us-tx-297",
            "value": 4
        },
        {
            "hc-key": "us-tx-289",
            "value": 5
        },
        {
            "hc-key": "us-tx-225",
            "value": 6
        },
        {
            "hc-key": "us-tx-279",
            "value": 7
        },
        {
            "hc-key": "us-tx-017",
            "value": 8
        },
        {
            "hc-key": "us-tx-419",
            "value": 9
        },
        {
            "hc-key": "us-tx-405",
            "value": 10
        },
        {
            "hc-key": "us-tx-463",
            "value": 11
        },
        {
            "hc-key": "us-tx-325",
            "value": 12
        },
        {
            "hc-key": "us-tx-067",
            "value": 13
        },
        {
            "hc-key": "us-tx-075",
            "value": 14
        },
        {
            "hc-key": "us-tx-501",
            "value": 15
        },
        {
            "hc-key": "us-tx-445",
            "value": 16
        },
        {
            "hc-key": "us-tx-507",
            "value": 17
        },
        {
            "hc-key": "us-tx-051",
            "value": 18
        },
        {
            "hc-key": "us-tx-331",
            "value": 19
        },
        {
            "hc-key": "us-tx-159",
            "value": 20
        },
        {
            "hc-key": "us-tx-223",
            "value": 21
        },
        {
            "hc-key": "us-tx-203",
            "value": 22
        },
        {
            "hc-key": "us-tx-423",
            "value": 23
        },
        {
            "hc-key": "us-tx-401",
            "value": 24
        },
        {
            "hc-key": "us-tx-355",
            "value": 25
        },
        {
            "hc-key": "us-tx-165",
            "value": 26
        },
        {
            "hc-key": "us-tx-125",
            "value": 27
        },
        {
            "hc-key": "us-tx-345",
            "value": 28
        },
        {
            "hc-key": "us-tx-155",
            "value": 29
        },
        {
            "hc-key": "us-tx-101",
            "value": 30
        },
        {
            "hc-key": "us-tx-461",
            "value": 31
        },
        {
            "hc-key": "us-tx-329",
            "value": 32
        },
        {
            "hc-key": "us-tx-369",
            "value": 33
        },
        {
            "hc-key": "us-tx-117",
            "value": 34
        },
        {
            "hc-key": "us-tx-359",
            "value": 35
        },
        {
            "hc-key": "us-tx-109",
            "value": 36
        },
        {
            "hc-key": "us-tx-243",
            "value": 37
        },
        {
            "hc-key": "us-tx-079",
            "value": 38
        },
        {
            "hc-key": "us-tx-377",
            "value": 39
        },
        {
            "hc-key": "us-tx-365",
            "value": 40
        },
        {
            "hc-key": "us-tx-471",
            "value": 41
        },
        {
            "hc-key": "us-tx-339",
            "value": 42
        },
        {
            "hc-key": "us-tx-201",
            "value": 43
        },
        {
            "hc-key": "us-tx-157",
            "value": 44
        },
        {
            "hc-key": "us-tx-247",
            "value": 45
        },
        {
            "hc-key": "us-tx-505",
            "value": 46
        },
        {
            "hc-key": "us-tx-239",
            "value": 47
        },
        {
            "hc-key": "us-tx-481",
            "value": 48
        },
        {
            "hc-key": "us-tx-451",
            "value": 49
        },
        {
            "hc-key": "us-tx-095",
            "value": 50
        },
        {
            "hc-key": "us-tx-361",
            "value": 51
        },
        {
            "hc-key": "us-tx-309",
            "value": 52
        },
        {
            "hc-key": "us-tx-217",
            "value": 53
        },
        {
            "hc-key": "us-tx-153",
            "value": 54
        },
        {
            "hc-key": "us-tx-189",
            "value": 55
        },
        {
            "hc-key": "us-tx-219",
            "value": 56
        },
        {
            "hc-key": "us-tx-303",
            "value": 57
        },
        {
            "hc-key": "us-tx-483",
            "value": 58
        },
        {
            "hc-key": "us-tx-107",
            "value": 59
        },
        {
            "hc-key": "us-tx-211",
            "value": 60
        },
        {
            "hc-key": "us-tx-001",
            "value": 61
        },
        {
            "hc-key": "us-tx-151",
            "value": 62
        },
        {
            "hc-key": "us-tx-253",
            "value": 63
        },
        {
            "hc-key": "us-tx-087",
            "value": 64
        },
        {
            "hc-key": "us-tx-199",
            "value": 65
        },
        {
            "hc-key": "us-tx-457",
            "value": 66
        },
        {
            "hc-key": "us-tx-347",
            "value": 67
        },
        {
            "hc-key": "us-tx-495",
            "value": 68
        },
        {
            "hc-key": "us-tx-283",
            "value": 69
        },
        {
            "hc-key": "us-tx-383",
            "value": 70
        },
        {
            "hc-key": "us-tx-173",
            "value": 71
        },
        {
            "hc-key": "us-tx-123",
            "value": 72
        },
        {
            "hc-key": "us-tx-255",
            "value": 73
        },
        {
            "hc-key": "us-tx-285",
            "value": 74
        },
        {
            "hc-key": "us-tx-099",
            "value": 75
        },
        {
            "hc-key": "us-tx-035",
            "value": 76
        },
        {
            "hc-key": "us-tx-397",
            "value": 77
        },
        {
            "hc-key": "us-tx-113",
            "value": 78
        },
        {
            "hc-key": "us-tx-275",
            "value": 79
        },
        {
            "hc-key": "us-tx-257",
            "value": 80
        },
        {
            "hc-key": "us-tx-413",
            "value": 81
        },
        {
            "hc-key": "us-tx-327",
            "value": 82
        },
        {
            "hc-key": "us-tx-403",
            "value": 83
        },
        {
            "hc-key": "us-tx-195",
            "value": 84
        },
        {
            "hc-key": "us-tx-233",
            "value": 85
        },
        {
            "hc-key": "us-tx-065",
            "value": 86
        },
        {
            "hc-key": "us-tx-047",
            "value": 87
        },
        {
            "hc-key": "us-tx-235",
            "value": 88
        },
        {
            "hc-key": "us-tx-287",
            "value": 89
        },
        {
            "hc-key": "us-tx-007",
            "value": 90
        },
        {
            "hc-key": "us-tx-073",
            "value": 91
        },
        {
            "hc-key": "us-tx-425",
            "value": 92
        },
        {
            "hc-key": "us-tx-143",
            "value": 93
        },
        {
            "hc-key": "us-tx-251",
            "value": 94
        },
        {
            "hc-key": "us-tx-185",
            "value": 95
        },
        {
            "hc-key": "us-tx-407",
            "value": 96
        },
        {
            "hc-key": "us-tx-221",
            "value": 97
        },
        {
            "hc-key": "us-tx-385",
            "value": 98
        },
        {
            "hc-key": "us-tx-167",
            "value": 99
        },
        {
            "hc-key": "us-tx-071",
            "value": 100
        },
        {
            "hc-key": "us-tx-293",
            "value": 101
        },
        {
            "hc-key": "us-tx-395",
            "value": 102
        },
        {
            "hc-key": "us-tx-313",
            "value": 103
        },
        {
            "hc-key": "us-tx-041",
            "value": 104
        },
        {
            "hc-key": "us-tx-005",
            "value": 105
        },
        {
            "hc-key": "us-tx-231",
            "value": 106
        },
        {
            "hc-key": "us-tx-147",
            "value": 107
        },
        {
            "hc-key": "us-tx-181",
            "value": 108
        },
        {
            "hc-key": "us-tx-411",
            "value": 109
        },
        {
            "hc-key": "us-tx-053",
            "value": 110
        },
        {
            "hc-key": "us-tx-119",
            "value": 111
        },
        {
            "hc-key": "us-tx-023",
            "value": 112
        },
        {
            "hc-key": "us-tx-031",
            "value": 113
        },
        {
            "hc-key": "us-tx-299",
            "value": 114
        },
        {
            "hc-key": "us-tx-019",
            "value": 115
        },
        {
            "hc-key": "us-tx-029",
            "value": 116
        },
        {
            "hc-key": "us-tx-013",
            "value": 117
        },
        {
            "hc-key": "us-tx-163",
            "value": 118
        },
        {
            "hc-key": "us-tx-315",
            "value": 119
        },
        {
            "hc-key": "us-tx-343",
            "value": 120
        },
        {
            "hc-key": "us-tx-215",
            "value": 121
        },
        {
            "hc-key": "us-tx-027",
            "value": 122
        },
        {
            "hc-key": "us-tx-269",
            "value": 123
        },
        {
            "hc-key": "us-tx-399",
            "value": 124
        },
        {
            "hc-key": "us-tx-465",
            "value": 125
        },
        {
            "hc-key": "us-tx-435",
            "value": 126
        },
        {
            "hc-key": "us-tx-271",
            "value": 127
        },
        {
            "hc-key": "us-tx-137",
            "value": 128
        },
        {
            "hc-key": "us-tx-091",
            "value": 129
        },
        {
            "hc-key": "us-tx-187",
            "value": 130
        },
        {
            "hc-key": "us-tx-477",
            "value": 131
        },
        {
            "hc-key": "us-tx-379",
            "value": 132
        },
        {
            "hc-key": "us-tx-139",
            "value": 133
        },
        {
            "hc-key": "us-tx-213",
            "value": 134
        },
        {
            "hc-key": "us-tx-111",
            "value": 135
        },
        {
            "hc-key": "us-tx-421",
            "value": 136
        },
        {
            "hc-key": "us-tx-493",
            "value": 137
        },
        {
            "hc-key": "us-tx-467",
            "value": 138
        },
        {
            "hc-key": "us-tx-057",
            "value": 139
        },
        {
            "hc-key": "us-tx-391",
            "value": 140
        },
        {
            "hc-key": "us-tx-321",
            "value": 141
        },
        {
            "hc-key": "us-tx-341",
            "value": 142
        },
        {
            "hc-key": "us-tx-499",
            "value": 143
        },
        {
            "hc-key": "us-tx-063",
            "value": 144
        },
        {
            "hc-key": "us-tx-121",
            "value": 145
        },
        {
            "hc-key": "us-tx-439",
            "value": 146
        },
        {
            "hc-key": "us-tx-273",
            "value": 147
        },
        {
            "hc-key": "us-tx-261",
            "value": 148
        },
        {
            "hc-key": "us-tx-381",
            "value": 149
        },
        {
            "hc-key": "us-tx-437",
            "value": 150
        },
        {
            "hc-key": "us-tx-389",
            "value": 151
        },
        {
            "hc-key": "us-tx-323",
            "value": 152
        },
        {
            "hc-key": "us-tx-479",
            "value": 153
        },
        {
            "hc-key": "us-tx-409",
            "value": 154
        },
        {
            "hc-key": "us-tx-249",
            "value": 155
        },
        {
            "hc-key": "us-tx-317",
            "value": 156
        },
        {
            "hc-key": "us-tx-115",
            "value": 157
        },
        {
            "hc-key": "us-tx-455",
            "value": 158
        },
        {
            "hc-key": "us-tx-191",
            "value": 159
        },
        {
            "hc-key": "us-tx-037",
            "value": 160
        },
        {
            "hc-key": "us-tx-459",
            "value": 161
        },
        {
            "hc-key": "us-tx-443",
            "value": 162
        },
        {
            "hc-key": "us-tx-105",
            "value": 163
        },
        {
            "hc-key": "us-tx-371",
            "value": 164
        },
        {
            "hc-key": "us-tx-349",
            "value": 165
        },
        {
            "hc-key": "us-tx-161",
            "value": 166
        },
        {
            "hc-key": "us-tx-353",
            "value": 167
        },
        {
            "hc-key": "us-tx-441",
            "value": 168
        },
        {
            "hc-key": "us-tx-083",
            "value": 169
        },
        {
            "hc-key": "us-tx-003",
            "value": 170
        },
        {
            "hc-key": "us-tx-491",
            "value": 171
        },
        {
            "hc-key": "us-tx-375",
            "value": 172
        },
        {
            "hc-key": "us-tx-009",
            "value": 173
        },
        {
            "hc-key": "us-tx-077",
            "value": 174
        },
        {
            "hc-key": "us-tx-237",
            "value": 175
        },
        {
            "hc-key": "us-tx-503",
            "value": 176
        },
        {
            "hc-key": "us-tx-367",
            "value": 177
        },
        {
            "hc-key": "us-tx-469",
            "value": 178
        },
        {
            "hc-key": "us-tx-169",
            "value": 179
        },
        {
            "hc-key": "us-tx-305",
            "value": 180
        },
        {
            "hc-key": "us-tx-363",
            "value": 181
        },
        {
            "hc-key": "us-tx-133",
            "value": 182
        },
        {
            "hc-key": "us-tx-059",
            "value": 183
        },
        {
            "hc-key": "us-tx-417",
            "value": 184
        },
        {
            "hc-key": "us-tx-207",
            "value": 185
        },
        {
            "hc-key": "us-tx-427",
            "value": 186
        },
        {
            "hc-key": "us-tx-043",
            "value": 187
        },
        {
            "hc-key": "us-tx-127",
            "value": 188
        },
        {
            "hc-key": "us-tx-055",
            "value": 189
        },
        {
            "hc-key": "us-tx-209",
            "value": 190
        },
        {
            "hc-key": "us-tx-337",
            "value": 191
        },
        {
            "hc-key": "us-tx-049",
            "value": 192
        },
        {
            "hc-key": "us-tx-259",
            "value": 193
        },
        {
            "hc-key": "us-tx-265",
            "value": 194
        },
        {
            "hc-key": "us-tx-171",
            "value": 195
        },
        {
            "hc-key": "us-tx-061",
            "value": 196
        },
        {
            "hc-key": "us-tx-473",
            "value": 197
        },
        {
            "hc-key": "us-tx-319",
            "value": 198
        },
        {
            "hc-key": "us-tx-085",
            "value": 199
        },
        {
            "hc-key": "us-tx-205",
            "value": 200
        },
        {
            "hc-key": "us-tx-177",
            "value": 201
        },
        {
            "hc-key": "us-tx-183",
            "value": 202
        },
        {
            "hc-key": "us-tx-145",
            "value": 203
        },
        {
            "hc-key": "us-tx-015",
            "value": 204
        },
        {
            "hc-key": "us-tx-149",
            "value": 205
        },
        {
            "hc-key": "us-tx-011",
            "value": 206
        },
        {
            "hc-key": "us-tx-045",
            "value": 207
        },
        {
            "hc-key": "us-tx-039",
            "value": 208
        },
        {
            "hc-key": "us-tx-267",
            "value": 209
        },
        {
            "hc-key": "us-tx-487",
            "value": 210
        },
        {
            "hc-key": "us-tx-485",
            "value": 211
        },
        {
            "hc-key": "us-tx-025",
            "value": 212
        },
        {
            "hc-key": "us-tx-175",
            "value": 213
        },
        {
            "hc-key": "us-tx-489",
            "value": 214
        },
        {
            "hc-key": "us-tx-241",
            "value": 215
        },
        {
            "hc-key": "us-tx-351",
            "value": 216
        },
        {
            "hc-key": "us-tx-307",
            "value": 217
        },
        {
            "hc-key": "us-tx-281",
            "value": 218
        },
        {
            "hc-key": "us-tx-193",
            "value": 219
        },
        {
            "hc-key": "us-tx-453",
            "value": 220
        },
        {
            "hc-key": "us-tx-263",
            "value": 221
        },
        {
            "hc-key": "us-tx-021",
            "value": 222
        },
        {
            "hc-key": "us-tx-229",
            "value": 223
        },
        {
            "hc-key": "us-tx-475",
            "value": 224
        },
        {
            "hc-key": "us-tx-301",
            "value": 225
        },
        {
            "hc-key": "us-tx-081",
            "value": 226
        },
        {
            "hc-key": "us-tx-069",
            "value": 227
        },
        {
            "hc-key": "us-tx-295",
            "value": 228
        },
        {
            "hc-key": "us-tx-357",
            "value": 229
        },
        {
            "hc-key": "us-tx-415",
            "value": 230
        },
        {
            "hc-key": "us-tx-373",
            "value": 231
        },
        {
            "hc-key": "us-tx-291",
            "value": 232
        },
        {
            "hc-key": "us-tx-433",
            "value": 233
        },
        {
            "hc-key": "us-tx-089",
            "value": 234
        },
        {
            "hc-key": "us-tx-135",
            "value": 235
        },
        {
            "hc-key": "us-tx-497",
            "value": 236
        },
        {
            "hc-key": "us-tx-097",
            "value": 237
        },
        {
            "hc-key": "us-tx-245",
            "value": 238
        },
        {
            "hc-key": "us-tx-227",
            "value": 239
        },
        {
            "hc-key": "us-tx-387",
            "value": 240
        },
        {
            "hc-key": "us-tx-431",
            "value": 241
        },
        {
            "hc-key": "us-tx-335",
            "value": 242
        },
        {
            "hc-key": "us-tx-033",
            "value": 243
        },
        {
            "hc-key": "us-tx-197",
            "value": 244
        },
        {
            "hc-key": "us-tx-277",
            "value": 245
        },
        {
            "hc-key": "us-tx-447",
            "value": 246
        },
        {
            "hc-key": "us-tx-129",
            "value": 247
        },
        {
            "hc-key": "us-tx-141",
            "value": 248
        },
        {
            "hc-key": "us-tx-093",
            "value": 249
        },
        {
            "hc-key": "us-tx-103",
            "value": 250
        },
        {
            "hc-key": "us-tx-333",
            "value": 251
        },
        {
            "hc-key": "us-tx-449",
            "value": 252
        },
        {
            "hc-key": "us-tx-429",
            "value": 253
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/us-tx-all.js">Texas</a>'
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
            mapData: Highcharts.maps['countries/us/us-tx-all'],
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
