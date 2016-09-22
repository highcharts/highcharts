/*
 
 Highcharts funnel module

 (c) 2010-2016 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(b){typeof module==="object"&&module.exports?module.exports=b:b(Highcharts)})(function(b){var r=b.getOptions(),x=r.plotOptions,s=b.seriesTypes,F=b.merge,E=function(){},B=b.each;x.funnel=F(x.pie,{animation:!1,center:["50%","50%"],width:"90%",neckWidth:"30%",height:"100%",neckHeight:"25%",reversed:!1,dataLabels:{connectorWidth:1,connectorColor:"#606060"},size:!0,states:{select:{color:"#C0C0C0",borderColor:"#000000",shadow:!1}}});s.funnel=b.extendClass(s.pie,{type:"funnel",animate:E,translate:function(){var a=
function(i,a){return/%$/.test(i)?a*parseInt(i,10)/100:parseInt(i,10)},b=0,d=this.chart,c=this.options,e=c.reversed,f=c.ignoreHiddenPoint,p=d.plotWidth,d=d.plotHeight,n=0,r=c.center,g=a(r[0],p),o=a(r[1],d),s=a(c.width,p),j,t,k=a(c.height,d),u=a(c.neckWidth,p),C=a(c.neckHeight,d),v=o-k/2+k-C,a=this.data,y,z,x=c.dataLabels.position==="left"?1:0,A,l,D,q,h,w,m;this.getWidthAt=t=function(i){var a=o-k/2;return i>v||k===C?u:u+(s-u)*(1-(i-a)/(k-C))};this.getX=function(i,a){return g+(a?-1:1)*(t(e?2*o-i:i)/
2+c.dataLabels.distance)};this.center=[g,o,k];this.centerX=g;B(a,function(a){if(!f||a.visible!==!1)b+=a.y});B(a,function(a){m=null;z=b?a.y/b:0;l=o-k/2+n*k;h=l+z*k;j=t(l);A=g-j/2;D=A+j;j=t(h);q=g-j/2;w=q+j;l>v?(A=q=g-u/2,D=w=g+u/2):h>v&&(m=h,j=t(v),q=g-j/2,w=q+j,h=v);e&&(l=2*o-l,h=2*o-h,m=m?2*o-m:null);y=["M",A,l,"L",D,l,w,h];m&&y.push(w,m,q,m);y.push(q,h,"Z");a.shapeType="path";a.shapeArgs={d:y};a.percentage=z*100;a.plotX=g;a.plotY=(l+(m||h))/2;a.tooltipPos=[g,a.plotY];a.slice=E;a.half=x;if(!f||a.visible!==
!1)n+=z})},drawPoints:function(){var a=this,b=a.chart.renderer,d,c,e;B(a.data,function(f){e=f.graphic;c=f.shapeArgs;d=f.pointAttr[f.selected?"select":""];e?e.attr(d).animate(c):f.graphic=b.path(c).attr(d).add(a.group)})},sortByAngle:function(a){a.sort(function(a,b){return a.plotY-b.plotY})},drawDataLabels:function(){var a=this.data,b=this.options.dataLabels.distance,d,c,e,f=a.length,p,n;for(this.center[2]-=2*b;f--;)e=a[f],c=(d=e.half)?1:-1,n=e.plotY,p=this.getX(n,d),e.labelPos=[0,n,p+(b-5)*c,n,p+
b*c,n,d?"right":"left",0];s.pie.prototype.drawDataLabels.call(this)}});r.plotOptions.pyramid=b.merge(r.plotOptions.funnel,{neckWidth:"0%",neckHeight:"0%",reversed:!0});b.seriesTypes.pyramid=b.extendClass(b.seriesTypes.funnel,{type:"pyramid"})});
