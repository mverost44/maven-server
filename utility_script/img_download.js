const util = require("util");
const exec = util.promisify(require("child_process").exec);
const metadata = require("./../metadata/_metadata.json");

async function run() {
  try {
    const urls = metadata.map((asset) => asset.image);

    for (let i = 0; i < urls.length; i++) {
      const { stdout, stderr } = await exec(
        `wget -O ~/algo/algopard_server/images/${i + 1}.png ${urls[i]}`
      );
      console.log("stdout:", stdout);
      console.error("stderr:", stderr);
    }

    console.log("DONE");
    process.exit();
  } catch (err) {
    console.error(err);
  }
}

run().catch(console.error);
