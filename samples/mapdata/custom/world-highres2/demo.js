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
            "hc-key": "in",
            "value": 5
        },
        {
            "hc-key": "fr",
            "value": 6
        },
        {
            "hc-key": "fm",
            "value": 7
        },
        {
            "hc-key": "cn",
            "value": 8
        },
        {
            "hc-key": "sw",
            "value": 9
        },
        {
            "hc-key": "sh",
            "value": 10
        },
        {
            "hc-key": "br",
            "value": 11
        },
        {
            "hc-key": "ec",
            "value": 12
        },
        {
            "hc-key": "au",
            "value": 13
        },
        {
            "hc-key": "ki",
            "value": 14
        },
        {
            "hc-key": "ph",
            "value": 15
        },
        {
            "hc-key": "mx",
            "value": 16
        },
        {
            "hc-key": "es",
            "value": 17
        },
        {
            "hc-key": "bu",
            "value": 18
        },
        {
            "hc-key": "mv",
            "value": 19
        },
        {
            "hc-key": "sp",
            "value": 20
        },
        {
            "hc-key": "gb",
            "value": 21
        },
        {
            "hc-key": "gr",
            "value": 22
        },
        {
            "hc-key": "as",
            "value": 23
        },
        {
            "hc-key": "dk",
            "value": 24
        },
        {
            "hc-key": "gl",
            "value": 25
        },
        {
            "hc-key": "gu",
            "value": 26
        },
        {
            "hc-key": "mp",
            "value": 27
        },
        {
            "hc-key": "pr",
            "value": 28
        },
        {
            "hc-key": "vi",
            "value": 29
        },
        {
            "hc-key": "ca",
            "value": 30
        },
        {
            "hc-key": "st",
            "value": 31
        },
        {
            "hc-key": "cv",
            "value": 32
        },
        {
            "hc-key": "dm",
            "value": 33
        },
        {
            "hc-key": "nl",
            "value": 34
        },
        {
            "hc-key": "ye",
            "value": 35
        },
        {
            "hc-key": "jm",
            "value": 36
        },
        {
            "hc-key": "ws",
            "value": 37
        },
        {
            "hc-key": "om",
            "value": 38
        },
        {
            "hc-key": "vc",
            "value": 39
        },
        {
            "hc-key": "tr",
            "value": 40
        },
        {
            "hc-key": "bd",
            "value": 41
        },
        {
            "hc-key": "sb",
            "value": 42
        },
        {
            "hc-key": "lc",
            "value": 43
        },
        {
            "hc-key": "nr",
            "value": 44
        },
        {
            "hc-key": "no",
            "value": 45
        },
        {
            "hc-key": "kn",
            "value": 46
        },
        {
            "hc-key": "bh",
            "value": 47
        },
        {
            "hc-key": "to",
            "value": 48
        },
        {
            "hc-key": "fi",
            "value": 49
        },
        {
            "hc-key": "id",
            "value": 50
        },
        {
            "hc-key": "mu",
            "value": 51
        },
        {
            "hc-key": "se",
            "value": 52
        },
        {
            "hc-key": "tt",
            "value": 53
        },
        {
            "hc-key": "my",
            "value": 54
        },
        {
            "hc-key": "bs",
            "value": 55
        },
        {
            "hc-key": "pw",
            "value": 56
        },
        {
            "hc-key": "tv",
            "value": 57
        },
        {
            "hc-key": "mh",
            "value": 58
        },
        {
            "hc-key": "cl",
            "value": 59
        },
        {
            "hc-key": "th",
            "value": 60
        },
        {
            "hc-key": "gd",
            "value": 61
        },
        {
            "hc-key": "ee",
            "value": 62
        },
        {
            "hc-key": "ag",
            "value": 63
        },
        {
            "hc-key": "tw",
            "value": 64
        },
        {
            "hc-key": "bb",
            "value": 65
        },
        {
            "hc-key": "it",
            "value": 66
        },
        {
            "hc-key": "mt",
            "value": 67
        },
        {
            "hc-key": "pg",
            "value": 68
        },
        {
            "hc-key": "vu",
            "value": 69
        },
        {
            "hc-key": "sg",
            "value": 70
        },
        {
            "hc-key": "cy",
            "value": 71
        },
        {
            "hc-key": "km",
            "value": 72
        },
        {
            "hc-key": "fj",
            "value": 73
        },
        {
            "hc-key": "ru",
            "value": 74
        },
        {
            "hc-key": "va",
            "value": 75
        },
        {
            "hc-key": "sm",
            "value": 76
        },
        {
            "hc-key": "kz",
            "value": 77
        },
        {
            "hc-key": "az",
            "value": 78
        },
        {
            "hc-key": "am",
            "value": 79
        },
        {
            "hc-key": "tj",
            "value": 80
        },
        {
            "hc-key": "ls",
            "value": 81
        },
        {
            "hc-key": "uz",
            "value": 82
        },
        {
            "hc-key": "pt",
            "value": 83
        },
        {
            "hc-key": "ma",
            "value": 84
        },
        {
            "hc-key": "co",
            "value": 85
        },
        {
            "hc-key": "tl",
            "value": 86
        },
        {
            "hc-key": "tz",
            "value": 87
        },
        {
            "hc-key": "kh",
            "value": 88
        },
        {
            "hc-key": "ar",
            "value": 89
        },
        {
            "hc-key": "sa",
            "value": 90
        },
        {
            "hc-key": "pk",
            "value": 91
        },
        {
            "hc-key": "ae",
            "value": 92
        },
        {
            "hc-key": "ke",
            "value": 93
        },
        {
            "hc-key": "pe",
            "value": 94
        },
        {
            "hc-key": "do",
            "value": 95
        },
        {
            "hc-key": "ht",
            "value": 96
        },
        {
            "hc-key": "ao",
            "value": 97
        },
        {
            "hc-key": "mz",
            "value": 98
        },
        {
            "hc-key": "pa",
            "value": 99
        },
        {
            "hc-key": "cr",
            "value": 100
        },
        {
            "hc-key": "ir",
            "value": 101
        },
        {
            "hc-key": "sv",
            "value": 102
        },
        {
            "hc-key": "gw",
            "value": 103
        },
        {
            "hc-key": "hr",
            "value": 104
        },
        {
            "hc-key": "bz",
            "value": 105
        },
        {
            "hc-key": "za",
            "value": 106
        },
        {
            "hc-key": "na",
            "value": 107
        },
        {
            "hc-key": "cf",
            "value": 108
        },
        {
            "hc-key": "sd",
            "value": 109
        },
        {
            "hc-key": "ly",
            "value": 110
        },
        {
            "hc-key": "cd",
            "value": 111
        },
        {
            "hc-key": "kw",
            "value": 112
        },
        {
            "hc-key": "de",
            "value": 113
        },
        {
            "hc-key": "ie",
            "value": 114
        },
        {
            "hc-key": "kp",
            "value": 115
        },
        {
            "hc-key": "kr",
            "value": 116
        },
        {
            "hc-key": "gy",
            "value": 117
        },
        {
            "hc-key": "hn",
            "value": 118
        },
        {
            "hc-key": "mm",
            "value": 119
        },
        {
            "hc-key": "ga",
            "value": 120
        },
        {
            "hc-key": "gq",
            "value": 121
        },
        {
            "hc-key": "ni",
            "value": 122
        },
        {
            "hc-key": "ug",
            "value": 123
        },
        {
            "hc-key": "mw",
            "value": 124
        },
        {
            "hc-key": "tm",
            "value": 125
        },
        {
            "hc-key": "sx",
            "value": 126
        },
        {
            "hc-key": "zm",
            "value": 127
        },
        {
            "hc-key": "nc",
            "value": 128
        },
        {
            "hc-key": "mr",
            "value": 129
        },
        {
            "hc-key": "dz",
            "value": 130
        },
        {
            "hc-key": "lt",
            "value": 131
        },
        {
            "hc-key": "et",
            "value": 132
        },
        {
            "hc-key": "er",
            "value": 133
        },
        {
            "hc-key": "gh",
            "value": 134
        },
        {
            "hc-key": "si",
            "value": 135
        },
        {
            "hc-key": "gt",
            "value": 136
        },
        {
            "hc-key": "ba",
            "value": 137
        },
        {
            "hc-key": "jo",
            "value": 138
        },
        {
            "hc-key": "sy",
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
            "hc-key": "so",
            "value": 146
        },
        {
            "hc-key": "bo",
            "value": 147
        },
        {
            "hc-key": "cm",
            "value": 148
        },
        {
            "hc-key": "cg",
            "value": 149
        },
        {
            "hc-key": "eh",
            "value": 150
        },
        {
            "hc-key": "rs",
            "value": 151
        },
        {
            "hc-key": "me",
            "value": 152
        },
        {
            "hc-key": "bj",
            "value": 153
        },
        {
            "hc-key": "ng",
            "value": 154
        },
        {
            "hc-key": "tg",
            "value": 155
        },
        {
            "hc-key": "la",
            "value": 156
        },
        {
            "hc-key": "af",
            "value": 157
        },
        {
            "hc-key": "ua",
            "value": 158
        },
        {
            "hc-key": "sk",
            "value": 159
        },
        {
            "hc-key": "jk",
            "value": 160
        },
        {
            "hc-key": "bg",
            "value": 161
        },
        {
            "hc-key": "qa",
            "value": 162
        },
        {
            "hc-key": "li",
            "value": 163
        },
        {
            "hc-key": "at",
            "value": 164
        },
        {
            "hc-key": "sz",
            "value": 165
        },
        {
            "hc-key": "hu",
            "value": 166
        },
        {
            "hc-key": "ro",
            "value": 167
        },
        {
            "hc-key": "lu",
            "value": 168
        },
        {
            "hc-key": "ad",
            "value": 169
        },
        {
            "hc-key": "ci",
            "value": 170
        },
        {
            "hc-key": "lr",
            "value": 171
        },
        {
            "hc-key": "bn",
            "value": 172
        },
        {
            "hc-key": "be",
            "value": 173
        },
        {
            "hc-key": "iq",
            "value": 174
        },
        {
            "hc-key": "ge",
            "value": 175
        },
        {
            "hc-key": "gm",
            "value": 176
        },
        {
            "hc-key": "ch",
            "value": 177
        },
        {
            "hc-key": "td",
            "value": 178
        },
        {
            "hc-key": "kv",
            "value": 179
        },
        {
            "hc-key": "lb",
            "value": 180
        },
        {
            "hc-key": "dj",
            "value": 181
        },
        {
            "hc-key": "bi",
            "value": 182
        },
        {
            "hc-key": "sr",
            "value": 183
        },
        {
            "hc-key": "il",
            "value": 184
        },
        {
            "hc-key": "ml",
            "value": 185
        },
        {
            "hc-key": "sn",
            "value": 186
        },
        {
            "hc-key": "gn",
            "value": 187
        },
        {
            "hc-key": "zw",
            "value": 188
        },
        {
            "hc-key": "pl",
            "value": 189
        },
        {
            "hc-key": "mk",
            "value": 190
        },
        {
            "hc-key": "py",
            "value": 191
        },
        {
            "hc-key": "by",
            "value": 192
        },
        {
            "hc-key": "lv",
            "value": 193
        },
        {
            "hc-key": "bf",
            "value": 194
        },
        {
            "hc-key": "ne",
            "value": 195
        },
        {
            "hc-key": "tn",
            "value": 196
        },
        {
            "hc-key": "bt",
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
            "hc-key": "bw",
            "value": 200
        },
        {
            "hc-key": "nz",
            "value": 201
        },
        {
            "hc-key": "cu",
            "value": 202
        },
        {
            "hc-key": "ve",
            "value": 203
        },
        {
            "hc-key": "vn",
            "value": 204
        },
        {
            "hc-key": "sl",
            "value": 205
        },
        {
            "hc-key": "mg",
            "value": 206
        },
        {
            "hc-key": "is",
            "value": 207
        },
        {
            "hc-key": "eg",
            "value": 208
        },
        {
            "hc-key": "lk",
            "value": 209
        },
        {
            "hc-key": "cz",
            "value": 210
        },
        {
            "hc-key": "kg",
            "value": 211
        },
        {
            "hc-key": "np",
            "value": 212
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/custom/world-highres2.js">World, Miller projection, very high resolution</a>'
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
            mapData: Highcharts.maps['custom/world-highres2'],
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
