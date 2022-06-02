import React from 'react';
import { observer } from 'mobx-react';
import { useStores } from '../RootStoreProvider';
import { RootStore } from '../../models/root-store';
import { Route, Switch } from 'react-router-dom';
import Settings from '../generic/Settings';
import Modifications from '../Modifications/Modifications';
import SheetSizeList from '../Sheet Size List/SheetSizeList';
import ThicknessList from '../Thickness List/ThicknessList';
import SearchSelect from '../Select Search Type/SearchSelect';
import NewMaterial from '../New Material/NewMaterial'


const ConnectedRouter = observer(() => {

  const rootStore: RootStore = useStores();
    if (rootStore.databaseConnection){
    return (
        <div className='h-full' style={{padding:"5px"}}>
            <Switch>
                <Route path='/settings' component={Settings} />
                <Route path='/modifications' component={Modifications} />
                <Route path='/sheets' component={SheetSizeList} />
                <Route path='/thickness' component={ThicknessList} />  
                <Route path='/newMaterial' component={NewMaterial} />
                <Route component={SearchSelect} />
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
