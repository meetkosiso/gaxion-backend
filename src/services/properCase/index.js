export const properCase = sentence => {
	return sentence.toLowerCase().replace(/[^\s_\-/]*/g, function(word) {
		return word.replace(/./, function(ch) {
			return ch.toUpperCase();
		});
	});
};
