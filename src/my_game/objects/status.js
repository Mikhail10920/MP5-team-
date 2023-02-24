
import engine from "../../engine/index.js";

class Status { //extends engine.GameObject {
    constructor() {
        this.numberOfPatrule = 0;
        this.numberOfDyePacksSpawned = 0;
        this.stateOfAutoSpawn = false;
    }

    chengeNumOfPatr(num) {
        this.numberOfPatrule += num;
    }

    chengeNumOfDyePacks(num) {
        this.numberOfDyePacksSpawned += num;
    }

    chengeStateOfAutoSpawn(state) {
        this.stateOfAutoSpawn = state;
    }

    getNumOfPatr() {
        return this.numberOfPatrule;
    }

    getNumbOfDyePacks() {
        return this.numberOfDyePacksSpawned;
    }

    getStateOfAutoSpawn() {
        return this.stateOfAutoSpawn;
    }
}

export default Status;