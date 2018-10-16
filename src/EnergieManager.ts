import {Managable, ManageCode, Manager} from "./Manager";
import {error} from "util";
import {CreepTask, Task, TaskManager} from "./Task";
import {Position} from "./Position";
import {dist} from "./utils/Utils";

export interface EnergieTaskCreep extends CreepTask {
  fromDist: number;
  toDist: number;
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

export interface EnergieTask extends Task {
  mName: 'EMC';
  to: Position;
  toId: string;
  qte: number;
  qteSuccess: number;
  qteInProgress: number;
}


export interface EnergieManagerData {
  creepsBuild: string[];
  creepsCarrier: string[];

}

export namespace EnergieManager {
  export const data: EnergieManagerData = Memory.EnergieManager || {};

  export function createEMCC(creep: Creep, from: Creep | Source, to: Creep | Source | Structure, qte?: number, infinity?: boolean): EnergieTaskCreep {
    const id = TaskManager.genID();
    if (!creep.memory.tasks) creep.memory.tasks = [];
    creep.memory.tasks.push(id);
    const task = {
      id,
      fromDist: 1,
      toDist: 1,
      status: "INIT",
      creepId: creep.id,
      mName: "EMCC",
      fromId: from.id,
      from: from.pos,
      toId: to.id,
      to: to.pos,
      infinity,
      qte
    } as EnergieTaskCreep;

    TaskManager.save(task);
    return task;
  }

  function manageEMCC(task: EnergieTaskCreep, creep: Creep): ManageCode {
    let targetQte;
    switch (task.step) {
      case undefined:
        targetQte = task.qte || creep.carryCapacity;
        if (targetQte <= creep.carry.energy) {
          task.step = 2;
          task.qteCharged = creep.carry.energy;
          return task.status = "WIP";
        }
        task.step = 0;
      case 0:
        if (dist(task.from,creep.pos) > task.fromDist) {
          creep.moveTo(task.from.x, task.from.y);
          return task.status = "WIP";
        }
        task.step = 1;
      case 1:
        targetQte = task.qte || creep.carryCapacity;
        if (creep.carry.energy < targetQte) {
          const source = Game.getObjectById(task.fromId) as Source;
          creep.harvest(source);
          return task.status = "WIP";
        }
        task.step = 2;
        task.qteCharged = creep.carry.energy;
      case 2:
        if (dist(task.to,creep.pos) > task.toDist) {
          creep.moveTo(task.to.x, task.to.y);
          return task.status = "WIP";
        }
        task.step = 3;
      case 3:
        const target = Game.getObjectById(task.toId) as Structure | Creep;
        targetQte = task.qte || creep.carryCapacity;
        if (task.qteCharged as number - creep.carry.energy < targetQte) {
          let err = creep.transfer(target, RESOURCE_ENERGY, targetQte - (task.qteCharged as number) + creep.carry.energy);
          if (err === -8) err = creep.transfer(target, RESOURCE_ENERGY);
          if (err === -8) {
            return task.status = "WIP";
          }
          if (err) {
            console.log('ERROR', err);
            return task.status = 'ERROR';
          }
          return task.status = 'WIP';
        }
        task.step = 4;
        if (task.infinity) {
          task.step = 0;
        }
        return task.status = "WIP";
      case 4:
        return task.status = 'FINISH';
    }
    return task.status = 'ERROR';
  }

  function manageEMC(): ManageCode {
    return 'ERROR';
  }

  export function init() {

    Manager.addManager("EMCC", manageEMCC as any);

  }
}

