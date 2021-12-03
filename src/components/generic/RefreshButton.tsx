import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from "react-router-dom";
import { Button } from 'primereact/button';
import { RootStore } from '../../models/root-store';
import { useStores } from '../RootStoreProvider';

const RefreshButton = observer(() => {

  const rootStore: RootStore = useStores();
  const history = useHistory();

  const handleUpdateSettings = async () => {
    history.push("/")
    await rootStore.conectToDB()
    await rootStore.hydrateMaterialList()
    await rootStore.hydrateThicknessList()
    await rootStore.hydrateSheetList()
    history.push("/")
  }

  return (
         <div>
            <Button icon="pi pi-refresh" className="p-button-rounded p-button-secondary" onClick={handleUpdateSettings} />
        </div>   
  )

})

export default RefreshButton
