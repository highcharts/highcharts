$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "de-sh-01054000",
            "value": 0
        },
        {
            "hc-key": "de-mv-13074000",
            "value": 1
        },
        {
            "hc-key": "de-mv-13073000",
            "value": 2
        },
        {
            "hc-key": "de-mv-13003000",
            "value": 3
        },
        {
            "hc-key": "de-ni-03457000",
            "value": 4
        },
        {
            "hc-key": "de-mv-13076000",
            "value": 5
        },
        {
            "hc-key": "de-ni-03356000",
            "value": 6
        },
        {
            "hc-key": "de-by-09184000",
            "value": 7
        },
        {
            "hc-key": "de-by-09177000",
            "value": 8
        },
        {
            "hc-key": "de-by-09175000",
            "value": 9
        },
        {
            "hc-key": "de-sh-01061000",
            "value": 10
        },
        {
            "hc-key": "de-rp-07138000",
            "value": 11
        },
        {
            "hc-key": "de-rp-07143000",
            "value": 12
        },
        {
            "hc-key": "de-rp-07313000",
            "value": 13
        },
        {
            "hc-key": "de-bw-08125000",
            "value": 14
        },
        {
            "hc-key": "de-bw-08226000",
            "value": 15
        },
        {
            "hc-key": "de-sl-10045000",
            "value": 16
        },
        {
            "hc-key": "de-th-16062000",
            "value": 17
        },
        {
            "hc-key": "de-bb-12068000",
            "value": 18
        },
        {
            "hc-key": "de-hb-04012000",
            "value": 19
        },
        {
            "hc-key": "de-by-09377000",
            "value": 20
        },
        {
            "hc-key": "de-by-09187000",
            "value": 21
        },
        {
            "hc-key": "de-ni-03462000",
            "value": 22
        },
        {
            "hc-key": "de-by-09372000",
            "value": 23
        },
        {
            "hc-key": "de-bb-12071000",
            "value": 24
        },
        {
            "hc-key": "de-sn-14626000",
            "value": 25
        },
        {
            "hc-key": "de-ni-03459000",
            "value": 26
        },
        {
            "hc-key": "de-by-09172000",
            "value": 27
        },
        {
            "hc-key": "de-ni-03405000",
            "value": 28
        },
        {
            "hc-key": "de-bw-08136000",
            "value": 29
        },
        {
            "hc-key": "de-bw-08415000",
            "value": 30
        },
        {
            "hc-key": "de-by-09472000",
            "value": 31
        },
        {
            "hc-key": "de-by-09574000",
            "value": 32
        },
        {
            "hc-key": "de-by-09564000",
            "value": 33
        },
        {
            "hc-key": "de-ni-03241000",
            "value": 34
        },
        {
            "hc-key": "de-ni-03252000",
            "value": 35
        },
        {
            "hc-key": "de-by-09375000",
            "value": 36
        },
        {
            "hc-key": "de-he-06534000",
            "value": 37
        },
        {
            "hc-key": "de-he-06535000",
            "value": 38
        },
        {
            "hc-key": "de-bw-08317000",
            "value": 39
        },
        {
            "hc-key": "de-bw-08237000",
            "value": 40
        },
        {
            "hc-key": "de-st-15001000",
            "value": 41
        },
        {
            "hc-key": "de-st-15082000",
            "value": 42
        },
        {
            "hc-key": "de-nw-05766000",
            "value": 43
        },
        {
            "hc-key": "de-ni-03361000",
            "value": 44
        },
        {
            "hc-key": "de-ni-03256000",
            "value": 45
        },
        {
            "hc-key": "de-sn-14522000",
            "value": 46
        },
        {
            "hc-key": "de-ni-03353000",
            "value": 47
        },
        {
            "hc-key": "de-sh-01053000",
            "value": 48
        },
        {
            "hc-key": "de-sn-14523000",
            "value": 49
        },
        {
            "hc-key": "de-th-16075000",
            "value": 50
        },
        {
            "hc-key": "de-th-16074000",
            "value": 51
        },
        {
            "hc-key": "de-by-09163000",
            "value": 52
        },
        {
            "hc-key": "de-by-09762000",
            "value": 53
        },
        {
            "hc-key": "de-by-09474000",
            "value": 54
        },
        {
            "hc-key": "de-by-09361000",
            "value": 55
        },
        {
            "hc-key": "de-by-09471000",
            "value": 56
        },
        {
            "hc-key": "de-by-09463000",
            "value": 57
        },
        {
            "hc-key": "de-by-09461000",
            "value": 58
        },
        {
            "hc-key": "de-ni-03156000",
            "value": 59
        },
        {
            "hc-key": "de-by-09462000",
            "value": 60
        },
        {
            "hc-key": "de-by-09678000",
            "value": 61
        },
        {
            "hc-key": "de-by-09662000",
            "value": 62
        },
        {
            "hc-key": "de-sl-10042000",
            "value": 63
        },
        {
            "hc-key": "de-bb-12069000",
            "value": 64
        },
        {
            "hc-key": "de-ni-03455000",
            "value": 65
        },
        {
            "hc-key": "de-ni-03359000",
            "value": 66
        },
        {
            "hc-key": "de-ni-03451000",
            "value": 67
        },
        {
            "hc-key": "de-ni-03461000",
            "value": 68
        },
        {
            "hc-key": "de-sh-01056000",
            "value": 69
        },
        {
            "hc-key": "de-hh-02000000",
            "value": 70
        },
        {
            "hc-key": "de-nw-05962000",
            "value": 71
        },
        {
            "hc-key": "de-nw-05954000",
            "value": 72
        },
        {
            "hc-key": "de-by-09478000",
            "value": 73
        },
        {
            "hc-key": "de-sh-01001000",
            "value": 74
        },
        {
            "hc-key": "de-nw-05974000",
            "value": 75
        },
        {
            "hc-key": "de-nw-05119000",
            "value": 76
        },
        {
            "hc-key": "de-nw-05170000",
            "value": 77
        },
        {
            "hc-key": "de-rp-07319000",
            "value": 78
        },
        {
            "hc-key": "de-rp-07338000",
            "value": 79
        },
        {
            "hc-key": "de-bw-08222000",
            "value": 80
        },
        {
            "hc-key": "de-rp-07337000",
            "value": 81
        },
        {
            "hc-key": "de-by-09262000",
            "value": 82
        },
        {
            "hc-key": "de-bw-08235000",
            "value": 83
        },
        {
            "hc-key": "de-bw-08231000",
            "value": 84
        },
        {
            "hc-key": "de-bw-08236000",
            "value": 85
        },
        {
            "hc-key": "de-bw-08215000",
            "value": 86
        },
        {
            "hc-key": "de-nw-05554000",
            "value": 87
        },
        {
            "hc-key": "de-ni-03456000",
            "value": 88
        },
        {
            "hc-key": "de-ni-03358000",
            "value": 89
        },
        {
            "hc-key": "de-ni-03355000",
            "value": 90
        },
        {
            "hc-key": "de-by-09277000",
            "value": 91
        },
        {
            "hc-key": "de-rp-07314000",
            "value": 92
        },
        {
            "hc-key": "de-ni-04011000",
            "value": 93
        },
        {
            "hc-key": "de-ni-03254000",
            "value": 94
        },
        {
            "hc-key": "de-ni-03102000",
            "value": 95
        },
        {
            "hc-key": "de-ni-03158000",
            "value": 96
        },
        {
            "hc-key": "de-nw-05366000",
            "value": 97
        },
        {
            "hc-key": "de-rp-07232000",
            "value": 98
        },
        {
            "hc-key": "de-by-09771000",
            "value": 99
        },
        {
            "hc-key": "de-by-09772000",
            "value": 100
        },
        {
            "hc-key": "de-by-09778000",
            "value": 101
        },
        {
            "hc-key": "de-rp-07311000",
            "value": 102
        },
        {
            "hc-key": "de-ni-03154000",
            "value": 103
        },
        {
            "hc-key": "de-ni-03151000",
            "value": 104
        },
        {
            "hc-key": "de-he-06432000",
            "value": 105
        },
        {
            "hc-key": "de-by-09676000",
            "value": 106
        },
        {
            "hc-key": "de-ni-03101000",
            "value": 107
        },
        {
            "hc-key": "de-bw-08225000",
            "value": 108
        },
        {
            "hc-key": "de-he-06437000",
            "value": 109
        },
        {
            "hc-key": "de-by-09576000",
            "value": 110
        },
        {
            "hc-key": "de-rp-07332000",
            "value": 111
        },
        {
            "hc-key": "de-rp-07335000",
            "value": 112
        },
        {
            "hc-key": "de-rp-07316000",
            "value": 113
        },
        {
            "hc-key": "de-bw-08115000",
            "value": 114
        },
        {
            "hc-key": "de-by-09777000",
            "value": 115
        },
        {
            "hc-key": "de-rp-07140000",
            "value": 116
        },
        {
            "hc-key": "de-rp-07339000",
            "value": 117
        },
        {
            "hc-key": "de-he-06433000",
            "value": 118
        },
        {
            "hc-key": "de-he-06436000",
            "value": 119
        },
        {
            "hc-key": "de-ni-03403000",
            "value": 120
        },
        {
            "hc-key": "de-th-16054000",
            "value": 121
        },
        {
            "hc-key": "de-th-16070000",
            "value": 122
        },
        {
            "hc-key": "de-rp-07318000",
            "value": 123
        },
        {
            "hc-key": "de-nw-05758000",
            "value": 124
        },
        {
            "hc-key": "de-nw-05754000",
            "value": 125
        },
        {
            "hc-key": "de-nw-05334000",
            "value": 126
        },
        {
            "hc-key": "de-nw-05370000",
            "value": 127
        },
        {
            "hc-key": "de-nw-05162000",
            "value": 128
        },
        {
            "hc-key": "de-nw-05166000",
            "value": 129
        },
        {
            "hc-key": "de-th-16052000",
            "value": 130
        },
        {
            "hc-key": "de-he-06636000",
            "value": 131
        },
        {
            "hc-key": "de-th-16056000",
            "value": 132
        },
        {
            "hc-key": "de-by-09674000",
            "value": 133
        },
        {
            "hc-key": "de-th-16069000",
            "value": 134
        },
        {
            "hc-key": "de-th-16072000",
            "value": 135
        },
        {
            "hc-key": "de-th-16068000",
            "value": 136
        },
        {
            "hc-key": "de-th-16067000",
            "value": 137
        },
        {
            "hc-key": "de-nw-05374000",
            "value": 138
        },
        {
            "hc-key": "de-rp-07132000",
            "value": 139
        },
        {
            "hc-key": "de-nw-05124000",
            "value": 140
        },
        {
            "hc-key": "de-he-06438000",
            "value": 141
        },
        {
            "hc-key": "de-by-09179000",
            "value": 142
        },
        {
            "hc-key": "de-by-09188000",
            "value": 143
        },
        {
            "hc-key": "de-he-06414000",
            "value": 144
        },
        {
            "hc-key": "de-nw-05762000",
            "value": 145
        },
        {
            "hc-key": "de-nw-05958000",
            "value": 146
        },
        {
            "hc-key": "de-nw-05120000",
            "value": 147
        },
        {
            "hc-key": "de-nw-05122000",
            "value": 148
        },
        {
            "hc-key": "de-by-09271000",
            "value": 149
        },
        {
            "hc-key": "de-nw-05112000",
            "value": 150
        },
        {
            "hc-key": "de-nw-05117000",
            "value": 151
        },
        {
            "hc-key": "de-he-06412000",
            "value": 152
        },
        {
            "hc-key": "de-nw-05378000",
            "value": 153
        },
        {
            "hc-key": "de-nw-05158000",
            "value": 154
        },
        {
            "hc-key": "de-nw-05316000",
            "value": 155
        },
        {
            "hc-key": "de-th-16066000",
            "value": 156
        },
        {
            "hc-key": "de-he-06411000",
            "value": 157
        },
        {
            "hc-key": "de-by-09174000",
            "value": 158
        },
        {
            "hc-key": "de-by-09162000",
            "value": 159
        },
        {
            "hc-key": "de-bb-12053000",
            "value": 160
        },
        {
            "hc-key": "de-nw-05113000",
            "value": 161
        },
        {
            "hc-key": "de-bw-08436000",
            "value": 162
        },
        {
            "hc-key": "de-by-09764000",
            "value": 163
        },
        {
            "hc-key": "de-bw-08426000",
            "value": 164
        },
        {
            "hc-key": "de-bw-08118000",
            "value": 165
        },
        {
            "hc-key": "de-bw-08119000",
            "value": 166
        },
        {
            "hc-key": "de-bw-08111000",
            "value": 167
        },
        {
            "hc-key": "de-bw-08311000",
            "value": 168
        },
        {
            "hc-key": "de-bw-08316000",
            "value": 169
        },
        {
            "hc-key": "de-by-09186000",
            "value": 170
        },
        {
            "hc-key": "de-bw-08421000",
            "value": 171
        },
        {
            "hc-key": "de-by-09775000",
            "value": 172
        },
        {
            "hc-key": "de-by-09183000",
            "value": 173
        },
        {
            "hc-key": "de-st-15089000",
            "value": 174
        },
        {
            "hc-key": "de-st-15003000",
            "value": 175
        },
        {
            "hc-key": "de-sh-01062000",
            "value": 176
        },
        {
            "hc-key": "de-sh-01055000",
            "value": 177
        },
        {
            "hc-key": "de-sh-01060000",
            "value": 178
        },
        {
            "hc-key": "de-sh-01058000",
            "value": 179
        },
        {
            "hc-key": "de-nw-05914000",
            "value": 180
        },
        {
            "hc-key": "de-nw-05978000",
            "value": 181
        },
        {
            "hc-key": "de-bw-08117000",
            "value": 182
        },
        {
            "hc-key": "de-bw-08116000",
            "value": 183
        },
        {
            "hc-key": "de-nw-05970000",
            "value": 184
        },
        {
            "hc-key": "de-he-06532000",
            "value": 185
        },
        {
            "hc-key": "de-rp-07340000",
            "value": 186
        },
        {
            "hc-key": "de-ni-03404000",
            "value": 187
        },
        {
            "hc-key": "de-nw-05566000",
            "value": 188
        },
        {
            "hc-key": "de-st-15088000",
            "value": 189
        },
        {
            "hc-key": "de-st-15087000",
            "value": 190
        },
        {
            "hc-key": "de-by-09774000",
            "value": 191
        },
        {
            "hc-key": "de-bw-08425000",
            "value": 192
        },
        {
            "hc-key": "de-by-09776000",
            "value": 193
        },
        {
            "hc-key": "de-bw-08435000",
            "value": 194
        },
        {
            "hc-key": "de-bw-08335000",
            "value": 195
        },
        {
            "hc-key": "de-rp-07134000",
            "value": 196
        },
        {
            "hc-key": "de-rp-07235000",
            "value": 197
        },
        {
            "hc-key": "de-ni-03360000",
            "value": 198
        },
        {
            "hc-key": "de-nw-05570000",
            "value": 199
        },
        {
            "hc-key": "de-nw-05558000",
            "value": 200
        },
        {
            "hc-key": "de-he-06431000",
            "value": 201
        },
        {
            "hc-key": "de-rp-07331000",
            "value": 202
        },
        {
            "hc-key": "de-ni-03153000",
            "value": 203
        },
        {
            "hc-key": "de-he-06611000",
            "value": 204
        },
        {
            "hc-key": "de-ni-03152000",
            "value": 205
        },
        {
            "hc-key": "de-he-06633000",
            "value": 206
        },
        {
            "hc-key": "de-nw-05315000",
            "value": 207
        },
        {
            "hc-key": "de-th-16065000",
            "value": 208
        },
        {
            "hc-key": "de-th-16061000",
            "value": 209
        },
        {
            "hc-key": "de-sl-10043000",
            "value": 210
        },
        {
            "hc-key": "de-sl-10044000",
            "value": 211
        },
        {
            "hc-key": "de-nw-05562000",
            "value": 212
        },
        {
            "hc-key": "de-rp-07312000",
            "value": 213
        },
        {
            "hc-key": "de-nw-05358000",
            "value": 214
        },
        {
            "hc-key": "de-sn-14729000",
            "value": 215
        },
        {
            "hc-key": "de-st-14730000",
            "value": 216
        },
        {
            "hc-key": "de-ni-03402000",
            "value": 217
        },
        {
            "hc-key": "de-bw-08221000",
            "value": 218
        },
        {
            "hc-key": "de-st-15083000",
            "value": 219
        },
        {
            "hc-key": "de-bw-08326000",
            "value": 220
        },
        {
            "hc-key": "de-bw-08212000",
            "value": 221
        },
        {
            "hc-key": "de-rp-07334000",
            "value": 222
        },
        {
            "hc-key": "de-bw-08216000",
            "value": 223
        },
        {
            "hc-key": "de-nw-05362000",
            "value": 224
        },
        {
            "hc-key": "de-nw-05382000",
            "value": 225
        },
        {
            "hc-key": "de-rp-07131000",
            "value": 226
        },
        {
            "hc-key": "de-by-09671000",
            "value": 227
        },
        {
            "hc-key": "de-rp-07137000",
            "value": 228
        },
        {
            "hc-key": "de-rp-07141000",
            "value": 229
        },
        {
            "hc-key": "de-rp-07111000",
            "value": 230
        },
        {
            "hc-key": "de-bw-08135000",
            "value": 231
        },
        {
            "hc-key": "de-ni-03354000",
            "value": 232
        },
        {
            "hc-key": "de-st-15090000",
            "value": 233
        },
        {
            "hc-key": "de-by-09780000",
            "value": 234
        },
        {
            "hc-key": "de-by-09376000",
            "value": 235
        },
        {
            "hc-key": "de-st-15086000",
            "value": 236
        },
        {
            "hc-key": "de-nw-05913000",
            "value": 237
        },
        {
            "hc-key": "de-nw-05911000",
            "value": 238
        },
        {
            "hc-key": "de-nw-05916000",
            "value": 239
        },
        {
            "hc-key": "de-nw-05513000",
            "value": 240
        },
        {
            "hc-key": "de-ni-03401000",
            "value": 241
        },
        {
            "hc-key": "de-ni-03251000",
            "value": 242
        },
        {
            "hc-key": "de-ni-03352000",
            "value": 243
        },
        {
            "hc-key": "de-by-09779000",
            "value": 244
        },
        {
            "hc-key": "de-by-09563000",
            "value": 245
        },
        {
            "hc-key": "de-by-09562000",
            "value": 246
        },
        {
            "hc-key": "de-by-09573000",
            "value": 247
        },
        {
            "hc-key": "de-th-16073000",
            "value": 248
        },
        {
            "hc-key": "de-he-06435000",
            "value": 249
        },
        {
            "hc-key": "de-sn-14625000",
            "value": 250
        },
        {
            "hc-key": "de-bb-12065000",
            "value": 251
        },
        {
            "hc-key": "de-bb-12073000",
            "value": 252
        },
        {
            "hc-key": "de-ni-03454000",
            "value": 253
        },
        {
            "hc-key": "de-by-09189000",
            "value": 254
        },
        {
            "hc-key": "de-sh-01057000",
            "value": 255
        },
        {
            "hc-key": "de-sh-01002000",
            "value": 256
        },
        {
            "hc-key": "de-nw-05154000",
            "value": 257
        },
        {
            "hc-key": "de-by-09182000",
            "value": 258
        },
        {
            "hc-key": "de-ni-03458000",
            "value": 259
        },
        {
            "hc-key": "de-ni-03157000",
            "value": 260
        },
        {
            "hc-key": "de-by-09371000",
            "value": 261
        },
        {
            "hc-key": "de-by-09185000",
            "value": 262
        },
        {
            "hc-key": "de-by-09176000",
            "value": 263
        },
        {
            "hc-key": "de-by-09161000",
            "value": 264
        },
        {
            "hc-key": "de-sl-10046000",
            "value": 265
        },
        {
            "hc-key": "de-by-09178000",
            "value": 266
        },
        {
            "hc-key": "de-by-09171000",
            "value": 267
        },
        {
            "hc-key": "de-bw-08417000",
            "value": 268
        },
        {
            "hc-key": "de-st-15085000",
            "value": 269
        },
        {
            "hc-key": "de-ni-03255000",
            "value": 270
        },
        {
            "hc-key": "de-nw-05966000",
            "value": 271
        },
        {
            "hc-key": "de-by-09181000",
            "value": 272
        },
        {
            "hc-key": "de-ni-03155000",
            "value": 273
        },
        {
            "hc-key": "de-nw-05512000",
            "value": 274
        },
        {
            "hc-key": "de-nw-05314000",
            "value": 275
        },
        {
            "hc-key": "de-bw-08127000",
            "value": 276
        },
        {
            "hc-key": "de-he-06434000",
            "value": 277
        },
        {
            "hc-key": "de-bb-12070000",
            "value": 278
        },
        {
            "hc-key": "de-th-16064000",
            "value": 279
        },
        {
            "hc-key": "de-sh-01003000",
            "value": 280
        },
        {
            "hc-key": "de-st-15084000",
            "value": 281
        },
        {
            "hc-key": "de-th-16071000",
            "value": 282
        },
        {
            "hc-key": "de-bb-12064000",
            "value": 283
        },
        {
            "hc-key": "de-be-11000000",
            "value": 284
        },
        {
            "hc-key": "de-bb-12072000",
            "value": 285
        },
        {
            "hc-key": "de-bb-12063000",
            "value": 286
        },
        {
            "hc-key": "de-by-09479000",
            "value": 287
        },
        {
            "hc-key": "de-th-16076000",
            "value": 288
        },
        {
            "hc-key": "de-nw-05111000",
            "value": 289
        },
        {
            "hc-key": "de-by-09572000",
            "value": 290
        },
        {
            "hc-key": "de-nw-05114000",
            "value": 291
        },
        {
            "hc-key": "de-by-09661000",
            "value": 292
        },
        {
            "hc-key": "de-rp-07231000",
            "value": 293
        },
        {
            "hc-key": "de-by-09565000",
            "value": 294
        },
        {
            "hc-key": "de-by-09473000",
            "value": 295
        },
        {
            "hc-key": "de-by-09675000",
            "value": 296
        },
        {
            "hc-key": "de-by-09571000",
            "value": 297
        },
        {
            "hc-key": "de-bw-08128000",
            "value": 298
        },
        {
            "hc-key": "de-nw-05915000",
            "value": 299
        },
        {
            "hc-key": "de-bw-08327000",
            "value": 300
        },
        {
            "hc-key": "de-bw-08325000",
            "value": 301
        },
        {
            "hc-key": "de-he-06413000",
            "value": 302
        },
        {
            "hc-key": "de-he-06440000",
            "value": 303
        },
        {
            "hc-key": "de-rp-07315000",
            "value": 304
        },
        {
            "hc-key": "de-by-09373000",
            "value": 305
        },
        {
            "hc-key": "de-nw-05711000",
            "value": 306
        },
        {
            "hc-key": "de-sh-01004000",
            "value": 307
        },
        {
            "hc-key": "de-th-16077000",
            "value": 308
        },
        {
            "hc-key": "de-sn-14511000",
            "value": 309
        },
        {
            "hc-key": "de-sn-14524000",
            "value": 310
        },
        {
            "hc-key": "de-th-16051000",
            "value": 311
        },
        {
            "hc-key": "de-he-06635000",
            "value": 312
        },
        {
            "hc-key": "de-bb-12060000",
            "value": 313
        },
        {
            "hc-key": "de-by-09475000",
            "value": 314
        },
        {
            "hc-key": "de-mv-13071000",
            "value": 315
        },
        {
            "hc-key": "de-nw-05770000",
            "value": 316
        },
        {
            "hc-key": "de-sn-14628000",
            "value": 317
        },
        {
            "hc-key": "de-sn-14627000",
            "value": 318
        },
        {
            "hc-key": "de-rp-07133000",
            "value": 319
        },
        {
            "hc-key": "de-rp-07336000",
            "value": 320
        },
        {
            "hc-key": "de-rp-07333000",
            "value": 321
        },
        {
            "hc-key": "de-by-09673000",
            "value": 322
        },
        {
            "hc-key": "de-by-09677000",
            "value": 323
        },
        {
            "hc-key": "de-th-16053000",
            "value": 324
        },
        {
            "hc-key": "de-by-09476000",
            "value": 325
        },
        {
            "hc-key": "de-by-09477000",
            "value": 326
        },
        {
            "hc-key": "de-he-06439000",
            "value": 327
        },
        {
            "hc-key": "de-bb-12051000",
            "value": 328
        },
        {
            "hc-key": "de-ni-03357000",
            "value": 329
        },
        {
            "hc-key": "de-by-09274000",
            "value": 330
        },
        {
            "hc-key": "de-by-09761000",
            "value": 331
        },
        {
            "hc-key": "de-by-09575000",
            "value": 332
        },
        {
            "hc-key": "de-by-09679000",
            "value": 333
        },
        {
            "hc-key": "de-bw-08416000",
            "value": 334
        },
        {
            "hc-key": "de-mv-13075000",
            "value": 335
        },
        {
            "hc-key": "de-sh-01059000",
            "value": 336
        },
        {
            "hc-key": "de-by-09672000",
            "value": 337
        },
        {
            "hc-key": "de-mv-13004000",
            "value": 338
        },
        {
            "hc-key": "de-ni-03452000",
            "value": 339
        },
        {
            "hc-key": "de-sh-01051000",
            "value": 340
        },
        {
            "hc-key": "de-mv-13072000",
            "value": 341
        },
        {
            "hc-key": "de-bw-08337000",
            "value": 342
        },
        {
            "hc-key": "de-bw-08211000",
            "value": 343
        },
        {
            "hc-key": "de-by-09180000",
            "value": 344
        },
        {
            "hc-key": "de-bb-12067000",
            "value": 345
        },
        {
            "hc-key": "de-by-09275000",
            "value": 346
        },
        {
            "hc-key": "de-by-09272000",
            "value": 347
        },
        {
            "hc-key": "de-sn-14521000",
            "value": 348
        },
        {
            "hc-key": "de-sl-10041000",
            "value": 349
        },
        {
            "hc-key": "de-bw-08336000",
            "value": 350
        },
        {
            "hc-key": "de-by-09279000",
            "value": 351
        },
        {
            "hc-key": "de-sn-14713000",
            "value": 352
        },
        {
            "hc-key": "de-bw-08315000",
            "value": 353
        },
        {
            "hc-key": "de-rp-07233000",
            "value": 354
        },
        {
            "hc-key": "de-by-09276000",
            "value": 355
        },
        {
            "hc-key": "de-st-15081000",
            "value": 356
        },
        {
            "hc-key": "de-bw-08437000",
            "value": 357
        },
        {
            "hc-key": "de-he-06631000",
            "value": 358
        },
        {
            "hc-key": "de-th-16063000",
            "value": 359
        },
        {
            "hc-key": "de-he-06531000",
            "value": 360
        },
        {
            "hc-key": "de-by-09273000",
            "value": 361
        },
        {
            "hc-key": "de-st-15002000",
            "value": 362
        },
        {
            "hc-key": "de-ni-03351000",
            "value": 363
        },
        {
            "hc-key": "de-by-09261000",
            "value": 364
        },
        {
            "hc-key": "de-st-15091000",
            "value": 365
        },
        {
            "hc-key": "de-by-09773000",
            "value": 366
        },
        {
            "hc-key": "de-ni-03103000",
            "value": 367
        },
        {
            "hc-key": "de-bw-08126000",
            "value": 368
        },
        {
            "hc-key": "de-nw-05774000",
            "value": 369
        },
        {
            "hc-key": "de-nw-05116000",
            "value": 370
        },
        {
            "hc-key": "de-by-09278000",
            "value": 371
        },
        {
            "hc-key": "de-bw-08121000",
            "value": 372
        },
        {
            "hc-key": "de-rp-07317000",
            "value": 373
        },
        {
            "hc-key": "de-nw-05515000",
            "value": 374
        },
        {
            "hc-key": "de-rp-07211000",
            "value": 375
        },
        {
            "hc-key": "de-rp-07320000",
            "value": 376
        },
        {
            "hc-key": "de-rp-07135000",
            "value": 377
        },
        {
            "hc-key": "de-by-09763000",
            "value": 378
        },
        {
            "hc-key": "de-ni-03460000",
            "value": 379
        },
        {
            "hc-key": "de-by-09190000",
            "value": 380
        },
        {
            "hc-key": "de-bb-12052000",
            "value": 381
        },
        {
            "hc-key": "de-ni-03453000",
            "value": 382
        },
        {
            "hc-key": "de-by-09374000",
            "value": 383
        },
        {
            "hc-key": "de-by-09263000",
            "value": 384
        },
        {
            "hc-key": "de-by-09362000",
            "value": 385
        },
        {
            "hc-key": "de-bb-12066000",
            "value": 386
        },
        {
            "hc-key": "de-bb-12062000",
            "value": 387
        },
        {
            "hc-key": "de-by-09577000",
            "value": 388
        },
        {
            "hc-key": "de-by-09561000",
            "value": 389
        },
        {
            "hc-key": "de-he-06533000",
            "value": 390
        },
        {
            "hc-key": "de-bb-12061000",
            "value": 391
        },
        {
            "hc-key": "de-th-16055000",
            "value": 392
        },
        {
            "hc-key": "de-sn-14612000",
            "value": 393
        },
        {
            "hc-key": "de-bb-12054000",
            "value": 394
        },
        {
            "hc-key": "de-by-09363000",
            "value": 395
        },
        {
            "hc-key": "de-he-06632000",
            "value": 396
        },
        {
            "hc-key": "de-by-09663000",
            "value": 397
        },
        {
            "hc-key": "de-by-09173000",
            "value": 398
        },
        {
            "hc-key": "de-ni-03257000",
            "value": 399
        },
        {
            "hc-key": "de-he-06634000",
            "value": 400
        },
        {
            "hc-key": "de-by-09464000",
            "value": 401
        },
        {
            "value": 402
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/de/de-all-all.js">Germany, admin2</a>'
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
            mapData: Highcharts.maps['countries/de/de-all-all'],
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
