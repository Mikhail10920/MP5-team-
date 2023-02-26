"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import TextureObject from "./texture_object.js";

class ExtraCredit extends engine.GameObject {
    constructor(texture, x, y, w, h, hero) {
        super(null);
        this.kDelta = 0.2;
        this.kRDelta = 0.1; // radian

        this.mGus = new TextureObject(texture, x, y, w, h);
        this.mMovementUnit = 50;
        this.inc = -1;
        this.mHealth = 10;

        this.mInvFrame = 0;
        this.mRecentHit = false;
        this.mCollide = hero;
        this.mShow = true;
    }

    draw(camera) {
        if(this.mShow) {
            this.mGus.draw(camera);
        }
    }

    update() {  
        if(this.mShow) {
            this.mGus.mRenderComponent.getXform().setPosition(
                this.mGus.mRenderComponent.getXform().getXPos(),
                this.mGus.mRenderComponent.getXform().getYPos() + this.inc
            );

            this.mMovementUnit += this.inc;

            if(this.mMovementUnit == 0) {
                this.inc = 1;
            } else if(this.mMovementUnit == 50) {
                this.inc = -1;
            }

            if(this.mHealth < 0) {
                this.mShow = false;
            }

            this.checkForColisions();
        }
    }

    checkForColisions() {
        let i;
        let h = []; 
        this.mInvFrame += 1;

        if(this.mInvFrame == 100) {
            this.mInvFrame = 0;
            this.mRecentHit = false;
        }

        if(!this.mRecentHit) {
        for(i = 0; i < this.mCollide.dyePacks.size(); i++) {
            if (this.mGus.pixelTouches(this.mCollide.dyePacks.getObjectAt(i), h)) {
                this.mHealth -= 1;
                this.mRecentHit = true;
                this.mCollide.dyePacks.getObjectAt(i).slowDown();
            }
        }
        }
    }
}

export default ExtraCredit;