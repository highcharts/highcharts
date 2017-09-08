
/*
    Algorithm:
    1. Sort all areas by X value (center)
    2. Go through and "lift" the areas to their correct y-tiles based on
        where they belong relative to the lowest area, using the average area
        size as tilesize.
    3. Now shrink into tiles in the X dimension, by splitting by tilesize. Go
        through and find the next element that has an area that is more than a
        tilesize away. Compress all elements between into a single tile. If
        multiple areas are on the same tile, overflow by pushing out in both
        directions.

    Main issue is that overflow happens only horizontally.
*/


var each = Highcharts.each,
    map = Highcharts.map,
    filter = Highcharts.grep,
    reduce = Highcharts.reduce,
    extend = Highcharts.extend;


// Sort array of areas by x or y center value
// Dimension can be 'x' or 'y'. If unassigned, 'x' is assumed.
function sortAreasByCenter(areas, dimension) {
    var d = dimension || 'x';
    return areas.sort(function (a, b) {
        return a.center[d] - b.center[d];
    });
}


// Explode one dimensional array of areas into a 2D grid, where a threshold
// value determines how far from the lowest area's center an area's center has
// to be in the set dimension to shift it up a row. This stacks, so if an area
// center value is 2x deltaThreshold away, it will be shifted 2 rows. In other
// words, the lowest centers will stay at the first row, and areas are shifted
// up the grid the farther away they are in the chosen dimension. Areas retain
// their original column index. The grid is normalized to avoid negative
// indicies.
//
// Dimension can be 'x' or 'y'. If unassigned, 'y' is assumed.
/*

    -1, 2, 3, 4, 5, 6, 7, 8, 9-

    to

    - , 2,  ,  ,  ,  , 7,  , 9-
    - ,  , 3,  ,  , 6,  ,  ,  -
    -1,  ,  ,  ,  ,  ,  , 8,  -
    - ,  ,  , 4, 5,  ,  ,  ,  -

*/
function explodeToGrid(areas, deltaThreshold, dimension) {
    var grid = [],
        direction = dimension || 'y',
        rowIx,
        i = areas.length,
        min = Infinity;

    // Find min value
    while (i--) {
        if (areas[i].center[direction] < min) {
            min = areas[i].center[direction];
        }
    }

    // Make the grid
    i = areas.length;
    while (i--) {
        rowIx = Math.floor((areas[i].center[direction] - min) / deltaThreshold);
        if (!grid[rowIx]) {
            grid[rowIx] = [];
        }
        grid[rowIx][i] = areas[i];
    }

    return grid;
}


// Shift a grid a number of columns. Affects the first number of rows specified.
function shiftGrid(grid, shiftAmount, rows) {
    var shifted = [];

    // Shift the specified amount
    for (var row = 0, len = rows; row < len; ++row) {
        if (grid[row]) {
            shifted[row] = [];
            for (var col = 0, colLen = grid[row].length; col < colLen; ++col) {
                if (grid[row][col]) {
                    shifted[row][col + shiftAmount] = grid[row][col];
                }
            }
        }
    }
    // Add the unshifted
    for (var i = rows, length = grid.length; i < length; ++i) {
        shifted.push(grid[row]);
    }

    return shifted;
}


// Compress grid columns into tile sizes. If a column contains more than a
// single area per tile, we overflow into neighbor columns and push everything
// out on both sides in the row.
//
// Dimension can be 'x' or 'y', assumed 'x' if undefined.
function compressGridColumns(grid, tilesize, dimension) {
    var compressed = [],
        tiles = [],
        tileIx = 0,
        len = grid.length,
        direction = dimension || 'x',
        min = Infinity,
        overflowMargin = 0;

    // Find reference minimum in the direction
    if (direction === 'x') {
        each(grid, function (row) {
            if (row.length && row[0] && row[0].center.x < min) {
                min = row[0].center.x;
            }
        });
    } else {
        if (grid.length) {
            each(grid[0], function (cell) {
                if (cell && cell.center.y < min) {
                    min = cell.center.y;
                }
            });
        }
    }

    // Rows
    for (var i = 0; i < len; ++i, tiles = [], tileIx = 0) {
        if (grid[i]) {
            // Split columns into tiles
            for (var j = 0, rowLen = grid[i].length; j < rowLen; ++j) {
                if (!grid[i][j]) {
                    continue;
                }

                tileIx = Math.floor(
                    (grid[i][j].center[direction] - min) / tilesize
                );

                // Add area to tile
                if (!tiles[tileIx]) {
                    tiles[tileIx] = [];
                }
                tiles[tileIx].push(grid[i][j]);
            }

            // We now have the tiles for this row.
            // Add them to the grid.
            if (!compressed[i]) {
                compressed[i] = [];
            }

            for (var tile = 0; tile < tiles.length; ++tile) {
                if (!tiles[tile]) {
                    continue;
                }
                if (tiles[tile].length === 1) {
                    // Single area for this tile, just add it.
                    compressed[i][tile + overflowMargin] = tiles[tile][0];
                } else if (tiles[tile].length > 1) {
                    // Overflow.
                    // First add the area
                    for (var area = 0; area < tiles[tile].length; ++area) {
                        compressed[i][tile + area + overflowMargin] =
                            tiles[tile][area];
                    }

                    // Now push the whole compressed array of earlier rows
                    // and increase the overflow margin for future rows.
                    overflowMargin += tiles[tile].length - 1;
                    compressed = shiftGrid(
                        compressed,
                        Math.floor(tiles[tile].length / 2), // How much to shift
                        i // Shift all rows until current
                    );
                }
            }
        }
    }

    // We have compressed it all, but need to remove unnecessary padding in case
    // we didn't overflow past columns with no areas. So we might have several
    // columns of undefined areas at the beginning of each row.

    // Find first index with a defined area
    min = Infinity;
    each(compressed, function (row) {
        for (var ix = 0, len = row.length; ix < len; ++ix) {
            if (row[ix]) {
                if (ix < min) {
                    min = ix;
                }
                break;
            }
        }
    });

    // Return the compressed grid with each row sliced to min
    return map(compressed, function (row) {
        return row && row.slice(min);
    });
}


// Get average boundary box size in x and y dimensions
// Discards outliers using interquartile ranges (Tukey's alg)
function getAverageAreaSize(areas) {
    var compareNumbers = function (a, b) {
            return a - b;
        },
        xSizes = map(areas, function (area) {
            return area.extremes.width;
        }).sort(compareNumbers),
        ySizes = map(areas, function (area) {
            return area.extremes.height;
        }).sort(compareNumbers),
        q1 = Math.floor(areas.length / 4),
        q3 = Math.floor(areas.length / 4 * 3),
        xIQR = xSizes[q3] - xSizes[q1],
        xMin = xSizes[q1] - 1.5 * xIQR,
        xMax = xSizes[q3] + 1.5 * xIQR,
        yIQR = ySizes[q3] - ySizes[q1],
        yMin = ySizes[q1] - 1.5 * yIQR,
        yMax = ySizes[q3] + 1.5 * yIQR,
        // Widths and heights within statistically significant bounds
        xProcessed = filter(xSizes, function (item) {
            return item > xMin && item < xMax;
        }),
        yProcessed = filter(ySizes, function (item) {
            return item > yMin && item < yMax;
        });

    return {
        width: reduce(xProcessed, function (a, b) {
            return a + b;
        }, 0) / xProcessed.length,

        height: reduce(yProcessed, function (a, b) {
            return a + b;
        }, 0) / yProcessed.length
    };
}


// Get the extremes and center point of a GeoJSON feature
function getFeatureMetrics(feature) {
    var type = feature.geometry.type,
        coords = feature.geometry.coordinates,
        flattened = [],
        extremes = {
            xMin: Infinity,
            xMax: -Infinity,
            yMin: Infinity,
            yMax: -Infinity
        },
        center = [];

    // Flatten feature into list of coordinates
    switch (type) {
    case 'MultiPolygon':
        each(coords, function (polygon) {
            each(polygon, function (ring) {
                each(ring, function (pair) {
                    flattened.push(pair);
                });
            });
        });
        break;

    case 'Polygon':
        each(coords, function (ring) {
            each(ring, function (pair) {
                flattened.push(pair);
            });
        });
        break;

    default:
        return;
    }

    // Find extremes of coordinates
    each(flattened, function (pair) {
        var x = parseFloat(pair[0]),
            y = parseFloat(pair[1]);
        if (x < extremes.xMin) {
            extremes.xMin = x;
        }
        if (x > extremes.xMax) {
            extremes.xMax = x;
        }
        if (y < extremes.yMin) {
            extremes.yMin = y;
        }
        if (y > extremes.yMax) {
            extremes.yMax = y;
        }
    });
    extremes.width = Math.abs(extremes.xMax - extremes.xMin);
    extremes.height = Math.abs(extremes.yMax - extremes.yMin);

    // Get label point and use it as center
    if (feature.properties['hc-middle-x']) {
        center.push(
            extremes.xMin + (extremes.xMax - extremes.xMin) *
            feature.properties['hc-middle-x']
        );
    } else {
        center.push((extremes.xMax + extremes.xMin) / 2);
    }
    if (feature.properties['hc-middle-y']) {
        center.push(
            extremes.yMin + (extremes.yMax - extremes.yMin) *
            feature.properties['hc-middle-y']
        );
    } else {
        center.push((extremes.yMax + extremes.yMin) / 2);
    }

    return {
        center: center,
        extremes: extremes
    };
}


// Create tilemap data structure from GeoJSON map
// A resolution factor parameter can be passed in to increase or decrease the
// default resolution of the conversion.
function geojsonToTilemapData(geojson, resolutionFactor) {
    var areas = sortAreasByCenter(
        // Reduce geojson to objects with center, bounding box, and metadata -
        // sorted by center X position.
            filter(map(geojson.features, function (area) {
                var metrics = getFeatureMetrics(area);
                return metrics && extend({
                    center: {
                        x: metrics.center[0],
                        y: metrics.center[1]
                    },
                    extremes: metrics.extremes,
                    id: area.id
                }, area.properties) || null;
            }), function (area) {
                // Remove areas that don't have metrics (line geom etc.)
                return area !== null;
            })
        ),
        // Find average tile size to use for creating a grid
        tilesize = getAverageAreaSize(areas),
        grid;

    // Add resolution factor if present
    tilesize.width /= Math.log(resolutionFactor) + 1;
    tilesize.height /= Math.log(resolutionFactor) + 1;

    // Create a grid from the areas
    grid = compressGridColumns(
        explodeToGrid(areas, tilesize.height),
        tilesize.width
    );

    // We have to flatten the grid into a one dimensional array with x/y coords
    return filter(reduce(grid, function (accumulator, row, y) {
        // Reduce the grid into a flat array with x/y
        return accumulator.concat(
            row && map(row, function (cell, x) {
                return cell && extend(cell, {
                    x: x,
                    y: y
                }) || null;
            }) || []
        );
    }, []), function (point) {
        // Remove null points
        return point !== null;
    });
}


// Initiate the chart
Highcharts.chart('container', {
    chart: {
        type: 'honeycomb',
        margin: [70, 70, 90, 70]
    },

    title: {
        text: 'Honeycomb map demo'
    },

    xAxis: {
        visible: false
    },

    yAxis: {
        visible: false
    },

    series: [{
        dataLabels: {
            enabled: true,
            formatter: function () {
                return this.point.name;
            }
        },
        tooltip: {
            pointFormat: '{point.name}'
        },
        pointPadding: 2,
        data: geojsonToTilemapData(Highcharts.maps['countries/us/us-all'], 1)
    }]
});
