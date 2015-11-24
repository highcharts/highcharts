$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "ca-yt-6001",
            "value": 0
        },
        {
            "hc-key": "ca-on-3560",
            "value": 1
        },
        {
            "hc-key": "ca-qc-2499",
            "value": 2
        },
        {
            "hc-key": "ca-qc-2489",
            "value": 3
        },
        {
            "hc-key": "ca-nl-1011",
            "value": 4
        },
        {
            "hc-key": "ca-nu-6205",
            "value": 5
        },
        {
            "hc-key": "ca-mb-4623",
            "value": 6
        },
        {
            "hc-key": "ca-bc-5945",
            "value": 7
        },
        {
            "hc-key": "ca-bc-5943",
            "value": 8
        },
        {
            "hc-key": "ca-bc-5949",
            "value": 9
        },
        {
            "hc-key": "ca-bc-5947",
            "value": 10
        },
        {
            "hc-key": "ca-nu-6204",
            "value": 11
        },
        {
            "hc-key": "ca-nu-6208",
            "value": 12
        },
        {
            "hc-key": "ca-ab-4817",
            "value": 13
        },
        {
            "hc-key": "ca-bc-5959",
            "value": 14
        },
        {
            "hc-key": "ca-bc-5955",
            "value": 15
        },
        {
            "hc-key": "ca-bc-5957",
            "value": 16
        },
        {
            "hc-key": "ca-nt-6106",
            "value": 17
        },
        {
            "hc-key": "ca-nt-6101",
            "value": 18
        },
        {
            "hc-key": "ca-qc-2401",
            "value": 19
        },
        {
            "hc-key": "ca-ab-4816",
            "value": 20
        },
        {
            "hc-key": "ca-sk-4718",
            "value": 21
        },
        {
            "hc-key": "ca-on-3556",
            "value": 22
        },
        {
            "hc-key": "ca-sk-4702",
            "value": 23
        },
        {
            "hc-key": "ca-sk-4701",
            "value": 24
        },
        {
            "hc-key": "ca-on-3558",
            "value": 25
        },
        {
            "hc-key": "ca-qc-2402",
            "value": 26
        },
        {
            "hc-key": "ca-qc-2462",
            "value": 27
        },
        {
            "hc-key": "ca-qc-2490",
            "value": 28
        },
        {
            "hc-key": "ca-nb-1315",
            "value": 29
        },
        {
            "hc-key": "ca-qc-2497",
            "value": 30
        },
        {
            "hc-key": "ca-qc-2496",
            "value": 31
        },
        {
            "hc-key": "ca-sk-4709",
            "value": 32
        },
        {
            "hc-key": "ca-on-3551",
            "value": 33
        },
        {
            "hc-key": "ca-qc-2458",
            "value": 34
        },
        {
            "hc-key": "ca-bc-5933",
            "value": 35
        },
        {
            "hc-key": "ca-bc-5941",
            "value": 36
        },
        {
            "hc-key": "ca-ns-1209",
            "value": 37
        },
        {
            "hc-key": "ca-ns-1213",
            "value": 38
        },
        {
            "hc-key": "ca-ns-1201",
            "value": 39
        },
        {
            "hc-key": "ca-mb-4601",
            "value": 40
        },
        {
            "hc-key": "ca-bc-5929",
            "value": 41
        },
        {
            "hc-key": "ca-sk-4711",
            "value": 42
        },
        {
            "hc-key": "ca-nb-1309",
            "value": 43
        },
        {
            "hc-key": "ca-qc-2486",
            "value": 44
        },
        {
            "hc-key": "ca-qc-2487",
            "value": 45
        },
        {
            "hc-key": "ca-qc-2488",
            "value": 46
        },
        {
            "hc-key": "ca-on-3559",
            "value": 47
        },
        {
            "hc-key": "ca-qc-2492",
            "value": 48
        },
        {
            "hc-key": "ca-qc-2485",
            "value": 49
        },
        {
            "hc-key": "ca-on-3507",
            "value": 50
        },
        {
            "hc-key": "ca-nl-1005",
            "value": 51
        },
        {
            "hc-key": "ca-bc-5953",
            "value": 52
        },
        {
            "hc-key": "ca-nt-6104",
            "value": 53
        },
        {
            "hc-key": "ca-sk-4712",
            "value": 54
        },
        {
            "hc-key": "ca-sk-4716",
            "value": 55
        },
        {
            "hc-key": "ca-nb-1304",
            "value": 56
        },
        {
            "hc-key": "ca-nb-1308",
            "value": 57
        },
        {
            "hc-key": "ca-nb-1303",
            "value": 58
        },
        {
            "hc-key": "ca-nb-1305",
            "value": 59
        },
        {
            "hc-key": "ca-nb-1306",
            "value": 60
        },
        {
            "hc-key": "ca-nb-1307",
            "value": 61
        },
        {
            "hc-key": "ca-on-3520",
            "value": 62
        },
        {
            "hc-key": "ca-nb-1302",
            "value": 63
        },
        {
            "hc-key": "ca-nb-1301",
            "value": 64
        },
        {
            "hc-key": "ca-on-3521",
            "value": 65
        },
        {
            "hc-key": "ca-ns-1218",
            "value": 66
        },
        {
            "hc-key": "ca-sk-4706",
            "value": 67
        },
        {
            "hc-key": "ca-sk-4707",
            "value": 68
        },
        {
            "hc-key": "ca-sk-4703",
            "value": 69
        },
        {
            "hc-key": "ca-sk-4705",
            "value": 70
        },
        {
            "hc-key": "ca-on-3547",
            "value": 71
        },
        {
            "hc-key": "ca-qc-2484",
            "value": 72
        },
        {
            "hc-key": "ca-qc-2482",
            "value": 73
        },
        {
            "hc-key": "ca-qc-2483",
            "value": 74
        },
        {
            "hc-key": "ca-qc-2480",
            "value": 75
        },
        {
            "hc-key": "ca-qc-2478",
            "value": 76
        },
        {
            "hc-key": "ca-on-3557",
            "value": 77
        },
        {
            "hc-key": "ca-qc-2406",
            "value": 78
        },
        {
            "hc-key": "ca-bc-5903",
            "value": 79
        },
        {
            "hc-key": "ca-qc-2405",
            "value": 80
        },
        {
            "hc-key": "ca-qc-2404",
            "value": 81
        },
        {
            "hc-key": "ca-ab-4803",
            "value": 82
        },
        {
            "hc-key": "ca-bc-5901",
            "value": 83
        },
        {
            "hc-key": "ca-bc-5907",
            "value": 84
        },
        {
            "hc-key": "ca-bc-5935",
            "value": 85
        },
        {
            "hc-key": "ca-bc-5939",
            "value": 86
        },
        {
            "hc-key": "ca-bc-5905",
            "value": 87
        },
        {
            "hc-key": "ca-qc-2408",
            "value": 88
        },
        {
            "hc-key": "ca-qc-2409",
            "value": 89
        },
        {
            "hc-key": "ca-qc-2464",
            "value": 90
        },
        {
            "hc-key": "ca-qc-2465",
            "value": 91
        },
        {
            "hc-key": "ca-qc-2466",
            "value": 92
        },
        {
            "hc-key": "ca-qc-2460",
            "value": 93
        },
        {
            "hc-key": "ca-qc-2461",
            "value": 94
        },
        {
            "hc-key": "ca-qc-2463",
            "value": 95
        },
        {
            "hc-key": "ca-qc-2468",
            "value": 96
        },
        {
            "hc-key": "ca-qc-2467",
            "value": 97
        },
        {
            "hc-key": "ca-qc-2469",
            "value": 98
        },
        {
            "hc-key": "ca-qc-2407",
            "value": 99
        },
        {
            "hc-key": "ca-qc-2491",
            "value": 100
        },
        {
            "hc-key": "ca-qc-2493",
            "value": 101
        },
        {
            "hc-key": "ca-qc-2416",
            "value": 102
        },
        {
            "hc-key": "ca-on-3538",
            "value": 103
        },
        {
            "hc-key": "ca-on-3540",
            "value": 104
        },
        {
            "hc-key": "ca-on-3523",
            "value": 105
        },
        {
            "hc-key": "ca-on-3541",
            "value": 106
        },
        {
            "hc-key": "ca-qc-2494",
            "value": 107
        },
        {
            "hc-key": "ca-qc-2411",
            "value": 108
        },
        {
            "hc-key": "ca-qc-2410",
            "value": 109
        },
        {
            "hc-key": "ca-qc-2413",
            "value": 110
        },
        {
            "hc-key": "ca-qc-2412",
            "value": 111
        },
        {
            "hc-key": "ca-bc-5919",
            "value": 112
        },
        {
            "hc-key": "ca-qc-2414",
            "value": 113
        },
        {
            "hc-key": "ca-qc-2417",
            "value": 114
        },
        {
            "hc-key": "ca-bc-5909",
            "value": 115
        },
        {
            "hc-key": "ca-bc-5915",
            "value": 116
        },
        {
            "hc-key": "ca-bc-5917",
            "value": 117
        },
        {
            "hc-key": "ca-qc-2477",
            "value": 118
        },
        {
            "hc-key": "ca-qc-2476",
            "value": 119
        },
        {
            "hc-key": "ca-on-3502",
            "value": 120
        },
        {
            "hc-key": "ca-qc-2475",
            "value": 121
        },
        {
            "hc-key": "ca-qc-2474",
            "value": 122
        },
        {
            "hc-key": "ca-qc-2473",
            "value": 123
        },
        {
            "hc-key": "ca-qc-2472",
            "value": 124
        },
        {
            "hc-key": "ca-on-3501",
            "value": 125
        },
        {
            "hc-key": "ca-qc-2471",
            "value": 126
        },
        {
            "hc-key": "ca-qc-2470",
            "value": 127
        },
        {
            "hc-key": "ca-on-3518",
            "value": 128
        },
        {
            "hc-key": "ca-ns-1203",
            "value": 129
        },
        {
            "hc-key": "ca-nb-1313",
            "value": 130
        },
        {
            "hc-key": "ca-ab-4801",
            "value": 131
        },
        {
            "hc-key": "ca-ab-4802",
            "value": 132
        },
        {
            "hc-key": "ca-ab-4805",
            "value": 133
        },
        {
            "hc-key": "ca-ab-4804",
            "value": 134
        },
        {
            "hc-key": "ca-ab-4806",
            "value": 135
        },
        {
            "hc-key": "ca-ab-4807",
            "value": 136
        },
        {
            "hc-key": "ca-ab-4808",
            "value": 137
        },
        {
            "hc-key": "ca-ab-4809",
            "value": 138
        },
        {
            "hc-key": "ca-qc-2445",
            "value": 139
        },
        {
            "hc-key": "ca-qc-2446",
            "value": 140
        },
        {
            "hc-key": "ca-on-3554",
            "value": 141
        },
        {
            "hc-key": "ca-qc-2431",
            "value": 142
        },
        {
            "hc-key": "ca-qc-2429",
            "value": 143
        },
        {
            "hc-key": "ca-qc-2430",
            "value": 144
        },
        {
            "hc-key": "ca-qc-2432",
            "value": 145
        },
        {
            "hc-key": "ca-nl-1010",
            "value": 146
        },
        {
            "hc-key": "ca-nb-1312",
            "value": 147
        },
        {
            "hc-key": "ca-qc-2495",
            "value": 148
        },
        {
            "hc-key": "ca-qc-2442",
            "value": 149
        },
        {
            "hc-key": "ca-qc-2440",
            "value": 150
        },
        {
            "hc-key": "ca-qc-2439",
            "value": 151
        },
        {
            "hc-key": "ca-qc-2441",
            "value": 152
        },
        {
            "hc-key": "ca-qc-2447",
            "value": 153
        },
        {
            "hc-key": "ca-qc-2444",
            "value": 154
        },
        {
            "hc-key": "ca-qc-2448",
            "value": 155
        },
        {
            "hc-key": "ca-qc-2449",
            "value": 156
        },
        {
            "hc-key": "ca-qc-2438",
            "value": 157
        },
        {
            "hc-key": "ca-mb-4620",
            "value": 158
        },
        {
            "hc-key": "ca-qc-2418",
            "value": 159
        },
        {
            "hc-key": "ca-on-3552",
            "value": 160
        },
        {
            "hc-key": "ca-on-3548",
            "value": 161
        },
        {
            "hc-key": "ca-ab-4811",
            "value": 162
        },
        {
            "hc-key": "ca-ab-4814",
            "value": 163
        },
        {
            "hc-key": "ca-ab-4810",
            "value": 164
        },
        {
            "hc-key": "ca-ab-4812",
            "value": 165
        },
        {
            "hc-key": "ca-ab-4819",
            "value": 166
        },
        {
            "hc-key": "ca-ab-4815",
            "value": 167
        },
        {
            "hc-key": "ca-on-3506",
            "value": 168
        },
        {
            "hc-key": "ca-nl-1007",
            "value": 169
        },
        {
            "hc-key": "ca-nl-1003",
            "value": 170
        },
        {
            "hc-key": "ca-nl-1008",
            "value": 171
        },
        {
            "hc-key": "ca-nl-1006",
            "value": 172
        },
        {
            "hc-key": "ca-nl-1004",
            "value": 173
        },
        {
            "hc-key": "ca-nl-1001",
            "value": 174
        },
        {
            "hc-key": "ca-qc-2415",
            "value": 175
        },
        {
            "hc-key": "ca-qc-2459",
            "value": 176
        },
        {
            "hc-key": "ca-qc-2455",
            "value": 177
        },
        {
            "hc-key": "ca-qc-2454",
            "value": 178
        },
        {
            "hc-key": "ca-qc-2457",
            "value": 179
        },
        {
            "hc-key": "ca-qc-2456",
            "value": 180
        },
        {
            "hc-key": "ca-qc-2451",
            "value": 181
        },
        {
            "hc-key": "ca-qc-2450",
            "value": 182
        },
        {
            "hc-key": "ca-qc-2453",
            "value": 183
        },
        {
            "hc-key": "ca-qc-2452",
            "value": 184
        },
        {
            "hc-key": "ca-sk-4708",
            "value": 185
        },
        {
            "hc-key": "ca-on-3519",
            "value": 186
        },
        {
            "hc-key": "ca-on-3513",
            "value": 187
        },
        {
            "hc-key": "ca-on-3511",
            "value": 188
        },
        {
            "hc-key": "ca-on-3512",
            "value": 189
        },
        {
            "hc-key": "ca-on-3510",
            "value": 190
        },
        {
            "hc-key": "ca-ns-1210",
            "value": 191
        },
        {
            "hc-key": "ca-on-3515",
            "value": 192
        },
        {
            "hc-key": "ca-on-3516",
            "value": 193
        },
        {
            "hc-key": "ca-qc-2433",
            "value": 194
        },
        {
            "hc-key": "ca-ns-1204",
            "value": 195
        },
        {
            "hc-key": "ca-ns-1206",
            "value": 196
        },
        {
            "hc-key": "ca-qc-2403",
            "value": 197
        },
        {
            "hc-key": "ca-ns-1212",
            "value": 198
        },
        {
            "hc-key": "ca-on-3544",
            "value": 199
        },
        {
            "hc-key": "ca-ns-1211",
            "value": 200
        },
        {
            "hc-key": "ca-ns-1216",
            "value": 201
        },
        {
            "hc-key": "ca-ns-1215",
            "value": 202
        },
        {
            "hc-key": "ca-ns-1217",
            "value": 203
        },
        {
            "hc-key": "ca-ns-1214",
            "value": 204
        },
        {
            "hc-key": "ca-on-3509",
            "value": 205
        },
        {
            "hc-key": "ca-ns-1202",
            "value": 206
        },
        {
            "hc-key": "ca-qc-2422",
            "value": 207
        },
        {
            "hc-key": "ca-on-3546",
            "value": 208
        },
        {
            "hc-key": "ca-qc-2426",
            "value": 209
        },
        {
            "hc-key": "ca-qc-2427",
            "value": 210
        },
        {
            "hc-key": "ca-qc-2419",
            "value": 211
        },
        {
            "hc-key": "ca-on-3526",
            "value": 212
        },
        {
            "hc-key": "ca-on-3524",
            "value": 213
        },
        {
            "hc-key": "ca-on-3525",
            "value": 214
        },
        {
            "hc-key": "ca-on-3529",
            "value": 215
        },
        {
            "hc-key": "ca-on-3522",
            "value": 216
        },
        {
            "hc-key": "ca-mb-4608",
            "value": 217
        },
        {
            "hc-key": "ca-mb-4609",
            "value": 218
        },
        {
            "hc-key": "ca-mb-4606",
            "value": 219
        },
        {
            "hc-key": "ca-mb-4607",
            "value": 220
        },
        {
            "hc-key": "ca-mb-4604",
            "value": 221
        },
        {
            "hc-key": "ca-mb-4605",
            "value": 222
        },
        {
            "hc-key": "ca-mb-4602",
            "value": 223
        },
        {
            "hc-key": "ca-mb-4603",
            "value": 224
        },
        {
            "hc-key": "ca-mb-4610",
            "value": 225
        },
        {
            "hc-key": "ca-on-3528",
            "value": 226
        },
        {
            "hc-key": "ca-on-3531",
            "value": 227
        },
        {
            "hc-key": "ca-ab-4818",
            "value": 228
        },
        {
            "hc-key": "ca-bc-5951",
            "value": 229
        },
        {
            "hc-key": "ca-on-3542",
            "value": 230
        },
        {
            "hc-key": "ca-on-3530",
            "value": 231
        },
        {
            "hc-key": "ca-qc-2481",
            "value": 232
        },
        {
            "hc-key": "ca-on-3543",
            "value": 233
        },
        {
            "hc-key": "ca-on-3539",
            "value": 234
        },
        {
            "hc-key": "ca-pe-1102",
            "value": 235
        },
        {
            "hc-key": "ca-pe-1103",
            "value": 236
        },
        {
            "hc-key": "ca-pe-1101",
            "value": 237
        },
        {
            "hc-key": "ca-on-3514",
            "value": 238
        },
        {
            "hc-key": "ca-qc-2428",
            "value": 239
        },
        {
            "hc-key": "ca-ns-1208",
            "value": 240
        },
        {
            "hc-key": "ca-ns-1205",
            "value": 241
        },
        {
            "hc-key": "ca-ns-1207",
            "value": 242
        },
        {
            "hc-key": "ca-qc-2435",
            "value": 243
        },
        {
            "hc-key": "ca-qc-2434",
            "value": 244
        },
        {
            "hc-key": "ca-qc-2437",
            "value": 245
        },
        {
            "hc-key": "ca-qc-2436",
            "value": 246
        },
        {
            "hc-key": "ca-mb-4618",
            "value": 247
        },
        {
            "hc-key": "ca-on-3532",
            "value": 248
        },
        {
            "hc-key": "ca-on-3534",
            "value": 249
        },
        {
            "hc-key": "ca-on-3537",
            "value": 250
        },
        {
            "hc-key": "ca-on-3536",
            "value": 251
        },
        {
            "hc-key": "ca-mb-4611",
            "value": 252
        },
        {
            "hc-key": "ca-mb-4614",
            "value": 253
        },
        {
            "hc-key": "ca-mb-4613",
            "value": 254
        },
        {
            "hc-key": "ca-mb-4619",
            "value": 255
        },
        {
            "hc-key": "ca-mb-4612",
            "value": 256
        },
        {
            "hc-key": "ca-mb-4615",
            "value": 257
        },
        {
            "hc-key": "ca-mb-4617",
            "value": 258
        },
        {
            "hc-key": "ca-mb-4616",
            "value": 259
        },
        {
            "hc-key": "ca-nb-1314",
            "value": 260
        },
        {
            "hc-key": "ca-nb-1311",
            "value": 261
        },
        {
            "hc-key": "ca-nt-6105",
            "value": 262
        },
        {
            "hc-key": "ca-nt-6102",
            "value": 263
        },
        {
            "hc-key": "ca-bc-5923",
            "value": 264
        },
        {
            "hc-key": "ca-bc-5924",
            "value": 265
        },
        {
            "hc-key": "ca-bc-5926",
            "value": 266
        },
        {
            "hc-key": "ca-bc-5927",
            "value": 267
        },
        {
            "hc-key": "ca-bc-5921",
            "value": 268
        },
        {
            "hc-key": "ca-qc-2421",
            "value": 269
        },
        {
            "hc-key": "ca-qc-2420",
            "value": 270
        },
        {
            "hc-key": "ca-qc-2423",
            "value": 271
        },
        {
            "hc-key": "ca-qc-2425",
            "value": 272
        },
        {
            "hc-key": "ca-mb-4621",
            "value": 273
        },
        {
            "hc-key": "ca-sk-4714",
            "value": 274
        },
        {
            "hc-key": "ca-sk-4717",
            "value": 275
        },
        {
            "hc-key": "ca-sk-4715",
            "value": 276
        },
        {
            "hc-key": "ca-sk-4710",
            "value": 277
        },
        {
            "hc-key": "ca-sk-4713",
            "value": 278
        },
        {
            "hc-key": "ca-on-3549",
            "value": 279
        },
        {
            "hc-key": "ca-qc-2479",
            "value": 280
        },
        {
            "hc-key": "ca-nl-1002",
            "value": 281
        },
        {
            "hc-key": "ca-bc-5937",
            "value": 282
        },
        {
            "hc-key": "ca-bc-5931",
            "value": 283
        },
        {
            "hc-key": "ca-nb-1310",
            "value": 284
        },
        {
            "hc-key": "ca-qc-2443",
            "value": 285
        },
        {
            "hc-key": "ca-ab-4813",
            "value": 286
        },
        {
            "hc-key": "ca-nl-1009",
            "value": 287
        },
        {
            "hc-key": "ca-qc-2498",
            "value": 288
        },
        {
            "hc-key": "ca-sk-4704",
            "value": 289
        },
        {
            "hc-key": "ca-mb-4622",
            "value": 290
        },
        {
            "hc-key": "ca-nt-6103",
            "value": 291
        },
        {
            "hc-key": "ca-on-3553",
            "value": 292
        },
        {
            "value": 293
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/ca/ca-all-all.js">Canada, admin2</a>'
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
            mapData: Highcharts.maps['countries/ca/ca-all-all'],
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
