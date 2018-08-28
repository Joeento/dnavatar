'use strict';

const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const port = process.env.PORT || 5000;

const genomeLink = require('genomelink-node');

const scope = 'report:excessive-daytime-sleepiness report:freckles report:male-pattern-baldness-aga report:skin-pigmentation report:weight report:beard-thickness report:eye-color';

app.use(session({
	secret: 'YOURSECRET',
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: 30 * 60 * 1000
	}
}));

let report_to_trait = {
	'excessive-daytime-sleepiness': {
		key: 'eye_details',
		map: [0, 0, 2, 4, 6]
	},
	'freckles': {
		key: 'cheek_details',
		map: [0, 0, 0, 6, 6]
	},
	'male-pattern-baldness-aga': {
		key: 'hair',
		map: [10, 6, 20, 18, 28]
	},
	'skin-pigmentation': {
		key: 'skin_tone',
		map: [21, 5, 16, 0, 3]
	},
	'weight': {
		key: 'body',
		map: [1, 1, 0, 2, 4]
	},
	'beard-thickness': {
		key: 'beard',
		map: [0, 1, 2, 4, 5]
	},
	'eye-color': {
		key: 'pupil_tone',
		map: [4, 12, 2, 15, 0]
	}
};

//Helper function
async function getVisualData(token, scope) {
	let reports = [];
	let results = {};
	let red_hair_index = null;
	let black_hair_index = null;
	const scopes = scope.split(' ');
	reports = await Promise.all(scopes.map((name) => {
		return genomeLink.Report.fetch({
			name: name.replace(/report:/g, ''),
			population: 'european',
			token: token
		});
	}));
	
	for (let index in reports) {
		if (reports[index]._data.hasOwnProperty('phenotype')) {
			let report = reports[index]._data.phenotype.url_name;	
			if (report_to_trait.hasOwnProperty(report)) {
				let trait = report_to_trait[report].key;
				results[trait] = {};
				results[trait].score = report_to_trait[report].map[reports[index]._data.summary.score];
				results[trait].text = reports[index]._data.summary.text;
			}
			
			
		}
	}
	return results;
}

// API calls
app.get('/api/hello', (req, res) => {
	res.send({ express: 'Hello From Express' });
});

app.get('/api/auth', async (req, res) => {
	const authorizeUrl = genomeLink.OAuth.authorizeUrl({ scope: scope });
	const results = req.session.oauthToken ? await getVisualData(req.session.oauthToken, scope) : {};
	res.send({
		authorize_url: authorizeUrl,
		is_authed: req.session.oauthToken ? true : false,
		results: results
	});
});

app.get('/api/code', async (req, res) => {
	req.session.oauthToken = await genomeLink.OAuth.token({ requestUrl: req.url });
	const results = req.session.oauthToken ? await getVisualData(req.session.oauthToken, scope) : {};

	res.send({
		is_authed: req.session.oauthToken ? true : false,
		results: results
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