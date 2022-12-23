
import { palettes } from './palettes.js';

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


let tile_type_lookup = [
    0,
    0,
    1,
    1,
    2,
    2,
    // 7:0,
    // 8:0,
    // 9:0,
]


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
        // console.log("Done with basic drawing");
    } else if (frameCount == 2) {
        // Draw coloured lines over the top!
        // background(0);
        // for (let i = 0; i < 500; i++ ) {
        //     let random_x = floor(random(width/tile_size.x));
        //     let random_y = floor(random(height/tile_size.y));
        //     let random_connection = floor(random(4));
        //     // // console.log("Colouring " + random_x + "," + random_y + " connection: " + random_connection);
        //     if (!tiles[random_y][random_x].coloured.includes(random_connection)) {
        //         tiles[random_y][random_x].draw(palette[i%palette.length],random_connection);
        //     }
        // }

        background_color = palette.splice(0, 1);
        background(background_color); // Take the first palette colour out as the background colour.
        //palette = palette.slice(1,palette.length);
        // blendMode(LIGHTEST);
        for (let x = 0; x < 100; x++ ) {
            let random_x = floor(random(width/tile_size.x));
            let random_y = floor(random(height/tile_size.y));
            let random_connection = floor(random(4));
            // console.log("CHOSEN! " + random_x + "," + random_y + " connection: " + random_connection);
            let tile = tiles[random_y][random_x];
            if (!tile.used_connections.includes(random_connection)) {
                let line_a = tile.getLine([], random_connection);
                // console.log(line_a);
                let line_b = tile.getLine([], tile.connections[random_connection]);
                // console.log(line_b);
                let line_b_reverse_loop = [line_b[0]].concat(line_b.slice(1,line_b.length).reverse());
                //TODO COMPARE line_a to line_b_reverse_loop (If they match then this is a loop)
                //TODO Otherwise you can combine the two lines (need to reverse one still, and remove the duplicate element);
                let line_final = line_b.slice(1,line_b.length).reverse().concat(line_a);
                // setStroke(palette[x%palette.length]);
                noFill();
                // OLD DRAWING METHOD
                // beginShape();
                //for (let i = 0; i < line_final.length-1; i++ ) {
                //    let tile_a = line_final[i];
                //    let tile_b = line_final[i+1];
                //    let points = tile_a.getPath(tile_b);
                //
                //    // if (i == 0) {
                //    //     vertex(points[0], points[1]);
                //    // }
                //    // bezierVertex(...points);
                //    tallBezier(...points, stroke_height, stroke_spacing);
                //}
                let points = [];
                console.log()
                for (let i = 0; i < line_final.length-1; i++ ) {
                    let tile_a = line_final[i];
                    let tile_b = line_final[i+1];
                    let path = tile_a.getPath(tile_b);
                    // points.push(tiles[i].position);
                    points = points.concat(path);
                }
                let line = new Line(points, palette[x%palette.length]);
                lines.push(line);
                // endShape();
            }
        }
    } else if (frameCount <= 10 ){
        for (let i = stroke_height/2; i >= -stroke_height/2; i = round(i-stroke_spacing,4)) {
            // console.log("Drawing lines with offset: " + i);
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

// function applyNoise(x, y, z, y_offset) {
//     let n = createVector(
//         (noise(x * noise_scale.x, y * noise_scale.y, z * noise_scale.z) - 0.5) * noise_magnitude.x,
//         (noise(x * noise_scale.x, y * noise_scale.y, z * noise_scale.z + 351.87) - 0.5) * noise_magnitude.y * noise_magnitude.z
//     );
//     return [x + n.x, y + n.y + y_offset];
// }

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

        // circle(this.points[0].x, this.points[0].y, 1);
        // stroke('#ffff00');
        // stroke(color);

        for (let i = 0; i < this.points.length-3; i += 4 ) {
            let noise_start = getNoise(this.points[i].x, this.points[i].y, offset);
            let noise_end = getNoise(this.points[i+3].x, this.points[i+3].y, offset);
            vertex(this.points[i].x + noise_start.x, this.points[i].y + noise_start.y + offset);
            bezierVertex(
                this.points[i+1].x + noise_start.x,   this.points[i+1].y + noise_start.y  + offset, // Control Point
                this.points[i+2].x + noise_end.x, this.points[i+2].y + noise_end.y + offset,  // Control Point
                this.points[i+3].x + noise_end.x, this.points[i+3].y + noise_end.y + offset
            );

            // Apply Noise VERSION
            // vertex(...applyNoise(this.points[i].x, this.points[i].y, offset, offset));
            // bezierVertex(
            //     ...applyNoise(this.points[i+1].x,   this.points[i+1].y, offset, offset), // Control Point
            //     ...applyNoise(this.points[i+2].x, this.points[i+2].y , offset, offset),  // Control Point
            //     ...applyNoise(this.points[i+3].x, this.points[i+3].y, offset, offset)
            // );

            // stroke('#ff00ff');
            // circle(this.points[i].x,   this.points[i].y, 1);
            // circle(this.points[i+3].x, this.points[i+3].y, 1);
            // stroke('#ffff00');
            // circle(this.points[i+1].x, this.points[i+1].y, 1);
            // circle(this.points[i+2].x, this.points[i+2].y, 1);
            // tallBezier(...this.points, stroke_height, stroke_spacing);
        }
        // stroke(this.line_color);
        endShape();
        // console.log(this.points);
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
        // TEMP DRAW TO VISUALISE
        // stroke(255);
        // this.draw(color, connection);
        //circle((this.x + 0.5) * this.w, (this.y + 0.5) * this.h, 5);

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
            } else {
                // console.log('list already includes ' + tile.x + ',' + tile.y);
                // console.log(list);
            }
            return list;
        //});
    }
    getPath(other_tile) {
        let change_x = other_tile.x - this.x; // 1 = right, -1 = left
        let change_y = other_tile.y - this.y; // 1 = down, -1 = up
        // change_x AND change_y ARE BEING SET CORRECTLY
        // console.log("change_x: " + change_x + " change_y: " + change_y);
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
        // direction IS BEING SET CORRECTLY
        // console.log("direction: " + direction);
        let other_tile_entry = (direction + 2) % 4;
        let other_tile_exit = other_tile.connections[other_tile_entry];
        // console.log("will go from this tile " + this.x + ", " + this.y + " in direction " + direction + " towards tile " + other_tile.x + ", " + other_tile.y + " coming into direction " + other_tile_entry);
        // console.log("this would exit at: " + other_tile_exit);
        let this_strand_middle = p5.Vector.lerp(this.getPoint(direction), this.getPoint(this.connections[direction]), 0.5);
        // console.log("from: " + this_strand_middle.x, this_strand_middle.y);
        // let this_strand_end = this.getPoint(direction);
        let this_strand_end = p5.Vector.lerp(this.getPoint(direction), this_strand_middle, 0.5);
        // console.log("out via: " + this_strand_end.x, this_strand_end.y);

        let other_strand_middle = p5.Vector.lerp(other_tile.getPoint(other_tile_entry), other_tile.getPoint(other_tile_exit), 0.5);
        // let other_strand_end = other_tile.getPoint(other_tile_entry);
        let other_strand_end = p5.Vector.lerp(other_tile.getPoint(other_tile_entry), other_strand_middle, 0.5);
        // console.log("in via: " + other_strand_end.x, other_strand_end.y);
        // console.log("to: " + other_strand_middle.x, other_strand_middle.y);
        
        //return [
        //    this_strand_middle.x,
        //    this_strand_middle.y,
        //    this_strand_end.x,
        //    this_strand_end.y,
        //    other_strand_end.x,
        //    other_strand_end.y,
        //    other_strand_middle.x,
        //    other_strand_middle.y,
        //];
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