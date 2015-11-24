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
            "hc-key": "fr",
            "value": 2
        },
        {
            "hc-key": "cn",
            "value": 3
        },
        {
            "hc-key": "pt",
            "value": 4
        },
        {
            "hc-key": "sw",
            "value": 5
        },
        {
            "hc-key": "sh",
            "value": 6
        },
        {
            "hc-key": "ec",
            "value": 7
        },
        {
            "hc-key": "ph",
            "value": 8
        },
        {
            "hc-key": "bu",
            "value": 9
        },
        {
            "hc-key": "mv",
            "value": 10
        },
        {
            "hc-key": "sp",
            "value": 11
        },
        {
            "hc-key": "gb",
            "value": 12
        },
        {
            "hc-key": "gr",
            "value": 13
        },
        {
            "hc-key": "dk",
            "value": 14
        },
        {
            "hc-key": "gl",
            "value": 15
        },
        {
            "hc-key": "pr",
            "value": 16
        },
        {
            "hc-key": "um",
            "value": 17
        },
        {
            "hc-key": "vi",
            "value": 18
        },
        {
            "hc-key": "ca",
            "value": 19
        },
        {
            "hc-key": "cl",
            "value": 20
        },
        {
            "hc-key": "cv",
            "value": 21
        },
        {
            "hc-key": "dm",
            "value": 22
        },
        {
            "hc-key": "sc",
            "value": 23
        },
        {
            "hc-key": "jm",
            "value": 24
        },
        {
            "hc-key": "om",
            "value": 25
        },
        {
            "hc-key": "vc",
            "value": 26
        },
        {
            "hc-key": "bd",
            "value": 27
        },
        {
            "hc-key": "sb",
            "value": 28
        },
        {
            "hc-key": "lc",
            "value": 29
        },
        {
            "hc-key": "no",
            "value": 30
        },
        {
            "hc-key": "kn",
            "value": 31
        },
        {
            "hc-key": "bh",
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
            "hc-key": "ru",
            "value": 35
        },
        {
            "hc-key": "tt",
            "value": 36
        },
        {
            "hc-key": "br",
            "value": 37
        },
        {
            "hc-key": "bs",
            "value": 38
        },
        {
            "hc-key": "pw",
            "value": 39
        },
        {
            "hc-key": "ng",
            "value": 40
        },
        {
            "hc-key": "gd",
            "value": 41
        },
        {
            "hc-key": "ag",
            "value": 42
        },
        {
            "hc-key": "tw",
            "value": 43
        },
        {
            "hc-key": "fj",
            "value": 44
        },
        {
            "hc-key": "bb",
            "value": 45
        },
        {
            "hc-key": "it",
            "value": 46
        },
        {
            "hc-key": "mt",
            "value": 47
        },
        {
            "hc-key": "pg",
            "value": 48
        },
        {
            "hc-key": "sg",
            "value": 49
        },
        {
            "hc-key": "cy",
            "value": 50
        },
        {
            "hc-key": "km",
            "value": 51
        },
        {
            "hc-key": "va",
            "value": 52
        },
        {
            "hc-key": "sm",
            "value": 53
        },
        {
            "hc-key": "am",
            "value": 54
        },
        {
            "hc-key": "az",
            "value": 55
        },
        {
            "hc-key": "tj",
            "value": 56
        },
        {
            "hc-key": "ga",
            "value": 57
        },
        {
            "hc-key": "uz",
            "value": 58
        },
        {
            "hc-key": "ls",
            "value": 59
        },
        {
            "hc-key": "in",
            "value": 60
        },
        {
            "hc-key": "kp",
            "value": 61
        },
        {
            "hc-key": "kg",
            "value": 62
        },
        {
            "hc-key": "es",
            "value": 63
        },
        {
            "hc-key": "mx",
            "value": 64
        },
        {
            "hc-key": "ma",
            "value": 65
        },
        {
            "hc-key": "co",
            "value": 66
        },
        {
            "hc-key": "tz",
            "value": 67
        },
        {
            "hc-key": "ar",
            "value": 68
        },
        {
            "hc-key": "sa",
            "value": 69
        },
        {
            "hc-key": "qa",
            "value": 70
        },
        {
            "hc-key": "nl",
            "value": 71
        },
        {
            "hc-key": "ye",
            "value": 72
        },
        {
            "hc-key": "ae",
            "value": 73
        },
        {
            "hc-key": "ke",
            "value": 74
        },
        {
            "hc-key": "tr",
            "value": 75
        },
        {
            "hc-key": "my",
            "value": 76
        },
        {
            "hc-key": "vn",
            "value": 77
        },
        {
            "hc-key": "pa",
            "value": 78
        },
        {
            "hc-key": "ir",
            "value": 79
        },
        {
            "hc-key": "ht",
            "value": 80
        },
        {
            "hc-key": "do",
            "value": 81
        },
        {
            "hc-key": "gw",
            "value": 82
        },
        {
            "hc-key": "hr",
            "value": 83
        },
        {
            "hc-key": "th",
            "value": 84
        },
        {
            "hc-key": "ee",
            "value": 85
        },
        {
            "hc-key": "cd",
            "value": 86
        },
        {
            "hc-key": "kw",
            "value": 87
        },
        {
            "hc-key": "de",
            "value": 88
        },
        {
            "hc-key": "cz",
            "value": 89
        },
        {
            "hc-key": "ie",
            "value": 90
        },
        {
            "hc-key": "mm",
            "value": 91
        },
        {
            "hc-key": "gq",
            "value": 92
        },
        {
            "hc-key": "ug",
            "value": 93
        },
        {
            "hc-key": "kz",
            "value": 94
        },
        {
            "hc-key": "kr",
            "value": 95
        },
        {
            "hc-key": "tl",
            "value": 96
        },
        {
            "hc-key": "mr",
            "value": 97
        },
        {
            "hc-key": "dz",
            "value": 98
        },
        {
            "hc-key": "pe",
            "value": 99
        },
        {
            "hc-key": "ao",
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
            "hc-key": "sv",
            "value": 103
        },
        {
            "hc-key": "gt",
            "value": 104
        },
        {
            "hc-key": "bz",
            "value": 105
        },
        {
            "hc-key": "ve",
            "value": 106
        },
        {
            "hc-key": "gy",
            "value": 107
        },
        {
            "hc-key": "hn",
            "value": 108
        },
        {
            "hc-key": "ni",
            "value": 109
        },
        {
            "hc-key": "mw",
            "value": 110
        },
        {
            "hc-key": "tm",
            "value": 111
        },
        {
            "hc-key": "zm",
            "value": 112
        },
        {
            "hc-key": "nc",
            "value": 113
        },
        {
            "hc-key": "za",
            "value": 114
        },
        {
            "hc-key": "lt",
            "value": 115
        },
        {
            "hc-key": "et",
            "value": 116
        },
        {
            "hc-key": "gh",
            "value": 117
        },
        {
            "hc-key": "si",
            "value": 118
        },
        {
            "hc-key": "ba",
            "value": 119
        },
        {
            "hc-key": "jo",
            "value": 120
        },
        {
            "hc-key": "sy",
            "value": 121
        },
        {
            "hc-key": "mc",
            "value": 122
        },
        {
            "hc-key": "al",
            "value": 123
        },
        {
            "hc-key": "uy",
            "value": 124
        },
        {
            "hc-key": "cnm",
            "value": 125
        },
        {
            "hc-key": "mn",
            "value": 126
        },
        {
            "hc-key": "rw",
            "value": 127
        },
        {
            "hc-key": "bo",
            "value": 128
        },
        {
            "hc-key": "cm",
            "value": 129
        },
        {
            "hc-key": "cg",
            "value": 130
        },
        {
            "hc-key": "eh",
            "value": 131
        },
        {
            "hc-key": "rs",
            "value": 132
        },
        {
            "hc-key": "me",
            "value": 133
        },
        {
            "hc-key": "bj",
            "value": 134
        },
        {
            "hc-key": "tg",
            "value": 135
        },
        {
            "hc-key": "la",
            "value": 136
        },
        {
            "hc-key": "af",
            "value": 137
        },
        {
            "hc-key": "ua",
            "value": 138
        },
        {
            "hc-key": "sk",
            "value": 139
        },
        {
            "hc-key": "jk",
            "value": 140
        },
        {
            "hc-key": "pk",
            "value": 141
        },
        {
            "hc-key": "bg",
            "value": 142
        },
        {
            "hc-key": "li",
            "value": 143
        },
        {
            "hc-key": "at",
            "value": 144
        },
        {
            "hc-key": "sz",
            "value": 145
        },
        {
            "hc-key": "hu",
            "value": 146
        },
        {
            "hc-key": "ne",
            "value": 147
        },
        {
            "hc-key": "lu",
            "value": 148
        },
        {
            "hc-key": "ad",
            "value": 149
        },
        {
            "hc-key": "ci",
            "value": 150
        },
        {
            "hc-key": "lr",
            "value": 151
        },
        {
            "hc-key": "sl",
            "value": 152
        },
        {
            "hc-key": "bn",
            "value": 153
        },
        {
            "hc-key": "be",
            "value": 154
        },
        {
            "hc-key": "iq",
            "value": 155
        },
        {
            "hc-key": "ge",
            "value": 156
        },
        {
            "hc-key": "gm",
            "value": 157
        },
        {
            "hc-key": "ch",
            "value": 158
        },
        {
            "hc-key": "td",
            "value": 159
        },
        {
            "hc-key": "kv",
            "value": 160
        },
        {
            "hc-key": "lb",
            "value": 161
        },
        {
            "hc-key": "sx",
            "value": 162
        },
        {
            "hc-key": "so",
            "value": 163
        },
        {
            "hc-key": "dj",
            "value": 164
        },
        {
            "hc-key": "er",
            "value": 165
        },
        {
            "hc-key": "bi",
            "value": 166
        },
        {
            "hc-key": "sr",
            "value": 167
        },
        {
            "hc-key": "il",
            "value": 168
        },
        {
            "hc-key": "sn",
            "value": 169
        },
        {
            "hc-key": "gn",
            "value": 170
        },
        {
            "hc-key": "pl",
            "value": 171
        },
        {
            "hc-key": "mk",
            "value": 172
        },
        {
            "hc-key": "py",
            "value": 173
        },
        {
            "hc-key": "by",
            "value": 174
        },
        {
            "hc-key": "lv",
            "value": 175
        },
        {
            "hc-key": "bf",
            "value": 176
        },
        {
            "hc-key": "ss",
            "value": 177
        },
        {
            "hc-key": "cf",
            "value": 178
        },
        {
            "hc-key": "na",
            "value": 179
        },
        {
            "hc-key": "ro",
            "value": 180
        },
        {
            "hc-key": "zw",
            "value": 181
        },
        {
            "hc-key": "kh",
            "value": 182
        },
        {
            "hc-key": "sd",
            "value": 183
        },
        {
            "hc-key": "tn",
            "value": 184
        },
        {
            "hc-key": "ly",
            "value": 185
        },
        {
            "hc-key": "ml",
            "value": 186
        },
        {
            "hc-key": "bt",
            "value": 187
        },
        {
            "hc-key": "bw",
            "value": 188
        },
        {
            "hc-key": "md",
            "value": 189
        },
        {
            "hc-key": "jp",
            "value": 190
        },
        {
            "hc-key": "au",
            "value": 191
        },
        {
            "hc-key": "nz",
            "value": 192
        },
        {
            "hc-key": "cu",
            "value": 193
        },
        {
            "hc-key": "fi",
            "value": 194
        },
        {
            "hc-key": "se",
            "value": 195
        },
        {
            "hc-key": "mg",
            "value": 196
        },
        {
            "hc-key": "vu",
            "value": 197
        },
        {
            "hc-key": "is",
            "value": 198
        },
        {
            "hc-key": "lk",
            "value": 199
        },
        {
            "hc-key": "eg",
            "value": 200
        },
        {
            "hc-key": "np",
            "value": 201
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/custom/world-robinson-lowres.js">World, Robinson projection, low resolution</a>'
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
            mapData: Highcharts.maps['custom/world-robinson-lowres'],
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
