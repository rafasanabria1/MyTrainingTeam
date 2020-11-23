import { IonAlert, IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonLoading, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { add, send } from 'ionicons/icons';
import React, { useState } from 'react';
import { useParams } from 'react-router';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import { useDocumentOnce } from 'react-firebase-hooks/firestore';
import { useDownloadURL } from 'react-firebase-hooks/storage';


const Group: React.FC = () => {

    const { id }            = useParams <any> ();
    const [showAlertDelete, setShowAlertDelete] = useState<boolean> (false);

    const [group, loading, errorGroup] = useDocumentOnce (firebase.firestore ().doc ('groups/' + id));
    const [imgPath, loadingImg, errorImg] = useDownloadURL (firebase.storage ().ref ('groups-images/' + id));
  
    const deleteGroupHandler = () => {

        setShowAlertDelete (true);
    };

    const deleteGroup = () => {

        
    };

    return (
        <IonPage>
            {
				loading && (
					<IonLoading isOpen={loading}></IonLoading>
				)
			}
			{
				(! loading ) && (
                    <React.Fragment>
                        <IonAlert header="¿Desea eliminar el grupo?" subHeader="Esta acción no podrá deshacerse." isOpen={showAlertDelete} onDidDismiss={ () => {setShowAlertDelete (false); }} buttons={
                            [
                                {
                                    text: 'Cancelar',
                                    role: 'cancel',
                                    cssClass: 'secondary',
                                    handler: () => {
                                        setShowAlertDelete (false);
                                    }
                                },
                                    {
                                    text: 'Si, borrar',
                                    handler: () => {
                                        deleteGroup ();
                                    }
                                }  
                            ]}
                        />
                        <IonHeader>
                            <IonToolbar class="ion-text-center">
                                <IonButtons slot="start">
                                    <IonBackButton defaultHref="/groups" text=""/>
                                </IonButtons>
                                <IonTitle>{group.get ('name')}</IonTitle>
                            </IonToolbar>
                        </IonHeader>
                        <IonContent fullscreen>
                            { ! loadingImg && (
                                <img src={imgPath} alt={group.get ('name')}/>
                            )}
                            <IonGrid>
                                <IonRow className="ion-text-center">
                                    <IonCol>
                                        <IonLabel color="secondary">{group.get ('name')}</IonLabel>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol className="ion-text-justify">
                                        <IonLabel>{group.get ('description')}</IonLabel>
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
                                <IonRow>
                                    <IonCol>
                                        <IonButton expand="full" color="danger" onClick={deleteGroupHandler}>
                                            <IonLabel>Borrar grupo</IonLabel>
                                        </IonButton>

                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonContent>
                    </React.Fragment>
                )
            }
        </IonPage>
    );
};

export default Group;