$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "us-ca-24",
            "value": 0
        },
        {
            "hc-key": "us-id-01",
            "value": 1
        },
        {
            "hc-key": "us-tn-02",
            "value": 2
        },
        {
            "hc-key": "us-ne-02",
            "value": 3
        },
        {
            "hc-key": "us-md-06",
            "value": 4
        },
        {
            "hc-key": "us-ma-09",
            "value": 5
        },
        {
            "hc-key": "us-wi-08",
            "value": 6
        },
        {
            "hc-key": "us-wi-03",
            "value": 7
        },
        {
            "hc-key": "us-mi-01",
            "value": 8
        },
        {
            "hc-key": "us-ut-03",
            "value": 9
        },
        {
            "hc-key": "us-az-01",
            "value": 10
        },
        {
            "hc-key": "us-me-02",
            "value": 11
        },
        {
            "hc-key": "us-la-03",
            "value": 12
        },
        {
            "hc-key": "us-tx-23",
            "value": 13
        },
        {
            "hc-key": "us-nm-02",
            "value": 14
        },
        {
            "hc-key": "us-tn-05",
            "value": 15
        },
        {
            "hc-key": "us-sd-00",
            "value": 16
        },
        {
            "hc-key": "us-wy-00",
            "value": 17
        },
        {
            "hc-key": "us-ny-23",
            "value": 18
        },
        {
            "hc-key": "us-pa-05",
            "value": 19
        },
        {
            "hc-key": "us-co-03",
            "value": 20
        },
        {
            "hc-key": "us-nm-03",
            "value": 21
        },
        {
            "hc-key": "us-tx-14",
            "value": 22
        },
        {
            "hc-key": "us-ca-47",
            "value": 23
        },
        {
            "hc-key": "us-ca-26",
            "value": 24
        },
        {
            "hc-key": "us-ca-14",
            "value": 25
        },
        {
            "hc-key": "us-fl-26",
            "value": 26
        },
        {
            "hc-key": "us-wv-01",
            "value": 27
        },
        {
            "hc-key": "us-pa-18",
            "value": 28
        },
        {
            "hc-key": "us-ri-02",
            "value": 29
        },
        {
            "hc-key": "us-ct-02",
            "value": 30
        },
        {
            "hc-key": "us-ny-10",
            "value": 31
        },
        {
            "hc-key": "us-tn-04",
            "value": 32
        },
        {
            "hc-key": "us-mi-02",
            "value": 33
        },
        {
            "hc-key": "us-mi-03",
            "value": 34
        },
        {
            "hc-key": "us-va-10",
            "value": 35
        },
        {
            "hc-key": "us-mn-02",
            "value": 36
        },
        {
            "hc-key": "us-mn-06",
            "value": 37
        },
        {
            "hc-key": "us-mn-04",
            "value": 38
        },
        {
            "hc-key": "us-il-01",
            "value": 39
        },
        {
            "hc-key": "us-il-05",
            "value": 40
        },
        {
            "hc-key": "us-il-07",
            "value": 41
        },
        {
            "hc-key": "us-il-02",
            "value": 42
        },
        {
            "hc-key": "us-ca-33",
            "value": 43
        },
        {
            "hc-key": "us-ca-36",
            "value": 44
        },
        {
            "hc-key": "us-ca-31",
            "value": 45
        },
        {
            "hc-key": "us-ca-48",
            "value": 46
        },
        {
            "hc-key": "us-ca-46",
            "value": 47
        },
        {
            "hc-key": "us-ar-03",
            "value": 48
        },
        {
            "hc-key": "us-ar-02",
            "value": 49
        },
        {
            "hc-key": "us-ca-34",
            "value": 50
        },
        {
            "hc-key": "us-ca-30",
            "value": 51
        },
        {
            "hc-key": "us-ca-18",
            "value": 52
        },
        {
            "hc-key": "us-ca-20",
            "value": 53
        },
        {
            "hc-key": "us-ca-16",
            "value": 54
        },
        {
            "hc-key": "us-ca-22",
            "value": 55
        },
        {
            "hc-key": "us-ca-37",
            "value": 56
        },
        {
            "hc-key": "us-ca-43",
            "value": 57
        },
        {
            "hc-key": "us-ca-32",
            "value": 58
        },
        {
            "hc-key": "us-ca-35",
            "value": 59
        },
        {
            "hc-key": "us-ca-42",
            "value": 60
        },
        {
            "hc-key": "us-ca-49",
            "value": 61
        },
        {
            "hc-key": "us-ca-44",
            "value": 62
        },
        {
            "hc-key": "us-ca-15",
            "value": 63
        },
        {
            "hc-key": "us-ca-19",
            "value": 64
        },
        {
            "hc-key": "us-ca-10",
            "value": 65
        },
        {
            "hc-key": "us-ia-04",
            "value": 66
        },
        {
            "hc-key": "us-ia-02",
            "value": 67
        },
        {
            "hc-key": "us-mn-03",
            "value": 68
        },
        {
            "hc-key": "us-mn-05",
            "value": 69
        },
        {
            "hc-key": "us-ca-52",
            "value": 70
        },
        {
            "hc-key": "us-ca-25",
            "value": 71
        },
        {
            "hc-key": "us-ca-29",
            "value": 72
        },
        {
            "hc-key": "us-ca-07",
            "value": 73
        },
        {
            "hc-key": "us-ca-06",
            "value": 74
        },
        {
            "hc-key": "us-ca-39",
            "value": 75
        },
        {
            "hc-key": "us-al-05",
            "value": 76
        },
        {
            "hc-key": "us-ca-02",
            "value": 77
        },
        {
            "hc-key": "us-ca-12",
            "value": 78
        },
        {
            "hc-key": "us-ca-05",
            "value": 79
        },
        {
            "hc-key": "us-ca-11",
            "value": 80
        },
        {
            "hc-key": "us-ca-03",
            "value": 81
        },
        {
            "hc-key": "us-il-04",
            "value": 82
        },
        {
            "hc-key": "us-il-16",
            "value": 83
        },
        {
            "hc-key": "us-in-04",
            "value": 84
        },
        {
            "hc-key": "us-in-01",
            "value": 85
        },
        {
            "hc-key": "us-wi-01",
            "value": 86
        },
        {
            "hc-key": "us-il-10",
            "value": 87
        },
        {
            "hc-key": "us-ca-50",
            "value": 88
        },
        {
            "hc-key": "us-ca-53",
            "value": 89
        },
        {
            "hc-key": "us-ca-08",
            "value": 90
        },
        {
            "hc-key": "us-il-06",
            "value": 91
        },
        {
            "hc-key": "us-il-03",
            "value": 92
        },
        {
            "hc-key": "us-ga-04",
            "value": 93
        },
        {
            "hc-key": "us-ga-05",
            "value": 94
        },
        {
            "hc-key": "us-ga-13",
            "value": 95
        },
        {
            "hc-key": "us-ga-10",
            "value": 96
        },
        {
            "hc-key": "us-tn-03",
            "value": 97
        },
        {
            "hc-key": "us-ca-51",
            "value": 98
        },
        {
            "hc-key": "us-ca-28",
            "value": 99
        },
        {
            "hc-key": "us-ga-07",
            "value": 100
        },
        {
            "hc-key": "us-ga-09",
            "value": 101
        },
        {
            "hc-key": "us-ga-06",
            "value": 102
        },
        {
            "hc-key": "us-ga-14",
            "value": 103
        },
        {
            "hc-key": "us-la-06",
            "value": 104
        },
        {
            "hc-key": "us-la-01",
            "value": 105
        },
        {
            "hc-key": "us-ms-04",
            "value": 106
        },
        {
            "hc-key": "us-ar-04",
            "value": 107
        },
        {
            "hc-key": "us-la-05",
            "value": 108
        },
        {
            "hc-key": "us-ar-01",
            "value": 109
        },
        {
            "hc-key": "us-in-02",
            "value": 110
        },
        {
            "hc-key": "us-in-05",
            "value": 111
        },
        {
            "hc-key": "us-in-09",
            "value": 112
        },
        {
            "hc-key": "us-in-07",
            "value": 113
        },
        {
            "hc-key": "us-in-06",
            "value": 114
        },
        {
            "hc-key": "us-in-03",
            "value": 115
        },
        {
            "hc-key": "us-il-11",
            "value": 116
        },
        {
            "hc-key": "us-il-09",
            "value": 117
        },
        {
            "hc-key": "us-il-18",
            "value": 118
        },
        {
            "hc-key": "us-il-15",
            "value": 119
        },
        {
            "hc-key": "us-ca-40",
            "value": 120
        },
        {
            "hc-key": "us-ca-13",
            "value": 121
        },
        {
            "hc-key": "us-ca-45",
            "value": 122
        },
        {
            "hc-key": "us-ia-03",
            "value": 123
        },
        {
            "hc-key": "us-ga-11",
            "value": 124
        },
        {
            "hc-key": "us-ca-04",
            "value": 125
        },
        {
            "hc-key": "us-ca-09",
            "value": 126
        },
        {
            "hc-key": "us-tn-08",
            "value": 127
        },
        {
            "hc-key": "us-tn-09",
            "value": 128
        },
        {
            "hc-key": "us-ca-41",
            "value": 129
        },
        {
            "hc-key": "us-ca-27",
            "value": 130
        },
        {
            "hc-key": "us-ca-17",
            "value": 131
        },
        {
            "hc-key": "us-ky-01",
            "value": 132
        },
        {
            "hc-key": "us-ky-05",
            "value": 133
        },
        {
            "hc-key": "us-ky-03",
            "value": 134
        },
        {
            "hc-key": "us-ky-02",
            "value": 135
        },
        {
            "hc-key": "us-ky-04",
            "value": 136
        },
        {
            "hc-key": "us-il-12",
            "value": 137
        },
        {
            "hc-key": "us-il-08",
            "value": 138
        },
        {
            "hc-key": "us-or-04",
            "value": 139
        },
        {
            "hc-key": "us-ca-38",
            "value": 140
        },
        {
            "hc-key": "us-al-04",
            "value": 141
        },
        {
            "hc-key": "us-ms-01",
            "value": 142
        },
        {
            "hc-key": "us-fl-22",
            "value": 143
        },
        {
            "hc-key": "us-mo-01",
            "value": 144
        },
        {
            "hc-key": "us-mo-03",
            "value": 145
        },
        {
            "hc-key": "us-mo-08",
            "value": 146
        },
        {
            "hc-key": "us-al-07",
            "value": 147
        },
        {
            "hc-key": "us-al-06",
            "value": 148
        },
        {
            "hc-key": "us-al-01",
            "value": 149
        },
        {
            "hc-key": "us-al-02",
            "value": 150
        },
        {
            "hc-key": "us-nj-03",
            "value": 151
        },
        {
            "hc-key": "us-nj-05",
            "value": 152
        },
        {
            "hc-key": "us-nj-07",
            "value": 153
        },
        {
            "hc-key": "us-nj-02",
            "value": 154
        },
        {
            "hc-key": "us-nj-09",
            "value": 155
        },
        {
            "hc-key": "us-nj-06",
            "value": 156
        },
        {
            "hc-key": "us-nj-10",
            "value": 157
        },
        {
            "hc-key": "us-nv-02",
            "value": 158
        },
        {
            "hc-key": "us-id-02",
            "value": 159
        },
        {
            "hc-key": "us-ut-01",
            "value": 160
        },
        {
            "hc-key": "us-ga-12",
            "value": 161
        },
        {
            "hc-key": "us-sc-03",
            "value": 162
        },
        {
            "hc-key": "us-sc-01",
            "value": 163
        },
        {
            "hc-key": "us-sc-07",
            "value": 164
        },
        {
            "hc-key": "us-sc-06",
            "value": 165
        },
        {
            "hc-key": "us-ga-01",
            "value": 166
        },
        {
            "hc-key": "us-wa-10",
            "value": 167
        },
        {
            "hc-key": "us-wa-03",
            "value": 168
        },
        {
            "hc-key": "us-wa-06",
            "value": 169
        },
        {
            "hc-key": "us-oh-10",
            "value": 170
        },
        {
            "hc-key": "us-oh-15",
            "value": 171
        },
        {
            "hc-key": "us-oh-07",
            "value": 172
        },
        {
            "hc-key": "us-oh-13",
            "value": 173
        },
        {
            "hc-key": "us-oh-04",
            "value": 174
        },
        {
            "hc-key": "us-oh-09",
            "value": 175
        },
        {
            "hc-key": "us-oh-01",
            "value": 176
        },
        {
            "hc-key": "us-oh-11",
            "value": 177
        },
        {
            "hc-key": "us-oh-05",
            "value": 178
        },
        {
            "hc-key": "us-mi-07",
            "value": 179
        },
        {
            "hc-key": "us-mi-08",
            "value": 180
        },
        {
            "hc-key": "us-oh-08",
            "value": 181
        },
        {
            "hc-key": "us-oh-12",
            "value": 182
        },
        {
            "hc-key": "us-va-01",
            "value": 183
        },
        {
            "hc-key": "us-va-05",
            "value": 184
        },
        {
            "hc-key": "us-va-04",
            "value": 185
        },
        {
            "hc-key": "us-va-02",
            "value": 186
        },
        {
            "hc-key": "us-va-09",
            "value": 187
        },
        {
            "hc-key": "us-mi-06",
            "value": 188
        },
        {
            "hc-key": "us-mi-04",
            "value": 189
        },
        {
            "hc-key": "us-mi-14",
            "value": 190
        },
        {
            "hc-key": "us-mi-13",
            "value": 191
        },
        {
            "hc-key": "us-mi-10",
            "value": 192
        },
        {
            "hc-key": "us-mi-05",
            "value": 193
        },
        {
            "hc-key": "us-mi-11",
            "value": 194
        },
        {
            "hc-key": "us-mi-09",
            "value": 195
        },
        {
            "hc-key": "us-mi-12",
            "value": 196
        },
        {
            "hc-key": "us-va-08",
            "value": 197
        },
        {
            "hc-key": "us-wa-07",
            "value": 198
        },
        {
            "hc-key": "us-wa-02",
            "value": 199
        },
        {
            "hc-key": "us-wa-01",
            "value": 200
        },
        {
            "hc-key": "us-wa-09",
            "value": 201
        },
        {
            "hc-key": "us-wa-08",
            "value": 202
        },
        {
            "hc-key": "us-nj-11",
            "value": 203
        },
        {
            "hc-key": "us-nj-08",
            "value": 204
        },
        {
            "hc-key": "us-co-01",
            "value": 205
        },
        {
            "hc-key": "us-co-04",
            "value": 206
        },
        {
            "hc-key": "us-ok-03",
            "value": 207
        },
        {
            "hc-key": "us-co-02",
            "value": 208
        },
        {
            "hc-key": "us-co-07",
            "value": 209
        },
        {
            "hc-key": "us-co-06",
            "value": 210
        },
        {
            "hc-key": "us-md-01",
            "value": 211
        },
        {
            "hc-key": "us-pa-04",
            "value": 212
        },
        {
            "hc-key": "us-va-11",
            "value": 213
        },
        {
            "hc-key": "us-md-05",
            "value": 214
        },
        {
            "hc-key": "us-md-03",
            "value": 215
        },
        {
            "hc-key": "us-md-07",
            "value": 216
        },
        {
            "hc-key": "us-md-02",
            "value": 217
        },
        {
            "hc-key": "us-md-04",
            "value": 218
        },
        {
            "hc-key": "us-md-08",
            "value": 219
        },
        {
            "hc-key": "us-dc-98",
            "value": 220
        },
        {
            "hc-key": "us-mo-04",
            "value": 221
        },
        {
            "hc-key": "us-ks-03",
            "value": 222
        },
        {
            "hc-key": "us-mo-07",
            "value": 223
        },
        {
            "hc-key": "us-ks-02",
            "value": 224
        },
        {
            "hc-key": "us-ma-03",
            "value": 225
        },
        {
            "hc-key": "us-ma-05",
            "value": 226
        },
        {
            "hc-key": "us-ma-07",
            "value": 227
        },
        {
            "hc-key": "us-vt-00",
            "value": 228
        },
        {
            "hc-key": "us-ma-02",
            "value": 229
        },
        {
            "hc-key": "us-ma-04",
            "value": 230
        },
        {
            "hc-key": "us-ma-06",
            "value": 231
        },
        {
            "hc-key": "us-ma-08",
            "value": 232
        },
        {
            "hc-key": "us-wv-03",
            "value": 233
        },
        {
            "hc-key": "us-oh-06",
            "value": 234
        },
        {
            "hc-key": "us-il-17",
            "value": 235
        },
        {
            "hc-key": "us-wi-02",
            "value": 236
        },
        {
            "hc-key": "us-wi-04",
            "value": 237
        },
        {
            "hc-key": "us-wi-07",
            "value": 238
        },
        {
            "hc-key": "us-wi-06",
            "value": 239
        },
        {
            "hc-key": "us-nc-01",
            "value": 240
        },
        {
            "hc-key": "us-sc-04",
            "value": 241
        },
        {
            "hc-key": "us-nc-10",
            "value": 242
        },
        {
            "hc-key": "us-nc-11",
            "value": 243
        },
        {
            "hc-key": "us-sc-05",
            "value": 244
        },
        {
            "hc-key": "us-nc-08",
            "value": 245
        },
        {
            "hc-key": "us-nc-06",
            "value": 246
        },
        {
            "hc-key": "us-nc-02",
            "value": 247
        },
        {
            "hc-key": "us-nc-12",
            "value": 248
        },
        {
            "hc-key": "us-nh-01",
            "value": 249
        },
        {
            "hc-key": "us-nh-02",
            "value": 250
        },
        {
            "hc-key": "us-ks-04",
            "value": 251
        },
        {
            "hc-key": "us-ok-01",
            "value": 252
        },
        {
            "hc-key": "us-de-00",
            "value": 253
        },
        {
            "hc-key": "us-pa-01",
            "value": 254
        },
        {
            "hc-key": "us-pa-13",
            "value": 255
        },
        {
            "hc-key": "us-nj-01",
            "value": 256
        },
        {
            "hc-key": "us-pa-07",
            "value": 257
        },
        {
            "hc-key": "us-pa-02",
            "value": 258
        },
        {
            "hc-key": "us-pa-03",
            "value": 259
        },
        {
            "hc-key": "us-pa-10",
            "value": 260
        },
        {
            "hc-key": "us-ny-22",
            "value": 261
        },
        {
            "hc-key": "us-pa-06",
            "value": 262
        },
        {
            "hc-key": "us-pa-16",
            "value": 263
        },
        {
            "hc-key": "us-pa-08",
            "value": 264
        },
        {
            "hc-key": "us-pa-09",
            "value": 265
        },
        {
            "hc-key": "us-pa-15",
            "value": 266
        },
        {
            "hc-key": "us-pa-12",
            "value": 267
        },
        {
            "hc-key": "us-nj-12",
            "value": 268
        },
        {
            "hc-key": "us-nj-04",
            "value": 269
        },
        {
            "hc-key": "us-fl-08",
            "value": 270
        },
        {
            "hc-key": "us-fl-17",
            "value": 271
        },
        {
            "hc-key": "us-fl-09",
            "value": 272
        },
        {
            "hc-key": "us-fl-07",
            "value": 273
        },
        {
            "hc-key": "us-fl-27",
            "value": 274
        },
        {
            "hc-key": "us-fl-14",
            "value": 275
        },
        {
            "hc-key": "us-fl-13",
            "value": 276
        },
        {
            "hc-key": "us-fl-24",
            "value": 277
        },
        {
            "hc-key": "us-fl-16",
            "value": 278
        },
        {
            "hc-key": "us-fl-11",
            "value": 279
        },
        {
            "hc-key": "us-fl-15",
            "value": 280
        },
        {
            "hc-key": "us-fl-23",
            "value": 281
        },
        {
            "hc-key": "us-fl-06",
            "value": 282
        },
        {
            "hc-key": "us-fl-12",
            "value": 283
        },
        {
            "hc-key": "us-fl-18",
            "value": 284
        },
        {
            "hc-key": "us-ga-08",
            "value": 285
        },
        {
            "hc-key": "us-fl-02",
            "value": 286
        },
        {
            "hc-key": "us-fl-20",
            "value": 287
        },
        {
            "hc-key": "us-fl-25",
            "value": 288
        },
        {
            "hc-key": "us-fl-19",
            "value": 289
        },
        {
            "hc-key": "us-fl-03",
            "value": 290
        },
        {
            "hc-key": "us-fl-10",
            "value": 291
        },
        {
            "hc-key": "us-az-03",
            "value": 292
        },
        {
            "hc-key": "us-az-05",
            "value": 293
        },
        {
            "hc-key": "us-az-07",
            "value": 294
        },
        {
            "hc-key": "us-az-06",
            "value": 295
        },
        {
            "hc-key": "us-az-09",
            "value": 296
        },
        {
            "hc-key": "us-ut-02",
            "value": 297
        },
        {
            "hc-key": "us-az-04",
            "value": 298
        },
        {
            "hc-key": "us-az-08",
            "value": 299
        },
        {
            "hc-key": "us-tx-06",
            "value": 300
        },
        {
            "hc-key": "us-tx-17",
            "value": 301
        },
        {
            "hc-key": "us-tx-16",
            "value": 302
        },
        {
            "hc-key": "us-tx-27",
            "value": 303
        },
        {
            "hc-key": "us-tx-15",
            "value": 304
        },
        {
            "hc-key": "us-tx-24",
            "value": 305
        },
        {
            "hc-key": "us-tx-30",
            "value": 306
        },
        {
            "hc-key": "us-tx-02",
            "value": 307
        },
        {
            "hc-key": "us-tx-29",
            "value": 308
        },
        {
            "hc-key": "us-tx-32",
            "value": 309
        },
        {
            "hc-key": "us-tx-20",
            "value": 310
        },
        {
            "hc-key": "us-tx-21",
            "value": 311
        },
        {
            "hc-key": "us-tx-03",
            "value": 312
        },
        {
            "hc-key": "us-tx-31",
            "value": 313
        },
        {
            "hc-key": "us-tx-10",
            "value": 314
        },
        {
            "hc-key": "us-ok-04",
            "value": 315
        },
        {
            "hc-key": "us-tx-04",
            "value": 316
        },
        {
            "hc-key": "us-ok-02",
            "value": 317
        },
        {
            "hc-key": "us-la-04",
            "value": 318
        },
        {
            "hc-key": "us-tx-25",
            "value": 319
        },
        {
            "hc-key": "us-tx-35",
            "value": 320
        },
        {
            "hc-key": "us-tx-28",
            "value": 321
        },
        {
            "hc-key": "us-tx-11",
            "value": 322
        },
        {
            "hc-key": "us-tx-13",
            "value": 323
        },
        {
            "hc-key": "us-tx-26",
            "value": 324
        },
        {
            "hc-key": "us-tx-07",
            "value": 325
        },
        {
            "hc-key": "us-tx-22",
            "value": 326
        },
        {
            "hc-key": "us-tx-36",
            "value": 327
        },
        {
            "hc-key": "us-tx-09",
            "value": 328
        },
        {
            "hc-key": "us-tx-18",
            "value": 329
        },
        {
            "hc-key": "us-ri-01",
            "value": 330
        },
        {
            "hc-key": "us-ma-01",
            "value": 331
        },
        {
            "hc-key": "us-ct-01",
            "value": 332
        },
        {
            "hc-key": "us-ct-05",
            "value": 333
        },
        {
            "hc-key": "us-ct-03",
            "value": 334
        },
        {
            "hc-key": "us-ct-04",
            "value": 335
        },
        {
            "hc-key": "us-ny-03",
            "value": 336
        },
        {
            "hc-key": "us-mt-00",
            "value": 337
        },
        {
            "hc-key": "us-ny-01",
            "value": 338
        },
        {
            "hc-key": "us-ny-27",
            "value": 339
        },
        {
            "hc-key": "us-ny-25",
            "value": 340
        },
        {
            "hc-key": "us-ny-14",
            "value": 341
        },
        {
            "hc-key": "us-ny-06",
            "value": 342
        },
        {
            "hc-key": "us-ny-07",
            "value": 343
        },
        {
            "hc-key": "us-ny-05",
            "value": 344
        },
        {
            "hc-key": "us-ny-24",
            "value": 345
        },
        {
            "hc-key": "us-ny-16",
            "value": 346
        },
        {
            "hc-key": "us-ny-17",
            "value": 347
        },
        {
            "hc-key": "us-ny-11",
            "value": 348
        },
        {
            "hc-key": "us-ny-15",
            "value": 349
        },
        {
            "hc-key": "us-ny-08",
            "value": 350
        },
        {
            "hc-key": "us-ny-12",
            "value": 351
        },
        {
            "hc-key": "us-ny-18",
            "value": 352
        },
        {
            "hc-key": "us-ny-02",
            "value": 353
        },
        {
            "hc-key": "us-ny-04",
            "value": 354
        },
        {
            "hc-key": "us-ny-13",
            "value": 355
        },
        {
            "hc-key": "us-ny-09",
            "value": 356
        },
        {
            "hc-key": "us-ny-21",
            "value": 357
        },
        {
            "hc-key": "us-ny-19",
            "value": 358
        },
        {
            "hc-key": "us-mn-07",
            "value": 359
        },
        {
            "hc-key": "us-ne-01",
            "value": 360
        },
        {
            "hc-key": "us-ne-03",
            "value": 361
        },
        {
            "hc-key": "us-il-14",
            "value": 362
        },
        {
            "hc-key": "us-or-01",
            "value": 363
        },
        {
            "hc-key": "us-or-03",
            "value": 364
        },
        {
            "hc-key": "us-tn-07",
            "value": 365
        },
        {
            "hc-key": "us-nc-05",
            "value": 366
        },
        {
            "hc-key": "us-tn-01",
            "value": 367
        },
        {
            "hc-key": "us-il-13",
            "value": 368
        },
        {
            "hc-key": "us-ga-03",
            "value": 369
        },
        {
            "hc-key": "us-ca-01",
            "value": 370
        },
        {
            "hc-key": "us-tn-06",
            "value": 371
        },
        {
            "hc-key": "us-ga-02",
            "value": 372
        },
        {
            "hc-key": "us-al-03",
            "value": 373
        },
        {
            "hc-key": "us-mo-05",
            "value": 374
        },
        {
            "hc-key": "us-mo-06",
            "value": 375
        },
        {
            "hc-key": "us-nv-04",
            "value": 376
        },
        {
            "hc-key": "us-nv-03",
            "value": 377
        },
        {
            "hc-key": "us-nv-01",
            "value": 378
        },
        {
            "hc-key": "us-sc-02",
            "value": 379
        },
        {
            "hc-key": "us-oh-16",
            "value": 380
        },
        {
            "hc-key": "us-oh-14",
            "value": 381
        },
        {
            "hc-key": "us-oh-03",
            "value": 382
        },
        {
            "hc-key": "us-va-03",
            "value": 383
        },
        {
            "hc-key": "us-va-07",
            "value": 384
        },
        {
            "hc-key": "us-va-06",
            "value": 385
        },
        {
            "hc-key": "us-wa-04",
            "value": 386
        },
        {
            "hc-key": "us-wi-05",
            "value": 387
        },
        {
            "hc-key": "us-nc-07",
            "value": 388
        },
        {
            "hc-key": "us-nc-04",
            "value": 389
        },
        {
            "hc-key": "us-nc-13",
            "value": 390
        },
        {
            "hc-key": "us-nc-09",
            "value": 391
        },
        {
            "hc-key": "us-ok-05",
            "value": 392
        },
        {
            "hc-key": "us-pa-17",
            "value": 393
        },
        {
            "hc-key": "us-pa-14",
            "value": 394
        },
        {
            "hc-key": "us-pa-11",
            "value": 395
        },
        {
            "hc-key": "us-tx-19",
            "value": 396
        },
        {
            "hc-key": "us-tx-08",
            "value": 397
        },
        {
            "hc-key": "us-tx-01",
            "value": 398
        },
        {
            "hc-key": "us-tx-33",
            "value": 399
        },
        {
            "hc-key": "us-tx-12",
            "value": 400
        },
        {
            "hc-key": "us-ny-26",
            "value": 401
        },
        {
            "hc-key": "us-nc-03",
            "value": 402
        },
        {
            "hc-key": "us-mn-08",
            "value": 403
        },
        {
            "hc-key": "us-me-01",
            "value": 404
        },
        {
            "hc-key": "us-tx-34",
            "value": 405
        },
        {
            "hc-key": "us-mn-01",
            "value": 406
        },
        {
            "hc-key": "us-ca-23",
            "value": 407
        },
        {
            "hc-key": "us-oh-02",
            "value": 408
        },
        {
            "hc-key": "us-fl-21",
            "value": 409
        },
        {
            "hc-key": "us-fl-04",
            "value": 410
        },
        {
            "hc-key": "us-fl-05",
            "value": 411
        },
        {
            "hc-key": "us-az-02",
            "value": 412
        },
        {
            "hc-key": "us-tx-05",
            "value": 413
        },
        {
            "hc-key": "us-in-08",
            "value": 414
        },
        {
            "hc-key": "us-la-02",
            "value": 415
        },
        {
            "hc-key": "us-fl-01",
            "value": 416
        },
        {
            "hc-key": "us-ms-03",
            "value": 417
        },
        {
            "hc-key": "us-wv-02",
            "value": 418
        },
        {
            "hc-key": "us-or-05",
            "value": 419
        },
        {
            "hc-key": "us-nd-00",
            "value": 420
        },
        {
            "hc-key": "us-ia-01",
            "value": 421
        },
        {
            "hc-key": "us-wa-05",
            "value": 422
        },
        {
            "hc-key": "us-ks-01",
            "value": 423
        },
        {
            "hc-key": "us-ms-02",
            "value": 424
        },
        {
            "hc-key": "us-or-02",
            "value": 425
        },
        {
            "hc-key": "us-mo-02",
            "value": 426
        },
        {
            "hc-key": "us-co-05",
            "value": 427
        },
        {
            "hc-key": "us-ny-20",
            "value": 428
        },
        {
            "hc-key": "us-nm-01",
            "value": 429
        },
        {
            "hc-key": "us-ca-21",
            "value": 430
        },
        {
            "hc-key": "us-ky-06",
            "value": 431
        },
        {
            "hc-key": "us-ut-04",
            "value": 432
        },
        {
            "value": 433
        },
        {
            "hc-key": "us-hi-02",
            "value": 434
        },
        {
            "hc-key": "us-hi-01",
            "value": 435
        },
        {
            "hc-key": "us-ak-00",
            "value": 436
        },
        {
            "value": 437
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/us/custom/us-113-congress.js">United States of America, congressional districts (113th)</a>'
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
            mapData: Highcharts.maps['countries/us/custom/us-113-congress'],
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
            data: Highcharts.geojson(Highcharts.maps['countries/us/custom/us-113-congress'], 'mapline'),
            color: 'silver',
            showInLegend: false,
            enableMouseTracking: false
        }]
    });
});
