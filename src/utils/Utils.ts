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
