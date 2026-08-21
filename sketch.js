let faceMesh;
let faces = [];

let video;
let bg;

let camW = 640;
let camH = 480;

let displayW = 1440;
let displayH = 1080;

let camX;
let camY;

let options = {
  maxFaces: 5,
  refineLandmarks: false,
  flipped: true
};

let handPose;
let hands = [];

let logo;
let cube;
let cobek;
let coffee;
let gamelan;
let kancing;
let kites;
let meow;
let movie;
let recycle;
let soap;
let sugar;

let blue;
let purple;
let red;
let cone;
let warn;
let stoppy;

let charactersLeft;
let charactersRight;

let characterProgress = 0;
let characterSpeed = 0.04;

let lastHandTime = 0;
let handTimeout = 8000;

let characterState = "hidden";

let signProgress = 0;
let signSpeed = 0.08;
let signState = "hidden";

let filterBuffer;


function preload() {
  faceMesh = ml5.faceMesh(options);

  handPose = ml5.handPose({
    flipped: true
  });

  bg = loadImage("asset/bg.png");

  logo = loadImage("asset/logo.png");
  cube = loadImage("asset/cube.png");
  cobek = loadImage("asset/cobek.png");
  coffee = loadImage("asset/coffee.png");
  gamelan = loadImage("asset/gamelan.png");
  kancing = loadImage("asset/kancing.png");
  kites = loadImage("asset/kites.png");
  meow = loadImage("asset/meow.png");
  movie = loadImage("asset/movie.png");
  recycle = loadImage("asset/recycle.png");
  soap = loadImage("asset/soap.png");
  sugar = loadImage("asset/sugar.png");

  charactersLeft = loadImage("asset/character_left.png");
  charactersRight = loadImage("asset/character_right.png");

  blue = loadImage("asset/blue.png");
  purple = loadImage("asset/purple.png");
  red = loadImage("asset/red.png");
  cone = loadImage("asset/cone.png");
  warn = loadImage("asset/warn.png");
  stoppy = loadImage("asset/stop.png");
}


function setup() {
  createCanvas(windowWidth, windowHeight);

  filterBuffer = createGraphics(displayW, displayH);

  video = createCapture(VIDEO, {
    flipped: true
  });

  video.size(camW, camH);
  video.hide();

  camX = (width - displayW) / 2;
  camY = (height - displayH) / 2 + 200;

  faceMesh.detectStart(video, gotFaces);
  handPose.detectStart(video, gotHands);
}


function draw() {
  image(bg, 0, 0, width, height);

  image(video, camX, camY, displayW, displayH);

  filterBuffer.clear();


  if (faces.length > 0) {
    for (let i = 0; i < faces.length; i++) {
      drawFaceAssets(faces[i]);
    }
  }

  image(filterBuffer, camX, camY);


  // Camera border
  stroke("#751014");
  strokeWeight(3);
  noFill();

  rect(
    camX,
    camY,
    displayW,
    displayH
  );


  let allFingersOpen = false;

  if (hands.length > 0) {

    let hand = hands[0];

    let wrist = hand.keypoints[0];

    let index = hand.keypoints[8];
    let indexPIP = hand.keypoints[6];

    let middle = hand.keypoints[12];
    let middlePIP = hand.keypoints[10];

    let ring = hand.keypoints[16];
    let ringPIP = hand.keypoints[14];

    let pinky = hand.keypoints[20];
    let pinkyPIP = hand.keypoints[18];

    let thumb = hand.keypoints[4];
    let thumbIP = hand.keypoints[3];


    let indexOpen =
      dist(
        wrist.x,
        wrist.y,
        index.x,
        index.y
      ) >
      dist(
        wrist.x,
        wrist.y,
        indexPIP.x,
        indexPIP.y
      );


    let middleOpen =
      dist(
        wrist.x,
        wrist.y,
        middle.x,
        middle.y
      ) >
      dist(
        wrist.x,
        wrist.y,
        middlePIP.x,
        middlePIP.y
      );


    let ringOpen =
      dist(
        wrist.x,
        wrist.y,
        ring.x,
        ring.y
      ) >
      dist(
        wrist.x,
        wrist.y,
        ringPIP.x,
        ringPIP.y
      );


    let pinkyOpen =
      dist(
        wrist.x,
        wrist.y,
        pinky.x,
        pinky.y
      ) >
      dist(
        wrist.x,
        wrist.y,
        pinkyPIP.x,
        pinkyPIP.y
      );


    let thumbOpen =
      dist(
        wrist.x,
        wrist.y,
        thumb.x,
        thumb.y
      ) >
      dist(
        wrist.x,
        wrist.y,
        thumbIP.x,
        thumbIP.y
      );


    allFingersOpen =
      indexOpen &&
      middleOpen &&
      ringOpen &&
      pinkyOpen &&
      thumbOpen;


    if (allFingersOpen) {

      lastHandTime = millis();


      if (
        characterState === "hidden" ||
        characterState === "exiting"
      ) {

        characterState = "entering";
        characterProgress = 0;
      }


      if (
        signState === "hidden" ||
        signState === "exiting"
      ) {

        signState = "entering";
        signProgress = 0;
      }
    }
  }


  if (
    characterState === "visible" &&
    millis() - lastHandTime > handTimeout
  ) {

    characterState = "exiting";
    characterProgress = 1;
  }


  if (characterState === "entering") {

    characterProgress += characterSpeed;

    characterProgress =
      constrain(
        characterProgress,
        0,
        1
      );


    if (characterProgress >= 1) {

      characterProgress = 1;
      characterState = "visible";
    }
  }


  if (characterState === "exiting") {

    characterProgress -= characterSpeed;

    characterProgress =
      constrain(
        characterProgress,
        0,
        1
      );


    if (characterProgress <= 0) {

      characterProgress = 0;
      characterState = "hidden";
    }
  }


  if (
    characterState === "entering" ||
    characterState === "visible" ||
    characterState === "exiting"
  ) {

    drawCharacters();
  }

  if (
    signState === "visible" &&
    millis() - lastHandTime > handTimeout
  ) {

    signState = "exiting";
    signProgress = 1;
  }


  if (signState === "entering") {

    signProgress += signSpeed;

    signProgress =
      constrain(
        signProgress,
        0,
        1
      );


    if (signProgress >= 1) {

      signProgress = 1;
      signState = "visible";
    }
  }


  if (signState === "exiting") {

    signProgress -= signSpeed;

    signProgress =
      constrain(
        signProgress,
        0,
        1
      );


    if (signProgress <= 0) {

      signProgress = 0;
      signState = "hidden";
    }
  }


  if (
    signState === "entering" ||
    signState === "visible" ||
    signState === "exiting"
  ) {

    drawsignAssets();
  }
}


function drawFaceAssets(face) {

  drawAsset(
    logo,
    face,
    151,
    243,
    58,
    0,
    -45
  );


  drawAsset(
    cube,
    face,
    139,
    40,
    43,
    -15,
    -20
  );


  drawAsset(
    soap,
    face,
    143,
    27,
    46,
    -40,
    0
  );


  drawAsset(
    gamelan,
    face,
    116,
    45,
    36,
    -40,
    25
  );


  drawAsset(
    cobek,
    face,
    123,
    43,
    36,
    -25,
    50
  );


  drawAsset(
    kites,
    face,
    187,
    34,
    46,
    -15,
    65
  );


  drawAsset(
    movie,
    face,
    368,
    46,
    43,
    15,
    -20
  );


  drawAsset(
    recycle,
    face,
    372,
    35,
    33,
    40,
    -5
  );


  drawAsset(
    sugar,
    face,
    447,
    25,
    38,
    40,
    20
  );


  drawAsset(
    meow,
    face,
    352,
    38,
    31,
    45,
    40
  );


  drawAsset(
    kancing,
    face,
    364,
    33,
    34,
    40,
    20
  );
}

function drawAsset(
  asset,
  face,
  landmarkIndex,
  w,
  h,
  offsetX = 0,
  offsetY = 0
) {

  let point =
    face.keypoints[landmarkIndex];


  let leftEye =
    face.keypoints[33];


  let rightEye =
    face.keypoints[263];


  let scaleX =
    displayW / camW;


  let scaleY =
    displayH / camH;


  let pointX =
    point.x * scaleX;


  let pointY =
    point.y * scaleY;


  let leftEyeX =
    leftEye.x * scaleX;


  let leftEyeY =
    leftEye.y * scaleY;


  let rightEyeX =
    rightEye.x * scaleX;


  let rightEyeY =
    rightEye.y * scaleY;


  let eyeDistance =
    dist(
      leftEyeX,
      leftEyeY,
      rightEyeX,
      rightEyeY
    );


  let faceScale =
    eyeDistance / 100;


  let angle =
    atan2(
      rightEyeY - leftEyeY,
      rightEyeX - leftEyeX
    );


  filterBuffer.push();


  filterBuffer.translate(
    pointX,
    pointY
  );


  filterBuffer.rotate(angle);


  filterBuffer.scale(
    faceScale
  );


  filterBuffer.imageMode(
    CENTER
  );


  filterBuffer.image(
    asset,
    offsetX,
    offsetY,
    w,
    h
  );


  filterBuffer.pop();
}


function drawCharacters() {

  let p;


  if (characterState === "exiting") {

    p =
      easeIn(
        characterProgress
      );

  } else {

    p =
      easeOut(
        characterProgress
      );
  }


  let groupH =
    height;


  let leftGroupW =
    groupH *
    charactersLeft.width /
    charactersLeft.height;


  let rightGroupW =
    groupH *
    charactersRight.width /
    charactersRight.height;


  drawCharacterGroup(
    charactersLeft,
    -leftGroupW,
    0,
    0,
    0,
    leftGroupW,
    groupH,
    p
  );


  drawCharacterGroup(
    charactersRight,
    width,
    0,
    width - rightGroupW,
    0,
    rightGroupW,
    groupH,
    p
  );
}


function drawCharacterGroup(
  img,
  startX,
  startY,
  targetX,
  targetY,
  w,
  h,
  progress
) {

  let x =
    lerp(
      startX,
      targetX,
      progress
    );


  let y =
    lerp(
      startY,
      targetY,
      progress
    );


  imageMode(CORNER);


  image(
    img,
    x,
    y,
    w,
    h
  );
}

function drawsignAssets() {

  let p =
    signState === "exiting"
      ? easeIn(signProgress)
      : easeOut(signProgress);


  drawsignAsset(
    blue,
    camX,
    camY + 35,
    112,
    106,
    p,
    1
  );


  drawsignAsset(
    purple,
    camX + displayW,
    camY + 120,
    118,
    112,
    p,
    2
  );


  drawsignAsset(
    cone,
    camX,
    camY + 500,
    122,
    142,
    p,
    3
  );


  drawsignAsset(
    warn,
    camX + displayW,
    camY + 500,
    118,
    190,
    p,
    4
  );


  drawsignAsset(
    stoppy,
    camX,
    camY + displayH,
    124,
    210,
    p,
    5
  );


  drawsignAsset(
    red,
    camX + displayW,
    camY + displayH,
    92,
    86,
    p,
    6
  );
}


function drawsignAsset(
  asset,
  x,
  y,
  w,
  h,
  progress,
  offset
) {

  push();


  imageMode(CENTER);


  translate(
    x,
    y
  );


  let scaleAmount =
    easeOut(progress) * 1.12;


  let rotation =
    sin(
      frameCount * 0.08 + offset
    ) *
    0.12 *
    progress;


  scale(
    scaleAmount
  );


  rotate(
    rotation
  );


  image(
    asset,
    0,
    0,
    w,
    h
  );


  pop();
}


// =========================================================
// EASING
// =========================================================

function easeOut(t) {

  return 1 -
    pow(
      1 - t,
      3
    );
}


function easeIn(t) {

  return pow(
    t,
    3
  );
}


// =========================================================
// ML5 CALLBACKS
// =========================================================

function gotFaces(results) {

  faces = results;

  // Useful for testing:
  console.log(
    "Faces detected:",
    faces.length
  );
}


function gotHands(results) {

  hands = results;
}


// =========================================================
// RESIZE
// =========================================================

function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );


  camX =
    (width - displayW) / 2;


  camY =
    (height - displayH) / 2 + 200;
}
