let VAPID__PUBLIC_KEY=null;
let registration=null;
let subscription=null;
const msgInput = document.querySelector('input');

fetch('/vapidPublicKey')
    .then(res => res.text())
    .then(clavePublica => {
        VAPID__PUBLIC_KEY=clavePublica;
        register();
    });

function register() {
    if(('serviceWorker' in navigator)&&('PushManager' in window)) {
        navigator.serviceWorker.register('./service-worker.js')
            .then(_registration => {
                registration=_registration;
                registration.pushManager.subscribe({
                    applicationServerKey: urlB64ToUint8Array(VAPID__PUBLIC_KEY),
                    userVisibleOnly: true,
                })
                    .then(_subscription => subscription=_subscription);
            });
    }
}

/// Función necesaria para convertir la VAPID KEY En un formato procesable
function urlB64ToUint8Array(base64String) {
    const padding="=".repeat((4-(base64String.length%4))%4);
    const base64=(base64String+padding)
        .replace(/\-/g,"+")
        .replace(/_/g,"/");

    const rawData=window.atob(base64);
    const outputArray=new Uint8Array(rawData.length);

    for(let i=0;i<rawData.length;++i) {
        outputArray[i]=rawData.charCodeAt(i);
    }
    return outputArray;
}

document.querySelector('button').addEventListener('click',(e) => {
    if(registration&&subscription) {
        fetch('/suscribir',{
            method: 'post',
            body: JSON.stringify(_subscription),
            headers: {
                'Content-type': 'application/json',
            }
        }).catch(console.error);
    }
});