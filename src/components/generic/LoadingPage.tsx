
import React from 'react';
import { observer } from 'mobx-react';

import { ProgressSpinner } from 'primereact/progressspinner';
const LoadingPage = observer(() => {

    return (
        <div>
            <ProgressSpinner />
        </div>
    )
})

export default LoadingPage
