"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import Lerp from "../../engine/utils/lerp.js";
import DyePack from "./dye_pack.js";

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

        this.dyePacks = [];
        this.dyePackSpeed = 1;

        this.oscillateW = null;//new Lerp();
        this.oscillateH = null;//new Lerp();

        this.oscillateW = new engine.Oscillate(4.5, this.frequency, this.duration);
        this.oscillateH = new engine.Oscillate(6, this.frequency, this.duration);

    }

    update() {
        if (engine.input.isKeyPressed(engine.input.keys.D)){
            this.slowDown();
        }
        else{
            this.dyePackSpeed = 1;
        }


        if (engine.input.isKeyClicked(engine.input.keys.E)){
            //this.oscillateW.reStart();
            //this.oscillateH.reStart();
        }
        if (!this.oscillateW.done()) {
            let width = this.oscillateW.getNextForAmpl();
            let hight = this.oscillateW.getNextForAmpl();

            this.mRenderComponent.getXform().setSize(width, hight);
        }
    }

    moveHeroToMousePos(x,y) {
        let xform = this.getXform();
        let pos = this.getXform().getPosition();//this.xform().getPosition();

        if(x > pos[0]) {
            xform.incXPosBy(this.kDelta);
        } 
        else if (x < pos[0]){
            xform.incXPosBy(-this.kDelta);   
        }
        else{
            xform.incXPosBy(0);
        }
        if(y > pos[1]) {
            xform.incYPosBy(this.kDelta);
        }
        else if (y < pos[1]){
            xform.incYPosBy(-this.kDelta);
        }
        else{
            xform.incYPosBy(0); 
        }
    }

    async oscsalateHero() {
        this.oscillateW.reStart();
        this.oscillateH.reStart();

/*         if(!this.oscsalateActive) {

            this.oscillateW.reStart();
            this.oscillateH.reStart();

            this.oscsalateActive = true;
            let curernt = new Date();
            this.endTime = curernt.getTime() + this.duration;
            this.time = curernt.getTime(); */
            //console.log(this.time);
            //console.log(this.endTime);

            //let i = 0;
            //while(this.time < this.endTime) 


            //this.oscillateW = new engine.Oscillate(4.5, this.frequency, this.duration);



/* 
            for(let i = 0; i < this.duration; i++) {

                let width = this.oscillateW.getNextForAmpl();
                console.log(width);
    
                //console.log(this.oscillate);q
            //await frameCounter();
            //this.requestAnimFrame();
            //await requestFrameCount(this.framesLimeint);
            //console.log(this.framesLimeint);
            //while(this.framesLimeint)  {
                //this.mRenderComponent.getXform().setSize(this.xAmplitude, this.yAmplitude);
                //this.mRenderComponent.getXform().setSize(this.xAmplitude, this.yAmplitude);
                //await sleep(this.frequency);
                this.mRenderComponent.getXform().setSize(9, 12);
                //await sleep(this.frequency); 
/*                 curernt = new Date();
                this.time = curernt.getTime();
                */
                //console.log("BBBBBB"); 
            //}
            //this.oscsalateActive = false;
 
            
        //}
    }    

    createAByePack(sprite) {
        console.log("aaaaa");
        let dyePack = new DyePack(sprite);
        dyePack.setVisibility(true);
        let xform = dyePack.getXform();

        let pos = this.getXform().getPosition();
        xform.setXPos(pos[0]);
        xform.setYPos(pos[1]);
        let speed = 1;
        this.dyePacks.push(dyePack);
/*         while (true) {
            xform.incXPosBy(speed);
        } */
    }

    slowDown(){
        this.dyePackSpeed -= 0.1;
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
async function requestFrameCount(framesLimeint) {

/*     let curent = new Date();
    let time = curent.getTime();
    let cerentTime = curent.getTime();

    while(cerentTime < time + 60) {



    } */


    for(let i = 0; i < 60;i++) {
/*         if(!this.framesLimeint) {
            this.framesLimeint = true;
        } */
        framesLimeint = true;
        await sleep(0.0166);
        console.log(framesLimeint);
    }
    framesLimeint = false;
    return;


/*     if(!lastCalledTime) {
       lastCalledTime = Date.now();
       fps = 0;
       return;
    }
    delta = (Date.now() - lastCalledTime)/1000;
    lastCalledTime = Date.now();
    fps = 1/delta; */
} 


export default Hero;