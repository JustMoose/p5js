
import { palettes } from '../palettes.js';

window.setup = setup;
window.draw = draw;
// window.keyPressed = keyPressed;
// window.mousePressed = mousePressed;

let boids = [];
function setup() {
  createCanvas(1000, 1000);
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
    var px = random(width);
    var py = random(height);
    var r = floor(random(3));
    var heading = TWO_PI / 3 * r;
    // var heading = random(TWO_PI);

    boids.push(new Boid(px, py, heading));
    boids.push(new Boid(px, py, heading + PI));
  }
}

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
                        -HALF_PI * 2/6,
                        // -HALF_PI * 1/6,
                        // HALF_PI * 1/6,
                        HALF_PI * 2/6,
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
}

class Boid {
    constructor(ipx, ipy, iheading) {
        this.px = ipx;
        this.py = ipy;
        this.pheading = iheading;
        this.plive = true;
    }

    update() {
        if (this.px > 0 && this.px < width && this.py > 0 && this.py < height) {

        } else {
            this.plive = false;
        }

        if (this.plive) {
            var noiseInfluence = 0.0;//1;
            var noiseScale = 0.001;
            this.pheading +=
                noiseInfluence *
                (noise(this.px * noiseScale, this.py * noiseScale) - 0.5);

            var vx = cos(this.pheading);
            var vy = sin(this.pheading);
            //print(this.px + " " + this.py);
            this.px += vx;
            this.py += vy;

            if (!isNaN(this.px) && !isNaN(this.py)) {
                var fpx = this.px;
                var fpy = this.py;
                var pcol = get(fpx, fpy);
                if (pcol[0] < 200) {
                    this.plive = false;
                }
                line(this.px, this.py, this.px - vx, this.py - vy);
            }
        }
    }
}
