var yAxisLabel = 'Podíl článků v predátorských časopisech'
var xAxisLabel = 'Podíl článků v místních časopisech'

var data = {};
legendTexts = {
    // field: ['Zemědělské vědy', 'Technické vědy', 'Humanitní vědy', 'Lékařské vědy','Přírodní vědy','Společenské vědy'],
    field: ['Přírodní vědy','Technické vědy','Lékařské vědy','Zemědělské vědy','Společenské vědy','Humanitní vědy'],
    types: ['Akademie věd ČR','Vysoké školy','Ostatní']
}

var legendIDs = {
    field: {'Zemědělské vědy' : 'agri','Technické vědy':'tech','Humanitní vědy':'human','Lékařské vědy':'medic','Přírodní vědy':'life','Společenské vědy':'social'},
    types: {'Akademie věd ČR':'AV','Vysoké školy':'univ','Ostatní':'other'}
}
colors = ['#d53e4f','#fc8d59','#fee08b','#e6f598','#99d594','#3288bd'];

var d3elems = {};



function DrawAllCharts() {

    GenerateGlobals();

    $('#app .chartcontainer').append('<div id="mainApp" class="chartDiv" />')
    generateDataObject('#mainApp',legendTexts.field,legendTexts.types,false);

    DrawChart('#mainApp');
};

//Main controlling methods
function DrawChart(selector){

    generateElementStructure(selector);

    DrawStatics(selector);

    circles = g.append('g')
                .attr('id','circles');

    DrawLegends(selector);

    DrawData(selector);

    descBoxDefault();


};
function Redraw(selector,showdefault,fadeIn) {
    // data[selector].used = {}
    if (showdefault) {
        data[selector].used.fields = data[selector].default.fields
        data[selector].used.types = data[selector].default.types
    }
    $(selector).empty();
    unselectAll(selector);
    $(selector).hide();
    DrawChart(selector)

    if(fadeIn) {
        $(selector).fadeIn('slow');
    } else {
        $(selector).show();
    }
}

// Preparing data and HTML structure
function generateDataObject(selector,defaultfields,defaulttypes,fullLayout) {
    o = {}

    o.fullLayout = fullLayout;
    o.institutions = jQuery.extend(true, {}, institutions);
    o.used = {}
    o.used['fields'] = jQuery.extend(true, [], defaultfields);
    o.used['types'] = jQuery.extend(true, [], defaulttypes);

    o.default = {}
    o.default['fields'] = jQuery.extend(true, [], defaultfields);
    o.default['types'] = jQuery.extend(true, [], defaulttypes);

    data[selector] = o;
};

function generateElementStructure(selector) {
    var parent = $(selector);

    $('.chartcontainer').css({width:sizes.chart.width + 480})

    parent.empty();
    parent = createSelect2(selector)
    parent.append($('<div />', {id:'chart'}));

    chartdiv = $('#chart');


    notes = $('<div />', {id:'chartNotes',class:'notes'})
    notes.append('<p>Pozn.: Do analýzy jsou zařazeny <a class="modalLink" onclick="showModal(\'modScopusWos\')">články ve Scopusu</a> zaznamenané v RIVu v období 2011 - 2015. Pracoviště byla rozřazena do <a class="modalLink" onclick="showModal(\'modFOS\')">FOS oborů</a>; Zdroj: <a class="modalLink" onclick="showModal(\'modScopus\')">Scopus</a>, <a class="modalLink" onclick="showModal(\'modHodnoceni2016\')">Hodnocení 2016</a> a <a class="modalLink" onclick="showModal(\'modPredatori\')">Beallovy seznamy</a>.</p>')
    notes.css('width',sizes.chart.width)    

    parent.append(notes)

    $('#didyouknow').css('left',sizes.chart.width+50)
    $('#descbox').css('left',sizes.chart.width+50)


}


//Drawing methods
function filterArray (selector) {

    function compare(a,b) {
        if (a.selected < b.selected)
          return -1;
        if (a.selected > b.selected)
          return 1;
        return 0;
      }
      

    listinst = $.map(data[selector].institutions,function(el) {return el;});
    if (data[selector].used.fields.length != legendTexts.field.length) {
       listinst = listinst.filter(function (inst) {return data[selector].used.fields.indexOf(inst.Obor) != -1; })//inst => data[selector].used.fields.includes(inst.Obor))
   }
   if (data[selector].used.types.length != legendTexts.types.length) {
      listinst = listinst.filter(function (inst) {return data[selector].used.types.indexOf(inst.Type) != -1; })//inst => data[selector].used.types.includes(inst.Type))
   }
   return listinst.sort(compare);
};

function DrawData(selector) {
    // var selector = selector
    var points = filterArray(selector)
    promenna = selector; //TODO odstranit tuhle prasarnu

      $(selector + ' #circles').empty();
      $('.tooltip').remove();
      tooltip = d3.select('body')
                      .append('div')
                      .attr('class','tooltip')
                      .style('opacity',0);

    //circles.selectAll("circle").remove();

    d3.select(selector + ' #circles').selectAll('.dot')
        .data(points)
        .enter()
        .append('circle')
        // .attr('class','dot')
        .attr('cx', function(d) {return xScale(d.LocalShare); })
        .attr('cy', function(d) {return yScale(d.PredatoryShare); })
        .attr('r', function(d) {
                if (d.selected != 0){ return '5px'}
            else {return '5px'} } )
        .attr('fill',function(d) {return color(d.Obor); })
        .attr('id',function(d) {return d.JEDNOTKA})
        .attr('class',function(d) {
            if ($(promenna + ' #ddlSearch').val())
            {
                if (d.selected != 0) {return 'dot selected'; }
                else {return 'dot unselected'; }
            }
        }) // Adjust selection here
        .attr('data-legend',function(d) {return d.Obor})
        d3.selectAll(selector + ' #circles circle')
        .on('mouseover',function(d) {
            tooltip.transition()
                .duration(200)
                .style('opacity',0.9);
            tooltip.html(d.JEDNOTKA);
        }) //TODO tooltip does not work when some points selected
        .on('mouseout',function(d){
            tooltip.transition()
                .duration(500)
                .style('opacity',0);
        })
        .on('mousemove',function (d) {
            tooltip.html(d.JEDNOTKA)
                .style('left',(d3.event.pageX) + 'px')
                .style('top',(d3.event.pageY - 28) + 'px')
        })
        .on("click", function(d) {
          SelectSinglePoint(selector,d);
        });

};

function DrawLegends(selector) {
    DrawFieldLegend(selector);

    DrawTypeLegend(selector);

}

function DrawFieldLegend(selector) {
    g = d3elems[selector].g;

    var legendG = g.append('g')
                    .attr('class','legendG')
                    .attr('transform','translate(280,25)')
    var legendRect = legendG.append('rect')
                        .attr('class','legendRect')
                        .attr('fill','white')
                        .attr('rx',9)
                        .attr('rx',9)
                        .attr('width','160px')
                        .attr('height','150px')
                        .attr('transform','translate(-15,-15)')
                        .attr('fill-opacity','0.6');
    legendG.append('text')
            .text('Zobrazit/skrýt:')
            .attr('class','legendDesc')
            .attr('transform','translate(0,2)')

    var legend = legendG.selectAll('.legend')
                    .data(legendTexts.field)
                    .enter()
                    .append('g')
                    .attr('class',function(d) {
                        if(data[selector].used.fields.indexOf(d) != -1)
                        {return 'legend'}
                        else {return 'legend legendPassive'}
                    })
                    .attr('id',function(d) {return legendIDs.field[d];})
                    .attr('transform',function(d,i) {
                        return 'translate(0,'+ (20 + i*20) + ')'; }
                    )
                    .on('click',function(d) {
                        toggleLegendClick(d,'fields',this);
                        $(this).toggleClass('legendPassive');
                    }
                );

    //Draw legend circles
    legend.append('circle')
        .attr('cy',0)
        .attr('r',5)
        .attr('width',18)
        .attr('height',18)
        .style('fill',d3elems.color)
        .style('stroke',d3elems.color);

    //Draw legend text
    legend.append('text')
        .attr('x',15)
        .attr('dy','.35em')
        .style('text-anchor','begin')
        .text(function(d) {return d})


        for (fid in legendTexts.fields) {
            f = fields[fid];
            if(!(data[selector].used.fields.indexOf(f) != -1)) {
                d3.selectAll(selector + ' #' + legendIDs.field[f]).classed('legendPassive',true)
            } else {
                d3.selectAll(selector + ' #' + legendIDs.field[f]).classed('legendPassive',false)
            }
        }
};


function DrawTypeLegend(selector){
    var legendG = g.append('g')
                    .attr('class','legendG')
                    .attr('transform','translate(280,183)');

    var legendRect = legendG.append('rect')
                        .attr('class','legendRect')
                        .attr('fill','white')
                        .attr('rx',9)
                        .attr('rx',9)
                        .attr('width','160px')
                        .attr('height','70px')
                        .attr('transform','translate(-15,-15)')
                        .attr('fill-opacity','0.6');

    var legend = legendG.selectAll('.legend')
                    .data(legendTexts.types)
                    .enter()
                    .append('g')
                    .attr('class',function(d) {
                        if(data[selector].used.types.indexOf(d) != -1)
                        {return 'legend'}
                        else {return 'legend legendPassive'}
                    })
                    .attr('id',function(d) {return legendIDs.types[d];})
                    .attr('transform',function(d,i) {return 'translate(0,'+ (i*20) + ')'; })
                    .on('click',function(d) {
                        toggleLegendClick(d,'types',this);
                        $(this).toggleClass('legendPassive');
                    });
                    legend.append('text')
                        .attr('x',15)
                        .attr('dy','.35em')
                        .style('text-anchor','begin')
                        .text(function(d) {return d})

                    //Draw legend icons
                    legend.append('svg:image')
                        .attr('xLink:href',function(d) {return'img/'+ d + '.svg'})
                        .attr('transform','translate(-7,-8)')
                        .attr('width',16)
                        .attr('height',16);

            for (tid in legendTexts.types) {
                    t = legendTexts.types[tid];
                    if(!(data[selector].used.types.indexOf(t) != -1)) {
                        d3.selectAll(selector + ' #' + legendIDs.types[t]).classed('legendPassive',true)
                    } else {
                        d3.selectAll(selector + ' #' + legendIDs.types[t]).classed('legendPassive',false)
                    }
                }

};

function GenerateGlobals() {
    margin = {top:10,right:-25,bottom:50,left:70}
    height = sizes.chart.height - margin.top - margin.bottom;
    width = sizes.chart.width - margin.left - margin.right;

    xScale = d3.scaleLinear()
        .range([0,width])
        .domain([0,1]);
  
    xAxis = d3.axisBottom().scale(xScale).ticks(5).tickFormat(d3.format(".0%"));
  
    yScale = d3.scaleLinear()
        .range([height,0])
        .domain([0,1]);
    yAxis = d3.axisLeft().scale(yScale).ticks(5).tickFormat(d3.format(".0%"));
  
  
    color = d3.scaleOrdinal()
        .domain(legendTexts.field)
        .range(colors);

    d3elems['margin'] = margin
    d3elems['height'] = height
    d3elems['width'] = width

    d3elems['color'] = color;
    d3elems['yAxis'] = yAxis;
    d3elems['xAxis'] = xAxis;
    d3elems['yScale'] = yScale;
    d3elems['xScale'] = xScale;
  };


  function DrawStatics(selector) {

    svg = d3.select(selector +' #chart')
        .append('svg')
        .attr('overflow','hidden')
        .attr('id','svg')
        .attr('width',sizes.chart.width + 50+ 'px')
        .attr('height',sizes.chart.height + 'px')
        .append('g')
        .attr('transform','translate(' + d3elems.margin.left + ',' + d3elems.margin.top + ')');

    g = svg.append('g')
        .attr('id','chartGroup');
        
    // Draw y-axis
    g.append('g')
        .attr("class", "y axis")
        .call(d3elems.yAxis);
    g.append('text')
        .attr("transform", "rotate(-90)")
        .attr('class','label')
        .attr('x',0-(d3elems.height/2))
        .attr('y',-50)
        .style("text-anchor", "middle")
        .html(yAxisLabel);

    // draw x-axis
    g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3elems.xAxis)
      .append("text")
      .attr("class", "label")
      .attr("x", d3elems.width/2)
      .attr("y", 30)
      .style("text-anchor", "middle")
      .text(xAxisLabel)
      .attr('transform','translate(0,10)')
      ;

      // Add lines

      function DrawLine(num){
        g.append("line")
            .attr("x1",d3elems.xScale(num))
            .attr('y1',d3elems.yScale(0))
            .attr("x2",d3elems.xScale(0))
            .attr('y2',d3elems.yScale(num))
            .attr('class','helpline')
            .attr('stroke-dasharray',"5,5");

        g.append('text')
            .attr('transform','rotate(45 ' + xScale(0.06) + ',' + yScale(num-0.1) + ')')
            .attr('x',d3elems.xScale(0.06))
            .attr('y',d3elems.yScale(num-0.1))
            .text(num*100 + ' %')
            .attr('class','lineDesc');
      }

      percentages = [.2,.4,.6,.8,1]
      for (p in percentages) {
          DrawLine(percentages[p]);
      }
        //triangle
        g.append('polygon')
        .attr('class','triangle')
        .attr('points',d3elems.xScale(1) + ',' + d3elems.yScale(0) + ' ' + d3elems.xScale(1) + ',' +d3elems.yScale(1) + ' ' + xScale(0) + ',' +yScale(1))

        d3elems[selector] = {};
        d3elems[selector]['g'] = g;
        d3elems[selector]['svg'] = svg;
    
};
