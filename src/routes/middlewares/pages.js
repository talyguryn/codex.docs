const Pages = require('../../controllers/pages');
const asyncMiddleware = require('../../utils/asyncMiddleware');

/**
 * Middleware for all /page/... routes
 * @param req
 * @param res
 * @param next
 */
module.exports = asyncMiddleware(async function (req, res, next) {
  try {
    if (!global.menu) {
      const menu = await Pages.getAll();

      global.menu = menu.map(page => {
        return Object.assign(page.data);
      });
    }

    res.locals.menu = global.menu;
  } catch (error) {
    console.log('Can not load menu:', error);
  }

  next();
});
