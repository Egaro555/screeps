import {forEach} from "./utils/Utils";
import {Task} from "./Task";
type CST_INIT = 1;
type CreateScreepTaskStep = CST_INIT;

export interface CreateScreepTask extends Task{
  mName: 'CST',
  cost: number,
  step: CreateScreepTaskStep,
  name: string,
  body: string,
  priority: number,
}

export interface SpawnRoomManagerData {
  tasks: string[];
  currentTask ?: string;
}

export interface SpawnManagerData {
  rooms:{[name: string]: SpawnRoomManagerData};
}

export namespace SpawnManager {
  export const data: SpawnManagerData = Memory.SpawnManager || {rooms:{}};

  export function compute() {
    const spawns = Game.spawns;
    forEach(spawns, (spawnName, spawn)=>{
      if(!data.rooms[spawnName])data.rooms[spawnName] = {tasks: []}
    })
  }

  function manageCST(task: CreateScreepTask){

  }

}
