import { ErrorMapper } from "utils/ErrorMapper";
import {Task, TaskManager} from "./Task";
import {ManageCode, Manager} from "./Manager";
import {EnergieManager, EnergieTaskCreep} from "./EnergieManager";
import {Position} from "./Position";
import {spawn} from "child_process";
// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code

const posSpawner : Position[]= [
  {x:14, y:20},
  {x:14, y:18},
  {x:14, y:19},
];


const posSource1 : Position[]= [
  {x:17, y:17},
  {x:18, y:17},
  {x:19, y:17},
];

const posControler : Position[]= [
  {x:12, y:24},
  {x:12, y:25},
  {x:12, y:26},
  {x:12, y:27},
  {x:11, y:27},
  {x:11, y:28},
  {x:11, y:29},
  {x:10, y:29},
  {x:9, y:30},
  {x:11, y:30},
  {x:12, y:30},
];

export const loop = ErrorMapper.wrapLoop(() => {
  // console.log(`Current game tick is ${Game.time}`);

  EnergieManager.init();

  const source1 = Game.getObjectById("59f1a2ba82100e1594f3a80b") as Source;
  const source2 = Game.getObjectById("59f1a2ba82100e1594f3a80a") as Source;
  const spawn = Game.getObjectById("5bbdecec79feed2528316fdd") as StructureSpawn;
  const controller = Game.getObjectById('59f1a2ba82100e1594f3a80c') as StructureController;

  let incNoTask1 = 0;
  let incNoTask2 = 0;

  let nbTask1 = 7;
  let freeCreeps = [];


  let creep: Creep = undefined as any;
  let creep_2: Creep = undefined as any;
  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    creep_2 = creep as any;
    creep = Game.creeps[name];
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
          if((currentTask as EnergieTaskCreep).toId === '5bbdecec79feed2528316fdd') nbTask1--;
          hasTask = true;
          break;
        }
      }
      if(!hasTask){

        if(creep.ticksToLive && creep.ticksToLive < 200){
          delete Memory.creeps[creep.name];
          creep.suicide();
        }else {
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
  }

  freeCreeps.forEach((creep)=>{
    if(nbTask1>0){
      nbTask1--;
      const task = EnergieManager.createEMCC(creep, source1, spawn);
      Memory.idPosSpawner++;
      if(Memory.idPosSpawner >= posSpawner.length){
        Memory.idPosSpawner=0;
      }
      Memory.idPosSource1++;
      if(Memory.idPosSource1 >= posSource1.length){
        Memory.idPosSource1=0;
      }
      task.from = posSource1[Memory.idPosSource1];
      task.to = posSpawner[Memory.idPosSpawner];
      task.toDist = 0;
      task.fromDist = 0;

      Manager.manage(task, creep);

      creep.say("Sp "+Memory.idPosSource1+" "+Memory.idPosSpawner);
    }else{
      const task = EnergieManager.createEMCC(creep, source2, controller);
      Memory.idPosContoller ++;
      if(Memory.idPosContoller >= posControler.length){
        Memory.idPosContoller = 0;
      }
      task.to = posControler[Memory.idPosContoller];
      task.toDist = 0;

      Manager.manage(task, creep);
      creep.say("Co "+Memory.idPosContoller);
    }
  });


  spawn.spawnCreep(["work","work","move","carry"], "c_" + TaskManager.genID());


  // @ts-ignore
  if(!creep_2.saying)creep_2.say(Game.time);

});
(loop as any).task1 = (screepName: string)=> {
  const id = TaskManager.genID();
  const task: EnergieTaskCreep = {
    id,
    fromDist: 1,
    toDist: 1,
    creepId: screepName,
    mName: "EMCC",
    status: "INIT",
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
    fromDist: 1,
    toDist: 1,
    creepId: screepName,
    mName: "EMCC",
    status: "INIT",
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
    fromDist: 1,
    toDist: 1,
    creepId: screepName,
    mName: "EMCC",
    status: "INIT",
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
(loop as any).clearStorage = () => {
  Object.keys(Memory).forEach((k)=>{
    delete Memory[k];
  });
  Memory.creeps = {};
  Memory.flags = {};
  Memory.rooms = {};
  Memory.spawns = {};
};



