const fs = require("fs");

class MatrixHandler {
  static loadFromFile(filePath) {
    const matrix = { rows: 0, cols: 0, data: [] };

    try {
      const lines = fs.readFileSync(filePath, "utf-8").split("\n").map(l => l.trim()).filter(l => l);

      matrix.rows = parseInt(lines[0].split("=")[1]);
      matrix.cols = parseInt(lines[1].split("=")[1]);

      const entryPattern = /^\(\s*-?\d+\s*,\s*-?\d+\s*,\s*-?\d+\s*\)$/;

      for (let i = 2; i < lines.length; i++) {
        if (!entryPattern.test(lines[i])) {
          throw new Error(`Invalid format at line ${i + 1}`);
        }

        const [x, y, val] = lines[i]
          .slice(1, -1)
          .split(",")
          .map(s => parseInt(s.trim()));

        matrix.data.push({ x, y, val });
      }

      return matrix;
    } catch (err) {
      console.error("Error reading file:", err.message);
      throw new Error("Matrix loading failed.");
    }
  }

  static performOperation(matA, matB, operation) {
    if (matA.rows !== matB.rows || matA.cols !== matB.cols) {
      throw new Error("Matrix sizes must match.");
    }

    const result = { rows: matA.rows, cols: matA.cols, data: [] };

    const mapB = new Map(matB.data.map(entry => [`${entry.x},${entry.y}`, entry.val]));

    for (const entry of matA.data) {
      const key = `${entry.x},${entry.y}`;
      const bVal = mapB.get(key) || 0;
      const newVal = operation(entry.val, bVal);

      if (newVal !== 0) {
        result.data.push({ x: entry.x, y: entry.y, val: newVal });
      }

      mapB.delete(key);
    }

    for (const [key, bVal] of mapB.entries()) {
      const [x, y] = key.split(",").map(Number);
      const newVal = operation(0, bVal);

      if (newVal !== 0) {
        result.data.push({ x, y, val: newVal });
      }
    }

    return result;
  }

  static add(matA, matB) {
    return MatrixHandler.performOperation(matA, matB, (a, b) => a + b);
  }

  static subtract(matA, matB) {
    return MatrixHandler.performOperation(matA, matB, (a, b) => a - b);
  }

  static multiply(matA, matB) {
    if (matA.cols !== matB.rows) {
      throw new Error("Invalid dimensions for multiplication.");
    }

    const result = { rows: matA.rows, cols: matB.cols, data: [] };
    const bMap = {};

    for (const item of matB.data) {
      if (!bMap[item.x]) bMap[item.x] = {};
      bMap[item.x][item.y] = item.val;
    }

    const output = new Map();

    for (const a of matA.data) {
      const rowInB = bMap[a.y];
      if (rowInB) {
        for (const [col, bVal] of Object.entries(rowInB)) {
          const key = `${a.x},${col}`;
          const current = output.get(key) || 0;
          output.set(key, current + (a.val * bVal));
        }
      }
    }

    for (const [key, val] of output.entries()) {
      if (val !== 0) {
        const [x, y] = key.split(",").map(Number);
        result.data.push({ x, y, val });
      }
    }

    return result;
  }

  static transpose(matrix) {
    return {
      rows: matrix.cols,
      cols: matrix.rows,
      data: matrix.data.map(({ x, y, val }) => ({ x: y, y: x, val }))
    };
  }
}

module.exports = {
  importMatrix: MatrixHandler.loadFromFile,
  addMatrices: MatrixHandler.add,
  subtractMatrices: MatrixHandler.subtract,
  multiplyMatrices: MatrixHandler.multiply,
  transposeMatrix: MatrixHandler.transpose
};
