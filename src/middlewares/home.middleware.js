module.exports = (req, res) => {
  console.log({user:req.user});
  return res.json({
    success: true,
    message: "welcome to the warehouzit API",
  });
};
