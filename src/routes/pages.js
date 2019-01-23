const express = require('express');
const router = express.Router();
const Pages = require('../controllers/pages');

/**
 * Create new page form
 */
router.get('/page/new', async (req, res) => {
  let pagesAvailable = await Pages.getAll();

  res.render('pages/form', {
    pagesAvailable,
    page: null
  });
});

/**
 * Edit page form
 */
router.get('/page/edit/:id', async (req, res, next) => {
  const pageId = req.params.id;
  const version = parseInt(req.query.version);

  try {
    let page = await Pages.get(pageId, version);

    res.render('pages/form', {
      page
    });
  } catch (error) {
    res.status(404);
    next(error);
  }
});

/**
 * Edit page form
 */
router.get('/page/history/:id', async (req, res, next) => {
  const pageId = req.params.id;

  try {
    let pageHistory = await Pages.getPageHistory(pageId);

    res.render('pages/history', {
      pageId,
      pageHistory
    });
  } catch (error) {
    res.status(404);
    next(error);
  }
});

/**
 * View page
 */
router.get('/page/:id', async (req, res, next) => {
  const pageId = req.params.id;
  const version = parseInt(req.query.version);

  try {
    let page = await Pages.get(pageId, version);

    res.render('pages/page', {
      page
    });
  } catch (error) {
    res.status(404);
    next(error);
  }
});

module.exports = router;
