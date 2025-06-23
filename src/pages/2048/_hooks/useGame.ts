import { createSignal } from "solid-js";

import type { Direction } from "../_types";

export function useGame(gridSize: number, initialTiles: number) {
  const createEmptyGrid = () =>
    Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill(0)) as number[][];

  const [grid, setGrid] = createSignal(createEmptyGrid());
  const [score, setScore] = createSignal(0);
  const [gameOver, setGameOver] = createSignal(false);
  const [inMenu, setInMenu] = createSignal(true);

  function addRandomTile(currentGrid: number[][]) {
    const emptyCells: { i: number; j: number }[] = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (currentGrid[i]![j] === 0) emptyCells.push({ i, j });
      }
    }
    if (emptyCells.length === 0) return currentGrid;
    const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)]!;
    const newGrid = currentGrid.map((row) => [...row]);
    newGrid[i]![j] = Math.random() < 0.9 ? 2 : 4;
    return newGrid;
  }

  function initGame() {
    let newGrid = createEmptyGrid();
    setScore(0);
    for (let i = 0; i < initialTiles; i++) {
      newGrid = addRandomTile(newGrid);
    }
    setGrid(newGrid);
    setGameOver(false);
    setInMenu(false);
  }

  function pushNumbers(arr: number[], addScore: (val: number) => void) {
    let newArr = arr.filter((x) => x !== 0);
    for (let i = 0; i < newArr.length - 1; i++) {
      if (newArr[i] === newArr[i + 1]) {
        newArr[i]! *= 2;
        addScore(newArr[i]!);
        newArr.splice(i + 1, 1);
      }
    }
    while (newArr.length < gridSize) newArr.push(0);
    return newArr;
  }

  function move(direction: Direction) {
    let moved = false;
    let newScore = score();
    const newGrid = grid().map((row) => [...row]); // deep copy

    const addScore = (val: number) => {
      newScore += val;
    };

    switch (direction) {
      case "up":
        for (let j = 0; j < gridSize; j++) {
          let column = newGrid.map((row) => row[j]!);
          let newColumn = pushNumbers(column, addScore);
          for (let i = 0; i < gridSize; i++) {
            if (newGrid[i]![j] !== newColumn[i]) {
              moved = true;
              newGrid[i]![j] = newColumn[i]!;
            }
          }
        }
        break;
      case "down":
        for (let j = 0; j < gridSize; j++) {
          let column = newGrid.map((row) => row[j]!).reverse();
          let newColumn = pushNumbers(column, addScore).reverse();
          for (let i = 0; i < gridSize; i++) {
            if (newGrid[i]![j] !== newColumn[i]) {
              moved = true;
              newGrid[i]![j] = newColumn[i]!;
            }
          }
        }
        break;
      case "left":
        for (let i = 0; i < gridSize; i++) {
          let row = newGrid[i]!;
          let newRow = pushNumbers(row, addScore);
          for (let j = 0; j < gridSize; j++) {
            if (newGrid[i]![j] !== newRow[j]) {
              moved = true;
              newGrid[i]![j] = newRow[j]!;
            }
          }
        }
        break;
      case "right":
        for (let i = 0; i < gridSize; i++) {
          let row = [...newGrid[i]!].reverse();
          let newRow = pushNumbers(row, addScore).reverse();
          for (let j = 0; j < gridSize; j++) {
            if (newGrid[i]![j] !== newRow[j]) {
              moved = true;
              newGrid[i]![j] = newRow[j]!;
            }
          }
        }
        break;
    }

    if (moved) {
      setGrid(addRandomTile(newGrid));
      setScore(newScore);
      if (checkGameOver(newGrid)) {
        setGameOver(true);
        setInMenu(false);
      }
    }
  }

  function checkGameOver(currentGrid: number[][]) {
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (currentGrid[i]![j] === 0) return false;
        if (i < gridSize - 1 && currentGrid[i]![j] === currentGrid[i + 1]![j])
          return false;
        if (j < gridSize - 1 && currentGrid[i]![j] === currentGrid[i]![j + 1])
          return false;
      }
    }
    return true;
  }

  return {
    grid,
    score,
    gameOver,
    inMenu,
    setInMenu,
    initGame,
    move,
    checkGameOver,
    setGameOver,
  };
}
