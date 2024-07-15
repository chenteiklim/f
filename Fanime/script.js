// Selecting the canvas and its context
const canvas = document.querySelector("canvas"),
    ctx = canvas.getContext("2d");

// Global variables
let defaultImage,
    isDefaultImageLoaded = false,
    isDrawing = false,
    lastX = 0,
    lastY = 0,
    eraserMode = false; // Flag to indicate eraser mode

// Function to set up the canvas
const setupCanvas = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
    loadImage('assets/girlBaseAvatar.png', 350, 500, 200, 100);  // Load the default image with adjusted coordinates
    setupEventListeners();
}

// Event listener for file input change
document.getElementById('uploadImage').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                // Assuming canvas and ctx are already declared globally
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Draw image onto canvas
            }
            img.src = event.target.result; // Set image source to data URL
        }
        reader.readAsDataURL(file); // Read the file as data URL
    }
});

// Function to set the canvas background to white
const setCanvasBackground = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Function to load an image onto the canvas with optional scale and position adjustments
const loadImage = (imageSrc, targetWidth = canvas.width, targetHeight = canvas.height, xOffset = 0, yOffset = 0) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = function() {
        // Calculate scale to fit image within targetWidth and targetHeight
        const aspectRatio = image.width / image.height;
        let drawWidth, drawHeight;

        if (aspectRatio > 1) {
            // Landscape orientation
            drawWidth = targetWidth;
            drawHeight = drawWidth / aspectRatio;
        } else {
            // Portrait or square orientation
            drawHeight = targetHeight;
            drawWidth = drawHeight * aspectRatio;
        }

        // Calculate position to center the image
        const centerX = xOffset + (targetWidth - drawWidth) / 2;
        const centerY = yOffset + (targetHeight - drawHeight) / 2;

        // Clear the canvas before drawing the image
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the image at the calculated position and size
        ctx.drawImage(image, centerX, centerY, drawWidth, drawHeight);

        // Optionally, you can set image smoothing to false for sharp rendering
        ctx.imageSmoothingEnabled = false;

        // Store the default image for future reference if it's the default girlBaseAvatar.png
        if (imageSrc === 'assets/girlBaseAvatar.png') {
            defaultImage = image;
            isDefaultImageLoaded = true;
        }
    };
}

// Function to handle mouse down event
const startDrawing = (e) => {
    if (eraserMode) {
        isDrawing = true; // Start erasing when in eraser mode
        
        erase(e.offsetX, e.offsetY); // Erase immediately at the starting point
    } else {
        isDrawing = true;
        document.getElementById('brush').classList.add('active'); // Add active class to brush
        document.getElementById('eraser').classList.remove('active'); // Remove active class from eraser
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }
}

// Function to handle mouse move event for drawing and erasing
const draw = (e) => {
    if (!isDrawing) return;
    
    if (eraserMode) {
        erase(e.offsetX, e.offsetY); // Continuous erasing in eraser mode
    } else {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.strokeStyle = getSelectedColor(); // Get currently selected color
        ctx.lineWidth = getLineWidth(); // Get currently selected line width
        ctx.lineCap = 'round'; // Set line cap style
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }
}

// Function to erase continuously in eraser mode
const erase = (x, y) => {
    ctx.clearRect(x - 10, y - 10, 20, 20); // Adjust the eraser size as needed
}
// Function to handle mouse up event
const stopDrawing = () => {
    isDrawing = false;
}

// Function to set up event listeners for drawing and eraser
const setupEventListeners = () => {
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Event listener for eraser button click
    document.getElementById('eraser').addEventListener('click', () => {
        eraserMode = true; // Toggle eraser mode
    });
    document.getElementById('brush').addEventListener('click', () => {
        eraserMode = false; // Toggle eraser mode
    });

    // Event listener for clear canvas button
    document.querySelector('.clear-canvas').addEventListener('click', () => {
        setCanvasBackground(); // Clear canvas by setting white background
        loadImage('assets/girlBaseAvatar.png', 350, 500, 200, 100); // Reload default image
    });

    // Event listener for button clicks to load images
    document.querySelectorAll(".tool").forEach(btn => {
        btn.addEventListener("click", () => {
            switch (btn.id) {
                case "shirt":
                    loadImage('assets/animeGirl.png', 350, 500, 200, 100);
                    break;
                case "shirt2":
                    loadImage('assets/shirt2.png', 350, 500, 200, 100);  // Example: Width 350px, Height 500px, xOffset 200, yOffset 100
                    break;
                case "shirt3":
                    loadImage('assets/shirt3.png', 350, 500, 200, 100);  // Example: Width 350px, Height 500px, xOffset 200, yOffset 100
                    break;
                case "default":
                    loadImage('assets/girlBaseAvatar.png', 350, 500, 200, 100);  // Example: Width 350px, Height 500px, xOffset 200, yOffset 100
                    break;
                default:
                    break;
            }
        });
    });
}

// Function to get currently selected color
const getSelectedColor = () => {
    const selectedColor = document.querySelector('.colors .selected').style.backgroundColor;
    return selectedColor;
}

// Function to get currently selected line width
const getLineWidth = () => {
    const lineWidth = document.getElementById('size-slider').value;
    return lineWidth;
}

// Initial setup when the window loads
window.addEventListener("load", setupCanvas);