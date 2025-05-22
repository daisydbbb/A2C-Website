const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;

// could also run npm install --save express-async-handler
// and then use it as follows:

// import asyncHandler from "express-async-handler";
// router.get("/", asyncHandler(async (req, res) => {
//   res.json(products);
// }));
