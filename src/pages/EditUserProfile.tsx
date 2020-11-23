import React, { useRef, useState } from 'react';
import { IonAlert, IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonDatetime, IonFooter, IonGrid, IonHeader, IonInput, IonItem, IonItemGroup, IonLabel, IonList, IonListHeader, IonPage, IonProgressBar, IonRow, IonSelect, IonSelectOption, IonTitle, IonToast, IonToolbar } from '@ionic/react';

import { useHistory } from 'react-router';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import moment from 'moment';

import { Plugins, CameraResultType, CameraSource, CameraDirection } from '@capacitor/core';
import { base64FromPath } from '@ionic/react-hooks/filesystem';

const { Camera } = Plugins;

const EditUserProfile: React.FC<{
    user: any
}> = props => {

    const [showAlert, setShowAlert]                 = useState<boolean> (false);
    const [errorMsg, setErrorMsg]                   = useState<string> ('');
    const [profileSuccess, setProfileSuccess]       = useState<boolean> (false);
    const [uploading, setUploading]                 = useState<number> (0);
    const [defaultProfileImg, setDefaultProfileImg] = useState<string> ('assets/images/avatar.svg');
    const [photo, setPhoto]                         = useState<{path: string, preview: string}> ();
    const history                                   = useHistory ();


    const nameRef         = useRef<HTMLIonInputElement> (null);
    const surnameRef      = useRef<HTMLIonInputElement> (null);
    const genderRef       = useRef<HTMLIonSelectElement> (null);
    const weightRef       = useRef<HTMLIonInputElement> (null);
    const oldPasswordRef  = useRef<HTMLIonInputElement> (null);
    const newPassword1Ref = useRef<HTMLIonInputElement> (null);
    const newPassword2Ref = useRef<HTMLIonInputElement> (null);
    const createAtRef     = useRef<HTMLSpanElement> (null);

    var profileImgRef:any = null;
    
    firebase.firestore ().collection ('users').doc (props.user.uid).get ().then ( (doc) => {

        if (doc.exists) {

            nameRef.current!.value         = doc.get ('name');
            surnameRef.current!.value      = doc.get ('surname');
            genderRef.current!.value       = doc.get ('gender');
            weightRef.current!.value       = doc.get ('weight');
            createAtRef.current!.innerHTML = moment (new firebase.firestore.Timestamp (doc.get ('createAt').seconds, doc.get ('createAt').nanoseconds).toDate ()).format ('DD/MM/YYYY');
            
            profileImgRef = firebase.storage ().ref ().child('profile-images/' + props.user.uid);
            profileImgRef.getDownloadURL().then( (url:any) => {
                
                setDefaultProfileImg (url);
            }).catch( (err:any) => {

                if (err.code === 'storage/unauthorized') {
                    setErrorMsg ('Error de permisos en firebase/storage.');
                } else {
                    console.log (err);
                }
            });
        } 

    }).catch ( (err) => {

        console.log (err);
    });
    


    const takePhotoHandler = () => {

        Camera.getPhoto ({
            resultType: CameraResultType.Uri,
            source: CameraSource.Prompt,
            direction: CameraDirection.Front,
            quality: 80,
            width: 500,
            promptLabelHeader: 'Seleccionar foto de perfil',
            promptLabelCancel: 'Cancelar',
            promptLabelPhoto: 'Abrir galería',
            promptLabelPicture: 'Abrir cámara'
            
        }).then ( (photo) => {
            if (! photo || ! photo.webPath) return;
            
            setPhoto (
                {
                    path: photo.path!,
                    preview: photo.webPath!
                }
            );
        });;
    };


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
        
        const credential = firebase.auth.EmailAuthProvider.credential (props.user.email, enteredOldPassword!);
        props.user.reauthenticateWithCredential (credential).then ( () => {

            props.user.updatePassword (enteredNewPassword1!).then ( () => {

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
            gender: genderRef.current?.value!.toString ().trim (),
            weight: (weightRef.current?.value && weightRef.current!.value > 0) ? parseFloat (weightRef.current!.value!.toString ().trim ()) : 0,
        }

        firebase.firestore ().collection ("users").doc (props.user.uid).update (updateObject).then ( () => {

            if (photo && photo.preview) {
                
                base64FromPath (photo.preview ).then ( (base64ProfileImg) => {

                    var profileImgRefUpload = profileImgRef.putString (base64ProfileImg, 'data_url');
                    profileImgRefUpload.on ('state_changed', (snapshot:any) => {
                        setUploading (snapshot.bytesTransferred / snapshot.totalBytes);
                        
                    }, (err:any) => {

                        console.log (err);
                    }, () => {
                            
                        setProfileSuccess (true);
                    });
                });
            } else {

                /*
                profileImgRef.delete ().then ( () => {
                
                    setProfileSuccess (true);
                });
                */
               setProfileSuccess (true);
            }
        }).catch ( (err) => {
            
            console.log (err);
        });
    };


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className="ion-text-center">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/groups" text=""/>
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
                        <IonCol size="4" offset="4" className="ion-text-center img-edit-profile">
                            {! photo && (
                                <img src={defaultProfileImg} onClick={takePhotoHandler} alt={props.user.name} />
                            )}
                            {photo && (
                                <img src={photo.preview}  onClick={takePhotoHandler} alt={props.user.name} />
                            )}
                            { (uploading > 0 && uploading < 1) && (

                                <IonProgressBar value={uploading} />
                                )
                            }
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonListHeader className="ion-text-center">
                                <IonLabel className="ion-no-margin-top">Información personal</IonLabel>
                            </IonListHeader>
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
                            <IonListHeader className="ion-text-center">
                                <IonLabel>Credenciales</IonLabel>
                            </IonListHeader>
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

export default EditUserProfile;
