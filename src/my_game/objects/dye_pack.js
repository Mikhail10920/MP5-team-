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

        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0.1]);
        this.mRenderComponent.getXform().setPosition(50, 33);
        this.mRenderComponent.getXform().setSize(this.kRefWidth / 50, this.kRefHeight / 50);
        this.mRenderComponent.setElementPixelPositions(510, 595, 23, 153);
    }

    update() {
        this.kTime += 1; //keep track of the time active by frames updated

        if (engine.input.isKeyPressed(engine.input.keys.D)){
            this.slowDown();
        }
        else{
            this.dyePackSpeed = 1;
        }

        if (this.isVisible()) {
            xform.incYPosBy(-this.kDelta);
        }

        if (this.dyePackSpeed >= this.kTime + 360){
            delete(this);
        }
    }

    getDelta()
    {
        return this.kDelta;
    }

    slowDown(){
        this.dyePackSpeed -= 0.1;
    }
}

export default DyePack;