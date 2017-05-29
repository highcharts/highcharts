Highcharts.chart('container', {
    "chart": {
        "type": "pie",
        "width": 300,
        "borderWidth": 1
    },
    "plotOptions": {
        "series": {
            "dataLabels": {
                "enabled": true,
                "style": {
                    "fontSize": "8"
                }
            }
        }
    },
    "title": {
        "text": "Stuffed pie"
    },
    "subtitle": {
        "text": "Data labels should not overflow on sides"
    },
    "tooltip": {
        "valueSuffix": " %"
    },
    "series": [{
        "index": 0,
        "name": "Percentage",
        "data": [
            [
                "1. Cloud ALM services (almPaaS)",
                11
            ],
            [
                "2. Cloud Application Platform service",
                35
            ],
            [
                "3. Cloud BPM platform services (bpmPaaS)",
                10
            ],
            [
                "4. Cloud Integration services (iPaaS)",
                14
            ],
            [
                "5. Cloud Application Security Services",
                9
            ],
            [
                "6. Cloud MFT Servies",
                6
            ],
            [
                "7. Cloud Application Services Governance",
                3
            ],
            [
                "8. Cloud Business Analytics Servies (baPaaS)",
                4
            ],
            [
                "9. Cloud MOM Services",
                2
            ],
            [
                "10. Cloud Database services (dbPaaS)",
                4
            ],
            [
                "11. Cloud Horizontal Portal Services (Portal PaaS)",
                2
            ]
        ]
    }]
});