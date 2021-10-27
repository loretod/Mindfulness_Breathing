import kaboom from "kaboom";

// initialize context
kaboom({
	scale: 0.7,
	background: [ 128, 180, 255 ],
});

const FLOOR_HEIGHT = 64;
const JUMP_FORCE = 250;
const PLAYER_SPEED = 500;

// define gravity
gravity(70);

// load assets
loadSprite("bean", "sprites/bean.png");
loadSprite("cloud", "sprites/cloud.png");
loadSprite("onion", "sprites/onion.png");
loadSound("bell", "sounds/bell.mp3");


const floor = add([
	// list of components
	rect(width(),FLOOR_HEIGHT),
	pos(0, height()- FLOOR_HEIGHT),
  color(144,238,144),
  area(),
  solid(),
  "floor",
]);

const ceiling = add([
	// list of components
	rect(width(),5),
	pos(0, 0),
  area(),
  solid(),
  color(128, 180, 255),
]);

const cloud = add([
	// list of components
	sprite("cloud"),
	pos(width() / 2, 100),
	area(),
	solid(),
	origin("bot"),
	z(100),
  "cloud",
  layer("obj"),
]);

const player = add([
	// list of components
	sprite("bean"),
	pos(width() / 2, height() - FLOOR_HEIGHT),
	area(),
	body(),
	origin("top"),
	z(100),
]);

let count = 0;
let breath = "start";
let breathCycles = 10;

	// display score
const countLabel = add([
	text(count),
	origin("center"),
	pos(width()-FLOOR_HEIGHT, 80),
]);

const breathLabel = add([
	text(breath),
	origin("center"),
	pos(width()/4, height()- FLOOR_HEIGHT),
]);

function jump() {
	if (player.grounded()) {
		player.jump(JUMP_FORCE);
	}
};

keyPressRep("space", () => {
  player.jump(JUMP_FORCE);
  breath = "inhale";
});

player.collides("cloud", () => {
    destroyAll("cloud");
    play("bell");
    count++;
    countLabel.text = count;
    breath = "exhale";
    //debug.log('count: ' + count);
    wait(3, () => {
			//debug.log("adding another cloud");
      add([
        sprite("cloud"),
        pos(width()/2, 100),
        "cloud",
        area(),
        solid(),
        origin("bot"),
	      z(100),
      ])
		});
});

player.action(() => {
  //debug.log(player.pos.y);
	if (player.pos.y <= 0){
    player.moveTo(vec2(center(),300),200);
  };
  breathLabel.text = breath;
  breathLabel.pos.y = player.pos.y;
  if (count == breathCycles){
    wait(2, () => {
      go("finished");
    });
  };
});

scene("finished", (count) => {
	// receives score and display it
	add([
		text("All Done! Your breath count: " + count),
    pos(width()/4),
	]);
});