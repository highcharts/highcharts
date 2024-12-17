3D cylinder
===

A 3D cylinder chart is a variation of a 3D column chart and features cylindrical points.

Here’re both chart types to compare:

**3D cylinder chart**

<iframe style="width: 100%; height: 515px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/demo/cylinder allow="fullscreen"></iframe>

**3D column chart**

<iframe style="width: 100%; height: 515px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/css/column-3d allow="fullscreen"></iframe>

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
                    data: [1, 2, 3]
                }]
            }
    

API Docs
--------

Check the following [API document link](https://api.highcharts.com/highcharts/plotOptions.cylinder) to learn more about the 3D Cylinder.
