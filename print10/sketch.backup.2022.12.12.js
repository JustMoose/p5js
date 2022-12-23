// let x = 0;
// let y = 0;

let size = 10;

function setup() {
    createCanvas(800, 800);
    background(0);
    frameRate(30);
}

// let palette = [
//   '#D9042B',
//   '#270140',
//   '#F2B705',
//   '#F28705'
// ];


// let palette = [
//   '#A2A62D',
//   '#8A8C3E',
//   '#D9A78B',
//   '#F24C27',
//   '#BF6956',
// ]

let palette = [
    '#0367A6',
    '#0367A6',
    '#0367A6',
    
    '#4F7302',
    '#4F7302',

    '#F2B705',

    '#F27405',
    '#F27405',

    '#A6290D',
    '#A6290D',
    '#A6290D',
]

let noise_scale_x = 0.05;
let noise_scale_y = 0.05;

// function draw() {
// 
//     let colour_index = floor(noise(x * noise_scale_x, y * noise_scale_y) * palette.length)
//     noStroke();
//     fill(palette[colour_index]);
//     //   stroke(palette[colour_index])
//     // square(x, y, size);
//     stroke(255);
//     strokeWeight(1);
//     let r = random(3);
//     if (r < 1) {
//         // line(x, y, x + size, y + size); // TopRight to BottomRight
//         // line(x, y+size/2, x+size, y+size/2); // LeftMiddle to RightMiddle
//         
//         line(x, y+size/2, x+size, y+size/2);
//         line(x+size/2, y, x+size/2, y+size);
//     } else if (r < 2) {
//         // line(x, y + size, x + size, y); // BottomLeft to TopRight
//         // line(x+size/2, y, x+size/2, y+size); // TopMiddle to BottomMiddle
//         
//         line(x, y+size/2, x+size/2, y); // LeftMiddle to TopMiddle
//         line(x+size, y+size/2, x+size/2, y+size); // RightMiddle to BottomMiddle
//     } else {
//         line(x+size/2, y, x+size, y+size/2); // TopMiddle to RightMiddle
//         line(x+size/2, y+size, x, y+size/2); // BottomMiddle to LeftMiddle
//     }
//     x = x + size;
//     if (x > width) {
//         x = 0;
//         y += size;
//     }
//     if (y > height) {
//         noLoop();
//     }
// }


function draw() {
    //let alpha = frameCount % 20;
    // background(color(0,0,0,3 * alpha));
    background(0);
    //let y = 0;
    //if (frameCount % 20 == 0) {
        
        for (let y = 0; y < height; y += size) {
            for (let x = 0; x < width; x += size) {
                if (x >= y && x < width/2) {
                    let gradient = y/(height/2);
                    gradient += (x - width/2)/width;
                    let colour = lerpColor(color(palette[0]),color(palette[8]),gradient);
                    let r = random(3);
                    // let colour_index = floor(noise(x * noise_scale_x, y * noise_scale_y) * palette.length)
                    // let colour = palette[0];
                    drawLines(x, y, r, colour);
                    drawLines(y, x, r, colour);
                    drawLines(width - size - x, height - size - y, r, colour);
                    drawLines(width - size - y, height - size - x, r, colour);


                    // Reflect the tiles
                    if (r > 1) {
                        r = 4 - r;
                    }
                    drawLines(width - size - x, y, r, colour);
                    drawLines(height - size - y, x, r, colour);
                    drawLines(x, height - size - y, r,colour);
                    drawLines(y, width - size - x, r, colour);
                }
            }
        }
    //}
    noLoop();
}

function keyReleased() {
    draw();
}

function drawLines(x, y, r, colour) {
    stroke(colour);
    strokeWeight(1);
    if (r < 1) {
        line(x, y + size/2, x + size, y + size/2);
        line(x + size/2, y, x + size/2, y + size);

        // noStroke();
        // fill(colour);
        // triangle(x, y + size/2, x, y, x + size/2, y);
        // triangle(x + size, y + size/2, x + size, y + size, x + size/2, y + size);
        // triangle(x + size/2, y, x + size, y, x + size, y + size/2);
        // triangle(x + size/2, y + size, x, y + size, x, y + size/2);
    } else if (r < 2) {
        line(x, y + size/2, x + size/2, y); // LeftMiddle to TopMiddle
        line(x + size, y + size/2, x + size/2, y + size); // RightMiddle to BottomMiddle

        // noStroke();
        // fill(colour);
        // triangle(x, y + size/2, x, y, x + size/2, y);
        // triangle(x + size, y + size/2, x + size, y + size, x + size/2, y + size);
    } else {
        line(x + size/2, y, x + size, y + size/2); // TopMiddle to RightMiddle
        line(x + size/2, y + size, x, y + size/2); // BottomMiddle to LeftMiddle

        // noStroke();
        // fill(colour);
        // triangle(x + size/2, y, x + size, y, x + size, y + size/2);
        // triangle(x + size/2, y + size, x, y + size, x, y + size/2);
    }
}




// TODO:
// Make a tile object
// Which can specify what the colour of each of the 4 points where the lines meet are
// It could also specify the colour (or index of) the zones between lines.