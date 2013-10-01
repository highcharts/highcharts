$(function () {
    $('#container').highcharts({

	    chart: {
	        type: 'column'
	    },
	    
	    title: {
	        text: 'Highcharts Drilldown Plugin - Columns'
	    },

	    xAxis: {
	        categories: true
	    },
	    
	    legend: {
	        enabled: false
	    },
	    
	    plotOptions: {
	        series: {
	            dataLabels: {
	                enabled: true
	            }
	        }
	    },
	    
	    series: [{
	        name: 'Overview',
	        colorByPoint: true,
	        data: [{
	            name: 'Fruits',
	            y: 10,
	            drilldown: 'fruits'
	        }, {
	            name: 'Cars',
	            y: 12,
	            drilldown: 'cars'
	        }, {
	            name: 'Countries',
	            y: 8
	        }]
	    }], 

	    drilldown: {
	        series: [{
	            id: 'fruits',
	            name: 'Fruits',
	            data: [
	                ['Apples', 4],
	                ['Pears', 6],
	                ['Oranges', 2],
	                ['Grapes', 8]
	            ]
	        }, {
	            id: 'cars',
	            name: 'Cars',
	            data: [{
	                name: 'Toyota', 
	                y: 4,
	                drilldown: 'toyota'
	            },
	            ['Volkswagen', 3],
	            ['Opel', 5]
	            ]
	        }, {
	            id: 'toyota',
	            name: 'Toyota',
	            data: [
	                ['RAV4', 3],
	                ['Corolla', 1],
	                ['Carina', 4],
	                ['Land Cruiser', 5]
	            ]
	        }]
	    }
	});
    
});