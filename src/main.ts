import { ErrorMapper } from "utils/ErrorMapper";
import {TaskManager} from "./Task";
import {ManageCode, Manager} from "./Manager";
import {EnergieManager} from "./EnergieManager";

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
