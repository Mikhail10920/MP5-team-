"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class Patrol extends engine.GameObject {
    constructor(spriteTexture, spriteTextureHead, atX, atY) {
        super(null);

        this.kDelta = 0.2;
        this.mHead = new engine.SpriteRenderable(spriteTextureHead);

        this.mHead.setColor([1, 1, 1, 0]);
        this.mHead.getXform().setPosition(atX, atY);
        this.mHead.getXform().setSize(7.5, 7.5);

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
        
    }

    draw(camera) {
        this.mHead.draw(camera);
        this.mWingTop.draw(camera);
        this.mWingBot.draw(camera);
    }

    update() {
        // remember to update this.mRenderComponent's animation
        this.mWingTop.updateAnimation();
        this.mWingBot.updateAnimation();

    }
}

export default Patrol;