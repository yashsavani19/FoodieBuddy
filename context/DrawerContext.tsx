import React from 'react';

const OpenContext = React.createContext<{ open: boolean, setOpen: (value: boolean) => void }>({ open: false, setOpen: () => {} });

export default OpenContext;