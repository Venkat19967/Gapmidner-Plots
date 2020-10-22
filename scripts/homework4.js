var max_income;
var max_life;
var max_population;
var max_tsunami;
var max_children;

var regions;
var regionset;

var xattr;
var yattr;
var reg;
var yrinput;

var jsonVal;
var jsonVal_max;
var svg;
var jsonVal_region;

var currentx;
var currenty;

var x;
var y;

var colorScale;

var interval = null;
// var intervalDuration = 100;
var playBtn;


// This runs when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
    svg = d3.select('#scatter-plot');
    svg.append('g').attr('id', "plots")
  
    regionset = new Set();

    div = d3.select("body").append("div")
    .attr("class", "tooltip-map")
    .style("opacity", 0);


    playBtn = d3.select('#play-button');

  
    // Load both files before doing anything else
    Promise.all([d3.csv('data/countries_regions.csv'),
                 d3.json('data/sample.json'),
                 d3.json('data/max_values.json')])
            .then(function(values){
      
        regions = values[0];

        jsonVal = values[1];
        jsonVal_max = values[2];
        
        max_income = parseInt(jsonVal_max.max_income);
        max_life = parseFloat(jsonVal_max.max_life);
        max_population = parseInt(jsonVal_max.max_population);
        max_children = parseFloat(jsonVal_max.max_children);
        max_tsunami = parseInt(jsonVal_max.max_tsunami);

        console.log(max_income);
        console.log(max_life);
        console.log(max_population);
        console.log(max_children);
        console.log(max_tsunami);

        // let temp = Object.values(income[100]);
        console.log(jsonVal);
        console.log(jsonVal_max);
        
        

        //set for unique regions
        regions.forEach(d => {
            regionset.add(d["World bank region"]);
        });

        colorScale  = d3.scaleOrdinal().domain(Array.from(regionset)).range(Array.from(d3.schemeCategory10));

        // console.log(Array.from(regionset));
        // console.log(Array.from(d3.schemeCategory10));
  

        let r = document.getElementById('region');
        let temp = document.createElement("option");
        temp.text = 'All'
        r.add(temp);
        regionset.forEach(d => {
            let x = document.createElement("option");
            x.text = d;
            r.add(x);
        })

        getfields();
        plotaxes();
        scatterplot();
    })


    playBtn.on('click', () => {
        if (playBtn.text() === 'Play') {
            // console.log(playBtn.text())
          playBtn.text('Pause')
          interval = setInterval(function(){
            yrval = document.getElementById("year-input").value;
            console.log(yrval);
            yrval = +yrval;

            if(yrval == 2021){
                console.log(playBtn.text())
                playBtn.text('Play')
                clearInterval(interval)
                document.getElementById('year-input').value = 2000;
                getfields();
                scatterplot();
            }
            else{
                document.getElementById('year-input').value = ++yrval;
                console.log(yrval);
                getfields();
                scatterplot();
            }
          }, 500)
        } else {
          playBtn.text('Play')
          clearInterval(interval)
        }
    })

});

function getfields() {
    xattr = document.getElementById("x-attribute").value;
    yattr = document.getElementById("y-attribute").value;
    yrinput = document.getElementById("year-input").value;
    yrinput = +yrinput;
    reg = document.getElementById("region").value;
}


function plotaxes(){
    d3.selectAll("#x-axis").remove();
    d3.selectAll("#y-axis").remove();
    d3.selectAll("#ytext").remove();
    d3.selectAll("#xtext").remove();

    x = d3.scaleLinear().domain([0, eval("max_" + xattr)]).range([ 0, 1000 ]);
    y = d3.scaleLinear().domain([0, eval("max_" + yattr)]).range([ 600, 0 ]);

    svg.append("g")
    .attr("transform", "translate("+ 125+ "," + 650 + ")")
    .attr('id', 'x-axis')
    .call(d3.axisBottom(x));

    svg.append("g")
    .attr('id', 'y-axis')
    .attr("transform", "translate("+ 125+ "," + 50 + ")")
    .call(d3.axisLeft(y));

    xtext = document.getElementById("x-attribute");
    ytext = document.getElementById("y-attribute");

    svg.append("text")
    .attr('id','ytext')
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("y", 35)
    .attr("x", -350)
    .attr("font-weight",500)
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .text(ytext.options[ytext.selectedIndex].text)
    
    svg.append("text")
    .attr('id','xtext')
    .attr("text-anchor", "middle")
    .attr("x", 625)
    .attr("y", 700)
    .attr("font-weight",500)
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .text(xtext.options[xtext.selectedIndex].text);

}


function scatterplot(){

    d3.selectAll("#yrimage").remove();

    if(reg == 'All'){
        jsonVal_region = jsonVal;
    } else {
        jsonVal_region = jsonVal.filter(function (d) {
            return (d.region == reg);
        });
    }
    

    jsonVal_region = jsonVal_region.filter(function (d) {
        return (d[xattr][yrinput-1800] != 'NaN' && d[yattr][yrinput-1800] != 'NaN');
    });

    // jsonVal_region.forEach(function(d){
    //     d['yr'] = String(yrinput);
    // })

    svg.append("text")
    .attr('id','yrimage')
    .attr("text-anchor", "middle")
    .attr("x", 641)
    .attr("y", 361)
    .attr("font-weight",500)
    .attr("font-family", "sans-serif")
    .attr("font-size", "150px")
    .attr("fill-opacity","0.4")
    .text(yrinput);

    console.log(jsonVal_region);
    const t = d3.transition().duration(500)
    
    svg.select('#plots').selectAll('g')
    .data(jsonVal_region)
    .join(
    enter => enterplots(enter, t),
    update => updateplots(update, t),
    exit => exitplots(exit, t)
    )

}

function enterplots(enter, t) {
    // console.log(enter)
    enter.append('g').attr('id','plotpoints')
      .call(
          g => g
          .on('mouseover', function(d,i) {
            // d3.select(this).transition()
            //   .attr('class', 'countrymap_hover');
            div.transition()
              .duration(50)
              .style("opacity", 1);
            div.html(`Country: ${d.country}`)
            .style("left", (d3.event.pageX) + 10 + "px")
            .style("top", (d3.event.pageY) + 10 + "px");
          })
          .on('mousemove',function(d,i) {
            // console.log('mousemove on ' + d.properties.name);
            div.html(`Country: ${d.country}`)
            .style("left", (d3.event.pageX) + 10 + "px")
            .style("top", (d3.event.pageY) + 10 + "px");
          })
          .on('mouseout', function(d,i) {
            // console.log('mouseout on ' + d.properties.name);
            // d3.select(this).transition()
            //          .attr('class', 'countrymap');
            div.transition()
                     .duration(50)
                     .style("opacity", 0);
          })
          .append('circle')
          .transition(t)
          .attr("fill", function(d){ return colorScale(String(d['region'])); } )
          .attr("stroke","black")
          .attr("fill-opacity","1")
          .attr("r", 15)
          .attr("transform", "translate("+ 125 + "," + 50 + ")")
          .attr("cx", 
          function(d) { 
              if(eval(d[xattr][yrinput-1800]) == 'NaN'){
                  return x(0);
              }
              else{
                  return x(parseInt(eval(d[xattr][yrinput-1800])));
              }
          })
          .attr("cy", function(d) { 
              if(eval(d[yattr][yrinput-1800]) == 'NaN'){
                  return y(0);
              }
              else{
                  return y(parseInt(eval(d[yattr][yrinput-1800])));
              }
          })
      )
      .call(
        g => g.append("text")
        .transition(t)
                    .attr("id", "circletext")
                    .attr("transform", "translate("+ 125+ "," + 55 + ")")
                    .attr("text-anchor", "middle")
                    .attr("x",function(d) { 
                        if(eval(d[xattr][yrinput-1800]) == 'NaN'){
                            return x(0);
                        }
                        else{
                            // console.log(eval(`d.tsunami[yrinput-1800]`));
                            return x(parseInt(eval(d[xattr][yrinput-1800])));
                        }
                    } )
                    .attr("y", function(d) { 
                        // if(d.population[yrinput-1800])
                        if(eval(d[yattr][yrinput-1800]) == 'NaN'){
                            return y(0);
                        }
                        else{
                            return y(parseInt(eval(d[yattr][yrinput-1800])));
                        }
                    })
                    .text(function(d){
                        return d.code;
                    })
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "13px")
                    .attr("fill", "white")
      )
  }
  
  function updateplots(update, t) {
      console.log(update)
    update
    .call(g => g.select('circle')
    .transition(t)
    .attr("r", 15)
    .attr("fill", function(d){ return colorScale(String(d['region'])); })
    // .attr("transform", "translate("+ 125 + "," + 50 + ")")
      .attr("cx", 
      function(d) { 
          if(eval(d[xattr][yrinput-1800]) == 'NaN'){
              return x(0);
          }
          else{
              return x(parseInt(eval(d[xattr][yrinput-1800])));
          }
      })
      .attr("cy", function(d) { 
          if(eval(d[yattr][yrinput-1800]) == 'NaN'){
              return y(0);
          }
          else{
              return y(parseInt(eval(d[yattr][yrinput-1800])));
          }
      })
      )
    .call(
        g => g.select('text')
        .transition(t)
        .attr("transform", "translate("+ 125+ "," + 55 + ")")
        .attr("text-anchor", "middle")
        .attr("x",function(d) { 
                        if(eval(d[xattr][yrinput-1800]) == 'NaN'){
                            return x(0);
                        }
                        else{
                            return x(parseInt(eval(d[xattr][yrinput-1800])));
                        }
                    } )
                    .attr("y", function(d) { 
                        if(eval(d[yattr][yrinput-1800]) == 'NaN'){
                            return y(0);
                        }
                        else{
                            return y(parseInt(eval(d[yattr][yrinput-1800])));
                        }
                    })
                    .text(function(d){
                        return d.code;
                    })
    )
  }
  
  function exitplots(exit, t) {
    exit
    .call(
        g =>
        g.transition(t)
        .style('opacity', 0)
        .remove()
    )
  }