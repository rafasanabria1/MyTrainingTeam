import { IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

const Groups: React.FC = () => {
      
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar class="ion-text-center">
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Groups</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Madison, WI</IonCardTitle>
                        <IonCardSubtitle className="ion-no-margin">Destination</IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                        Founded in 1829 on an isthmus between Lake Monona and Lake Mendota, Madison was named the capital of the Wisconsin Territory in 1836.
                    </IonCardContent>
                </IonCard>
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Madison, WI</IonCardTitle>
                        <IonCardSubtitle className="ion-no-margin">Destination</IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                        Founded in 1829 on an isthmus between Lake Monona and Lake Mendota, Madison was named the capital of the Wisconsin Territory in 1836.
                    </IonCardContent>
                </IonCard>
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Madison, WI</IonCardTitle>
                        <IonCardSubtitle className="ion-no-margin">Destination</IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                        Founded in 1829 on an isthmus between Lake Monona and Lake Mendota, Madison was named the capital of the Wisconsin Territory in 1836.
                    </IonCardContent>
                </IonCard>
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Madison, WI</IonCardTitle>
                        <IonCardSubtitle className="ion-no-margin">Destination</IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                        Founded in 1829 on an isthmus between Lake Monona and Lake Mendota, Madison was named the capital of the Wisconsin Territory in 1836.
                    </IonCardContent>
                </IonCard>
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Madison, WI</IonCardTitle>
                        <IonCardSubtitle className="ion-no-margin">Destination</IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                        Founded in 1829 on an isthmus between Lake Monona and Lake Mendota, Madison was named the capital of the Wisconsin Territory in 1836.
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default Groups;