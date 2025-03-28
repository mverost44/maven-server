async function findAdmin(db, id) {
  const collection = db.collection("admin");
  const admin = await collection.findOne({ _id: id });
  return admin;
}

exports.findAdmin = findAdmin;
