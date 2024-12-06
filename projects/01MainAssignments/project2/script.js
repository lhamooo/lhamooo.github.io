let circles = [];
let bar = { x: 50, y: 0, width: 300, height: 30, volume: 0 };
let draggedCircle = null;
let isLastCircleFleeing = false;

function setup() {
  createCanvas(windowWidth, windowHeight);

  bar.y = height - 200;
  bar.width = width * 0.6;
  bar.x = (width - bar.width) / 2;

  for (let i = 0; i < 30; i++) { 
    let isNegative = random() < 0.5;
    let value = floor(random(1, 25)) * (isNegative ? -1 : 1); 
    circles.push({
      x: random(50, width - 50),
      y: random(50, height - 250), 
      size: map(abs(value), 1, 25, 60, 20), 
      vx: random(-5, 5) * (abs(value) / 6), 
      vy: random(-5, 5) * (abs(value) / 6),
      value: value,
      collected: false,
    });
  }
}

function draw() {
  background(0);

  for (let circle of circles) {
    if (!circle.collected) {
      circle.x += circle.vx;
      circle.y += circle.vy;

      if (circle.x < circle.size / 2 || circle.x > width - circle.size / 2) {
        circle.vx *= -1;
        circle.vx += random(-0.5, 0.5);
      }
      if (circle.y < circle.size / 2 || circle.y > height - 250 - circle.size / 2) {
        circle.vy *= -1;
        circle.vy += random(-0.5, 0.5);
      }

      if (isLastCircleFleeing && circles.filter(c => !c.collected).length === 1) {
        let distance = dist(mouseX, mouseY, circle.x, circle.y);
        if (distance < 150) {
          let angle = atan2(circle.y - mouseY, circle.x - mouseX);
          circle.x += cos(angle) * 8;
          circle.y += sin(angle) * 8;
        }
      }

      fill(255); 
      noStroke();
      ellipse(circle.x, circle.y, circle.size);

      fill(0); 
      textSize(16);
      textAlign(CENTER, CENTER);
      text(circle.value, circle.x, circle.y);
    }
  }

  noStroke();
  fill(80);
  rect(bar.x, bar.y, bar.width, bar.height, 10);
  fill(255);
  rect(bar.x, bar.y, map(bar.volume, 0, 100, 0, bar.width), bar.height, 10);

  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  text(`Volume: ${floor(bar.volume)}%`, width / 2, bar.y - 30);
}

function mousePressed() {
  for (let circle of circles) {
    let d = dist(mouseX, mouseY, circle.x, circle.y);
    if (!circle.collected && d < circle.size / 2) {
      circle.dragged = true;
      draggedCircle = circle;
      break;
    }
  }
}

function mouseDragged() {
  if (draggedCircle) {
    draggedCircle.x = mouseX;
    draggedCircle.y = mouseY;
  }
}

function mouseReleased() {
  if (draggedCircle) {
    if (
      mouseX > bar.x &&
      mouseX < bar.x + bar.width &&
      mouseY > bar.y &&
      mouseY < bar.y + bar.height
    ) {
      draggedCircle.collected = true;
      bar.volume = constrain(bar.volume + draggedCircle.value, 0, 100);

      if (circles.filter(c => !c.collected).length === 1) {
        isLastCircleFleeing = true;
      }
    }

    draggedCircle.dragged = false;
    draggedCircle = null;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  bar.y = height - 200;
  bar.width = width * 0.6;
  bar.x = (width - bar.width) / 2;
}
