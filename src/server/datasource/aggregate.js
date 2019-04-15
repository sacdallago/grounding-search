const db = require('../db');
const { rankInThread } = require('./rank');
const { MAX_SEARCH_WS } = require('../config');

/**
 * Retrieve the entities matching best with the search string.
 * @param {string} searchString Key string for searching the best matching entities.
 * @param {object} [organismCounts] An object map of organism taxon IDs to the
 * relative weight of the organisms.  Example: `{ '9606': 3, '10090': 1 }`
 * This sets a preference of organism ordering when there is a distance tie (e.g.
 * P53 for human or P53 for mouse).  The counts ould be, for example, the number
 * of times an organism is mentioned in a document or the number of prior groundings
 * associated with that organism in a document.  If not specified, a default ordering
 * is used based on the popularity of common model organisms.
 * @returns {Promise} Promise object represents the array of best matching entries.
 */
const search = function(searchString, organismCounts){
  const doSearch = () => db.search(searchString);
  const doRank = ents => rankInThread(ents, searchString, organismCounts);
  const shortenList = ents => ents.slice(0, MAX_SEARCH_WS);

  // TODO other specific datasources should also rank or maybe move this function
  // logic to db.js

  return (
    Promise.resolve()
      .then(doSearch)
      .then(doRank)
      .then(shortenList)
  );
};

/**
 * Retrieve the entity that has the given id.
 * @param {string} namespace  Namespace to seek the entity e.g. 'uniprot', 'chebi', ...
 * @param {string} id The id of entity to search
 * @returns {Promise} Promise objects represents the entity with the given id from the given namespace,
 * if there is no such entity it represents null.
 */
const get = function(namespace, id){
  return db.get(id, namespace);
};

module.exports = { search, get };
