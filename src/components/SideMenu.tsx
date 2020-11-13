import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonToolbar } from '@ionic/react';
import { exitOutline, linkOutline } from 'ionicons/icons';
import React from 'react';

import firebase from 'firebase/app';


const SideMenu: React.FC = () => {

    const logout = () => {

        firebase.auth ().signOut ();
    };

    return (
        <IonMenu contentId="main">
            <IonHeader translucent className="ion-text-center">
                <IonToolbar color="tertiary">
                    <IonLabel>Menú</IonLabel>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    <IonMenuToggle>
                        <IonItem button routerLink="/links" routerDirection="none" lines="none">
                            <IonIcon icon={linkOutline} slot="start"/>
                            <IonLabel>Lista de enlaces</IonLabel>
                        </IonItem>
                        <IonButton fill="clear" onClick={logout} className="ion-text-center" expand="full">
                            <IonIcon icon={exitOutline} slot="start"/>
                            <IonLabel>Cerrar sesión</IonLabel>
                        </IonButton>
                    </IonMenuToggle>
                </IonList>
            </IonContent>
        </IonMenu>
    )
};

export default SideMenu;