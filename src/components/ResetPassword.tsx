import React from 'react';
import { IonButton, IonCol, IonContent, IonGrid, IonInput, IonItem, IonLabel, IonPage, IonRow } from '@ionic/react';

const ResetPassword: React.FC = () => {

    return (
        <IonPage>
            <IonContent fullscreen className="ion-padding ion-text-center">
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonItem>
                                <IonLabel position="floating">E-mail</IonLabel>
                                <IonInput type="email"></IonInput>
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
                            <IonButton color="tertiary" fill="clear" routerLink="/login" routerDirection="none">
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