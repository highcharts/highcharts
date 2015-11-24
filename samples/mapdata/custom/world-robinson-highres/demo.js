$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "fo",
            "value": 0
        },
        {
            "hc-key": "us",
            "value": 1
        },
        {
            "hc-key": "jp",
            "value": 2
        },
        {
            "hc-key": "in",
            "value": 3
        },
        {
            "hc-key": "kr",
            "value": 4
        },
        {
            "hc-key": "fr",
            "value": 5
        },
        {
            "hc-key": "cn",
            "value": 6
        },
        {
            "hc-key": "sw",
            "value": 7
        },
        {
            "hc-key": "sh",
            "value": 8
        },
        {
            "hc-key": "ec",
            "value": 9
        },
        {
            "hc-key": "au",
            "value": 10
        },
        {
            "hc-key": "ph",
            "value": 11
        },
        {
            "hc-key": "es",
            "value": 12
        },
        {
            "hc-key": "bu",
            "value": 13
        },
        {
            "hc-key": "mv",
            "value": 14
        },
        {
            "hc-key": "sp",
            "value": 15
        },
        {
            "hc-key": "ve",
            "value": 16
        },
        {
            "hc-key": "gb",
            "value": 17
        },
        {
            "hc-key": "gr",
            "value": 18
        },
        {
            "hc-key": "dk",
            "value": 19
        },
        {
            "hc-key": "gl",
            "value": 20
        },
        {
            "hc-key": "pr",
            "value": 21
        },
        {
            "hc-key": "um",
            "value": 22
        },
        {
            "hc-key": "vi",
            "value": 23
        },
        {
            "hc-key": "ca",
            "value": 24
        },
        {
            "hc-key": "tz",
            "value": 25
        },
        {
            "hc-key": "cl",
            "value": 26
        },
        {
            "hc-key": "cv",
            "value": 27
        },
        {
            "hc-key": "dm",
            "value": 28
        },
        {
            "hc-key": "sc",
            "value": 29
        },
        {
            "hc-key": "nz",
            "value": 30
        },
        {
            "hc-key": "ye",
            "value": 31
        },
        {
            "hc-key": "jm",
            "value": 32
        },
        {
            "hc-key": "om",
            "value": 33
        },
        {
            "hc-key": "vc",
            "value": 34
        },
        {
            "hc-key": "bd",
            "value": 35
        },
        {
            "hc-key": "sb",
            "value": 36
        },
        {
            "hc-key": "lc",
            "value": 37
        },
        {
            "hc-key": "no",
            "value": 38
        },
        {
            "hc-key": "cu",
            "value": 39
        },
        {
            "hc-key": "kn",
            "value": 40
        },
        {
            "hc-key": "bh",
            "value": 41
        },
        {
            "hc-key": "fi",
            "value": 42
        },
        {
            "hc-key": "id",
            "value": 43
        },
        {
            "hc-key": "mu",
            "value": 44
        },
        {
            "hc-key": "se",
            "value": 45
        },
        {
            "hc-key": "ru",
            "value": 46
        },
        {
            "hc-key": "tt",
            "value": 47
        },
        {
            "hc-key": "br",
            "value": 48
        },
        {
            "hc-key": "bs",
            "value": 49
        },
        {
            "hc-key": "pw",
            "value": 50
        },
        {
            "hc-key": "ir",
            "value": 51
        },
        {
            "hc-key": "gw",
            "value": 52
        },
        {
            "hc-key": "gd",
            "value": 53
        },
        {
            "hc-key": "ee",
            "value": 54
        },
        {
            "hc-key": "ag",
            "value": 55
        },
        {
            "hc-key": "fj",
            "value": 56
        },
        {
            "hc-key": "bb",
            "value": 57
        },
        {
            "hc-key": "it",
            "value": 58
        },
        {
            "hc-key": "mt",
            "value": 59
        },
        {
            "hc-key": "pg",
            "value": 60
        },
        {
            "hc-key": "de",
            "value": 61
        },
        {
            "hc-key": "vu",
            "value": 62
        },
        {
            "hc-key": "gq",
            "value": 63
        },
        {
            "hc-key": "cy",
            "value": 64
        },
        {
            "hc-key": "km",
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
            "hc-key": "tj",
            "value": 70
        },
        {
            "hc-key": "uz",
            "value": 71
        },
        {
            "hc-key": "ls",
            "value": 72
        },
        {
            "hc-key": "kg",
            "value": 73
        },
        {
            "hc-key": "kp",
            "value": 74
        },
        {
            "hc-key": "pt",
            "value": 75
        },
        {
            "hc-key": "mx",
            "value": 76
        },
        {
            "hc-key": "ma",
            "value": 77
        },
        {
            "hc-key": "co",
            "value": 78
        },
        {
            "hc-key": "ar",
            "value": 79
        },
        {
            "hc-key": "sa",
            "value": 80
        },
        {
            "hc-key": "qa",
            "value": 81
        },
        {
            "hc-key": "nl",
            "value": 82
        },
        {
            "hc-key": "ae",
            "value": 83
        },
        {
            "hc-key": "ke",
            "value": 84
        },
        {
            "hc-key": "my",
            "value": 85
        },
        {
            "hc-key": "pa",
            "value": 86
        },
        {
            "hc-key": "ht",
            "value": 87
        },
        {
            "hc-key": "do",
            "value": 88
        },
        {
            "hc-key": "hr",
            "value": 89
        },
        {
            "hc-key": "th",
            "value": 90
        },
        {
            "hc-key": "cd",
            "value": 91
        },
        {
            "hc-key": "kw",
            "value": 92
        },
        {
            "hc-key": "ie",
            "value": 93
        },
        {
            "hc-key": "mm",
            "value": 94
        },
        {
            "hc-key": "ug",
            "value": 95
        },
        {
            "hc-key": "kz",
            "value": 96
        },
        {
            "hc-key": "tr",
            "value": 97
        },
        {
            "hc-key": "ga",
            "value": 98
        },
        {
            "hc-key": "tl",
            "value": 99
        },
        {
            "hc-key": "mr",
            "value": 100
        },
        {
            "hc-key": "dz",
            "value": 101
        },
        {
            "hc-key": "pe",
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
            "hc-key": "cr",
            "value": 105
        },
        {
            "hc-key": "sv",
            "value": 106
        },
        {
            "hc-key": "gt",
            "value": 107
        },
        {
            "hc-key": "bz",
            "value": 108
        },
        {
            "hc-key": "gy",
            "value": 109
        },
        {
            "hc-key": "hn",
            "value": 110
        },
        {
            "hc-key": "ni",
            "value": 111
        },
        {
            "hc-key": "mw",
            "value": 112
        },
        {
            "hc-key": "tm",
            "value": 113
        },
        {
            "hc-key": "zm",
            "value": 114
        },
        {
            "hc-key": "nc",
            "value": 115
        },
        {
            "hc-key": "za",
            "value": 116
        },
        {
            "hc-key": "lt",
            "value": 117
        },
        {
            "hc-key": "et",
            "value": 118
        },
        {
            "hc-key": "so",
            "value": 119
        },
        {
            "hc-key": "gh",
            "value": 120
        },
        {
            "hc-key": "si",
            "value": 121
        },
        {
            "hc-key": "ba",
            "value": 122
        },
        {
            "hc-key": "jo",
            "value": 123
        },
        {
            "hc-key": "sy",
            "value": 124
        },
        {
            "hc-key": "mc",
            "value": 125
        },
        {
            "hc-key": "al",
            "value": 126
        },
        {
            "hc-key": "uy",
            "value": 127
        },
        {
            "hc-key": "cnm",
            "value": 128
        },
        {
            "hc-key": "mn",
            "value": 129
        },
        {
            "hc-key": "rw",
            "value": 130
        },
        {
            "hc-key": "bo",
            "value": 131
        },
        {
            "hc-key": "cm",
            "value": 132
        },
        {
            "hc-key": "cg",
            "value": 133
        },
        {
            "hc-key": "eh",
            "value": 134
        },
        {
            "hc-key": "rs",
            "value": 135
        },
        {
            "hc-key": "me",
            "value": 136
        },
        {
            "hc-key": "bj",
            "value": 137
        },
        {
            "hc-key": "tg",
            "value": 138
        },
        {
            "hc-key": "la",
            "value": 139
        },
        {
            "hc-key": "af",
            "value": 140
        },
        {
            "hc-key": "ua",
            "value": 141
        },
        {
            "hc-key": "sk",
            "value": 142
        },
        {
            "hc-key": "jk",
            "value": 143
        },
        {
            "hc-key": "pk",
            "value": 144
        },
        {
            "hc-key": "bg",
            "value": 145
        },
        {
            "hc-key": "li",
            "value": 146
        },
        {
            "hc-key": "at",
            "value": 147
        },
        {
            "hc-key": "sz",
            "value": 148
        },
        {
            "hc-key": "hu",
            "value": 149
        },
        {
            "hc-key": "ne",
            "value": 150
        },
        {
            "hc-key": "lu",
            "value": 151
        },
        {
            "hc-key": "ad",
            "value": 152
        },
        {
            "hc-key": "ci",
            "value": 153
        },
        {
            "hc-key": "lr",
            "value": 154
        },
        {
            "hc-key": "sl",
            "value": 155
        },
        {
            "hc-key": "bn",
            "value": 156
        },
        {
            "hc-key": "be",
            "value": 157
        },
        {
            "hc-key": "iq",
            "value": 158
        },
        {
            "hc-key": "ge",
            "value": 159
        },
        {
            "hc-key": "gm",
            "value": 160
        },
        {
            "hc-key": "ch",
            "value": 161
        },
        {
            "hc-key": "td",
            "value": 162
        },
        {
            "hc-key": "ng",
            "value": 163
        },
        {
            "hc-key": "kv",
            "value": 164
        },
        {
            "hc-key": "lb",
            "value": 165
        },
        {
            "hc-key": "sx",
            "value": 166
        },
        {
            "hc-key": "dj",
            "value": 167
        },
        {
            "hc-key": "er",
            "value": 168
        },
        {
            "hc-key": "bi",
            "value": 169
        },
        {
            "hc-key": "sr",
            "value": 170
        },
        {
            "hc-key": "il",
            "value": 171
        },
        {
            "hc-key": "sn",
            "value": 172
        },
        {
            "hc-key": "gn",
            "value": 173
        },
        {
            "hc-key": "pl",
            "value": 174
        },
        {
            "hc-key": "mk",
            "value": 175
        },
        {
            "hc-key": "py",
            "value": 176
        },
        {
            "hc-key": "by",
            "value": 177
        },
        {
            "hc-key": "lv",
            "value": 178
        },
        {
            "hc-key": "bf",
            "value": 179
        },
        {
            "hc-key": "ss",
            "value": 180
        },
        {
            "hc-key": "na",
            "value": 181
        },
        {
            "hc-key": "ro",
            "value": 182
        },
        {
            "hc-key": "zw",
            "value": 183
        },
        {
            "hc-key": "kh",
            "value": 184
        },
        {
            "hc-key": "sd",
            "value": 185
        },
        {
            "hc-key": "cz",
            "value": 186
        },
        {
            "hc-key": "ly",
            "value": 187
        },
        {
            "hc-key": "md",
            "value": 188
        },
        {
            "hc-key": "cf",
            "value": 189
        },
        {
            "hc-key": "sg",
            "value": 190
        },
        {
            "hc-key": "vn",
            "value": 191
        },
        {
            "hc-key": "tn",
            "value": 192
        },
        {
            "hc-key": "tw",
            "value": 193
        },
        {
            "hc-key": "mg",
            "value": 194
        },
        {
            "hc-key": "is",
            "value": 195
        },
        {
            "hc-key": "lk",
            "value": 196
        },
        {
            "hc-key": "eg",
            "value": 197
        },
        {
            "hc-key": "ml",
            "value": 198
        },
        {
            "hc-key": "bw",
            "value": 199
        },
        {
            "hc-key": "np",
            "value": 200
        },
        {
            "hc-key": "bt",
            "value": 201
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/custom/world-robinson-highres.js">World, Robinson projection, high resolution</a>'
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
            mapData: Highcharts.maps['custom/world-robinson-highres'],
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
