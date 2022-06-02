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
  const materials = await axios.get(`http://localhost:${expressPort}/api/material-list`)
  return materials.data
}
export const getThicknessList = async () => {
  //Get a list of all Thicknesses Availible in Sheet DB
  const thicknesses = await axios.get(`http://localhost:${expressPort}/api/thickness-list`)
  return thicknesses.data
}

export const getSheetList = async () => {
  //Get a list of all Thicknesses Availible in Sheet DB
  const sheets = await axios.get(`http://localhost:${expressPort}/api/sheets-list`)
  console.log(sheets.data)
  return sheets.data
}

export const NewSheetSize = async (thickID:number, dy:number, dx:number, status:string) => {
  console.log("Into Services")
  return 
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

export const deleteSheet = async (id:number, name:string) => {
  const deletedSheet = await axios.put(`http://localhost:${expressPort}/api/delete-size`, {
    id:id,
    name:name
  })
  return deletedSheet
}

export const generateDBConnection = async (locPath:string) =>{
 const newConnection = await axios.put(`http://localhost:${expressPort}/api/setup-db`,{
  locPath: locPath
    })
  if (newConnection.status === 200){
    console.log(newConnection)
    return newConnection
  } else {
    console.log(newConnection)
    throw new Error("err")
  }
}