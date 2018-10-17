import {idIntToString} from "./utils/Utils";
import {Managable} from "./Manager";
export type TaskStatus = 'INIT' | 'WIP' | 'ERROR' | 'WAIT' | 'FINISH' | 'WAIT_CHILDREN';
export type TaskID = string;

export interface Task extends Managable{
  id : TaskID;
  status: TaskStatus
  parentId?: TaskID;
  childrensId?: TaskID[];
}

export interface CreepTask extends Task{
  creepId: string;
}

export namespace TaskManager{

  if(!Memory.idTaskInc) Memory.idTaskInc = 1;
  if(!Memory.TaskManager) Memory.TaskManager = { tasks:{}};

  export function genID(): TaskID{
    return idIntToString(Memory.idTaskInc ++);
  }

  export function getTask(id: TaskID): Task {
    return Memory.TaskManager.tasks[id];
  }

  export function save(task: Task) {
    // console.log("save", task.id);
    Memory.TaskManager.tasks[task.id] = task;
  }

  export function remove(id: TaskID) {
    Memory.TaskManager.tasks[id] = undefined;
  }
}
