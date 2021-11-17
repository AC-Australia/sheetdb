import React from 'react';
import { observer } from 'mobx-react';
import { useStores } from '../RootStoreProvider';
import { RootStore } from '../../models/root-store';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useHistory } from "react-router-dom";
import StepView from '../generic/StepView';

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
            <h2 className="p-m-0">Materials List</h2>
        </div>
    )
  }

  const SelectMaterialButton = (rowData:any) => {
    return <Button type="button" icon="pi pi-angle-double-right" onClick={()=>{handleClick(rowData)}}></Button>;
  } 

    return (
        <div>
          <DataTable value={rootStore.materials} paginator className="p-datatable-customers" header={renderHeader} rows={10} paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                    dataKey="id" rowHover
                    filterDisplay="menu" responsiveLayout="scroll"
                    emptyMessage="No Materials found."
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
            <Column field="id" header="ID" sortable filter filterPlaceholder="Search by ID" style={{ minWidth: '2rem' }} />
            <Column field="name" header="Name" sortable filter filterPlaceholder="Search by Name" style={{ minWidth: '24rem' }} /> 
            <Column field="position" header="Postition" sortable filter filterPlaceholder="Search by Postition" style={{ minWidth: '3rem' }} />
            <Column headerStyle={{ width: '4rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={SelectMaterialButton} />
          </DataTable>
          <StepView />
        </div>
    )
})

export default MaterialList
