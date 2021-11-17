//import firebase from "firebase";
// import { auth, firestore } from "../firebase/firebaseIndex";
import axios from 'axios'
const { ipcRenderer } = window.require("electron");
let expressAPI:string
let expressPort: string
let versionNumber: string
// const app = window.require('electron').remote
//NPM Imports

//App Locations to be updated to ENV locaitons
//const cloudAPI = 'http://localhost:3005/';
ipcRenderer.send('variable-request', ['expressPort', "appVersion"]);
ipcRenderer.on('variable-reply', function (event:any, args:string[]) {
  versionNumber = args[1]
  expressPort = args[0];
  expressAPI = `http://localhost:${expressPort}/`;
});

// console.log(currentWindow.expressPort)
// axios.interceptors.request.use(async config => {
//   config.headers.token = await auth.currentUser.getIdToken()
//   return config
//  }, (error) => {
//   console.log("error")
//   return
//  })


export const getVersionDetail = () => {
  return versionNumber
}

export const getMaterialList = async () => {
  //Get a list of all Material Names in Sheet DB
  console.log(expressPort)
  const materials = await axios.get(`http://localhost:${expressPort}/api/material-list`)
  return materials.data
}
export const getThicknessList = async () => {
  //Get a list of all Thicknesses Availible in Sheet DB
  console.log(expressPort)
  const thicknesses = await axios.get(`http://localhost:${expressPort}/api/thickness-list`)
  return thicknesses.data
}

export const getSheetList = async () => {
  //Get a list of all Thicknesses Availible in Sheet DB
  console.log(expressPort)
  const sheets = await axios.get(`http://localhost:${expressPort}/api/sheets-list`)
  return sheets.data
}

export const updateSheet = async (id:number, name:string, width:number, length:number, status:string) => {
  console.log(id,name,width,length,status)
  const newSheet = await axios.put(`http://localhost:${expressPort}/api/update-size`, {
    id: id,
    name: name,
    width: width,
    length: length,
    status: status
  })
  return newSheet
}

export const generateDBConnection = async (path:string) =>{
  try{
    const newConnection = await axios.put(`http://localhost:${expressPort}/api/setup-db`,{
      path: path
    })
  } catch(err){
    console.log(err)
    return err
  }
}