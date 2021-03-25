const { Users } = require('../dbObjects.js');
const { currency } = require('../index.js');


module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		const storedBalances = await Users.findAll();
		storedBalances.forEach(b => currency.set(b.user_id, b));
        console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};