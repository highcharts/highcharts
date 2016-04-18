/*
 
 Highcharts funnel module

 (c) 2010-2016 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(b){typeof module==="object"&&module.exports?module.exports=b:b(Highcharts)})(function(b){var q=b.getOptions(),w=q.plotOptions,r=b.seriesTypes,F=b.merge,E=function(){},B=b.each;w.funnel=F(w.pie,{animation:!1,center:["50%","50%"],width:"90%",neckWidth:"30%",height:"100%",neckHeight:"25%",reversed:!1,dataLabels:{connectorWidth:1,connectorColor:"#606060"},size:!0,states:{select:{color:"#C0C0C0",borderColor:"#000000",shadow:!1}}});r.funnel=b.extendClass(r.pie,{type:"funnel",animate:E,translate:function(){var a=
function(k,a){return/%$/.test(k)?a*parseInt(k,10)/100:parseInt(k,10)},b=0,d=this.chart,c=this.options,f=c.reversed,g=c.ignoreHiddenPoint,o=d.plotWidth,h=d.plotHeight,q=0,d=c.center,i=a(d[0],o),x=a(d[1],h),r=a(c.width,o),l,s,e=a(c.height,h),t=a(c.neckWidth,o),C=a(c.neckHeight,h),u=x-e/2+e-C,a=this.data,y,z,w=c.dataLabels.position==="left"?1:0,A,m,D,p,j,v,n;this.getWidthAt=s=function(k){var a=x-e/2;return k>u||e===C?t:t+(r-t)*(1-(k-a)/(e-C))};this.getX=function(k,a){return i+(a?-1:1)*(s(f?h-k:k)/2+
c.dataLabels.distance)};this.center=[i,x,e];this.centerX=i;B(a,function(a){if(!g||a.visible!==!1)b+=a.y});B(a,function(a){n=null;z=b?a.y/b:0;m=x-e/2+q*e;j=m+z*e;l=s(m);A=i-l/2;D=A+l;l=s(j);p=i-l/2;v=p+l;m>u?(A=p=i-t/2,D=v=i+t/2):j>u&&(n=j,l=s(u),p=i-l/2,v=p+l,j=u);f&&(m=e-m,j=e-j,n=n?e-n:null);y=["M",A,m,"L",D,m,v,j];n&&y.push(v,n,p,n);y.push(p,j,"Z");a.shapeType="path";a.shapeArgs={d:y};a.percentage=z*100;a.plotX=i;a.plotY=(m+(n||j))/2;a.tooltipPos=[i,a.plotY];a.slice=E;a.half=w;if(!g||a.visible!==
!1)q+=z})},drawPoints:function(){var a=this,b=a.chart.renderer,d,c,f;B(a.data,function(g){f=g.graphic;c=g.shapeArgs;d=g.pointAttr[g.selected?"select":""];f?f.attr(d).animate(c):g.graphic=b.path(c).attr(d).add(a.group)})},sortByAngle:function(a){a.sort(function(a,b){return a.plotY-b.plotY})},drawDataLabels:function(){var a=this.data,b=this.options.dataLabels.distance,d,c,f,g=a.length,o,h;for(this.center[2]-=2*b;g--;)f=a[g],c=(d=f.half)?1:-1,h=f.plotY,o=this.getX(h,d),f.labelPos=[0,h,o+(b-5)*c,h,o+
b*c,h,d?"right":"left",0];r.pie.prototype.drawDataLabels.call(this)}});q.plotOptions.pyramid=b.merge(q.plotOptions.funnel,{neckWidth:"0%",neckHeight:"0%",reversed:!0});b.seriesTypes.pyramid=b.extendClass(b.seriesTypes.funnel,{type:"pyramid"})});
