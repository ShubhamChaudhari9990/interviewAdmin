const FIREBASE_FUNCTIONS_REGION = 'us-central1';
const FIREBASE_PROJECT_ID = 'interview-89e09';

const FIREBASE_FUNCTIONS_API_URL =
  `https://${FIREBASE_FUNCTIONS_REGION}-${FIREBASE_PROJECT_ID}.cloudfunctions.net/api`;

export const environment = {
  production: true,
  useLocalApi: false,
  enableTabProctoringViolationRules: true,
  functionsApiUrl: FIREBASE_FUNCTIONS_API_URL,
  localApiUrl: 'http://localhost:5000/api',
  firebase: {
    apiKey: 'AIzaSyDRA-y16GTZ-r7ffNq4SPWuiKBwGmqNMfA',
    authDomain: 'interview-89e09.firebaseapp.com',
    projectId: 'interview-89e09',
    storageBucket: 'interview-89e09.firebasestorage.app',
    messagingSenderId: '87689043441',
    appId: '1:87689043441:web:456a0976372d8e6dfc3850',
    measurementId: 'G-BZFXV0GLFE',
  },
  razorpayKeyId: '',
};
