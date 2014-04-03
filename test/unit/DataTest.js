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
};

DataTest.prototype.testSeriesMappingWithSpecifiedLabelCol = function () {
	var expected,
		data;

	Highcharts.data({
		csv: 'Val1,Val2,D1,L1\n2,3,2013-01-01,one\n3,4,2013-01-02,two\n4,4,2013-01-03,three',
		complete: function (result) {
			data = result;
		},
		seriesMapping: [{
			x: 2,
			name: 3
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
			data: [{x: Date.UTC(2013,0,1), y: 2, name: 'one'}, {x: Date.UTC(2013,0,2), y: 3, name: 'two'}, {x: Date.UTC(2013,0,3), y: 4, name: 'three'}],
			name: 'Val1'
		}, {
			data: [[Date.UTC(2013,0,1), 3], [Date.UTC(2013,0,2), 4], [Date.UTC(2013,0,3), 4]],
			name: 'Val2'
		}]
	};

	assertEquals('Data result', expected, data);
};

DataTest.prototype.testSeriesBuilderWith3Cols = function () {
	var testData = [[0,10,20], [1,11,21], [2,12,22]];

	var builder = new SeriesBuilder();
	builder.addNextColumnReader();
	builder.addNextColumnReader();
	builder.addNextColumnReader();
	var cursor = new ColumnCursor(testData.length, [builder]);
	builder.populateColumns(cursor);

	assertEquals([0,1,2], builder.read(testData, 0, cursor));
	assertEquals([10,11,12], builder.read(testData, 1, cursor));
	assertEquals([20,21,22], builder.read(testData, 2, cursor));
};

DataTest.prototype.testSeriesBuilderWith2Cols = function () {
	var testData = [[0,10,20], [1,11,21], [2,12,22]];

	var builder = new SeriesBuilder();
	builder.addNextColumnReader();
	builder.addNextColumnReader();
	var cursor = new ColumnCursor(testData.length, [builder]);
	builder.populateColumns(cursor);

	assertEquals([0,1], builder.read(testData, 0, cursor));
	assertEquals([10,11], builder.read(testData, 1, cursor));
	assertEquals([20,21], builder.read(testData, 2, cursor));
};

DataTest.prototype.testSeriesBuilderWithSpecificCols = function () {
	var testData = [[0,10,20], [1,11,21], [2,12,22]];

	var builder = new SeriesBuilder();
	builder.addColumnReader(1);
	builder.addColumnReader(1);
	builder.addColumnReader(2);
	builder.addColumnReader(0);
	var cursor = new ColumnCursor(testData.length, [builder]);
	builder.populateColumns(cursor);

	assertEquals([1,1,2, 0], builder.read(testData, 0, cursor));
	assertEquals([11,11,12, 10], builder.read(testData, 1, cursor));
	assertEquals([21,21,22, 20], builder.read(testData, 2, cursor));
};

DataTest.prototype.testSeriesBuilderWithSpecificConfig = function () {
	var testData = [[0,10,20], [1,11,21], [2,12,22]];

	var builder = new SeriesBuilder();
	builder.addColumnReader(1, 'name');
	builder.addColumnReader(1, 'low');
	builder.addColumnReader(2, 'high');
	builder.addColumnReader(0, 'x');
	var cursor = new ColumnCursor(testData.length, [builder]);
	builder.populateColumns(cursor);

	assertEquals({name:1, low: 1, high: 2, x: 0}, builder.read(testData, 0, cursor));
	assertEquals({name:11, low: 11, high: 12, x: 10}, builder.read(testData, 1, cursor));
	assertEquals({name:21, low: 21, high: 22, x: 20}, builder.read(testData, 2, cursor));
};

DataTest.prototype.testSeriesBuilderNextColWithConfig = function () {
	var testData = [[0,10,20], [1,11,21], [2,12,22]];

	var builder = new SeriesBuilder();
	builder.addNextColumnReader('x');
	builder.addNextColumnReader('low');
	builder.addNextColumnReader('high');
	var cursor = new ColumnCursor(testData.length, [builder]);
	builder.populateColumns(cursor);

	assertEquals({x:0, low: 1, high: 2}, builder.read(testData, 0, cursor));
	assertEquals({x:10, low: 11, high: 12}, builder.read(testData, 1, cursor));
	assertEquals({x:20, low: 21, high: 22}, builder.read(testData, 2, cursor));
};

DataTest.prototype.testSeriesBuilderNextColWithMixedConfig = function () {
	var testData = [[0,10,20], [1,11,21], [2,12,22], [3,13,23], [4,14,24]];

	var builders = [];
	var builder = new SeriesBuilder();
	builder.addNextColumnReader('x');
	builder.addNextColumnReader('low');
	builder.addNextColumnReader('high');
	builders.push(builder);

	builder = new SeriesBuilder();
	builder.addColumnReader(0, 'x');
	builder.addColumnReader(1, 'y');
	builders.push(builder);

	var cursor = new ColumnCursor(testData.length, builders);
	assertEquals([2, 3, 4], cursor.freeIndexes);
	builders[0].populateColumns(cursor);
	builders[1].populateColumns(cursor);
	assertEquals([], cursor.freeIndexes);

	assertEquals({x:2, low: 3, high: 4}, builders[0].read(testData, 0, cursor));
	assertEquals([0, 1], builders[1].read(testData, 0, cursor));
//	assertEquals({x:20, low: 21, high: 22}, builder.read(testData, 2, cursor));
};

DataTest.prototype.testSeriesBuilderNextColWithSparseConfig = function () {
	var testData = [['x2013-01-01', 'x2013-01-02', 'x2013-01-03'], [2,3,4], ['x2013-02-01', 'x2013-02-02', 'x2013-02-03'], [3,4,4]];

	var builders = [];
	var builder = new SeriesBuilder();
	builder.addColumnReader(0, 'x');
	builder.addNextColumnReader('y');
	builders.push(builder);

	builder = new SeriesBuilder();
	builder.addColumnReader(2, 'x');
	builder.addNextColumnReader('y');
	builders.push(builder);

	var cursor = new ColumnCursor(testData.length, builders);
	assertEquals([1, 3], cursor.freeIndexes);
	builders[0].populateColumns(cursor);
	builders[1].populateColumns(cursor);
	assertEquals([], cursor.freeIndexes);
	
//	assertEquals({x:2, low: 3, high: 4}, builders[0].read(testData, 0, cursor));
//	assertEquals([0, 1], builders[1].read(testData, 0, cursor));
//	assertEquals({x:20, low: 21, high: 22}, builder.read(testData, 2, cursor));
};

DataTest.prototype.testSeriesBuilderHasReader = function () {
	var testData = [[0,10,20], [1,11,21], [2,12,22]];

	var builder = new SeriesBuilder();
	builder.addColumnReader(1, 'name');
	builder.addColumnReader(1, 'low');
	builder.addColumnReader(2, 'high');
	builder.addColumnReader(0, 'x');

	assertTrue(builder.hasReader('name'));
	assertTrue(builder.hasReader('low'));
	assertTrue(builder.hasReader('high'));
	assertTrue(builder.hasReader('x'));
	assertFalse(builder.hasReader('meep'));
};

DataTest.prototype.testFailingDemoData = function () {
	var data;

	Highcharts.data({
		csv: 'row,Tokyo,New York,Berlin,London\n' +
			'1,7,-0.2,-0.9,3.9\n' +
			'2,6.9,0.8,0.6,4.2\n' +
			'3,9.5,5.7,3.5,5.7\n' +
			'4,14.5,11.3,8.4,8.5\n' +
			'5,18.2,17,13.5,11.9\n' +
			'6,21.5,22,17,15.2\n' +
			'7,25.2,24.8,18.6,17\n' +
			'8,26.5,24.1,17.9,16.6\n' +
			'9,23.3,20.1,14.3,14.2\n' +
			'10,18.3,14.1,9,10.3\n' +
			'11,13.9,8.6,3.9,6.6\n' +
			'12,9.6,2.5,1,4.8',
		complete: function (result) {
			data = result;
		}
	});

	assertEquals('Series length', 4, data.series.length);
};
