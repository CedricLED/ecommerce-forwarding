const express = require('express');
const router = express.Router();
router.get('/users', checkAuth, (req, res) => {
  res.render('plans', {
    user: req.user,
    plans: app.plans,
  });
});
router.get('/plan/:id/edit', checkAuth, (req, res) => {
  const planID = request.params.id;
  app.plans.find((plan) => plan.id === planID).then((plan) => {
    res.render('plans_edit', {
      user: req.user,
      plan: plan,
    });
  });
});
router.get('/plan/create', checkAuth, (req, res) => {
  res.render('plans_create', {
    user: req.user,
  });
});

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/discord');
};

// TODO add admin specific permissions
module.exports = router;
