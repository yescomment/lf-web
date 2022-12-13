const List = require('list.js');
const camelCase = require('lodash.camelcase');

/* eslint-disable comma-dangle */
const ProductSearch = {
  searchQueries: {},
  resultsItems: [],
  sortOrder: 'desc',
  sessionsName: 'productSearchQueries',
  targetListId: 'product-list',
  dateSortElId: 'date-sort',
  options: {
    targetList: undefined, // targetList holds Listjs instance
    allFilters: undefined,
    valueNames: [
      'product-title',
      'product-subtitle',
      'product-authors',
      'product-types',
      'product-description',
      'product-law-area',
      'product-topic',
      'product-tag',
      'product-center-authors',
      { name: 'product-publication-date', attr: 'data-timestamp' }
    ],
    fuzzySearch: {
      searchClass: 'fuzzy-search',
      location: 1,
      distance: 5000,
      threshold: 0.1,
      multiSearch: true
    }
  },
  createList() {
    this.targetList = new List(this.targetListId, this.options);

    this.targetList.sort('timestamp', { order: 'desc' });

    /* TODO:
    if (sessionStorage[this.sessionsName]) {
      this.matchSearchQueriesToSessions();
    } else {
      this.setSearchQueryDefaults();
    }
    this.matchSearchQueriesToUI();
    */
  },
  setSearchQueryDefaults() {
    // used to reset sessions and search queries when clearing filters
    // list js will handle filtering text fields
    this.searchQueries = {
      productLawArea: ['all'], // checkbox
      productTopic: ['all'], // checkbox
      productTag: ['all'], // checkbox
      productCenterAuthors: 'all', // dropdown
      productType: 'all', // dropdown
      searchParams: '',
      sortOrder: 'desc'
    };
    /* TODO
    this.matchSearchQueriesToUI();
    */
  },
  sortByDate() {
    this.targetList.sort({ order: this.sortOrder });
  },
  handleDateSortClick() {
    console.log(document.getElementById(this.dateSortElId));
    document.getElementById(this.dateSortElId).addEventListener('click', this.sortByDate());
  },
  init() {
    this.createList();
    this.handleDateSortClick();
    console.log(this.targetList);
  }
};

module.exports = ProductSearch;
