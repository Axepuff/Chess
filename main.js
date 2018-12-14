const arts = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
class Chess {
  constructor({container}) {
    this.container = container;
    this.figPoses = {
      white: [],
      black: [],
    };
    this.whiteFigures = [];
    this.blackFigures = [];
    this.boardWrapper = document.createElement('div');
    this.boardWrapper.classList = 'board-wrapper';
    this.container.append( this.boardWrapper)
  }

  render() {
    this._renderBoard();
    this._calcFigures();
    this._renderFigures();
    this._calcSteps('white');
    this._calcSteps('black');
    this._renderLegend();
    this._addHandlers();
  }

  _getCoords(elem) {
    const box = elem.getBoundingClientRect();
    return {
      top: Math.round(box.top + pageYOffset),
      left: Math.round(box.left + pageXOffset),
    };
  }

  _renderBoard() {
    const board = document.createElement('div');
    board.classList = 'board'
    const widthArr = Array.from(Array(8).keys()).reverse();
    let cellIndex = -1;
    const cells = widthArr
      .map(num => {
        cellIndex += 1
        return arts.map((art, i) => {
          return `<div class='cell ${(i + cellIndex) % 2 ? 'cell_dark' : ''}' data-pos=${[art, num]}></div>`
        })
      })
      .reduce((acc, val) => acc.concat(val))
      .join('');

      board.innerHTML = cells;
      this.boardWrapper.append(board);
  }

  _renderLegend() {
    const createArts = (direction, side) => {
      const calcCoords = (cell) => {
        if (direction === 'vertical') {
          return {
            top: this._getCoords(cell).top + 'px',
            left: this._getCoords(cell).left + ( side === 'left' ? -50 : 50 ) + 'px',
          };
        }
        return {
          top: this._getCoords(cell).top + ( side === 'bottom' ? 50 : -50 ) + 'px',
          left: this._getCoords(cell).left + 'px',
        };
      }
      arts.forEach((art, i) => {
        let selector;
        if (direction === 'vertical') {
          selector = side === 'left' ? `.cell[data-pos='a,${i}']` : `.cell[data-pos='h,${i}']`
        } else {
          selector = side === 'bottom' ? `.cell[data-pos='${art},0']` : `.cell[data-pos='${art},7']`
        };
        const artNode = document.createElement('div');
        artNode.textContent = direction === 'vertical' ? i + 1 : art;
        artNode.classList = 'art';
        const cell = document.querySelector(selector);
        const coords = calcCoords(cell);
        artNode.style.top = coords.top;
        artNode.style.left = coords.left;
        this.boardWrapper.append(artNode);
      })
    }
    createArts('vertical', 'left');
    createArts('vertical', 'right');
    createArts('horizontal', 'bottom');
    createArts('horizontal', 'top');
  }


  _calcFigures() {
    const leftTopCell = document.querySelector('.cell');
    const leftBottomCell = document.querySelectorAll('.cell')[ document.querySelectorAll('.cell').length - 8];
    this.figPoses.white = this._getCoords(leftTopCell);
    this.figPoses.black = this._getCoords(leftBottomCell);
  }

  _renderFigures() {
    const whiteSymbols = [ '♖','♘', '♗', '♕', '♔', '♗', '♘', '♖', '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'];
    const blackSymbols = [ '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♜','♞', '♝', '♛', '♚', '♝', '♞', '♜'];
    const coordsSymbols = (symbols, type) => {
      let horStep = 0;
      return symbols.map((el, i) => {
        const fig = document.createElement('div');
        const vertStep = i > 7 ? 2 : 1;
        if (i === 8) {
          horStep = 0;
        }
        fig.append(el);
        fig.classList = `figure figure_${type} active`;
        if (type === 'black') {
          fig.style.top = this.figPoses.white.top - 40 - 60 * vertStep  + 'px';
          fig.style.left = this.figPoses.white.left + (horStep * 60) + 'px';
        } else {
          fig.style.top = this.figPoses.black.top + 40 + 60 * vertStep  + 'px';
          fig.style.left = this.figPoses.black.left + (horStep * 60) + 'px';
        }
        horStep += 1;
        this.boardWrapper.append(fig);
        return fig;
      })
    }
    this.whiteFigures = coordsSymbols(whiteSymbols, 'white');
    this.blackFigures = coordsSymbols(blackSymbols, 'black');
  }

  _calcSteps(type) {
    let row1 = type === 'white' ? 0 : 6;
    let figures = type === 'white' ? this.whiteFigures : this.blackFigures;
    let i = 0;
    figures.forEach(elem => {
      if (i === 8) {
        i = 0;
        row1 += 1;
      };
      elem.setAttribute('data-pos', `${arts[i]},${row1}`);
      i += 1;
    })
  }

  _addHandlers() {
    this.container.addEventListener('click', (e) => {
      const target = e.target;
      if (target.classList.contains('figure')) {
        const attr = target.getAttribute('data-pos');
        const cell = document.querySelector(`.cell[data-pos='${attr}']`);
        target.style.left = this._getCoords(cell).left + 'px';
        target.style.top = this._getCoords(cell).top + 'px';
        target.classList.remove("active");
      }
    })
  }

}

const app = document.querySelector('.app')


const chess = new Chess({container: app})
chess.render()