
import { palettes } from '../palettes.js';

let tile_size;
let tiles = [];
let lines = [];
let stroke_width;
let stroke_height;
let stroke_spacing;
let palette;
let noise_scale;
let type_noise_scale;
let noise_magnitude;

let background_color;

window.setup = setup;
window.draw = draw;
window.keyPressed = keyPressed;

function setup() {
    let dividers = [1,2,4,5]

    // dividers[floor(random(dividers.length))];
    // dividers[floor(random(dividers.length))];

    tile_size = createVector(100,50);
    noise_scale = createVector(0.001,0.001,0.05);
    type_noise_scale = createVector(0.5, 0.5);
    noise_magnitude = 200;
    stroke_width = 0.25;
    // stroke_height = 10;
    // stroke_spacing = 0.25;
    stroke_height = 6;
    stroke_spacing = 0.5;
    createCanvas(1000, 1000);
    background(0);
    frameRate(30);
    strokeWeight(stroke_width);
    for (let y = 0; y < height/tile_size.y + 2; y++) {
        let row = [];
        for (let x = 0; x < width/tile_size.x + 2; x++) {
            row.push(undefined);
        }
        tiles.push(row);
    }
    palette = palettes[floor(random(palettes.length))];
}


let tile_type_lookup = [0,0,1,1,2,2];


function draw() {
    if (frameCount == 1) {
        background(0);
        for (let y = 0; y < height/tile_size.y + 2; y++) {
           for (let x = 0; x < width/tile_size.x + 2; x++) {
               let tile_type_noise = noise(x * type_noise_scale.x, y * type_noise_scale.y);
               let tile_type = tile_type_lookup[floor(tile_type_noise * tile_type_lookup.length)];
               let tile = new Tile(tile_type, x, y, tile_size.x, tile_size.y);
               tiles[y][x] = tile;
               tile.draw(255);
           }
        }
    }
    else if (frameCount == 2) {
        background_color = palette.splice(0, 1);
        background(background_color); // Take the first palette colour out as the background colour.
        // blendMode(LIGHTEST);
        for (let x = 0; x < 100; x++ ) {
            let random_x = floor(random(width/tile_size.x));
            let random_y = floor(random(height/tile_size.y));
            let random_connection = floor(random(4));
            // console.log("CHOSEN! " + random_x + "," + random_y + " connection: " + random_connection);
            let tile = tiles[random_y][random_x];
            if (!tile.used_connections.includes(random_connection)) {
                let line_a = tile.getLine([], random_connection);
                let line_b = tile.getLine([], tile.connections[random_connection]);
                let line_b_reverse_loop = [line_b[0]].concat(line_b.slice(1,line_b.length).reverse());
                //TODO COMPARE line_a to line_b_reverse_loop (If they match then this is a loop)
                //TODO Otherwise you can combine the two lines (need to reverse one still, and remove the duplicate element);
                let line_final = line_b.slice(1,line_b.length).reverse().concat(line_a);
                noFill();
                let points = [];
                console.log()
                for (let i = 0; i < line_final.length-1; i++ ) {
                    let tile_a = line_final[i];
                    let tile_b = line_final[i+1];
                    let path = tile_a.getPath(tile_b);
                    points = points.concat(path);
                }
                let line = new Line(points, palette[x%palette.length]);
                lines.push(line);
            }
        }
    } else if (frameCount <= 10 ){
        for (let i = stroke_height/2; i >= -stroke_height/2; i = round(i-stroke_spacing,4)) {
            let tint = null;
            // if (i - stroke_spacing > -stroke_height/2) {
            //     tint = color(background_color);
            // }
            lines.forEach(line => {
                line.draw(i, tint);
            });
        }
        // noLoop();
    }

}

function getNoise(x, y, z) {
    let n = createVector(
        (noise(x * noise_scale.x, y * noise_scale.y, frameCount * 0.01 + z * noise_scale.z) - 0.5) * noise_magnitude,
        (noise(x * noise_scale.x, y * noise_scale.y, frameCount * 0.01 + z * noise_scale.z + 351.87) - 0.5) * noise_magnitude
    );
    let n2 = createVector(
        (noise(x * noise_scale.x * 0.1, y * noise_scale.y * 0.1, frameCount * 0.001 + z * noise_scale.z * 0.1 + 100) - 0.2) * noise_magnitude,
        (noise(x * noise_scale.x * 0.1, y * noise_scale.y * 0.1, frameCount * 0.001 + z * noise_scale.z * 0.1 + 451.87) - 0.2) * noise_magnitude
    );
    // return createVector(0,0,0);
    return n.add(n2);
}

function keyPressed() {
    // this will download the first 5 seconds of the animation!
    if (key === ' ') {
        saveGif('mySketch', 1);
    }
}

class Line {
    constructor(points, line_color) {
        this.points = points;
        this.line_color = color(line_color);
    }
    draw(offset, tint) {
        if (tint) {
            let temp_color = lerpColor(tint, this.line_color, 0.5);
            temp_color.setAlpha(100);
            stroke(temp_color);
        } else {
            let temp_color = this.line_color;
            temp_color.setAlpha(200);
            stroke(temp_color);
        }

        beginShape();
        for (let i = 0; i < this.points.length-3; i += 4 ) {
            let noise_start = getNoise(this.points[i].x, this.points[i].y, offset);
            let noise_end = getNoise(this.points[i+3].x, this.points[i+3].y, offset);
            vertex(this.points[i].x + noise_start.x, this.points[i].y + noise_start.y + offset);
            bezierVertex(
                this.points[i+1].x + noise_start.x,   this.points[i+1].y + noise_start.y  + offset, // Control Point
                this.points[i+2].x + noise_end.x, this.points[i+2].y + noise_end.y + offset,  // Control Point
                this.points[i+3].x + noise_end.x, this.points[i+3].y + noise_end.y + offset
            );
        }
        endShape();
    }
}

class Tile {
    constructor(type, x, y, w, h) {
        this.type = type; // Index of type? 0,1,2
        this.x = x;
        this.y = y;
        this.position = createVector(this.x * this.w, this.y * this.h);
        // TODO: replace x & y with position
        this.w = w;
        this.h = h;
        this.connections = undefined;
        this.used_connections = [];
        //connections will hold an array of all points joined
        // 0 = top, 1 = right, 2 = bottom, 3 = left
        // this.drawn_basic;
        this.coloured = [];
        switch(this.type) {
            case 0:
                this.connections = {
                    0:2,2:0,1:3,3:1,
                };
                break;
            case 1:
                this.connections = {
                    3:0,0:3,1:2,2:1,
                };
                break;
            case 2:
                this.connections = {
                    0:1,1:0,2:3,3:2,
                }
                break;
        }
    }

    draw(color, connection) {
        let rx = this.x * this.w;
        let ry = this.y * this.h;
        stroke(color);
        switch (this.type) {
            case 0:
                if (connection == undefined || [0,2].includes(connection)) {
                    this.drawLine(rx + this.w/2, ry, rx + this.w/2, ry + this.h);
                    this.drawLine(rx + this.w/2, ry + stroke_width, rx + this.w/2, ry + this.h + stroke_width);
                }
                if (connection == undefined || [1,3].includes(connection)) {
                    this.drawLine(rx, ry + this.h/2, rx + this.w, ry + this.h/2);
                    this.drawLine(rx, ry + this.h/2 + stroke_width, rx + this.w, ry + this.h/2 + stroke_width);
                }
                break;
            case 1:
                if (connection == undefined || [0,3].includes(connection)) {
                    this.drawLine(rx, ry + this.h/2, rx + this.w/2, ry); // LeftMiddle to TopMiddle
                    this.drawLine(rx, ry + this.h/2 + stroke_width, rx + this.w/2, ry + stroke_width); // LeftMiddle to TopMiddle
                }
                if (connection == undefined || [1,2].includes(connection)) {
                    this.drawLine(rx + this.w, ry + this.h/2, rx + this.w/2, ry + this.h); // RightMiddle to BottomMiddle
                    this.drawLine(rx + this.w, ry + this.h/2 + stroke_width, rx + this.w/2, ry + this.h + stroke_width); // RightMiddle to BottomMiddle
                }
                break;

            case 2:
                if (connection == undefined || [0,1].includes(connection)) {
                    this.drawLine(rx + this.w/2, ry, rx + this.w, ry + this.h/2); // TopMiddle to RightMiddle
                    this.drawLine(rx + this.w/2, ry + stroke_width, rx + this.w, ry + this.h/2 + stroke_width); // TopMiddle to RightMiddle
                }
                if (connection == undefined || [2,3].includes(connection)) {
                    this.drawLine(rx + this.w/2, ry + this.h, rx, ry + this.h/2); // BottomMiddle to LeftMiddle
                    this.drawLine(rx + this.w/2, ry + this.h + stroke_width, rx, ry + this.h/2 + stroke_width); // BottomMiddle to LeftMiddle
                }
                break;
            default:
                break;
            }
    }
    drawLine(x1, y1, x2, y2) {
        for (let i = -stroke_height/2; i < stroke_height/2; i+= stroke_spacing ) {
            line(x1, y1+i, x2, y2+i);
        }
    }
    // Return a list of coordinates
    getLine(list, connection, color) {
        if (!Array.isArray(list)) {
            throw "getLine list argument is not an array";
        }
        if (typeof(connection) != 'number') {
            throw "getLine connection argument is not a number";
        }
        list.push(this);
        let directions = [connection, this.connections[connection]]
        this.used_connections = this.used_connections.concat(directions);
        let point = this.connections[connection];
        //directions.forEach(point => {
            if (this.x == 0 && point == 3 ||
                this.y == 0 && point == 0 ||
                this.x == (width/tile_size.x)-1 && point == 1 ||
                this.y == (height/tile_size.y)-1 && point == 2) {
                return list;
            }
            let tile;
            switch (point) {
                case 0:
                    tile = tiles[this.y - 1][this.x];
                    break;
                case 1:
                    tile = tiles[this.y][this.x + 1]
                    break;
                case 2:
                    tile = tiles[this.y + 1][this.x];
                    break;
                case 3:
                    tile = tiles[this.y][this.x - 1]
                    break;
            }
            let tile_connection = (point + 2) % 4; //The point on the next tile where the line enters
            if (!(list.includes(tile) && tile.used_connections.includes(tile_connection) )) {
                return tile.getLine(list, tile_connection, color);
            }
            return list;
        //});
    }
    getPath(other_tile) {
        let change_x = other_tile.x - this.x; // 1 = right, -1 = left
        let change_y = other_tile.y - this.y; // 1 = down, -1 = up
        if (abs(change_x + change_y) != 1) {
            throw "Cannot draw path from " + this.x + ',' + this.y + ' to ' + other_tile.x + ',' + other_tile.y;
        }
        let direction;
        // There is a smarter way to do this but brain no work.
        if (change_y == -1) {
            direction = 0;
        } else if (change_x == 1) {
            direction = 1;
        } else if (change_y == 1) {
            direction = 2;
        } else if (change_x == -1) {
            direction = 3;
        }
        let other_tile_entry = (direction + 2) % 4;
        let other_tile_exit = other_tile.connections[other_tile_entry];
        let this_strand_middle = p5.Vector.lerp(this.getPoint(direction), this.getPoint(this.connections[direction]), 0.5);
        let this_strand_end = p5.Vector.lerp(this.getPoint(direction), this_strand_middle, 0.5);
        let other_strand_middle = p5.Vector.lerp(other_tile.getPoint(other_tile_entry), other_tile.getPoint(other_tile_exit), 0.5);
        let other_strand_end = p5.Vector.lerp(other_tile.getPoint(other_tile_entry), other_strand_middle, 0.5);

        return [
            this_strand_middle,
            this_strand_end,
            other_strand_end,
            other_strand_middle,
        ];
    }
    getPoint(direction) {
        // Currently written relative to the entire canvas 0,0 point.
        // Could rewrite it to be relative to the corner of this tile?
        // So that if i decide to have tiles of different sizes they could all fit?
        switch (direction) {
            case 0:
                // UP
                return createVector((this.x + 0.5) * this.w,  this.y        * this.h);
            case 1:
                // RIGHT
                return createVector((this.x + 1.0) * this.w, (this.y + 0.5) * this.h);
            case 2:
                // DOWN
                return createVector((this.x + 0.5) * this.w, (this.y + 1.0) * this.h);
            case 3:
                // LEFT
                return createVector( this.x        * this.w, (this.y + 0.5) * this.h);
            default:
                throw ("getPoint direction ain't write son: " + direction);
        }
    }
}