const getHome = (req, res) => {
  return res.render("pages/index");
};

module.exports = { getHome };
