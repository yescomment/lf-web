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
  // TEXT INPUT
  filterBySearchParams(searchParams) {
    this.targetList.fuzzySearch(searchParams);
  },
  handleSearchParams() {
    document.querySelector('#searchfield').addEventListener('keyup', e => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        this.updateActiveSearchQueries();
      }
    });
    document.querySelector('.search-submit').addEventListener('click', e => {
      e.preventDefault();
      this.updateActiveSearchQueries();
      // window.location.href = `/database/?q=${this.searchQueries.searchParams}`;
    });
  },
  updateActiveSearchQueries() {
    console.log(this.searchQueries);
    // get dropdowns

    /* TK
    document.querySelectorAll('.dropdown').forEach(dropdown => {
      this.searchQueries[camelCase(dropdown.id)] = dropdown[dropdown.selectedIndex].value;
    });
    const selectedOptions = document.querySelectorAll('option:checked');
    selectedOptions.forEach(filter => {
      const filterParam = filter.parentElement.id;
      const filterValue = filter.value;
      this.searchQueries[filterParam] = filterValue;
    });
    */
    const textSearch = document.querySelector('#searchfield').value;
    this.searchQueries.searchParams = textSearch;
    this.filterList();
    /* TODO
    sessionStorage.setItem('citationSearchQueries', JSON.stringify(this.searchQueries));
    */
  },
  filterList() {
    const searchParams = document.querySelector('#searchfield').value || this.searchQueries.searchParams;
    /* TODO
    // themes should be an array
    if (typeof this.searchQueries.citationThemes === 'string') {
      this.searchQueries.citationThemes = this.searchQueries.citationThemes.split();
    }
    //tags should be an array
    if (typeof this.searchQueries.citationTags === 'string') {
      this.searchQueries.citationTags = this.searchQueries.citationTags.split();
    }
    */

    this.filterBySearchParams(searchParams);
    /* TODO
    this.filterByDropdownsAndCheckboxes();
    this.displayResults();
    this.displayResultQueries();
    */
  },
  init() {
    this.createList();
    this.setSearchQueryDefaults();
    this.sortByDate(this.sortOrder);
    this.handleDateSortClick();
    this.handleSearchParams();
  }
};

module.exports = ProductSearch;
