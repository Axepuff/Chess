'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var arts = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

var Chess = function () {
  function Chess(_ref) {
    var container = _ref.container;

    _classCallCheck(this, Chess);

    this.container = container;
    this.figPoses = {
      white: [],
      black: []
    };
    this.whiteFigures = [];
    this.blackFigures = [];
    this.boardWrapper = document.createElement('div');
    this.boardWrapper.classList = 'board-wrapper';
    this.container.append(this.boardWrapper);
  }

  _createClass(Chess, [{
    key: 'render',
    value: function render() {
      this._renderBoard();
      this._calcFigures();
      this._renderFigures();
      this._calcSteps('white');
      this._calcSteps('black');
      this._renderLegend();
      this._addHandlers();
    }
  }, {
    key: '_getCoords',
    value: function _getCoords(elem) {
      var box = elem.getBoundingClientRect();
      return {
        top: Math.round(box.top + pageYOffset),
        left: Math.round(box.left + pageXOffset)
      };
    }
  }, {
    key: '_renderBoard',
    value: function _renderBoard() {
      var board = document.createElement('div');
      board.classList = 'board';
      var widthArr = Array.from(Array(8).keys()).reverse();
      var cellIndex = -1;
      var cells = widthArr.map(function (num) {
        cellIndex += 1;
        return arts.map(function (art, i) {
          return '<div class=\'cell ' + ((i + cellIndex) % 2 ? 'cell_dark' : '') + '\' data-pos=' + [art, num] + '></div>';
        });
      }).reduce(function (acc, val) {
        return acc.concat(val);
      }).join('');

      board.innerHTML = cells;
      this.boardWrapper.append(board);
    }
  }, {
    key: '_renderLegend',
    value: function _renderLegend() {
      var _this = this;

      var createArts = function createArts(direction, side) {
        var calcCoords = function calcCoords(cell) {
          if (direction === 'vertical') {
            return {
              top: _this._getCoords(cell).top + 'px',
              left: _this._getCoords(cell).left + (side === 'left' ? -50 : 50) + 'px'
            };
          }
          return {
            top: _this._getCoords(cell).top + (side === 'bottom' ? 50 : -50) + 'px',
            left: _this._getCoords(cell).left + 'px'
          };
        };
        arts.forEach(function (art, i) {
          var selector = void 0;
          if (direction === 'vertical') {
            selector = side === 'left' ? '.cell[data-pos=\'a,' + i + '\']' : '.cell[data-pos=\'h,' + i + '\']';
          } else {
            selector = side === 'bottom' ? '.cell[data-pos=\'' + art + ',0\']' : '.cell[data-pos=\'' + art + ',7\']';
          };
          var artNode = document.createElement('div');
          artNode.textContent = direction === 'vertical' ? i + 1 : art;
          artNode.classList = 'art';
          var cell = document.querySelector(selector);
          var coords = calcCoords(cell);
          artNode.style.top = coords.top;
          artNode.style.left = coords.left;
          _this.boardWrapper.append(artNode);
        });
      };
      createArts('vertical', 'left');
      createArts('vertical', 'right');
      createArts('horizontal', 'bottom');
      createArts('horizontal', 'top');
    }
  }, {
    key: '_calcFigures',
    value: function _calcFigures() {
      var leftTopCell = document.querySelector('.cell');
      var leftBottomCell = document.querySelectorAll('.cell')[document.querySelectorAll('.cell').length - 8];
      this.figPoses.white = this._getCoords(leftTopCell);
      this.figPoses.black = this._getCoords(leftBottomCell);
    }
  }, {
    key: '_renderFigures',
    value: function _renderFigures() {
      var _this2 = this;

      var whiteSymbols = ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖', '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'];
      var blackSymbols = ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'];
      var coordsSymbols = function coordsSymbols(symbols, type) {
        var horStep = 0;
        return symbols.map(function (el, i) {
          var fig = document.createElement('div');
          var vertStep = i > 7 ? 2 : 1;
          if (i === 8) {
            horStep = 0;
          }
          fig.append(el);
          fig.classList = 'figure figure_' + type + ' active';
          if (type === 'black') {
            fig.style.top = _this2.figPoses.white.top - 40 - 60 * vertStep + 'px';
            fig.style.left = _this2.figPoses.white.left + horStep * 60 + 'px';
          } else {
            fig.style.top = _this2.figPoses.black.top + 40 + 60 * vertStep + 'px';
            fig.style.left = _this2.figPoses.black.left + horStep * 60 + 'px';
          }
          horStep += 1;
          _this2.boardWrapper.append(fig);
          return fig;
        });
      };
      this.whiteFigures = coordsSymbols(whiteSymbols, 'white');
      this.blackFigures = coordsSymbols(blackSymbols, 'black');
    }
  }, {
    key: '_calcSteps',
    value: function _calcSteps(type) {
      var row1 = type === 'white' ? 0 : 6;
      var figures = type === 'white' ? this.whiteFigures : this.blackFigures;
      var i = 0;
      figures.forEach(function (elem) {
        if (i === 8) {
          i = 0;
          row1 += 1;
        };
        elem.setAttribute('data-pos', arts[i] + ',' + row1);
        i += 1;
      });
    }
  }, {
    key: '_addHandlers',
    value: function _addHandlers() {
      var _this3 = this;

      this.container.addEventListener('click', function (e) {
        var target = e.target;
        if (target.classList.contains('figure')) {
          var attr = target.getAttribute('data-pos');
          var cell = document.querySelector('.cell[data-pos=\'' + attr + '\']');
          target.style.left = _this3._getCoords(cell).left + 'px';
          target.style.top = _this3._getCoords(cell).top + 'px';
          target.classList.remove("active");
        }
      });
    }
  }]);

  return Chess;
}();

var app = document.querySelector('.app');

var chess = new Chess({ container: app });
chess.render();