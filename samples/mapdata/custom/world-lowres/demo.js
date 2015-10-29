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
            "hc-key": "fr",
            "value": 5
        },
        {
            "hc-key": "fm",
            "value": 6
        },
        {
            "hc-key": "cn",
            "value": 7
        },
        {
            "hc-key": "pt",
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
            "hc-key": "ki",
            "value": 12
        },
        {
            "hc-key": "ph",
            "value": 13
        },
        {
            "hc-key": "mx",
            "value": 14
        },
        {
            "hc-key": "bu",
            "value": 15
        },
        {
            "hc-key": "mv",
            "value": 16
        },
        {
            "hc-key": "sp",
            "value": 17
        },
        {
            "hc-key": "gb",
            "value": 18
        },
        {
            "hc-key": "gr",
            "value": 19
        },
        {
            "hc-key": "as",
            "value": 20
        },
        {
            "hc-key": "dk",
            "value": 21
        },
        {
            "hc-key": "gl",
            "value": 22
        },
        {
            "hc-key": "gu",
            "value": 23
        },
        {
            "hc-key": "mp",
            "value": 24
        },
        {
            "hc-key": "pr",
            "value": 25
        },
        {
            "hc-key": "vi",
            "value": 26
        },
        {
            "hc-key": "ca",
            "value": 27
        },
        {
            "hc-key": "st",
            "value": 28
        },
        {
            "hc-key": "cv",
            "value": 29
        },
        {
            "hc-key": "dm",
            "value": 30
        },
        {
            "hc-key": "nl",
            "value": 31
        },
        {
            "hc-key": "jm",
            "value": 32
        },
        {
            "hc-key": "ws",
            "value": 33
        },
        {
            "hc-key": "om",
            "value": 34
        },
        {
            "hc-key": "vc",
            "value": 35
        },
        {
            "hc-key": "tr",
            "value": 36
        },
        {
            "hc-key": "bd",
            "value": 37
        },
        {
            "hc-key": "lc",
            "value": 38
        },
        {
            "hc-key": "nr",
            "value": 39
        },
        {
            "hc-key": "no",
            "value": 40
        },
        {
            "hc-key": "kn",
            "value": 41
        },
        {
            "hc-key": "bh",
            "value": 42
        },
        {
            "hc-key": "to",
            "value": 43
        },
        {
            "hc-key": "fi",
            "value": 44
        },
        {
            "hc-key": "id",
            "value": 45
        },
        {
            "hc-key": "mu",
            "value": 46
        },
        {
            "hc-key": "se",
            "value": 47
        },
        {
            "hc-key": "tt",
            "value": 48
        },
        {
            "hc-key": "my",
            "value": 49
        },
        {
            "hc-key": "pa",
            "value": 50
        },
        {
            "hc-key": "pw",
            "value": 51
        },
        {
            "hc-key": "tv",
            "value": 52
        },
        {
            "hc-key": "mh",
            "value": 53
        },
        {
            "hc-key": "th",
            "value": 54
        },
        {
            "hc-key": "gd",
            "value": 55
        },
        {
            "hc-key": "ee",
            "value": 56
        },
        {
            "hc-key": "ag",
            "value": 57
        },
        {
            "hc-key": "tw",
            "value": 58
        },
        {
            "hc-key": "bb",
            "value": 59
        },
        {
            "hc-key": "it",
            "value": 60
        },
        {
            "hc-key": "mt",
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
            "hc-key": "cy",
            "value": 64
        },
        {
            "hc-key": "lk",
            "value": 65
        },
        {
            "hc-key": "km",
            "value": 66
        },
        {
            "hc-key": "fj",
            "value": 67
        },
        {
            "hc-key": "ru",
            "value": 68
        },
        {
            "hc-key": "va",
            "value": 69
        },
        {
            "hc-key": "sm",
            "value": 70
        },
        {
            "hc-key": "kz",
            "value": 71
        },
        {
            "hc-key": "az",
            "value": 72
        },
        {
            "hc-key": "am",
            "value": 73
        },
        {
            "hc-key": "tj",
            "value": 74
        },
        {
            "hc-key": "ls",
            "value": 75
        },
        {
            "hc-key": "uz",
            "value": 76
        },
        {
            "hc-key": "in",
            "value": 77
        },
        {
            "hc-key": "es",
            "value": 78
        },
        {
            "hc-key": "ma",
            "value": 79
        },
        {
            "hc-key": "ec",
            "value": 80
        },
        {
            "hc-key": "co",
            "value": 81
        },
        {
            "hc-key": "tl",
            "value": 82
        },
        {
            "hc-key": "tz",
            "value": 83
        },
        {
            "hc-key": "ar",
            "value": 84
        },
        {
            "hc-key": "sa",
            "value": 85
        },
        {
            "hc-key": "pk",
            "value": 86
        },
        {
            "hc-key": "ye",
            "value": 87
        },
        {
            "hc-key": "ae",
            "value": 88
        },
        {
            "hc-key": "ke",
            "value": 89
        },
        {
            "hc-key": "pe",
            "value": 90
        },
        {
            "hc-key": "do",
            "value": 91
        },
        {
            "hc-key": "ht",
            "value": 92
        },
        {
            "hc-key": "ao",
            "value": 93
        },
        {
            "hc-key": "kh",
            "value": 94
        },
        {
            "hc-key": "vn",
            "value": 95
        },
        {
            "hc-key": "mz",
            "value": 96
        },
        {
            "hc-key": "cr",
            "value": 97
        },
        {
            "hc-key": "bj",
            "value": 98
        },
        {
            "hc-key": "ng",
            "value": 99
        },
        {
            "hc-key": "ir",
            "value": 100
        },
        {
            "hc-key": "sv",
            "value": 101
        },
        {
            "hc-key": "cl",
            "value": 102
        },
        {
            "hc-key": "sl",
            "value": 103
        },
        {
            "hc-key": "gw",
            "value": 104
        },
        {
            "hc-key": "hr",
            "value": 105
        },
        {
            "hc-key": "bz",
            "value": 106
        },
        {
            "hc-key": "za",
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
            "hc-key": "pg",
            "value": 113
        },
        {
            "hc-key": "de",
            "value": 114
        },
        {
            "hc-key": "ch",
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
            "hc-key": "kr",
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
            "hc-key": "gq",
            "value": 124
        },
        {
            "hc-key": "ni",
            "value": 125
        },
        {
            "hc-key": "lv",
            "value": 126
        },
        {
            "hc-key": "ug",
            "value": 127
        },
        {
            "hc-key": "mw",
            "value": 128
        },
        {
            "hc-key": "sx",
            "value": 129
        },
        {
            "hc-key": "tm",
            "value": 130
        },
        {
            "hc-key": "zm",
            "value": 131
        },
        {
            "hc-key": "nc",
            "value": 132
        },
        {
            "hc-key": "mr",
            "value": 133
        },
        {
            "hc-key": "dz",
            "value": 134
        },
        {
            "hc-key": "lt",
            "value": 135
        },
        {
            "hc-key": "et",
            "value": 136
        },
        {
            "hc-key": "gh",
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
            "hc-key": "mc",
            "value": 143
        },
        {
            "hc-key": "al",
            "value": 144
        },
        {
            "hc-key": "uy",
            "value": 145
        },
        {
            "hc-key": "cnm",
            "value": 146
        },
        {
            "hc-key": "mn",
            "value": 147
        },
        {
            "hc-key": "rw",
            "value": 148
        },
        {
            "hc-key": "so",
            "value": 149
        },
        {
            "hc-key": "bo",
            "value": 150
        },
        {
            "hc-key": "cm",
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
            "hc-key": "ua",
            "value": 159
        },
        {
            "hc-key": "sk",
            "value": 160
        },
        {
            "hc-key": "jk",
            "value": 161
        },
        {
            "hc-key": "bg",
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
            "hc-key": "be",
            "value": 175
        },
        {
            "hc-key": "iq",
            "value": 176
        },
        {
            "hc-key": "ge",
            "value": 177
        },
        {
            "hc-key": "gm",
            "value": 178
        },
        {
            "hc-key": "td",
            "value": 179
        },
        {
            "hc-key": "kv",
            "value": 180
        },
        {
            "hc-key": "lb",
            "value": 181
        },
        {
            "hc-key": "dj",
            "value": 182
        },
        {
            "hc-key": "bi",
            "value": 183
        },
        {
            "hc-key": "sr",
            "value": 184
        },
        {
            "hc-key": "il",
            "value": 185
        },
        {
            "hc-key": "ml",
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
            "hc-key": "pl",
            "value": 190
        },
        {
            "hc-key": "mk",
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
            "hc-key": "cz",
            "value": 194
        },
        {
            "hc-key": "bf",
            "value": 195
        },
        {
            "hc-key": "na",
            "value": 196
        },
        {
            "hc-key": "tn",
            "value": 197
        },
        {
            "hc-key": "bt",
            "value": 198
        },
        {
            "hc-key": "kg",
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
            "hc-key": "bw",
            "value": 202
        },
        {
            "hc-key": "sb",
            "value": 203
        },
        {
            "hc-key": "ve",
            "value": 204
        },
        {
            "hc-key": "nz",
            "value": 205
        },
        {
            "hc-key": "cu",
            "value": 206
        },
        {
            "hc-key": "au",
            "value": 207
        },
        {
            "hc-key": "bs",
            "value": 208
        },
        {
            "hc-key": "mg",
            "value": 209
        },
        {
            "hc-key": "is",
            "value": 210
        },
        {
            "hc-key": "eg",
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
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/custom/world-lowres.js">World, Miller projection, low resolution</a>'
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
            mapData: Highcharts.maps['custom/world-lowres'],
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
