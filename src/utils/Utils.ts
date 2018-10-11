import {Position} from "../Position";

const allowedChar = "azertyuiopmlkjhgfdsqwxcvbnAZERTYUIOPMLKJHGFDSQWXCVBN1234567890_-";

const roomsTerrain: {[roomName: string]:RoomTerrain} = {};

export function idIntToString(value: number): string{
  let rest = value >> 6;
  if(rest){
    return idIntToString(rest - 1) + allowedChar.charAt(value - (rest << 6) );
  }
  return allowedChar.charAt(value);
}

export function roomNameToRoomTerrin(roomName: string): RoomTerrain {
  return roomsTerrain[roomName] || (roomsTerrain[roomName] =  eval(`new Room.Terrain("${roomName}")`));
}

export function roomToRoomTerrin(room: Room): RoomTerrain {
  return roomNameToRoomTerrin(room.name);
}

export function forEach<T>(object: {[key: string]: T}, callback: (key:string, value: T) => any) {
  for(var prop in object) {
    if(object.hasOwnProperty(prop)) {
      callback(prop, object[prop]);
    }
  }
}

export function dist(pos1: Position, pos2: Position) {
  return Math.max(Math.abs(pos1.x-pos2.x), Math.abs(pos1.y-pos2.y));
}
