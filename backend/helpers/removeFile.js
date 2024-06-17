const fs = require("fs").promises;

const removeFile = async (path) => {
  let photoExisted;
  try {
    await fs.access(path);
    photoExisted = true;
  } catch {
    photoExisted = false;
  }
  if (photoExisted) {
    fs.unlink(path);
  }
};

module.exports = removeFile;
