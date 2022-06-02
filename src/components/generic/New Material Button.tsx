import React from 'react';
import { observer } from 'mobx-react';
import { useHistory } from "react-router-dom";
import { Button } from 'primereact/button';

const NewMaterialButton = observer(() => {

  const history = useHistory();
  

  const handleClick = () =>{
      history.push("/newMaterial")
  } 

  return (
         <div>
            <Button icon="pi pi-plus" className="p-button-rounded p-button-secondary" label="New Material" onClick={handleClick} />
        </div>   
  )

})

export default NewMaterialButton
