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
  
      this.color = color(random(50, 200), random(50, 200), random(50, 200)); // Farbe für Happy
  
      this.exploded = false;
      this.initialSize = 44;
      this.currentSize = this.initialSize * 2; 
      this.sizeGrowSpeed = 0.2; 
      this.sizeShrinkSpeed = 0.3; 
      this.scaredOffset = createVector(0, 0); // Offset für Scared-Reaktion
  
      this.visible = true; // Sichtbarkeit des Buchstabens
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
  
      // Scared-Reaktion
      if (currentMood === 'Sad') {
        this.visible = !this.isHovered; // Buchstabe verschwindet, wenn Maus darüber
      }
    }
  
    display(scaledTextSize, index) {
      if (!this.exploded && !this.visible) return;
  
      let waveMovementY = 0;
      let waveMovementX = 0;
      let rotationAngle = 0; // Für Drehung im Happy-Modus
      let fontSizeMultiplier = 1; // Keine Größenänderung im Happy-Modus
  
      if (currentMood === 'Happy') {
        // Happy-Verhalten
        fill(this.color);
        let waveAmplitude = this.isHovered ? 40 : 15; // Viel stärkere Schwingung bei Hover
        waveMovementY = sin(TWO_PI * (frameCount + index * 10) / 100) * waveAmplitude;
        waveMovementX = cos(TWO_PI * (frameCount + index * 10) / 120) * waveAmplitude * 0.5;
  
        if (this.isHovered) {
          // Hüpfen oder verstärkte Bewegungen nach oben/unten
          waveMovementY += sin(frameCount * 0.05) * 20;
          waveMovementX += cos(frameCount * 0.05) * 10;
  
          // Kleine Drehung für eine verspielte Note
          rotationAngle = sin(frameCount * 0.1) * PI / 16;
        }
      } else if (currentMood === 'Angry') {
        // Angry-Verhalten bleibt grün
        fill(color(random(0, 50), random(150, 255), random(0, 50))); // Pulsierend grün
        waveMovementY = (sin(frameCount * 0.4) * 8 + cos(frameCount * 0.5) * 8) * (this.isHovered ? 2 : 1);
        waveMovementX = (cos(frameCount * 0.6) * 5 + sin(frameCount * 0.7) * 5) * (this.isHovered ? 2 : 1);
        
        if (this.isHovered) {
          fontSizeMultiplier = 1.5; // Buchstabe wird noch größer
          rotationAngle = sin(frameCount * 0.2) * PI / 6; // Schütteln beim Hover
        }
      } else if (currentMood === 'Sad') {
        // Sad-Verhalten
        fill(textColor);
        waveMovementY = random(-2, 4);
      } else {
        fill(textColor); // Standardfarbe
      }
  
      textSize(this.currentSize * fontSizeMultiplier);
  
      push();
      translate(this.x + waveMovementX, this.y + waveMovementY);
      if (rotationAngle !== 0) {
        rotate(rotationAngle); // Drehung im Happy-Modus
      }
      text(this.char, 0, 0);
      pop();
    }
  }
  