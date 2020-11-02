import React from 'react';

export interface User {

    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
    emailVerified: boolean;
};

export interface FirebaseAuthContextInterface {

    isUserLogged: boolean,
    user: User | null;
    login: (email: string, password: string) => void;
    logout: () => void;
    createUser: () => void;
    deleteUser: () => void;
    updateUser: () => void;
};

const FirebaseAuthContext = React.createContext <FirebaseAuthContextInterface> ({

    isUserLogged: false,
    user: null,
    login: () => {},
    logout: () => {},
    createUser: () => {},
    deleteUser: () => {},
    updateUser: () => {},
});

export default FirebaseAuthContext;
