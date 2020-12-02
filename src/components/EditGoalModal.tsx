import { IonButton, IonButtons, IonContent, IonDatetime, IonHeader, IonInput, IonItem, IonLabel, IonList, IonModal, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react';
import React, { useRef, useState } from 'react';

import moment from 'moment';
import 'moment/locale/es';
import { formatDate } from '../Helpers';

const EditGoalModal: React.FC<{
    show: boolean,
    onCancel: () => void,
    onSave: (goal: any) => void,
    editGoal: any
}> = props => {

    const [errorMsg, setErrorMsg] = useState<string> ('');

    const goalTypeRef  = useRef<HTMLIonSelectElement> (null);
    const goalValueRef = useRef<HTMLIonInputElement> (null);
    const startDateRef = useRef<HTMLIonDatetimeElement> (null);
    const endDateRef   = useRef<HTMLIonDatetimeElement> (null);

    const saveHandler = () => {

        if (goalTypeRef.current?.value === undefined || 
            ( goalTypeRef.current?.value !== "Distancia" && goalTypeRef.current?.value !== "Pisos")) {
                setErrorMsg ("Debe indicar un tipo de objetivo correcto.");
                return;
        }

        if (goalValueRef.current?.value === undefined || 
            parseInt (goalValueRef.current!.value!.toString ()) <= 0 ) {
                setErrorMsg ("Debe indicar un valor para el objetivo positivo.");
                return;
        }

        if (startDateRef.current?.value === undefined) {
            setErrorMsg ("Debe indicar una fecha de inicio para el objetivo.");
            return;
        }

        if (startDateRef.current?.value === undefined) {
            setErrorMsg ("Debe indicar una fecha de fin para el objetivo.");
            return;
        }

        var startDate = moment (startDateRef.current!.value);
        var endDate = moment (endDateRef.current!.value);

        
        if (startDate.isSameOrAfter (endDate, 'day')) {
            setErrorMsg ("Debe indicar una fecha de finalización mayor a la fecha de inicio del objetivo.");
            return;
        }

        let goal = null;
        if (props.editGoal) {

            goal = {
                type: goalTypeRef.current!.value,
                value: goalValueRef.current!.value,
                startdate: startDate.toDate (),
                enddate: endDate.toDate ()
            };
        } else {

            goal = {
                type: goalTypeRef.current!.value,
                value: goalValueRef.current!.value,
                startdate: startDate.toDate (),
                enddate: endDate.toDate (),
                createAt: new Date ()
            };
        }

        props.onSave (goal);
    };
    
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
                        { props.editGoal !! ? 'Editar' : 'Añadir' } Objetivo
                    </IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={ saveHandler }>
                            <IonLabel>Guardar</IonLabel>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    <IonItem lines="full">
                        <IonLabel position="stacked">Tipo de objetivo</IonLabel>
                        <IonSelect ref={goalTypeRef} value={props.editGoal?.type} >
                            <IonSelectOption value="Distancia">Distancia andando / corriendo</IonSelectOption>
                            <IonSelectOption value="Pisos">Pisos subidos</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    <IonItem lines="full">
                        <IonLabel position="stacked">Objetivo a realizar (km / pisos)</IonLabel>
                        <IonInput ref={goalValueRef} className="ion-text-right" type="number" min="0" value={props.editGoal?.value} />
                    </IonItem>
                    <IonItem lines="full">
                        <IonLabel position="stacked">Fecha de inicio</IonLabel>
                        <IonDatetime displayFormat="DD/MM/YYYY" ref={startDateRef} value={ props.editGoal?.startdate ? formatDate (props.editGoal?.startdate, 'MM/DD/YYYY') : ''}></IonDatetime>
                    </IonItem>
                    <IonItem lines="full">
                        <IonLabel position="stacked">Fecha de fin</IonLabel>
                        <IonDatetime displayFormat="DD/MM/YYYY" ref={endDateRef} value={ props.editGoal?.enddate ? formatDate (props.editGoal?.enddate, 'MM/DD/YYYY') : ''}></IonDatetime>
                    </IonItem>
                    { errorMsg!!! && (
                        <IonItem className="ion-text-center ion-no-margin ion-no-padding" lines="none" key="errorMsg">
                            <IonLabel color="danger" className="ion-text-wrap ion-no-margin ion-no-padding">
                                {errorMsg}
                            </IonLabel>
                        </IonItem>
                    )}
                </IonList>
            </IonContent>
        </IonModal>
    );
};

export default EditGoalModal;