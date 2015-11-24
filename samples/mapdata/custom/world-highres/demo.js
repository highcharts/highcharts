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
            "hc-key": "tz",
            "value": 32
        },
        {
            "hc-key": "cv",
            "value": 33
        },
        {
            "hc-key": "dm",
            "value": 34
        },
        {
            "hc-key": "nl",
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
            "hc-key": "pa",
            "value": 56
        },
        {
            "hc-key": "pw",
            "value": 57
        },
        {
            "hc-key": "tv",
            "value": 58
        },
        {
            "hc-key": "mh",
            "value": 59
        },
        {
            "hc-key": "cl",
            "value": 60
        },
        {
            "hc-key": "th",
            "value": 61
        },
        {
            "hc-key": "gd",
            "value": 62
        },
        {
            "hc-key": "ee",
            "value": 63
        },
        {
            "hc-key": "ag",
            "value": 64
        },
        {
            "hc-key": "tw",
            "value": 65
        },
        {
            "hc-key": "bb",
            "value": 66
        },
        {
            "hc-key": "it",
            "value": 67
        },
        {
            "hc-key": "mt",
            "value": 68
        },
        {
            "hc-key": "pg",
            "value": 69
        },
        {
            "hc-key": "de",
            "value": 70
        },
        {
            "hc-key": "vu",
            "value": 71
        },
        {
            "hc-key": "sg",
            "value": 72
        },
        {
            "hc-key": "cy",
            "value": 73
        },
        {
            "hc-key": "km",
            "value": 74
        },
        {
            "hc-key": "fj",
            "value": 75
        },
        {
            "hc-key": "ru",
            "value": 76
        },
        {
            "hc-key": "va",
            "value": 77
        },
        {
            "hc-key": "sm",
            "value": 78
        },
        {
            "hc-key": "kz",
            "value": 79
        },
        {
            "hc-key": "az",
            "value": 80
        },
        {
            "hc-key": "am",
            "value": 81
        },
        {
            "hc-key": "tj",
            "value": 82
        },
        {
            "hc-key": "ls",
            "value": 83
        },
        {
            "hc-key": "uz",
            "value": 84
        },
        {
            "hc-key": "pt",
            "value": 85
        },
        {
            "hc-key": "ma",
            "value": 86
        },
        {
            "hc-key": "co",
            "value": 87
        },
        {
            "hc-key": "tl",
            "value": 88
        },
        {
            "hc-key": "kh",
            "value": 89
        },
        {
            "hc-key": "ar",
            "value": 90
        },
        {
            "hc-key": "sa",
            "value": 91
        },
        {
            "hc-key": "pk",
            "value": 92
        },
        {
            "hc-key": "ye",
            "value": 93
        },
        {
            "hc-key": "ae",
            "value": 94
        },
        {
            "hc-key": "ke",
            "value": 95
        },
        {
            "hc-key": "pe",
            "value": 96
        },
        {
            "hc-key": "do",
            "value": 97
        },
        {
            "hc-key": "ht",
            "value": 98
        },
        {
            "hc-key": "ao",
            "value": 99
        },
        {
            "hc-key": "vn",
            "value": 100
        },
        {
            "hc-key": "mz",
            "value": 101
        },
        {
            "hc-key": "cr",
            "value": 102
        },
        {
            "hc-key": "ir",
            "value": 103
        },
        {
            "hc-key": "sv",
            "value": 104
        },
        {
            "hc-key": "sl",
            "value": 105
        },
        {
            "hc-key": "gw",
            "value": 106
        },
        {
            "hc-key": "hr",
            "value": 107
        },
        {
            "hc-key": "bz",
            "value": 108
        },
        {
            "hc-key": "za",
            "value": 109
        },
        {
            "hc-key": "cd",
            "value": 110
        },
        {
            "hc-key": "kw",
            "value": 111
        },
        {
            "hc-key": "ie",
            "value": 112
        },
        {
            "hc-key": "kp",
            "value": 113
        },
        {
            "hc-key": "kr",
            "value": 114
        },
        {
            "hc-key": "gy",
            "value": 115
        },
        {
            "hc-key": "hn",
            "value": 116
        },
        {
            "hc-key": "mm",
            "value": 117
        },
        {
            "hc-key": "ga",
            "value": 118
        },
        {
            "hc-key": "gq",
            "value": 119
        },
        {
            "hc-key": "ni",
            "value": 120
        },
        {
            "hc-key": "ug",
            "value": 121
        },
        {
            "hc-key": "mw",
            "value": 122
        },
        {
            "hc-key": "sx",
            "value": 123
        },
        {
            "hc-key": "tm",
            "value": 124
        },
        {
            "hc-key": "zm",
            "value": 125
        },
        {
            "hc-key": "nc",
            "value": 126
        },
        {
            "hc-key": "mr",
            "value": 127
        },
        {
            "hc-key": "dz",
            "value": 128
        },
        {
            "hc-key": "lt",
            "value": 129
        },
        {
            "hc-key": "et",
            "value": 130
        },
        {
            "hc-key": "sd",
            "value": 131
        },
        {
            "hc-key": "er",
            "value": 132
        },
        {
            "hc-key": "gh",
            "value": 133
        },
        {
            "hc-key": "si",
            "value": 134
        },
        {
            "hc-key": "gt",
            "value": 135
        },
        {
            "hc-key": "ba",
            "value": 136
        },
        {
            "hc-key": "jo",
            "value": 137
        },
        {
            "hc-key": "sy",
            "value": 138
        },
        {
            "hc-key": "mc",
            "value": 139
        },
        {
            "hc-key": "al",
            "value": 140
        },
        {
            "hc-key": "uy",
            "value": 141
        },
        {
            "hc-key": "cnm",
            "value": 142
        },
        {
            "hc-key": "mn",
            "value": 143
        },
        {
            "hc-key": "rw",
            "value": 144
        },
        {
            "hc-key": "so",
            "value": 145
        },
        {
            "hc-key": "bo",
            "value": 146
        },
        {
            "hc-key": "cm",
            "value": 147
        },
        {
            "hc-key": "cg",
            "value": 148
        },
        {
            "hc-key": "eh",
            "value": 149
        },
        {
            "hc-key": "rs",
            "value": 150
        },
        {
            "hc-key": "me",
            "value": 151
        },
        {
            "hc-key": "bj",
            "value": 152
        },
        {
            "hc-key": "ng",
            "value": 153
        },
        {
            "hc-key": "tg",
            "value": 154
        },
        {
            "hc-key": "la",
            "value": 155
        },
        {
            "hc-key": "af",
            "value": 156
        },
        {
            "hc-key": "ua",
            "value": 157
        },
        {
            "hc-key": "sk",
            "value": 158
        },
        {
            "hc-key": "jk",
            "value": 159
        },
        {
            "hc-key": "bg",
            "value": 160
        },
        {
            "hc-key": "qa",
            "value": 161
        },
        {
            "hc-key": "li",
            "value": 162
        },
        {
            "hc-key": "at",
            "value": 163
        },
        {
            "hc-key": "sz",
            "value": 164
        },
        {
            "hc-key": "hu",
            "value": 165
        },
        {
            "hc-key": "ro",
            "value": 166
        },
        {
            "hc-key": "lu",
            "value": 167
        },
        {
            "hc-key": "ad",
            "value": 168
        },
        {
            "hc-key": "ci",
            "value": 169
        },
        {
            "hc-key": "lr",
            "value": 170
        },
        {
            "hc-key": "bn",
            "value": 171
        },
        {
            "hc-key": "be",
            "value": 172
        },
        {
            "hc-key": "iq",
            "value": 173
        },
        {
            "hc-key": "ge",
            "value": 174
        },
        {
            "hc-key": "gm",
            "value": 175
        },
        {
            "hc-key": "ch",
            "value": 176
        },
        {
            "hc-key": "td",
            "value": 177
        },
        {
            "hc-key": "kv",
            "value": 178
        },
        {
            "hc-key": "lb",
            "value": 179
        },
        {
            "hc-key": "dj",
            "value": 180
        },
        {
            "hc-key": "bi",
            "value": 181
        },
        {
            "hc-key": "sr",
            "value": 182
        },
        {
            "hc-key": "il",
            "value": 183
        },
        {
            "hc-key": "ml",
            "value": 184
        },
        {
            "hc-key": "sn",
            "value": 185
        },
        {
            "hc-key": "gn",
            "value": 186
        },
        {
            "hc-key": "zw",
            "value": 187
        },
        {
            "hc-key": "pl",
            "value": 188
        },
        {
            "hc-key": "mk",
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
            "hc-key": "cz",
            "value": 193
        },
        {
            "hc-key": "bf",
            "value": 194
        },
        {
            "hc-key": "na",
            "value": 195
        },
        {
            "hc-key": "ne",
            "value": 196
        },
        {
            "hc-key": "ly",
            "value": 197
        },
        {
            "hc-key": "tn",
            "value": 198
        },
        {
            "hc-key": "bt",
            "value": 199
        },
        {
            "hc-key": "md",
            "value": 200
        },
        {
            "hc-key": "ss",
            "value": 201
        },
        {
            "hc-key": "cf",
            "value": 202
        },
        {
            "hc-key": "nz",
            "value": 203
        },
        {
            "hc-key": "cu",
            "value": 204
        },
        {
            "hc-key": "ve",
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
            "hc-key": "bw",
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
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/custom/world-highres.js">World, Miller projection, high resolution</a>'
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
            mapData: Highcharts.maps['custom/world-highres'],
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
