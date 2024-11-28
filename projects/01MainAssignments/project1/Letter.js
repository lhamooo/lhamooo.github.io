class Letter {
    constructor(char, x, y) {
      this.char = char;
      this.x = x;
      this.y = y;
      this.vx = 0;
      this.vy = 0;
      this.ax = 0;
      this.ay = 0.2;
      this.targetX = null;
      this.targetY = null;
  
      this.color = color(random(50, 200), random(50, 200), random(50, 200)); 
  
      this.exploded = false;
      this.initialSize = 44;
      this.currentSize = this.initialSize * 2; 
      this.sizeGrowSpeed = 0.2; 
      this.sizeShrinkSpeed = 0.3; 
      this.scaredOffset = createVector(0, 0); 
  
      this.visible = true;
      this.isHovered = false; 
    }
  
    moveTo(x, y) {
      this.targetX = x;
      this.targetY = y;
      this.vx = 0;
      this.vy = 0;
      this.ax = 0;
      this.ay = 0;
    }
  
    explode() {
      if (!this.exploded) {
        this.vx = random(-5, 5); 
        this.vy = random(-5, 5);
        this.exploded = true;
      }
    }
  
    update() {
      if (this.exploded) {
        this.x += this.vx;
        this.y += this.vy;
        return; 
      }
  
      if (this.targetX !== null && this.targetY !== null) {
        this.x += (this.targetX - this.x) * 0.1;
        this.y += (this.targetY - this.y) * 0.1;
  
        if (abs(this.x - this.targetX) < 1 && abs(this.y - this.targetY) < 1) {
          this.targetX = null;
          this.targetY = null;
        }
      } else {
        this.vy += this.ay;
        this.y += this.vy;
  
        if (this.y > height - 100) {
          this.y = height - 100;
          this.vy = 0;
        }
      }
  
      let mousePos = createVector(mouseX, mouseY);
      let letterPos = createVector(this.x, this.y);
      let distance = p5.Vector.dist(mousePos, letterPos);
  
      this.isHovered = distance < 70;
  
      if (currentMood === 'Sad') {
        this.visible = !this.isHovered; 
      }
    }
  
    display(scaledTextSize, index) {
      if (!this.exploded && !this.visible) return;
  
      let waveMovementY = 0;
      let waveMovementX = 0;
      let rotationAngle = 0; 
      let fontSizeMultiplier = 1; 
  
      if (currentMood === 'Happy') {
        fill(this.color);
        let waveAmplitude = this.isHovered ? 40 : 15; 
        waveMovementY = sin(TWO_PI * (frameCount + index * 10) / 100) * waveAmplitude;
        waveMovementX = cos(TWO_PI * (frameCount + index * 10) / 120) * waveAmplitude * 0.5;
  
        if (this.isHovered) {
          waveMovementY += sin(frameCount * 0.05) * 20;
          waveMovementX += cos(frameCount * 0.05) * 10;
  
          rotationAngle = sin(frameCount * 0.1) * PI / 16;
        }
      } else if (currentMood === 'Angry') {
        fill(color(random(0, 50), random(150, 255), random(0, 50))); 
        waveMovementY = (sin(frameCount * 0.4) * 8 + cos(frameCount * 0.5) * 8) * (this.isHovered ? 2 : 1);
        waveMovementX = (cos(frameCount * 0.6) * 5 + sin(frameCount * 0.7) * 5) * (this.isHovered ? 2 : 1);
        
        if (this.isHovered) {
          fontSizeMultiplier = 1.5; 
          rotationAngle = sin(frameCount * 0.2) * PI / 6; 
        }
      } else if (currentMood === 'Sad') {
        fill(textColor);
        waveMovementY = random(-2, 4);
      } else {
        fill(textColor); 
      }
  
      textSize(this.currentSize * fontSizeMultiplier);
  
      push();
      translate(this.x + waveMovementX, this.y + waveMovementY);
      if (rotationAngle !== 0) {
        rotate(rotationAngle); 
      }
      text(this.char, 0, 0);
      pop();
    }
  }
  