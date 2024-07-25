let board;
let score = 0;
let rows = 4;
let columns = 4;
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;
let startX = 0;
let startY = 0;

// Create function to set the gameboard
function setGame(){
    // Initialize the 4x4 game board with all tiles set to 0
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    // Create the game board on the HTML document
    // The first loop is to create rows, the second loop is to create columns
    for(let r=0; r < rows; r++){
        for(let c=0; c < columns; c++){

             // Create a div element representing a tile
             // Think of this as making a small box for each cell on the board
            let tile = document.createElement("div");
            
            // Set a unique id for each tile based on its coordinates
            tile.id = r.toString() + "-" + c.toString(); 
            
            // Get the number from the board
            // This number is like the content of the tile, a value that could represent something in the game
            // Wherein the board is currently set to 0
            let num = board[r][c];
            
            // Update the tile's apperance based on the value
            // This will be a function to adjust the content and appearance of the tile based on its number. It's like putting the right thing inside the box 
            updateTile(tile, num); 
            
            // Append the tile to the game board container
            // This means placing the tile inside the grid, in the right row and column
            // document.getElementById("board") - is targeting the div from the HTML file
            document.getElementById("board").append(tile); 

        }
    }

    // For Random Tile
    setTwo();
    setTwo();
}

// Function to update the appearance of a tile based on its number.
function updateTile(tile, num){
    // clear the tile
    tile.innerText = ""; 
    
    // clear the classList to avoid multiple classes
    tile.classList.value = ""; 
   
    // CSS class named "tile" is added to the classList of the tile, this will be for styling the tiles
    // If we will check the styles.css, we have created a styling earlier that uses the "tile" class
    tile.classList.add("tile");

    // This will check for the "num" parameter and will apply specific styling based on the number value.
    // If num is positive, the number is converted to a string and placed inside the tile as text.
    // But currently all the tile value is set to zero, because of the board inital values. 
    if(num > 0) {
        // Set the tile's text to the number based on the num value.
        tile.innerText = num.toString();
        // if num is less than or equal to 4096, a class based on the number is added to the tile's classlist. 
        // example: if num is 128, the class "x128" is added to the tile.
        if (num <= 4096){
            tile.classList.add("x"+num.toString());
        } else {
            // if num is greater than 4096, a special  class "x8192" is added.
            tile.classList.add("x8192");
        }
    }
}

window.onload = function() {
    // `setGame()` is called to be executed
    setGame();
}



function handleSlide(e) {
    // console.log(e.code)
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) {
        
        e.preventDefault(); 
        // [BUG FIXED] Added the canMove...() functions to fixed bugs related to random tile showing upon tile slide. 
        if (e.code == "ArrowLeft") {
            slideLeft();
            setTwo();
        } else if (e.code == "ArrowRight") {
            slideRight();
            setTwo();
        } else if (e.code == "ArrowUp") {
            slideUp();
            setTwo();
        } else if (e.code == "ArrowDown") {
            slideDown();
            setTwo();
        }
    }

    document.getElementById("score").innerText = score;     // Update score

    checkWin();

    // Call hasLost() to check for game over conditions
    if (hasLost()) {
        // Use setTimeout to delay the alert
        setTimeout(() => {
            alert("Game Over! You have lost the game. Game will restart");
            restartGame();
            alert("Click any arrow key to restart");
            // You may want to reset the game or perform other actions when the user loses.
        }, 100); // Adjust the delay time (in milliseconds) as needed

    }
}

// When any key is pressed, the handleSlide function is called to handle the key press.
document.addEventListener("keydown", handleSlide);

function filterZero(row){
    // create new array removing the zeroes
    // removing empty tiles
    return row.filter(num => num != 0) ;
}

// Core function for sliding and merging tiles in a row.
function slide(row){
    // row = [0, 2, 2, 2]
    row = filterZero(row); // get rid of zeroes -> [2, 2, 2]

    // Iterate through the row to check for adjacent equal numbers.
    //row = [2, 2, 2]
    for(let i = 0; i < row.length - 1; i++){
        /* 1st iteration:
        If index 0 == index 1 (2 == 2)
        (true) index 0 = 2 * 2 (4)
        Index 1 = 0 (4,0,2)

        2nd iteration:
        If index 1 == index 2 (0 == 2)
        (false) index 1 = 0
        Index 2 = 2 (4,0,2)
        */
        // If two adjacent numbers are equal.
        if(row[i] == row[i+1]){
            // merge them by doubling the first one
            row[i] *= 2;
            // and setting the second one to zero.      
            row[i+1] = 0;
            score += row[i];      
        } // [2, 2, 2] -> [4, 0, 2]
    }

    row = filterZero(row); //[4, 2]

    // Add zeroes back
    while(row.length < columns){
        // adds zero on the end of the array.
        row.push(0);
    } // [4, 2, 0, 0]

    return row; // [4,2,0,0]
}

function slideLeft(){
    // iterate through each row
    for(let r = 0; r < rows; r++){
        // The current row is stored in the variable `row`
        let row = board[r] // sample: 0, 2, 2, 2

        // This line for animation
        // 
        let originalRow = row.slice(); // store the array in a new variable

        row = slide(row); // call slide function
        // note: slide function will return a new value for a specific row.
        board[r] = row;  // update the value in the array

        // Update the id of the tile
        // For each tile in the row, the code finds the corresponding HTML element by its ID. It then gets the number from the board array at that row and column, and uses the updateTile function to update the content and appearance of the tile.
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            // Line for animation 
            if (originalRow[c] !== num && num !== 0) {  // if current tile != to the original tile, apply aninmation
                tile.style.animation = "slide-from-right 0.3s";
                // Remove the animation class after the animation is complete
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
            updateTile(tile, num)
        }
    }
}

function slideRight() {
    console.log("slide right");
    for(let r = 0; r < rows; r++){
        let row = board[r]

        // original is for animation
        let originalRow = row.slice();

        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;

        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            if (originalRow[c] !== num && num !== 0) {   // if current tile != to the original tile, apply aninmation
                tile.style.animation = "slide-from-left 0.3s";
                // Remove the animation class after the animation is complete
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }

            updateTile(tile, num)
        }
    }
}

function slideUp(){
    console.log("slide up");
    for(let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

        // For animation
        let originalRow = row.slice();

        row = slide(row);

        // Check which tiles have changed in this column
        // This will record the current position of tiles that have change. 
        let changedIndices = [];
        for (let r = 0; r < rows; r++) { 
            if (originalRow[r] !== row[r]) {
                /* 
                originalRow = [2, 0, 2, 0]
                row = [4, 0, 0, 0]

                1st iteration: 2 !== 4 (True) changeIndices = [0]
                2nd iteration: 0 !== 0 (False)
                3rd iteration: 2 !== 0 (True) changeIndices = [0, 2]
                4th iteration: 0 !== 0 (False)
                */
                changedIndices.push(r);
            }
        }

        for(let r = 0; r < rows; r++){
            board[r][c] = row[r]
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            // Animation - Add sliding effect by animating the movement of the tile
            if (changedIndices.includes(r) && num !== 0) {
                /* changeIndices [0, 2]
                1st iteration: 0 is in changeIndices, board[0][0] !==0 (True)(Apply slide-from-bottom Animation to the current tile)
                2nd iteration: 1 is not changeIndices, board[1][0]  (False)
                3rd iteration: 2 is in changeIndices, but board[2][0] !== 0 (False)
                4th iteration: 3 is not changeIndices, board[3][0] (False)
                */
                tile.style.animation = "slide-from-bottom 0.3s";
                // Remove the animation class after the animation is complete
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }

            updateTile(tile, num)
        }
    }
}

function slideDown(){
    console.log("slide down");
    for(let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]]

        // Animation
        let originalRow = row.slice();

        row.reverse();   
        row = slide(row); 
        row.reverse();
        
        // Check which tiles have changed in this column
        let changedIndices = [];
        for (let r = 0; r < rows; r++) {
                /* 
                originalRow = [2, 0, 2, 0]
                row = [0, 0, 0, 4]

                1st iteration: 2 !== 0 (True) changeIndices = [0]
                2nd iteration: 0 !== 0 (False)
                3rd iteration: 2 !== 0 (True) changeIndices = [0, 2]
                4th iteration: 0 !== 4 (True) changeIndices = [0, 2, 3]
                */

            if (originalRow[r] !== row[r]) {
                changedIndices.push(r);
            }
        }   // [0, 2, 3]

        for(let r = 0; r < rows; r++){
            board[r][c] = row[r]
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            // Animation - Add sliding effect by animating the movement of the tile
            if (changedIndices.includes(r) && num !== 0) {
                /*  changeIndices [0, 2, 3]
                    1st iteration: 0 is in changeIndices, board[0][0] !==0 (False)
                    2nd iteration: 1 is not changeIndices, board[1][0] (False)
                    3rd iteration: 2 is in changeIndices, but board[2][0] !== 0 (False)
                    4th iteration: 3 is in changeIndices, board[3][0] !== 0 (True) (Apply slide-from-top animation to the current tile)
                */

                tile.style.animation = "slide-from-top 0.3s";
                // Remove the animation class after the animation is complete
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }

            updateTile(tile, num)
        }
    }
}

// Returns a boolean
function hasEmptyTile(){
    // Iterate through the board
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            // Check if current tile == 0, if yes return true
            if(board[r][c] == 0){
                return true
            }
        }
    }
    // Return false if no tile == 0
    return false;
}

function setTwo(){
    // Check the hasEmptyTile boolean result, if hasEmptyTile == false, the setTwo will not proceed
    if(!hasEmptyTile()){
        return;
    }

    // Declare a value found(tile)
    let found = false;
    
    while(!found){
        // Math.random() - generates a number between 0 and 1, then multiplied by no. of columns or rows
        // Math.floor() - rounds down to the nearest integer 
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        // Check if the position (r, c) on the game board is empty (i.e., has a value of 0).
        if(board[r][c] == 0){
            // If the position value is 0, set the value to 2, representing the new "2" tile. 
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2")

            // Set the found variable to true to break the loop
            found = true;
        }
    }
}





function checkWin(){
    // iterate through the board
    for(let r =0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            // check if current tile == 2048 and is2048Exist == false
            if(board[r][c] == 2048 && is2048Exist == false){
                alert('You Win! You got the 2048');  // If true, alert and  
                is2048Exist = true;     // reassigned the value of is2048Exist to true to avoid continuous appearance of alert.
            } else if(board[r][c] == 4096 && is4096Exist == false) {
                alert("You are unstoppable at 4096! You are fantastically unstoppable!");
                is4096Exist = true;     // reassigned the value of is4096Exist to true to avoid continuous appearance of alert.
            } else if(board[r][c] == 8192 && is8192Exist == false) {
                alert("Victory!: You have reached 8192! You are incredibly awesome!");
                is8192Exist = true;    // reassigned the value of is8192Exist to true to avoid continuous appearance of alert.
            }
        }
    }
}

function hasLost() {
    // Check if the board is full
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) {
                // Found an empty tile, user has not lost
                return false;
            }

            const currentTile = board[r][c];

            // Check adjacent cells (up, down, left, right) for possible merge
            if (
                r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile
            ) {
                // Found adjacent cells with the same value, user has not lost
                return false;
            }
        }
    }

    // No possible moves left or empty tiles, user has lost
    return true;
}


// RestartGame by replacing all values into zero.
function restartGame(){
    // Iterate in the board and 
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            board[r][c] = 0;    // change all values to 0
        }
    }
    score = 0;
    setTwo()    // new tile   
}

document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    console.log(startX);
    startY = e.touches[0].clientY;
    console.log(startY);
});


document.addEventListener('touchmove', (e) => {

    if(!e.target.className.includes("tile")){
        return
    }

    e.preventDefault(); // This line disables scrolling
}, { passive: false }); // Use passive: false to make preventDefault() work


document.addEventListener('touchend', (e) => {
    
    // Check if the element that triggered the event has a class name containing "tile"
    if (!e.target.className.includes("tile")) {
        return; // If not, exit the function
    }
    
    // Calculate the horizontal and vertical differences between the initial touch position and the final touch position
    let diffX = startX - e.changedTouches[0].clientX;
    let diffY = startY - e.changedTouches[0].clientY;

    // Define a threshold to distinguish between a tap and a swipe
    const threshold = 5; // Adjust this value as needed

    // If the difference is below the threshold, consider it a tap
    if (Math.abs(diffX) < threshold && Math.abs(diffX) < threshold) {
        // It's a tap, you can handle tap actions here
        // For example, display information about the tile, open a modal, etc.
        return;
    }

    // Check if the horizontal swipe is greater in magnitude than the vertical swipe
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // [BUG FIXED] Added the canMove...() functions to fixed bugs related to random tile showing upon tile slide. 
        // Horizontal swipe
        if (diffX > 0) {
            if(canMoveLeft()){
                slideLeft(); // Call a function for sliding left
                setTwo(); // Call a function named "setTwo"
            }
        } else {
            if(canMoveRight()){
                slideRight(); // Call a function for sliding right
                setTwo(); // Call a function named "setTwo"
            }
        }
    } else {
        // Vertical swipe
        if (diffY > 0) {
            if(canMoveUp()){
                slideUp(); // Call a function for sliding up
                setTwo(); // Call a function named "setTwo"
            }
        } else {
            if(canMoveDown()){
                slideDown(); // Call a function for sliding down
                setTwo(); // Call a function named "setTwo"
            }
        }
    }

    document.getElementById("score").innerText = score;
        
    checkWin();

    // Call hasLost() to check for game over conditions
    if (hasLost()) {
        // Use setTimeout to delay the alert
        setTimeout(() => {
        alert("Game Over! You have lost the game. Game will restart");
        restartGame();
        alert("Click any key to restart");
        // You may want to reset the game or perform other actions when the user loses.
        }, 100); // Adjust the delay time (in milliseconds) as needed
    }
});