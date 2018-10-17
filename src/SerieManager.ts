import { ManageCode, Manager, ST, STC } from './Manager';
import { CreepTask, Task, TaskManager } from './Task';

class SerieManagerData {
}

export interface SerieTask extends Task {
	mName: ST | STC;
	loop?: boolean;
	currentIndexTask: number;
	removeFinishedTask?: boolean;
	childrensId: string[];
}

export interface SerieTaskCreep extends CreepTask, SerieTask {
	mName: STC;
	childrensId: string[];
}

export namespace SerieManager {
	export const data: SerieManagerData = Memory.BuildManager || {};

	export function createST(tasks: Task[], type: 'default' | 'loop' | 'autoDelete'): SerieTask {
		const res = {
			mName: 'ST',
			loop: type === 'loop',
			currentIndexTask: 0,
			id: TaskManager.genID(),
			childrensId: tasks.map((task) => task.id),
			removeFinishedTask: type === 'autoDelete'

		}as SerieTask;
		tasks.forEach((task) => task.parentId = res.id);
		TaskManager.save(res);
		return res;
	}

	export function createSTC(creepId: string, tasks: CreepTask[], type: 'default' | 'loop' | 'autoDelete'): SerieTaskCreep {
		const res = {
			mName: 'STC',
			loop: type === 'loop',
			creepId,
			currentIndexTask: 0,
			id: TaskManager.genID(),
			childrensId: tasks.map((task) => task.id),
			removeFinishedTask: type === 'autoDelete'

		}as SerieTaskCreep;
		tasks.forEach((task) => {
			task.parentId = res.id;
			task.creepId = creepId;
		});
		TaskManager.save(res);
		return res;
	}

	export function manageST(task: SerieTask, ...params: any[]): ManageCode {
		if (task.currentIndexTask >= task.childrensId.length) return 'FINISH';
		let code: ManageCode;
		let subTask = TaskManager.getTask(task.childrensId[task.currentIndexTask]);
		code = Manager.manage(subTask);
		while (code === 'FINISH') {
			if (task.removeFinishedTask) {
				TaskManager.remove(subTask.id);
				task.childrensId = task.childrensId.filter((_, index) => index !== task.currentIndexTask);
				if (!task.childrensId.length) return 'FINISH';
			} else {
				task.currentIndexTask++;
				if (task.currentIndexTask >= task.childrensId.length) {
					if (task.loop) {
						return 'FINISH';
					} else {
						task.currentIndexTask = 0;
					}
				}
			}
			subTask = TaskManager.getTask(task.childrensId[task.currentIndexTask]);
			code = Manager.manage(subTask);
		}
		return code;
	}

	export function manageSTC(task: SerieTaskCreep, creep: Creep): ManageCode {
		return manageST(task, creep);
	}

	export function init(): void {
		Manager.addManager('ST', manageST);
		Manager.addManager('STC', manageSTC);
	}
}
