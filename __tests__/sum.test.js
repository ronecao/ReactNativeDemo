const sum = require('../sum');

test('adds 1 + 2 to equal 3', () => {
    return sum("value","storage").then(data=>{
        console.log(data);
        expect(data).toBe('success');
    })
});
