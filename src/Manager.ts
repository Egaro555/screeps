import { TaskStatus } from './Task';

export type EMCC = 'EMCC'; // Energie Manager
export type EMC = 'EMC'; // Energie Manager
export type ST = 'ST'; // Serie Manager
export type STC = 'STC'; // Serie Manager
export type EMETC = 'EMETC'; // Extract Manager
export type TMTTC = 'TMTTC'; // Transfer Manager
export type ManagerTaskID = EMC | ST;
export type ManagerTaskCreepID = EMCC | STC | EMETC | TMTTC;
export type ManagerID = ManagerTaskID | ManagerTaskCreepID;
export type ManageCode = TaskStatus;

const managers: {[key: string]: (managable: Managable, ...params: any[]) => ManageCode} = {};

export interface Managable {
	mName: ManagerID;
}

export namespace Manager {
	export function manage(managable: Managable, ...params: any[]): ManageCode {
		return managers[managable.mName](managable, ...params);
	}

	export function addManager(name: ManagerID, manager: (managable: Managable | any, ...params: any[]) => ManageCode): void {
		managers[name] = manager;
	}
}
