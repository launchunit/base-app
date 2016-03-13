
// Load the Routes
// app.Server.use('/signin', require('./signin'));

app.Server.use('*', (req, res, next) => {
  // return res.render('index');
  // return res.render('index2');
  return res.render('index3');
});
