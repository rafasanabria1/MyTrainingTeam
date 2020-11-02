import React, { useContext, useRef } from 'react';
import { IonButton, IonCol, IonContent, IonGrid, IonInput, IonItem, IonLabel, IonPage, IonRow, IonToast } from '@ionic/react';
import FirebaseAuthContext from '../auth/FirebaseAuthContext';

const Login: React.FC = () => {

    const FirebaseAuthCtx = useContext (FirebaseAuthContext);

    var emailRef               = useRef<HTMLIonInputElement> (null);
    var passwordRef            = useRef<HTMLIonInputElement> (null);
    
    const validateEmail = (email: string) => {

        var regEx = /\S+@\S+\.\S+/;
        return regEx.test(email);
    }


    const loginHandler = () => {

        let enteredEmail = emailRef.current!.value?.toString ().trim ();
        let enteredPassword = passwordRef.current!.value?.toString ().trim ();
        enteredEmail = 'rafasanabria1@gmail.com';
        enteredPassword = 'eltiolavara09';

        FirebaseAuthCtx.login (enteredEmail!, enteredPassword!);
    }


    return (
        <IonPage>
            {/* <IonToast isOpen={!!errorMsg} message={errorMsg} duration={2000} color="danger" /> */}
            {/* <IonToast isOpen={!!successMsg} message={successMsg} duration={2000} color="success" /> */}
            <IonContent fullscreen className="ion-padding ion-text-center">
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonItem>
                                <IonLabel position="floating">E-mail</IonLabel>
                                <IonInput type="email" ref={emailRef}></IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonItem>
                                <IonLabel position="floating">Contraseña</IonLabel>
                                <IonInput type="password" ref={passwordRef}></IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow className="ion-margin-top">
                        <IonCol>
                            <IonButton color="primary" expand="block" onClick={loginHandler}>
                                <IonLabel>Iniciar sesión</IonLabel>
                            </IonButton>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonButton color="tertiary" fill="clear" routerLink="/reset-password" routerDirection="none">
                                <IonLabel>¿Ha olvidado su contraseña?</IonLabel>
                            </IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Login;