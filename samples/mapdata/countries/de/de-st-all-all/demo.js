$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "de-st-14730000-14730190",
            "value": 0
        },
        {
            "hc-key": "de-st-15084000-15084012",
            "value": 1
        },
        {
            "hc-key": "de-st-15088000-15088295",
            "value": 2
        },
        {
            "hc-key": "de-st-15082000-15082256",
            "value": 3
        },
        {
            "hc-key": "de-st-15087000-15087010",
            "value": 4
        },
        {
            "hc-key": "de-st-14730000-14730045",
            "value": 5
        },
        {
            "hc-key": "de-st-15083000-15083495",
            "value": 6
        },
        {
            "hc-key": "de-st-15083000-15083020",
            "value": 7
        },
        {
            "hc-key": "de-st-15081000-15081026",
            "value": 8
        },
        {
            "hc-key": "de-st-15081000-15081045",
            "value": 9
        },
        {
            "hc-key": "de-st-15089000-15089043",
            "value": 10
        },
        {
            "hc-key": "de-st-15089000-15089041",
            "value": 11
        },
        {
            "hc-key": "de-st-14730000-14730050",
            "value": 12
        },
        {
            "hc-key": "de-st-15001000-15001000",
            "value": 13
        },
        {
            "hc-key": "de-st-15082000-15082301",
            "value": 14
        },
        {
            "hc-key": "de-st-15082000-15082241",
            "value": 15
        },
        {
            "hc-key": "de-st-15089000-15089042",
            "value": 16
        },
        {
            "hc-key": "de-st-15083000-15083490",
            "value": 17
        },
        {
            "hc-key": "de-st-15088000-15088355",
            "value": 18
        },
        {
            "hc-key": "de-st-15084000-15084250",
            "value": 19
        },
        {
            "hc-key": "de-st-15087000-15087075",
            "value": 20
        },
        {
            "hc-key": "de-st-15087000-15087130",
            "value": 21
        },
        {
            "hc-key": "de-st-15087000-15087031",
            "value": 22
        },
        {
            "hc-key": "de-st-15087000-15087165",
            "value": 23
        },
        {
            "hc-key": "de-st-15088000-15088216",
            "value": 24
        },
        {
            "hc-key": "de-st-15083000-15083485",
            "value": 25
        },
        {
            "hc-key": "de-st-15090000-15090180",
            "value": 26
        },
        {
            "hc-key": "de-st-15090000-15090245",
            "value": 27
        },
        {
            "hc-key": "de-st-15088000-15088030",
            "value": 28
        },
        {
            "hc-key": "de-st-15083000-15083323",
            "value": 29
        },
        {
            "hc-key": "de-st-15088000-15088250",
            "value": 30
        },
        {
            "hc-key": "de-st-15083000-15083230",
            "value": 31
        },
        {
            "hc-key": "de-st-15085000-15085145",
            "value": 32
        },
        {
            "hc-key": "de-st-15083000-15083115",
            "value": 33
        },
        {
            "hc-key": "de-st-15084000-15084282",
            "value": 34
        },
        {
            "hc-key": "de-st-15084000-15084125",
            "value": 35
        },
        {
            "hc-key": "de-st-15084000-15084335",
            "value": 36
        },
        {
            "hc-key": "de-st-15084000-15084470",
            "value": 37
        },
        {
            "hc-key": "de-st-15090000-15090135",
            "value": 38
        },
        {
            "hc-key": "de-st-15087000-15087101",
            "value": 39
        },
        {
            "hc-key": "de-st-15083000-15083320",
            "value": 40
        },
        {
            "hc-key": "de-st-15085000-15085055",
            "value": 41
        },
        {
            "hc-key": "de-st-15085000-15085227",
            "value": 42
        },
        {
            "hc-key": "de-st-15089000-15089365",
            "value": 43
        },
        {
            "hc-key": "de-st-14730000-14730100",
            "value": 44
        },
        {
            "hc-key": "de-st-14730000-14730120",
            "value": 45
        },
        {
            "hc-key": "de-st-15084000-15084590",
            "value": 46
        },
        {
            "hc-key": "de-st-14730000-14730280",
            "value": 47
        },
        {
            "hc-key": "de-st-14730000-14730360",
            "value": 48
        },
        {
            "hc-key": "de-st-14730000-14730320",
            "value": 49
        },
        {
            "hc-key": "de-st-15084000-15084133",
            "value": 50
        },
        {
            "hc-key": "de-st-14730000-14730080",
            "value": 51
        },
        {
            "hc-key": "de-st-15081000-15081440",
            "value": 52
        },
        {
            "hc-key": "de-st-15081000-15081225",
            "value": 53
        },
        {
            "hc-key": "de-st-15083000-15083060",
            "value": 54
        },
        {
            "hc-key": "de-st-15083000-15083411",
            "value": 55
        },
        {
            "hc-key": "de-st-15089000-15089015",
            "value": 56
        },
        {
            "hc-key": "de-st-15089000-15089165",
            "value": 57
        },
        {
            "hc-key": "de-st-15088000-15088305",
            "value": 58
        },
        {
            "hc-key": "de-st-15084000-15084246",
            "value": 59
        },
        {
            "hc-key": "de-st-15081000-15081280",
            "value": 60
        },
        {
            "hc-key": "de-st-15084000-15084445",
            "value": 61
        },
        {
            "hc-key": "de-st-15084000-15084550",
            "value": 62
        },
        {
            "hc-key": "de-st-15088000-15088205",
            "value": 63
        },
        {
            "hc-key": "de-st-15088000-15088100",
            "value": 64
        },
        {
            "hc-key": "de-st-15089000-15089175",
            "value": 65
        },
        {
            "hc-key": "de-st-15088000-15088065",
            "value": 66
        },
        {
            "hc-key": "de-st-15081000-15081240",
            "value": 67
        },
        {
            "hc-key": "de-st-15090000-15090415",
            "value": 68
        },
        {
            "hc-key": "de-st-14730000-14730160",
            "value": 69
        },
        {
            "hc-key": "de-st-15081000-15081545",
            "value": 70
        },
        {
            "hc-key": "de-st-15088000-15088319",
            "value": 71
        },
        {
            "hc-key": "de-st-15002000-15002000",
            "value": 72
        },
        {
            "hc-key": "de-st-15084000-15084565",
            "value": 73
        },
        {
            "hc-key": "de-st-15084000-15084275",
            "value": 74
        },
        {
            "hc-key": "de-st-15089000-15089185",
            "value": 75
        },
        {
            "hc-key": "de-st-15084000-15084132",
            "value": 76
        },
        {
            "hc-key": "de-st-15087000-15087045",
            "value": 77
        },
        {
            "hc-key": "de-st-15087000-15087210",
            "value": 78
        },
        {
            "hc-key": "de-st-15089000-15089307",
            "value": 79
        },
        {
            "hc-key": "de-st-15087000-15087015",
            "value": 80
        },
        {
            "hc-key": "de-st-15084000-15084170",
            "value": 81
        },
        {
            "hc-key": "de-st-15088000-15088235",
            "value": 82
        },
        {
            "hc-key": "de-st-15083000-15083505",
            "value": 83
        },
        {
            "hc-key": "de-st-15083000-15083515",
            "value": 84
        },
        {
            "hc-key": "de-st-15083000-15083535",
            "value": 85
        },
        {
            "hc-key": "de-st-15087000-15087275",
            "value": 86
        },
        {
            "hc-key": "de-st-15087000-15087370",
            "value": 87
        },
        {
            "hc-key": "de-st-15083000-15083565",
            "value": 88
        },
        {
            "hc-key": "de-st-15086000-15086015",
            "value": 89
        },
        {
            "hc-key": "de-st-15083000-15083040",
            "value": 90
        },
        {
            "hc-key": "de-st-15086000-15086145",
            "value": 91
        },
        {
            "hc-key": "de-st-15083000-15083120",
            "value": 92
        },
        {
            "hc-key": "de-st-15083000-15083270",
            "value": 93
        },
        {
            "hc-key": "de-st-15083000-15083130",
            "value": 94
        },
        {
            "hc-key": "de-st-15083000-15083390",
            "value": 95
        },
        {
            "hc-key": "de-st-15085000-15085287",
            "value": 96
        },
        {
            "hc-key": "de-st-15083000-15083125",
            "value": 97
        },
        {
            "hc-key": "de-st-15085000-15085090",
            "value": 98
        },
        {
            "hc-key": "de-st-15084000-15084560",
            "value": 99
        },
        {
            "hc-key": "de-st-15084000-15084355",
            "value": 100
        },
        {
            "hc-key": "de-st-15085000-15085365",
            "value": 101
        },
        {
            "hc-key": "de-st-15085000-15085040",
            "value": 102
        },
        {
            "hc-key": "de-st-15090000-15090010",
            "value": 103
        },
        {
            "hc-key": "de-st-15090000-15090310",
            "value": 104
        },
        {
            "hc-key": "de-st-15086000-15086080",
            "value": 105
        },
        {
            "hc-key": "de-st-15090000-15090500",
            "value": 106
        },
        {
            "hc-key": "de-st-15090000-15090550",
            "value": 107
        },
        {
            "hc-key": "de-st-15090000-15090220",
            "value": 108
        },
        {
            "hc-key": "de-st-15089000-15089045",
            "value": 109
        },
        {
            "hc-key": "de-st-15089000-15089310",
            "value": 110
        },
        {
            "hc-key": "de-st-15085000-15085160",
            "value": 111
        },
        {
            "hc-key": "de-st-15089000-15089130",
            "value": 112
        },
        {
            "hc-key": "de-st-15088000-15088365",
            "value": 113
        },
        {
            "hc-key": "de-st-15088000-15088265",
            "value": 114
        },
        {
            "hc-key": "de-st-15088000-15088340",
            "value": 115
        },
        {
            "hc-key": "de-st-15085000-15085135",
            "value": 116
        },
        {
            "hc-key": "de-st-15085000-15085285",
            "value": 117
        },
        {
            "hc-key": "de-st-15085000-15085125",
            "value": 118
        },
        {
            "hc-key": "de-st-15083000-15083025",
            "value": 119
        },
        {
            "hc-key": "de-st-15083000-15083415",
            "value": 120
        },
        {
            "hc-key": "de-st-15085000-15085190",
            "value": 121
        },
        {
            "hc-key": "de-st-15083000-15083557",
            "value": 122
        },
        {
            "hc-key": "de-st-15081000-15081135",
            "value": 123
        },
        {
            "hc-key": "de-st-15083000-15083580",
            "value": 124
        },
        {
            "hc-key": "de-st-15083000-15083361",
            "value": 125
        },
        {
            "hc-key": "de-st-15083000-15083030",
            "value": 126
        },
        {
            "hc-key": "de-st-14730000-14730210",
            "value": 127
        },
        {
            "hc-key": "de-st-14730000-14730170",
            "value": 128
        },
        {
            "hc-key": "de-st-14730000-14730060",
            "value": 129
        },
        {
            "hc-key": "de-st-15083000-15083298",
            "value": 130
        },
        {
            "hc-key": "de-st-14730000-14730230",
            "value": 131
        },
        {
            "hc-key": "de-st-14730000-14730200",
            "value": 132
        },
        {
            "hc-key": "de-st-15090000-15090520",
            "value": 133
        },
        {
            "hc-key": "de-st-15090000-15090007",
            "value": 134
        },
        {
            "hc-key": "de-st-14730000-14730250",
            "value": 135
        },
        {
            "hc-key": "de-st-15085000-15085235",
            "value": 136
        },
        {
            "hc-key": "de-st-15003000-15003000",
            "value": 137
        },
        {
            "hc-key": "de-st-15086000-15086055",
            "value": 138
        },
        {
            "hc-key": "de-st-15089000-15089026",
            "value": 139
        },
        {
            "hc-key": "de-st-15084000-15084130",
            "value": 140
        },
        {
            "hc-key": "de-st-15089000-15089305",
            "value": 141
        },
        {
            "hc-key": "de-st-15089000-15089030",
            "value": 142
        },
        {
            "hc-key": "de-st-15083000-15083275",
            "value": 143
        },
        {
            "hc-key": "de-st-15082000-15082180",
            "value": 144
        },
        {
            "hc-key": "de-st-15088000-15088025",
            "value": 145
        },
        {
            "hc-key": "de-st-15088000-15088220",
            "value": 146
        },
        {
            "hc-key": "de-st-15081000-15081290",
            "value": 147
        },
        {
            "hc-key": "de-st-15090000-15090535",
            "value": 148
        },
        {
            "hc-key": "de-st-15090000-15090546",
            "value": 149
        },
        {
            "hc-key": "de-st-15090000-15090070",
            "value": 150
        },
        {
            "hc-key": "de-st-15087000-15087470",
            "value": 151
        },
        {
            "hc-key": "de-st-15087000-15087070",
            "value": 152
        },
        {
            "hc-key": "de-st-15090000-15090635",
            "value": 153
        },
        {
            "hc-key": "de-st-15083000-15083245",
            "value": 154
        },
        {
            "hc-key": "de-st-15090000-15090285",
            "value": 155
        },
        {
            "hc-key": "de-st-14730000-14730310",
            "value": 156
        },
        {
            "hc-key": "de-st-14730000-14730010",
            "value": 157
        },
        {
            "hc-key": "de-st-14730000-14730030",
            "value": 158
        },
        {
            "hc-key": "de-st-15090000-15090270",
            "value": 159
        },
        {
            "hc-key": "de-st-15090000-15090225",
            "value": 160
        },
        {
            "hc-key": "de-st-15090000-15090610",
            "value": 161
        },
        {
            "hc-key": "de-st-15090000-15090008",
            "value": 162
        },
        {
            "hc-key": "de-st-14730000-14730090",
            "value": 163
        },
        {
            "hc-key": "de-st-15088000-15088195",
            "value": 164
        },
        {
            "hc-key": "de-st-15082000-15082340",
            "value": 165
        },
        {
            "hc-key": "de-st-15091000-15091020",
            "value": 166
        },
        {
            "hc-key": "de-st-15084000-15084135",
            "value": 167
        },
        {
            "hc-key": "de-st-15084000-15084025",
            "value": 168
        },
        {
            "hc-key": "de-st-15084000-15084285",
            "value": 169
        },
        {
            "hc-key": "de-st-15090000-15090435",
            "value": 170
        },
        {
            "hc-key": "de-st-15081000-15081095",
            "value": 171
        },
        {
            "hc-key": "de-st-15089000-15089075",
            "value": 172
        },
        {
            "hc-key": "de-st-15083000-15083190",
            "value": 173
        },
        {
            "hc-key": "de-st-15087000-15087125",
            "value": 174
        },
        {
            "hc-key": "de-st-15087000-15087440",
            "value": 175
        },
        {
            "hc-key": "de-st-15087000-15087250",
            "value": 176
        },
        {
            "hc-key": "de-st-15089000-15089245",
            "value": 177
        },
        {
            "hc-key": "de-st-14730000-14730340",
            "value": 178
        },
        {
            "hc-key": "de-st-15088000-15088150",
            "value": 179
        },
        {
            "hc-key": "de-st-15089000-15089195",
            "value": 180
        },
        {
            "hc-key": "de-st-15082000-15082377",
            "value": 181
        },
        {
            "hc-key": "de-st-14730000-14730270",
            "value": 182
        },
        {
            "hc-key": "de-st-15085000-15085230",
            "value": 183
        },
        {
            "hc-key": "de-st-15085000-15085110",
            "value": 184
        },
        {
            "hc-key": "de-st-14730000-14730020",
            "value": 185
        },
        {
            "hc-key": "de-st-15090000-15090485",
            "value": 186
        },
        {
            "hc-key": "de-st-15084000-15084375",
            "value": 187
        },
        {
            "hc-key": "de-st-15084000-15084115",
            "value": 188
        },
        {
            "hc-key": "de-st-15084000-15084013",
            "value": 189
        },
        {
            "hc-key": "de-st-15090000-15090445",
            "value": 190
        },
        {
            "hc-key": "de-st-15084000-15084207",
            "value": 191
        },
        {
            "hc-key": "de-st-15083000-15083355",
            "value": 192
        },
        {
            "hc-key": "de-st-15084000-15084360",
            "value": 193
        },
        {
            "hc-key": "de-st-15084000-15084150",
            "value": 194
        },
        {
            "hc-key": "de-st-15089000-15089005",
            "value": 195
        },
        {
            "hc-key": "de-st-15085000-15085330",
            "value": 196
        },
        {
            "hc-key": "de-st-15084000-15084015",
            "value": 197
        },
        {
            "hc-key": "de-st-15085000-15085140",
            "value": 198
        },
        {
            "hc-key": "de-st-15083000-15083035",
            "value": 199
        },
        {
            "hc-key": "de-st-15084000-15084490",
            "value": 200
        },
        {
            "hc-key": "de-st-15084000-15084235",
            "value": 201
        },
        {
            "hc-key": "de-st-15083000-15083205",
            "value": 202
        },
        {
            "hc-key": "de-st-14730000-14730140",
            "value": 203
        },
        {
            "hc-key": "de-st-14730000-14730150",
            "value": 204
        },
        {
            "hc-key": "de-st-14730000-14730110",
            "value": 205
        },
        {
            "hc-key": "de-st-15089000-15089235",
            "value": 206
        },
        {
            "hc-key": "de-st-15088000-15088020",
            "value": 207
        },
        {
            "hc-key": "de-st-15087000-15087205",
            "value": 208
        },
        {
            "hc-key": "de-st-15087000-15087260",
            "value": 209
        },
        {
            "hc-key": "de-st-15082000-15082440",
            "value": 210
        },
        {
            "hc-key": "de-st-14730000-14730180",
            "value": 211
        },
        {
            "hc-key": "de-st-15082000-15082015",
            "value": 212
        },
        {
            "hc-key": "de-st-14730000-14730070",
            "value": 213
        },
        {
            "hc-key": "de-st-15087000-15087412",
            "value": 214
        },
        {
            "hc-key": "de-st-15081000-15081105",
            "value": 215
        },
        {
            "hc-key": "de-st-15084000-15084341",
            "value": 216
        },
        {
            "hc-key": "de-st-15091000-15091375",
            "value": 217
        },
        {
            "hc-key": "de-st-15085000-15085185",
            "value": 218
        },
        {
            "hc-key": "de-st-15081000-15081030",
            "value": 219
        },
        {
            "hc-key": "de-st-15091000-15091060",
            "value": 220
        },
        {
            "hc-key": "de-st-15086000-15086140",
            "value": 221
        },
        {
            "hc-key": "de-st-15085000-15085228",
            "value": 222
        },
        {
            "hc-key": "de-st-15081000-15081455",
            "value": 223
        },
        {
            "hc-key": "de-st-15083000-15083531",
            "value": 224
        },
        {
            "hc-key": "de-st-15082000-15082005",
            "value": 225
        },
        {
            "hc-key": "de-st-14730000-14730330",
            "value": 226
        },
        {
            "hc-key": "de-st-15091000-15091010",
            "value": 227
        },
        {
            "hc-key": "de-st-15090000-15090003",
            "value": 228
        },
        {
            "hc-key": "de-st-15091000-15091145",
            "value": 229
        },
        {
            "hc-key": "de-st-15082000-15082430",
            "value": 230
        },
        {
            "hc-key": "de-st-15090000-15090631",
            "value": 231
        },
        {
            "hc-key": "de-st-15084000-15084442",
            "value": 232
        },
        {
            "hc-key": "de-st-14730000-14730300",
            "value": 233
        },
        {
            "hc-key": "de-st-15084000-15084315",
            "value": 234
        },
        {
            "hc-key": "de-st-15087000-15087220",
            "value": 235
        },
        {
            "hc-key": "de-st-15091000-15091391",
            "value": 236
        },
        {
            "hc-key": "de-st-15091000-15091241",
            "value": 237
        },
        {
            "hc-key": "de-st-15091000-15091110",
            "value": 238
        },
        {
            "hc-key": "de-st-15087000-15087386",
            "value": 239
        },
        {
            "hc-key": "de-st-15091000-15091160",
            "value": 240
        },
        {
            "hc-key": "de-st-15087000-15087055",
            "value": 241
        },
        {
            "hc-key": "de-st-15086000-15086040",
            "value": 242
        },
        {
            "hc-key": "de-st-15086000-15086005",
            "value": 243
        },
        {
            "hc-key": "de-st-15083000-15083440",
            "value": 244
        },
        {
            "hc-key": "de-st-15088000-15088330",
            "value": 245
        },
        {
            "hc-key": "de-st-15085000-15085370",
            "value": 246
        },
        {
            "hc-key": "de-st-15089000-15089055",
            "value": 247
        },
        {
            "hc-key": "de-st-15086000-15086035",
            "value": 248
        },
        {
            "value": 249
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/de/de-st-all-all.js">Sachsen-Anhalt</a>'
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
            mapData: Highcharts.maps['countries/de/de-st-all-all'],
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
