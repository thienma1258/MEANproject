const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'chatonline' });


const usermigrationtable='create table IF NOT EXISTS user(name text,username text,createdate timestamp,email text,image text,password text, primary key(username))';
const droptable='drop table user';
const args= process.argv.slice(2);
if(args=='migration'){
    client.execute(usermigrationtable,(err)=>{
        if(err) console.log(err);
        else{
            console.log('migration user success');
        }
    })
}
else if(args=='callback'){
    client.execute(droptable,(err)=>{
        if(err) console.log(err);
        else{
            console.log('drop table user success');
        }
    })
}
else{
    console.log('call migration or call back');
}
