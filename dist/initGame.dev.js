"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DIV = document.querySelector("#container");
var clinetWidth = DIV.clientWidth; //页面宽度

var clientHeight = DIV.clientHeight; //页面高度

var ballList = []; //球的合集

var secQueen = []; //当前选中的球队列 

var cacheList = []; //暂时存放小球

var cleanListX = []; //横向x需要消除的小球

var cleanListY = []; //纵向y需要消除的小球

var Queen =
/*#__PURE__*/
function () {
  function Queen() {
    _classCallCheck(this, Queen);

    this.temp = [];
  }

  _createClass(Queen, [{
    key: "add",
    value: function add(val) {
      this.temp.push(val);
    }
  }]);

  return Queen;
}();

var animateQueen = new Queen();

var Ball = function Ball(node, row, column, index, identification) {
  _classCallCheck(this, Ball);

  this.node = node;
  this.row = row; //第几行

  this.column = column; //第几列

  this.identification = identification; //ball对象的标识

  this.index = index; //在ballList中的下标
};

createBall();
cacheList = [];
collectCleanBallY();
initGame();

function initGame() {
  setTimeout(function () {
    refreshBallList().then(function () {
      moveToBottom();
      createNewBall();
      collectCleanBallX();
      collectCleanBallY();

      if (cleanListX.length || cleanListY.length) {
        setTimeout(function () {
          initGame();
        }, 900);
      } else {
        // 如果不需要清除了 就添加点击事件
        window.addEventListener('click', playHandler);
      }
    });
  }, 0);
}
/**
 * 
 * 小球下移方法
 * 
 * */


function moveToBottom() {
  //判断是否为空，为空，若为空则把上方的小球往下挪
  for (var i = ballList.length - 1; i > -1; i--) {
    if (!ballList[i] && ballList[i - 8]) {
      //如果当前ball为空  并且 上一个ball存在
      var preNode = ballList[i - 8].node; // 拿到上一个节点

      ballList[i] = ballList[i - 8]; // 当前节点就等于上一个节点

      ballList[i].row++;
      ballList[i].index += 8;
      preNode.style.top = parseInt(preNode.style.top) + 100 + 'px';
      ballList[i - 8] = null;
      moveToBottom();
    }
  }
}
/**
 * 重新填充小球的方法
 */


function createNewBall() {
  for (var i = 1; i < 9; i++) {
    var initCount = 1;

    for (var j = 6; j > 0; j--) {
      var index = j * 8 - i;

      if (!ballList[index]) {
        (function () {
          var row = Math.floor(index / 8) + 1;
          var column = index % 8 + 1;
          var ball = document.createElement('img'); // ball.style.background = createColor()

          ball.style.display = 'inline-block';
          ball.src = createColor();
          ball.style.width = '100px';
          ball.style.height = '100px';
          ball.style.borderRadius = '50%';
          ball.style.position = 'absolute';
          ball.style.top = "-".concat(initCount * 100, "px");
          ball.style.left = "".concat((column - 1) * 100, "px");
          ball.style.textAlign = 'center';
          var ballObj = new Ball(ball, row, column, index, ball.src);
          ballList[index] = ballObj;
          DIV.appendChild(ball);
          initCount++;
          setTimeout(function () {
            ball.style.top = "".concat((row - 1) * 100, "px");
          }, 100);
        })();
      }
    }
  }
}
/**
 * 创建线条方法
 */


function createLine() {
  for (var i = 0; i < 8; i++) {
    var line = document.createElement('span');
    line.style.position = 'absolute';
    line.style.borderLeft = '1px solid #fff';
    line.style.left = "".concat(100 * i, "px");
    line.style.height = '100vh';
    DIV.appendChild(line);
  }

  for (var _i = 0; _i < 9; _i++) {
    var _line = document.createElement('span');

    _line.style.position = 'absolute';
    _line.style.borderTop = '1px solid #fff';
    _line.style.top = "".concat(100 * _i, "px");
    _line.style.width = '100vw';
    DIV.appendChild(_line);
  }
}
/**
 * 创建小球方法
 */


function createBall() {
  for (var i = 0; i < 48; i++) {
    // 计算球的 x坐标 和 y坐标
    var row = Math.floor(i / 8) + 1;
    var column = i % 8 + 1;
    var ball = document.createElement("img");
    ball.style.display = "inline-block";
    ball.src = createColor();
    ball.style.width = '100px';
    ball.style.height = '100px';
    ball.style.borderRadius = '50%';
    ball.style.position = 'absolute';
    ball.style.top = "".concat((row - 1) * 100, "px");
    ball.style.left = "".concat((column - 1) * 100, "px"); // ball.innerText = i

    ball.style.textAlign = 'center';
    var ballObj = new Ball(ball, row, column, i, ball.src);
    ballList.push(ballObj);
    collectCleanBall(ballObj, 'row', cleanListX); // 将生成的ball添加到页面

    DIV.appendChild(ball);
  }
}
/**
 * 收集要清除小球的方法
 * ballObj：Ball对象
 * direction：横向还是纵向 ('row'/'column')
 * cleanTemp：收集存放的容器
 */


function collectCleanBall(ballObj, direction, cleanTemp) {
  if (cacheList.length == 0) {
    // 1.如果cacheList 为空，则直接添加ball对象
    cacheList.push(ballObj);
  } else {
    // 2.否则判断cacheList的长度是否小于3 
    if (cacheList.length < 3) {
      // 2.1-如果x坐标相同  则直接从cacheList取值进行对比
      if (cacheList[0][direction] !== ballObj[direction] || cacheList[0].identification !== ballObj.identification) {
        // 如果x坐标不同 或者 identification不同，则清空cacheList
        cacheList = [];
      }

      cacheList.push(ballObj);

      if (ballObj.index == 47 && cacheList.length == 3) {
        // 如果当前是最后一个ball 并且cacheList长度为3则进行 添加cleanTemp
        cacheList.forEach(function (item) {
          cleanTemp.push(item);
        });
        cacheList = [];
      }
    } else {
      // 2.2-如果横坐标不相等 或者 标识不同，清空cacheList 存入cleanTemp
      if (ballObj[direction] !== cacheList[cacheList.length - 1][direction] || ballObj.identification !== cacheList[cacheList.length - 1].identification) {
        cacheList.forEach(function (item) {
          cleanTemp.push(item);
        });
        cacheList = [];
      }

      cacheList.push(ballObj);
    }
  }
} // 收集要清除Y纵向小球的方法


function collectCleanBallY() {
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 6; j++) {
      var index = j * 8 + i;
      var ballObj = ballList[index];
      collectCleanBall(ballObj, 'column', cleanListY);
    }
  }
} // 收集要清除X纵向小球的方法


function collectCleanBallX() {
  for (var i = 0; i < 48; i++) {
    var ballObj = ballList[i];
    collectCleanBall(ballObj, 'row', cleanListX);
  }
} // 生成随机颜色


function createColor() {
  var colorArray = ["assets/cat1.png", "assets/cat2.png", "assets/cat3.png", "assets/cat4.png", "assets/cat5.png", "assets/cat6.png"];
  var len = colorArray.length;
  var index = Math.floor(Math.random() * len);
  return "".concat(colorArray[index]);
} // 消除符合要求的小球


function refreshBallList() {
  // 消除小球的时候解绑事件
  window.removeEventListener('click', playHandler);
  var allCleanBall = new Set([].concat(_toConsumableArray(cleanListX), _toConsumableArray(cleanListY)));

  _toConsumableArray(allCleanBall).forEach(function (item) {
    item.node.classList.add('tosmall');
  });

  cleanListX = [];
  cleanListY = [];
  return new Promise(function (resolve, reject) {
    return setTimeout(function () {
      _toConsumableArray(allCleanBall).forEach(function (item) {
        if (item.node) {
          var index = item.index;
          ballList[index] = null;
          DIV.removeChild(item.node);
        }
      });

      resolve();
    }, 1000);
  });
} // 清楚选中队列方法


function cleanSecQueen() {
  if (secQueen[0]) secQueen[0].node.style.padding = 0;
  if (secQueen[1]) secQueen[1].node.style.padding = 0;
  secQueen = [];
} // 调换两个节点位置


function replacePostion() {
  // 调换两个ball的位置 
  var firstNode = secQueen[0].node; //第一个节点

  var lastNode = secQueen[1].node; //第二个节点

  if (firstNode.style.top == lastNode.style.top) {
    var _ref = [firstNode.style.left, lastNode.style.left];
    lastNode.style.left = _ref[0];
    firstNode.style.left = _ref[1];
  }

  if (firstNode.style.left == lastNode.style.left) {
    var _ref2 = [firstNode.style.top, lastNode.style.top];
    lastNode.style.top = _ref2[0];
    firstNode.style.top = _ref2[1];
  }

  ballList[secQueen[0].index].node = lastNode;
  ballList[secQueen[1].index].node = firstNode;
  var firstTag = secQueen[0].identification;
  var lastTag = secQueen[1].identification;
  var _ref3 = [lastTag, firstTag];
  ballList[secQueen[0].index].identification = _ref3[0];
  ballList[secQueen[1].index].identification = _ref3[1];
} // 给游戏区域添加点击事件


window.addEventListener('click', playHandler);

function playHandler(e) {
  if (e.clientX < 800 && e.clientY < 600) {
    var row = Math.ceil(e.clientY / 100);
    var column = Math.ceil(e.clientX / 100);

    if (secQueen[0] && secQueen[0].row == row && secQueen[0].column == column) {
      cleanSecQueen();
      return;
    }

    for (var i = 0; i < ballList.length; i++) {
      if (ballList[i].row == row && ballList[i].column == column) {
        secQueen.push(ballList[i]);
        ballList[i].node.style.padding = '5px'; // 如果长度等于2，就进行位置对调

        if (secQueen.length == 2) {
          if ((secQueen[0].row == secQueen[1].row || secQueen[0].column == secQueen[1].column) && Math.abs(secQueen[0].row - secQueen[0].column - (secQueen[1].row - secQueen[1].column)) == 1) {
            window.removeEventListener('click', playHandler);
            replacePostion(); // 换完位置后  搜索要清楚的横纵ball

            collectCleanBallX();
            collectCleanBallY();

            if (cleanListX.length || cleanListY.length) {
              setTimeout(function () {
                initGame();
                cleanSecQueen();
              }, 800);
            } else {
              setTimeout(function () {
                replacePostion();
                window.addEventListener('click', playHandler);
                cleanSecQueen();
              }, 1100);
            }
          } else {
            secQueen[0].node.style.padding = 0;
            secQueen.shift();
          }
        }

        break;
      }
    }
  } else {
    if (secQueen.length == 0) return;
    cleanSecQueen();
  }
}