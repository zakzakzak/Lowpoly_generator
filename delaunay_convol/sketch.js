// BEST : batas 5, random 0.2 cats3
// Source image
let img;
// Processed pixels
let dest;

// Size of processed pixels
// let w = 225;
let w = 300;
// Where to process the pixels
let xstart = 0;
let ystart = 0;
var arr_coor = [];
// The convolution kernel for a "sharpen" effect
// stored as a 3 x 3 two-dimensional array.
let kernel = [
  [-1, -1, -1],
  [-1, 9, -1],
  [-1, -1, -1]
];


let relu;
// let maxpooling;

// Load an image
function preload() {
  img = loadImage("assets/cat14.jpg");
}
// console.log("")
function setup() {
  createCanvas(w, w);
  pixelDensity(1);
  dest = createImage(w, w);
  // maxpooling = createCheckbox('maxpooling');
  // let button = createButton('randomize kernel');
  // button.mousePressed(randomizekernel);
  kernel = [
    [1, 0, -1],
    [0, 0, 0],
    [-1, 0, 1]
  ];
  // kernel = [
  //   [1, 0, -1],
  //   [2, 0, -2],
  //   [1, 0, -1]
  // ];

  // kernel = [
  //   [-1, -2, -1],
  //   [0, 0, 0],
  //   [1, 2, 1]
  // ];

  image(img, 0, 0, w, w);
  let xend = xstart + w;
  let yend = ystart + w;
  let kernelsize = 3;
  dest.loadPixels();
  img.loadPixels();

  var cou = 0;


  for (let x = 0; x < dest.width; x++) {
    for (let y = 0; y < dest.height; y++) {

      let result = convolution(img, x + xstart, y + ystart, kernel, kernelsize);
      // let index = (x + y * dest.width) * 4;
      let index = (x + y * dest.width) * 4;
      // let batas = 10;
      let batas = 10;
      if((result[0] + result[1] + result[2])/3 > batas){
        // if(random(1) < 0.8){
        if(random(1) < 0.5){

          dest.pixels[index + 0] = 255;
          dest.pixels[index + 1] = 255;
          dest.pixels[index + 2] = 255;
          cou++;
          console.log(cou);
          // // console.log("delau.add(new Vertex(createVector("+x+","+y+")));");
          // console.log("append(arr_ver, createVector("+x+","+y+"));");
          append(arr_coor, "append(arr_ver, createVector("+x+","+y+"));");

        }else{
          dest.pixels[index + 0] = 0;
          dest.pixels[index + 1] = 0;
          dest.pixels[index + 2] = 0;
        }
      }else{
        dest.pixels[index + 0] = 0;
        dest.pixels[index + 1] = 0;
        dest.pixels[index + 2] = 0;
      }

      // dest.pixels[index + 0] = result[0];
      // dest.pixels[index + 1] = result[1];
      // dest.pixels[index + 2] = result[2];
      // console.log(result[0], result[1], result[2]);
      dest.pixels[index + 3] = 255;
    }
  }
  dest.updatePixels();
  saveStrings(arr_coor, 'isi.txt');

  image(dest, xstart, ystart, w, w);


  stroke(0);
  noFill();
  rectMode(CORNERS);
  rect(xstart, ystart, xend, yend);
}

function draw() {


}

function convolution(img, x, y, kernel, kernelsize) {
  let rsum = 0.0;
  let gsum = 0.0;
  let bsum = 0.0;

  let offset = floor(kernelsize / 2);
  for (let i = 0; i < kernelsize; i++) {
    for (let j = 0; j < kernelsize; j++) {
      let xpos = x + i - offset;
      let ypos = y + j - offset;
      let index = (xpos + img.width * ypos) * 4;
      index = constrain(index, 0, img.pixels.length - 1);

      rsum += img.pixels[index + 0] * kernel[i][j];
      gsum += img.pixels[index + 1] * kernel[i][j];
      bsum += img.pixels[index + 2] * kernel[i][j];
    }
  }

  // console.log(rsum);
  return [rsum, gsum, bsum];
}
