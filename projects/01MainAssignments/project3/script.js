let font;
let pointsZHdK, pointsInitial; 
let bounds;
let transitionProgress = 0; 
let message = "ZHdK";

function preload() {
  font = loadFont("assets/ArialBold.otf"); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  pointsZHdK = font.textToPoints(message, 0, 0, 200, {
    sampleFactor: 0.3,
    simplifyThreshold: 0,
  });

  pointsInitial = [];
  for (let i = 0; i < pointsZHdK.length; i++) {
    pointsInitial.push(createVector(random(width), random(height)));
  }

  bounds = font.textBounds(message, 0, 0, 200);
}

function draw() {
  background(0);
  noStroke();

  let scaleFactor = 0.9;
  let scaleW = (width / bounds.w) * scaleFactor;
  let scaleH = (height / bounds.h) * scaleFactor;
  let w = bounds.w * scaleW;
  let h = bounds.h * scaleH;
  let fontX = -bounds.x * scaleW;
  let fontY = -bounds.y * scaleH;
  fontX += width / 2 - w / 2;
  fontY += height / 2 - h / 2;

  let targetZoneX = width / 2; 
  let targetZoneY = height / 2; 
  let distanceToCenter = dist(mouseX, mouseY, targetZoneX, targetZoneY);

  let radius = min(width, height) * 0.5; 
  let targetProgress = constrain(map(radius - distanceToCenter, 0, radius, 0, 1), 0, 1);
  transitionProgress = lerp(transitionProgress, targetProgress, 0.2); 

  for (let i = 0; i < pointsZHdK.length; i++) {
    let target = pointsZHdK[i]; 
    let initial = pointsInitial[i]; 

    let x = lerp(initial.x, target.x * scaleW + fontX, transitionProgress);
    let y = lerp(initial.y, target.y * scaleH + fontY, transitionProgress);

    let size = 8 + sin(frameCount * 0.05 + i) * 1.5;

    let col = lerpColor(color("#FF0080"), color("#00FFFF"), transitionProgress);
    fill(col);

    ellipse(x, y, size, size);
  }
}
