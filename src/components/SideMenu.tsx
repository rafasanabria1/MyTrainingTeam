import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonToolbar } from '@ionic/react';
import { barbell, exitOutline, people, person } from 'ionicons/icons';
import React, { useContext } from 'react';

import firebase from 'firebase/app';
import MTTContext from '../MTTContext';


const SideMenu: React.FC = () => {

    const MTT_ctx = useContext (MTTContext);

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
                        {
                            MTT_ctx.userData.rol === 'Administrador' && (

                                <IonItem button routerLink="/users" routerDirection="none" lines="none">
                                    <IonIcon icon={people} slot="start" />
                                    <IonLabel>Lista de usuarios</IonLabel>
                                </IonItem>
                            )
                        }
                        <IonItem button routerLink="/groups" routerDirection="none" lines="none">
                            <IonIcon icon={barbell} slot="start" />
                            <IonLabel>Lista de grupos</IonLabel>
                        </IonItem>
                        <IonItem routerLink="/edit-user-profile" routerDirection="none" lines="none">
                            <IonIcon icon={person} slot="start" />
                            <IonLabel>Editar perfil</IonLabel>
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