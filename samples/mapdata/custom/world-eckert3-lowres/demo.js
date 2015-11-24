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
            "hc-key": "fr",
            "value": 3
        },
        {
            "hc-key": "cn",
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
            "hc-key": "ph",
            "value": 7
        },
        {
            "hc-key": "es",
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
            "hc-key": "cv",
            "value": 20
        },
        {
            "hc-key": "dm",
            "value": 21
        },
        {
            "hc-key": "sc",
            "value": 22
        },
        {
            "hc-key": "jm",
            "value": 23
        },
        {
            "hc-key": "om",
            "value": 24
        },
        {
            "hc-key": "vc",
            "value": 25
        },
        {
            "hc-key": "bd",
            "value": 26
        },
        {
            "hc-key": "sb",
            "value": 27
        },
        {
            "hc-key": "lc",
            "value": 28
        },
        {
            "hc-key": "no",
            "value": 29
        },
        {
            "hc-key": "kn",
            "value": 30
        },
        {
            "hc-key": "bh",
            "value": 31
        },
        {
            "hc-key": "id",
            "value": 32
        },
        {
            "hc-key": "mu",
            "value": 33
        },
        {
            "hc-key": "ru",
            "value": 34
        },
        {
            "hc-key": "tt",
            "value": 35
        },
        {
            "hc-key": "br",
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
            "hc-key": "cl",
            "value": 39
        },
        {
            "hc-key": "gd",
            "value": 40
        },
        {
            "hc-key": "ag",
            "value": 41
        },
        {
            "hc-key": "tw",
            "value": 42
        },
        {
            "hc-key": "fj",
            "value": 43
        },
        {
            "hc-key": "bb",
            "value": 44
        },
        {
            "hc-key": "it",
            "value": 45
        },
        {
            "hc-key": "mt",
            "value": 46
        },
        {
            "hc-key": "sg",
            "value": 47
        },
        {
            "hc-key": "cy",
            "value": 48
        },
        {
            "hc-key": "km",
            "value": 49
        },
        {
            "hc-key": "ug",
            "value": 50
        },
        {
            "hc-key": "va",
            "value": 51
        },
        {
            "hc-key": "sm",
            "value": 52
        },
        {
            "hc-key": "az",
            "value": 53
        },
        {
            "hc-key": "sd",
            "value": 54
        },
        {
            "hc-key": "ly",
            "value": 55
        },
        {
            "hc-key": "tj",
            "value": 56
        },
        {
            "hc-key": "ls",
            "value": 57
        },
        {
            "hc-key": "uz",
            "value": 58
        },
        {
            "hc-key": "in",
            "value": 59
        },
        {
            "hc-key": "pt",
            "value": 60
        },
        {
            "hc-key": "mx",
            "value": 61
        },
        {
            "hc-key": "ma",
            "value": 62
        },
        {
            "hc-key": "tz",
            "value": 63
        },
        {
            "hc-key": "ar",
            "value": 64
        },
        {
            "hc-key": "sa",
            "value": 65
        },
        {
            "hc-key": "nl",
            "value": 66
        },
        {
            "hc-key": "ye",
            "value": 67
        },
        {
            "hc-key": "ae",
            "value": 68
        },
        {
            "hc-key": "ke",
            "value": 69
        },
        {
            "hc-key": "ss",
            "value": 70
        },
        {
            "hc-key": "tr",
            "value": 71
        },
        {
            "hc-key": "pg",
            "value": 72
        },
        {
            "hc-key": "fi",
            "value": 73
        },
        {
            "hc-key": "se",
            "value": 74
        },
        {
            "hc-key": "my",
            "value": 75
        },
        {
            "hc-key": "vn",
            "value": 76
        },
        {
            "hc-key": "pa",
            "value": 77
        },
        {
            "hc-key": "ir",
            "value": 78
        },
        {
            "hc-key": "ht",
            "value": 79
        },
        {
            "hc-key": "do",
            "value": 80
        },
        {
            "hc-key": "gw",
            "value": 81
        },
        {
            "hc-key": "ba",
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
            "hc-key": "ch",
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
            "hc-key": "gq",
            "value": 93
        },
        {
            "hc-key": "am",
            "value": 94
        },
        {
            "hc-key": "tn",
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
            "hc-key": "kh",
            "value": 104
        },
        {
            "hc-key": "gt",
            "value": 105
        },
        {
            "hc-key": "bz",
            "value": 106
        },
        {
            "hc-key": "kp",
            "value": 107
        },
        {
            "hc-key": "kr",
            "value": 108
        },
        {
            "hc-key": "ve",
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
            "hc-key": "ga",
            "value": 112
        },
        {
            "hc-key": "il",
            "value": 113
        },
        {
            "hc-key": "eg",
            "value": 114
        },
        {
            "hc-key": "ni",
            "value": 115
        },
        {
            "hc-key": "mw",
            "value": 116
        },
        {
            "hc-key": "tm",
            "value": 117
        },
        {
            "hc-key": "kz",
            "value": 118
        },
        {
            "hc-key": "zm",
            "value": 119
        },
        {
            "hc-key": "nc",
            "value": 120
        },
        {
            "hc-key": "za",
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
            "hc-key": "er",
            "value": 124
        },
        {
            "hc-key": "gh",
            "value": 125
        },
        {
            "hc-key": "si",
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
            "hc-key": "mc",
            "value": 129
        },
        {
            "hc-key": "al",
            "value": 130
        },
        {
            "hc-key": "uy",
            "value": 131
        },
        {
            "hc-key": "cnm",
            "value": 132
        },
        {
            "hc-key": "mn",
            "value": 133
        },
        {
            "hc-key": "rw",
            "value": 134
        },
        {
            "hc-key": "sx",
            "value": 135
        },
        {
            "hc-key": "so",
            "value": 136
        },
        {
            "hc-key": "bo",
            "value": 137
        },
        {
            "hc-key": "cm",
            "value": 138
        },
        {
            "hc-key": "cg",
            "value": 139
        },
        {
            "hc-key": "eh",
            "value": 140
        },
        {
            "hc-key": "me",
            "value": 141
        },
        {
            "hc-key": "rs",
            "value": 142
        },
        {
            "hc-key": "bj",
            "value": 143
        },
        {
            "hc-key": "tg",
            "value": 144
        },
        {
            "hc-key": "af",
            "value": 145
        },
        {
            "hc-key": "ua",
            "value": 146
        },
        {
            "hc-key": "sk",
            "value": 147
        },
        {
            "hc-key": "jk",
            "value": 148
        },
        {
            "hc-key": "pk",
            "value": 149
        },
        {
            "hc-key": "bg",
            "value": 150
        },
        {
            "hc-key": "ro",
            "value": 151
        },
        {
            "hc-key": "qa",
            "value": 152
        },
        {
            "hc-key": "li",
            "value": 153
        },
        {
            "hc-key": "at",
            "value": 154
        },
        {
            "hc-key": "sz",
            "value": 155
        },
        {
            "hc-key": "hu",
            "value": 156
        },
        {
            "hc-key": "ne",
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
            "hc-key": "ci",
            "value": 160
        },
        {
            "hc-key": "lr",
            "value": 161
        },
        {
            "hc-key": "sl",
            "value": 162
        },
        {
            "hc-key": "bn",
            "value": 163
        },
        {
            "hc-key": "be",
            "value": 164
        },
        {
            "hc-key": "iq",
            "value": 165
        },
        {
            "hc-key": "ge",
            "value": 166
        },
        {
            "hc-key": "gm",
            "value": 167
        },
        {
            "hc-key": "td",
            "value": 168
        },
        {
            "hc-key": "ng",
            "value": 169
        },
        {
            "hc-key": "kv",
            "value": 170
        },
        {
            "hc-key": "lb",
            "value": 171
        },
        {
            "hc-key": "dj",
            "value": 172
        },
        {
            "hc-key": "bi",
            "value": 173
        },
        {
            "hc-key": "sr",
            "value": 174
        },
        {
            "hc-key": "sn",
            "value": 175
        },
        {
            "hc-key": "gn",
            "value": 176
        },
        {
            "hc-key": "zw",
            "value": 177
        },
        {
            "hc-key": "pl",
            "value": 178
        },
        {
            "hc-key": "mk",
            "value": 179
        },
        {
            "hc-key": "py",
            "value": 180
        },
        {
            "hc-key": "by",
            "value": 181
        },
        {
            "hc-key": "lv",
            "value": 182
        },
        {
            "hc-key": "bf",
            "value": 183
        },
        {
            "hc-key": "na",
            "value": 184
        },
        {
            "hc-key": "la",
            "value": 185
        },
        {
            "hc-key": "ec",
            "value": 186
        },
        {
            "hc-key": "co",
            "value": 187
        },
        {
            "hc-key": "ml",
            "value": 188
        },
        {
            "hc-key": "cf",
            "value": 189
        },
        {
            "hc-key": "bt",
            "value": 190
        },
        {
            "hc-key": "kg",
            "value": 191
        },
        {
            "hc-key": "au",
            "value": 192
        },
        {
            "hc-key": "nz",
            "value": 193
        },
        {
            "hc-key": "cu",
            "value": 194
        },
        {
            "hc-key": "mg",
            "value": 195
        },
        {
            "hc-key": "vu",
            "value": 196
        },
        {
            "hc-key": "is",
            "value": 197
        },
        {
            "hc-key": "lk",
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
            "hc-key": "md",
            "value": 201
        }
    ];

    // Initiate the chart
    $('#container').highcharts('Map', {

        title : {
            text : 'Highmaps basic demo'
        },

        subtitle : {
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/custom/world-eckert3-lowres.js">World, Eckert III projection, low resolution</a>'
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
            mapData: Highcharts.maps['custom/world-eckert3-lowres'],
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
