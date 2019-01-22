const {pages: db} = require('../utils/database/index');

/**
 * @typedef {Object} PageData
 * @property {string} _id - page id
 * @property {string} title - page title
 * @property {*} body - page body
 * @property {string} parent - id of parent page
 * @property {boolean} isPublished - is published checkbox value
 */

/**
 * @class Page
 * @class Page model
 *
 * @property {string} _id - page id
 * @property {string} title - page title
 * @property {*} body - page body
 * @property {string} _parent - id of parent page
 */
class Page {
  /**
   * Find and return model of page with given id
   * @param {string} _id - page id
   * @param {boolean} onlyPublished - only published pages
   *
   * @returns {Promise<Page>}
   */
  static async get(_id, onlyPublished = false) {
    const query = {
      _id: _id
    };

    if (onlyPublished) {
      query['isPublished'] = onlyPublished;
    }

    const data = await db.findOne(query);

    return new Page(data);
  }

  /**
   * Find all pages which match passed query object
   *
   * @param {Object} query
   * @returns {Promise<Page[]>}
   */
  static async getAll(query = {}) {
    const docs = await db.find(query);

    return Promise.all(docs.map(doc => new Page(doc)));
  }

  /**
   * @constructor
   *
   * @param {PageData} data
   */
  constructor(data = {}) {
    if (data === null) {
      data = {};
    }

    if (data._id) {
      this._id = data._id;
    }

    this.data = data;
  }

  /**
   * Set PageData object fields to internal model fields
   *
   * @param {PageData} pageData
   */
  set data(pageData) {
    const {body, parent, isPublished} = pageData;

    this.body = body || this.body;
    this.title = this.extractTitleFromBody();
    this._parent = parent || this._parent;
    this.isPublished = isPublished || false;
  }

  /**
   * Return PageData object
   *
   * @returns {PageData}
   */
  get data() {
    return {
      _id: this._id,
      title: this.title,
      body: this.body,
      parent: this._parent,
      isPublished: this.isPublished
    };
  }

  /**
   * Extract first header from editor data
   * @return {string}
   */
  extractTitleFromBody() {
    const headerBlock = this.body ? this.body.blocks.find(block => block.type === 'header') : '';

    return headerBlock ? headerBlock.data.text : '';
  }

  /**
   * Link given page as parent
   *
   * @param {Page} parentPage
   */
  set parent(parentPage) {
    this._parent = parentPage._id;
  }

  /**
   * Return parent page model
   *
   * @returns {Promise<Page>}
   */
  get parent() {
    return db.findOne({_id: this._parent})
      .then(data => new Page(data));
  }

  /**
   * Return child pages models
   *
   * @returns {Promise<Page[]>}
   */
  get children() {
    return db.find({parent: this._id})
      .then(data => data.map(page => new Page(page)));
  }

  /**
   * Save or update page data in the database
   *
   * @returns {Promise<Page>}
   */
  async save() {
    if (!this._id) {
      console.log(this.data);
      const insertedRow = await db.insert(this.data);

      this._id = insertedRow._id;
    } else {
      await db.update({_id: this._id}, this.data);
    }

    return this;
  }

  /**
   * Remove page data from the database
   *
   * @returns {Promise<Page>}
   */
  async destroy() {
    await db.remove({_id: this._id});

    delete this._id;

    return this;
  }

  /**
   * Return readable page data
   *
   * @returns {PageData}
   */
  toJSON() {
    return this.data;
  }
}

module.exports = Page;
