import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useStores } from '../RootStoreProvider';
import { RootStore } from '../../models/root-store';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import { useHistory } from "react-router-dom";
import 'primeflex/primeflex.css';
const MaterialList = observer(() => {

  const rootStore: RootStore = useStores();
  const history = useHistory();

  const handleClick = (value:any) => {
    rootStore.updateCurrentMaterialByID(value.id, value.name)  
    rootStore.updateStepNumber(1)
    history.push("/thickness")
  }

  const renderHeader = () => {
    return (
      <div className="p-d-flex p-jc-between p-ai-center">
      <h5 className="p-m-0">Materials</h5>
  </div>
    )
  }

  const SelectMaterialButton = (rowData:any) => {
    return <Button type="button" icon="pi pi-angle-double-right" onClick={()=>{handleClick(rowData)}} style={{backgroundColor:'#239AAB'}} ></Button>;
  } 

    return (
        <div className=' h-full'>
          <DataTable value={rootStore.materials} 
                    className="p-datatable-customers" 
                    header={renderHeader}
                    rows={10}
                    paginator 
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
                    rowsPerPageOptions={[10,25,50]}
                    dataKey="id" rowHover
                    filterDisplay="menu" responsiveLayout="scroll"
                    resizableColumns
                    scrollable 
                    scrollHeight="flex"
                    size="small"
                    emptyMessage="No Materials found."
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
            <Column field="id" header="ID" sortable filter filterPlaceholder="Search by ID" style={{ minWidth: '2rem',  textAlign: 'right'  }} />
            <Column field="name" header="Name" sortable filter filterPlaceholder="Search by Name" style={{ minWidth: '45rem' }} /> 
            <Column field="position" header="Postition" sortable filter filterPlaceholder="Search by Postition" style={{ minWidth: '3rem' }} />
            <Column headerStyle={{ width: '4rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'right' }} body={SelectMaterialButton} />
          </DataTable>
          {/* <StepView /> */}
        </div>
    )
})

export default MaterialList
