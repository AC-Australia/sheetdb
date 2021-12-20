import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { useStores } from '../RootStoreProvider';
import { RootStore } from '../../models/root-store';
import { Button } from 'primereact/button';
import 'primeflex/primeflex.css';
import { useHistory } from 'react-router-dom';
import { InputNumber } from 'primereact/inputnumber';
import { Messages } from 'primereact/messages';
import { Message } from 'primereact/message';


const IDSearch = observer(() => {

  const rootStore: RootStore = useStores();
  const history = useHistory();
  const [value, setValue] = useState<number>();
  const [loading1, setLoading1] = useState(false);
  const msgs1 = useRef(null);
 
  const onLoadingClick1 = () => {
    setLoading1(true);
    const materialFound = rootStore.currentSheetWithID(value)
    if (materialFound){
      rootStore.setStoreWithSheetIDSearch(value)
      rootStore.updateStepNumber(1)
      history.push("/modifications")
    } else {
      msgs1.current.clear()
      msgs1.current.show([
        { severity: 'error', summary: ' ', detail: `Material ${value} does not exist in database ` }
    ]);
    }

   setLoading1(false)
    }

    const handleKeyDown = (e:any) => {
      if (e.key === 'Enter'){
        onLoadingClick1()
      }
    }

    return (
        <div className=' h-full'>
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputNumber value={value} onChange={(e) => setValue(e.value)} placeholder="     Search" onKeyDown={handleKeyDown} />
            <Button label="Submit" icon="pi pi-check" loading={loading1} onClick={onLoadingClick1} />
          </span>

          <div className="p-col-12 p-md-3">
            <Messages ref={msgs1} />
          </div>
        </div>
    )
})

export default IDSearch
