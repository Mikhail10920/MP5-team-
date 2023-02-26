"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import LineRenderable from "../../engine/renderables/line_renderable.js";

import Brain from "./brain.js";
//import Hero from "./objects/hero.js";
import Minion from "./minion.js";
import TextureObject from "./texture_object.js";
import DyePack from "./dye_pack.js";

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

        this.mHead = new TextureObject(this.kMinionPortal, atX, atY, 7.5, 7.5);
        this.mWingTop = new Minion(this.kMinionSprite, atX, atY);
        this.mWingBot = new Minion(this.kMinionSprite, atX, atY);

        //Boundary lines
        this.mBoundaryLeft = new LineRenderable(atX, atY, atX, atY);
        this.mBoundaryRight = new LineRenderable(atX, atY, atX, atY);
        this.mBoundaryTop = new LineRenderable(atX, atY, atX, atY);
        this.mBoundaryBot = new LineRenderable(atX, atY, atX, atY);

        this.mHeadBoundLeft = new LineRenderable(atX, atY, atX, atY);
        this.mHeadBoundRight = new LineRenderable(atX, atY, atX, atY);
        this.mHeadBoundTop = new LineRenderable(atX, atY, atX, atY);
        this.mHeadBoundBot = new LineRenderable(atX, atY, atX, atY);

        this.mTopBoundLeft = new LineRenderable(atX, atY, atX, atY);
        this.mTopBoundRight = new LineRenderable(atX, atY, atX, atY);
        this.mTopBoundTop = new LineRenderable(atX, atY, atX, atY);
        this.mTopBoundBot = new LineRenderable(atX, atY, atX, atY);

        this.mBotBoundLeft = new LineRenderable(atX, atY, atX, atY);
        this.mBotBoundRight = new LineRenderable(atX, atY, atX, atY);
        this.mBotBoundTop = new LineRenderable(atX, atY, atX, atY);
        this.mBotBoundBot = new LineRenderable(atX, atY, atX, atY);

        //Toggled by pressing B
        this.showBoundary = false;

        this.mCollide = hero;
        this.mOffset = 0;

        //Handles invincibility frames
        this.mRecentHit = false;
        this.mInvFrame = 0.0;
        this.mIsHit = false;
        this.mDyeHit = null;

        //If true, removes from set
        this.mCanDelete = false;
        
        //Util variables
        this.mCurrentDirection = null;
        this.mMoveUnit = 0.0;
        this.mMoveRate = 0.0;

        //Hero touching head
        this.mHeroTimer = 0;


        this.lerpX1 = new engine.Lerp(0, 120, 0.05);
        this.lerpY1 = new engine.Lerp(0, 120, 0.05);

        this.lerpX2 = new engine.Lerp(0, 120, 0.05);
        this.lerpY2 = new engine.Lerp(0, 120, 0.05);

        this.mRate = 60;

        this.rand = Math.floor(Math.random() * 2);
        if(this.rand) {
            this.secondType();
        }

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

        if(this.showBoundary) {
            this.mBoundaryLeft.draw(camera);
            this.mBoundaryRight.draw(camera);
            this.mBoundaryTop.draw(camera);
            this.mBoundaryBot.draw(camera);

            this.mHeadBoundLeft.draw(camera);
            this.mHeadBoundRight.draw(camera);
            this.mHeadBoundTop.draw(camera);
            this.mHeadBoundBot.draw(camera);

            this.mTopBoundLeft.draw(camera);
            this.mTopBoundRight.draw(camera);
            this.mTopBoundTop.draw(camera);
            this.mTopBoundBot.draw(camera);

            this.mBotBoundLeft.draw(camera);
            this.mBotBoundRight.draw(camera);
            this.mBotBoundTop.draw(camera);
            this.mBotBoundBot.draw(camera);
        }
        
    }

    update() {
        // remember to update this.mRenderComponent's animation
        //this.mWingTop.updateAnimation();
        //this.mWingBot.updateAnimation();
        
        if(this.mMoveUnit <= 0) {
            this.mCurrentDirection = Math.floor(Math.random() * 4); //0 - 3
            this.mMoveUnit = Math.floor(Math.random() * 10) + 5; // 5 - 10
            this.mMoveRate = this.mMoveUnit / this.mRate; //The rate that it will go through in 1 second
        }

        //Moves a specified direction at randomized unit
        if(this.mCurrentDirection == 0) { //North
            this.mHead.getXform().incYPosBy(this.mMoveRate);
            if(this.mHead.getXform().getYPos() > 110) {
                this.mCurrentDirection = 2;
            }
            this.mMoveUnit -= this.mMoveRate;
        } else if(this.mCurrentDirection == 1) { //East
            this.mHead.getXform().incXPosBy(this.mMoveRate);
            if(this.mHead.getXform().getXPos() > 145) {
                this.mCurrentDirection = 3;
            }
            this.mMoveUnit -= this.mMoveRate;
        } else if(this.mCurrentDirection == 2) { //South
            this.mHead.getXform().incYPosBy(-this.mMoveRate);
            if(this.mHead.getXform().getYPos() < -30) {
                this.mCurrentDirection = 0;
            }
            this.mMoveUnit -= this.mMoveRate;
        } else if(this.mCurrentDirection == 3) { //West
            this.mHead.getXform().incXPosBy(-this.mMoveRate);
            if(this.mHead.getXform().getXPos() < -50) {
                this.mCurrentDirection = 1;
            }
            this.mMoveUnit -= this.mMoveRate;
        }

        if(this.showBoundary) {
        //Update overall boundary
        this.mBoundaryLeft.setVertices(this.mHead.getXform().getXPos() - 2.75, this.mHead.getXform().getYPos() - 11, 
        this.mHead.getXform().getXPos() - 2.75, this.mHead.getXform().getYPos() + 17); 
        this.mBoundaryRight.setVertices(this.mHead.getXform().getXPos() + 15 - this.mOffset, this.mHead.getXform().getYPos() - 11, 
        this.mHead.getXform().getXPos() + 15 - this.mOffset, this.mHead.getXform().getYPos() + 17); 
        this.mBoundaryTop.setVertices(this.mHead.getXform().getXPos() - 2.75, this.mHead.getXform().getYPos() + 17, 
        this.mHead.getXform().getXPos() + 15 - this.mOffset, this.mHead.getXform().getYPos() + 17); 
        this.mBoundaryBot.setVertices(this.mHead.getXform().getXPos() - 2.75, this.mHead.getXform().getYPos() - 11, 
        this.mHead.getXform().getXPos() + 15 - this.mOffset, this.mHead.getXform().getYPos() - 11); 

        //Update Head boundary
        this.mHeadBoundLeft.setVertices(this.mHead.getXform().getXPos() - 2.25, this.mHead.getXform().getYPos() - 3, 
        this.mHead.getXform().getXPos() - 2.25, this.mHead.getXform().getYPos() + 3); 
        this.mHeadBoundRight.setVertices(this.mHead.getXform().getXPos() + 2.5, this.mHead.getXform().getYPos() - 3, 
        this.mHead.getXform().getXPos() + 2.5, this.mHead.getXform().getYPos() + 3); 
        this.mHeadBoundTop.setVertices(this.mHead.getXform().getXPos() - 2.5, this.mHead.getXform().getYPos() + 3, 
        this.mHead.getXform().getXPos() + 2.5, this.mHead.getXform().getYPos() + 3); 
        this.mHeadBoundBot.setVertices(this.mHead.getXform().getXPos() - 2.5, this.mHead.getXform().getYPos() - 3, 
        this.mHead.getXform().getXPos() + 2.5, this.mHead.getXform().getYPos() - 3); 

        this.mTopBoundLeft.setVertices(this.mWingTop.getXform().getXPos() - 4.25, this.mWingTop.getXform().getYPos() - 3,
        this.mWingTop.getXform().getXPos() - 4.25, this.mWingTop.getXform().getYPos() + 4);
        this.mTopBoundRight.setVertices(this.mWingTop.getXform().getXPos() + 4.25, this.mWingTop.getXform().getYPos() - 3,
        this.mWingTop.getXform().getXPos() + 4.25, this.mWingTop.getXform().getYPos() + 4);
        this.mTopBoundTop.setVertices(this.mWingTop.getXform().getXPos() - 4.25, this.mWingTop.getXform().getYPos() + 4,
        this.mWingTop.getXform().getXPos() + 4.25, this.mWingTop.getXform().getYPos() + 4);
        this.mTopBoundBot.setVertices(this.mWingTop.getXform().getXPos() - 4.25, this.mWingTop.getXform().getYPos() - 3,
        this.mWingTop.getXform().getXPos() + 4.25, this.mWingTop.getXform().getYPos() - 3);

        this.mBotBoundLeft.setVertices(this.mWingBot.getXform().getXPos() - 4.25, this.mWingBot.getXform().getYPos() - 3,
        this.mWingBot.getXform().getXPos() - 4.25, this.mWingBot.getXform().getYPos() + 4);
        this.mBotBoundRight.setVertices(this.mWingBot.getXform().getXPos() + 4.25, this.mWingBot.getXform().getYPos() - 3,
        this.mWingBot.getXform().getXPos() + 4.25, this.mWingBot.getXform().getYPos() + 4);
        this.mBotBoundTop.setVertices(this.mWingBot.getXform().getXPos() - 4.25, this.mWingBot.getXform().getYPos() + 4,
        this.mWingBot.getXform().getXPos() + 4.25, this.mWingBot.getXform().getYPos() + 4);
        this.mBotBoundBot.setVertices(this.mWingTop.getXform().getXPos() - 4.25, this.mWingBot.getXform().getYPos() - 3,
        this.mWingBot.getXform().getXPos() + 4.25, this.mWingBot.getXform().getYPos() - 3);
        }

        //Wings
        //this.mWingTop.getXform().setXPos(this.mHead.getXform().getXPos() + 10 - this.mOffset);
        //this.mWingTop.getXform().setYPos(this.mHead.getXform().getYPos() + 6);

        //this.mWingBot.getXform().setXPos(this.mHead.getXform().getXPos() + 10 - this.mOffset);
        //this.mWingBot.getXform().setYPos(this.mHead.getXform().getYPos() - 6);

        this.mWingTop.update();
        this.mWingBot.update();

        this.checkForColisions();
        this.validDeletion();
    }

    checkForColisions() {
        let i;
        let h = []; 
        this.mInvFrame += 1;
        this.mHeroTimer--;
        if(this.mInvFrame == 15) {
            this.mRecentHit = false;
            this.mIndexOfDye = -1;
        }

        if(this.mCollide.pixelTouches(this.mHead, h) && (this.mHeroTimer < 0)) {
            this.mCollide.oscsalateHero();
            this.mHeroTimer = 60;
        }

        for(i = 0; i < this.mCollide.dyePacks.size(); i++) {
            if (this.mHead.pixelTouches(this.mCollide.dyePacks.getObjectAt(i), h)) {
                if(!this.mRecentHit) {
                    //Oscillate DyePack object
                    this.mCollide.dyePacks.getObjectAt(i).hit();

                    this.mOffset += 5;
                    this.mHead.getXform().incXPosBy(this.mOffset);
                    this.mRecentHit = true;
                    this.mInvFrame = 0;
                    this.mIsHit = true;
                    this.mDyeHit = this.mCollide.dyePacks.getObjectAt(i);
                }
                this.mCollide.dyePacks.getObjectAt(i).slowDown();
            }

            if (this.mWingTop.pixelTouches(this.mCollide.dyePacks.getObjectAt(i), h)) {
                if(!this.mRecentHit) {
                    //Oscillate DyePack Object
                    this.mCollide.dyePacks.getObjectAt(i).hit();

                    this.mWingTop.mRenderComponent.setColor(
                        [this.mWingTop.mRenderComponent.getColor()[0],
                        this.mWingTop.mRenderComponent.getColor()[1],
                        this.mWingTop.mRenderComponent.getColor()[2],
                        this.mWingTop.mRenderComponent.getColor()[3] + .2]);
                        this.mRecentHit = true;
                        this.mInvFrame = 0;
                        this.mIsHit = true;
                        this.mDyeHit = this.mCollide.dyePacks.getObjectAt(i);
                }
                this.mCollide.dyePacks.getObjectAt(i).slowDown();
            }

            if (this.mWingBot.pixelTouches(this.mCollide.dyePacks.getObjectAt(i), h)) {
                if(!this.mRecentHit) {
                    //Oscillate DyePack Object
                    this.mCollide.dyePacks.getObjectAt(i).hit();

                    this.mWingBot.mRenderComponent.setColor(
                        [this.mWingBot.mRenderComponent.getColor()[0],
                        this.mWingBot.mRenderComponent.getColor()[1],
                        this.mWingBot.mRenderComponent.getColor()[2],
                        this.mWingBot.mRenderComponent.getColor()[3] + .2]);
                        this.mRecentHit = true;
                        this.mInvFrame = 0;
                        this.mIsHit = true;
                        this.mDyeHit = this.mCollide.dyePacks.getObjectAt(i);
                }
                this.mCollide.dyePacks.getObjectAt(i).slowDown();
            }
        }

        this.lerpStUp(this.mHead.getXform().getXPos(), this.mHead.getXform().getYPos());
        this.lerpMovement(this.mHead.getXform().getXPos(), this.mHead.getXform().getYPos());
    }


    lerpStUp(xMouse, yMouse) {

        let xPos = this.mWingTop.getXform().getXPos();
        let yPos = this.mWingTop.getXform().getYPos();

        this.xDist = (xMouse - xPos);
        this.yDist = (yMouse - yPos);

        //console.log(this.xDist, this.yDist);


        this.lerpX1.setCurentValue(this.mWingTop.getXform().getXPos());
        this.lerpY1.setCurentValue(this.mWingTop.getXform().getYPos());

        this.lerpX1.setFinal(this.xDist + this.mWingTop.getXform().getXPos() + 10);
        this.lerpY1.setFinal(this.yDist + this.mWingTop.getXform().getYPos() + 6);


        
        let xPos2 = this.mWingBot.getXform().getXPos();
        let yPos2 = this.mWingBot.getXform().getYPos();

        this.xDist2 = (xMouse - xPos2);
        this.yDist2 = (yMouse - yPos2);


        this.lerpX2.setCurentValue(this.mWingBot.getXform().getXPos());
        this.lerpY2.setCurentValue(this.mWingBot.getXform().getYPos());

        this.lerpX2.setFinal(this.xDist2 + this.mWingBot.getXform().getXPos() + 10);
        this.lerpY2.setFinal(this.yDist2 + this.mWingBot.getXform().getYPos() - 6);

    }

    lerpMovement(xMouse,yMouse) {
        let xform = this.mWingTop.getXform();
        let xform2 = this.mWingBot.getXform();
        //let pos = this.getXform().getXPos();

        if(!this.lerpX1.done()) {

            this.lerpX1.update();
            var x = this.lerpX1.get();

            this.lerpY1.update();
            var y = this.lerpY1.get();

            xform.setXPos(x);
            xform.setYPos(y);

        }

        if(!this.lerpX2.done()) {

            this.lerpX2.update();
            var x2 = this.lerpX2.get();

            this.lerpY2.update();
            var y2 = this.lerpY2.get();

            xform2.setXPos(x2);
            xform2.setYPos(y2);

        }
    }


    headHitDebug() {
        this.mOffset += 5;
        this.mHead.getXform().incXPosBy(this.mOffset);
    }

    validDeletion() {
        if(this.mOffset == 10 || ((this.mWingBot.mRenderComponent.getColor()[3] >= 1) || (this.mWingTop.mRenderComponent.getColor()[3] >= 1))) {
            this.mCanDelete = true;
        }
    }

    boundaryToggle(toggle) {
        this.showBoundary = toggle;
    }

    secondType() {
        this.mHead.mRenderComponent.setColor([this.mHead.mRenderComponent.getColor()[0],
        this.mHead.mRenderComponent.getColor()[1],
        this.mHead.mRenderComponent.getColor()[2]  + 3.5,
        this.mHead.mRenderComponent.getColor()[3]]);

        this.mWingBot.mRenderComponent.setColor([this.mWingBot.mRenderComponent.getColor()[0],
        this.mWingBot.mRenderComponent.getColor()[1],
        this.mWingBot.mRenderComponent.getColor()[2]  + 2.5,
        this.mWingBot.mRenderComponent.getColor()[3]]);

        this.mWingTop.mRenderComponent.setColor([this.mWingTop.mRenderComponent.getColor()[0],
        this.mWingTop.mRenderComponent.getColor()[1],
        this.mWingTop.mRenderComponent.getColor()[2]  + 2.5,
        this.mWingTop.mRenderComponent.getColor()[3]]);

        this.mRate = 30;
        //this.mWingBot;
        //this.mWingTop;

    }

}

export default Patrol;