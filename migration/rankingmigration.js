const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'chatonline' });


const usermigrationtable='create type if not exists compete (listanswer set<text>,point bigint,lastupdate timestamp)';
const droptable='';
const args= process.argv.slice(2);
if(args=='migration'){
    client.execute(usermigrationtable,(err)=>{
        if(err) console.log(err);
        else{
            const altertable='alter table user Add competition frozen<compete>'
           client.execute(altertable,(err)=>{
               if(err) console.log(err);
               else{
                   console.log('migration success');
               }
           })
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
