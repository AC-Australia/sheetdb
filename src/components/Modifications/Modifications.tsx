import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useStores } from '../RootStoreProvider';
import { RootStore } from '../../models/root-store';
import { SheetModelType } from '../../models/SheetModel';
import { InputNumber } from 'primereact/inputnumber';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useHistory } from "react-router-dom";
import StepView from '../generic/StepView';


interface statusOptions {
  name: string;
  code: string;
}
const Modifications = observer(() => {

  const rootStore: RootStore = useStores();
  const sheetModel: SheetModelType = rootStore.currentSheetByID
  const history = useHistory();
  if(!rootStore.currentMaterial){
    console.log("TESTING")
    history.push("/")
  }
  const [loadingChanges, setLoadingChanges] = useState<boolean>(false)

  const [length, setLength] = useState<number>(sheetModel.dy);
  const [lengthCheck, setLengthCheck] = useState<boolean>(false);

  const [width, setWidth] = useState<number>(sheetModel.dx);
  const [widthCheck, setWidthCheck] = useState<boolean>(false);
  
  const [status, setStatus] = useState<statusOptions>({ name: sheetModel.status, code: sheetModel.status });
  const [statusCheck, setStatusCheck] = useState<boolean>(false);

  const options:statusOptions[] = [
    { name: 'Pending', code: 'Pending' },
    { name: 'Available', code: 'Available' },
    { name: 'Reserved', code: 'Reserved' },
    { name: 'Used', code: 'Used' }
  ]

  const handleClick = (e:any) => {
    setStatus(e)
  }

  const handleUpdate = async() => {
    if (statusCheck && status.name === "used" ) {
      //Handle Deleteing Here
      return
    }
    let lengthOfNewSheet  = (lengthCheck) ? length : sheetModel.dy;
    let widthOfNewSheet  = (widthCheck) ? width : sheetModel.dx;
    let statusOfNewSheet = (statusCheck) ? status.name: sheetModel.status
    setLoadingChanges(true)
    await rootStore.updateSheetSize(sheetModel.id, lengthOfNewSheet, widthOfNewSheet, statusOfNewSheet)
    setLoadingChanges(false)
  }

    return (
        <div>
          <h1>{rootStore.currentMaterialName} - {rootStore.currentThicknessName}mm - {sheetModel.name}</h1>
          <Card  style={{ width: '45rem', marginBottom: '2em' }}>

            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">Length</span>
              <InputNumber placeholder={length.toString()}onChange={(e) => setLength(e.value)}/>
              <span className="p-inputgroup-addon">
                <Checkbox checked={lengthCheck}  onChange={(e) => setLengthCheck(!lengthCheck)} />
              </span>
            </div>

            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">Width </span>
              <InputNumber placeholder={width.toString()} onChange={(e) => setWidth(e.value)}/>
              <span className="p-inputgroup-addon">
                <Checkbox checked={widthCheck}  onChange={(e) => setWidthCheck(!widthCheck)} />
              </span>
            </div>

            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">Status </span>
              <Dropdown value={status} options={options} onChange={(e) => handleClick(e.value)} optionLabel="name" placeholder="Select Sheet Status"/>
              <span className="p-inputgroup-addon">
                <Checkbox checked={statusCheck}  onChange={(e) => setStatusCheck(!statusCheck)} />
              </span>
            </div>
            <Button label="Save Changes" icon="pi pi-check" loading={loadingChanges} onClick={handleUpdate} />
          </Card>
          <StepView />
        </div>
    )
})

export default Modifications
