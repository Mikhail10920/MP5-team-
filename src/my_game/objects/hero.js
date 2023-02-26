"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../../engine/index.js";
import DyePack from "./dye_pack.js";
import DyePackSet from "./dye_pack_set.js";

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

        this.dyePacks = new DyePackSet();

        this.oscillateW = new engine.Oscillate(4.5, this.frequency, this.duration);
        this.oscillateH = new engine.Oscillate(6, this.frequency, this.duration);

        this.lerpX = new engine.Lerp(0, 120, 0.05);
        this.lerpY = new engine.Lerp(0, 120, 0.05);



        this.moveVec = [0,0];

        this.mousePos = [0,0];


        this.xDist = 0;
        this.yDist = 0;
    }

    update() {
        // control by WASD
        let xform = this.getXform();
        
        for (let i = 0; i < this.dyePacks.size(); i++){
            this.dyePacks.getObjectAt(i).update();  
        }

        //User Input DyePack Slowdown
        if (engine.input.isKeyPressed(engine.input.keys.D)){
            for (let i = 0; i < this.dyePacks.size(); i++){
                this.dyePackSlowdown(i);
                //console.log("LLLLLLLLLLL");
            }
        }

        //User Input DyePack Hit
        if (engine.input.isKeyClicked(engine.input.keys.S)){
            for (let i = 0; i < this.dyePacks.size(); i++){
                this.dyePackHit(i);
            }
        }

        //DyePack Termination: Slowdown
        for (let i = 0; i < this.dyePacks.size(); i++){
            if (this.dyePacks.getObjectAt(i).kDelta <= .1){
                this.dyePacks.removeFromSet(this.dyePacks.getObjectAt(i));
                //Move everything in front of dyePacks[i] back one space
                //for (let j = i; j < this.dyePacks.size()-1; j++){
                //    this.dyePacks[j] = this.dyePacks[j + 1];
                //}
                //Delete last member of dyePacks
                //delete(this.dyePacks[this.dyePacks.length - 1]);
            }
        }

        //DyePack Termination: Time
        for (let i = 0; i < this.dyePacks.size(); i++){
            if (this.dyePacks.getObjectAt(i).getTime() >= 300){
                this.dyePacks.removeFromSet(this.dyePacks.getObjectAt(i));
            }
        }

        //DyePack Termination: Bounds
        for (let i = 0; i < this.dyePacks.size(); i++){
            if (this.dyePacks.getObjectAt(i).getXform().getXPos() > 180){
                this.dyePacks.removeFromSet(this.dyePacks.getObjectAt(i));
            }
        }
        this.oscsalateHeroUpdate();

        this.lerpStUp(this.mousePos[0], this.mousePos[1]);

        //this.lerpMovement();

    }

    lerpStUp(xMouse, yMouse) {

        let xPos = this.getXform().getXPos();
        let yPos = this.getXform().getYPos();

        this.xDist = (xMouse - xPos);
        this.yDist = (yMouse - yPos);

        //console.log(this.xDist, this.yDist);


        this.lerpX.setCurentValue(this.getXform().getXPos());
        this.lerpY.setCurentValue(this.getXform().getYPos());

        this.lerpX.setFinal(this.xDist + this.getXform().getXPos());
        this.lerpY.setFinal(this.yDist + this.getXform().getYPos());

        

    }

    lerpMovement(xMouse,yMouse) {
        let xform = this.getXform();
        let pos = this.getXform().getXPos();


        if(!this.lerpX.done()) {

            this.lerpX.update();
            var x = this.lerpX.get();

            this.lerpY.update();
            var y = this.lerpY.get();


            xform.setXPos(x);
            xform.setYPos(y);
            //console.log("LLLLLLLLLLL");
        }
        else {
            //this.lerpX.setFinal(3);
        }
    }

    oscsalateHeroUpdate() {
        if (!this.oscillateW.done()) {
            let width = this.oscillateW.getNextForAmpl();
            let hight = this.oscillateW.getNextForAmpl();

            this.mRenderComponent.getXform().setSize(width, hight);
        }
    }

    dyePackSlowdown(index){
        this.dyePacks.getObjectAt(index).slowDown();
    }

    dyePackHit(index){
        this.dyePacks.getObjectAt(index).hit();
    }

    moveHeroToMousePos(x,y) {
        let xform = this.getXform();
        let pos = this.getXform().getPosition();//this.xform().getPosition();

    }

    async oscsalateHero() {
        this.oscillateW.reStart();
        this.oscillateH.reStart();
    }  

    createAByePack(sprite) {
        let dyePack = new DyePack(sprite);
        dyePack.setVisibility(true);
        let xform = dyePack.getXform();

        let pos = this.getXform().getPosition();
        xform.setXPos(pos[0]);
        xform.setYPos(pos[1] + 3);
        this.dyePacks.addToSet(dyePack);
    }

    drawPyePacks(camera) {
        //console.log(this.dyePacks);
        for(let i = 0; i < this.dyePacks.size(); i++) {
            this.dyePacks.getObjectAt(i).draw(camera);
            //let xpos = this.mHero.dyePacks[i].getXform();
            //this.xpos.incXPosBy(this.mHero.dyePackSpeed);
            this.dyePacks.getObjectAt(i).getXform().incXPosBy(this.dyePacks.getObjectAt(i).kDelta);
        }
    }



    getVectore(xMouse, yMouse) {

        this.mousePos = [xMouse, yMouse];

        let xPos = this.getXform().getXPos();
        let yPos = this.getXform().getYPos();

        let length = (Math.sqrt(Math.pow((xMouse - xPos), 2) + Math.pow(yMouse - yPos, 2)));

        //console.log(xMouse, yMouse, xPos, yPos);
        this.xDist = (xMouse - xPos);
        this.yDist = (yMouse - yPos);
        //console.log(this.xDist, this.yDist);
        this.moveVec = [(xMouse - xPos) / length, (yMouse - yPos) / length];



        //console.log(this.moveVec);
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
}
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
        //console.log(framesLimeint);
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