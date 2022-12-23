const List = require('list.js');
const camelCase = require('lodash.camelcase');

/* eslint-disable comma-dangle */
const ProductSearch = {
  searchQueries: {},
  sortOrder: 'desc',
  clearFiltersID: 'clear-filters',
  sessionsName: 'productSearchQueries',
  targetListId: 'product-list',
  listElement: 'product',
  dateEl: 'product-publication-date',
  resultsItems: [],
  options: {
    targetList: undefined, // targetList holds Listjs instance
    allFilters: undefined,
    valueNames: [
      'product-title',
      'product-subtitle',
      'product-authors',
      'product-type',
      'product-description',
      'product-law-area',
      'product-topic',
      'product-tag',
      'product-center-author',
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
      */
    // this.setSearchQueryDefaults();
    /*
    }
    this.matchSearchQueriesToUI();
    */
  },
  setSearchQueryDefaults() {
    this.clearResultsItems();
    // used to reset sessions and search queries when clearing filters
    // list js will handle filtering text fields
    this.searchQueries = {
      productLawArea: ['all'], // checkbox
      productTopic: ['all'], // checkbox
      productTag: ['all'], // checkbox
      productCenterAuthor: 'all', // dropdown
      productType: 'all', // dropdown
      searchParams: '',
      sortOrder: 'desc'
    };
    /* TODO
    this.matchSearchQueriesToUI();
    */
  },
  sortByDate(sortOrder) {
    /* check mobile sort*/
    const dateToggles = document.querySelectorAll('.js-sort');
    this.searchQueries.sortOrder = sortOrder;
    this.targetList.sort(this.dateEl, { order: sortOrder });

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

    this.setSessions();
    /* TO DO
    sessionStorage.setItem(this.sessionsName, JSON.stringify(this.searchQueries));
    */
  },
  handleDateSortClick() {
    // done
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
    // done
    this.targetList.fuzzySearch(searchParams);
  },
  handleSearchParams() {
    // done
    document.querySelector('#searchfield').addEventListener('keyup', e => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        this.updateActiveSearchQueries();
      }
    });
    document.querySelector('.search-submit').addEventListener('click', e => {
      e.preventDefault();
      this.updateActiveSearchQueries();
    });
  },
  // select and checkbox
  filterByDropdownsAndCheckboxes() {
    /**
     * Dropdown filter tag ids: 'product-center-author', 'product-type'
     * Checkbox filter tag ids: 'product-law-area', 'product-topic', 'product-tag'
     */

    // camelcase dropdown filter ids (not dropdown el)
    const { productCenterAuthor, productType } = this.searchQueries;

    this.targetList.filter(
      item =>
        // dropdown filter ids using kebabcase
        item
          .values()
          ['product-center-author'].split(' ')
          .indexOf(productCenterAuthor) !== -1 &&
        item
          .values()
          ['product-type'].split(' ')
          .indexOf(productType) !== -1 &&
        // include checkboxes
        this.matchesAllItems(item.values()['product-law-area'], this.searchQueries.productLawArea) &&
        this.matchesAllItems(item.values()['product-topic'], this.searchQueries.productTopic) &&
        this.matchesAllItems(item.values()['product-tag'], this.searchQueries.productTag)
    );
  },
  filterByCheckboxes() {
    /**
     * Dropdown filter tag ids: 'product-center-author', 'product-type'
     * Checkbox filter tag ids: 'product-law-area', 'product-topic', 'product-tag'
     */
    const productLawAreaCheckboxes = document.querySelectorAll('.checkbox.area-checkbox');
    const productTopicCheckboxes = document.querySelectorAll('.checkbox.topic-checkbox');
    const productTagCheckboxes = document.querySelectorAll('.checkbox.tag-checkbox');

    /**
     * Get all checkbox elements
     * Create empty containers for checked items
     * Loop through each checkbox to see if it is checked
     * Store query
     */

    const checkedProductLawAreas = [];
    productLawAreaCheckboxes.forEach(checkbox => {
      if (checkbox.checked === true) {
        checkedProductLawAreas.push(checkbox.value);
      }
    });

    const checkedProductTopics = [];
    productTopicCheckboxes.forEach(checkbox => {
      if (checkbox.checked === true) {
        checkedProductTopics.push(checkbox.value);
      }
    });

    const checkedProductTags = [];
    productTagCheckboxes.forEach(checkbox => {
      if (checkbox.checked === true) {
        checkedProductTags.push(checkbox.value);
      }
    });

    this.searchQueries.productLawArea = checkedProductLawAreas;
    this.searchQueries.productTopic = checkedProductTopics;
    this.searchQueries.productTag = checkedProductTags;

    this.updateActiveSearchQueries();
    /* do we need?
    // this.filterList(this.searchQueries);
    */
    this.setSessions();
  },
  handleDropdownChange() {
    const allDropdowns = document.querySelectorAll('.dropdown');
    allDropdowns.forEach(dropdown => {
      dropdown.addEventListener('change', e => {
        this.updateActiveSearchQueries();
        this.setSessions();
      });
    });
  },
  handleCheckboxClick() {
    document.querySelectorAll('.checkbox-container').forEach(checkbox =>
      checkbox.addEventListener('change', () => {
        this.filterByCheckboxes();
      })
    );
  },
  setSessions() {
    sessionStorage.setItem(this.sessionsName, JSON.stringify(this.searchQueries));
  },
  getActiveDropdowns() {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
      this.searchQueries[camelCase(dropdown.id)] = dropdown[dropdown.selectedIndex].value;
    });
  },
  getActiveTextSearch() {
    const textSearch = document.querySelector('#searchfield').value;
    this.searchQueries.searchParams = textSearch;
  },
  getActiveCheckboxes() {
    const selectedOptions = document.querySelectorAll('option:checked');
    selectedOptions.forEach(filter => {
      const filterParam = filter.parentElement.id;
      const filterValue = filter.value;
      this.searchQueries[filterParam] = filterValue;
    });
  },
  updateActiveSearchQueries() {
    // get dropdowns
    this.getActiveDropdowns();
    this.getActiveCheckboxes();
    this.getActiveTextSearch();
    this.filterList();
    this.setSessions();
    /* TODO
    sessionStorage.setItem(this.sessionsName, JSON.stringify(this.searchQueries));
    */
  },
  filterList() {
    this.clearResultsItems();
    /**
     * Dropdown filter tag ids: 'product-center-author', 'product-type'
     * Checkbox filter tag ids: 'product-law-area', 'product-topic', 'product-tag'
     */
    const searchParams = document.querySelector('#searchfield').value || this.searchQueries.searchParams;

    // checkboxes should be an array
    if (typeof this.searchQueries.productLawArea === 'string') {
      this.searchQueries.productLawArea = this.searchQueries.productLawArea.split();
    }

    if (typeof this.searchQueries.productTopic === 'string') {
      this.searchQueries.productTopic = this.searchQueries.productTopic.split();
    }

    if (typeof this.searchQueries.productTag === 'string') {
      this.searchQueries.productTag = this.searchQueries.productTag.split();
    }

    this.filterBySearchParams(searchParams);
    this.filterByDropdownsAndCheckboxes();
    this.displayResults();
    this.displayResultQueries();
  },
  clearAllFilters() {
    this.setSearchQueryDefaults();
    this.targetList.search();
    this.targetList.filter();
    this.clearFormInputs();
    this.displayResults();
    this.displayResultQueries();
    this.setSessions();
    /* TODO
    sessionStorage.setItem(this.sessionsName, JSON.stringify(this.searchQueries));
*/
  },
  handleClearAllFilters() {
    // done
    document.getElementById(`clear-filters`).addEventListener('click', () => {
      this.clearAllFilters();
    });
  },
  // DISPLAY RESULTS
  getTextResultsQuery() {
    const { searchParams } = this.searchQueries;
    if (searchParams !== '') {
      this.resultsItems.push(searchParams);
    }
  },
  getDropdownResultsQuery() {
    Array.from(document.querySelectorAll('.dropdown')).map(item => {
      if (item.options.selectedIndex !== 0) {
        this.resultsItems.push(document.querySelector(`option#${item.value}`).innerText);
      }
      return this.resultsItems;
    });
  },
  getCheckboxResultsQuery() {
    Array.from(document.querySelectorAll('.checkbox')).forEach(checkbox => {
      if (checkbox.checked) {
        this.resultsItems.push(document.querySelector(`label[for=${checkbox.id}]`).innerText);
      }
    });
  },
  displayResults() {
    const count = this.targetList.matchingItems.length;
    const label = count === 1 ? 'result' : 'results';
    document.getElementById('results-total').innerHTML = `Displaying ${count} ${label} `;
  },
  displayResultQueries() {
    this.getTextResultsQuery();
    this.getCheckboxResultsQuery();
    this.getDropdownResultsQuery();

    if (this.resultsItems.length > 0) {
      const updateItems = document.querySelectorAll(`.${this.listElement}`);
      const resultsMessage = document.querySelector('#results-filter-detail');
      resultsMessage.classList.add('js-show');
      if (updateItems.length === 0) {
        resultsMessage.innerHTML = `${this.resultsItems.join('; ')}`;
      } else {
        resultsMessage.innerHTML = `for ${this.resultsItems.join('; ')}`;
      }
    } else {
      document.querySelector('#results-filter-detail').classList.remove('js-show');
    }
  },
  clearResultsItems() {
    this.resultsItems = [];
  },
  clearFormInputs() {
    document.querySelector('.search-field').value = '';
    document.querySelectorAll('.dropdown').forEach(dropdown => {
      dropdown.selectedIndex = 0;
    });
    document.querySelectorAll('.checkbox:checked').forEach(checkbox => {
      checkbox.checked = false;
    });
  },
  // helpers
  matchesAllItems: (listItemValues, selectedFilters) => {
    return selectedFilters.every(filter => listItemValues.indexOf(filter) !== -1);
  },
  matchesSomeItems: (listItemValues, selectedFilters) => {
    if (selectedFilters.length === 0) {
      return true;
    }
    return selectedFilters.some(filter => listItemValues.indexOf(filter) !== -1);
  },
  filterBySessionStorage() {
    const urlSearchParam = window.location.search.split('=')[0];

    if ((sessionStorage[this.sessionsName] && urlSearchParam === '') || urlSearchParam === '?q') {
      console.log('by sessions');

      const storage = JSON.parse(sessionStorage[this.sessionsName]);
      this.searchQueries = storage;

      //  get checkbox values in sessions
      const productLawAreaCheckboxes = document.querySelectorAll('.checkbox.area-checkbox');
      const productTopicCheckboxes = document.querySelectorAll('.checkbox.topic-checkbox');
      const productTagCheckboxes = document.querySelectorAll('.checkbox.tag-checkbox');

      // debugger;
      productLawAreaCheckboxes.forEach(checkbox => {
        if (this.searchQueries.productLawArea.indexOf(checkbox.id) !== -1) {
          checkbox.checked = true;
        }
      });
      productTopicCheckboxes.forEach(checkbox => {
        if (this.searchQueries.productTopic.indexOf(checkbox.id) !== -1) {
          checkbox.checked = true;
        }
      });
      productTagCheckboxes.forEach(checkbox => {
        if (this.searchQueries.productTag.indexOf(checkbox.id) !== -1) {
          checkbox.checked = true;
        }
      });
      /*
       */
      this.displayResultQueries();
    } else {
      debugger;
      console.log('by url params');
    }
  },
  init() {
    this.createList();
    this.setSearchQueryDefaults();
    this.sortByDate(this.sortOrder);
    this.filterBySessionStorage();
    this.handleDateSortClick();
    this.handleSearchParams();
    this.handleDropdownChange();
    this.handleCheckboxClick();
    this.handleClearAllFilters();
  }
};

module.exports = ProductSearch;
