/*
todo list:

1. Handle overwrite hole in editor
2. Make it unable to save a course without a tee or hole
5. Ensure next hole button is not visible in options menu
4. Helping bubbles to explain ui, and first time things happens, like first time landing on different terrain
5. Options where music, dice or all sounds can be disabled
6. A way to restart the game

*/
const courseWidth = 16;
const courseHeight = 32;

var ctx = null;
let course = null;
let ballX = -1;
let ballY = -1;
let holeX = -1;
let holeY = -1;
let teeX = -1;
let teeY = -1;
let holeNo = 1;
let strokeNo = 1;
let waitingForUserStroke = false;
let validMoves = [];
let scores = [];
let userStrokeTimer = null;
let club = ClubType.Driver;

let bufferCanvas = document.createElement('canvas');
let bufferCtx = bufferCanvas.getContext('2d');
let dice = null;
let animatedBackground = null;

let options = new Options();

let testingFromEditor = false;
let inGame = false;


function isSafari() {
    var is_safari = navigator.userAgent.toLowerCase().indexOf('safari/') > -1;
    return is_safari;
}

function adjustCanvasSize() {
    clearCanvas();
    let screenWidth = window.outerWidth;
    let screenHeight = window.outerHeight;
    let courseWidth = Math.floor(screenWidth / 16);
    let courseHeight = Math.floor(screenHeight / 32);
    if (courseWidth * 2 > courseHeight) {
        gridSize = Math.floor(courseHeight * 0.85);
    } else {
        gridSize = courseWidth;
    }
    course.gridSize = gridSize;
    gameCanvas.width = gridSize * 16;
    gameCanvas.height = gridSize * 32;
    bufferCanvas.width = gameCanvas.width;
    bufferCanvas.height = gameCanvas.height;
    course.draw(bufferCtx);
    ctx.drawImage(bufferCanvas, 0, 0);
}

function clearCanvas() {
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    bufferCtx.fillStyle = 'green';
    bufferCtx.fillRect(0, 0, bufferCanvas.width, bufferCanvas.height);
}

function loadData() {
    if (testingFromEditor) {
        let data = localStorage.getItem("course");
        if (data) {
            course.courseData = JSON.parse(data).map(row => row.map(type => new Tile(type)));
        }
    } else {
        course.courseData = courses[holeNo-1].map(row => row.map(type => new Tile(type)));
    }
    holeNumber.innerHTML = holeNo;
    for (let x = 0; x < courseWidth; x++) {
        for (let y = 0; y < courseHeight; y++) {
            const tile = course.courseData[x][y];
            if (tile.type === GroundType.Tee) {
                ballX = x;
                ballY = y;
                teeX = x;
                teeY = y;
                course.strokePositions.push({ x: x, y: y });
            } else if (tile.type === GroundType.Hole) {
                holeX = x;
                holeY = y;
            }
        }
    }
    course.draw(bufferCtx);
}

function showUserStroke(showMoves = false) {
    if (!showMoves) {
        ctx.drawImage(bufferCanvas, 0, 0);
    } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        validMoves.forEach(move => {
            ctx.fillRect(move.x * course.gridSize, move.y * course.gridSize, course.gridSize, course.gridSize);
        });
    }
    if (waitingForUserStroke) {
        userStrokeTimer = setTimeout(() => {
            showUserStroke(!showMoves);
        }, 500);
    }
}

function updateScoreboard() {
    const scoreTableBody = scoreTable.getElementsByTagName('tbody')[0];
    scoreTableBody.innerHTML = '';

    let sum = 0;
    scores.forEach((score, index) => {
        const row = scoreTableBody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        cell1.innerHTML = index + 1;
        cell2.innerHTML = score;
        sum += score;
    });

    totalScore.innerHTML = sum;
}

function showOptions() {
    newGameButton.style.display = 'none';
    optionsButton.style.display = 'none';
    backToEditorButton.style.display = 'none';
    nextHoleButton.style.display = 'none';
    scoreTable.style.display = 'none';
    optionsMenu.style.display = 'table';
    saveOptionsButton.style.display = 'block';
}

function saveOptions() {
    options.save();
    optionsMenu.style.display = 'none';
    saveOptionsButton.style.display = 'none';
    newGameButton.style.display = 'block';
    optionsButton.style.display = 'block';
    if (testingFromEditor) {
        backToEditorButton.style.display = 'block';
    }
    if (inGame) {
        nextHoleButton.style.display = 'block';
        scoreTable.style.display = 'block';
    }
}

function showMenu() {
    menu.style.display = 'block';
}

function showScoreboard() {
    menu.style.display = 'block';
    scoreTable.style.display = 'block';
    updateScoreboard();
}

function closeMenu() {
    menu.style.display = 'none';
}

function nextStroke() {
    iconDriver.style.display = 'none';
    iconIron.style.display = 'none';
    iconWedge.style.display = 'none';
    iconPutter.style.display = 'none';
    if (options.sounds && options.diceSound)
    {
        soundDice.play();
    }
    var value = dice.throw();
    var terrainType = course.courseData[ballX][ballY].type;
    if (ballX === teeX && ballY === teeY) { // Teeing up
        penaltyOrBonus.innerHTML = '+2';
        iconDriver.style.display = 'block';
        club = ClubType.Driver;
    } else if (terrainType === GroundType.Rough) {
        penaltyOrBonus.innerHTML = '-1';
        iconIron.style.display = 'block';
        club = ClubType.Iron;
    } else if (terrainType === GroundType.Bunker) {
        penaltyOrBonus.innerHTML = '-2';
        iconWedge.style.display = 'block';
        club = ClubType.Wedge;
    } else if (terrainType === GroundType.Fairway) {
        penaltyOrBonus.innerHTML = '+1';
        iconIron.style.display = 'block';
        club = ClubType.Iron;
    } else if (terrainType === GroundType.Green) {
        penaltyOrBonus.innerHTML = '';
        iconPutter.style.display = 'block';
        club = ClubType.Putter;
    } else {
        penaltyOrBonus.innerHTML = '';
        iconIron.style.display = 'block';
        club = ClubType.Iron;
    }
    validMoves = course.getValidMoves(ballX, ballY, value);
    if (validMoves.length === 0) {
        if (options.sounds) {
            soundSwoosh.play();
        }
        setTimeout(() => { nextStroke(); }, 500);
    }
    waitingForUserStroke = true;
    showUserStroke(true);
}

function animateBall(startX, startY, endX, endY, duration) {
    const startTime = performance.now();
    const deltaX = endX - startX;
    const deltaY = endY - startY;

    function easeOutQuad(t) {
        return t * (2 - t);
    }

    function step(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easedProgress = easeOutQuad(progress);
        const currentX = startX + deltaX * easedProgress;
        const currentY = startY + deltaY * easedProgress;

        let ballSize = course.gridSize / 4;
        if (club !== ClubType.Putter) {
            if (progress < 0.33) {
                ballSize = course.gridSize / 4 + (course.gridSize / 4) * (progress / 0.33);
            } else if (progress < 0.66) {
                ballSize = course.gridSize / 4 + (course.gridSize / 4) * ((0.66 - progress) / 0.33);
            }
        }

        ctx.drawImage(bufferCanvas, 0, 0);
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(currentX * course.gridSize + course.gridSize / 2, currentY * course.gridSize + course.gridSize / 2, ballSize, 0, Math.PI * 2);
        ctx.fill();

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            ballX = endX;
            ballY = endY;
            course.strokePositions.push({ x: ballX, y: ballY });
            course.draw(bufferCtx);
            ctx.drawImage(bufferCanvas, 0, 0);
            if (ballX === holeX && ballY === holeY) {
                if (options.sounds) {
                    soundHole.play();
                }
                validMoves = [];
                scores.push(strokeNo);
                if (holeNo>=courses.length) {
                    nextHoleButton.style.display = 'none';
                    inGame = false;
                } else {
                    nextHoleButton.style.display = 'block';
                }
                showIntro();
                showMenu();
                showScoreboard();
                newGameButton.style.display = 'block';
                optionsButton.style.display = 'block';
                if (testingFromEditor) {
                    backToEditorButton.style.display = 'block';
                }
            } else {
                setTimeout(() => { nextStroke(); }, 600);
            }
            strokeNo++;
            stroke.innerHTML = strokeNo;
        }
    }

    requestAnimationFrame(step);
}

function handleCanvasClick(event) {
    if (!waitingForUserStroke) return;

    const rect = gameCanvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const gridX = Math.floor(mouseX / course.gridSize);
    const gridY = Math.floor(mouseY / course.gridSize);

    const clickedMove = validMoves.find(move => move.x === gridX && move.y === gridY);

    if (clickedMove) {
        if (options.sounds) {
            switch (club) {
                case ClubType.Driver:
                    soundDriver.play();
                    break;
                case ClubType.Wedge:
                    soundWedge.play();
                    break;
                case ClubType.Iron:
                    soundIron.play();
                    break;
                case ClubType.Putter:
                    soundPutter.play();
                    break;
            }
        }
        waitingForUserStroke = false;
        clearTimeout(userStrokeTimer);
        animateBall(ballX, ballY, gridX, gridY, 1000);
    }
    //todo: can we get in a situation with no valid moves, then we perhaps should roll back to previous ball position
}

function showIntro() {
    gameInfo.style.display = "none";
    gameCanvas.style.display = "none";
    gameDetails.style.display = "none";
    animatedBackgroundContainer.style.display = "block";
    animatedBackground.start();
}

function nextHole() {
    animatedBackgroundContainer.style.display = "none";
    newGameButton.style.display = "none";
    optionsButton.style.display = 'none';
    saveOptionsButton.style.display = 'none';

    gameDetails.style.display = "block";
    gameDetails.style.width = gameCanvas.width + "px";
    gameInfo.style.display = "block";
    gameInfo.style.width = gameCanvas.width + "px";
    closeMenu();
    holeNo++;
    strokeNo = 1;
    holeNumber.innerHTML = holeNo;
    animatedBackground.stop();
    gameCanvas.style.display = "block";
    course.strokePositions = [];
    clearCanvas();
    loadData();
    nextStroke();
}

function startNewGame() {
    inGame = true;    
    scores = [];
    holeNo = 0;
    strokeNo = 1;
    course = new Course(ctx, courseWidth, courseHeight);
    adjustCanvasSize();
    nextHole();
}

function setPlayerName(name) {
    options.playerName = name;
}

function toggleMusic() {
    options.music = musicToggle.checked;
    if (musicToggle.checked) {
        soundMusic.play();
    } else {
        soundMusic.pause();
    }
}

function toggleDiceSound() {
    options.diceSound = diceSoundToggle.checked;
}

function toggleSounds() {
    options.sounds = soundsToggle.checked;
}

function init() {
    ctx = gameCanvas.getContext('2d');
    bufferCtx = bufferCanvas.getContext('2d');

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.has('editor')) {
        testingFromEditor = true;
        backToEditorButton.style.display = 'block';
    }

    dice = new Dice(diceContainer);
    animatedBackground = new AnimatedBackground(animatedBackgroundContainer);

    // Set canvas dimensions to fill the screen
    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;
    bufferCanvas.width = gameCanvas.width;
    bufferCanvas.height = gameCanvas.height;

    showIntro();

    clearCanvas();
    
    player.innerHTML = options.playerName;
    playerNameInput.value = options.playerName;
    soundsToggle.checked = options.sounds;
    diceSoundToggle.checked = options.diceSound;
    if (options.music) {
        musicToggle.checked = true;
        var promise = soundMusic.play();
        if (promise !== undefined) {
            promise.then(_ => {
    
            }).catch(error => {
                //todo: show how to install PWA
            });
        }
    }

    // Preload audio elements
    soundDriver.load();
    soundIron.load();
    soundWedge.load();
    soundPutter.load();
    soundHole.load();
    soundSwoosh.load();
    soundDice.load();
}