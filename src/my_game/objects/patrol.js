"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

import Brain from "./brain.js";
//import Hero from "./objects/hero.js";
import Minion from "./minion.js";



class Patrol extends engine.GameObject {
    constructor(hero, spriteTexture, spriteTextureHead, atX, atY) {
        super(null);

        this.kDelta = 0.2;

        this.kMinionSprite = "assets/minion_sprite.png";
        this.kMinionPortal = "assets/minion_portal.png";

        this.mHead = null;
        this.mWingTop = null;
        this.mWingBot = null;
        this.mCollide = null;

        this.mHead = new Brain(this.kMinionSprite);
        this.mWingTop = new Minion(this.kMinionSprite, 30, 30);
        this.mWingBot = new Minion(this.kMinionSprite, 70, 30);

        this.mCollide = hero;

/*         this.mHead = new engine.SpriteRenderable(spriteTextureHead);

        this.mHead.setColor([1, 1, 1, 0]);
        this.mHead.getXform().setPosition(atX, atY);
        this.mHead.getXform().setSize(7.5, 7.5);
        //this.mHead.setElementPixelPositions(510, 595, 23, 153);

        this.mWingTop = new engine.SpriteAnimateRenderable(spriteTexture);
        this.mWingTop.setColor([1, 1, 1, 0]);
        this.mWingTop.getXform().setPosition(atX + 10, atY + 6);
        this.mWingTop.getXform().setSize(10, 8);
        this.mWingTop.setSpriteSequence(512, 0,      // first element pixel position: top-left 512 is top of image, 0 is left of image
            204, 164,   // width x height in pixels
            5,          // number of elements in this sequence
            0);         // horizontal padding in between
        this.mWingTop.setAnimationType(engine.eAnimationType.eSwing);
        this.mWingTop.setAnimationSpeed(30);
        //this.mWingTop.setElementPixelPositions(510, 595, 23, 153);

        // show each element for mAnimSpeed updates
        this.mWingBot = new engine.SpriteAnimateRenderable(spriteTexture);
        this.mWingBot.setColor([1, 1, 1, 0]);
        this.mWingBot.getXform().setPosition(atX + 10, atY - 6);
        this.mWingBot.getXform().setSize(10, 8);
        this.mWingBot.setSpriteSequence(512, 0,      // first element pixel position: top-left 512 is top of image, 0 is left of image
            204, 164,   // width x height in pixels
            5,          // number of elements in this sequence
            0);         // horizontal padding in between
        this.mWingBot.setAnimationType(engine.eAnimationType.eSwing);
        this.mWingBot.setAnimationSpeed(30);
        //this.mWingBot.setElementPixelPositions(510, 595, 23, 153); */
        
        //Util variables
        this.mCurrentDirection = null;
        this.mMoveUnit = 0.0;
        this.mMoveRate = 0.0;
        
        //console.log("Spawn");
    }

    load() {
        engine.texture.load(this.kMinionSprite);
        engine.texture.load(this.kMinionPortal);
    }

    unload() {
        engine.texture.unload(this.kMinionSprite);
        engine.texture.unload(this.kMinionPortal);
    }

    draw(camera) {
        this.mHead.draw(camera);
        this.mWingTop.draw(camera);
        this.mWingBot.draw(camera);
    }

    update() {
        // remember to update this.mRenderComponent's animation
        //this.mWingTop.updateAnimation();
        //this.mWingBot.updateAnimation();
        
        if(this.mMoveUnit <= 0) {
            this.mCurrentDirection = Math.floor(Math.random() * 4); //0 - 3
            this.mMoveUnit = Math.floor(Math.random() * 10) + 5; // 5 - 10
            this.mMoveRate = this.mMoveUnit / 60; //The rate that it will go through in 1 second
        }

        //if(this.mHead.pixelTouch()) 

        //Moves a specified direction at randomized unit
        if(this.mCurrentDirection == 0) { //North
            this.mHead.getXform().incYPosBy(this.mMoveRate);
            this.mMoveUnit -= this.mMoveRate;
        } else if(this.mCurrentDirection == 1) { //East
            this.mHead.getXform().incXPosBy(this.mMoveRate);
            this.mMoveUnit -= this.mMoveRate;
        } else if(this.mCurrentDirection == 2) { //South
            this.mHead.getXform().incYPosBy(-this.mMoveRate);
            this.mMoveUnit -= this.mMoveRate;
        } else if(this.mCurrentDirection == 3) { //West
            this.mHead.getXform().incXPosBy(-this.mMoveRate);
            this.mMoveUnit -= this.mMoveRate;
        }

        this.mWingTop.getXform().setXPos(this.mHead.getXform().getXPos() + 10);
        this.mWingTop.getXform().setYPos(this.mHead.getXform().getYPos() + 6);

        this.mWingBot.getXform().setXPos(this.mHead.getXform().getXPos() + 10);
        this.mWingBot.getXform().setYPos(this.mHead.getXform().getYPos() - 6);

        this.checkForColisions();
    }

    isDead() {
        
    }

    checkForColisions() {
        let h = []; 
        if (this.mHead.pixelTouches(this.mCollide, h)) {
            console.log("collision"); 
        }
        if (this.mWingTop.pixelTouches(this.mCollide, h)) {
            console.log("collision"); 
        }
        if (this.mWingBot.pixelTouches(this.mCollide, h)) {
            console.log("collision"); 
        }
    }
}

export default Patrol;