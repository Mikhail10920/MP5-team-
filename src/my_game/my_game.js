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
import EC from "./objects/ec.js";

class MyGame extends engine.Scene {
    constructor() {
        super();
        this.kMinionSprite = "assets/minion_sprite.png";
        this.kMinionPortal = "assets/minion_portal.png";
        this.kExtraCredit = "assets/extra.png";

        //Background
        this.mBackground = null;

        // The camera to view the scene
        this.mCamera = null;
        this.mMiniCamera1 = null;
        this.mMiniCamera2 = null;
        this.mMiniCamera3 = null;
        this.mMiniCamera4 = null;

        this.mMsg = null;

        // the hero and the support objects
        this.mHero = null;

        //Initalize patrol set
        this.mPatrolSet = null;
        this.mPatrolSpawn = null;
        this.mPatrolTimer = null;
        this.mPatrolSpawnTimer = null;

        this.mCollide = null;
        this.mChoice = 'H';

        this.mouseXPos = 0;
        this.mouseYPos = 0;

        this.mPatrolTotal = 0;
        this.mDyePackTotal = 0;
        this.mToggleBoundary = false;

        this.mToggleCamera1 = false;
        this.mCamera1Follow = null;

        //Dyepack camera
        this.mToggleCamera2 = false;
        this.mCamera2Follow = null;

        this.mToggleCamera3 = false;
        this.mCamera3Follow = null;

        this.mToggleCamera4 = false;
        this.mCamera4Follow = null;

        this.mDyeFollow = [-1, -1, -1];

        //Extra credit
        this.mEC = null;
        this.mToggleEC = false;
    }

    load() {
        engine.texture.load(this.kMinionSprite);
        engine.texture.load(this.kMinionPortal);
        engine.texture.load(this.kExtraCredit);
    }

    unload() {
        engine.texture.unload(this.kMinionSprite);
        engine.texture.unload(this.kMinionPortal);
        engine.texture.unload(this.kExtraCredit);
    }

    init() {
        // Step A: set up the cameras
        this.mCamera = new engine.Camera(
            vec2.fromValues(50, 37.5), // position of the camera
            200,                       // width of camera
            [0, 0, 800, 600]           // viewport (orgX, orgY, width, height)
        );
        this.mCamera.setBackgroundColor([0.5, 0, 0.5, 1]);

        this.mMiniCamera1 = new engine.Camera(
            vec2.fromValues(35, 50), // position of the camera
            15,                       // width of camera
            [25, 625, 150, 150]           // viewport (orgX, orgY, width, height)
        );
        this.mMiniCamera1.setBackgroundColor([0, 0, 1, 1]);

        this.mMiniCamera2 = new engine.Camera(
            vec2.fromValues(35, 50), // position of the camera
            6,                       // width of camera
            [200, 625, 150, 150]           // viewport (orgX, orgY, width, height)
        );
        this.mMiniCamera2.setBackgroundColor([0, 1, 0, 1]);

        this.mMiniCamera3 = new engine.Camera(
            vec2.fromValues(35, 50), // position of the camera
            6,                       // width of camera
            [375, 625, 150, 150]           // viewport (orgX, orgY, width, height)
        );
        this.mMiniCamera3.setBackgroundColor([1, 0, 0, 1]);

        this.mMiniCamera4 = new engine.Camera(
            vec2.fromValues(35, 50), // position of the camera
            6,                       // width of camera
            [550, 625, 150, 150]           // viewport (orgX, orgY, width, height)
        );
        this.mMiniCamera4.setBackgroundColor([1, 0, 1, 1]);

        // Step D: Create the hero object with texture from the lower-left corner 
        this.mHero = new Hero(this.kMinionSprite);

        //Initalize patrol set
        this.mPatrolSet = new PatrolSet();
        
        //Initalize patrol spawn as false
        this.mPatrolSpawn = false;

        //Starts the timer. 60 variable = 60 frames = 1 second. Should be used throughout all our classes.
        this.mPatrolTimer = 1;
        this.mPatrolSpawnTimer = 121;

        this.mMsg = new engine.FontRenderable("Status Message");
        this.mMsg.setColor([0, 0, 0, 1]);
        this.mMsg.getXform().setPosition(-45, -30);
        this.mMsg.setTextHeight(3.5);

        this.mCollide = this.mHero;

        this.mEC = new EC(this.kExtraCredit, 100, 50, 50, 50);
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
        this.mMsg.draw(this.mCamera);

        if(this.mToggleEC) {
            this.mEC.draw(this.mCamera);
        }

        //Draws all patrols in patrol set
        let i;
        for(i = 0; i < this.mPatrolSet.size(); i++) {
            this.mPatrolSet.getObjectAt(i).draw(this.mCamera);
        }

        this.mHero.drawPyePacks(this.mCamera);

        if(this.mToggleCamera1) {
            this.mMiniCamera1.setViewAndCameraMatrix();
            this.mHero.draw(this.mMiniCamera1);
            this.mHero.dyePacks.draw(this.mMiniCamera1);
        }

        if(this.mToggleCamera2) {
            this.mMiniCamera2.setViewAndCameraMatrix();
            this.mHero.draw(this.mMiniCamera2);
            this.mHero.dyePacks.draw(this.mMiniCamera2);
        }

        if(this.mToggleCamera3) {
            this.mMiniCamera3.setViewAndCameraMatrix();
            this.mHero.draw(this.mMiniCamera3);
            this.mHero.dyePacks.draw(this.mMiniCamera3);
        }

        if(this.mToggleCamera4) {
            this.mMiniCamera4.setViewAndCameraMatrix();
            this.mHero.draw(this.mMiniCamera4);
            this.mHero.dyePacks.draw(this.mMiniCamera4);
        }
    }

    // The update function, updates the application state. Make sure to _NOT_ draw
    // anything from this function!
    update() {
        //Trevor's Code
        this.mMiniCamera1.setWCCenter(this.mHero.mRenderComponent.getXform().getXPos(), this.mHero.mRenderComponent.getXform().getYPos());
        this.mMiniCamera1.update();
        if(this.mPatrolSpawn) {
            this.mPatrolTimer++;
        }

        //Sets patrol spawn
        if (engine.input.isKeyClicked(engine.input.keys.P)) {
            this.mPatrolSpawn = !this.mPatrolSpawn;
            this.mPatrolTimer = 1;
        }

        //Shows all boundaries of every patrol. Causes a TON of lag. Debug.
        if(engine.input.isKeyClicked(engine.input.keys.B)) {
            this.mToggleBoundary = !this.mToggleBoundary;
        }
        
        //Camera Controls
        if(engine.input.isKeyClicked(engine.input.keys.Zero)) {
            this.mToggleCamera1 = !this.mToggleCamera1;
        }

        if(engine.input.isKeyClicked(engine.input.keys.One)) {
            this.mToggleCamera2 = !this.mToggleCamera2;
        }

        if(engine.input.isKeyClicked(engine.input.keys.Two)) {
            this.mToggleCamera3 = !this.mToggleCamera3;
        }

        if(engine.input.isKeyClicked(engine.input.keys.Three)) {
            this.mToggleCamera4 = !this.mToggleCamera4;
        }

        if(engine.input.isKeyClicked(engine.input.keys.U)) {
            this.mToggleEC = !this.mToggleEC;
        }   

        if(this.mDyeFollow[0] != -1) {
            if(this.mHero.dyePacks.getObjectAt(this.mDyeFollow[0]).kDelta <= .1) {
                this.mToggleCamera2 = false;
                this.mDyeFollow[0] = -1;
            }
        } else if(this.mDyeFollow[1] != -1) {
            if(this.mHero.dyePacks.getObjectAt(this.mDyeFollow[1]).kDelta <= .1) {
                this.mToggleCamera3 = false;
                this.mDyeFollow[1] = -1;
            }
        } else if(this.mDyeFollow[2] != -1) {
            if(this.mHero.dyePacks.getObjectAt(this.mDyeFollow[2]).kDelta <= .1) {
                this.mToggleCamera4 = false;
                this.mDyeFollow[2] = -1;
            }
        }

        if(this.mToggleCamera2 && (this.mDyeFollow[0] != -1)) {
            console.log(this.mDyeFollow[0]);
            this.mMiniCamera2.setWCCenter(
            this.mHero.dyePacks.getObjectAt(this.mDyeFollow[0]).mRenderComponent.getXform().getXPos(), 
            this.mHero.dyePacks.getObjectAt(this.mDyeFollow[0]).mRenderComponent.getXform().getYPos());
            this.mMiniCamera2.update();
        } else if(this.mToggleCamera3 && (this.mDyeFollow[1] != -1)) {
            console.log(this.mDyeFollow[1]);
            this.mMiniCamera3.setWCCenter(
                this.mHero.dyePacks.getObjectAt(this.mDyeFollow[1]).mRenderComponent.getXform().getXPos(), 
                this.mHero.dyePacks.getObjectAt(this.mDyeFollow[1]).mRenderComponent.getXform().getYPos());
                this.mMiniCamera3.update();
        } else if(this.mToggleCamera4 && (this.mDyeFollow[2] != -1)) {
            console.log(this.mDyeFollow[2]);
            this.mMiniCamera4.setWCCenter(
                this.mHero.dyePacks.getObjectAt(this.mDyeFollow[2]).mRenderComponent.getXform().getXPos(), 
                this.mHero.dyePacks.getObjectAt(this.mDyeFollow[2]).mRenderComponent.getXform().getYPos());
                this.mMiniCamera4.update();
        }

        //Force spawns a patrol
        if (engine.input.isKeyClicked(engine.input.keys.C)) {
            let tempPatrol = new Patrol(this.mHero, this.kMinionSprite, this.kMinionPortal, 
            (Math.floor(Math.random() * 90) + 50), //Limit of 145 to -50
            (Math.floor(Math.random() * 100) - 20)); //Limit of 110 to -35
            this.mPatrolSet.addToSet(tempPatrol);
            this.mPatrolTotal++;
        }

        //Hits all heads once. Debug button
        if(engine.input.isKeyClicked(engine.input.keys.J)) {
            for(let i = 0; i < this.mPatrolSet.size(); i++) {
                this.mPatrolSet.getObjectAt(i).headHitDebug();
            }
        }

        //Spawns patrol based on a timer
        if(((this.mPatrolTimer % this.mPatrolSpawnTimer) == 0) && this.mPatrolSpawn) {
            let tempPatrol = new Patrol(this.mHero, this.kMinionSprite, this.kMinionPortal, 
            ((Math.floor(Math.random() * 100) + 50)), 
            (Math.floor(Math.random() * 100) - 30));
            this.mPatrolSet.addToSet(tempPatrol);
            this.mPatrolSpawnTimer = Math.floor(Math.random() * 180) + 120;
            this.mPatrolTimer = 1;
            this.mPatrolTotal++;
        }

        //Constantly checks to delete any patrols that meets the requirements.
        for(let i = 0; i < this.mPatrolSet.size(); i++) {
            if(this.mPatrolSet.getObjectAt(i).mCanDelete == true) {
                this.mPatrolSet.removeFromSet(this.mPatrolSet.getObjectAt(i));
            }
        }

        //Toggle boundary AND check for hit event
        for(let i = 0; i < this.mPatrolSet.size(); i++) {
            this.mPatrolSet.getObjectAt(i).boundaryToggle(this.mToggleBoundary);

            if(this.mPatrolSet.getObjectAt(i).mIsHit) {
                if(this.mDyeFollow[0] == -1) {
                    this.mDyeFollow[0] = this.mPatrolSet.getObjectAt(i).mIndexOfDye;
                    this.mToggleCamera2 = true;
                } else if(this.mDyeFollow[1] == -1) {
                    this.mDyeFollow[1] = this.mPatrolSet.getObjectAt(i).mIndexOfDye;
                    this.mToggleCamera3 = true;
                } else if(this.mDyeFollow[2] == -1) {
                    this.mDyeFollow[2] = this.mPatrolSet.getObjectAt(i).mIndexOfDye;
                    this.mToggleCamera4 = true;
                }
            }
        }

        this.mPatrolSet.update();

        //End of Trevor's Code
        let ECArray = [];
        
        //Message output
        let msg = "Patrol Spawned Total: " + this.mPatrolTotal + 
        " Dyepack Spawned Total: " + this.mDyePackTotal + 
        " AutoSpawn: " + this.mPatrolSpawn +
        "Mouse X and Y " + this.mouseXPos + " " + this.mouseYPos;

        this.mHero.update();

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
            this.mHero.oscsalateHero();
        }

        for(let i = 0; i < this.mHero.dyePacks.length;i++) {
            if (this.mHero.dyePacks[i]);
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