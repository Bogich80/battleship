// GLOBAL VARIABLES
const CANVAS = document.getElementById("GAME");
const SHIP_TYPE_1 = document.getElementById("battleship_type_1");
const EXPLOSION = document.getElementById("explosion")
const BORDER = {
  left: 20,
  top: 20,
  right: 90,
  bottom: 40
}

/**
 * HTML Object's draw surface
 * @type {CanvasRenderingContext2D}
 */
const ctx = CANVAS.getContext("2d");

/************************************************************************
 * Point is represent a coordinate x,y pairs
 * @param {Number} x 
 * @param {Number} y 
 ***********************************************************************/
function Point(x, y) {
  this.x = x;
  this.y = y;
}

/************************************************************************
 * Dimesion is represent a two dimensional extension
 * @param {Number} width 
 * @param {Number} height 
 ***********************************************************************/
function Dimension(width, height) {
  this.width = width;
  this.height = height;
}

/************************************************************************
 * Board define tha area of the game
 * x * y tiles
 ***********************************************************************/
function Board(canvas, x, y) {
  this.canvas = canvas;
  this.tilex = x;
  this.tiley = y;
  this.dimension = new Dimension(canvas.clientWidth - (BORDER.left + BORDER.right), canvas.clientHeight - (BORDER.top + BORDER.bottom));

  this.tile_width = function () {
    return this.dimension.width / this.tilex;
  }
  this.tile_height = function () {
    return this.dimension.height / this.tiley;
  }
}


function Explosion(x, y) {
  this.frame = 0;
  this.colindex = 3;
  this.rowindex = 3;
  this.x = x;
  this.y = y;
}

/************************************************************************
 * The Game class
 * @param {Canvas} canvas
 * @param {int} x
 * @param {int} y
 ***********************************************************************/
function Game(canvas, x, y) {
  const obj = {};
  obj.board = new Board(canvas, x, y);
  obj.mousePoint;
  obj.canvas = canvas;
  obj.explosion = undefined;
  obj.frame = 0;

  /**
   * Start the game with this function
   */
  obj.start = function () {
    obj.canvas.onmousemove = function (e) {
      var r = obj.canvas.getBoundingClientRect();
      obj.mousePoint = new Point(e.clientX - r.left, e.clientY - r.top);
    };

    // on mouse up take explosion under mouse cursor
    obj.canvas.onmouseup = function (e) {
      var r = obj.canvas.getBoundingClientRect();
      obj.explosion = new Explosion(e.clientX - r.left, e.clientY - r.top);
    };

    // let's draw
    obj.draw();
  };


  /**
   * Draw function render games (loop)
   */
  obj.draw = function () {
    obj.frame++;
    let width = obj.board.dimension.width;
    let height = obj.board.dimension.height;
    let tile_width = obj.board.tile_width();
    let tile_height = obj.board.tile_height();

    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, CANVAS.clientWidth, CANVAS.clientHeight);

    for (let x = 0; x < obj.board.tilex - 1; x++) {
      for (let y = 0; y < obj.board.tiley - 1; y++) {
        if (
          obj.mousePoint != null &&
          obj.mousePoint.x >= BORDER.left + x + x * tile_width &&
          obj.mousePoint.x <= BORDER.left + x + x * tile_width + tile_width &&
          obj.mousePoint.y >= BORDER.top + y + y * tile_height &&
          obj.mousePoint.y <= BORDER.top + y + y * tile_height + tile_height
        ) {
          ctx.fillStyle = "rgba(100,100,250, 1)";
        } else {
          ctx.fillStyle = "rgb(40,80,168)";
        }
        ctx.fillRect(
          BORDER.left + x + x * tile_width,
          BORDER.top + y + y * tile_height,
          tile_width,
          tile_height
        );
      }
    }

    //Draw ship1
    ctx.drawImage(SHIP_TYPE_1, CANVAS.clientWidth - BORDER.left - 50, BORDER.top, tile_width, tile_height * 4);

    //Animate Explosion
    if (obj.explosion != undefined) {

      let eframe = obj.explosion.frame;
      let y = obj.explosion.rowindex * 64;
      let x = obj.explosion.colindex * 64;

      ctx.drawImage(EXPLOSION, x, y, 64, 64, obj.explosion.x - 32, obj.explosion.y - 32, 64, 64);

      obj.explosion.frame++;
      obj.explosion.colindex--;
      if (obj.explosion.colindex < 0) {
        obj.explosion.colindex = 3;
        obj.explosion.rowindex--;
      }

      // Explosion end at frame 15
      if (obj.explosion.frame > 15) {
        obj.explosion = undefined;
      }
    }

    requestAnimationFrame(obj.draw);
  };

  return obj;
}

/************************************************************************
 * Entry point
 ***********************************************************************/
let game = new Game(CANVAS, 20, 20);
game.start();
