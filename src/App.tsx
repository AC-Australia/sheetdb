//NPM Imports
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
// import { FirebaseAuthProvider, IfFirebaseAuthed, IfFirebaseUnAuthed } from "@react-firebase/auth";
// import firebase from "firebase/app";
// import "firebase/auth";
import { Messages } from 'primereact/messages';
import { Button } from 'primereact/button';

//Internal Imports
import { RootStoreProvider } from './components/RootStoreProvider';
import { RootStore, setupRootStore } from './models/root-store';
import { getVersionDetail } from './services/Services'
import LoadingPage from './components/generic/LoadingPage';
import MaterialList from './components/Material List/MaterialList';
import ThicknessList from './components/Thickness List/ThicknessList';
import SheetSizeList from './components/Sheet Size List/SheetSizeList';
import Modifications from './components/Modifications/Modifications';
import Settings from './components/generic/Settings';
import SettingsButton from './components/generic/Settings Button';


const { ipcRenderer } = window.require("electron");

function App() {

  const [rootStore, setRootStore] = useState<RootStore>();
  const [versionShowing, setVersionShowing] = useState<boolean>(false)
  const updateAvalible = useRef(null);
  const showVersionDetail = useRef(null)

  
  ipcRenderer.on('updateAvalible', (( event:any, message:string ) =>{
      return (
        updateAvalible.current.show([
          { life: 10000 , severity: 'info', summary: '', detail: `Hi there, looks like we have made some updates. Changes will be applied next time you open the app.` }
        ])
      )
  }))

  const showVersionData = () => {
    if ( versionShowing ) {
      setVersionShowing(false)
      showVersionDetail.current.clear()
    } else {
      setVersionShowing(true)
      return (
        showVersionDetail.current.show([
          { closable: false, life: 10000 , sticky: true, severity: 'info', summary: '', detail: `${getVersionDetail()}` }
        ])
      )
    }
  }

  useEffect(() => {
      if (rootStore) return;
        setupRootStore()
          .then((rs) => {
            setRootStore(rs);
          })
          .catch((err) => {
            console.log('failed to initialize root store');
            console.log(err)
          });
  }, [rootStore]);

  if (!rootStore) return(
    <div className='text-center'>
      <LoadingPage />
    </div>
  );

  return (
    <div className='text-center h-full'>
      <RootStoreProvider value={rootStore}>
        <HashRouter>
          <div className = 'fixed top-0 right-0 m-1'>
            <Button icon="pi pi-info-circle" className="p-button-rounded p-button-secondary" onClick={showVersionData} />
          </div>
          <div className = 'fixed top-0 left-0 m-1'>
            <SettingsButton />
          </div>
          <div className = 'fixed my-10'>
            <Messages ref={updateAvalible} />
          </div>
          <div className = 'fixed right-0 my-10'>
            <Messages ref={showVersionDetail} onClick={showVersionData} />
          </div>
          <h1>AC Australia Sheet Database</h1>
          <h1>AC Australia Sheet Database</h1>
          <h1>AC Australia Sheet Database</h1>
          <h1>AC Australia Sheet Database</h1>
          <h1>AC Australia Sheet Database</h1>
          <h1>AC Australia Sheet Database</h1>
          <h1>AC Australia Sheet Database</h1>
          <Switch>
            <Route path='/settings' component={Settings} />
            <Route path='/modifications' component={Modifications} />
            <Route path='/sheets' component={SheetSizeList} />
            <Route path='/thickness' component={ThicknessList} />  
            <Route component={MaterialList} />
          </Switch> 
        </HashRouter> 
      </RootStoreProvider>
    </div>
  );
}

export default App;
