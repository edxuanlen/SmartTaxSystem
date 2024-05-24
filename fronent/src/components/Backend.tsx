import React, { useEffect } from "react";

export const Backend = () => {

    useEffect(() => {
        window.location.href = 'http://127.0.0.1:8000/admin';
    });

    return (
        <div>
            This is the backend
        </div>
    );
}

export default Backend;
