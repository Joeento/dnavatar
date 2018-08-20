export let colorPresets = {
	beard_tone: [
		{
			id: 1579802,
			hex: '000000'
		}, {
			id: 3415562,
			hex: '351e0b'
		}, {
			id: 3218460,
			hex: '321d1d'
		}, {
			id: 3615014,
			hex: '372927'
		}, {
			id: 4271653,
			hex: '422e25'
		}, {
			id: 5844766,
			hex: '5a301e'
		}, {
			id: 3875595,
			hex: '3c240b'
		}, {
			id: 6700322,
			hex: '663e22'
		}, {
			id: 6242825,
			hex: '5f4309'
		}, {
			id: 7162651,
			hex: '6e4c1b'
		}, {
			id: 7162651,
			hex: '6e4c1b'
		}, {
			id: 9663272,
			hex: '947329'
		}, {
			id: 7033126,
			hex: '6c5127'
		}, {
			id: 8678208,
			hex: '846c40'
		}, {
			id: 9201721,
			hex: '8d6839'
		}, {
			id: 8151876,
			hex: '7d6345'
		}, {
			id: 8151876,
			hex: '7d6345'
		}
		
	],
};
export function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}