const { getUser } = require("../Services/auth");

async function restrictToLoggedinUserOnly(req, res, next) {
  const userUid = req.cookies?.uid;

  if (!userUid) {
    console.log("Unauthorized. Please log in 1.");
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  const user = await getUser(userUid);

  if (!user) {
    console.log("Unauthorized. Please log in 2.");
    return res.status(401).json({ message: "Unauthorized. Invalid user." });
  }

  req.user = user;
  next();
}

async function checkAuth(req, res, next) {
  const userUid = req.cookies?.uid;

  const user = await getUser(userUid);

  req.user = user || null;
  next();
}

module.exports = {
  restrictToLoggedinUserOnly,
  checkAuth,
};
