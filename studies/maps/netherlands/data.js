function getData (callback) {
    $.get('data.csv', function(data) {
        // Split the lines
        var lines = data.split('\n'),
            result = {
                "2013": []
            };

        // Iterate over the lines and add categories or series
        $.each(lines, function(lineNo, line) {
            var items = line.split(',');
            
            // header line containes categories
            if (lineNo == 0) { 
                // IGNORE
            } else {
                // 2013 as a seperate series
                result["2013"].push({
                    name: items[0],
                    code: items[0],
                    value: items[1]
                });
                // The CSV has the absolute number for 2013, and the growth in the other years,
                // Use these to calculate backwards.
                var d2013 = parseInt(items[1]),
                    d2012 = d2013 - items[6],
                    d2011 = d2012 - items[5],
                    d2010 = d2011 - items[4],
                    d2009 = d2010 - items[3];

                // For each municipality add a series with the absolute numbers
                result[items[0] + "absoluut"] = {
                    name: items[0],
                    data: [
                        d2009,
                        d2010,
                        d2011,
                        d2012,
                        d2013
                    ]
                }

                // For each municipality add a series with the growth
                result[items[0] + "groei"] = {
                    name: items[0],
                    data: [
                        parseInt(items[3]),
                        parseInt(items[4]),
                        parseInt(items[5]),
                        parseInt(items[6]),
                    ]
                }           
            }            
        });
        
        // Create the chart
        callback(result);
    });
};
