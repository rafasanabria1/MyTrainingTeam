import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { add, send } from 'ionicons/icons';
import React from 'react';
import { useParams } from 'react-router';

const Group: React.FC = () => {

    const { id } = useParams <any> ();
      
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar class="ion-text-center">
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Madison, WI</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <img src="https://dummyimage.com/600x300/000/fff.png&text=Foto+de+perfil+de+grupo" alt="Madison, WI"/>
                <IonGrid>
                    <IonRow className="ion-text-center">
                        <IonCol>
                            <IonLabel>Destination</IonLabel>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol className="ion-text-justify">
                            <IonLabel>Founded in 1829 on an isthmus between Lake Monona and Lake Mendota, Madison was named the capital of the Wisconsin Territory in 1836.</IonLabel>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonList>
                                <IonListHeader>
                                    <IonLabel color="secondary">Profesores del grupo</IonLabel>
                                    <IonButton>
                                        <IonIcon icon={add} slot="icon-only" color="primary"/>
                                    </IonButton>
                                </IonListHeader>
                                <IonItem lines="full">
                                    <IonLabel>
                                        Rafael Sanabria
                                    </IonLabel>
                                    <IonIcon icon={send} slot="end" color="primary"/>
                                </IonItem>
                                <IonItem lines="full">
                                    <IonLabel>
                                        Alejandro Sanabria
                                    </IonLabel>
                                    <IonIcon icon={send} slot="end" color="primary" />
                                </IonItem>
                            </IonList>
                            <IonList>
                                <IonListHeader>
                                    <IonLabel color="secondary">
                                        Participantes del grupo
                                    </IonLabel>
                                    <IonButton>
                                        <IonIcon icon={add} slot="icon-only" color="primary"/>
                                    </IonButton>
                                </IonListHeader>
                                <IonItem lines="full">
                                    <IonLabel>
                                        Rafael Sanabria
                                    </IonLabel>
                                    <IonIcon icon={send} slot="end" color="primary" />
                                </IonItem>
                                <IonItem lines="full">
                                    <IonLabel>
                                        Alejandro Sanabria
                                    </IonLabel>
                                    <IonIcon icon={send} slot="end" color="primary" />
                                </IonItem>
                            </IonList>
                            <IonList>
                                <IonListHeader>
                                    <IonLabel color="secondary">Objetivos actuales</IonLabel>
                                    <IonButton>
                                        <IonIcon icon={add} slot="icon-only" color="primary" />
                                    </IonButton>
                                </IonListHeader>
                                <IonItem lines="full">
                                    <IonLabel className="ion-float-left">
                                        Caminar 10 KM
                                    </IonLabel>
                                    <IonLabel className="ion-float-right ion-text-right ion-text-small">
                                        01/11/2020 - 15/11/2020
                                    </IonLabel>
                                </IonItem>
                                <IonItem lines="full">
                                    <IonLabel className="ion-float-left">
                                        Caminar 20 KM
                                    </IonLabel>
                                    <IonLabel className="ion-float-right ion-text-right ion-text-small">
                                        01/11/2020 - 25/11/2020
                                    </IonLabel>
                                </IonItem>
                                <IonItem lines="full">
                                    <IonLabel className="ion-float-left">
                                        Subir 30 pisos
                                    </IonLabel>
                                    <IonLabel className="ion-float-right ion-text-right ion-text-small">
                                        01/11/2020 - 14/11/2020
                                    </IonLabel>
                                </IonItem>
                            </IonList>
                            <IonList>
                                <IonListHeader>
                                    <IonLabel color="secondary">Histórico de objetivos</IonLabel>
                                </IonListHeader>
                                <IonItem lines="full">
                                    <IonLabel className="ion-float-left">
                                        Caminar 10 KM
                                    </IonLabel>
                                    <IonLabel className="ion-float-right ion-text-right ion-text-small">
                                        01/11/2020 - 15/11/2020
                                    </IonLabel>
                                </IonItem>
                                <IonItem lines="full">
                                    <IonLabel className="ion-float-left">
                                        Caminar 20 KM
                                    </IonLabel>
                                    <IonLabel className="ion-float-right ion-text-right ion-text-small">
                                        01/11/2020 - 25/11/2020
                                    </IonLabel>
                                </IonItem>
                                <IonItem lines="full">
                                    <IonLabel className="ion-float-left">
                                        Subir 30 pisos
                                    </IonLabel>
                                    <IonLabel className="ion-float-right ion-text-right ion-text-small">
                                        01/11/2020 - 14/11/2020
                                    </IonLabel>
                                </IonItem>
                            </IonList>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Group;