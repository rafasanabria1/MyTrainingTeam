import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { useParams } from 'react-router';

const Group: React.FC = () => {

    const { id } = useParams <any> ();

    console.log (id);
      
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar class="ion-text-center">
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Grupo</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                ID: { id }
            </IonContent>
        </IonPage>
    );
};

export default Group;