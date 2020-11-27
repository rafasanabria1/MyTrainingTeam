import { IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

const Links: React.FC = () => {

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar class="ion-text-center">
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Links</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonList>
                    <IonItem routerLink="/users">
                        <IonLabel>Lista de usuarios</IonLabel>
                    </IonItem>
                    <IonItem routerLink="/groups">
                        <IonLabel>Lista de grupos</IonLabel>
                    </IonItem>
                    <IonItem routerLink="/groups/asdf">
                        <IonLabel>Detalle de grupo</IonLabel>
                    </IonItem>
                    <IonItem routerLink="/edit-user-profile">
                        <IonLabel>Editar perfil</IonLabel>
                    </IonItem>
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default Links;