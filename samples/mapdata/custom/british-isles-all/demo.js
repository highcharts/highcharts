$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "gb-ay",
            "value": 0
        },
        {
            "hc-key": "gb-3270",
            "value": 1
        },
        {
            "hc-key": "gb-hi",
            "value": 2
        },
        {
            "hc-key": "gb-ab",
            "value": 3
        },
        {
            "hc-key": "gb-ps",
            "value": 4
        },
        {
            "hc-key": "gb-wi",
            "value": 5
        },
        {
            "hc-key": "gb-ke",
            "value": 6
        },
        {
            "hc-key": "gb-7398",
            "value": 7
        },
        {
            "hc-key": "gb-gc",
            "value": 8
        },
        {
            "hc-key": "gb-lc",
            "value": 9
        },
        {
            "hc-key": "gb-de",
            "value": 10
        },
        {
            "hc-key": "gb-dn",
            "value": 11
        },
        {
            "hc-key": "gb-om",
            "value": 12
        },
        {
            "hc-key": "gb-hl",
            "value": 13
        },
        {
            "hc-key": "gb-7122",
            "value": 14
        },
        {
            "hc-key": "gb-bw",
            "value": 15
        },
        {
            "hc-key": "ie-1510",
            "value": 16
        },
        {
            "hc-key": "ie-ky",
            "value": 17
        },
        {
            "hc-key": "ie-dl",
            "value": 18
        },
        {
            "hc-key": "ie-491",
            "value": 19
        },
        {
            "hc-key": "gb-di",
            "value": 20
        },
        {
            "hc-key": "gb-fl",
            "value": 21
        },
        {
            "hc-key": "gb-ng",
            "value": 22
        },
        {
            "hc-key": "gb-st",
            "value": 23
        },
        {
            "hc-key": "gb-so",
            "value": 24
        },
        {
            "hc-key": "gb-wr",
            "value": 25
        },
        {
            "hc-key": "gb-7142",
            "value": 26
        },
        {
            "hc-key": "gb-fe",
            "value": 27
        },
        {
            "hc-key": "ie-mn",
            "value": 28
        },
        {
            "hc-key": "ie-gy",
            "value": 29
        },
        {
            "hc-key": "ie-ck",
            "value": 30
        },
        {
            "hc-key": "ie-2363",
            "value": 31
        },
        {
            "hc-key": "ie-wd",
            "value": 32
        },
        {
            "hc-key": "ie-1528",
            "value": 33
        },
        {
            "hc-key": "ie-dn",
            "value": 34
        },
        {
            "hc-key": "ie-lh",
            "value": 35
        },
        {
            "hc-key": "ie-mh",
            "value": 36
        },
        {
            "hc-key": "ie-oy",
            "value": 37
        },
        {
            "hc-key": "ie-ke",
            "value": 38
        },
        {
            "hc-key": "ie-wx",
            "value": 39
        },
        {
            "hc-key": "ie-kk",
            "value": 40
        },
        {
            "hc-key": "ie-ls",
            "value": 41
        },
        {
            "hc-key": "ie-ty",
            "value": 42
        },
        {
            "hc-key": "ie-rn",
            "value": 43
        },
        {
            "hc-key": "ie-lm",
            "value": 44
        },
        {
            "hc-key": "ie-lk",
            "value": 45
        },
        {
            "hc-key": "ie-ce",
            "value": 46
        },
        {
            "hc-key": "ie-1533",
            "value": 47
        },
        {
            "hc-key": "ie-wh",
            "value": 48
        },
        {
            "hc-key": "ie-cn",
            "value": 49
        },
        {
            "hc-key": "gb-do",
            "value": 50
        },
        {
            "hc-key": "gb-er",
            "value": 51
        },
        {
            "hc-key": "gb-ea",
            "value": 52
        },
        {
            "hc-key": "gb-gg",
            "value": 53
        },
        {
            "hc-key": "gb-sl",
            "value": 54
        },
        {
            "hc-key": "gb-2458",
            "value": 55
        },
        {
            "hc-key": "gb-ed",
            "value": 56
        },
        {
            "hc-key": "gb-ic",
            "value": 57
        },
        {
            "hc-key": "gb-2446",
            "value": 58
        },
        {
            "hc-key": "gb-nn",
            "value": 59
        },
        {
            "hc-key": "gb-rf",
            "value": 60
        },
        {
            "hc-key": "gb-sa",
            "value": 61
        },
        {
            "hc-key": "gb-wd",
            "value": 62
        },
        {
            "hc-key": "gb-ar",
            "value": 63
        },
        {
            "hc-key": "gb-fk",
            "value": 64
        },
        {
            "hc-key": "gb-zg",
            "value": 65
        },
        {
            "hc-key": "gb-cc",
            "value": 66
        },
        {
            "hc-key": "gb-du",
            "value": 67
        },
        {
            "hc-key": "gb-eb",
            "value": 68
        },
        {
            "hc-key": "gb-ml",
            "value": 69
        },
        {
            "hc-key": "gb-wh",
            "value": 70
        },
        {
            "hc-key": "gb-bo",
            "value": 71
        },
        {
            "hc-key": "gb-dh",
            "value": 72
        },
        {
            "hc-key": "gb-da",
            "value": 73
        },
        {
            "hc-key": "gb-hp",
            "value": 74
        },
        {
            "hc-key": "gb-mb",
            "value": 75
        },
        {
            "hc-key": "gb-rc",
            "value": 76
        },
        {
            "hc-key": "gb-zt",
            "value": 77
        },
        {
            "hc-key": "gb-ha",
            "value": 78
        },
        {
            "hc-key": "gb-zh",
            "value": 79
        },
        {
            "hc-key": "gb-2318",
            "value": 80
        },
        {
            "hc-key": "gb-mk",
            "value": 81
        },
        {
            "hc-key": "gb-bu",
            "value": 82
        },
        {
            "hc-key": "gb-bn",
            "value": 83
        },
        {
            "hc-key": "gb-bs",
            "value": 84
        },
        {
            "hc-key": "gb-ns",
            "value": 85
        },
        {
            "hc-key": "gb-sj",
            "value": 86
        },
        {
            "hc-key": "gb-2389",
            "value": 87
        },
        {
            "hc-key": "gb-ds",
            "value": 88
        },
        {
            "hc-key": "gb-2391",
            "value": 89
        },
        {
            "hc-key": "gb-ht",
            "value": 90
        },
        {
            "hc-key": "gb-cm",
            "value": 91
        },
        {
            "hc-key": "gb-bd",
            "value": 92
        },
        {
            "hc-key": "gb-kh",
            "value": 93
        },
        {
            "hc-key": "gb-ne",
            "value": 94
        },
        {
            "hc-key": "gb-nl",
            "value": 95
        },
        {
            "hc-key": "gb-2393",
            "value": 96
        },
        {
            "hc-key": "gb-db",
            "value": 97
        },
        {
            "hc-key": "gb-ba",
            "value": 98
        },
        {
            "hc-key": "gb-xb",
            "value": 99
        },
        {
            "hc-key": "gb-bz",
            "value": 100
        },
        {
            "hc-key": "gb-be",
            "value": 101
        },
        {
            "hc-key": "gb-cn",
            "value": 102
        },
        {
            "hc-key": "gb-cy",
            "value": 103
        },
        {
            "hc-key": "gb-eg",
            "value": 104
        },
        {
            "hc-key": "gb-ef",
            "value": 105
        },
        {
            "hc-key": "gb-gr",
            "value": 106
        },
        {
            "hc-key": "gb-hf",
            "value": 107
        },
        {
            "hc-key": "gb-hu",
            "value": 108
        },
        {
            "hc-key": "gb-it",
            "value": 109
        },
        {
            "hc-key": "gb-kc",
            "value": 110
        },
        {
            "hc-key": "gb-me",
            "value": 111
        },
        {
            "hc-key": "gb-rb",
            "value": 112
        },
        {
            "hc-key": "gb-ru",
            "value": 113
        },
        {
            "hc-key": "gb-su",
            "value": 114
        },
        {
            "hc-key": "gb-th",
            "value": 115
        },
        {
            "hc-key": "gb-wf",
            "value": 116
        },
        {
            "hc-key": "gb-ww",
            "value": 117
        },
        {
            "hc-key": "gb-we",
            "value": 118
        },
        {
            "hc-key": "gb-bf",
            "value": 119
        },
        {
            "hc-key": "gb-ld",
            "value": 120
        },
        {
            "hc-key": "gb-nm",
            "value": 121
        },
        {
            "hc-key": "gb-bb",
            "value": 122
        },
        {
            "hc-key": "gb-am",
            "value": 123
        },
        {
            "hc-key": "gb-cr",
            "value": 124
        },
        {
            "hc-key": "gb-an",
            "value": 125
        },
        {
            "hc-key": "gb-lb",
            "value": 126
        },
        {
            "hc-key": "gb-2347",
            "value": 127
        },
        {
            "hc-key": "gb-mf",
            "value": 128
        },
        {
            "hc-key": "gb-my",
            "value": 129
        },
        {
            "hc-key": "gb-bl",
            "value": 130
        },
        {
            "hc-key": "gb-cf",
            "value": 131
        },
        {
            "hc-key": "gb-nw",
            "value": 132
        },
        {
            "hc-key": "gb-lr",
            "value": 133
        },
        {
            "hc-key": "gb-2354",
            "value": 134
        },
        {
            "hc-key": "gb-dw",
            "value": 135
        },
        {
            "hc-key": "gb-nd",
            "value": 136
        },
        {
            "hc-key": "gb-cl",
            "value": 137
        },
        {
            "hc-key": "gb-by",
            "value": 138
        },
        {
            "hc-key": "gb-cs",
            "value": 139
        },
        {
            "hc-key": "gb-pe",
            "value": 140
        },
        {
            "hc-key": "gb-2301",
            "value": 141
        },
        {
            "hc-key": "gb-gd",
            "value": 142
        },
        {
            "hc-key": "gb-sp",
            "value": 143
        },
        {
            "hc-key": "gb-po",
            "value": 144
        },
        {
            "hc-key": "gb-bj",
            "value": 145
        },
        {
            "hc-key": "gb-cp",
            "value": 146
        },
        {
            "hc-key": "gb-mt",
            "value": 147
        },
        {
            "hc-key": "gb-rt",
            "value": 148
        },
        {
            "hc-key": "gb-vg",
            "value": 149
        },
        {
            "hc-key": "gb-ca",
            "value": 150
        },
        {
            "hc-key": "gb-np",
            "value": 151
        },
        {
            "hc-key": "gb-ci",
            "value": 152
        },
        {
            "hc-key": "ie-7034",
            "value": 153
        },
        {
            "hc-key": "gb-sw",
            "value": 154
        },
        {
            "hc-key": "ie-7035",
            "value": 155
        },
        {
            "hc-key": "gb-la",
            "value": 156
        },
        {
            "hc-key": "gb-ey",
            "value": 157
        },
        {
            "hc-key": "gb-yk",
            "value": 158
        },
        {
            "hc-key": "ie-7033",
            "value": 159
        },
        {
            "hc-key": "gb-wx",
            "value": 160
        },
        {
            "hc-key": "gb-bg",
            "value": 161
        },
        {
            "hc-key": "gb-no",
            "value": 162
        },
        {
            "hc-key": "gb-tf",
            "value": 163
        },
        {
            "hc-key": "gb-lm",
            "value": 164
        },
        {
            "hc-key": "gb-sb",
            "value": 165
        },
        {
            "hc-key": "gb-dg",
            "value": 166
        },
        {
            "hc-key": "gb-cu",
            "value": 167
        },
        {
            "hc-key": "gb-ny",
            "value": 168
        },
        {
            "hc-key": "gb-2420",
            "value": 169
        },
        {
            "hc-key": "gb-tb",
            "value": 170
        },
        {
            "hc-key": "gb-ex",
            "value": 171
        },
        {
            "hc-key": "gb-li",
            "value": 172
        },
        {
            "hc-key": "gb-nf",
            "value": 173
        },
        {
            "hc-key": "gb-bh",
            "value": 174
        },
        {
            "hc-key": "gb-hv",
            "value": 175
        },
        {
            "hc-key": "gb-tr",
            "value": 176
        },
        {
            "hc-key": "gb-es",
            "value": 177
        },
        {
            "hc-key": "gb-ss",
            "value": 178
        },
        {
            "hc-key": "gb-ws",
            "value": 179
        },
        {
            "hc-key": "gb-hd",
            "value": 180
        },
        {
            "hc-key": "gb-kt",
            "value": 181
        },
        {
            "hc-key": "gb-sr",
            "value": 182
        },
        {
            "hc-key": "gb-ox",
            "value": 183
        },
        {
            "hc-key": "gb-sn",
            "value": 184
        },
        {
            "hc-key": "gb-wl",
            "value": 185
        },
        {
            "hc-key": "gb-na",
            "value": 186
        },
        {
            "hc-key": "gb-rl",
            "value": 187
        },
        {
            "hc-key": "gb-nt",
            "value": 188
        },
        {
            "hc-key": "gb-hk",
            "value": 189
        },
        {
            "hc-key": "gb-hy",
            "value": 190
        },
        {
            "hc-key": "gb-hr",
            "value": 191
        },
        {
            "hc-key": "gb-lt",
            "value": 192
        },
        {
            "hc-key": "gb-lw",
            "value": 193
        },
        {
            "hc-key": "gb-nh",
            "value": 194
        },
        {
            "hc-key": "gb-sq",
            "value": 195
        },
        {
            "hc-key": "gb-he",
            "value": 196
        },
        {
            "hc-key": "gb-wc",
            "value": 197
        },
        {
            "hc-key": "gb-tk",
            "value": 198
        },
        {
            "hc-key": "gb-6338",
            "value": 199
        },
        {
            "hc-key": "gb-nb",
            "value": 200
        },
        {
            "hc-key": "gb-2367",
            "value": 201
        },
        {
            "hc-key": "gb-7113",
            "value": 202
        },
        {
            "hc-key": "gb-7114",
            "value": 203
        },
        {
            "hc-key": "gb-7115",
            "value": 204
        },
        {
            "hc-key": "gb-7116",
            "value": 205
        },
        {
            "hc-key": "gb-2364",
            "value": 206
        },
        {
            "hc-key": "gb-7118",
            "value": 207
        },
        {
            "hc-key": "gb-7119",
            "value": 208
        },
        {
            "hc-key": "gb-wt",
            "value": 209
        },
        {
            "hc-key": "gb-ms",
            "value": 210
        },
        {
            "hc-key": "gb-7117",
            "value": 211
        },
        {
            "hc-key": "gb-3265",
            "value": 212
        },
        {
            "hc-key": "gb-7130",
            "value": 213
        },
        {
            "hc-key": "gb-7131",
            "value": 214
        },
        {
            "hc-key": "gb-7132",
            "value": 215
        },
        {
            "hc-key": "gb-7133",
            "value": 216
        },
        {
            "hc-key": "gb-3266",
            "value": 217
        },
        {
            "hc-key": "gb-7121",
            "value": 218
        },
        {
            "hc-key": "gb-7123",
            "value": 219
        },
        {
            "hc-key": "gb-7124",
            "value": 220
        },
        {
            "hc-key": "gb-7125",
            "value": 221
        },
        {
            "hc-key": "gb-7126",
            "value": 222
        },
        {
            "hc-key": "gb-7127",
            "value": 223
        },
        {
            "hc-key": "gb-7128",
            "value": 224
        },
        {
            "hc-key": "gb-7129",
            "value": 225
        },
        {
            "hc-key": "gb-3267",
            "value": 226
        },
        {
            "hc-key": "gb-7134",
            "value": 227
        },
        {
            "hc-key": "gb-7135",
            "value": 228
        },
        {
            "hc-key": "gb-7136",
            "value": 229
        },
        {
            "hc-key": "gb-2377",
            "value": 230
        },
        {
            "hc-key": "gb-7137",
            "value": 231
        },
        {
            "hc-key": "gb-7138",
            "value": 232
        },
        {
            "hc-key": "gb-7139",
            "value": 233
        },
        {
            "hc-key": "gb-7140",
            "value": 234
        },
        {
            "hc-key": "gb-7141",
            "value": 235
        },
        {
            "hc-key": "gb-2381",
            "value": 236
        },
        {
            "hc-key": "gb-2388",
            "value": 237
        },
        {
            "hc-key": "gb-7143",
            "value": 238
        },
        {
            "hc-key": "gb-7144",
            "value": 239
        },
        {
            "hc-key": "gb-7145",
            "value": 240
        },
        {
            "hc-key": "gb-7146",
            "value": 241
        },
        {
            "hc-key": "gb-7147",
            "value": 242
        },
        {
            "hc-key": "gb-7149",
            "value": 243
        },
        {
            "hc-key": "gb-2366",
            "value": 244
        },
        {
            "hc-key": "gb-7150",
            "value": 245
        },
        {
            "hc-key": "gb-7151",
            "value": 246
        },
        {
            "hc-key": "gb-pb",
            "value": 247
        },
        {
            "hc-key": "ie-so",
            "value": 248
        },
        {
            "hc-key": "gb-iw",
            "value": 249
        },
        {
            "hc-key": "gb-as",
            "value": 250
        },
        {
            "hc-key": "gb-mo",
            "value": 251
        },
        {
            "hc-key": "gb-ag",
            "value": 252
        },
        {
            "hc-key": "gb-fi",
            "value": 253
        },
        {
            "hc-key": "gb-el",
            "value": 254
        },
        {
            "hc-key": "gb-sm",
            "value": 255
        },
        {
            "hc-key": "gb-3577",
            "value": 256
        },
        {
            "hc-key": "gb-co",
            "value": 257
        },
        {
            "hc-key": "ie-mo",
            "value": 258
        },
        {
            "hc-key": "gb-sf",
            "value": 259
        },
        {
            "hc-key": "gb-mw",
            "value": 260
        },
        {
            "hc-key": "ie-ww",
            "value": 261
        },
        {
            "hc-key": "ie-ld",
            "value": 262
        },
        {
            "hc-key": "ie-cw",
            "value": 263
        },
        {
            "hc-key": "gb-cw",
            "value": 264
        },
        {
            "hc-key": "gb-lu",
            "value": 265
        },
        {
            "value": 266
        },
        {
            "hc-key": "gb-3271",
            "value": 267
        },
        {
            "value": 268
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/custom/british-isles-all.js">British Isles, admin1</a>'
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
            mapData: Highcharts.maps['custom/british-isles-all'],
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
        }, {
            name: 'Separators',
            type: 'mapline',
            data: Highcharts.geojson(Highcharts.maps['custom/british-isles-all'], 'mapline'),
            color: 'silver',
            showInLegend: false,
            enableMouseTracking: false
        }]
    });
});
