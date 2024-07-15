const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img"),
ctx = canvas.getContext("2d");

// Global variables with default values
let prevMouseX, prevMouseY, snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000";

// Function to set the canvas background to white
const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // Set fill style back to the selected color
}

// Function to load the image
const loadImage = (imageSrc) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = function() {
        // Calculate aspect ratio
        const aspectRatio = image.width / image.height;
        let newWidth, newHeight;

        // Fit the image within the canvas while maintaining aspect ratio
        if (canvas.width / canvas.height > aspectRatio) {
            newHeight = canvas.height;
            newWidth = canvas.height * aspectRatio;
        } else {
            newWidth = canvas.width;
            newHeight = canvas.width / aspectRatio;
        }

        const xOffset = (canvas.width - newWidth) / 2;  // Center horizontally
        const yOffset = (canvas.height - newHeight) / 2;  // Center vertically

        // Draw the image at the calculated position and size
        ctx.drawImage(image, xOffset, yOffset, newWidth, newHeight);

        // Optionally, you can set image smoothing to false for sharp rendering
        ctx.imageSmoothingEnabled = false;
    };
}

// Set up the canvas and load the initial image when the window loads
window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

// Event listener for button clicks to load images
toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (btn.id === "shirt") {
            loadImage('assets/animeGirl.png');
        } else if (btn.id === "shirt2") {
            loadImage('assets/shirt2.png');
        }
    });
});

// Add event listeners for drawing
const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if(!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);
    if(selectedTool === "brush" || selectedTool === "eraser") {
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } 
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);
colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
});

saveImg.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);

// Outfit Buttons
const outfitBtns = document.querySelectorAll(".row .tool");
outfitBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if (btn.id === "shirt") {
            loadImage('assets/animeGirl.png');
        } else if (btn.id === "shirt2") {
            loadImage('assets/shirt2.png');
        }
    });
});