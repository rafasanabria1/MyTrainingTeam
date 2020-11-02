import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

const Messages: React.FC = () => {

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary" class="ion-text-center">
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Messages</IonTitle>
                    </IonToolbar>
                </IonHeader>
            <IonContent>
                <h2>This works - messages page!</h2>
            </IonContent>
        </IonPage>
    );
};

export default Messages;