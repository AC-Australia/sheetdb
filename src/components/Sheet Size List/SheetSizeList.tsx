import React from 'react';
import { observer } from 'mobx-react';
import { useStores } from '../RootStoreProvider';
import { RootStore } from '../../models/root-store';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useHistory } from "react-router-dom";
import { Tag } from 'primereact/tag';
import StepView from '../generic/StepView';
import './sheetSize.css'
const SheetList = observer(() => {

  const rootStore: RootStore = useStores();
  const history = useHistory();
  const handleClick = (value:any) => {
    rootStore.updateCurrentSheetByID(value.id)
    rootStore.updateStepNumber(3)
    history.push("/modifications")
  }

  const rowClass = (data: { status: string; }) => {
  const statusName = data.status.toLowerCase()
   return `row-accessories-${statusName}`
}

  const renderHeader = () => {
    return (
        <div className="p-d-flex p-jc-between p-ai-center">
            <h2 className="p-m-0">Available Sheets for <strong>{rootStore.currentThicknessName}mm {rootStore.currentMaterialName}</strong></h2>
        </div>
    )
  }

  const SelectMaterialButton = (rowData:any) => {
    return <Button type="button" icon="pi pi-angle-double-right" onClick={()=>{handleClick(rowData)}} style={{backgroundColor:'#239AAB'}} ></Button>;
            
  } 

  const statusBodyTemplate = (rowData:any) => {
    switch (rowData.status){
      case "Pending":
        return <Tag value={rowData.status} style={{backgroundColor:'#239AAB'}}></Tag>;
      case "Available":
        return <Tag severity="success" value={rowData.status}></Tag>;
      case "Reserved":
        return <Tag severity="danger" value={rowData.status}></Tag>;
      case "Check With Office":
        return <Tag severity="warning" value={rowData.status}></Tag>;
      default:
        return <Tag severity="warning" value={rowData.status}></Tag>;
    }
  }

  const dyDecTrim = (rowData:any) => {
    return rowData.dy.toFixed(3)
  }
  const dxDecTrim = (rowData:any) => {
    return rowData.dx.toFixed(3)
  }

    return (
        <div className='h-full'>
          <DataTable value={rootStore.sheetsFromThicknessID} 
                    paginator 
                    className="p-datatable-customers" 
                    header={renderHeader} 
                    rows={10} 
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10,25,50]}
                    dataKey="id" rowHover
                    filterDisplay="menu" responsiveLayout="scroll"
                    resizableColumns
                    scrollable 
                    scrollHeight="flex"
                    size="small"
                    rowClassName={rowClass}
                    emptyMessage="No Sheets For This Material And Thickness."
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
            <Column field="id" header="ID" sortable filter filterPlaceholder="Search by ID" style={{ minWidth: '1rem' }} />
            <Column field="visName" header="Name" sortable filter filterPlaceholder="Search by Name" style={{ minWidth: '24rem' }} /> 
            <Column field="dy" header="Length" sortable filter filterPlaceholder="Search by Length" style={{ minWidth: '2rem' }} body={dyDecTrim} />
            <Column field="dx" header="Width" sortable filter filterPlaceholder="Search by Width" style={{ minWidth: '2rem' }} body={dxDecTrim} />
            <Column field="position" header="Postition" sortable filter filterPlaceholder="Search by Postition" style={{ minWidth: '2rem' }} />
            <Column field="status" header="Status" sortable filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '15rem' }} body={statusBodyTemplate} />
            <Column headerStyle={{ width: '4rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={SelectMaterialButton} />
          </DataTable>
          {/* <StepView /> */}
        </div>
    )
})

export default SheetList
