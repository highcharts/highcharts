
// Tilemap generator plugin
(function (H) {
    /*
        Algorithm:
        1. Sort all areas by X value (center)
        2. Go through and "lift" the areas to their correct y-tiles based on
            where they belong relative to the lowest area, using the average
			area size as tilesize.
        3. Now shrink into tiles in the X dimension, by splitting by tilesize.
			Go through and find the next element that has an area that is more
			than a tilesize away. Compress all elements between into a single
			tile.
        4. If multiple areas are on the same tile, we deal with that as follows:
            - Place the largest of the areas on the ideal tile.
            - Subsequent areas are placed around the ideal tile by calculating
                which of the 8 closest positions to this tile has the least
                negative impact on the relations of the whole grid.
    */


    var each = H.each,
        map = H.map,
        filter = H.grep,
        reduce = H.reduce,
        extend = H.extend;


    // Sort array of areas by x or y center value
    // Dimension can be 'x' or 'y'. If unassigned, 'x' is assumed.
    function sortAreasByCenter(areas, dimension) {
        var d = dimension || 'x';
        return areas.sort(function (a, b) {
            return a.center[d] - b.center[d];
        });
    }


    // Utility function to check if a string ends with a substring
    function endsWith(str, search) {
        return str.substr(str.length - search.length) === search;
    }


    // Utility function to check if a string starts with a substring
    function startsWith(str, search) {
        return str.lastIndexOf(search, 0) === 0;
    }


    // Explode one dimensional array of areas into a 2D grid, where a threshold
    // value determines how far from the lowest area's center an area's center
	// has to be in the set dimension to shift it up a row. This stacks, so if
	// an area center value is 2x deltaThreshold away, it will be shifted 2
	// rows. In other words, the lowest centers will stay at the first row, and
	// areas are shifted up the grid the farther away they are in the chosen
	// dimension. Areas retain their original column index. The grid is
	// normalized to avoid negative indicies.
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
            rowIx = Math.floor(
				(areas[i].center[direction] - min) / deltaThreshold
			);
            if (!grid[rowIx]) {
                grid[rowIx] = [];
            }
            grid[rowIx][i] = areas[i];
        }

        return grid;
    }


    // Shift a grid to the left and up one row/col by adding null elements.
    function shiftGrid(grid) {
        grid.unshift(null);
        each(grid, function (row) {
            if (row && row.length) {
                row.unshift(null);
            }
        });
    }


    // Compress grid columns into tiles of size "tilesize". Each tile is an
    // array and may contain multiple areas.
    //
    // Dimension can be 'x' or 'y', assumed 'x' if undefined.
    function compressGridColumns(grid, tilesize, dimension) {
        var tiles = [],
            tileIx,
            direction = dimension || 'x',
            min = Infinity;

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
        for (var i = 0, len = grid.length; i < len; ++i) {
            // Split columns into tiles
            if (grid[i]) {
                tiles[i] = [];
                // Columns
                for (var j = 0, rowLen = grid[i].length; j < rowLen; ++j) {
                    if (!grid[i][j]) {
                        continue;
                    }

                    // Ideal tile for this area
                    tileIx = Math.floor(
                        (grid[i][j].center[direction] - min) / tilesize
                    );

                    // Add area to tile
                    if (!tiles[i][tileIx]) {
                        tiles[i][tileIx] = [];
                    }
                    tiles[i][tileIx].push(grid[i][j]);
                }
            }
        }

        return tiles;
    }


    // Compute 2D deviation value for a grid. The deviation value is the sum
    // of the differences between each area's ideal distance to each area in the
    // grid and its actual distance (euclidean).
    function getGridDeviation(grid, tilesize) {
        var deviation = 0,
            getTileDeviation = function (aCoords, bCoords) {
                var a = grid[aCoords.row][aCoords.col],
                    b = grid[bCoords.row][bCoords.col],
                    centerXDistance = (a.center.x - b.center.x) / tilesize.width,
                    centerYDistance = (a.center.y - b.center.y) / tilesize.height,
                    actualXDistance = aCoords.col - bCoords.col,
                    actualYDistance = aCoords.row - bCoords.row,
                    idealEuclidean = centerXDistance * centerXDistance +
                        centerYDistance * centerYDistance,
                    actualEuclidean = actualXDistance * actualXDistance +
                        actualYDistance * actualYDistance;

                return Math.abs(actualEuclidean - idealEuclidean);
            };

        // Loop over all tiles
        for (var row = 0, rowLen = grid.length; row < rowLen; ++row) {
            if (!grid[row]) {
                continue;
            }
            for (var col = 0, colLen = grid[row].length; col < colLen; ++col) {
                if (!grid[row][col]) {
                    continue;
                }
                // Compute deviation against all tiles further up the grid
                for (var dRow = row; dRow < rowLen; ++dRow) {
                    if (!grid[dRow]) {
                        continue;
                    }
                    for (var dCol = dRow === row ? col + 1 : 0,
                        dColLen = grid[dRow].length;
                        dCol < dColLen; ++dCol
                    ) {
                        if (grid[dRow][dCol]) {
                            deviation += getTileDeviation(
                                // Area
                                {
                                    row: row,
                                    col: col
                                },
                                // Deviation area
                                {
                                    row: dRow,
                                    col: dCol
                                }
                            );
                        }
                    }
                }
            }
        }
        return deviation;
    }


    // Get the index of the largest area in an array of areas
    function getLargestAreaIx(areas) {
        var i = areas.length,
            largestIx = 0,
            largestArea = 0;
        while (i--) {
            if (areas[i].extremes.width * areas[i].extremes.height >
                largestArea) {
                largestIx = i;
                largestArea = areas[i].extremes.width * areas[i].extremes.height;
            }
        }
        return largestIx;
    }


    // Insert an area into a grid, shifting the existing areas accordingly.
    // Returns new grid with area inserted.
    function insertInGrid(baseGrid, area, position, direction) {
        var grid = [],
            shift = false,
            lowerRow = position[0] - 1,
            upperRow = position[0] + 1,
            row,
            i,
            newRow;

        // Copy baseGrid, avoid altering source
        for (i = 0; i < baseGrid.length; ++i) {
            newRow = [];
            if (baseGrid[i]) {
                for (var j = 0; j < baseGrid[i].length; ++j) {
                    newRow.push(baseGrid[i][j]);
                }
            }
            grid.push(newRow);
        }

        // Determine if we need to shift the row horizontally
        if (direction === 'left' ||
            direction === 'leftTop' ||
            direction === 'leftBottom') {
            shift = true;
        }

        if (direction === 'centerBottom') {
            // Copy over the next cell to each position to simulate a vertical
            // shift.
            for (i = 0; i < lowerRow; ++i) {
                if (!grid[i]) {
                    grid[i] = [];
                }
                grid[i][position[1]] = grid[i + 1] && grid[i + 1][position[1]];
            }
            if (!grid[lowerRow]) {
                grid[lowerRow] = [];
            }
            grid[lowerRow][position[1]] = area;
        } else if (direction === 'centerTop') {
            // Same as for centerBottom, but start from end of the grid.
            for (i = grid.length; i > upperRow; --i) {
                if (!grid[i]) {
                    grid[i] = [];
                }
                grid[i][position[1]] = grid[i - 1] && grid[i - 1][position[1]];
            }
            if (!grid[upperRow]) {
                grid[upperRow] = [];
            }
            grid[upperRow][position[1]] = area;
        } else {
            // All of the others have a horizontal shift, so just splice and
            // insert.
            if (endsWith(direction, 'Top')) {
                row = upperRow;
            } else if (endsWith(direction, 'Bottom')) {
                row = lowerRow;
            } else {
                row = position[0];
            }

            if (!grid[row]) {
                grid[row] = [];
            }

            if (shift) {
                // Left
                grid[row].shift();
                // Can't splice on nothing so insert nulls
                while (grid[row].length < position[1] - 1) {
                    grid[row].push(null);
                }
                grid[row].splice(position[1] - 1, 0, area);
            } else {
                // Right
                while (grid[row].length < position[1] + 1) {
                    grid[row].push(null);
                }
                grid[row].splice(position[1] + 1, 0, area);
            }
        }

        return grid;
    }


    // Create an array of grids, where an overflow area has been inserted in
    // each possible position around a point. Assumes the baseGrid has a margin
    // of at least 1 to left and bottom to allow for shifts.
    function getInsertionGrids(baseGrid, overflow) {
        var insertionGrids = [],
            baseTile = baseGrid[overflow.row][overflow.col];
        each(filter(['left', 'leftTop', 'centerTop', 'rightTop', 'right',
            'rightBottom', 'centerBottom', 'leftBottom'], function (dir) {
            // Filter out positions we don't want to use for this overflow
            return !startsWith(dir,
                    baseTile.center.x > overflow.area.center.x ?
                    'right' : // Base tile should be to the right or center
                    'left') && // Base tile should be to the left or center
                   !endsWith(dir,
                    baseTile.center.y > overflow.area.center.y ?
                    'Top' : // Base tile should be on top or center
                    'Bottom'); // Base tile should be below or center
        }),
        function (dir) {
            // Get insertion grids for each position
            insertionGrids.push({
                grid: insertInGrid(baseGrid, overflow.area,
                    [overflow.row, overflow.col], dir),
                dir: dir
            });
        });
        return insertionGrids;
    }


    // Remove empty rows and columns at the beginning of a grid
    function trimGrid(grid) {
        var minRow = Infinity, // Min row ix;
            minCol = Infinity;
        for (var i = 0; i < grid.length; ++i) {
            if (grid[i] && grid[i].length) {
                for (var j = 0; j < grid[i].length; ++j) {
                    if (grid[i][j]) {
                        minRow = i < minRow ? i : minRow;
                        minCol = j < minCol ? j : minCol;
                        break;
                    }
                }
            }
        }

        // We have the minimums, just shift the grid.
        return map(grid.slice(minRow), function (row) {
            return row.slice(minCol);
        });
    }


    // Insert overflows into a grid using deviationValue computation to find
    // best position. Returns new grid with overflows inserted or old grid if
    // no overflows.
    function insertOverflows(grid, overflows, tilesize) {
        var crushed = grid,
            optimalGridVal,
            optimalGridIx = 0,
            g,
            gridVal,
            grids = [],
            shift = 0,
            colShift,
            rowShiftIx,
            rowShift;

        for (var i = 0, oLen = overflows.length, of; i < oLen; ++i) {
            of = overflows[i];

            // Always make space for the grid to overflow
            shiftGrid(crushed);
            ++shift;

            // Get grids for each insert position for this overflow into an
            // array
            grids = getInsertionGrids(crushed, {
                area: of.area,
                row: of.row + shift, // Compensate for the constant shift
                col: of.col + shift
            });

            // Find the optimal grid
            g = grids.length;
            optimalGridVal = Infinity;
            while (g--) {
                gridVal = getGridDeviation(grids[g].grid, tilesize);
                if (gridVal < optimalGridVal) {
                    optimalGridVal = gridVal;
                    optimalGridIx = g;
                }
            }

            // Update with the most optimal insertion
            crushed = grids[optimalGridIx].grid;

            // Now we need to update the overflow coordinates to fit the new
            // grid. First find out what to shift.
            rowShiftIx = 0;
            rowShift = 0;
            colShift = 0;
            switch (grids[optimalGridIx].dir) {
            case 'left':
                rowShiftIx = of.row;
                rowShift = -1;
                break;
            case 'right':
                rowShiftIx = of.row;
                rowShift = 1;
                break;
            case 'centerTop':
                colShift = 1;
                break;
            case 'leftTop':
                rowShiftIx = of.row + 1;
                rowShift = -1;
                break;
            case 'rightTop':
                rowShiftIx = of.row + 1;
                rowShift = 1;
                break;
            case 'centerBottom':
                colShift = -1;
                break;
            case 'rightBottom':
                rowShiftIx = of.row - 1;
                rowShift = 1;
                break;
            case 'leftBottom':
                rowShiftIx = of.row - 1;
                rowShift = -1;
                break;
            default:
                return;
            }
            // colShift now holds the amount that the column has shifted.
            // rowShift holds the same for the row, and rowShiftIx specifies
            // which row.

            // Loop over all remaining overflows and change them.
            for (var j = i + 1; j < oLen; ++j) {
                if (overflows[j].row === rowShiftIx &&
                    ((overflows[j].col < of.col && rowShift < 0) ||
                    (overflows[j].col > of.col && rowShift > 0))
                ) {
                    // This row has shifted horizontally, change overflow col to
                    // follow
                    overflows[j].col += rowShift;
                }
                if (overflows[j].col === of.col &&
                    ((overflows[j].row < of.row && colShift < 0) ||
                    (overflows[j].row > of.row && colShift > 0))
                ) {
                    // This column has shifted horizontally, change overflow row
                    // to follow
                    overflows[j].row += colShift;
                }
            }
        }

        // Remove excessive margins caused by shifts
        return trimGrid(crushed);
    }


    // Deflate a compressed 3D tile grid so that no tiles contain more than one
    // area. This is done by overflowing the stacked tiles and expanding the
    // grid.
    //
    // reverseOverflows can be set to true to reverse the order of overflow
    //  insertions
    //
    // Algorithm:
    //  For tiles with multiple areas, we insert the center area in the tile.
    //  Subsequent areas are inserted by computing a deviationValue for each of
    //  the possible insertion points, and selecting the insertion with the
    //  smallest deviationValue.
    function crushTileGrid(grid, tilesize, reverseOverflows) {
        var crushed = [],
            overflows = [],
            centerArea;

        // First add the simple areas and the center areas of the stacked tiles
        for (var row = 0, rowLen = grid.length; row < rowLen; ++row) {
            if (!grid[row]) {
                continue;
            }
            crushed[row] = [];
            for (var col = 0, colLen = grid[row].length, numAreas;
                col < colLen; ++col
            ) {
                if (!grid[row][col]) {
                    continue;
                }
                numAreas = grid[row][col].length;
                if (numAreas === 1) {
                    crushed[row][col] = grid[row][col][0];
                } else if (numAreas > 1) {
                    centerArea = getLargestAreaIx(grid[row][col]);
                    for (var a = 0; a < numAreas; ++a) {
                        // Insert center area normally
                        if (a === centerArea) {
                            crushed[row][col] = grid[row][col][centerArea];
                            continue;
                        }
                        // Overflow for this area. Pick up these after all
                        // others are placed.
                        overflows.push({
                            area: grid[row][col][a],
                            row: row,
                            col: col
                        });
                    }
                }
            }
        }

        return insertOverflows(
            crushed,
            reverseOverflows ? overflows.reverse() : overflows,
            tilesize
        );
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


    // Get the extremes and center point of a GeoJSON feature.
    // labelCenter specifies whether to use the data label as center if possible
    function getFeatureMetrics(feature, labelCenter) {
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
        if (feature.properties['hc-middle-x'] && labelCenter) {
            center.push(
                extremes.xMin + (extremes.xMax - extremes.xMin) *
                feature.properties['hc-middle-x']
            );
        } else {
            center.push((extremes.xMax + extremes.xMin) / 2);
        }
        if (feature.properties['hc-middle-y'] && labelCenter) {
            center.push(
                extremes.yMin + (extremes.yMax - extremes.yMin) *
                (1 - feature.properties['hc-middle-y']) // y is reversed
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
    // A resolution factor parameter can be passed in for each dimension to
    //  increase or decrease the tilesize resolution of the conversion.
    // The reverseAlg parameter reverses the order in which overflowing tiles
    //  are inserted. This might lead to better results with some maps.
    // useLabelCenter is on by default, and determines whether to use the center
    //  of the data label position as area centers, or the center of the
    //  bounding box.
    // The excludeList parameter allows for exclusion of a set of areas by their
    //  ids.
    H.geojsonToTilemapData = function (
        geojson, xResolutionFactor, yResolutionFactor, reverseAlg,
        useLabelCenter, excludeList
    ) {
        var areas = sortAreasByCenter(
            // Reduce geojson to objects with center, bounding box, and metadata
            // sorted by center X position.
                filter(map(geojson.features, function (area) {
                    var metrics = getFeatureMetrics(
                        area, H.pick(useLabelCenter, true)
                    );
                    return metrics && extend({
                        center: {
                            x: metrics.center[0],
                            y: metrics.center[1]
                        },
                        extremes: metrics.extremes,
                        id: area.id
                    }, area.properties) || null;
                }), function (area) {
                    // Remove areas that don't have metrics (line geom etc.),
                    // as well as excluded areas.
                    var excluded = false,
                        i = excludeList.length;
                    while (i--) {
                        if (area.id === excludeList[i]) {
                            excluded = true;
                            break;
                        }
                    }
                    return area !== null && !excluded;
                })
            ),
            // Find average tile size to use for creating a grid
            tilesize = getAverageAreaSize(areas),
            grid;

        // Add resolution factor if present
        tilesize.width /= Math.log(xResolutionFactor || 1) + 1;
        tilesize.height /= Math.log(yResolutionFactor || 1) + 1;

        // Create a grid from the areas
        grid = crushTileGrid(
            compressGridColumns(
                explodeToGrid(areas, tilesize.height),
                tilesize.width
            ),
            tilesize,
            reverseAlg
        );

        // We have to flatten the grid into a one dimensional array with x/y
		// axis coordinates for Highcharts
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
    };

}(Highcharts));


// -----------------------------------------------------------------------------
// End tilemap generator plugin
// -----------------------------------------------------------------------------


/* UI below, partially based on all-maps demo */


var baseMapPath = "https://code.highcharts.com/mapdata/",
    showDataLabels = true,
    mapCount = 0,
    searchText,
    mapOptions = '',
    mapChart,
    tileChart,
    currentMapKey,
    currentData,
    dataAltered,
    selectedPoint;


// Create/update tile chart. Called on changes to alg params or map load.
function generateTileChart() {
    var shapeType = $('#shapeType').val(),
        xRes = $('#xRes').val(),
        yRes = $('#yRes').val(),
        invert = $("#invert").prop('checked'),
        reverseAlg = $("#reverse").prop('checked'),
        labelCenter = $("#labelCenter").prop('checked'),
        excludeList = $('#exclude').val(),
        data,
        options,
        maxY,
        mapLen = Highcharts.maps[currentMapKey].features.length,
        outputData = function () {
            $('#outputData').val(JSON.stringify(
                Highcharts.map(currentData, function (point) {
                    var filterProps = ['center', 'extremes', 'hc-middle-y',
                        'hc-middle-x', 'selected', 'color'];
                    Highcharts.each(filterProps, function (prop) {
                        delete point[prop];
                    });
                    return point;
                }), null,
                $("#prettyprint").prop('checked') ? 2 : null
            ));
        },
        swapPoints = function (a, b) {
            var bX = b.x,
                bY = b.y,
                aChanged = false,
                bChanged = false;

            // First change it in output data
            Highcharts.each(currentData, function (point) {
                if (!aChanged && point.x === a.x && point.y === a.y) {
                    point.x = b.x;
                    point.y = b.y;
                    aChanged = true;
                } else if (!bChanged && point.x === b.x && point.y === b.y) {
                    point.x = a.x;
                    point.y = a.y;
                    bChanged = true;
                }
            });

            outputData();

            // Now change it in actual points
            a.select(false);
            a.update({
                color: Highcharts.getOptions().colors[0]
            });
            if (b.update) { // b is a point
                b.update({
                    x: a.x,
                    y: a.y
                });
            } else {
                // Should b be a point?
                for (var i = 0, pLen = a.series.points.length; i < pLen; ++i) {
                    if (a.series.points[i].x === b.x &&
                        a.series.points[i].y === b.y) {
                        a.series.points[i].update({
                            x: a.x,
                            y: a.y
                        });
                    }
                }
            }
            a.update({
                x: bX,
                y: bY
            });
            if (a !== b) {
                dataAltered = true;
            }
        };

    if (excludeList) {
        excludeList = excludeList.split(",").map(function (item) {
            return item.trim();
        });
    }

    // Warn for data loss
    if (dataAltered && !window.confirm(
        'This will discard data changes. Proceed?'
    )) {
        return;
    }

    // Warn for huge maps
    if (mapLen > 300 && !window.confirm("This map contains " + mapLen +
        " areas. Converting this much data could take a while. Continue?")) {
        return;
    }

    data = Highcharts.geojsonToTilemapData(
        Highcharts.maps[currentMapKey],
        xRes, yRes, reverseAlg, labelCenter, excludeList
    );

    if (invert) {
        // Find max Y, since Y axis must be reversed
        maxY = Highcharts.reduce(data, function (a, b) {
            return Math.max(a && a.y || 0, b && b.y || 0);
        });
        Highcharts.each(data, function (point) {
            var temp = point.x;
            point.x = maxY - point.y;
            point.y = temp;
        });
    }

    options = {
        chart: {
            type: 'tilemap',
            inverted: invert,
            events: {
                click: function (e) {
                    var x = Math.round(e.xAxis[0].value),
                        y = Math.round(e.yAxis[0].value);

                    if (selectedPoint) {
                        swapPoints(selectedPoint, { x: x, y: y });
                        selectedPoint = null;
                    }
                }
            }
        },
        credits: {
            position: {
                align: 'center'
            }
        },
        title: {
            text: 'Click tiles to swap places'
        },
        xAxis: {
            visible: false
        },
        yAxis: {
            visible: false
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: '{point.id}: {point.name}'
        },
        series: [{
            data: data,
            tileShape: shapeType,
            allowPointSelect: true,
            dataLabels: {
                enabled: showDataLabels,
                format: '{point.name}'
            },
            cursor: 'pointer',
            point: {
                events: {
                    click: function () {
                        var point = this;
                        if (selectedPoint) {
                            swapPoints(selectedPoint, point);
                            selectedPoint = null;
                        } else {
                            point.select(true);
                            point.update({
                                color: '#601010'
                            });
                            selectedPoint = point;
                        }
                    }
                }
            }
        }]
    };

    // Don't use chart.update since we're altering axis extremes outside of
    // options and there doesn't seem to be a simple way to reset them in
    // update.
    if (tileChart) {
        tileChart.destroy();
        tileChart = null;
    }

    tileChart = Highcharts.chart('tileContainer', options);

    dataAltered = false;
    selectedPoint = null;
    currentData = data;
    outputData();
}


// Populate dropdown menu and turn into jQuery UI widgets
$.each(Highcharts.mapDataIndex, function (mapGroup, maps) {
    if (mapGroup !== "version") {
        mapOptions += '<option class="option-header">' + mapGroup + '</option>';
        $.each(maps, function (desc, path) {
            mapOptions += '<option value="' + path + '">' + desc + '</option>';
            mapCount += 1;
        });
    }
});
searchText = 'Search ' + mapCount + ' maps';
mapOptions = '<option value="custom/world.js">' + searchText + '</option>' + mapOptions;
$("#mapDropdown").append(mapOptions).combobox();


// Change map when item selected in dropdown
$("#mapDropdown").change(function () {
    var $selectedItem = $("option:selected", this),
        mapDesc = $selectedItem.text(),
        mapKey = this.value.slice(0, -3),
        javascriptPath = baseMapPath + this.value,
        isHeader = $selectedItem.hasClass('option-header');

    // Dim or highlight search box
    if (mapDesc === searchText || isHeader) {
        $('.custom-combobox-input').removeClass('valid');
        location.hash = '';
    } else {
        $('.custom-combobox-input').addClass('valid');
        location.hash = mapKey;
    }

    if (isHeader) {
        return false;
    }

    // Show loading
    if (Highcharts.charts[0]) {
        Highcharts.charts[0].showLoading('<i class="fa fa-spinner fa-spin fa-2x"></i>');
    }

    // When the map is loaded or ready from cache...
    function mapReady() {
        var mapGeoJSON = Highcharts.maps[mapKey],
            data = [];

        currentMapKey = mapKey;

        // Generate bogus data for the map
        $.each(mapGeoJSON.features, function (index, feature) {
            data.push({
                key: feature.properties['hc-key'],
                value: index
            });
        });

        // Instantiate chart
        mapChart = Highcharts.mapChart('mapContainer', {
            title: {
                text: null
            },

            exporting: {
                buttons: {
                    contextButton: {
                        x: -35
                    }
                }
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    align: 'right',
                    verticalAlign: 'top'
                }
            },

            credits: {
                position: {
                    align: 'center'
                }
            },

            colorAxis: {
                min: 0,
                stops: [
                    [0, '#EFEFFF'],
                    [0.5, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).brighten(-0.5).get()]
                ]
            },

            legend: {
                enabled: false
            },

            series: [{
                data: data,
                mapData: mapGeoJSON,
                joinBy: ['hc-key', 'key'],
                name: 'Random data',
                states: {
                    hover: {
                        color: Highcharts.getOptions().colors[2]
                    }
                },
                dataLabels: {
                    enabled: showDataLabels,
                    formatter: function () {
                        return mapKey === 'custom/world' || mapKey === 'countries/us/us-all' ?
                                (this.point.properties && this.point.properties['hc-a2']) :
                                this.point.name;
                    }
                }
            }, {
                type: 'mapline',
                name: "Separators",
                data: Highcharts.geojson(mapGeoJSON, 'mapline'),
                nullColor: 'gray',
                showInLegend: false,
                enableMouseTracking: false
            }]
        });

        generateTileChart(mapKey);
    }

    // Check whether the map is already loaded, else load it and
    // then show it async
    if (Highcharts.maps[mapKey]) {
        mapReady();
    } else {
        $.getScript(javascriptPath, mapReady);
    }
});


// Toggle pretty print
$("#prettyprint").change(function () {
    $('#outputData').val(JSON.stringify(
        currentData, null, $("#prettyprint").prop('checked') ? 2 : null)
    );
});


// Add excluded areas
$('#exclude').change(generateTileChart);


// Select view mode
$('#shapeType').change(function () {
    tileChart.series[0].update({
        tileShape: $('#shapeType').val()
    });
});


// Toggle algorithm reverse
$('#reverse').change(generateTileChart);


// Toggle data label as center
$('#labelCenter').change(generateTileChart);


// Toggle chart invert
$('#invert').change(generateTileChart);


// Zoom out tile chart
$('#zoomOut').click(function () {
    var xe = tileChart.xAxis[0].getExtremes(),
        ye = tileChart.yAxis[0].getExtremes();
    tileChart.xAxis[0].setExtremes(xe.min - 1, xe.max + 1);
    tileChart.yAxis[0].setExtremes(ye.min - 1, ye.max + 1);
    dataAltered = true;
});


// xResolution change
$('#xRes').change(generateTileChart);
$('#xRes').on('input', function () {
    var val = $('#xRes').val();
    $('#xResLabel').text(val === '1' ? 'X resolution factor' :
        'X resolution factor (' + val + ')');
});


// yResolution change
$('#yRes').change(generateTileChart);
$('#yRes').on('input', function () {
    var val = $('#yRes').val();
    $('#yResLabel').text(val === '1' ? 'Y resolution factor' :
        'Y resolution factor (' + val + ')');
});


// Toggle enlarge charts
$('#enlarge').change(function () {
    if ($("#enlarge").prop('checked')) {
        $('.verticalLine').hide();
        $('#mapContainer').addClass('container-expanded');
        $('#tileContainer').addClass('container-expanded');
        tileChart.reflow();
        mapChart.reflow();
    } else {
        $('.verticalLine').show();
        $('#tileContainer').removeClass('container-expanded');
        $('#mapContainer').removeClass('container-expanded');
        tileChart.reflow();
        mapChart.reflow();
    }
});


// Toggle data labels
$("#dataLabels").change(function () {
    showDataLabels = $("#dataLabels").prop('checked');
    mapChart.series[0].update({
        dataLabels: {
            enabled: showDataLabels
        }
    });
    tileChart.series[0].update({
        dataLabels: {
            enabled: showDataLabels
        }
    });
});


// Trigger change event to load map on startup
if (location.hash) {
    $('#mapDropdown').val(location.hash.substr(1) + '.js');
} else { // for IE9
    $($('#mapDropdown option')[0]).attr('selected', 'selected');
}
$('#mapDropdown').change();

