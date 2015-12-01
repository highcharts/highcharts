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
            "hc-key": "fr",
            "value": 4
        },
        {
            "hc-key": "cn",
            "value": 5
        },
        {
            "hc-key": "sw",
            "value": 6
        },
        {
            "hc-key": "sh",
            "value": 7
        },
        {
            "hc-key": "ec",
            "value": 8
        },
        {
            "hc-key": "au",
            "value": 9
        },
        {
            "hc-key": "ph",
            "value": 10
        },
        {
            "hc-key": "es",
            "value": 11
        },
        {
            "hc-key": "bu",
            "value": 12
        },
        {
            "hc-key": "mv",
            "value": 13
        },
        {
            "hc-key": "sp",
            "value": 14
        },
        {
            "hc-key": "gb",
            "value": 15
        },
        {
            "hc-key": "gr",
            "value": 16
        },
        {
            "hc-key": "dk",
            "value": 17
        },
        {
            "hc-key": "gl",
            "value": 18
        },
        {
            "hc-key": "pr",
            "value": 19
        },
        {
            "hc-key": "um",
            "value": 20
        },
        {
            "hc-key": "vi",
            "value": 21
        },
        {
            "hc-key": "ca",
            "value": 22
        },
        {
            "hc-key": "cv",
            "value": 23
        },
        {
            "hc-key": "dm",
            "value": 24
        },
        {
            "hc-key": "sc",
            "value": 25
        },
        {
            "hc-key": "jm",
            "value": 26
        },
        {
            "hc-key": "om",
            "value": 27
        },
        {
            "hc-key": "vc",
            "value": 28
        },
        {
            "hc-key": "sb",
            "value": 29
        },
        {
            "hc-key": "lc",
            "value": 30
        },
        {
            "hc-key": "no",
            "value": 31
        },
        {
            "hc-key": "kn",
            "value": 32
        },
        {
            "hc-key": "bh",
            "value": 33
        },
        {
            "hc-key": "id",
            "value": 34
        },
        {
            "hc-key": "mu",
            "value": 35
        },
        {
            "hc-key": "se",
            "value": 36
        },
        {
            "hc-key": "ru",
            "value": 37
        },
        {
            "hc-key": "tt",
            "value": 38
        },
        {
            "hc-key": "br",
            "value": 39
        },
        {
            "hc-key": "bs",
            "value": 40
        },
        {
            "hc-key": "pw",
            "value": 41
        },
        {
            "hc-key": "cl",
            "value": 42
        },
        {
            "hc-key": "gd",
            "value": 43
        },
        {
            "hc-key": "ee",
            "value": 44
        },
        {
            "hc-key": "ag",
            "value": 45
        },
        {
            "hc-key": "tw",
            "value": 46
        },
        {
            "hc-key": "fj",
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
            "hc-key": "pg",
            "value": 51
        },
        {
            "hc-key": "vu",
            "value": 52
        },
        {
            "hc-key": "sg",
            "value": 53
        },
        {
            "hc-key": "cy",
            "value": 54
        },
        {
            "hc-key": "km",
            "value": 55
        },
        {
            "hc-key": "va",
            "value": 56
        },
        {
            "hc-key": "sm",
            "value": 57
        },
        {
            "hc-key": "az",
            "value": 58
        },
        {
            "hc-key": "am",
            "value": 59
        },
        {
            "hc-key": "sd",
            "value": 60
        },
        {
            "hc-key": "ly",
            "value": 61
        },
        {
            "hc-key": "tj",
            "value": 62
        },
        {
            "hc-key": "mx",
            "value": 63
        },
        {
            "hc-key": "gt",
            "value": 64
        },
        {
            "hc-key": "ls",
            "value": 65
        },
        {
            "hc-key": "np",
            "value": 66
        },
        {
            "hc-key": "uz",
            "value": 67
        },
        {
            "hc-key": "bd",
            "value": 68
        },
        {
            "hc-key": "mn",
            "value": 69
        },
        {
            "hc-key": "pt",
            "value": 70
        },
        {
            "hc-key": "ma",
            "value": 71
        },
        {
            "hc-key": "tz",
            "value": 72
        },
        {
            "hc-key": "ar",
            "value": 73
        },
        {
            "hc-key": "sa",
            "value": 74
        },
        {
            "hc-key": "nl",
            "value": 75
        },
        {
            "hc-key": "ye",
            "value": 76
        },
        {
            "hc-key": "ae",
            "value": 77
        },
        {
            "hc-key": "ke",
            "value": 78
        },
        {
            "hc-key": "tr",
            "value": 79
        },
        {
            "hc-key": "fi",
            "value": 80
        },
        {
            "hc-key": "my",
            "value": 81
        },
        {
            "hc-key": "pa",
            "value": 82
        },
        {
            "hc-key": "ir",
            "value": 83
        },
        {
            "hc-key": "ht",
            "value": 84
        },
        {
            "hc-key": "do",
            "value": 85
        },
        {
            "hc-key": "hr",
            "value": 86
        },
        {
            "hc-key": "th",
            "value": 87
        },
        {
            "hc-key": "cd",
            "value": 88
        },
        {
            "hc-key": "kw",
            "value": 89
        },
        {
            "hc-key": "de",
            "value": 90
        },
        {
            "hc-key": "be",
            "value": 91
        },
        {
            "hc-key": "ie",
            "value": 92
        },
        {
            "hc-key": "mm",
            "value": 93
        },
        {
            "hc-key": "gq",
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
            "hc-key": "er",
            "value": 97
        },
        {
            "hc-key": "tn",
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
            "hc-key": "kh",
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
            "hc-key": "kr",
            "value": 110
        },
        {
            "hc-key": "ve",
            "value": 111
        },
        {
            "hc-key": "gy",
            "value": 112
        },
        {
            "hc-key": "hn",
            "value": 113
        },
        {
            "hc-key": "ga",
            "value": 114
        },
        {
            "hc-key": "il",
            "value": 115
        },
        {
            "hc-key": "ni",
            "value": 116
        },
        {
            "hc-key": "mw",
            "value": 117
        },
        {
            "hc-key": "tm",
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
            "hc-key": "gh",
            "value": 124
        },
        {
            "hc-key": "si",
            "value": 125
        },
        {
            "hc-key": "ba",
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
            "hc-key": "rw",
            "value": 133
        },
        {
            "hc-key": "sx",
            "value": 134
        },
        {
            "hc-key": "bo",
            "value": 135
        },
        {
            "hc-key": "cm",
            "value": 136
        },
        {
            "hc-key": "cg",
            "value": 137
        },
        {
            "hc-key": "eh",
            "value": 138
        },
        {
            "hc-key": "me",
            "value": 139
        },
        {
            "hc-key": "rs",
            "value": 140
        },
        {
            "hc-key": "bj",
            "value": 141
        },
        {
            "hc-key": "tg",
            "value": 142
        },
        {
            "hc-key": "af",
            "value": 143
        },
        {
            "hc-key": "ua",
            "value": 144
        },
        {
            "hc-key": "sk",
            "value": 145
        },
        {
            "hc-key": "jk",
            "value": 146
        },
        {
            "hc-key": "pk",
            "value": 147
        },
        {
            "hc-key": "bg",
            "value": 148
        },
        {
            "hc-key": "ro",
            "value": 149
        },
        {
            "hc-key": "qa",
            "value": 150
        },
        {
            "hc-key": "li",
            "value": 151
        },
        {
            "hc-key": "at",
            "value": 152
        },
        {
            "hc-key": "sz",
            "value": 153
        },
        {
            "hc-key": "hu",
            "value": 154
        },
        {
            "hc-key": "ne",
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
            "hc-key": "ci",
            "value": 158
        },
        {
            "hc-key": "lr",
            "value": 159
        },
        {
            "hc-key": "sl",
            "value": 160
        },
        {
            "hc-key": "bn",
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
            "hc-key": "gw",
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
            "hc-key": "bf",
            "value": 182
        },
        {
            "hc-key": "ss",
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
            "hc-key": "co",
            "value": 186
        },
        {
            "hc-key": "ml",
            "value": 187
        },
        {
            "hc-key": "md",
            "value": 188
        },
        {
            "hc-key": "cz",
            "value": 189
        },
        {
            "hc-key": "cf",
            "value": 190
        },
        {
            "hc-key": "bt",
            "value": 191
        },
        {
            "hc-key": "kg",
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
            "hc-key": "vn",
            "value": 195
        },
        {
            "hc-key": "mg",
            "value": 196
        },
        {
            "hc-key": "eg",
            "value": 197
        },
        {
            "hc-key": "so",
            "value": 198
        },
        {
            "hc-key": "is",
            "value": 199
        },
        {
            "hc-key": "lk",
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
            text : 'Source map: <a href="https://code.highcharts.com/mapdata/custom/world-eckert3.js">World, Eckert III projection, medium resolution</a>'
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
