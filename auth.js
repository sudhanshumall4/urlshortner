const { getUser } = require("../service/auth");

function checkforAuthentication(req,res,next)
{  const authorizationHeaderValue= req.headers["authorization"];
req.user=null;
if(
    !authorizationHeaderValue||
    !authorizationHeaderValue.startsWith('Bearer')
    )
return next();
const token=authorizationHeaderValue.split('Bearer ')[1];
const user=getUser(token);

req.user=user;
next();
}
// //async function restrictToLoggedinUserOnly(req, res, next) {
//     const userUid = req.headers["authorization"];
//     if (!userUid) {
//         return res.redirect("/login");
//     }

//     const token = userUid.split('Bearer ')[1]?.trim(); // Split correctly and trim
//     if (!token) {
//         return res.redirect("/login");
//     }

//     const user = await getUser(token);
//     if (!user) {
//         return res.redirect("/login");
//     }

//     req.user = user;
//     next();
// }

// async function checkAuth(req, res, next) {
//     const userUid = req.headers["authorization"];
//     if (!userUid) {
//         return res.redirect("/login");
//     }

//     const token = userUid.split('Bearer ')[1]?.trim(); // Handle missing token
//     if (!token) {
//         return res.redirect("/login");
//     }

//     const user = await getUser(token);
//     req.user = user;
//     next();
// }

module.exports = {
    restrictToLoggedinUserOnly,
    checkAuth,
};
