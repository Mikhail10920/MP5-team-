"use strict";  // Operate in Strict mode such that variables must be declared before used!


import { unload } from "../../engine/core/resource_map.js";
import engine from "../../engine/index.js";

class DyePack extends engine.GameObject {
    constructor(spriteTexture) {
        super(null);
        this.kTime = 0;
        this.kRefWidth = 80;
        this.kRefHeight = 130;
        this.kDelta = 2;

        this.frequency = 20;
        this.duration = 0;

        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0.1]);
        this.mRenderComponent.getXform().setPosition(50, 33);
        this.mRenderComponent.getXform().setSize(this.kRefWidth / 50, this.kRefHeight / 50);
        this.mRenderComponent.setElementPixelPositions(510, 595, 23, 153);

        this.oscillateW = new engine.Oscillate(1.5, this.frequency, this.duration);
        this.oscillateH = new engine.Oscillate(1.5, this.frequency, this.duration);
        this.mHit = false;
    }

    update() {
        //count frames
        this.kTime++;
        if (!this.oscillateW.done()) {
            let width = this.oscillateW.getNextForAmpl();
            let height = this.oscillateH.getNextForAmpl();

            this.mRenderComponent.getXform().setSize(width, height);
        }
    }

    getDelta()
    {
        return this.kDelta;
    }

    getTime()
    {
        return this.kTime;
    }

    slowDown(){
        console.log(this.kDelta);
        if(this.kDelta >= 0.1) {
            this.kDelta -= 0.1;
        }
    }
    
    hit(){
        console.log("Hit");
        this.duration = 300;

        this.oscillateW.changeDuration(this.duration);
        this.oscillateH.changeDuration(this.duration);
        
        this.oscillateW.reStart();
        this.oscillateH.reStart();
        this.mHit = true;
    }
}

export default DyePack;