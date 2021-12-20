import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { TabView, TabPanel } from 'primereact/tabview';
import { useStores } from '../RootStoreProvider';
import { RootStore } from '../../models/root-store';
import MaterialList from '../Material List/MaterialList';
import IDSearch from '../ID Search/IDSearch';
import 'primeflex/primeflex.css';
import './search.css'
const SearchSelect = observer(() => {

  const rootStore: RootStore = useStores();

  const handleTabChange = (e:any) => {
    rootStore.setSearchByType(e.index)
    localStorage.setItem('searchType', JSON.stringify(rootStore.searchByType))
  }


    return (
        <div className = 'h-full'>
          <TabView className = 'h-full' activeIndex={rootStore.searchByType} onTabChange={handleTabChange}>
            <TabPanel headerClassName = 'h-full' contentClassName = 'h-full' header="Search With Wizard" leftIcon="pi pi-search">
              <MaterialList />
            </TabPanel>  
            <TabPanel headerClassName = 'h-full' contentClassName = 'h-full'  header="Search By ID" leftIcon="pi pi-bolt">
              <IDSearch />
            </TabPanel>              
          </TabView>
        </div>
    )
})

export default SearchSelect
