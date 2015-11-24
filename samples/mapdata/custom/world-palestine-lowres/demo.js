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
            "hc-key": "vc",
            "value": 22
        },
        {
            "hc-key": "sb",
            "value": 23
        },
        {
            "hc-key": "lc",
            "value": 24
        },
        {
            "hc-key": "fr",
            "value": 25
        },
        {
            "hc-key": "nr",
            "value": 26
        },
        {
            "hc-key": "no",
            "value": 27
        },
        {
            "hc-key": "fm",
            "value": 28
        },
        {
            "hc-key": "kn",
            "value": 29
        },
        {
            "hc-key": "cn",
            "value": 30
        },
        {
            "hc-key": "bh",
            "value": 31
        },
        {
            "hc-key": "to",
            "value": 32
        },
        {
            "hc-key": "id",
            "value": 33
        },
        {
            "hc-key": "mu",
            "value": 34
        },
        {
            "hc-key": "tt",
            "value": 35
        },
        {
            "hc-key": "sw",
            "value": 36
        },
        {
            "hc-key": "bs",
            "value": 37
        },
        {
            "hc-key": "pw",
            "value": 38
        },
        {
            "hc-key": "tv",
            "value": 39
        },
        {
            "hc-key": "mh",
            "value": 40
        },
        {
            "hc-key": "cl",
            "value": 41
        },
        {
            "hc-key": "ki",
            "value": 42
        },
        {
            "hc-key": "ph",
            "value": 43
        },
        {
            "hc-key": "th",
            "value": 44
        },
        {
            "hc-key": "gd",
            "value": 45
        },
        {
            "hc-key": "ag",
            "value": 46
        },
        {
            "hc-key": "es",
            "value": 47
        },
        {
            "hc-key": "bb",
            "value": 48
        },
        {
            "hc-key": "it",
            "value": 49
        },
        {
            "hc-key": "mt",
            "value": 50
        },
        {
            "hc-key": "mv",
            "value": 51
        },
        {
            "hc-key": "sp",
            "value": 52
        },
        {
            "hc-key": "pg",
            "value": 53
        },
        {
            "hc-key": "sg",
            "value": 54
        },
        {
            "hc-key": "cnm",
            "value": 55
        },
        {
            "hc-key": "gb",
            "value": 56
        },
        {
            "hc-key": "cy",
            "value": 57
        },
        {
            "hc-key": "gr",
            "value": 58
        },
        {
            "hc-key": "km",
            "value": 59
        },
        {
            "hc-key": "fj",
            "value": 60
        },
        {
            "hc-key": "ru",
            "value": 61
        },
        {
            "hc-key": "va",
            "value": 62
        },
        {
            "hc-key": "sm",
            "value": 63
        },
        {
            "hc-key": "az",
            "value": 64
        },
        {
            "hc-key": "ls",
            "value": 65
        },
        {
            "hc-key": "tj",
            "value": 66
        },
        {
            "hc-key": "ml",
            "value": 67
        },
        {
            "hc-key": "dz",
            "value": 68
        },
        {
            "hc-key": "tw",
            "value": 69
        },
        {
            "hc-key": "kz",
            "value": 70
        },
        {
            "hc-key": "kg",
            "value": 71
        },
        {
            "hc-key": "uz",
            "value": 72
        },
        {
            "hc-key": "tz",
            "value": 73
        },
        {
            "hc-key": "ar",
            "value": 74
        },
        {
            "hc-key": "sa",
            "value": 75
        },
        {
            "hc-key": "nl",
            "value": 76
        },
        {
            "hc-key": "ye",
            "value": 77
        },
        {
            "hc-key": "ae",
            "value": 78
        },
        {
            "hc-key": "in",
            "value": 79
        },
        {
            "hc-key": "tr",
            "value": 80
        },
        {
            "hc-key": "bd",
            "value": 81
        },
        {
            "hc-key": "ch",
            "value": 82
        },
        {
            "hc-key": "sr",
            "value": 83
        },
        {
            "hc-key": "pt",
            "value": 84
        },
        {
            "hc-key": "my",
            "value": 85
        },
        {
            "hc-key": "kh",
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
            "hc-key": "ir",
            "value": 91
        },
        {
            "hc-key": "ht",
            "value": 92
        },
        {
            "hc-key": "do",
            "value": 93
        },
        {
            "hc-key": "sl",
            "value": 94
        },
        {
            "hc-key": "gw",
            "value": 95
        },
        {
            "hc-key": "ba",
            "value": 96
        },
        {
            "hc-key": "hr",
            "value": 97
        },
        {
            "hc-key": "ee",
            "value": 98
        },
        {
            "hc-key": "mx",
            "value": 99
        },
        {
            "hc-key": "tn",
            "value": 100
        },
        {
            "hc-key": "kw",
            "value": 101
        },
        {
            "hc-key": "de",
            "value": 102
        },
        {
            "hc-key": "mm",
            "value": 103
        },
        {
            "hc-key": "gq",
            "value": 104
        },
        {
            "hc-key": "ga",
            "value": 105
        },
        {
            "hc-key": "ie",
            "value": 106
        },
        {
            "hc-key": "pl",
            "value": 107
        },
        {
            "hc-key": "lt",
            "value": 108
        },
        {
            "hc-key": "eg",
            "value": 109
        },
        {
            "hc-key": "ug",
            "value": 110
        },
        {
            "hc-key": "cd",
            "value": 111
        },
        {
            "hc-key": "am",
            "value": 112
        },
        {
            "hc-key": "mk",
            "value": 113
        },
        {
            "hc-key": "al",
            "value": 114
        },
        {
            "hc-key": "cm",
            "value": 115
        },
        {
            "hc-key": "bj",
            "value": 116
        },
        {
            "hc-key": "nc",
            "value": 117
        },
        {
            "hc-key": "ge",
            "value": 118
        },
        {
            "hc-key": "tl",
            "value": 119
        },
        {
            "hc-key": "tm",
            "value": 120
        },
        {
            "hc-key": "pe",
            "value": 121
        },
        {
            "hc-key": "mw",
            "value": 122
        },
        {
            "hc-key": "mn",
            "value": 123
        },
        {
            "hc-key": "ao",
            "value": 124
        },
        {
            "hc-key": "mz",
            "value": 125
        },
        {
            "hc-key": "za",
            "value": 126
        },
        {
            "hc-key": "cr",
            "value": 127
        },
        {
            "hc-key": "sv",
            "value": 128
        },
        {
            "hc-key": "bz",
            "value": 129
        },
        {
            "hc-key": "co",
            "value": 130
        },
        {
            "hc-key": "ec",
            "value": 131
        },
        {
            "hc-key": "ly",
            "value": 132
        },
        {
            "hc-key": "sd",
            "value": 133
        },
        {
            "hc-key": "kp",
            "value": 134
        },
        {
            "hc-key": "kr",
            "value": 135
        },
        {
            "hc-key": "gy",
            "value": 136
        },
        {
            "hc-key": "hn",
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
            "hc-key": "gh",
            "value": 141
        },
        {
            "hc-key": "si",
            "value": 142
        },
        {
            "hc-key": "gt",
            "value": 143
        },
        {
            "hc-key": "jo",
            "value": 144
        },
        {
            "hc-key": "we",
            "value": 145
        },
        {
            "hc-key": "il",
            "value": 146
        },
        {
            "hc-key": "zm",
            "value": 147
        },
        {
            "hc-key": "mc",
            "value": 148
        },
        {
            "hc-key": "uy",
            "value": 149
        },
        {
            "hc-key": "rw",
            "value": 150
        },
        {
            "hc-key": "bo",
            "value": 151
        },
        {
            "hc-key": "cg",
            "value": 152
        },
        {
            "hc-key": "eh",
            "value": 153
        },
        {
            "hc-key": "rs",
            "value": 154
        },
        {
            "hc-key": "me",
            "value": 155
        },
        {
            "hc-key": "tg",
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
            "hc-key": "sz",
            "value": 167
        },
        {
            "hc-key": "hu",
            "value": 168
        },
        {
            "hc-key": "ne",
            "value": 169
        },
        {
            "hc-key": "lu",
            "value": 170
        },
        {
            "hc-key": "ad",
            "value": 171
        },
        {
            "hc-key": "ci",
            "value": 172
        },
        {
            "hc-key": "lr",
            "value": 173
        },
        {
            "hc-key": "bn",
            "value": 174
        },
        {
            "hc-key": "mr",
            "value": 175
        },
        {
            "hc-key": "be",
            "value": 176
        },
        {
            "hc-key": "iq",
            "value": 177
        },
        {
            "hc-key": "gm",
            "value": 178
        },
        {
            "hc-key": "ma",
            "value": 179
        },
        {
            "hc-key": "td",
            "value": 180
        },
        {
            "hc-key": "kv",
            "value": 181
        },
        {
            "hc-key": "lb",
            "value": 182
        },
        {
            "hc-key": "sx",
            "value": 183
        },
        {
            "hc-key": "dj",
            "value": 184
        },
        {
            "hc-key": "er",
            "value": 185
        },
        {
            "hc-key": "bi",
            "value": 186
        },
        {
            "hc-key": "sn",
            "value": 187
        },
        {
            "hc-key": "gn",
            "value": 188
        },
        {
            "hc-key": "zw",
            "value": 189
        },
        {
            "hc-key": "py",
            "value": 190
        },
        {
            "hc-key": "by",
            "value": 191
        },
        {
            "hc-key": "lv",
            "value": 192
        },
        {
            "hc-key": "sy",
            "value": 193
        },
        {
            "hc-key": "na",
            "value": 194
        },
        {
            "hc-key": "bf",
            "value": 195
        },
        {
            "hc-key": "ss",
            "value": 196
        },
        {
            "hc-key": "cf",
            "value": 197
        },
        {
            "hc-key": "md",
            "value": 198
        },
        {
            "hc-key": "gz",
            "value": 199
        },
        {
            "hc-key": "ke",
            "value": 200
        },
        {
            "hc-key": "cz",
            "value": 201
        },
        {
            "hc-key": "sk",
            "value": 202
        },
        {
            "hc-key": "vu",
            "value": 203
        },
        {
            "hc-key": "nz",
            "value": 204
        },
        {
            "hc-key": "cu",
            "value": 205
        },
        {
            "hc-key": "fi",
            "value": 206
        },
        {
            "hc-key": "se",
            "value": 207
        },
        {
            "hc-key": "au",
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
            "hc-key": "bw",
            "value": 212
        },
        {
            "hc-key": "bt",
            "value": 213
        },
        {
            "hc-key": "np",
            "value": 214
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/custom/world-palestine-lowres.js">World with Palestine areas, low resolution</a>'
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
            mapData: Highcharts.maps['custom/world-palestine-lowres'],
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
