"use strict";  // Operate in Strict mode such that variables must be declared before used!


import { unload } from "../../engine/core/resource_map.js";
import engine from "../../engine/index.js";

class DyePack extends engine.GameObject {
    constructor(spriteTexture) {
        super(null);
        this.kTime = 0;
        this.kRefWidth = 80;
        this.kRefHeight = 130;
        this.kDelta = 1;

        this.frequency = 4;
        this.duration = 60;

        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0.1]);
        this.mRenderComponent.getXform().setPosition(50, 33);
        this.mRenderComponent.getXform().setSize(this.kRefWidth / 50, this.kRefHeight / 50);
        this.mRenderComponent.setElementPixelPositions(510, 595, 23, 153);

        this.oscillateW = new engine.Oscillate(1, this.frequency, this.duration);
        this.oscillateH = new engine.Oscillate(1, this.frequency, this.duration);
    }

    update() {
        this.kTime++;
        console.log(this.kTime);
        if (!this.oscillateW.done()) {
            let width = this.oscillateW.getNextForAmpl();
            let hight = this.oscillateW.getNextForAmpl();

            this.mRenderComponent.getXform().setSize(width, hight);
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
        if(this.kDelta >= 0.1) {
            this.kDelta -= 0.1;
        }
    }
    
    hit(){
        console.log("Hit");
        this.oscillateW.reStart();
        this.oscillateH.reStart();
    }
}

export default DyePack;