import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonButton, IonCol, IonContent, IonGrid, IonInput, IonItem, IonLabel, IonLoading, IonPage, IonRow, IonToast } from '@ionic/react';
import FirebaseAuthContext from '../auth/FirebaseAuthContext';

const Login: React.FC = () => {

    const FirebaseAuthCtx = useContext (FirebaseAuthContext);
    const history         = useHistory ();

    let emailRef               = useRef<HTMLIonInputElement> (null);
    let passwordRef            = useRef<HTMLIonInputElement> (null);

    var [errorMsg, setErrorMsg]       = useState<string> ('');
    var [showLoading, setShowLoading] = useState<boolean> (true);

    useEffect ( () => {
        if (FirebaseAuthCtx.isUserLogged) history.push ('/groups');
        else if (FirebaseAuthCtx.errorMsg) setErrorMsg (FirebaseAuthCtx.errorMsg);

        //setShowLoading (false);
    }, [FirebaseAuthCtx.isUserLogged, FirebaseAuthCtx.errorMsg, history]);


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
        
        FirebaseAuthCtx.login (enteredEmail!, enteredPassword!);
    }


    return (
        <IonPage>
            <IonContent fullscreen className="ion-padding ion-text-center">
                <IonToast isOpen={!!errorMsg} message={errorMsg} color="danger" duration={2000} />
                <IonLoading isOpen={showLoading} duration={1000} onDidDismiss={ () => { setShowLoading(false); }}/>
                { ! showLoading && (
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonItem>
                                <IonLabel position="floating">E-mail</IonLabel>
                                <IonInput type="email" ref={emailRef} value="rafasanabria1@gmail.com"></IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonItem>
                                <IonLabel position="floating">Contraseña</IonLabel>
                                <IonInput type="password" ref={passwordRef} value="eltiolavara09"></IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow className="ion-margin-top">
                        <IonCol>
                            <IonButton color="primary" expand="block" onClick={LoginHandler}>
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
                )}
            </IonContent>
        </IonPage>
    );
};

export default Login;