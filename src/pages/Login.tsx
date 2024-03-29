import React, { useRef, useState } from 'react';
import { IonButton, IonCol, IonContent, IonGrid, IonInput, IonItem, IonLabel, IonPage, IonRow } from '@ionic/react';
import firebase from 'firebase/app';


const Login: React.FC = () => {

    let emailRef               = useRef<HTMLIonInputElement> (null);
    let passwordRef            = useRef<HTMLIonInputElement> (null);

    const [errorMsg, setErrorMsg] = useState<string> ('');

    const LoginHandler = () => {


        let enteredEmail    = emailRef.current!.value?.toString ().trim ();
        let enteredPassword = passwordRef.current!.value?.toString ().trim ();
        
        if (! enteredEmail || ! enteredPassword || enteredEmail.length === 0 || enteredPassword.length === 0) {
            setErrorMsg ("Debe introducir un e-mail y una contraseña");
            return;
        }

        if (! /\S+@\S+\.\S+/.test (enteredEmail!)) {
            setErrorMsg ("Debe introducir un e-mail válido");
            return;
        }
        
        firebase.firestore ().collection ("users").where ('email', '==', enteredEmail).get ().then ( (querySnapshot) => {

            if (querySnapshot.size === 1) {

                firebase.auth ().signInWithEmailAndPassword (enteredEmail!, enteredPassword!).catch ((err) => {
                    
                    let message = "Error desconocido.";
                    if (err.code === 'auth/too-many-requests') message = "Cuenta bloqueada por demasiados intentos fallidos de login.";
                    else if (err.code === 'auth/wrong-password') message = "Contraseña incorrecta.";
                    else if (err.message !== '') message = err.message;
                    setErrorMsg (message);
                });
            } else {
                setErrorMsg ("No existe el e-mail en la plataforma");
            }
            
        }).catch ( (err) => {
            
            console.log (err);
        });

    }


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
                                <IonInput type="email" placeholder="E-mail" ref={emailRef} value=""></IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonItem className="ion-no-padding ion-text-center">
                                <IonLabel position="stacked">Contraseña</IonLabel>
                                <IonInput type="password" placeholder="Contraseña" ref={passwordRef} value=""></IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    { errorMsg!! && (
                        <IonRow>
                            <IonCol>
                                <IonLabel color="danger">
                                    {errorMsg}
                                </IonLabel>
                            </IonCol>
                        </IonRow>
                    )}
                    <IonRow className="ion-margin-top">
                        <IonCol>
                            <IonButton color="primary" expand="block" onClick={LoginHandler}>
                                <IonLabel>Iniciar sesión</IonLabel>
                            </IonButton>
                        </IonCol>
                    </IonRow>
                    {/* <IonRow>
                        <IonCol>
                            <IonButton color="secondary" fill="clear" routerLink="/reset-password" routerDirection="none">
                                <IonLabel>¿Ha olvidado su contraseña?</IonLabel>
                            </IonButton>
                        </IonCol>
                    </IonRow> */}
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Login;