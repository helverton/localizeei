import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

let cachedDb;
let cachedClient;

if (!uri) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local',
  );
}

if (!dbName) {
  throw new Error(
    'Please define the MONGODB_DB environment variable inside .env.local',
  );
}

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = await client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export default connectToDatabase;


// import { MongoClient, Db } from 'mongodb'

// const { DATABASE_URL, DATABASE_DB } = process.env

// let cachedClient: MongoClient;
// let cachedDb: Db;

// if (!DATABASE_URL) {
//   throw new Error(
//     "Please define the DATABASE_URL environment variable inside .env.local"
//   );
// }

// if (!DATABASE_DB) {
//   throw new Error(
//     "Please define the DATABASE_DB environment variable inside .env.local"
//   );
// }

// // export async function connectToDatabase() {
// //   if (cachedClient && cachedDb) {
// //     return { client: cachedClient, db: cachedDb };
// //   }

// //   const client = await MongoClient.connect(DATABASE_URL, {
// //     //useNewUrlParser: true,
// //     useUnifiedTopology: true,
// //   });

// //   const db = await client.db(DATABASE_DB);

// //   cachedClient = client;
// //   cachedDb = db;

// //   return { client, db };
// // }

// export async function connectToDatabase() {
//   if (cachedDb) {
//     return {
//       client: cachedClient,
//       db: cachedDb,
//     };
//   }

//   // set the connection options
//   const opts = {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//   };

//   // Connect to cluster
//   let client = new MongoClient(DATABASE_URL, opts);
//   await client.connect();
//   let db = client.db(DATABASE_DB);

//   // set cache
//   cachedClient = client;
//   cachedDb = db;

//   return {
//       client: cachedClient,
//       db: cachedDb,
//   };
// }
