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


interface dropDownType {
  name: string;
  code: number;
}
interface statusOptions {
  name: string;
  code: string;
}
const NewMaterial = observer(() => {

  const rootStore: RootStore = useStores();

  const [loadingChanges, setLoadingChanges] = useState<boolean>(false)
  const [materialName, setMaterialName] = useState<dropDownType>() 
  const [materialThickness, setMaterialThickness] = useState<dropDownType>()
  const [availableMaterialThickness, setAvailableMaterialThickness] = useState<dropDownType[]>()
  const [newOffcutDY, setNewOffcutDY] = useState<number>(0.000)
  const [newOffcutDX, setNewOffcutDX] = useState<number>(0.000)
  const [newOffcutStatus, setNewOffcutStatus] = useState<statusOptions>()
  const toast = useRef(null);

  const options:statusOptions[] = [
    { name: 'Pending', code: 'Pending' },
    { name: 'Available', code: 'Available' },
    { name: 'Reserved', code: 'Reserved' },
    { name: 'Used', code: 'Used' }
  ]


  const getMaterialList = () => {
    return rootStore.materials.map(material => ({name: material.name, code: material.id}))
  }

  const materialNamesForList:dropDownType[] =  getMaterialList()


  
  
  const updateMaterialName = (material:dropDownType) => {
    setMaterialName(material)
    setAvailableMaterialThickness(rootStore.thicknessesFromCustomID(material.code).map( thickness => (
      {name: thickness.thickness + thickness.thickness_units, code: thickness.id}
    )))
  }

  const updateMaterialThickness = (thickness:dropDownType) => {
    setMaterialThickness(thickness)
  }

  const handleUpdate = async() => {
    setLoadingChanges(true)
    if (materialName && materialThickness && (newOffcutDY > 0) && (newOffcutDX > 0) && newOffcutStatus){

      const newSheet = await rootStore.createNewSheetSize(materialThickness.code, newOffcutDY, newOffcutDX, newOffcutStatus.name)
      console.log(newSheet.data)
      if (newSheet.data === "No Existing Sheets"){
        toast.current.show({ severity: 'error', summary: 'Offcut Not Created', detail: 'Offcut Creation for Materials with no current offcuts not currently supported', life: 8000 });
      }else{
        toast.current.show({ severity: 'success', summary: 'Offcut Created', detail: 'Your offcut has been successfully created.', life: 2000 });
      }
    } else {
      toast.current.show({ severity: 'error', summary: 'Offcut Not Created', detail: 'Please check all fields have been filled in correctly', life: 8000 });
    }

    setLoadingChanges(false)
  }

  const handleLengthUpdate = (e:number) => {
    if (e == null) {
      setNewOffcutDY(0)
    } else {
      setNewOffcutDY(e)
    }
    //setNewOffcutDY()
  }

  const handleWitdthUpdate = (e:number) => {
    if (e == null) {
      setNewOffcutDX(0)
    } else {
      setNewOffcutDX(e)
    }
    //setNewOffcutDY()
  }


 
    return (
      <div className='h-full'>
        <h1 className="p-m-0" style={{padding: '25px'}}><strong>Create New Material</strong></h1>
        
        <Card  style={{ width: '45rem', marginBottom: '2em', margin:"auto", padding:"10px"}}>
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">Material Name </span>
          <Dropdown value={materialName} options={materialNamesForList} onChange={(e) => updateMaterialName(e.value)} optionLabel="name" placeholder="Select Material Name" filter showClear filterBy="name"/>
        </div>
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">Material Thickness  </span>
          <Dropdown value={materialThickness} options={availableMaterialThickness} onChange={(e) => updateMaterialThickness(e.value)} optionLabel="name" placeholder="Select Material Name" filter showClear filterBy="name"/>
        </div>
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">Length</span>
            <InputNumber placeholder={newOffcutDY.toString()} mode="decimal" minFractionDigits={3} onChange={(e) => handleLengthUpdate(e.value)}/>
        </div>
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">Width</span>
            <InputNumber placeholder={newOffcutDX.toString()} mode="decimal" minFractionDigits={3} onChange={(e) => handleWitdthUpdate(e.value)}/>
        </div>
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">Status </span>
          <Dropdown value={newOffcutStatus} options={options} onChange={(e) => setNewOffcutStatus(e.value)} optionLabel="name" placeholder="Select Sheet Status"/>
        </div>
        <Toast ref={toast} />
        <Button label="Create New Material" icon="pi pi-check" loading={loadingChanges} onClick={handleUpdate} style={{backgroundColor:'#239AAB'}}/>
        </Card>
      </div>
    )
})

export default NewMaterial
