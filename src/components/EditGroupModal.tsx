import React, { useRef, useState } from 'react';
import { IonAlert, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonPage, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import { imageOutline } from 'ionicons/icons';

import { Plugins, CameraResultType, CameraSource, CameraDirection } from '@capacitor/core';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

const { Camera } = Plugins;

const EditGroupModal: React.FC<{
    show: boolean,
    onCancel: () => void,
    onSave: (group: any) => void,
    editGroup: any
}> = props => {

    const [isDeleting, setIsDeleting] = useState<boolean> (false);

    const [errorMsg, setErrorMsg] = useState<string> ('');

    const [photo, setPhoto]         = useState<{path: string, preview: string}> ();

    const nameRef        = useRef<HTMLIonInputElement> (null);
    const descriptionRef = useRef<HTMLIonTextareaElement> (null);
    
    const cancelDeleteGroup = () => {

        setIsDeleting (false);
    }

    const deleteGroup = () => {

        firebase.firestore ().collection ("groups").doc (props.editGroup.id).delete ().catch ( (err) => {

            cancelDeleteGroup ();
            console.log (err);
        });
    };


    const deleteGroupHandler = () => {

        setIsDeleting (true);
    };
    
    const saveHandler = () => {

        if (nameRef.current?.value === undefined || 
            nameRef.current?.value?.toString ().trim () === '') {
                setErrorMsg ("Debe indicar un nombre.");
                return;
        }

        let group = null;
        if (props.editGroup) {

            if (photo && photo.preview) {
                group = {
                    name: nameRef.current!.value!.toString ().trim (),
                    description: descriptionRef.current!.value?.toString ().trim (),
                    groupImg: props.editGroup.groupImg,
                    photoPreview: photo.preview
                }
            } else {
                group = {
                    name: nameRef.current!.value!.toString ().trim (),
                    description: descriptionRef.current!.value?.toString ().trim (),
                    groupImg: props.editGroup.groupImg,
                    photoPreview: ''
                }
            }
        } else {

            if (photo && photo.preview) {
                group = {
                    name: nameRef.current!.value!.toString ().trim (),
                    description: descriptionRef.current!.value?.toString ().trim (),
                    groupImg: '',
                    photoPreview: photo.preview,
                    createAt: new Date ()
                }
            } else {
                group = {
                    name: nameRef.current!.value!.toString ().trim (),
                    description: descriptionRef.current!.value?.toString ().trim (),
                    groupImg: '',
                    photoPreview: '',
                    createAt: new Date ()
                }
            }
        }

        props.onSave (group);
    };

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


    return (
        <IonModal isOpen={props.show} swipeToClose={false}>
            <IonAlert isOpen={isDeleting} header={`Eliminar grupo ${props.editGroup?.name}`} message={'Esta acción no podrá deshacerse'}
                onDidDismiss={ () => cancelDeleteGroup } buttons={
                    [
                        {
                            text: 'Cancelar',
                            role: 'cancel',
                            cssClass: 'secondary',
                            handler: () => { cancelDeleteGroup (); }
                        },
                            {
                            text: 'Si, borrar',
                            handler: () => { deleteGroup (); }
                        }  
                    ]}
            />
            <IonPage>
                <IonHeader>
                    <IonToolbar class="ion-text-center">
                        <IonButtons slot="start">
                            <IonButton onClick={ () => { setErrorMsg (""); props.onCancel(); }}>
                                <IonLabel>Cancelar</IonLabel>
                            </IonButton>
                        </IonButtons>
                        <IonTitle className="ion-text-center">{props.editGroup ? 'Actulizar' : 'Crear' } Grupo</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={saveHandler}>
                                <IonLabel>Guardar</IonLabel>
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen >
                    <IonItem lines="none" className="ion-text-center ion-margin-vertical">
                        <IonLabel position="stacked">Nombre del grupo</IonLabel>
                        <IonInput placeholder="Nombre del grupo" ref={nameRef} value={props.editGroup?.name}/>
                    </IonItem>
                    <IonItem lines="none" className="ion-text-center ion-margin-vertical">
                        <IonLabel position="stacked">Descripción del grupo</IonLabel>
                        <IonTextarea placeholder="Descripción del grupo" maxlength={200} rows={3} ref={descriptionRef} value={props.editGroup?.description} />
                    </IonItem>
                    <div className="ion-text-center ion-margin-vertical">
                            {(props.editGroup?.groupImg && ! photo && (
                                <img src={props.editGroup.groupImg} alt="group-name" onClick={takePhotoHandler} />
                            ))}
                            {photo && photo.preview !== '' && (
                                <img src={photo.preview} alt="group-name" onClick={takePhotoHandler} />
                            )}
                            {(! props.editGroup?.groupImg && (! photo || photo.preview === '')) && (
                                <IonButton onClick={takePhotoHandler} className="ion-text-center">
                                    <IonLabel>Agregar fotografía</IonLabel>
                                    <IonIcon icon={imageOutline} slot="end" />
                                </IonButton>
                            )}
                    </div>
                    { errorMsg!!! && (
                        <IonItem className="ion-text-center ion-no-margin ion-no-padding" lines="none">
                            <IonLabel color="danger" className="ion-text-wrap ion-no-margin ion-no-padding">
                                {errorMsg}
                            </IonLabel>
                        </IonItem>
                    )}
                    {
                        props.editGroup && (

                            <IonButton color="danger" expand="block" onClick={deleteGroupHandler}>
                                <IonLabel>Eliminar grupo</IonLabel>
                            </IonButton>
                        )
                    }
                </IonContent>
            </IonPage>
        </IonModal>
    );
};

export default EditGroupModal;