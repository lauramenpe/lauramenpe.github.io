const svg = d3.select("#equalizer");

const points = 
  [
    { x: 0, y: 100 },
    { x: 10, y: 100 },
    { x: 120, y: 85 },
    { x: 150, y: 35 },
    { x: 180, y: 70 },
    { x: 250, y: 20 },
    { x: 290, y: 60 },
    { x: 300, y: 75 }
  ];

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
const yAxisForArea = 153;

const areaGenerator = d3.area()
  .x((d) => scaleX(d.x))
  .y1((d) => scaleY(d.y))
  .y0(() => yAxisForArea)
  .curve(d3.curveMonotoneX);

svg.append('path')
  .attr('class', 'area')
  .attr('d', areaGenerator(points))
  .attr('stroke-width', 2);

// Line (draw & animate)
const interpolator = d3.line()
  .curve(d3.curveMonotoneX)
  .x((d) => scaleX(d.x))
  .y((d) => scaleY(d.y));

const line = svg
  .append("path")
  .datum(points)
  .attr("id", "eq-path")
  .attr("stroke", "#5889A2")
  .attr("stroke-width", lineWidth)
  .attr("fill", "none")
  .attr("d", (d) => interpolator(d));

// Points
const radio = 6;
var position = 0;
points.forEach(element => {
  svg.append("circle")
    .attr("stroke", "none")
    .attr("id", `point-${position}`)
    .attr("cx", () => scaleX(element.x))
    .attr("cy", () => scaleY(element.y))
    .attr("r", radio)
    // .on("click", (event) => showCard(event));
  position++;
});

// Border
var borderPath = svg.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("height", parseFloat(svg.style("height")))
  .attr("width", parseFloat(svg.style("width")))
  .attr("filter", "url(#f1)")
  .style("stroke", "#2F2F2F")
  .style("fill", "none")
  .style("stroke-width", 20);

// Scrollytelling
var path = document.querySelector('#eq-path');
var pathLength = path.getTotalLength();

//Make the line disappear
path.style.strokeDasharray = pathLength + ' ' + pathLength;
path.style.strokeDashoffset = pathLength;

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

var scaledPoints = points.map(point => [scaleX(point.x), scaleY(point.y)]);
console.log(scaledPoints);

ScrollTrigger.create({
  trigger: "#about-me",
  pin: true,
  start: "top top",
  end: "max",
  onUpdate: self => {
    // Draw the line
    var drawLength = pathLength * self.progress.toFixed(3);
    path.style.strokeDashoffset = pathLength - drawLength;
  }
});