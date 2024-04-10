var maze = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 2, 0, 0, 1, 1, 1, 0, 3, 1],
        [1, 0, 1, 0, 1, 1, 1, 0, 1, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    
function canMove(x, y) {
    return x >= 0 && x < maze[0].length && y >= 0 && y < maze.length && maze[y][x] !== 1;
    }

    
function renderMaze() {
        const mazeContainer = document.getElementById('maze');
        mazeContainer.innerHTML = ''; // Clear the previous rendering
        maze.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                const cellElement = document.createElement('div');
                cellElement.className = getClassName(cell, cellIndex, rowIndex);
                mazeContainer.appendChild(cellElement);
            });
        });
    }

function getClassName(cell, x, y) {
        if (cell === 1) return 'wall';
        if (x === playerPosition.x && y === playerPosition.y) {
            // Use the player's facing direction to determine the class
            return `player player-${playerPosition.facing.toLowerCase()}`;
        }
        if (cell === 3) return 'goal';
        return 'path';
    }
    
    
function turnLeft() {
        const directions = ["N", "W", "S", "E"];
        playerPosition.facing = directions[(directions.indexOf(playerPosition.facing) + 1) % directions.length];
        renderMaze(); // Re-render after turning
    }
    
function turnRight() {
        const directions = ["N", "E", "S", "W"];
        playerPosition.facing = directions[(directions.indexOf(playerPosition.facing) + 1) % directions.length];
        renderMaze(); // Re-render after turning
    }
    
function moveForward() {
        let newX = playerPosition.x;
        let newY = playerPosition.y;
    
        switch (playerPosition.facing) {
            case "N": newY -= 1; break;
            case "S": newY += 1; break;
            case "E": newX += 1; break;
            case "W": newX -= 1; break;
        }
    
        // Check if the move is into a wall
        if (!canMove(newX, newY)) {
            hitWall = true;
            alert("You've hit a wall! You took the wrong path.");
            resetMaze(); // Call the reset function after the user clicks "OK"
        } else {
            // Proceed with the move if it's not into a wall
            maze[playerPosition.y][playerPosition.x] = 0; // Mark old position as path
            playerPosition.x = newX;
            playerPosition.y = newY;
            if (maze[newY][newX] === 3) {
                alert('Congratulations! You reached the goal!');
            }
            maze[newY][newX] = 2; // Mark new position as player
            renderMaze();
        }
    }
    

    
async function runCommands() {
        const commands = document.getElementById('commands').value.split('\n');
        for (const command of commands) {
            await executeCommand(command.trim().toLowerCase());
            await new Promise(resolve => setTimeout(resolve, 500)); // Adds delay for visual effect
        }
    }

async function executeCommand(command) {
    if (command.startsWith("if") && command.includes("else")) {
        const parts = command.split("-");
        const condition = parts[0].slice(2); // Get the condition without the 'if' prefix
        const commandThen = parts[1];
        const commandElse = parts[3]; // Assuming else is at index 2 and its command is at index 3

        let conditionMet = false;

        if (condition === "pathAhead" && isPathAhead()) {
            conditionMet = true;
        } else if (condition === "pathLeft" && isPathLeft()) {
            conditionMet = true;
        } else if (condition === "pathRight" && isPathRight()) {
            conditionMet = true;
        }

        if (conditionMet) {
            await executeCommand(commandThen); // Execute the 'then' command
        } else {
            await executeCommand(commandElse); // Execute the 'else' command
        }
    
    
    }
    else if (command.startsWith("if")) {
        const [ifPart, action] = command.split("-");
        const condition = ifPart.slice(2); // Remove the 'if' prefix

        let conditionMet = false;

        if (condition === "pathAhead" && isPathAhead()) {
            conditionMet = true;
        } else if (condition === "pathLeft" && isPathLeft()) {
            conditionMet = true;
        } else if (condition === "pathRight" && isPathRight()) {
            conditionMet = true;
        }

        if (conditionMet) {
            await executeCommand(action); // Execute the action command
        }
    }
        else {
            switch (command) {
                case 'moveforward':
                    await moveForward();
                    break;
                case 'turnleft':
                    await turnLeft();
                    break;
                case 'turnright':
                    await turnRight();
                    break;
                // ...other cases for direct commands...
                default:
                    console.log("Unknown command:", command);
                    break;
            }
        }
        // Re-render the maze and add a delay after the command execution
        renderMaze();
        await new Promise(resolve => setTimeout(resolve, 500)); // Delay for visualization
    }
    
    
    

function getCoordinatesAhead() {
        let { x, y } = playerPosition;
        switch (playerPosition.facing) {
            case "N":
                y -= 1;
                break;
            case "S":
                y += 1;
                break;
            case "E":
                x += 1;
                break;
            case "W":
                x -= 1;
                break;
        }
        return { x, y };
    }
    
function getCoordinatesLeft() {
        let { x, y } = playerPosition;
        // Temporarily change facing to calculate left coordinates
        let facingLeft = { "N": "W", "W": "S", "S": "E", "E": "N" }[playerPosition.facing];
        switch (facingLeft) {
            case "N":
                y -= 1;
                break;
            case "S":
                y += 1;
                break;
            case "E":
                x += 1;
                break;
            case "W":
                x -= 1;
                break;
        }
        return { x, y };
    }
    
function getCoordinatesRight() {
        let { x, y } = playerPosition;
        // Temporarily change facing to calculate right coordinates
        let facingRight = { "N": "E", "E": "S", "S": "W", "W": "N" }[playerPosition.facing];
        switch (facingRight) {
            case "N":
                y -= 1;
                break;
            case "S":
                y += 1;
                break;
            case "E":
                x += 1;
                break;
            case "W":
                x -= 1;
                break;
        }
        return { x, y };
    }
    
function isPathAhead() {
        const { x, y } = getCoordinatesAhead();
        return canMove(x, y);
    }
    
function isPathLeft() {
        const { x, y } = getCoordinatesLeft();
        return canMove(x, y);
    }
    
function isPathRight() {
        const { x, y } = getCoordinatesRight();
        return canMove(x, y);
    }

    
let playerPosition = { x: 1, y: 1, facing: "N" };

    
document.addEventListener('DOMContentLoaded', function() {
        renderMaze();
     
    });


function resetMaze() {
        // Reset the maze array to its initial configuration
        // This is an example; you'll need to replace it with your maze's initial state
        maze = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 2, 0, 0, 1, 0, 1, 0, 3, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
    
        // Reset the player's position and facing direction to the starting values
        playerPosition = { x: 1, y: 1, facing: "N" }; // Update these values as per your game's starting conditions
    
        renderMaze(); // Re-render the maze to show the reset state
        location.reload();
    }

let commandSequence = [];

function addCommand(command) {
    commandSequence.push(command);
    displayCommands();
}

function displayCommands() {
    const commandList = document.getElementById('command-list');
    commandList.innerHTML = ''; // Clear existing commands
    commandSequence.forEach((command, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}: ${command}`;
        commandList.appendChild(li);
    });
}

async function runCommands() {
    for (const command of commandSequence) {
        await executeCommand(command); // Execute the command
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second (or any other delay)
    }
    commandSequence = []; // Reset command sequence after execution
    displayCommands(); // Update display
}

async function repeatUntilGoal() {
    let reachedGoal = false;
    let hitWall = false;

    while (!reachedGoal && !hitWall) {
        for (const command of commandSequence) {
            if (maze[playerPosition.y][playerPosition.x] === 3) { // Check if goal is reached
                reachedGoal = true;
                alert('Congratulations! You reached the goal!');
                break; // Exit the loop if the goal is reached
            }
            await executeCommand(command); // Execute the command
            if (maze[playerPosition.y][playerPosition.x] === 1) { // Check if hit a wall
                hitWall = true;
                alert("You've hit a wall! You took the wrong path.");
                resetMaze(); // Reset the maze if the player hits a wall
                break; // Exit the loop if a wall is hit
            }
            // Include a delay for visualization if desired
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
}


async function ifThenElse(commandIf, commandThen, commandElse) {
    let conditionMet = false;

    // Check the condition of the 'if' part
    if (commandIf === "ifPathAhead" && isPathAhead()) {
        conditionMet = true;
    } else if (commandIf === "ifPathLeft" && isPathLeft()) {
        conditionMet = true;
    } else if (commandIf === "ifPathRight" && isPathRight()) {
        conditionMet = true;
    }

    // Execute the 'then' part if the condition was met
    if (conditionMet) {
        await executeCommand(commandThen);
    }
    // Otherwise, execute the 'else' part
    else {
        await executeCommand(commandElse);
    }
}

function addIfThenElseCommand(ifCommand, thenCommand, elseCommand) {
    const fullCommand = `${ifCommand}-${thenCommand}-${elseCommand}`;
    commandSequence.push(fullCommand);
    displayCommands();
}

function addIfCommand() {
    const condition = document.getElementById('condition-dropdown').value;
    const command = document.getElementById('command-dropdown').value;
    
    if (condition && command) {
        const ifCommand = `if${condition}-${command}`;
        commandSequence.push(ifCommand);
        displayCommands(); // Update your display of commands
    } else {
        alert("Please select both a condition and a command.");
    }
}


function addIfElseCommand() {
    const condition = document.getElementById('condition-dropdown').value;
    const command = document.getElementById('command-dropdown').value;
    const elseCommand = document.getElementById('else-command-dropdown').value;
    
    if (condition && command && elseCommand) {
        const ifElseCommand = `if${condition}-${command}-else-${elseCommand}`;
        commandSequence.push(ifElseCommand);
        displayCommands(); // Update your display of commands
    } else {
        alert("Please select a condition, command, and else command.");
    }
}
