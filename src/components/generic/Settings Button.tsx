import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useHistory } from "react-router-dom";
import { Button } from 'primereact/button';

const SettingsButton = observer(() => {

  const history = useHistory();
  const [iconImage, setIconImage] = useState<string>('pi pi-cog')


  const handleClick = () =>{
    if(history.location.pathname === "/settings" ){
      setIconImage('pi pi-cog')
      history.push("/")
    } else {
      setIconImage('pi pi-home')
      history.push("/settings")
    }
  } 

  return (
         <div>
            <Button icon={iconImage} className="p-button-rounded p-button-secondary" onClick={handleClick} />
        </div>   
  )

})

export default SettingsButton
