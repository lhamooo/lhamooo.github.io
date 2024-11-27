let font;
let pointsZHdK, pointsInitial; // Punkte für das Zielwort und den chaotischen Zustand
let bounds;
let transitionProgress = 0; // Übergangsstatus von 0 (Chaos) bis 1 (Wort lesbar)
let message = "ZHdK";

function preload() {
  font = loadFont("assets/ArialBold.otf"); // Passe die Schriftart an
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Punkte für das Zielwort berechnen
  pointsZHdK = font.textToPoints(message, 0, 0, 200, {
    sampleFactor: 0.3,
    simplifyThreshold: 0,
  });

  // Zufällige Punkte für den chaotischen Zustand
  pointsInitial = [];
  for (let i = 0; i < pointsZHdK.length; i++) {
    pointsInitial.push(createVector(random(width), random(height)));
  }

  // Berechne Bounds für das Zielwort
  bounds = font.textBounds(message, 0, 0, 200);
}

function draw() {
  background(0);
  noStroke();

  // Zentriere das Zielwort
  let scaleFactor = 0.9;
  let scaleW = (width / bounds.w) * scaleFactor;
  let scaleH = (height / bounds.h) * scaleFactor;
  let w = bounds.w * scaleW;
  let h = bounds.h * scaleH;
  let fontX = -bounds.x * scaleW;
  let fontY = -bounds.y * scaleH;
  fontX += width / 2 - w / 2;
  fontY += height / 2 - h / 2;

  // Interaktivität: Berechne Übergangsstatus basierend auf Mausposition
  let targetZoneX = width / 2; // Zielzone für die Maus
  let targetZoneY = height / 2; 
  let distanceToCenter = dist(mouseX, mouseY, targetZoneX, targetZoneY);

  // Größere Einflusszone und schnellerer Übergang
  let radius = min(width, height) * 0.5; // Größerer Radius der Einflusszone
  let targetProgress = constrain(map(radius - distanceToCenter, 0, radius, 0, 1), 0, 1);
  transitionProgress = lerp(transitionProgress, targetProgress, 0.2); // Schnellerer Übergang

  // Zeichne Punkte
  for (let i = 0; i < pointsZHdK.length; i++) {
    let target = pointsZHdK[i]; // Zielposition im Wort
    let initial = pointsInitial[i]; // Chaotische Startposition

    // Übergang von Chaos zu Zielwort und zurück
    let x = lerp(initial.x, target.x * scaleW + fontX, transitionProgress);
    let y = lerp(initial.y, target.y * scaleH + fontY, transitionProgress);

    // Animation: Klarere Punkte mit weniger pulsieren
    let size = 8 + sin(frameCount * 0.05 + i) * 1.5;

    // Farbwechsel basierend auf Übergang
    let col = lerpColor(color("#FF0080"), color("#00FFFF"), transitionProgress);
    fill(col);

    ellipse(x, y, size, size);
  }
}
