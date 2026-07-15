const FIREBASE_FUNCTIONS_REGION = 'us-central1';
const FIREBASE_PROJECT_ID = 'interview-89e09';

/** Live HTTPS endpoint for the deployed `api` Cloud Function */
export const FIREBASE_FUNCTIONS_API_URL =
  `https://${FIREBASE_FUNCTIONS_REGION}-${FIREBASE_PROJECT_ID}.cloudfunctions.net/api`;

export const environment = {
  production: false,
  /** Set to true when running the Express API locally on port 5000 */
  useLocalApi: true,
  /** Toggle tab switch/blur proctoring warnings during development */
  enableTabProctoringViolationRules: false,
  renderLocalApi: true,
  renderUrl: 'https://iv-backend-q3y8.onrender.com/api',
  functionsApiUrl: FIREBASE_FUNCTIONS_API_URL,
  localApiUrl: 'https://iv-backend-uhip.onrender.com/api',
  firebase: {
    apiKey: 'AIzaSyDRA-y16GTZ-r7ffNq4SPWuiKBwGmqNMfA',
    authDomain: 'interview-89e09.firebaseapp.com',
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: 'interview-89e09.firebasestorage.app',
    messagingSenderId: '87689043441',
    appId: '1:87689043441:web:456a0976372d8e6dfc3850',
    measurementId: 'G-BZFXV0GLFE',
  },
  /** Optional fallback if create-order does not return key_id */
  razorpayKeyId: '',
};
