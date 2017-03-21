var adminRouter = express.Router();
var text = 'hello, world!';
adminRouter.get('*', (req, res) => {
  Router.run(routes, req.url, (Handler) => {
    var adminApp = React.renderToString(<Handler text={text}/>);
    res.render('admin', {
      title: 'Glossika',
      adminApp
    });
  });
});
module.exports = adminRouter;