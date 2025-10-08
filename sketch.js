let points = [];
let dragging = false;
let dragIndex = null;
let userLine = [{ x: 100, y: 100 }, { x: 400, y: 200 }];
let showBestFit = false;
let bestFit = null;
let toggleButton, randomButton, sseDisplay;

function setup() {
  createCanvas(600, 400);
  generateData();

  toggleButton = createCheckbox('Show regression line', false);
  toggleButton.changed(() => {
    showBestFit = toggleButton.checked();
    bestFit = showBestFit ? getBestFitLine(points) : null;
  });

  randomButton = createButton('Randomize Data');
  randomButton.mousePressed(() => {
    generateData();
    bestFit = showBestFit ? getBestFitLine(points) : null;
  });

  sseDisplay = createDiv('');
}

function draw() {
  background(240);

  // Draw points
  stroke(0);
  fill(50);
  for (let p of points) {
    circle(p.x, p.y, 8);
  }

  // Draw user line
  stroke('red');
  strokeWeight(2);
  line(userLine[0].x, userLine[0].y, userLine[1].x, userLine[1].y);

  // Dragging logic
  if (dragging) {
    userLine[dragIndex].x = mouseX;
    userLine[dragIndex].y = mouseY;
  }

  // Draw best fit
  if (showBestFit && bestFit) {
    stroke('blue');
    strokeWeight(2);
    line(0, bestFit(0), width, bestFit(width));
  }

  // Calculate SSE
  let sseUser = computeSSE(points, userLine);
  let sseOptimal = showBestFit ? computeSSE(points, getLineEndpoints(bestFit)) : null;

  sseDisplay.html(
    `Your SSE: ${sseUser.toFixed(2)} ${sseOptimal !== null ? `<br>Optimal SSE: ${sseOptimal.toFixed(2)}` : ''}`
  );
}

function mousePressed() {
  for (let i = 0; i < 2; i++) {
    if (dist(mouseX, mouseY, userLine[i].x, userLine[i].y) < 10) {
      dragging = true;
      dragIndex = i;
    }
  }
}

function mouseReleased() {
  dragging = false;
  dragIndex = null;
}

function generateData() {
  points = [];
  for (let i = 0; i < 12; i++) {
    let x = random(50, width - 50);
    let y = 0.5 * x + random(-50, 50);
    points.push({ x, y });
  }
}

function getBestFitLine(data) {
  let x = data.map(p => p.x);
  let y = data.map(p => p.y);
  let xMean = mean(x);
  let yMean = mean(y);

  let num = 0;
  let den = 0;
  for (let i = 0; i < x.length; i++) {
    num += (x[i] - xMean) * (y[i] - yMean);
    den += (x[i] - xMean) ** 2;
  }

  let slope = num / den;
  let intercept = yMean - slope * xMean;

  return x => slope * x + intercept;
}

function computeSSE(data, line) {
  let sse = 0;
  let slope, intercept;

  if (typeof line === 'function') {
    for (let p of data) {
      let pred = line(p.x);
      sse += (pred - p.y) ** 2;
    }
  } else {
    let dx = line[1].x - line[0].x;
    let dy = line[1].y - line[0].y;
    slope = dy / dx;
    intercept = line[0].y - slope * line[0].x;

    for (let p of data) {
      let pred = slope * p.x + intercept;
      sse += (pred - p.y) ** 2;
    }
  }

  return sse;
}

function getLineEndpoints(lineFunc) {
  return [{ x: 0, y: lineFunc(0) }, { x: width, y: lineFunc(width) }];
}

function mean(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
