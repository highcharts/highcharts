IssuesTest = TestCase("IssuesTest");

/**
 * Setup:
 * - Creates the container div object on the page.
 */
IssuesTest.prototype.setUp = function() {
	assertUndefined(this.container);
	/*:DOC container = <div style="height: 200px; width: 200px"></div>*/
	assertNotUndefined(this.container);
};

IssuesTest.prototype.tearDown = function () {
};

IssuesTest.prototype.test1460 = function () {
	
	this.container.style.display = 'none';
	this.container.style.width = 'auto';

	var chart = new Highcharts.Chart({
	    "chart": {
	        "renderTo": this.container,
	        type: 'pie'
	    },
	        "series": [{
	        "data": [{
	            "name": "Product A",
	                "y": 117
	        }, {
	            "name": "Product B",
	                "y": 110
	        }]
	    }]
	});

	assertEquals(
		'The width of a chart rendered to a hidden div',
		600,
		chart.chartWidth
	);

	this.container.style.display = '';
	this.container.style.width = '200px';


}

