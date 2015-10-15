/*
 Highcharts JS v4.1.9 (2015-10-07)
 Plugin for displaying a message when there is no data visible in chart.

 (c) 2010-2014 Highsoft AS
 Author: Oystein Moseng

 License: www.highcharts.com/license
*/
(function(c){function i(){return!!this.points.length}function e(){this.hasData()?this.hideNoData():this.showNoData()}var f=c.seriesTypes,d=c.Chart.prototype,g=c.getOptions(),h=c.extend,j=c.each;h(g.lang,{noData:"No data to display"});g.noData={position:{x:0,y:0,align:"center",verticalAlign:"middle"},attr:{},style:{fontWeight:"bold",fontSize:"12px",color:"#60606a"}};j(["pie","gauge","waterfall","bubble"],function(a){if(f[a])f[a].prototype.hasData=i});c.Series.prototype.hasData=function(){return this.visible&&
this.dataMax!==void 0&&this.dataMin!==void 0};d.showNoData=function(a){var b=this.options,a=a||b.lang.noData,b=b.noData;if(!this.noDataLabel)this.noDataLabel=this.renderer.label(a,0,0,null,null,null,b.useHTML,null,"no-data").attr(b.attr).css(b.style).add(),this.noDataLabel.align(h(this.noDataLabel.getBBox(),b.position),!1,"plotBox")};d.hideNoData=function(){if(this.noDataLabel)this.noDataLabel=this.noDataLabel.destroy()};d.hasData=function(){for(var a=this.series,b=a.length;b--;)if(a[b].hasData()&&
!a[b].options.isInternal)return!0;return!1};d.callbacks.push(function(a){c.addEvent(a,"load",e);c.addEvent(a,"redraw",e)})})(Highcharts);
