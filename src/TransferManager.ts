import { ManageCode, Manager, TMTTC } from './Manager';
import { CreepTask } from './Task';
import { Logger } from './utils/Logger';

class BuildManagerData {
}

export interface TranferTaskCreep extends CreepTask {
	mName: TMTTC;
	destId: string;
	qte?: number;
	ressource: ResourceConstant;
	initQte?: number;
}

export namespace TransferManager {
	export const data: BuildManagerData = Memory.BuildManager || {};

	export function manageTMTTC(task: TranferTaskCreep, creep: Creep): ManageCode {
		if (task.qte) {
			if (task.initQte === undefined) task.initQte = creep.carry[task.ressource] as number;
			const qteToTranfer = creep.carry[task.ressource] as number - task.initQte + task.qte;
			if (qteToTranfer <= 0) return task.status = 'FINISH';
			const dest = Game.getObjectById(task.destId) as Creep | Structure;
			const res = creep.transfer(dest, task.ressource, qteToTranfer);
			switch (res) {
				case 0:
					return task.status = 'WIP';
				// case ERR_NOT_OWNER:
				// case ERR_BUSY:
				// case ERR_NOT_ENOUGH_RESOURCES:
				// case ERR_INVALID_TARGET:
				// case ERR_FULL:
				// case ERR_NOT_IN_RANGE:
				// case ERR_INVALID_ARGS:
				default:
					Logger.log('ERROR', 'TransferManager', 'manageTMTTC', 'Harvest failed');
					Logger.logObj('ERROR', 'TransferManager', 'manageTMTTC', {dest, res, task, creep});
					return task.status = 'ERROR';

			}
		} else {
			if (creep.carryCapacity === creep.carry.energy) return task.status = 'FINISH';
			const dest = Game.getObjectById(task.destId) as Creep | Structure;
			const res = creep.transfer(dest, task.ressource);
			switch (res) {
				case 0:
					return task.status = 'WIP';
				// case ERR_NOT_OWNER:
				// case ERR_BUSY:
				// case ERR_NOT_ENOUGH_RESOURCES:
				// case ERR_INVALID_TARGET:
				// case ERR_FULL:
				// case ERR_NOT_IN_RANGE:
				// case ERR_INVALID_ARGS:
				default:
					Logger.log('ERROR', 'TransferManager', 'manageTMTTC', 'Harvest failed');
					Logger.logObj('ERROR', 'TransferManager', 'manageTMTTC', {dest, res, task, creep});
					return task.status = 'ERROR';

			}
		}
	}

	export function init(): void {
		Manager.addManager('TMTTC', manageTMTTC);
	}
}
