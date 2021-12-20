import { types, flow, Instance, onSnapshot } from 'mobx-state-tree';
import {
  getMaterialList,
  getThicknessList,
  getSheetList,
  updateSheet,
  deleteSheet,
  generateDBConnection
  } from '../services/Services';
import MaterialModel from './MaterialModel';
import ThicknessModel from './ThicknessModel';
import SheetModel from './SheetModel'
import SheetModelType from './SheetModel'

export const RootStoreModel = types
  .model('RootStore', {
    currentStep: types.integer,
    currentMaterial: types.maybe(types.integer),
    currentMaterialName: types.maybe(types.string),
    currentThickness: types.maybe(types.integer),
    currentThicknessName: types.maybe(types.number),
    currentSheet: types.maybe(types.integer),
    materials: types.array(MaterialModel),
    thicknesses: types.array(ThicknessModel),
    sheets: types.array(SheetModel),
    databasePath: types.maybe(types.string),
    databaseConnection: types.boolean,
    tableHeight: types.maybe(types.string),
    searchByType: types.integer
  })
  .views((self) => {
    return {
      get thicknessFromMaterialID() {
        return self.thicknesses.filter(thickness => thickness.material_id === self.currentMaterial)
      },
      get sheetsFromThicknessID() {
        return self.sheets.filter(sheet => sheet.thicknessID === self.currentThickness)
      },
      get currentSheetByID() {
        const currentSheet = self.sheets.filter(sheet => sheet.id === self.currentSheet) 
        return currentSheet[0]
      },
      currentSheetWithID(id:number) {
        const currentSheet = self.sheets.filter(sheet => sheet.id === id) 
        return currentSheet[0]
      }
    };
  })
  .actions((self) => {
    return {
      setStoreWithSheetIDSearch(id:number){
        const sheet = self.sheets.filter(sheet => sheet.id === id)[0]
        const thickness = self.thicknesses.filter(thickness => thickness.id === sheet.thicknessID)[0]
        const material = self.materials.filter(material => material.id === thickness.material_id)[0]
        self.currentMaterial = material.id
        self.currentMaterialName = material.name
        self.currentThickness = thickness.id
        self.currentThicknessName = thickness.thickness
        self.currentSheet = sheet.id
        console.log(self.currentSheet)
      },
      setSearchByType(searchType:number){
        if (searchType >= 0 && searchType <=2){
          self.searchByType = searchType
        }
      },
      setTableHeight(size:string){
        self.tableHeight = size
      },
      updateStepNumber(step:number) {
        self.currentStep = step
      },
      updateCurrentMaterialByID(id:number, name:string) {
        self.currentMaterial = id
        self.currentMaterialName = name
      },
      updateCurrentThicknessByID(id:number, thickness:number) {
        self.currentThickness = id
        self.currentThicknessName = thickness
      },
      updateCurrentSheetByID(id:number) {
        self.currentSheet = id
      },
      hydrateMaterialList: flow(function* hydrateMaterialList() {
        try{
          self.materials = yield getMaterialList()
        } catch(err){
          console.log(err)
        }
      }),
      hydrateThicknessList: flow(function* hydrateThicknessList() {
        try{
          self.thicknesses = yield getThicknessList()
        } catch(err){
          console.log(err)
        }
      }),
      hydrateSheetList: flow(function* hydrateThicknessList() {
        try{
          console.log("Sheets")
          self.sheets = yield getSheetList()
          console.log(self.sheets)
        } catch(err){
          console.log(err)
        }
      }),
      updateSheetSize: flow(function* updateSheetSize(id:number, dy:number, dx:number, status:string) {
        const sheet = self.sheets.filter(sheet => sheet.id === id)[0]
        const newSheet = yield updateSheet(id,sheet.name, dy, dx, status)
        return 
      }),
      deleteSheetSize: flow(function* deleteSheetSize(id:number, name:string){
        const sheet = yield deleteSheet(id, name)
        return 
      }),
      conectToDB: flow(function* conectToDB() {
        try{
          const dbConnect = yield generateDBConnection(self.databasePath);
          self.databaseConnection = true
          return dbConnect
        } catch(err){
          console.log("ERROR", err)
          self.databaseConnection = false
          console.log(self.databaseConnection)
          return 
        } 
      }),
      getDBPathFromStorage() {
       if (localStorage.getItem('dbPathForSheetDB')) {
         const path = localStorage.getItem('dbPathForSheetDB');
         self.databasePath = JSON.parse(path || '') 
       } else {
         const path = "C:\\ALPHACAM\\LicomDat\\sheet_database_v2.db"
         self.databasePath = path
       }  
      },
      getSearchTypeFromStorage(){
        if (localStorage.getItem('searchType')) {
          const seatchType = localStorage.getItem('searchType');
          self.searchByType = JSON.parse(seatchType|| '')
        } else {
          self.searchByType = 0
        }
      },
      updateDBPathFromSettings(path:string) {
        self.databasePath = path
      }
    };
  });

export type RootStore = Instance<typeof RootStoreModel>;
export const setupRootStore = async () => {
  const rs: RootStore = RootStoreModel.create({currentStep: 0, databaseConnection: false, searchByType: 0 });
  rs.getDBPathFromStorage()
  rs.getSearchTypeFromStorage()
  await rs.conectToDB()
  if (rs.databaseConnection){
    await rs.hydrateMaterialList()
    await rs.hydrateThicknessList()
    await rs.hydrateSheetList()
  }
  return rs;
};
