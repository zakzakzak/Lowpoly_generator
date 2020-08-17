/*
 * delaunay triangulation
 *
 * @author aadebdeb
 * @date 2017/02/08
 */

var delaunayTriangulation;
var hue;


let img;
var jum_gen = 1000;

function preload() {
  img = loadImage('assets/cat2.jpg');
}
// function setup() {
//   image(img, 0, 0);
// }

function setup() {
  createCanvas(500, 500);
  // colorMode(HSB, 360, 100, 100);
  // hue = random(360);
  delaunayTriangulation = new DelaunayTriangulation();
  delaunayTriangulation.add(new Vertex(createVector(0 - 200, 0 - 200)));
  delaunayTriangulation.add(new Vertex(createVector(width + 200, 0 - 200)));
  delaunayTriangulation.add(new Vertex(createVector(width + 200, height + 200)));
  delaunayTriangulation.add(new Vertex(createVector(0 - 200, height + 200)));
  for (var i = 0; i < jum_gen; i++) {
    delaunayTriangulation.add(new Vertex(createVector(random(-200, width + 200), random(-200, height + 200))));
  }
  image(img, 0, 0, 500, 500);
  var arr_asli = [];
  for (var i = 0 ; i < width; i ++){
    append(arr_asli,[]);
    for(var j = 0; j < height; j++){
      append(arr_asli[i],get(i,j));
    }
  }
  console.log(arr_asli);
  drawTriangles();
}

function mousePressed() {
  var v = new Vertex(createVector(mouseX, mouseY));
  delaunayTriangulation.add(v);
  image(img, 0, 0, 500, 500);
  drawTriangles();
}

function drawTriangles() {
  // background(0, 0, 100);
  var triangles = delaunayTriangulation.getTriangles();
  // console.log(triangles);
  for (var ti = 0; ti < triangles.length; ti++) {
    var t = triangles[ti];
    var sat = 0;
    var bri = 0;
    for(var vi = 0; vi < 3; vi++) {
      var v = t.vertices[vi];
      // console.log(v.loc.x);
      // console.log(v.loc.y);
      // console.log(v.loc.z);
      red += v.red;
      green += v.green;
      blue += v.blue;
    }
    if((t.vertices[0].loc.y > 0 && t.vertices[0].loc.y < 500) && (t.vertices[0].loc.x > 0 && t.vertices[0].loc.x < 500) && (t.vertices[1].loc.y > 0 && t.vertices[1].loc.y < 500) && (t.vertices[1].loc.x > 0 && t.vertices[1].loc.x < 500) && (t.vertices[2].loc.y > 0 && t.vertices[2].loc.y < 500) && (t.vertices[2].loc.x > 0 && t.vertices[2].loc.x < 500)) {
        var col = get((t.vertices[0].loc.x + t.vertices[1].loc.x + t.vertices[2].loc.x)/3 , (t.vertices[0].loc.y + t.vertices[1].loc.y + t.vertices[2].loc.y)/3);
    }else{
        var col = [255,255,255,0];
    }

    red /= 3
    green /= 3;
    blue /= 3;
    // image(img, 0, 0, 500, 500);
    // console.log(t.vertices[0].loc.y, t.vertices[0].loc.x);
    // var col = [255,255,255,0];
    // fill(random(255),random(255),random(255));
    fill(col[0],col[1],col[2]);
    stroke(col);
    triangle(t.vertices[0].loc.x, t.vertices[0].loc.y, t.vertices[1].loc.x, t.vertices[1].loc.y, t.vertices[2].loc.x, t.vertices[2].loc.y);
    // t.render();
  }
}

function draw() {
  // delaunayTriangulation = new DelaunayTriangulation();
  // delaunayTriangulation.add(new Vertex(createVector(0 - 200, 0 - 200)));
  // delaunayTriangulation.add(new Vertex(createVector(width + 200, 0 - 200)));
  // delaunayTriangulation.add(new Vertex(createVector(width + 200, height + 200)));
  // delaunayTriangulation.add(new Vertex(createVector(0 - 200, height + 200)));
  // for (var i = 0; i < jum_gen; i++) {
  //   delaunayTriangulation.add(new Vertex(createVector(random(-200, width + 200), random(-200, height + 200))));
  // }
  // image(img, 0, 0, 500, 500);
  // drawTriangles();
  // console.log(get(200,200));


}

function DelaunayTriangulation() {
  this.triangles = [];
  this.vertices = [];
  this.superVertices = [];

  this.render = function() {
    for(var i = 0; i < this.triangles.length; i++) {
      this.triangles[i].render();
    }
  }

  this.add = function(v) {

    for (var i = 0; i < this.vertices.length; i++) {
      if(v.loc.x == this.vertices[i].loc.x && v.loc.y == this.vertices[i].loc.y) {
        return;
      }
    }

    this.vertices.push(v);
    var nextTriangles = [];
    var newTriangles = [];
    for (var ti = 0; ti < this.triangles.length; ti++) {
      var tri = this.triangles[ti];
      if(tri.circumCircle.isInCircle(v.loc)) {
        newTriangles = newTriangles.concat(tri.divide(v));
      } else {
        nextTriangles.push(tri);
      }
    }

    for (var ti = 0; ti < newTriangles.length; ti++) {
      var tri = newTriangles[ti];
      var isIllegal = false;
      for (var vi = 0; vi < this.vertices.length; vi++) {
        if (this.isIllegalTriangle(tri, this.vertices[vi])) {
          isIllegal = true;
          break;
        }
      }
      if (!isIllegal) {
        nextTriangles.push(tri);
      }
    }

    this.triangles = nextTriangles;
  }

  this.getTriangles = function() {
    var ts = [];

    for (var ti = 0; ti < this.triangles.length; ti++) {
      var t = this.triangles[ti];
      var hasSuperVertex = false;
      for (var vi = 0; vi < 3; vi++) {
        if (t.isContain(this.superVertices[vi])) {
          hasSuperVertex = true;
        }
      }
      if (!hasSuperVertex) {
        ts.push(t);
      }
    }

    return ts;
  }

  this.getTrianglesWithSuperTriangle = function() {
    return this.triangles;
  }

  this.isIllegalTriangle = function(t, v) {
    if(t.isContain(v)) {
      return false;
    }
    return t.circumCircle.isInCircle(v.loc);
  }

  var center = createVector(width / 2, height / 2);
  var radius = sqrt(sq(width) + sq(height)) / 2;
  var v1 = new Vertex(createVector(center.x - sqrt(3) * radius, center.y - radius));
  var v2 = new Vertex(createVector(center.x + sqrt(3) * radius, center.y - radius));
  var v3 = new Vertex(createVector(center.x, center.y +  2 * radius));
  var t = new Triangle([v1, v2, v3]);

  this.superVertices.push(v1);
  this.superVertices.push(v2);
  this.superVertices.push(v3);
  this.vertices.push(v1);
  this.vertices.push(v2);
  this.vertices.push(v3);
  this.triangles.push(t);

}

function Triangle(vertices) {
  this.vertices = vertices;

  var v1 = this.vertices[0].loc;
  var v2 = this.vertices[1].loc;
  var v3 = this.vertices[2].loc;
  var c = 2 * ((v2.x - v1.x) * (v3.y - v1.y) - (v2.y - v1.y) * (v3.x - v1.x));
  var x = ((v3.y - v1.y) * (sq(v2.x) - sq(v1.x) + sq(v2.y) - sq(v1.y)) + (v1.y - v2.y) * (sq(v3.x) - sq(v1.x) + sq(v3.y) - sq(v1.y))) / c;
  var y = ((v1.x - v3.x) * (sq(v2.x) - sq(v1.x) + sq(v2.y) - sq(v1.y)) + (v2.x - v1.x) * (sq(v3.x) - sq(v1.x) + sq(v3.y) - sq(v1.y))) / c;
  var center = createVector(x, y);
  var radius = v1.dist(center);
  this.circumCircle = new Circle(center, radius);

  this.render = function() {
    beginShape();
    for (var i = 0; i < 3; i++) {
      var v = this.vertices[i].loc;
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
  }

  this.divide = function(v) {
    var tris = [];
    for (var i = 0; i < 3; i++) {
      var j = i == 2? 0: i + 1;
      tris.push(new Triangle([this.vertices[i], this.vertices[j], v]));
    }
    return tris;
  }

  this.isContain = function(v) {
    for (var i = 0; i < 3; i++) {
      if (this.vertices[i] === v) {
        return true;
      }
    }
    return false;
  }

}

function Circle(center, radius) {
  this.center = center;
  this.radius = radius;

  this.isInCircle = function(v) {
    return this.center.dist(v) < this.radius;
  }
}

function Vertex(loc) {
  this.loc = loc;
  this.red = 0;
  this.green = 0;
  this.blue = 0;
}




// ----------------------GA-------------------
function Gen(){
  var banyak = 150;
  var isi = [];

  for(var i = 0; i < ){

  }
}

function target(dna){

  this.calcFitness = function() {
    var d = dist(this.pos.x, this.pos.y,
      target.x, target.y);

    this.fitness = map(d, 0, width, width, 0);
    if (this.completed) {
      this.fitness *= lifeSpan - count;
    }
    if (this.crashed) {
      this.fitness /= 30;
    }
  }

}
// -----------------------------



class Gen {
  int[] isi;
  int banyak = 150;


  Gen() {
    isi = new int[banyak*4];
    for (int i = 0; i < banyak; i++) {
      this.isi[i*4]   = floor(random(5, 50));
      this.isi[i*4+1] = floor(random(width));
      this.isi[i*4+2] = floor(random(width));
      this.isi[i*4+3] = floor(random(200));
    }
  }

  Gen(int[] arr2) {
    isi = new int[banyak*4];
    this.isi = arr2;
  }

  //crossover
  Gen crossOver(Gen a) {
    int mid = floor(random(this.isi.length));
    mid = mid - (mid%4);
    int mid2 = floor(random(mid, this.isi.length));
    int[] b = new int[banyak*4];


    for (int i = 0; i < b.length; i++) {
      if (i < mid) {
        b[i] = this.isi[i];
      } else {
        b[i] = a.isi[i];
      }
    }


    return new Gen(b);
  }
  //mutation
  void mutasi() {
    if (random(1) < 1) {
      for (int i = 0; i < this.isi.length; i++) {
        if (random(1) < 0.001) {
          if (i%4 == 0 || i == 0) {
            this.isi[i] = floor(random(5, 50));
          } else if (i%4 == 1) {
            this.isi[i]   = floor(random(width));
          } else if (i%4 == 2) {
            this.isi[i] = floor(random(width));
          } else if (i%4 == 3) {
            this.isi[i] = floor(random(200));
          }
        }
      }
    }
  }
}



















class Segitiga {
  Gen g;
  float fitness;
  int[] disArr;

  Segitiga() {
    this.g = new Gen();
    this.fitness = 0;
  }

  Segitiga(Gen child) {
    this.g = child;
    this.fitness = 0;
  }



  void calcFitness() {
    int jum =0;
    this.fitness = 0;
    disArr = new int[width+height*width];
    fill(255);
    rect(-1, -1, 201, 201);
    for (int i =0; i < g.banyak; i++) {
      fill(g.isi[i*4+3], 150);
      noStroke();
      ellipse(g.isi[i*4+1], g.isi[i*4+2], g.isi[i*4], g.isi[i*4]);
    }
    //----
    //fill(220);
    //rect(-1, -1, width, height);
    //fill(0);
    //rect(width/2 -20, height/2-20, 40, 40);
    //----
    loadPixels();
    for (int i = 0; i < width; i+=2) {
      for (int j = 0; j < height; j+=2) {
        int loc = i+j*width;
        disArr[loc] = floor((red(pixels[loc])+green(pixels[loc])+blue(pixels[loc]))/3);
      }
    }
    updatePixels();
    for (int i = 0; i < width; i+=2) {
      for (int j = 0; j < height; j+=2) {
        int loc = i+j*width;
        //if ((disArr[loc] > arr[loc]-10) && (disArr[loc] < arr[loc]+10)){
        //  this.fitness+=100;
        //  jum++;
        //  //println("ben" + disArr[loc]);
        //} else {
        //  if (this.fitness > 10) {
        //    this.fitness-=10;
        //  } else {
        //    this.fitness+=0;
        //  }
        //}
        this.fitness += 255 - abs(disArr[loc] - arr[loc]);
      }
    }
    //println("jumlah : " + jum);
  }

  void show() {
    //noStroke();
    //for(int i =0; i < g.banyak; i++){
    //  fill(g.isi[i*7]);
    //  triangle(g.isi[i*7+1], g.isi[i*7+2]
    //  , g.isi[i*7+3], g.isi[i*7+4]
    //  , g.isi[i*7+5], g.isi[i*7+6]);
    //}
    noStroke();
    //for (int i = 0; i < width; i+=5) {
    //  for (int j = 0; j < height; j+=5) {
    //    int loc = i+j*width;
    //    fill(red(disArr[loc]));
    //    ellipse(i, j, 5, 5);
    //  }
    //}

    for (int i =0; i < g.banyak; i++) {
      //float total = g.isi[i*4+3];
      //float r = total + random(-50, 50);
      //float gg = total + random(-50, 50);
      //float b = total + random(-50, 50);
      fill(g.isi[i*4+3],150);
      //fill(r, gg, b, 150);
      noStroke();
      ellipse(g.isi[i*4+1], g.isi[i*4+2], g.isi[i*4], g.isi[i*4]);
    }
  }
}













class Populasi {
  Segitiga[] seg;
  ArrayList<Segitiga> matingPool;
  int popSize;

  Populasi(int n) {
    this.matingPool = new ArrayList<Segitiga>();
    this.popSize = n;
    this.seg = new Segitiga[popSize];
    for (int i = 0; i < this.popSize; i++) {
      this.seg[i] = new Segitiga();
    }
  }

  //evaluasi
  void evaluasi() {
    float maxfit = 0;
    for (int i  = 0; i < this.popSize; i++) {

      this.seg[i].calcFitness();
      if (this.seg[i].fitness > maxfit) {
        maxfit =  this.seg[i].fitness;
      }
    }

    for (int i  = 0; i < this.popSize; i++) {
      this.seg[i].fitness /= maxfit;
    }

    this.matingPool = new ArrayList<Segitiga>();

    for (int i  = 0; i < this.popSize; i++) {
      float n = this.seg[i].fitness * 100;
      for (int j = 0; j < n; j++) {
        matingPool.add(this.seg[i]);
      }
    }
  }
  //seleksi

  void seleksi() {
    float maxf1 = 0;
    int tanda1 = 0;
    for (int i = 0; i < this.popSize; i++) {
      //print(popul.seg[i].fitness);
      popul.seg[i].calcFitness();
      if (popul.seg[i].fitness > maxf1) {
        maxf1 =  this.seg[i].fitness;
        tanda1 = i;
      }
    }

    Segitiga[] newSeg = new Segitiga[this.popSize];
    newSeg[0] = this.seg[tanda1];
    for (int i  = 1; i < this.popSize; i++) {
      Gen a = this.matingPool.get(floor(random(this.matingPool.size()))).g;
      Gen b = this.matingPool.get(floor(random(this.matingPool.size()))).g;
      Gen child = a.crossOver(b);
      child.mutasi();
      newSeg[i] = new Segitiga(child);
    }
    this.seg = newSeg;
  }
}




















Populasi popul;
int a1 = 80;
int a2 = 80;
int b1 = 40;

int[] arr;
ArrayList<Segitiga> a;
int generasi;
PImage img;


void setup() {
  size(200, 200);
  a = new ArrayList<Segitiga>();
  img = loadImage("celiza.jpg");
  generasi = 0;
  //a.size();
  arr = new int[width+height*width];

  image(img, 0, 0, 200, 200);
  //fill(220);
  //rect(-1, -1, width, height);
  //fill(0);
  //rect(width/2 -20, height/2-20, 40, 40);
  //---------------------------
  //background(255);
  //fill(0);
  //noStroke();
  //triangle(0,0,width,0,0,height);
  loadPixels();
  for (int i = 0; i < width; i++) {
    for (int j = 0; j < height; j++) {
      int loc = i+j*width;
      arr[loc] = floor((red(pixels[loc])+green(pixels[loc])+blue(pixels[loc]))/3);
    }
  }
  //frameRate(10);
  updatePixels();
  popul = new Populasi(5);
  print(arr[1]);
}

void draw() {
  for (int i = 0; i < 5; i++) {
    popul.evaluasi();
    popul.seleksi();
    generasi++;
  }
  float maxf = 0;
  int tanda = 0;

  background(220);
  for (int i = 0; i < popul.popSize; i++) {
    popul.seg[i].calcFitness();
    if (popul.seg[i].fitness > maxf) {
      maxf =  popul.seg[i].fitness;
      tanda = i;
    }
  }

  background(255);
  popul.seg[tanda].show();


  stroke(0);
  strokeWeight(5);
  fill(0);
  text("Generation : " + generasi, 5, 20);
  text("Fitness    : " + maxf, 5, 40);
  println("generasi : " + generasi + " --- Fitness : " + maxf);


}
