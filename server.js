'use strict';

const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const port = process.env.PORT || 5000;

const genomeLink = require('genomelink-node');

app.use(session({
	secret: 'YOURSECRET',
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: 30 * 60 * 1000
	}
}));

// API calls
app.get('/api/hello', (req, res) => {
	res.send({ express: 'Hello From Express' });
});

app.get('/api/auth', (req, res) => {
	const scope = 'report:eye-color report:beard-thickness report:morning-person';
	const authorizeUrl = genomeLink.OAuth.authorizeUrl({ scope: scope });
	res.send({
		authorize_url: authorizeUrl,
		is_authed: req.session.oauthToken ? true : false
	});
});

app.get('/api/code', async (req, res) => {
	req.session.oauthToken = await genomeLink.OAuth.token({ requestUrl: req.url });
	res.send({
		is_authed: req.session.oauthToken ? true : false
	});
});


if (process.env.NODE_ENV === 'production') {
	// Serve any static files
	app.use(express.static(path.join(__dirname, 'client/build')));
	// Handle React routing, return all requests to React app
	app.get('*', function(req, res) {
		res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
	});
}
app.listen(port, () => console.log('Listening on port ${port}'));