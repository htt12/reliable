exports.generateRandomString = function (length) {
    const possibles = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let output = '';
    while (output.length !== length) {
        output += possibles[(possibles.length * Math.random()) >> 0];
    }
    return output;
}
//==============COOO0O0O0O0O0O0O0O0KIES ARE BAD===================//
exports.didItAllForTheCookies = function (text) {
    const cookies = text.split(';');
    const output = {};
    cookies.forEach(string => {
        const pieces = string.split('=');
        output[pieces[0].trim()] = pieces[1];
    });
    console.log('so you can take that wookie', output);
    return output;
}