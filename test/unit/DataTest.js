var DataTest = TestCase("DataTest");

DataTest.prototype.testSeriesMappingIrregularX = function () {
	var expected,
		data;

	Highcharts.data({
		csv: 'D1,Val1,D2,Val2\n2013-01-01,2,2013-02-01,3\n2013-01-02,3,2013-02-02,4\n2013-01-03,4,2013-02-03,4',
		complete: function (result) {
			data = result;
		},
		seriesMapping: [{
			x: 0
		}, {
			x: 2
		}]
	});

	// Test with linked data => the series x should differ
	expected = {
		xAxis: {
			type: 'datetime'
		},
		series: [{
			data: [[Date.UTC(2013,0,1), 2], [Date.UTC(2013,0,2), 3], [Date.UTC(2013,0,3), 4]],
			name: 'Val1'
		}, {
			data: [[Date.UTC(2013,1,1), 3], [Date.UTC(2013,1,2), 4], [Date.UTC(2013,1,3), 4]],
			name: 'Val2'
		}]
	};

	assertEquals('Data result', expected, data);
};

DataTest.prototype.testSeriesMappingSameX = function () {
	var expected,
		data;

	Highcharts.data({
		csv: 'D1,Val1,Val2\n2013-01-01,2,3\n2013-01-02,3,4\n2013-01-03,4,4',
		complete: function (result) {
			data = result;
		},
		seriesMapping: [{
			x: 0
		}, {
			x: 0
		}]
	});

	// Test with linked data => the series x should differ
	expected = {
		xAxis: {
			type: 'datetime'
		},
		series: [{
			data: [[Date.UTC(2013,0,1), 2], [Date.UTC(2013,0,2), 3], [Date.UTC(2013,0,3), 4]],
			name: 'Val1'
		}, {
			data: [[Date.UTC(2013,0,1), 3], [Date.UTC(2013,0,2), 4], [Date.UTC(2013,0,3), 4]],
			name: 'Val2'
		}]
	};

	assertEquals('Data result', expected, data);

	Highcharts.data({
		csv: 'D1,Val1,Val2\n2013-01-01,2,3\n2013-01-02,3,4\n2013-01-03,4,4',
		complete: function (result) {
			data = result;
		},
		seriesMapping: [{
			noXDefined: undefined
		}]
	});

	assertEquals('Data result', expected, data);

	Highcharts.data({
		csv: 'D1,Val1,Val2\n2013-01-01,2,3\n2013-01-02,3,4\n2013-01-03,4,4',
		complete: function (result) {
			data = result;
		},
		noSeriesMappingDefined: []
	});

	assertEquals('Data result', expected, data);
};

DataTest.prototype.testSeriesMappingSameXButXColumnLast = function () {
	var expected,
		data;

	Highcharts.data({
		csv: 'Val1,Val2,D1\n2,3,2013-01-01\n3,4,2013-01-02\n4,4,2013-01-03',
		complete: function (result) {
			data = result;
		},
		seriesMapping: [{
			x: 2
		}, {
			x: 2
		}]
	});

	// Test with linked data => the series x should differ
	expected = {
		xAxis: {
			type: 'datetime'
		},
		series: [{
			data: [[Date.UTC(2013,0,1), 2], [Date.UTC(2013,0,2), 3], [Date.UTC(2013,0,3), 4]],
			name: 'Val1'
		}, {
			data: [[Date.UTC(2013,0,1), 3], [Date.UTC(2013,0,2), 4], [Date.UTC(2013,0,3), 4]],
			name: 'Val2'
		}]
	};

	assertEquals('Data result', expected, data);
}
