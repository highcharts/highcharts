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
            "hc-key": "cv",
            "value": 26
        },
        {
            "hc-key": "dm",
            "value": 27
        },
        {
            "hc-key": "sc",
            "value": 28
        },
        {
            "hc-key": "nz",
            "value": 29
        },
        {
            "hc-key": "ye",
            "value": 30
        },
        {
            "hc-key": "jm",
            "value": 31
        },
        {
            "hc-key": "om",
            "value": 32
        },
        {
            "hc-key": "vc",
            "value": 33
        },
        {
            "hc-key": "bd",
            "value": 34
        },
        {
            "hc-key": "sb",
            "value": 35
        },
        {
            "hc-key": "lc",
            "value": 36
        },
        {
            "hc-key": "no",
            "value": 37
        },
        {
            "hc-key": "cu",
            "value": 38
        },
        {
            "hc-key": "kn",
            "value": 39
        },
        {
            "hc-key": "bh",
            "value": 40
        },
        {
            "hc-key": "fi",
            "value": 41
        },
        {
            "hc-key": "id",
            "value": 42
        },
        {
            "hc-key": "mu",
            "value": 43
        },
        {
            "hc-key": "se",
            "value": 44
        },
        {
            "hc-key": "ru",
            "value": 45
        },
        {
            "hc-key": "tt",
            "value": 46
        },
        {
            "hc-key": "br",
            "value": 47
        },
        {
            "hc-key": "bs",
            "value": 48
        },
        {
            "hc-key": "pw",
            "value": 49
        },
        {
            "hc-key": "ir",
            "value": 50
        },
        {
            "hc-key": "cl",
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
            "hc-key": "tw",
            "value": 56
        },
        {
            "hc-key": "fj",
            "value": 57
        },
        {
            "hc-key": "bb",
            "value": 58
        },
        {
            "hc-key": "it",
            "value": 59
        },
        {
            "hc-key": "mt",
            "value": 60
        },
        {
            "hc-key": "pg",
            "value": 61
        },
        {
            "hc-key": "de",
            "value": 62
        },
        {
            "hc-key": "vu",
            "value": 63
        },
        {
            "hc-key": "gq",
            "value": 64
        },
        {
            "hc-key": "cy",
            "value": 65
        },
        {
            "hc-key": "km",
            "value": 66
        },
        {
            "hc-key": "va",
            "value": 67
        },
        {
            "hc-key": "sm",
            "value": 68
        },
        {
            "hc-key": "az",
            "value": 69
        },
        {
            "hc-key": "am",
            "value": 70
        },
        {
            "hc-key": "sd",
            "value": 71
        },
        {
            "hc-key": "ly",
            "value": 72
        },
        {
            "hc-key": "tj",
            "value": 73
        },
        {
            "hc-key": "ls",
            "value": 74
        },
        {
            "hc-key": "uz",
            "value": 75
        },
        {
            "hc-key": "pt",
            "value": 76
        },
        {
            "hc-key": "mx",
            "value": 77
        },
        {
            "hc-key": "ma",
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
            "hc-key": "nl",
            "value": 81
        },
        {
            "hc-key": "ae",
            "value": 82
        },
        {
            "hc-key": "ke",
            "value": 83
        },
        {
            "hc-key": "my",
            "value": 84
        },
        {
            "hc-key": "ht",
            "value": 85
        },
        {
            "hc-key": "do",
            "value": 86
        },
        {
            "hc-key": "hr",
            "value": 87
        },
        {
            "hc-key": "th",
            "value": 88
        },
        {
            "hc-key": "cd",
            "value": 89
        },
        {
            "hc-key": "kw",
            "value": 90
        },
        {
            "hc-key": "ie",
            "value": 91
        },
        {
            "hc-key": "mm",
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
            "hc-key": "tr",
            "value": 95
        },
        {
            "hc-key": "er",
            "value": 96
        },
        {
            "hc-key": "tl",
            "value": 97
        },
        {
            "hc-key": "mr",
            "value": 98
        },
        {
            "hc-key": "dz",
            "value": 99
        },
        {
            "hc-key": "pe",
            "value": 100
        },
        {
            "hc-key": "ao",
            "value": 101
        },
        {
            "hc-key": "mz",
            "value": 102
        },
        {
            "hc-key": "cr",
            "value": 103
        },
        {
            "hc-key": "pa",
            "value": 104
        },
        {
            "hc-key": "sv",
            "value": 105
        },
        {
            "hc-key": "kh",
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
            "hc-key": "kp",
            "value": 109
        },
        {
            "hc-key": "gy",
            "value": 110
        },
        {
            "hc-key": "hn",
            "value": 111
        },
        {
            "hc-key": "il",
            "value": 112
        },
        {
            "hc-key": "ni",
            "value": 113
        },
        {
            "hc-key": "mw",
            "value": 114
        },
        {
            "hc-key": "tm",
            "value": 115
        },
        {
            "hc-key": "zm",
            "value": 116
        },
        {
            "hc-key": "nc",
            "value": 117
        },
        {
            "hc-key": "za",
            "value": 118
        },
        {
            "hc-key": "lt",
            "value": 119
        },
        {
            "hc-key": "et",
            "value": 120
        },
        {
            "hc-key": "gh",
            "value": 121
        },
        {
            "hc-key": "si",
            "value": 122
        },
        {
            "hc-key": "ba",
            "value": 123
        },
        {
            "hc-key": "jo",
            "value": 124
        },
        {
            "hc-key": "sy",
            "value": 125
        },
        {
            "hc-key": "mc",
            "value": 126
        },
        {
            "hc-key": "al",
            "value": 127
        },
        {
            "hc-key": "uy",
            "value": 128
        },
        {
            "hc-key": "cnm",
            "value": 129
        },
        {
            "hc-key": "mn",
            "value": 130
        },
        {
            "hc-key": "rw",
            "value": 131
        },
        {
            "hc-key": "sx",
            "value": 132
        },
        {
            "hc-key": "bo",
            "value": 133
        },
        {
            "hc-key": "ga",
            "value": 134
        },
        {
            "hc-key": "cm",
            "value": 135
        },
        {
            "hc-key": "cg",
            "value": 136
        },
        {
            "hc-key": "eh",
            "value": 137
        },
        {
            "hc-key": "me",
            "value": 138
        },
        {
            "hc-key": "rs",
            "value": 139
        },
        {
            "hc-key": "bj",
            "value": 140
        },
        {
            "hc-key": "tg",
            "value": 141
        },
        {
            "hc-key": "af",
            "value": 142
        },
        {
            "hc-key": "ua",
            "value": 143
        },
        {
            "hc-key": "sk",
            "value": 144
        },
        {
            "hc-key": "jk",
            "value": 145
        },
        {
            "hc-key": "pk",
            "value": 146
        },
        {
            "hc-key": "bg",
            "value": 147
        },
        {
            "hc-key": "ro",
            "value": 148
        },
        {
            "hc-key": "qa",
            "value": 149
        },
        {
            "hc-key": "li",
            "value": 150
        },
        {
            "hc-key": "at",
            "value": 151
        },
        {
            "hc-key": "sz",
            "value": 152
        },
        {
            "hc-key": "hu",
            "value": 153
        },
        {
            "hc-key": "ne",
            "value": 154
        },
        {
            "hc-key": "lu",
            "value": 155
        },
        {
            "hc-key": "ad",
            "value": 156
        },
        {
            "hc-key": "ci",
            "value": 157
        },
        {
            "hc-key": "sl",
            "value": 158
        },
        {
            "hc-key": "lr",
            "value": 159
        },
        {
            "hc-key": "bn",
            "value": 160
        },
        {
            "hc-key": "be",
            "value": 161
        },
        {
            "hc-key": "iq",
            "value": 162
        },
        {
            "hc-key": "ge",
            "value": 163
        },
        {
            "hc-key": "gm",
            "value": 164
        },
        {
            "hc-key": "ch",
            "value": 165
        },
        {
            "hc-key": "td",
            "value": 166
        },
        {
            "hc-key": "ng",
            "value": 167
        },
        {
            "hc-key": "kv",
            "value": 168
        },
        {
            "hc-key": "lb",
            "value": 169
        },
        {
            "hc-key": "dj",
            "value": 170
        },
        {
            "hc-key": "bi",
            "value": 171
        },
        {
            "hc-key": "sr",
            "value": 172
        },
        {
            "hc-key": "sn",
            "value": 173
        },
        {
            "hc-key": "gn",
            "value": 174
        },
        {
            "hc-key": "zw",
            "value": 175
        },
        {
            "hc-key": "pl",
            "value": 176
        },
        {
            "hc-key": "mk",
            "value": 177
        },
        {
            "hc-key": "py",
            "value": 178
        },
        {
            "hc-key": "by",
            "value": 179
        },
        {
            "hc-key": "lv",
            "value": 180
        },
        {
            "hc-key": "bf",
            "value": 181
        },
        {
            "hc-key": "ss",
            "value": 182
        },
        {
            "hc-key": "na",
            "value": 183
        },
        {
            "hc-key": "la",
            "value": 184
        },
        {
            "hc-key": "co",
            "value": 185
        },
        {
            "hc-key": "ml",
            "value": 186
        },
        {
            "hc-key": "cz",
            "value": 187
        },
        {
            "hc-key": "cf",
            "value": 188
        },
        {
            "hc-key": "sg",
            "value": 189
        },
        {
            "hc-key": "vn",
            "value": 190
        },
        {
            "hc-key": "tn",
            "value": 191
        },
        {
            "hc-key": "mg",
            "value": 192
        },
        {
            "hc-key": "eg",
            "value": 193
        },
        {
            "hc-key": "so",
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
            "hc-key": "np",
            "value": 197
        },
        {
            "hc-key": "kg",
            "value": 198
        },
        {
            "hc-key": "md",
            "value": 199
        },
        {
            "hc-key": "bt",
            "value": 200
        },
        {
            "hc-key": "bw",
            "value": 201
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/custom/world-eckert3-highres.js">World, Eckert III projection, high resolution</a>'
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
            mapData: Highcharts.maps['custom/world-eckert3-highres'],
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
