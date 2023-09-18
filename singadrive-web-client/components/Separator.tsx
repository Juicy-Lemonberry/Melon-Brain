import React from 'react';

const Separator = () => {
    const separatorStyle = {
        width: '100%', 
        height: '2px', 
        backgroundColor: 'gray',
        margin: '20px 0',
        };

    return <div style={separatorStyle}></div>;
};

export default Separator;