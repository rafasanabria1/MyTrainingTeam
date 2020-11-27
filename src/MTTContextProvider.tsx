import React, { useEffect, useState } from 'react';
import MTTContext from './MTTContext';

import firebaseConfig from './config/firebase';
import firebase from 'firebase/app';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';

const MTTContextProvider: React.FC = props => {

    if (! firebase.apps.length) {
        firebase.initializeApp (firebaseConfig);
    }

    const [user, setUser]               = useState<any> (null);
    const [userData, setUserData]       = useState<any> (null);
    const [loadingUser, setLoadingUser] = useState<boolean> (true);
    const [errorUser, setErrorUser]     = useState<any> (null);

    const [u, l, e] = useAuthState (firebase.auth ());
    useEffect ( () => {
        
        if (u !== undefined && u !== null) {

            firebase.firestore ().collection ("users").doc (u.uid).get ().then ( (docData) => {

                if (docData.data ()) setUserData (docData.data ());
                
                setUser (u);
                setLoadingUser (l);
                setErrorUser (e);
            });
        } else {
            setUser (u);
            setUserData (null);
            setLoadingUser (l);
            setErrorUser (e);
        }
    }, [u, l, e]);
    
    
    return (
        <MTTContext.Provider value={{ user, userData, loadingUser, errorUser }}>{props.children}</MTTContext.Provider>
    );
}

export default MTTContextProvider;