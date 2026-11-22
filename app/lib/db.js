import { MongoClient, ObjectId } from "mongodb";

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://bazardor:S8TbSyMK%402hdBUU@bazardor.anxfedh.mongodb.net/pizzahub_db?retryWrites=true&w=majority&appName=bazardor";

const dbName = process.env.MONGODB_DB || "pizzahub_db";

let cachedClient = null;
let cachedDb = null;

export async function getDb() {
  if (cachedDb) return cachedDb;
  if (!cachedClient) {
    cachedClient = new MongoClient(uri, {
      maxPoolSize: 10,
    });
    await cachedClient.connect();
  }
  cachedDb = cachedClient.db(dbName);
  return cachedDb;
}

export async function getCollections() {
  const db = await getDb();
  return {
    db,
    usersCollection: db.collection("users"),
    menuItemsCollection: db.collection("menuItems"),
    ordersCollection: db.collection("orders"),
    transactionsCollection: db.collection("transactions"),
  };
}

export function toObjectId(id) {
  if (!id) return null;
  if (id instanceof ObjectId) return id;
  if (typeof id === "string" && ObjectId.isValid(id)) {
    return new ObjectId(id);
  }
  return null;
}

export function sanitizeUser(userDoc) {
  if (!userDoc) return null;
  const { passwordHash, ...rest } = userDoc;
  return {
    ...rest,
    _id: userDoc._id ? userDoc._id.toString() : userDoc.id,
    id: userDoc._id ? userDoc._id.toString() : userDoc.id,
  };
}
