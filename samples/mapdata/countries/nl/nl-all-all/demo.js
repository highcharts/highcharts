$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "nl-fr-gm0088",
            "value": 0
        },
        {
            "hc-key": "nl-3557-gm0448",
            "value": 1
        },
        {
            "hc-key": "nl-gr-gm1651",
            "value": 2
        },
        {
            "hc-key": "nl-ze-gm1676",
            "value": 3
        },
        {
            "hc-key": "nl-fr-gm1900",
            "value": 4
        },
        {
            "hc-key": "nl-3560-gm1924",
            "value": 5
        },
        {
            "hc-key": "nl-gr-gm0007",
            "value": 6
        },
        {
            "hc-key": "nl-fl-gm0050",
            "value": 7
        },
        {
            "hc-key": "nl-fl-gm0034",
            "value": 8
        },
        {
            "hc-key": "nl-ov-gm0193",
            "value": 9
        },
        {
            "hc-key": "nl-3559-gm0307",
            "value": 10
        },
        {
            "hc-key": "nl-3559-gm0308",
            "value": 11
        },
        {
            "hc-key": "nl-3557-gm1911",
            "value": 12
        },
        {
            "hc-key": "nl-3557-gm0398",
            "value": 13
        },
        {
            "hc-key": "nl-ov-gm0153",
            "value": 14
        },
        {
            "hc-key": "nl-3557-gm0394",
            "value": 15
        },
        {
            "hc-key": "nl-3557-gm0358",
            "value": 16
        },
        {
            "hc-key": "nl-3560-gm0629",
            "value": 17
        },
        {
            "hc-key": "nl-li-gm1640",
            "value": 18
        },
        {
            "hc-key": "nl-3559-gm0632",
            "value": 19
        },
        {
            "hc-key": "nl-3560-gm1901",
            "value": 20
        },
        {
            "hc-key": "nl-3560-gm0599",
            "value": 21
        },
        {
            "hc-key": "nl-3560-gm0612",
            "value": 22
        },
        {
            "hc-key": "nl-3560-gm0614",
            "value": 23
        },
        {
            "hc-key": "nl-ge-gm1586",
            "value": 24
        },
        {
            "hc-key": "nl-ge-gm0197",
            "value": 25
        },
        {
            "hc-key": "nl-ge-gm1859",
            "value": 26
        },
        {
            "hc-key": "nl-ov-gm1708",
            "value": 27
        },
        {
            "hc-key": "nl-dr-gm0119",
            "value": 28
        },
        {
            "hc-key": "nl-fr-gm0079",
            "value": 29
        },
        {
            "hc-key": "nl-fr-gm0058",
            "value": 30
        },
        {
            "hc-key": "nl-fr-gm0072",
            "value": 31
        },
        {
            "hc-key": "nl-fr-gm0093",
            "value": 32
        },
        {
            "hc-key": "nl-ov-gm0166",
            "value": 33
        },
        {
            "hc-key": "nl-ge-gm0244",
            "value": 34
        },
        {
            "hc-key": "nl-ge-gm0269",
            "value": 35
        },
        {
            "hc-key": "nl-fl-gm0171",
            "value": 36
        },
        {
            "hc-key": "nl-fl-gm0303",
            "value": 37
        },
        {
            "hc-key": "nl-ge-gm0302",
            "value": 38
        },
        {
            "hc-key": "nl-3557-gm0363",
            "value": 39
        },
        {
            "hc-key": "nl-3557-gm0392",
            "value": 40
        },
        {
            "hc-key": "nl-3557-gm0479",
            "value": 41
        },
        {
            "hc-key": "nl-3557-gm0431",
            "value": 42
        },
        {
            "hc-key": "nl-3557-gm0437",
            "value": 43
        },
        {
            "hc-key": "nl-3559-gm0736",
            "value": 44
        },
        {
            "hc-key": "nl-3557-gm0417",
            "value": 45
        },
        {
            "hc-key": "nl-3557-gm0376",
            "value": 46
        },
        {
            "hc-key": "nl-3559-gm0317",
            "value": 47
        },
        {
            "hc-key": "nl-3557-gm0420",
            "value": 48
        },
        {
            "hc-key": "nl-3557-gm0405",
            "value": 49
        },
        {
            "hc-key": "nl-3557-gm1598",
            "value": 50
        },
        {
            "hc-key": "nl-3557-gm0424",
            "value": 51
        },
        {
            "hc-key": "nl-3557-gm0453",
            "value": 52
        },
        {
            "hc-key": "nl-3557-gm0375",
            "value": 53
        },
        {
            "hc-key": "nl-ze-gm0664",
            "value": 54
        },
        {
            "hc-key": "nl-ze-gm0654",
            "value": 55
        },
        {
            "hc-key": "nl-ze-gm1695",
            "value": 56
        },
        {
            "hc-key": "nl-ze-gm0687",
            "value": 57
        },
        {
            "hc-key": "nl-ze-gm0677",
            "value": 58
        },
        {
            "hc-key": "nl-3558-gm0748",
            "value": 59
        },
        {
            "hc-key": "nl-ze-gm0716",
            "value": 60
        },
        {
            "hc-key": "nl-ze-gm0717",
            "value": 61
        },
        {
            "hc-key": "nl-3558-gm1723",
            "value": 62
        },
        {
            "hc-key": "nl-3558-gm0744",
            "value": 63
        },
        {
            "hc-key": "nl-fl-gm0995",
            "value": 64
        },
        {
            "hc-key": "nl-3557-gm0388",
            "value": 65
        },
        {
            "hc-key": "nl-gr-gm0005",
            "value": 66
        },
        {
            "hc-key": "nl-gr-gm1663",
            "value": 67
        },
        {
            "hc-key": "nl-gr-gm0053",
            "value": 68
        },
        {
            "hc-key": "nl-gr-gm0056",
            "value": 69
        },
        {
            "hc-key": "nl-3558-gm1719",
            "value": 70
        },
        {
            "hc-key": "nl-3558-gm1709",
            "value": 71
        },
        {
            "hc-key": "nl-3558-gm0758",
            "value": 72
        },
        {
            "hc-key": "nl-3558-gm1655",
            "value": 73
        },
        {
            "hc-key": "nl-gr-gm1895",
            "value": 74
        },
        {
            "hc-key": "nl-gr-gm1987",
            "value": 75
        },
        {
            "hc-key": "nl-gr-gm0040",
            "value": 76
        },
        {
            "hc-key": "nl-fr-gm0140",
            "value": 77
        },
        {
            "hc-key": "nl-fr-gm0055",
            "value": 78
        },
        {
            "hc-key": "nl-fr-gm0051",
            "value": 79
        },
        {
            "hc-key": "nl-fr-gm0653",
            "value": 80
        },
        {
            "hc-key": "nl-3558-gm0828",
            "value": 81
        },
        {
            "hc-key": "nl-3558-gm1671",
            "value": 82
        },
        {
            "hc-key": "nl-gr-gm0010",
            "value": 83
        },
        {
            "hc-key": "nl-gr-gm0024",
            "value": 84
        },
        {
            "hc-key": "nl-gr-gm0003",
            "value": 85
        },
        {
            "hc-key": "nl-ge-gm0267",
            "value": 86
        },
        {
            "hc-key": "nl-fr-gm1891",
            "value": 87
        },
        {
            "hc-key": "nl-fr-gm1722",
            "value": 88
        },
        {
            "hc-key": "nl-fr-gm0096",
            "value": 89
        },
        {
            "hc-key": "nl-ov-gm1896",
            "value": 90
        },
        {
            "hc-key": "nl-ge-gm0232",
            "value": 91
        },
        {
            "hc-key": "nl-fr-gm0082",
            "value": 92
        },
        {
            "hc-key": "nl-ge-gm0230",
            "value": 93
        },
        {
            "hc-key": "nl-ge-gm0243",
            "value": 94
        },
        {
            "hc-key": "nl-ge-gm0233",
            "value": 95
        },
        {
            "hc-key": "nl-ge-gm0203",
            "value": 96
        },
        {
            "hc-key": "nl-ge-gm0273",
            "value": 97
        },
        {
            "hc-key": "nl-3559-gm0313",
            "value": 98
        },
        {
            "hc-key": "nl-3557-gm0451",
            "value": 99
        },
        {
            "hc-key": "nl-3557-gm0362",
            "value": 100
        },
        {
            "hc-key": "nl-3557-gm0415",
            "value": 101
        },
        {
            "hc-key": "nl-3557-gm0384",
            "value": 102
        },
        {
            "hc-key": "nl-3557-gm0432",
            "value": 103
        },
        {
            "hc-key": "nl-3557-gm0532",
            "value": 104
        },
        {
            "hc-key": "nl-3557-gm0457",
            "value": 105
        },
        {
            "hc-key": "nl-3557-gm0425",
            "value": 106
        },
        {
            "hc-key": "nl-3557-gm0381",
            "value": 107
        },
        {
            "hc-key": "nl-3557-gm0402",
            "value": 108
        },
        {
            "hc-key": "nl-3557-gm0406",
            "value": 109
        },
        {
            "hc-key": "nl-3557-gm0377",
            "value": 110
        },
        {
            "hc-key": "nl-3560-gm0588",
            "value": 111
        },
        {
            "hc-key": "nl-3560-gm0584",
            "value": 112
        },
        {
            "hc-key": "nl-ze-gm0718",
            "value": 113
        },
        {
            "hc-key": "nl-ze-gm0678",
            "value": 114
        },
        {
            "hc-key": "nl-ze-gm0715",
            "value": 115
        },
        {
            "hc-key": "nl-ze-gm1714",
            "value": 116
        },
        {
            "hc-key": "nl-3558-gm0851",
            "value": 117
        },
        {
            "hc-key": "nl-3558-gm1674",
            "value": 118
        },
        {
            "hc-key": "nl-3560-gm1783",
            "value": 119
        },
        {
            "hc-key": "nl-3560-gm0518",
            "value": 120
        },
        {
            "hc-key": "nl-3560-gm0556",
            "value": 121
        },
        {
            "hc-key": "nl-3560-gm1842",
            "value": 122
        },
        {
            "hc-key": "nl-gr-gm0765",
            "value": 123
        },
        {
            "hc-key": "nl-fr-gm0070",
            "value": 124
        },
        {
            "hc-key": "nl-3557-gm0373",
            "value": 125
        },
        {
            "hc-key": "nl-3557-gm0441",
            "value": 126
        },
        {
            "hc-key": "nl-gr-gm0009",
            "value": 127
        },
        {
            "hc-key": "nl-gr-gm0014",
            "value": 128
        },
        {
            "hc-key": "nl-fr-gm0059",
            "value": 129
        },
        {
            "hc-key": "nl-fr-gm1908",
            "value": 130
        },
        {
            "hc-key": "nl-fr-gm0063",
            "value": 131
        },
        {
            "hc-key": "nl-gr-gm0022",
            "value": 132
        },
        {
            "hc-key": "nl-fr-gm0086",
            "value": 133
        },
        {
            "hc-key": "nl-gr-gm0015",
            "value": 134
        },
        {
            "hc-key": "nl-fr-gm0090",
            "value": 135
        },
        {
            "hc-key": "nl-gr-gm0025",
            "value": 136
        },
        {
            "hc-key": "nl-ov-gm0148",
            "value": 137
        },
        {
            "hc-key": "nl-ov-gm0160",
            "value": 138
        },
        {
            "hc-key": "nl-ov-gm0158",
            "value": 139
        },
        {
            "hc-key": "nl-ov-gm0164",
            "value": 140
        },
        {
            "hc-key": "nl-ov-gm0173",
            "value": 141
        },
        {
            "hc-key": "nl-ov-gm0163",
            "value": 142
        },
        {
            "hc-key": "nl-ov-gm0175",
            "value": 143
        },
        {
            "hc-key": "nl-ov-gm0177",
            "value": 144
        },
        {
            "hc-key": "nl-fl-gm0184",
            "value": 145
        },
        {
            "hc-key": "nl-ov-gm0180",
            "value": 146
        },
        {
            "hc-key": "nl-ge-gm0200",
            "value": 147
        },
        {
            "hc-key": "nl-ge-gm0202",
            "value": 148
        },
        {
            "hc-key": "nl-ge-gm1705",
            "value": 149
        },
        {
            "hc-key": "nl-ge-gm0241",
            "value": 150
        },
        {
            "hc-key": "nl-ge-gm0252",
            "value": 151
        },
        {
            "hc-key": "nl-ge-gm0265",
            "value": 152
        },
        {
            "hc-key": "nl-ge-gm0213",
            "value": 153
        },
        {
            "hc-key": "nl-ge-gm0277",
            "value": 154
        },
        {
            "hc-key": "nl-3559-gm0352",
            "value": 155
        },
        {
            "hc-key": "nl-ge-gm0216",
            "value": 156
        },
        {
            "hc-key": "nl-ge-gm0236",
            "value": 157
        },
        {
            "hc-key": "nl-ge-gm0281",
            "value": 158
        },
        {
            "hc-key": "nl-ge-gm0275",
            "value": 159
        },
        {
            "hc-key": "nl-ge-gm0293",
            "value": 160
        },
        {
            "hc-key": "nl-ge-gm0225",
            "value": 161
        },
        {
            "hc-key": "nl-ge-gm0296",
            "value": 162
        },
        {
            "hc-key": "nl-ge-gm0299",
            "value": 163
        },
        {
            "hc-key": "nl-ge-gm0222",
            "value": 164
        },
        {
            "hc-key": "nl-3559-gm0339",
            "value": 165
        },
        {
            "hc-key": "nl-ge-gm0279",
            "value": 166
        },
        {
            "hc-key": "nl-ge-gm0228",
            "value": 167
        },
        {
            "hc-key": "nl-3559-gm0340",
            "value": 168
        },
        {
            "hc-key": "nl-ge-gm0289",
            "value": 169
        },
        {
            "hc-key": "nl-3559-gm0344",
            "value": 170
        },
        {
            "hc-key": "nl-3559-gm0312",
            "value": 171
        },
        {
            "hc-key": "nl-3559-gm0321",
            "value": 172
        },
        {
            "hc-key": "nl-3559-gm0335",
            "value": 173
        },
        {
            "hc-key": "nl-3559-gm0353",
            "value": 174
        },
        {
            "hc-key": "nl-3559-gm0351",
            "value": 175
        },
        {
            "hc-key": "nl-3559-gm0355",
            "value": 176
        },
        {
            "hc-key": "nl-3557-gm0393",
            "value": 177
        },
        {
            "hc-key": "nl-3557-gm0365",
            "value": 178
        },
        {
            "hc-key": "nl-3557-gm0370",
            "value": 179
        },
        {
            "hc-key": "nl-3560-gm0534",
            "value": 180
        },
        {
            "hc-key": "nl-3557-gm0383",
            "value": 181
        },
        {
            "hc-key": "nl-3557-gm0361",
            "value": 182
        },
        {
            "hc-key": "nl-3557-gm0416",
            "value": 183
        },
        {
            "hc-key": "nl-3557-gm0439",
            "value": 184
        },
        {
            "hc-key": "nl-3557-gm0400",
            "value": 185
        },
        {
            "hc-key": "nl-3557-gm0385",
            "value": 186
        },
        {
            "hc-key": "nl-3557-gm0478",
            "value": 187
        },
        {
            "hc-key": "nl-3557-gm0396",
            "value": 188
        },
        {
            "hc-key": "nl-3560-gm0484",
            "value": 189
        },
        {
            "hc-key": "nl-3560-gm0499",
            "value": 190
        },
        {
            "hc-key": "nl-ge-gm0297",
            "value": 191
        },
        {
            "hc-key": "nl-3560-gm0512",
            "value": 192
        },
        {
            "hc-key": "nl-3558-gm0797",
            "value": 193
        },
        {
            "hc-key": "nl-3558-gm0865",
            "value": 194
        },
        {
            "hc-key": "nl-3560-gm0523",
            "value": 195
        },
        {
            "hc-key": "nl-3558-gm0870",
            "value": 196
        },
        {
            "hc-key": "nl-3560-gm0482",
            "value": 197
        },
        {
            "hc-key": "nl-3560-gm0531",
            "value": 198
        },
        {
            "hc-key": "nl-3560-gm0537",
            "value": 199
        },
        {
            "hc-key": "nl-3560-gm0545",
            "value": 200
        },
        {
            "hc-key": "nl-3560-gm0546",
            "value": 201
        },
        {
            "hc-key": "nl-3560-gm0553",
            "value": 202
        },
        {
            "hc-key": "nl-3560-gm0569",
            "value": 203
        },
        {
            "hc-key": "nl-3557-gm0473",
            "value": 204
        },
        {
            "hc-key": "nl-3560-gm0576",
            "value": 205
        },
        {
            "hc-key": "nl-3560-gm0489",
            "value": 206
        },
        {
            "hc-key": "nl-3560-gm0585",
            "value": 207
        },
        {
            "hc-key": "nl-3560-gm0610",
            "value": 208
        },
        {
            "hc-key": "nl-3560-gm0505",
            "value": 209
        },
        {
            "hc-key": "nl-3560-gm0617",
            "value": 210
        },
        {
            "hc-key": "nl-3560-gm0590",
            "value": 211
        },
        {
            "hc-key": "nl-3560-gm0503",
            "value": 212
        },
        {
            "hc-key": "nl-3560-gm1892",
            "value": 213
        },
        {
            "hc-key": "nl-3560-gm0644",
            "value": 214
        },
        {
            "hc-key": "nl-3560-gm0623",
            "value": 215
        },
        {
            "hc-key": "nl-3560-gm0491",
            "value": 216
        },
        {
            "hc-key": "nl-3560-gm0611",
            "value": 217
        },
        {
            "hc-key": "nl-3560-gm0613",
            "value": 218
        },
        {
            "hc-key": "nl-3560-gm0608",
            "value": 219
        },
        {
            "hc-key": "nl-3559-gm0331",
            "value": 220
        },
        {
            "hc-key": "nl-3560-gm0620",
            "value": 221
        },
        {
            "hc-key": "nl-3559-gm0356",
            "value": 222
        },
        {
            "hc-key": "nl-3560-gm0622",
            "value": 223
        },
        {
            "hc-key": "nl-3560-gm0626",
            "value": 224
        },
        {
            "hc-key": "nl-3560-gm0547",
            "value": 225
        },
        {
            "hc-key": "nl-3560-gm0638",
            "value": 226
        },
        {
            "hc-key": "nl-3560-gm0642",
            "value": 227
        },
        {
            "hc-key": "nl-3560-gm0597",
            "value": 228
        },
        {
            "hc-key": "nl-3560-gm0542",
            "value": 229
        },
        {
            "hc-key": "nl-3560-gm0643",
            "value": 230
        },
        {
            "hc-key": "nl-3560-gm0502",
            "value": 231
        },
        {
            "hc-key": "nl-3560-gm0513",
            "value": 232
        },
        {
            "hc-key": "nl-ge-gm0263",
            "value": 233
        },
        {
            "hc-key": "nl-ge-gm0668",
            "value": 234
        },
        {
            "hc-key": "nl-3560-gm0689",
            "value": 235
        },
        {
            "hc-key": "nl-ge-gm0733",
            "value": 236
        },
        {
            "hc-key": "nl-ge-gm0304",
            "value": 237
        },
        {
            "hc-key": "nl-3559-gm1904",
            "value": 238
        },
        {
            "hc-key": "nl-3558-gm0753",
            "value": 239
        },
        {
            "hc-key": "nl-3558-gm0772",
            "value": 240
        },
        {
            "hc-key": "nl-3558-gm0848",
            "value": 241
        },
        {
            "hc-key": "nl-3558-gm0855",
            "value": 242
        },
        {
            "hc-key": "nl-3558-gm0766",
            "value": 243
        },
        {
            "hc-key": "nl-3558-gm0784",
            "value": 244
        },
        {
            "hc-key": "nl-3558-gm0779",
            "value": 245
        },
        {
            "hc-key": "nl-3558-gm0785",
            "value": 246
        },
        {
            "hc-key": "nl-3558-gm0796",
            "value": 247
        },
        {
            "hc-key": "nl-3558-gm0798",
            "value": 248
        },
        {
            "hc-key": "nl-3558-gm1667",
            "value": 249
        },
        {
            "hc-key": "nl-3558-gm0823",
            "value": 250
        },
        {
            "hc-key": "nl-3558-gm1728",
            "value": 251
        },
        {
            "hc-key": "nl-3558-gm1659",
            "value": 252
        },
        {
            "hc-key": "nl-3558-gm0820",
            "value": 253
        },
        {
            "hc-key": "nl-3558-gm0846",
            "value": 254
        },
        {
            "hc-key": "nl-3558-gm0845",
            "value": 255
        },
        {
            "hc-key": "nl-3558-gm0794",
            "value": 256
        },
        {
            "hc-key": "nl-3558-gm1652",
            "value": 257
        },
        {
            "hc-key": "nl-3558-gm0847",
            "value": 258
        },
        {
            "hc-key": "nl-3557-gm0852",
            "value": 259
        },
        {
            "hc-key": "nl-3558-gm0815",
            "value": 260
        },
        {
            "hc-key": "nl-3558-gm1685",
            "value": 261
        },
        {
            "hc-key": "nl-3558-gm0786",
            "value": 262
        },
        {
            "hc-key": "nl-3558-gm0856",
            "value": 263
        },
        {
            "hc-key": "nl-3558-gm0858",
            "value": 264
        },
        {
            "hc-key": "nl-3558-gm0757",
            "value": 265
        },
        {
            "hc-key": "nl-3558-gm1724",
            "value": 266
        },
        {
            "hc-key": "nl-3558-gm0861",
            "value": 267
        },
        {
            "hc-key": "nl-3558-gm0866",
            "value": 268
        },
        {
            "hc-key": "nl-3558-gm0867",
            "value": 269
        },
        {
            "hc-key": "nl-3558-gm0874",
            "value": 270
        },
        {
            "hc-key": "nl-3557-gm0880",
            "value": 271
        },
        {
            "hc-key": "nl-li-gm0889",
            "value": 272
        },
        {
            "hc-key": "nl-li-gm0899",
            "value": 273
        },
        {
            "hc-key": "nl-li-gm0881",
            "value": 274
        },
        {
            "hc-key": "nl-li-gm0882",
            "value": 275
        },
        {
            "hc-key": "nl-li-gm0917",
            "value": 276
        },
        {
            "hc-key": "nl-li-gm0888",
            "value": 277
        },
        {
            "hc-key": "nl-li-gm0971",
            "value": 278
        },
        {
            "hc-key": "nl-li-gm1883",
            "value": 279
        },
        {
            "hc-key": "nl-li-gm0938",
            "value": 280
        },
        {
            "hc-key": "nl-li-gm0962",
            "value": 281
        },
        {
            "hc-key": "nl-li-gm0935",
            "value": 282
        },
        {
            "hc-key": "nl-li-gm0994",
            "value": 283
        },
        {
            "hc-key": "nl-li-gm0986",
            "value": 284
        },
        {
            "hc-key": "nl-3560-gm1525",
            "value": 285
        },
        {
            "hc-key": "nl-3559-gm0345",
            "value": 286
        },
        {
            "hc-key": "nl-3559-gm1581",
            "value": 287
        },
        {
            "hc-key": "nl-3557-gm0458",
            "value": 288
        },
        {
            "hc-key": "nl-li-gm0984",
            "value": 289
        },
        {
            "hc-key": "nl-3558-gm1658",
            "value": 290
        },
        {
            "hc-key": "nl-li-gm1669",
            "value": 291
        },
        {
            "hc-key": "nl-li-gm1641",
            "value": 292
        },
        {
            "hc-key": "nl-li-gm0957",
            "value": 293
        },
        {
            "hc-key": "nl-3560-gm0627",
            "value": 294
        },
        {
            "hc-key": "nl-3560-gm1672",
            "value": 295
        },
        {
            "hc-key": "nl-3560-gm1621",
            "value": 296
        },
        {
            "hc-key": "nl-3560-gm0637",
            "value": 297
        },
        {
            "hc-key": "nl-3558-gm0873",
            "value": 298
        },
        {
            "hc-key": "nl-gr-gm0018",
            "value": 299
        },
        {
            "hc-key": "nl-li-gm0907",
            "value": 300
        },
        {
            "hc-key": "nl-3558-gm0756",
            "value": 301
        },
        {
            "hc-key": "nl-3558-gm1684",
            "value": 302
        },
        {
            "hc-key": "nl-3557-gm1696",
            "value": 303
        },
        {
            "hc-key": "nl-3559-gm0310",
            "value": 304
        },
        {
            "hc-key": "nl-dr-gm1699",
            "value": 305
        },
        {
            "hc-key": "nl-ov-gm1700",
            "value": 306
        },
        {
            "hc-key": "nl-dr-gm0118",
            "value": 307
        },
        {
            "hc-key": "nl-dr-gm1701",
            "value": 308
        },
        {
            "hc-key": "nl-dr-gm1731",
            "value": 309
        },
        {
            "hc-key": "nl-3558-gm1702",
            "value": 310
        },
        {
            "hc-key": "nl-3558-gm0755",
            "value": 311
        },
        {
            "hc-key": "nl-ge-gm0196",
            "value": 312
        },
        {
            "hc-key": "nl-ge-gm0226",
            "value": 313
        },
        {
            "hc-key": "nl-3558-gm1721",
            "value": 314
        },
        {
            "hc-key": "nl-li-gm0965",
            "value": 315
        },
        {
            "hc-key": "nl-li-gm1729",
            "value": 316
        },
        {
            "hc-key": "nl-gr-gm1730",
            "value": 317
        },
        {
            "hc-key": "nl-ge-gm1740",
            "value": 318
        },
        {
            "hc-key": "nl-ge-gm0262",
            "value": 319
        },
        {
            "hc-key": "nl-ov-gm1742",
            "value": 320
        },
        {
            "hc-key": "nl-ov-gm0150",
            "value": 321
        },
        {
            "hc-key": "nl-3558-gm1771",
            "value": 322
        },
        {
            "hc-key": "nl-ge-gm0285",
            "value": 323
        },
        {
            "hc-key": "nl-ov-gm1773",
            "value": 324
        },
        {
            "hc-key": "nl-ge-gm1876",
            "value": 325
        },
        {
            "hc-key": "nl-3560-gm1884",
            "value": 326
        },
        {
            "hc-key": "nl-3558-gm0743",
            "value": 327
        },
        {
            "hc-key": "nl-li-gm1894",
            "value": 328
        },
        {
            "hc-key": "nl-3558-gm0762",
            "value": 329
        },
        {
            "hc-key": "nl-3560-gm1916",
            "value": 330
        },
        {
            "hc-key": "nl-3560-gm0568",
            "value": 331
        },
        {
            "hc-key": "nl-3560-gm1926",
            "value": 332
        },
        {
            "hc-key": "nl-3560-gm1927",
            "value": 333
        },
        {
            "hc-key": "nl-3557-gm0498",
            "value": 334
        },
        {
            "hc-key": "nl-3560-gm0530",
            "value": 335
        },
        {
            "hc-key": "nl-3560-gm0501",
            "value": 336
        },
        {
            "hc-key": "nl-ze-gm0703",
            "value": 337
        },
        {
            "hc-key": "nl-3558-gm0840",
            "value": 338
        },
        {
            "hc-key": "nl-3558-gm0879",
            "value": 339
        },
        {
            "hc-key": "nl-li-gm0928",
            "value": 340
        },
        {
            "hc-key": "nl-li-gm1711",
            "value": 341
        },
        {
            "hc-key": "nl-ov-gm1774",
            "value": 342
        },
        {
            "hc-key": "nl-gr-gm0037",
            "value": 343
        },
        {
            "hc-key": "nl-dr-gm1680",
            "value": 344
        },
        {
            "hc-key": "nl-gr-gm0047",
            "value": 345
        },
        {
            "hc-key": "nl-fr-gm0080",
            "value": 346
        },
        {
            "hc-key": "nl-fr-gm0081",
            "value": 347
        },
        {
            "hc-key": "nl-fr-gm0098",
            "value": 348
        },
        {
            "hc-key": "nl-dr-gm0109",
            "value": 349
        },
        {
            "hc-key": "nl-ov-gm0147",
            "value": 350
        },
        {
            "hc-key": "nl-ov-gm0141",
            "value": 351
        },
        {
            "hc-key": "nl-ov-gm0189",
            "value": 352
        },
        {
            "hc-key": "nl-ge-gm0214",
            "value": 353
        },
        {
            "hc-key": "nl-ge-gm0209",
            "value": 354
        },
        {
            "hc-key": "nl-ge-gm0246",
            "value": 355
        },
        {
            "hc-key": "nl-ge-gm0221",
            "value": 356
        },
        {
            "hc-key": "nl-ge-gm0268",
            "value": 357
        },
        {
            "hc-key": "nl-ge-gm0282",
            "value": 358
        },
        {
            "hc-key": "nl-ge-gm1955",
            "value": 359
        },
        {
            "hc-key": "nl-ge-gm0301",
            "value": 360
        },
        {
            "hc-key": "nl-3559-gm0327",
            "value": 361
        },
        {
            "hc-key": "nl-3559-gm0342",
            "value": 362
        },
        {
            "hc-key": "nl-3557-gm0399",
            "value": 363
        },
        {
            "hc-key": "nl-3557-gm0397",
            "value": 364
        },
        {
            "hc-key": "nl-3560-gm0575",
            "value": 365
        },
        {
            "hc-key": "nl-3560-gm0579",
            "value": 366
        },
        {
            "hc-key": "nl-3559-gm0589",
            "value": 367
        },
        {
            "hc-key": "nl-3560-gm0603",
            "value": 368
        },
        {
            "hc-key": "nl-3560-gm0707",
            "value": 369
        },
        {
            "hc-key": "nl-fr-gm0737",
            "value": 370
        },
        {
            "hc-key": "nl-3558-gm0738",
            "value": 371
        },
        {
            "hc-key": "nl-3558-gm0770",
            "value": 372
        },
        {
            "hc-key": "nl-3558-gm0809",
            "value": 373
        },
        {
            "hc-key": "nl-3558-gm0788",
            "value": 374
        },
        {
            "hc-key": "nl-3558-gm0824",
            "value": 375
        },
        {
            "hc-key": "nl-3558-gm0826",
            "value": 376
        },
        {
            "hc-key": "nl-3558-gm0777",
            "value": 377
        },
        {
            "hc-key": "nl-3558-gm0860",
            "value": 378
        },
        {
            "hc-key": "nl-li-gm0944",
            "value": 379
        },
        {
            "hc-key": "nl-li-gm0946",
            "value": 380
        },
        {
            "hc-key": "nl-li-gm1507",
            "value": 381
        },
        {
            "hc-key": "nl-li-gm0893",
            "value": 382
        },
        {
            "hc-key": "nl-3558-gm1706",
            "value": 383
        },
        {
            "hc-key": "nl-gr-gm0048",
            "value": 384
        },
        {
            "hc-key": "nl-dr-gm1681",
            "value": 385
        },
        {
            "hc-key": "nl-dr-gm1690",
            "value": 386
        },
        {
            "hc-key": "nl-ge-gm1734",
            "value": 387
        },
        {
            "hc-key": "nl-li-gm0983",
            "value": 388
        },
        {
            "hc-key": "nl-ge-gm1509",
            "value": 389
        },
        {
            "hc-key": "nl-ov-gm0183",
            "value": 390
        },
        {
            "hc-key": "nl-ge-gm0294",
            "value": 391
        },
        {
            "hc-key": "nl-li-gm0988",
            "value": 392
        },
        {
            "hc-key": "nl-li-gm1903",
            "value": 393
        },
        {
            "hc-key": "nl-fr-gm0085",
            "value": 394
        },
        {
            "hc-key": "nl-dr-gm0106",
            "value": 395
        },
        {
            "hc-key": "nl-ov-gm1735",
            "value": 396
        },
        {
            "hc-key": "nl-3557-gm0450",
            "value": 397
        },
        {
            "hc-key": "nl-gr-gm0017",
            "value": 398
        },
        {
            "hc-key": "nl-3560-gm0606",
            "value": 399
        },
        {
            "hc-key": "nl-li-gm0951",
            "value": 400
        },
        {
            "hc-key": "nl-fr-gm0060",
            "value": 401
        },
        {
            "hc-key": "nl-ov-gm0168",
            "value": 402
        },
        {
            "hc-key": "nl-dr-gm0114",
            "value": 403
        },
        {
            "hc-key": "nl-li-gm0981",
            "value": 404
        },
        {
            "hc-key": "nl-fr-gm0074",
            "value": 405
        },
        {
            "hc-key": "nl-ge-gm0274",
            "value": 406
        },
        {
            "hc-key": "nl-3558-gm0844",
            "value": 407
        },
        {
            "value": 408
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/nl/nl-all-all.js">The Netherlands, admin2</a>'
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
            mapData: Highcharts.maps['countries/nl/nl-all-all'],
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
