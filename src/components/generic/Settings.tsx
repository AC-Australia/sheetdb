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
            <div className="p-formgroup-inline p-mb-2">
                    <label htmlFor="username1" className="p-sr-only">Username</label>
                    <InputText id="inputtext" value={rootStore.databasePath} onChange={(e) => rootStore.updateDBPathFromSettings(e.target.value)} className="p-invalid" />
                    <Button label="Submit" icon="pi pi-check" loading={loading} onClick={handleUpdateSettings} />
                    {errorMessage()}
                </div>
        </div>
    )
})

export default Settings
