import { types, Instance } from 'mobx-state-tree';

const ThicknessModel = types
    .model('ThicknessModel', { 
        id: types.integer,
        material_id: types.integer,
        thickness: types.number,
        thickness_units: types.string,
        position: types.integer
    })
    .views((self) => {
        return {
        }   
    })            
    .actions((self) => {
        return{
        }
    })
export type ThicknessModelType = Instance<typeof ThicknessModel>;
export default ThicknessModel

