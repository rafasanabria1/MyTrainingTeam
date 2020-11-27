import React from 'react';

const MTTContext = React.createContext<{
    user: any,
    userData: any,
    loadingUser: boolean,
    errorUser: any
}> ({
    user: {},
    userData: {},
    loadingUser: true,
    errorUser: {}
});

export default MTTContext;
