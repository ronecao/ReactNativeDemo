import Storage from '../src/Storage';

const st= new Storage();

test ('storage test'),()=>{


    return st.addRecord("value","storage").then(data=>{
        console.log(data);
        expect(data).toBe('success');
    })

}


