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

var currentx;
var currenty;


// This runs when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
    svg = d3.select('#scatter-plot');
    
  
    regionset = new Set();
    div = d3.select("body").append("div")

  
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

        let r = document.getElementById('region');
        regionset.forEach(d => {
            let x = document.createElement("option");
            x.text = d;
            r.add(x);
        })
  
        // scatterplot();
        getfields()
    })
  
});



function getfields() {

    xattr = document.getElementById("x-attribute").value;
    yattr = document.getElementById("y-attribute").value;
    yrinput = document.getElementById("year-input").value;
    yrinput = +yrinput;
    reg = document.getElementById("region").value;
    scatterplot();

    
}


function plotaxes(){

}


function scatterplot(){
    
    var x = d3.scaleLinear().domain([0, eval("max_" + xattr)]).range([ 0, 900 ]);
    var y = d3.scaleLinear().domain([0, eval("max_" + yattr)]).range([ 600, 0 ]);
    

    
    svg.append("g")
    .attr("transform", "translate("+ 75+ "," + 650 + ")")
    .attr('id', 'x-axis')
    .call(d3.axisBottom(x));

    svg.append("g")
    .attr('id', 'y-axis')
    .attr("transform", "translate("+ 75+ "," + 50 + ")")
    .call(d3.axisLeft(y));

    
    
    svg.selectAll("dot")
    .data(jsonVal)
    // .filter(function(d) { if(d.region == reg){return d;}})
    .enter().append("circle")
    .attr("fill", "white")
    .attr("stroke","black")
    .attr("fill-opacity","0")
    .attr("r", 20)
    .attr("transform", "translate("+ 75+ "," + 50 + ")")
    .attr("cx", 
    function(d) { 
        if(eval("d."+ xattr + "[yrinput-1800]") == 'NaN'){
            return x(0);
        }
        else{
            // console.log(eval(`d.tsunami[yrinput-1800]`));
            return x(parseInt(eval("d."+ xattr + "[yrinput-1800]")));
        }
    })
    .attr("cy", function(d) { 
        // if(d.population[yrinput-1800])
        if(eval("d."+ yattr + "[yrinput-1800]") == 'NaN'){
            return y(0);
        }
        else{
            return y(parseInt(eval("d."+ yattr + "[yrinput-1800]")));
        }
    });



}