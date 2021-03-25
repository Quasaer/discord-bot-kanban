module.exports = {
	name: 'balance',
	description: 'balance',
	execute(message, args) {
		const target = message.mentions.users.first() || message.author;
        return message.channel.send(`${target.tag} has ${currency.getBalance(target.id)}💰`);
	},
};

