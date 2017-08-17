(function (H) {
    var sourceURL = 'https://www.ssb.no/statistikkbanken/selectvarval/Define.asp?subjectcode=&ProductId=&MainTable=FOBinntKjAld&nvl=&PLanguage=0&nyTmpVar=true&CMSSubjectArea=befolkning&KortNavnWeb=fobhusinnt&StatVariant=';
    var colors = H.defaultOptions.colors;
    var data = [{
        "level": 0,
        "id": "0",
        "parent": "",
        "name": "Hele landet",
        "color": colors[0]
    }, {
        "level": 1,
        "id": "1",
        "parent": "0",
        "name": "Arbeidsinntekt",
        "color": colors[1]
    }, {
        "level": 2,
        "id": "2",
        "parent": "1",
        "name": "Menn"
    }, {
        "level": 3,
        "id": "3",
        "parent": "2",
        "name": "0-18 år",
        "value": 5047,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "4",
        "parent": "2",
        "name": "19-24 år",
        "value": 109733,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "5",
        "parent": "2",
        "name": "25-39 år",
        "value": 414186,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "6",
        "parent": "2",
        "name": "40-54 år",
        "value": 436624,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "7",
        "parent": "2",
        "name": "55-66 år",
        "value": 217334,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "8",
        "parent": "2",
        "name": "67-74 år",
        "value": 11453,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "9",
        "parent": "2",
        "name": "75 år eller eldre",
        "value": 556,
        "isLeaf": true
    }, {
        "level": 2,
        "id": "10",
        "parent": "1",
        "name": "Kvinner"
    }, {
        "level": 3,
        "id": "11",
        "parent": "10",
        "name": "0-18 år",
        "value": 3228,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "12",
        "parent": "10",
        "name": "19-24 år",
        "value": 91297,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "13",
        "parent": "10",
        "name": "25-39 år",
        "value": 323403,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "14",
        "parent": "10",
        "name": "40-54 år",
        "value": 382743,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "15",
        "parent": "10",
        "name": "55-66 år",
        "value": 187750,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "16",
        "parent": "10",
        "name": "67-74 år",
        "value": 7316,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "17",
        "parent": "10",
        "name": "75 år eller eldre",
        "value": 318,
        "isLeaf": true
    }, {
        "level": 1,
        "id": "18",
        "parent": "0",
        "name": "Kapitalinntekt",
        "color": colors[2]
    }, {
        "level": 2,
        "id": "19",
        "parent": "18",
        "name": "Menn"
    }, {
        "level": 3,
        "id": "20",
        "parent": "19",
        "name": "0-18 år",
        "value": 106,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "21",
        "parent": "19",
        "name": "19-24 år",
        "value": 417,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "22",
        "parent": "19",
        "name": "25-39 år",
        "value": 2228,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "23",
        "parent": "19",
        "name": "40-54 år",
        "value": 6372,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "24",
        "parent": "19",
        "name": "55-66 år",
        "value": 6365,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "25",
        "parent": "19",
        "name": "67-74 år",
        "value": 2205,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "26",
        "parent": "19",
        "name": "75 år eller eldre",
        "value": 1258,
        "isLeaf": true
    }, {
        "level": 2,
        "id": "27",
        "parent": "18",
        "name": "Kvinner"
    }, {
        "level": 3,
        "id": "28",
        "parent": "27",
        "name": "0-18 år",
        "value": 76,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "29",
        "parent": "27",
        "name": "19-24 år",
        "value": 374,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "30",
        "parent": "27",
        "name": "25-39 år",
        "value": 1453,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "31",
        "parent": "27",
        "name": "40-54 år",
        "value": 2724,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "32",
        "parent": "27",
        "name": "55-66 år",
        "value": 2847,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "33",
        "parent": "27",
        "name": "67-74 år",
        "value": 1201,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "34",
        "parent": "27",
        "name": "75 år eller eldre",
        "value": 1106,
        "isLeaf": true
    }, {
        "level": 1,
        "id": "35",
        "parent": "0",
        "name": "Pensjoner",
        "color": colors[3]
    }, {
        "level": 2,
        "id": "36",
        "parent": "35",
        "name": "Menn"
    }, {
        "level": 3,
        "id": "37",
        "parent": "36",
        "name": "0-18 år",
        "value": 551,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "38",
        "parent": "36",
        "name": "19-24 år",
        "value": 7701,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "39",
        "parent": "36",
        "name": "25-39 år",
        "value": 31261,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "40",
        "parent": "36",
        "name": "40-54 år",
        "value": 55983,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "41",
        "parent": "36",
        "name": "55-66 år",
        "value": 111631,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "42",
        "parent": "36",
        "name": "67-74 år",
        "value": 128712,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "43",
        "parent": "36",
        "name": "75 år eller eldre",
        "value": 133134,
        "isLeaf": true
    }, {
        "level": 2,
        "id": "44",
        "parent": "35",
        "name": "Kvinner"
    }, {
        "level": 3,
        "id": "45",
        "parent": "44",
        "name": "0-18 år",
        "value": 790,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "46",
        "parent": "44",
        "name": "19-24 år",
        "value": 10918,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "47",
        "parent": "44",
        "name": "25-39 år",
        "value": 41105,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "48",
        "parent": "44",
        "name": "40-54 år",
        "value": 77407,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "49",
        "parent": "44",
        "name": "55-66 år",
        "value": 128157,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "50",
        "parent": "44",
        "name": "67-74 år",
        "value": 143857,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "51",
        "parent": "44",
        "name": "75 år eller eldre",
        "value": 209476,
        "isLeaf": true
    }, {
        "level": 1,
        "id": "52",
        "parent": "0",
        "name": "Andre overføringer",
        "color": colors[4]
    }, {
        "level": 2,
        "id": "53",
        "parent": "52",
        "name": "Menn"
    }, {
        "level": 3,
        "id": "54",
        "parent": "53",
        "name": "0-18 år",
        "value": 390,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "55",
        "parent": "53",
        "name": "19-24 år",
        "value": 5964,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "56",
        "parent": "53",
        "name": "25-39 år",
        "value": 23371,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "57",
        "parent": "53",
        "name": "40-54 år",
        "value": 19388,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "58",
        "parent": "53",
        "name": "55-66 år",
        "value": 10112,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "59",
        "parent": "53",
        "name": "67-74 år",
        "value": 296,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "60",
        "parent": "53",
        "name": "75 år eller eldre",
        "value": 28,
        "isLeaf": true
    }, {
        "level": 2,
        "id": "61",
        "parent": "52",
        "name": "Kvinner"
    }, {
        "level": 3,
        "id": "62",
        "parent": "61",
        "name": "0-18 år",
        "value": 407,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "63",
        "parent": "61",
        "name": "19-24 år",
        "value": 11224,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "64",
        "parent": "61",
        "name": "25-39 år",
        "value": 70187,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "65",
        "parent": "61",
        "name": "40-54 år",
        "value": 23096,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "66",
        "parent": "61",
        "name": "55-66 år",
        "value": 9265,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "67",
        "parent": "61",
        "name": "67-74 år",
        "value": 291,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "68",
        "parent": "61",
        "name": "75 år eller eldre",
        "value": 28,
        "isLeaf": true
    }, {
        "level": 1,
        "id": "69",
        "parent": "0",
        "name": "Studielån og -stipend",
        "color": colors[5]
    }, {
        "level": 2,
        "id": "70",
        "parent": "69",
        "name": "Menn"
    }, {
        "level": 3,
        "id": "71",
        "parent": "70",
        "name": "0-18 år",
        "value": 94,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "72",
        "parent": "70",
        "name": "19-24 år",
        "value": 20968,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "73",
        "parent": "70",
        "name": "25-39 år",
        "value": 6371,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "74",
        "parent": "70",
        "name": "40-54 år",
        "value": 125,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "75",
        "parent": "70",
        "name": "55-66 år",
        "value": 4,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "76",
        "parent": "70",
        "name": "67-74 år",
        "value": 0,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "77",
        "parent": "70",
        "name": "75 år eller eldre",
        "value": 0,
        "isLeaf": true
    }, {
        "level": 2,
        "id": "78",
        "parent": "69",
        "name": "Kvinner"
    }, {
        "level": 3,
        "id": "79",
        "parent": "78",
        "name": "0-18 år",
        "value": 186,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "80",
        "parent": "78",
        "name": "19-24 år",
        "value": 31620,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "81",
        "parent": "78",
        "name": "25-39 år",
        "value": 7239,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "82",
        "parent": "78",
        "name": "40-54 år",
        "value": 344,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "83",
        "parent": "78",
        "name": "55-66 år",
        "value": 4,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "84",
        "parent": "78",
        "name": "67-74 år",
        "value": 0,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "85",
        "parent": "78",
        "name": "75 år eller eldre",
        "value": 0,
        "isLeaf": true
    }, {
        "level": 1,
        "id": "86",
        "parent": "0",
        "name": "Økonomisk avhengige",
        "color": colors[6]
    }, {
        "level": 2,
        "id": "87",
        "parent": "86",
        "name": "Menn"
    }, {
        "level": 3,
        "id": "88",
        "parent": "87",
        "name": "0-18 år",
        "value": 600416,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "89",
        "parent": "87",
        "name": "19-24 år",
        "value": 56903,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "90",
        "parent": "87",
        "name": "25-39 år",
        "value": 32937,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "91",
        "parent": "87",
        "name": "40-54 år",
        "value": 18560,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "92",
        "parent": "87",
        "name": "55-66 år",
        "value": 9482,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "93",
        "parent": "87",
        "name": "67-74 år",
        "value": 1935,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "94",
        "parent": "87",
        "name": "75 år eller eldre",
        "value": 1331,
        "isLeaf": true
    }, {
        "level": 2,
        "id": "95",
        "parent": "86",
        "name": "Kvinner"
    }, {
        "level": 3,
        "id": "96",
        "parent": "95",
        "name": "0-18 år",
        "value": 570918,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "97",
        "parent": "95",
        "name": "19-24 år",
        "value": 47556,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "98",
        "parent": "95",
        "name": "25-39 år",
        "value": 43292,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "99",
        "parent": "95",
        "name": "40-54 år",
        "value": 22380,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "100",
        "parent": "95",
        "name": "55-66 år",
        "value": 20308,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "101",
        "parent": "95",
        "name": "67-74 år",
        "value": 2963,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "102",
        "parent": "95",
        "name": "75 år eller eldre",
        "value": 1531,
        "isLeaf": true
    }, {
        "level": 1,
        "id": "103",
        "parent": "0",
        "name": "Uoppgitt",
        "color": colors[7]
    }, {
        "level": 2,
        "id": "104",
        "parent": "103",
        "name": "Menn"
    }, {
        "level": 3,
        "id": "105",
        "parent": "104",
        "name": "0-18 år",
        "value": 286,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "106",
        "parent": "104",
        "name": "19-24 år",
        "value": 255,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "107",
        "parent": "104",
        "name": "25-39 år",
        "value": 882,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "108",
        "parent": "104",
        "name": "40-54 år",
        "value": 498,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "109",
        "parent": "104",
        "name": "55-66 år",
        "value": 412,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "110",
        "parent": "104",
        "name": "67-74 år",
        "value": 377,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "111",
        "parent": "104",
        "name": "75 år eller eldre",
        "value": 1535,
        "isLeaf": true
    }, {
        "level": 2,
        "id": "112",
        "parent": "103",
        "name": "Kvinner"
    }, {
        "level": 3,
        "id": "113",
        "parent": "112",
        "name": "0-18 år",
        "value": 258,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "114",
        "parent": "112",
        "name": "19-24 år",
        "value": 302,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "115",
        "parent": "112",
        "name": "25-39 år",
        "value": 505,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "116",
        "parent": "112",
        "name": "40-54 år",
        "value": 213,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "117",
        "parent": "112",
        "name": "55-66 år",
        "value": 259,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "118",
        "parent": "112",
        "name": "67-74 år",
        "value": 249,
        "isLeaf": true
    }, {
        "level": 3,
        "id": "119",
        "parent": "112",
        "name": "75 år eller eldre",
        "value": 2007,
        "isLeaf": true
    }];
    H.chart('container', {
        title: {
            text: 'Folkemengde, etter hovedinntektskilde, kjønn og alder'
        },
        series: [{
            type: "sunburst",
            data: data
        }],
        subtitle: {
            text: '<a href="' + sourceURL + '">Kilde: Statistisk Sentralbyrå</a>',
            useHTML: true
        }
    });
}(Highcharts));
