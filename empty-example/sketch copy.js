let size;
let factor;

function setup() {
    createCanvas(1000, 1000);

}

let colours_b = {
    '#FF5A33': 0.150,
    '#FFEC5C': 0.050,
    '#02A676': 0.020,
    '#008C72': 0.005,
    '#007369': 0.002
    //'#B4CF66': 0.020,
    //'#44803F': 0.005,
    //'#146152': 0.002,
};

let colours_a = {
    '#02A676': 0.300,
    '#008C72': 0.100,
    '#007369': 0.020,
    '#005A5B': 0.005,
    '#003840': 0.002
};

let colours = colours_a;

let current_colour = 0;

function draw() {

    background(0);
    spacing_x = 15;
    spacing_y = 0.5;
    factor = 1000;
    noise_scale = 0.0005;
    strokeWeight(100);
    for (x = -factor; x <= width + factor; x += spacing_x) {
        if (random() < 0.1) {
            colours = colours_b;
        } else {
            colours = colours_a;
        }
        for (y = -factor; y <= height + factor; y += spacing_y) {
            stroke(Object.keys(colours)[current_colour]);
            let n = noise(x * noise_scale, y * noise_scale) - 0.5;
            point(
                x + n * factor,
                y + n * factor
            );
            if (random() < colours[Object.keys(colours)[current_colour]]) {
                current_colour += 1;
                current_colour %= Object.keys(colours).length;
            }
        }
    }
    noLoop();


    //size = 10;
    //factor = 0.01;
    // noStroke();
    //
    // for (i = 0; i <= width; i += size) {
    //     for (j = 0; j <= height; j += size ) {
    //         fill(
    //         noise((i + 350) * factor, (j + 350) * factor ) * 255,
    //         noise((i + 250) * factor, (j + 250) * factor ) * 255,
    //         noise((i + 150) * factor, (j + 150) * factor ) * 255
    //         );
    //         square(i, j, size);
    //     }
    // }
    // noLoop();
}