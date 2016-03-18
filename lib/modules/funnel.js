/*
 
 Highcharts funnel module

 (c) 2010-2016 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(b){typeof module==="object"&&module.exports?module.exports=b:b(Highcharts)})(function(b){var q=b.getOptions(),w=q.plotOptions,r=b.seriesTypes,G=b.merge,E=function(){},B=b.each,F=b.pick;w.funnel=G(w.pie,{animation:!1,center:["50%","50%"],width:"90%",neckWidth:"30%",height:"100%",neckHeight:"25%",reversed:!1,dataLabels:{connectorWidth:1,connectorColor:"#606060"},size:!0,states:{select:{color:"#C0C0C0",borderColor:"#000000",shadow:!1}}});r.funnel=b.extendClass(r.pie,{type:"funnel",animate:E,
translate:function(){var a=function(k,a){return/%$/.test(k)?a*parseInt(k,10)/100:parseInt(k,10)},b=0,f=this.chart,c=this.options,g=c.reversed,l=c.ignoreHiddenPoint,h=f.plotWidth,d=f.plotHeight,q=0,f=c.center,i=a(f[0],h),x=a(f[1],d),r=a(c.width,h),m,s,e=a(c.height,d),t=a(c.neckWidth,h),C=a(c.neckHeight,d),u=x-e/2+e-C,a=this.data,y,z,w=c.dataLabels.position==="left"?1:0,A,n,D,p,j,v,o;this.getWidthAt=s=function(k){var a=x-e/2;return k>u||e===C?t:t+(r-t)*(1-(k-a)/(e-C))};this.getX=function(k,a){return i+
(a?-1:1)*(s(g?d-k:k)/2+c.dataLabels.distance)};this.center=[i,x,e];this.centerX=i;B(a,function(a){if(!l||a.visible!==!1)b+=a.y});B(a,function(a){o=null;z=b?a.y/b:0;n=x-e/2+q*e;j=n+z*e;m=s(n);A=i-m/2;D=A+m;m=s(j);p=i-m/2;v=p+m;n>u?(A=p=i-t/2,D=v=i+t/2):j>u&&(o=j,m=s(u),p=i-m/2,v=p+m,j=u);g&&(n=e-n,j=e-j,o=o?e-o:null);y=["M",A,n,"L",D,n,v,j];o&&y.push(v,o,p,o);y.push(p,j,"Z");a.shapeType="path";a.shapeArgs={d:y};a.percentage=z*100;a.plotX=i;a.plotY=(n+(o||j))/2;a.tooltipPos=[i,a.plotY];a.slice=E;a.half=
w;if(!l||a.visible!==!1)q+=z})},drawPoints:function(){var a=this,b=a.options,f=a.chart.renderer,c,g,l,h;B(a.data,function(d){c=d.options;h=d.graphic;l=d.shapeArgs;g={fill:d.color,stroke:F(c.borderColor,b.borderColor),"stroke-width":F(c.borderWidth,b.borderWidth)};h?h.attr(g).animate(l):d.graphic=f.path(l).attr(g).add(a.group)})},sortByAngle:function(a){a.sort(function(a,b){return a.plotY-b.plotY})},drawDataLabels:function(){var a=this.data,b=this.options.dataLabels.distance,f,c,g,l=a.length,h,d;for(this.center[2]-=
2*b;l--;)g=a[l],c=(f=g.half)?1:-1,d=g.plotY,h=this.getX(d,f),g.labelPos=[0,d,h+(b-5)*c,d,h+b*c,d,f?"right":"left",0];r.pie.prototype.drawDataLabels.call(this)}});q.plotOptions.pyramid=b.merge(q.plotOptions.funnel,{neckWidth:"0%",neckHeight:"0%",reversed:!0});b.seriesTypes.pyramid=b.extendClass(b.seriesTypes.funnel,{type:"pyramid"})});
