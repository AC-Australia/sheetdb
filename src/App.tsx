//NPM Imports
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter } from 'react-router-dom';
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
import SettingsButton from './components/generic/Settings Button';
import NewMaterialButton from './components/generic/New Material Button';
import ConnectedRouter from './components/routers/ConnectedRouter';
import headerImage from './acauslogo.png';
import iconLogo from './icons/acicon.png';
import RefreshButton from './components/generic/RefreshButton';
import StepView from './components/generic/StepView';

const { ipcRenderer, remote } = window.require("electron");

function App() {

  const [rootStore, setRootStore] = useState<RootStore>();
  const [versionShowing, setVersionShowing] = useState<boolean>(false)
  const updateAvalible = useRef(null);
  const showVersionDetail = useRef(null)
  const [windowDimensions, setWindowDimensions] = useState<Number>(getWindowDimensions());

  const clearMessage = () =>{
    setVersionShowing(false)
  }

  const showVersionData = () => {
    if ( versionShowing ) {
      setVersionShowing(false)
      showVersionDetail.current.clear()
    } else {
      setVersionShowing(true)
        showVersionDetail.current.show([
          {closable: false, life: 3000 , severity: 'info', summary: '', content:(
            <React.Fragment>
              <img alt="logo" src={iconLogo} width="32" style={{padding: "4px"}}/>
              <p>Version: {getVersionDetail()} 
              </p>
            </React.Fragment>
          )}
          // { closable: false, life: 10000 , sticky: true, severity: 'info', summary: '', detail: Version: ${getVersionDetail()} }
        ])
    }
  }

  function getWindowDimensions() {
    return remote.getCurrentWindow().getSize()[1] - 350
   }

  useEffect(() => {
      if (rootStore) return;
        setupRootStore()
          .then((rs) => {
            setRootStore(rs);
            ipcRenderer.on('updateAvalible', (( event:any, message:string ) =>{
              return (
                updateAvalible.current.show([
                  { life: 10000 , severity: 'info', summary: '', detail: `Hi there, looks like we have made some updates. Changes will be applied next time you open the app.` }
                ])
              )
          }))
          function handleResize() {
            setWindowDimensions(getWindowDimensions());
          }
          window.addEventListener('resize', handleResize);
          return () => window.removeEventListener('resize', handleResize);
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
    <div className='text-center' >
      <RootStoreProvider value={rootStore}>
        <HashRouter>

          <div className = 'fixed top-0 right-0 m-1 z-50'>
            <Button icon="pi pi-info-circle" className="p-button-rounded p-button-secondary" onClick={showVersionData} />
          </div>
          <div className = 'fixed bottom-0 right-0 m-1 z-50'>
            <RefreshButton />
          </div>
          <div className = 'fixed top-0 left-0 m-1 z-50'>
            <SettingsButton />
          </div>
          <div className = 'fixed bottom-0 left-0 m-1 z-50'>
            <NewMaterialButton />
          </div>
          <div className = 'fixed right-0 my-10 z-50'>
            <Messages ref={updateAvalible}/>
          </div>
          <div className = 'fixed right-0 my-10 z-50'>
            <Messages ref={showVersionDetail} onClick={showVersionData} onRemove={clearMessage}/>
          </div>

          <div className="h-screen">

          <header className = ' sticky top-0 z-40 bg-white' >
            <img src={headerImage} alt="AC Australia Logo" style={{ height:"120px",margin:"auto" }} />
            <p style={{padding:'15px'}}><strong>Need Help? Email:</strong> <a href="mailto:HelpDesk@au.alphacam.com">HelpDesk@au.alphacam.com</a> </p>
          </header>

          <main style={{height: windowDimensions.toString()+'px' }}>
              <ConnectedRouter />
          </main >

          <footer className='bg-white z-40' style={{height:'80px' }}>
              <StepView />
          </footer>

          </div>
        </HashRouter> 
      </RootStoreProvider>
    </div>
  );
}

export default App;
