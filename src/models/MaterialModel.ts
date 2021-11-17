import { types, Instance } from 'mobx-state-tree';

const MaterialModel = types
    .model('MaterialModel', { 
        id: types.integer,
        name: types.string,
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
export type MaterialModelType = Instance<typeof MaterialModel>;
export default MaterialModel

