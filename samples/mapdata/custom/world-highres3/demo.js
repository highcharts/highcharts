$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "fo",
            "value": 0
        },
        {
            "hc-key": "um",
            "value": 1
        },
        {
            "hc-key": "us",
            "value": 2
        },
        {
            "hc-key": "jp",
            "value": 3
        },
        {
            "hc-key": "sc",
            "value": 4
        },
        {
            "hc-key": "nz",
            "value": 5
        },
        {
            "hc-key": "in",
            "value": 6
        },
        {
            "hc-key": "kr",
            "value": 7
        },
        {
            "hc-key": "fr",
            "value": 8
        },
        {
            "hc-key": "fm",
            "value": 9
        },
        {
            "hc-key": "cu",
            "value": 10
        },
        {
            "hc-key": "cn",
            "value": 11
        },
        {
            "hc-key": "pt",
            "value": 12
        },
        {
            "hc-key": "sw",
            "value": 13
        },
        {
            "hc-key": "sh",
            "value": 14
        },
        {
            "hc-key": "br",
            "value": 15
        },
        {
            "hc-key": "ec",
            "value": 16
        },
        {
            "hc-key": "au",
            "value": 17
        },
        {
            "hc-key": "ki",
            "value": 18
        },
        {
            "hc-key": "ph",
            "value": 19
        },
        {
            "hc-key": "mx",
            "value": 20
        },
        {
            "hc-key": "es",
            "value": 21
        },
        {
            "hc-key": "bu",
            "value": 22
        },
        {
            "hc-key": "mv",
            "value": 23
        },
        {
            "hc-key": "sp",
            "value": 24
        },
        {
            "hc-key": "gb",
            "value": 25
        },
        {
            "hc-key": "gr",
            "value": 26
        },
        {
            "hc-key": "as",
            "value": 27
        },
        {
            "hc-key": "dk",
            "value": 28
        },
        {
            "hc-key": "gl",
            "value": 29
        },
        {
            "hc-key": "gu",
            "value": 30
        },
        {
            "hc-key": "mp",
            "value": 31
        },
        {
            "hc-key": "pr",
            "value": 32
        },
        {
            "hc-key": "vi",
            "value": 33
        },
        {
            "hc-key": "ca",
            "value": 34
        },
        {
            "hc-key": "st",
            "value": 35
        },
        {
            "hc-key": "tz",
            "value": 36
        },
        {
            "hc-key": "ar",
            "value": 37
        },
        {
            "hc-key": "cv",
            "value": 38
        },
        {
            "hc-key": "dm",
            "value": 39
        },
        {
            "hc-key": "nl",
            "value": 40
        },
        {
            "hc-key": "ye",
            "value": 41
        },
        {
            "hc-key": "jm",
            "value": 42
        },
        {
            "hc-key": "ws",
            "value": 43
        },
        {
            "hc-key": "om",
            "value": 44
        },
        {
            "hc-key": "vc",
            "value": 45
        },
        {
            "hc-key": "tr",
            "value": 46
        },
        {
            "hc-key": "bd",
            "value": 47
        },
        {
            "hc-key": "sb",
            "value": 48
        },
        {
            "hc-key": "lc",
            "value": 49
        },
        {
            "hc-key": "nr",
            "value": 50
        },
        {
            "hc-key": "no",
            "value": 51
        },
        {
            "hc-key": "kn",
            "value": 52
        },
        {
            "hc-key": "bh",
            "value": 53
        },
        {
            "hc-key": "to",
            "value": 54
        },
        {
            "hc-key": "fi",
            "value": 55
        },
        {
            "hc-key": "id",
            "value": 56
        },
        {
            "hc-key": "mu",
            "value": 57
        },
        {
            "hc-key": "se",
            "value": 58
        },
        {
            "hc-key": "tt",
            "value": 59
        },
        {
            "hc-key": "my",
            "value": 60
        },
        {
            "hc-key": "bs",
            "value": 61
        },
        {
            "hc-key": "pw",
            "value": 62
        },
        {
            "hc-key": "ir",
            "value": 63
        },
        {
            "hc-key": "tv",
            "value": 64
        },
        {
            "hc-key": "mh",
            "value": 65
        },
        {
            "hc-key": "cl",
            "value": 66
        },
        {
            "hc-key": "th",
            "value": 67
        },
        {
            "hc-key": "gd",
            "value": 68
        },
        {
            "hc-key": "ee",
            "value": 69
        },
        {
            "hc-key": "ag",
            "value": 70
        },
        {
            "hc-key": "tw",
            "value": 71
        },
        {
            "hc-key": "bb",
            "value": 72
        },
        {
            "hc-key": "it",
            "value": 73
        },
        {
            "hc-key": "mt",
            "value": 74
        },
        {
            "hc-key": "pg",
            "value": 75
        },
        {
            "hc-key": "de",
            "value": 76
        },
        {
            "hc-key": "vu",
            "value": 77
        },
        {
            "hc-key": "gq",
            "value": 78
        },
        {
            "hc-key": "cy",
            "value": 79
        },
        {
            "hc-key": "km",
            "value": 80
        },
        {
            "hc-key": "fj",
            "value": 81
        },
        {
            "hc-key": "ru",
            "value": 82
        },
        {
            "hc-key": "ug",
            "value": 83
        },
        {
            "hc-key": "va",
            "value": 84
        },
        {
            "hc-key": "sm",
            "value": 85
        },
        {
            "hc-key": "kz",
            "value": 86
        },
        {
            "hc-key": "az",
            "value": 87
        },
        {
            "hc-key": "am",
            "value": 88
        },
        {
            "hc-key": "tj",
            "value": 89
        },
        {
            "hc-key": "ls",
            "value": 90
        },
        {
            "hc-key": "uz",
            "value": 91
        },
        {
            "hc-key": "ma",
            "value": 92
        },
        {
            "hc-key": "co",
            "value": 93
        },
        {
            "hc-key": "tl",
            "value": 94
        },
        {
            "hc-key": "kh",
            "value": 95
        },
        {
            "hc-key": "sa",
            "value": 96
        },
        {
            "hc-key": "pk",
            "value": 97
        },
        {
            "hc-key": "ae",
            "value": 98
        },
        {
            "hc-key": "ke",
            "value": 99
        },
        {
            "hc-key": "pe",
            "value": 100
        },
        {
            "hc-key": "do",
            "value": 101
        },
        {
            "hc-key": "ht",
            "value": 102
        },
        {
            "hc-key": "ao",
            "value": 103
        },
        {
            "hc-key": "mz",
            "value": 104
        },
        {
            "hc-key": "pa",
            "value": 105
        },
        {
            "hc-key": "cr",
            "value": 106
        },
        {
            "hc-key": "sv",
            "value": 107
        },
        {
            "hc-key": "bo",
            "value": 108
        },
        {
            "hc-key": "hr",
            "value": 109
        },
        {
            "hc-key": "bz",
            "value": 110
        },
        {
            "hc-key": "za",
            "value": 111
        },
        {
            "hc-key": "ly",
            "value": 112
        },
        {
            "hc-key": "sd",
            "value": 113
        },
        {
            "hc-key": "cd",
            "value": 114
        },
        {
            "hc-key": "kw",
            "value": 115
        },
        {
            "hc-key": "er",
            "value": 116
        },
        {
            "hc-key": "ie",
            "value": 117
        },
        {
            "hc-key": "kp",
            "value": 118
        },
        {
            "hc-key": "ve",
            "value": 119
        },
        {
            "hc-key": "gy",
            "value": 120
        },
        {
            "hc-key": "hn",
            "value": 121
        },
        {
            "hc-key": "mm",
            "value": 122
        },
        {
            "hc-key": "ga",
            "value": 123
        },
        {
            "hc-key": "ni",
            "value": 124
        },
        {
            "hc-key": "mw",
            "value": 125
        },
        {
            "hc-key": "sx",
            "value": 126
        },
        {
            "hc-key": "tm",
            "value": 127
        },
        {
            "hc-key": "zm",
            "value": 128
        },
        {
            "hc-key": "nc",
            "value": 129
        },
        {
            "hc-key": "mr",
            "value": 130
        },
        {
            "hc-key": "dz",
            "value": 131
        },
        {
            "hc-key": "lt",
            "value": 132
        },
        {
            "hc-key": "et",
            "value": 133
        },
        {
            "hc-key": "so",
            "value": 134
        },
        {
            "hc-key": "gh",
            "value": 135
        },
        {
            "hc-key": "si",
            "value": 136
        },
        {
            "hc-key": "gt",
            "value": 137
        },
        {
            "hc-key": "ba",
            "value": 138
        },
        {
            "hc-key": "jo",
            "value": 139
        },
        {
            "hc-key": "mc",
            "value": 140
        },
        {
            "hc-key": "al",
            "value": 141
        },
        {
            "hc-key": "uy",
            "value": 142
        },
        {
            "hc-key": "cnm",
            "value": 143
        },
        {
            "hc-key": "mn",
            "value": 144
        },
        {
            "hc-key": "rw",
            "value": 145
        },
        {
            "hc-key": "cm",
            "value": 146
        },
        {
            "hc-key": "cg",
            "value": 147
        },
        {
            "hc-key": "eh",
            "value": 148
        },
        {
            "hc-key": "rs",
            "value": 149
        },
        {
            "hc-key": "me",
            "value": 150
        },
        {
            "hc-key": "bj",
            "value": 151
        },
        {
            "hc-key": "ng",
            "value": 152
        },
        {
            "hc-key": "tg",
            "value": 153
        },
        {
            "hc-key": "af",
            "value": 154
        },
        {
            "hc-key": "ua",
            "value": 155
        },
        {
            "hc-key": "sk",
            "value": 156
        },
        {
            "hc-key": "jk",
            "value": 157
        },
        {
            "hc-key": "bg",
            "value": 158
        },
        {
            "hc-key": "qa",
            "value": 159
        },
        {
            "hc-key": "li",
            "value": 160
        },
        {
            "hc-key": "at",
            "value": 161
        },
        {
            "hc-key": "sz",
            "value": 162
        },
        {
            "hc-key": "hu",
            "value": 163
        },
        {
            "hc-key": "ro",
            "value": 164
        },
        {
            "hc-key": "lu",
            "value": 165
        },
        {
            "hc-key": "ad",
            "value": 166
        },
        {
            "hc-key": "ci",
            "value": 167
        },
        {
            "hc-key": "lr",
            "value": 168
        },
        {
            "hc-key": "bn",
            "value": 169
        },
        {
            "hc-key": "be",
            "value": 170
        },
        {
            "hc-key": "iq",
            "value": 171
        },
        {
            "hc-key": "ge",
            "value": 172
        },
        {
            "hc-key": "gm",
            "value": 173
        },
        {
            "hc-key": "ch",
            "value": 174
        },
        {
            "hc-key": "td",
            "value": 175
        },
        {
            "hc-key": "kv",
            "value": 176
        },
        {
            "hc-key": "lb",
            "value": 177
        },
        {
            "hc-key": "dj",
            "value": 178
        },
        {
            "hc-key": "bi",
            "value": 179
        },
        {
            "hc-key": "sr",
            "value": 180
        },
        {
            "hc-key": "il",
            "value": 181
        },
        {
            "hc-key": "ml",
            "value": 182
        },
        {
            "hc-key": "sn",
            "value": 183
        },
        {
            "hc-key": "gw",
            "value": 184
        },
        {
            "hc-key": "gn",
            "value": 185
        },
        {
            "hc-key": "zw",
            "value": 186
        },
        {
            "hc-key": "pl",
            "value": 187
        },
        {
            "hc-key": "mk",
            "value": 188
        },
        {
            "hc-key": "py",
            "value": 189
        },
        {
            "hc-key": "by",
            "value": 190
        },
        {
            "hc-key": "lv",
            "value": 191
        },
        {
            "hc-key": "sy",
            "value": 192
        },
        {
            "hc-key": "bf",
            "value": 193
        },
        {
            "hc-key": "ne",
            "value": 194
        },
        {
            "hc-key": "na",
            "value": 195
        },
        {
            "hc-key": "tn",
            "value": 196
        },
        {
            "hc-key": "kg",
            "value": 197
        },
        {
            "hc-key": "md",
            "value": 198
        },
        {
            "hc-key": "ss",
            "value": 199
        },
        {
            "hc-key": "cf",
            "value": 200
        },
        {
            "hc-key": "bw",
            "value": 201
        },
        {
            "hc-key": "sg",
            "value": 202
        },
        {
            "hc-key": "vn",
            "value": 203
        },
        {
            "hc-key": "sl",
            "value": 204
        },
        {
            "hc-key": "mg",
            "value": 205
        },
        {
            "hc-key": "is",
            "value": 206
        },
        {
            "hc-key": "eg",
            "value": 207
        },
        {
            "hc-key": "lk",
            "value": 208
        },
        {
            "hc-key": "np",
            "value": 209
        },
        {
            "hc-key": "la",
            "value": 210
        },
        {
            "hc-key": "cz",
            "value": 211
        },
        {
            "hc-key": "bt",
            "value": 212
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/custom/world-highres3.js">World, Miller projection, ultra high resolution</a>'
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
            mapData: Highcharts.maps['custom/world-highres3'],
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
