
import { palettes } from '../palettes.js';

window.setup = setup;
window.draw = draw;
window.keyPressed = keyPressed;

let lines = [];
let noise_scale;
let noise_magnitude;

function setup() {
    noise_scale = createVector(0.01,0.01);
    noise_magnitude = 10;

    createCanvas(800, 800);
    frameRate(60);
    strokeWeight(1);
    stroke(0);

    // for (let i = 0; i < 200; i++) {
    //     let l = new lineObject(random(width), random(height), random(width), random(height));
    //     lines.push(l);
    // }
}

function drawFlowGrid() {
    noStroke();

    let size = 2;
    for (let y = 0; y < height/size; y++) {
        for (let x = 0; x < width/size; x++) {
            let p = createVector(x * size, y * size);
            let noise_offset_factor = 50;
            let noise_offset = createVector(
                deepNoise(p.x * noise_scale.x, p.y * noise_scale.y, 0.0000, 2) * noise_offset_factor,
                deepNoise(p.x * noise_scale.x, p.y * noise_scale.y, 0.0000, 2) * noise_offset_factor
            );
            let n = pow(deepNoise((p.x + noise_offset.x) * noise_scale.x, (p.y + noise_offset.y) * noise_scale.y, 0, 2),2);
            fill(getHeatmapColor(n));
            square(p.x, p.y, size);
        }
    }
}

let heatmap_colors = [
    '#000000',
    '#0000ff',
    // '#ff0000',
    // '#ffff00',
    '#ffffff',
]

// let heatmap_colors = [
//     '#000000',
//     '#2176cc',
//     '#ff7d6e',
//     '#e8e7cb',
// ]

function deepNoise(x, y, z, depth) {
    let noise_values = []
    for (let i = 0; i < depth; i++) {
        let n = noise(x * pow(2,i), y * pow(2,i), z * pow(2,i));
        noise_values.push(n);
    }
    let avg = noise_values.reduce((a, b) => a + b, 0) / noise_values.length;

    return avg
}


function getHeatmapColor(n) {
    let index = n * (heatmap_colors.length - 1);
    let color_a = color(heatmap_colors[floor(index)]);
    let color_b = color(heatmap_colors[ceil(index)]);
    let lerp_amount = index - floor(index);
    return lerpColor(color_a, color_b, lerp_amount);

}


function draw() {
    background(255);
    drawFlowGrid();
    // lines.forEach(line => line.draw());
    noLoop();
}


function keyPressed() {
    // this will download the first 5 seconds of the animation!
    if (key === 's') {
        saveGif('mySketch', 1);
    }
}