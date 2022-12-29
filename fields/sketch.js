
import { palettes } from '../palettes.js';

window.setup = setup;
window.draw = draw;
// window.keyPressed = keyPressed;
// window.mousePressed = mousePressed;

let boids = [];
function setup() {
    let canvas = createCanvas(800, 800);
    frameRate(100);
    init();
}

// function mousePressed() {
//   init();
// }

function init() {
  boids = [];
  noiseSeed(millis());
  background(255);
  for (let i = 0; i < 10; i++) {
    var px = floor(random(width));
    // var py = random(height);
    var py = floor(random(height/4, height/4 + 1));

    // var r = floor(random(3));
    // var heading = TWO_PI / 3 * r;
    var heading = Math.PI/2;
    // var heading = random(TWO_PI);
    var heading = Math.PI/2 + Math.PI/3 * floor(random(3));
    boids.push(new Boid(px, py, heading));
    // boids.push(new Boid(px, py, heading + PI));
  }
}

const fill_done = false;

function draw() {
    updatePixels();

    var bDidIt = false;
    for (let i = 0; i < boids.length; i++) {
        if (!bDidIt && boids[i].plive) {
            if (random(1.0) < 0.05) {
                var px = boids[i].px;
                var py = boids[i].py;
                var pheading = boids[i].pheading;
                if (!isNaN(px) && !isNaN(py)) {
                    var sig = (random(1) < 0.5) ? -1:1;
                    var potential_angles = [
                        -HALF_PI * 4/6,
                        // -HALF_PI * 2/6,
                        // HALF_PI * 2/6,
                        HALF_PI * 4/6,
                    ]
                    var angle_change = potential_angles[floor(random(potential_angles.length))];
                    // boids.push(new Boid(px, py, pheading + sig*HALF_PI));
                    boids.push(new Boid(px, py, pheading + angle_change));
                    // bDidIt = true;
                }
            }
        }
    }

    stroke(0);
    strokeWeight(1);
    strokeCap(SQUARE); // Lines look weirdly thick without this
    for (let i = 0; i < boids.length; i++) {
        boids[i].update();
    }
    // let boid_alive = (element) => element.plive;
    // if (!boids.some(boid_alive) && !fill_done) {
    //     for (let y = 0; y < height; y++) {
    //         for (let x = 0; x < width; x++) {
    //             fillPixel(x, y, 1, '#ff0077');
    //         }
    //     }
    //     fill_done = true;
    // }
}

class Boid {
    constructor(ipx, ipy, iheading) {
        this.px = ipx;
        this.py = ipy;
        this.pheading = iheading;
        this.headingNoise = 0;
        this.plive = true;
    }

    update() {
        if (this.px > 0 && this.px < width && this.py > 0 && this.py < height) {

        } else {
            this.plive = false;
        }

        if (this.plive) {
            var noiseInfluence = 1;
            var noiseScale = createVector(0.002, 0.02);
            var maxAngle = Math.PI/6;
            // this.pheading +=
            // noiseInfluence *
                // (noise(this.px * noiseScale, this.py * noiseScale) - 0.5);
            // this.headingNoise = 2 * (noise(this.px * noiseScale.x + this.py * noiseScale.y, this.py * noiseScale.y, 111.1111) - 0.5)
            this.headingNoise = 2 * (noise(this.px * noiseScale.x, this.py * noiseScale.y + this.px * noiseScale.x, 101.1111) - 0.5)
            this.headingNoise = max(abs(this.headingNoise) - 0.25, 0) * Math.sign(this.headingNoise) * 4;
            this.headingNoise = this.headingNoise * noiseInfluence * maxAngle;
            // console.log(this.headingNoise);
            var vx = cos(this.pheading + this.headingNoise);
            var vy = sin(this.pheading + this.headingNoise);
            //print(this.px + " " + this.py);
            this.px += vx;
            this.py += vy;

            if (!isNaN(this.px) && !isNaN(this.py)) {
                var fpx = this.px;
                var fpy = this.py;
                var pcol = get(fpx, fpy); // returns the color of the pixel at fpx,fpy
                if (pcol[0] < 200) {  // pcol[0] = the red channel of the returned colour
                    this.plive = false; // If the new location is already coloured then kill this boid
                }
                line(this.px, this.py, this.px - vx, this.py - vy);
            }
        }
    }
}

function fillPixel(x, y, s, c) {
    let pixel_color = get(x,y);
    let sum = pixel_color.reduce((a, b) => a + b, 0);
    let avg = (sum / pixel_color.length) || 0;
    // console.log(avg);
    if (avg > 200) {
        noStroke();
        fill(c);
        square(x,y,s);
    }
}

