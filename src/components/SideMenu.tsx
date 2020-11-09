import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonToolbar } from '@ionic/react';
import { chatbubbleOutline, exitOutline, peopleOutline, personOutline } from 'ionicons/icons';
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
                        <IonItem button routerLink="/groups" routerDirection="none" lines="none">
                            <IonIcon icon={peopleOutline} slot="start"/>
                            <IonLabel>Mis grupos</IonLabel>
                        </IonItem>
                        <IonItem button routerLink="/messages" routerDirection="none" lines="none">
                            <IonIcon icon={chatbubbleOutline} slot="start"/>
                            <IonLabel>Mensajería</IonLabel>
                        </IonItem> 
                        <IonItem button routerLink="/edit-profile" routerDirection="none" lines="none">
                            <IonIcon icon={personOutline} slot="start"/>
                            <IonLabel>Mi perfil</IonLabel>
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