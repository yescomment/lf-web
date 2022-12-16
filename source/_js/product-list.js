const List = require('list.js');
const camelCase = require('lodash.camelcase');

/* eslint-disable comma-dangle */
const ProductSearch = {
  searchQueries: {},
  resultsItems: [],
  sortOrder: 'desc',
  sessionsName: 'productSearchQueries',
  targetListId: 'product-list',
  dateEl: 'product-publication-date',
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

    this.targetList.sort(this.dateEl, { order: 'desc' });

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
  sortByDate(sortOrder) {
    const dateToggles = document.querySelectorAll('.js-sort');
    this.searchQueries.sortOrder = sortOrder;
    this.targetList.sort(this.dateEl, { order: sortOrder });

    // change UI -- can this move to match search queries to UI?

    if (sortOrder === 'desc') {
      dateToggles.forEach(dateToggle => {
        dateToggle.classList.add('button__sort--descending');
        dateToggle.classList.remove('button__sort--ascending');
      });
    } else {
      dateToggles.forEach(dateToggle => {
        dateToggle.classList.add('button__sort--ascending');
        dateToggle.classList.remove('button__sort--descending');
      });
    }
    /* TO DO
    sessionStorage.setItem('productSearchQueries', JSON.stringify(this.searchQueries));
    */
  },
  handleDateSortClick() {
    const dateToggles = document.querySelectorAll('.js-sort');
    dateToggles.forEach(dateToggle => {
      dateToggle.addEventListener('click', () => {
        if (this.searchQueries.sortOrder === 'desc') {
          this.sortByDate('asc');
        } else {
          this.sortByDate('desc');
        }
      });
    });
  },
  init() {
    this.createList();
    this.sortByDate(this.sortOrder);
    this.handleDateSortClick();
  }
};

module.exports = ProductSearch;
