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
    }

    draw(camera) {
        this.mGus.draw(camera);
    }

    update() {     
        this.mGus.mRenderComponent.getXform().setPosition(
            this.mGus.mRenderComponent.getXform().getXPos(),
            this.mGus.mRenderComponent.getXform().getYPos() + this.inc
        );

        this.mMovementUnit += this.inc;

        if(this.mMovementUnit == 0) {
            this.inc = 1;
        } else if(this.mMovementUnit == 100) {
            this.inc = -1;
        }

        this.checkForColisions();
    }

    checkForColisions() {
        let i;
        let h = []; 
        this.mInvFrame += 1;

        if(this.mInvFrame == 100) {
            this.mInvFrame = 0;
            this.mRecentHit = false;
            this.inc /= 2;
        }

        if(!this.mRecentHit) {
        for(i = 0; i < this.mCollide.dyePacks.size(); i++) {
            if (this.mGus.pixelTouches(this.mCollide.dyePacks.getObjectAt(i), h)) {
                console.log("cuh");
                this.mHealth -= 1;
                this.mRecentHit = true;
                this.inc *= 2;
                this.mCollide.dyePacks.getObjectAt(i).slowDown();
            }
        }
        }
    }
}

export default ExtraCredit;