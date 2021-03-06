import { Position } from '../Position';

const allowedChar = 'azertyuiopmlkjhgfdsqwxcvbnAZERTYUIOPMLKJHGFDSQWXCVBN1234567890_-';

const roomsTerrain: {[roomName: string]: RoomTerrain} = {};

export function idIntToString(value: number): string {
	const rest = value >> 6;
	if (rest) {
		return idIntToString(rest - 1) + allowedChar.charAt(value - (rest << 6));
	}
	return allowedChar.charAt(value);
}

export function roomNameToRoomTerrin(roomName: string): RoomTerrain {
	// noinspection TsLint
	// @ts-ignore
	return roomsTerrain[roomName] || (roomsTerrain[roomName] = new Room.Terrain(roomName));
}

export function roomToRoomTerrin(room: Room): RoomTerrain {
	return roomNameToRoomTerrin(room.name);
}

export function forEach<T>(object: {[key: string]: T}, callback: (key: string, value: T) => any): void {
	for (const prop in object) {
		if (object.hasOwnProperty(prop)) {
			callback(prop, object[prop]);
		}
	}
}

export function dist(pos1: Position, pos2: Position): number {
	return Math.max(Math.abs(pos1.x - pos2.x), Math.abs(pos1.y - pos2.y));
}
