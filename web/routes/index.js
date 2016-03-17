
// Load the Routes
// app.Server.use('/signin', require('./signin'));

app.Server.use('*', (req, res, next) => {

  // return res.render('style_guide');
  // return res.render('salesjedi_dashboard');
  // return res.render('salesjedi');
  // return res.render('money_ai');
  return res.render('core_email');
});
