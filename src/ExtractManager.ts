import { EMETC, ManageCode, Manager } from './Manager';
import { CreepTask } from './Task';
import { Logger } from './utils/Logger';

class BuildManagerData {
}

export interface ExtractTaskCreep extends CreepTask {
	mName: EMETC;
	resourceId: string;
	qte?: number;
	initQte?: number;
}

export namespace ExtractManager {
	export const data: BuildManagerData = Memory.BuildManager || {};

	export function manageEMETC(task: ExtractTaskCreep, creep: Creep): ManageCode {
		if (task.qte) {
			if (task.initQte === undefined) task.initQte = creep.carry.energy;
			const qteToExtract = task.qte + task.initQte - creep.carry.energy;
			if (qteToExtract <= 0) return task.status = 'FINISH';
			const struct = Game.getObjectById(task.resourceId) as Source | Mineral;
			const res = creep.harvest(struct);
			switch (res) {
				case 0:
					return task.status = 'WIP';
				// case ERR_NOT_OWNER:
				// case ERR_BUSY:
				// case ERR_NOT_FOUND:
				// case ERR_NOT_ENOUGH_RESOURCES:
				// case ERR_INVALID_TARGET:
				// case ERR_NOT_IN_RANGE:
				// case ERR_TIRED:
				// case ERR_NO_BODYPART:
				default:
					Logger.log('ERROR', 'BuildManager', 'manageEMETC', "Harvest failed");
					Logger.logObj('ERROR', 'BuildManager', 'manageEMETC', {struct, res, task, creep});
					return task.status = 'ERROR';

			}
		} else {
			if (creep.carryCapacity === creep.carry.energy) return task.status = 'FINISH';
			const struct = Game.getObjectById(task.resourceId) as Source | Mineral;
			const res = creep.harvest(struct);
			switch (res) {
				case 0:
					return task.status = 'WIP';
				// case ERR_NOT_OWNER:
				// case ERR_BUSY:
				// case ERR_NOT_FOUND:
				// case ERR_NOT_ENOUGH_RESOURCES:
				// case ERR_INVALID_TARGET:
				// case ERR_NOT_IN_RANGE:
				// case ERR_TIRED:
				// case ERR_NO_BODYPART:
				default:
					Logger.log('ERROR', 'BuildManager', 'manageEMETC', "Harvest failed");
					Logger.logObj('ERROR', 'BuildManager', 'manageEMETC', {struct, res, task, creep});
					return task.status = 'ERROR';

			}
		}
	}

	export function init(): void {
		Manager.addManager('EMETC', manageEMETC);
	}
}
