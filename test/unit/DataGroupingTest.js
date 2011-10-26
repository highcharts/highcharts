var DataGroupingTest = TestCase("DataGroupingTest");

DataGroupingTest.prototype.testApproxSum = function () {

	// Case 1: nulls exclusively
	var arr = [];
	arr.hasNulls = true;
	assertNull('Sum non-null values', approximations.sum(arr));

	// Case 2: nulls and numbers
	var arr = [1,2,3,4];
	arr.hasNulls = true;
	assertEquals('Sum nulls and numbers', 10, approximations.sum(arr));

	// Case 3: numbers only
	var arr = [1,2,3,4];
	assertEquals('Sum non-null values', 10, approximations.sum(arr));

	// Case 4: no values at all
	var arr = [];
	assertUndefined('Sum empty array', approximations.sum(arr));
};

DataGroupingTest.prototype.testApproxAverage = function () {

	// Case 1: nulls exclusively
	var arr = [];
	arr.hasNulls = true;
	assertNull('Average non-null values', approximations.average(arr));

	// Case 2: nulls and numbers
	var arr = [1,2,3,4];
	arr.hasNulls = true;
	assertEquals('Average nulls and numbers', 2.5, approximations.average(arr));

	// Case 3: numbers only
	var arr = [1,2,3,4];
	assertEquals('Average non-null values', 2.5, approximations.average(arr));

	// Case 4: no values at all
	var arr = [];
	assertUndefined('Average empty array', approximations.average(arr));
};

DataGroupingTest.prototype.testApproxOpen = function () {

	// Case 1: nulls exclusively
	var arr = [];
	arr.hasNulls = true;
	assertNull('Open non-null values', approximations.open(arr));

	// Case 2: nulls and numbers
	var arr = [1,2,3,4];
	arr.hasNulls = true;
	assertEquals('Open nulls and numbers', 1, approximations.open(arr));

	// Case 3: numbers only
	var arr = [1,2,3,4];
	assertEquals('Open non-null values', 1, approximations.open(arr));

	// Case 4: no values at all
	var arr = [];
	assertUndefined('Open empty array', approximations.open(arr));
};

DataGroupingTest.prototype.testApproxHigh = function () {

	// Case 1: nulls exclusively
	var arr = [];
	arr.hasNulls = true;
	assertNull('High non-null values', approximations.high(arr));

	// Case 2: nulls and numbers
	var arr = [1,2,3,4,3];
	arr.hasNulls = true;
	assertEquals('High nulls and numbers', 4, approximations.high(arr));

	// Case 3: numbers only
	var arr = [1,2,3,4,3];
	assertEquals('High non-null values', 4, approximations.high(arr));

	// Case 4: no values at all
	var arr = [];
	assertUndefined('High empty array', approximations.high(arr));
};

DataGroupingTest.prototype.testApproxLow = function () {

	// Case 1: nulls exclusively
	var arr = [];
	arr.hasNulls = true;
	assertNull('Low non-null values', approximations.low(arr));

	// Case 2: nulls and numbers
	var arr = [2,1,2,3,4,3];
	arr.hasNulls = true;
	assertEquals('Low nulls and numbers', 1, approximations.low(arr));

	// Case 3: numbers only
	var arr = [2,1,2,3,4,3];
	assertEquals('Low non-null values', 1, approximations.low(arr));

	// Case 4: no values at all
	var arr = [];
	assertUndefined('Low empty array', approximations.low(arr));
};

DataGroupingTest.prototype.testGroupData = function() {

	// One value each
	var xData = [0, 1, 2, 3],
		yData = [3, 2, 1, 0],
		groupPositions = [0, 1, 2, 3];

	// Add an empty options dataset
	Series.prototype.options = [];
	assertEquals('Sum', '3,2,1,0', Series.prototype.groupData(xData, yData, groupPositions, 'sum')[1].join(','));

	// Two values each
	var xData = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5],
		yData = [1, 1, 1, 1, 1, 1, 1, 1],
		groupPositions = [0, 1, 2, 3];
	assertEquals('Sum', '2,2,2,2', Series.prototype.groupData(xData, yData, groupPositions, 'sum')[1].join(','));

};

