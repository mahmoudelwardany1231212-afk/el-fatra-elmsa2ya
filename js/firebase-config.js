const firebaseConfig = {
  apiKey: "AIzaSyDxsFQSBKLhJeuJD4d7o-p72sTT5FBIi60",
  authDomain: "el-fatra-elmsa2ya.firebaseapp.com",
  databaseURL: "https://el-fatra-elmsa2ya-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "el-fatra-elmsa2ya",
  storageBucket: "el-fatra-elmsa2ya.firebasestorage.app",
  messagingSenderId: "368129458604",
  appId: "1:368129458604:web:81a873b9a6288158e1fa09",
  measurementId: "G-NBN7CXTH1H"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
