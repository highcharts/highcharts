async function renderChart() {

    // Configure the connector
    const connector =
        new HighchartsConnectors.Morningstar.SecurityCompareConnector({
            api: {
                url: 'https://demo-live-data.highcharts.com',
                access: {
                    url: 'https://demo-live-data.highcharts.com/token/oauth',
                    token: 'token'
                }
            },
            security: {
                ids: ['0P000151L5', 'EUCA000511'],
                idType: 'MSID'
            },
            converter: {
                type: 'CountryExposure'
            }
        });

    await connector.load();

    // The country codes are available in the dictionary tab
    // of the security details datapoint file.
    const countryExposureMap = {
        ABW: 'Aruba',
        AFG: 'Afghanistan',
        AGO: 'Angola',
        AIA: 'Anguilla',
        ALA: 'Aland Islands',
        ALB: 'Albania',
        AND: 'Andorra',
        ARE: 'United Arab Emirates',
        ARG: 'Argentina',
        ARM: 'Armenia',
        ASM: 'American Samoa',
        ATA: 'Antarctica',
        ATF: 'French Southern Territories',
        ATG: 'Antigua & Barbuda',
        AUS: 'Australia',
        AUT: 'Austria',
        AZE: 'Azerbaijan',
        BDI: 'Burundi',
        BEL: 'Belgium',
        BEN: 'Benin',
        BFA: 'Burkina Faso',
        BGD: 'Bangladesh',
        BGR: 'Bulgaria',
        BHR: 'Bahrain',
        BHS: 'Bahamas',
        BIH: 'Bosnia & Herzegovina',
        BLR: 'Belarus',
        BLZ: 'Belize',
        BMU: 'Bermuda',
        BOL: 'Bolivia',
        BRA: 'Brazil',
        BRB: 'Barbados',
        BRN: 'Brunei Darussalam',
        BTN: 'Bhutan',
        BVT: 'Bouvet Island',
        BWA: 'Botswana',
        CAF: 'Central African Republic',
        CAN: 'Canada',
        CCK: 'Cocos (Keeling) Islands',
        CHE: 'Switzerland',
        CHI: 'Channel Islands',
        CHL: 'Chile',
        CHN: 'China',
        CIV: 'Cote d\'Ivoire',
        CMR: 'Cameroon',
        COD: 'Congo, the Democratic Republic of the',
        COG: 'Congo',
        COK: 'Cook Islands',
        COL: 'Colombia',
        COM: 'Comoros',
        CPV: 'Cape Verde',
        CRI: 'Costa Rica',
        CUB: 'Cuba',
        CXR: 'Christmas Island',
        CYM: 'Cayman Islands',
        CYP: 'Cyprus',
        CZE: 'Czech Republic',
        DEU: 'Germany',
        DJI: 'Djibouti',
        DMA: 'Dominica',
        DNK: 'Denmark',
        DOM: 'Dominican Republic',
        DZA: 'Algeria',
        ECU: 'Ecuador',
        EGY: 'Egypt',
        ERI: 'Eritrea',
        ESH: 'Western Sahara',
        ESP: 'Spain',
        EST: 'Estonia',
        ETH: 'Ethiopia',
        FIN: 'Finland',
        FJI: 'Fiji',
        FLK: 'Falkland Islands (Malvinas)',
        FRA: 'France',
        FRO: 'Faroe Islands',
        FSM: 'Micronesia, Federated States of',
        GAB: 'Gabon',
        GBL: 'Global',
        GBR: 'United Kingdom',
        GEO: 'Georgia',
        GGY: 'Guernsey',
        GHA: 'Ghana',
        GIB: 'Gibraltar',
        GIN: 'Guinea',
        GLP: 'Guadeloupe',
        GMB: 'Gambia',
        GNB: 'Guinea-Bissau',
        GNQ: 'Equatorial Guinea',
        GRC: 'Greece',
        GRD: 'Grenada',
        GRL: 'Greenland',
        GTM: 'Guatemala',
        GUF: 'French Guiana',
        GUM: 'Guam',
        GUY: 'Guyana',
        HKG: 'Hong Kong',
        HMD: 'Heard Island and McDonald Islands',
        HND: 'Honduras',
        HRV: 'Croatia',
        HTI: 'Haiti',
        HUN: 'Hungary',
        IDN: 'Indonesia',
        IMN: 'Isle of Man',
        IND: 'India',
        IOT: 'British Indian Ocean Territory',
        IRL: 'Ireland',
        IRN: 'Iran, Islamic Republic of',
        IRQ: 'Iraq',
        ISL: 'Iceland',
        ISR: 'Israel',
        ITA: 'Italy',
        IXX: 'Ireland, Dublin',
        JAM: 'Jamaica',
        JEY: 'Jersey',
        JOR: 'Jordan',
        JPN: 'Japan',
        KAZ: 'Kazakhstan',
        KEN: 'Kenya',
        KGZ: 'Kyrgyzstan',
        KHM: 'Cambodia',
        KIR: 'Kiribati',
        KNA: 'St. Kitts & Nevis',
        KOR: 'South Korea',
        KWT: 'Kuwait',
        LAO: 'Laos',
        LBN: 'Lebanon',
        LBR: 'Liberia',
        LBY: 'Libya',
        LCA: 'St. Lucia',
        LIE: 'Liechtenstein',
        LKA: 'Sri Lanka',
        LSO: 'Lesotho',
        LTU: 'Lithuania',
        LUX: 'Luxembourg',
        LVA: 'Latvia',
        MAC: 'Macao',
        MAR: 'Morocco',
        MCO: 'Monaco',
        MDA: 'Moldova, Republic of',
        MDG: 'Madagascar',
        MDV: 'Maldives',
        MEX: 'Mexico',
        MHL: 'Marshall Islands',
        MKD: 'Macedonia, the Former Yugoslav Republic of',
        MLI: 'Mali',
        MLT: 'Malta',
        MMR: 'Myanmar',
        MNE: 'Montenegro',
        MNG: 'Mongolia',
        MNP: 'Northern Mariana Islands',
        MOZ: 'Mozambique',
        MRT: 'Mauritania',
        MSR: 'Montserrat',
        MTQ: 'Martinique',
        MUS: 'Mauritius',
        MWI: 'Malawi',
        MYS: 'Malaysia',
        MYT: 'Mayotte',
        NAM: 'Namibia',
        NCL: 'New Caledonia',
        NER: 'Niger',
        NFK: 'Norfolk Island',
        NGA: 'Nigeria',
        NIC: 'Nicaragua',
        NIU: 'Niue',
        NLD: 'Netherlands',
        NOR: 'Norway',
        NPL: 'Nepal',
        NRU: 'Nauru',
        NZL: 'New Zealand',
        OMN: 'Oman',
        PAK: 'Pakistan',
        PAN: 'Panama',
        PCN: 'Pitcairn',
        PER: 'Peru',
        PHL: 'Philippines',
        PLW: 'Palau',
        PNG: 'Papua New Guinea',
        POL: 'Poland',
        PRI: 'Puerto Rico',
        PRK: 'North Korea',
        PRT: 'Portugal',
        PRY: 'Paraguay',
        PSE: 'Occupied Palestinian Territory',
        PYF: 'French Polynesia',
        QAT: 'Qatar',
        REU: 'Reunion',
        ROU: 'Romania',
        RUS: 'Russia',
        RWA: 'Rwanda',
        SAU: 'Saudi Arabia',
        SDN: 'Sudan',
        SEN: 'Senegal',
        SGP: 'Singapore',
        SGS: 'South Georgia and the South Sandwich Islands',
        SHN: 'St. Helena',
        SJM: 'Svalbard and Jan Mayen',
        SLB: 'Solomon Islands',
        SLE: 'Sierra Leone',
        SLV: 'El Salvador',
        SMR: 'San Marino',
        SOM: 'Somalia',
        SPM: 'St. Pierre & Miquelon',
        SRB: 'Serbia',
        STP: 'Sao Tome & Principe',
        SUR: 'Suriname',
        SVK: 'Slovakia',
        SVN: 'Slovenia',
        SWE: 'Sweden',
        SWZ: 'Swaziland',
        SYC: 'Seychelles',
        SYR: 'Syrian Arab Republic',
        TCA: 'Turks and Caicos Islands',
        TCD: 'Chad',
        TGO: 'Togo',
        THA: 'Thailand',
        TJK: 'Tajikistan',
        TKL: 'Tokelau',
        TKM: 'Turkmenistan',
        TLS: 'Timor-Leste',
        TON: 'Tonga',
        TTO: 'Trinidad & Tobago',
        TUN: 'Tunisia',
        TUR: 'Turkey',
        TUV: 'Tuvalu',
        TWN: 'Taiwan',
        TZA: 'Tanzania, United Republic Of',
        UGA: 'Uganda',
        UKR: 'Ukraine',
        UMI: 'US Minor Outlying Islands',
        URY: 'Uruguay',
        USA: 'United States',
        UZB: 'Uzbekistan',
        VAT: 'Holy See (Vatican City State)',
        VCT: 'St. Vincent & the Grenadines',
        VEN: 'Venezuela',
        VGB: 'British Virgin Islands',
        VIR: 'US Virgin Islands',
        VNM: 'Vietnam',
        VUT: 'Vanuatu',
        WBG: 'West Bank of Gaza',
        WLF: 'Wallis & Futuna Islands',
        WSM: 'Samoa',
        YEM: 'Yemen',
        ZAF: 'South Africa',
        ZMB: 'Zambia',
        ZWE: 'Zimbabwe',
        BES: 'Bonaire, Sint Eustatius and Saba',
        CUW: 'Curacao',
        SXM: 'Sint Maarten',
        XSN: 'Supranational',
        SSD: 'South Sudan'
    };

    // Parse data from the connector and return a Highcharts compatible array
    const parseData = connector => {
        const table = connector.getTable('CountryExposure');

        // Reduce callback for getting the right values in the right order
        const reduceCallback = (obj, row) => {
            if (row[0] !== undefined) {
                obj[row[0]] = row[1];
            }
            return obj;
        };

        const data = table.getRows(0, table.getRowCount(), [
            'Type_0P000151L5',
            'Equity_N_0P000151L5'
        ]).reduce(reduceCallback, {});

        const categoryData = table.getRows(0, table.getRowCount(), [
            'Type_EUCA000511',
            'Equity_N_EUCA000511'
        ]).reduce(reduceCallback, {});

        const values = [],
            category = [];

        for (const [country, value] of Object.entries(data)) {
            const countryName = countryExposureMap[country];

            if (categoryData[country] === undefined) {
                continue;
            }

            values.push({
                name: countryName,
                y: value
            });

            category.push({
                name: countryName,
                y: categoryData[country]
            });
        }

        return {
            values,
            category
        };
    };

    const dataset = parseData(connector);

    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Country Breakdown Chart',
            margin: 30,
            align: 'left'
        },
        xAxis: [{
            grid: {
                enabled: true,
                borderColor: '#E1E1E1'
            },
            categories: dataset.values,
            labels: {
                format: '{value.name}'
            }
        }, {
            grid: {
                enabled: true,
                borderColor: '#E1E1E1'
            },
            categories: dataset.values,
            labels: {
                format: '{value.y:.2f}%',
                align: 'right',
                x: -5
            },
            linkedTo: 0
        }, {
            grid: {
                enabled: true,
                borderColor: '#E1E1E1'
            },
            categories: dataset.category,
            labels: {
                format: '{value.y:.2f}%',
                align: 'right',
                x: -5
            },
            linkedTo: 0
        }],
        yAxis: {
            title: {
                text: 'Country weight'
            },
            labels: {
                format: '{value}%'
            }
        },
        legend: {
            align: 'right',
            verticalAlign: 'top'
        },
        plotOptions: {
            series: {
                minPointLength: 3,
                borderWidth: 1,
                borderColor: '#0000001C'
            }
        },
        tooltip: {
            followPointer: true,
            shared: true,
            valueDecimals: 2,
            valueSuffix: '%'
        },
        series: [{
            name: 'Category',
            color: '#E1E1E6',
            data: dataset.category
        }, {
            name: 'SPDR® MSCI Europe UCITS ETF',
            color: '#274FE0',
            data: dataset.values
        }]
    });
}

renderChart();
