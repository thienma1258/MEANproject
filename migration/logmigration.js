const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'chatonline' });


const usermigrationtable='create table if not exists log(id uuid,createtime timestamp,log set<text>,PRIMARY KEY (id,createtime)) WITH CLUSTERING ORDER BY (createtime DESC);';
const droptable='drop table log';
const args= process.argv.slice(2);
if(args=='migration'){
    client.execute(usermigrationtable,(err)=>{
        if(err) console.log(err);
        else{
            console.log('migration log success');
        }
    })
}
else if(args=='callback'){
    client.execute(droptable,(err)=>{
        if(err) console.log(err);
        else{
            console.log('drop table log success');
        }
    })
}
else{
    console.log('call migration or call back');
}
