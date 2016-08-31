var renderer;
$(function () {

    var each = Highcharts.each,
        map = Highcharts.map,
        len = 600;

    /**
     * Generatl distribution algorithm for distributing labels of differing size along a
     * confined length in two dimensions.
     */
    function distribute(boxes, len) {

        var i,
            overlapping = true,
            origBoxes,
            total = 0;

        /**
         * Create a composite box, average of targets
         */
        function joinBoxes(box, i) {
            var target = (Math.min.apply(0, box.targets) + Math.max.apply(0, box.targets)) / 2;
            box.pos = Math.min(Math.max(0, target - box.size / 2), len - box.size);
        }

        // If the total size exceeds the len, remove those boxes with the lowest rank
        i = boxes.length;
        while (i--) {
            total += boxes[i].size;
        }

        // Sort by rank, then slice away overshoot
        if (total > len) {
            boxes.sort(function (a, b) {
                return (b.rank || 0) - (a.rank || 0);
            });
            i = 0;
            total = 0;
            while (total <= len) {
                total += boxes[i].size;
                i++;
            }
            boxes = boxes.slice(0, i - 1);
        }

        // Order
        boxes.sort(function (a, b) {
            return a.target - b.target;
        });

        // Create a copy with target arrays
        origBoxes = boxes;
        boxes = map(boxes.slice(0), function (box) {
            return {
                size: box.size,
                targets: [box.target]
            };
        });

        while (overlapping) {
            // Initial positions: target centered in box
            each(boxes, joinBoxes);

            // Detect overlap and join boxes
            i = boxes.length;
            overlapping = false;
            while (i--) {
                if (i > 0 && boxes[i - 1].pos + boxes[i - 1].size > boxes[i].pos) { // Overlap
                    boxes[i - 1].size += boxes[i].size; // Add this size to the previous box
                    boxes[i - 1].targets = boxes[i - 1].targets.concat(boxes[i].targets);

                    // Overlapping right, push left
                    if (boxes[i - 1].pos + boxes[i - 1].size > len) {
                        boxes[i - 1].pos = len - boxes[i - 1].size;
                    }
                    boxes.splice(i, 1); // Remove this item
                    overlapping = true;
                }
            }
        }

        // Now the composite boxes are placed, we just need to put the original boxes within them
        i = 0;
        each(boxes, function (box) {
            var posInCompositeBox = 0;
            each(box.targets, function (tgt) {
                origBoxes[i].pos = box.pos + posInCompositeBox;
                posInCompositeBox += origBoxes[i].size;
                i++;
            });
        });
    }

    var boxes = [{
        size: 20,
        target: 10
    }, {
        size: 40,
        target: 30
    }, {
        size: 50,
        target: 110
    }, {
        size: 100,
        target: 300
    }, {
        size: 100,
        target: 300
    }, {
        size: 100,
        target: 330
    }, {
        size: 100,
        target: 530
    }, {
        size: 100,
        target: 580
    }, {
        size: 100,
        target: 580,
        rank: 1
    }];

    distribute(boxes, len);




    /// Visualize
    renderer = new Highcharts.Renderer(
        document.getElementById('container'),
        len,
        300
    );

    renderer.path(['M', 0, 55, 'L', len, 55])
    .attr({
        stroke: 'silver',
        'stroke-width': 2
    })
    .add();

    each(boxes, function (box, i) {
        if (box.pos !== undefined) {
            renderer.rect(box.pos + 0.5, 10.5, box.size - 1, 20)
            .attr({
                'fill': 'rgba(0, 0, 0, 0.1)',
                'stroke-width': 1,
                'stroke': Highcharts.getOptions().colors[i % 10]
            })
            .add();

            renderer.path(['M', box.pos + box.size / 2, 30, 'L', box.target, 55, 'z'])
            .attr({
                'stroke-width': 1,
                'stroke': Highcharts.getOptions().colors[i % 10]
            })
            .add();
        }

        renderer.circle(box.target, 55, 2)
        .attr({
            fill: 'blue'
        })
        .add();
    });



});