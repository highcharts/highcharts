/*
 
 Highcharts funnel module

 (c) 2010-2014 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(b){var q=b.getOptions(),w=q.plotOptions,r=b.seriesTypes,G=b.merge,E=function(){},B=b.each,F=b.pick;w.funnel=G(w.pie,{animation:!1,center:["50%","50%"],width:"90%",neckWidth:"30%",height:"100%",neckHeight:"25%",reversed:!1,dataLabels:{connectorWidth:1,connectorColor:"#606060"},size:!0,states:{select:{color:"#C0C0C0",borderColor:"#000000",shadow:!1}}});r.funnel=b.extendClass(r.pie,{type:"funnel",animate:E,translate:function(){var a=function(i,a){return/%$/.test(i)?a*parseInt(i,10)/100:parseInt(i,
10)},C=0,e=this.chart,c=this.options,b=c.reversed,j=e.plotWidth,f=e.plotHeight,n=0,e=c.center,g=a(e[0],j),q=a(e[1],f),r=a(c.width,j),k,s,d=a(c.height,f),t=a(c.neckWidth,j),u=a(c.neckHeight,f),x=d-u,a=this.data,y,z,w=c.dataLabels.position==="left"?1:0,A,l,D,p,h,v,m;this.getWidthAt=s=function(i){return i>d-u||d===u?t:t+(r-t)*((d-u-i)/(d-u))};this.getX=function(i,a){return g+(a?-1:1)*(s(b?f-i:i)/2+c.dataLabels.distance)};this.center=[g,q,d];this.centerX=g;B(a,function(a){C+=a.y});B(a,function(a){m=null;
z=C?a.y/C:0;l=q-d/2+n*d;h=l+z*d;k=s(l);A=g-k/2;D=A+k;k=s(h);p=g-k/2;v=p+k;l>x?(A=p=g-t/2,D=v=g+t/2):h>x&&(m=h,k=s(x),p=g-k/2,v=p+k,h=x);b&&(l=d-l,h=d-h,m=m?d-m:null);y=["M",A,l,"L",D,l,v,h];m&&y.push(v,m,p,m);y.push(p,h,"Z");a.shapeType="path";a.shapeArgs={d:y};a.percentage=z*100;a.plotX=g;a.plotY=(l+(m||h))/2;a.tooltipPos=[g,a.plotY];a.slice=E;a.half=w;n+=z})},drawPoints:function(){var a=this,b=a.options,e=a.chart.renderer;B(a.data,function(c){var o=c.options,j=c.graphic,f=c.shapeArgs;j?j.animate(f):
c.graphic=e.path(f).attr({fill:c.color,stroke:F(o.borderColor,b.borderColor),"stroke-width":F(o.borderWidth,b.borderWidth)}).add(a.group)})},sortByAngle:function(a){a.sort(function(a,b){return a.plotY-b.plotY})},drawDataLabels:function(){var a=this.data,b=this.options.dataLabels.distance,e,c,o,j=a.length,f,n;for(this.center[2]-=2*b;j--;)o=a[j],c=(e=o.half)?1:-1,n=o.plotY,f=this.getX(n,e),o.labelPos=[0,n,f+(b-5)*c,n,f+b*c,n,e?"right":"left",0];r.pie.prototype.drawDataLabels.call(this)}});q.plotOptions.pyramid=
b.merge(q.plotOptions.funnel,{neckWidth:"0%",neckHeight:"0%",reversed:!0});b.seriesTypes.pyramid=b.extendClass(b.seriesTypes.funnel,{type:"pyramid"})})(Highcharts);
