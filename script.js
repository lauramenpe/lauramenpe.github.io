const svg = d3.select("#equalizer");
const points = 
  [[0, 100],
  [120, 85],
  [150, 35],
  [180, 70],
  [250, 20],
  [300, 60]];

// Scales
const lineWidth = 2;

const maxX = 300;
const scaleX = d3.scaleLinear()
  .domain([0, maxX])
  .range([0, parseFloat(svg.style("width"))]);

const maxY = 120;
const scaleY = d3.scaleLinear()
  .domain([0, maxY])
  .range([0, parseFloat(svg.style("height")) - lineWidth]);

// Axis
const tickPadding = 10;

const xAxis = d3.axisBottom()
    .scale(scaleX)
    .tickSizeInner(-parseFloat(svg.style("height")))
    .tickSizeOuter(0)
    .tickPadding(tickPadding)
    .tickFormat("");

const yAxis = d3.axisLeft()
    .scale(scaleY)
    .tickSizeInner(-parseFloat(svg.style("width")))
    .tickSizeOuter(0)
    .tickPadding(tickPadding)
    .tickFormat("");

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + scaleY(maxY) + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

// Area 
const yAxisForArea = 200;

const areaGenerator = d3.area()
  .x((d) => scaleX(d[0]))
  .y1((d) => scaleY(d[1]))
  .y0(() => yAxisForArea)
  .curve(d3.curveCardinal);

svg.append('path')
  .attr('class', 'area')
  .attr('d', areaGenerator(points))
  .attr('stroke-width', 2);

// Line (draw & animate)
const interpolator = d3.line()
  .curve(d3.curveCardinal)
  .x((d) => scaleX(d[0]))
  .y((d) => scaleY(d[1]));

const line = svg
  .append("path")
  .datum(points)
  .attr("stroke", "url(#b1xGradient)")
  .attr("stroke-width", lineWidth)
  .attr("fill", "none")
  .attr("d", (d) => interpolator(d));

line.transition("grow")
  .duration(900)
  .attrTween("stroke-dasharray", function() {
    const len = this.getTotalLength();
    return (t) => d3.interpolateString("0," + len, len + ",0")(t);
  });

// Points
const radio = 10;

svg.selectAll("eq-circles")
  .data(points)
  .enter()
  .append("circle")
    .attr("stroke", "none")
    .attr("cx", (d) => scaleX(d[0]))
    .attr("cy", (d) => scaleY(d[1]))
    .attr("r", radio);