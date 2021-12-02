import React from 'react';
import { observer } from 'mobx-react';
import { useStores } from '../RootStoreProvider';
import { RootStore } from '../../models/root-store';
import { Route, Switch } from 'react-router-dom';
import Settings from '../generic/Settings';
import Modifications from '../Modifications/Modifications';
import SheetSizeList from '../Sheet Size List/SheetSizeList';
import ThicknessList from '../Thickness List/ThicknessList';
import MaterialList from '../Material List/MaterialList';


const ConnectedRouter = observer(() => {

  const rootStore: RootStore = useStores();
    if (rootStore.databaseConnection){
    return (
        <div style={{padding:"5px"}}>
        <Switch>
            <Route path='/settings' component={Settings} />
            <Route path='/modifications' component={Modifications} />
            <Route path='/sheets' component={SheetSizeList} />
            <Route path='/thickness' component={ThicknessList} />  
            <Route component={MaterialList} />
        </Switch>
        </div>
    )
    } else {
    return (
        <Switch>
            <Route component={Settings}/>
        </Switch>
        )
    }
})

export default ConnectedRouter
