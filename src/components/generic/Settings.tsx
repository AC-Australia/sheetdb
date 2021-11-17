import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useStores } from '../RootStoreProvider';
import { RootStore } from '../../models/root-store';
import { useHistory } from "react-router-dom";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

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

    return (
        <div>
            <h1>Settings</h1>
            <InputText id="inputtext" value={rootStore.databasePath} onChange={(e) => rootStore.updateDBPathFromSettings(e.target.value)} className="p-invalid" />
            <Button label="Submit" icon="pi pi-check" loading={loading} onClick={handleUpdateSettings} />
        </div>
    )
})

export default Settings
