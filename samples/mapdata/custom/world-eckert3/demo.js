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
            "hc-key": "dm",
            "value": 9
        },
        {
            "hc-key": "jm",
            "value": 10
        },
        {
            "hc-key": "om",
            "value": 11
        },
        {
            "hc-key": "in",
            "value": 12
        },
        {
            "hc-key": "vc",
            "value": 13
        },
        {
            "hc-key": "sb",
            "value": 14
        },
        {
            "hc-key": "lc",
            "value": 15
        },
        {
            "hc-key": "fr",
            "value": 16
        },
        {
            "hc-key": "no",
            "value": 17
        },
        {
            "hc-key": "kn",
            "value": 18
        },
        {
            "hc-key": "cn",
            "value": 19
        },
        {
            "hc-key": "bh",
            "value": 20
        },
        {
            "hc-key": "id",
            "value": 21
        },
        {
            "hc-key": "mu",
            "value": 22
        },
        {
            "hc-key": "ru",
            "value": 23
        },
        {
            "hc-key": "tt",
            "value": 24
        },
        {
            "hc-key": "ser",
            "value": 25
        },
        {
            "hc-key": "scr",
            "value": 26
        },
        {
            "hc-key": "my",
            "value": 27
        },
        {
            "hc-key": "ug",
            "value": 28
        },
        {
            "hc-key": "pw",
            "value": 29
        },
        {
            "hc-key": "ec",
            "value": 30
        },
        {
            "hc-key": "cl",
            "value": 31
        },
        {
            "hc-key": "ph",
            "value": 32
        },
        {
            "hc-key": "gd",
            "value": 33
        },
        {
            "hc-key": "ag",
            "value": 34
        },
        {
            "hc-key": "es",
            "value": 35
        },
        {
            "hc-key": "pe",
            "value": 36
        },
        {
            "hc-key": "co",
            "value": 37
        },
        {
            "hc-key": "bb",
            "value": 38
        },
        {
            "hc-key": "it",
            "value": 39
        },
        {
            "hc-key": "bjn",
            "value": 40
        },
        {
            "hc-key": "mt",
            "value": 41
        },
        {
            "hc-key": "pga",
            "value": 42
        },
        {
            "hc-key": "vu",
            "value": 43
        },
        {
            "hc-key": "gy",
            "value": 44
        },
        {
            "hc-key": "hn",
            "value": 45
        },
        {
            "hc-key": "gb",
            "value": 46
        },
        {
            "hc-key": "cy",
            "value": 47
        },
        {
            "hc-key": "gr",
            "value": 48
        },
        {
            "hc-key": "lk",
            "value": 49
        },
        {
            "hc-key": "km",
            "value": 50
        },
        {
            "hc-key": "am",
            "value": 51
        },
        {
            "hc-key": "az",
            "value": 52
        },
        {
            "hc-key": "sm",
            "value": 53
        },
        {
            "hc-key": "va",
            "value": 54
        },
        {
            "hc-key": "tj",
            "value": 55
        },
        {
            "hc-key": "tr",
            "value": 56
        },
        {
            "hc-key": "bg",
            "value": 57
        },
        {
            "hc-key": "pk",
            "value": 58
        },
        {
            "hc-key": "af",
            "value": 59
        },
        {
            "hc-key": "ir",
            "value": 60
        },
        {
            "hc-key": "iq",
            "value": 61
        },
        {
            "hc-key": "za",
            "value": 62
        },
        {
            "hc-key": "na",
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
            "hc-key": "ga",
            "value": 73
        },
        {
            "hc-key": "ye",
            "value": 74
        },
        {
            "hc-key": "ae",
            "value": 75
        },
        {
            "hc-key": "ke",
            "value": 76
        },
        {
            "hc-key": "bd",
            "value": 77
        },
        {
            "hc-key": "dz",
            "value": 78
        },
        {
            "hc-key": "mr",
            "value": 79
        },
        {
            "hc-key": "ch",
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
            "hc-key": "pg",
            "value": 84
        },
        {
            "hc-key": "fi",
            "value": 85
        },
        {
            "hc-key": "se",
            "value": 86
        },
        {
            "hc-key": "ee",
            "value": 87
        },
        {
            "hc-key": "ao",
            "value": 88
        },
        {
            "hc-key": "vn",
            "value": 89
        },
        {
            "hc-key": "mz",
            "value": 90
        },
        {
            "hc-key": "br",
            "value": 91
        },
        {
            "hc-key": "pa",
            "value": 92
        },
        {
            "hc-key": "cr",
            "value": 93
        },
        {
            "hc-key": "ng",
            "value": 94
        },
        {
            "hc-key": "sv",
            "value": 95
        },
        {
            "hc-key": "sl",
            "value": 96
        },
        {
            "hc-key": "gw",
            "value": 97
        },
        {
            "hc-key": "ba",
            "value": 98
        },
        {
            "hc-key": "hr",
            "value": 99
        },
        {
            "hc-key": "th",
            "value": 100
        },
        {
            "hc-key": "bz",
            "value": 101
        },
        {
            "hc-key": "mx",
            "value": 102
        },
        {
            "hc-key": "tn",
            "value": 103
        },
        {
            "hc-key": "pt",
            "value": 104
        },
        {
            "hc-key": "ma",
            "value": 105
        },
        {
            "hc-key": "cf",
            "value": 106
        },
        {
            "hc-key": "sd",
            "value": 107
        },
        {
            "hc-key": "cd",
            "value": 108
        },
        {
            "hc-key": "kw",
            "value": 109
        },
        {
            "hc-key": "de",
            "value": 110
        },
        {
            "hc-key": "kz",
            "value": 111
        },
        {
            "hc-key": "er",
            "value": 112
        },
        {
            "hc-key": "kp",
            "value": 113
        },
        {
            "hc-key": "sr",
            "value": 114
        },
        {
            "hc-key": "ve",
            "value": 115
        },
        {
            "hc-key": "ni",
            "value": 116
        },
        {
            "hc-key": "mm",
            "value": 117
        },
        {
            "hc-key": "gq",
            "value": 118
        },
        {
            "hc-key": "cyn",
            "value": 119
        },
        {
            "hc-key": "ie",
            "value": 120
        },
        {
            "hc-key": "sol",
            "value": 121
        },
        {
            "hc-key": "lt",
            "value": 122
        },
        {
            "hc-key": "et",
            "value": 123
        },
        {
            "hc-key": "gh",
            "value": 124
        },
        {
            "hc-key": "si",
            "value": 125
        },
        {
            "hc-key": "gt",
            "value": 126
        },
        {
            "hc-key": "jo",
            "value": 127
        },
        {
            "hc-key": "sy",
            "value": 128
        },
        {
            "hc-key": "zm",
            "value": 129
        },
        {
            "hc-key": "mc",
            "value": 130
        },
        {
            "hc-key": "al",
            "value": 131
        },
        {
            "hc-key": "uy",
            "value": 132
        },
        {
            "hc-key": "cnm",
            "value": 133
        },
        {
            "hc-key": "mn",
            "value": 134
        },
        {
            "hc-key": "rw",
            "value": 135
        },
        {
            "hc-key": "bo",
            "value": 136
        },
        {
            "hc-key": "cm",
            "value": 137
        },
        {
            "hc-key": "cg",
            "value": 138
        },
        {
            "hc-key": "eh",
            "value": 139
        },
        {
            "hc-key": "rs",
            "value": 140
        },
        {
            "hc-key": "ua",
            "value": 141
        },
        {
            "hc-key": "ro",
            "value": 142
        },
        {
            "hc-key": "me",
            "value": 143
        },
        {
            "hc-key": "bj",
            "value": 144
        },
        {
            "hc-key": "tg",
            "value": 145
        },
        {
            "hc-key": "la",
            "value": 146
        },
        {
            "hc-key": "sk",
            "value": 147
        },
        {
            "hc-key": "kas",
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
            "hc-key": "ly",
            "value": 155
        },
        {
            "hc-key": "lu",
            "value": 156
        },
        {
            "hc-key": "ad",
            "value": 157
        },
        {
            "hc-key": "lr",
            "value": 158
        },
        {
            "hc-key": "bn",
            "value": 159
        },
        {
            "hc-key": "be",
            "value": 160
        },
        {
            "hc-key": "ge",
            "value": 161
        },
        {
            "hc-key": "gm",
            "value": 162
        },
        {
            "hc-key": "sn",
            "value": 163
        },
        {
            "hc-key": "td",
            "value": 164
        },
        {
            "hc-key": "kv",
            "value": 165
        },
        {
            "hc-key": "lb",
            "value": 166
        },
        {
            "hc-key": "dj",
            "value": 167
        },
        {
            "hc-key": "bi",
            "value": 168
        },
        {
            "hc-key": "il",
            "value": 169
        },
        {
            "hc-key": "eg",
            "value": 170
        },
        {
            "hc-key": "gn",
            "value": 171
        },
        {
            "hc-key": "zw",
            "value": 172
        },
        {
            "hc-key": "pl",
            "value": 173
        },
        {
            "hc-key": "mk",
            "value": 174
        },
        {
            "hc-key": "py",
            "value": 175
        },
        {
            "hc-key": "by",
            "value": 176
        },
        {
            "hc-key": "lv",
            "value": 177
        },
        {
            "hc-key": "bt",
            "value": 178
        },
        {
            "hc-key": "cz",
            "value": 179
        },
        {
            "hc-key": "bf",
            "value": 180
        },
        {
            "hc-key": "sg",
            "value": 181
        },
        {
            "hc-key": "ml",
            "value": 182
        },
        {
            "hc-key": "md",
            "value": 183
        },
        {
            "hc-key": "ss",
            "value": 184
        },
        {
            "hc-key": "jp",
            "value": 185
        },
        {
            "hc-key": "bs",
            "value": 186
        },
        {
            "hc-key": "fj",
            "value": 187
        },
        {
            "hc-key": "kr",
            "value": 188
        },
        {
            "hc-key": "nz",
            "value": 189
        },
        {
            "hc-key": "cu",
            "value": 190
        },
        {
            "hc-key": "au",
            "value": 191
        },
        {
            "hc-key": "tw",
            "value": 192
        },
        {
            "hc-key": "mg",
            "value": 193
        },
        {
            "hc-key": "is",
            "value": 194
        },
        {
            "hc-key": "so",
            "value": 195
        },
        {
            "hc-key": "bw",
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
            text : 'Source map: <a href="http://code.highcharts.com/mapdata/custom/world-eckert3.js">World, Eckert III projection</a>'
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
            mapData: Highcharts.maps['custom/world-eckert3'],
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
