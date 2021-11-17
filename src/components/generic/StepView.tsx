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
        rootStore.updateStepNumber(step)
        history.push("/thickness")
        break;
      case 2:
        rootStore.updateStepNumber(step)
        history.push("/sheets")
        break;
      case 3:
        rootStore.updateStepNumber(step)
        history.push("/modifications")
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
        <div>
            <Steps model={interactiveItems} activeIndex={rootStore.currentStep} onSelect={(e) => handleClick(e.index)} readOnly={false} />
        </div>
    )
})

export default StepView
