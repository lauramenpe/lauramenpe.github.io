gsap.registerPlugin(MotionPathPlugin);

let anchors = [
  { x: 50, y: 130 },
  { x: 300, y: 10 },
  { x: 500, y: 70 }, 
  { x: 700, y: 190 }, 
  { x: 850, y: 100 }],
  rawPath = MotionPathPlugin.arrayToRawPath(anchors, { curviness: 0.8 }),
  path = buildPath(anchors, rawPath),
  progressArray = anchorsToProgress(rawPath),
  curIndex = 0;

function anchorsToProgress(rawPath, resolution) {
  resolution = ~~resolution || 12;
  if (!Array.isArray(rawPath)) {
    rawPath = MotionPathPlugin.getRawPath(rawPath);
  }
  MotionPathPlugin.cacheRawPathMeasurements(rawPath, resolution);
  let progress = [0],
    length, s, i, e, segment, samples;

  for (s = 0; s < rawPath.length; s++) {
    segment = rawPath[s];
    samples = segment.samples;
    e = segment.length - 6;

    for (i = 0; i < e; i += 6) {
      length = samples[(i / 6 + 1) * resolution - 1];
      progress.push(length / rawPath.totalLength);
    }
  }

  return progress;
}

function buildPath(anchors, rawPath) {
  let s = Snap("#svg"),
    path = s.path(MotionPathPlugin.rawPathToString(rawPath)),
    lineLength = path.getTotalLength(),
    i;

  path.attr({
    id: 'eq-curve',
    fill: 'none',
    stroke: '#009FE3',
    'stroke-dasharray': lineLength + ' ' + lineLength,
    'stroke-dashoffset': lineLength,
    'stroke-width': 5,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-miterlimit': 10
  });

  for (i = 0; i < anchors.length; i++) {
    var circle = s.circle(anchors[i].x, anchors[i].y, 0);
    circle.attr({
      id: `eq-point-${i}`
    })
  }

  return path;
}

var tl = gsap.timeline( {
    scrollTrigger: {
      trigger: "#about-me",
      pin: true,
      start: "top top",
      end: "max",
      scrub: 1
    }
  });

for (let anchorPos = 0; anchorPos < anchors.length; anchorPos++) {
  tl.to("#eq-curve", { strokeDashoffset: path.getTotalLength() - (path.getTotalLength() * progressArray[anchorPos]) })
  tl.to(`#eq-point-${anchorPos}`, { r: 5 } );
  tl.set(`.am-data`, { display: 'none', opacity: 0 });
  tl.to(`#am-data-${anchorPos}`, { display: 'block', opacity: 1 });
};