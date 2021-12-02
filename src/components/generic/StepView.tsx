import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useStores } from '../RootStoreProvider';
import { RootStore } from '../../models/root-store';
import { useHistory } from "react-router-dom";


import { Steps  } from 'primereact/steps';
const StepView = observer(() => {

  const rootStore: RootStore = useStores();
  const history = useHistory();

  const handleClick = (step:number) => {
    //Will Need to add some logic for steps later ie cant skip steps
    switch(step){
      case 0:
          rootStore.updateStepNumber(step)
          history.push("/")
        break;
      case 1:
        if(rootStore.currentMaterial){
          rootStore.updateStepNumber(step)
          history.push("/thickness")
        } else {
          rootStore.updateStepNumber(0)
          history.push("/")
          
        }
        break;
      case 2:
        if(rootStore.currentThickness){
          rootStore.updateStepNumber(step)
          history.push("/sheets")
        } else {
          rootStore.updateStepNumber(1)
          history.push("/thickness")
        }
        break;
      case 3:
        if(rootStore.currentSheet){
          rootStore.updateStepNumber(step)
          history.push("/modifications")
        } else {
          rootStore.updateStepNumber(2)
          history.push("/sheets")
        }  
        break;
      default:
        rootStore.updateStepNumber(0)
        history.push("/")
    }
  }
  const interactiveItems = [
    {
        label: 'Material',
        command: () => {
            console.log("TEST1")
        }
    },
    {
        label: 'Thickness',
        command: () => {
          console.log("TEST2")
        }
    },
    {
        label: 'Sheet Size',
        command: () => {
          console.log("TEST3")
        }
    },
    {
        label: 'Modifications',
        command: () => {
          console.log("TEST4")
        }
    }
    ];

    useEffect(() => {
      if (!rootStore.currentMaterial){
        console.log("TEST")
        history.push("/")
      }
  }, [history, rootStore.currentMaterial]);

    return (
        <div style={{padding:'30px'}}>
            <Steps model={interactiveItems} activeIndex={rootStore.currentStep} onSelect={(e) => handleClick(e.index)} readOnly={false} />
        </div>
    )
})

export default StepView
