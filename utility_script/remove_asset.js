require("module-alias/register");
// const { performance } = require("perf_hooks");

const { getDb } = require("@db");

async function reserveAssetInShuffle(db, id, fields) {
  try {
    const collection = db.collection("shuffle");

    return await collection.updateOne(
      { _id: id },
      {
        $set: { ...fields },
      }
    );
  } catch (error) {
    console.error;
  }
}

async function run() {
  try {
    let db = await getDb();
    let c = db.collection("shuffle");
    const id = "PARDGF6H4Z2GNRFG2DNN4TNOWNHU3EMH6OLHZXPVEDN74YNE7LHVIIFKH4";
    const shuffleRes = await c.findOne(
      { _id: id },
      { projection: { _id: 0, availableAssets: 1 } }
    );

    const fields = {
      availableAssets: shuffleRes.availableAssets,
    };
    fields.availableAssets.pop();
    // console.log(fields.reservedAssets, "reserved");
    // console.log(fields.availableAssets.length, "avail length");

    let res = await reserveAssetInShuffle(db, id, fields);
    console.log(res, "FINAL RES");

    process.exit();
  } catch (error) {
    console.error;
  }
}

run();
