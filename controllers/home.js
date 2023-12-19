const getHome = (req, res) => {
  res.render("pages/index", {
    error: req.session.error,
    success: req.session.success,
  });
  req.session.error = null;
  req.session.success = null;
  return;
};

module.exports = { getHome };
