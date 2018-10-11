import {forEach} from "./utils/Utils";
import {Task} from "./Task";

export interface CreateScreepTask extends Task{
  mName: 'CST',

}

export interface SpawnRoomManagerData {
  tasks: string[];
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
}
