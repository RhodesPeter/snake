const readline = require('readline');

const matrixSize = 15;
const snakePosition = [[1, 0], [0, 0]];
let foodPosition = [];
let direction = 'down';

// To stop multiple moves being made during each loop
let hasMoveBeenMadeThisLoop = false;

const createMatrix = () => {
  return Array(matrixSize)
    .fill()
    .map(() => Array(matrixSize).fill(' '));
}

const moveDown = position => [position[0] === matrixSize - 1 ? 0 : position[0] + 1, position[1]];
const moveUp = position => [position[0] === 0 ? matrixSize - 1 : position[0] - 1, position[1]];
const moveRight = position => [position[0], position[1] === matrixSize - 1 ? 0 : position[1] + 1];
const moveLeft = position => [position[0], position[1] === 0 ? matrixSize - 1 : position[1] - 1];

const updateSnakePosition = () => {
  // Add new head position to snake
  snakePosition.unshift(directionFunctions[direction](snakePosition[0]));
  
  // Remove last position of tail.
  snakePosition.pop();
};

const looper = () => {
  hasMoveBeenMadeThisLoop = false;

  setTimeout(() => {
    const boardMatrix = createMatrix();

    console.clear();

    updateSnakePosition();
    addSnakeToMatrix(boardMatrix);

    // Check if snake has eaten itself
    const snakePositionNums = snakePosition.map(val => val.join('')).slice(1);

    if (snakePositionNums.includes(snakePosition[0].join(''))) {
      console.log('Game over!')
      console.log(`You scored ${snakePosition.length - 2}`)
      return;
    }

    // Check if food has been eaten
    if (snakePosition[0].join('') === foodPosition.join('')) {
      // Add extra segment to snake
      snakePosition.push(foodPosition);
      createNewFoodPosition(boardMatrix);
    }

    // Add food peice to board
    boardMatrix[foodPosition[0]][foodPosition[1]] = '0';

    console.log(boardMatrix);
  
    looper();
  }, 250);
}

const directionFunctions = {
  up: moveUp,
  down: moveDown,
  right: moveRight,
  left: moveLeft
};

const listenToKeypress = () => {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);

  process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
      process.exit();
    }
    
    if (directionFunctions.hasOwnProperty(key.name) && !hasMoveBeenMadeThisLoop) {
      hasMoveBeenMadeThisLoop = true;

      const newDir = key.name;
      const lat = ['left','right'];
      const vert = ['up', 'down'];

      // Don't allow snake to turn around on the same row or column
      if (lat.includes(newDir) && lat.includes(direction) || vert.includes(newDir) && vert.includes(direction)) return;
      
      direction = key.name;
    }
  });
};

const createNewFoodPosition = (matrix) => {
  const freeSpaces = matrix.map((row, i) => row
    .map((space, ii) => space.includes('X') ? null : [i, ii])
    .filter(_=>_));

  const freeSpacesFlat = freeSpaces.reduce((a, b) => a.concat(b), []);
  const randomLocation = freeSpacesFlat[Math.floor(Math.random() * freeSpacesFlat.length) + 1];

  foodPosition = randomLocation;
}

const addSnakeToMatrix = (matrix) => {
  snakePosition.forEach(position => matrix[position[0]][position[1]] = 'X');
};

const initGame = () => {
  const matrix = createMatrix();

  addSnakeToMatrix(matrix);
  createNewFoodPosition(matrix);
  looper(matrix);
  listenToKeypress();
}

initGame();
