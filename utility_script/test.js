require("module-alias/register");
// const { performance } = require("perf_hooks");

const { getDb } = require("@db");
const { algodClient } = require("@util");

function getUrlFromIpfs(url) {
  const core = url.slice(7);
  return "https://ipfs.io/ipfs/" + core;
}

async function getAvailableAssetIds(accountInfo, numAssetsNeeded) {
  try {
    let numAssetsAvail = 0;
    console.log(accountInfo);

    const availAssetIds = accountInfo.assets
      .filter((asset, i) => {
        if (asset.amount === 0) return false; // Filter out asset if it's not available
        if (!accountInfo["created-assets"].some((a) => a.index === asset["asset-id"])) return false; // Filter out asset if this acct did not create it
        if (numAssetsAvail === numAssetsNeeded) return false; // Filter out asset if num needed is already fulfilled

        console.log("AVAILABLE ASSET #: ", numAssetsAvail);
        numAssetsAvail += 1;
        return true;
      })
      .map((asset) => asset["asset-id"]);

    return availAssetIds;
  } catch (e) {
    console.error(e);
  }
}

// ({ ["created-assets"]: assets = [] }) => assets.map(({ index }) => index)

async function getNftInventory(address, numAssetsNeeded) {
  try {
    const accountInfo = await algodClient.accountInformation(address).do();
    console.log(accountInfo, "ACCT INFO");
    const availAssetIds = await getAvailableAssetIds(accountInfo, numAssetsNeeded);
    console.log("availAssetIds length: ", availAssetIds.length);

    const inventory = accountInfo["created-assets"]
      .filter(({ index }) => availAssetIds.includes(index))
      .map(({ index, params }) => ({
        index: index,
        name: params.name,
        unitName: params["unit-name"],
        url: params.url.includes("ipfs://") ? getUrlFromIpfs(params.url) : params.url,
      }));

    console.log("INVENTORY length: ", inventory.length);
    return inventory;
  } catch (err) {
    console.log(err);
  }
}

async function run() {
  try {
    const id = "PARDGF6H4Z2GNRFG2DNN4TNOWNHU3EMH6OLHZXPVEDN74YNE7LHVIIFKH4";
    const inv = await getNftInventory(id, 25);

    console.log(inv, "inventory return value");

    process.exit();
  } catch (error) {
    console.error;
  }
}

run();
