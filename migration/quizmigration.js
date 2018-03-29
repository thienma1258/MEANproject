const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'chatonline' });


const usermigrationtable='create table if not exists quiz(id uuid,createtime timestamp,difficult text,question text,corretanswer text,wronganswer set<text>,type text, primary key (id)) ';
const droptable='drop table quiz';
const args= process.argv.slice(2);
if(args=='migration'){
    client.execute(usermigrationtable,(err)=>{
        if(err) console.log(err);
        else{
            console.log('migration quiz success');
        }
    })
}
else if(args=='callback'){
    client.execute(droptable,(err)=>{
        if(err) console.log(err);
        else{
            console.log('drop table quiz success');
        }
    })
}
else{
    console.log('call migration or call back');
}
