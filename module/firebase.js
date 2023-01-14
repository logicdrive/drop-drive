import { initializeApp } from "firebase/app"

const firebaseConfig = {
  apiKey: process.env['REACT_APP_API_KEY'],
  authDomain: "drop-drive-a0792.firebaseapp.com",
  projectId: "drop-drive-a0792",
  storageBucket: "drop-drive-a0792.appspot.com",
  messagingSenderId: "394414690934",
  appId: "1:394414690934:web:be42d848004334d0abc557"
}

export default initializeApp(firebaseConfig)