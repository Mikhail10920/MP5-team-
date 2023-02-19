"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";

class Hero extends engine.GameObject {
    constructor(spriteTexture) {
        super(null);
        this.kDelta = 0.3;

        this.mRenderComponent = new engine.SpriteRenderable(spriteTexture);
        this.mRenderComponent.setColor([1, 1, 1, 0]);
        this.mRenderComponent.getXform().setPosition(35, 50);
        this.mRenderComponent.getXform().setSize(9, 12);
        this.mRenderComponent.setElementPixelPositions(0, 120, 0, 180);

        this.xPos = 0;
        this.yPos = 0;
        this.speed = 1;

        this.xAmplitude = 4.5;
        this.yAmplitude = 6;
        this.frequency = 4;
        this.duration = 60;

        this.startTime = 0;
        this.time = 0;
        this.endTime = 0;

        this.oscsalateActive = false;

        this.framemes = 0;
        this.framesLimeint = false; 
    }

    update() {
        // control by WASD
        let xform = this.getXform();
        if (engine.input.isKeyPressed(engine.input.keys.W)) {
            xform.incYPosBy(this.kDelta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.S)) {
            xform.incYPosBy(-this.kDelta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.A)) {
            xform.incXPosBy(this.kDelta);
        }
        if (engine.input.isKeyPressed(engine.input.keys.D)) {
            xform.incXPosBy(-this.kDelta);
        }
    }

    moveHeroToMousePos(x,y) {
        let xform = this.getXform();
        let pos = this.getXform().getPosition();//this.xform().getPosition();

        if(x > pos[0]) {
            xform.incXPosBy(this.kDelta);
        } 
        else {
            xform.incXPosBy(-this.kDelta);   
        }
        if(y > pos[1]) {
            xform.incYPosBy(this.kDelta);
        }
        else {
            xform.incYPosBy(-this.kDelta);
        }
    }

    async oscsalateHero() {
        if(!this.oscsalateActive) {
            this.oscsalateActive = true;
            let curernt = new Date();
            this.endTime = curernt.getTime() + this.duration;
            this.time = curernt.getTime();
            console.log(this.time);
            console.log(this.endTime);

            //let i = 0;
            //while(this.time < this.endTime) 

            for(let i = 0; i < this.duration; i++) {
            //await frameCounter();
            //this.requestAnimFrame();
            //while(this.framesLimeint)  {
                this.mRenderComponent.getXform().setSize(this.xAmplitude, this.yAmplitude);
                await sleep(this.frequency);
                this.mRenderComponent.getXform().setSize(9, 12);
                await sleep(this.frequency);
/*                 curernt = new Date();
                this.time = curernt.getTime();
                */
                console.log("BBBBBB"); 
            }
            this.oscsalateActive = false;
        }
    }

}

/* async function frameCounter() {
    this.framemes = 0;
    this.framesLimeint = true;
    while(this.framemes != 60) {
        this.framemes++;
    }
    this.framesLimeint = false; 
    return 0;
} */

//Reference: https://www.youtube.com/watch?v=N8ONAZSsx80
async function sleep(seconds) {
    return new Promise((resolve => setTimeout(resolve, seconds)));
}

//https://stackoverflow.com/questions/8279729/calculate-fps-in-canvas-using-requestanimationframe
function requestFrameCount() {

    if(!lastCalledTime) {
       lastCalledTime = Date.now();
       fps = 0;
       return;
    }
    delta = (Date.now() - lastCalledTime)/1000;
    lastCalledTime = Date.now();
    fps = 1/delta;
} 


export default Hero;