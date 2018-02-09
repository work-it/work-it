# WorkIt

WorkIt is a capstone project for our group.  We took everything that is missing from the current big-name job hunting websites and put it into our platform.  Both potential employees and potential employers can enjoy a smooth, uniform application process that allows real time application status updates and live messaging.  In our platform Employers can review applications, schedule and conduct interviews, decline applicants or make offers. Employees can apply, accept interview invitations and accept or decline offers. In addition, employees can enjoy a practice portal where they can initiate or join real time pair practice sessions, review their practice history, practice in solo mode or schedule practice sessions at a future date.  Employers will use the same practice platform to conduct live interviews.


## Demo

Please, visit https://work-it-app.herokuapp.com/  to view our platform.  Note that it is a work in progress and will change from time to time

## Setup

To set up WorkIt locally, you'll need to take the following steps:

1.  Fork or clone our repository
2.  npm install
3.  Set up webpack - check out the sample file in our root directory.
4.  Our project currently relies on a secrets.js file that must be located in you project root.  The secrets.js must have the following structure
```
twilioClient: {
        accountSid: 'YOUR_ACCOUNT_SID',
        authToken: 'YOUR_AUTH_TOKEN',
        keySid:'YOUR_KEY_SID',
        keySecret:'YOUR_KEY_SECRET',
        twilioPhone:'PHONE_NUMBER_FROM_TWILIO'
    },
    facebook: {
        appId: 'APP_ID',
        appSecret: 'APP_SECRET',
        callback: 'CALLBACK_URL_FOR_AUTH'
    },
    google: {
        clientId: 'CLIENT_ID',
        secret: 'SECRET',
        callback: 'CALLBACK_URL_FOR_AUTH'
    },
    firebase: {
        webApiKey: 'WEB_API_KEY',
    }
    
    ```
  
  We are using Twilio for our video conferensing portion, so you will need to register with twilio and receive your credentials to be able to use live video conferencing.
  
5.  Our project also relies on firebase.json file that must be located in your project root.  This file must contain your credentials for firebase and must have the following structure.  This file can be downloaded from firebase once you complete your signup process.

```
{
  "type": "service_account",
  "project_id": "YOUR_PROJECT_ID",
  "private_key_id": "PRIVATE_KEY_ID",
  "private_key": "-----BEGIN PRIVATE KEY-----
  Some Private Key
  -----END PRIVATE KEY-----\n",
  "client_email": "firebase assigned client email",
  "client_id": "CLIENT_ID",
  "auth_uri": "AUTH_URI",
  "token_uri": "AUTH_URL",
  "auth_provider_x509_cert_url": "AUTH_PROVIDER_X509_CERT_URL",
  "client_x509_cert_url": "CLIENT_X509_CERT_URL"
}

```

6.  Create tempImages directory in your project root - it will be used to save video and image files you upload or record for your profile.

After you complete the above steps, you can

```
npm run start-dev 

```
to allow webpack to run once, and after that you can run it in production mode.

## Contribute
We would be more than happy to share our project with you, so feel free to reach out to us and we welcome any and all contributions.
