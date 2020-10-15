// data load
// reference for d3.autotype: https://github.com/d3/d3-dsv#autoType
Promise.all([
  d3.csv("div_tech_2018_may.csv", d3.autoType),
  d3.csv("div_tech_2016_aug.csv", d3.autoType),
  d3.csv("div_tech_2015_jul.csv", d3.autoType),
  d3.csv("div_tech_2014.csv", d3.autoType)
]).then(([data_2018,data_2016,data_2015,data_2014]) => {


  data = data_2018
  d3.select("#selected-dropdown").text("2018");


d3.select("select")
  .on("change",function(d){
    var selected = d3.select("#d3-dropdown").node().value;
    d3.select("#selected-dropdown").text(selected);
    if (selected = "2015")  data = data_2015
    else if (selected = "2014") data = data_2014
    else if (selected = "2016") data = data_2016
    else data = data_2018
  })


  var subgroups = data.columns.slice(1, 3)

  var subgroups_ethnicity = data.columns.slice(3, 10)

  var groups = d3.map(data, function (d) { return (d.Company) }).keys()

  const width = window.innerWidth * 0.7,
    height = window.innerHeight / 1.5,
    paddingInner = 0.2,
    margin = { top: 20, bottom: 40, left: 40, right: 40 };

  const xScale = d3
    .scaleBand()
    .domain(data.map(d => d.Company))
    .range([margin.left, width - 2*margin.right])
    .paddingInner(0.05);


  const yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([height - 2*margin.bottom, 0])

  const yScale_ethnicity = d3.scaleLinear()
    .domain([0,100])
    .range([height*2,height+2*margin.bottom ])

  const colorScale = d3.scaleOrdinal().domain(subgroups).range([ "rgba(238, 153, 82,0.6)", "rgba(70, 214, 196,0.6)", "rgba(254, 232, 81, 0.6)", "rgba(152, 188, 154,0.6)","#DA70D6"])

  const colorScale_ethnicity = d3.scaleOrdinal().domain(subgroups_ethnicity).range(["rgba(238, 153, 82,0.6)", "rgba(70, 214, 196,0.6)", "rgba(254, 232, 81, 0.6)", "rgba(152, 188, 154,0.6)","rgba(255, 201, 212,0.6)","rgba(100,149,237,0.6)"])



  // var legend = d3.legendColor()
  //   .scale(colorScale);

    

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale).tickPadding(10);

  const yAxis_ethnicity = d3.axisLeft(yScale_ethnicity)


  const svg = d3
    .select("#d3-container1")
    .append("svg")
    .attr("width", width+500)
    .attr("height", height*3);

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${2 * margin.top}, ${height - margin.bottom})`)
    .call(xAxis)
    .selectAll("text")
    .attr("class", "text")
    .attr("transform", "rotate(90)")
    .attr("dy", "-.1em")
    .attr("dx", "4em")
    .attr("font-size", "30px")
    // .attr("transform", `translate(0, ${height/6 - margin.bottom})`);


    svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${2 * margin.top}, ${height + 3*margin.bottom})`)
    .call(xAxis)
    .selectAll("text")
    .remove()


  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${2 * margin.left},${margin.bottom})`)
    .call(yAxis)
    .selectAll("text")
    .attr("class", "text")

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${2 * margin.left},${margin.bottom})`)
    .call(yAxis_ethnicity)
    .selectAll("text")
    .attr("class", "text")


  console.log(data)

  var stackedData = d3.stack()
    .keys(subgroups)
    (data)

  var stackedData_ethnicity = d3.stack()
    .keys(subgroups_ethnicity)
    (data)

  console.log(stackedData)
  console.log(stackedData.key)

  var tooltip = d3.select("body")
  .append("div")
    .attr("class","tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")


    svg.selectAll("mydots")
    .data(subgroups)
    .enter()
    .append("circle")
      .attr("cx", width-margin.left +50)
      .attr("cy", function(d,i){ return 100 + i*40}) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("r", 14)
      .style("fill", function(d){ return colorScale(d)})
  
  // Add one dot in the legend for each name.
  svg.selectAll("mylabels")
    .data(subgroups)
    .enter()
    .append("text")
      .attr("font-size","40px")
      .attr("x", width+margin.left )
      .attr("y", function(d,i){ return 100 + i*40}) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", function(d){ return colorScale(d)})
      .text(function(d){ return d})
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")

    
      svg.selectAll("mydots_ethnicity")
      .data(subgroups_ethnicity)
      .enter()
      .append("circle")
        .attr("cx", width-margin.left +50)
        .attr("cy", function(d,i){ return 800 + i*40}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 14)
        .style("fill", function(d){ return colorScale_ethnicity(d)})
    
    // Add one dot in the legend for each name.
    svg.selectAll("mylabels_ethnicity")
      .data(subgroups_ethnicity)
      .enter()
      .append("text")
        .attr("font-size","40px")
        .attr("x", width+margin.left )
        .attr("y", function(d,i){ return 800+ i*40}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return colorScale_ethnicity(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

  svg.append("g")
    .selectAll("g")
    .data(stackedData)
    .enter().append("g")
    .attr("fill", d => colorScale(d.key))
    .selectAll("rect")
    .data(function (d) { return d; })
    .enter().append("rect")
    .attr("x", function (d) { return xScale(d.data.Company) + margin.left; })
    .attr("y", function (d) { return yScale(d[1]) + margin.bottom; })
    .attr("height", function (d) { return yScale(d[0]) - yScale(d[1]); })
    .attr("width", xScale.bandwidth())
    .on("mouseover", function(d) {
      console.log(d[1])		
      tooltip.transition()			
          .style("opacit", 0.6)
          .style("visibility", "visible");		
      tooltip	.html(-(d[0]- d[1])+"%")
          .style("left", (d3.event.pageX) + "px")		
          .style("top", (d3.event.pageY - 28) + "px");	
      })					
  .on("mouseout", function(d) {		
      tooltip.transition()		
          .duration(500)		
          .style("visibility","hidden");	
  });


  // svg.append("g")
  //   .attr("transform", "translate(1250,0)")
  //   .call(legend);


    svg.append("g")
    .selectAll("g")
    .data(stackedData_ethnicity)
    .enter().append("g")
    .attr("fill", d => colorScale_ethnicity(d.key))
    .selectAll("rect")
    .data(function (d) { return d; })
    .enter().append("rect")
    .attr("x", function (d) { return xScale(d.data.Company) + margin.left; })
    .attr("y", function (d) { return yScale_ethnicity(d[1]) + margin.bottom; })
    .attr("height", function (d) { return yScale_ethnicity(d[0]) - yScale_ethnicity(d[1]); })
    .attr("width", xScale.bandwidth())
    .on("mouseover", function(d) {
      console.log(d[1])		
      tooltip.transition()			
          .style("opacit", 0.6)
          .style("visibility", "visible");		
      tooltip	.html(-(d[0]- d[1])+"%")
          .style("left", (d3.event.pageX) + "px")		
          .style("top", (d3.event.pageY - 28) + "px");	
      })					
  .on("mouseout", function(d) {		
      tooltip.transition()		
          .duration(500)		
          .style("visibility","hidden");	
  });

});
