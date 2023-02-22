"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

// user stuff
import Brain from "./objects/brain.js";
import Hero from "./objects/hero.js";
import Minion from "./objects/minion.js";
import DyePack from "./objects/dye_pack.js";
import TextureObject from "./objects/texture_object.js";
import Patrol from "./objects/patrol.js";
import PatrolSet from "./objects/patrol_set.js";

class MyGame extends engine.Scene {
    constructor() {
        super();
        this.kMinionSprite = "assets/minion_sprite.png";
        this.kMinionPortal = "assets/minion_portal.png";

        // The camera to view the scene
        this.mCamera = null;

        this.mMsg = null;

        // the hero and the support objects
        this.mHero = null;
        this.mBrain = null;
        this.mPortalHit = null;
        this.mHeroHit = null;

        //Initalize patrol set
        this.mPatrolSet = null;
        this.mPatrolSpawn = null;
        this.mPatrolTimer = null;
        this.mPatrolSpawnTimer = null;

        this.mPortal = null;
        this.mLMinion = null;
        this.mRMinion = null;

        this.mCollide = null;
        this.mChoice = 'H';

        this.mouseXPos = 0;
        this.mouseYPos = 0;

        this.mPatrolTotal = 0;
        this.mDyePackTotal = 0;
    }

    load() {
        engine.texture.load(this.kMinionSprite);
        engine.texture.load(this.kMinionPortal);
    }

    unload() {
        engine.texture.unload(this.kMinionSprite);
        engine.texture.unload(this.kMinionPortal);
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(50, 37.5), // position of the camera
            100,                       // width of camera
            [0, 0, 800, 600]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

        this.mMiniCamera1 = new engine.Camera(
            vec2.fromValues(50, 37.5), // position of the camera
            15,                       // width of camera
            [50, 50, 100, 100]           // viewport (orgX, orgY, width, height)
        );
        this.mMiniCamera1.setBackgroundColor([0, 0, 1, 1]);
        // sets the background to gray

        this.mBrain = new Brain(this.kMinionSprite);

        // Step D: Create the hero object with texture from the lower-left corner 
        this.mHero = new Hero(this.kMinionSprite);

        this.mPortalHit = new DyePack(this.kMinionSprite);
        this.mPortalHit.setVisibility(false);
        this.mHeroHit = new DyePack(this.kMinionSprite);
        this.mHeroHit.setVisibility(false);

        //Initalize patrol set
        this.mPatrolSet = new PatrolSet();
        
        //Initalize patrol spawn as false
        this.mPatrolSpawn = false;

        //Starts the timer. 60 variable = 60 frames = 1 second. Should be used throughout all our classes.
        this.mPatrolTimer = 1;
        this.mPatrolSpawnTimer = 121;

        this.mPortal = new TextureObject(this.kMinionPortal, 50, 30, 10, 10);

        this.mLMinion = new Minion(this.kMinionSprite, 30, 30);
        this.mRMinion = new Minion(this.kMinionSprite, 70, 30);

        this.mMsg = new engine.FontRenderable("Status Message");
        this.mMsg.setColor([0, 0, 0, 1]);
        this.mMsg.getXform().setPosition(1, 2);
        this.mMsg.setTextHeight(2);

        this.mCollide = this.mHero;
    }

    // This is the draw function, make sure to setup proper drawing environment, and more
    // importantly, make sure to _NOT_ change any state.
    draw() {
        // Step A: clear the canvas
        engine.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

        // Step  B: Activate the drawing Camera
        this.mCamera.setViewAndCameraMatrix();

        // Step  C: Draw everything
        this.mHero.draw(this.mCamera);
        this.mBrain.draw(this.mCamera);      
        this.mPortal.draw(this.mCamera);
        this.mLMinion.draw(this.mCamera);
        this.mRMinion.draw(this.mCamera);
        this.mPortalHit.draw(this.mCamera);
        this.mHeroHit.draw(this.mCamera);
        this.mMsg.draw(this.mCamera);

        //Draws all patrols in patrol set
        let i;
        for(i = 0; i < this.mPatrolSet.size(); i++) {
            this.mPatrolSet.getObjectAt(i).draw(this.mCamera);
        }

        this.drawPyePacks();

        this.mMiniCamera1.setViewAndCameraMatrix();

    }

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        //Trevor's Code

        if(this.mPatrolSpawn) {
            this.mPatrolTimer++;
        }

        //Sets patrol spawn
        if (engine.input.isKeyClicked(engine.input.keys.P)) {
            this.mPatrolSpawn = !this.mPatrolSpawn;
            this.mPatrolTimer = 1;
        }

        if(((this.mPatrolTimer % this.mPatrolSpawnTimer) == 0) && this.mPatrolSpawn) {
            let tempPatrol = new Patrol(this.kMinionSprite, this.kMinionPortal, 
            ((Math.floor(Math.random() * 45) + 50)), 
            (Math.floor(Math.random() * 50)));
            this.mPatrolSet.addToSet(tempPatrol);
            this.mPatrolSpawnTimer = Math.floor(Math.random() * 180) + 120;
            this.mPatrolTimer = 1;
            this.mPatrolTotal++;
        }

        this.mPatrolSet.update();
/*        let i;
        let j = [];
        for(i = 0; i < this.mPatrolSet.size(); i++) {
            if(this.mPatrolSet.mWing.pixelTouches(this.mCollide, j)) {
                document.write("GOT DAMN");
            }
        }*/

 /*       let i, j;
        let k = [];
        for(i = 0; i < this.mPatrolSet.size(); i++) {
            for(j = 0; j < this.mHero.dyePacks.length(); j++) {
                if(this.mHero.dyePacks[j].pixelTouches(this.mPortal, k)) {
                    document.write("GOT DAMN!!!");
                }
            }
        }*/

        //End of Trevor's Code
        let msg = "Patrol Spawned Total: " + this.mPatrolTotal + " Dyepack Spawned Total: " + this.mDyePackTotal + " AutoSpawn: " + this.mPatrolSpawn;

        this.mLMinion.update();
        this.mRMinion.update();

        this.mHero.update();
        this.mPortal.update(engine.input.keys.Up, engine.input.keys.Down,
            engine.input.keys.Left, engine.input.keys.Right, engine.input.keys.P);

        let h = [];

        // Portal intersects with which ever is selected
        if (this.mPortal.pixelTouches(this.mCollide, h)) {
            this.mPortalHit.setVisibility(true);
            this.mPortalHit.getXform().setXPos(h[0]);
            this.mPortalHit.getXform().setYPos(h[1]);
        } else {
            this.mPortalHit.setVisibility(false);
        }

        //DyePack touches Patrol Object MOVE TO hero.js
        /*
        for (let i = 0; i < this.mHero.dyePacks.length; i++){
            if (this.dyePacks[i].pixelTouches(this.mPortal, h)){
                delete(dyePacks[i]);
                for (let j = i; j < this.mHero.dyePacks.length - 1; j++){
                    dyePacks[j] = dyePacks[j + 1];
                }
                delete(dyePacks[this.mHero.dyePacks.length-2]);
            }
        }
        */

        // hero always collide with Brain (Brain chases hero)
        if (!this.mHero.pixelTouches(this.mBrain, h)) {
            this.mBrain.rotateObjPointTo(this.mHero.getXform().getPosition(), 0.05);
            engine.GameObject.prototype.update.call(this.mBrain);
            this.mHeroHit.setVisibility(false);
        } else {
            this.mHeroHit.setVisibility(true);
            this.mHeroHit.getXform().setPosition(h[0], h[1]);
            this.mHero.oscsalateHero();
        }

        // decide which to collide
        if (engine.input.isKeyClicked(engine.input.keys.L)) {
            this.mCollide = this.mLMinion;
            this.mChoice = 'L';
        }
        if (engine.input.isKeyClicked(engine.input.keys.R)) {
            this.mCollide = this.mRMinion;
            this.mChoice = 'R';
        }
        if (engine.input.isKeyClicked(engine.input.keys.B)) {
            this.mCollide = this.mBrain;
            this.mChoice = 'B';
        }
        if (engine.input.isKeyClicked(engine.input.keys.H)) {
            this.mCollide = this.mHero;
            this.mChoice = 'H';
        }

        this.mMsg.setText(msg + this.mChoice);


        this.getCursorPosition();

        this.mHero.moveHeroToMousePos( this.mouseXPos, this.mouseYPos);

        if (engine.input.isKeyClicked(engine.input.keys.Space)) { 
            this.mHero.createAByePack(this.kMinionSprite);
            this.mDyePackTotal++;
        }

        if (engine.input.isKeyClicked(engine.input.keys.Q)) { 
            //console.log("qqqqqqqqq");
            this.mHero.oscsalateHero();
        }

        for(let i = 0; i < this.mHero.dyePacks.length;i++) {
            if (this.mHero.dyePacks[i]);
        }
        
        //console.log("x: " + this.mHero.getXform().getPosition()); // + ' : y:' + e.y );

/*         let x = this.mCamera.mouseWCX();
        let y = this.mCamera.mouseWCY();
        console.log(x);
        console.log(y); */
    }


    drawPyePacks() {
        for(let i = 0; i < this.mHero.dyePacks.length;i++) {
            this.mHero.dyePacks[i].draw(this.mCamera);
            //let xpos = this.mHero.dyePacks[i].getXform();
            //this.xpos.incXPosBy(this.mHero.dyePackSpeed);
            this.mHero.dyePacks[i].getXform().incXPosBy(this.mHero.dyePackSpeed);
        }
    }

    //https://www.youtube.com/watch?v=P2i11xnrpNI
    getCursorPosition() {
/*         window.addEventListener('mousemove', function (e) {
            //console.log("x: " + e.x + ' : y:' + e.y );
            this.mouseXPos = e.x;
            this.mouseYPos = e.y;
        }); */

        this.mouseXPos = this.mCamera.mouseWCX();
        this.mouseYPos = this.mCamera.mouseWCY();
        //console.log(x); 
    }

}





window.onload = function () {
    engine.init("GLCanvas");

    let myGame = new MyGame();
    myGame.start();
}