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
            "hc-key": "um",
            "value": 9
        },
        {
            "hc-key": "us",
            "value": 10
        },
        {
            "hc-key": "vi",
            "value": 11
        },
        {
            "hc-key": "ca",
            "value": 12
        },
        {
            "hc-key": "st",
            "value": 13
        },
        {
            "hc-key": "jp",
            "value": 14
        },
        {
            "hc-key": "cv",
            "value": 15
        },
        {
            "hc-key": "dm",
            "value": 16
        },
        {
            "hc-key": "sc",
            "value": 17
        },
        {
            "hc-key": "nz",
            "value": 18
        },
        {
            "hc-key": "ye",
            "value": 19
        },
        {
            "hc-key": "jm",
            "value": 20
        },
        {
            "hc-key": "ws",
            "value": 21
        },
        {
            "hc-key": "om",
            "value": 22
        },
        {
            "hc-key": "in",
            "value": 23
        },
        {
            "hc-key": "vc",
            "value": 24
        },
        {
            "hc-key": "bd",
            "value": 25
        },
        {
            "hc-key": "sb",
            "value": 26
        },
        {
            "hc-key": "lc",
            "value": 27
        },
        {
            "hc-key": "fr",
            "value": 28
        },
        {
            "hc-key": "nr",
            "value": 29
        },
        {
            "hc-key": "no",
            "value": 30
        },
        {
            "hc-key": "fm",
            "value": 31
        },
        {
            "hc-key": "kn",
            "value": 32
        },
        {
            "hc-key": "cn",
            "value": 33
        },
        {
            "hc-key": "bh",
            "value": 34
        },
        {
            "hc-key": "to",
            "value": 35
        },
        {
            "hc-key": "fi",
            "value": 36
        },
        {
            "hc-key": "id",
            "value": 37
        },
        {
            "hc-key": "mu",
            "value": 38
        },
        {
            "hc-key": "se",
            "value": 39
        },
        {
            "hc-key": "tt",
            "value": 40
        },
        {
            "hc-key": "sw",
            "value": 41
        },
        {
            "hc-key": "br",
            "value": 42
        },
        {
            "hc-key": "bs",
            "value": 43
        },
        {
            "hc-key": "pw",
            "value": 44
        },
        {
            "hc-key": "ec",
            "value": 45
        },
        {
            "hc-key": "au",
            "value": 46
        },
        {
            "hc-key": "tv",
            "value": 47
        },
        {
            "hc-key": "mh",
            "value": 48
        },
        {
            "hc-key": "cl",
            "value": 49
        },
        {
            "hc-key": "ki",
            "value": 50
        },
        {
            "hc-key": "ph",
            "value": 51
        },
        {
            "hc-key": "gd",
            "value": 52
        },
        {
            "hc-key": "ee",
            "value": 53
        },
        {
            "hc-key": "ag",
            "value": 54
        },
        {
            "hc-key": "es",
            "value": 55
        },
        {
            "hc-key": "bb",
            "value": 56
        },
        {
            "hc-key": "it",
            "value": 57
        },
        {
            "hc-key": "mt",
            "value": 58
        },
        {
            "hc-key": "mv",
            "value": 59
        },
        {
            "hc-key": "sp",
            "value": 60
        },
        {
            "hc-key": "pg",
            "value": 61
        },
        {
            "hc-key": "vu",
            "value": 62
        },
        {
            "hc-key": "sg",
            "value": 63
        },
        {
            "hc-key": "gb",
            "value": 64
        },
        {
            "hc-key": "cy",
            "value": 65
        },
        {
            "hc-key": "gr",
            "value": 66
        },
        {
            "hc-key": "km",
            "value": 67
        },
        {
            "hc-key": "fj",
            "value": 68
        },
        {
            "hc-key": "ru",
            "value": 69
        },
        {
            "hc-key": "va",
            "value": 70
        },
        {
            "hc-key": "sm",
            "value": 71
        },
        {
            "hc-key": "am",
            "value": 72
        },
        {
            "hc-key": "az",
            "value": 73
        },
        {
            "hc-key": "ls",
            "value": 74
        },
        {
            "hc-key": "tj",
            "value": 75
        },
        {
            "hc-key": "ml",
            "value": 76
        },
        {
            "hc-key": "dz",
            "value": 77
        },
        {
            "hc-key": "tw",
            "value": 78
        },
        {
            "hc-key": "uz",
            "value": 79
        },
        {
            "hc-key": "tz",
            "value": 80
        },
        {
            "hc-key": "ar",
            "value": 81
        },
        {
            "hc-key": "sa",
            "value": 82
        },
        {
            "hc-key": "nl",
            "value": 83
        },
        {
            "hc-key": "ae",
            "value": 84
        },
        {
            "hc-key": "ch",
            "value": 85
        },
        {
            "hc-key": "pt",
            "value": 86
        },
        {
            "hc-key": "my",
            "value": 87
        },
        {
            "hc-key": "pa",
            "value": 88
        },
        {
            "hc-key": "tr",
            "value": 89
        },
        {
            "hc-key": "ir",
            "value": 90
        },
        {
            "hc-key": "ht",
            "value": 91
        },
        {
            "hc-key": "do",
            "value": 92
        },
        {
            "hc-key": "gw",
            "value": 93
        },
        {
            "hc-key": "hr",
            "value": 94
        },
        {
            "hc-key": "th",
            "value": 95
        },
        {
            "hc-key": "mx",
            "value": 96
        },
        {
            "hc-key": "kw",
            "value": 97
        },
        {
            "hc-key": "de",
            "value": 98
        },
        {
            "hc-key": "gq",
            "value": 99
        },
        {
            "hc-key": "cnm",
            "value": 100
        },
        {
            "hc-key": "nc",
            "value": 101
        },
        {
            "hc-key": "ie",
            "value": 102
        },
        {
            "hc-key": "kz",
            "value": 103
        },
        {
            "hc-key": "ge",
            "value": 104
        },
        {
            "hc-key": "pl",
            "value": 105
        },
        {
            "hc-key": "lt",
            "value": 106
        },
        {
            "hc-key": "ug",
            "value": 107
        },
        {
            "hc-key": "cd",
            "value": 108
        },
        {
            "hc-key": "mk",
            "value": 109
        },
        {
            "hc-key": "al",
            "value": 110
        },
        {
            "hc-key": "ng",
            "value": 111
        },
        {
            "hc-key": "cm",
            "value": 112
        },
        {
            "hc-key": "bj",
            "value": 113
        },
        {
            "hc-key": "tl",
            "value": 114
        },
        {
            "hc-key": "tm",
            "value": 115
        },
        {
            "hc-key": "kh",
            "value": 116
        },
        {
            "hc-key": "pe",
            "value": 117
        },
        {
            "hc-key": "mw",
            "value": 118
        },
        {
            "hc-key": "mn",
            "value": 119
        },
        {
            "hc-key": "ao",
            "value": 120
        },
        {
            "hc-key": "mz",
            "value": 121
        },
        {
            "hc-key": "za",
            "value": 122
        },
        {
            "hc-key": "cr",
            "value": 123
        },
        {
            "hc-key": "sv",
            "value": 124
        },
        {
            "hc-key": "bz",
            "value": 125
        },
        {
            "hc-key": "co",
            "value": 126
        },
        {
            "hc-key": "kp",
            "value": 127
        },
        {
            "hc-key": "kr",
            "value": 128
        },
        {
            "hc-key": "gy",
            "value": 129
        },
        {
            "hc-key": "hn",
            "value": 130
        },
        {
            "hc-key": "ga",
            "value": 131
        },
        {
            "hc-key": "ni",
            "value": 132
        },
        {
            "hc-key": "et",
            "value": 133
        },
        {
            "hc-key": "sd",
            "value": 134
        },
        {
            "hc-key": "so",
            "value": 135
        },
        {
            "hc-key": "gh",
            "value": 136
        },
        {
            "hc-key": "ci",
            "value": 137
        },
        {
            "hc-key": "si",
            "value": 138
        },
        {
            "hc-key": "gt",
            "value": 139
        },
        {
            "hc-key": "ba",
            "value": 140
        },
        {
            "hc-key": "jo",
            "value": 141
        },
        {
            "hc-key": "sy",
            "value": 142
        },
        {
            "hc-key": "we",
            "value": 143
        },
        {
            "hc-key": "il",
            "value": 144
        },
        {
            "hc-key": "eg",
            "value": 145
        },
        {
            "hc-key": "zm",
            "value": 146
        },
        {
            "hc-key": "mc",
            "value": 147
        },
        {
            "hc-key": "uy",
            "value": 148
        },
        {
            "hc-key": "rw",
            "value": 149
        },
        {
            "hc-key": "bo",
            "value": 150
        },
        {
            "hc-key": "cg",
            "value": 151
        },
        {
            "hc-key": "eh",
            "value": 152
        },
        {
            "hc-key": "rs",
            "value": 153
        },
        {
            "hc-key": "me",
            "value": 154
        },
        {
            "hc-key": "tg",
            "value": 155
        },
        {
            "hc-key": "mm",
            "value": 156
        },
        {
            "hc-key": "la",
            "value": 157
        },
        {
            "hc-key": "af",
            "value": 158
        },
        {
            "hc-key": "jk",
            "value": 159
        },
        {
            "hc-key": "pk",
            "value": 160
        },
        {
            "hc-key": "bg",
            "value": 161
        },
        {
            "hc-key": "ua",
            "value": 162
        },
        {
            "hc-key": "ro",
            "value": 163
        },
        {
            "hc-key": "qa",
            "value": 164
        },
        {
            "hc-key": "li",
            "value": 165
        },
        {
            "hc-key": "at",
            "value": 166
        },
        {
            "hc-key": "sk",
            "value": 167
        },
        {
            "hc-key": "sz",
            "value": 168
        },
        {
            "hc-key": "hu",
            "value": 169
        },
        {
            "hc-key": "ly",
            "value": 170
        },
        {
            "hc-key": "ne",
            "value": 171
        },
        {
            "hc-key": "lu",
            "value": 172
        },
        {
            "hc-key": "ad",
            "value": 173
        },
        {
            "hc-key": "lr",
            "value": 174
        },
        {
            "hc-key": "sl",
            "value": 175
        },
        {
            "hc-key": "bn",
            "value": 176
        },
        {
            "hc-key": "mr",
            "value": 177
        },
        {
            "hc-key": "be",
            "value": 178
        },
        {
            "hc-key": "iq",
            "value": 179
        },
        {
            "hc-key": "gm",
            "value": 180
        },
        {
            "hc-key": "ma",
            "value": 181
        },
        {
            "hc-key": "td",
            "value": 182
        },
        {
            "hc-key": "kv",
            "value": 183
        },
        {
            "hc-key": "lb",
            "value": 184
        },
        {
            "hc-key": "sx",
            "value": 185
        },
        {
            "hc-key": "dj",
            "value": 186
        },
        {
            "hc-key": "er",
            "value": 187
        },
        {
            "hc-key": "bi",
            "value": 188
        },
        {
            "hc-key": "sn",
            "value": 189
        },
        {
            "hc-key": "gn",
            "value": 190
        },
        {
            "hc-key": "zw",
            "value": 191
        },
        {
            "hc-key": "py",
            "value": 192
        },
        {
            "hc-key": "by",
            "value": 193
        },
        {
            "hc-key": "lv",
            "value": 194
        },
        {
            "hc-key": "bt",
            "value": 195
        },
        {
            "hc-key": "na",
            "value": 196
        },
        {
            "hc-key": "bf",
            "value": 197
        },
        {
            "hc-key": "ss",
            "value": 198
        },
        {
            "hc-key": "cf",
            "value": 199
        },
        {
            "hc-key": "md",
            "value": 200
        },
        {
            "hc-key": "gz",
            "value": 201
        },
        {
            "hc-key": "ke",
            "value": 202
        },
        {
            "hc-key": "bw",
            "value": 203
        },
        {
            "hc-key": "cz",
            "value": 204
        },
        {
            "hc-key": "pr",
            "value": 205
        },
        {
            "hc-key": "tn",
            "value": 206
        },
        {
            "hc-key": "cu",
            "value": 207
        },
        {
            "hc-key": "vn",
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
            "hc-key": "sr",
            "value": 213
        },
        {
            "hc-key": "kg",
            "value": 214
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/custom/world-palestine-highres.js">World with Palestine areas, high resolution</a>'
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
            mapData: Highcharts.maps['custom/world-palestine-highres'],
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
