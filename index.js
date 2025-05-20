const fs = require("fs");
const readline = require("readline");
const matrixUtils = require("./lib");

function displayTitle() {
  console.log("===============================================");
  console.log("             MATRIX OPERATIONS TOOL            ");
  console.log("===============================================");
}

function divider() {
  console.log("-----------------------------------------------");
}

function promptUserChoice() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    console.log("\nSelect an operation to perform:");
    console.log("1. Addition");
    console.log("2. Subtraction");
    console.log("3. Multiplication");
    console.log("4. Exit");
    rl.question("Type your option (1-4): ", (response) => {
      rl.close();
      resolve(response.trim());
    });
  });
}

function showOutcome(label, output) {
  console.log("\n************** OUTPUT **************");
  console.log(`Chosen Operation: ${label.toUpperCase()}`);
  console.log("------------------------------------");
  console.log(output);
  console.log("************************************\n");
}

async function runCalculator() {
  displayTitle();

  console.log("\nLoading matrix data...");
  const matrixA = matrixUtils.importMatrix("matrixfile1.txt");
  const matrixB = matrixUtils.importMatrix("matrixfile3.txt");
  const flippedB = matrixUtils.transposeMatrix(matrixB);
  console.log("Matrices loaded successfully!");

  while (true) {
    divider();

    const selection = await promptUserChoice();

    divider();

    let operationName;
    let resultMatrix;

    switch (selection) {
      case "1":
        operationName = "addition";
        resultMatrix = matrixUtils.addMatrices(matrixA, matrixB);
        break;
      case "2":
        operationName = "subtraction";
        resultMatrix = matrixUtils.subtractMatrices(matrixA, matrixB);
        break;
      case "3":
        operationName = "multiplication";
        resultMatrix = matrixUtils.multiplyMatrices(matrixA, flippedB);
        break;
      case "4":
        console.log("Exiting MATRIX OPERATIONS TOOL...");
        console.log("===============================================");
        return;
      default:
        console.log("Invalid input. Please enter a number from 1 to 4.");
        continue;
    }

    console.log("Calculating...");
    showOutcome(operationName, resultMatrix);
  }
}

runCalculator();
