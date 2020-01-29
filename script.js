"use strict"
var RAF = // находим, какой метод доступен
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  // ни один не доступен
  // будем работать просто по таймеру
  function (callback) { window.setTimeout(callback, 1000 / 60); };

RAF(tick);

// позиции лап волка с корзиной: 
// 1 - слева верх
// 2 - справа верх
// 3 - слева низ 
// 4 - справа низ
var gameRun = false; // состояние игры: true - игра идет, false - игра остановлена
var count = 0; // количество пойманных яиц
var lastCount = 0; // окончательное количество пойманных яиц
var lostCount = 0; // количество потерянных яиц
var soundState = 1; // состояние звуков игры: 0 - выключены, 1 - включены
var handState = 0; // положение рук: 1 - позиция 1, 2 - позиция 2, 3 - позиция 3, 4 - позиция 4
var score = document.getElementById('score'); // счет
score.innerHTML = count;

var mainDiv = document.getElementById('main');
var hand = document.getElementById('hand');
var basket = document.getElementById('basket');
var handBasket = document.getElementById('hand_basket');
var chickLeft = document.getElementById('chick_left');
var chickLeftRun = document.getElementById('chick_left_run');
var chickRight = document.getElementById('chick_right');
var chickRightRun = document.getElementById('chick_right_run');
var headLeft = document.getElementById('head_left');
var headRight = document.getElementById('head_right');
var chickBreak1 = document.getElementById('chick_break1');
var chickBreak2 = document.getElementById('chick_break2');
var chickBreak3 = document.getElementById('chick_break3');
var upRightButton = document.getElementById('upRight');
var upRightButton1 = document.getElementById('upRight1');
var downRightButton = document.getElementById('downRight');
var downRightButton1 = document.getElementById('downRight1');
var upLeftButton = document.getElementById('upLeft');
var upLeftButton1 = document.getElementById('upLeft1');
var downLeftButton = document.getElementById('downLeft');
var downLeftButton1 = document.getElementById('downLeft1');
var gameOver = document.getElementById('gameOver');
var gameOverOK = document.getElementById('second');
var gameOverOK1 = document.getElementById('second2');
var registration = document.getElementById('registration');
var registOK = document.getElementById('remember');
var registOK1 = document.getElementById('remember1');
var registClose = document.getElementById('closeR');
var registClose1 = document.getElementById('closeR1');
var gamerName = document.getElementById('gName');
var tableButton = document.getElementById('tableButton');
var tableButton1 = document.getElementById('tableButton1');
var scoreTable = document.getElementById('table');
var textTable = document.getElementById('textTable');
var closeTableOK = document.getElementById('closeTable');
var closeTableOK1 = document.getElementById('closeTable1');
var yourScore = document.getElementById('lastCount');
var rulesButton = document.getElementById('ruleButton');
var rulesButton1 = document.getElementById('ruleButton1');
var rulesOK = document.getElementById('closeRules');
var rulesOK1 = document.getElementById('closeRules1');
var rules = document.getElementById('rules');
var soundOnButton = document.getElementById('soundOn');
var soundOffButton = document.getElementById('soundOff');


var startButton = document.getElementById('start');
var startButton1 = document.getElementById('start1');

var svgElem = document.getElementById('gameField');

var egg1 = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse'); // яйцо №1 справа вверху
egg1.setAttribute('cx', 55);
egg1.setAttribute('cy', 53.8);
egg1.setAttribute('rx', 1.2);
egg1.setAttribute('ry', 1.8);
egg1.setAttribute('stroke', 'black');
egg1.setAttribute('stroke-width', 0.2);
egg1.setAttribute('fill', 'white');
egg1.setAttribute('display', 'none');
svgElem.appendChild(egg1);

var egg2 = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse'); // яйцо №2 слева вверху
egg2.setAttribute('cx', 147);
egg2.setAttribute('cy', 53);
egg2.setAttribute('rx', 1.2);
egg2.setAttribute('ry', 1.8);
egg2.setAttribute('stroke', 'black');
egg2.setAttribute('stroke-width', 0.2);
egg2.setAttribute('fill', 'white');
egg2.setAttribute('display', 'none');
svgElem.appendChild(egg2);

var egg3 = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse'); // яйцо №3 справа внизу
egg3.setAttribute('cx', 55);
egg3.setAttribute('cy', 72.5);
egg3.setAttribute('rx', 1.2);
egg3.setAttribute('ry', 1.8);
egg3.setAttribute('stroke', 'black');
egg3.setAttribute('stroke-width', 0.2);
egg3.setAttribute('fill', 'white');
egg3.setAttribute('display', 'none');
svgElem.appendChild(egg3);

var egg4 = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse'); // яйцо №4  слева внизу
egg4.setAttribute('cx', 147);
egg4.setAttribute('cy', 71.5);
egg4.setAttribute('rx', 1.2);
egg4.setAttribute('ry', 1.8);
egg4.setAttribute('stroke', 'black');
egg4.setAttribute('stroke-width', 0.2);
egg4.setAttribute('fill', 'white');
egg4.setAttribute('display', 'none');
svgElem.appendChild(egg4);

// текущие коррдинаты яйца №1
var placeEgg1 = {
  posX: egg1.cx.baseVal.value,
  posY: egg1.cy.baseVal.value,
  speedX: 0,
  speedY: 0,
  angle: 0,
  speedAngle: 0,

  update: function () {
    egg1.setAttribute('cx', this.posX);
    egg1.setAttribute('cy', this.posY);
    egg1.setAttribute("transform", "rotate (" + this.angle + ", " + this.posX + ", " + this.posY + ")");
  }
}

// текущие коррдинаты яйца №2
var placeEgg2 = {
  posX: egg2.cx.baseVal.value,
  posY: egg2.cy.baseVal.value,
  speedX: 0,
  speedY: 0,
  angle: 0,
  speedAngle: 0,

  update: function () {
    egg2.setAttribute('cx', this.posX);
    egg2.setAttribute('cy', this.posY);
    egg2.setAttribute("transform", "rotate (" + this.angle + ", " + this.posX + ", " + this.posY + ")");
  }
}

// текущие коррдинаты яйца №3
var placeEgg3 = {
  posX: egg3.cx.baseVal.value,
  posY: egg3.cy.baseVal.value,
  speedX: 0,
  speedY: 0,
  angle: 0,
  speedAngle: 0,

  update: function () {
    egg3.setAttribute('cx', this.posX);
    egg3.setAttribute('cy', this.posY);
    egg3.setAttribute("transform", "rotate (" + this.angle + ", " + this.posX + ", " + this.posY + ")");
  }
}

// текущие коррдинаты яйца №4
var placeEgg4 = {
  posX: egg4.cx.baseVal.value,
  posY: egg4.cy.baseVal.value,
  speedX: 0,
  speedY: 0,
  angle: 0,
  speedAngle: 0,

  update: function () {
    egg4.setAttribute('cx', this.posX);
    egg4.setAttribute('cy', this.posY);
    egg4.setAttribute("transform", "rotate (" + this.angle + ", " + this.posX + ", " + this.posY + ")");
  }
}

// текущие коррдинаты цыпленка, который убегает вправо
var chickRightRunH = {
  posX: 133,
  speedX: 0,

  update: function () {
    chickRightRun.setAttribute('x', this.posX);
  }
}

// текущие коррдинаты цыпленка, который убегает влево
var chickLeftRunH = {
  posX: 59.5,
  speedX: 0,

  update: function () {
    chickLeftRun.setAttribute('x', this.posX);
  }
}

//анимация движения лап волка с корзиной из позиции 1 в позицию 3
var ani1 = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
ani1.setAttribute("attributeName", "transform");
ani1.setAttribute("id", "myAnimation1");
ani1.setAttribute("attributeType", "xml");
ani1.setAttribute("type", "rotate");
ani1.setAttribute("from", "0, 100, 72");
ani1.setAttribute("to", "-35, 100, 72");
ani1.setAttribute("begin", "0s");
ani1.setAttribute("dur", "500ms");
ani1.setAttribute('fill', 'freeze');
//анимация движения лап волка с корзиной из позиции 2 в позицию 3
var ani2 = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
ani2.setAttribute("attributeName", "transform");
ani2.setAttribute("id", "myAnimation2");
ani2.setAttribute("attributeType", "xml");
ani2.setAttribute("type", "rotate");
ani2.setAttribute("from", "155, 100, 72");
ani2.setAttribute("to", "320, 100, 72");
ani2.setAttribute("begin", "0s");
ani2.setAttribute("dur", "500ms");
ani2.setAttribute('fill', 'freeze');
//анимация движения лап волка с корзиной из позиции 4 в позицию 3
var ani3 = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
ani3.setAttribute("attributeName", "transform");
ani3.setAttribute("id", "myAnimation3");
ani3.setAttribute("attributeType", "xml");
ani3.setAttribute("type", "rotate");
ani3.setAttribute("from", "190, 100, 72");
ani3.setAttribute("to", "320, 100, 72");
ani3.setAttribute("begin", "0s");
ani3.setAttribute("dur", "500ms");
ani3.setAttribute('fill', 'freeze');
//анимация движения лап волка с корзиной из позиции 2 в позицию 1
var ani4 = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
ani4.setAttribute("attributeName", "transform");
ani4.setAttribute("id", "myAnimation4");
ani4.setAttribute("attributeType", "xml");
ani4.setAttribute("type", "rotate");
ani4.setAttribute("from", "155, 100, 72");
ani4.setAttribute("to", "0, 100, 72");
ani4.setAttribute("begin", "0s");
ani4.setAttribute("dur", "500ms");
ani4.setAttribute('fill', 'freeze');
//анимация движения лап волка с корзиной из позиции 3 в позицию 1
var ani5 = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
ani5.setAttribute("attributeName", "transform");
ani5.setAttribute("id", "myAnimation5");
ani5.setAttribute("attributeType", "xml");
ani5.setAttribute("type", "rotate");
ani5.setAttribute("from", "320, 100, 72");
ani5.setAttribute("to", "360, 100, 72");
ani5.setAttribute("begin", "0s");
ani5.setAttribute("dur", "500ms");
ani5.setAttribute('fill', 'freeze');
//анимация движения лап волка с корзиной из позиции 4 в позицию 1
var ani6 = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
ani6.setAttribute("attributeName", "transform");
ani6.setAttribute("id", "myAnimation6");
ani6.setAttribute("attributeType", "xml");
ani6.setAttribute("type", "rotate");
ani6.setAttribute("from", "190, 100, 72");
ani6.setAttribute("to", "360, 100, 72");
ani6.setAttribute("begin", "0s");
ani6.setAttribute("dur", "500ms");
ani6.setAttribute('fill', 'freeze');
//анимация движения лап волка с корзиной из позиции 1 в позицию 2
var ani7 = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
ani7.setAttribute("attributeName", "transform");
ani7.setAttribute("id", "myAnimation7");
ani7.setAttribute("attributeType", "xml");
ani7.setAttribute("type", "rotate");
ani7.setAttribute("from", "0, 100, 72");
ani7.setAttribute("to", "140, 100, 72");
ani7.setAttribute("begin", "0s");
ani7.setAttribute("dur", "500ms");
ani7.setAttribute('fill', 'freeze');
//анимация движения лап волка с корзиной из позиции 3 в позицию 2
var ani8 = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
ani8.setAttribute("attributeName", "transform");
ani8.setAttribute("id", "myAnimation8");
ani8.setAttribute("attributeType", "xml");
ani8.setAttribute("type", "rotate");
ani8.setAttribute("from", "-35, 100, 72");
ani8.setAttribute("to", "140, 100, 72");
ani8.setAttribute("begin", "0s");
ani8.setAttribute("dur", "500ms");
ani8.setAttribute('fill', 'freeze');
//анимация движения лап волка с корзиной из позиции 4 в позицию 2
var ani9 = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
ani9.setAttribute("attributeName", "transform");
ani9.setAttribute("id", "myAnimation9");
ani9.setAttribute("attributeType", "xml");
ani9.setAttribute("type", "rotate");
ani9.setAttribute("from", "190, 100, 72");
ani9.setAttribute("to", "140, 100, 72");
ani9.setAttribute("begin", "0s");
ani9.setAttribute("dur", "500ms");
ani9.setAttribute('fill', 'freeze');
//анимация движения лап волка с корзиной из позиции 1 в позицию 4
var ani10 = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
ani10.setAttribute("attributeName", "transform");
ani10.setAttribute("id", "myAnimation10");
ani10.setAttribute("attributeType", "xml");
ani10.setAttribute("type", "rotate");
ani10.setAttribute("from", "0, 100, 72");
ani10.setAttribute("to", "180, 100, 72");
ani10.setAttribute("begin", "0s");
ani10.setAttribute("dur", "500ms");
ani10.setAttribute('fill', 'freeze');
//анимация движения лап волка с корзиной из позиции 2 в позицию 4
var ani11 = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
ani11.setAttribute("attributeName", "transform");
ani11.setAttribute("id", "myAnimation11");
ani11.setAttribute("attributeType", "xml");
ani11.setAttribute("type", "rotate");
ani11.setAttribute("from", "155, 100, 72");
ani11.setAttribute("to", "180, 100, 72");
ani11.setAttribute("begin", "0s");
ani11.setAttribute("dur", "500ms");
ani11.setAttribute('fill', 'freeze');
//анимация движения лап волка с корзиной из позиции 3 в позицию 4
var ani12 = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
ani12.setAttribute("attributeName", "transform");
ani12.setAttribute("id", "myAnimation12");
ani12.setAttribute("attributeType", "xml");
ani12.setAttribute("type", "rotate");
ani12.setAttribute("from", "320, 100, 72");
ani12.setAttribute("to", "180, 100, 72");
ani12.setAttribute("begin", "0s");
ani12.setAttribute("dur", "500ms");
ani12.setAttribute('fill', 'freeze');
//анимация движения корзины в позиции 3
var bani1 = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
bani1.setAttribute("attributeName", "transform");
bani1.setAttribute("id", "myAnimationb1");
bani1.setAttribute("attributeType", "xml");
bani1.setAttribute("type", "rotate");
bani1.setAttribute("from", "0, 77, 68");
bani1.setAttribute("to", "45, 77, 68");
bani1.setAttribute("begin", "0s");
bani1.setAttribute("dur", "200ms");
bani1.setAttribute('fill', 'freeze');
//анимация движения корзины в позиции 1
var bani2 = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
bani2.setAttribute("attributeName", "transform");
bani2.setAttribute("id", "myAnimationb2");
bani2.setAttribute("attributeType", "xml");
bani2.setAttribute("type", "rotate");
bani2.setAttribute("from", "60, 77, 68");
bani2.setAttribute("to", "10, 77, 68");
bani2.setAttribute("begin", "0s");
bani2.setAttribute("dur", "200ms");
bani2.setAttribute('fill', 'freeze');
//анимация движения корзины в позиции 2
var bani3 = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
bani3.setAttribute("attributeName", "transform");
bani3.setAttribute("id", "myAnimationb3");
bani3.setAttribute("attributeType", "xml");
bani3.setAttribute("type", "rotate");
bani3.setAttribute("from", "0, 76.5, 64");
bani3.setAttribute("to", "-110, 76.5, 64");
bani3.setAttribute("begin", "0s");
bani3.setAttribute("dur", "200ms");
bani3.setAttribute('fill', 'freeze');
//анимация движения корзины в позиции 4
var bani4 = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
bani4.setAttribute("attributeName", "transform");
bani4.setAttribute("id", "myAnimationb4");
bani4.setAttribute("attributeType", "xml");
bani4.setAttribute("type", "rotate");
bani4.setAttribute("from", "-130, 76.5, 65");
bani4.setAttribute("to", "-150, 76.5, 65");
bani4.setAttribute("begin", "0s");
bani4.setAttribute("dur", "200ms");
bani4.setAttribute('fill', 'freeze');
//анимация движения корзины при ее перемещении из позиции 4 в позицию 3
var bani5 = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
bani5.setAttribute("attributeName", "transform");
bani5.setAttribute("id", "myAnimationb5");
bani5.setAttribute("attributeType", "xml");
bani5.setAttribute("type", "rotate");
bani5.setAttribute("from", "210, 76.5, 65");
bani5.setAttribute("to", "240, 76.5, 65");
bani5.setAttribute("begin", "0s");
bani5.setAttribute("dur", "200ms");
bani5.setAttribute('fill', 'freeze');
handBasket.appendChild(ani12);
handBasket.appendChild(ani11);
handBasket.appendChild(ani10);
handBasket.appendChild(ani9);
handBasket.appendChild(ani8);
handBasket.appendChild(ani7);
handBasket.appendChild(ani6);
handBasket.appendChild(ani4);
handBasket.appendChild(ani3);
handBasket.appendChild(ani1);
handBasket.appendChild(ani2);
handBasket.appendChild(ani5);
basket.appendChild(bani5);
basket.appendChild(bani3);
basket.appendChild(bani4);
basket.appendChild(bani2);
basket.appendChild(bani1);
//анимация появления и исчезновения разбившегося яйца с цыпленком
var cani2 = document.createElementNS("http://www.w3.org/2000/svg", "animate");
cani2.setAttribute("attributeName", "opacity");
cani2.setAttribute("id", "myAnimationc2");
cani2.setAttribute("attributeType", "css");
cani2.setAttribute("from", '0');
cani2.setAttribute("to", '1');
cani2.setAttribute("begin", "0s");
cani2.setAttribute("dur", "400ms");


function movie() {
  lastCount = count;
  var placeEgg = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
  if (lostCount === 3) {
    egg1.setAttribute('display', 'none');
    placeEgg1.speedX = 0;
    placeEgg1.speedY = 0;
    placeEgg1.speedAngle = 0;
    placeEgg1.posX = 55;
    placeEgg1.posY = 53.8;
    egg2.setAttribute('display', 'none');
    placeEgg2.speedX = 0;
    placeEgg2.speedY = 0;
    placeEgg2.speedAngle = 0;
    placeEgg2.posX = 147;
    placeEgg2.posY = 53;
    egg3.setAttribute('display', 'none');
    placeEgg3.speedX = 0;
    placeEgg3.speedY = 0;
    placeEgg3.speedAngle = 0;
    placeEgg3.posX = 55;
    placeEgg3.posY = 72.5;
    egg4.setAttribute('display', 'none');
    placeEgg4.speedX = 0;
    placeEgg4.speedY = 0;
    placeEgg4.speedAngle = 0;
    placeEgg4.posX = 147;
    placeEgg4.posY = 71.5;
    placeEgg = 0;
    gameRun = false;
    yourScore.innerHTML = lastCount;
    gameOver.style.display = 'block';
  }
  if (placeEgg === 1) {
    egg1.setAttribute('display', 'block');
    switch (true) { // установка скоростей яиц в позиции 1 в зависимости от количества набранных очков
      case (count <= 5):
        placeEgg1.speedX = 0.05;
        placeEgg1.speedY = 0.028;
        placeEgg1.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((5 < count) && (count <= 10)):
        placeEgg1.speedX = 0.1;
        placeEgg1.speedY = 0.056;
        placeEgg1.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((10 < count) && (count <= 30)):
        placeEgg1.speedX = 0.15;
        placeEgg1.speedY = 0.084;
        placeEgg1.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((30 < count) && (count <= 50)):
        placeEgg1.speedX = 0.17;
        placeEgg1.speedY = 0.0952;
        placeEgg1.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((50 < count) && (count <= 75)):
        placeEgg1.speedX = 0.2;
        placeEgg1.speedY = 0.112;
        placeEgg1.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((75 < count) && (count <= 100)):
        placeEgg1.speedX = 0.225;
        placeEgg1.speedY = 0.126;
        placeEgg1.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((100 < count) && (count <= 125)):
        placeEgg1.speedX = 0.25;
        placeEgg1.speedY = 0.14;
        placeEgg1.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((125 < count) && (count <= 150)):
        placeEgg1.speedX = 0.275;
        placeEgg1.speedY = 0.154;
        placeEgg1.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((150 < count) && (count <= 200)):
        placeEgg1.speedX = 0.3;
        placeEgg1.speedY = 0.168;
        placeEgg1.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((200 < count) && (count <= 300)):
        placeEgg1.speedX = 0.325;
        placeEgg1.speedY = 0.182;
        placeEgg1.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((300 < count) && (count <= 400)):
        placeEgg1.speedX = 0.375;
        placeEgg1.speedY = 0.21;
        placeEgg1.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((400 < count) && (count <= 500)):
        placeEgg1.speedX = 0.4;
        placeEgg1.speedY = 0.224;
        placeEgg1.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((500 < count) && (count <= 600)):
        placeEgg1.speedX = 0.425;
        placeEgg1.speedY = 0.238;
        placeEgg1.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((600 < count) && (count <= 700)):
        placeEgg1.speedX = 0.45;
        placeEgg1.speedY = 0.252;
        placeEgg1.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((700 < count) && (count <= 800)):
        placeEgg1.speedX = 0.475;
        placeEgg1.speedY = 0.266;
        placeEgg1.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((800 < count) && (count <= 900)):
        placeEgg1.speedX = 0.485;
        placeEgg1.speedY = 0.2716;
        placeEgg1.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((900 < count) && (count <= 1000)):
        placeEgg1.speedX = 0.495;
        placeEgg1.speedY = 0.2772;
        placeEgg1.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((100 < count) && (count <= 1500)):
        placeEgg1.speedX = 0.5;
        placeEgg1.speedY = 0.28;
        placeEgg1.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case (count > 1500):
        placeEgg1.speedX = 0.6;
        placeEgg1.speedY = 0.336;
        placeEgg1.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
    }
  }
  if (placeEgg === 2) { // установка скоростей яиц в позиции 2 в зависимости от количества набранных очков
    egg2.setAttribute('display', 'block');
    switch (true) {
      case (count <= 5):
        placeEgg2.speedX = -0.05;
        placeEgg2.speedY = 0.028;
        placeEgg2.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((5 < count) && (count <= 10)):
        placeEgg2.speedX = -0.1;
        placeEgg2.speedY = 0.056;
        placeEgg2.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((10 < count) && (count <= 30)):
        placeEgg2.speedX = -0.15;
        placeEgg2.speedY = 0.084;
        placeEgg2.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((30 < count) && (count <= 50)):
        placeEgg2.speedX = -0.17;
        placeEgg2.speedY = 0.0952;
        placeEgg2.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((50 < count) && (count <= 75)):
        placeEgg2.speedX = -0.2;
        placeEgg2.speedY = 0.112;
        placeEgg2.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((75 < count) && (count <= 100)):
        placeEgg2.speedX = -0.225;
        placeEgg2.speedY = 0.126;
        placeEgg2.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((100 < count) && (count <= 125)):
        placeEgg2.speedX = -0.25;
        placeEgg2.speedY = 0.14;
        placeEgg2.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((125 < count) && (count <= 150)):
        placeEgg2.speedX = -0.275;
        placeEgg2.speedY = 0.154;
        placeEgg2.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((150 < count) && (count <= 200)):
        placeEgg2.speedX = -0.3;
        placeEgg2.speedY = 0.168;
        placeEgg2.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((200 < count) && (count <= 300)):
        placeEgg2.speedX = -0.325;
        placeEgg2.speedY = 0.182;
        placeEgg2.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((300 < count) && (count <= 400)):
        placeEgg2.speedX = -0.375;
        placeEgg2.speedY = 0.21;
        placeEgg2.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((400 < count) && (count <= 500)):
        placeEgg2.speedX = -0.4;
        placeEgg2.speedY = 0.224;
        placeEgg2.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((500 < count) && (count <= 600)):
        placeEgg2.speedX = -0.425;
        placeEgg2.speedY = 0.238;
        placeEgg2.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((600 < count) && (count <= 700)):
        placeEgg2.speedX = -0.45;
        placeEgg2.speedY = 0.252;
        placeEgg2.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((700 < count) && (count <= 800)):
        placeEgg2.speedX = -0.475;
        placeEgg2.speedY = 0.266;
        placeEgg2.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((800 < count) && (count <= 900)):
        placeEgg2.speedX = -0.485;
        placeEgg2.speedY = 0.2716;
        placeEgg2.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((900 < count) && (count <= 1000)):
        placeEgg2.speedX = -0.495;
        placeEgg2.speedY = 0.2772;
        placeEgg2.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((1000 < count) && (count <= 1500)):
        placeEgg2.speedX = -0.5;
        placeEgg2.speedY = 0.28;
        placeEgg2.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case (count > 1500):
        placeEgg2.speedX = -0.6;
        placeEgg2.speedY = 0.336;
        placeEgg2.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
    }
  }
  if (placeEgg === 3) { // установка скоростей яиц в позиции 3 в зависимости от количества набранных очков
    egg3.setAttribute('display', 'block');
    switch (true) {
      case (count <= 5):
        placeEgg3.speedX = 0.05;
        placeEgg3.speedY = 0.028;
        placeEgg3.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((5 < count) && (count <= 10)):
        placeEgg3.speedX = 0.1;
        placeEgg3.speedY = 0.056;
        placeEgg3.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((10 < count) && (count <= 30)):
        placeEgg3.speedX = 0.15;
        placeEgg3.speedY = 0.084;
        placeEgg3.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((30 < count) && (count <= 50)):
        placeEgg3.speedX = 0.17;
        placeEgg3.speedY = 0.0952;
        placeEgg3.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((50 < count) && (count <= 75)):
        placeEgg3.speedX = 0.2;
        placeEgg3.speedY = 0.112;
        placeEgg3.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((75 < count) && (count <= 100)):
        placeEgg3.speedX = 0.225;
        placeEgg3.speedY = 0.126;
        placeEgg3.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((100 < count) && (count <= 125)):
        placeEgg3.speedX = 0.25;
        placeEgg3.speedY = 0.14;
        placeEgg3.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((125 < count) && (count <= 150)):
        placeEgg3.speedX = 0.275;
        placeEgg3.speedY = 0.154;
        placeEgg3.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((150 < count) && (count <= 200)):
        placeEgg3.speedX = 0.3;
        placeEgg3.speedY = 0.168;
        placeEgg3.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((200 < count) && (count <= 300)):
        placeEgg3.speedX = 0.325;
        placeEgg3.speedY = 0.182;
        placeEgg3.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((300 < count) && (count <= 400)):
        placeEgg3.speedX = 0.375;
        placeEgg3.speedY = 0.21;
        placeEgg3.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((400 < count) && (count <= 500)):
        placeEgg3.speedX = 0.4;
        placeEgg3.speedY = 0.224;
        placeEgg3.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((500 < count) && (count <= 600)):
        placeEgg3.speedX = 0.425;
        placeEgg3.speedY = 0.238;
        placeEgg3.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((600 < count) && (count <= 700)):
        placeEgg3.speedX = 0.45;
        placeEgg3.speedY = 0.252;
        placeEgg3.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((700 < count) && (count <= 800)):
        placeEgg3.speedX = 0.475;
        placeEgg3.speedY = 0.266;
        placeEgg3.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((800 < count) && (count <= 900)):
        placeEgg3.speedX = 0.485;
        placeEgg3.speedY = 0.2716;
        placeEgg3.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((900 < count) && (count <= 1000)):
        placeEgg3.speedX = 0.495;
        placeEgg3.speedY = 0.2772;
        placeEgg3.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((1000 < count) && (count <= 1500)):
        placeEgg3.speedX = 0.5;
        placeEgg3.speedY = 0.28;
        placeEgg3.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case (count > 1500):
        placeEgg3.speedX = 0.6;
        placeEgg3.speedY = 0.336;
        placeEgg3.speedAngle = 5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
    }
  }
  if (placeEgg === 4) { // установка скоростей яиц в позиции 4 в зависимости от количества набранных очков
    egg4.setAttribute('display', 'block');
    switch (true) {
      case (count <= 5):
        placeEgg4.speedX = -0.05;
        placeEgg4.speedY = 0.028;
        placeEgg4.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((5 < count) && (count <= 10)):
        placeEgg4.speedX = -0.1;
        placeEgg4.speedY = 0.056;
        placeEgg4.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((10 < count) && (count <= 30)):
        placeEgg4.speedX = -0.15;
        placeEgg4.speedY = 0.084;
        placeEgg4.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((30 < count) && (count <= 50)):
        placeEgg4.speedX = -0.17;
        placeEgg4.speedY = 0.0952;
        placeEgg4.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((50 < count) && (count <= 75)):
        placeEgg4.speedX = -0.2;
        placeEgg4.speedY = 0.112;
        placeEgg4.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((75 < count) && (count <= 100)):
        placeEgg4.speedX = -0.225;
        placeEgg4.speedY = 0.126;
        placeEgg4.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((100 < count) && (count <= 125)):
        placeEgg4.speedX = -0.25;
        placeEgg4.speedY = 0.14;
        placeEgg4.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((125 < count) && (count <= 150)):
        placeEgg4.speedX = -0.275;
        placeEgg4.speedY = 0.154;
        placeEgg4.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((150 < count) && (count <= 200)):
        placeEgg4.speedX = -0.3;
        placeEgg4.speedY = 0.168;
        placeEgg4.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((200 < count) && (count <= 300)):
        placeEgg4.speedX = -0.325;
        placeEgg4.speedY = 0.182;
        placeEgg4.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((300 < count) && (count <= 400)):
        placeEgg4.speedX = -0.375;
        placeEgg4.speedY = 0.21;
        placeEgg4.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((400 < count) && (count <= 500)):
        placeEgg4.speedX = -0.4;
        placeEgg4.speedY = 0.224;
        placeEgg4.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((500 < count) && (count <= 600)):
        placeEgg4.speedX = -0.425;
        placeEgg4.speedY = 0.238;
        placeEgg4.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((600 < count) && (count <= 700)):
        placeEgg4.speedX = -0.45;
        placeEgg4.speedY = 0.252;
        placeEgg4.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((700 < count) && (count <= 800)):
        placeEgg4.speedX = -0.475;
        placeEgg4.speedY = 0.266;
        placeEgg4.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((800 < count) && (count <= 900)):
        placeEgg4.speedX = -0.485;
        placeEgg4.speedY = 0.2716;
        placeEgg4.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((900 < count) && (count <= 1000)):
        placeEgg4.speedX = -0.495;
        placeEgg4.speedY = 0.2772;
        placeEgg4.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case ((1000 < count) && (count <= 1500)):
        placeEgg4.speedX = -0.5;
        placeEgg4.speedY = 0.28;
        placeEgg4.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
      case (count > 1500):
        placeEgg4.speedX = -0.6;
        placeEgg4.speedY = 0.336;
        placeEgg4.speedAngle = -5;
        if (soundState === 1) {
          runSound();
        }
        else {
          runSoundOff();
        }
        break;
    }
  }
}

function start() {
  startButton.style.display = 'block';
  startButton1.style.display = 'none';
  gameRun = true;
  switchToState({ pagename: 'Game' });
  handState = 1;
  lostCount = 0;
  count = 0;
  score.innerHTML = count;
  chickBreak1.style.display = 'none';
  chickBreak2.style.display = 'none';
  chickBreak3.style.display = 'none';
  movie();
}

function tick() {
  placeEgg1.posX += placeEgg1.speedX;
  placeEgg1.posY += placeEgg1.speedY;
  placeEgg1.angle += placeEgg1.speedAngle;
  chickRightRunH.posX += chickRightRunH.speedX;
  chickLeftRunH.posX += chickLeftRunH.speedX;

  if (chickRightRunH.posX > 150) {
    chickRightRunH.speedX = 0;
    chickRightRun.style.display = 'none';
    chickRightRunH.posX = 133;
  }

  if (chickLeftRunH.posX < 44) {
    chickLeftRunH.speedX = 0;
    chickLeftRun.style.display = 'none';
    chickLeftRunH.posX = 59.5;
  }

  if (placeEgg1.posX > 72) {
    egg1.setAttribute('display', 'none');
    placeEgg1.speedX = 0;
    placeEgg1.speedY = 0;
    placeEgg1.speedAngle = 0;
    placeEgg1.posX = 55;
    placeEgg1.posY = 53.8;
    if (handState === 1) {
      if (soundState === 1) {
        countSound();
      }
      else {
        countSoundOff();
      }
      count += 1;
      score.innerHTML = count;
      movie();
    }
    else {
      lostCount += 1;
      movie();
      chickLeft.appendChild(cani2);
      document.getElementById("myAnimationc2").beginElement();
      if (soundState === 1) {
        breakSound();
      }
      else {
        breakSoundOff();
      }
      vibro();
      chickLeftRun.style.display = 'block';
      chickLeftRunH.speedX = -0.25;
      if (lostCount === 1) {
        chickBreak1.style.display = 'block';
      }
      else if (lostCount === 2) {
        chickBreak2.style.display = 'block';
      }
      else {
        chickBreak3.style.display = 'block';
      }
    }
  }
  placeEgg2.posX += placeEgg2.speedX;
  placeEgg2.posY += placeEgg2.speedY;
  placeEgg2.angle += placeEgg2.speedAngle;
  if (placeEgg2.posX < 129) {
    egg2.setAttribute('display', 'none');
    placeEgg2.speedX = 0;
    placeEgg2.speedY = 0;
    placeEgg2.speedAngle = 0;
    placeEgg2.posX = 147;
    placeEgg2.posY = 53;
    if (handState === 2) {
      if (soundState === 1) {
        countSound();
      }
      else {
        countSoundOff();
      }
      count += 1;
      score.innerHTML = count;
      movie();
    }
    else {
      lostCount += 1;
      movie();
      chickRight.appendChild(cani2);
      document.getElementById("myAnimationc2").beginElement();
      if (soundState === 1) {
        breakSound();
      }
      else {
        breakSoundOff();
      }
      vibro();
      chickRightRun.style.display = 'block';
      chickRightRunH.speedX = 0.25;
      if (lostCount === 1) {
        chickBreak1.style.display = 'block';
      }
      else if (lostCount === 2) {
        chickBreak2.style.display = 'block';
      }
      else {
        chickBreak3.style.display = 'block';
      }
    }
  }
  placeEgg3.posX += placeEgg3.speedX;
  placeEgg3.posY += placeEgg3.speedY;
  placeEgg3.angle += placeEgg3.speedAngle;
  if (placeEgg3.posX > 72) {
    egg3.setAttribute('display', 'none');
    placeEgg3.speedX = 0;
    placeEgg3.speedY = 0;
    placeEgg3.speedAngle = 0;
    placeEgg3.posX = 55;
    placeEgg3.posY = 72.5;
    if (handState === 3) {
      if (soundState === 1) {
        countSound();
      }
      else {
        countSoundOff();
      }
      count += 1;
      score.innerHTML = count;
      movie();
    }
    else {
      lostCount += 1;
      movie();
      chickLeft.appendChild(cani2);
      document.getElementById("myAnimationc2").beginElement();
      if (soundState === 1) {
        breakSound();
      }
      else {
        breakSoundOff();
      }
      vibro();
      chickLeftRun.style.display = 'block';
      chickLeftRunH.speedX = -0.25;
      if (lostCount === 1) {
        chickBreak1.style.display = 'block';
      }
      else if (lostCount === 2) {
        chickBreak2.style.display = 'block';
      }
      else {
        chickBreak3.style.display = 'block';
      }
    }
  }
  placeEgg4.posX += placeEgg4.speedX;
  placeEgg4.posY += placeEgg4.speedY;
  placeEgg4.angle += placeEgg4.speedAngle;
  if (placeEgg4.posX < 129) {
    egg4.setAttribute('display', 'none');
    placeEgg4.speedX = 0;
    placeEgg4.speedY = 0;
    placeEgg4.speedAngle = 0;
    placeEgg4.posX = 147;
    placeEgg4.posY = 71.5;
    if (handState === 4) {
      if (soundState === 1) {
        countSound();
      }
      else {
        countSoundOff();
      }
      count += 1;
      score.innerHTML = count;
      movie();
    }
    else {
      lostCount += 1;
      movie();
      chickRight.appendChild(cani2);
      document.getElementById("myAnimationc2").beginElement();
      if (soundState === 1) {
        breakSound();
      }
      else {
        breakSoundOff();
      }
      vibro();
      chickRightRun.style.display = 'block';
      chickRightRunH.speedX = 0.25;
      if (lostCount === 1) {
        chickBreak1.style.display = 'block';
      }
      else if (lostCount === 2) {
        chickBreak2.style.display = 'block';
      }
      else {
        chickBreak3.style.display = 'block';
      }
    }
  }
  placeEgg1.update();
  placeEgg2.update();
  placeEgg3.update();
  placeEgg4.update();
  chickRightRunH.update();
  chickLeftRunH.update();
  RAF(tick);
}

document.addEventListener("keydown", keyDown); // управление игрой с помощью клавиатуры

function keyDown(EO) {
  EO = EO || window.event;
  // при нажатии клавиши "Ctrl"
  if (EO.keyCode === 17) {
    headLeft.style.display = 'block';
    headRight.style.display = 'none';
    if (handState === 1) {
      document.getElementById("myAnimation1").beginElement();
      document.getElementById("myAnimationb1").beginElement();
      handState = 3;
    }
    if (handState === 2) {
      document.getElementById("myAnimation2").beginElement();
      document.getElementById("myAnimationb1").beginElement();
      handState = 3;
    }
    if (handState === 4) {
      document.getElementById("myAnimation3").beginElement();
      document.getElementById("myAnimationb1").beginElement();
      handState = 3;
    }
  }
  // при нажатии клавиши "Shift"
  else if (EO.keyCode === 16) {
    headLeft.style.display = 'block';
    headRight.style.display = 'none';
    if (handState === 2) {
      document.getElementById("myAnimation4").beginElement();
      document.getElementById("myAnimationb2").beginElement();
      handState = 1;
    }
    if (handState === 3) {
      document.getElementById("myAnimation5").beginElement();
      document.getElementById("myAnimationb2").beginElement();
      handState = 1;
    }
    if (handState === 4) {
      document.getElementById("myAnimation6").beginElement();
      document.getElementById("myAnimationb2").beginElement();
      handState = 1;
    }
  }
  // при нажатии клавиши "Вверх"
  else if (EO.keyCode === 38) {
    headLeft.style.display = 'none';
    headRight.style.display = 'block';
    if (handState === 1) {
      document.getElementById("myAnimation7").beginElement();
      document.getElementById("myAnimationb3").beginElement();
      handState = 2;
    }
    if (handState === 3) {
      document.getElementById("myAnimation8").beginElement();
      document.getElementById("myAnimationb3").beginElement();
      handState = 2;
    }
    if (handState === 4) {
      document.getElementById("myAnimation9").beginElement();
      document.getElementById("myAnimationb5").beginElement();
      handState = 2;
    }
  }
  // при нажатии клавиши "Вправо"
  else if (EO.keyCode === 39) {
    headLeft.style.display = 'none';
    headRight.style.display = 'block';
    if (handState === 1) {
      document.getElementById("myAnimation10").beginElement();
      document.getElementById("myAnimationb4").beginElement();
      handState = 4;
    }
    if (handState === 2) {
      document.getElementById("myAnimation11").beginElement();
      document.getElementById("myAnimationb4").beginElement();
      handState = 4;
    }
    if (handState === 3) {
      document.getElementById("myAnimation12").beginElement();
      document.getElementById("myAnimationb4").beginElement();
      handState = 4;
    }
  }
}

function movieBasketDownLeft() {
  downLeftButton.style.display = 'block';
  downLeftButton1.style.display = 'none';
  headLeft.style.display = 'block';
  headRight.style.display = 'none';
  if (handState === 1) {
    document.getElementById("myAnimation1").beginElement();
    document.getElementById("myAnimationb1").beginElement();
    handState = 3;
  }
  if (handState === 2) {
    document.getElementById("myAnimation2").beginElement();
    document.getElementById("myAnimationb1").beginElement();
    handState = 3;
  }
  if (handState === 4) {
    document.getElementById("myAnimation3").beginElement();
    document.getElementById("myAnimationb1").beginElement();
    handState = 3;
  }
}

function movieBasketUpLeft() {
  upLeftButton.style.display = 'block';
  upLeftButton1.style.display = 'none';
  headLeft.style.display = 'block';
  headRight.style.display = 'none';
  if (handState === 2) {
    document.getElementById("myAnimation4").beginElement();
    document.getElementById("myAnimationb2").beginElement();
    handState = 1;
  }
  if (handState === 3) {
    document.getElementById("myAnimation5").beginElement();
    document.getElementById("myAnimationb2").beginElement();
    handState = 1;
  }
  if (handState === 4) {
    document.getElementById("myAnimation6").beginElement();
    document.getElementById("myAnimationb2").beginElement();
    handState = 1;
  }
}

function movieBasketUpRight() {
  upRightButton.style.display = 'block';
  upRightButton1.style.display = 'none';
  headLeft.style.display = 'none';
  headRight.style.display = 'block';
  if (handState === 1) {
    document.getElementById("myAnimation7").beginElement();
    document.getElementById("myAnimationb3").beginElement();
    handState = 2;
  }
  if (handState === 3) {
    document.getElementById("myAnimation8").beginElement();
    document.getElementById("myAnimationb3").beginElement();
    handState = 2;
  }
  if (handState === 4) {
    document.getElementById("myAnimation9").beginElement();
    document.getElementById("myAnimationb5").beginElement();
    handState = 2;
  }
}

function movieBasketDownRight() {
  downRightButton.style.display = 'block';
  downRightButton1.style.display = 'none';
  headLeft.style.display = 'none';
  headRight.style.display = 'block';
  if (handState === 1) {
    document.getElementById("myAnimation10").beginElement();
    document.getElementById("myAnimationb4").beginElement();
    handState = 4;
  }
  if (handState === 2) {
    document.getElementById("myAnimation11").beginElement();
    document.getElementById("myAnimationb4").beginElement();
    handState = 4;
  }
  if (handState === 3) {
    document.getElementById("myAnimation12").beginElement();
    document.getElementById("myAnimationb4").beginElement();
    handState = 4;
  }
}

function changeUpLeftButton() {
  upLeftButton.style.display = 'none';
  upLeftButton1.style.display = 'block';
}

function changeUpRightButton() {
  upRightButton.style.display = 'none';
  upRightButton1.style.display = 'block';
}

function changeDownLeftButton() {
  downLeftButton.style.display = 'none';
  downLeftButton1.style.display = 'block';
}

function changeDownRightButton() {
  downRightButton.style.display = 'none';
  downRightButton1.style.display = 'block';
}

function changeStartButton() {
  startButton.style.display = 'none';
  startButton1.style.display = 'block';
}

function changeTableButton() {
  tableButton.style.display = 'none';
  tableButton1.style.display = 'block';
}

function changeRulesButton() {
  rulesButton.style.display = 'none';
  rulesButton1.style.display = 'block';
}

function changeGameOverOK() {
  gameOverOK.style.display = 'none';
  gameOverOK1.style.display = 'block';
}

function changeRegistOK() {
  registOK.style.display = 'none';
  registOK1.style.display = 'block';
}

function changeRegistClose() {
  registClose.style.display = 'none';
  registClose1.style.display = 'block';
}

function changeCloseTableOK() {
  closeTableOK.style.display = 'none';
  closeTableOK1.style.display = 'block';
}

function changeRulesOK() {
  rulesOK.style.display = 'none';
  rulesOK1.style.display = 'block';
}

function changeSoundOff() {
  soundState = 0;
  soundOnButton.style.display = 'none';
  soundOffButton.style.display = 'block';
  runAudio.pause();
  countAudio.pause();
  breakAudio.pause();
}

function changeSoundOn() {
  soundState = 1;
  soundOnButton.style.display = 'block';
  soundOffButton.style.display = 'none';
}

function debounceSerie(func, interval, immediate) {
  var timer;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timer = null;
      if (!immediate)
        func.apply(context, args);
    };
    var callNow = immediate && !timer;
    clearTimeout(timer);
    timer = setTimeout(later, interval);
    if (callNow)
      func.apply(context, args);
  };
};

if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
  tableButton.addEventListener('touchstart', changeTableButton, false);
  tableButton.addEventListener('touchend', refreshMessages, false);
  rulesButton.addEventListener('touchstart', changeRulesButton, false);
  rulesButton.addEventListener('touchend', showRules, false);
  startButton.addEventListener('touchstart', debounceSerie(changeStartButton, 10000, true));
  // start будет вызван не раньше чем через 10 секунд после предыдущего нажатия
  startButton.addEventListener('touchend', debounceSerie(start, 10000, true));
  upLeftButton.addEventListener('touchstart', changeUpLeftButton, false);
  upLeftButton.addEventListener('touchend', movieBasketUpLeft, false);
  upRightButton.addEventListener('touchstart', changeUpRightButton, false);
  upRightButton.addEventListener('touchend', movieBasketUpRight, false);
  downLeftButton.addEventListener('touchstart', changeDownLeftButton, false);
  downLeftButton.addEventListener('touchend', movieBasketDownLeft, false);
  downRightButton.addEventListener('touchstart', changeDownRightButton, false);
  downRightButton.addEventListener('touchend', movieBasketDownRight, false);
  gameOverOK.addEventListener('touchstart', changeGameOverOK, false);
  gameOverOK.addEventListener('touchend', registr, false);
  registOK.addEventListener('touchstart', changeRegistOK, false);
  registOK.addEventListener('touchend', loadData, false);
  registClose.addEventListener('touchstart', changeRegistClose, false);
  registClose.addEventListener('touchend', registrationClose, false);
  closeTableOK.addEventListener('touchstart', changeCloseTableOK, false);
  closeTableOK.addEventListener('touchend', closeTable, false);
  rulesOK.addEventListener('touchstart', changeRulesOK, false);
  rulesOK.addEventListener('touchend', closeRules, false);
  soundOnButton.addEventListener('touchend', changeSoundOff, false);
  soundOffButton.addEventListener('touchend', changeSoundOn, false);
}
else {
  tableButton.addEventListener('mousedown', changeTableButton, false);
  tableButton1.addEventListener('mouseup', refreshMessages, false);
  rulesButton.addEventListener('mousedown', changeRulesButton, false);
  rulesButton1.addEventListener('mouseup', showRules, false);
  startButton.addEventListener('mousedown', debounceSerie(changeStartButton, 10000, true));
  // start будет вызван не раньше чем через 10 секунд после предыдущего нажатия
  startButton1.addEventListener('mouseup', debounceSerie(start, 10000, true));
  upLeftButton.addEventListener('mousedown', changeUpLeftButton, false);
  upLeftButton1.addEventListener('mouseup', movieBasketUpLeft, false);
  upRightButton.addEventListener('mousedown', changeUpRightButton, false);
  upRightButton1.addEventListener('mouseup', movieBasketUpRight, false);
  downLeftButton.addEventListener('mousedown', changeDownLeftButton, false);
  downLeftButton1.addEventListener('mouseup', movieBasketDownLeft, false);
  downRightButton.addEventListener('mousedown', changeDownRightButton, false);
  downRightButton1.addEventListener('mouseup', movieBasketDownRight, false);
  gameOverOK.addEventListener('mousedown', changeGameOverOK, false);
  gameOverOK1.addEventListener('mouseup', registr, false);
  registOK.addEventListener('mousedown', changeRegistOK, false);
  registOK1.addEventListener('mouseup', loadData, false);
  registClose.addEventListener('mousedown', changeRegistClose, false);
  registClose1.addEventListener('mouseup', registrationClose, false);
  closeTableOK.addEventListener('mousedown', changeCloseTableOK, false);
  closeTableOK1.addEventListener('mouseup', closeTable, false);
  rulesOK.addEventListener('mousedown', changeRulesOK, false);
  rulesOK1.addEventListener('mouseup', closeRules, false);
  soundOnButton.addEventListener('click', changeSoundOff, false);
  soundOffButton.addEventListener('click', changeSoundOn, false);
}

// подключение вибрации при падении яиц
function vibro() {
  if (navigator.vibrate) { // есть поддержка Vibration API?
    window.navigator.vibrate(100); // вибрация 100мс
  }
}

// подключение звука при скатывании яиц
var runAudio = new Audio("/sounds/run.wav");
function runSound() {
  runAudio.currentTime = 0;
  runAudio.play();
}
function runSoundOff() {
  runAudio.pause();
}

// подключение звука, когда яйцо падает в корзину
var countAudio = new Audio("/sounds/count.wav");
function countSound() {
  countAudio.currentTime = 0;
  countAudio.play();
}
function countSoundOff() {
  countAudio.pause();
}

// подключение звука, когда яйцо падает на землю
var breakAudio = new Audio("/sounds/break2.wav");
function breakSound() {
  breakAudio.currentTime = 0;
  breakAudio.play();
}
function breakSoundOff() {
  breakAudio.pause();
}

function registr() {
  gameOverOK.style.display = 'block';
  gameOverOK1.style.display = 'none';
  gameOver.style.display = 'none';
  registration.style.display = 'block';
}

function registrationClose() {
  registClose.style.display = 'block';
  registClose1.style.display = 'none';
  registration.style.display = 'none';
}


var ajaxHandlerScript = "https://fe.it-academy.by/AjaxStringStorage2.php";
var messages; // элемент массива - {name:'Иванов',score:'0'};
var updatePassword;
var stringName = 'NAKVAS_PROJECT_NU_POGODI';

function showMessages() {
  var str = '';
  // сортируем содержание массива по убыванию набранных очков
  messages.sort(function (a, b) {
    return b.score - a.score
  })
  if (messages.length > 10)
    // выводим в таблицу рекордов только первые 10 результатов из массива
    messages = messages.slice(0, 10);
  for (var m = 0; m < messages.length; m++) {
    var message = messages[m];
    str += "<b>" + (m + 1) + ". " + message.name + ":</b> "
      + message.score + "<br />";
  }
  textTable.innerHTML = str;
}

// получаем сообщения с сервера
function refreshMessages() {
  tableButton.style.display = 'block';
  tableButton1.style.display = 'none';
  switchToState({ pagename: 'TableScore' });
  $.ajax({
    url: ajaxHandlerScript,
    type: 'POST', dataType: 'json',
    data: { f: 'READ', n: stringName },
    cache: false,
    success: readReady,
    error: errorHandler
  }
  );
}

function readReady(callresult) { // сообщения получены - показываем
  if (callresult.error != undefined)
    alert(callresult.error);
  else {
    messages = [];
    if (callresult.result != "") { // либо строка пустая - сообщений нет
      // либо в строке - JSON-представление массива сообщений
      messages = JSON.parse(callresult.result);
      if (!Array.isArray(messages))
        messages = [];
    }
    showMessages();
  }
}

function loadData() {
  registOK.style.display = 'block';
  registOK1.style.display = 'none';
  registration.style.display = 'none';
  updatePassword = Math.random();
  $.ajax({
    url: ajaxHandlerScript,
    type: 'POST', dataType: 'json',
    data: {
      f: 'LOCKGET', n: stringName,
      p: updatePassword
    },
    cache: false,
    success: lockGetReady,
    error: errorHandler
  }
  );
}

// сообщения получены, добавляет, сохраняет, показывает
function lockGetReady(callresult) {
  if (callresult.error != undefined)
    alert(callresult.error);
  else {
    messages = [];
    if (callresult.result != "") { // либо строка пустая - сообщений нет
      // либо в строке - JSON-представление массива сообщений
      messages = JSON.parse(callresult.result);
      // вдруг кто-то сохранил мусор вместо LOKTEV_CHAT_MESSAGES?
      if (!Array.isArray(messages))
        messages = [];
    }

    var gamerName = document.getElementById('gName').value;
    var gamerScore = lastCount;
    messages.push({ name: gamerName, score: gamerScore });


    $.ajax({
      url: ajaxHandlerScript,
      type: 'POST', dataType: 'json',
      data: {
        f: 'UPDATE', n: stringName,
        v: JSON.stringify(messages), p: updatePassword
      },
      cache: false,
      success: updateReady,
      error: errorHandler
    }
    );
    showMessages();
  }
}

// сообщения вместе с новым сохранены на сервере
function updateReady(callresult) {
  if (callresult.error != undefined)
    alert(callresult.error);
}

function errorHandler(jqXHR, statusStr, errorStr) {
  alert(statusStr + ' ' + errorStr);
}

function closeTable() {
  closeTableOK.style.display = 'block';
  closeTableOK1.style.display = 'none';
  scoreTable.style.display = 'none';
  switchToState({ pagename: 'Game' });
}

function showRules() {
  rulesButton.style.display = 'block';
  rulesButton1.style.display = 'none';
  switchToState({ pagename: 'Rules' });
}

function closeRules() {
  rulesOK.style.display = 'block';
  rulesOK1.style.display = 'none';
  rules.style.display = 'none';
  switchToState({ pagename: 'Game' });
}

// в закладке URL будем хранить следующие слова:
// #Game - игра
// #TableScore - рекорды игры
// #Rules - правила игры

// отслеживаем изменение закладки в URL
window.onhashchange = switchToStateFromURLHash;

var SPAState = {};
function switchToStateFromURLHash() {
  var URLHash = window.location.hash;
  var stateStr = URLHash.substr(1);
  if (stateStr != "") { // если закладка непустая, читаем из неё состояние и отображаем
    var parts = stateStr.split("_")
    SPAState = { pagename: parts[0] }; // первая часть закладки - номер страницы
  }
  else
    SPAState = { pagename: 'Game' }; // иначе показываем главную страницу

  var pageHTML = "";
  switch (SPAState.pagename) {
    case 'Game':
      mainDiv.style.display = 'block';
      mainDiv.style.opacity = '1';
      scoreTable.style.display = 'none';
      rules.style.display = 'none';
      break;
    case 'TableScore':
      mainDiv.style.display = 'block';
      scoreTable.style.display = 'block';
      rules.style.display = 'none';
      refreshMessages();
      mainDiv.style.opacity = '0.4';
      // если игра идет, а пользователь нажимает кнопку с рекордами игры, появляется сообщение с вопросом
      if (gameRun) {
        var question = confirm('Вы хотите закончить игру?');
        if (!question) {
          scoreTable.style.display = 'none';
          mainDiv.style.opacity = '1';
        }
        else {
          egg1.setAttribute('display', 'none');
          placeEgg1.speedX = 0;
          placeEgg1.speedY = 0;
          placeEgg1.speedAngle = 0;
          placeEgg1.posX = 55;
          placeEgg1.posY = 53.8;
          egg2.setAttribute('display', 'none');
          placeEgg2.speedX = 0;
          placeEgg2.speedY = 0;
          placeEgg2.speedAngle = 0;
          placeEgg2.posX = 147;
          placeEgg2.posY = 53;
          egg3.setAttribute('display', 'none');
          placeEgg3.speedX = 0;
          placeEgg3.speedY = 0;
          placeEgg3.speedAngle = 0;
          placeEgg3.posX = 55;
          placeEgg3.posY = 72.5;
          egg4.setAttribute('display', 'none');
          placeEgg4.speedX = 0;
          placeEgg4.speedY = 0;
          placeEgg4.speedAngle = 0;
          placeEgg4.posX = 147;
          placeEgg4.posY = 71.5;
          gameRun = false;
        }
      }
      break;
    case 'Rules':
      mainDiv.style.display = 'block';
      scoreTable.style.display = 'none';
      rules.style.display = 'block';
      mainDiv.style.opacity = '0.4';
      if (gameRun) {
        var question = confirm('Вы хотите закончить игру?');
        if (!question) {
          rules.style.display = 'none';
          mainDiv.style.opacity = '1';
        }
        else {
          egg1.setAttribute('display', 'none');
          placeEgg1.speedX = 0;
          placeEgg1.speedY = 0;
          placeEgg1.speedAngle = 0;
          placeEgg1.posX = 55;
          placeEgg1.posY = 53.8;
          egg2.setAttribute('display', 'none');
          placeEgg2.speedX = 0;
          placeEgg2.speedY = 0;
          placeEgg2.speedAngle = 0;
          placeEgg2.posX = 147;
          placeEgg2.posY = 53;
          egg3.setAttribute('display', 'none');
          placeEgg3.speedX = 0;
          placeEgg3.speedY = 0;
          placeEgg3.speedAngle = 0;
          placeEgg3.posX = 55;
          placeEgg3.posY = 72.5;
          egg4.setAttribute('display', 'none');
          placeEgg4.speedX = 0;
          placeEgg4.speedY = 0;
          placeEgg4.speedAngle = 0;
          placeEgg4.posX = 147;
          placeEgg4.posY = 71.5;
          gameRun = false;
        }
      }
      break;
  }
}
function switchToState(newState) {
  var stateStr = newState.pagename;
  location.hash = stateStr;
}
switchToStateFromURLHash();
