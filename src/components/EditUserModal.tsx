import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react';
import React, { useRef, useState } from 'react';

import 'firebase/firestore';
import 'firebase/storage';

import { saveOutline } from 'ionicons/icons';


const EditUserModal: React.FC<{
    show: boolean,
    onCancel: () => void,
    onSave: (user: any) => void,
    editUser: any
}> = props => {

    const [errorMsg, setErrorMsg] = useState<string> ('');

    const nameRef      = useRef<HTMLIonInputElement> (null);
    const surnameRef   = useRef<HTMLIonInputElement> (null);
    const emailRef     = useRef<HTMLIonInputElement> (null);
    const passwordRef  = useRef<HTMLIonInputElement> (null);
    const genderRef    = useRef<HTMLIonSelectElement> (null);
    const weightRef    = useRef<HTMLIonInputElement> (null);
    const rolRef       = useRef<HTMLIonSelectElement> (null);

    const saveHandler = () => {

        if (nameRef.current?.value === undefined || 
            nameRef.current?.value?.toString ().trim () === '') {
                setErrorMsg ("Debe indicar un nombre.");
                return;
        }

        if (surnameRef.current?.value === undefined || 
            surnameRef.current?.value?.toString ().trim () === '') {
                setErrorMsg ("Debe indicar al menos un apellido.");
                return;
        }

        if (emailRef.current?.value === undefined || 
            emailRef.current?.value?.toString ().trim () === '' || 
            ! emailRef.current!.value?.toString ().trim ().match (('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'))) {
                setErrorMsg ("Debe indicar un e-mail válido.");
                return;
        }

        if (rolRef.current?.value === undefined) {

            setErrorMsg ("Debe seleccionar un rol.");
            return;
        }

        let user = null;

        if (props.editUser) { 

            user = {
                name: nameRef.current!.value!.toString ().trim (),
                surname: surnameRef.current!.value?.toString ().trim (),
                email: emailRef.current!.value?.toString ().trim (),
                gender: genderRef.current?.value !== undefined ? genderRef.current!.value?.toString ().trim () : null,
                weight: weightRef.current ? parseFloat (weightRef.current!.value!.toString ().trim ()) : 0,
                rol: rolRef.current!.value?.toString ().trim (),
            };
        } else {

            if (passwordRef.current?.value === undefined || 
                passwordRef.current?.value!.toString ().trim ().length < 6) {

                    setErrorMsg ("Debe indicar una contraseña de al menos 6 caracteres.");
                    return;
            }    
            user = {
                name: nameRef.current!.value?.toString ().trim (),
                surname: surnameRef.current!.value?.toString ().trim (),
                email: emailRef.current!.value?.toString ().trim (),
                rol: rolRef.current!.value?.toString ().trim (),
                password: passwordRef.current!.value?.toString ().trim (),
                createAt: new Date ()
            };
        }
        
        props.onSave (user);
    }


    return (
        <IonModal isOpen={props.show}>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={ () => { setErrorMsg (""); props.onCancel(); }}>
                            <IonLabel>Cancelar</IonLabel>
                        </IonButton>
                    </IonButtons>
                    <IonTitle className="ion-text-center">
                        { props.editUser !! ? 'Editar' : 'Añadir' } Usuario
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    <IonItem lines="full">
                        <IonLabel>Nombre</IonLabel>
                        <IonInput ref={nameRef} placeholder="Nombre" className="ion-text-right" value={props.editUser?.name}/>
                    </IonItem>
                    <IonItem lines="full">
                        <IonLabel>Apellidos</IonLabel>
                        <IonInput ref={surnameRef} placeholder="Apellidos" className="ion-text-right" value={props.editUser?.surname} />
                    </IonItem>
                    <IonItem lines="full">
                        <IonLabel>E-mail</IonLabel>
                        <IonInput type="email" ref={emailRef} placeholder="E-mail" className="ion-text-right" value={props.editUser?.email} />
                    </IonItem>
                    {
                        ! props.editUser && (
                            <IonItem lines="full">
                                <IonLabel>Contraseña</IonLabel>
                                <IonInput type="password" ref={passwordRef} placeholder="Contraseña" className="ion-text-right" />
                            </IonItem>
                        )
                    }
                    { props.editUser && (
                        <React.Fragment>
                            <IonItem lines="full">
                                <IonLabel>Sexo</IonLabel>
                                <IonSelect ref={genderRef} placeholder="Sexo" className="ion-text-right" value={props.editUser?.gender}>
                                    <IonSelectOption value="Femenino">Femenino</IonSelectOption>
                                    <IonSelectOption value="Masculino">Masculino</IonSelectOption>
                                    <IonSelectOption value="Otro">Otro</IonSelectOption>
                                </IonSelect>
                            </IonItem>
                            <IonItem lines="full">
                                <IonLabel>Peso (Kg)</IonLabel>
                                <IonInput type="number" ref={weightRef} placeholder="Peso (Kg)" className="ion-text-right" value={props.editUser?.weight}/>
                            </IonItem>
                        </React.Fragment>
                    )}
                    <IonItem lines="full">
                        <IonLabel>Rol</IonLabel>
                        <IonSelect ref={rolRef} placeholder="Rol" className="ion-text-right" value={props.editUser?.rol}>
                            <IonSelectOption value="Entrenador">Entrenador</IonSelectOption>
                            <IonSelectOption value="Deportista">Deportista</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    { errorMsg!!! && (
                        <IonItem className="ion-text-center ion-no-margin ion-no-padding" lines="none" key="errorMsg">
                            <IonLabel color="danger" className="ion-text-wrap ion-no-margin ion-no-padding">
                                {errorMsg}
                            </IonLabel>
                        </IonItem>
                    )}
                    <IonButton color="primary" expand="block" className="ion-margin-top" onClick={saveHandler} buttonType="button">
                        <IonIcon icon={saveOutline} slot="start"/>
                        <IonLabel>Guardar</IonLabel>
                    </IonButton>
                </IonList>
            </IonContent>
        </IonModal>
    );
};

export default EditUserModal;