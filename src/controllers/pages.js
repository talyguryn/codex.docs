const Model = require('../models/page');

/**
 * @class Pages
 * @classdesc Pages controller
 */
class Pages {
  /**
   * @static
   * Fields required for page model creation
   *
   * @returns {['title', 'body']}
   */
  static get REQUIRED_FIELDS() {
    return [ 'body' ];
  }

  /**
   * @static
   * Find and return page model with passed id
   *
   * @param {string} id - page id
   * @param {number} version
   * @returns {Promise<Page>}
   */
  static async get(id, version) {
    const page = await Model.get(id, version);

    if (!page._id) {
      throw new Error('Page with given id does not exist');
    }

    return page;
  }

  /**
   * Return all pages
   *
   * @returns {Promise<Page[]>}
   */
  static async getAll() {
    return Model.getAll();
  }

  /**
   * Get changes history for target page
   *
   * @param {string} id
   * @return {Promise<Array<Object>|Error>}
   */
  static async getPageHistory(id) {
    return Model.getPageHistory(id);
  }

  /**
   * Create new page model and save it in the database
   *
   * @param {PageData} data
   * @returns {Promise<Page>}
   */
  static async insert(data) {
    try {
      Pages.validate(data);

      data.dtCreate = Date.now();
      data.dtModify = data.dtCreate;

      const page = new Model(data);

      return page.save();
    } catch (validationError) {
      throw new Error(validationError);
    }
  }

  /**
   * Check PageData object for required fields
   *
   * @param {PageData} data
   * @throws {Error} - validation error
   */
  static validate(data) {
    const allRequiredFields = Pages.REQUIRED_FIELDS.every(field => typeof data[field] !== 'undefined');

    if (!allRequiredFields) {
      throw new Error('Some of required fields is missed');
    }

    const hasBlocks = data.body && data.body.blocks && Array.isArray(data.body.blocks) && data.body.blocks.length > 0;

    if (!hasBlocks) {
      throw new Error('Page body is invalid');
    }

    const hasHeaderAsFirstBlock = data.body.blocks[0].type === 'header';

    if (!hasHeaderAsFirstBlock) {
      throw new Error('First page Block must be a Header');
    }

    const headerIsNotEmpty = data.body.blocks[0].data.text.replace('<br>', '').trim() !== '';

    if (!headerIsNotEmpty) {
      throw new Error('Please, fill page Header');
    }
  }

  /**
   * Update page with given id in the database
   *
   * @param {string} id - page id
   * @param {PageData} data
   * @returns {Promise<Page>}
   */
  static async update(id, data) {
    const page = await Model.get(id);

    if (!page._id) {
      throw new Error('Page with given id does not exist');
    }

    data.dtModify = Date.now();

    page.data = data;

    return page.save();
  }

  /**
   * Remove page with given id from the database
   *
   * @param {string} id - page id
   * @returns {Promise<Page>}
   */
  static async remove(id) {
    const page = await Model.get(id);

    if (!page._id) {
      throw new Error('Page with given id does not exist');
    }

    return page.destroy();
  }
}

module.exports = Pages;
