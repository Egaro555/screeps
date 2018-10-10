import { ErrorMapper } from "utils/ErrorMapper";
import {TaskManager} from "./Task";
import {ManageCode, Manager} from "./Manager";
import {EnergieManager, EnergieTaskCreep} from "./EnergieManager";
// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  // console.log(`Current game tick is ${Game.time}`);

  EnergieManager.init();

  let incNoTask1 = 0;
  let incNoTask2 = 0;

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    const creep = Game.creeps[name];
    if(!creep){
      console.log("creep '"+name+" die");
      delete Memory.creeps[name];
    }else{
      const mem = creep.memory as CreepMemory;
      let hasTask = false;
      while(mem.tasks && mem.tasks.length){
        const currentTask = TaskManager.getTask(mem.tasks[0]);
        const currentTaskCode: ManageCode = Manager.manage(currentTask, creep);
        const finished = currentTaskCode === "FINISH";
        if(finished && !currentTask.parentId){
          TaskManager.remove(mem.tasks[0])
          mem.tasks = mem.tasks.filter((_,i)=>i);
        } else {
          hasTask = true;
          break;
        }
      }
      if(!hasTask){
        const offsetX = 25;
        const offsetY = 25;
        let x:number;
        let y:number;
        do {
          x = incNoTask1 + offsetX;
          y = incNoTask2 * 2 + offsetY;

          incNoTask1++;
          if (incNoTask1 > 10) {
            incNoTask1 = 0;
            incNoTask2++;
          }

        }while (creep.moveTo(x,y) === ERR_INVALID_TARGET);
      }

    }

  }

});
(loop as any).task1 = (screepName: string)=> {
  const id = TaskManager.genID();
  const task: EnergieTaskCreep = {
    id,
    creepId: screepName,
    mName: "EMCC",
    fromId: "59f1a2ba82100e1594f3a80b",
    "from": {
      "x": 18,
      "y": 18
    },
    "to": {
      "x": 13,
      "y": 19
    },
    toId: "5bbdecec79feed2528316fdd",
    "infinity": true
  };
  Memory.creeps[screepName].tasks = [id];
  TaskManager.save(task)
};

(loop as any).task2 = (screepName: string) => {
  const id = TaskManager.genID();
  const task: EnergieTaskCreep = {
    id,
    creepId: screepName,
    mName: "EMCC",
    fromId: "59f1a2ba82100e1594f3a80b",
    "from": {
      "x": 18,
      "y": 18
    },
    "to": {
      "x": 9,
      "y": 27
    },
    toId: "59f1a2ba82100e1594f3a80c",
    "infinity": true
  };
  Memory.creeps[screepName].tasks = [id];
  TaskManager.save(task)
};

(loop as any).task3 = (screepName: string) => {
  const id = TaskManager.genID();
  const task: EnergieTaskCreep = {
    id,
    creepId: screepName,
    mName: "EMCC",
    fromId: "59f1a2ba82100e1594f3a80b",
    "from": {
      "x": 18,
      "y": 18
    },
    "to": {
      "x": 26,
      "y": 25
    },
    toId: "5bbe413d76ef80373a3290ba",
    qte: 45
  };
  Memory.creeps[screepName].tasks = [id];
  TaskManager.save(task)
};



