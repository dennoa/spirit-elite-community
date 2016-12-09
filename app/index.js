import ReactDom from 'react-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import routes from './config/routes';

firebase.initializeApp({
	apiKey: 'AIzaSyA0cCxhmk5QINS5_nUlUQv3udtBA02vnA4',
	authDomain: 'spirit-elite-community.firebaseapp.com',
	databaseURL: 'https://spirit-elite-community.firebaseio.com',
	storageBucket: 'spirit-elite-community.appspot.com',
	messagingSenderId: '729695732287'
});

ReactDom.render(
	routes,
	document.getElementById('app')
);
