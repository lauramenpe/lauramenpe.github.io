var points = 
[[0, 100],
[120, 85],
[150, 35],
[180, 70],
[250, 20],
[300, 60]];

const svg = d3.select("#equalizer");
const lineWidth = 2;

// Scale.
const scaleX = d3.scaleLinear()
  .domain([0, 300])
  .range([0, parseFloat(svg.style("width"))])
const scaleY = d3.scaleLinear()
  .domain([0, 120])
  .range([0, parseFloat(svg.style("height")) - lineWidth]);

var xAxis = d3.axisBottom()
    .scale(scaleX)
    .tickSizeInner(-parseFloat(svg.style("height")))
    .tickSizeOuter(0)
    .tickPadding(10)
    .tickFormat("");

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + scaleY(120) + ")")
    .call(xAxis);

var yAxis = d3.axisLeft()
    .scale(scaleY)
    .tickSizeInner(-parseFloat(svg.style("width")))
    .tickSizeOuter(0)
    .tickPadding(10)
    .tickFormat("");

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

var areaGenerator = d3.area()
  .x(function(d) {
      return scaleX(d[0])
  })
  .y1(function(d) {
      return scaleY(d[1])
  })
  .y0(function() {
      return 200
  })
  .curve(d3.curveCardinal);

var area = svg.append('path')
  .attr('class', 'area')
  .attr('d', areaGenerator(points))
  .attr('stroke-width', 2);

// Curved line interpolator.
const bezierLine = d3.line()
  .curve(d3.curveCardinal)
  .x((d) => scaleX(d[0]))
  .y((d) => scaleY(d[1]));

// Draw line & animate.
const line = svg
  .append("path")
  .datum(points)
  .attr("stroke", "url(#b1xGradient)")
  .attr("stroke-width", lineWidth)
  .attr("fill", "none")
  .attr("d", function(d) { return bezierLine(d); });

line
  .transition("grow")
  .duration(900)
  .attrTween("stroke-dasharray", function () {
    const len = this.getTotalLength();
    return (t) => d3.interpolateString("0," + len, len + ",0")(t);
  });

svg.selectAll("myCircles")
  .data(points)
  .enter()
  .append("circle")
    .attr("stroke", "none")
    .attr("cx", function(d) { return scaleX(d[0]) })
    .attr("cy", function(d) { return scaleY(d[1]) })
    .attr("r", 10);