// let x = 0;
// let y = 0;

let size_x;
let size_y;
let tiles;
let strokeWidth;
let strokeHeight;
let strokeSpacing;

// let palette = [
//     '#0367A6',
//     '#4F7302',
//     '#F2B705',
//     '#F27405',
//     '#A6290D',
// ]

// let palette = [
//      '#F2B745',
//     '#4F7302',
//     '#F27405',
//     '#A6290D',
// ];


palettes = [
    // [
    //     '#74569b',
    //     '#96fbc7',
    //     '#f7ffae',
    //     '#ffb3cb',
    //     '#d8bfd8',
    // ],
    [
        '#372134',
        '#474476',
        '#4888b7',
        '#6dbcb9',
        '#8cefb6',
    ],
    // [
    //     '#ebf9ff',
    //     '#acd6f6',
    //     '#52a5de',
    //     '#18284a',
    //     '#070810',
    // ],
    // [
    //     '#dee3e2',
    //     '#fccbcb',
    //     '#78b3d6',
    //     '#d86969',
    //     '#4f7969',
    // ]
]

let palette;


function setup() {

    let dividers = [1,2,4,5]
    size_x = 20; //  / dividers[floor(random(dividers.length))];
    size_y = 10; // / dividers[floor(random(dividers.length))];
    tiles = [];
    strokeWidth = 0.5;
    strokeHeight = 20;
    strokeSpacing = 1;

    createCanvas(1000, 1000);
    background(0);
    frameRate(30);
    strokeWeight(strokeWidth);
    for (let y = 0; y < height/size_y; y++) {
        let row = [];
        for (let x = 0; x < width/size_x; x++) {
            row.push(undefined);
        }
        tiles.push(row);
    }
    palette = palettes[floor(random(palettes.length))];




}

// let noise_scale_x = 0.05;
// let noise_scale_y = 0.05;
let noise_scale_x = 0.1;
let noise_scale_y = 0.01;

function draw() {
    if (frameCount == 1) {


        background(0);
        for (let y = 0; y < height/size_y; y++) {
            for (let x = 0; x < width/size_x; x++) {
                //let gradient = y/(height/2);
                //gradient += (x - width/2)/width;
                //let colour = lerpColor(color(palette[0]),color(palette[8]),gradient);
                //let r = random(3);
                // let colour_index = floor(noise(x * noise_scale_x, y * noise_scale_y) * palette.length)
                // let colour = palette[0];
                //let point_color_top    = (y == 0) ? palette[0] : tiles[y-1][x].point_colors.bottom;
                // let point_color_right  = (y == 0) ? palette[0] : tiles[x][y-1].point_colours.bottom;
                // let point_color_bottom = (y == 0) ? palette[0] : tiles[x][y-1].point_colours.bottom;
                //let point_color_left   = (x >= y) ? palette[1] : tiles[y][x-1].point_colors.bottom;
                let weighted_target = floor(noise(x * noise_scale_x, y * noise_scale_y) * 3)
                let weighted_chance = random(3, 20);
                let tile_type = floor(random(weighted_chance));
                    tile_type = (tile_type > 2) ? weighted_target : tile_type;
                    let tile = new Tile(tile_type, x, y, size_x, size_y);
                tiles[y][x] = tile;
                tile.draw(255);
            }
        }
        console.log("Done with basic drawing");
    } else if (frameCount == 2) {
        background(0);
        for (let i = 0; i < 500; i++ ) {
            let random_x = floor(random(width/size_x));
            let random_y = floor(random(height/size_y));
            let random_connection = floor(random(4));
            // console.log("Colouring " + random_x + "," + random_y + " connection: " + random_connection);
            if (!tiles[random_y][random_x].coloured.includes(random_connection)) {
                tiles[random_y][random_x].draw(palette[i%palette.length],random_connection);
            }
        }
        noLoop();
    }
}

// function keyReleased() {
//     draw();
// }

class Tile {
    constructor(type, x, y, w, h) {
        this.type = type; // Index of type? 0,1,2
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.connections = undefined;
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
                    this.drawLine(rx + this.w/2, ry + strokeWidth, rx + this.w/2, ry + this.h + strokeWidth);
                }
                if (connection == undefined || [1,3].includes(connection)) {
                    this.drawLine(rx, ry + this.h/2, rx + this.w, ry + this.h/2);
                    this.drawLine(rx, ry + this.h/2 + strokeWidth, rx + this.w, ry + this.h/2 + strokeWidth);
                }
                break;
            case 1:
                if (connection == undefined || [0,3].includes(connection)) {
                    this.drawLine(rx, ry + this.h/2, rx + this.w/2, ry); // LeftMiddle to TopMiddle
                    this.drawLine(rx, ry + this.h/2 + strokeWidth, rx + this.w/2, ry + strokeWidth); // LeftMiddle to TopMiddle
                }
                if (connection == undefined || [1,2].includes(connection)) {
                    this.drawLine(rx + this.w, ry + this.h/2, rx + this.w/2, ry + this.h); // RightMiddle to BottomMiddle
                    this.drawLine(rx + this.w, ry + this.h/2 + strokeWidth, rx + this.w/2, ry + this.h + strokeWidth); // RightMiddle to BottomMiddle
                }
                break;

            case 2:
                if (connection == undefined || [0,1].includes(connection)) {
                    this.drawLine(rx + this.w/2, ry, rx + this.w, ry + this.h/2); // TopMiddle to RightMiddle
                    this.drawLine(rx + this.w/2, ry + strokeWidth, rx + this.w, ry + this.h/2 + strokeWidth); // TopMiddle to RightMiddle
                }
                if (connection == undefined || [2,3].includes(connection)) {
                    this.drawLine(rx + this.w/2, ry + this.h, rx, ry + this.h/2); // BottomMiddle to LeftMiddle
                    this.drawLine(rx + this.w/2, ry + this.h + strokeWidth, rx, ry + this.h/2 + strokeWidth); // BottomMiddle to LeftMiddle
                }
                break;
            default:
                break;
            }

        if (connection != undefined) {
            // TODO: Need to separate the coloured bits to the individual 'strands'
            let points = [connection, this.connections[connection]]
            this.coloured = this.coloured.concat(points);
            // console.log("POINTS: " + points);
            points.forEach(point => {
                // console.log(this.x + "," + this.y + " POINT " + point);
                // First check if we're on the border
                if (this.x == 0 && point == 3 ||
                    this.y == 0 && point == 0 ||
                    this.x == (width/size_x)-1 && point == 1 ||
                    this.y == (height/size_y)-1 && point == 2) {
                    return;
                }
                let tile;
                switch (point) {
                    case 0:
                        tile = tiles[this.y - 1][this.x];
                        if (!tile.coloured.includes(2)) {
                            // console.log("DRAWING FROM " + this.x + "," + this.y + " TO " + this.x + "," + (this.y-1));
                            tile.draw(color, 2);
                        }
                        break;
                    case 1:
                        tile = tiles[this.y][this.x + 1]
                        if (!tile.coloured.includes(3)) {
                            // console.log("DRAWING FROM " + this.x + "," + this.y + " TO " + (this.x+1) + "," + this.y);
                            tile.draw(color, 3);
                            
                        }
                        break;
                    case 2:
                        tile = tiles[this.y + 1][this.x];
                        if (!tile.coloured.includes(0)) {
                            // console.log("DRAWING FROM " + this.x + "," + this.y + " TO " + this.x + "," + (this.y+1));
                            tile.draw(color, 0);
                        }
                        break;
                    case 3:
                        tile = tiles[this.y][this.x - 1]
                        if (!tile.coloured.includes(1)) {
                            // console.log("DRAWING FROM " + this.x + "," + this.y + " TO " + (this.x-1)  + "," + this.y);
                            tile.draw(color, 1);
                        }
                        break;
                }
            });
            // Get the two points that we need to colour from
            // Check if they are on the edge
            // DRAW
            
        }
    }
    drawLine(x1, y1, x2, y2) {
        for (let i = -strokeHeight; i < strokeHeight; i+= strokeSpacing ) {
            line(x1, y1+i, x2, y2+i);
        }
    }
}

// TODO:
// Make a tile object
// Which can specify what the colour of each of the 4 points where the lines meet are
// It could also specify the colour (or index of) the zones between lines.



// TODO:
// Have it draw the entire 'map' first
// Then pick a random tile  with an uncoloured line and color it.
// Then follow that line in both directions and continue to colour it till you find a bit you've already coloured or you reach the end
// repeat




// TODO: If it drew each 'strand' all as one line/object thing then it could curve between points?