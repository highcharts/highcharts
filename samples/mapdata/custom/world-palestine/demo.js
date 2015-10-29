$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "gl",
            "value": 0
        },
        {
            "hc-key": "sh",
            "value": 1
        },
        {
            "hc-key": "bu",
            "value": 2
        },
        {
            "hc-key": "lk",
            "value": 3
        },
        {
            "hc-key": "as",
            "value": 4
        },
        {
            "hc-key": "dk",
            "value": 5
        },
        {
            "hc-key": "fo",
            "value": 6
        },
        {
            "hc-key": "gu",
            "value": 7
        },
        {
            "hc-key": "mp",
            "value": 8
        },
        {
            "hc-key": "pr",
            "value": 9
        },
        {
            "hc-key": "um",
            "value": 10
        },
        {
            "hc-key": "us",
            "value": 11
        },
        {
            "hc-key": "vi",
            "value": 12
        },
        {
            "hc-key": "ca",
            "value": 13
        },
        {
            "hc-key": "st",
            "value": 14
        },
        {
            "hc-key": "jp",
            "value": 15
        },
        {
            "hc-key": "cv",
            "value": 16
        },
        {
            "hc-key": "dm",
            "value": 17
        },
        {
            "hc-key": "sc",
            "value": 18
        },
        {
            "hc-key": "jm",
            "value": 19
        },
        {
            "hc-key": "ws",
            "value": 20
        },
        {
            "hc-key": "om",
            "value": 21
        },
        {
            "hc-key": "in",
            "value": 22
        },
        {
            "hc-key": "vc",
            "value": 23
        },
        {
            "hc-key": "sb",
            "value": 24
        },
        {
            "hc-key": "lc",
            "value": 25
        },
        {
            "hc-key": "fr",
            "value": 26
        },
        {
            "hc-key": "nr",
            "value": 27
        },
        {
            "hc-key": "no",
            "value": 28
        },
        {
            "hc-key": "fm",
            "value": 29
        },
        {
            "hc-key": "kn",
            "value": 30
        },
        {
            "hc-key": "cn",
            "value": 31
        },
        {
            "hc-key": "bh",
            "value": 32
        },
        {
            "hc-key": "to",
            "value": 33
        },
        {
            "hc-key": "id",
            "value": 34
        },
        {
            "hc-key": "mu",
            "value": 35
        },
        {
            "hc-key": "se",
            "value": 36
        },
        {
            "hc-key": "tt",
            "value": 37
        },
        {
            "hc-key": "sw",
            "value": 38
        },
        {
            "hc-key": "bs",
            "value": 39
        },
        {
            "hc-key": "pw",
            "value": 40
        },
        {
            "hc-key": "ec",
            "value": 41
        },
        {
            "hc-key": "au",
            "value": 42
        },
        {
            "hc-key": "tv",
            "value": 43
        },
        {
            "hc-key": "mh",
            "value": 44
        },
        {
            "hc-key": "cl",
            "value": 45
        },
        {
            "hc-key": "ki",
            "value": 46
        },
        {
            "hc-key": "ph",
            "value": 47
        },
        {
            "hc-key": "gd",
            "value": 48
        },
        {
            "hc-key": "ee",
            "value": 49
        },
        {
            "hc-key": "ag",
            "value": 50
        },
        {
            "hc-key": "es",
            "value": 51
        },
        {
            "hc-key": "bb",
            "value": 52
        },
        {
            "hc-key": "it",
            "value": 53
        },
        {
            "hc-key": "mt",
            "value": 54
        },
        {
            "hc-key": "mv",
            "value": 55
        },
        {
            "hc-key": "sp",
            "value": 56
        },
        {
            "hc-key": "pg",
            "value": 57
        },
        {
            "hc-key": "vu",
            "value": 58
        },
        {
            "hc-key": "sg",
            "value": 59
        },
        {
            "hc-key": "gb",
            "value": 60
        },
        {
            "hc-key": "cy",
            "value": 61
        },
        {
            "hc-key": "gr",
            "value": 62
        },
        {
            "hc-key": "km",
            "value": 63
        },
        {
            "hc-key": "fj",
            "value": 64
        },
        {
            "hc-key": "ru",
            "value": 65
        },
        {
            "hc-key": "va",
            "value": 66
        },
        {
            "hc-key": "sm",
            "value": 67
        },
        {
            "hc-key": "am",
            "value": 68
        },
        {
            "hc-key": "az",
            "value": 69
        },
        {
            "hc-key": "ls",
            "value": 70
        },
        {
            "hc-key": "tj",
            "value": 71
        },
        {
            "hc-key": "ml",
            "value": 72
        },
        {
            "hc-key": "dz",
            "value": 73
        },
        {
            "hc-key": "co",
            "value": 74
        },
        {
            "hc-key": "tw",
            "value": 75
        },
        {
            "hc-key": "uz",
            "value": 76
        },
        {
            "hc-key": "tz",
            "value": 77
        },
        {
            "hc-key": "ar",
            "value": 78
        },
        {
            "hc-key": "sa",
            "value": 79
        },
        {
            "hc-key": "nl",
            "value": 80
        },
        {
            "hc-key": "ye",
            "value": 81
        },
        {
            "hc-key": "ae",
            "value": 82
        },
        {
            "hc-key": "bd",
            "value": 83
        },
        {
            "hc-key": "ch",
            "value": 84
        },
        {
            "hc-key": "pt",
            "value": 85
        },
        {
            "hc-key": "my",
            "value": 86
        },
        {
            "hc-key": "vn",
            "value": 87
        },
        {
            "hc-key": "br",
            "value": 88
        },
        {
            "hc-key": "pa",
            "value": 89
        },
        {
            "hc-key": "ng",
            "value": 90
        },
        {
            "hc-key": "tr",
            "value": 91
        },
        {
            "hc-key": "ir",
            "value": 92
        },
        {
            "hc-key": "ht",
            "value": 93
        },
        {
            "hc-key": "do",
            "value": 94
        },
        {
            "hc-key": "sl",
            "value": 95
        },
        {
            "hc-key": "sn",
            "value": 96
        },
        {
            "hc-key": "gw",
            "value": 97
        },
        {
            "hc-key": "hr",
            "value": 98
        },
        {
            "hc-key": "th",
            "value": 99
        },
        {
            "hc-key": "mx",
            "value": 100
        },
        {
            "hc-key": "tn",
            "value": 101
        },
        {
            "hc-key": "kw",
            "value": 102
        },
        {
            "hc-key": "de",
            "value": 103
        },
        {
            "hc-key": "mm",
            "value": 104
        },
        {
            "hc-key": "gq",
            "value": 105
        },
        {
            "hc-key": "cnm",
            "value": 106
        },
        {
            "hc-key": "nc",
            "value": 107
        },
        {
            "hc-key": "ie",
            "value": 108
        },
        {
            "hc-key": "kz",
            "value": 109
        },
        {
            "hc-key": "pl",
            "value": 110
        },
        {
            "hc-key": "lt",
            "value": 111
        },
        {
            "hc-key": "eg",
            "value": 112
        },
        {
            "hc-key": "ug",
            "value": 113
        },
        {
            "hc-key": "cd",
            "value": 114
        },
        {
            "hc-key": "mk",
            "value": 115
        },
        {
            "hc-key": "al",
            "value": 116
        },
        {
            "hc-key": "cm",
            "value": 117
        },
        {
            "hc-key": "bj",
            "value": 118
        },
        {
            "hc-key": "ge",
            "value": 119
        },
        {
            "hc-key": "tl",
            "value": 120
        },
        {
            "hc-key": "tm",
            "value": 121
        },
        {
            "hc-key": "kh",
            "value": 122
        },
        {
            "hc-key": "pe",
            "value": 123
        },
        {
            "hc-key": "mw",
            "value": 124
        },
        {
            "hc-key": "mn",
            "value": 125
        },
        {
            "hc-key": "ao",
            "value": 126
        },
        {
            "hc-key": "mz",
            "value": 127
        },
        {
            "hc-key": "za",
            "value": 128
        },
        {
            "hc-key": "cr",
            "value": 129
        },
        {
            "hc-key": "sv",
            "value": 130
        },
        {
            "hc-key": "ly",
            "value": 131
        },
        {
            "hc-key": "sd",
            "value": 132
        },
        {
            "hc-key": "kp",
            "value": 133
        },
        {
            "hc-key": "kr",
            "value": 134
        },
        {
            "hc-key": "gy",
            "value": 135
        },
        {
            "hc-key": "hn",
            "value": 136
        },
        {
            "hc-key": "ga",
            "value": 137
        },
        {
            "hc-key": "ni",
            "value": 138
        },
        {
            "hc-key": "et",
            "value": 139
        },
        {
            "hc-key": "so",
            "value": 140
        },
        {
            "hc-key": "ke",
            "value": 141
        },
        {
            "hc-key": "gh",
            "value": 142
        },
        {
            "hc-key": "si",
            "value": 143
        },
        {
            "hc-key": "gt",
            "value": 144
        },
        {
            "hc-key": "bz",
            "value": 145
        },
        {
            "hc-key": "ba",
            "value": 146
        },
        {
            "hc-key": "jo",
            "value": 147
        },
        {
            "hc-key": "we",
            "value": 148
        },
        {
            "hc-key": "il",
            "value": 149
        },
        {
            "hc-key": "zm",
            "value": 150
        },
        {
            "hc-key": "mc",
            "value": 151
        },
        {
            "hc-key": "uy",
            "value": 152
        },
        {
            "hc-key": "rw",
            "value": 153
        },
        {
            "hc-key": "bo",
            "value": 154
        },
        {
            "hc-key": "cg",
            "value": 155
        },
        {
            "hc-key": "eh",
            "value": 156
        },
        {
            "hc-key": "rs",
            "value": 157
        },
        {
            "hc-key": "me",
            "value": 158
        },
        {
            "hc-key": "tg",
            "value": 159
        },
        {
            "hc-key": "la",
            "value": 160
        },
        {
            "hc-key": "af",
            "value": 161
        },
        {
            "hc-key": "jk",
            "value": 162
        },
        {
            "hc-key": "pk",
            "value": 163
        },
        {
            "hc-key": "bg",
            "value": 164
        },
        {
            "hc-key": "ua",
            "value": 165
        },
        {
            "hc-key": "ro",
            "value": 166
        },
        {
            "hc-key": "qa",
            "value": 167
        },
        {
            "hc-key": "li",
            "value": 168
        },
        {
            "hc-key": "at",
            "value": 169
        },
        {
            "hc-key": "sk",
            "value": 170
        },
        {
            "hc-key": "sz",
            "value": 171
        },
        {
            "hc-key": "hu",
            "value": 172
        },
        {
            "hc-key": "ne",
            "value": 173
        },
        {
            "hc-key": "lu",
            "value": 174
        },
        {
            "hc-key": "ad",
            "value": 175
        },
        {
            "hc-key": "ci",
            "value": 176
        },
        {
            "hc-key": "lr",
            "value": 177
        },
        {
            "hc-key": "bn",
            "value": 178
        },
        {
            "hc-key": "mr",
            "value": 179
        },
        {
            "hc-key": "be",
            "value": 180
        },
        {
            "hc-key": "iq",
            "value": 181
        },
        {
            "hc-key": "gm",
            "value": 182
        },
        {
            "hc-key": "ma",
            "value": 183
        },
        {
            "hc-key": "td",
            "value": 184
        },
        {
            "hc-key": "kv",
            "value": 185
        },
        {
            "hc-key": "lb",
            "value": 186
        },
        {
            "hc-key": "sx",
            "value": 187
        },
        {
            "hc-key": "dj",
            "value": 188
        },
        {
            "hc-key": "er",
            "value": 189
        },
        {
            "hc-key": "bi",
            "value": 190
        },
        {
            "hc-key": "sr",
            "value": 191
        },
        {
            "hc-key": "gn",
            "value": 192
        },
        {
            "hc-key": "zw",
            "value": 193
        },
        {
            "hc-key": "py",
            "value": 194
        },
        {
            "hc-key": "by",
            "value": 195
        },
        {
            "hc-key": "lv",
            "value": 196
        },
        {
            "hc-key": "sy",
            "value": 197
        },
        {
            "hc-key": "bt",
            "value": 198
        },
        {
            "hc-key": "na",
            "value": 199
        },
        {
            "hc-key": "bf",
            "value": 200
        },
        {
            "hc-key": "cf",
            "value": 201
        },
        {
            "hc-key": "md",
            "value": 202
        },
        {
            "hc-key": "gz",
            "value": 203
        },
        {
            "hc-key": "ss",
            "value": 204
        },
        {
            "hc-key": "cz",
            "value": 205
        },
        {
            "hc-key": "nz",
            "value": 206
        },
        {
            "hc-key": "cu",
            "value": 207
        },
        {
            "hc-key": "fi",
            "value": 208
        },
        {
            "hc-key": "mg",
            "value": 209
        },
        {
            "hc-key": "ve",
            "value": 210
        },
        {
            "hc-key": "is",
            "value": 211
        },
        {
            "hc-key": "np",
            "value": 212
        },
        {
            "hc-key": "kg",
            "value": 213
        },
        {
            "hc-key": "bw",
            "value": 214
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/custom/world-palestine.js">World with Palestine areas, medium resolution</a>'
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
            mapData: Highcharts.maps['custom/world-palestine'],
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
