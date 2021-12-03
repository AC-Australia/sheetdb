import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { useStores } from '../RootStoreProvider';
import { RootStore } from '../../models/root-store';
import { useHistory } from "react-router-dom";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

const Settings = observer(() => {

  const rootStore: RootStore = useStores();
  const history = useHistory();
  const [loading, setLoading] = useState(false)
  const folderInput = useRef(null)

  const handleUpdateSettings = async () => {
    setLoading(true)
    await rootStore.conectToDB()
    await rootStore.hydrateMaterialList()
    await rootStore.hydrateThicknessList()
    await rootStore.hydrateSheetList()
    localStorage.setItem('dbPathForSheetDB', JSON.stringify(rootStore.databasePath))
    setLoading(false)
    history.push("/")
  }

  const handleClickUpdate = (e: any) =>{
    if (e.length !== 1) return 
    const file = e[0]
    const filePath = file.path
    rootStore.updateDBPathFromSettings(filePath)
  }
  const errorMessage = () => {
    if (rootStore.databaseConnection){
      return (
        <div></div>
      )
    } else {
      return (
        <Card title="Somethings Not Quiet Right" >
          Please Check the above file path is correct. It should not include a trailing backslash (\)
        </Card>
      )      
    }
  }

    return (
      <div>
        <h1>Settings</h1>
        <div className="p-formgroup-inline"> 
          <label style={{borderRadius: '4px', display: 'inline-block', padding: '6px 12px', cursor: 'pointer', backgroundColor:'#239AAB', color:'White'}}>
          <i className="pi pi-file" style={{padding: '6px 12px'}}></i>
          Select File
            <input style={{display: 'none'}} type="file" accept=".db" onChange={(e) => {
              handleClickUpdate(e.target.files)
              }}
            />
          </label>
          <InputText id="inputtext" value={rootStore.databasePath} onChange={(e) => rootStore.updateDBPathFromSettings(e.target.value)} style={{margin: '6px 12px'}}/>
          </div>
          <Button label="Submit" icon="pi pi-check" loading={loading} onClick={handleUpdateSettings} style={{backgroundColor:'#239AAB'}}/>
          {errorMessage()}
      </div>
    )
})

export default Settings
