import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { base64FromPath } from '@ionic/react-hooks/filesystem';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonLoading, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { add, personAdd, personRemove } from 'ionicons/icons';

import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';

import EditGroupModal from '../components/EditGroupModal';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

import AddUserToGroupModal from '../components/AddUserToGroupModal';

interface GroupIdProps extends RouteComponentProps<{
    groupid: string;
}> {}
const Group: React.FC<GroupIdProps|null> = ({match}) => {

    const groupDocRef = firebase.firestore ().collection ("groups").doc (match.params.groupid);
    const [isAddingUser, setIsAddingUser] = useState<boolean> (false);
    const [usersAdd, setUsersAdd]         = useState<any []> ([]);
    const [typeUserAdd, setTypeUserAdd]   = useState<string> ('');

    const [allTrainers, setAllTrainers] = useState<any []> ([]);
    const [allAthletes, setAllAthletes] = useState<any []> ([]);

    const [currentTrainers, setCurrentTrainers] = useState<any []> ([]);
    const [currentAthletes, setCurrentAthletes] = useState<any []> ([]);

    const [group, loading] = useDocumentData<any> (groupDocRef, {idField: 'id'});
    const [trainers] = useCollectionData<any> (firebase.firestore ().collection ("users").where ('rol', '==', 'Entrenador'), {idField: 'id'});
    const [athletes] = useCollectionData<any> (firebase.firestore ().collection ("users").where ('rol', '==', 'Athletes'), {idField: 'id'});

    useEffect ( () => {

        let allTrainersAux:any[]     = [];
        let currentTrainersAux:any[] = [];
        if (trainers && trainers!.length > 0) {
            
            trainers!.forEach ( (trainer) => {

                if (group.trainers) {
                    if (group.trainers.includes (trainer.id)) {
                        allTrainersAux.push ({value: trainer.id, label: trainer.name + ' ' + trainer.surname, disabled: true});
                        return;
                    }
                }
                allTrainersAux.push ({value: trainer.id, label: trainer.name + ' ' + trainer.surname});
            });

            if (group.trainers) {
                currentTrainersAux = allTrainersAux.filter ( trainer => group.trainers.includes (trainer.value));
            }
        }

        setAllTrainers (allTrainersAux);
        setCurrentTrainers (currentTrainersAux);
    }, [trainers, group]);
    
    useEffect ( () => {
        
        let allAthletesAux:any[]     = [];
        let currentAthletesAux:any[] = [];
        if (athletes && athletes!.length > 0) {

            athletes!.forEach ( (athlete) => {
                
                if (group.athletes) {
                    if (group.athletes.includes (athlete.id)) {
                        allAthletesAux.push ({value: athlete.id, label: athlete.name + ' ' + athlete.surname, disabled: true});
                        return;
                    }
                }
                allAthletesAux.push ({value: athlete.id, label: athlete.name + ' ' + athlete.surname});
            });
            
            if (group.athletes) {
                currentAthletesAux = allAthletesAux.filter ( athlete => group.athletes.includes (athlete.value));
            }
        }
        setAllAthletes (allAthletesAux);
        setCurrentAthletes (currentAthletesAux);
    }, [athletes, group]);

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
                        groupDocRef.update (group_updated).then ( () => {
                            
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

            groupDocRef.update (group_updated).then ( () => {

                cancelEditGroup ();
            }).catch ( (err) => {
                
                console.log (err);
            });
        }

    };

    const addAthleteHandler = () => {

        setTypeUserAdd ('Deportista');
        setIsAddingUser (true);
        setUsersAdd (allAthletes!);
    }
    
    const addTrainerHandler = () => {

        setTypeUserAdd ('Entrenador');
        setIsAddingUser (true);
        setUsersAdd (allTrainers!);
    };

    const cancelAddingUser = () => {

        setTypeUserAdd ('');
        setIsAddingUser (false);
        setUsersAdd ([]);
    };

    const removeUserFromGroup = (typeUserRemove: string, userData:any, event: any) => {

        event?.stopPropagation ();
        event?.preventDefault ();

        if (userData) {

            if (typeUserRemove === 'Deportista') {
                
                groupDocRef.update ({
                    athletes: firebase.firestore.FieldValue.arrayRemove (userData.value)
                }).catch ( (err) => {
                    
                    console.log (err);
                });
            } else {
                
                groupDocRef.update ({
                    trainers: firebase.firestore.FieldValue.arrayRemove (userData.value)
                }).catch ( (err) => {
                    
                    console.log (err);
                });
            }
        }
    }

    const saveAddingUser = (userData:any) => {

        if (userData) {

            if (typeUserAdd === 'Deportista') {
                
                groupDocRef.update ({
                    athletes: firebase.firestore.FieldValue.arrayUnion (userData.value)
                }).then ( () => {
                    
                    cancelAddingUser ();
                }).catch ( (err) => {
                    
                    console.log (err);
                    cancelAddingUser ();
                });
            } else {
                
                groupDocRef.update ({
                    trainers: firebase.firestore.FieldValue.arrayUnion (userData.value)
                }).then ( () => {
                    
                    cancelAddingUser ();
                }).catch ( (err) => {
                    
                    console.log (err);
                    cancelAddingUser ();
                });
            }
        }
    };

    return (
        <IonPage>
            
            {
				loading && (
					<IonLoading isOpen={loading !!}></IonLoading>
				)
			}
			{
				! loading && group && (
                    <React.Fragment>
                        <EditGroupModal 
                            show={isEditing}
                            onCancel={cancelEditGroup}
                            onSave={saveGroup}
                            editGroup={group}
                        />
                        <AddUserToGroupModal 
                            show={isAddingUser}
                            type={typeUserAdd}
                            users={usersAdd}
                            onCancel={cancelAddingUser}
                            onSave={saveAddingUser}
                        />
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
                            <IonList>
                                <IonItem lines="none" className="ion-text-center">
                                    <IonLabel color="secondary">{group.name}</IonLabel>
                                </IonItem>
                                <IonItem lines="none" className="ion-text-justify">
                                    <IonLabel>{group.description}</IonLabel>
                                </IonItem>
                            </IonList>
                            <IonList>
                                <IonItem lines="none" detail={false} mode="md">
                                    <IonLabel color="secondary" className="list-title-mtt">
                                        Profesores del grupo
                                    </IonLabel>
                                    <IonButton onClick={addTrainerHandler} fill="clear">
                                        <IonIcon icon={personAdd} slot="icon-only" color="primary" size="small"/>
                                    </IonButton>
                                </IonItem>
                                {
                                    currentTrainers && currentTrainers.length > 0 && (
                                        currentTrainers.map ( (trainer: any) => (
                                            <IonItem lines="full" routerLink={`/users/detail/${trainer.value}`} routerDirection="forward" key={trainer.value} detail={false} mode="md">
                                                <IonLabel>
                                                    {trainer.label}
                                                </IonLabel>
                                                <IonButton onClick={ (e) => removeUserFromGroup ("Entrenador", trainer, e)} fill="clear" >
                                                    <IonIcon icon={personRemove} slot="icon-only" color="danger" size="small"/>
                                                </IonButton>
                                            </IonItem>
                                        ))
                                    )
                                }
                                {
                                    currentTrainers.length <= 0 && (
                                        <IonItem lines="full">
                                            <IonLabel>Ningún entrenador asignado</IonLabel>
                                        </IonItem>
                                    )
                                }
                                <IonItem lines="none" detail={false} mode="md">
                                    <IonLabel color="secondary" className="list-title-mtt">
                                        Deportistas del grupo
                                    </IonLabel>
                                    <IonButton onClick={addAthleteHandler} fill="clear">
                                        <IonIcon icon={personAdd} slot="icon-only" color="primary" size="small"/>
                                    </IonButton>
                                </IonItem>
                                {
                                    currentAthletes && currentAthletes.length > 0 && (
                                        currentAthletes.map ( (athlete: any) => (
                                            <IonItem lines="full" routerLink={`/users/detail/${athlete.value}`} routerDirection="forward" key={athlete.value} detail={false} mode="md">
                                                <IonLabel>
                                                    {athlete.label}
                                                </IonLabel>
                                                <IonButton onClick={ (e) => removeUserFromGroup ("Deportista", athlete, e)} fill="clear"> 
                                                    <IonIcon icon={personRemove} slot="icon-only" color="danger" size="small"/>
                                                </IonButton>
                                            </IonItem>
                                        ))
                                    )
                                }
                                {
                                    currentAthletes.length <= 0 && (
                                        <IonItem lines="full">
                                            <IonLabel>Ningún deportista asignado</IonLabel>
                                        </IonItem>
                                    )
                                }
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
                        </IonContent>
                    </React.Fragment>
                )
            }
        </IonPage>
    );
};

export default Group;