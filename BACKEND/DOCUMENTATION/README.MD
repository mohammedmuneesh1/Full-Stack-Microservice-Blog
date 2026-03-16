

TECHNOLOGIES USING 



FRONTEND:REACT, NEXT JS;
BACKEND:NODE JS ,EXPRESS JS;
CACHING:REDIS;
DATABASE: MONGODB OR POSTGRESQL(NEONDB)
HOSTING: AWS (RABBITMQ)
CONTERNIZATION: DOCKER 
MESSAGE BROKER: RABBIT MQ 


TWO SERVICES : USER  OR BLOG 

FEATURE                  MONOLOTHIC ARCHITECTURE                                         MICROSERVICE ARCHITECTURE 

BEST FOR    SMALL TO MEDIUM-SIZED APPLICATIOJNS WITH SIMPLER REQUIREMENTS  |    LARGE-SCALE APPLICATIONS THAT NEED FLEXIBILITY AND SCALABILITY 


SCALABILITY : DIFFICULT TO SCALE PARTS INDEPENDTLY MUST SCALE THE ENTIRE SYSTEM  |  EASILY SCHALABLE AS INDIVIDUAL SERVICES CAN BE SCALED SEPERATLY 

DEVELOPMENT:   EASIER TO DEVELOP INITIALLY BUT BECOMES COMPLEX AS IT GROWS |   MORE COMPLEX INTIALLY BUT EASIER TO MANAGE IN LARGE APPLICATIONS 

DEPLOYMENT REQUIRES REDEPLOYING THE ENTIRE APPLICATION FOR UPDATES |   ALLOWS INDEPENDENT DEPLOYMENT OF SERVICES WITHOUT AFFECTING OTHERS 

TECHNOLOGY STACK TYPICALLY SES A SINGLE TECHNOLOGY STACK FOR ENTIRE SYSTEM  |  CAN USE DIFFERENT TECHNOLOGIES FOR DIFFERENT SERVICES. 





//---------------------------------------------- ts-node start ---------------------------------------------------

🛠️ What ts-node Does
- ts-node is a tool that lets you run TypeScript files directly without compiling them first
- With ts-node, you can skip the manual compile step:

//---------------------------------------------- ts-node end ---------------------------------------------------

//---------------------------------------------- tsx vs .tsx start ---------------------------------------------------

.tsx file extension = TypeScript + JSX (React files)

tsx npm package = A TypeScript execution tool for Node.js (backend)

The tsx package is a command-line tool for running TypeScript files in Node.js. It has nothing to do with React or frontend code. It's just a modern replacement for ts-node.
Think of it like this:

node runs JavaScript files
tsx runs TypeScript files (backend TypeScript)
It's named tsx but it's purely for Node.js/backend usage

Your .ts files will stay as .ts files. You're just using the tsx command to execute them instead of ts-node.

//---------------------------------------------- tsx vs .tsx end ---------------------------------------------------


//---------------------------------------------- MONGODB CONNECTION START ---------------------------------------------------

1. maxPoolSize (Default: 100)

What it is: Maximum number of simultaneous database connections your app can have open.
If 10 customers (requests) are being served, the 11th customer must wait until a waiter is free

Too high (100): Wastes memory, your database might reject connections
Too low (2): Requests queue up, app becomes slow
Good range: 5-20 for small apps, 50-100 for high-traffic apps


2. serverSelectionTimeoutMS (Default: 30000 = 30 seconds)

What it is: How long to wait when trying to find an available MongoDB server.

You're calling a friend, phone rings...
After 5 seconds of ringing, you hang up (timeout)
Default 30s is too long - your users will wait 30 seconds to see an error!
Good value: 5000-10000ms (5-10 seconds)

When it triggers:

MongoDB server is down
Wrong connection string
Network issues


serverSelectionTimeoutMS: 10000
What it does:

When your app tries to connect to MongoDB, it needs to find an available server
This timeout controls how long it will search for a server before giving up
After 10 seconds of searching, if no server responds, it throws an error

When it's used:

Initial connection attempt when your app starts
When connection is lost and trying to reconnect
When all servers in a replica set are unavailable

Example scenario:

Your app starts: mongoose.connect(...)
Mongoose tries to reach MongoDB server
Server is down or wrong connection string
Waits 10 seconds...
No server found → throws error: MongoServerSelectionError






3. socketTimeoutMS (Default: 0 = no timeout)

What it is: How long to wait for a response from the database for a single operation.
Real-world example:

You send a letter (query) to MongoDB
You wait for a reply...
After 45 seconds of no response, you assume the letter is lost
Prevents your app from hanging forever on slow queries

When it triggers:

Very large query taking too long
Database is overloaded
Network is slow





 4.connectTimeoutMS (Default: 30000 = 30 seconds)
connectTimeoutMS
What it does: How long to wait to establish the TCP connection (the network handshake)
Example:

Your app says: "Hey MongoDB server at IP 192.168.1.100, let me connect!"
Waiting for the network handshake to complete...
After 10 seconds, if handshake not complete → timeout

This is about: Physical network connection (TCP socket)


//---------------------------------------------- MONGODB CONNECTION END---------------------------------------------------





//---------------------------------------------- NEON DB START ---------------------------------------------------


✔️ What Neon DB actually is

Neon is a serverless, cloud PostgreSQL platform.

✔️ Neon DB

->Type: Relational Database
->Engine: PostgreSQL
->Structure: Tables, rows, columns
->Uses SQL
->Strong schema
->Ideal for: transactions, joins, consistency

Basically:
Structured → SQL → Relational → Postgres



Think of it as:

PostgreSQL + auto-scaling + branching + no server management.

You don’t install Postgres.
You don’t maintain Postgres.
Neon handles all the ugly stuff for you.

✔️ So what makes Neon different from normal PostgreSQL?

Here’s the list so your brain understands it in one shot:


1. Serverless Postgres

No VMs
No EC2
No hardware
No maintenance
No stupid "tune your PostgreSQL memory" drama

They scale storage + compute automatically.


2. Branching

This is their shiny feature.

You can:

Duplicate your entire DATABASE instantly

Create dev/testing branches

Rollback changes

Test migrations safely

It’s like Git, but for databases.

This is insane and super useful.




//---------------------------------------------- NEON DB END ---------------------------------------------------





Serverless ≠ “no servers.”
It just means you don’t manage the servers, and the compute wakes up only when needed.

✔️ What serverless ACTUALLY means
"You don’t run or manage the server.

You only pay for the exact time your code/database is doing work."

Period.

No stupid:

EC2 instances

VM sizes

RAM

CPU

Scaling rules

The platform handles all that.


✔️ Does it wake only when requests come?

Yes.
That’s exactly part of it.
Serverless characteristics:
No CPU running 24/7
It wakes up only when a request happens
It shuts down again after inactivity

You only pay for:
queries executed
storage
compute seconds used
Not for idle time.



✔️ Example: Neon Serverless Postgres

If your app gets 0 traffic at night:

CPU sleeps
Storage persists
You pay only for storage
DB wakes automatically when a query arrives


