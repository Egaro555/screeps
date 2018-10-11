import {idIntToString} from "./utils/Utils";
import {Managable} from "./Manager";
export type TaskStatus = 'INIT' | 'WIP' | 'ERROR' | 'WAIT' | 'FINISH' | 'WAIT_CHILDREN';

export interface Task extends Managable{
  id : string;
  status: TaskStatus
  parentId?: string;
  childrenId?: string[];
}

export interface CreepTask extends Task{
  creepId: string;
}

export namespace TaskManager{

  if(!Memory.idTaskInc) Memory.idTaskInc = 1;
  if(!Memory.TaskManager) Memory.TaskManager = { tasks:{}};

  export function genID(): string{
    return idIntToString(Memory.idTaskInc ++);
  }

  export function getTask(id: string): Task {
    return Memory.TaskManager.tasks[id];
  }

  export function save(task: Task) {
    console.log("save", task.id);
    Memory.TaskManager.tasks[task.id] = task;
  }

  export function remove(id: string) {
    Memory.TaskManager.tasks[id] = undefined;
  }
}
