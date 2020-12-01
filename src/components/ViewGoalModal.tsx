import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonModal, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { sync } from 'ionicons/icons';
import React, { useContext } from 'react';
import { formatDate } from '../Helpers';
import MTTContext from '../MTTContext';

const ViewGoalModal: React.FC<{
    show: boolean,
    onCancel: () => void,
    goal:any
}> = props => {

    const MTT_ctx = useContext (MTTContext);

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
                                <IonTitle>Objetivo</IonTitle>
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
                                <IonRow>
                                    <IonCol>
                                        <IonButton color="success" expand="block">
                                            <IonIcon icon={sync} slot="start"/>
                                            <IonLabel>Sincronizar datos</IonLabel>
                                        </IonButton>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                        <IonList>
                                            <IonItem lines="none" className="ion-text-center">
                                                <IonLabel color="secondary" className="list-title-mtt">
                                                    Objetivo completado por:
                                                </IonLabel>
                                            </IonItem>
                                                {
                                                    props.goal?.users && props.goal?.users.length > 0 && (
                                                        props.goal?.users.map ( (trainer: any) => (
                                                            <IonItem lines="full">
                                                                <IonLabel>
                                                                    {trainer.label}
                                                                </IonLabel>
                                                            </IonItem>
                                                        ))
                                                    )
                                                }
                                                {
                                                    props.goal?.users && props.goal?.users.length <= 0 && (
                                                        <IonItem lines="full">
                                                            <IonLabel>Ningún usuario ha completado el objetivo todavía.</IonLabel>
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