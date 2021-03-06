import { ManageCode, Manager } from './Manager';
import { CreepTask } from './Task';

class BuildManagerData {
}

export interface BuildTaskCreep extends CreepTask {
	mName: 'BMBC';
	toId: string;
}

export namespace BuildManager {
	export const data: BuildManagerData = Memory.BuildManager || {};

	export function manageBMBC(task: BuildTaskCreep, creep: Creep): ManageCode {
		const buildCode = creep.build(Game.getObjectById(task.toId) as ConstructionSite);
		// console.log("INFO\t[BuildManager] BuildManager() : ", JSON.stringify({task,creep, buildCode}));
		switch (buildCode) {
			case OK:
				return 'WIP';
			case ERR_NOT_ENOUGH_ENERGY:
				return 'FINISH';
			default:
				console.log('ERROR\t[BuildManager] BuildManager() : ', JSON.stringify({task, creep, buildCode}));
				return 'ERROR';

		}
	}

	export function init(): void {
		Manager.addManager('BMBC', manageBMBC);
	}
}
