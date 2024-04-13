import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
	// apiKey: 'AIzaSyAb9twMin6IT-tfbzaa6qolPqGJy97410s',
	// authDomain: 'praktikum-4ddcd.firebaseapp.com',
	// projectId: 'praktikum-4ddcd',
	// storageBucket: 'praktikum-4ddcd.appspot.com',
	// messagingSenderId: '559751721263',
	// appId: '1:559751721263:web:28eb5e6696d630b187f1da',
	apiKey: 'AIzaSyDU4ckrZGNXKf2kAPPnA_PzCUKsCjnEjnU',
	authDomain: 'iusi-97224.firebaseapp.com',
	projectId: 'iusi-97224',
	storageBucket: 'iusi-97224.appspot.com',
	messagingSenderId: '26611734939',
	appId: '1:26611734939:web:1f3149899f047e193c693e',
	measurementId: 'G-9WVQMSX9GQ',
}

const app = initializeApp(firebaseConfig)
const storage = getStorage(app)

export { storage }
