$(function () {

    // Prepare demo data
    var data = [
        {
            "hc-key": "dk",
            "value": 0
        },
        {
            "hc-key": "fo",
            "value": 1
        },
        {
            "hc-key": "gl",
            "value": 2
        },
        {
            "hc-key": "pr",
            "value": 3
        },
        {
            "hc-key": "um",
            "value": 4
        },
        {
            "hc-key": "us",
            "value": 5
        },
        {
            "hc-key": "vi",
            "value": 6
        },
        {
            "hc-key": "ca",
            "value": 7
        },
        {
            "hc-key": "st",
            "value": 8
        },
        {
            "hc-key": "jp",
            "value": 9
        },
        {
            "hc-key": "dm",
            "value": 10
        },
        {
            "hc-key": "ga",
            "value": 11
        },
        {
            "hc-key": "jm",
            "value": 12
        },
        {
            "hc-key": "om",
            "value": 13
        },
        {
            "hc-key": "in",
            "value": 14
        },
        {
            "hc-key": "vc",
            "value": 15
        },
        {
            "hc-key": "bd",
            "value": 16
        },
        {
            "hc-key": "sb",
            "value": 17
        },
        {
            "hc-key": "lc",
            "value": 18
        },
        {
            "hc-key": "fr",
            "value": 19
        },
        {
            "hc-key": "no",
            "value": 20
        },
        {
            "hc-key": "kn",
            "value": 21
        },
        {
            "hc-key": "cn",
            "value": 22
        },
        {
            "hc-key": "bh",
            "value": 23
        },
        {
            "hc-key": "id",
            "value": 24
        },
        {
            "hc-key": "mu",
            "value": 25
        },
        {
            "hc-key": "ru",
            "value": 26
        },
        {
            "hc-key": "pt",
            "value": 27
        },
        {
            "hc-key": "tt",
            "value": 28
        },
        {
            "hc-key": "ser",
            "value": 29
        },
        {
            "hc-key": "scr",
            "value": 30
        },
        {
            "hc-key": "my",
            "value": 31
        },
        {
            "hc-key": "ug",
            "value": 32
        },
        {
            "hc-key": "br",
            "value": 33
        },
        {
            "hc-key": "bs",
            "value": 34
        },
        {
            "hc-key": "pw",
            "value": 35
        },
        {
            "hc-key": "ec",
            "value": 36
        },
        {
            "hc-key": "au",
            "value": 37
        },
        {
            "hc-key": "cl",
            "value": 38
        },
        {
            "hc-key": "ph",
            "value": 39
        },
        {
            "hc-key": "gd",
            "value": 40
        },
        {
            "hc-key": "ee",
            "value": 41
        },
        {
            "hc-key": "ag",
            "value": 42
        },
        {
            "hc-key": "es",
            "value": 43
        },
        {
            "hc-key": "tw",
            "value": 44
        },
        {
            "hc-key": "fj",
            "value": 45
        },
        {
            "hc-key": "bb",
            "value": 46
        },
        {
            "hc-key": "it",
            "value": 47
        },
        {
            "hc-key": "bjn",
            "value": 48
        },
        {
            "hc-key": "mt",
            "value": 49
        },
        {
            "hc-key": "pga",
            "value": 50
        },
        {
            "hc-key": "pg",
            "value": 51
        },
        {
            "hc-key": "vu",
            "value": 52
        },
        {
            "hc-key": "gb",
            "value": 53
        },
        {
            "hc-key": "cy",
            "value": 54
        },
        {
            "hc-key": "gr",
            "value": 55
        },
        {
            "hc-key": "km",
            "value": 56
        },
        {
            "hc-key": "az",
            "value": 57
        },
        {
            "hc-key": "sm",
            "value": 58
        },
        {
            "hc-key": "va",
            "value": 59
        },
        {
            "hc-key": "tj",
            "value": 60
        },
        {
            "hc-key": "tr",
            "value": 61
        },
        {
            "hc-key": "bg",
            "value": 62
        },
        {
            "hc-key": "np",
            "value": 63
        },
        {
            "hc-key": "ls",
            "value": 64
        },
        {
            "hc-key": "uz",
            "value": 65
        },
        {
            "hc-key": "tl",
            "value": 66
        },
        {
            "hc-key": "tm",
            "value": 67
        },
        {
            "hc-key": "tz",
            "value": 68
        },
        {
            "hc-key": "kh",
            "value": 69
        },
        {
            "hc-key": "ar",
            "value": 70
        },
        {
            "hc-key": "sa",
            "value": 71
        },
        {
            "hc-key": "nl",
            "value": 72
        },
        {
            "hc-key": "ye",
            "value": 73
        },
        {
            "hc-key": "ae",
            "value": 74
        },
        {
            "hc-key": "ss",
            "value": 75
        },
        {
            "hc-key": "ke",
            "value": 76
        },
        {
            "hc-key": "dz",
            "value": 77
        },
        {
            "hc-key": "mr",
            "value": 78
        },
        {
            "hc-key": "ch",
            "value": 79
        },
        {
            "hc-key": "pe",
            "value": 80
        },
        {
            "hc-key": "mw",
            "value": 81
        },
        {
            "hc-key": "do",
            "value": 82
        },
        {
            "hc-key": "ht",
            "value": 83
        },
        {
            "hc-key": "fi",
            "value": 84
        },
        {
            "hc-key": "se",
            "value": 85
        },
        {
            "hc-key": "ao",
            "value": 86
        },
        {
            "hc-key": "vn",
            "value": 87
        },
        {
            "hc-key": "mz",
            "value": 88
        },
        {
            "hc-key": "cr",
            "value": 89
        },
        {
            "hc-key": "pa",
            "value": 90
        },
        {
            "hc-key": "bj",
            "value": 91
        },
        {
            "hc-key": "ng",
            "value": 92
        },
        {
            "hc-key": "cm",
            "value": 93
        },
        {
            "hc-key": "ir",
            "value": 94
        },
        {
            "hc-key": "sv",
            "value": 95
        },
        {
            "hc-key": "gw",
            "value": 96
        },
        {
            "hc-key": "hr",
            "value": 97
        },
        {
            "hc-key": "th",
            "value": 98
        },
        {
            "hc-key": "bz",
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
            "hc-key": "ma",
            "value": 102
        },
        {
            "hc-key": "co",
            "value": 103
        },
        {
            "hc-key": "cd",
            "value": 104
        },
        {
            "hc-key": "kw",
            "value": 105
        },
        {
            "hc-key": "iq",
            "value": 106
        },
        {
            "hc-key": "de",
            "value": 107
        },
        {
            "hc-key": "kz",
            "value": 108
        },
        {
            "hc-key": "sd",
            "value": 109
        },
        {
            "hc-key": "er",
            "value": 110
        },
        {
            "hc-key": "kp",
            "value": 111
        },
        {
            "hc-key": "ve",
            "value": 112
        },
        {
            "hc-key": "gy",
            "value": 113
        },
        {
            "hc-key": "ni",
            "value": 114
        },
        {
            "hc-key": "hn",
            "value": 115
        },
        {
            "hc-key": "mm",
            "value": 116
        },
        {
            "hc-key": "gq",
            "value": 117
        },
        {
            "hc-key": "cyn",
            "value": 118
        },
        {
            "hc-key": "ie",
            "value": 119
        },
        {
            "hc-key": "am",
            "value": 120
        },
        {
            "hc-key": "sol",
            "value": 121
        },
        {
            "hc-key": "pk",
            "value": 122
        },
        {
            "hc-key": "za",
            "value": 123
        },
        {
            "hc-key": "lt",
            "value": 124
        },
        {
            "hc-key": "et",
            "value": 125
        },
        {
            "hc-key": "gh",
            "value": 126
        },
        {
            "hc-key": "si",
            "value": 127
        },
        {
            "hc-key": "gt",
            "value": 128
        },
        {
            "hc-key": "ba",
            "value": 129
        },
        {
            "hc-key": "jo",
            "value": 130
        },
        {
            "hc-key": "sy",
            "value": 131
        },
        {
            "hc-key": "zm",
            "value": 132
        },
        {
            "hc-key": "mc",
            "value": 133
        },
        {
            "hc-key": "al",
            "value": 134
        },
        {
            "hc-key": "uy",
            "value": 135
        },
        {
            "hc-key": "cnm",
            "value": 136
        },
        {
            "hc-key": "mn",
            "value": 137
        },
        {
            "hc-key": "rw",
            "value": 138
        },
        {
            "hc-key": "bo",
            "value": 139
        },
        {
            "hc-key": "cg",
            "value": 140
        },
        {
            "hc-key": "eh",
            "value": 141
        },
        {
            "hc-key": "rs",
            "value": 142
        },
        {
            "hc-key": "ua",
            "value": 143
        },
        {
            "hc-key": "ro",
            "value": 144
        },
        {
            "hc-key": "me",
            "value": 145
        },
        {
            "hc-key": "tg",
            "value": 146
        },
        {
            "hc-key": "la",
            "value": 147
        },
        {
            "hc-key": "af",
            "value": 148
        },
        {
            "hc-key": "sk",
            "value": 149
        },
        {
            "hc-key": "kas",
            "value": 150
        },
        {
            "hc-key": "qa",
            "value": 151
        },
        {
            "hc-key": "li",
            "value": 152
        },
        {
            "hc-key": "at",
            "value": 153
        },
        {
            "hc-key": "sz",
            "value": 154
        },
        {
            "hc-key": "hu",
            "value": 155
        },
        {
            "hc-key": "ne",
            "value": 156
        },
        {
            "hc-key": "ly",
            "value": 157
        },
        {
            "hc-key": "lu",
            "value": 158
        },
        {
            "hc-key": "ad",
            "value": 159
        },
        {
            "hc-key": "lr",
            "value": 160
        },
        {
            "hc-key": "sl",
            "value": 161
        },
        {
            "hc-key": "bn",
            "value": 162
        },
        {
            "hc-key": "be",
            "value": 163
        },
        {
            "hc-key": "ge",
            "value": 164
        },
        {
            "hc-key": "gm",
            "value": 165
        },
        {
            "hc-key": "td",
            "value": 166
        },
        {
            "hc-key": "kv",
            "value": 167
        },
        {
            "hc-key": "lb",
            "value": 168
        },
        {
            "hc-key": "dj",
            "value": 169
        },
        {
            "hc-key": "bi",
            "value": 170
        },
        {
            "hc-key": "sr",
            "value": 171
        },
        {
            "hc-key": "il",
            "value": 172
        },
        {
            "hc-key": "eg",
            "value": 173
        },
        {
            "hc-key": "sn",
            "value": 174
        },
        {
            "hc-key": "gn",
            "value": 175
        },
        {
            "hc-key": "zw",
            "value": 176
        },
        {
            "hc-key": "pl",
            "value": 177
        },
        {
            "hc-key": "mk",
            "value": 178
        },
        {
            "hc-key": "py",
            "value": 179
        },
        {
            "hc-key": "by",
            "value": 180
        },
        {
            "hc-key": "lv",
            "value": 181
        },
        {
            "hc-key": "bt",
            "value": 182
        },
        {
            "hc-key": "cz",
            "value": 183
        },
        {
            "hc-key": "bf",
            "value": 184
        },
        {
            "hc-key": "sg",
            "value": 185
        },
        {
            "hc-key": "ml",
            "value": 186
        },
        {
            "hc-key": "na",
            "value": 187
        },
        {
            "hc-key": "md",
            "value": 188
        },
        {
            "hc-key": "kg",
            "value": 189
        },
        {
            "hc-key": "cf",
            "value": 190
        },
        {
            "hc-key": "cu",
            "value": 191
        },
        {
            "hc-key": "kr",
            "value": 192
        },
        {
            "hc-key": "nz",
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
            "hc-key": "so",
            "value": 197
        },
        {
            "hc-key": "bw",
            "value": 198
        },
        {
            "hc-key": "ci",
            "value": 199
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/custom/world-robinson-highres.js">World, Robinson projection, highres</a>'
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
