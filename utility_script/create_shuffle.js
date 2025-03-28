// module-alias/register enables the use of @ in imports
require("module-alias/register");
const yargs = require("yargs");
const { getDb } = require("@db");
const { getNftInventory } = require("../util/algo");

async function createOrUpdateShuffle(db, id, fields) {
  try {
    const collection = db.collection("shuffle");

    return await collection.updateOne(
      { _id: id },
      {
        $set: { ...fields },
      },
      { upsert: true }
    );
  } catch (error) {
    console.error;
  }
}

async function run() {
  try {
    let db = await getDb();
    const argv = yargs
      .options({
        a: {
          alias: "address",
          type: "string",
          demandOption: true,
          describe:
            "The algo wallet address that will be used. Passing `prod` as an option will use the pard algo-wallet address. `dev` will use your address. If no acct alias is specified, the string passed will be used- this should be a valid algo-wallet address.",
        },
        r: {
          alias: "range",
          type: "array",
          demandOption: false,
          describe:
            "Sets a shuffle's availableAssets based on a range specified by a start and end ID (asset number). Specify a range of assets by passing an array: [startingID, endID] ex: [36, 78]",
        },
        n: {
          alias: "number-assets",
          type: "number",
          demandOption: false,
          describe:
            "Ensures that the passed number of assets is available in the shuffle. The first `X` amount of available assets are used- `X` being the number specified. If specified with the `-r` flag, the first value will be used as the starting point and every available asset will be returned until `X` amount is fulfilled- regardless of -r last value",
        },
        p: {
          alias: "price",
          type: "number",
          demandOption: false,
          describe:
            "The whole number price of the shuffle in algos. Format as whole numbers - NOT the typical algo way. For example: 15 algos entered as 15, 1.6 algo entered as 1.6, 0.5 algo as 0.5",
        },
        o: {
          alias: "open",
          type: "boolean",
          demandOption: false,
          describe: "Sets the shuffle to open or closed",
        },
      })
      .help()
      .alias("help", "h").argv;
    console.log(argv, "argv!!!");

    // ADDRESS
    let id;
    if (argv.address === "dev") {
      id = "U5RDEH7AEDTAGDG2FZ4ODWZS27MSGW4BLUJPRB7B76UQHSNKM56MREWM2A";
    } else if (argv.address === "prod") {
      id = "PARDGF6H4Z2GNRFG2DNN4TNOWNHU3EMH6OLHZXPVEDN74YNE7LHVIIFKH4";
    } else {
      id = argv.address;
    }

    // if no numReq or range exists- exit w an error
    if (!argv.n && !argv.r) {
      console.error("Please enter a search range -r or a number of assets required -n");
      process.exit();
    }

    // Set which asset to start the search at
    const searchRange = !argv.r
      ? { first: 0, last: argv.n }
      : { first: argv.r[0], last: argv.r[1] };

    const assets = await getNftInventory(id, searchRange);
    console.log("ASSETS.lENGTH: ", assets.length);

    const fields = {
      name: "Algopard",
      isOpen: argv.o || false,
      entryPrice: argv.price || 0.1,
      totalAssets: assets.length,
      availableAssets: assets,
      reservedAssets: [],
    };

    let res = await createOrUpdateShuffle(db, id, fields);

    console.log(res, "FINAL RES");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit();
  }
}

run().catch((e) => console.error(e));
