import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonModal, IonPage, IonRow, IonTitle, IonToolbar, isPlatform } from '@ionic/react';
import { sync } from 'ionicons/icons';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import MTTContext from '../MTTContext';

import firebase from 'firebase/app';
import { Health } from '@ionic-native/health';
import { formatDate } from '../Helpers';
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';

const ViewGoalModal: React.FC<{
    show: boolean,
    onCancel: () => void,
    goal:any,
    groupDocRef:any
}> = props => {

    const MTT_ctx                           = useContext (MTTContext);
    const [goalCompleted, setGoalCompleted] = useState<boolean> (false);
    const [users]                           = useCollectionData (firebase.firestore ().collection ("users"), {idField: 'id'});

    let enddate:any = null;
    let goalRef:any = null;

    if (props.goal && props.groupDocRef) {
        enddate = moment (new firebase.firestore.Timestamp (props.goal.enddate.seconds, props.goal.enddate.nanoseconds).toDate ());
        goalRef = props.groupDocRef.collection ("goals").doc (props.goal.id);
    }

    const [goalDoc, loadingGoalDoc] = useDocumentData<any> (goalRef, {idField: 'id'});

    useEffect ( () => {
        
        if (! loadingGoalDoc && goalDoc && goalDoc.users) setGoalCompleted (goalDoc.users.includes (MTT_ctx.user.uid));
    }, [goalDoc, MTT_ctx, loadingGoalDoc]);

    const readData = () => {

        if ( (isPlatform ('ios') || isPlatform ('android')) && props.goal) {
    
            Health.isAvailable ().then ( (available) => {
    
                if (available) {
                    
                    if (props.goal.type === 'Distancia') {

                        Health.requestAuthorization ([{read: ['distance' ]}]).then ( () => {
                            
                            Health.queryAggregated ({
                                startDate: new firebase.firestore.Timestamp (props.goal.startdate.seconds, props.goal.startdate.nanoseconds).toDate (),
                                endDate: new firebase.firestore.Timestamp (props.goal.enddate.seconds, props.goal.enddate.nanoseconds).toDate (),
                                dataType: 'distance'
                            }).then ( (data:any) => {
                            
                                if ( data && data.value! && (parseInt (data.value!) / 1000) >= props.goal.value) {
    
                                    goalRef.update ({
                                        users: firebase.firestore.FieldValue.arrayUnion (MTT_ctx.user.uid)
                                    });
                                }
                            }).catch ( (err) => {
    
                                console.log (err);
                            });
                        }).catch ( (err) => {
    
                            console.log (err);
                        });
                    } else {
                        
                        Health.requestAuthorization ([{read: ['steps' ]}]).then ( () => {
                            
                            Health.queryAggregated ({
                                startDate: new firebase.firestore.Timestamp (props.goal.startdate.seconds, props.goal.startdate.nanoseconds).toDate (),
                                endDate: new firebase.firestore.Timestamp (props.goal.enddate.seconds, props.goal.enddate.nanoseconds).toDate (),
                                dataType: 'steps'
                            }).then ( (data:any) => {
                            
                                if ( data && data.value! && parseInt (data.value!) >= props.goal.value) {
    
                                    goalRef.update ({
                                        users: firebase.firestore.FieldValue.arrayUnion (MTT_ctx.user.uid)
                                    });
                                }
                            }).catch ( (err) => {
    
                                console.log (err);
                            });
                        }).catch ( (err) => {
    
                            console.log (err);
                        });
                    }
                }
            }).catch ( (err) => {
    
                console.log (err);
            });
        }
    };

    return (
        <IonModal isOpen={props.show}>
            {
                props.goal && (
                    <IonPage>
                        <IonHeader>
                            <IonToolbar class="ion-text-center">
                                <IonButtons slot="start">
                                    <IonButton onClick={ () => { props.onCancel(); }}>
                                        <IonLabel>Volver</IonLabel>
                                    </IonButton>
                                </IonButtons>
                                <IonTitle className="ion-text-center">Objetivo</IonTitle>
                            </IonToolbar>
                        </IonHeader>
                        <IonContent>
                            <IonGrid>
                                <IonRow>
                                    <IonCol className="ion-text-center">
                                        <h3>
                                            { props.goal.type === "Distancia" ? "Caminar / Correr " : "Subir "}
                                            { props.goal.value }
                                            { props.goal.type === "Distancia" ? " kms" : " pisos"}
                                        </h3>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol className="ion-text-center">
                                        { formatDate (props.goal.startdate, 'DD/MM/YYYY') } - { formatDate (props.goal.enddate, 'DD/MM/YYYY') }
                                    </IonCol>
                                </IonRow>
                                {
                                    MTT_ctx.userData.rol === 'Deportista' && ! goalCompleted && enddate && enddate.isSameOrAfter (moment (), 'days') && (isPlatform ('ios') || isPlatform ('android')) && (

                                        <IonRow>
                                            <IonCol>
                                                <IonButton color="success" expand="block" onClick={readData}>
                                                    <IonIcon icon={sync} slot="start"/>
                                                    <IonLabel>Sincronizar datos</IonLabel>
                                                </IonButton>
                                            </IonCol>
                                        </IonRow>
                                    )
                                }
                                <IonRow>
                                    <IonCol>
                                        <IonList>
                                            <IonItem lines="none" className="ion-text-center">
                                                <IonLabel color="secondary" className="list-title-mtt">
                                                    Objetivo completado por:
                                                </IonLabel>
                                            </IonItem>
                                                {
                                                    users && goalDoc && goalDoc.users && goalDoc.users.length > 0 && (
                                                        goalDoc.users.map ( (user_uid: string) => {
                                                            
                                                            let user_print:any = users!.find ( (u:any) => {
                                                                return user_uid === u.id;
                                                            });

                                                            return (
                                                                <IonItem lines="full" key={user_uid}>
                                                                    <IonLabel>
                                                                        { user_print?.name } {user_print?.surname}
                                                                    </IonLabel>
                                                                </IonItem>
                                                            )
                                                        })
                                                    )
                                                }
                                                {
                                                    (! users || ! goalDoc || ! goalDoc.users || goalDoc.users.length <= 0) && (
                                                        <IonItem lines="full">
                                                            <IonLabel>Ningún usuario.</IonLabel>
                                                        </IonItem>
                                                    )
                                                }
                                        </IonList>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonContent>
                    </IonPage>
                )
            }
        </IonModal>
    );
};

export default ViewGoalModal;