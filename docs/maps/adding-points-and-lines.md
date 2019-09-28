Adding points and lines
===

Map points and lines are added to the map by coordinates. The coordinate system used in most of our maps is a custom one, where both the X and Y axis ranges from 0 to some thousands. The rationale for not using latitude and longitude coordinates is partly to save downloading weight, partly to not have to deal with projection on the client side, and partly because many of the maps are composite. For example Alaska is moved into the Pacific next to the US mainland on most US maps, thus Alaska would need its own projection within the same map. 

Points are added as x, y pairs on the same coordinate system as the map. Maplines however are given as paths. In order to ease the process of placing your own points on the map, we have created [a utility script](https://jsfiddle.net/gh/get/jquery/1.7.2/highslide-software/highcharts.com/tree/master/samples/maps/chart/events-click-getcoordinates/) that allows you to click around in the map, then view and copy-paste the coordinates into your own map setup.
