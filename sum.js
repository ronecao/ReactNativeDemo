import Storage from './src/Storage'

async function sum(a, b) {
    let st = new Storage();
    var retresult;
    try{
        await st._save("good","testlab").then((saveres)=>{retresult=saveres; console.log(retresult);});

        await st._get("testlab").then(data=>{
            retresult=data;
        })
        console.log('returning result' + retresult);
        return retresult;
    }catch (error)
    {
        console.log(error);
    }




}

module.exports = sum;