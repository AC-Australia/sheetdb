import React from 'react';
import { observer } from 'mobx-react';
import { useHistory } from "react-router-dom";
import { Button } from 'primereact/button';

const SettingsButton = observer(() => {

  const history = useHistory();
  const handleSettingsClick = () =>{
    history.push("/settings")
  }
    return (
        <div>
            <Button icon="pi pi-cog" className="p-button-rounded p-button-secondary" onClick={handleSettingsClick} />
        </div>
    )
})

export default SettingsButton
