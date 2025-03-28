const { ObjectId } = require("mongodb");
// id should is the shuffle host's creator account token
// async function createCompSet(db, fields) {
//   try {
//     const collection = db.collection("compSets");

//     return await collection.insertOne({
//       _id: fields.id,
//       name: fields.name,
//       tickers: fields.tickers,
//       sector: fields.sector,
//       valuationMetric: fields.valuationMetric,
//       multipleLimits: fields.multipleLimits,
//       commentary: fields.commentary,
//     });
//   } catch (error) {
//     console.error;
//   }
// }
// exports.createCompSet = createCompSet;

async function createCompSet(db, fields) {
  let collection = db.collection("compSets");

  return await collection.insertOne({ ...fields });
}

exports.createCompSet = createCompSet;

async function updateCompSet(db, id, fields) {
  let collection = db.collection("compSets");

  return await collection.updateOne(
    { _id: ObjectId.createFromHexString(id) },
    {
      $set: {
        ...fields
      }
    }
  );
}

exports.updateCompSet = updateCompSet;

async function getCompSets(db) {
  try {
    let collection = db.collection("compSets");
    const compSets = await collection.find({}).toArray();
    console.log("COMP SETS: \n", compSets);
    return compSets;
  } catch (error) {
    console.error(error);
  }
}

exports.getCompSets = getCompSets;

async function getCompSet(db, id) {
  try {
    let collection = db.collection("compSets");
    const compSet = await collection.findOne({
      _id: ObjectId.createFromHexString(id)
    });
    console.log("COMP SETS: \n", compSet);
    return compSet;
  } catch (error) {
    console.error(error);
  }
}

exports.getCompSet = getCompSet;

async function deleteCompSet(db, id) {
  try {
    let collection = db.collection("compSets");
    const compSet = await collection.deleteOne({
      _id: ObjectId.createFromHexString(id)
    });
    console.log("COMP SETS: \n", compSet);
    return compSet;
  } catch (error) {
    console.error(error);
  }
}

exports.deleteCompSet = deleteCompSet;
