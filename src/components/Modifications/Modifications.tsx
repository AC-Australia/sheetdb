import React, { useEffect, useRef, useState } from 'react';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
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
  
  const [visible, setVisible] = useState<boolean>(false);
  const toast = useRef(null);

  const [length, setLength] = useState<number>(sheetModel.dy);
  const [lengthCheck, setLengthCheck] = useState<boolean>(false);
  const [lengthIsUpdated, setLengthIsUpdated] = useState<boolean>(false)

  const [width, setWidth] = useState<number>(sheetModel.dx);
  const [widthCheck, setWidthCheck] = useState<boolean>(false);
  const [widthIsUpdated, setWidthIsUpdated] = useState<boolean>(false)

  const [status, setStatus] = useState<statusOptions>({ name: sheetModel.status, code: sheetModel.status });
  const [statusCheck, setStatusCheck] = useState<boolean>(false);
  const [statusIsUpdated, setStatusIsUpdated] = useState<boolean>(false)

  const options:statusOptions[] = [
    { name: 'Pending', code: 'Pending' },
    { name: 'Available', code: 'Available' },
    { name: 'Reserved', code: 'Reserved' },
    { name: 'Used', code: 'Used' }
  ]


  const acceptDelete = async () => {
      toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You Have Deleted This Sheet', life: 3000 });
      setLoadingChanges(true)
      await rootStore.deleteSheetSize(sheetModel.id, sheetModel.name)
      setLoadingChanges(false)
      rootStore.hydrateMaterialList()
      rootStore.hydrateThicknessList()
      rootStore.hydrateSheetList()
      rootStore.updateStepNumber(0)
      history.push("/")
  };

  const rejectDelete = () => {
      toast.current.show({ severity: 'info', summary: 'Rejected', detail: 'Sheet Not Deleted', life: 3000 });
  };

  const acceptNotice = (e:any) => {
    pushUpdate()
  };

  const rejectNotice = () => {
    toast.current.show({ severity: 'info', summary: 'Rejected', detail: 'No Updates Made', life: 3000 });
  };

  const handleUpdate = async(e: { currentTarget: any; }) => {
    console.log("Handle Update")
    console.log(status.name, statusIsUpdated, widthIsUpdated, lengthIsUpdated)
    if (statusCheck && status.name === "Used" ) {
      console.log("Used")
      confirmPopup({
        target: e.currentTarget,
        message: 'Do you want to delete this record?',
        icon: 'pi pi-info-circle',
        acceptClassName: 'p-button-danger',
        accept: () => acceptDelete(),
        reject: () => rejectDelete()
    });
      return
    }
    if ((lengthIsUpdated && !lengthCheck) || (widthIsUpdated && !widthCheck) || (statusIsUpdated && !statusCheck)){
      confirmPopup({
        target: e.currentTarget,
        message: 'Changes Have been made but update checkbox has not been selected please confirm',
        icon: 'pi pi-info-circle',
        acceptClassName: 'p-button-danger',
        accept: () => acceptNotice(e),
        reject: () => rejectNotice()
    });
    return 
  }
    pushUpdate()
  }

  const pushUpdate = async () => {
    let lengthOfNewSheet  = (lengthCheck) ? length : sheetModel.dy;
    let widthOfNewSheet  = (widthCheck) ? width : sheetModel.dx;
    let statusOfNewSheet = (statusCheck) ? status.name: sheetModel.status
    setLoadingChanges(true)
    await rootStore.updateSheetSize(sheetModel.id, lengthOfNewSheet, widthOfNewSheet, statusOfNewSheet)
    setLoadingChanges(false)
    rootStore.hydrateMaterialList()
    rootStore.hydrateThicknessList()
    rootStore.hydrateSheetList()
    rootStore.updateStepNumber(0)
    history.push("/")
  }

  const updateLengthEvent = (e: { value: React.SetStateAction<number>; }) => {
    setLength(e.value)
    setLengthIsUpdated(true)
  }

  const lengthValidation = () => {
    if (lengthIsUpdated && !lengthCheck){
      return "p-invalid"
    } else {
      return ""
    }
  }

  const updateWidthEvent = (e: { value: React.SetStateAction<number>; }) => {
    setWidth(e.value)
    setWidthIsUpdated(true)
  }

  const widthValidation = () => {
    if (widthIsUpdated && !widthCheck){
      return "p-invalid"
    } else {
      return ""
    }
  }

  const updateStatusEvent = (e:any) => {
    setStatus(e.value)
    setStatusIsUpdated(true)
  }

  const statusValidation = () => {
    if (statusIsUpdated && !statusCheck){
      return "p-invalid"
    } else {
      return ""
    }
  }





    return (
        <div>
          <h1>{rootStore.currentMaterialName} - {rootStore.currentThicknessName}mm - {sheetModel.visName}</h1>
          <Card  style={{ width: '45rem', marginBottom: '2em', margin:"auto", padding:"10px"}}>
          <Toast ref={toast} />
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">Length</span>
              <InputNumber placeholder={sheetModel.dy.toFixed(3).toString()} mode="decimal" minFractionDigits={3} onChange={(e) => updateLengthEvent(e)}/>
              <span className="p-inputgroup-addon">
                <Checkbox checked={lengthCheck}  onChange={(e) => setLengthCheck(!lengthCheck)} className={lengthValidation()} />
              </span>
            </div>

            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">Width </span>
              <InputNumber placeholder={sheetModel.dx.toFixed(3).toString()} mode="decimal" minFractionDigits={3}  onChange={(e) => updateWidthEvent(e)}/>
              <span className="p-inputgroup-addon">
                <Checkbox checked={widthCheck}  onChange={(e) => setWidthCheck(!widthCheck)} className={widthValidation()} />
              </span>
            </div>

            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">Status </span>
              <Dropdown value={status} options={options} onChange={(e) => updateStatusEvent(e)} optionLabel="name" placeholder="Select Sheet Status"/>
              <span className="p-inputgroup-addon">
                <Checkbox checked={statusCheck}  onChange={(e) => setStatusCheck(!statusCheck)} className={statusValidation()} />
              </span>
            </div>
            <Button label="Save Changes" icon="pi pi-check" loading={loadingChanges} onClick={handleUpdate} style={{backgroundColor:'#239AAB'}}/>
          </Card>
          <StepView />
        </div>
    )
})

export default Modifications
