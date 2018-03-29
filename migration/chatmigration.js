const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'chatonline' });


const migrationtypetable="Create type if not exists  chat(name text,image text,time timestamp,content text)";
const droptable='drop table conversationdetails';
const args= process.argv.slice(2);
if(args=='migration'){
    client.execute(migrationtypetable,(err)=>{
        if(err) console.log(err);
        else{
            const migrationconverstationdetailstable="create table if not exists  conversationdetails(id uuid,users set<text>,name text,chatdetail set<frozen<chat>>,lasttime timestamp,primary key (name))";

           client.execute(migrationconverstationdetailstable,(err)=>{
            if(err) return;
            else{
                const migrationconverstationtable="create table if not exists  conversation(username text,listchat set<uuid>,primary key (username))";
                client.execute(migrationconverstationtable,(err)=>{
                    if(err) return;
                    // migration chat all room;
                    const migrationchatallroom="insert into conversationdetails(id,chatdetail,lasttime,name,users) values (now(),null,dateof(now()),'Rooms world',null) ";
                    client.execute(migrationchatallroom,(err)=>{
                        console.log("migration all success");
                    })
                });
            }
           });
        }
    })
}
else if(args=='callback'){
    client.execute(droptable,(err)=>{
        if(err) console.log(err);
        else{
            const droptablecv='drop table conversation';
            client.execute(droptablecv,(err)=>{
                const droptype='drop type chat';
                client.execute(droptype,(err)=>{
                    console.log('drop all success');
                });
            });
            // console.log('drop table converstation success');
        }
    })
}
else{
    console.log('call migration or call back');
}
