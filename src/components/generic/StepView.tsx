import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useStores } from '../RootStoreProvider';
import { RootStore } from '../../models/root-store';
import { useHistory } from "react-router-dom";


import { Steps  } from 'primereact/steps';
const StepView = observer(() => {

  const rootStore: RootStore = useStores();
  const history = useHistory();

  

  const interactiveItems = [
    {
        label: 'Material',
        command: () => {
          rootStore.updateStepNumber(0)
          history.push("/")
        }
    },  
    {
        label: 'Thickness',
        command: () => {
          if(rootStore.currentMaterial){
            rootStore.updateStepNumber(1)
            history.push("/thickness")
          }
        }
    },
    {
        label: 'Sheet Size',
        command: () => {
          if(rootStore.currentThickness){
            rootStore.updateStepNumber(2)
            history.push("/sheets")
          }
        }
    },
    {
        label: 'Modifications',
        command: () => {
          if(rootStore.currentSheet){
            rootStore.updateStepNumber(3)
            history.push("/modifications")
          }
        }
    }
    ];

    return (
        <div style={{padding:'30px'}}>
            <Steps model={interactiveItems} activeIndex={rootStore.currentStep} readOnly={false} />
        </div>
    )
})

export default StepView


//onSelect={(e) => handleClick(e.index)}
