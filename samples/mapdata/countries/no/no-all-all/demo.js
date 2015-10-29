$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "no-tr-1943",
            "value": 0
        },
        {
            "hc-key": "no-tr-1941",
            "value": 1
        },
        {
            "hc-key": "no-ho-1244",
            "value": 2
        },
        {
            "hc-key": "no-tr-1902",
            "value": 3
        },
        {
            "hc-key": "no-nt-1755",
            "value": 4
        },
        {
            "hc-key": "no-nt-1750",
            "value": 5
        },
        {
            "hc-key": "no-mr-1576",
            "value": 6
        },
        {
            "hc-key": "no-no-1837",
            "value": 7
        },
        {
            "hc-key": "no-no-1834",
            "value": 8
        },
        {
            "hc-key": "no-no-1835",
            "value": 9
        },
        {
            "hc-key": "no-no-1838",
            "value": 10
        },
        {
            "hc-key": "no-fi-2018",
            "value": 11
        },
        {
            "hc-key": "no-fi-2014",
            "value": 12
        },
        {
            "hc-key": "no-nt-1719",
            "value": 13
        },
        {
            "hc-key": "no-st-1630",
            "value": 14
        },
        {
            "hc-key": "no-sf-1439",
            "value": 15
        },
        {
            "hc-key": "no-va-1004",
            "value": 16
        },
        {
            "hc-key": "no-fi-2020",
            "value": 17
        },
        {
            "hc-key": "no-st-1617",
            "value": 18
        },
        {
            "hc-key": "no-ro-1142",
            "value": 19
        },
        {
            "hc-key": "no-ro-1141",
            "value": 20
        },
        {
            "hc-key": "no-ro-1145",
            "value": 21
        },
        {
            "hc-key": "no-ho-1265",
            "value": 22
        },
        {
            "hc-key": "no-mr-1546",
            "value": 23
        },
        {
            "hc-key": "no-mr-1547",
            "value": 24
        },
        {
            "hc-key": "no-mr-1545",
            "value": 25
        },
        {
            "hc-key": "no-no-1828",
            "value": 26
        },
        {
            "hc-key": "no-no-1820",
            "value": 27
        },
        {
            "hc-key": "no-tr-1926",
            "value": 28
        },
        {
            "hc-key": "no-no-1848",
            "value": 29
        },
        {
            "hc-key": "no-no-1865",
            "value": 30
        },
        {
            "hc-key": "no-no-1868",
            "value": 31
        },
        {
            "hc-key": "no-mr-1515",
            "value": 32
        },
        {
            "hc-key": "no-no-1815",
            "value": 33
        },
        {
            "hc-key": "no-no-1816",
            "value": 34
        },
        {
            "hc-key": "no-no-1813",
            "value": 35
        },
        {
            "hc-key": "no-no-1818",
            "value": 36
        },
        {
            "hc-key": "no-mr-1532",
            "value": 37
        },
        {
            "hc-key": "no-mr-1531",
            "value": 38
        },
        {
            "hc-key": "no-ro-1151",
            "value": 39
        },
        {
            "hc-key": "no-sf-1411",
            "value": 40
        },
        {
            "hc-key": "no-sf-1412",
            "value": 41
        },
        {
            "hc-key": "no-of-111",
            "value": 42
        },
        {
            "hc-key": "no-no-1856",
            "value": 43
        },
        {
            "hc-key": "no-no-1857",
            "value": 44
        },
        {
            "hc-key": "no-ho-1259",
            "value": 45
        },
        {
            "hc-key": "no-tr-1936",
            "value": 46
        },
        {
            "hc-key": "no-nt-1748",
            "value": 47
        },
        {
            "hc-key": "no-vf-723",
            "value": 48
        },
        {
            "hc-key": "no-no-1804",
            "value": 49
        },
        {
            "hc-key": "no-vf-716",
            "value": 50
        },
        {
            "hc-key": "no-no-1845",
            "value": 51
        },
        {
            "hc-key": "no-he-432",
            "value": 52
        },
        {
            "hc-key": "no-ho-1247",
            "value": 53
        },
        {
            "hc-key": "no-no-1870",
            "value": 54
        },
        {
            "hc-key": "no-tr-1917",
            "value": 55
        },
        {
            "hc-key": "no-nt-1721",
            "value": 56
        },
        {
            "hc-key": "no-no-1866",
            "value": 57
        },
        {
            "hc-key": "no-sf-1413",
            "value": 58
        },
        {
            "hc-key": "no-mr-1519",
            "value": 59
        },
        {
            "hc-key": "no-mr-1520",
            "value": 60
        },
        {
            "hc-key": "no-nt-1739",
            "value": 61
        },
        {
            "hc-key": "no-nt-1714",
            "value": 62
        },
        {
            "hc-key": "no-st-1663",
            "value": 63
        },
        {
            "hc-key": "no-fi-2004",
            "value": 64
        },
        {
            "hc-key": "no-vf-706",
            "value": 65
        },
        {
            "hc-key": "no-ro-1144",
            "value": 66
        },
        {
            "hc-key": "no-of-118",
            "value": 67
        },
        {
            "hc-key": "no-of-101",
            "value": 68
        },
        {
            "hc-key": "no-no-1849",
            "value": 69
        },
        {
            "hc-key": "no-st-1621",
            "value": 70
        },
        {
            "hc-key": "no-st-1627",
            "value": 71
        },
        {
            "hc-key": "no-no-1836",
            "value": 72
        },
        {
            "hc-key": "no-vf-701",
            "value": 73
        },
        {
            "hc-key": "no-va-1037",
            "value": 74
        },
        {
            "hc-key": "no-ho-1221",
            "value": 75
        },
        {
            "hc-key": "no-vf-722",
            "value": 76
        },
        {
            "hc-key": "no-sf-1428",
            "value": 77
        },
        {
            "hc-key": "no-mr-1514",
            "value": 78
        },
        {
            "hc-key": "no-no-1812",
            "value": 79
        },
        {
            "hc-key": "no-te-819",
            "value": 80
        },
        {
            "hc-key": "no-te-806",
            "value": 81
        },
        {
            "hc-key": "no-ak-214",
            "value": 82
        },
        {
            "hc-key": "no-ak-215",
            "value": 83
        },
        {
            "hc-key": "no-of-138",
            "value": 84
        },
        {
            "hc-key": "no-no-1850",
            "value": 85
        },
        {
            "hc-key": "no-no-1854",
            "value": 86
        },
        {
            "hc-key": "no-tr-1942",
            "value": 87
        },
        {
            "hc-key": "no-tr-1940",
            "value": 88
        },
        {
            "hc-key": "no-te-814",
            "value": 89
        },
        {
            "hc-key": "no-te-815",
            "value": 90
        },
        {
            "hc-key": "no-te-817",
            "value": 91
        },
        {
            "hc-key": "no-ro-1149",
            "value": 92
        },
        {
            "hc-key": "no-mr-1566",
            "value": 93
        },
        {
            "hc-key": "no-ho-1251",
            "value": 94
        },
        {
            "hc-key": "no-vf-711",
            "value": 95
        },
        {
            "hc-key": "no-nt-1702",
            "value": 96
        },
        {
            "hc-key": "no-nt-1724",
            "value": 97
        },
        {
            "hc-key": "no-nt-1703",
            "value": 98
        },
        {
            "hc-key": "no-aa-911",
            "value": 99
        },
        {
            "hc-key": "no-aa-912",
            "value": 100
        },
        {
            "hc-key": "no-ro-1129",
            "value": 101
        },
        {
            "hc-key": "no-ro-1122",
            "value": 102
        },
        {
            "hc-key": "no-ro-1120",
            "value": 103
        },
        {
            "hc-key": "no-ro-1124",
            "value": 104
        },
        {
            "hc-key": "no-ro-1127",
            "value": 105
        },
        {
            "hc-key": "no-va-1018",
            "value": 106
        },
        {
            "hc-key": "no-va-1017",
            "value": 107
        },
        {
            "hc-key": "no-ho-1234",
            "value": 108
        },
        {
            "hc-key": "no-ho-1231",
            "value": 109
        },
        {
            "hc-key": "no-ho-1238",
            "value": 110
        },
        {
            "hc-key": "no-ho-1232",
            "value": 111
        },
        {
            "hc-key": "no-ho-1233",
            "value": 112
        },
        {
            "hc-key": "no-ho-1235",
            "value": 113
        },
        {
            "hc-key": "no-ho-1241",
            "value": 114
        },
        {
            "hc-key": "no-of-104",
            "value": 115
        },
        {
            "hc-key": "no-of-105",
            "value": 116
        },
        {
            "hc-key": "no-aa-901",
            "value": 117
        },
        {
            "hc-key": "no-aa-906",
            "value": 118
        },
        {
            "hc-key": "no-aa-904",
            "value": 119
        },
        {
            "hc-key": "no-no-1841",
            "value": 120
        },
        {
            "hc-key": "no-no-1840",
            "value": 121
        },
        {
            "hc-key": "no-ho-1243",
            "value": 122
        },
        {
            "hc-key": "no-ho-1245",
            "value": 123
        },
        {
            "hc-key": "no-ho-1246",
            "value": 124
        },
        {
            "hc-key": "no-he-441",
            "value": 125
        },
        {
            "hc-key": "no-he-437",
            "value": 126
        },
        {
            "hc-key": "no-he-436",
            "value": 127
        },
        {
            "hc-key": "no-he-434",
            "value": 128
        },
        {
            "hc-key": "no-he-428",
            "value": 129
        },
        {
            "hc-key": "no-mr-1539",
            "value": 130
        },
        {
            "hc-key": "no-mr-1524",
            "value": 131
        },
        {
            "hc-key": "no-mr-1526",
            "value": 132
        },
        {
            "hc-key": "no-st-1622",
            "value": 133
        },
        {
            "hc-key": "no-st-1624",
            "value": 134
        },
        {
            "hc-key": "no-aa-919",
            "value": 135
        },
        {
            "hc-key": "no-op-529",
            "value": 136
        },
        {
            "hc-key": "no-ak-239",
            "value": 137
        },
        {
            "hc-key": "no-ak-238",
            "value": 138
        },
        {
            "hc-key": "no-ak-234",
            "value": 139
        },
        {
            "hc-key": "no-ak-235",
            "value": 140
        },
        {
            "hc-key": "no-he-420",
            "value": 141
        },
        {
            "hc-key": "no-ak-236",
            "value": 142
        },
        {
            "hc-key": "no-op-528",
            "value": 143
        },
        {
            "hc-key": "no-ak-237",
            "value": 144
        },
        {
            "hc-key": "no-he-426",
            "value": 145
        },
        {
            "hc-key": "no-ak-233",
            "value": 146
        },
        {
            "hc-key": "no-ak-231",
            "value": 147
        },
        {
            "hc-key": "no-ak-230",
            "value": 148
        },
        {
            "hc-key": "no-nt-1756",
            "value": 149
        },
        {
            "hc-key": "no-nt-1751",
            "value": 150
        },
        {
            "hc-key": "no-bu-625",
            "value": 151
        },
        {
            "hc-key": "no-vf-714",
            "value": 152
        },
        {
            "hc-key": "no-op-512",
            "value": 153
        },
        {
            "hc-key": "no-va-1003",
            "value": 154
        },
        {
            "hc-key": "no-op-514",
            "value": 155
        },
        {
            "hc-key": "no-va-1001",
            "value": 156
        },
        {
            "hc-key": "no-aa-928",
            "value": 157
        },
        {
            "hc-key": "no-mr-1571",
            "value": 158
        },
        {
            "hc-key": "no-ho-1227",
            "value": 159
        },
        {
            "hc-key": "no-bu-620",
            "value": 160
        },
        {
            "hc-key": "no-of-137",
            "value": 161
        },
        {
            "hc-key": "no-of-136",
            "value": 162
        },
        {
            "hc-key": "no-of-135",
            "value": 163
        },
        {
            "hc-key": "no-bu-627",
            "value": 164
        },
        {
            "hc-key": "no-ho-1222",
            "value": 165
        },
        {
            "hc-key": "no-ho-1219",
            "value": 166
        },
        {
            "hc-key": "no-no-1832",
            "value": 167
        },
        {
            "hc-key": "no-no-1833",
            "value": 168
        },
        {
            "hc-key": "no-no-1839",
            "value": 169
        },
        {
            "hc-key": "no-fi-2019",
            "value": 170
        },
        {
            "hc-key": "no-fi-2015",
            "value": 171
        },
        {
            "hc-key": "no-fi-2017",
            "value": 172
        },
        {
            "hc-key": "no-tr-2012",
            "value": 173
        },
        {
            "hc-key": "no-te-830",
            "value": 174
        },
        {
            "hc-key": "no-te-829",
            "value": 175
        },
        {
            "hc-key": "no-te-826",
            "value": 176
        },
        {
            "hc-key": "no-te-828",
            "value": 177
        },
        {
            "hc-key": "no-te-807",
            "value": 178
        },
        {
            "hc-key": "no-te-822",
            "value": 179
        },
        {
            "hc-key": "no-vf-704",
            "value": 180
        },
        {
            "hc-key": "no-vf-713",
            "value": 181
        },
        {
            "hc-key": "no-vf-702",
            "value": 182
        },
        {
            "hc-key": "no-bu-616",
            "value": 183
        },
        {
            "hc-key": "no-bu-619",
            "value": 184
        },
        {
            "hc-key": "no-nt-1711",
            "value": 185
        },
        {
            "hc-key": "no-nt-1717",
            "value": 186
        },
        {
            "hc-key": "no-st-1653",
            "value": 187
        },
        {
            "hc-key": "no-st-1657",
            "value": 188
        },
        {
            "hc-key": "no-ro-1133",
            "value": 189
        },
        {
            "hc-key": "no-ro-1134",
            "value": 190
        },
        {
            "hc-key": "no-ro-1130",
            "value": 191
        },
        {
            "hc-key": "no-ro-1135",
            "value": 192
        },
        {
            "hc-key": "no-st-1664",
            "value": 193
        },
        {
            "hc-key": "no-st-1665",
            "value": 194
        },
        {
            "hc-key": "no-st-1644",
            "value": 195
        },
        {
            "hc-key": "no-st-1648",
            "value": 196
        },
        {
            "hc-key": "no-sf-1432",
            "value": 197
        },
        {
            "hc-key": "no-sf-1433",
            "value": 198
        },
        {
            "hc-key": "no-sf-1430",
            "value": 199
        },
        {
            "hc-key": "no-sf-1431",
            "value": 200
        },
        {
            "hc-key": "no-op-519",
            "value": 201
        },
        {
            "hc-key": "no-op-517",
            "value": 202
        },
        {
            "hc-key": "no-bu-615",
            "value": 203
        },
        {
            "hc-key": "no-op-540",
            "value": 204
        },
        {
            "hc-key": "no-bu-622",
            "value": 205
        },
        {
            "hc-key": "no-bu-623",
            "value": 206
        },
        {
            "hc-key": "no-bu-621",
            "value": 207
        },
        {
            "hc-key": "no-ho-1224",
            "value": 208
        },
        {
            "hc-key": "no-ho-1228",
            "value": 209
        },
        {
            "hc-key": "no-ho-1223",
            "value": 210
        },
        {
            "hc-key": "no-bu-626",
            "value": 211
        },
        {
            "hc-key": "no-bu-612",
            "value": 212
        },
        {
            "hc-key": "no-bu-624",
            "value": 213
        },
        {
            "hc-key": "no-bu-628",
            "value": 214
        },
        {
            "hc-key": "no-no-1871",
            "value": 215
        },
        {
            "hc-key": "no-mr-1502",
            "value": 216
        },
        {
            "hc-key": "no-mr-1548",
            "value": 217
        },
        {
            "hc-key": "no-mr-1504",
            "value": 218
        },
        {
            "hc-key": "no-mr-1505",
            "value": 219
        },
        {
            "hc-key": "no-fi-2027",
            "value": 220
        },
        {
            "hc-key": "no-fi-2025",
            "value": 221
        },
        {
            "hc-key": "no-aa-941",
            "value": 222
        },
        {
            "hc-key": "no-st-1612",
            "value": 223
        },
        {
            "hc-key": "no-mr-1567",
            "value": 224
        },
        {
            "hc-key": "no-st-1613",
            "value": 225
        },
        {
            "hc-key": "no-st-1638",
            "value": 226
        },
        {
            "hc-key": "no-va-1046",
            "value": 227
        },
        {
            "hc-key": "no-ro-1146",
            "value": 228
        },
        {
            "hc-key": "no-ho-1263",
            "value": 229
        },
        {
            "hc-key": "no-ho-1260",
            "value": 230
        },
        {
            "hc-key": "no-ho-1266",
            "value": 231
        },
        {
            "hc-key": "no-ho-1264",
            "value": 232
        },
        {
            "hc-key": "no-mr-1543",
            "value": 233
        },
        {
            "hc-key": "no-mr-1551",
            "value": 234
        },
        {
            "hc-key": "no-op-522",
            "value": 235
        },
        {
            "hc-key": "no-op-542",
            "value": 236
        },
        {
            "hc-key": "no-bu-617",
            "value": 237
        },
        {
            "hc-key": "no-op-543",
            "value": 238
        },
        {
            "hc-key": "no-op-515",
            "value": 239
        },
        {
            "hc-key": "no-op-544",
            "value": 240
        },
        {
            "hc-key": "no-op-516",
            "value": 241
        },
        {
            "hc-key": "no-op-545",
            "value": 242
        },
        {
            "hc-key": "no-op-520",
            "value": 243
        },
        {
            "hc-key": "no-of-122",
            "value": 244
        },
        {
            "hc-key": "no-of-123",
            "value": 245
        },
        {
            "hc-key": "no-of-124",
            "value": 246
        },
        {
            "hc-key": "no-of-125",
            "value": 247
        },
        {
            "hc-key": "no-of-127",
            "value": 248
        },
        {
            "hc-key": "no-of-128",
            "value": 249
        },
        {
            "hc-key": "no-no-1824",
            "value": 250
        },
        {
            "hc-key": "no-no-1822",
            "value": 251
        },
        {
            "hc-key": "no-va-1014",
            "value": 252
        },
        {
            "hc-key": "no-he-429",
            "value": 253
        },
        {
            "hc-key": "no-he-415",
            "value": 254
        },
        {
            "hc-key": "no-he-417",
            "value": 255
        },
        {
            "hc-key": "no-he-425",
            "value": 256
        },
        {
            "hc-key": "no-op-521",
            "value": 257
        },
        {
            "hc-key": "no-he-412",
            "value": 258
        },
        {
            "hc-key": "no-he-418",
            "value": 259
        },
        {
            "hc-key": "no-he-419",
            "value": 260
        },
        {
            "hc-key": "no-aa-926",
            "value": 261
        },
        {
            "hc-key": "no-no-1805",
            "value": 262
        },
        {
            "hc-key": "no-tr-1920",
            "value": 263
        },
        {
            "hc-key": "no-tr-1922",
            "value": 264
        },
        {
            "hc-key": "no-tr-1923",
            "value": 265
        },
        {
            "hc-key": "no-tr-1925",
            "value": 266
        },
        {
            "hc-key": "no-tr-1927",
            "value": 267
        },
        {
            "hc-key": "no-tr-1929",
            "value": 268
        },
        {
            "hc-key": "no-te-833",
            "value": 269
        },
        {
            "hc-key": "no-aa-940",
            "value": 270
        },
        {
            "hc-key": "no-ho-1252",
            "value": 271
        },
        {
            "hc-key": "no-st-1640",
            "value": 272
        },
        {
            "hc-key": "no-nt-1718",
            "value": 273
        },
        {
            "hc-key": "no-nt-1725",
            "value": 274
        },
        {
            "hc-key": "no-nt-1749",
            "value": 275
        },
        {
            "hc-key": "no-sf-1420",
            "value": 276
        },
        {
            "hc-key": "no-sf-1422",
            "value": 277
        },
        {
            "hc-key": "no-bu-618",
            "value": 278
        },
        {
            "hc-key": "no-sf-1424",
            "value": 279
        },
        {
            "hc-key": "no-sf-1426",
            "value": 280
        },
        {
            "hc-key": "no-sf-1429",
            "value": 281
        },
        {
            "hc-key": "no-va-1032",
            "value": 282
        },
        {
            "hc-key": "no-he-403",
            "value": 283
        },
        {
            "hc-key": "no-op-502",
            "value": 284
        },
        {
            "hc-key": "no-va-1034",
            "value": 285
        },
        {
            "hc-key": "no-bu-631",
            "value": 286
        },
        {
            "hc-key": "no-bu-633",
            "value": 287
        },
        {
            "hc-key": "no-ho-1216",
            "value": 288
        },
        {
            "hc-key": "no-no-1860",
            "value": 289
        },
        {
            "hc-key": "no-no-1867",
            "value": 290
        },
        {
            "hc-key": "no-aa-937",
            "value": 291
        },
        {
            "hc-key": "no-va-938",
            "value": 292
        },
        {
            "hc-key": "no-aa-929",
            "value": 293
        },
        {
            "hc-key": "no-aa-935",
            "value": 294
        },
        {
            "hc-key": "no-ro-1106",
            "value": 295
        },
        {
            "hc-key": "no-ro-1102",
            "value": 296
        },
        {
            "hc-key": "no-ro-1121",
            "value": 297
        },
        {
            "hc-key": "no-ro-1114",
            "value": 298
        },
        {
            "hc-key": "no-ro-1103",
            "value": 299
        },
        {
            "hc-key": "no-ro-1101",
            "value": 300
        },
        {
            "hc-key": "no-mr-1517",
            "value": 301
        },
        {
            "hc-key": "no-mr-1516",
            "value": 302
        },
        {
            "hc-key": "no-mr-1511",
            "value": 303
        },
        {
            "hc-key": "no-no-1825",
            "value": 304
        },
        {
            "hc-key": "no-no-1811",
            "value": 305
        },
        {
            "hc-key": "no-mr-1534",
            "value": 306
        },
        {
            "hc-key": "no-mr-1535",
            "value": 307
        },
        {
            "hc-key": "no-ho-1242",
            "value": 308
        },
        {
            "hc-key": "no-he-439",
            "value": 309
        },
        {
            "hc-key": "no-st-1601",
            "value": 310
        },
        {
            "hc-key": "no-he-430",
            "value": 311
        },
        {
            "hc-key": "no-te-805",
            "value": 312
        },
        {
            "hc-key": "no-te-811",
            "value": 313
        },
        {
            "hc-key": "no-ak-216",
            "value": 314
        },
        {
            "hc-key": "no-ak-217",
            "value": 315
        },
        {
            "hc-key": "no-ak-213",
            "value": 316
        },
        {
            "hc-key": "no-ak-229",
            "value": 317
        },
        {
            "hc-key": "no-ak-211",
            "value": 318
        },
        {
            "hc-key": "no-os-219",
            "value": 319
        },
        {
            "hc-key": "no-sf-1444",
            "value": 320
        },
        {
            "hc-key": "no-mr-1554",
            "value": 321
        },
        {
            "hc-key": "no-mr-1557",
            "value": 322
        },
        {
            "hc-key": "no-sf-1418",
            "value": 323
        },
        {
            "hc-key": "no-sf-1419",
            "value": 324
        },
        {
            "hc-key": "no-op-534",
            "value": 325
        },
        {
            "hc-key": "no-op-533",
            "value": 326
        },
        {
            "hc-key": "no-sf-1416",
            "value": 327
        },
        {
            "hc-key": "no-sf-1417",
            "value": 328
        },
        {
            "hc-key": "no-sf-1421",
            "value": 329
        },
        {
            "hc-key": "no-of-121",
            "value": 330
        },
        {
            "hc-key": "no-of-119",
            "value": 331
        },
        {
            "hc-key": "no-no-1859",
            "value": 332
        },
        {
            "hc-key": "no-op-536",
            "value": 333
        },
        {
            "hc-key": "no-bu-605",
            "value": 334
        },
        {
            "hc-key": "no-no-1851",
            "value": 335
        },
        {
            "hc-key": "no-no-1852",
            "value": 336
        },
        {
            "hc-key": "no-tr-1903",
            "value": 337
        },
        {
            "hc-key": "no-tr-1913",
            "value": 338
        },
        {
            "hc-key": "no-no-1853",
            "value": 339
        },
        {
            "hc-key": "no-op-513",
            "value": 340
        },
        {
            "hc-key": "no-mr-1525",
            "value": 341
        },
        {
            "hc-key": "no-sf-1449",
            "value": 342
        },
        {
            "hc-key": "no-ho-1253",
            "value": 343
        },
        {
            "hc-key": "no-mr-1523",
            "value": 344
        },
        {
            "hc-key": "no-aa-914",
            "value": 345
        },
        {
            "hc-key": "no-he-423",
            "value": 346
        },
        {
            "hc-key": "no-mr-1528",
            "value": 347
        },
        {
            "hc-key": "no-mr-1529",
            "value": 348
        },
        {
            "hc-key": "no-os-301",
            "value": 349
        },
        {
            "hc-key": "no-tr-1931",
            "value": 350
        },
        {
            "hc-key": "no-tr-1924",
            "value": 351
        },
        {
            "hc-key": "no-tr-1939",
            "value": 352
        },
        {
            "hc-key": "no-tr-1938",
            "value": 353
        },
        {
            "hc-key": "no-op-538",
            "value": 354
        },
        {
            "hc-key": "no-op-501",
            "value": 355
        },
        {
            "hc-key": "no-nt-1742",
            "value": 356
        },
        {
            "hc-key": "no-nt-1738",
            "value": 357
        },
        {
            "hc-key": "no-st-1632",
            "value": 358
        },
        {
            "hc-key": "no-st-1634",
            "value": 359
        },
        {
            "hc-key": "no-st-1636",
            "value": 360
        },
        {
            "hc-key": "no-ak-228",
            "value": 361
        },
        {
            "hc-key": "no-ak-227",
            "value": 362
        },
        {
            "hc-key": "no-ak-226",
            "value": 363
        },
        {
            "hc-key": "no-ak-221",
            "value": 364
        },
        {
            "hc-key": "no-os-220",
            "value": 365
        },
        {
            "hc-key": "no-va-1027",
            "value": 366
        },
        {
            "hc-key": "no-va-1026",
            "value": 367
        },
        {
            "hc-key": "no-va-1021",
            "value": 368
        },
        {
            "hc-key": "no-va-1002",
            "value": 369
        },
        {
            "hc-key": "no-va-1029",
            "value": 370
        },
        {
            "hc-key": "no-vf-720",
            "value": 371
        },
        {
            "hc-key": "no-nt-1744",
            "value": 372
        },
        {
            "hc-key": "no-nt-1743",
            "value": 373
        },
        {
            "hc-key": "no-vf-728",
            "value": 374
        },
        {
            "hc-key": "no-vf-719",
            "value": 375
        },
        {
            "hc-key": "no-bu-604",
            "value": 376
        },
        {
            "hc-key": "no-ro-1160",
            "value": 377
        },
        {
            "hc-key": "no-bu-602",
            "value": 378
        },
        {
            "hc-key": "no-ho-1201",
            "value": 379
        },
        {
            "hc-key": "no-ho-1211",
            "value": 380
        },
        {
            "hc-key": "no-ro-1111",
            "value": 381
        },
        {
            "hc-key": "no-sf-1445",
            "value": 382
        },
        {
            "hc-key": "no-sf-1401",
            "value": 383
        },
        {
            "hc-key": "no-sf-1438",
            "value": 384
        },
        {
            "hc-key": "no-ro-1112",
            "value": 385
        },
        {
            "hc-key": "no-sf-1443",
            "value": 386
        },
        {
            "hc-key": "no-ro-1119",
            "value": 387
        },
        {
            "hc-key": "no-mr-1563",
            "value": 388
        },
        {
            "hc-key": "no-st-1635",
            "value": 389
        },
        {
            "hc-key": "no-tr-1919",
            "value": 390
        },
        {
            "hc-key": "no-of-106",
            "value": 391
        },
        {
            "hc-key": "no-vf-709",
            "value": 392
        },
        {
            "hc-key": "no-no-1874",
            "value": 393
        },
        {
            "hc-key": "no-tr-1911",
            "value": 394
        },
        {
            "hc-key": "no-fi-2021",
            "value": 395
        },
        {
            "hc-key": "no-mr-1560",
            "value": 396
        },
        {
            "hc-key": "no-tr-1933",
            "value": 397
        },
        {
            "hc-key": "no-st-1633",
            "value": 398
        },
        {
            "hc-key": "no-te-827",
            "value": 399
        },
        {
            "hc-key": "no-te-821",
            "value": 400
        },
        {
            "hc-key": "no-st-1662",
            "value": 401
        },
        {
            "hc-key": "no-sf-1441",
            "value": 402
        },
        {
            "hc-key": "no-op-511",
            "value": 403
        },
        {
            "hc-key": "no-op-541",
            "value": 404
        },
        {
            "hc-key": "no-no-1826",
            "value": 405
        },
        {
            "hc-key": "no-te-831",
            "value": 406
        },
        {
            "hc-key": "no-te-834",
            "value": 407
        },
        {
            "hc-key": "no-bu-632",
            "value": 408
        },
        {
            "hc-key": "no-he-402",
            "value": 409
        },
        {
            "hc-key": "no-op-532",
            "value": 410
        },
        {
            "hc-key": "no-he-427",
            "value": 411
        },
        {
            "hc-key": "no-nt-1736",
            "value": 412
        },
        {
            "hc-key": "no-nt-1740",
            "value": 413
        },
        {
            "hc-key": "no-st-1620",
            "value": 414
        },
        {
            "hc-key": "no-no-1827",
            "value": 415
        },
        {
            "hc-key": "no-fi-2030",
            "value": 416
        },
        {
            "hc-key": "no-fi-2002",
            "value": 417
        },
        {
            "hc-key": "no-fi-2022",
            "value": 418
        },
        {
            "hc-key": "no-tr-1928",
            "value": 419
        },
        {
            "hc-key": "no-mr-1573",
            "value": 420
        },
        {
            "hc-key": "no-fi-2011",
            "value": 421
        },
        {
            "hc-key": "no-fi-2024",
            "value": 422
        },
        {
            "hc-key": "no-fi-2023",
            "value": 423
        },
        {
            "hc-key": "no-fi-2028",
            "value": 424
        },
        {
            "hc-key": "no-fi-2003",
            "value": 425
        },
        {
            "hc-key": "no-he-438",
            "value": 426
        },
        {
            "value": 427
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/countries/no/no-all-all.js">Norway, admin2</a>'
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
            mapData: Highcharts.maps['countries/no/no-all-all'],
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
