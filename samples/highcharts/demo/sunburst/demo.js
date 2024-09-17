const data = [{
    id: '0.0',
    parent: '',
    name: 'The World'
}, {
    id: '1.3',
    parent: '0.0',
    name: 'Asia'
}, {
    id: '1.1',
    parent: '0.0',
    name: 'Africa'
}, {
    id: '1.2',
    parent: '0.0',
    name: 'America'
}, {
    id: '1.4',
    parent: '0.0',
    name: 'Europe'
}, {
    id: '1.5',
    parent: '0.0',
    name: 'Oceanic'
},

/* Africa */
{
    id: '2.1',
    parent: '1.1',
    name: 'Eastern Africa'
},

{
    id: '3.1',
    parent: '2.1',
    name: 'Ethiopia',
    value: 126527060
}, {
    id: '3.2',
    parent: '2.1',
    name: 'Tanzania',
    value: 67438106
}, {
    id: '3.3',
    parent: '2.1',
    name: 'Kenya',
    value: 55100587
}, {
    id: '3.4',
    parent: '2.1',
    name: 'Uganda',
    value: 48582334
}, {
    id: '3.5',
    parent: '2.1',
    name: 'Mozambique',
    value: 33897354
}, {
    id: '3.6',
    parent: '2.1',
    name: 'Madagascar',
    value: 30325732
}, {
    id: '3.7',
    parent: '2.1',
    name: 'Malawi',
    value: 20931751
}, {
    id: '3.8',
    parent: '2.1',
    name: 'Zambia',
    value: 20569738
}, {
    id: '3.9',
    parent: '2.1',
    name: 'Somalia',
    value: 18143379
}, {
    id: '3.10',
    parent: '2.1',
    name: 'Zimbabwe',
    value: 16665409
}, {
    id: '3.11',
    parent: '2.1',
    name: 'Rwanda',
    value: 14094683
}, {
    id: '3.12',
    parent: '2.1',
    name: 'Burundi',
    value: 13238559
}, {
    id: '3.13',
    parent: '2.1',
    name: 'South Sudan',
    value: 11088796
}, {
    id: '3.14',
    parent: '2.1',
    name: 'Eritrea',
    value: 3748902
}, {
    id: '3.15',
    parent: '2.1',
    name: 'Mauritius',
    value: 1300557
}, {
    id: '3.16',
    parent: '2.1',
    name: 'Djibouti',
    value: 1136455
}, {
    id: '3.17',
    parent: '2.1',
    name: 'Réunion',
    value: 981796
}, {
    id: '3.18',
    parent: '2.1',
    name: 'Comoros',
    value: 852075
}, {
    id: '3.19',
    parent: '2.1',
    name: 'Mayotte',
    value: 335995
}, {
    id: '3.20',
    parent: '2.1',
    name: 'Seychelles',
    value: 107660
},

{
    id: '2.5',
    parent: '1.1',
    name: 'Western Africa'
},

{
    id: '3.42',
    parent: '2.5',
    name: 'Nigeria',
    value: 223804632
}, {
    id: '3.43',
    parent: '2.5',
    name: 'Ghana',
    value: 34121985
}, {
    id: '3.44',
    parent: '2.5',
    name: 'Ivory Coast',
    value: 28873034
}, {
    id: '3.45',
    parent: '2.5',
    name: 'Niger',
    value: 27202843
}, {
    id: '3.46',
    parent: '2.5',
    name: 'Mali',
    value: 23293699
}, {
    id: '3.47',
    parent: '2.5',
    name: 'Burkina Faso',
    value: 23251485
}, {
    id: '3.48',
    parent: '2.5',
    name: 'Senegal',
    value: 17763163
}, {
    id: '3.49',
    parent: '2.5',
    name: 'Guinea',
    value: 14190612
}, {
    id: '3.50',
    parent: '2.5',
    name: 'Benin',
    value: 13712828
}, {
    id: '3.51',
    parent: '2.5',
    name: 'Togo',
    value: 9053799
}, {
    id: '3.52',
    parent: '2.5',
    name: 'Sierra Leone',
    value: 8791092
}, {
    id: '3.53',
    parent: '2.5',
    name: 'Liberia',
    value: 5418377
}, {
    id: '3.54',
    parent: '2.5',
    name: 'Mauritania',
    value: 4862989
}, {
    id: '3.55',
    parent: '2.5',
    name: 'Gambia',
    value: 2773168
}, {
    id: '3.56',
    parent: '2.5',
    name: 'Guinea-Bissau',
    value: 2150842
}, {
    id: '3.57',
    parent: '2.5',
    name: 'Cape Verde',
    value: 598682
}, {
    id: '3.58',
    parent: '2.5',
    name: 'Saint Helena',
    value: 5314
},

{
    id: '2.3',
    parent: '1.1',
    name: 'North Africa'
},

{
    id: '3.30',
    parent: '2.3',
    name: 'Egypt',
    value: 112716599
}, {
    id: '3.31',
    parent: '2.3',
    name: 'Sudan',
    value: 48109006
}, {
    id: '3.32',
    parent: '2.3',
    name: 'Algeria',
    value: 45606481
}, {
    id: '3.33',
    parent: '2.3',
    name: 'Morocco',
    value: 37840044
}, {
    id: '3.34',
    parent: '2.3',
    name: 'Tunisia',
    value: 12458223
}, {
    id: '3.35',
    parent: '2.3',
    name: 'Libya',
    value: 6888388
}, {
    id: '3.36',
    parent: '2.3',
    name: 'Western Sahara',
    value: 587259
},

{
    id: '2.2',
    parent: '1.1',
    name: 'Central Africa'
},

{
    id: '3.21',
    parent: '2.2',
    name: 'DR Congo',
    value: 102262809
}, {
    id: '3.22',
    parent: '2.2',
    name: 'Angola',
    value: 36684203
}, {
    id: '3.23',
    parent: '2.2',
    name: 'Cameroon',
    value: 28647293
}, {
    id: '3.24',
    parent: '2.2',
    name: 'Chad',
    value: 18278568
}, {
    id: '3.25',
    parent: '2.2',
    name: 'Congo',
    value: 6106869
}, {
    id: '3.26',
    parent: '2.2',
    name: 'Central African Republic',
    value: 5742316
}, {
    id: '3.27',
    parent: '2.2',
    name: 'Gabon',
    value: 2436567
}, {
    id: '3.28',
    parent: '2.2',
    name: 'Equatorial Guinea',
    value: 1714672
}, {
    id: '3.29',
    parent: '2.2',
    name: 'São Tomé and Príncipe',
    value: 231856
},

{
    id: '2.4',
    parent: '1.1',
    name: 'South America'
},

{
    id: '3.37',
    parent: '2.4',
    name: 'South Africa',
    value: 60414495
}, {
    id: '3.38',
    parent: '2.4',
    name: 'Botswana',
    value: 2675353
}, {
    id: '3.39',
    parent: '2.4',
    name: 'Namibia',
    value: 2604172
}, {
    id: '3.40',
    parent: '2.4',
    name: 'Lesotho',
    value: 2330318
}, {
    id: '3.41',
    parent: '2.4',
    name: 'Eswatini',
    value: 1210822
},

/** *********/

/* America */
{
    id: '2.9',
    parent: '1.2',
    name: 'South America'
},

{
    id: '3.100',
    parent: '2.9',
    name: 'Brazil',
    value: 216422446
}, {
    id: '3.101',
    parent: '2.9',
    name: 'Colombia',
    value: 52085168
}, {
    id: '3.102',
    parent: '2.9',
    name: 'Argentina',
    value: 45773884
}, {
    id: '3.103',
    parent: '2.9',
    name: 'Peru',
    value: 34352719
}, {
    id: '3.104',
    parent: '2.9',
    name: 'Venezuela',
    value: 28838499
}, {
    id: '3.105',
    parent: '2.9',
    name: 'Chile',
    value: 19629590
}, {
    id: '3.106',
    parent: '2.9',
    name: 'Ecuador',
    value: 18190484
}, {
    id: '3.107',
    parent: '2.9',
    name: 'Bolivia',
    value: 12388571
}, {
    id: '3.108',
    parent: '2.9',
    name: 'Paraguay',
    value: 6861524
}, {
    id: '3.109',
    parent: '2.9',
    name: 'Uruguay',
    value: 3423109
}, {
    id: '3.110',
    parent: '2.9',
    name: 'Guyana',
    value: 813834
}, {
    id: '3.111',
    parent: '2.9',
    name: 'Suriname',
    value: 623237
}, {
    id: '3.112',
    parent: '2.9',
    name: 'French Guiana',
    value: 312155
}, {
    id: '3.113',
    parent: '2.9',
    name: 'Falkland Islands',
    value: 3791
},

{
    id: '2.8',
    parent: '1.2',
    name: 'Northern America'
},

{
    id: '3.95',
    parent: '2.8',
    name: 'United States',
    value: 339996564
}, {
    id: '3.96',
    parent: '2.8',
    name: 'Canada',
    value: 38781292
}, {
    id: '3.97',
    parent: '2.8',
    name: 'Bermuda',
    value: 64069
}, {
    id: '3.98',
    parent: '2.8',
    name: 'Greenland',
    value: 56643
}, {
    id: '3.99',
    parent: '2.8',
    name: 'Saint Pierre and Miquelon',
    value: 5840
},

{
    id: '2.7',
    parent: '1.2',
    name: 'Central America'
},

{
    id: '3.87',
    parent: '2.7',
    name: 'Mexico',
    value: 128455567
}, {
    id: '3.88',
    parent: '2.7',
    name: 'Guatemala',
    value: 18092026
}, {
    id: '3.89',
    parent: '2.7',
    name: 'Honduras',
    value: 10593798
}, {
    id: '3.90',
    parent: '2.7',
    name: 'Nicaragua',
    value: 7046311
}, {
    id: '3.91',
    parent: '2.7',
    name: 'El Salvador',
    value: 6364943
}, {
    id: '3.92',
    parent: '2.7',
    name: 'Costa Rica',
    value: 5212173
}, {
    id: '3.93',
    parent: '2.7',
    name: 'Panama',
    value: 4468087
}, {
    id: '3.94',
    parent: '2.7',
    name: 'Belize',
    value: 410825
},

{
    id: '2.6',
    parent: '1.2',
    name: 'Caribbean'
},

{
    id: '3.59',
    parent: '2.6',
    name: 'Haiti',
    value: 11724764
}, {
    id: '3.60',
    parent: '2.6',
    name: 'Dominican Republic',
    value: 11332973
}, {
    id: '3.61',
    parent: '2.6',
    name: 'Cuba',
    value: 11194449
}, {
    id: '3.62',
    parent: '2.6',
    name: 'Puerto Rico',
    value: 3260314
}, {
    id: '3.63',
    parent: '2.6',
    name: 'Jamaica',
    value: 2825544
}, {
    id: '3.64',
    parent: '2.6',
    name: 'Trinidad and Tobago',
    value: 1534937
}, {
    id: '3.65',
    parent: '2.6',
    name: 'Bahamas',
    value: 412624
}, {
    id: '3.66',
    parent: '2.6',
    name: 'Guadeloupe',
    value: 395839
}, {
    id: '3.67',
    parent: '2.6',
    name: 'Martinique',
    value: 366981
}, {
    id: '3.68',
    parent: '2.6',
    name: 'Barbados',
    value: 281996
}, {
    id: '3.69',
    parent: '2.6',
    name: 'Curaçao ',
    value: 192077
}, {
    id: '3.70',
    parent: '2.6',
    name: 'Saint Lucia',
    value: 180251
}, {
    id: '3.71',
    parent: '2.6',
    name: 'Grenada',
    value: 126184
}, {
    id: '3.72',
    parent: '2.6',
    name: 'Aruba',
    value: 106277
}, {
    id: '3.73',
    parent: '2.6',
    name: 'Saint Vincent and the Grenadines',
    value: 103699
}, {
    id: '3.74',
    parent: '2.6',
    name: 'U.S. Virgin Islands',
    value: 98750
}, {
    id: '3.75',
    parent: '2.6',
    name: 'Antigua and Barbuda',
    value: 94298
}, {
    id: '3.76',
    parent: '2.6',
    name: 'Dominica',
    value: 73040
}, {
    id: '3.77',
    parent: '2.6',
    name: 'Cayman Islands ',
    value: 69310
}, {
    id: '3.78',
    parent: '2.6',
    name: 'Saint Kitts and Nevis',
    value: 47755
}, {
    id: '3.79',
    parent: '2.6',
    name: 'Turks and Caicos Islands',
    value: 46062
}, {
    id: '3.80',
    parent: '2.6',
    name: 'Sint Maarten',
    value: 44222
}, {
    id: '3.81',
    parent: '2.6',
    name: 'Saint Martin',
    value: 32077
}, {
    id: '3.82',
    parent: '2.6',
    name: 'British Virgin Islands',
    value: 31538
}, {
    id: '3.83',
    parent: '2.6',
    name: 'Caribbean Netherlands',
    value: 27148
}, {
    id: '3.84',
    parent: '2.6',
    name: 'Anguilla',
    value: 15900
}, {
    id: '3.85',
    parent: '2.6',
    name: 'Saint Barthélemy',
    value: 10994
}, {
    id: '3.86',
    parent: '2.6',
    name: 'Montserrat',
    value: 4387
},
/** *********/

/* Asia */
{
    id: '2.13',
    parent: '1.3',
    name: 'Southern Asia'
},

{
    id: '3.138',
    parent: '2.13',
    name: 'India',
    value: 1428627663
}, {
    id: '3.139',
    parent: '2.13',
    name: 'Pakistan',
    value: 240485658
}, {
    id: '3.140',
    parent: '2.13',
    name: 'Bangladesh',
    value: 172954319
}, {
    id: '3.141',
    parent: '2.13',
    name: 'Iran',
    value: 89172767
}, {
    id: '3.142',
    parent: '2.13',
    name: 'Afghanistan',
    value: 42239854
}, {
    id: '3.143',
    parent: '2.13',
    name: 'Nepal',
    value: 30896590
}, {
    id: '3.144',
    parent: '2.13',
    name: 'Sri Lanka',
    value: 21893579
}, {
    id: '3.145',
    parent: '2.13',
    name: 'Bhutan',
    value: 787425
}, {
    id: '3.146',
    parent: '2.13',
    name: 'Maldives',
    value: 523787
},

{
    id: '2.11',
    parent: '1.3',
    name: 'Eastern Asia'
},

{
    id: '3.119',
    parent: '2.11',
    name: 'China',
    value: 1425671352
}, {
    id: '3.120',
    parent: '2.11',
    name: 'Japan',
    value: 123294513
}, {
    id: '3.121',
    parent: '2.11',
    name: 'South Korea',
    value: 51784059
}, {
    id: '3.122',
    parent: '2.11',
    name: 'North Korea',
    value: 26160822
}, {
    id: '3.123',
    parent: '2.11',
    name: 'Taiwan',
    value: 23923277
}, {
    id: '3.124',
    parent: '2.11',
    name: 'Hong Kong',
    value: 7491609
}, {
    id: '3.125',
    parent: '2.11',
    name: 'Mongolia',
    value: 3447157
}, {
    id: '3.126',
    parent: '2.11',
    name: 'Macao',
    value: 704150
},

{
    id: '2.12',
    parent: '1.3',
    name: 'South-Eastern Asia'
},

{
    id: '3.127',
    parent: '2.12',
    name: 'Indonesia',
    value: 277534123
}, {
    id: '3.128',
    parent: '2.12',
    name: 'Philippines',
    value: 117337368
}, {
    id: '3.129',
    parent: '2.12',
    name: 'Vietnam',
    value: 98858950
}, {
    id: '3.130',
    parent: '2.12',
    name: 'Thailand',
    value: 71801279
}, {
    id: '3.131',
    parent: '2.12',
    name: 'Myanmar',
    value: 54577997
}, {
    id: '3.132',
    parent: '2.12',
    name: 'Malaysia',
    value: 34308525
}, {
    id: '3.133',
    parent: '2.12',
    name: 'Cambodia',
    value: 16944826
}, {
    id: '3.134',
    parent: '2.12',
    name: 'Laos',
    value: 7633779
}, {
    id: '3.135',
    parent: '2.12',
    name: 'Singapore',
    value: 6014723
}, {
    id: '3.136',
    parent: '2.12',
    name: 'East Timor',
    value: 1360596
}, {
    id: '3.137',
    parent: '2.12',
    name: 'Brunei',
    value: 452524
},

{
    id: '2.14',
    parent: '1.3',
    name: 'Western Asia'
},

{
    id: '3.147',
    parent: '2.14',
    name: 'Iraq',
    value: 45504560
}, {
    id: '3.148',
    parent: '2.14',
    name: 'Turkey',
    value: 85816199
}, {
    id: '3.149',
    parent: '2.14',
    name: 'Saudi Arabia',
    value: 36947025
}, {
    id: '3.150',
    parent: '2.14',
    name: 'Yemen',
    value: 34449825
}, {
    id: '3.151',
    parent: '2.14',
    name: 'Syria',
    value: 23227014
}, {
    id: '3.152',
    parent: '2.14',
    name: 'Jordan',
    value: 11337053
}, {
    id: '3.153',
    parent: '2.14',
    name: 'Azerbaijan',
    value: 10412652
}, {
    id: '3.154',
    parent: '2.14',
    name: 'United Arab Emirates',
    value: 9516871
}, {
    id: '3.155',
    parent: '2.14',
    name: 'Israel',
    value: 9174520
}, {
    id: '3.156',
    parent: '2.14',
    name: 'Palestine',
    value: 5371230
}, {
    id: '3.157',
    parent: '2.14',
    name: 'Lebanon',
    value: 5353930
}, {
    id: '3.158',
    parent: '2.14',
    name: 'Oman',
    value: 4644384
}, {
    id: '3.159',
    parent: '2.14',
    name: 'Kuwait',
    value: 4310108
}, {
    id: '3.160',
    parent: '2.14',
    name: 'Georgia',
    value: 3728282
}, {
    id: '3.161',
    parent: '2.14',
    name: 'Armenia',
    value: 2777971
}, {
    id: '3.162',
    parent: '2.14',
    name: 'Qatar',
    value: 2716391
}, {
    id: '3.163',
    parent: '2.14',
    name: 'Bahrain',
    value: 1485510
}, {
    id: '3.164',
    parent: '2.14',
    name: 'Cyprus',
    value: 1260138
},

{
    id: '2.10',
    parent: '1.3',
    name: 'Central Asia'
},

{
    id: '3.114',
    parent: '2.10',
    name: 'Uzbekistan',
    value: 35163944
}, {
    id: '3.115',
    parent: '2.10',
    name: 'Kazakhstan',
    value: 19606634
}, {
    id: '3.116',
    parent: '2.10',
    name: 'Tajikistan',
    value: 10143543
}, {
    id: '3.117',
    parent: '2.10',
    name: 'Kyrgyzstan',
    value: 6735348
}, {
    id: '3.118',
    parent: '2.10',
    name: 'Turkmenistan',
    value: 6516100
},
/** *********/

/* Europe */
{
    id: '2.15',
    parent: '1.4',
    name: 'Eastern Europe'
},

{
    id: '3.165',
    parent: '2.15',
    name: 'Russia',
    value: 144444359
}, {
    id: '3.166',
    parent: '2.15',
    name: 'Poland',
    value: 41026068
}, {
    id: '3.167',
    parent: '2.15',
    name: 'Ukraine',
    value: 36744634
}, {
    id: '3.168',
    parent: '2.15',
    name: 'Romania',
    value: 19892812
}, {
    id: '3.169',
    parent: '2.15',
    name: 'Czechia',
    value: 10495295
}, {
    id: '3.170',
    parent: '2.15',
    name: 'Hungary',
    value: 9604000
}, {
    id: '3.171',
    parent: '2.15',
    name: 'Belarus',
    value: 9498238
}, {
    id: '3.172',
    parent: '2.15',
    name: 'Bulgaria',
    value: 6687717
}, {
    id: '3.173',
    parent: '2.15',
    name: 'Slovakia',
    value: 5795199
}, {
    id: '3.174',
    parent: '2.15',
    name: 'Moldova',
    value: 3435931
},

{
    id: '2.16',
    parent: '1.4',
    name: 'Northern Europe'
},

{
    id: '3.175',
    parent: '2.16',
    name: 'United Kingdom',
    value: 67736802
}, {
    id: '3.176',
    parent: '2.16',
    name: 'Sweden',
    value: 10612086
}, {
    id: '3.177',
    parent: '2.16',
    name: 'Denmark',
    value: 5910913
}, {
    id: '3.178',
    parent: '2.16',
    name: 'Finland',
    value: 5545475
}, {
    id: '3.179',
    parent: '2.16',
    name: 'Norway',
    value: 5474360
}, {
    id: '3.180',
    parent: '2.16',
    name: 'Ireland',
    value: 5056935
}, {
    id: '3.181',
    parent: '2.16',
    name: 'Lithuania',
    value: 2718352
}, {
    id: '3.182',
    parent: '2.16',
    name: 'Latvia',
    value: 1830212
}, {
    id: '3.183',
    parent: '2.16',
    name: 'Estonia',
    value: 1322766
}, {
    id: '3.184',
    parent: '2.16',
    name: 'Iceland',
    value: 375319
}, {
    id: '3.185',
    parent: '2.16',
    name: 'Jersey',
    value: 111803
}, {
    id: '3.186',
    parent: '2.16',
    name: 'Isle of Man',
    value: 84710
}, {
    id: '3.187',
    parent: '2.16',
    name: 'Guernsey',
    value: 63544
}, {
    id: '3.188',
    parent: '2.16',
    name: 'Faroe Islands',
    value: 53270
},

{
    id: '2.17',
    parent: '1.4',
    name: 'Southern Europe'
},

{
    id: '3.189',
    parent: '2.17',
    name: 'Italy',
    value: 58870763
}, {
    id: '3.190',
    parent: '2.17',
    name: 'Spain',
    value: 47519628
}, {
    id: '3.191',
    parent: '2.17',
    name: 'Greece',
    value: 10341277
}, {
    id: '3.192',
    parent: '2.17',
    name: 'Portugal',
    value: 10247605
}, {
    id: '3.193',
    parent: '2.17',
    name: 'Serbia',
    value: 7149077
}, {
    id: '3.194',
    parent: '2.17',
    name: 'Croatia',
    value: 4008617
}, {
    id: '3.195',
    parent: '2.17',
    name: 'Bosnia and Herzegovina',
    value: 3210848
}, {
    id: '3.196',
    parent: '2.17',
    name: 'Albania',
    value: 2832439
}, {
    id: '3.197',
    parent: '2.17',
    name: 'Slovenia',
    value: 2119675
}, {
    id: '3.198',
    parent: '2.17',
    name: 'North Macedonia',
    value: 2085679
}, {
    id: '3.199',
    parent: '2.17',
    name: 'Kosovo',
    value: 1663595
}, {
    id: '3.200',
    parent: '2.17',
    name: 'Montenegro',
    value: 626485
}, {
    id: '3.201',
    parent: '2.17',
    name: 'Malta',
    value: 535065
}, {
    id: '3.202',
    parent: '2.17',
    name: 'Andorra',
    value: 80088
}, {
    id: '3.203',
    parent: '2.17',
    name: 'San Marino',
    value: 33642
}, {
    id: '3.204',
    parent: '2.17',
    name: 'Gibraltar',
    value: 32688
}, {
    id: '3.205',
    parent: '2.17',
    name: 'Vatican City',
    value: 518
},

{
    id: '2.18',
    parent: '1.4',
    name: 'Western Europe'
},

{
    id: '3.206',
    parent: '2.18',
    name: 'Germany',
    value: 83294633
}, {
    id: '3.207',
    parent: '2.18',
    name: 'France',
    value: 64756584
}, {
    id: '3.208',
    parent: '2.18',
    name: 'Netherlands',
    value: 17618299
}, {
    id: '3.209',
    parent: '2.18',
    name: 'Belgium',
    value: 11686140
}, {
    id: '3.210',
    parent: '2.18',
    name: 'Austria',
    value: 8958961
}, {
    id: '3.211',
    parent: '2.18',
    name: 'Switzerland',
    value: 8796669
}, {
    id: '3.212',
    parent: '2.18',
    name: 'Luxembourg',
    value: 654768
}, {
    id: '3.213',
    parent: '2.18',
    name: 'Liechtenstein',
    value: 39585
}, {
    id: '3.214',
    parent: '2.18',
    name: 'Monaco',
    value: 36298
},
/** *********/

/* Oceania */
{
    id: '2.19',
    parent: '1.5',
    name: 'Australia and New Zealand'
},

{
    id: '3.215',
    parent: '2.19',
    name: 'Australia',
    value: 26439112
}, {
    id: '3.216',
    parent: '2.19',
    name: 'New Zealand',
    value: 5228100
},

{
    id: '2.20',
    parent: '1.5',
    name: 'Melanesia'
},

{
    id: '3.217',
    parent: '2.20',
    name: 'Papua New Guinea',
    value: 10329931
}, {
    id: '3.218',
    parent: '2.20',
    name: 'Fiji',
    value: 936376
}, {
    id: '3.219',
    parent: '2.20',
    name: 'Solomon Islands',
    value: 740425
}, {
    id: '3.220',
    parent: '2.20',
    name: 'Vanuatu',
    value: 334506
}, {
    id: '3.221',
    parent: '2.20',
    name: 'New Caledonia',
    value: 292991
},

{
    id: '2.21',
    parent: '1.5',
    name: 'Micronesia'
},

{
    id: '3.222',
    parent: '2.21',
    name: 'Guam',
    value: 172952
}, {
    id: '3.223',
    parent: '2.21',
    name: 'Kiribati',
    value: 133515
}, {
    id: '3.224',
    parent: '2.21',
    name: 'Micronesia',
    value: 115224
}, {
    id: '3.225',
    parent: '2.21',
    name: 'Northern Mariana Islands',
    value: 49796
}, {
    id: '3.226',
    parent: '2.21',
    name: 'Marshall Islands',
    value: 41996
}, {
    id: '3.227',
    parent: '2.21',
    name: 'Palau',
    value: 18058
}, {
    id: '3.228',
    parent: '2.21',
    name: 'Nauru',
    value: 12780
},

{
    id: '2.22',
    parent: '1.5',
    name: 'Polynesia'
},

{
    id: '3.229',
    parent: '2.22',
    name: 'French Polynesia',
    value: 308872
}, {
    id: '3.230',
    parent: '2.22',
    name: 'Samoa',
    value: 225681
}, {
    id: '3.231',
    parent: '2.22',
    name: 'Tonga',
    value: 107773
}, {
    id: '3.232',
    parent: '2.22',
    name: 'American Samoa',
    value: 43915
}, {
    id: '3.233',
    parent: '2.22',
    name: 'Cook Islands',
    value: 17044
}, {
    id: '3.234',
    parent: '2.22',
    name: 'Wallis and Futuna',
    value: 11502
}, {
    id: '3.235',
    parent: '2.22',
    name: 'Tuvalu',
    value: 11396
}, {
    id: '3.236',
    parent: '2.22',
    name: 'Niue',
    value: 1935
}, {
    id: '3.237',
    parent: '2.22',
    name: 'Tokelau',
    value: 1893
}, {
    id: '3.238',
    parent: '2.22',
    name: 'Pitcairn Islands',
    value: 45
}];


Highcharts.chart('container', {

    chart: {
        height: '100%'
    },

    // Let the center circle be transparent
    colors: ['transparent'].concat(Highcharts.getOptions().colors),

    title: {
        text: 'World population 2023'
    },

    subtitle: {
        text: 'Source <a href="https://en.wikipedia.org/wiki/List_of_countries_by_population_(United_Nations)">Wikipedia</a>'
    },

    series: [{
        type: 'sunburst',
        data: data,
        name: 'Root',
        allowTraversingTree: true,
        borderRadius: 3,
        cursor: 'pointer',
        dataLabels: {
            format: '{point.name}',
            filter: {
                property: 'innerArcLength',
                operator: '>',
                value: 16
            }
        },
        levels: [{
            level: 1,
            levelIsConstant: false,
            dataLabels: {
                filter: {
                    property: 'outerArcLength',
                    operator: '>',
                    value: 64
                }
            }
        }, {
            level: 2,
            colorByPoint: true
        },
        {
            level: 3,
            colorVariation: {
                key: 'brightness',
                to: -0.5
            }
        }, {
            level: 4,
            colorVariation: {
                key: 'brightness',
                to: 0.5
            }
        }]

    }],

    tooltip: {
        headerFormat: '',
        pointFormat: 'The population of <b>{point.name}</b> is <b>' +
            '{point.value}</b>'
    }
});
