// export const globalErrHandler = async (err, req, res, next) => {
//     const stack = err?.stack;
//     const statusCode = err?.status ? err?.status : 500;
//     const message = err?.message;
//     res.status(statusCode).json({
//       stack,
//       message,
//     });
//   };
export const globalErrHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    status: "error",
    message: err?.message || "Something went wrong",
    stack: process.env.NODE_ENV === "production" ? null : err?.stack,
  });
};

  // 404 not found handler
export const notFound = async (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl}not found`);
  
    next(err)
  
    // res.status(404).render("404");
  };