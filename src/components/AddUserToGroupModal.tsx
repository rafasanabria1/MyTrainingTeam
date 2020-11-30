import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonLabel, IonModal, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';

import Select from 'react-select';

const AddUserToGroupModal: React.FC<{
    show: boolean,
    type: string,
    users: any[]
    onCancel: () => void,
    onSave: (obj:any) => void
}> = props => {

    const [selectedUser, setSelectedUser] = useState<any> (null);
    const changeSelector = (obj:any) => {

        setSelectedUser (obj);
    };

    return (
        <IonModal isOpen={props.show} swipeToClose={false} cssClass="add-user-modal">
            <IonPage>
                <IonHeader>
                    <IonToolbar class="ion-text-center">
                        <IonButtons slot="start">
                            <IonButton onClick={ () => { props.onCancel(); }}>
                                <IonLabel>Cancelar</IonLabel>
                            </IonButton>
                        </IonButtons>
                        <IonTitle>Asignar {props.type}</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={ () => props.onSave (selectedUser) }>
                                <IonLabel>Guardar</IonLabel>
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                    </IonHeader>
                    <IonContent >
                        <IonGrid>
                            <IonRow>
                                <IonCol className="ion-text-center">
                                    <h3 className="ion-text-center">Seleccione un usuario</h3>
                                    <Select 
                                        isSearchable 
                                        options={props.users} 
                                        onChange={changeSelector}
                                        isOptionDisabled={ (option) => { return option.disabled }}
                                    />
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonContent>
            </IonPage>
        </IonModal>
    )
}

export default AddUserToGroupModal;