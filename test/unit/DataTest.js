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
			label: 3
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
			data: [{x: Date.UTC(2013,0,1), y: 2, label: 'one'}, {x: Date.UTC(2013,0,2), y: 3, label: 'two'}, {x: Date.UTC(2013,0,3), y: 4, label: 'three'}],
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
	builder.addColumnReader(1, 'label');
	builder.addColumnReader(1, 'low');
	builder.addColumnReader(2, 'high');
	builder.addColumnReader(0, 'x');
	var cursor = new ColumnCursor(testData.length, [builder]);
	builder.populateColumns(cursor);

	assertEquals({label:1, low: 1, high: 2, x: 0}, builder.read(testData, 0, cursor));
	assertEquals({label:11, low: 11, high: 12, x: 10}, builder.read(testData, 1, cursor));
	assertEquals({label:21, low: 21, high: 22, x: 20}, builder.read(testData, 2, cursor));
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

