import { ErrorMapper } from 'utils/ErrorMapper';
import { BuildManager } from './BuidManager';
import { EnergieManager, EnergieTaskCreep } from './EnergieManager';
import { ExtractManager } from './ExtractManager';
import { EMCC, ManageCode, Manager } from './Manager';
import { Position } from './Position';
import { TaskManager } from './Task';
import { TransferManager } from './TransferManager';
import { forEach } from './utils/Utils';
// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code

const posSpawner: Position[] = [
	{x: 14, y: 20},
	{x: 14, y: 18},
	{x: 14, y: 19}
];

const posSource1: Position[] = [
	{x: 17, y: 17},
	{x: 18, y: 17},
	{x: 19, y: 17}
];

const posControler: Position[] = [
	{x: 12, y: 24},
	{x: 12, y: 25},
	{x: 12, y: 26},
	{x: 12, y: 27},
	{x: 11, y: 27},
	{x: 11, y: 28},
	{x: 11, y: 29},
	{x: 10, y: 29},
	{x: 9, y: 30},
	{x: 11, y: 30},
	{x: 12, y: 30}
];

export const loop = ErrorMapper.wrapLoop(() => {
	// console.log(`Current game tick is ${Game.time}`);

	EnergieManager.init();
	ExtractManager.init();
	TransferManager.init();
	BuildManager.init();

	const source1 = Game.getObjectById('59f1a2ba82100e1594f3a80b') as Source;
	const container1 = Game.getObjectById('5bc635ab0f9d824c96e6dbd5') as StructureContainer;
	const source2 = Game.getObjectById('59f1a2ba82100e1594f3a80a') as Source;
	const spawn = Game.getObjectById('5bbdecec79feed2528316fdd') as StructureSpawn;
	const controller = Game.getObjectById('59f1a2ba82100e1594f3a80c') as StructureController;

	let nbTask1 = 7;
	let nbTask2 = 0;
	const freeCreeps: Creep[] = [];

	let creep: Creep = undefined as any;
	let creep2: Creep = undefined as any;

	let spawnUse = false;
	// Automatically delete memory of missing creeps
	forEach(Memory.creeps, (creepName, mem) => {
		creep2 = creep as any;
		creep = Game.creeps[creepName];
		if (!creep) {
			console.log('creep \'' + creepName + ' die');
			delete Memory.creeps[creepName];
		} else {
			let hasTask = false;
			while (mem.tasks && mem.tasks.length) {
				const currentTask = TaskManager.getTask(mem.tasks[0]);
				if (currentTask) {
					const currentTaskCode: ManageCode = Manager.manage(currentTask, creep);
					if (currentTaskCode === 'ERROR') {
						console.log('ERROR\t[Main] Loop: Task FAILED : ', JSON.stringify({currentTask, creep, currentTaskCode}));
					}
					const finished = currentTaskCode === 'FINISH';
					if (finished && !currentTask.parentId) {
						TaskManager.remove(mem.tasks[0]);
						mem.tasks = mem.tasks.filter((_, i) => i);
					} else {
						if ((currentTask as EnergieTaskCreep).toId === '5bbdecec79feed2528316fdd') nbTask1--;
						if ((currentTask as EnergieTaskCreep).toId === '5bc635ab0f9d824c96e6dbd5') nbTask2--;
						hasTask = true;
						break;
					}
				} else {
					console.log('ERROR\t[Main] Loop: No task : ', JSON.stringify({creepName, mem, creep}));
					mem.tasks = mem.tasks.filter((_, i) => i);
				}
			}
			if (!hasTask && creep.ticksToLive) {

				if (mem.inRefule || creep.ticksToLive < 300) {
					mem.inRefule = true;
					const r = spawn.renewCreep(creep);
					if (!r) {
						spawnUse = true;
						if (creep.ticksToLive >= 1480) {
							Memory.creeps[creep.name].inRefule = false;
							freeCreeps.push(creep);
						}
					} else {
						if (creep.ticksToLive > 1200) {
							Memory.creeps[creep.name].inRefule = false;
							freeCreeps.push(creep);
						} else {
							creep.moveTo(12, 20);
						}
					}

				} else {
					freeCreeps.push(creep);
				}

				// const offsetX = 25;
				// const offsetY = 25;
				// let x:number;
				// let y:number;
				// do {
				//   x = incNoTask1 + offsetX;
				//   y = incNoTask2 * 2 + offsetY;
				//
				//   incNoTask1++;
				//   if (incNoTask1 > 10) {
				//     incNoTask1 = 0;
				//     incNoTask2++;
				//   }
				//
				// }while (creep.moveTo(x,y) === ERR_INVALID_TARGET);
			}

		}
	});

	freeCreeps.forEach((freeCreep) => {
		if (nbTask1 > 0) {
			nbTask1--;
			const task = EnergieManager.createEMCC(freeCreep, source1, spawn);
			Memory.idPosSpawner++;
			if (Memory.idPosSpawner >= posSpawner.length) {
				Memory.idPosSpawner = 0;
			}
			Memory.idPosSource1++;
			if (Memory.idPosSource1 >= posSource1.length) {
				Memory.idPosSource1 = 0;
			}
			task.from = posSource1[Memory.idPosSource1];
			task.to = posSpawner[Memory.idPosSpawner];
			task.toDist = 0;
			task.fromDist = 0;

			Manager.manage(task, freeCreep);

			freeCreep.say('Sp ' + Memory.idPosSource1 + ' ' + Memory.idPosSpawner);
		} else if (nbTask2 > 0) {
			nbTask2--;
			const task = EnergieManager.createEMCC(freeCreep, source1, container1, undefined, true);
			task.from = {x: 19, y: 17};
			task.to = {x: 19, y: 17};
			task.fromDist = 0;
			task.toDist = 0;

			Manager.manage(task, freeCreep);
			freeCreep.say('CONST');
		} else {
			const task = EnergieManager.createEMCC(freeCreep, source2, controller);
			Memory.idPosContoller++;
			if (Memory.idPosContoller >= posControler.length) {
				Memory.idPosContoller = 0;
			}
			task.to = posControler[Memory.idPosContoller];
			task.toDist = 0;

			Manager.manage(task, freeCreep);
			freeCreep.say('Co ' + Memory.idPosContoller);
		}
	});

	spawn.spawnCreep(['work', 'work', 'move', 'carry'], 'c_' + TaskManager.genID());

	if (!creep2.saying) creep2.say(Game.time.toFixed());

});
(loop as any).task1 = (screepName: string) => {
	const id = TaskManager.genID();
	const task: EnergieTaskCreep = {
		id,
		fromDist: 1,
		toDist: 1,
		creepId: screepName,
		mName: 'EMCC',
		status: 'INIT',
		fromId: '59f1a2ba82100e1594f3a80b',
		from: {
			x: 18,
			y: 18
		},
		to: {
			x: 13,
			y: 19
		},
		toId: '5bbdecec79feed2528316fdd',
		infinity: true
	};
	Memory.creeps[screepName].tasks = [id];
	TaskManager.save(task);
};

(loop as any).task2 = (screepName: string) => {
	const id = TaskManager.genID();
	const task: EnergieTaskCreep = {
		id,
		fromDist: 1,
		toDist: 1,
		creepId: screepName,
		mName: 'EMCC',
		status: 'INIT',
		fromId: '59f1a2ba82100e1594f3a80b',
		from: {
			x: 18,
			y: 18
		},
		to: {
			x: 9,
			y: 27
		},
		toId: '59f1a2ba82100e1594f3a80c',
		infinity: true
	};
	Memory.creeps[screepName].tasks = [id];
	TaskManager.save(task);
};

(loop as any).task3 = (screepName: string) => {
	const id = TaskManager.genID();
	const task: EnergieTaskCreep = {
		id,
		fromDist: 1,
		toDist: 1,
		creepId: screepName,
		mName: 'EMCC',
		status: 'INIT',
		fromId: '59f1a2ba82100e1594f3a80b',
		from: {
			x: 18,
			y: 18
		},
		to: {
			x: 26,
			y: 25
		},
		toId: '5bbe413d76ef80373a3290ba',
		qte: 45
	};
	Memory.creeps[screepName].tasks = [id];
	TaskManager.save(task);
};

(loop as any).clearStorage = () => {
	Object.keys(Memory).forEach((k) => {
		delete Memory[k];
	});
	Memory.creeps = {};
	Memory.flags = {};
	Memory.rooms = {};
	Memory.spawns = {};
};
