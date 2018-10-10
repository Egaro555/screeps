import {Managable, ManageCode, Manager} from "./Manager";
import {error} from "util";
import {CreepTask, Task} from "./Task";
import {Position} from "./Position";

export interface EnergieTaskCreep extends CreepTask{
  mName: 'EMCC';
  step?: number;
  from: Position;
  to: Position;
  qte?: number;
  loop?: boolean;
}

export interface EnergieTask extends Task{
  mName: 'EMC';
  dest: Position;
  qte: number;
  qteSuccess: number;
  qteInProgress: number;
}


export interface EnergieManagerData{

}

export namespace EnergieManager {
  export const data: EnergieManagerData = Memory.EnergieManager || {};

  function manageEMCC(task: EnergieTaskCreep, creep: Creep): ManageCode {

    switch (task.step) {
      case 0:
        if(!(creep.room.getPositionAt(task.from.x, task.from.y) as RoomPosition).isNearTo(creep)){
          creep.moveTo(task.from.x, task.from.y);
          return "WIP";
        }
        task.step = 1;
      case 1:
        let targetQte = task.qte || creep.carryCapacity;
        if(creep.carry.energy < targetQte){
          const source = creep.room.find(FIND_SOURCES).filter(source => source.pos.x === task.from.x && source.pos.y === task.from.y)[0];
          creep.harvest(source);
          return "WIP";
        }
        task.step = 2;
      case 2:
        if(!(creep.room.getPositionAt(task.to.x, task.to.y) as RoomPosition).isNearTo(creep)){
          creep.moveTo(task.to.x, task.to.y);
          return "WIP";
        }
        task.step = 3;
      case 3:
        const structure = creep.room.find(FIND_MY_STRUCTURES).filter(source => source.pos.x === task.from.x && source.pos.y === task.from.y)[0];
        if(creep.transfer(structure, "energy", task.qte))return 'ERROR';
        task.step = 4;
        if(task.loop){
          task.step = 0;
        }
        return "WIP";
      case 4:
        return 'FINISH';
    }
    return 'ERROR';
  }

  function manageEMC(): ManageCode {
    return 'ERROR';
  }

  export function init() {
    Manager.addManager("EMCC", manageEMCC as any);

  }
}

