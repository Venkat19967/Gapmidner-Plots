var max_income;
var max_life_expectancy;
var max_population;
var max_tsunami;
var max_children;

var regions;
var regionset;

var jsonVal;
var jsonVal_max;


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
        max_life_expectancy = parseFloat(jsonVal_max.max_life);
        max_population = parseInt(jsonVal_max.max_population);
        max_children = parseFloat(jsonVal_max.max_children);
        max_tsunami = parseInt(jsonVal_max.max_tsunami);

        console.log(max_income);
        console.log(max_life_expectancy);
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
  
      
    })

    scatterplot();
  
});

function scatterplot(){
    
    var x = d3.scaleLinear().domain([0, max_population]);
    var y = d3.scaleLinear().domain([0, max_income]);

    svg.append('g')
    .selectAll("dot")
    .data(jsonVal)
    // .enter()
    // .append("circle")
    .attr("cx", function (d) { 
          temp = []
          d.forEach(d =>{
              temp.append(d.population[200])
          });
          console.log(temp);
          return temp; 
        })
      .attr("cy", function (d) {
        temp = []
          d.forEach(d =>{
              temp.append(d.income[200])
          })
          return temp;
      })
      .attr("r", 1.5)
      .style("fill", "#69b3a2")

}