import {forEach} from "./utils/Utils";

export interface SpawnRoomManagerData {
  nbCreeps: number;
}

export interface SpawnManagerData {
  rooms:{[name: string]: SpawnRoomManagerData};
}

export namespace SpawnManager {
  export const data: SpawnManagerData = Memory.SpawnManager || {rooms:{}};

  export function compute() {
    forEach(Game.rooms, (roomName, room)=>{
      let spawn;
      if(spawn = room.find(FIND_MY_SPAWNS)[0]){

      }
    });
  }
}
