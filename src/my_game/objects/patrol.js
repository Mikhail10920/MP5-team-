"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import LineRenderable from "../../engine/renderables/line_renderable.js";

import Brain from "./brain.js";
//import Hero from "./objects/hero.js";
import Minion from "./minion.js";
import TextureObject from "./texture_object.js";



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

        this.showBoundary = false;

        this.mCollide = hero;
        this.mOffset = 0;
        this.mRecentHit = false;
        this.mInvFrame = 0.0;
        this.mCanDelete = false;

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
            this.mMoveRate = this.mMoveUnit / 60; //The rate that it will go through in 1 second
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
        this.mHead.getXform().getXPos() - 2.75, this.mHead.getXform().getYPos() + 11); 
        this.mBoundaryRight.setVertices(this.mHead.getXform().getXPos() + 15 - this.mOffset, this.mHead.getXform().getYPos() - 11, 
        this.mHead.getXform().getXPos() + 15 - this.mOffset, this.mHead.getXform().getYPos() + 11); 
        this.mBoundaryTop.setVertices(this.mHead.getXform().getXPos() - 2.75, this.mHead.getXform().getYPos() + 11, 
        this.mHead.getXform().getXPos() + 15 - this.mOffset, this.mHead.getXform().getYPos() + 11); 
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

        this.mWingTop.getXform().setXPos(this.mHead.getXform().getXPos() + 10 - this.mOffset);
        this.mWingTop.getXform().setYPos(this.mHead.getXform().getYPos() + 6);

        this.mWingBot.getXform().setXPos(this.mHead.getXform().getXPos() + 10 - this.mOffset);
        this.mWingBot.getXform().setYPos(this.mHead.getXform().getYPos() - 6);

        this.mWingTop.update();
        this.mWingBot.update();

        this.checkForColisions();
        this.validDeletion();
    }

    isDead() {
        
    }

    checkForColisions() {
        let i;
        let h = []; 
        this.mInvFrame += 1;
        if(this.mInvFrame == 15) {
            this.mRecentHit = false;
        }

        for(i = 0; i < this.mCollide.dyePacks.length; i++) {
            if (this.mHead.pixelTouches(this.mCollide.dyePacks[i], h) && !this.mRecentHit) {
                this.mOffset += 5;
                this.mHead.getXform().incXPosBy(this.mOffset);
                this.mRecentHit = true;
                this.mInvFrame = 0;
            }
            if (this.mWingTop.pixelTouches(this.mCollide.dyePacks[i], h) && !this.mRecentHit) {
                if(this.mWingTop.mRenderComponent.getColor()[3] >= 1) {

                } else {
                    this.mWingTop.mRenderComponent.setColor(
                        [this.mWingTop.mRenderComponent.getColor()[0],
                        this.mWingTop.mRenderComponent.getColor()[1],
                        this.mWingTop.mRenderComponent.getColor()[2],
                        this.mWingTop.mRenderComponent.getColor()[3] + .3]);
                        this.mRecentHit = true;
                        this.mInvFrame = 0;
                }
            }

            if (this.mWingBot.pixelTouches(this.mCollide.dyePacks[i], h) && !this.mRecentHit) {
                if(this.mWingBot.mRenderComponent.getColor()[3] >= 1) {

                } else {
                    this.mWingBot.mRenderComponent.setColor(
                        [this.mWingBot.mRenderComponent.getColor()[0],
                        this.mWingBot.mRenderComponent.getColor()[1],
                        this.mWingBot.mRenderComponent.getColor()[2],
                        this.mWingBot.mRenderComponent.getColor()[3] + .3]);
                        this.mRecentHit = true;
                        this.mInvFrame = 0;
                }
            }
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

}

export default Patrol;