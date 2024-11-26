let font;
let letters = [];
let wordComplete = false;
let exploded = false;
let editableString = "";
let defaultTextSize = 48;
let scaleFactor = 1;
let currentMood = ''; 
let waveOffset = 0;
let moodSelected = false; 
let buttons = []; 
let lineHeight = defaultTextSize * 1.8; 


function preload() {
  font = loadFont("assets/ArialBold.otf"); 
	angryFont = loadFont("assets/Impact.otf");
	sadFont = loadFont("assets/HoneybeeBeeline-mDPv.otf")
	happyFont = loadFont("assets/MoodyadolescentRegular-jE00v.otf")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);

  setupMoodSelection();
}

function draw() {
  background(30);

  if (!moodSelected) {
    drawMoodSelection();
  } else {
    drawTypingPage();
  }
}

function setupMoodSelection() {
  buttons = []; 

  let buttonWidth = 120; 
  let buttonHeight = 50;  
  let textSizeValue = 36; 
  let textSpacing = 35;  
	
  textSize(textSizeValue); 
  let textY = height / 2 - 100; 

  let buttonY = textY + textSizeValue + textSpacing; 

  // Happy Button
  let happyButton = createButton('Happy');
  happyButton.position(width / 2 - 200, buttonY); 
  styleButton(happyButton, '#FBD288', buttonWidth, buttonHeight);
  happyButton.mousePressed(() => selectMood('Happy'));
  buttons.push(happyButton);

  // Angry Button
  let angryButton = createButton('Angry');
  angryButton.position(width / 2 - 60, buttonY); // Neben Happy
  styleButton(angryButton, '#D91656', buttonWidth, buttonHeight);
  angryButton.mousePressed(() => selectMood('Angry'));
  buttons.push(angryButton);

  // Sad Button
  let sadButton = createButton('Scared');
  sadButton.position(width / 2 + 80, buttonY); // Neben Angry
  styleButton(sadButton, '#80C4E9', buttonWidth, buttonHeight);
  sadButton.mousePressed(() => selectMood('Sad'));
  buttons.push(sadButton);
}

function styleButton(button, color, width, height) {
  button.style('font-size', '18px');
  button.style('background-color', color);
  button.style('color', 'white');
  button.style('border', 'none');
  button.style('border-radius', '15px'); 
  button.style('padding', '10px');
  button.style('width', `${width}px`);
  button.style('height', `${height}px`);
  button.style('box-shadow', '2px 4px 6px rgba(0,0,0,0.3)'); 
  button.style('cursor', 'pointer');
  button.style('transition', 'all 0.2s'); 

  button.mouseOver(() => button.style('transform', 'scale(1.1)')); 
  button.mouseOut(() => button.style('transform', 'scale(1)')); 
}

function drawMoodSelection() {
  fill(255);
  textSize(36);
	textFont(font)
  text("Whats the mood of your font?", width / 2, height / 2 - 100); 
}

function selectMood(mood) {
  currentMood = mood;
  console.log(`Mood selected: ${mood}`);
  moodSelected = true; 

  for (let button of buttons) {
    button.remove();
  }
  buttons = [];

  if (mood === 'Happy') {
		textFont(happyFont);
    backgroundColor = '#FBD288';
  } else if (mood === 'Angry') {
		textFont(angryFont);
    backgroundColor = '#D91656';
    textColor = color(144, 238, 144); 
  } else if (mood === 'Sad') {
		textFont(sadFont);
    backgroundColor = '#808080'; 
    textColor = color(128, 196, 233); // Blau
  }
}


function drawTypingPage() {
  background(backgroundColor); // Verwende die eingestellte Hintergrundfarbe

  let textWidthValue = calculateTextWidth(editableString);
  let maxTextWidth = width - 40;

  if (textWidthValue > maxTextWidth) {
    scaleFactor = maxTextWidth / textWidthValue;
  } else {
    scaleFactor = 1;
  }

  let scaledTextSize = defaultTextSize * scaleFactor;

  textSize(scaledTextSize);

  for (let i = 0; i < letters.length; i++) {
    let letter = letters[i];
    letter.update();
    letter.display(scaledTextSize, i);
  }

  if (letters.length === 0 && !wordComplete && !exploded) {
    fill(255, 200);
    textSize(defaultTextSize);
    text("Type a word...", width / 2, height / 2);
  }
}



function keyTyped() {
  if (key === 'Enter' || key === 'Backspace') {
    return; 
  }

  if (!wordComplete && !exploded) {
    editableString += key;
    letters.push(new Letter(key, random(width), -50)); 
  }
}

function mousePressed() {
  if (!wordComplete && !exploded && letters.length > 0) {
    formWord();
  } else if (wordComplete && !exploded) {
    explodeWord();
  } else if (exploded) {
    resetAnimation();
  }
}

function formWord() {
  let maxLettersPerLine = 25; 
  let spacing = 50; // Einheitlicher Abstand zwischen Buchstaben
  let lineHeight = defaultTextSize * 1.5; 
  let numLines = ceil(letters.length / maxLettersPerLine); 

  for (let line = 0; line < numLines; line++) {
    let startIndex = line * maxLettersPerLine;
    let endIndex = min((line + 1) * maxLettersPerLine, letters.length);
    let lineLength = endIndex - startIndex;

    let startX = width / 2 - (lineLength * spacing) / 2;
    let startY = height / 2 - ((numLines - 1) * lineHeight) / 2 + line * lineHeight;

    for (let i = startIndex; i < endIndex; i++) {
      let targetX = startX + (i - startIndex) * spacing;
      let targetY = startY;

      letters[i].moveTo(targetX, targetY);
    }
  }

  wordComplete = true;
}

function explodeWord() {
  for (let letter of letters) {
    letter.explode();
  }
  exploded = true;
}

function resetAnimation() {
  letters = [];
  wordComplete = false;
  exploded = false;
  editableString = "";

  moodSelected = false;
  setupMoodSelection();
}

function calculateTextWidth(str) {
  textSize(defaultTextSize);
  return textWidth(str);
}

function setMoodStyle(mood) {
  if (mood === 'Happy') {
    defaultTextSize = 64; // Größer für Happy
    textFont(font);
    fill(255, 204, 0);
    textStyle(BOLD);
  } else if (mood === 'Sad') {
    defaultTextSize = 48; // Etwas kleiner für Sad
    textFont(font);
    fill(0, 0, 255);
    textStyle(ITALIC);
  } else if (mood === 'Angry') {
    defaultTextSize = 72; // Sehr groß für Angry
    textFont(angryFont);
    fill(255, 0, 0);
    textStyle(BOLD);
  } 
}
