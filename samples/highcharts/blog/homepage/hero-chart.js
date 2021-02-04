
let demoChart, exChart;
let lastPoint = 20;
let randomMin=5;
let randomMax = 15;
let values = [6,1,31,2,12];
let randomArrays = [];
let streamData = [];
let centerX = 70;
let centerY = 30;
let pointsToAdd = 31;
let outerSize = '60%';
let baseColor = 'rgba(72,72,72,.2)';
let networklinkColor = 'rgba(72,72,72,.4)';
let baseTextColor = '#222';
let axisColor = '#333';
let streamLine = '#ebebeb';
let runThrough = 0;
let currentTimeout;

let titleStyle={
    fontFamily:'Arial',
     color:'#222',//'#5A62D3',
     fontSize:'18px',
     fontWeight:'bold'
};
let subTitleStyle={
    fontFamily:'Arial',
     color:'#666',
     fontSize:'16px',
     fontWeight:'300'
};

let bodyStyle={
    fontFamily:'Arial',
}

//for the network graph 
let benderSettings = {
    startAngle :-100,
     endAngle:-100,
     size:'5%',
     innerSize:'0%'
};

var colors = Highcharts.getOptions().colors;






(function(H) {
  const FLOAT = /^-?\d+\.?\d*$/;

  // Add animated textSetter, just like fill/strokeSetters
  H.Fx.prototype.textSetter = function(proceed) {
    var startValue = this.start.replace(/ /g, ''),
      endValue = this.end.replace(/ /g, ''),
      currentValue = this.end.replace(/ /g, '');

    if ((startValue || '').match(FLOAT)) {
      startValue = parseInt(startValue, 10);
      endValue = parseInt(endValue, 10);

      // No support for float
      currentValue = Highcharts.numberFormat(
        Math.round(startValue + (endValue - startValue) * this.pos), 0);
    }

    this.elem.endText = this.end;

    this.elem.attr(
      this.prop,
      currentValue,
      null,
      true
    );
  };

  // Add textGetter, not supported at all at this moment:
  H.SVGElement.prototype.textGetter = function(hash, elem) {
    var ct = this.text.element.textContent || '';
    return this.endText ? this.endText : ct.substring(0, ct.length / 2);
  }

  // Temporary change label.attr() with label.animate():
  // In core it's simple change attr(...) => animate(...) for text prop
  H.wrap(H.Series.prototype, 'drawDataLabels', function(proceed) {
    var ret,
      attr = H.SVGElement.prototype.attr,
      chart = this.chart;

    if (chart.sequenceTimer) {
      this.points.forEach(
        point => (point.dataLabels || []).forEach(
          label => label.attr = function(hash, val) {
            if (hash && hash.text !== undefined) {
              var text = hash.text;

              delete hash.text;

              this.attr(hash);

              this.animate({
                text: text
              });
              return this;
            } else {
              return attr.apply(this, arguments);
            }
          }
        )
      );
    }


    ret = proceed.apply(this, Array.prototype.slice.call(arguments, 1));

    this.points.forEach(
      p => (p.dataLabels || []).forEach(d => d.attr = attr)
    );

    return ret;

  });
})(Highcharts);



//HERO CHART
Math.easeOutQuint= function(pos) {
    return (Math.pow((pos-1), 5) +1);
}

function randomNumber(min, max) { 
    return Math.random() * (max - min) + min;
}  

let fakeData = [
        {x:Date.UTC(1844,7,1), y:20},
        {x:Date.UTC(1848,7,1), y:20},
        {x:Date.UTC(1852,7,1), y:20},
        {x:Date.UTC(1856,7,1), y:20},
        {x:Date.UTC(1860,7,1), y:20},
        {x:Date.UTC(1864,7,1), y:20},
        {x:Date.UTC(1868,7,1), y:20},
        {x:Date.UTC(1872,7,1), y:20},
        {x:Date.UTC(1876,7,1), y:20},
        {x:Date.UTC(1880,7,1), y:20},
        {x:Date.UTC(1884,7,1), y:20},
        {x:Date.UTC(1888,7,1), y:20},
        {x:Date.UTC(1892,7,1), y:20},
        {x:Date.UTC(1896,7,1), y:20},
        {x:Date.UTC(1900,7,1) , y:20},
        {x:Date.UTC(1904,7,1)    , y:20},
        {x:Date.UTC(1908,7,1)   , y:20},
        {x:Date.UTC(1912,7,1)   , y:20},
        {x:Date.UTC(1912,7,1)    , y:20},
        {x:Date.UTC(1916,7,1)   , y:20},
        {x:Date.UTC(1920,7,1),y:20},

        ///1924
        {x: -1449014400000, y:20},
        {x: -1322784000000, y:20},
        {x: -1196553600000, y:20},
        {x: -1070323200000, y:20},
        {x: -944092800000, y:20},
        {x: -817862400000, y:20},
        {x: -691632000000, y:20},
        {x: -565401600000, y:20},
        {x: -439171200000, y:20},
        {x: -312940800000, y:20},
        {x: -186710400000, y:20},
        {x: -60480000000, y:20},
        {x: 78847528000, y:20},
        {x: 191980800000, y:20},
        {x: 318211200000, y:20},
        {x: 444441600000, y:20},
        {x: 570672000000, y:20},
        //1992
        {x: 696902400000, y:20},
        //1994
        {x: 773072624000, y:20},
        {x: 899303024000, y:20},
        {x: 1025533424000, y:20},
        {x: 1151763824000, y:20},
        {x: 1277994224000, y:20},
        {x: 1404224624000, y:20},
        {x: 1580515200000, y:20}
];

let streamSeries = [{
    name: "Finland",
    data: [
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0, 11, 4, 3, 6, 0, 0, 6, 9, 7, 8, 10, 5, 5, 7, 9, 13, 7, 7, 6, 12, 7, 9, 5, 5
    ]
  }, {
    name: "Austria",
    data: [
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0, 3, 4, 2, 4, 0, 0, 8, 8, 11, 6, 12, 11, 5, 6, 7, 1, 10, 21, 9, 17, 17, 23, 16, 17
    ]
  }, {
    name: "Sweden",
    data: [
       0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0, 2, 5, 3, 7, 0, 0, 10, 4, 10, 7, 7, 8, 4, 2, 4, 8, 6, 4, 3, 3, 7, 14, 11, 15
    ]
  }, {
    name: "Norway",
    data: [
       0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0, 17, 15, 10, 15, 0, 0, 10, 16, 4, 6, 15, 14, 12, 7, 10, 9, 5, 20, 26, 25, 25, 19, 23, 26
    ]
  }, {
    name: "U.S.",
    data: [
       0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0, 4, 6, 12, 4, 0, 0, 9, 11, 7, 10, 7, 7, 8, 10, 12, 8, 6, 11, 13, 13, 34, 25, 37, 28
    ]
  },{
    name: "East Germany",
    data: [
       0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 14, 19, 23, 24, 25, 0, 0, 0, 0, 0, 0, 0
    ]
  }, {
    name: "West Germany",
    data: [
       0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 5, 10, 5, 4, 8, 0, 0, 0, 0, 0, 0, 0
    ]
  }, {
    name: "Germany",
    data: [
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0, 0, 1, 2, 6, 0, 0, 0, 7, 2, 8, 9, 0, 0, 0, 0, 0, 0, 26, 24, 29, 36, 29, 30, 19
    ]
  }, {
    name: "Netherlands",
    data: [
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 2, 2, 9, 9, 6, 4, 0, 7, 4, 4, 11, 8, 9, 8, 24
    ]
  }, {
    name: "Italy",
    data: [
       0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 1, 4, 4, 5, 4, 2, 2, 5, 14, 20, 10, 13, 11, 5, 8
    ]
  }, {
    name: "Canada",
    data: [
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0, 1, 1, 7, 1, 0, 0, 3, 2, 3, 4, 3, 3, 1, 3, 2, 4, 5, 7, 13, 15, 17, 24, 26, 25
    ]
  }, {
    name: "Switzerland",
    data: [
       0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0, 3, 1, 1, 3, 0, 0, 10, 2, 6, 2, 0, 6, 10, 5, 5, 5, 15, 3, 9, 7, 11, 14, 9, 11
    ]
  }, {
    name: "Great Britain",
    data: [
       0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0, 4, 1, 0, 3, 0, 0, 2, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 2, 1, 2, 1, 1, 4
    ]
  }, {
    name: "France",
    data: [
       0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0, 3, 1, 1, 1, 0, 0, 5, 1, 0, 3, 7, 9, 3, 1, 1, 3, 2, 9, 5, 8, 11, 9, 11, 15
    ]
  }];

let streamData0 = [];
let streamData1 = [];
let streamData2 = [];
let streamData3 = [];
let streamData4 = [];
let streamData5 = [];
let streamData6 = [];
let streamData7 = [];
let streamData8 = [];
let streamData9 = [];
let streamData10 = [];
let streamData11 = [];
let streamData12 = [];
let streamData13 = [];


let streamDataArrays = [
    streamData0,
    streamData1,
    streamData2,
    streamData3,
    streamData4, 
    streamData5,
    streamData6,
    streamData7,
    streamData8,
    streamData9,
    streamData10,
    streamData11,
    streamData12,
    streamData13,
];

function addDates(){
    console.log('addDates')
    for(ii=0;ii<streamSeries.length;++ii){
        data = streamSeries[ii].data;
        console.log(ii)

        for(kk=0;kk<data.length;++kk){
           xData = fakeData[kk].x
           yData = data[kk];
           streamDataArrays[ii].push({x:xData,y:yData});
        }
        
    }

    console.log(streamDataArrays[kk])
}
addDates();
let xTicks = [];
xTicks = fakeData.map(function(d){
    return d.x;
});


let lCount = 0;

const categories =  {
    1844:{label:''},
    1848:{label:''},
    1852:{label:''},
    1856:{label:''},
    1860:{label:''},
    1864:{label:''},
    1868:{label:''},
    1872:{label:''},
    1876:{label:''},
    1880:{label:''},
    1884:{label:''},
    1888:{label:''},
    1892:{label:''},
    1896:{label:''},
    1900:{label:''},
    1904:{label:''},
    1908:{label:''},
    1912:{label:''},
    1916:{label:''},
    1920:{label:''},

    1924:{label:'1924 Chamonix'},
    1928:{label:'1928 St. Moritz'},
    1932:{label:'1932 Lake Placid'},
    1936:{label:'1936 Garmisch-Partenkirchen'},
    1940:{label:'1940 <i>Cancelled (Sapporo)</i>'},
    1944:{label:'1944 <i>Cancelled (Cortina d\'Ampezzo)</i>'},
    1948:{label:'1928 St. Moritz'},
    1952:{label:'1952 Oslo'},
    1956:{label:'1956 Cortina d\'Ampezzo'},
    1960:{label:'1960 Squaw Valley',},
    1964:{label:'1964 Innsbruck',},
    1968:{label:'1968 Grenoble',},
    1972:{label:'1972 Sapporo',},
    1976:{label:'1976 Innsbruck',},
    1980:{label:'1980 Lake Placid',},
    1984:{label:'1984 Sarajevo',},
    1988:{label:'1988 Calgary',},
    1992:{label:'1992 Albertville'},
    1994:{label:'1994 Lillehammer',},
    1998:{label:'1998 Nagano',},
    2002:{label: '2002 Salt Lake City',},
    2006:{label: '2006 Turin',},
    2010:{label: '2010 Vancouver',},
    2014:{label: '2014 Sochi'},
    2016:{label:''},
    2020:{label:''},
 }
              
 let dashStyles = ['dot','dotDash','shortDotDash'];
            
const splineSeries = [
    {type:'spline',
        name:'Import Europe',
        color:Highcharts.getOptions().colors[3],
        label:{
            enabled:false
        },
        lineWidth:0,
        marker:{
            enabled:false

        },
        showInLegend:false,
        dashStyle:'dash',
        data:
        [ [Date.UTC(2002,4,1),0.00],[Date.UTC(2002,5,1),0.30],[Date.UTC(2002,6,1),0.80],[Date.UTC(2002,7,1),1.20],[Date.UTC(2002,8,1),1.80],[Date.UTC(2002,9,1),1.50],[Date.UTC(2002,10,1),0.70],[Date.UTC(2002,11,1),3.30],[Date.UTC(2002,12,1),3.30],[Date.UTC(2003,1,1),1.60],[Date.UTC(2003,2,1),3.50],[Date.UTC(2003,3,1),5.60],[Date.UTC(2003,4,1),5.60],[Date.UTC(2003,5,1),4.00],[Date.UTC(2003,6,1),0.30],[Date.UTC(2003,7,1),-0.50],[Date.UTC(2003,8,1),-1.10],[Date.UTC(2003,9,1),-1.10],[Date.UTC(2003,10,1),-4.30],[Date.UTC(2003,11,1),-2.00],[Date.UTC(2003,12,1),-3.20],[Date.UTC(2004,1,1),-3.70],[Date.UTC(2004,2,1),-3.50],[Date.UTC(2004,3,1),-5.50],[Date.UTC(2004,4,1),-8.60],[Date.UTC(2004,5,1),-8.20],[Date.UTC(2004,6,1),-1.60],[Date.UTC(2004,7,1),-6.40],[Date.UTC(2004,8,1),-7.40],[Date.UTC(2004,9,1),-7.10],[Date.UTC(2004,10,1),0.60],[Date.UTC(2004,11,1),2.80],[Date.UTC(2004,12,1),5.60],[Date.UTC(2005,1,1),5.80],[Date.UTC(2005,2,1),6.10],[Date.UTC(2005,3,1),5.30],[Date.UTC(2005,4,1),3.10],[Date.UTC(2005,5,1),3.50],[Date.UTC(2005,6,1),5.00],[Date.UTC(2005,7,1),4.60],[Date.UTC(2005,8,1),5.00],[Date.UTC(2005,9,1),3.00],[Date.UTC(2005,10,1),2.50],[Date.UTC(2005,11,1),4.60],[Date.UTC(2005,12,1),3.40],[Date.UTC(2006,1,1),4.00],[Date.UTC(2006,2,1),4.90],[Date.UTC(2006,3,1),5.50],[Date.UTC(2006,4,1),5.30],[Date.UTC(2006,5,1),4.70],[Date.UTC(2006,6,1),5.80],[Date.UTC(2006,7,1),5.10],[Date.UTC(2006,8,1),4.60],[Date.UTC(2006,9,1),5.10],[Date.UTC(2006,10,1),5.00],[Date.UTC(2006,11,1),8.80],[Date.UTC(2006,12,1),8.90],[Date.UTC(2007,1,1),8.60],[Date.UTC(2007,2,1),10.30],[Date.UTC(2007,3,1),10.50],[Date.UTC(2007,4,1),11.20],[Date.UTC(2007,5,1),11.50],[Date.UTC(2007,6,1),15.50],[Date.UTC(2007,7,1),15.50],[Date.UTC(2007,8,1),17.00],[Date.UTC(2007,9,1),18.80],[Date.UTC(2007,10,1),11.30],[Date.UTC(2007,11,1),7.40],[Date.UTC(2007,12,1),8.90],[Date.UTC(2008,1,1),8.50],[Date.UTC(2008,2,1),5.20],[Date.UTC(2008,3,1),5.00],[Date.UTC(2008,4,1),13.30],[Date.UTC(2008,5,1),12.50],[Date.UTC(2008,6,1),21.20],[Date.UTC(2008,7,1),24.00],[Date.UTC(2008,8,1),20.80],[Date.UTC(2008,9,1),11.30],[Date.UTC(2008,10,1),32.70],[Date.UTC(2008,11,1),33.90],[Date.UTC(2008,12,1),18.50],[Date.UTC(2009,1,1),24.20],[Date.UTC(2009,2,1),17.60],[Date.UTC(2009,3,1),8.10],[Date.UTC(2009,4,1),-9.00],[Date.UTC(2009,5,1),-14.90],[Date.UTC(2009,6,1),-13.90],[Date.UTC(2009,7,1),-21.10],[Date.UTC(2009,8,1),-23.90],[Date.UTC(2009,9,1),-13.10],[Date.UTC(2009,10,1),-9.40],[Date.UTC(2009,11,1),-2.50],[Date.UTC(2009,12,1),6.10],[Date.UTC(2010,1,1),-0.80],[Date.UTC(2010,2,1),1.30],[Date.UTC(2010,3,1),20.80],[Date.UTC(2010,4,1),28.70],[Date.UTC(2010,5,1),42.00],[Date.UTC(2010,6,1),25.60],[Date.UTC(2010,7,1),28.40],[Date.UTC(2010,8,1),27.60],[Date.UTC(2010,9,1),20.40],[Date.UTC(2010,10,1),17.30],[Date.UTC(2010,11,1),13.60],[Date.UTC(2010,12,1),9.40],[Date.UTC(2011,1,1),15.20],[Date.UTC(2011,2,1),16.40],[Date.UTC(2011,3,1),2.20],[Date.UTC(2011,4,1),-0.10],[Date.UTC(2011,5,1),4.20],[Date.UTC(2011,6,1),2.10],[Date.UTC(2011,7,1),1.00],[Date.UTC(2011,8,1),0.30],[Date.UTC(2011,9,1),3.30],[Date.UTC(2011,10,1),-0.40],[Date.UTC(2011,11,1),-0.70],[Date.UTC(2011,12,1),3.30],[Date.UTC(2012,1,1),4.50],[Date.UTC(2012,2,1),7.60],[Date.UTC(2012,3,1),8.80],[Date.UTC(2012,4,1),9.80],[Date.UTC(2012,5,1),0.20],[Date.UTC(2012,6,1),7.90],[Date.UTC(2012,7,1),5.50],[Date.UTC(2012,8,1),3.90],[Date.UTC(2012,9,1),4.50],[Date.UTC(2012,10,1),6.30],[Date.UTC(2012,11,1),12.70],[Date.UTC(2012,12,1),17.50],[Date.UTC(2013,1,1),14.10],[Date.UTC(2013,2,1),16.60],[Date.UTC(2013,3,1),14.20],[Date.UTC(2013,4,1),11.60],[Date.UTC(2013,5,1),12.40],[Date.UTC(2013,6,1),7.40],[Date.UTC(2013,7,1),6.40],[Date.UTC(2013,8,1),6.20],[Date.UTC(2013,9,1),10.50],[Date.UTC(2013,10,1),10.30],[Date.UTC(2013,11,1),10.30],[Date.UTC(2013,12,1),5.40],[Date.UTC(2014,1,1),2.80],[Date.UTC(2014,2,1),3.60],[Date.UTC(2014,3,1),3.00],[Date.UTC(2014,4,1),0.10],[Date.UTC(2014,5,1),4.30],[Date.UTC(2014,6,1),-1.10],[Date.UTC(2014,7,1),1.80],[Date.UTC(2014,8,1),3.10],[Date.UTC(2014,9,1),2.00],[Date.UTC(2014,10,1),0.80],[Date.UTC(2014,11,1),1.20],[Date.UTC(2014,12,1),4.50],[Date.UTC(2015,1,1),8.60],[Date.UTC(2015,2,1),8.10],[Date.UTC(2015,3,1),9.50],[Date.UTC(2015,4,1),5.00],[Date.UTC(2015,5,1),4.60],[Date.UTC(2015,6,1),2.40],[Date.UTC(2015,7,1),0.70],[Date.UTC(2015,8,1),-1.50],[Date.UTC(2015,9,1),-1.10],[Date.UTC(2015,10,1),0.40],[Date.UTC(2015,11,1),2.60],[Date.UTC(2015,12,1),-9.90],[Date.UTC(2016,1,1),-3.00],[Date.UTC(2016,2,1),-2.20],[Date.UTC(2016,3,1),-9.70],[Date.UTC(2016,4,1),0.30],[Date.UTC(2016,5,1),-2.60],[Date.UTC(2016,6,1),-7.40],[Date.UTC(2016,7,1),-8.90],[Date.UTC(2016,8,1),-8.40],[Date.UTC(2016,9,1),-3.10],[Date.UTC(2016,10,1),-0.30],[Date.UTC(2016,11,1),-6.30],[Date.UTC(2016,12,1),-4.40],[Date.UTC(2017,1,1),-5.60],[Date.UTC(2017,2,1),-8.60],[Date.UTC(2017,3,1),-5.90],[Date.UTC(2017,4,1),-17.10],[Date.UTC(2017,5,1),-14.40],[Date.UTC(2017,6,1),-11.90],[Date.UTC(2017,7,1),-9.60],[Date.UTC(2017,8,1),-13.50],[Date.UTC(2017,9,1),-6.50],[Date.UTC(2017,10,1),-3.90],[Date.UTC(2017,11,1),0.40],[Date.UTC(2017,12,1),10.30],[Date.UTC(2018,1,1),8.60],[Date.UTC(2018,2,1),10.30],[Date.UTC(2018,3,1),3.10],[Date.UTC(2018,4,1),16.90],[Date.UTC(2018,5,1),7.10],[Date.UTC(2018,6,1),10.90],[Date.UTC(2018,7,1),8.00],[Date.UTC(2018,8,1),8.30],[Date.UTC(2018,9,1),9.60],[Date.UTC(2018,10,1),2.50],[Date.UTC(2018,11,1),1.50],[Date.UTC(2018,12,1),1.30],[Date.UTC(2019,1,1),-2.20],[Date.UTC(2019,2,1),-5.60],[Date.UTC(2019,3,1),1.10],[Date.UTC(2019,4,1),-14.70],[Date.UTC(2019,5,1),-3.00],[Date.UTC(2019,6,1),-3.50],[Date.UTC(2019,7,1),-7.90],[Date.UTC(2019,8,1),-7.80],{x:Date.UTC(2019,9,1),y:-8.90,marker:{enable:false,symbol:'circle',r:5}},[Date.UTC(2019,10,1),-11.30],[Date.UTC(2019,11,1),-6.30],[Date.UTC(2019,12,1),-6.50],[Date.UTC(2020,1,1),-9.50],[Date.UTC(2020,2,1),-7.50],[Date.UTC(2020,3,1),-11.90],[Date.UTC(2020,4,1),-26.30]
         ]
    },
    {type:'spline',
        name:'Import Asia',
         marker:{
           enabled:false,
          
        }, 
        label:{
            enabled:false
        },
        showInLegend:false,
        id:'importAsia',
        dashStyle:'dotdash',
       color: Highcharts.getOptions().colors[7],
        data:[
            [Date.UTC(2002,4,1),0.00],[Date.UTC(2002,5,1),0.30],[Date.UTC(2002,6,1),0.80],[Date.UTC(2002,7,1),1.20],[Date.UTC(2002,8,1),1.80],[Date.UTC(2002,9,1),1.50],[Date.UTC(2002,10,1),0.70],[Date.UTC(2002,11,1),3.30],[Date.UTC(2002,12,1),3.30],[Date.UTC(2003,1,1),1.60],[Date.UTC(2003,2,1),3.50],[Date.UTC(2003,3,1),5.60],[Date.UTC(2003,4,1),5.60],[Date.UTC(2003,5,1),4.00],[Date.UTC(2003,6,1),0.30],[Date.UTC(2003,7,1),-0.50],[Date.UTC(2003,8,1),-1.10],[Date.UTC(2003,9,1),-1.10],[Date.UTC(2003,10,1),-4.30],[Date.UTC(2003,11,1),-2.00],[Date.UTC(2003,12,1),-3.20],[Date.UTC(2004,1,1),-3.70],[Date.UTC(2004,2,1),-3.50],[Date.UTC(2004,3,1),-5.50],[Date.UTC(2004,4,1),-8.60],[Date.UTC(2004,5,1),-8.20],[Date.UTC(2004,6,1),-1.60],[Date.UTC(2004,7,1),-6.40],[Date.UTC(2004,8,1),-7.40],[Date.UTC(2004,9,1),-7.10],[Date.UTC(2004,10,1),0.60],[Date.UTC(2004,11,1),2.80],[Date.UTC(2004,12,1),5.60],[Date.UTC(2005,1,1),5.80],[Date.UTC(2005,2,1),6.10],[Date.UTC(2005,3,1),5.30],[Date.UTC(2005,4,1),3.10],[Date.UTC(2005,5,1),3.50],[Date.UTC(2005,6,1),5.00],[Date.UTC(2005,7,1),4.60],[Date.UTC(2005,8,1),5.00],[Date.UTC(2005,9,1),3.00],[Date.UTC(2005,10,1),2.50],[Date.UTC(2005,11,1),4.60],[Date.UTC(2005,12,1),3.40],[Date.UTC(2006,1,1),4.00],[Date.UTC(2006,2,1),4.90],[Date.UTC(2006,3,1),5.50],[Date.UTC(2006,4,1),5.30],[Date.UTC(2006,5,1),4.70],[Date.UTC(2006,6,1),5.80],[Date.UTC(2006,7,1),5.10],[Date.UTC(2006,8,1),4.60],[Date.UTC(2006,9,1),5.10],[Date.UTC(2006,10,1),5.00],[Date.UTC(2006,11,1),8.80],[Date.UTC(2006,12,1),8.90],[Date.UTC(2007,1,1),8.60],[Date.UTC(2007,2,1),10.30],[Date.UTC(2007,3,1),10.50],[Date.UTC(2007,4,1),11.20],[Date.UTC(2007,5,1),11.50],[Date.UTC(2007,6,1),15.50],[Date.UTC(2007,7,1),15.50],[Date.UTC(2007,8,1),17.00],[Date.UTC(2007,9,1),18.80],[Date.UTC(2007,10,1),11.30],[Date.UTC(2007,11,1),7.40],[Date.UTC(2007,12,1),8.90],[Date.UTC(2008,1,1),8.50],[Date.UTC(2008,2,1),5.20],[Date.UTC(2008,3,1),5.00],[Date.UTC(2008,4,1),13.30],[Date.UTC(2008,5,1),12.50],[Date.UTC(2008,6,1),21.20],[Date.UTC(2008,7,1),24.00],[Date.UTC(2008,8,1),20.80],[Date.UTC(2008,9,1),11.30],[Date.UTC(2008,10,1),32.70],[Date.UTC(2008,11,1),33.90],[Date.UTC(2008,12,1),18.50],[Date.UTC(2009,1,1),24.20],[Date.UTC(2009,2,1),17.60],[Date.UTC(2009,3,1),8.10],[Date.UTC(2009,4,1),-9.00],[Date.UTC(2009,5,1),-14.90],[Date.UTC(2009,6,1),-13.90],[Date.UTC(2009,7,1),-21.10],[Date.UTC(2009,8,1),-23.90],[Date.UTC(2009,9,1),-13.10],[Date.UTC(2009,10,1),-9.40],[Date.UTC(2009,11,1),-2.50],[Date.UTC(2009,12,1),6.10],[Date.UTC(2010,1,1),-0.80],[Date.UTC(2010,2,1),1.30],[Date.UTC(2010,3,1),20.80],[Date.UTC(2010,4,1),28.70],[Date.UTC(2010,5,1),42.00],[Date.UTC(2010,6,1),25.60],[Date.UTC(2010,7,1),28.40],[Date.UTC(2010,8,1),27.60],[Date.UTC(2010,9,1),20.40],[Date.UTC(2010,10,1),17.30],[Date.UTC(2010,11,1),13.60],[Date.UTC(2010,12,1),9.40],[Date.UTC(2011,1,1),15.20],[Date.UTC(2011,2,1),16.40],[Date.UTC(2011,3,1),2.20],[Date.UTC(2011,4,1),-0.10],[Date.UTC(2011,5,1),4.20],[Date.UTC(2011,6,1),2.10],[Date.UTC(2011,7,1),1.00],[Date.UTC(2011,8,1),0.30],[Date.UTC(2011,9,1),3.30],[Date.UTC(2011,10,1),-0.40],[Date.UTC(2011,11,1),-0.70],[Date.UTC(2011,12,1),3.30],[Date.UTC(2012,1,1),4.50],[Date.UTC(2012,2,1),7.60],[Date.UTC(2012,3,1),8.80],[Date.UTC(2012,4,1),9.80],[Date.UTC(2012,5,1),0.20],[Date.UTC(2012,6,1),7.90],[Date.UTC(2012,7,1),5.50],[Date.UTC(2012,8,1),3.90],[Date.UTC(2012,9,1),4.50],[Date.UTC(2012,10,1),6.30],[Date.UTC(2012,11,1),12.70],[Date.UTC(2012,12,1),17.50],[Date.UTC(2013,1,1),14.10],[Date.UTC(2013,2,1),16.60],[Date.UTC(2013,3,1),14.20],[Date.UTC(2013,4,1),11.60],[Date.UTC(2013,5,1),12.40],[Date.UTC(2013,6,1),7.40],[Date.UTC(2013,7,1),6.40],[Date.UTC(2013,8,1),6.20],[Date.UTC(2013,9,1),10.50],[Date.UTC(2013,10,1),10.30],[Date.UTC(2013,11,1),10.30],[Date.UTC(2013,12,1),5.40],[Date.UTC(2014,1,1),2.80],[Date.UTC(2014,2,1),3.60],[Date.UTC(2014,3,1),3.00],[Date.UTC(2014,4,1),0.10],[Date.UTC(2014,5,1),4.30],[Date.UTC(2014,6,1),-1.10],[Date.UTC(2014,7,1),1.80],[Date.UTC(2014,8,1),3.10],[Date.UTC(2014,9,1),2.00],[Date.UTC(2014,10,1),0.80],[Date.UTC(2014,11,1),1.20],[Date.UTC(2014,12,1),4.50],[Date.UTC(2015,1,1),8.60],[Date.UTC(2015,2,1),8.10],[Date.UTC(2015,3,1),9.50],[Date.UTC(2015,4,1),5.00],[Date.UTC(2015,5,1),4.60],[Date.UTC(2015,6,1),2.40],[Date.UTC(2015,7,1),0.70],[Date.UTC(2015,8,1),-1.50],[Date.UTC(2015,9,1),-1.10],[Date.UTC(2015,10,1),0.40],[Date.UTC(2015,11,1),2.60],[Date.UTC(2015,12,1),-9.90],[Date.UTC(2016,1,1),-3.00],[Date.UTC(2016,2,1),-2.20],[Date.UTC(2016,3,1),-9.70],[Date.UTC(2016,4,1),0.30],[Date.UTC(2016,5,1),-2.60],[Date.UTC(2016,6,1),-7.40],[Date.UTC(2016,7,1),-8.90],[Date.UTC(2016,8,1),-8.40],[Date.UTC(2016,9,1),-3.10],[Date.UTC(2016,10,1),-0.30],[Date.UTC(2016,11,1),-6.30],[Date.UTC(2016,12,1),-4.40],[Date.UTC(2017,1,1),-5.60],[Date.UTC(2017,2,1),-8.60],[Date.UTC(2017,3,1),-5.90],[Date.UTC(2017,4,1),-17.10],[Date.UTC(2017,5,1),-14.40],[Date.UTC(2017,6,1),-11.90],[Date.UTC(2017,7,1),-9.60],[Date.UTC(2017,8,1),-13.50],[Date.UTC(2017,9,1),-6.50],[Date.UTC(2017,10,1),-3.90],[Date.UTC(2017,11,1),0.40],[Date.UTC(2017,12,1),10.30],[Date.UTC(2018,1,1),8.60],[Date.UTC(2018,2,1),10.30],[Date.UTC(2018,3,1),3.10],[Date.UTC(2018,4,1),16.90],[Date.UTC(2018,5,1),7.10],[Date.UTC(2018,6,1),10.90],[Date.UTC(2018,7,1),8.00],[Date.UTC(2018,8,1),8.30],[Date.UTC(2018,9,1),9.60],[Date.UTC(2018,10,1),2.50],[Date.UTC(2018,11,1),1.50],[Date.UTC(2018,12,1),1.30],[Date.UTC(2019,1,1),-2.20],[Date.UTC(2019,2,1),-5.60],[Date.UTC(2019,3,1),1.10],[Date.UTC(2019,4,1),-14.70],[Date.UTC(2019,5,1),-3.00],[Date.UTC(2019,6,1),-3.50],[Date.UTC(2019,7,1),-7.90],[Date.UTC(2019,8,1),-7.80],[Date.UTC(2019,9,1),-8.90],[Date.UTC(2019,10,1),-11.30],[Date.UTC(2019,11,1),-6.30],[Date.UTC(2019,12,1),-6.50],[Date.UTC(2020,1,1),-9.50],[Date.UTC(2020,2,1),-7.50],[Date.UTC(2020,3,1),-11.90],[Date.UTC(2020,4,1),-26.30]
        ]
    },
    {type:'spline',
        marker:{
               enabled:false,
           },
           label:{
            enabled:false
        },
        showInLegend:false,
        dashStyle:'longDash',
       color: Highcharts.getOptions().colors[7],
        name:'Export air passenger fares',
        data:[[Date.UTC(2002,4,1),-0.20],[Date.UTC(2002,5,1),-6.10],[Date.UTC(2002,6,1),-6.10],[Date.UTC(2002,7,1),-5.00],[Date.UTC(2002,8,1),-8.60],[Date.UTC(2002,9,1),-10.40],[Date.UTC(2002,10,1),-7.50],[Date.UTC(2002,11,1),-9.00],[Date.UTC(2002,12,1),-9.00],[Date.UTC(2003,1,1),-10.20],[Date.UTC(2003,2,1),-3.00],[Date.UTC(2003,3,1),-1.60],[Date.UTC(2003,4,1),-5.70],[Date.UTC(2003,5,1),-0.80],[Date.UTC(2003,6,1),1.10],[Date.UTC(2003,7,1),6.80],[Date.UTC(2003,8,1),7.60],[Date.UTC(2003,9,1),3.70],[Date.UTC(2003,10,1),3.40],[Date.UTC(2003,11,1),3.80],[Date.UTC(2003,12,1),1.70],[Date.UTC(2004,1,1),8.90],[Date.UTC(2004,2,1),0.00],[Date.UTC(2004,3,1),0.40],[Date.UTC(2004,4,1),5.90],[Date.UTC(2004,5,1),7.60],[Date.UTC(2004,6,1),7.40],[Date.UTC(2004,7,1),7.50],[Date.UTC(2004,8,1),7.40],[Date.UTC(2004,9,1),5.20],[Date.UTC(2004,10,1),4.40],[Date.UTC(2004,11,1),5.30],[Date.UTC(2004,12,1),6.00],[Date.UTC(2005,1,1),-0.60],[Date.UTC(2005,2,1),2.10],[Date.UTC(2005,3,1),0.90],[Date.UTC(2005,4,1),2.30],[Date.UTC(2005,5,1),-1.30],[Date.UTC(2005,6,1),-2.50],[Date.UTC(2005,7,1),-2.60],[Date.UTC(2005,8,1),-3.70],[Date.UTC(2005,9,1),-0.80],[Date.UTC(2005,10,1),0.00],[Date.UTC(2005,11,1),-1.10],[Date.UTC(2005,12,1),0.60],[Date.UTC(2006,1,1),0.60],[Date.UTC(2006,2,1),2.50],[Date.UTC(2006,3,1),1.90],[Date.UTC(2006,4,1),-1.10],[Date.UTC(2006,5,1),4.10],[Date.UTC(2006,6,1),4.50],[Date.UTC(2006,7,1),2.30],[Date.UTC(2006,8,1),4.60],[Date.UTC(2006,9,1),6.10],[Date.UTC(2006,10,1),9.10],[Date.UTC(2006,11,1),8.40],[Date.UTC(2006,12,1),7.40],[Date.UTC(2007,1,1),6.60],[Date.UTC(2007,2,1),9.80],[Date.UTC(2007,3,1),9.80],[Date.UTC(2007,4,1),1.40],[Date.UTC(2007,5,1),0.00],[Date.UTC(2007,6,1),-0.50],[Date.UTC(2007,7,1),-0.10],[Date.UTC(2007,8,1),0.20],[Date.UTC(2007,9,1),1.80],[Date.UTC(2007,10,1),2.60],[Date.UTC(2007,11,1),5.70],[Date.UTC(2007,12,1),3.40],[Date.UTC(2008,1,1),3.60],[Date.UTC(2008,2,1),3.80],[Date.UTC(2008,3,1),5.10],[Date.UTC(2008,4,1),18.80],[Date.UTC(2008,5,1),22.50],[Date.UTC(2008,6,1),27.10],[Date.UTC(2008,7,1),27.20],[Date.UTC(2008,8,1),25.00],[Date.UTC(2008,9,1),10.90],[Date.UTC(2008,10,1),4.60],[Date.UTC(2008,11,1),1.90],[Date.UTC(2008,12,1),23.10],[Date.UTC(2009,1,1),-0.50],[Date.UTC(2009,2,1),-5.10],[Date.UTC(2009,3,1),-9.10],[Date.UTC(2009,4,1),-11.10],[Date.UTC(2009,5,1),-20.20],[Date.UTC(2009,6,1),-22.70],[Date.UTC(2009,7,1),-21.20],[Date.UTC(2009,8,1),-16.80],[Date.UTC(2009,9,1),-12.30],[Date.UTC(2009,10,1),-7.20],[Date.UTC(2009,11,1),0.60],[Date.UTC(2009,12,1),-7.20],[Date.UTC(2010,1,1),3.10],[Date.UTC(2010,2,1),8.50],[Date.UTC(2010,3,1),15.00],[Date.UTC(2010,4,1),20.60],[Date.UTC(2010,5,1),22.50],[Date.UTC(2010,6,1),23.40],[Date.UTC(2010,7,1),18.40],[Date.UTC(2010,8,1),14.50],[Date.UTC(2010,9,1),21.40],[Date.UTC(2010,10,1),24.70],[Date.UTC(2010,11,1),20.40],[Date.UTC(2010,12,1),16.70],[Date.UTC(2011,1,1),20.60],[Date.UTC(2011,2,1),19.80],[Date.UTC(2011,3,1),20.00],[Date.UTC(2011,4,1),18.20],[Date.UTC(2011,5,1),22.70],[Date.UTC(2011,6,1),19.30],[Date.UTC(2011,7,1),22.30],[Date.UTC(2011,8,1),23.80],[Date.UTC(2011,9,1),17.40],[Date.UTC(2011,10,1),14.00],[Date.UTC(2011,11,1),10.50],[Date.UTC(2011,12,1),9.20],[Date.UTC(2012,1,1),13.30],[Date.UTC(2012,2,1),12.10],[Date.UTC(2012,3,1),9.30],[Date.UTC(2012,4,1),5.90],[Date.UTC(2012,5,1),0.80],[Date.UTC(2012,6,1),3.80],[Date.UTC(2012,7,1),-1.00],[Date.UTC(2012,8,1),-5.20],[Date.UTC(2012,9,1),-6.40],[Date.UTC(2012,10,1),-6.90],[Date.UTC(2012,11,1),-2.30],[Date.UTC(2012,12,1),-1.00],[Date.UTC(2013,1,1),-8.50],[Date.UTC(2013,2,1),-7.80],[Date.UTC(2013,3,1),-5.80],[Date.UTC(2013,4,1),-7.70],[Date.UTC(2013,5,1),-3.50],[Date.UTC(2013,6,1),-0.40],[Date.UTC(2013,7,1),-0.20],[Date.UTC(2013,8,1),0.40],[Date.UTC(2013,9,1),3.50],[Date.UTC(2013,10,1),3.10],[Date.UTC(2013,11,1),0.80],[Date.UTC(2013,12,1),1.40],[Date.UTC(2014,1,1),2.80],[Date.UTC(2014,2,1),1.20],[Date.UTC(2014,3,1),0.50],[Date.UTC(2014,4,1),3.70],[Date.UTC(2014,5,1),2.10],[Date.UTC(2014,6,1),-2.30],[Date.UTC(2014,7,1),-2.10],[Date.UTC(2014,8,1),0.10],[Date.UTC(2014,9,1),0.90],[Date.UTC(2014,10,1),4.30],[Date.UTC(2014,11,1),-1.30],[Date.UTC(2014,12,1),-0.70],[Date.UTC(2015,1,1),-1.70],[Date.UTC(2015,2,1),0.20],[Date.UTC(2015,3,1),-1.00],[Date.UTC(2015,4,1),-4.80],[Date.UTC(2015,5,1),-5.50],[Date.UTC(2015,6,1),-5.70],[Date.UTC(2015,7,1),-4.40],[Date.UTC(2015,8,1),-5.40],[Date.UTC(2015,9,1),-9.10],[Date.UTC(2015,10,1),-13.00],[Date.UTC(2015,11,1),-11.30],[Date.UTC(2015,12,1),-8.40],[Date.UTC(2016,1,1),-13.80],[Date.UTC(2016,2,1),-11.70],[Date.UTC(2016,3,1),-11.20],[Date.UTC(2016,4,1),-12.40],[Date.UTC(2016,5,1),-9.50],[Date.UTC(2016,6,1),-4.60],[Date.UTC(2016,7,1),-4.70],[Date.UTC(2016,8,1),-4.10],[Date.UTC(2016,9,1),-0.40],[Date.UTC(2016,10,1),3.70],[Date.UTC(2016,11,1),8.40],[Date.UTC(2016,12,1),2.80],[Date.UTC(2017,1,1),8.60],[Date.UTC(2017,2,1),8.00],[Date.UTC(2017,3,1),9.30],[Date.UTC(2017,4,1),12.70],[Date.UTC(2017,5,1),8.30],[Date.UTC(2017,6,1),6.80],[Date.UTC(2017,7,1),5.80],[Date.UTC(2017,8,1),3.00],[Date.UTC(2017,9,1),3.00],[Date.UTC(2017,10,1),0.40],[Date.UTC(2017,11,1),0.40],[Date.UTC(2017,12,1),2.70],[Date.UTC(2018,1,1),1.20],[Date.UTC(2018,2,1),3.50],[Date.UTC(2018,3,1),3.40],[Date.UTC(2018,4,1),2.20],[Date.UTC(2018,5,1),-1.50],[Date.UTC(2018,6,1),-1.20],[Date.UTC(2018,7,1),-1.00],[Date.UTC(2018,8,1),-2.70],[Date.UTC(2018,9,1),-2.60],[Date.UTC(2018,10,1),-2.40],[Date.UTC(2018,11,1),-0.90],[Date.UTC(2018,12,1),-1.20],[Date.UTC(2019,1,1),-5.40],[Date.UTC(2019,2,1),-5.10],[Date.UTC(2019,3,1),-7.80],[Date.UTC(2019,4,1),-6.90],[Date.UTC(2019,5,1),-1.20],[Date.UTC(2019,6,1),-1.40],[Date.UTC(2019,7,1),2.30],[Date.UTC(2019,8,1),1.80],[Date.UTC(2019,9,1),-0.80],[Date.UTC(2019,10,1),1.40],[Date.UTC(2019,11,1),-0.90],[Date.UTC(2019,12,1),4.20],[Date.UTC(2020,1,1),1.10],[Date.UTC(2020,2,1),4.70],[Date.UTC(2020,3,1),-2.50],[Date.UTC(2020,4,1),-6.90]]
    },
    {type:'spline',
        dashStyle:'solid',
        label:{
            enabled:false
        },
        showInLegend:false,
        color:Highcharts.getOptions().colors[7],
        name:'Export air passenger fares',
        data:[[Date.UTC(2002,4,1),0.50],[Date.UTC(2002,5,1),1.90],[Date.UTC(2002,6,1),2.80],[Date.UTC(2002,7,1),7.50],[Date.UTC(2002,8,1),10.00],[Date.UTC(2002,9,1),5.50],[Date.UTC(2002,10,1),2.30],[Date.UTC(2002,11,1),4.50],[Date.UTC(2002,12,1),4.90],[Date.UTC(2003,1,1),9.20],[Date.UTC(2003,2,1),9.00],[Date.UTC(2003,3,1),11.20],[Date.UTC(2003,4,1),10.90],[Date.UTC(2003,5,1),10.50],[Date.UTC(2003,6,1),13.40],[Date.UTC(2003,7,1),11.90],[Date.UTC(2003,8,1),10.20],[Date.UTC(2003,9,1),9.20],[Date.UTC(2003,10,1),15.10],[Date.UTC(2003,11,1),14.80],[Date.UTC(2003,12,1),14.70],[Date.UTC(2004,1,1),15.70],[Date.UTC(2004,2,1),15.10],[Date.UTC(2004,3,1),13.70],[Date.UTC(2004,4,1),13.70],[Date.UTC(2004,5,1),8.30],[Date.UTC(2004,6,1),5.80],[Date.UTC(2004,7,1),4.90],[Date.UTC(2004,8,1),9.30],[Date.UTC(2004,9,1),10.30],[Date.UTC(2004,10,1),6.20],[Date.UTC(2004,11,1),9.80],[Date.UTC(2004,12,1),13.20],[Date.UTC(2005,1,1),10.30],[Date.UTC(2005,2,1),9.10],[Date.UTC(2005,3,1),10.60],[Date.UTC(2005,4,1),7.80],[Date.UTC(2005,5,1),15.50],[Date.UTC(2005,6,1),10.00],[Date.UTC(2005,7,1),13.70],[Date.UTC(2005,8,1),11.00],[Date.UTC(2005,9,1),7.20],[Date.UTC(2005,10,1),6.30],[Date.UTC(2005,11,1),-1.60],[Date.UTC(2005,12,1),-4.30],[Date.UTC(2006,1,1),-6.00],[Date.UTC(2006,2,1),0.20],[Date.UTC(2006,3,1),-4.00],[Date.UTC(2006,4,1),-1.30],[Date.UTC(2006,5,1),-2.50],[Date.UTC(2006,6,1),2.30],[Date.UTC(2006,7,1),-0.50],[Date.UTC(2006,8,1),-0.50],[Date.UTC(2006,9,1),2.10],[Date.UTC(2006,10,1),3.00],[Date.UTC(2006,11,1),6.40],[Date.UTC(2006,12,1),7.00],[Date.UTC(2007,1,1),6.90],[Date.UTC(2007,2,1),3.20],[Date.UTC(2007,3,1),7.20],[Date.UTC(2007,4,1),9.30],[Date.UTC(2007,5,1),7.50],[Date.UTC(2007,6,1),5.70],[Date.UTC(2007,7,1),5.70],[Date.UTC(2007,8,1),3.90],[Date.UTC(2007,9,1),8.60],[Date.UTC(2007,10,1),10.00],[Date.UTC(2007,11,1),11.50],[Date.UTC(2007,12,1),13.40],[Date.UTC(2008,1,1),14.30],[Date.UTC(2008,2,1),9.80],[Date.UTC(2008,3,1),11.60],[Date.UTC(2008,4,1),6.30],[Date.UTC(2008,5,1),6.00],[Date.UTC(2008,6,1),16.40],[Date.UTC(2008,7,1),17.60],[Date.UTC(2008,8,1),20.60],[Date.UTC(2008,9,1),11.20],[Date.UTC(2008,10,1),5.50],[Date.UTC(2008,11,1),5.20],[Date.UTC(2008,12,1),5.70],[Date.UTC(2009,1,1),1.90],[Date.UTC(2009,2,1),-3.50],[Date.UTC(2009,3,1),-9.40],[Date.UTC(2009,4,1),-11.00],[Date.UTC(2009,5,1),-15.50],[Date.UTC(2009,6,1),-19.40],[Date.UTC(2009,7,1),-21.80],[Date.UTC(2009,8,1),-19.50],[Date.UTC(2009,9,1),-17.80],[Date.UTC(2009,10,1),-14.40],[Date.UTC(2009,11,1),-11.30],[Date.UTC(2009,12,1),-5.20],[Date.UTC(2010,1,1),-4.40],[Date.UTC(2010,2,1),5.10],[Date.UTC(2010,3,1),11.30],[Date.UTC(2010,4,1),19.20],[Date.UTC(2010,5,1),22.00],[Date.UTC(2010,6,1),27.60],[Date.UTC(2010,7,1),30.50],[Date.UTC(2010,8,1),21.20],[Date.UTC(2010,9,1),21.90],[Date.UTC(2010,10,1),21.20],[Date.UTC(2010,11,1),15.00],[Date.UTC(2010,12,1),8.30],[Date.UTC(2011,1,1),13.20],[Date.UTC(2011,2,1),4.10],[Date.UTC(2011,3,1),9.60],[Date.UTC(2011,4,1),8.10],[Date.UTC(2011,5,1),12.20],[Date.UTC(2011,6,1),5.80],[Date.UTC(2011,7,1),10.20],[Date.UTC(2011,8,1),18.10],[Date.UTC(2011,9,1),11.90],[Date.UTC(2011,10,1),11.90],[Date.UTC(2011,11,1),13.00],[Date.UTC(2011,12,1),13.10],[Date.UTC(2012,1,1),9.50],[Date.UTC(2012,2,1),15.60],[Date.UTC(2012,3,1),7.10],[Date.UTC(2012,4,1),6.20],[Date.UTC(2012,5,1),8.40],[Date.UTC(2012,6,1),8.70],[Date.UTC(2012,7,1),3.80],[Date.UTC(2012,8,1),-3.60],[Date.UTC(2012,9,1),-2.50],[Date.UTC(2012,10,1),-0.70],[Date.UTC(2012,11,1),-0.70],[Date.UTC(2012,12,1),-2.50],[Date.UTC(2013,1,1),2.60],[Date.UTC(2013,2,1),-1.40],[Date.UTC(2013,3,1),0.10],[Date.UTC(2013,4,1),-3.20],[Date.UTC(2013,5,1),-4.40],[Date.UTC(2013,6,1),-3.40],[Date.UTC(2013,7,1),-4.70],[Date.UTC(2013,8,1),-3.60],[Date.UTC(2013,9,1),-1.20],[Date.UTC(2013,10,1),-3.60],[Date.UTC(2013,11,1),-3.10],[Date.UTC(2013,12,1),3.20],[Date.UTC(2014,1,1),-1.60],[Date.UTC(2014,2,1),-6.30],[Date.UTC(2014,3,1),-3.60],[Date.UTC(2014,4,1),1.90],[Date.UTC(2014,5,1),-1.20],[Date.UTC(2014,6,1),0.40],[Date.UTC(2014,7,1),0.50],[Date.UTC(2014,8,1),3.90],[Date.UTC(2014,9,1),1.80],[Date.UTC(2014,10,1),1.60],[Date.UTC(2014,11,1),-1.80],[Date.UTC(2014,12,1),-2.00],[Date.UTC(2015,1,1),-4.00],[Date.UTC(2015,2,1),-5.10],[Date.UTC(2015,3,1),-7.80],[Date.UTC(2015,4,1),-13.80],[Date.UTC(2015,5,1),-13.10],[Date.UTC(2015,6,1),-14.20],[Date.UTC(2015,7,1),-14.20],[Date.UTC(2015,8,1),-17.50],[Date.UTC(2015,9,1),-17.00],[Date.UTC(2015,10,1),-15.60],[Date.UTC(2015,11,1),-11.50],[Date.UTC(2015,12,1),-14.60],[Date.UTC(2016,1,1),-11.00],[Date.UTC(2016,2,1),-10.90],[Date.UTC(2016,3,1),-4.90],[Date.UTC(2016,4,1),-7.20],[Date.UTC(2016,5,1),-10.20],[Date.UTC(2016,6,1),-9.20],[Date.UTC(2016,7,1),-9.90],[Date.UTC(2016,8,1),-7.10],[Date.UTC(2016,9,1),-6.70],[Date.UTC(2016,10,1),-3.00],[Date.UTC(2016,11,1),1.40],[Date.UTC(2016,12,1),4.70],[Date.UTC(2017,1,1),0.50],[Date.UTC(2017,2,1),2.70],[Date.UTC(2017,3,1),-0.50],[Date.UTC(2017,4,1),-0.50],[Date.UTC(2017,5,1),1.90],[Date.UTC(2017,6,1),2.20],[Date.UTC(2017,7,1),4.40],[Date.UTC(2017,8,1),-2.20],[Date.UTC(2017,9,1),1.00],[Date.UTC(2017,10,1),2.00],[Date.UTC(2017,11,1),-1.60],[Date.UTC(2017,12,1),-5.80],[Date.UTC(2018,1,1),-1.90],[Date.UTC(2018,2,1),2.30],[Date.UTC(2018,3,1),1.70],[Date.UTC(2018,4,1),4.10],[Date.UTC(2018,5,1),1.40],[Date.UTC(2018,6,1),1.50],[Date.UTC(2018,7,1),-1.80],[Date.UTC(2018,8,1),-3.30],[Date.UTC(2018,9,1),2.40],[Date.UTC(2018,10,1),-2.90],[Date.UTC(2018,11,1),-3.30],[Date.UTC(2018,12,1),-5.00],[Date.UTC(2019,1,1),-2.90],[Date.UTC(2019,2,1),-4.00],[Date.UTC(2019,3,1),-5.80],[Date.UTC(2019,4,1),-3.50],[Date.UTC(2019,5,1),-2.10],[Date.UTC(2019,6,1),-3.00],[Date.UTC(2019,7,1),-1.40],[Date.UTC(2019,8,1),-0.80],[Date.UTC(2019,9,1),-3.20],[Date.UTC(2019,10,1),-3.60],[Date.UTC(2019,11,1),-0.50],[Date.UTC(2019,12,1),-2.60],[Date.UTC(2020,1,1),-2.20],[Date.UTC(2020,2,1),-2.60],[Date.UTC(2020,3,1),-8.10],[Date.UTC(2020,4,1),-14.10]]
    },
    {type:'spline',
        name:'Export Europe',
        label:{
            enabled:false
        },showInLegend:false,
        color:Highcharts.getOptions().colors[0],
        dashStyle:'dash',
        data:[[Date.UTC(2002,4,1),5.00],[Date.UTC(2002,5,1),6.80],[Date.UTC(2002,6,1),9.00],[Date.UTC(2002,7,1),10.80],[Date.UTC(2002,8,1),11.10],[Date.UTC(2002,9,1),8.30],[Date.UTC(2002,10,1),8.00],[Date.UTC(2002,11,1),10.30],[Date.UTC(2002,12,1),11.40],[Date.UTC(2003,1,1),14.20],[Date.UTC(2003,2,1),15.20],[Date.UTC(2003,3,1),18.20],[Date.UTC(2003,4,1),17.40],[Date.UTC(2003,5,1),19.30],[Date.UTC(2003,6,1),25.80],[Date.UTC(2003,7,1),23.90],[Date.UTC(2003,8,1),19.30],[Date.UTC(2003,9,1),15.40],[Date.UTC(2003,10,1),21.40],[Date.UTC(2003,11,1),19.20],[Date.UTC(2003,12,1),18.50],[Date.UTC(2004,1,1),19.20],[Date.UTC(2004,2,1),20.80],[Date.UTC(2004,3,1),19.80],[Date.UTC(2004,4,1),13.20],[Date.UTC(2004,5,1),6.70],[Date.UTC(2004,6,1),2.70],[Date.UTC(2004,7,1),-1.10],[Date.UTC(2004,8,1),-1.00],[Date.UTC(2004,9,1),7.90],[Date.UTC(2004,10,1),3.80],[Date.UTC(2004,11,1),9.70],[Date.UTC(2004,12,1),13.60],[Date.UTC(2005,1,1),10.60],[Date.UTC(2005,2,1),6.00],[Date.UTC(2005,3,1),8.00],[Date.UTC(2005,4,1),8.10],[Date.UTC(2005,5,1),18.80],[Date.UTC(2005,6,1),10.60],[Date.UTC(2005,7,1),18.60],[Date.UTC(2005,8,1),19.10],[Date.UTC(2005,9,1),9.10],[Date.UTC(2005,10,1),6.50],[Date.UTC(2005,11,1),-5.00],[Date.UTC(2005,12,1),-9.40],[Date.UTC(2006,1,1),-11.60],[Date.UTC(2006,2,1),-4.60],[Date.UTC(2006,3,1),-10.50],[Date.UTC(2006,4,1),0.50],[Date.UTC(2006,5,1),-4.60],[Date.UTC(2006,6,1),1.70],[Date.UTC(2006,7,1),-2.20],[Date.UTC(2006,8,1),0.30],[Date.UTC(2006,9,1),6.00],[Date.UTC(2006,10,1),7.10],[Date.UTC(2006,11,1),11.00],[Date.UTC(2006,12,1),12.70],[Date.UTC(2007,1,1),14.20],[Date.UTC(2007,2,1),8.00],[Date.UTC(2007,3,1),12.90],[Date.UTC(2007,4,1),11.10],[Date.UTC(2007,5,1),10.10],[Date.UTC(2007,6,1),6.30],[Date.UTC(2007,7,1),6.30],[Date.UTC(2007,8,1),6.70],[Date.UTC(2007,9,1),7.30],[Date.UTC(2007,10,1),7.80],[Date.UTC(2007,11,1),9.60],[Date.UTC(2007,12,1),12.60],[Date.UTC(2008,1,1),11.50],[Date.UTC(2008,2,1),7.90],[Date.UTC(2008,3,1),8.00],[Date.UTC(2008,4,1),4.80],[Date.UTC(2008,5,1),7.00],[Date.UTC(2008,6,1),24.80],[Date.UTC(2008,7,1),21.30],[Date.UTC(2008,8,1),17.40],[Date.UTC(2008,9,1),12.90],[Date.UTC(2008,10,1),9.90],[Date.UTC(2008,11,1),9.70],[Date.UTC(2008,12,1),2.20],[Date.UTC(2009,1,1),-0.20],[Date.UTC(2009,2,1),-5.70],[Date.UTC(2009,3,1),-13.70],[Date.UTC(2009,4,1),-17.50],[Date.UTC(2009,5,1),-22.10],[Date.UTC(2009,6,1),-22.40],[Date.UTC(2009,7,1),-22.10],[Date.UTC(2009,8,1),-22.00],[Date.UTC(2009,9,1),-21.20],[Date.UTC(2009,10,1),-15.50],[Date.UTC(2009,11,1),-8.00],[Date.UTC(2009,12,1),0.40],[Date.UTC(2010,1,1),1.50],[Date.UTC(2010,2,1),17.80],[Date.UTC(2010,3,1),27.90],[Date.UTC(2010,4,1),33.40],[Date.UTC(2010,5,1),37.20],[Date.UTC(2010,6,1),38.10],[Date.UTC(2010,7,1),33.40],[Date.UTC(2010,8,1),24.90],[Date.UTC(2010,9,1),29.50],[Date.UTC(2010,10,1),23.60],[Date.UTC(2010,11,1),4.00],[Date.UTC(2010,12,1),1.00],[Date.UTC(2011,1,1),-0.80],[Date.UTC(2011,2,1),-6.60],[Date.UTC(2011,3,1),-7.20],[Date.UTC(2011,4,1),-3.20],[Date.UTC(2011,5,1),2.80],[Date.UTC(2011,6,1),0.50],[Date.UTC(2011,7,1),7.80],[Date.UTC(2011,8,1),13.30],[Date.UTC(2011,9,1),6.80],[Date.UTC(2011,10,1),7.10],[Date.UTC(2011,11,1),14.80],[Date.UTC(2011,12,1),9.30],[Date.UTC(2012,1,1),12.80],[Date.UTC(2012,2,1),20.40],[Date.UTC(2012,3,1),14.60],[Date.UTC(2012,4,1),13.10],[Date.UTC(2012,5,1),5.20],[Date.UTC(2012,6,1),4.90],[Date.UTC(2012,7,1),-4.10],[Date.UTC(2012,8,1),-7.50],[Date.UTC(2012,9,1),-4.60],[Date.UTC(2012,10,1),-6.20],[Date.UTC(2012,11,1),1.80],[Date.UTC(2012,12,1),4.50],[Date.UTC(2013,1,1),4.00],[Date.UTC(2013,2,1),-0.30],[Date.UTC(2013,3,1),6.10],[Date.UTC(2013,4,1),-5.70],[Date.UTC(2013,5,1),-0.80],[Date.UTC(2013,6,1),1.90],[Date.UTC(2013,7,1),2.70],[Date.UTC(2013,8,1),2.90],[Date.UTC(2013,9,1),1.80],[Date.UTC(2013,10,1),0.50],[Date.UTC(2013,11,1),2.30],[Date.UTC(2013,12,1),-0.10],[Date.UTC(2014,1,1),-3.00],[Date.UTC(2014,2,1),-3.80],[Date.UTC(2014,3,1),-2.40],[Date.UTC(2014,4,1),5.20],[Date.UTC(2014,5,1),5.00],[Date.UTC(2014,6,1),1.80],[Date.UTC(2014,7,1),-0.70],[Date.UTC(2014,8,1),-4.60],[Date.UTC(2014,9,1),4.40],[Date.UTC(2014,10,1),7.00],[Date.UTC(2014,11,1),-2.20],[Date.UTC(2014,12,1),4.40],[Date.UTC(2015,1,1),1.50],[Date.UTC(2015,2,1),-0.80],[Date.UTC(2015,3,1),-3.10],[Date.UTC(2015,4,1),-9.80],[Date.UTC(2015,5,1),-9.80],[Date.UTC(2015,6,1),-13.00],[Date.UTC(2015,7,1),-9.00],[Date.UTC(2015,8,1),-10.30],[Date.UTC(2015,9,1),-8.60],[Date.UTC(2015,10,1),-10.80],[Date.UTC(2015,11,1),-2.30],[Date.UTC(2015,12,1),-11.70],[Date.UTC(2016,1,1),-7.30],[Date.UTC(2016,2,1),-6.70],[Date.UTC(2016,3,1),6.50],[Date.UTC(2016,4,1),-1.70],[Date.UTC(2016,5,1),-9.00],[Date.UTC(2016,6,1),-7.10],[Date.UTC(2016,7,1),-13.60],[Date.UTC(2016,8,1),-9.90],[Date.UTC(2016,9,1),-9.30],[Date.UTC(2016,10,1),-3.60],[Date.UTC(2016,11,1),-3.70],[Date.UTC(2016,12,1),9.30],[Date.UTC(2017,1,1),3.10],[Date.UTC(2017,2,1),10.50],[Date.UTC(2017,3,1),-8.00],[Date.UTC(2017,4,1),-5.70],[Date.UTC(2017,5,1),0.90],[Date.UTC(2017,6,1),-2.40],[Date.UTC(2017,7,1),2.80],[Date.UTC(2017,8,1),-5.90],[Date.UTC(2017,9,1),6.40],[Date.UTC(2017,10,1),6.80],[Date.UTC(2017,11,1),5.30],[Date.UTC(2017,12,1),-6.60],[Date.UTC(2018,1,1),-5.40],[Date.UTC(2018,2,1),-4.00],[Date.UTC(2018,3,1),2.70],[Date.UTC(2018,4,1),7.20],[Date.UTC(2018,5,1),3.60],[Date.UTC(2018,6,1),2.30],[Date.UTC(2018,7,1),0.80],[Date.UTC(2018,8,1),4.30],[Date.UTC(2018,9,1),-3.80],[Date.UTC(2018,10,1),-6.80],[Date.UTC(2018,11,1),-6.50],[Date.UTC(2018,12,1),0.60],[Date.UTC(2019,1,1),3.10],[Date.UTC(2019,2,1),-5.90],[Date.UTC(2019,3,1),-7.20],[Date.UTC(2019,4,1),-5.20],[Date.UTC(2019,5,1),-4.30],[Date.UTC(2019,6,1),-5.30],[Date.UTC(2019,7,1),-2.50],[Date.UTC(2019,8,1),-2.80],[Date.UTC(2019,9,1),-6.20],[Date.UTC(2019,10,1),-8.80],[Date.UTC(2019,11,1),-5.90],[Date.UTC(2019,12,1),-9.70],[Date.UTC(2020,1,1),-8.00],[Date.UTC(2020,2,1),-7.60],[Date.UTC(2020,3,1),-12.30],[Date.UTC(2020,4,1),-24.30]]
    },
    {type:'spline',
        name:'Export Asia',
        label:{
            enabled:false
        },showInLegend:false,
        color:Highcharts.getOptions().colors[0],
        dashStyle:'dotdash',
        data:[[Date.UTC(2002,4,1),-8.00],[Date.UTC(2002,5,1),-1.10],[Date.UTC(2002,6,1),-2.70],[Date.UTC(2002,7,1),4.70],[Date.UTC(2002,8,1),17.10],[Date.UTC(2002,9,1),5.30],[Date.UTC(2002,10,1),-2.40],[Date.UTC(2002,11,1),-0.30],[Date.UTC(2002,12,1),2.30],[Date.UTC(2003,1,1),7.40],[Date.UTC(2003,2,1),10.80],[Date.UTC(2003,3,1),11.60],[Date.UTC(2003,4,1),11.50],[Date.UTC(2003,5,1),5.70],[Date.UTC(2003,6,1),8.90],[Date.UTC(2003,7,1),4.80],[Date.UTC(2003,8,1),-1.00],[Date.UTC(2003,9,1),2.10],[Date.UTC(2003,10,1),13.30],[Date.UTC(2003,11,1),15.70],[Date.UTC(2003,12,1),12.70],[Date.UTC(2004,1,1),12.90],[Date.UTC(2004,2,1),12.20],[Date.UTC(2004,3,1),10.10],[Date.UTC(2004,4,1),14.80],[Date.UTC(2004,5,1),8.00],[Date.UTC(2004,6,1),6.20],[Date.UTC(2004,7,1),8.80],[Date.UTC(2004,8,1),19.40],[Date.UTC(2004,9,1),16.00],[Date.UTC(2004,10,1),8.20],[Date.UTC(2004,11,1),9.90],[Date.UTC(2004,12,1),13.50],[Date.UTC(2005,1,1),10.30],[Date.UTC(2005,2,1),11.50],[Date.UTC(2005,3,1),12.90],[Date.UTC(2005,4,1),5.60],[Date.UTC(2005,5,1),14.60],[Date.UTC(2005,6,1),8.30],[Date.UTC(2005,7,1),8.70],[Date.UTC(2005,8,1),4.00],[Date.UTC(2005,9,1),-0.70],[Date.UTC(2005,10,1),-1.10],[Date.UTC(2005,11,1),-5.50],[Date.UTC(2005,12,1),-9.20],[Date.UTC(2006,1,1),-10.50],[Date.UTC(2006,2,1),-2.70],[Date.UTC(2006,3,1),-8.10],[Date.UTC(2006,4,1),-6.60],[Date.UTC(2006,5,1),-7.60],[Date.UTC(2006,6,1),-2.40],[Date.UTC(2006,7,1),-4.30],[Date.UTC(2006,8,1),-4.70],[Date.UTC(2006,9,1),-4.30],[Date.UTC(2006,10,1),-2.40],[Date.UTC(2006,11,1),-0.50],[Date.UTC(2006,12,1),1.50],[Date.UTC(2007,1,1),0.80],[Date.UTC(2007,2,1),-5.30],[Date.UTC(2007,3,1),-1.30],[Date.UTC(2007,4,1),3.70],[Date.UTC(2007,5,1),3.90],[Date.UTC(2007,6,1),3.20],[Date.UTC(2007,7,1),3.10],[Date.UTC(2007,8,1),-1.90],[Date.UTC(2007,9,1),10.80],[Date.UTC(2007,10,1),11.50],[Date.UTC(2007,11,1),9.90],[Date.UTC(2007,12,1),16.70],[Date.UTC(2008,1,1),23.40],[Date.UTC(2008,2,1),17.10],[Date.UTC(2008,3,1),21.40],[Date.UTC(2008,4,1),18.20],[Date.UTC(2008,5,1),9.60],[Date.UTC(2008,6,1),17.00],[Date.UTC(2008,7,1),19.70],[Date.UTC(2008,8,1),29.80],[Date.UTC(2008,9,1),15.30],[Date.UTC(2008,10,1),7.60],[Date.UTC(2008,11,1),14.60],[Date.UTC(2008,12,1),14.80],[Date.UTC(2009,1,1),5.40],[Date.UTC(2009,2,1),-1.10],[Date.UTC(2009,3,1),-3.70],[Date.UTC(2009,4,1),-9.30],[Date.UTC(2009,5,1),-9.10],[Date.UTC(2009,6,1),-20.00],[Date.UTC(2009,7,1),-21.60],[Date.UTC(2009,8,1),-19.70],[Date.UTC(2009,9,1),-16.40],[Date.UTC(2009,10,1),-12.90],[Date.UTC(2009,11,1),-15.80],[Date.UTC(2009,12,1),-12.30],[Date.UTC(2010,1,1),-9.20],[Date.UTC(2010,2,1),4.90],[Date.UTC(2010,3,1),11.40],[Date.UTC(2010,4,1),21.40],[Date.UTC(2010,5,1),24.80],[Date.UTC(2010,6,1),42.20],[Date.UTC(2010,7,1),45.70],[Date.UTC(2010,8,1),42.00],[Date.UTC(2010,9,1),33.60],[Date.UTC(2010,10,1),34.10],[Date.UTC(2010,11,1),38.80],[Date.UTC(2010,12,1),23.80],[Date.UTC(2011,1,1),30.50],[Date.UTC(2011,2,1),9.70],[Date.UTC(2011,3,1),14.20],[Date.UTC(2011,4,1),9.20],[Date.UTC(2011,5,1),16.20],[Date.UTC(2011,6,1),5.00],[Date.UTC(2011,7,1),7.90],[Date.UTC(2011,8,1),11.40],[Date.UTC(2011,9,1),10.80],[Date.UTC(2011,10,1),11.90],[Date.UTC(2011,11,1),9.40],[Date.UTC(2011,12,1),13.50],[Date.UTC(2012,1,1),7.90],[Date.UTC(2012,2,1),10.00],[Date.UTC(2012,3,1),2.30],[Date.UTC(2012,4,1),7.80],[Date.UTC(2012,5,1),1.80],[Date.UTC(2012,6,1),9.70],[Date.UTC(2012,7,1),4.40],[Date.UTC(2012,8,1),5.20],[Date.UTC(2012,9,1),-3.70],[Date.UTC(2012,10,1),0.70],[Date.UTC(2012,11,1),-4.90],[Date.UTC(2012,12,1),0.70],[Date.UTC(2013,1,1),4.30],[Date.UTC(2013,2,1),0.40],[Date.UTC(2013,3,1),-3.90],[Date.UTC(2013,4,1),-8.60],[Date.UTC(2013,5,1),-7.10],[Date.UTC(2013,6,1),-6.40],[Date.UTC(2013,7,1),-10.00],[Date.UTC(2013,8,1),-11.80],[Date.UTC(2013,9,1),-10.90],[Date.UTC(2013,10,1),-13.50],[Date.UTC(2013,11,1),-10.30],[Date.UTC(2013,12,1),-9.60],[Date.UTC(2014,1,1),-8.00],[Date.UTC(2014,2,1),-11.80],[Date.UTC(2014,3,1),-6.90],[Date.UTC(2014,4,1),-0.70],[Date.UTC(2014,5,1),-0.30],[Date.UTC(2014,6,1),0.50],[Date.UTC(2014,7,1),3.30],[Date.UTC(2014,8,1),1.00],[Date.UTC(2014,9,1),0.70],[Date.UTC(2014,10,1),1.10],[Date.UTC(2014,11,1),2.40],[Date.UTC(2014,12,1),0.20],[Date.UTC(2015,1,1),-8.30],[Date.UTC(2015,2,1),-3.80],[Date.UTC(2015,3,1),-7.80],[Date.UTC(2015,4,1),-14.70],[Date.UTC(2015,5,1),-14.50],[Date.UTC(2015,6,1),-14.90],[Date.UTC(2015,7,1),-16.20],[Date.UTC(2015,8,1),-15.20],[Date.UTC(2015,9,1),-14.60],[Date.UTC(2015,10,1),-11.30],[Date.UTC(2015,11,1),-12.90],[Date.UTC(2015,12,1),-14.60],[Date.UTC(2016,1,1),-9.10],[Date.UTC(2016,2,1),-7.90],[Date.UTC(2016,3,1),-6.70],[Date.UTC(2016,4,1),-4.80],[Date.UTC(2016,5,1),-6.10],[Date.UTC(2016,6,1),-6.60],[Date.UTC(2016,7,1),-5.70],[Date.UTC(2016,8,1),-4.30],[Date.UTC(2016,9,1),-6.40],[Date.UTC(2016,10,1),-5.70],[Date.UTC(2016,11,1),1.50],[Date.UTC(2016,12,1),1.30],[Date.UTC(2017,1,1),2.20],[Date.UTC(2017,2,1),-2.70],[Date.UTC(2017,3,1),-1.70],[Date.UTC(2017,4,1),0.20],[Date.UTC(2017,5,1),-7.50],[Date.UTC(2017,6,1),-4.20],[Date.UTC(2017,7,1),-5.20],[Date.UTC(2017,8,1),-9.90],[Date.UTC(2017,9,1),-4.90],[Date.UTC(2017,10,1),-8.30],[Date.UTC(2017,11,1),-11.40],[Date.UTC(2017,12,1),-5.00],[Date.UTC(2018,1,1),-2.80],[Date.UTC(2018,2,1),4.50],[Date.UTC(2018,3,1),4.40],[Date.UTC(2018,4,1),0.50],[Date.UTC(2018,5,1),3.20],[Date.UTC(2018,6,1),6.30],[Date.UTC(2018,7,1),10.70],[Date.UTC(2018,8,1),-2.90],[Date.UTC(2018,9,1),13.50],[Date.UTC(2018,10,1),9.30],[Date.UTC(2018,11,1),7.40],[Date.UTC(2018,12,1),-0.70],[Date.UTC(2019,1,1),-0.70],[Date.UTC(2019,2,1),0.30],[Date.UTC(2019,3,1),-0.50],[Date.UTC(2019,4,1),0.00],[Date.UTC(2019,5,1),3.40],[Date.UTC(2019,6,1),1.90],[Date.UTC(2019,7,1),-0.80],[Date.UTC(2019,8,1),0.30],[Date.UTC(2019,9,1),-3.20],[Date.UTC(2019,10,1),-1.30],[Date.UTC(2019,11,1),2.80],[Date.UTC(2019,12,1),-3.10],[Date.UTC(2020,1,1),-1.50],[Date.UTC(2020,2,1),-1.90],[Date.UTC(2020,3,1),-7.90],[Date.UTC(2020,4,1),-9.70]]
    },
    {type:'spline',
        label:{
            enabled:false
        },showInLegend:false,
        name:'Export Latin America/Caribbean',
        color:Highcharts.getOptions().colors[0],
        dashStyle:'dot',
        data:[[Date.UTC(2002,4,1),11.30],[Date.UTC(2002,5,1),8.50],[Date.UTC(2002,6,1),10.10],[Date.UTC(2002,7,1),13.40],[Date.UTC(2002,8,1),7.90],[Date.UTC(2002,9,1),11.30],[Date.UTC(2002,10,1),7.10],[Date.UTC(2002,11,1),5.20],[Date.UTC(2002,12,1),-2.30],[Date.UTC(2003,1,1),0.30],[Date.UTC(2003,2,1),-6.60],[Date.UTC(2003,3,1),-4.80],[Date.UTC(2003,4,1),-4.70],[Date.UTC(2003,5,1),-4.00],[Date.UTC(2003,6,1),-4.00],[Date.UTC(2003,7,1),-4.80],[Date.UTC(2003,8,1),-0.60],[Date.UTC(2003,9,1),1.10],[Date.UTC(2003,10,1),1.90],[Date.UTC(2003,11,1),3.70],[Date.UTC(2003,12,1),8.90],[Date.UTC(2004,1,1),12.50],[Date.UTC(2004,2,1),10.80],[Date.UTC(2004,3,1),10.50],[Date.UTC(2004,4,1),13.00],[Date.UTC(2004,5,1),10.10],[Date.UTC(2004,6,1),11.10],[Date.UTC(2004,7,1),10.00],[Date.UTC(2004,8,1),10.70],[Date.UTC(2004,9,1),5.10],[Date.UTC(2004,10,1),3.40],[Date.UTC(2004,11,1),7.10],[Date.UTC(2004,12,1),6.90],[Date.UTC(2005,1,1),6.10],[Date.UTC(2005,2,1),4.80],[Date.UTC(2005,3,1),5.00],[Date.UTC(2005,4,1),5.10],[Date.UTC(2005,5,1),8.20],[Date.UTC(2005,6,1),6.90],[Date.UTC(2005,7,1),11.10],[Date.UTC(2005,8,1),6.00],[Date.UTC(2005,9,1),9.60],[Date.UTC(2005,10,1),8.90],[Date.UTC(2005,11,1),3.30],[Date.UTC(2005,12,1),10.20],[Date.UTC(2006,1,1),4.50],[Date.UTC(2006,2,1),6.20],[Date.UTC(2006,3,1),7.00],[Date.UTC(2006,4,1),5.50],[Date.UTC(2006,5,1),6.30],[Date.UTC(2006,6,1),6.90],[Date.UTC(2006,7,1),4.10],[Date.UTC(2006,8,1),4.60],[Date.UTC(2006,9,1),7.50],[Date.UTC(2006,10,1),10.50],[Date.UTC(2006,11,1),10.70],[Date.UTC(2006,12,1),5.30],[Date.UTC(2007,1,1),6.90],[Date.UTC(2007,2,1),12.90],[Date.UTC(2007,3,1),16.00],[Date.UTC(2007,4,1),13.80],[Date.UTC(2007,5,1),10.50],[Date.UTC(2007,6,1),9.90],[Date.UTC(2007,7,1),7.20],[Date.UTC(2007,8,1),8.70],[Date.UTC(2007,9,1),10.00],[Date.UTC(2007,10,1),9.10],[Date.UTC(2007,11,1),10.60],[Date.UTC(2007,12,1),7.70],[Date.UTC(2008,1,1),1.30],[Date.UTC(2008,2,1),-7.80],[Date.UTC(2008,3,1),-7.60],[Date.UTC(2008,4,1),-7.80],[Date.UTC(2008,5,1),-2.00],[Date.UTC(2008,6,1),1.20],[Date.UTC(2008,7,1),3.90],[Date.UTC(2008,8,1),12.20],[Date.UTC(2008,9,1),0.20],[Date.UTC(2008,10,1),-1.60],[Date.UTC(2008,11,1),-4.30],[Date.UTC(2008,12,1),5.30],[Date.UTC(2009,1,1),7.10],[Date.UTC(2009,2,1),5.80],[Date.UTC(2009,3,1),-3.50],[Date.UTC(2009,4,1),-1.20],[Date.UTC(2009,5,1),-17.10],[Date.UTC(2009,6,1),-13.40],[Date.UTC(2009,7,1),-15.20],[Date.UTC(2009,8,1),-15.60],[Date.UTC(2009,9,1),-14.60],[Date.UTC(2009,10,1),-14.00],[Date.UTC(2009,11,1),-9.80],[Date.UTC(2009,12,1),-4.00],[Date.UTC(2010,1,1),-2.30],[Date.UTC(2010,2,1),-1.60],[Date.UTC(2010,3,1),8.10],[Date.UTC(2010,4,1),9.90],[Date.UTC(2010,5,1),20.50],[Date.UTC(2010,6,1),18.00],[Date.UTC(2010,7,1),15.60],[Date.UTC(2010,8,1),8.70],[Date.UTC(2010,9,1),16.60],[Date.UTC(2010,10,1),16.10],[Date.UTC(2010,11,1),16.30],[Date.UTC(2010,12,1),10.10],[Date.UTC(2011,1,1),12.20],[Date.UTC(2011,2,1),10.60],[Date.UTC(2011,3,1),14.70],[Date.UTC(2011,4,1),14.20],[Date.UTC(2011,5,1),13.70],[Date.UTC(2011,6,1),8.30],[Date.UTC(2011,7,1),15.50],[Date.UTC(2011,8,1),16.90],[Date.UTC(2011,9,1),14.00],[Date.UTC(2011,10,1),13.20],[Date.UTC(2011,11,1),10.90],[Date.UTC(2011,12,1),8.40],[Date.UTC(2012,1,1),7.30],[Date.UTC(2012,2,1),35.20],[Date.UTC(2012,3,1),27.30],[Date.UTC(2012,4,1),14.30],[Date.UTC(2012,5,1),25.90],[Date.UTC(2012,6,1),22.10],[Date.UTC(2012,7,1),18.90],[Date.UTC(2012,8,1),12.30],[Date.UTC(2012,9,1),12.40],[Date.UTC(2012,10,1),14.40],[Date.UTC(2012,11,1),12.90],[Date.UTC(2012,12,1),-2.70],[Date.UTC(2013,1,1),0.00],[Date.UTC(2013,2,1),-18.60],[Date.UTC(2013,3,1),-16.00],[Date.UTC(2013,4,1),-12.10],[Date.UTC(2013,5,1),-20.60],[Date.UTC(2013,6,1),-15.30],[Date.UTC(2013,7,1),-13.60],[Date.UTC(2013,8,1),-8.60],[Date.UTC(2013,9,1),-13.50],[Date.UTC(2013,10,1),-8.90],[Date.UTC(2013,11,1),-11.00],[Date.UTC(2013,12,1),5.30],[Date.UTC(2014,1,1),1.60],[Date.UTC(2014,2,1),2.70],[Date.UTC(2014,3,1),2.20],[Date.UTC(2014,4,1),3.70],[Date.UTC(2014,5,1),6.60],[Date.UTC(2014,6,1),3.70],[Date.UTC(2014,7,1),-8.70],[Date.UTC(2014,8,1),-5.00],[Date.UTC(2014,9,1),-1.40],[Date.UTC(2014,10,1),-5.80],[Date.UTC(2014,11,1),-5.80],[Date.UTC(2014,12,1),-4.80],[Date.UTC(2015,1,1),-8.10],[Date.UTC(2015,2,1),-10.20],[Date.UTC(2015,3,1),-9.30],[Date.UTC(2015,4,1),-14.10],[Date.UTC(2015,5,1),-14.90],[Date.UTC(2015,6,1),-12.80],[Date.UTC(2015,7,1),-6.50],[Date.UTC(2015,8,1),-10.70],[Date.UTC(2015,9,1),-19.00],[Date.UTC(2015,10,1),-17.30],[Date.UTC(2015,11,1),-14.50],[Date.UTC(2015,12,1),-18.50],[Date.UTC(2016,1,1),-11.00],[Date.UTC(2016,2,1),-16.30],[Date.UTC(2016,3,1),-15.00],[Date.UTC(2016,4,1),-12.40],[Date.UTC(2016,5,1),-9.40],[Date.UTC(2016,6,1),-10.70],[Date.UTC(2016,7,1),-5.00],[Date.UTC(2016,8,1),-5.10],[Date.UTC(2016,9,1),3.40],[Date.UTC(2016,10,1),8.00],[Date.UTC(2016,11,1),5.40],[Date.UTC(2016,12,1),4.80],[Date.UTC(2017,1,1),-0.70],[Date.UTC(2017,2,1),5.60],[Date.UTC(2017,3,1),7.00],[Date.UTC(2017,4,1),8.60],[Date.UTC(2017,5,1),5.90],[Date.UTC(2017,6,1),4.80],[Date.UTC(2017,7,1),2.90],[Date.UTC(2017,8,1),3.30],[Date.UTC(2017,9,1),5.70],[Date.UTC(2017,10,1),-2.70],[Date.UTC(2017,11,1),0.60],[Date.UTC(2017,12,1),-0.80],[Date.UTC(2018,1,1),3.80],[Date.UTC(2018,2,1),5.70],[Date.UTC(2018,3,1),0.10],[Date.UTC(2018,4,1),2.00],[Date.UTC(2018,5,1),-1.20],[Date.UTC(2018,6,1),1.60],[Date.UTC(2018,7,1),-3.90],[Date.UTC(2018,8,1),-3.90],[Date.UTC(2018,9,1),-5.80],[Date.UTC(2018,10,1),-6.20],[Date.UTC(2018,11,1),-6.80],[Date.UTC(2018,12,1),-12.70],[Date.UTC(2019,1,1),-6.80],[Date.UTC(2019,2,1),-10.40],[Date.UTC(2019,3,1),-7.60],[Date.UTC(2019,4,1),-3.30],[Date.UTC(2019,5,1),-3.30],[Date.UTC(2019,6,1),-2.50],[Date.UTC(2019,7,1),3.10],[Date.UTC(2019,8,1),1.50],[Date.UTC(2019,9,1),0.60],[Date.UTC(2019,10,1),0.90],[Date.UTC(2019,11,1),0.10],[Date.UTC(2019,12,1),7.20],[Date.UTC(2020,1,1),4.60],[Date.UTC(2020,2,1),2.90],[Date.UTC(2020,3,1),-2.60],[Date.UTC(2020,4,1),-7.10]]
    },] ;      

const itemSeries = [
    {name:'The Left',y:69, color:'transparent',opacity:1,label:'DIE LINKE',borderWidth:1,borderColor:baseColor},
    {y: 67, color:'transparent', opacity:1,label:'GRÜNE',borderWidth:1,borderColor:baseColor},
    {name:'Free Democratic Party', y:80, color:'transparent', opacity:1,label:'FDP',borderWidth:1,borderColor:baseColor},
    {name:'Christian Democratic Union', y:200, color:'transparent', opacity:1,label:'CDU',borderWidth:1,borderColor:baseColor},
    {name:'Christian Social Union in Bavaria', y:46, color:'transparent', opacity:1,label:'CSU',borderWidth:1,borderColor:baseColor},
    {name:'Alternative for Germany', y:94, color:'transparent', opacity:1,label:'AfD',borderWidth:1,borderColor:baseColor}]


//for the last chart in the animation (science)
let dataSource = [93, 93, 96, 100, 101, 102, 102];
let xiData = [];
let range = 20,
  startPoint = 88;
for (i = 0; i < range; i++) {
  xiData[i] = startPoint + i;
}

let dataOrigine = [];
for (i = 0; i < dataSource.length; i++) {
  dataOrigine.push([dataSource[i], 0]);
}

let dataPoint = [];
for (i = 0; i < dataSource.length; i++) {
  dataPoint.push([dataSource[i], 0]);
}

let gData = [];

function GaussKDE(xi, x) {
  return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(Math.pow(xi - x, 2) / -2);
}

let N = dataSource.length;
let kernelChart = [];
let kernel = [];
let animationTime = 4000;

//Create the density estimate
for (i = 0; i < xiData.length; i++) {
  let temp = 0;
  kernel.push([]);
  kernel[i].push(new Array(dataSource.length));
  for (j = 0; j < dataSource.length; j++) {
    temp = temp + GaussKDE(xiData[i], dataSource[j]);
    kernel[i][j] = GaussKDE(xiData[i], dataSource[j]);
  }
  gData.push([xiData[i], (1 / N) * temp]);
}

let startNum = 60;
let tempArray = [];
for(rr=0;rr<20;++rr){
    tempArray.push([startNum,0]);
    startNum = startNum + 1;
}

gData = tempArray.concat(gData);

//Create the kernels
for (i = 0; i < dataSource.length; i++) {
  kernelChart.push([]);
  kernelChart[i].push(new Array(kernel.length));
  for (j = 0; j < kernel.length; j++) {
    kernelChart[i].push([xiData[j], (1 / N) * kernel[j][i]]);
  }
}

let kernelSeries = [
 {
      type: "scatter",
      name: "Observation",
       marker: {
        enabled: true,
        radius: 5,
        symbol:'circle',
        fillColor:Highcharts.getOptions().colors[5],
         showInLegend:false,
      },
      data: dataPoint,
      tooltip: {
        headerFormat: "{series.name}:",
        pointFormat: "<b>{point.x}</b>"
      },
      zIndex: 9,
      showInLegend:false,
    },
    {
      name: "KDE",
       
      type:'spline',
      dashStyle: "solid",
      lineWidth: 2,
      xAxis:5,
      yAxis:4,
      color: "#fff",
      fillOpacity:.05,
      data: gData,
      showInLegend:false,
       

    },
    {
      name: "k(" + dataSource[0] + ")",
       
      data: kernelChart[0],
       type:'spline',
        xAxis:5,
      yAxis:4,
      showInLegend:false,
      
     
    },
    {
      name: "k(" + dataSource[1] + ")",
       
      data: kernelChart[1],
       type:'spline',
        xAxis:5,
      yAxis:4,
      showInLegend:false,
       
    },
    {
      name: "k(" + dataSource[2] + ")",
       
      data: kernelChart[2],
       type:'spline',
        xAxis:5,
      yAxis:4,
      showInLegend:false,
       
    },
    {
      name: "k(" + dataSource[3] + ")",
       
      data: kernelChart[3],
       type:'spline',
        xAxis:5,
      yAxis:4,
      showInLegend:false,
       
    },
    {
      name: "k(" + dataSource[4] + ")",
       
      data: kernelChart[4],
       type:'spline',
        xAxis:5,
      yAxis:4,
      showInLegend:false,
      
    },
    {
      name: "k(" + dataSource[5] + ")",
       
      data: kernelChart[5],
       type:'spline',
        xAxis:5,
      yAxis:4,
      showInLegend:false,
       
    },
    {
      name: "k(" + dataSource[6] + ")",
       
      data: kernelChart[6],
       type:'spline',
        xAxis:5,
      yAxis:4,
      showInLegend:false,
       
    }]

//homepage chart animation chart
let heroChart = {
    chart: {
        backgroundColor:'transparent',
            style:{
                fontFamily:'Arial',
                color:baseTextColor,
                fontSize:'18px'
            },
        spacing:[0,0,0,0],
        margin:[0,0,0,0],
        animation:{
            easing:'easeOutQuint',
            duration:1000
        },
        events:{
            load:function(){
                demoChart = this;
                demoChart.update({
                    chart:{
                        animation:{
                            easing:'easeOutQuint',
                            duration:1000
                        }
                    }
                });
                $('.highcharts-networkgraph-series').hide();
                $('.highcharts-series-0').hide();
                $('.highcharts-candlestick-series').hide();
                $('.highcharts-spline-series').hide();
                $('.highcharts-scatter-series').hide();
                $('.highcharts-streamgraph-series').hide();
                $('.highcharts-annotation-label').hide();

                lineChart = demoChart.series[1];
                candleChart = demoChart.series[2];
                itemChart = demoChart.series[0];
                itemChart2 = demoChart.series[4];
              
                section1();

                $('h2.fakeTitle').animate({opacity:1},1000);
                $('h1.title').animate({opacity:1},1000);

                /****************************************/
                ////Section 1 Pie and item

                function section1(){
                
                    ///show title
                    let s10 = function(){  
                         console.log('step1');
                          $('h2.fakeTitle').animate({opacity:1},1000);
                    }

                    currentTimeout = setTimeout(s10,100);

                    ///show subtitle
                    let s11 = function(){ 
                         $('#c0').animate({opacity:1},1000);
                    }

                    currentTimeout = setTimeout(s11,500);

                    ///swap graphs
                    let s12 = function(){ 
                       $('.highcharts-series-0').fadeIn();
                       $('.highcharts-series-4').fadeOut(1000);
                    }
                    currentTimeout = setTimeout(s12,1500);
                    
                    //make an arch
                    let s13 =  function(){ 
                        let radius = 5;
                        let size = '85%';
                        let centerY =  '85%';
                        let centerX = '50%%'
                        if(demoChart.chartWidth < 800){
                            radius = 3;
                           
                        }
                        if(demoChart.chartWidth > 800){
                           size = '120%'
                           centerY = '80%',
                           centerX ='65.5%'
                        }

                        demoChart.series[0].update({
                                startAngle:-100,
                                endAngle:100,
                                center:[ centerX,centerY],
                                size:size,
                                innerSize:'30%',
                                marker:{
                                    radius:radius
                                }
                            });

                    }
                    currentTimeout = setTimeout(s13,2500);

                    ///expand the arch
                    let s14 =  function(){ 
                        let size = '500%';
                        if(demoChart.chartWidth < 500){
                            size='200%';
                        } 

                        demoChart.update({
                            chart:{
                                animation:{
                                    duration:500
                                }
                            }
                        });

                        demoChart.series[0].update({
                            startAngle:100,
                            size:size,

                        });
                    }
                    currentTimeout = setTimeout(s14,4000);
                    
                    ///hide title, hide item chart, deactive carousel 1, show spline series
                    let s15 = function(){ 
                        $('.highcharts-spline-series').show();
                        $('#developers').removeClass('active');
                        $('.highcharts-item-series').fadeOut(1000);
                        $('h2.fakeTitle').animate({opacity:0},1000);
                    }
                    currentTimeout = setTimeout(s15,4500);
                    
                    //hide subtitle, turn off legen, add splines
                    let s16 =function(){  

                        $('#c0').animate({opacity:0},1000);
                         demoChart.update({
                            chart:{
                                animation:{
                                    duration:100
                                }
                            }
                        }); 
                        demoChart.series[0].update({
                            showInLegend:false
                        });
                        let count = 0;
                        let addSeries = setInterval(function(){
                            demoChart.addSeries(splineSeries[count]);
                            count = count + 1;
                            if(count == splineSeries.length){
                                clearInterval(addSeries);
                            }
                        },0);
                    }
                    currentTimeout = setTimeout(s16,4700);

                    ///set current tab, go to section 2
                    let s17 = function(){   
                       $('#finance').addClass('active'); 
                       section2();
                    }
                    currentTimeout = setTimeout(s17,5000);
                }

                /****************************************/
                ////Section 2 Splines and candlestick

                function section2(){
                  
                    ///update animation duration to 1000, hide the item series 
                    let f1 = function(){
                        console.log('spline section');
                        demoChart.update({
                            chart:{
                                animation:{
                                    duration:1000
                                }
                            }
                        });
                        demoChart.series[0].update({
                            opacity:0
                        });
                    }
                    currentTimeout = setTimeout(f1,500);


                    //set axes extremes for splines and candlestick, show new title
                    let f2 = function(){
                        $('h2.fakeTitle').html('finance'); 
                        $('h2.fakeTitle').animate({opacity:1},1000);
                        $('.highcharts-networkgraph-series').hide();
                        $('.highcharts-candlestick-series').show();
                        demoChart.xAxis[1].setExtremes(Date.UTC(2002,7,1), Date.UTC(2010,9,1));
                        demoChart.xAxis[0].setExtremes(Date.UTC(2019,11,9), Date.UTC(2020,1,13));
                       
                    }
                    currentTimeout = setTimeout(f2,1500);

                    ///show candlestick tooltip
                    let f3 = function(){ 
                        demoChart.update({tooltip:{
                            enabled:true
                        }});
                         $('#c1').animate({opacity:1},1000);
                        demoChart.tooltip.refresh([demoChart.series[2].points[22]]);
                        $('.highcharts-tooltip').hide();
                        $('.highcharts-tooltip').fadeIn(1000);
                    }
                    currentTimeout = setTimeout(f3,2500);

                    //hide the tooltip and candlestick, remove all the splines
                    let f4 = function(){
                        $('.highcharts-candlestick-series').fadeOut(1000);
                        $('.highcharts-tooltip').hide();

                        demoChart.update({
                            tooltip:{
                                enabled:false
                            },
                            chart:{
                                animation:{
                                    duration:10
                                }
                            }
                        });


                        let startNum = demoChart.series.length-1;
                        let endNum = 27;
                        $('.highcharts-spline-series').fadeOut();
                        let removeSeries = setInterval(function(){
                            demoChart.series[startNum].remove();
                            startNum = startNum - 1;
                            if (startNum < endNum){
                                clearInterval(removeSeries);
                            }

                        },0);

                        demoChart.update({
                            plotOptions:{
                                streamgraph:{
                                    fillOpacity:0,    
                                    lineWidth:1,
                                    lineColor:baseColor,
                                },
                            }    
                        });


                        $('h2.fakeTitle').animate({opacity:0},100);
                        $('#c1').animate({opacity:0},1000);
                        $('#finance').removeClass('active');
                        $('.highcharts-spline-series').fadeOut(1000);

                    }
                    currentTimeout = setTimeout(f4,5000);

                    //go to section 3
                    let f5 = function(){
                      section3();
                    }
                    currentTimeout = setTimeout(f5,5500);

                }

                 /****************************************/
                 ////Section 3 Streamgraph

                function section3(){

                    //sets up new title, sets the plot options for the streamgraph
                    let s1 = function(){
                        console.log('streamgraph section');
                        $('h2.fakeTitle').html('publishing'); 

                        demoChart.update({
                            plotOptions:{
                                streamgraph:{
                                    fillOpacity:0,    
                                    lineWidth:1,
                                    lineColor:streamLine,
                                     states:{
                                         inactive:{
                                             enabled:false
                                         }
                                     },
                                     
                                },
                                
                            },
                            
                        });
                    }
                    currentTimeout = window.setTimeout(s1,0);

                    //sets animation duration to 1000, shows streamgraph
                    let s2 = function(){
                       
                        let seriesIndex = 5;
                        let count = 0;

                        $('.highcharts-streamgraph-series').fadeIn(500);
                        $('.highcharts-plot-line-label').hide();


                        demoChart.update({
                            chart:{
                                animation:{
                                   duration:1000
                                },
                            },
                            
                        });
                    }

                    currentTimeout = window.setTimeout(s2,500);

                    //shows the title and activates the right tab
                    let s3 = function(){
                         $('h2.fakeTitle').animate({opacity:1},1000); 
                         $('#c2').animate({opacity:1},2000);  
                         $('#publishing').addClass('active');
                        
                    }
                    currentTimeout = window.setTimeout(s3,1000);


                    //shows the xAxis, sets the xAxis extremes for the streamgraph, shows the labels, sets streamgraph opacity to 1
                    let s4 = function(){

                        let yearExtreme = 1860;
                        if(demoChart.chartWidth < 500){
                            yearExtreme = 1920;
                        }
                        demoChart.xAxis[4].setExtremes(Date.UTC(yearExtreme,7,1),Date.UTC(2016,11,1));
                        
                        $('.highcharts-axis-labels').fadeIn();
                        $('.highcharts-pie-series').hide();
                        $('.highcharts-annotation-label').fadeIn();
                        demoChart.xAxis[4].update({
                            visible:true
                        });
                      
                        demoChart.update({
                            plotOptions:{
                                   streamgraph:{
                                       fillOpacity:1,
                                       label:{
                                           enabled:true
                                       },
                                       lineWidth:1
                                       
                                   },

                               }
                           });
                    }
                    currentTimeout = window.setTimeout(s4,2000);

                    //sets the fill opacity to 0, hides the annotations, sets the xAxis extremes
                    let s5 = function(){

                         demoChart.update({
                            plotOptions:{
                                   streamgraph:{
                                       fillOpacity:0,
                                       label:{
                                           enabled:false
                                       },
                                       lineWidth:1
                                       
                                   },

                               }
                        });
                        $('.highcharts-annotation-label').hide();
                         demoChart.xAxis[4].update({
                            visible:false
                        });

                       
                    }
                    currentTimeout = window.setTimeout(s5,5500);

                    //hides the xAxis
                    let s6 = function(){

                          demoChart.update({
                               plotOptions:{
                                   streamgraph:{
                                       label:{
                                           enabled:false
                                       }
                                   }
                               }
                        });

                        demoChart.xAxis[4].setExtremes(Date.UTC(1970,7,1),Date.UTC(2016,11,1));
                       

                       
                        
                    }
                    currentTimeout = window.setTimeout(s6,7000);
                   
                    //turns off series labels, fades the titles, goes to section 4
                    let s7 = function(){
                        
                        $('h2.fakeTitle').animate({opacity:0},1000);
                        $('#c2').animate({opacity:0},1000);
                        $('#publishing').removeClass('active');
                        section4();
                    }
                   currentTimeout = window.setTimeout(s7,8000);
                }

                /****************************************/
                 ////Section 4 Network graph

                function section4(){
                   
                    clearTimeout(currentTimeout);

                    ///shows the networkgraph, sets up the splines, shows new title and tab
                    let p1 = function(){
                        //
                        console.log("section 4")
                        /*for(ii=18;ii<27;++ii){
                           demoChart.series[ii].update({showInLegend:true})
                        }*/
                        $('.highcharts-spline-series').hide();
                        $('.highcharts-scatter-series').hide()
                        $('h2.fakeTitle').html('science'); 
                        $('h2.fakeTitle').animate({opacity:1},100);
                        $('#science').addClass('active');
                        $('.highcharts-networkgraph-series').fadeIn();
                        
                        demoChart.update({
                            
                           legend:{
                                 labelFormat: '{name} <span style="opacity: 0.4">{y}</span>',
                                 width:1000,
                                 floating:true,
                                 verticalAlign:'bottom'
                             },
                           plotOptions:{
                               
                                spline:{
                                        lineWidth:2,
                                        xAxis:5,
                                          yAxis:4,
                                          dashStyle:'dot',
                                          color: Highcharts.getOptions().colors[3],
                                          dataGrouping:{
                                              enabled:false
                                          },
                                          label:{
                                              enabled:true
                                          },
                                         
                                    },
                                    scatter:{
                                        lineWidth:1,
                                        xAxis:5,
                                        yAxis:4,
                                        dashStyle: "shortdot",
                                        color: Highcharts.getOptions().colors[5],
                                        pointStart: xiData[0],
                                        label:{
                                              enabled:false
                                          },
                                          showInLegend:true,
                                     },
                            }  
                        });
                        $('.highcharts-pie-series').hide();
                        
                        $('.highcharts-spline-series').hide();
                        $('.highcharts-scatter-series').hide();
                    }
                    currentTimeout = window.setTimeout(p1,700);


                    //moves the node on the network graph
                    let p2 = function(){
                        console.log("section 4.1");
                         demoChart.series[3].nodes[0].update({
                            plotX:demoChart.chartWidth/2+100,
                            plotY :demoChart.chartHeight
                        });
                    }
                    currentTimeout = window.setTimeout(p2,1200);

                    //shows the splines
                    let p25 = function(){

                        $('#c3').animate({opacity:1},1000);
                        $('.highcharts-spline-series').fadeIn(100);
                        $('.highcharts-scatter-series').fadeIn(100);
                        $('.highcharts-legend').fadeIn();
                        demoChart.series[19].update({color:'#1E90FF'});
                    }
                    currentTimeout = window.setTimeout(p25,2500);

                    //moves the node again
                    let p3 = function(){
                        console.log("section 4.2");

                         demoChart.update({
                            chart:{
                                animation:{
                                    duration:1000
                                }
                            }
                        });
                        demoChart.series[3].nodes[0].update({
                           mass:1,
                           plotX:demoChart.series[3].nodes[1].plotX,
                           plotY:demoChart.series[3].nodes[1].plotY,

                        });
                        demoChart.xAxis[5].setExtremes(78,107);
                    }
                    currentTimeout = window.setTimeout(p3,4000);


                    ///consolidates all the nodes, hides most everything else,  shows the title and content
                    let p4 = function(){

                        console.log("section 4.3");
                        $('.highcharts-label').fadeOut();
                        
                        $('.highcharts-streamgraph-series').fadeOut();
                        $('.highcharts-spline-series').fadeOut();
                        $('.highcharts-scatter-series').fadeOut();
                        $('#science').removeClass('active');
                        $('h2.fakeTitle').hide();

                        $('#c3').animate({opacity:0},100);
                       
                        $('.highcharts-legend').fadeOut();

                        $('h1.title').css({'opacity':0});
                        $('h1.title').html('Elevate your data');
                        

                        demoChart.series[3].nodes[0].update({
                            plotX:demoChart.chartWidth/2,
                            plotY:demoChart.chartHeight/2,

                        });





                        let pointCount = 0;
                        let updatePoints = setInterval(function(){
                            demoChart.series[3].nodes[pointCount].plotY =  demoChart.series[3].nodes[0].plotY
                            demoChart.series[3].nodes[pointCount].plotX =  demoChart.series[3].nodes[0].plotX
                            demoChart.series[3].nodes[pointCount].mass=1;
                            pointCount = pointCount + 1;
                            if(pointCount == demoChart.series[3].nodes.length){
                                clearInterval(updatePoints);
                                demoChart.series[3].hide();
                                $('h1.title').animate({'opacity':1},1000);
                                $('#cContent').animate({'opacity':1},2000);
                                $('.cTab').css({display:'block'});
                                $('#developersCharts4').animate({'opacity':1},2000);
                                $('#heroTitle').css({gridTemplateColumns:'300px'});

                                $('#developers').trigger('click');


                                                      
                                 
                            }
                        },10);
                    }
                    currentTimeout = window.setTimeout(p4,9000);

                   
                }
            }  
        }
    },
    stockTools:{
        gui:{
            enabled:false
        }
    },     
    navigation:{
        annotationsOptions:{
         visible:false
        }
    },
    title: {
        floating: true,
        x:250,
        y:90,
        text: '',
        style:{
            fontSize:16,
            color:baseTextColor,
            fontWeight:'bold'
        }
    },
    subtitle: {
    },
    credits:{
        enabled:false
    },
     
    exporting:{
        enabled:false
    },
    rangeSelector:{
        enabled:false,
    },
    navigator:{
        enabled:false,
    },
    scrollbar:{
        enabled:false
    },
    tooltip:
    {
        enabled:false,
        backgroundColor:'#fff',
        borderColor:'transparent',
        borderRadius:10,
        shadow:true,
        useHTML: true,
        distance:20,
        formatter:function(){
            let date = new Date(this.points[0].point.x);
            let dateString = date.toString();
            dateString = dateString.substr(0,16);
            let string =
            '<div id="tooltipGrid">' +
                '<div class="date" ><img src="../apple.svg">'+dateString + '</div>' + 
                '<div class="infoGrid">' +
                '<div class="label">Open</div><div class="data">'+this.points[0].point.open +'</div>' +
                '<div class="label">High</div><div class="data">'+this.points[0].point.high +'</div>'+
                '<div class="label">Low</div><div class="data">'+this.points[0].point.low +'</div>'+
                '<div class="label">Close</div><div class="data">'+this.points[0].point.close +'</div>'+
                '</div>';
                '</div>';
            return string;
        }
    },
    xAxis:[ 
        ///0
        {
            visible:false,
            type:'datetime',
            min:Date.UTC(2002,11,8),
            max:Date.UTC(2010,11,20),
        },
        ///1
        {
            type:'datetime',
            min:Date.UTC(2002,11,8),
            max:Date.UTC(2011,9,1),
            reversed:true,
            visible:false,
            labels:{
                style:{
                    color:axisColor
                }
            }
        },
        ///2
        {
            visible:false,
            type:'linear',
            tickInterval:1,
            min:0,
            max:11,
            labels:{
                style:{
                color:axisColor
                }
            },
        },
        ///3
        {
            type:'datetime',
            min:Date.UTC(1990,1,1),
            max:Date.UTC(2020,1,1),
            floating:true,
            visible:false,
                labels:{
                    style:{
                    color:axisColor
                    }
                }
        },
        ///4
        {
            type:'datetime',
            visible:false,    
            lineColor:'transparent',
            tickColor:'transparent',
            verticalAlign:'middle',
            min:Date.UTC(1980,7,1),
            max:Date.UTC(2016,7,1),
            // tickPositions:xTicks,
            labels:{
              align: 'left',
              reserveSpace: false,
             
              style:{
                  color:'transparent',
                  fontSize:'10px',
              },
            formatter:function(){
                 year = new Date(this.pos).getFullYear();
                 if(this.pos >=Date.UTC(1921,7,1)){
                   return year
                  }
              }
            },
            plotLines: [
                {value: Date.UTC(1924,7,1),width:1,color: '#fff',dashStyle: 'dot',zIndex:20,label:{text:categories[1924].label,verticalAlign:'bottom',y:-10,rotation:-90,style:{fontSize:'10px',color:baseColor}}},
                {value: Date.UTC(1928,7,1),width:1,color: '#fff',dashStyle: 'dot',zIndex:20,label:{text:categories[1928].label,verticalAlign:'bottom',y:-10,rotation:-90,style:{fontSize:'10px',color:baseColor}}},
                {value: Date.UTC(1932,7,1),width:1,color: '#fff',dashStyle: 'dot',zIndex:20,label:{text:categories[1932].label,verticalAlign:'bottom',y:-10,rotation:-90,style:{fontSize:'10px',color:baseColor}}},
                {value: Date.UTC(1936,7,1),width:1,color: '#fff',dashStyle: 'dot',zIndex:20,label:{text:categories[1936].label,verticalAlign:'bottom',y:-10,rotation:-90,style:{fontSize:'10px',color:baseColor}}},
                {value: Date.UTC(1940,7,1),width:1,color: '#fff',dashStyle: 'dot',zIndex:20,label:{text:categories[1940].label,verticalAlign:'bottom',y:-10,rotation:-90,style:{fontSize:'10px',color:baseColor}}},
                {value: Date.UTC(1944,7,1),width:1,color: '#fff',dashStyle: 'dot',zIndex:20,label:{text:categories[1944].label,verticalAlign:'bottom',y:-10,rotation:-90,style:{fontSize:'10px',color:baseColor}}},
                {value: Date.UTC(1948,7,1),width:1,color: '#fff',dashStyle: 'dot',zIndex:20,label:{text:categories[1948].label,verticalAlign:'bottom',y:-10,rotation:-90,style:{fontSize:'10px',color:baseColor}}},
                {value: Date.UTC(1952,7,1),width:1,color: '#fff',dashStyle: 'dot',zIndex:20,label:{text:categories[1952].label,verticalAlign:'bottom',y:-10,rotation:-90,style:{fontSize:'10px',color:baseColor}}},
                {value: Date.UTC(1956,7,1),width:1,color: '#fff',dashStyle: 'dot',zIndex:20,label:{text:categories[1956].label,verticalAlign:'bottom',y:-10,rotation:-90,style:{fontSize:'10px',color:baseColor}}},
                {value: Date.UTC(1960,7,1),width:1,color: '#fff',dashStyle: 'dot',zIndex:20,label:{text:categories[1960].label,verticalAlign:'bottom',y:-10,rotation:-90,style:{fontSize:'10px',color:baseColor}}},
                {value: Date.UTC(1964,7,1),width:1,color: '#fff',dashStyle: 'dot',zIndex:20,label:{text:categories[1964].label,verticalAlign:'bottom',y:-10,rotation:-90,style:{fontSize:'10px',color:baseColor}}},
                {value: Date.UTC(1968,7,1),width:1,color: '#fff',dashStyle: 'dot',zIndex:20,label:{text:categories[1968].label,verticalAlign:'bottom',y:-10,rotation:-90,style:{fontSize:'10px',color:baseColor}}},
                {value: Date.UTC(1972,7,1),width:1,color: '#fff',dashStyle: 'dot',zIndex:20,label:{text:categories[1972].label,verticalAlign:'bottom',y:-10,rotation:-90,style:{fontSize:'10px',color:baseColor}}},
                {value: Date.UTC(1976,7,1),width:1,color: '#fff',dashStyle: 'dot',zIndex:20,label:{text:categories[1976].label,verticalAlign:'bottom',y:-10,rotation:-90,style:{fontSize:'10px',color:baseColor}}},
                {value: Date.UTC(1980,7,1),width:1,color: '#fff',dashStyle: 'dot',zIndex:20,label:{text:categories[1980].label,verticalAlign:'bottom',y:-10,rotation:-90,style:{fontSize:'10px',color:baseColor}}},
                {value: Date.UTC(1984,7,1),width:1,color: '#fff',dashStyle: 'dot',zIndex:20,label:{text:categories[1984].label,verticalAlign:'bottom',y:-10,rotation:-90,style:{fontSize:'10px',color:baseColor}}},
                {value: Date.UTC(1988,7,1),width:1,color: '#fff',dashStyle: 'dot',zIndex:20,label:{text:categories[1988].label,verticalAlign:'bottom',y:-10,rotation:-90,style:{fontSize:'10px',color:baseColor}}},
                {value: Date.UTC(11992,7,1),width:1,color: '#fff',dashStyle: 'dot',zIndex:20,label:{text:categories[1992].label,verticalAlign:'bottom',y:-10,rotation:-90,style:{fontSize:'10px',color:baseColor}}},
                {value: Date.UTC(1994,7,1),width:1,color: '#fff',dashStyle: 'dot',zIndex:20,label:{text:categories[1994].label,verticalAlign:'bottom',y:-10,rotation:-90,style:{fontSize:'10px',color:baseColor}}},
                {value: Date.UTC(1998,7,1),width:1,color: '#fff',dashStyle: 'dot',zIndex:20,label:{text:categories[1998].label,verticalAlign:'bottom',y:-10,rotation:-90,style:{fontSize:'10px',color:baseColor}}},
                {value: Date.UTC(2002,7,1),width:1,color: '#fff',dashStyle: 'dot',zIndex:20,label:{text:categories[2002].label,verticalAlign:'bottom',y:-10,rotation:-90,style:{fontSize:'10px',color:baseColor}}},
                {value: Date.UTC(2006,7,1),width:1,color: '#fff',dashStyle: 'dot',zIndex:20,label:{text:categories[2006].label,verticalAlign:'bottom',y:-10,rotation:-90,style:{fontSize:'10px',color:baseColor}}},
                {value: Date.UTC(2010,7,1),width:1,color: '#fff',dashStyle: 'dot',zIndex:20,label:{text:categories[2010].label,verticalAlign:'bottom',y:-10,rotation:-90,style:{fontSize:'10px',color:baseColor}}},
                 {value: Date.UTC(2014,7,1),width:1,color: '#fff',dashStyle: 'dot',zIndex:20,label:{text:categories[2014].label,verticalAlign:'bottom',y:-10,rotation:-90,style:{fontSize:'10px',color:baseColor}}},
            ] 
        },
        ///5 
        {
         visible:false,
         min:60,
         max:70,
         labels:{
              style:{
                  color:'#333',
                  fontSize:11,
              },
          }
       },
    ], 

    yAxis:[
        ///0
        {
            visible:false,
            min:250,
            max:400,
            tickInterval:1,
            startOnTick:false,
            gridLineColor:'transparent',
            labels:{
              style:{
                  color:axisColor
              },
              title:{
                  text:'yAxis 0',
                  style:{
                      color:axisColor
                  },
              }
            }
       
        },
        
        ///1
        {
            visible:false,
            gridLineColor:'transparent',
            min:-30,
            max:40,
            labels:{
              style:{
                  color:axisColor
              },
            },
            startOnTick:true,
            endOnTick:true
        },
        ///2
        {
            visible:false,
            min:0,
            max:20,
            labels:{
              style:{
                  color:axisColor
              }
            }
        },
        ///3
        {
            visible: false,
            min:-50,
            max:50,
            labels:{
              style:{
                  color:axisColor
              }
            }
        },
        ////4
        {
            visible:false,
            max:.33,
            min:0,
            labels:{
              style:{
                  color:axisColor,
                  fontSize:12,
              },
            },
          
        },
        {
             visible:false
         }
    ],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 800
            },
            chartOptions: {
                plotOptions:{
                    item:{
                        size:'60%',
                        center:['50%','72%'],
                    },
                    pie:{
                        size:'60%',
                        center:['50%','75%'],
                    }
                },
                yAxis:[
                    ///0
                    {
                        visible:false,
                        min:250,
                        max:400,
                        tickInterval:1,
                        startOnTick:false,
                        gridLineColor:'transparent',
                        labels:{
                          style:{
                              color:axisColor
                          },
                          title:{
                              text:'yAxis 0',
                              style:{
                                  color:axisColor
                              },
                          }
                        }
                   
                    },
                    
                    ///1
                    {
                        visible:false,
                        gridLineColor:'transparent',
                        min:-30,
                        max:40,
                        labels:{
                          style:{
                              color:axisColor
                          },
                        },
                        startOnTick:true,
                        endOnTick:true
                    },
                    ///2
                    {
                        visible:false,
                        min:0,
                        max:20,
                        labels:{
                          style:{
                              color:axisColor
                          }
                        }
                    },
                    ///3
                    {
                        visible: false,
                        min:-50,
                        max:150,
                        labels:{
                          style:{
                              color:axisColor
                          }
                        }
                    },
                    ////4
                    {
                        visible:false,
                        max:.23,
                        min:0,
                        labels:{
                          style:{
                              color:axisColor,
                              fontSize:12,
                          },
                        },
                      
                    },
                    {
                         visible:false
                     }
                ],
                
            }
        }]
    },
    legend:{
        enabled:true,
        floating:true,
        x:300,
        y:-10,
        width:500,
        style:{
            fontSize:"16px"
        },
        labelFormat: '{label} <span style="opacity: 0.4">{y}</span>'
    },
    annotations: [{
         visible:true,
         labels:[
             {
               
                point: {
                    x: Date.UTC(1944,7,1),
                    xAxis: 4,
                    y: 10,
                    yAxis: 3
                }, 
                useHTML:true,
                text: '<div style="width:100px;white-space:normal;">Cancelled during World War II</div>',
                zIndex:30,
            }, 
            {
                point: {
                    x: Date.UTC(1992,7,1),
                    xAxis: 4,
                    y: 10,
                    yAxis: 3
                },
               text: 'Soviet Union fell,<br>Germany united'
            }],
        labelOptions: {
            backgroundColor: Highcharts.getOptions().colors[1],
            borderRadius:5,
            style:{
                fontSize:'12px',
                color:'#fff'
            },
            shadow:true
        }
    }],
    plotOptions:{
        ///ITEM
        item:{
            size:'80%',
            name:'Item Chart',
            pointPadding:1,
            innerSize:null,
            startAngle:-100,
            endAngle:100,    
            borderColor:baseColor,
            color:null,
            opacity:null,
            center:['65.5%','60%'],
            borderWidth:null,
            marker:{
                enabled:null,
                radius:30,
            },
            tooltip:{
                enabled:false
            },
            dataLabels:{
                enabled:null,
                 format: '{point.label}',
                 style:{
                    color:baseTextColor,
                    fontWeight:200,
                    fontSize:12
                },
            },
            showInLegend:false,
        },
        pie:{
             center:['65.5%','60%'],
             size:'80%'
         },
        ///Streamgraph
        streamgraph:{
            fillOpacity:1,
            lineColor:streamLine,
            lineWidth:1,
            xAxis:4,
            yAxis:3,
            dataGrouping:{
                enabled:false
            },
            showInLegend:false,
            label:{
                enabled:false,
                minFontSize:6,
                maxFontSize:20,
                style:{
                    color:'white',

                }
            },
            tooltip:{
                enabled:false
            }
        },
        ///line
        line: {
           
            color:baseColor,
            dashStyle:null,
            showInLegend:false,
            xAxis:0,
            yAxis:1,
            opacity:1,
            dataLabels:{
                enabled:null
            },
            lineWidth:0,
            lineColor:null,
             states:{
                    inactive:{
                        enabled:false
                    }
                },
            tooltip:{
                enabled:false
            },
            dataGrouping:{
                enabled:false
            }
        },
        ///Spline 
        spline:{
            dataGrouping:{
                enabled:false,
                groupAll:true,
                units: [
                        ['month', [1,3]],
                        ['year',1]
                    ]
            },
            showInLegend:false,
            dashStyle:null,
            xAxis:0,
            yAxis:1,
            opacity:1,
            lineWidth:1,
            lineColor:null,
            dataLabels:{
                enabled:null
            },
            label:{
                enabled:false,
                
            },
            tooltip:{
                enabled:false
            },
            states:{
                inactive:{
                    enabled:false
                }
            }
        },
        ///Candlestick
        candlestick:{
           color:Highcharts.getOptions().colors[2],
           upColor:Highcharts.getOptions().colors[4],
            showInNavigator:true,
            showInLegend:false,
            dataGrouping:{
                enabled:false,
                groupAll:true,
                units:[
                    ['month',1,3],
                    
                ]
            },
            marker:{
                enabled:false,
                lineWidth:0
            },
            
           
            opacity:1,
            dataLabels:{
                enabled:false
            },
        },
        //Area spline
        areaspline:{
            stacking:'normal',
            fillOpacity:.1,

            allowOverlap:true,
            dataGrouping:{
                enabled:false
            },
            tooltip:{
                enabled:false
            },
            showInLegend:false,
        },
        ///Network
        networkgraph: {
          
            showInLegend:false,
            zIndex:2,
            marker:{
                enabled:true,
                radius:null,
                symbol:'circle',
                fillColor:'transparent',
                lineColor:networklinkColor,
                lineWidth:1,
            },
            turboThreshold: 0,
        },
        /////scatter
        scatter: {
            marker:{
                enabled: true,
                radius: 5,
                fillColor: Highcharts.getOptions().colors[4]
            },
            dashStyle: "shortdot",
            color: Highcharts.getOptions().colors[4],
            pointStart: xiData[0],
            xAxis:5,
            yAxis:4,
            label:{
                enabled:true
            },
            showInLegend:false,
            tooltip:{
                enabled:false
            }
        }
    },
    series: [
        ////0
        { type:'item',
            zIndex:2,
            showInLegend:false,
            showInNavigator:false,
            borderWidth:1,
            pointPadding:0,
            innerSize:'22%',
            color:'transparent',
            label:{
                enabled:true
            },
            startAngle:90,
            endAngle:90,    
            name: 'Representatives',
            data: [
             {name:'The Left', y:39,  color:Highcharts.getOptions().colors[7],opacity:1,label:'DIE LINKE',visible:true},
             {name:'Social Democratic Party', color:Highcharts.getOptions().colors[0],y:123,  label:'SPD',visible:true},
             {name:'Alliance 90/The Greens',color:{patternIndex:7},y: 37, label:'GRÜNE',visible:true},
             {name:'Free Democratic Party', color:Highcharts.getOptions().colors[2],y:50, label:'FDP',visible:true},
             {name:'Christian Democratic Union', color:Highcharts.getOptions().colors[4],y:170, label:'CDU',visible:true},
             {name:'Christian Social Union in Bavaria',color:{patternIndex:0}, y:16, label:'CSU',visible:true},
             {name:'Alternative for Germany', color:Highcharts.getOptions().colors[9],y:64, label:'AfD',visible:true},
            ],
            dataLabels: {
              enabled: false,
              format: '{point.label}'
            },
            marker:{
                enabled:true,
                radius:3
            },
            states:{
                inactive:{
                    enabled:false
                }
            }
        },
        ///1
        {type:'line',
            lineWidth:0,
            showInLegend:false,
            xAxis:1,
            yAxis:0,
            color:null,
            dataLabels:{
                enabled:false,
                formatter:function(){
                    return this.point.index;
                }
            },
            zIndex:30,
            label:{
                    enabled:false
                },
            marker:{
                enabled:null,
                radius:null,
                lineWidth:1,
                lineColor:'rgba(0,0,0,.2)',
            },
            dashStyle:'solid',
            name:'Import air passenger fares',
            data:[[Date.UTC(2002,4,1),4.80],[Date.UTC(2002,5,1),4.30],[Date.UTC(2002,6,1),5.60],[Date.UTC(2002,7,1),7.60],[Date.UTC(2002,8,1),7.00],[Date.UTC(2002,9,1),7.60],[Date.UTC(2002,10,1),5.60],[Date.UTC(2002,11,1),3.00],[Date.UTC(2002,12,1),1.40],[Date.UTC(2003,1,1),1.90],[Date.UTC(2003,2,1),3.80],[Date.UTC(2003,3,1),5.30],[Date.UTC(2003,4,1),4.80],[Date.UTC(2003,5,1),4.40],[Date.UTC(2003,6,1),2.70],[Date.UTC(2003,7,1),1.30],[Date.UTC(2003,8,1),1.30],[Date.UTC(2003,9,1),0.60],[Date.UTC(2003,10,1),-1.40],[Date.UTC(2003,11,1),0.40],[Date.UTC(2003,12,1),-0.20],[Date.UTC(2004,1,1),-0.90],[Date.UTC(2004,2,1),-3.20],[Date.UTC(2004,3,1),-4.60],[Date.UTC(2004,4,1),-5.70],[Date.UTC(2004,5,1),-4.70],[Date.UTC(2004,6,1),0.70],[Date.UTC(2004,7,1),-2.20],[Date.UTC(2004,8,1),-2.70],[Date.UTC(2004,9,1),-3.90],[Date.UTC(2004,10,1),0.80],[Date.UTC(2004,11,1),1.80],[Date.UTC(2004,12,1),4.40],[Date.UTC(2005,1,1),3.70],[Date.UTC(2005,2,1),6.00],[Date.UTC(2005,3,1),6.20],[Date.UTC(2005,4,1),5.10],[Date.UTC(2005,5,1),3.60],[Date.UTC(2005,6,1),4.10],[Date.UTC(2005,7,1),4.30],[Date.UTC(2005,8,1),3.80],[Date.UTC(2005,9,1),2.50],[Date.UTC(2005,10,1),2.70],[Date.UTC(2005,11,1),4.40],[Date.UTC(2005,12,1),4.10],[Date.UTC(2006,1,1),3.60],[Date.UTC(2006,2,1),4.20],[Date.UTC(2006,3,1),4.50],[Date.UTC(2006,4,1),3.80],[Date.UTC(2006,5,1),5.60],[Date.UTC(2006,6,1),6.70],[Date.UTC(2006,7,1),5.60],[Date.UTC(2006,8,1),5.60],[Date.UTC(2006,9,1),5.60],[Date.UTC(2006,10,1),5.90],[Date.UTC(2006,11,1),7.70],[Date.UTC(2006,12,1),7.80],[Date.UTC(2007,1,1),7.00],[Date.UTC(2007,2,1),7.10],[Date.UTC(2007,3,1),7.00],[Date.UTC(2007,4,1),4.80],[Date.UTC(2007,5,1),3.90],[Date.UTC(2007,6,1),5.80],[Date.UTC(2007,7,1),7.20],[Date.UTC(2007,8,1),8.20],[Date.UTC(2007,9,1),7.10],[Date.UTC(2007,10,1),5.50],[Date.UTC(2007,11,1),5.60],[Date.UTC(2007,12,1),7.90],[Date.UTC(2008,1,1),7.80],[Date.UTC(2008,2,1),6.70],[Date.UTC(2008,3,1),6.80],[Date.UTC(2008,4,1),12.60],[Date.UTC(2008,5,1),13.70],[Date.UTC(2008,6,1),18.70],[Date.UTC(2008,7,1),19.50],[Date.UTC(2008,8,1),15.80],[Date.UTC(2008,9,1),15.00],[Date.UTC(2008,10,1),25.30],[Date.UTC(2008,11,1),22.90],[Date.UTC(2008,12,1),16.30],[Date.UTC(2009,1,1),12.20],[Date.UTC(2009,2,1),8.10],[Date.UTC(2009,3,1),2.70],[Date.UTC(2009,4,1),-7.10],[Date.UTC(2009,5,1),-10.10],[Date.UTC(2009,6,1),-14.20],[Date.UTC(2009,7,1),-20.10],[Date.UTC(2009,8,1),-19.50],[Date.UTC(2009,9,1),-14.50],[Date.UTC(2009,10,1),-11.60],[Date.UTC(2009,11,1),-6.40],[Date.UTC(2009,12,1),-3.20],[Date.UTC(2010,1,1),-0.70],[Date.UTC(2010,2,1),0.40],[Date.UTC(2010,3,1),11.00],[Date.UTC(2010,4,1),17.30],[Date.UTC(2010,5,1),23.30],[Date.UTC(2010,6,1),19.00],[Date.UTC(2010,7,1),21.30],[Date.UTC(2010,8,1),19.00],[Date.UTC(2010,9,1),16.70],[Date.UTC(2010,10,1),14.90],[Date.UTC(2010,11,1),12.80],[Date.UTC(2010,12,1),11.60],[Date.UTC(2011,1,1),12.20],[Date.UTC(2011,2,1),13.60],[Date.UTC(2011,3,1),7.60],[Date.UTC(2011,4,1),4.50],[Date.UTC(2011,5,1),7.30],[Date.UTC(2011,6,1),5.00],[Date.UTC(2011,7,1),6.20],[Date.UTC(2011,8,1),7.40],[Date.UTC(2011,9,1),8.50],[Date.UTC(2011,10,1),5.50],[Date.UTC(2011,11,1),6.20],[Date.UTC(2011,12,1),5.70],[Date.UTC(2012,1,1),8.80],[Date.UTC(2012,2,1),11.80],[Date.UTC(2012,3,1),10.90],[Date.UTC(2012,4,1),10.30],[Date.UTC(2012,5,1),5.10],[Date.UTC(2012,6,1),8.60],[Date.UTC(2012,7,1),5.20],[Date.UTC(2012,8,1),2.50],[Date.UTC(2012,9,1),3.00],[Date.UTC(2012,10,1),3.10],[Date.UTC(2012,11,1),2.90],[Date.UTC(2012,12,1),8.20],[Date.UTC(2013,1,1),3.90],[Date.UTC(2013,2,1),2.30],[Date.UTC(2013,3,1),1.70],[Date.UTC(2013,4,1),1.20],[Date.UTC(2013,5,1),2.60],[Date.UTC(2013,6,1),2.90],[Date.UTC(2013,7,1),2.10],[Date.UTC(2013,8,1),-0.50],[Date.UTC(2013,9,1),1.10],[Date.UTC(2013,10,1),3.40],[Date.UTC(2013,11,1),7.90],[Date.UTC(2013,12,1),8.20],[Date.UTC(2014,1,1),5.10],[Date.UTC(2014,2,1),6.70],[Date.UTC(2014,3,1),4.80],[Date.UTC(2014,4,1),4.80],[Date.UTC(2014,5,1),5.00],[Date.UTC(2014,6,1),1.40],[Date.UTC(2014,7,1),2.60],[Date.UTC(2014,8,1),6.70],[Date.UTC(2014,9,1),6.30],[Date.UTC(2014,10,1),4.40],[Date.UTC(2014,11,1),1.90],[Date.UTC(2014,12,1),2.70],[Date.UTC(2015,1,1),2.30],[Date.UTC(2015,2,1),-0.60],[Date.UTC(2015,3,1),0.50],[Date.UTC(2015,4,1),-2.70],[Date.UTC(2015,5,1),-2.90],[Date.UTC(2015,6,1),-1.10],[Date.UTC(2015,7,1),-2.40],[Date.UTC(2015,8,1),-3.20],[Date.UTC(2015,9,1),-7.20],[Date.UTC(2015,10,1),-4.70],[Date.UTC(2015,11,1),-2.20],[Date.UTC(2015,12,1),-9.90],[Date.UTC(2016,1,1),-4.30],[Date.UTC(2016,2,1),-3.30],[Date.UTC(2016,3,1),-6.30],[Date.UTC(2016,4,1),-0.20],[Date.UTC(2016,5,1),-0.50],[Date.UTC(2016,6,1),-8.40],[Date.UTC(2016,7,1),-8.30],[Date.UTC(2016,8,1),-9.10],[Date.UTC(2016,9,1),-0.80],[Date.UTC(2016,10,1),0.20],[Date.UTC(2016,11,1),-6.00],[Date.UTC(2016,12,1),-4.20],[Date.UTC(2017,1,1),-4.90],[Date.UTC(2017,2,1),-4.20],[Date.UTC(2017,3,1),-2.70],[Date.UTC(2017,4,1),-9.10],[Date.UTC(2017,5,1),-6.90],[Date.UTC(2017,6,1),-3.80],[Date.UTC(2017,7,1),-2.60],[Date.UTC(2017,8,1),-7.40],[Date.UTC(2017,9,1),-3.70],[Date.UTC(2017,10,1),-1.40],[Date.UTC(2017,11,1),-0.90],[Date.UTC(2017,12,1),4.20],[Date.UTC(2018,1,1),2.60],[Date.UTC(2018,2,1),4.20],[Date.UTC(2018,3,1),1.50],[Date.UTC(2018,4,1),7.90],[Date.UTC(2018,5,1),1.20],[Date.UTC(2018,6,1),4.80],[Date.UTC(2018,7,1),1.50],[Date.UTC(2018,8,1),3.50],[Date.UTC(2018,9,1),5.70],[Date.UTC(2018,10,1),-2.20],[Date.UTC(2018,11,1),0.70],[Date.UTC(2018,12,1),1.80],[Date.UTC(2019,1,1),1.20],[Date.UTC(2019,2,1),-1.70],[Date.UTC(2019,3,1),-0.90],[Date.UTC(2019,4,1),-10.60],[Date.UTC(2019,5,1),-1.90],[Date.UTC(2019,6,1),-2.50],[Date.UTC(2019,7,1),-6.60],[Date.UTC(2019,8,1),-6.10],[Date.UTC(2019,9,1),-7.40],[Date.UTC(2019,10,1),-4.90],[Date.UTC(2019,11,1),-3.00],[Date.UTC(2019,12,1),-4.70],[Date.UTC(2020,1,1),-9.50],[Date.UTC(2020,2,1),-7.40],[Date.UTC(2020,3,1),-11.30],[Date.UTC(2020,4,1),-16.20]
                ]
        },
        //2
        {type:'candlestick',
            name:'AAPL Stock Price',
            showInLegend:false,
            id:0,
            xAxis:0,
            yAxis:0,
            data:[
                [1575297000000,267.27,268.25,263.45,264.16],
                [1575383400000,258.31,259.53,256.29,259.45],
                [1575469800000,261.07,263.31,260.68,261.74],
                [1575556200000,263.79,265.89,262.73,265.58],
                [1575642600000,267.48,271,267.3,270.71],
                [1575901800000,270,270.8,264.91,266.92],
                [1575988200000,268.6,270.07,265.86,268.48],
                [1576074600000,268.81,271.1,268.5,270.77],
                [1576161000000,267.78,272.56,267.32,271.46],
                [1576247400000,271.46,275.3,270.93,275.15],
                [1576506600000,277,280.79,276.98,279.86],
                [1576593000000,279.57,281.77,278.8,280.41],
                [1576679400000,279.8,281.9,279.12,279.74],
                [1576765800000,279.5,281.18,278.95,280.02],
                [1576852200000,282.23,282.65,278.56,279.44],
                [1577111400000,280.53,284.25,280.37,284],
                [1577197800000,284.69,284.89,282.92,284.27],
                [1577370600000,284.82,289.98,284.7,289.91],
                [1577457000000,291.12,293.97,288.12,289.8],
                [1577716200000,289.46,292.69,285.22,291.52],
                [1577802600000,289.93,293.68,289.52,293.65],
                [1577975400000,296.24,300.6,295.19,300.35],
                [1578061800000,297.15,300.58,296.5,297.43],
                [1578321000000,293.79,299.96,292.75,299.8],
                [1578407400000,299.84,300.9,297.48,298.39],
                [1578493800000,297.16,304.44,297.16,303.19],
                [1578580200000,307.24,310.43,306.2,309.63],
                [1578666600000,310.6,312.67,308.25,310.33],
                [1578925800000,311.64,317.07,311.15,316.96],
                [1579012200000,316.7,317.57,312.17,312.68],
                [1579098600000,311.85,315.5,309.55,311.34],
                [1579185000000,313.59,315.7,312.09,315.24],
                [1579271400000,316.27,318.74,315,318.73],
                [1579617000000,317.19,319.02,316,316.57],
                [1579703400000,318.58,319.99,317.31,317.7],
                [1579789800000,317.92,319.56,315.65,319.23],
                [1579876200000,320.25,323.33,317.52,318.31],
                [1580135400000,310.06,311.77,304.88,308.95],
                [1580221800000,312.6,318.4,312.19,317.69],
                [1580308200000,324.45,327.85,321.38,324.34],
                [1580394600000,320.54,324.09,318.75,323.87],
                [1580481000000,320.93,322.68,308.29,309.51],
                [1580740200000,304.3,313.49,302.22,308.66],
                [1580826600000,315.31,319.64,313.63,318.85],
                [1580913000000,323.52,324.76,318.95,321.45],
                [1580999400000,322.57,325.22,320.26,325.21],
                [1581085800000,322.37,323.4,318,320.03],
                [1581345000000,314.18,321.55,313.85,321.55],
                [1581431400000,323.6,323.9,318.71,319.61],
                [1581517800000,321.47,327.22,321.47,327.2],
                [1581604200000,324.19,326.22,323.35,324.87],
                [1581690600000,324.74,325.98,322.85,324.95],
                [1582036200000,315.36,319.75,314.61,319],
                [1582122600000,320,324.57,320,323.62],
                [1582209000000,322.63,324.65,318.21,320.3],
                [1582295400000,318.62,320.45,310.5,313.05],
                [1582554600000,297.26,304.18,289.23,298.18],
                [1582641000000,300.95,302.53,286.13,288.08],
                [1582727400000,286.53,297.88,286.5,292.65],
                [1582813800000,281.1,286,272.96,273.52],
                [1582900200000,257.26,278.41,256.37,273.36],
                [1583159400000,282.28,301.44,277.72,298.81],
                [1583245800000,303.67,304,285.8,289.32],
                [1583332200000,296.44,303.4,293.13,302.74],
                [1583418600000,295.52,299.55,291.41,292.92],
                [1583505000000,282,290.82,281.23,289.03],
                [1583760600000,263.75,278.09,263,266.17],
                [1583847000000,277.14,286.44,269.37,285.34],
                [1583933400000,277.39,281.22,271.86,275.43],
                [1584019800000,255.94,270,248,248.23],
                [1584106200000,264.89,279.92,252.95,277.97],
                [1584365400000,241.95,259.08,240,242.21],
                [1584451800000,247.51,257.61,238.4,252.86],
            ],
            color:null,
            upColor:'#90ed7d',
            marker:{
                 enabled:true,
                 lineWidth:1
             }       
        },
        ///3
        {type: 'networkgraph',
            zindex:1,
            showInLegend:false,
            link:{
                color:networklinkColor,
                dashStyle:'dot'
            },
            visible:true,
            layoutAlgorithm: {
                    enableSimulation: true,
                    initialPositions: 'random',
                    // Applied only to links, should be 0
                    attractiveForce: function () {
                        return 0;
                    },
                    repulsiveForce: function () {
                        return 1;
                    },
                    linkLength:10,
                    integration: 'euler',
                    // Half of the repulsive force
                    gravitationalConstant: 2
                },
            
            // data:[],
            data:[  ['0','1'],
                    ['1','2'],
                    ['1','3'],
                    ['1','4'],
                    ['1','5'],
                    ['1','6'],
                    ['1','7'],
                    ['1','8'],
                    ['1','9'],
                    ['1','10'],
                    ['1','11'],
                    ['1','12'],
                    ['1','13'],
                    ['1','14'],
                    ['1','15'],
                    ['1','16'],
                    ['1','17'],
                    ['1','18'],
                    ['1','19'],
                    ['1','20'],
                    ['1','21'],
                    ['1','22'],
                    ['1','23'],
                    ['1','24'],
                    ['1','25'],
                    ['1','26'],
                    ['1','27'],
                    ['1','28'],
                    ['1','29'],
                    ['1','30'],
                    ['1','31'],
                    ['1','32'],
                    ['1','33'],
                    ['1','34'],
                    ['1','35'],
                    ['1','36'],
                    ['1','37'],
                    ['1','38'],
                    ['1','39'],
                    ['1','40'],
                    ['1','41'],
                    ['1','42'],
                    ['1','43'],
                    ['1','44'],
                    ['1','45'],
                    ['1','46'],
                    ['1','47'],
                    ['1','48'],
                    ['1','49'],
                    ['1','50'],

                    ['1','51'],
                    ['1','52'],
                    ['1','53'],
                    ['1','54'],
                    ['1','55'],
                    ['1','56'],
                    ['1','57'],
                    ['1','58'],
                    ['1','59'],
                    ['1','60'],
                    ['1','61'],
                    ['1','62'],
                    ['1','63'],
                    ['1','64'],
                    ['1','65'],
                    ['1','66'],
                    ['1','67'],
                    ['1','68'],
                    ['1','69'],
                    ['1','70'],
                    ['1','71'],
                    ['1','72'],
                    ['1','73'],
                    ['1','74'],
                    ['1','75'],
                    ['1','76'],
                    ['1','77'],
                    ['1','78'],
                    ['1','79'],
                    ['1','80'],
                    ['1','81'],
                    ['1','82'],
                    ['1','83'],
                    ['1','84'],
                    ['1','85'],
                    ['1','86'],
                    ['1','87'],
                    ['1','88'],
                    ['1','89'],
                    ['1','90'],
                    ['1','91'],
                    ['1','92'],
                    ['1','93'],
                    ['1','94'],
                    ['1','95'],
                    ['1','96'],
                    ['1','97'],
                    ['1','98'],
            ],
            nodes:[
                       {
                            id:'0',
                           
                            marker: {
                                radius: 8
                            },
                             mass:300,
                           
                            dataLabels:{
                                enabled:false
                            },
                            color: '#7cb5ec'
                        }, {
                            id:'1',
                            mass:1,
                             marker: {
                                radius: 3
                            },
                            color: '#434348'
                        }, {
                            id:'2',
                            mass:1,
                             marker: {
                                radius: 3
                            },
                            color: '#434348'
                        }, {
                            id:'3',
                            mass:1,
                            marker: {
                                radius: 3
                            },
                            color: '#90ed7d'
                        }, {
                            id:'4',
                            mass:1,
                            marker: {
                                radius: 3
                            },
                            color: '#90ed7d'
                        }, {
                            id:'5',
                            mass:1,
                            marker: {
                                radius: 4
                            },
                            color: '#7cb5ec'
                        }, {
                            id:'6',
                            mass:1,
                            marker: {
                                radius: 4
                            },
                            color: '#7cb5ec'
                        }, {
                            id:'7',
                            mass:1,
                            marker: {
                                radius: 10
                            },
                            color: '#7cb5ec'
                        }, {
                            id:'8',
                            mass:1,
                            marker: {
                                radius: 5
                            },
                            color: '#434348'
                        }, {
                            id:'9',
                            mass:1,
                            marker: {
                                radius: 6
                            },
                            color: '#90ed7d'
                        }, {
                            id:'10',
                            mass:1,
                            marker: {
                                radius: 6
                            },
                            color: '#90ed7d'
                        }, {
                            id:'11',
                            mass:1,
                            marker: {
                                radius: 7
                            },
                            color: '#7cb5ec'
                        }, {
                            id:'12',
                            mass:1,
                            marker: {
                                radius: 7
                            },
                            color: '#7cb5ec'
                        }, {
                            id:'13',
                            mass:1,
                            marker: {
                                radius: 8
                            },
                            color: '#434348'
                        }, {
                            id:'14',
                            mass:1,
                            marker: {
                                radius: 8
                            },
                            color: '#434348'
                        }, {
                            id:'15',
                            mass:1,
                            marker: {
                                radius: 9
                            },
                            color: '#90ed7d'
                        }, {
                            id:'16',
                            mass:1,
                            marker: {
                                radius: 9
                            },
                            color: '#90ed7d'
                        }, {
                            id:'17',
                            mass:1,
                            marker: {
                                radius: 10
                            },
                            color: '#7cb5ec'
                        }, {
                            id:'18',
                            mass:1,
                            marker: {
                                radius: 10
                            },
                            color: '#7cb5ec'
                        }, {
                            id:'19',
                            mass:1,
                            marker: {
                                radius: 1
                            },
                            color: '#434348'
                        }, {
                            id:'20',
                            mass:1,
                            marker: {
                                radius: 1
                            },
                            color: '#434348'
                        }, {
                            id:'21',
                            mass:1,
                            marker: {
                                radius: 2
                            },
                            color: '#90ed7d'
                        }, {
                            id:'22',
                            mass:1,
                            marker: {
                                radius: 2
                            },
                            color: '#90ed7d'
                        }, {
                            id:'23',
                            mass:1,
                            marker: {
                                radius: 3
                            },
                            color: '#7cb5ec'
                        }, {
                            id:'24',
                            mass:1,
                            marker: {
                                radius: 3
                            },
                            color: '#7cb5ec'
                        }, {
                            id:'25',
                            mass:1,
                            marker: {
                                radius: 4
                            },
                            color: '#434348'
                        }, {
                            id:'26',
                            mass:1,
                            marker: {
                                radius: 4
                            },
                            color: '#434348'
                        }, {
                            id:'27',
                            mass:1,
                            marker: {
                                radius: 5
                            },
                            color: '#90ed7d'
                        }, {
                            id:'28',
                            mass:1,
                            marker: {
                                radius: 5
                            },
                            color: '#90ed7d'
                        }, {
                            id:'29',
                            mass:1,
                            marker: {
                                radius: 6
                            },
                            color: '#7cb5ec'
                        }, {
                            id:'30',
                            mass:1,
                            marker: {
                                radius: 6
                            },
                            color: '#7cb5ec'
                        }
                     ],
        },
        //4
        {type:'pie',
            showInLegend:false,
            data:[
                 {name:'The Left', y:69, color:Highcharts.getOptions().colors[7], label:'DIE LINKE'},
                 {name:'Social Democratic Party', y:153, color:Highcharts.getOptions().colors[0], label:'SPD'},
                 {name:'Alliance 90/The Greens',y: 67, color:{patternIndex:7}, label:'GRÜNE',},
                 {name:'Free Democratic Party', y:80, color:Highcharts.getOptions().colors[2],label:'FDP',},
                 {name:'Christian Democratic Union', y:200,color:Highcharts.getOptions().colors[4], label:'CDU',},
                 {name:'Christian Social Union in Bavaria', y:46, color:{patternIndex:0}, label:'CSU',},
                 {name:'Alternative for Germany', y:94, color:Highcharts.getOptions().colors[9],label:'AfD',},

            ],
            allowPointSelect: true,
            slicedOffset: 20,
            borderColor:'#fff',
            zIndex:20,
            borderWidth:5,
            innerSize:'30%',
            startAngle:100,
            endAngle:100, 
            dataLabels:{
                enabled:false,
            }
        },
        ///5 - 17
        {type: 'streamgraph',
            name: streamSeries[0].name,
            data:streamDataArrays[0],
            color:'#43abff',
        },
        {type: 'streamgraph',
            name: streamSeries[1].name,
            data:streamDataArrays[2],
            color:'#84c3ff',
        },
        {type: 'streamgraph',
            name: streamSeries[2].name,
            data:streamDataArrays[2],
            color:'#d0e3fc',
        },
        {type: 'streamgraph',
            name: streamSeries[3].name,
            data:streamDataArrays[3],
            color:'#7c95ff',
        },
        {type: 'streamgraph',
            name: streamSeries[4].name,
            data:streamDataArrays[4],
            color: '#ff4768',
        },
        {type: 'streamgraph',
            name: streamSeries[5].name,
            data:streamDataArrays[5],
            color: '#88eff9',
        },
        {type: 'streamgraph',
            name: streamSeries[6].name,
            data:streamDataArrays[6],
            color:'#737cff',
        },
        {type: 'streamgraph',
            name: streamSeries[7].name,
            data:streamDataArrays[7],
            color:'#afb9ff',
        },
        {type: 'streamgraph',
            name: streamSeries[8].name,
            data:streamDataArrays[8],
            color:'#e5e0ff',
        },
        {type: 'streamgraph',
            name: streamSeries[10].name,
            data:streamDataArrays[10],
            color: Highcharts.color(colors[5]).brighten(0.2).get(),
        },
        {type: 'streamgraph',
            name: streamSeries[11].name,
            data:streamDataArrays[11],
            color:Highcharts.color(colors[4]).brighten(0.1).get(),
        },
        {type: 'streamgraph',
            name: streamSeries[12].name,
            data:streamDataArrays[12],
            color:Highcharts.color(colors[5]).brighten(0.1).get(),
        },
        {type: 'streamgraph',
            name: streamSeries[13].name,
            data:streamDataArrays[13],
            color:Highcharts.color(colors[0]).brighten(0.1).get(),
        },
        //18 - 26
        kernelSeries[0],
        kernelSeries[1],
        kernelSeries[2],
        kernelSeries[3],
        kernelSeries[4],
        kernelSeries[5],
        kernelSeries[6],
        kernelSeries[7],
        kernelSeries[8],
    ]
}


///THE REST OF THE CHARTS
let chartUpdate = {

  chart:{
      
      borderRadius:4,
      style:bodyStyle,
      margin:[70,0,0,0]
  },
  colors:[
  Highcharts.getOptions().colors[7],
  Highcharts.getOptions().colors[0],
  {patternIndex:3},
  Highcharts.getOptions().colors[2],
  Highcharts.getOptions().colors[4],
  {patternIndex:0},
  Highcharts.getOptions().colors[9]
  ],
  exporting:{
      enabled:false
  },
  rangeSelector:{
        enabled:false
    },

    stockTools: {
        gui: {
            enabled: false
        }
    },

  title: {
    text: '',
    style:titleStyle,
    verticalAlign:'top',
    align:'left',
    x:0,
    
  },

  subtitle: {
    text: ''
  },

  xAxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    labels:{
        style:{
            fontSize:'14px',
        color:axisColor
        }
        
    }
  },
  yAxis:{
      labels:{
        style:{
            fontSize:'14px',
            color:axisColor
        }
        
        },
      gridLineColor:'transparent'
    },

  

  series: [{
    type: 'column',
    colorByPoint: true,
    pointWidth:100,
    borderRadius:10,
    dataLabels:{
        enabled:false
    },
    data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
    showInLegend: false
      },
    ],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 1024
            },
            chartOptions: {
                chart:{
                    marginTop:100,
                     marginBottom:0
                }
            }
        }]
    }
};

let multipleAxes = {
  chart: {
    zoomType: 'xy',
    style:bodyStyle,
    spacingTop:50,
   
  },
  title: {
    text: 'Multiple Axes',
    align: 'left',
    style:titleStyle,
    floating:true,
    y:-20,
  },
  subtitle: {
    text: 'Average Monthly Weather Data for Tokyo',
    align: 'center',
    style:{
        fontSize:'18px'
    }
  },
  rangeSelector:{
        enabled:false
    },

    stockTools: {
        gui: {
            enabled: false
        }
    },
  xAxis: [{
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
     
      style: {
      
        fontSize:'14px'
      }
    },
    crosshair: true
  }],
  yAxis: [{ // Primary yAxis
    labels: {
      format: '{value}°C',
      style: {
        color: '#ff4576',
        fontSize:'12px'
      }
    },
    title: {
      text: 'Temperature',
      style: {
        color: '#ff4576',
        fontSize:'14px'
      },
    
    },
    opposite: true

  }, { // Secondary yAxis
    gridLineWidth: 0,
    title: {
      text: 'Rainfall',
      style: {
        color: '#51a7ff',
        fontSize:'14px'
      },
     
    },
    labels: {
      format: '{value} mm',
      style: {
        color: '#51a7ff',
         fontSize:'11px'
      }
    }

  }, { // Tertiary yAxis
    gridLineWidth: 0,
    title: {
      text: 'Sea-Level Pressure',
      style: {
        color: Highcharts.getOptions().colors[1],
        fontSize:'14px'
      },
     
    },
    labels: {
      format: '{value} mb',
      style: {
        color: Highcharts.getOptions().colors[1],
        fontSize:'11px'
      }
    },
    opposite: true
  }],
  tooltip: {
    shared: true
  },
  exporting:{
      enabled:false
  },
  legend: {
    layout: 'horizontal',
    align: 'center',
    x: 0,
    verticalAlign: 'top',
    y: 45,
    floating: true,
    itemStyle:{
        fontSize:'12px',
        fontWeight:'normal'
    },
    padding: 3,
        itemMarginTop: 5,
        itemMarginBottom: 5,
    backgroundColor:
      Highcharts.defaultOptions.legend.backgroundColor || // theme
      'rgba(255,255,255,0.25)'
  },
  series: [{
    name: 'Rainfall',
    type: 'column',
    color:'#a5d6ff',

    marker:{
        symbol:'square'
    },
    label:{
        maxFontSize:'18px',
        minFontSize:'14px',
    },
    borderWidth:4,

    borderColor:'#c7e0fe',
    borderRadius:3,
    yAxis: 1,
    data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
    tooltip: {
      valueSuffix: ' mm'
    }

  }, {
    name: 'Sea-Level Pressure',
    type: 'spline',
    color:Highcharts.getOptions().colors[1],
     lineWidth:4,
    yAxis: 2,
    data: [1016, 1016, 1015.9, 1015.5, 1012.3, 1009.5, 1009.6, 1010.2, 1013.1, 1016.9, 1018.2, 1016.7],
    marker: {
      enabled: false
    },
    dashStyle: 'shortdot',
    tooltip: {
      valueSuffix: ' mb'
    }

  }, {
    name: 'Temperature',
    type: 'spline',
     color:'#ff4576',
   fillOpacity:.2,
    label:{
        fontSize:'14px'
    },
    marker:{
        symbold:'square'
     },
     lineWidth:2,
    
    
    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
    tooltip: {
      valueSuffix: ' °C'
    }
  }],
  responsive: {
    rules: [{
      condition: {
        maxWidth: 500
      },
      chartOptions: {
        legend: {
          floating: false,
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'bottom',
          x: 0,
          y: 0
        },
        yAxis: [{
          labels: {
            align: 'right',
            x: 0,
            y: -6
          },
          title:{
              rotation:90,
              align:'middle',
              offset:12,
          },
          showLastLabel: false
        }, 
        {
          labels: {
            align: 'left',
            x: 0,
            y: -6
          },
           title:{
              rotation:270,
              align:'middle',
              offset:12,
          },
          showLastLabel: false
        }, 
        {
          visible: false
        }]
      }
    },{
        condition:{
            minWidth:800
        },
        chartOptions:{
            subtitle:{
                 y:-15,
                 x:-40,
            },
             yAxis: [{
                  
                  title:{
                      rotation:0,
                      align:'high',
                      offset:0,
                       y:-15,
                  }
                  
                }, 
                {
                    title:{
                     rotation:0,
                      align:'high',
                      y:-15,
                      x:-10,
                      offset:0,
                  },
                    
                }, 
                {

                    title:{
                      rotation:0,
                  align:'high',
                  y:-15,
                  x:10,
                  offset:0
                  },

                 
                }
            ]
        }
    }]
  }
};

let honeyComb = {
     
    
    chart: {
        inverted: true,
        type:'tilemap',
        height:'60%',
        style:bodyStyle,
        marginTop:20,
        marginLeft:100,
        marginRight:100,
        marginBottom:100
    },
           
    stockTools:{
        gui:{
            enabled:false
        }
    },
    exporting:{
        enabled:false
    },
    credits:{
        enabled:false
    },
    legend:{
        floating:true,
        layout:'vertical',
        y:-30,
        align:'right'
    },
    accessibility: {
        description: 'A tile map represents the states of the USA by population in 2016. The hexagonal tiles are positioned to geographically echo the map of the USA. A color-coded legend states the population levels as below 1 million (beige), 1 to 5 million (orange), 5 to 20 million (pink) and above 20 million (hot pink). The chart is interactive, and the individual state data points are displayed upon hovering. Three states have a population of above 20 million: California (39.3 million), Texas (27.9 million) and Florida (20.6 million). The northern US region from Massachusetts in the Northwest to Illinois in the Midwest contains the highest concentration of states with a population of 5 to 20 million people. The southern US region from South Carolina in the Southeast to New Mexico in the Southwest contains the highest concentration of states with a population of 1 to 5 million people. 6 states have a population of less than 1 million people; these include Alaska, Delaware, Wyoming, North Dakota, South Dakota and Vermont. The state with the lowest population is Wyoming in the Northwest with 584,153 people.'
    },
    title: {
        text: 'Honeycomb Tile Map',
        align:'left',
        style:titleStyle
    },
     subtitle: {
                    text: ' U.S. states by population in 2016',
                     style:subTitleStyle,
                     align:'center',
                     floating:true,
                     y:40,
                },
    xAxis: {
        visible: false
    },
    yAxis: {
        visible: false
    },
    colorAxis: {
        dataClasses: [{
        from: 0,
        to: 1000000,
        color: '#F9EDB3',
        name: '< 1M'
        }, {
        from: 1000000,
        to: 5000000,
        color: '#FFC428',
        name: '1M - 5M'
        }, {
        from: 5000000,
        to: 20000000,
        color: '#FF7987',
        name: '5M - 20M'
        }, {
        from: 20000000,
        color: '#FF2371',
        name: '> 20M'
        }]
    },

    tooltip: {
        headerFormat: '',
        pointFormat: 'The population of <b> {point.name}</b> is <b>{point.value}</b>'
    },

    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                format: '{point.hc-a2}',
                color: '#000000',
                style: {
                    textOutline: false
                }
            }
        }
    },
    series: [{
        name: '',
        data: 
        [
            {
            'hc-a2': 'AL',
            name: 'Alabama',
            region: 'South',
            x: 6,
            y: 7,
            value: 4849377
            }, {
            'hc-a2': 'AK',
            name: 'Alaska',
            region: 'West',
            x: 0,
            y: 0,
            value: 737732
            }, {
            'hc-a2': 'AZ',
            name: 'Arizona',
            region: 'West',
            x: 5,
            y: 3,
            value: 6745408
            }, {
            'hc-a2': 'AR',
            name: 'Arkansas',
            region: 'South',
            x: 5,
            y: 6,
            value: 2994079
            }, {
            'hc-a2': 'CA',
            name: 'California',
            region: 'West',
            x: 5,
            y: 2,
            value: 39250017
            }, {
            'hc-a2': 'CO',
            name: 'Colorado',
            region: 'West',
            x: 4,
            y: 3,
            value: 5540545
            }, {
            'hc-a2': 'CT',
            name: 'Connecticut',
            region: 'Northeast',
            x: 3,
            y: 11,
            value: 3596677
            }, {
            'hc-a2': 'DE',
            name: 'Delaware',
            region: 'South',
            x: 4,
            y: 9,
            value: 935614
            }, {
            'hc-a2': 'DC',
            name: 'District of Columbia',
            region: 'South',
            x: 4,
            y: 10,
            value: 7288000
            }, {
            'hc-a2': 'FL',
            name: 'Florida',
            region: 'South',
            x: 8,
            y: 8,
            value: 20612439
            }, {
            'hc-a2': 'GA',
            name: 'Georgia',
            region: 'South',
            x: 7,
            y: 8,
            value: 10310371
            }, {
            'hc-a2': 'HI',
            name: 'Hawaii',
            region: 'West',
            x: 8,
            y: 0,
            value: 1419561
            }, {
            'hc-a2': 'ID',
            name: 'Idaho',
            region: 'West',
            x: 3,
            y: 2,
            value: 1634464
            }, {
            'hc-a2': 'IL',
            name: 'Illinois',
            region: 'Midwest',
            x: 3,
            y: 6,
            value: 12801539
            }, {
            'hc-a2': 'IN',
            name: 'Indiana',
            region: 'Midwest',
            x: 3,
            y: 7,
            value: 6596855
            }, {
            'hc-a2': 'IA',
            name: 'Iowa',
            region: 'Midwest',
            x: 3,
            y: 5,
            value: 3107126
            }, {
            'hc-a2': 'KS',
            name: 'Kansas',
            region: 'Midwest',
            x: 5,
            y: 5,
            value: 2904021
            }, {
            'hc-a2': 'KY',
            name: 'Kentucky',
            region: 'South',
            x: 4,
            y: 6,
            value: 4413457
            }, {
            'hc-a2': 'LA',
            name: 'Louisiana',
            region: 'South',
            x: 6,
            y: 5,
            value: 4649676
            }, {
            'hc-a2': 'ME',
            name: 'Maine',
            region: 'Northeast',
            x: 0,
            y: 11,
            value: 1330089
            }, {
            'hc-a2': 'MD',
            name: 'Maryland',
            region: 'South',
            x: 4,
            y: 8,
            value: 6016447
            }, {
            'hc-a2': 'MA',
            name: 'Massachusetts',
            region: 'Northeast',
            x: 2,
            y: 10,
            value: 6811779
            }, {
            'hc-a2': 'MI',
            name: 'Michigan',
            region: 'Midwest',
            x: 2,
            y: 7,
            value: 9928301
            }, {
            'hc-a2': 'MN',
            name: 'Minnesota',
            region: 'Midwest',
            x: 2,
            y: 4,
            value: 5519952
            }, {
            'hc-a2': 'MS',
            name: 'Mississippi',
            region: 'South',
            x: 6,
            y: 6,
            value: 2984926
            }, {
            'hc-a2': 'MO',
            name: 'Missouri',
            region: 'Midwest',
            x: 4,
            y: 5,
            value: 6093000
            }, {
            'hc-a2': 'MT',
            name: 'Montana',
            region: 'West',
            x: 2,
            y: 2,
            value: 1023579
            }, {
            'hc-a2': 'NE',
            name: 'Nebraska',
            region: 'Midwest',
            x: 4,
            y: 4,
            value: 1881503
            }, {
            'hc-a2': 'NV',
            name: 'Nevada',
            region: 'West',
            x: 4,
            y: 2,
            value: 2839099
            }, {
            'hc-a2': 'NH',
            name: 'New Hampshire',
            region: 'Northeast',
            x: 1,
            y: 11,
            value: 1326813
            }, {
            'hc-a2': 'NJ',
            name: 'New Jersey',
            region: 'Northeast',
            x: 3,
            y: 10,
            value: 8944469
            }, {
            'hc-a2': 'NM',
            name: 'New Mexico',
            region: 'West',
            x: 6,
            y: 3,
            value: 2085572
            }, {
            'hc-a2': 'NY',
            name: 'New York',
            region: 'Northeast',
            x: 2,
            y: 9,
            value: 19745289
            }, {
            'hc-a2': 'NC',
            name: 'North Carolina',
            region: 'South',
            x: 5,
            y: 9,
            value: 10146788
            }, {
            'hc-a2': 'ND',
            name: 'North Dakota',
            region: 'Midwest',
            x: 2,
            y: 3,
            value: 739482
            }, {
            'hc-a2': 'OH',
            name: 'Ohio',
            region: 'Midwest',
            x: 3,
            y: 8,
            value: 11614373
            }, {
            'hc-a2': 'OK',
            name: 'Oklahoma',
            region: 'South',
            x: 6,
            y: 4,
            value: 3878051
            }, {
            'hc-a2': 'OR',
            name: 'Oregon',
            region: 'West',
            x: 4,
            y: 1,
            value: 3970239
            }, {
            'hc-a2': 'PA',
            name: 'Pennsylvania',
            region: 'Northeast',
            x: 3,
            y: 9,
            value: 12784227
            }, {
            'hc-a2': 'RI',
            name: 'Rhode Island',
            region: 'Northeast',
            x: 2,
            y: 11,
            value: 1055173
            }, {
            'hc-a2': 'SC',
            name: 'South Carolina',
            region: 'South',
            x: 6,
            y: 8,
            value: 4832482
            }, {
            'hc-a2': 'SD',
            name: 'South Dakota',
            region: 'Midwest',
            x: 3,
            y: 4,
            value: 853175
            }, {
            'hc-a2': 'TN',
            name: 'Tennessee',
            region: 'South',
            x: 5,
            y: 7,
            value: 6651194
            }, {
            'hc-a2': 'TX',
            name: 'Texas',
            region: 'South',
            x: 7,
            y: 4,
            value: 27862596
            }, {
            'hc-a2': 'UT',
            name: 'Utah',
            region: 'West',
            x: 5,
            y: 4,
            value: 2942902
            }, {
            'hc-a2': 'VT',
            name: 'Vermont',
            region: 'Northeast',
            x: 1,
            y: 10,
            value: 626011
            }, {
            'hc-a2': 'VA',
            name: 'Virginia',
            region: 'South',
            x: 5,
            y: 8,
            value: 8411808
            }, {
            'hc-a2': 'WA',
            name: 'Washington',
            region: 'West',
            x: 2,
            y: 1,
            value: 7288000
            }, {
            'hc-a2': 'WV',
            name: 'West Virginia',
            region: 'South',
            x: 4,
            y: 7,
            value: 1850326
            }, {
            'hc-a2': 'WI',
            name: 'Wisconsin',
            region: 'Midwest',
            x: 2,
            y: 5,
            value: 5778708
            }, {
            'hc-a2': 'WY',
            name: 'Wyoming',
            region: 'West',
            x: 3,
            y: 3,
            value: 584153
            }
        ]
    }],
    responsive: {
        rules: [{
                condition: {
                    maxWidth: 400
                },
                chartOptions: {
                    chart:{
                        height:'90%',
                        // height: '80%',
                        marginLeft:20,
                        marginRight:20,
                        marginTop:90,
                        marginBottom:20,
                    },
                    legend:{
                        layout:'vertical',
                        floating:false,
                        verticalAlign:'bottom',
                        align:'right',
                        itemStyle:{
                            fontSize:'10px'
                        },
                        x:20,
                        y:20
                    },
                   
                     subtitle: {
                         align:'left',
                         y:35,
                          width:300,
                   
                    },
                    plotOptions:{
                        series:{
                            dataLabels:{
                                style:{
                                    fontSize:'6px'
                                }
                            }
                        }
                    }

                }
            },
            {
                condition: {
                    minWidth: 401,
                    maxWidth:550,
                },
                chartOptions: {
                    chart:{
                    height:'80%',
                    style:bodyStyle,
                    marginTop:80,
                    marginLeft:20,
                    marginRight:20,
                    marginBottom:30
                    },
                    /*title:{
                        text:'401 to 551'
                    },*/
                    legend:{
                        layout:'vertical',
                        floating:false,
                        verticalAlign:'bottom',
                        align:'right',
                        itemStyle:{
                            fontSize:'10px'
                        },
                        y:-30
                    },
                     subtitle: {
                         align:'left',
                         y:35,
                         width:null
                    },
                    plotOptions:{
                        series:{
                            dataLabels:{
                                style:{
                                    fontSize:'8px'
                                }
                            }
                        }
                    }

                }
            },
            {
                condition: {
                    minWidth: 551,
                    maxWidth:650,
                },
                chartOptions: {
                    chart:{
                         height:'60%',
                    style:bodyStyle,
                    marginTop:50,
                    marginLeft:30,
                    marginRight:30,
                    marginBottom:0


                    },
                    legend:{
                        layout:'vertical',
                        floating:false,
                        verticalAlign:'bottom',
                        align:'right',
                        itemStyle:{
                            fontSize:'10px'
                        },
                        x:20,
                        y:20
                    },
                     subtitle: {
                         align:'left',
                         y:35,
                         width:null
                    },
                   /* title:{
                        text:'551 to 650'
                    },*/
                    plotOptions:{
                        series:{
                            dataLabels:{
                                style:{
                                    fontSize:'8px'
                                }
                            }
                        }
                    }

                }
            },
            {
            condition: {
                minWidth:651,
                maxWidth: 750
            },
            chartOptions: {
                chart:{
                     height:'58%',
                    style:bodyStyle,
                    marginTop:30,
                    marginLeft:70,
                    marginRight:70,
                    marginBottom:30
                    
                },
               subtitle: {
                     align:'center',
                     y:60,
                     width:null
                },
               /* title:{
                        text:'651 to 750'
                    },*/
                legend:{
                    layout:'vertical',
                    floating:true,
                    verticalAlign:'bottom',
                    align:'right',
                    itemStyle:{
                        fontSize:'10px'
                    },
                    y:-60
                },
                plotOptions:{
                    series:{
                        dataLabels:{
                            enabled:true,
                            style:{
                                fontSize:'10px'
                            }
                        }
                    }
                }
            }
        },
        
        {
         condition: {
                minWidth:751,
                maxWidth:800,
            },
           
            chartOptions:{
                  chart: {
                    height:'58%',
                    style:bodyStyle,
                    marginTop:20,
                    marginLeft:100,
                    marginRight:100,
                    marginBottom:80
                },
                 legend:{
                    layout:'vertical',
                    floating:true,
                    verticalAlign:'bottom',
                    align:'right',
                    itemStyle:{
                        fontSize:'10px'
                    },
                    y:-120
                },
                subtitle: {
                     align:'center',
                     y:60,
                     width:null
                },
                /* title:{
                        text:'751 to 800'
                    },*/
                
                plotOptions:{
                    series:{
                        dataLabels: {
                            enabled: true,
                            format: '{point.hc-a2}',
                            color: '#000000',
                            style: {
                                textOutline: false,
                                fontSize:'10px'
                            }
                        }
                    }
                }
                
            }
           
        },
        {
            condition:{
                minWidth:801
            },
            chartOptions:{
                 chart: {
                    height:'59%',
                    style:bodyStyle,
                    marginTop:20,
                    marginLeft:100,
                    marginRight:100,
                    marginBottom:110
                },
                legend:{
                    layout:'vertical',
                    floating:true,
                    verticalAlign:'bottom',
                    align:'right',
                    itemStyle:{
                        fontSize:'10px'
                    },
                    y:-120
                },
                 subtitle: {
                     align:'center',
                     y:60,
                     width:null
                },
               /*  title:{
                        text:'801'
                    },*/
               
                plotOptions:{
                    series:{
                        dataLabels: {
                            enabled: true,
                            format: '{point.hc-a2}',
                            color: '#000000',
                            style: {
                                textOutline: false,
                                fontSize:'10px'
                            }
                        }
                    }
                }
            },

        }


      

       ]
    }
};

function gui(){
    function addPopupEvents(chart) {
        var closePopupButtons = document.getElementsByClassName('highcharts-close-popup');
        // Close popup button:
        Highcharts.addEvent(
            closePopupButtons[0],
            'click',
            function () {
                this.parentNode.style.display = 'none';
            }
        );

        Highcharts.addEvent(
            closePopupButtons[1],
            'click',
            function () {
                this.parentNode.style.display = 'none';
            }
        );

        // Add an indicator from popup
        Highcharts.addEvent(
            document.querySelectorAll('.highcharts-popup-indicators button')[0],
            'click',
            function () {
                var typeSelect = document.querySelectorAll(
                        '.highcharts-popup-indicators select'
                    )[0],
                    type = typeSelect.options[typeSelect.selectedIndex].value,
                    period = document.querySelectorAll(
                        '.highcharts-popup-indicators input'
                    )[0].value || 14;

                chart.addSeries({
                    linkedTo: 'aapl-ohlc',
                    type: type,
                    params: {
                        period: parseInt(period, 10)
                    }
                });

                chart.stockToolbar.indicatorsPopupContainer.style.display = 'none';
            }
        );

        // Update an annotaiton from popup
        Highcharts.addEvent(
            document.querySelectorAll('.highcharts-popup-annotations button')[0],
            'click',
            function () {
                var strokeWidth = parseInt(
                        document.querySelectorAll(
                            '.highcharts-popup-annotations input[name="stroke-width"]'
                        )[0].value,
                        10
                    ),
                    strokeColor = document.querySelectorAll(
                        '.highcharts-popup-annotations input[name="stroke"]'
                    )[0].value;

                // Stock/advanced annotations have common options under typeOptions
                if (chart.currentAnnotation.options.typeOptions) {
                    chart.currentAnnotation.update({
                        typeOptions: {
                            lineColor: strokeColor,
                            lineWidth: strokeWidth,
                            line: {
                                strokeWidth: strokeWidth,
                                stroke: strokeColor
                            },
                            background: {
                                strokeWidth: strokeWidth,
                                stroke: strokeColor
                            },
                            innerBackground: {
                                strokeWidth: strokeWidth,
                                stroke: strokeColor
                            },
                            outerBackground: {
                                strokeWidth: strokeWidth,
                                stroke: strokeColor
                            },
                            connector: {
                                strokeWidth: strokeWidth,
                                stroke: strokeColor
                            }
                        }
                    });
                } else {
                    // Basic annotations:
                    chart.currentAnnotation.update({
                        shapes: [{
                            'stroke-width': strokeWidth,
                            stroke: strokeColor
                        }],
                        labels: [{
                            borderWidth: strokeWidth,
                            borderColor: strokeColor
                        }]
                    });
                }
                chart.stockToolbar.annotationsPopupContainer.style.display = 'none';
            }
        );
    }


    let sourceURL = 'https://demo-live-data.highcharts.com/aapl-ohlcv.json';
    if(document.location.href.indexOf('goodwiththat') != -1){
        sourceURL = 'https://www.goodwiththat.com/demos/aapl-ohlcv.json'
    }
    //https://demo-live-data.highcharts.com/aapl-ohlcv.json
    Highcharts.getJSON(sourceURL, function (data) {
        // split the data set into ohlc and volume
        var ohlc = [],
            volume = [],
            dataLength = data.length,
            i = 0;

        for (i; i < dataLength; i += 1) {
            ohlc.push([
                data[i][0], // the date
                data[i][1], // open
                data[i][2], // high
                data[i][3], // low
                data[i][4] // close
            ]);

            volume.push([
                data[i][0], // the date
                data[i][5] // the volume
            ]);
        }

        exChart = Highcharts.stockChart('mini', {
            chart: {
                
                backgroundColor:'transparent',
                style:bodyStyle,
                events: {
                    load: function () {
                        this.xAxis[0].setExtremes(Date.UTC(2020,4,1),Date.UTC(2020,8,7));
                    }
                }
            },
            exporting:{
                enabled:false
            },
            annotations:[{
                shapeOptions:{
                    fill:'red'
                }
            }],
            title:{
                text:'Financial Indicators & Annotations',
                style:titleStyle,
                align:'left',
                x:60
            },
            yAxis: [{
                labels: {
                    align: 'left',
                    formatter:function(){

                    }
                },
                height: '50%',
                resize: {
                    enabled: true,
                    lineColor:'#000'

                },
                gridLineColor:baseColor,
                gridLineWidth:1,
            }, {
                labels: {
                    align: 'left',
                    formatter:function(){
                        
                    }
                },
                top: '50%',
                height: '50%',
                offset: 0,
                gridLineColor:baseColor,
                gridLineWidth:1,
            }],
            
            navigationBindings: {
                events: {
                    selectButton: function (event) {
                        console.log('SELECT');
                        var newClassName = event.button.className + ' highcharts-active',
                            topButton = event.button.parentNode.parentNode;

                        if (topButton.classList.contains('right')) {
                            newClassName += ' right';
                        }

                        // If this is a button with sub buttons,
                        // change main icon to the current one:
                        if (!topButton.classList.contains('highcharts-menu-wrapper')) {
                            topButton.className = newClassName;
                        }

                        // Store info about active button:
                        this.chart.activeButton = event.button;
                    },
                    deselectButton: function (event) {
                          console.log('DESELECT');
                        event.button.parentNode.parentNode.classList.remove('highcharts-active');

                        // Remove info about active button:
                        this.chart.activeButton = null;
                    },
                    showPopup: function (event) {
                          console.log('SHOW');

                        if (!this.indicatorsPopupContainer) {
                            this.indicatorsPopupContainer = document
                                .getElementsByClassName('highcharts-popup-indicators')[0];
                        }

                        if (!this.annotationsPopupContainer) {
                            this.annotationsPopupContainer = document
                                .getElementsByClassName('highcharts-popup-annotations')[0];
                        }

                        if (event.formType === 'indicators') {
                            this.indicatorsPopupContainer.style.display = 'block';
                        } else if (event.formType === 'annotation-toolbar') {
                            // If user is still adding an annotation, don't show popup:
                            if (!this.chart.activeButton) {
                                this.chart.currentAnnotation = event.annotation;
                                this.annotationsPopupContainer.style.display = 'block';
                            }
                        }

                    },
                    closePopup: function () {
                        this.indicatorsPopupContainer.style.display = 'none';
                        this.annotationsPopupContainer.style.display = 'none';
                    }
                }
            },
            navigator:{
                series:{
                    color:Highcharts.getOptions().colors[3]
                }
            },
            rangeSelector:{
                enabled:true
            },

            stockTools: {
                gui: {
                    enabled: true
                }
            },
            tooltip:{
                enabled:false
            },
            series: [{
                type: 'ohlc',
                color:'#4fa5ff',
                pointWidth:10,
                id: 'aapl-ohlc',
                name: 'AAPL Stock Price',
                data: ohlc,
            }, {
                type: 'column',
                color:Highcharts.getOptions().colors[2],
                id: 'aapl-volume',
                name: 'AAPL Volume',
                data: volume,
                yAxis: 1,
            }],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 600
                    },
                    chartOptions: {
                        chart:{
                            height:380,
                           
                        },
                        rangeSelector: {
                            inputEnabled: false
                        },
                        navigator:{
                            enabled:false
                        },
                        scrollbar:{
                            enabled:false
                        }
                    }
                }]
            }
        });
    });
}

function flags(){
    Highcharts.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/usdeur.json', function (data) {

      var lastDate = data[data.length - 1][0],  // Get year of last data point
        days = 24 * 36e5; // Milliseconds in a day

      // Create the chart
      Highcharts.stockChart('mini', {

          chart:{
              style:bodyStyle
          },

        rangeSelector: {
          selected: 1
        },
        navigator:{
            series:{
                color:Highcharts.getOptions().colors[4],
                

            }
        },
        exporting:{
            enabled:false
        },
        title: {
          text: 'Flag Series',
          style:titleStyle,
          align:'left',
        },
        sutitle:{
            text:'USD to EUR exchange rate',
            align:'left',
            style:subTitleStyle

        },

            stockTools: {
                gui: {
                    enabled: false
                }
            },

        yAxis: [{
          title: {
            text: 'Exchange rate'
          },
          top: '15%',
          height: '85%'
        }, {
          height: '15%'
        }],

        series: [
            {
                name: 'USD to EUR',
                data: data,
                id: 'dataseries',
                tooltip: {
                valueDecimals: 4
                }
            }, {
              type: 'flags',
              lineColor:'blue',
              borderRadius:3,
             
             
              width:150,
              
              style:{
                  // fontSize:'11px'
              },
              shape:'squarepin',
              name: 'Flags on <series></series>',
              data: [{
                x: lastDate - 60 * days,
                y:.86,
                title: 'On series'
              }, {
                x: lastDate - 30 * days,
                title: 'On series'
              }],
              onSeries: 'dataseries',
            }, {
          type: 'flags',
          name: 'Flags on axis',
          data: [{
            x: lastDate - 45 * days,
            title: 'On axis'
          }, {
            x: lastDate - 15 * days,
            title: 'On axis'
          }],
          shape: 'squarepin'
        }, {
          type: 'flags',
          name: 'Flags in pane',
          data: [{
            x: lastDate - 40 * days,
            title: 'In pane'
          }, {
            x: lastDate - 15 * days,
            title: 'In pane'
          }],
          yAxis: 1,
          shape: 'squarepin'
        }]
      });
    });
}

function flightRoutes(){

    let chart = Highcharts.mapChart('mini', {
        chart:{
            events:{
                load:function(){
                    let map = this;
                    $('#developersCharts4').hide();
                   //  map.mapZoom(.2);

                     setTimeout(function(){
                          $('#developersCharts4').fadeIn();
                      },500);

                     setTimeout(function(){
                          
                        //  map.mapZoom(5);
                     },700);
                     
                }
            },
            // marginLeft:0,
            style:bodyStyle
        },
        stockTools:{
            gui:{
                enabled:false
            }
        },
        title: {
            text: 'Simple Flight Routes',
            style:titleStyle,
            align:'left',
            
        },

        legend: {
            
            layout: 'vertical',
            align:'center',
             verticalAlign:'middle',
            floating: true,
            x:300,
           
        },

        mapNavigation: {
            enabled: true,
            
            
        },
        exporting:{
            enabled:false
        },

        tooltip: {
            formatter: function () {
              return this.point.id + (
                this.point.lat ?
                  '<br>Lat: ' + this.point.lat + ' Lon: ' + this.point.lon : ''
              );
            }
        },


        plotOptions: {
        series: {
          marker: {
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: Highcharts.getOptions().colors[1]
          },
           size:'200%'
        }
        },

        series: [{
        // Use the gb-all map with no data as a basemap
            mapData: Highcharts.maps['countries/gb/gb-all'],
            name: 'Basemap',
            borderColor: '#707070',
            nullColor: 'rgba(200, 200, 200, 0.3)',
            showInLegend: false
            }, {
            name: 'Separators',
            type: 'mapline',
            data: Highcharts.geojson(Highcharts.maps['countries/gb/gb-all'], 'mapline'),
            color: '#707070',
            showInLegend: false,
            enableMouseTracking: false
            }, {
            // Specify cities using lat/lon
            type: 'mappoint',
            name: 'Cities',
            dataLabels: {
              format: '{point.id}'
            },
            // Use id instead of name to allow for referencing points later using
            // chart.get
            data: [{
              id: 'London',
              lat: 51.507222,
              lon: -0.1275
            }, {
              id: 'Birmingham',
              lat: 52.483056,
              lon: -1.893611
            }, {
              id: 'Leeds',
              lat: 53.799722,
              lon: -1.549167
            }, {
              id: 'Glasgow',
              lat: 55.858,
              lon: -4.259
            }, {
              id: 'Sheffield',
              lat: 53.383611,
              lon: -1.466944
            }, {
              id: 'Liverpool',
              lat: 53.4,
              lon: -3
            }, {
              id: 'Bristol',
              lat: 51.45,
              lon: -2.583333
            }, {
              id: 'Belfast',
              lat: 54.597,
              lon: -5.93
            }, {
              id: 'Lerwick',
              lat: 60.155,
              lon: -1.145,
              dataLabels: {
                align: 'left',
                x: 5,
                verticalAlign: 'middle'
              }
            }]
        }],
        responsive:{
            rules:[{
                condition:{
                    maxWidth:400
                },
                chartOptions:{
                  chart:{
                      resetZoomButton:{
                          position:{
                              verticalAlign:'top',
                              y:-40
                          }
                      }
                  },
                  legend: {
                    
                    layout: 'vertical',
                    align:'left',
                     verticalAlign:'bottom',
                    floating: true,
                    x:0,
                   
                },
                }
            }]
        }
    });

    // Function to return an SVG path between two points, with an arc
    function pointsToPath(from, to, invertArc) {
        var arcPointX = (from.x + to.x) / (invertArc ? 2.4 : 1.6),
        arcPointY = (from.y + to.y) / (invertArc ? 2.4 : 1.6);
        return 'M' + from.x + ',' + from.y + 'Q' + arcPointX + ' ' + arcPointY +
          ',' + to.x + ' ' + to.y;
    }

    var londonPoint = chart.get('London'),
    lerwickPoint = chart.get('Lerwick');

    // Add a series of lines for London
    chart.addSeries({
        name: 'London flight routes',
        type: 'mapline',
        lineWidth: 2,
        color: Highcharts.getOptions().colors[3],
        data: [{
        id: 'London - Glasgow',
        path: pointsToPath(londonPoint, chart.get('Glasgow'))
        }, {
        id: 'London - Belfast',
        path: pointsToPath(londonPoint, chart.get('Belfast'), true)
        }, {
        id: 'London - Leeds',
        path: pointsToPath(londonPoint, chart.get('Leeds'))
        }, {
        id: 'London - Liverpool',
        path: pointsToPath(londonPoint, chart.get('Liverpool'), true)
        }, {
        id: 'London - Sheffield',
        path: pointsToPath(londonPoint, chart.get('Sheffield'))
        }, {
        id: 'London - Birmingham',
        path: pointsToPath(londonPoint, chart.get('Birmingham'), true)
        }, {
        id: 'London - Bristol',
        path: pointsToPath(londonPoint, chart.get('Bristol'), true)
        }]
    });

    // Add a series of lines for Lerwick
    chart.addSeries({
        name: 'Lerwick flight routes',
        type: 'mapline',
        lineWidth: 2,
        color: Highcharts.getOptions().colors[5],
        data: [{
        id: 'Lerwick - Glasgow',
        path: pointsToPath(lerwickPoint, chart.get('Glasgow'))
        }, {
        id: 'Lerwick - Belfast',
        path: pointsToPath(lerwickPoint, chart.get('Belfast'))
        }, {
        id: 'Lerwick - Leeds',
        path: pointsToPath(lerwickPoint, chart.get('Leeds'))
        }, {
        id: 'Lerwick - Liverpool',
        path: pointsToPath(lerwickPoint, chart.get('Liverpool'))
        }]
    });
}

function synchronized(){


    /*
    The purpose of this demo is to demonstrate how multiple charts on the same page
    can be linked through DOM and Highcharts events and API methods. It takes a
    standard Highcharts config with a small variation for each data set, and a
    mouse/touch event handler to bind the charts together.
    */


    /**
     * In order to synchronize tooltips and crosshairs, override the
     * built-in events with handlers defined on the parent element.
     */
    ['mousemove', 'touchmove', 'touchstart'].forEach(function (eventType) {
      document.getElementById('mini').addEventListener(
        eventType,
        function (e) {
          var chart,
            point,
            i,
            event;

           

          for (i = 0; i < Highcharts.charts.length; i = i + 1) {

              if(Highcharts.charts[i] != undefined){

                  chart = Highcharts.charts[i];
                // Find coordinates within the chart
                event = chart.pointer.normalize(e);
                // Get the hovered point
                point = chart.series[0].searchPoint(event, true);

                 if (point) {
                  point.highlight(e);
                }

              }
          }
        }
      );
    });

    /**
     * Override the reset function, we don't need to hide the tooltips and
     * crosshairs.
     */


    Highcharts.Pointer.prototype.reset = function () {
      return undefined;
    };

    /**
     * Highlight a point by showing tooltip, setting hover state and draw crosshair
     */
    Highcharts.Point.prototype.highlight = function (event) {
      event = this.series.chart.pointer.normalize(event);
      this.onMouseOver(); // Show the hover marker
     // this.series.chart.tooltip.refresh(this); // Show the tooltip
      this.series.chart.xAxis[0].drawCrosshair(event, this); // Show the crosshair
    };

    /**
     * Synchronize zooming through the setExtremes event handler.
     */
    function syncExtremes(e) {
      var thisChart = this.chart;
      exChart = thisChart;

      if (e.trigger !== 'syncExtremes') { // Prevent feedback loop
        Highcharts.each(Highcharts.charts, function (chart) {

            console.log(chart)
          if (chart !== thisChart && chart != undefined) {
            if (chart.xAxis[0].setExtremes) { // It is null while updating
              chart.xAxis[0].setExtremes(
                e.min,
                e.max,
                undefined,
                false,
                { trigger: 'syncExtremes' }
              );
            }
          }
        });
      }
    }

    // Get the data. The contents of the data file can be viewed at
    Highcharts.ajax({
      url: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/activity.json',
      dataType: 'text',
      success: function (activity) {

        activity = JSON.parse(activity);
        activity.datasets.forEach(function (dataset, i) {

          // Add X values
          dataset.data = Highcharts.map(dataset.data, function (val, j) {
            return [activity.xData[j], val];
          });

          var chartDiv = document.createElement('div');
          chartDiv.className = 'syncCharts';
          document.getElementById('mini').appendChild(chartDiv);

          Highcharts.chart(chartDiv, {
            chart: {
              marginLeft: 40, // Keep all charts left aligned
              spacingTop: 20,
              spacingBottom: 20,
              style:bodyStyle,
              borderRadius:4,
              borderWidth:1,
              borderColor:'#ebebeb',
              backgroundColor:Highcharts.color(Highcharts.getOptions().colors[i]).setOpacity(0.3).get('rgba'),
             
            },
            title: {
              text: dataset.name,
              align: 'left',
              margin: 0,
              x: 30,
              style:{
                  color:'#222'
              }
            },
        
                      
            credits: {
              enabled: false
            },
            exporting: {
              enabled: false
            },
            legend: {
              enabled: false
            },
            xAxis: {
              crosshair: true,
              events: {
                setExtremes: syncExtremes
              },
              labels: {
                format: '{value} km'
              }
            },
            yAxis: {
              title: {
                text: null
              }
            },
            rangeSelector:{
                enabled:false
            },

            stockTools: {
                gui: {
                    enabled: false
                }
            },
            tooltip: {
              positioner: function () {
                return {
                  // right aligned
                  x: this.chart.chartWidth - this.label.width-20,
                  y: 10 // align to title
                };
              },
              borderWidth: 0,
              backgroundColor: 'none',
              pointFormat: '{point.y}',
              headerFormat: '',
              shadow: false,
              style: {
                fontSize: '24px'
              },
              valueDecimals: dataset.valueDecimals
            },
            series: [{
              data: dataset.data,
              name: dataset.name,
              type: dataset.type,
              color: Highcharts.getOptions().colors[i],
              // lineColor:'#fff',
              fillOpacity: 0.6,
              tooltip: {
                valueSuffix: ' ' + dataset.unit
              }
            }]
          });
        });
      }
    });

    $('#mini').append('<div style="font-weight:bold;font-size:18px;padding-bottom:15px">Synchronized Charts</div>');
}

function drillDown(){

    var data = 
    [
        {
          id: '0.0',
          parent: '',
          name: 'The World'
        }, {
          id: '1.3',
          parent: '0.0',
          name: 'Asia',
          color:'#a5a5fc'
        }, {
          id: '1.1',
          parent: '0.0',
          name: 'Africa',
          color:'#5afcc3'
        }, {
          id: '1.2',
          parent: '0.0',
          name: 'America',
          color:'#7cecff'
        }, {
          id: '1.4',
          parent: '0.0',
          name: 'Europe',
          color:'#ff4666'
        }, {
          id: '1.5',
          parent: '0.0',
          name: 'Oceanic'
        },
        /* Africa */
        {
          id: '2.1',
          parent: '1.1',
          name: 'Eastern Africa',

        },
        {
          id: '3.1',
          parent: '2.1',
          name: 'Ethiopia',
          value: 104957438
        }, {
          id: '3.2',
          parent: '2.1',
          name: 'Tanzania',
          value: 57310019
        }, {
          id: '3.3',
          parent: '2.1',
          name: 'Kenya',
          value: 49699862
        }, {
          id: '3.4',
          parent: '2.1',
          name: 'Uganda',
          value: 42862958
        }, {
          id: '3.5',
          parent: '2.1',
          name: 'Mozambique',
          value: 29668834
        }, {
          id: '3.6',
          parent: '2.1',
          name: 'Madagascar',
          value: 25570895
        }, {
          id: '3.7',
          parent: '2.1',
          name: 'Malawi',
          value: 18622104
        }, {
          id: '3.8',
          parent: '2.1',
          name: 'Zambia',
          value: 17094130
        }, {
          id: '3.9',
          parent: '2.1',
          name: 'Zimbabwe',
          value: 16529904
        }, {
          id: '3.10',
          parent: '2.1',
          name: 'Somalia',
          value: 14742523
        }, {
          id: '3.11',
          parent: '2.1',
          name: 'South Sudan',
          value: 12575714
        }, {
          id: '3.12',
          parent: '2.1',
          name: 'Rwanda',
          value: 12208407
        }, {
          id: '3.13',
          parent: '2.1',
          name: 'Burundi',
          value: 10864245
        }, {
          id: '3.14',
          parent: '2.1',
          name: 'Eritrea',
          value: 5068831
        }, {
          id: '3.15',
          parent: '2.1',
          name: 'Mauritius',
          value: 1265138
        }, {
          id: '3.16',
          parent: '2.1',
          name: 'Djibouti',
          value: 956985
        }, {
          id: '3.17',
          parent: '2.1',
          name: 'Réunion',
          value: 876562
        }, {
          id: '3.18',
          parent: '2.1',
          name: 'Comoros',
          value: 813912
        }, {
          id: '3.19',
          parent: '2.1',
          name: 'Mayotte',
          value: 253045
        }, {
          id: '3.20',
          parent: '2.1',
          name: 'Seychelles',
          value: 94737
        },

        {
          id: '2.5',
          parent: '1.1',
          name: 'Western Africa'
        },

        {
          id: '3.42',
          parent: '2.5',
          name: 'Nigeria',
          value: 190886311
        }, {
          id: '3.43',
          parent: '2.5',
          name: 'Ghana',
          value: 28833629
        }, {
          id: '3.44',
          parent: '2.5',
          name: 'Côte Ivoire',
          value: 24294750
        }, {
          id: '3.45',
          parent: '2.5',
          name: 'Niger',
          value: 21477348
        }, {
          id: '3.46',
          parent: '2.5',
          name: 'Burkina Faso',
          value: 19193382
        }, {
          id: '3.47',
          parent: '2.5',
          name: 'Mali',
          value: 18541980
        }, {
          id: '3.48',
          parent: '2.5',
          name: 'Senegal',
          value: 15850567
        }, {
          id: '3.49',
          parent: '2.5',
          name: 'Guinea',
          value: 12717176
        }, {
          id: '3.50',
          parent: '2.5',
          name: 'Benin',
          value: 11175692
        }, {
          id: '3.51',
          parent: '2.5',
          name: 'Togo',
          value: 7797694
        }, {
          id: '3.52',
          parent: '2.5',
          name: 'Sierra Leone',
          value: 7557212
        }, {
          id: '3.53',
          parent: '2.5',
          name: 'Liberia',
          value: 4731906
        }, {
          id: '3.54',
          parent: '2.5',
          name: 'Mauritania',
          value: 4420184
        }, {
          id: '3.55',
          parent: '2.5',
          name: 'The Gambia',
          value: 2100568
        }, {
          id: '3.56',
          parent: '2.5',
          name: 'Guinea-Bissau',
          value: 1861283
        }, {
          id: '3.57',
          parent: '2.5',
          name: 'Cabo Verde',
          value: 546388
        }, {
          id: '3.58',
          parent: '2.5',
          name: 'Saint Helena, Ascension and Tristan da Cunha',
          value: 4049
        },

        {
          id: '2.3',
          parent: '1.1',
          name: 'North Africa'
        },

        {
          id: '3.30',
          parent: '2.3',
          name: 'Egypt',
          value: 97553151
        }, {
          id: '3.31',
          parent: '2.3',
          name: 'Algeria',
          value: 41318142
        }, {
          id: '3.32',
          parent: '2.3',
          name: 'Sudan',
          value: 40533330
        }, {
          id: '3.33',
          parent: '2.3',
          name: 'Morocco',
          value: 35739580
        }, {
          id: '3.34',
          parent: '2.3',
          name: 'Tunisia',
          value: 11532127
        }, {
          id: '3.35',
          parent: '2.3',
          name: 'Libya',
          value: 6374616
        }, {
          id: '3.36',
          parent: '2.3',
          name: 'Western Sahara',
          value: 552628
        },

        {
          id: '2.2',
          parent: '1.1',
          name: 'Central Africa'
        },

        {
          id: '3.21',
          parent: '2.2',
          name: 'Democratic Republic of the Congo',
          value: 81339988
        }, {
          id: '3.22',
          parent: '2.2',
          name: 'Angola',
          value: 29784193
        }, {
          id: '3.23',
          parent: '2.2',
          name: 'Cameroon',
          value: 24053727
        }, {
          id: '3.24',
          parent: '2.2',
          name: 'Chad',
          value: 14899994
        }, {
          id: '3.25',
          parent: '2.2',
          name: 'Congo',
          value: 5260750
        }, {
          id: '3.26',
          parent: '2.2',
          name: 'Central African Republic',
          value: 4659080
        }, {
          id: '3.27',
          parent: '2.2',
          name: 'Gabon',
          value: 2025137
        }, {
          id: '3.28',
          parent: '2.2',
          name: 'Equatorial Guinea',
          value: 1267689
        }, {
          id: '3.29',
          parent: '2.2',
          name: 'Sao Tome and Principe',
          value: 204327
        },

        {
          id: '2.4',
          parent: '1.1',
          name: 'South America'
        },

        {
          id: '3.37',
          parent: '2.4',
          name: 'South Africa',
          value: 56717156
        }, {
          id: '3.38',
          parent: '2.4',
          name: 'Namibia',
          value: 2533794
        }, {
          id: '3.39',
          parent: '2.4',
          name: 'Botswana',
          value: 2291661
        }, {
          id: '3.40',
          parent: '2.4',
          name: 'Lesotho',
          value: 2233339
        }, {
          id: '3.41',
          parent: '2.4',
          name: 'Swaziland',
          value: 1367254
        },

        /***********/

        /* America */
        {
          id: '2.9',
          parent: '1.2',
          name: 'South America'
        },

        {
          id: '3.98',
          parent: '2.9',
          name: 'Brazil',
          value: 209288278
        }, {
          id: '3.99',
          parent: '2.9',
          name: 'Colombia',
          value: 49065615
        }, {
          id: '3.100',
          parent: '2.9',
          name: 'Argentina',
          value: 44271041
        }, {
          id: '3.101',
          parent: '2.9',
          name: 'Peru',
          value: 32165485
        }, {
          id: '3.102',
          parent: '2.9',
          name: 'Venezuela',
          value: 31977065
        }, {
          id: '3.103',
          parent: '2.9',
          name: 'Chile',
          value: 18054726
        }, {
          id: '3.104',
          parent: '2.9',
          name: 'Ecuador',
          value: 16624858
        }, {
          id: '3.105',
          parent: '2.9',
          name: 'Bolivia',
          value: 11051600
        }, {
          id: '3.106',
          parent: '2.9',
          name: 'Paraguay',
          value: 6811297
        }, {
          id: '3.107',
          parent: '2.9',
          name: 'Uruguay',
          value: 3456750
        }, {
          id: '3.108',
          parent: '2.9',
          name: 'Guyana',
          value: 777859
        }, {
          id: '3.109',
          parent: '2.9',
          name: 'Suriname',
          value: 563402
        }, {
          id: '3.110',
          parent: '2.9',
          name: 'French Guiana',
          value: 282731
        }, {
          id: '3.111',
          parent: '2.9',
          name: 'Falkland Islands',
          value: 2910
        },

        {
          id: '2.8',
          parent: '1.2',
          name: 'Northern America'
        },

        {
          id: '3.93',
          parent: '2.8',
          name: 'United States',
          value: 324459463
        }, {
          id: '3.94',
          parent: '2.8',
          name: 'Canada',
          value: 36624199
        }, {
          id: '3.95',
          parent: '2.8',
          name: 'Bermuda',
          value: 61349
        }, {
          id: '3.96',
          parent: '2.8',
          name: 'Greenland',
          value: 56480
        }, {
          id: '3.97',
          parent: '2.8',
          name: 'Saint Pierre and Miquelon',
          value: 6320
        },

        {
          id: '2.7',
          parent: '1.2',
          name: 'Central America'
        },

        {
          id: '3.85',
          parent: '2.7',
          name: 'Mexico',
          value: 129163276
        }, {
          id: '3.86',
          parent: '2.7',
          name: 'Guatemala',
          value: 16913503
        }, {
          id: '3.87',
          parent: '2.7',
          name: 'Honduras',
          value: 9265067
        }, {
          id: '3.88',
          parent: '2.7',
          name: 'El Salvador',
          value: 6377853
        }, {
          id: '3.89',
          parent: '2.7',
          name: 'Nicaragua',
          value: 6217581
        }, {
          id: '3.90',
          parent: '2.7',
          name: 'Costa Rica',
          value: 4905769
        }, {
          id: '3.91',
          parent: '2.7',
          name: 'Panama',
          value: 4098587
        }, {
          id: '3.92',
          parent: '2.7',
          name: 'Belize',
          value: 374681
        },

        {
          id: '2.6',
          parent: '1.2',
          name: 'Caribbean'
        },

        {
          id: '3.59',
          parent: '2.6',
          name: 'Cuba',
          value: 11484636
        }, {
          id: '3.60',
          parent: '2.6',
          name: 'Haiti',
          value: 10981229
        }, {
          id: '3.61',
          parent: '2.6',
          name: 'Dominican Republic',
          value: 10766998
        }, {
          id: '3.62',
          parent: '2.6',
          name: 'Puerto Rico',
          value: 3663131
        }, {
          id: '3.63',
          parent: '2.6',
          name: 'Jamaica',
          value: 2890299
        }, {
          id: '3.64',
          parent: '2.6',
          name: 'Trinidad and Tobago',
          value: 1369125
        }, {
          id: '3.65',
          parent: '2.6',
          name: 'Guadeloupe',
          value: 449568
        }, {
          id: '3.66',
          parent: '2.6',
          name: 'Bahamas',
          value: 395361
        }, {
          id: '3.67',
          parent: '2.6',
          name: 'Martinique',
          value: 384896
        }, {
          id: '3.68',
          parent: '2.6',
          name: 'Barbados',
          value: 285719
        }, {
          id: '3.69',
          parent: '2.6',
          name: 'Saint Lucia',
          value: 178844
        }, {
          id: '3.70',
          parent: '2.6',
          name: 'Curaçao',
          value: 160539
        }, {
          id: '3.71',
          parent: '2.6',
          name: 'Saint Vincent and the Grenadines',
          value: 109897
        }, {
          id: '3.72',
          parent: '2.6',
          name: 'Grenada',
          value: 107825
        }, {
          id: '3.73',
          parent: '2.6',
          name: 'Aruba',
          value: 105264
        }, {
          id: '3.74',
          parent: '2.6',
          name: 'United States Virgin Islands',
          value: 104901
        }, {
          id: '3.75',
          parent: '2.6',
          name: 'Antigua and Barbuda',
          value: 102012
        }, {
          id: '3.76',
          parent: '2.6',
          name: 'Dominica',
          value: 73925
        }, {
          id: '3.77',
          parent: '2.6',
          name: 'Cayman Islands',
          value: 61559
        }, {
          id: '3.78',
          parent: '2.6',
          name: 'Saint Kitts and Nevis',
          value: 55345
        }, {
          id: '3.79',
          parent: '2.6',
          name: 'Sint Maarten',
          value: 40120
        }, {
          id: '3.80',
          parent: '2.6',
          name: 'Turks and Caicos Islands',
          value: 35446
        }, {
          id: '3.81',
          parent: '2.6',
          name: 'British Virgin Islands',
          value: 31196
        }, {
          id: '3.82',
          parent: '2.6',
          name: 'Caribbean Netherlands',
          value: 25398
        }, {
          id: '3.83',
          parent: '2.6',
          name: 'Anguilla',
          value: 14909
        }, {
          id: '3.84',
          parent: '2.6',
          name: 'Montserrat',
          value: 5177
        },
        /***********/

        /* Asia */
        {
          id: '2.13',
          parent: '1.3',
          name: 'Southern Asia'
        },

        {
          id: '3.136',
          parent: '2.13',
          name: 'India',
          value: 1339180127
        }, {
          id: '3.137',
          parent: '2.13',
          name: 'Pakistan',
          value: 197015955
        }, {
          id: '3.138',
          parent: '2.13',
          name: 'Bangladesh',
          value: 164669751
        }, {
          id: '3.139',
          parent: '2.13',
          name: 'Iran',
          value: 81162788
        }, {
          id: '3.140',
          parent: '2.13',
          name: 'Afghanistan',
          value: 35530081
        }, {
          id: '3.141',
          parent: '2.13',
          name: 'Nepal',
          value: 29304998
        }, {
          id: '3.142',
          parent: '2.13',
          name: 'Sri Lanka',
          value: 20876917
        }, {
          id: '3.143',
          parent: '2.13',
          name: 'Bhutan',
          value: 807610
        }, {
          id: '3.144',
          parent: '2.13',
          name: 'Maldives',
          value: 436330
        },

        {
          id: '2.11',
          parent: '1.3',
          name: 'Eastern Asia'
        },

        {
          id: '3.117',
          parent: '2.11',
          name: 'China',
          value: 1409517397
        }, {
          id: '3.118',
          parent: '2.11',
          name: 'Japan',
          value: 127484450
        }, {
          id: '3.119',
          parent: '2.11',
          name: 'South Korea',
          value: 50982212
        }, {
          id: '3.120',
          parent: '2.11',
          name: 'North Korea',
          value: 25490965
        }, {
          id: '3.121',
          parent: '2.11',
          name: 'Taiwan',
          value: 23626456
        }, {
          id: '3.122',
          parent: '2.11',
          name: 'Hong Kong',
          value: 7364883
        }, {
          id: '3.123',
          parent: '2.11',
          name: 'Mongolia',
          value: 3075647
        }, {
          id: '3.124',
          parent: '2.11',
          name: 'Macau',
          value: 622567
        },

        {
          id: '2.12',
          parent: '1.3',
          name: 'South-Eastern Asia'
        },

        {
          id: '3.125',
          parent: '2.12',
          name: 'Indonesia',
          value: 263991379
        }, {
          id: '3.126',
          parent: '2.12',
          name: 'Philippines',
          value: 104918090
        }, {
          id: '3.127',
          parent: '2.12',
          name: 'Vietnam',
          value: 95540800
        }, {
          id: '3.128',
          parent: '2.12',
          name: 'Thailand',
          value: 69037513
        }, {
          id: '3.129',
          parent: '2.12',
          name: 'Myanmar',
          value: 53370609
        }, {
          id: '3.130',
          parent: '2.12',
          name: 'Malaysia',
          value: 31624264
        }, {
          id: '3.131',
          parent: '2.12',
          name: 'Cambodia',
          value: 16005373
        }, {
          id: '3.132',
          parent: '2.12',
          name: 'Laos',
          value: 6858160
        }, {
          id: '3.133',
          parent: '2.12',
          name: 'Singapore',
          value: 5708844
        }, {
          id: '3.134',
          parent: '2.12',
          name: 'Timor-Leste',
          value: 1296311
        }, {
          id: '3.135',
          parent: '2.12',
          name: 'Brunei',
          value: 428697
          // 'color': ''
        },

        {
          id: '2.14',
          parent: '1.3',
          name: 'Western Asia'
        },

        {
          id: '3.145',
          parent: '2.14',
          name: 'Turkey',
          value: 80745020
        }, {
          id: '3.146',
          parent: '2.14',
          name: 'Iraq',
          value: 38274618
        }, {
          id: '3.147',
          parent: '2.14',
          name: 'Saudi Arabia',
          value: 32938213
        }, {
          id: '3.148',
          parent: '2.14',
          name: 'Yemen',
          value: 28250420
        }, {
          id: '3.149',
          parent: '2.14',
          name: 'Syria',
          value: 18269868
        }, {
          id: '3.150',
          parent: '2.14',
          name: 'Azerbaijan',
          value: 9827589
        }, {
          id: '3.151',
          parent: '2.14',
          name: 'Jordan',
          value: 9702353
        }, {
          id: '3.152',
          parent: '2.14',
          name: 'United Arab Emirates',
          value: 9400145
        }, {
          id: '3.153',
          parent: '2.14',
          name: 'Israel',
          value: 8321570
        }, {
          id: '3.154',
          parent: '2.14',
          name: 'Lebanon',
          value: 6082357
        }, {
          id: '3.155',
          parent: '2.14',
          name: 'Palestine',
          value: 4920724
        }, {
          id: '3.156',
          parent: '2.14',
          name: 'Oman',
          value: 4636262
        }, {
          id: '3.157',
          parent: '2.14',
          name: 'Kuwait',
          value: 4136528
        }, {
          id: '3.158',
          parent: '2.14',
          name: 'Georgia',
          value: 3912061
        }, {
          id: '3.159',
          parent: '2.14',
          name: 'Armenia',
          value: 2930450
        }, {
          id: '3.160',
          parent: '2.14',
          name: 'Qatar',
          value: 2639211
        }, {
          id: '3.161',
          parent: '2.14',
          name: 'Bahrain',
          value: 1492584
        },

        {
          id: '2.10',
          parent: '1.3',
          name: 'Central Asia'
        },

        {
          id: '3.112',
          parent: '2.10',
          name: 'Uzbekistan',
          value: 31910641
        }, {
          id: '3.113',
          parent: '2.10',
          name: 'Kazakhstan',
          value: 18204499
        }, {
          id: '3.114',
          parent: '2.10',
          name: 'Tajikistan',
          value: 8921343
        }, {
          id: '3.115',
          parent: '2.10',
          name: 'Kyrgyzstan',
          value: 6045117
        }, {
          id: '3.116',
          parent: '2.10',
          name: 'Turkmenistan',
          value: 5758075
        },
        /***********/

        /* Europe */
        {
          id: '2.15',
          parent: '1.4',
          name: 'Eastern Europe'
        },

        {
          id: '3.162',
          parent: '2.15',
          name: 'Russia',
          value: 143989754
        }, {
          id: '3.163',
          parent: '2.15',
          name: 'Ukraine',
          value: 44222947
        }, {
          id: '3.164',
          parent: '2.15',
          name: 'Poland',
          value: 38170712
        }, {
          id: '3.165',
          parent: '2.15',
          name: 'Romania',
          value: 19679306
        }, {
          id: '3.166',
          parent: '2.15',
          name: 'Czechia',
          value: 10618303
        }, {
          id: '3.167',
          parent: '2.15',
          name: 'Hungary',
          value: 9721559
        }, {
          id: '3.168',
          parent: '2.15',
          name: 'Belarus',
          value: 9468338
        }, {
          id: '3.169',
          parent: '2.15',
          name: 'Bulgaria',
          value: 7084571
        }, {
          id: '3.170',
          parent: '2.15',
          name: 'Slovakia',
          value: 5447662
        }, {
          id: '3.171',
          parent: '2.15',
          name: 'Moldova',
          value: 4051212
        }, {
          id: '3.172',
          parent: '2.15',
          name: 'Cyprus',
          value: 1179551
        },

        {
          id: '2.16',
          parent: '1.4',
          name: 'Northern Europe'
        },

        {
          id: '3.173',
          parent: '2.16',
          name: 'United Kingdom',
          value: 66181585
        }, {
          id: '3.174',
          parent: '2.16',
          name: 'Sweden',
          value: 9910701
        }, {
          id: '3.175',
          parent: '2.16',
          name: 'Denmark',
          value: 5733551
        }, {
          id: '3.176',
          parent: '2.16',
          name: 'Finland',
          value: 5523231
        }, {
          id: '3.177',
          parent: '2.16',
          name: 'Norway',
          value: 5305383
        }, {
          id: '3.178',
          parent: '2.16',
          name: 'Ireland',
          value: 4761657
        }, {
          id: '3.179',
          parent: '2.16',
          name: 'Lithuania',
          value: 2890297
        }, {
          id: '3.180',
          parent: '2.16',
          name: 'Latvia',
          value: 1949670
        }, {
          id: '3.181',
          parent: '2.16',
          name: 'Estonia',
          value: 1309632
        }, {
          id: '3.182',
          parent: '2.16',
          name: 'Iceland',
          value: 335025
        }, {
          id: '3.183',
          parent: '2.16',
          name: 'Guernsey and  Jersey',
          value: 165314
        }, {
          id: '3.184',
          parent: '2.16',
          name: 'Isle of Man',
          value: 84287
        }, {
          id: '3.185',
          parent: '2.16',
          name: 'Faroe Islands',
          value: 49290
        },

        {
          id: '2.17',
          parent: '1.4',
          name: 'Southern Europe'
        },

        {
          id: '3.186',
          parent: '2.17',
          name: 'Italy',
          value: 59359900
        }, {
          id: '3.187',
          parent: '2.17',
          name: 'Spain',
          value: 46354321
        }, {
          id: '3.188',
          parent: '2.17',
          name: 'Greece',
          value: 11159773
        }, {
          id: '3.189',
          parent: '2.17',
          name: 'Portugal',
          value: 10329506
        }, {
          id: '3.190',
          parent: '2.17',
          name: 'Serbia',
          value: 8790574
        }, {
          id: '3.191',
          parent: '2.17',
          name: 'Croatia',
          value: 4189353
        }, {
          id: '3.192',
          parent: '2.17',
          name: 'Bosnia and Herzegovina',
          value: 3507017
        }, {
          id: '3.193',
          parent: '2.17',
          name: 'Albania',
          value: 2930187
        }, {
          id: '3.194',
          parent: '2.17',
          name: 'Republic of Macedonia',
          value: 2083160
        }, {
          id: '3.195',
          parent: '2.17',
          name: 'Slovenia',
          value: 2079976
        }, {
          id: '3.196',
          parent: '2.17',
          name: 'Montenegro',
          value: 628960
        }, {
          id: '3.197',
          parent: '2.17',
          name: 'Malta',
          value: 430835
        }, {
          id: '3.198',
          parent: '2.17',
          name: 'Andorra',
          value: 76965
        }, {
          id: '3.199',
          parent: '2.17',
          name: 'Gibraltar',
          value: 34571
        }, {
          id: '3.200',
          parent: '2.17',
          name: 'San Marino',
          value: 33400
        }, {
          id: '3.201',
          parent: '2.17',
          name: 'Vatican City',
          value: 792
        },

        {
          id: '2.18',
          parent: '1.4',
          name: 'Western Europe'
        },

        {
          id: '3.202',
          parent: '2.18',
          name: 'Germany',
          value: 82114224
        }, {
          id: '3.203',
          parent: '2.18',
          name: 'France',
          value: 64979548
        }, {
          id: '3.204',
          parent: '2.18',
          name: 'Netherlands',
          value: 17035938
        }, {
          id: '3.205',
          parent: '2.18',
          name: 'Belgium',
          value: 11429336
        }, {
          id: '3.206',
          parent: '2.18',
          name: 'Austria',
          value: 8735453
        }, {
          id: '3.207',
          parent: '2.18',
          name: 'Switzerland',
          value: 8476005
        }, {
          id: '3.208',
          parent: '2.18',
          name: 'Luxembourg',
          value: 583455
        }, {
          id: '3.209',
          parent: '2.18',
          name: 'Monaco',
          value: 38695
        }, {
          id: '3.210',
          parent: '2.18',
          name: 'Liechtenstein',
          value: 37922
        },
        /***********/

        /* Oceania */
        {
          id: '2.19',
          parent: '1.5',
          name: 'Australia and New Zealand'
        },

        {
          id: '3.211',
          parent: '2.19',
          name: 'Australia',
          value: 24450561
        }, {
          id: '3.212',
          parent: '2.19',
          name: 'New Zealand',
          value: 4705818
        },

        {
          id: '2.20',
          parent: '1.5',
          name: 'Melanesia'
        },

        {
          id: '3.213',
          parent: '2.20',
          name: 'Papua New Guinea'
        }, {
          id: '3.214',
          parent: '2.20',
          name: 'Fiji',
          value: 905502
        }, {
          id: '3.215',
          parent: '2.20',
          name: 'Solomon Islands',
          value: 611343
        }, {
          id: '3.216',
          parent: '2.20',
          name: 'New Caledonia',
          value: 276255
        }, {
          id: '3.217',
          parent: '2.20',
          name: 'Vanuatu',
          value: 276244
        },

        {
          id: '2.21',
          parent: '1.5',
          name: 'Micronesia'
        },

        {
          id: '3.218',
          parent: '2.21',
          name: 'Guam',
          value: 164229
        }, {
          id: '3.219',
          parent: '2.21',
          name: 'Kiribati',
          value: 116398
        }, {
          id: '3.220',
          parent: '2.21',
          name: 'Federated States of Micronesia',
          value: 105544
        }, {
          id: '3.221',
          parent: '2.21',
          name: 'Northern Mariana Islands',
          value: 55144
        }, {
          id: '3.222',
          parent: '2.21',
          name: 'Marshall Islands',
          value: 53127
        }, {
          id: '3.223',
          parent: '2.21',
          name: 'Palau',
          value: 21729
        }, {
          id: '3.224',
          parent: '2.21',
          name: 'Nauru',
          value: 11359
        },

        {
          id: '2.22',
          parent: '1.5',
          name: 'Polynesia'
        },

        {
          id: '3.225',
          parent: '2.22',
          name: 'French Polynesia',
          value: 283007
        }, {
          id: '3.226',
          parent: '2.22',
          name: 'Samoa',
          value: 196440
        }, {
          id: '3.227',
          parent: '2.22',
          name: 'Tonga',
          value: 108020
        }, {
          id: '3.228',
          parent: '2.22',
          name: 'American Samoa',
          value: 55641
        }, {
          id: '3.229',
          parent: '2.22',
          name: 'Cook Islands',
          value: 17380
        }, {
          id: '3.230',
          parent: '2.22',
          name: 'Wallis and Futuna',
          value: 11773
        }, {
          id: '3.231',
          parent: '2.22',
          name: 'Tuvalu',
          value: 11192
        }, {
          id: '3.232',
          parent: '2.22',
          name: 'Niue',
          value: 1618
        }, {
          id: '3.233',
          parent: '2.22',
          name: 'Tokelau',
          value: 1300
    }];

    // Splice in transparent for the center circle

    if(Highcharts.getOptions().colors[0] != 'transparent'){
            Highcharts.getOptions().colors[0] = 'transparent';
    }

    

    exChart = Highcharts.chart('mini', {
      chart: {
        // height: '100%'
        type:'sunburst',
        style:bodyStyle,
        backgroundColor:'transparent'
      },

      title: {
        text: 'Sunburst Drilldown',
        align:'left',
       
        floating:true,
        style:titleStyle
      },
      subtitle: {
        text: 'World population 2017',
        align:'left',
        verticalAlign:'top',
           floating:true,
           y:40,
           style:subTitleStyle
      },
      rangeSelector:{
        enabled:false
    },

    stockTools: {
        gui: {
            enabled: false
        }
    },
    exporting:{
        enabled:false
    },
      
      series: [{
        type: "sunburst",
        data: data,
        allowDrillToNode: true,
       
        cursor: 'pointer',
        size:'90%',
        dataLabels: {
          format: '{point.name}',
          filter: {
            property: 'innerArcLength',
            operator: '>',
            value: 16
          },
          style:{
              color:'#fff',
              textOutline:"1px #666"
          },
          rotationMode: 'circular'
        },
        exporting:{
            enabled:false
        },
        traverseUpButton: {
           
            position: {
               align:'left',
                y:55,
                x:1
            },
            theme: {
                fill: 'white',
                'stroke-width': 1,
                stroke: 'silver',
                r: 0,
                states: {
                    hover: {
                        fill: '#a4edba'
                    },
                    select: {
                        stroke: '#039',
                        fill: '#a4edba'
                    }
                }
            }

        },
        levels: [{
          level: 1,
          levelIsConstant: false,
          dataLabels: {
            filter: {
              property: 'outerArcLength',
              operator: '>',
              value: 64
            }
          }
        }, {
          level: 2,
          colorByPoint: true
        },
        {
          level: 3,
          colorVariation: {
            key: 'brightness',
            to: -0.5
          }
        }, {
          level: 4,
          colorVariation: {
            key: 'brightness',
            to: 0.5
          }
        }]

      }],
      tooltip: {
        headerFormat: "",
        pointFormat: 'The population of <b>{point.name}</b> is <b>{point.value}</b>'
      },
      responsive:{
          rules:[{
              condition:{
                  maxWidth:500
              },
              chartOptions:{
                  plotOptions:{
                      sunburst:{
                          center:['50%','60%']
                      }
                  }
              }
          }]
      }
      
    });
}

function volumePrice(){
    Highcharts.getJSON('https://demo-live-data.highcharts.com/aapl-ohlcv.json', function (data) {

      // split the data set into ohlc and volume
      var ohlc = [],
        volume = [],
        dataLength = data.length,
        // set the allowed units for data grouping
        groupingUnits = [[
          'week',             // unit name
          [1]               // allowed multiples
        ], [
          'month',
          [1, 2, 3, 4, 6]
        ]],

        i = 0;

      for (i; i < dataLength; i += 1) {
        ohlc.push([
          data[i][0], // the date
          data[i][1], // open
          data[i][2], // high
          data[i][3], // low
          data[i][4] // close
        ]);

        volume.push([
          data[i][0], // the date
          data[i][5] // the volume
        ]);
      }


      // create the chart
      Highcharts.stockChart('mini', {

        rangeSelector: {
          selected: 2
        },
        chart:{
            style:bodyStyle
        },
        exporting:{
            enabled:false
        },

        title: {
          text: 'SMA and Volume by Price technical indicators',
          style:titleStyle,
           align:'left'
        },

        subtitle: {
          text: 'AAPL Historical',
          style:subTitleStyle,
          align:'left'
        },

        yAxis: [{
          startOnTick: false,
          endOnTick: false,
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: 'OHLC'
          },
          height: '60%',
          lineWidth: 2,
          resize: {
            enabled: true
          }
        }, {
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: 'Volume'
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2
        }],

        tooltip: {
          split: true
        },
        stockTools:{
            gui:{
                enabled:false
            }
        },

        plotOptions: {
          series: {
            dataGrouping: {
              units: groupingUnits
            }
          }
        },

        series: [{
          type: 'candlestick',
          name: 'AAPL',
          id: 'aapl',
          zIndex: 2,
          data: ohlc
        }, {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: volume,
          yAxis: 1
        }, {
          type: 'vbp',
          linkedTo: 'aapl',
          params: {
            volumeSeriesID: 'volume'
          },
          dataLabels: {
            enabled: false
          },
          zoneLines: {
            enabled: false
          }
        }, {
          type: 'sma',
          linkedTo: 'aapl',
          zIndex: 1,
          marker: {
            enabled: false
          }
        }]
      });
    });
}

function ohlc(){
    Highcharts.getJSON('https://demo-live-data.highcharts.com/aapl-ohlc.json', function (data) {

  // create the chart
      Highcharts.stockChart('mini', {

        chart:{
            style:bodyStyle
        },
        rangeSelector: {
          selected: 2
        },
        exporting:{
            enabled:false
        },

        title: {
          text: 'OHLC Series',
          style:titleStyle,
          align:'left'
        },
         subtitle: {
          text: 'AAPL Stock Price',
          style:subTitleStyle,
          align:'left'
        },
        stockTools:{
            gui:{
                enabled:false
            }
        },

        series: [{
          type: 'ohlc',
          name: 'AAPL Stock Price',
          data: data,
          dataGrouping: {
            units: [[
              'week', // unit name
              [1] // allowed multiples
            ], [
              'month',
              [1, 2, 3, 4, 6]
            ]]
          }
        }]
      });
    });
}

function interactiveGantt(){
    /*
      Simple demo showing some interactivity options of Highcharts Gantt. More
      custom behavior can be added using event handlers and API calls. See
      http://api.highcharts.com/gantt.
    */

    var today = new Date(),
      day = 1000 * 60 * 60 * 24,
      each = Highcharts.each,
      reduce = Highcharts.reduce,
      btnShowDialog = document.getElementById('btnShowDialog'),
      btnRemoveTask = document.getElementById('btnRemoveSelected'),
      btnAddTask = document.getElementById('btnAddTask'),
      btnCancelAddTask = document.getElementById('btnCancelAddTask'),
      addTaskDialog = document.getElementById('addTaskDialog'),
      inputName = document.getElementById('inputName'),
      selectDepartment = document.getElementById('selectDepartment'),
      selectDependency = document.getElementById('selectDependency'),
      chkMilestone = document.getElementById('chkMilestone'),
      isAddingTask = false;

    // Set to 00:00:00:000 today
    today.setUTCHours(0);
    today.setUTCMinutes(0);
    today.setUTCSeconds(0);
    today.setUTCMilliseconds(0);
    today = today.getTime();


    // Update disabled status of the remove button, depending on whether or not we
    // have any selected points.
    function updateRemoveButtonStatus() {
      var chart = this.series.chart;
      // Run in a timeout to allow the select to update
      setTimeout(function () {
        btnRemoveTask.disabled = !chart.getSelectedPoints().length ||
          isAddingTask;
      }, 10);
    }


    // Create the chart
    var chart = Highcharts.ganttChart('mini', {

      chart: {
        spacingLeft: 1,
        style:bodyStyle,
        height:400,
        marginBottom:70
      },

      title: {
        text: 'Interactive Gantt Chart',
        style:titleStyle,
        align:'left'
      },

      subtitle: {
        text: 'Drag and drop points to edit',
        style:subTitleStyle,
         align:'center'
      },
      stockTools:{
          gui:{
              enabled:false
          }
      },
      exporting:{
          enabled:false
      },

      plotOptions: {
        series: {
          animation: false, // Do not animate dependency connectors
          dragDrop: {
            draggableX: true,
            draggableY: true,
            dragMinY: 0,
            dragMaxY: 2,
            dragPrecisionX: day / 3 // Snap to eight hours
          },
          dataLabels: {
            enabled: true,
            format: '{point.name}',
            style: {
              cursor: 'default',
              pointerEvents: 'none',
              fontFamily:'Arial'
            }
          },
          allowPointSelect: true,
          point: {
            events: {
              select: updateRemoveButtonStatus,
              unselect: updateRemoveButtonStatus,
              remove: updateRemoveButtonStatus
            }
          }
        }
      },

      yAxis: {
        type: 'category',
        categories: ['Tech', 'Marketing', 'Sales'],
        min: 0,
        max: 2
      },

      xAxis: {
        currentDateIndicator: true
      },

      tooltip: {
        xDateFormat: '%a %b %d, %H:%M'
      },

      series: [{
        name: 'Project 1',
        data: [{
          start: today + 2 * day,
          end: today + day * 5,
          name: 'Prototype',
          id: 'prototype',
          y: 0
        },  {
          start: today + day * 6,
          name: 'Prototype done',
          milestone: true,
          dependency: 'prototype',
          id: 'proto_done',
          y: 0
        }, {
          start: today + day * 7,
          end: today + day * 11,
          name: 'Testing',
          dependency: 'proto_done',
          y: 0
        }, {
          start: today + day * 5,
          end: today + day * 8,
          name: 'Product pages',
          y: 1
        }, {
          start: today + day * 9,
          end: today + day * 10,
          name: 'Newsletter',
          y: 1
        }, {
          start: today + day * 9,
          end: today + day * 11,
          name: 'Licensing',
          id: 'testing',
          y: 2
        }, {
          start: today + day * 11.5,
          end: today + day * 12.5,
          name: 'Publish',
          dependency: 'testing',
          y: 2
        }]
      }],
      responsive:{
              rules:[{
                  condition:{
                      maxWidth:600
                  },
                  chartOptions:{
                     chart:{
                         height:380
                     },
                     credits:{
                         enabled:false
                     },
                     subtitle: {
                        style:{
                            fontSize:'14px'
                        },
                        align:'left'
                      },
                  }
              },{
                  condition:{
                      minWidth:610
                  },
                  chartOptions:{
                      subtitle:{
                          style:subTitleStyle
                      }
                  }
              }
              ]
          }
    });


    /* Add button handlers for add/remove tasks */

    btnRemoveTask.onclick = function () {
      var points = chart.getSelectedPoints();
      each(points, function (point) {
        point.remove();
      });
    };

    btnShowDialog.onclick = function () {
      // Update dependency list
      var depInnerHTML = '<option value=""></option>';
      each(chart.series[0].points, function (point) {
        depInnerHTML += '<option value="' + point.id + '">' + point.name +
          ' </option>';
      });
      selectDependency.innerHTML = depInnerHTML;

      // Show dialog by removing "hidden" class
      addTaskDialog.className = 'overlay';
      isAddingTask = true;

      // Focus name field
      inputName.value = '';
      inputName.focus();
    };

    btnAddTask.onclick = function () {
      // Get values from dialog
      var series = chart.series[0],
        name = inputName.value,
        undef,
        dependency = chart.get(
          selectDependency.options[selectDependency.selectedIndex].value
        ),
        y = parseInt(
          selectDepartment.options[selectDepartment.selectedIndex].value,
          10
        ),
        maxEnd = reduce(series.points, function (acc, point) {
          return point.y === y && point.end ? Math.max(acc, point.end) : acc;
        }, 0),
        milestone = chkMilestone.checked || undef;

      // Empty category
      if (maxEnd === 0) {
        maxEnd = today;
      }

      // Add the point
      series.addPoint({
        start: maxEnd + (milestone ? day : 0),
        end: milestone ? undef : maxEnd + day,
        y: y,
        name: name,
        dependency: dependency ? dependency.id : undef,
        milestone: milestone
      });

      // Hide dialog
      addTaskDialog.className += ' hidden';
      isAddingTask = false;
    };

    btnCancelAddTask.onclick = function () {
      // Hide dialog
      addTaskDialog.className += ' hidden';
      isAddingTask = false;
    };
}

function wordCloud(){
    var text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean bibendum erat ac justo sollicitudin, quis lacinia ligula fringilla. Pellentesque hendrerit, nisi vitae posuere condimentum, lectus urna accumsan libero, rutrum commodo mi lacus pretium erat. Phasellus pretium ultrices mi sed semper. Praesent ut tristique magna. Donec nisl tellus, sagittis ut tempus sit amet, consectetur eget erat. Sed ornare gravida lacinia. Curabitur iaculis metus purus, eget pretium est laoreet ut. Quisque tristique augue ac eros malesuada, vitae facilisis mauris sollicitudin. Mauris ac molestie nulla, vitae facilisis quam. Curabitur placerat ornare sem, in mattis purus posuere eget. Praesent non condimentum odio. Nunc aliquet, odio nec auctor congue, sapien justo dictum massa, nec fermentum massa sapien non tellus. Praesent luctus eros et nunc pretium hendrerit. In consequat et eros nec interdum. Ut neque dui, maximus id elit ac, consequat pretium tellus. Nullam vel accumsan lorem.';

        var lines = text.split(/[,\. ]+/g),
          data = Highcharts.reduce(lines, function (arr, word) {
            var obj = Highcharts.find(arr, function (obj) {
              return obj.name === word;
            });
            if (obj) {
              obj.weight += 1;
            } else {
              obj = {
                name: word,
                weight: 1
              };
              arr.push(obj);
            }
            return arr;
          }, []);

    Highcharts.chart('mini', {
      accessibility: {
        screenReaderSection: {
          beforeChartFormat: '<h5>{chartTitle}</h5>' +
            '<div>{chartSubtitle}</div>' +
            '<div>{chartLongdesc}</div>' +
            '<div>{viewTableButton}</div>'
        }
      },
      stockTools:{
          gui:{
              enabled:false
          }
      },
      exporting:{
          enabled:false
      },
      chart:{
          style:bodyStyle
      },
      series: [{
        type: 'wordcloud',
        data: data,
        name: 'Occurrences'
      }],
      title: {
        text: 'Wordcloud of Lorem Ipsum',
        style:titleStyle,
        align:'left'
      }
    });
}

function linearRegression(){
    let discipline = [
      {
        name: "Rugby sevens",
        data: "rugby sevens"
      }
    ];

    Highcharts.getJSON(
      "https://raw.githubusercontent.com/mekhatria/demo_highcharts/master/olympic2012.json?callback=?",
      function (data) {
        
        function regression(arrWeight, arrHeight) {
          let r, sy, sx, b, a, meanX, meanY;
          r = jStat.corrcoeff(arrHeight, arrWeight);
          sy = jStat.stdev(arrWeight);
          sx = jStat.stdev(arrHeight);
          meanY = jStat(arrWeight).mean();
          meanX = jStat(arrHeight).mean();
          b = r * (sy / sx);
          a = meanY - meanX * b;
          //Set up a line
          let y1, y2, x1, x2;
          x1 = jStat.min(arrHeight);
          x2 = jStat.max(arrHeight);
          y1 = a + b * x1;
          y2 = a + b * x2;
          return {
            line: [
              [x1, y1],
              [x2, y2]
            ],
            r
          };
        }
        
        const getData = (continentName) => {
          let temp = [],
            tempWeight = [],
            tempHeight = [];
          data.forEach((elm) => {
            if (
              elm.continent == continentName &&
              elm.weight > 0 &&
              elm.height > 0
            ) {
              temp.push([elm.height, elm.weight]);
              tempWeight.push(elm.weight);
              tempHeight.push(elm.height);
            }
          });
          let { line, r } = regression(tempWeight, tempHeight);
          return [temp, line, r];
        };

        const getDataSport = (sportName) => {
          let temp = [],
            tempWeight = [],
            tempHeight = [];

          data.forEach((elm) => {
            if (elm.sport == sportName && elm.weight > 0 && elm.height > 0) {
              temp.push([elm.height, elm.weight]);
              tempWeight.push(elm.weight);
              tempHeight.push(elm.height);
            }
          });
          let { line, r } = regression(tempWeight, tempHeight);
          return [temp, line, r];
        };
        
        let series = [],
          visible = false,
          index = 0,
          activate = ["Rugby sevens"];
        discipline.forEach((e) => {
          if (activate.indexOf(e.name) > -1) {
            visible = true;
          } else {
            visible = false;
          }
          let [scatterData, line, r] = getDataSport(e.data);
          series.push(
            {
              type: "scatter",
              visible: visible,
              name:"Height/weight",
              data: scatterData
            },
            {
              name: e.name,
              visible: visible,
              name:"Linear regression",
              r: r,
              data: line,
              color:"#ec7c7d"
            }
          );
        });

        Highcharts.chart("mini", {
          
          chart: {
            type: "line",
            zoomType: "y",
            style:bodyStyle,
            marginTop:60,
          },

          title: {
            text: "Linear Regression & Scatter Chart",
            style:titleStyle,
            align:'left',
            width:300
          },
          subtitle:{
              text:"2012 Olympic rugby sevens athletes' weight and height relationship",
              align:'left',
              y:35
          },
          exporting:{
              enabled:false
          },
          stockTools:{
              gui:{
                  enabled:false
              }
          },
          
          xAxis: {
            title: {
              text: "Height"
            },
            labels: {
              format: "{value} m"
            },
            min: 1.5
          },
          
          yAxis: {
            title: {
              text: "Weight"
            },
            labels: {
              format: "{value} kg"
            }
          },
          
          legend: {
            enabled: true
          },
          
          plotOptions: {
            scatter: {
              marker: {
                radius: 2.5,
                symbol: "circle",
                states: {
                  hover: {
                    enabled: true,
                    lineColor: "rgb(100,100,100)"
                  }
                }
              },
              states: {
                hover: {
                  marker: {
                    enabled: false
                  }
                }
              }
            },
            line: {
              lineWidth: 2.5
            }
          },

          tooltip: {
            formatter: function () {
              if (this.series.data.length > 2) {
                return (
                  this.series.name +
                  "<br/>Height: " +
                  this.x +
                  " m<br/>Weight: " +
                  this.y +
                  " kg"
                );
              } else {
                return (
                  this.series.name +
                  "<br/>r: " +
                  this.series.userOptions.r.toFixed(2)
                );
              }
            }
          },
          
          series: series,
          responsive:{
              rules:[{
                  condition:{
                      maxWidth:600
                  },
                  chartOptions:{
                      title:{
                          text:"Linear Regression"
                      },
                      subtitle:{
                          width:300,
                          style:subTitleStyle
                        
                      },
                      chart:{
                          marginTop:100,
                          marginBottom:20
                      },
                      legend:{
                          layout:'vertical',
                          floating:true,
                          align:'right',
                          verticalAlign:'bottom',
                          y:-10
                      }
                      
                  }
              },{
                  condition:{
                      minWidth:610
                  },
                  chartOptions:{
                      subtitle:{
                          style:subTitleStyle
                      }
                  }
              }
              ]
          }
        });
      }
    );
}

function richClick(){

   // $('#mini').css({width:'40%'})
    Highcharts.ajax({
          url: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population-history.csv',
          dataType: 'csv',
          success: function (csv) {

            // Parse the CSV Data
            /*Highcharts.data({
              csv: data,
              switchRowsAndColumns: true,
              parsed: function () {
                console.log(this.columns);
              }
            });*/

            // Very simple and case-specific CSV string splitting
            function CSVtoArray(text) {
              return text.replace(/^"/, '')
                .replace(/",$/, '')
                .split('","');
            }

            csv = csv.split(/\n/);

            var countries = {},
              mapChart,
              countryChart,
              numRegex = /^[0-9\.]+$/,
              lastCommaRegex = /,\s$/,
              quoteRegex = /\"/g,
              categories = CSVtoArray(csv[2]).slice(4);

            // Parse the CSV into arrays, one array each country
            csv.slice(3).forEach(function (line) {
              var row = CSVtoArray(line),
                data = row.slice(4);

              data.forEach(function (val, i) {
                val = val.replace(quoteRegex, '');
                if (numRegex.test(val)) {
                  val = parseInt(val, 10);
                } else if (!val || lastCommaRegex.test(val)) {
                  val = null;
                }
                data[i] = val;
              });

              countries[row[1]] = {
                name: row[0],
                code3: row[1],
                data: data
              };
            });

            // For each country, use the latest value for current population
            var data = [];
            for (var code3 in countries) {
              if (Object.hasOwnProperty.call(countries, code3)) {
                var value = null,
                  year,
                  itemData = countries[code3].data,
                  i = itemData.length;

                while (i--) {
                  if (typeof itemData[i] === 'number') {
                    value = itemData[i];
                    year = categories[i];
                    break;
                  }
                }
                data.push({
                  name: countries[code3].name,
                  code3: code3,
                  value: value,
                  year: year
                });
              }
            }

            // Add lower case codes to the data set for inclusion in the tooltip.pointFormat
            var mapData = Highcharts.geojson(Highcharts.maps['custom/world']);
            mapData.forEach(function (country) {
              country.id = country.properties['hc-key']; // for Chart.get()
              country.flag = country.id.replace('UK', 'GB').toLowerCase();
            });

            // Wrap point.select to get to the total selected points
            Highcharts.wrap(Highcharts.Point.prototype, 'select', function (proceed) {

              proceed.apply(this, Array.prototype.slice.call(arguments, 1));

              var points = mapChart.getSelectedPoints();
              if (points.length) {
                if (points.length === 1) {
                  document.querySelector('#publishing2Controls #flag')
                    .className = 'flag ' + points[0].flag;
                  document.querySelector('#publishing2Controls h2').innerHTML = points[0].name;
                  $('#publishing2Controls h2').css({marginLeft:'0px'});
                } else {
                  document.querySelector('#publishing2Controls #flag')
                    .className = 'flag';
                  document.querySelector('#publishing2Controls h2').innerHTML = 'Comparing countries';
                  $('#publishing2Controls h2').css({marginLeft:'-40px'});

                }
                document.querySelector('#publishing2Controls .subheader')
                  .innerHTML = '<small><em>Shift + Click on map to compare countries</em></small><h4>Historical population of</h4>';

                if (!countryChart) {
                  countryChart = Highcharts.chart('country-chart', {
                    chart: {
                     backgroundColor:'transparent',
                     
                    },
                    stockTools:{
                        gui:{
                            enabled:false
                        }
                    },
                    credits: {
                      enabled: false
                    },
                    title: {
                      text: null
                    },
                    subtitle: {
                      text: null
                    },
                    exporting:{
                            enabled:false
                        },
                    xAxis: {
                      tickPixelInterval: 50,
                      crosshair: true
                    },
                    yAxis: {
                      title: null,
                      opposite: true
                    },
                    tooltip: {
                      split: true
                    },
                    legend:{
                        verticalAlign:'bottom',
                        align:'center',
                        floating:false,
                    },
                   
                    plotOptions: {
                      series: {
                        animation: {
                          duration: 500
                        },
                        marker: {
                          enabled: false
                        },
                        label:{
                            enabled:false,
                            style:{
                                color:'#fff',
                                fontSize:'18px'
                            }
                        },
                        threshold: 0,
                        pointStart: parseInt(categories[0], 10)
                      }
                    },
                    responsive:{
                          rules:[
                             {
                                  condition:{
                                    
                                     maxHeight:90,
                                     maxWidth:270,
                                  },
                                  chartOptions:{
                                     
                                      legend:{
                                         layout:'vertical',
                                         verticalAlign:'top',
                                         width:100,
                                        align:'right',
                                         
                                         floating:false,
                                         x:0,
                                         itemStyle:{
                                                  fontSize:'10px'
                                              }
                                      },
                                      yAxis:{
                                          labels:{
                                              style:{
                                                  fontSize:'8px'
                                              }
                                          }
                                      },
                                      xAxis:{
                                          labels:{
                                              style:{
                                                  fontSize:'8px'
                                              }
                                          }
                                      }
                                  }
                             },
                              
                             {
                                  condition:{
                                     minHeight:100,
                                     maxWidth:200
                                  },
                                 chartOptions:{
                                      
                                      legend:{
                                         layout:'horizontal',
                                         width:null,
                                         align:'center',
                                         verticalAlign:'bottom',
                                         floating:false,
                                         x:0,
                                         itemStyle:{
                                                  fontSize:'10px'
                                              }
                                      },
                                      yAxis:{
                                          labels:{
                                              style:{
                                                  fontSize:'8px'
                                              }
                                          }
                                      },
                                      xAxis:{
                                          labels:{
                                              style:{
                                                  fontSize:'8px'
                                              }
                                          }
                                      }
                                  }
                              },
                              {
                                  condition:{
                                       minHeight:100,
                                     minWidth:201,
                                     maxWidth:510
                                  },
                                 chartOptions:{
                                      chart:{
                                          spacingRight:200,
                                      },
                                      legend:{
                                         layout:'vertical',
                                         width:200,
                                         align:'right',
                                          floating:true,
                                          x:220,
                                         itemStyle:{
                                                  fontSize:'10px'
                                              }
                                      },
                                      yAxis:{
                                          labels:{
                                              style:{
                                                  fontSize:'8px'
                                              }
                                          }
                                      },
                                      xAxis:{
                                          labels:{
                                              style:{
                                                  fontSize:'8px'
                                              }
                                          }
                                      }
                                  }
                              },
                              

                          ]
                    }
            
                  });
                }

                countryChart.series.slice(0).forEach(function (s) {
                  s.remove(false);
                });
                points.forEach(function (p) {
                  countryChart.addSeries({
                    name: p.name,
                    data: countries[p.code3].data,
                   
                    type: points.length > 1 ? 'line' : 'area'
                  }, false);

                });
                countryChart.redraw();

              } else {
                document.querySelector('#publishing2Controls #flag').className = '';
                document.querySelector('#publishing2Controls h2').innerHTML = '';
                document.querySelector('#publishing2Controls .subheader').innerHTML = '';
                if (countryChart) {
                  countryChart = countryChart.destroy();
                }
              }
            });

            // Initiate the map chart
            mapChart = Highcharts.mapChart('mini', {
                chart:{
                    borderWidth:0,
                    marginRight:300
                   
                },
                exporting:{
                    enabled:false
                },

              title: {
                text: 'Rich Information On Click',
                style:titleStyle,
                align:'left'
              },

              subtitle: {
                // text: 'Population history by country',
                style:subTitleStyle
              },
               stockTools:{
                        gui:{
                            enabled:false
                        }
                    },

              mapNavigation: {
                enabled: true,
                buttonOptions: {
                  verticalAlign: 'top'
                }
              },

              colorAxis: {
                type: 'logarithmic',
                endOnTick: false,
                startOnTick: false,
                min: 50000,
                maxColor:'#49acff',
                visible:true,

              },
              legend:{
                  align:'center'
              },

              tooltip: {
                footerFormat: '<span style="font-size: 10px">(Click for details)</span>'
              },

              series: [{
                data: data,
                mapData: mapData,
                joinBy: ['iso-a3', 'code3'],
                name: 'Current population',
                allowPointSelect: true,
                cursor: 'pointer',
                states: {
                  select: {
                    color: Highcharts.color(Highcharts.getOptions().colors[1]).setOpacity(.5).get('rgba'),
                    borderColor: '#fff',
                    dashStyle: 'shortdot'
                  },
                  hover:{
                      color:Highcharts.color(Highcharts.getOptions().colors[1]).setOpacity(.5).get('rgba'),
                  }
                },
                borderWidth: 0.5
              }],
              responsive:{
                  rules:[

                  {
                          condition:{
                              maxWidth:300
                          },
                          chartOptions:{
                              
                              chart:{
                                  marginRight:20,
                                  marginBottom:190
                              },
                              
                              legend:{
                                   floating:true,
                                   verticalAlign:'top',
                                   align:'center',
                                   y:170
                              },
                              colorAxis:{
                                  labels:{
                                      style:{
                                          fontSize:'8px'
                                      }
                                  }

                              }
                             
                              
                          }
                      },
                      {
                          condition:{
                              minWidth:301,
                              maxWidth:610
                          },
                          chartOptions:{
                              chart:{
                                  marginRight:20,
                                  marginBottom:180
                              },
                              
                              legend:{
                                  align:'right',
                                  floating:false,
                                
                                  verticalAlign:'bottom',
                                  y:-110
                                  
                              },
                             
                              
                          }
                      },
                   
                  ]
              }
            });

            // Pre-select a country
            mapChart.get('us').select();
          }
        });
}

function accessiblePie(){

    function getColorPattern(i) {
          var colors = Highcharts.getOptions().colors,
            patternColors = [colors[2], colors[0], colors[5], colors[1], colors[4]],
            patterns = [
              'M 0 0 L 5 5 M 4.5 -0.5 L 5.5 0.5 M -0.5 4.5 L 0.5 5.5',
              'M 0 5 L 5 0 M -0.5 0.5 L 0.5 -0.5 M 4.5 5.5 L 5.5 4.5',
              'M 1.5 0 L 1.5 5 M 4 0 L 4 5',
              'M 0 1.5 L 5 1.5 M 0 4 L 5 4',
              'M 0 1.5 L 2.5 1.5 L 2.5 0 M 2.5 5 L 2.5 3.5 L 5 3.5'
            ];

          return {
            pattern: {
              path: patterns[i],
              color: patternColors[i],
              width: 5,
              height: 5
            }
          };
        }

        Highcharts.chart('mini', {
          chart: {
            type: 'pie',
             style:bodyStyle
          },
          stockTools:{
              gui:{
                  enabled:false
              }
          },
          exporting:{
              enabled:false
          },

          title: {
            text: 'Accessible Pie Chart',
            style:titleStyle,
            align:'left',
          },

          subtitle: {
            useHTML:true,
            text: '<div>Primary desktop/laptop screen readers</div>',
            style:subTitleStyle,
            align:'left',
           
            
          },

          tooltip: {
            valueSuffix: '%',
            borderColor: '#8ae'
          },

          plotOptions: {
            series: {
              dataLabels: {
                enabled: true,
                useHTML:true,
                connectorColor: '#777',
                connectorShape:'straight',
                format: '<b style="font-weight:500"> {point.name}</b>: {point.percentage:.1f} %',
                style:{
                    fontWeight:'normal',
                    fontSize:'14px'
                }
              },
              point: {
                events: {
                  click: function () {
                    window.location.href = this.website;
                  }
                }
              },
              cursor: 'pointer',
              borderWidth: 3,
              size:'100%'
            }
          },

          series: [{
            name: 'Screen reader usage',
            data: [{
              name: 'NVDA',
              y: 40.6,
              color: getColorPattern(0),
              website: 'https://www.nvaccess.org',
              accessibility: {
                description: 'This is the most used desktop screen reader'
              }
            }, {
              name: 'JAWS',
              y: 40.1,
              color: getColorPattern(1),
              website: 'https://www.freedomscientific.com/Products/Blindness/JAWS'
            }, {
              name: 'VoiceOver',
              y: 12.9,
              color: getColorPattern(2),
              website: 'http://www.apple.com/accessibility/osx/voiceover'
            }, {
              name: 'ZoomText',
              y: 2,
              color: getColorPattern(3),
              website: 'http://www.zoomtext.com/products/zoomtext-magnifierreader'
            }, {
              name: 'Other',
              y: 4.4,
              color: getColorPattern(4),
              website: 'http://www.disabled-world.com/assistivedevices/computer/screen-readers.php'
            }]
          }],

          responsive: {
            rules: [{
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                chart:{
                    marginTop:90
                },
                plotOptions: {
                  series: {
                    dataLabels: {
                      format: '<b>{point.name}</b>'
                    }
                  }
                },
                
              }
            }]
          }
        });
}

function heatMap(){
    Highcharts.chart('mini', {
          data: {
            csv: document.getElementById('csv').innerHTML
          },

          chart: {
            type: 'heatmap',
            style:bodyStyle
          },
          stockTools:{
              gui:{
                  enabled:false
              }
          },
          exporting:{
              enabled:false
          },

          boost: {
            useGPUTranslations: true
          },

          title: {
            text: 'Highcharts heat map',
            align: 'left',
            x: 0,
            style:titleStyle
          },

          subtitle: {
            text: 'Temperature variation by day and hour through 2017',
            align: 'left',
            x: 0,
             style:subTitleStyle
          },

          xAxis: {
            type: 'datetime',
            min: Date.UTC(2017, 0, 1),
            max: Date.UTC(2017, 11, 31, 23, 59, 59),
            labels: {
              align: 'left',
              x: 5,
              y: 14,
              format: '{value:%B}' // long month
            },
            showLastLabel: false,
            tickLength: 16
          },

          yAxis: {
            title: {
              text: null
            },
            labels: {
              format: '{value}:00'
            },
            minPadding: 0,
            maxPadding: 0,
            startOnTick: false,
            endOnTick: false,
            tickPositions: [0, 6, 12, 18, 24],
            tickWidth: 1,
            min: 0,
            max: 23,
            reversed: true
          },

          colorAxis: {
            stops: [
              [0, '#3060cf'],
              [0.5, '#fffbbc'],
              [0.9, '#c4463a'],
              [1, '#c4463a']
            ],
            min: -15,
            max: 25,
            startOnTick: false,
            endOnTick: false,
            labels: {
              format: '{value}℃'
            }
          },

          series: [{
            boostThreshold: 100,
            borderWidth: 0,
            nullColor: '#EFEFEF',
            colsize: 24 * 36e5, // one day
            tooltip: {
              headerFormat: 'Temperature<br/>',
              pointFormat: '{point.x:%e %b, %Y} {point.y}:00: <b>{point.value} ℃</b>'
            },
            turboThreshold: Number.MAX_VALUE // #3404, remove after 4.0.5 release
          }]
    });
}

//data for each of the verticals in the carousel
const functions = ['developers','finance','publishing','science'];
const clickVerticals = [
    {
        vertical:'developers0',
        chartNum:0,
        title:'Update Options',
        subtitle:null,
        text:'Chart with buttons to modify options, showing how options can be changed on the fly. This flexibility allows for more dynamic charts.',
        callFunction:null,
        chart:chartUpdate,
        controls:true
    },
    {
        vertical:'developers1',
        chartNum:1,
        title:'Multiple Axes',
        subtitle:null,
        text:'Chart showing use of multiple y-axes, where each series has a separate axis. Multiple axes allows data in different ranges to be visualized together. ',
        callFunction:null,
        chart:multipleAxes,
        controls:false
    },
   
    {
        vertical:'developers2',
        chartNum:2,
        title:'Synchronized Charts',
        subtitle:null,
        text:'This demo shows how related charts can be synchronized. Hover over one chart to see the effect in the other charts as well. ',
        callFunction:'synchronized',
        chart:synchronized,
        controls:false,
    },
    {
        vertical:'developers3',
        chartNum:3,
        title:'Suburst Drilldown',
        subtitle:null,
        text:'Sunburst charts are used to visualize hierarchical data in a circular shape. Click on a parent node to drill down and inspect the tree in more detail.',
        callFunction:'drillDown',
        chart:drillDown,
        controls:false,
    },
    {
        vertical:'science0',
        chartNum:3,
        title:'Linear Regression',
        text:'Linear regression helps us to make predictions and find a causal effect relation by exploring the relationship (correlation) between continuous dependent variables and continuous or discrete independent variables.',
        chart:linearRegression,
        callFunction:'linearRegression',
        controls:false,
    },
     {   vertical:'science1',
         title:'Interactive Gantt',
        subtitle:null,
        text:'',
        chartNum:11,
        chart:interactiveGantt,
        callFunction:'interactiveGantt',
        controls:true,
    },
    {
        vertical:'science2',
        chartNum:5,
        title:'Accessible Pie Chart',
        text:'Pie chart demonstrating some accessibility features of Highcharts. The chart shows which screen reader is used as the primary screen reader by the respondents, with NVDA currently being the most popular one. The JAWS screen reader is following closely behind.',
        chart:accessiblePie,
        callFunction:'accessiblePie',
        controls:false,
    },
    {
        vertical:'science3',
        title:'Large Heat Map',
        text:' Heatmap with over 8,500 points, visualizing hourly temperature in 2017. This chart uses the Highcharts Boost module for enhanced performance.',
        chartNum:6,
        chart:heatMap,
        callFunction:'heatMap',
        controls:false,
    },

    {
        vertical:'finance0',
        chartNum:5,
        title:'Stock GUI',
        subtitle:null,
        text:'Create stock or general timeline charts for your web and mobile apps. Features sophisticated navigation for high-volume data, user annotations and over 40 built-in Technical Indicators.',
        callFunction:'gui',
        chart:gui,
        controls:false,
    },
    {
        vertical:'finance1',
        title:'Flags',
        subtitle:null,
        text:'',
        chartNum:6,
        callFunction:'flags',
        chart:flags,
        controls:false,
    },
    {
        vertical:'finance2',
        title:'Volume by Price',
        subtitle:null,
        text:'',
        chartNum:7,
        callFunction:'volumePrice',
        chart:volumePrice,
        controls:false,
    },
    {
        vertical:'finance3',
        title:'OHLC',
        subtitle:null,
        text:'',
        chartNum:8,
        callFunction:'ohlc',
        chart:ohlc,
        controls:false,
    },
    {   vertical:'publishing0',
         title:'Honeycomb Tile Map',
        subtitle:null,
        text:'',
        chartNum:9,
        chart:honeyComb,
        callFunction:null,
        controls:false,
        renderTo:'developersCharts4'
    },
    {   vertical:'publishing1',
         title:'Flight Routes',
        subtitle:null,
        text:'',
        chartNum:10,
        chart:flightRoutes,
        callFunction:'flightRoutes',
        controls:false,
    },
     {   vertical:'publishing2',
         title:'Rich Information On Click',
        subtitle:null,
        text:'',
        chartNum:10,
        chart:richClick,
        callFunction:'richClick',
        controls:true,
    },
    
    {   vertical:'publishing3',
         title:'Word Cloud',
        subtitle:null,
        text:'',
        chartNum:12,
        chart:wordCloud,
        callFunction:'wordCloud',
        controls:true,
    }
];

   
$(document).ready(function() {

    demoChart = Highcharts.stockChart('developersCharts3',heroChart);

    //controls for the first chart

    document.getElementById('bend1').addEventListener('input',function(){
       
        let bender = this;
        exChart.series[0].update({
                startAngle:parseInt(bender.value),
        });
        benderSettings.startAngle = parseInt(bender.value);
        $('#value1').html(parseInt(bender.value));
    },true);

    document.getElementById('bend2').addEventListener('input',function(){
        
        let bender = this;
        exChart.series[0].update({
                endAngle:parseInt(bender.value),
               
        });
        benderSettings.endAngle = parseInt(bender.value)
        $('#value2').html(parseInt(bender.value));
    },true);

    document.getElementById('bend3').addEventListener('input',function(){
        let bender = this;
         exChart.graphLayoutsStorage = {};
         exChart.graphLayoutsLookup = [];

        exChart.series[0].update({
                 innerSize:parseInt(bender.value) + "%",
        });

        benderSettings.innerSize = parseInt(bender.value)+ "%";

        $('#value3').html(parseInt(bender.value));
    },true);

    document.getElementById('bend4').addEventListener('input',function(){
        let bender = this;
        exChart.graphLayoutsStorage = {};
        exChart.graphLayoutsLookup = [];

         exChart.series[0].update({
           
                size:parseInt(bender.value) + "%",

        });
         benderSettings.size = parseInt(bender.value) + "%";
        $('#value4').html(parseInt(bender.value));
    }),true;
    
    document.getElementById('pointWidth').addEventListener('input',function(){
        let force = this;
        exChart.graphLayoutsStorage = {};
        exChart.graphLayoutsLookup = [];
        exChart.series[0].update({
            pointWidth: parseInt(force.value)
        },true);
        $('#pointWidthValue').html(parseInt(force.value));
    });

    $('#column').click(function () {
        exChart.update({
            chart: {
                inverted: false,
            }
        });
        exChart.series[0].update({
           type:'column'
        });
        $('#pointWidth').removeAttr('disabled');
        $('#bend2').attr('disabled','disabled');
        $('#bend3').attr('disabled','disabled');
        $('#bend4').attr('disabled','disabled');
        $('#bend1').attr('disabled','disabled');     
    });

    $('#bar').click(function () {
        exChart.update({
            chart: {
            inverted: true,
            }
        });
        exChart.series[0].update({
            type:'bar'
        });
        $('#pointWidth').removeAttr('disabled');
        $('#bend2').attr('disabled','disabled');
        $('#bend3').attr('disabled','disabled');
        $('#bend4').attr('disabled','disabled');
        $('#bend1').attr('disabled','disabled');
    });

    $('#pie').click(function () {
        exChart.update({
            chart: {
                inverted: false,
            },
        });

        exChart.series[0].update({
            type:'pie',
            startAngle:100,
            endAngle:100,
            innerSize:'0%',
            size:'100%'
        });
        $('#pointWidth').attr('disabled','disabled');
        $('#bend2').removeAttr('disabled');
        $('#bend3').removeAttr('disabled');
        $('#bend4').removeAttr('disabled'); 
        $('#bend1').removeAttr('disabled');
    }); 


    //hides the chart controls for chart 1
    $('#developers0Menu').click(function(){
         $('.controls').hide();
    });

    //drop down menu for smaller screens
    $('#chartLinksDropDown .dropdown-menu button').click(function(){
        $('#developersCharts4').html('<div id="mini"></div>');

        $('.chartLinks .list-group-item').each(function(){
            $(this).removeClass('active');
        });

        let id = this.classList[0];
        let text = $(this).html();
        let dropDownButton = $(this).parent().siblings();

        let currentVerticalIndex = clickVerticals.findIndex(element => element.vertical == id); //0
        let currentVertical = clickVerticals[currentVerticalIndex];

        $('.' + id).addClass('active');

        $(dropDownButton).html('<span>' + text + '</span>');
        $('#developers0Controls').css({opacity:0});
        $(this).addClass('active');
        showChart(currentVertical);

     });
   
    //buttons for smaller larger screens
    $('.chartLinks .list-group-item').click(function(){
        $('.chartLinks .list-group-item').each(function(){
            $(this).removeClass('active');
        });
        $('#developersCharts4').html('<div id="mini"></div>');
        

       
        let id = this.classList[0];
        let category = id.substr(0,id.length-1);
        let text = $(this).text();

        $("#" + category + '0Menu').html('<span>' + text + '</span>');


        let currentVerticalIndex = clickVerticals.findIndex(element => element.vertical == id); //0
        let currentVertical = clickVerticals[currentVerticalIndex];
       
        $(this).addClass('active');
        showChart(currentVertical);
    });

    //carousel tabs
    $('.cTab').click(function(){

        let id = this.id + '0';
        let currentVertical;

        $('#cContent').hide();
        $('#cContent #developers0Links').hide();
        $('#cContent #finance0Links').hide();
        $('#cContent #publishing0Links').hide();
        $('#cContent #science0Links').hide();
       // $('#heroContent').css({borderRight: '1px solid #ebebeb'});
        //$('#cContent .chartInfo p.title').css({borderRight: '1px solid #ebebeb'});
        $('#developersCharts4').html('<div id="mini"></div>');
        $('#developersCharts4').css({opacity:1});
        $('#introP').hide();
        $('#contentCarousel .carousel-indicators li').css({textAlign:'center'});
        $('p.title').fadeIn();
        $('p.text').fadeIn();

        $('#heroTitle').css({gridTemplateColumns:'300px'});

       

        if($('.syncCharts').length > 0){
           $('.syncCharts').forEach(function(){
               $(this).remove();
           })
        }
      
        if(demoChart.axes != undefined){
           // demoChart.destroy();
            console.log('dev 3 destroyed');
            $('#developersCharts3').hide();
            $('#c0').hide();
            $('#c1').hide();
            $('#c2').hide();
            $('#c3').hide();
            $('h2.fakeTitle').hide();
            $('h1.title').html('Elevate your data');
            $('h1.title').animate({opacity:1});
        }

        clearTimeout(currentTimeout)
        $('.cTab').removeClass('active');
        $(this).addClass('active');
        currentVertical = clickVerticals.find(element => element.vertical == id);
        $('#cContent').show();
        showChart(currentVertical);
    });

    //shows the correct chart
    function showChart(chart){
        let functionName = chart.callFunction;
        let controls = chart.controls;
        let text = chart.text;
        let subtitle = chart.subtitle;
        let title = chart.title;
        let chartToShow  = chart.chart;
        let chartNum = chart.chartNum;
        let vertical = chart.vertical;

        Highcharts.getOptions().colors[0] = '#7cb5ec';


        if(exChart != null && Object.keys(exChart).length > 0){
           exChart.destroy();
           console.log('ex destroyed');
        }


        ///turns the button on
        $('#' + vertical).addClass('active');

         ///hides the chart controls
        $('.charts').each(function(){
             $(this).hide();
        });
        $('.controls').hide();


        ///function calls if needed
        if(functionName != null){
            window[functionName]();

        }
        else{
            exChart = Highcharts.chart('mini',chartToShow); 
            $('#developersCharts4').animate({opacity:1},1000)
        }
            
        if(controls != false){
            $('.controls').show();
            $('#' + vertical + 'Controls').show();
            $('#' + vertical + 'Controls').animate({opacity:1},1000);
        }

        let titleString = title;

        if(subtitle != null){
            titleString =  title + '<br><span class="subtitle">'+ subtitle+ '</span>'
        }

        $('.chartInfo .title').html( titleString);
        $('.chartInfo .text').html(text);

        $('#cContent #' + vertical + 'Links').css({display:'block',opacity:1,height:'50px'});
    }

});




                
