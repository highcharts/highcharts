var i,j;

var Provinces = [
	"ANT", "FBR", "WFL", "EFL", "LIM", "BRU", "WBR", "HAI", "LIE", "LUX", "NAM"
];

var MAPDATA = [],
	PIEDATA = [];

for (i=0; i <= 3; i++) {
	var data = [], 
		sum = 0;

	Highcharts.each(Provinces, function (province, i) {
		console.log(i);
		var val = Math.floor(Math.random()*(100/(i+1)));
		data.push({
			code: province,
			value: val
		});
		sum += val;
	});

	MAPDATA.push(data);
	PIEDATA.push({
		y: sum
	});
}

var i,j;
