import React, { useEffect, useState } from 'react';
import { IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { add } from 'ionicons/icons';

import EditGroupModal from '../components/EditGroupModal';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

const Groups: React.FC = () => {
    
    const [loading, setLoading]                     = useState<boolean> (false);
    const [showModalAddGroup, setShowModalAddGroup] = useState<boolean> (false);
    const [groups, setGroups]                       = useState <{id:string, name:string, description:string, photoPreview:string} []> ([]);
    
    const loadGroups = () => {
        
        var groupImgRef = firebase.storage ().ref ();
        let arrPromises:Promise<any>[] = [];
        let groups_updated: Array<{id:string, name:string, description:string, photoPreview:string}> = [];

        firebase.firestore ().collection ('groups').orderBy ('createAt', 'desc').get ().then( (querySnapshot) => {
            
            querySnapshot.docs.map ( (group) => {
                
                groups_updated.push ({id: group.id, name: group.data ().name, description: group.data ().description, photoPreview: ''});
                let promise = groupImgRef.child ('groups-images/' + group.id).getDownloadURL ().then ( (url) => {
                    
                    if (url !== '') groups_updated.find (g => g.id === group.id)!.photoPreview = url;
                    return;
                });
                arrPromises.push (promise);
            });
            
            Promise.all (arrPromises).then ( () => {
                
                setLoading (false);
                setGroups (groups_updated);
            }).catch ( (err) => {
                
                console.log (err);
            });
        });
    }
        
    useEffect ( () => {
        loadGroups ();
    }, []);

    return (
        <IonPage>
            <EditGroupModal showModalAddGroup={showModalAddGroup} setShowModalAddGroup={setShowModalAddGroup} loadGroups={loadGroups} />
            <IonHeader>
                <IonToolbar class="ion-text-center">
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Grupos</IonTitle>
                    <IonButtons slot="end">
                        <IonIcon icon={add} slot="icon-only" onClick={ () => { setShowModalAddGroup (true); } }/>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                {
                    groups.map ( group => (
                    
                        <IonCard key={group.id} routerLink={`/groups/${group.id}`}>
                            { group.photoPreview !== '' && (
                                <img src={group.photoPreview} alt={group.name} />
                            )}
                            <IonCardHeader>
                                <IonCardTitle>{group.name}</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                {group.description}
                            </IonCardContent>
                        </IonCard>
                    ))
                }
            </IonContent>
        </IonPage>
    );
};

export default Groups;