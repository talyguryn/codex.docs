const { db, pages: pagesDB } = require('../utils/database/index');

/**
 * @typedef {Object} PageData
 * @property {string} _id - page id
 * @property {string} title - page title
 * @property {*} body - page body
 * @property {number} dtCreate
 * @property {number} dtModify
 */

/**
 * @class Page
 * @class Page model
 *
 * @property {string} _id - page id
 * @property {string} title - page title
 * @property {*} body - page body
 * @property {number} dtCreate
 * @property {number} dtModify
 */
class Page {
  /**
   * Find and return model of page with given id
   *
   * @param {string} _id - page id
   * @param {number} version
   * @returns {Promise<Page>}
   */
  static async get(_id, version) {
    let data = await pagesDB.findOne({_id});

    if (version) {
      const docs = await Page.getPageHistory(_id, version);

      data = docs[0];
    }

    return new Page(data);
  }

  /**
   * Find all pages which match passed query object
   *
   * @param {Object} query
   * @returns {Promise<Page[]>}
   */
  static async getAll(query = {}) {
    const docs = await pagesDB.find(query, null, {dtCreate: 1});

    return Promise.all(docs.map(doc => new Page(doc)));
  }

  /**
   * Get changes history for target page
   *
   * @param {string} id
   * @param {number} version
   * @return {Promise<Array<Object>|Error>}
   */
  static async getPageHistory(id, version) {
    const pageDB = db.getInstance(Page.dbName(id));
    let query = {};

    if (version) {
      query.dtModify = version;
    }

    const docs = await pageDB.find(query, null, {dtModify: -1});

    return Promise.all(docs.map(doc => {
      doc._id = id;

      return new Page(doc);
    }));
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

  static dbName(id) {
    return `page:${id}`;
  }

  /**
   * Set PageData object fields to internal model fields
   *
   * @param {PageData} pageData
   */
  set data(pageData) {
    const {body, dtCreate, dtModify} = pageData;

    this.body = body || this.body;
    this.title = this.extractTitleFromBody();
    this.dtCreate = dtCreate || this.dtCreate;
    this.dtModify = dtModify || this.dtModify;
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
      dtCreate: this.dtCreate,
      dtModify: this.dtModify
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
   * Save or update page data in the database
   *
   * @returns {Promise<Page>}
   */
  async save() {
    if (!this._id) {
      const insertedRow = await pagesDB.insert(this.data);

      this._id = insertedRow._id;
    } else {
      await pagesDB.update({_id: this._id}, this.data);
    }

    const pageDB = db.getInstance(Page.dbName(this._id));

    await pageDB.insert({
      title: this.data.title,
      body: this.data.body,
      dtCreate: this.data.dtCreate,
      dtModify: this.data.dtModify
    });

    return this;
  }

  // /**
  //  * Remove page data from the database
  //  *
  //  * @returns {Promise<Page>}
  //  */
  // async destroy() {
  //   await pagesDB.remove({_id: this._id});
  //
  //   delete this._id;
  //
  //   return this;
  // }
}

module.exports = Page;
