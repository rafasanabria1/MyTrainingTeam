import React from 'react';
import { IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { add } from 'ionicons/icons';

const Groups: React.FC = () => {
      
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar class="ion-text-center">
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Groups</IonTitle>
                    <IonButtons slot="end">
                        <IonIcon icon={add} slot="icon-only" />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonCard>
                    <img src="https://dummyimage.com/600x300/000/fff.png&text=Foto+de+perfil+de+grupo" alt="Madison, WI"/>
                    <IonCardHeader>
                        <IonCardTitle>Madison, WI</IonCardTitle>
                        <IonCardSubtitle className="ion-no-margin">Destination</IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                        Founded in 1829 on an isthmus between Lake Monona and Lake Mendota, Madison was named the capital of the Wisconsin Territory in 1836.
                    </IonCardContent>
                </IonCard>
                <IonCard>
                    <img src="https://dummyimage.com/600x300/000/fff.png&text=Foto+de+perfil+de+grupo" alt="Madison, WI"/>
                    <IonCardHeader>
                        <IonCardTitle>Madison, WI</IonCardTitle>
                        <IonCardSubtitle className="ion-no-margin">Destination</IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                        Founded in 1829 on an isthmus between Lake Monona and Lake Mendota, Madison was named the capital of the Wisconsin Territory in 1836.
                    </IonCardContent>
                </IonCard>
                <IonCard>
                    <img src="https://dummyimage.com/600x300/000/fff.png&text=Foto+de+perfil+de+grupo" alt="Madison, WI"/>
                    <IonCardHeader>
                        <IonCardTitle>Madison, WI</IonCardTitle>
                        <IonCardSubtitle className="ion-no-margin">Destination</IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                        Founded in 1829 on an isthmus between Lake Monona and Lake Mendota, Madison was named the capital of the Wisconsin Territory in 1836.
                    </IonCardContent>
                </IonCard>
                <IonCard>
                    <img src="https://dummyimage.com/600x300/000/fff.png&text=Foto+de+perfil+de+grupo" alt="Madison, WI"/>
                    <IonCardHeader>
                        <IonCardTitle>Madison, WI</IonCardTitle>
                        <IonCardSubtitle className="ion-no-margin">Destination</IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                        Founded in 1829 on an isthmus between Lake Monona and Lake Mendota, Madison was named the capital of the Wisconsin Territory in 1836.
                    </IonCardContent>
                </IonCard>
                <IonCard>
                    <img src="https://dummyimage.com/600x300/000/fff.png&text=Foto+de+perfil+de+grupo" alt="Madison, WI"/>
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