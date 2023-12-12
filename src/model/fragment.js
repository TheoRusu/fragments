// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

var md = require('markdown-it')();
const sharp = require('sharp');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');
const logger = require('../logger');

const validFileTypes = {
  txt: 'text/plain',
  txtCharset: 'text/plain; charset=utf-8',
  md: 'text/markdown',
  html: 'text/html',
  json: 'application/json',
  png: 'image/png',
  jpg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
};

class Fragment {
  constructor({
    id = randomUUID(),
    ownerId,
    created = new Date().toISOString(),
    updated = new Date().toISOString(),
    type,
    size = 0,
  }) {
    if (!ownerId || !type) {
      throw new Error('missing ownerId/type');
    }
    if (typeof size !== 'number' || size < 0) {
      logger.warn(`Size must be a non-negative number: ${size}`);
      throw new Error('size must be a non-negative number');
    }
    if (!Fragment.isSupportedType(type)) {
      logger.warn(
        `Entered Type: ${type}supported types are text/plain and text/plain; charset=utf-8`
      );
      throw new Error('supported types are text/plain and text/plain; charset=utf-8');
    }

    this.id = id;
    this.ownerId = ownerId;
    this.created = created;
    this.updated = updated;
    this.type = type;

    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    return await listFragments(ownerId, expand);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    const fragment = await readFragment(ownerId, id);

    if (!fragment) {
      throw new Error('fragment does not exist');
    }
    return fragment;
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static delete(ownerId, id) {
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  save() {
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    if (!data) {
      throw new Error('setData: missing data');
    }
    this.updated = new Date().toISOString();
    this.size = data.byteLength;
    return writeFragmentData(this.ownerId, this.id, data);
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    return /^text\//.test(this.mimeType);
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    let mimeTypes = [];
    switch (this.type) {
      case validFileTypes.txt:
      case validFileTypes.txtCharset:
        mimeTypes = [validFileTypes.txt];
        break;
      case validFileTypes.md:
        mimeTypes = [validFileTypes.md, validFileTypes.txt, validFileTypes.html];
        break;
      case validFileTypes.html:
        mimeTypes = [validFileTypes.html, validFileTypes.txt];
        break;
      case validFileTypes.json:
        mimeTypes = [validFileTypes.json, validFileTypes.txt];
        break;
      case validFileTypes.png:
        mimeTypes = [
          validFileTypes.png,
          validFileTypes.jpg,
          validFileTypes.webp,
          validFileTypes.gif,
        ];
        break;
      case validFileTypes.jpg:
        mimeTypes = [
          validFileTypes.png,
          validFileTypes.jpg,
          validFileTypes.webp,
          validFileTypes.gif,
        ];
        break;
      case validFileTypes.gif:
        mimeTypes = [
          validFileTypes.png,
          validFileTypes.jpg,
          validFileTypes.webp,
          validFileTypes.gif,
        ];
        break;
      case validFileTypes.webp:
        mimeTypes = [
          validFileTypes.png,
          validFileTypes.jpg,
          validFileTypes.webp,
          validFileTypes.gif,
        ];
        break;
      default:
        mimeTypes = [];
    }
    return mimeTypes;
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    return Object.values(validFileTypes).includes(value);
  }

  static isValidExtType(ext) {
    return validFileTypes[ext];
  }

  async convertFragment(fragmentData, conversionType) {
    switch (conversionType) {
      case 'text/plain':
        return fragmentData.toString();
      case 'text/html':
        if (this.type === 'text/markdown') return md.render(fragmentData.toString());
        return fragmentData;
      case 'image/png':
        return await sharp(fragmentData).png();
      case 'image/jpeg':
        return await sharp(fragmentData).jpeg();
      case 'image/gif':
        return await sharp(fragmentData).gif();
      case 'image/webp':
        return await sharp(fragmentData).webp();
      default:
        return fragmentData;
    }
  }
}

module.exports.Fragment = Fragment;
