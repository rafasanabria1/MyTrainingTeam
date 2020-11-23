import React, { useState } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { base64FromPath } from '@ionic/react-hooks/filesystem';
import { useParams } from 'react-router';
import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonLoading, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { add, send } from 'ionicons/icons';

import EditGroupModal from '../components/EditGroupModal';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';


const Group: React.FC = () => {

    const { id }                  = useParams <any> ();
    const [group, loading, error] = useDocumentData <any> (firebase.firestore ().collection ("groups").doc (id), {idField: 'id'});
  
    const [isEditing, setIsEditing] = useState<boolean> (false);
    
    const cancelEditGroup = () => {

        setIsEditing (false);
    };

    const saveGroup = (group_updated:any ) => {

        if (group_updated.photoPreview) {

            base64FromPath (group_updated.photoPreview).then ( (base64ProfileImg: any) => {
                
                var profileImgRef       = firebase.storage ().ref ().child('groups-images/' + group.id);
                profileImgRef.putString (base64ProfileImg, 'data_url').then (function (snapshot) {
                    
                    snapshot.ref.getDownloadURL ().then ( (downloadURL) => {

                        delete group_updated.photoPreview;
                        group_updated.groupImg = downloadURL;
                        firebase.firestore ().collection ("groups").doc (group.id).update (group_updated).then ( () => {
                            
                            cancelEditGroup ();
                        }).catch ( (err) => {
                            
                            console.log (err);
                        });
                    });
                }).catch ( (err) => {

                    console.log (err);
                });
            });
        } else {

            firebase.firestore ().collection ("groups").doc (group.id).update (group_updated).then ( () => {

                cancelEditGroup ();
            }).catch ( (err) => {
                
                console.log (err);
            });
        }

    };


    return (
        <IonPage>
            <EditGroupModal 
                show={isEditing}
                onCancel={cancelEditGroup}
                onSave={saveGroup}
                editGroup={group}
            />
            {
				loading && (
					<IonLoading isOpen={loading}></IonLoading>
				)
			}
			{
				(! loading ) && (
                    <React.Fragment>
                        <IonHeader>
                            <IonToolbar class="ion-text-center">
                                <IonButtons slot="start">
                                    <IonBackButton defaultHref="/groups" text=""/>
                                </IonButtons>
                                <IonTitle>{group.name}</IonTitle>
                                <IonButtons slot="end">
                                    <IonButton onClick={ () => { setIsEditing (true); }}>
                                        <IonLabel>Editar</IonLabel>
                                    </IonButton>
                                </IonButtons>
                            </IonToolbar>
                        </IonHeader>
                        <IonContent fullscreen>
                            { group.groupImg && (
                                <img src={group.groupImg} alt={group.name}/>
                            )}
                            <IonGrid>
                                <IonRow className="ion-text-center">
                                    <IonCol>
                                        <IonLabel color="secondary">{group.name}</IonLabel>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol className="ion-text-justify">
                                        <IonLabel>{group.description}</IonLabel>
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
                    </React.Fragment>
                )
            }
        </IonPage>
    );
};

export default Group;