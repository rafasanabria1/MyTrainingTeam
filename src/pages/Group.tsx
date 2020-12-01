import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { base64FromPath } from '@ionic/react-hooks/filesystem';
import { IonAlert, IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonLoading, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { add, eye, pencil, personAdd, personRemove, trash } from 'ionicons/icons';

import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';

import EditGroupModal from '../components/EditGroupModal';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

import AddUserToGroupModal from '../components/AddUserToGroupModal';
import EditGoalModal from '../components/EditGoalModal';

import { formatDate } from '../Helpers';
import moment from 'moment';
import ViewGoalModal from '../components/ViewGoalModal';

import { Health } from '@ionic-native/health';

interface GroupIdProps extends RouteComponentProps<{
    groupid: string;
}> {}
const Group: React.FC<GroupIdProps|null> = ({match}) => {

    const groupDocRef      = firebase.firestore ().collection ("groups").doc (match.params.groupid);
    const [group, loading] = useDocumentData<any> (groupDocRef, {idField: 'id'});

    const [trainers] = useCollectionData<any> (firebase.firestore ().collection ("users").where ('rol', '==', 'Entrenador'), {idField: 'id'});
    const [athletes] = useCollectionData<any> (firebase.firestore ().collection ("users").where ('rol', '==', 'Deportista'), {idField: 'id'});

    const [goals] = useCollectionData<any> (groupDocRef.collection ("goals"), {idField: 'id'});
    const [currentGoals, setCurrentGoals] = useState<any[]> ([]);
    const [pastGoals, setPastGoals] = useState<any[]> ([]);
   
    const [allTrainers, setAllTrainers] = useState<any []> ([]);
    const [allAthletes, setAllAthletes] = useState<any []> ([]);

    const [currentTrainers, setCurrentTrainers] = useState<any []> ([]);
    const [currentAthletes, setCurrentAthletes] = useState<any []> ([]);

    const [isAddingUser, setIsAddingUser] = useState<boolean> (false);
    const [usersAdd, setUsersAdd]         = useState<any []> ([]);
    const [typeUserAdd, setTypeUserAdd]   = useState<string> ('');

    const [isEditing, setIsEditing] = useState<boolean> (false);

    const [isEditingGoal, setIsEditingGoal] = useState<boolean> (false);
    const [selectedGoal, setSelectedGoal]   = useState<any> (null);

    const [isViewingGoal, setIsViewingGoal] = useState<boolean> (false);
    
    const [isDeletingGoal, setIsDeletingGoal] = useState<boolean> (false);


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
    
    useEffect ( () => {

        let curGoals:any[]  = [];
        let pasGoals:any[] = [];
        if (goals && goals.length > 0) {

            curGoals = goals.filter ( goal => {
                
                let enddate = moment (new firebase.firestore.Timestamp (goal.enddate.seconds, goal.enddate.nanoseconds).toDate ());
                return enddate.isSameOrAfter (moment (), 'days');
            } );

            pasGoals = goals.filter ( goal => {

                let enddate = moment (new firebase.firestore.Timestamp (goal.enddate.seconds, goal.enddate.nanoseconds).toDate ())
                return enddate.isBefore (moment (), 'days');
            });
        }
        setCurrentGoals (curGoals);
        setPastGoals (pasGoals);

    }, [goals]);

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

    const cancelAddingUserToGroup = () => {

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

    const saveAddingUserToGroup = (userData:any) => {

        if (userData) {

            if (typeUserAdd === 'Deportista') {
                
                groupDocRef.update ({
                    athletes: firebase.firestore.FieldValue.arrayUnion (userData.value)
                }).then ( () => {
                    
                    cancelAddingUserToGroup ();
                }).catch ( (err) => {
                    
                    console.log (err);
                    cancelAddingUserToGroup ();
                });
            } else {
                
                groupDocRef.update ({
                    trainers: firebase.firestore.FieldValue.arrayUnion (userData.value)
                }).then ( () => {
                    
                    cancelAddingUserToGroup ();
                }).catch ( (err) => {
                    
                    console.log (err);
                    cancelAddingUserToGroup ();
                });
            }
        }
    };

    const addGoalHandler = () => {

        setIsEditingGoal (true);
        setSelectedGoal (null);
    };

    const cancelEditGoal = () => {

        setIsEditingGoal (false);
        setSelectedGoal (null);
    }

    const saveGoal = (goal:any) => {

        if (goal) {
            if (selectedGoal) {

                groupDocRef.collection ("goals").doc (selectedGoal.id).update (goal).then ( () => {

                    cancelEditGoal ();
                }).catch ( (err) => {

                    console.log (err);
                    cancelEditGoal ();
                });
            } else {

                groupDocRef.collection ("goals").add (goal).then ( () => {

                    cancelEditGoal ();
                }).catch ( (err) => {

                    console.log (err);
                    cancelEditGoal ();
                });
            }
        }
    };

    const editGoalHandler = (goal:any) => {

        setIsEditingGoal (true);
        setSelectedGoal (goal);
    };

    const viewGoalHandler = (goal:any) => {

        setSelectedGoal (goal);
        setIsViewingGoal (true);
    };

    const cancelViewGoal = () => {

        setIsViewingGoal (false);
        setSelectedGoal (null);
    }


    const deleteGoalHandler = (goal:any) => {

        setSelectedGoal (goal);
        setIsDeletingGoal (true);
    };

    const cancelDeleteGoal = () => {

        setIsDeletingGoal (false);
        setSelectedGoal (null);
    }

    const deleteGoal = () => {

        groupDocRef.collection ("goals").doc (selectedGoal.id).delete ().catch ( (err) => {

            cancelDeleteGoal ();
            console.log (err);
        });
    };

    // console.log (Health.isAvailable ());
    // console.log (Health.isAuthorized ());
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
                        <IonAlert isOpen={isDeletingGoal} header="Eliminar objetivo" message={'Esta acción no podrá deshacerse'}
                            onDidDismiss={ () => cancelDeleteGoal } buttons={
                                [
                                    {
                                        text: 'Cancelar',
                                        role: 'cancel',
                                        cssClass: 'secondary',
                                        handler: () => { cancelDeleteGoal (); }
                                    },
                                        {
                                        text: 'Si, borrar',
                                        handler: () => { deleteGoal (); }
                                    }  
                                ]}
                        />
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
                            onCancel={cancelAddingUserToGroup}
                            onSave={saveAddingUserToGroup}
                        />
                        <EditGoalModal
                            show={isEditingGoal}
                            onCancel={cancelEditGoal}
                            onSave={saveGoal}
                            editGoal={selectedGoal}
                        />
                        <ViewGoalModal
                            show={isViewingGoal}
                            onCancel={cancelViewGoal}
                            goal={selectedGoal}
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
                                    <IonButton onClick={addGoalHandler}>
                                        <IonIcon icon={add} slot="icon-only" color="primary" />
                                    </IonButton>
                                </IonListHeader>
                                {
                                    currentGoals.length > 0 && currentGoals.map ( (goalDoc: any) => (
                                    
                                        <IonCard key={goalDoc.id}>
                                            <IonCardHeader className="ion-text-center ion-no-padding">
                                                <h5>
                                                    { goalDoc.type === "Distancia" ? "Caminar / Correr " : "Subir "}
                                                    { goalDoc.value }
                                                    { goalDoc.type === "Distancia" ? " kms" : " pisos"}
                                                </h5>
                                            </IonCardHeader>
                                            <IonCardContent className="ion-text-center ion-no-padding">
                                                { formatDate (goalDoc.startdate, 'DD/MM/YYYY') } - { formatDate (goalDoc.enddate, 'DD/MM/YYYY') }
                                            </IonCardContent>
                                            <IonGrid>
                                                <IonRow>
                                                    <IonCol className="ion-text-left">
                                                        <IonButton color="warning" expand="block" size="small" fill="clear" onClick={ () => editGoalHandler (goalDoc)}>
                                                            <IonLabel>Editar</IonLabel>
                                                            <IonIcon icon={pencil} slot="end"/>
                                                        </IonButton>
                                                    </IonCol>
                                                    <IonCol className="ion-text-center">
                                                        <IonButton color="success" expand="block" size="small" fill="clear" onClick={ () => viewGoalHandler (goalDoc)}>
                                                            <IonLabel>Ver</IonLabel>
                                                            <IonIcon icon={eye} slot="end"/>
                                                        </IonButton>
                                                    </IonCol>
                                                    <IonCol className="ion-text-right">
                                                        <IonButton color="danger" expand="block" size="small" fill="clear" onClick={ () => deleteGoalHandler (goalDoc)}>
                                                            <IonLabel>Eliminar</IonLabel>
                                                            <IonIcon icon={trash} slot="end"/>
                                                        </IonButton>
                                                    </IonCol>
                                                </IonRow>
                                            </IonGrid>
                                        </IonCard>
                                    ))
                                }
                                {
                                    currentGoals.length <= 0 && (
                                        <IonItem lines="full">No hay ningún objetivo en curso.</IonItem>
                                    )
                                }
                                <IonListHeader>
                                    <IonLabel color="secondary">Histórico de objetivos</IonLabel>
                                </IonListHeader>
                                {
                                    pastGoals.length > 0 && pastGoals.map ( (goalDoc: any) => (
                                    
                                        <IonCard key={goalDoc.id}>
                                            <IonCardHeader className="ion-text-center ion-no-padding">
                                                <h5>
                                                    { goalDoc.type === "Distancia" ? "Caminar / Correr " : "Subir "}
                                                    { goalDoc.value }
                                                    { goalDoc.type === "Distancia" ? " kms" : " pisos"}
                                                </h5>
                                            </IonCardHeader>
                                            <IonCardContent className="ion-text-center ion-no-padding-top">
                                                { formatDate (goalDoc.startdate, 'DD/MM/YYYY') } - { formatDate (goalDoc.enddate, 'DD/MM/YYYY') }
                                            </IonCardContent>
                                            <IonGrid>
                                                <IonRow>
                                                    <IonCol className="ion-text-center" offset="4" size="4">
                                                        <IonButton color="success" expand="block" size="small" fill="clear" onClick={ () => viewGoalHandler (goalDoc)}>
                                                            <IonLabel>Ver</IonLabel>
                                                            <IonIcon icon={eye} slot="end"/>
                                                        </IonButton>
                                                    </IonCol>
                                                </IonRow>
                                            </IonGrid>
                                        </IonCard>
                                    ))
                                }
                                {
                                    pastGoals.length <= 0 && (
                                        <IonItem lines="full">No hay ningún objetivo pasado.</IonItem>
                                    )
                                }
                            </IonList>
                        </IonContent>
                    </React.Fragment>
                )
            }
        </IonPage>
    );
};

export default Group;