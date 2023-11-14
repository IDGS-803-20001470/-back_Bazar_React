// config/firebaseConfig.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

const firebaseConfig = {
  apiKey: "AIzaSyB1uf-ha4j9a_punB4aGyJRei4AcxYF0Gw",
  authDomain: "productos-eceda.firebaseapp.com",
  projectId: "productos-eceda",
  storageBucket: "productos-eceda.appspot.com",
  messagingSenderId: "196255489745",
  appId: "1:196255489745:web:3a55b0728a906eda4beff0",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`, // Utiliza el projectId de la configuración de Firebase
});

module.exports = admin;
