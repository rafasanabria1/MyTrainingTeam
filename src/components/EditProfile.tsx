import React, { useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { IonAlert, IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonDatetime, IonFooter, IonGrid, IonHeader, IonInput, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToast, IonToolbar } from '@ionic/react';

import moment from 'moment';

import firebaseConfig from '../config/firebase';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { useHistory } from 'react-router';

const EditProfile: React.FC = () => {

    if (! firebase.apps.length) {
        firebase.initializeApp (firebaseConfig);
    }

    const [showAlert, setShowAlert]           = useState<boolean> (false);
    const [errorMsg, setErrorMsg]             = useState<string> ('');
    const [profileSuccess, setProfileSuccess] = useState<boolean> (false);
    const history                             = useHistory ();
    const [user, loading, error]              = useAuthState (firebase.auth ());

    const nameRef         = useRef<HTMLIonInputElement> (null);
    const surnameRef      = useRef<HTMLIonInputElement> (null);
    const birthdateRef    = useRef<HTMLIonDatetimeElement> (null);
    const genderRef       = useRef<HTMLIonSelectElement> (null);
    const weightRef       = useRef<HTMLIonInputElement> (null);
    const oldPasswordRef     = useRef<HTMLIonInputElement> (null);
    const newPassword1Ref = useRef<HTMLIonInputElement> (null);
    const newPassword2Ref = useRef<HTMLIonInputElement> (null);
    const createAtRef     = useRef<HTMLSpanElement> (null);
    
    firebase.firestore ().collection ('users').doc (user.uid).get ().then ( (doc) => {

        if (doc.exists) {

            nameRef.current!.value         = doc.get ('name');
            surnameRef.current!.value      = doc.get ('surname');
            birthdateRef.current!.value    = doc.get ('birthdate').toDate ().toISOString ();
            genderRef.current!.value       = doc.get ('gender');
            weightRef.current!.value       = doc.get ('weight');
            createAtRef.current!.innerHTML = moment (doc.get ('createAt').toDate ()).format ('DD/MM/YYYY');
        } 
    }).catch ( (err) => {

        console.log (err);
    });
    

    const passwordChanged = () => {

        firebase.auth ().signOut ().then ( () => {
    
            history.push ('/login');
        }).catch ( (err) => {
    
            console.log (err);
        });
    }


    const updatePassword = () => {
        
        let enteredOldPassword  = oldPasswordRef.current!.value?.toString ().trim ();
        let enteredNewPassword1 = newPassword1Ref.current!.value?.toString ().trim ();
        let enteredNewPassword2 = newPassword2Ref.current!.value?.toString ().trim ();
        if (enteredOldPassword === '' || enteredNewPassword1 === '' || enteredNewPassword2 === '') {

            setErrorMsg ("Debe rellenar los tres campos del apartado contraseña.");
            return;
        }

        if (enteredNewPassword1!.length <= 5) {
            setErrorMsg ("La contraseña debe tener una longitud mínima de 6 caracteres.");
            return;
        }

        if (enteredNewPassword1 !== enteredNewPassword2) {

            setErrorMsg ("La nueva contraseña debe ser idéntica en los dos campos.");
            return;
        }
        
        const credential = firebase.auth.EmailAuthProvider.credential (user.email, enteredOldPassword!);
        user.reauthenticateWithCredential (credential).then ( () => {

            user.updatePassword (enteredNewPassword1!).then ( () => {

                setShowAlert (true);
            }).catch ( () => {

                setErrorMsg ("No se ha podido actualizar la contraseña correctamente.");
                return;
            });
        }).catch ( () => {

            setErrorMsg ("La contraseña antigua no es correcta.");
            return;
        });
    }


    const updateProfile = () => {

        let updateObject = {
            name: nameRef.current?.value!.toString ().trim (),
            surname: surnameRef.current?.value!.toString ().trim (),
            birthdate: birthdateRef.current?.value !== '' ? new Date (birthdateRef.current!.value!.toString ().trim ()) : '',
            gender: genderRef.current?.value!.toString ().trim (),
            weight: (weightRef.current?.value && weightRef.current!.value > 0) ? parseFloat (weightRef.current!.value!.toString ().trim ()) : 0,
        }

        firebase.firestore ().collection ("users").doc (user.uid).update (updateObject).then ( () => {

            setProfileSuccess (true);
        }).catch ( (err) => {
            
            console.log (err);
        });
    };


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className="ion-text-center">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/groups"/>
                    </IonButtons>
                    <IonTitle>Perfil</IonTitle>
                    <IonButtons slot="end">
                        <IonButton size="small" onClick={updateProfile}>
                            <IonLabel>Guardar</IonLabel>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonAlert isOpen={showAlert} header="Contraseña modificada" message={'Debe volver a iniciar sesión'}
                            buttons={[{text: 'Ok', handler: passwordChanged }]} />
                <IonToast isOpen={profileSuccess} message="Perfil actualizado correctamente" color="success" position="bottom" duration={1500} onDidDismiss={ () => { setProfileSuccess (false); }} />
                <IonGrid>
                    <IonRow className="ion-margin-vertical">
                        <IonCol size="4" offset="4">
                            
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonList>
                                <IonItemGroup>
                                    <IonItem>
                                        <IonLabel>Nombre</IonLabel>
                                        <IonInput ref={nameRef} placeholder="Nombre" className="ion-text-right"/>
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel>Apellidos</IonLabel>
                                        <IonInput ref={surnameRef} placeholder="Apellidos" className="ion-text-right"/>
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel>Fecha de nacimiento</IonLabel>
                                        <IonDatetime ref={birthdateRef} placeholder="Fecha de Nacimiento" displayFormat="DD MM YYYY" className="ion-text-right"/>
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel>Sexo</IonLabel>
                                        <IonSelect ref={genderRef} placeholder="Sexo" className="ion-text-right">
                                            <IonSelectOption value="Femenino">Femenino</IonSelectOption>
                                            <IonSelectOption value="Masculino">Masculino</IonSelectOption>
                                            <IonSelectOption value="Otro">Otro</IonSelectOption>
                                        </IonSelect>
                                    </IonItem>
                                    <IonItem lines="none">
                                        <IonLabel>Peso (Kg)</IonLabel>
                                        <IonInput type="number" ref={weightRef} placeholder="Peso (Kg)" className="ion-text-right" />
                                    </IonItem>
                                </IonItemGroup>
                            </IonList>
                            <IonItemDivider className="ion-margin-top">
                                <IonLabel>Credenciales</IonLabel>
                            </IonItemDivider>
                            <IonItem>
                                <IonLabel>Contraseña actual</IonLabel>
                                <IonInput type="password" ref={oldPasswordRef} placeholder="Contraseña actual" className="ion-text-right" onKeyUp={ () => { setErrorMsg (''); }}/>
                            </IonItem>
                            <IonItem>
                                <IonLabel>Nueva contraseña</IonLabel>
                                <IonInput type="password" ref={newPassword1Ref} placeholder="Nueva contraseña" className="ion-text-right" onKeyUp={ () => { setErrorMsg (''); }}/>
                            </IonItem>
                            <IonItem lines="none">
                                <IonLabel>Repetir contraseña</IonLabel>
                                <IonInput type="password" ref={newPassword2Ref} placeholder="Nueva contraseña" className="ion-text-right" onKeyUp={ () => { setErrorMsg (''); }}/>
                            </IonItem>
                            { errorMsg!!! && (
                                <IonItem className="ion-text-center ion-no-margin ion-no-padding" lines="none">
                                    <IonLabel color="danger" className="ion-text-wrap ion-no-margin ion-no-padding">
                                        {errorMsg}
                                    </IonLabel>
                                </IonItem>
                            )}
                            <IonButton color="primary" expand="block" fill="outline" size="small" className="ion-no-margin-top" onClick={updatePassword} >
                                <IonLabel>Actualizar contraseña</IonLabel>
                            </IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
            <IonFooter>
                <IonItem className="ion-text-center" lines="none">
                    <IonLabel>
                        <p>Registrado el <span ref={createAtRef}></span></p>
                    </IonLabel>
                </IonItem>
            </IonFooter>
        </IonPage>
    );
};

export default EditProfile;
