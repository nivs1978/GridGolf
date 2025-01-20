const courseWidth = 16;
const courseHeight = 32;

let ctx;
let selectedMode = GroundType.Rough;
var course = null;
let gridSize=20;
let isMouseDown = false;

function clearCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, editorCanvas.width, editorCanvas.height);
}

function numHex(s) {
    var a = s.toString(16);
    if ((a.length % 2) > 0) {
        a = "0" + a;
    }
    return a;
}

function highlightSquare(x, y) {
    var color = course.getGroundColor(selectedMode, 128);
    // Set transparency to 25% for the highlight
    ctx.fillStyle = color;
    ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
    if (course.courseData[x][y].type === GroundType.Forest) {
        course.drawTree(ctx, x * gridSize, y * gridSize);
    } else if (selectedMode === GroundType.Hole) {
        course.drawHole(ctx, x, y, true);
    } else if (selectedMode === GroundType.Tee) {
        course.drawBall(ctx, x, y);
    }
}

function setMode(mode) {
    selectedMode = mode;
}

function testCourse() {
    saveData();
    document.location='index.html?editor=true';    
}

function dispose() {
    course = new Course(ctx, courseWidth, courseHeight);
    saveData();
    adjustCanvasSize();
}

function saveData() {
    let saveData = JSON.stringify(course.courseData.map(row => row.map(tile => tile.type)));
    localStorage.setItem("course", saveData);
}

function loadData() {
    let data = localStorage.getItem("course");
    if (data) {
        course.courseData = JSON.parse(data).map(row => row.map(type => new Tile(type)));
    }
}

function exportData() {
    let data = JSON.stringify(course.courseData.map(row => row.map(tile => tile.type)));
    exportJson.value = data;
    exportJsonContainer.style.display = 'block';
}

function copyToClipboard() {
    exportJson.select();
    exportJson.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(exportJson.value);
}

function handleMouseDown(event) {
    isMouseDown = true;
    const rect = editorCanvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const gridX = Math.floor(mouseX / gridSize);
    const gridY = Math.floor(mouseY / gridSize);

    if (gridX >= 0 && gridX < courseWidth && gridY >= 0 && gridY < courseHeight) {
        course.courseData[gridX][gridY].type = selectedMode;
    }
    course.draw(ctx);
}

function handleMouseMove(event) {
    const rect = editorCanvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const gridX = Math.floor(mouseX / gridSize);
    const gridY = Math.floor(mouseY / gridSize);

    if (gridX >= 0 && gridX < courseWidth && gridY >= 0 && gridY < courseHeight) {
        if (isMouseDown) {
            course.courseData[gridX][gridY].type = selectedMode;
        }
        course.draw(ctx);
        highlightSquare(gridX, gridY, 128);
    }
}

function handleMouseUp() {
    isMouseDown = false;
}

function handleTouchStart(event) {
    isMouseDown = true;
    const rect = editorCanvas.getBoundingClientRect();
    const touchX = event.touches[0].clientX - rect.left;
    const touchY = event.touches[0].clientY - rect.top;
    const gridX = Math.floor(touchX / gridSize);
    const gridY = Math.floor(touchY / gridSize);

    if (gridX >= 0 && gridX < courseWidth && gridY >= 0 && gridY < courseHeight) {
        course.courseData[gridX][gridY].type = selectedMode;
    }
    course.draw(ctx);
}

function handleTouchMove(event) {
    const rect = editorCanvas.getBoundingClientRect();
    const touchX = event.touches[0].clientX - rect.left;
    const touchY = event.touches[0].clientY - rect.top;
    const gridX = Math.floor(touchX / gridSize);
    const gridY = Math.floor(touchY / gridSize);

    if (gridX >= 0 && gridX < courseWidth && gridY >= 0 && gridY < courseHeight) {
        if (isMouseDown) {
            course.courseData[gridX][gridY].type = selectedMode;
        }
        course.draw(ctx);
        highlightSquare(gridX, gridY, 128);
    }
}

function handleTouchEnd() {
    isMouseDown = false;
}

function handleTouchCancel() {
    isMouseDown = false;
}

function adjustCanvasSize() {
    clearCanvas();
    // Canvas should is a grid of 16 tiles wide and 32 tiles high. Calculate what grid size to use based on what fits inside screen width/height.
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;
    let courseWidth = Math.floor(screenWidth / 16);
    let courseHeight = Math.floor(screenHeight / 32);
    if (courseWidth * 2 > courseHeight) {
        gridSize = Math.floor(courseHeight*0.85);
    } else
    {
        gridSize = courseWidth;
    }
    course.gridSize = gridSize;
    editorCanvas.width = gridSize * 16;
    editorCanvas.height = gridSize * 32;
    course.draw(ctx);
}

window.addEventListener('load', () => {
    ctx = editorCanvas.getContext('2d');

    course = new Course(ctx, courseWidth, courseHeight);
    adjustCanvasSize();
    loadData();

    // Set canvas dimensions to fill the screen
    editorCanvas.width = window.innerWidth;
    editorCanvas.height = window.innerHeight;

    editorCanvas.addEventListener('mousedown', handleMouseDown);
    editorCanvas.addEventListener('mousemove', handleMouseMove);
    editorCanvas.addEventListener('mouseup', handleMouseUp);
    editorCanvas.addEventListener('mouseleave', handleMouseUp);

    editorCanvas.addEventListener('touchstart', handleTouchStart);
    editorCanvas.addEventListener('touchmove', handleTouchMove);
    editorCanvas.addEventListener('touchend', handleTouchEnd);
    editorCanvas.addEventListener('touchcancel', handleTouchCancel);

    window.addEventListener('resize', () => { setTimeout(adjustCanvasSize, 500); });

    course.draw(ctx);

    var promise = document.querySelector('audio').play();

    if (promise !== undefined) {
        promise.then(_ => {
            // Autoplay started!
        }).catch(error => {
            // Autoplay was prevented.
            // Show a "Play" button so that user can start playback.
        });
    }
});
