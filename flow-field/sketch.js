
import { palettes } from '../palettes.js';

window.setup = setup;
window.draw = draw;
window.keyPressed = keyPressed;

let lines = [];
let noise_scale;
let noise_magnitude;

function setup() {
    noise_scale = createVector(0.1,0.1,0.1);
    noise_magnitude = 10;
    createCanvas(500, 500);

    frameRate(60);
    strokeWeight(1.5);
    stroke(0);
    // for (let i = 0; i < 200; i++) {
    //     let l = new lineObject(random(width), random(height), random(width), random(height));
    //     lines.push(l);
    // }
}


function draw() {
    background(255);
    drawFlowGrid();
    // lines.forEach(line => line.draw());
    // noLoop();
}


function drawFlowGrid() {
    let size = 10;
    // let angle = frameCount * 2 * (Math.PI/180);// 
    // console.log(frameCount);
    for (let y = 0; y < height/size; y++) {
        for (let x = 0; x < width/size; x++) {
            let p = createVector((x + 0.5) * size,(y + 0.5) * size)
            let angle = noise(p.x * 0.005, p.y * 0.005, frameCount / 60) * Math.PI * 2;
            line(p.x, p.y, p.x + Math.sin(angle) * 20, p.y - Math.cos(angle) * 20);
        }
    }
}


class lineObject {
    constructor(x1, y1, x2, y2) {
        this.start = createVector(x1,y1);
        this.end = createVector(x2,y2);
        this.length = this.start.dist(this.end);
        // console.log("made a line of length: " + this.length);
        this.spacing = 1;
        
    }
    draw() {
        let count = this.length / this.spacing;
        // console.log(this.length, this.spacing);
        let noise_min_x = 0;
        let noise_min_y = 0;
        let noise_max_x = 0;
        let noise_max_y = 0;

        //for (let i = 0; i < count; i++) {
        //    let p = p5.Vector.lerp(this.start, this.end, i/count);
        //    let n = getNoise(p.x, p.y, 0);
        //    // console.log('n: ' + n.x, n.y);
        //    let alpha = 1-n.mag()/2;
        //    stroke(color(0,0,0,255*alpha));
        //    // console.log(alpha);
        //    p = p5.Vector.add(p, n);
        //    point(p);
        //    noise_min_x = n.x < noise_min_x ? n.x : noise_min_x;
        //    noise_min_y = n.y < noise_min_y ? n.y : noise_min_y;
        //    noise_max_x = n.x > noise_max_x ? n.x : noise_max_x;
        //    noise_max_y = n.y > noise_max_y ? n.y : noise_max_y;
        //    // console.log("Drawing point at: " + p.x + ", " + p.y);
        //}
        let current_point_on_line = p5.Vector.add(this.start, getNoise(this.start.x, this.start.y, 0));
        let current_distance_along_line = 0;
        while (current_distance_along_line < this.length) {
        // for (let i = 0; i < 10; i++ ) {
            current_distance_along_line += random(10);
            console.log("length: " + this.length + " current_distance_along_line: " + current_distance_along_line);
            let next_point_on_line = p5.Vector.lerp(this.start, this.end, min(current_distance_along_line/this.length, 1));
            next_point_on_line.add(getNoise(next_point_on_line.x, next_point_on_line.y, 0));
            line(current_point_on_line.x, current_point_on_line.y, next_point_on_line.x, next_point_on_line.y);
            current_point_on_line = next_point_on_line.copy();
        }
        // console.log("noise_min_x: " + noise_min_x + ", noise_min_y: " + noise_min_y + ", noise_max_x: " + noise_max_x + ", noise_max_y: " + noise_max_y);
    }
}


function getNoise(x, y, z) {
    let n = createVector(
        // (noise(x * noise_scale.x, y * noise_scale.y, frameCount * 0.01 + z * noise_scale.z) - 0.5) * noise_magnitude,
        // (noise(x * noise_scale.x, y * noise_scale.y, frameCount * 0.01 + z * noise_scale.z + 351.87) - 0.5) * noise_magnitude
        (noise(x * noise_scale.x, y * noise_scale.y, 0   ) - 0.5) * noise_magnitude,
        (noise(x * noise_scale.x, y * noise_scale.y, 0.87) - 0.5) * noise_magnitude
    );
    let n2 = createVector(
        (noise(x * noise_scale.x * 0.1, y * noise_scale.y * 0.1, frameCount * 0.001 + z * noise_scale.z * 0.1 + 100) - 0.2) * noise_magnitude,
        (noise(x * noise_scale.x * 0.1, y * noise_scale.y * 0.1, frameCount * 0.001 + z * noise_scale.z * 0.1 + 451.87) - 0.2) * noise_magnitude
    );
    // return createVector(random(10),random(10));
    return n.add(n2);
    // return n;
}


function keyPressed() {
    // this will download the first 5 seconds of the animation!
    if (key === 's') {
        saveGif('mySketch', 1);
    }
}