3d cylinder introduction
------------

A 3D cylinder chart is a variation of a 3D column chart and features cylindrical points.

Here’re both chart types to compare:

**3D column chart**

<iframe width="320" height="240" src="https://www.highcharts.com/samples/view.php?path=highcharts/demo/cylinder"></iframe>

**3D cylinder chart**

<iframe width="320" height="240" src="https://www.highcharts.com/samples/view.php?path=highcharts/css/column-3d"></iframe>

Installation
------------

Two modules are required `highcharts-3d.js` and `cylinder.js`.

This is a 3D-only series type, so 3D needs to be [enabled](https://api.highcharts.com/highcharts/chart.options3d.enabled).

Configuration
-------------

 Configuration is the same as for the 3D column series type. To keep cylindrical shapes, with a circle as a base, radius of the base should get the smaller value of the point’s width and point’s depth.

Use Cases
---------

    
    {
                chart: {
                    type: 'cylinder',
                    options3d: {
                        enabled: true,
                        alpha: 15,
                        beta: 15,
                        depth: 50,
                        viewDistance: 25
                    }
                },
                series: [{
                    data: [1, 2, 3[
                }[
            }
    

API Docs
--------

Check the following [API document link](https://api.highcharts.com/highcharts/plotOptions.cylinder) to learn more about the 3D Cylinder.
