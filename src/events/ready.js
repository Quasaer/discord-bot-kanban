const { Users } = require('../dbObjects.js');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};