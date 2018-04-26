var keys = [false, false, false, false];
var jimson;
var jimScale = .30
var anim;
var hero;
var zombies = []
var zombieImgs = [];
var zomboz;
var speed = 1.5
var aimValue = 2
var headHit = false
var bodyHit = false

function preload() {
  for (var i = 0; i < 17; i++) {
    zombieImgs.push(loadImage("export/skeleton-move_" + i + ".png"));
  }
  anim = loadAnimation("survivor-idle_handgun_0.png", "survivor-idle_handgun_1.png", "survivor-idle_handgun_2.png", "survivor-idle_handgun_3.png", "survivor-idle_handgun_4.png", "survivor-idle_handgun_5.png", "survivor-idle_handgun_6.png", "survivor-idle_handgun_7.png", "survivor-idle_handgun_8.png", "survivor-idle_handgun_9.png", "survivor-idle_handgun_10.png", "survivor-idle_handgun_11.png", "survivor-idle_handgun_12.png", "survivor-idle_handgun_13.png", "survivor-idle_handgun_14.png", "survivor-idle_handgun_15.png", "survivor-idle_handgun_16.png", "survivor-idle_handgun_17.png", "survivor-idle_handgun_18.png", "survivor-idle_handgun_19.png")
}

function setup() {
  createCanvas(750, 700);
  imageMode(CENTER);
  jimson = createSprite(0, 0, .5, .1);
  jimson.addAnimation("idle", anim);
  jimson.scale = 0.3;
  hero = {
    x : 375,
    y : 350,
    bullet : {
      x : 0,
      y : 0,
      speed : 50,
      isMoving : false,
      angle : 0
    },
    display : function() {
      imageMode(CENTER);
      var a = atan2(mouseY - this.y, mouseX - this.x);
      jimson.position.x = this.x /// jimScale;
      jimson.position.y = this.y // jimScale;
      jimson.rotation = degrees(a);
      //jimson.size = scale(jimScale);
      push();
      translate(jimson.position.x, jimson.position.y)
      var a = atan2(mouseY - this.y, mouseX - this.x);
      rotate(a);
      translate(35, 16);
      noFill()
      //scale(3)
      triangle(0, 0, 400, 0 - aimValue, 400, 0 + aimValue);
      pop();
      if(hero.bullet.isMoving == true) {
        push();
        translate(this.bullet.x, this.bullet.y);
        rotate(this.bullet.angle);
        translate(35,16);
        ellipse(0, 0, 5);
        hero.bullet.x += hero.bullet.speed * cos(this.bullet.angle);
        hero.bullet.y += hero.bullet.speed * sin(this.bullet.angle);
        pop();
      }

    },
    move : function() {
      // Up
      if (keys[0] == true) {
        this.y-= speed
        aimValue = 40
      }
      //Down
      if (keys[1] == true) {
        this.y+= speed
        aimValue = 40
      }
      //Left
      if (keys[3] == true) {
        this.x+= speed
        aimValue = 40
      }
      //Right
      if (keys[2] == true) {
        this.x-= speed
        aimValue = 40
      }
      else if(keys[0] == false && keys[1] == false && keys[2] == false && keys[3]== false) {
        aimValue = 10
      }
    },
    sprint : function() {
      if (keyIsDown(32)) {
        speed = 3
        aimValue = 100
      }
      else if((keys[0] == true || keys[1] == true || keys[2] == true || keys[3]== true) && keyIsDown(32) == false) {
        aimValue = 40
        speed = 1
      }
      else {
        aimValue = 10
      }
    },
    shoot : function() {
      push()
      if(mouseIsPressed) {
        if(mouseButton === LEFT) {
          var a = atan2(mouseY - this.y, mouseX - this.x);
          hero.bullet.isMoving = true
          hero.bullet.x = jimson.position.x + cos(a);
          hero.bullet.y = jimson.position.y + sin(a);
          hero.bullet.angle = atan2(mouseY - this.y, mouseX - this.x);
          // imageMode(CORNER)
          // translate(jimson.position.x, jimson.position.y);
          // var a = atan2(mouseY - this.y, mouseX - this.x);
          // rotate(a)
          // ellipse(bulletSP, 15, 10)
        }
      }
      pop()
    }
  }
  for(var i = 0; i < 10; i++) {
    zombies[i] = new zombie(i);
  }
}
  // flock = new Flock();
  // // Add an initial set of boids into the system
  // for (var i = 0; i < zombies.length; i++) {
    // var b = new Boid(width/2,height/2);
    // flock.addBoid(b);
  // }


function draw() {
  background(150);
  imageMode(CENTER);
  for(var i = 0; i < 10; i++) {
    zombies[i].display();
    zombies[i].move();
    ellipse(zombies[i].x, zombies[i].y, 30)
  }
  hero.display();
  hero.move();
  hero.sprint();
  hero.shoot();
  drawSprites();
  for(var i = 0; i < zombies.length; i++) {
    if(collideCircleCircle(hero.bullet.x, hero.bullet.y, 5, zombies[i].x, zombies[i].y, 30)) {
      console.log("headHit")
      zombies[i].headHit = true
    }
    if(collideCircleCircle(hero.bullet.x, hero.bullet.y, 5, zombies[i].x, zombies[i].y, 60)) {
      console.log("bodyHit")
      zombies[i].bodyHit = true
    }
  }
}

function zombie(id) {
  this.id = id
  this.x = random(0, width)
  this.y = random(0, height)
  this.currentImage = floor(random(0, 17))
  this.lastChecked = 0;
  this.headHit = false
  this.bodyHit = false
  this.display = function() {
    imageMode(CENTER)
    if(this.headHit == false){
      push()
      translate(this.x, this.y)
      if (millis() - this.lastChecked > 40) {
        this.lastChecked = millis();
        this.currentImage++;
        if(this.currentImage > 16) {
          this.currentImage = 0
        }
      }
      var a = atan2(jimson.position.y - this.y, jimson.position.x - this.x);
      rotate(a)
      // push()
      // translate(zombie.x, zombie.y)
      // pop()
      image(zombieImgs[this.currentImage], 0, 0, 90, 90)
      pop()
    }
  }
  this.move = function() {
    push()
    var a = atan2(jimson.position.y - this.y, jimson.position.x - this.x);
    rotate(a)
    if(this.bodyHit == false) {
      this.zomSpeed = 10
    }
    if(this.bodyHit == true) {
      for(var i = 0; i < 10; i+=1) {
        this.zomSpeed = 1 * i
      }
    }
    this.x+= cos(a) * this.zomSpeed / 10
    this.y+= sin(a) * this.zomSpeed / 10
    pop()
  }
}

function keyPressed() {
  // Up
  if (keyCode == '87') {
    keys[0] = true;
    console.log("w was pressed")
  }
  //Down
  if (keyCode == '83') {
    keys[1] = true;
    console.log("s was pressed")
  }
  //Left
  if (keyCode == '65') {
    keys[2] = true;
    console.log("a was pressed")
  }
  //Right
  if (keyCode == '68') {
    keys[3] = true;
    console.log("d was pressed")
  }
}

function keyReleased() {
  //Up
  if (keyCode == '87') {
    keys[0] = false;
    console.log("w was released")
  }
  //Down
  if (keyCode == '83') {
    keys[1] = false;
    console.log("s was released")
  }
  //Left
  if (keyCode == '65') {
    keys[2] = false;
    console.log("a was released")
  }
  //Right
  if (keyCode == '68') {
    keys[3] = false;
    console.log("d was released");
  }
}
