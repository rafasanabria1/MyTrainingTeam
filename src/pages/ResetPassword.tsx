import React from 'react';
import { IonButton, IonCol, IonContent, IonGrid, IonInput, IonItem, IonLabel, IonPage, IonRow } from '@ionic/react';

const ResetPassword: React.FC = () => {

    return (
        <IonPage>
            <IonContent fullscreen className="ion-padding ion-text-center">
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <img src="assets/images/icon.png" alt="My Training Team" width="512px"/>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                        <IonItem className="ion-no-padding ion-text-center">
                                <IonLabel position="stacked">E-mail</IonLabel>
                                <IonInput type="email" placeholder="E-mail" ></IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow className="ion-margin-top">
                        <IonCol>
                            <IonButton color="primary" expand="block">
                                <IonLabel>Recordar contraseña</IonLabel>
                            </IonButton>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonButton color="secondary" fill="clear" routerLink="/login" routerDirection="none">
                                <IonLabel>¿Ya tiene una cuenta?</IonLabel>
                            </IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default ResetPassword;