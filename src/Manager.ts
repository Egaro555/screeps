export type ManageCode = 'ERROR' | 'WIP' | 'FINISH';

const managers: {[key: string]: (managable: Managable, ...params: any[]) => ManageCode } = {};

export interface Managable {
  mName: string;
}

export namespace Manager {
  export function manage(managable: Managable, ...params: any[]): ManageCode{
    return managers[managable.mName](managable, ...params);
  }
  export function addManager(name: string, manager: (managable: Managable, ...params: any[]) => ManageCode) {
    managers[name] = manager;
  }
}
