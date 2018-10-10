import {Managable, ManageCode, Manager} from "./Manager";
import {error} from "util";
import {CreepTask, Task} from "./Task";
import {Position} from "./Position";

export interface EnergieTaskCreep extends CreepTask{
  mName: 'EMCC';
  step?: number;
  from: Position;
  fromId: string;
  to: Position;
  toId: string;
  qte?: number;
  infinity?: boolean;
  qteCharged?: number;
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
    let targetQte;
    switch (task.step) {
      case undefined:
        targetQte = task.qte || creep.carryCapacity;
        if(targetQte <= creep.carry.energy){
          task.step = 2;
          task.qteCharged = creep.carry.energy;
          return "WIP";
        }
        task.step = 0;
      case 0:
        if(!(creep.room.getPositionAt(task.from.x, task.from.y) as RoomPosition).isNearTo(creep)){
          creep.moveTo(task.from.x, task.from.y);
          return "WIP";
        }
        task.step = 1;
      case 1:
        targetQte = task.qte || creep.carryCapacity;
        if(creep.carry.energy < targetQte){
          const source = Game.getObjectById(task.fromId) as Source;
          creep.harvest(source);
          return "WIP";
        }
        task.step = 2;
        task.qteCharged = creep.carry.energy;
      case 2:
        if(!(creep.room.getPositionAt(task.to.x, task.to.y) as RoomPosition).isNearTo(creep)){
          creep.moveTo(task.to.x, task.to.y);
          return "WIP";
        }
        task.step = 3;
      case 3:
        const target = Game.getObjectById(task.toId) as Structure|Creep;
        targetQte = task.qte || creep.carryCapacity;
        while(task.qteCharged as number - creep.carry.energy < targetQte){
          let err = creep.transfer(target, RESOURCE_ENERGY, targetQte - (task.qteCharged as number) + creep.carry.energy);
          if(err === -8) err = creep.transfer(target, RESOURCE_ENERGY);
          if(err === -8) return "WIP";
          if(err){
            console.log('ERROR', err);
            return 'ERROR';
          }
          return 'WIP';
        }
        task.step = 4;
        if(task.infinity){
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

