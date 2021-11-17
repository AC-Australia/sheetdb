import { types, Instance } from 'mobx-state-tree';

const SheetModel = types
    .model('SheetModel', { 
        id: types.integer,
        name: types.string,
        dy: types.number,
        dx: types.number,
        status: types.string,
        position: types.integer,
        thicknessID: types.integer
    })
    .views((self) => {
        return {
        }   
    })            
    .actions((self) => {
        return{
        updateSheetInfo(dy:number, dx:number, status:string) {
           self.dy = dy
           self.dx = dx
           self.status = status
        },
        }
    })
export type SheetModelType = Instance<typeof SheetModel>;
export default SheetModel

