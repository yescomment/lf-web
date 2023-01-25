const List = require('list.js');
const camelCase = require('lodash.camelcase');

/* eslint-disable comma-dangle */
const ProductFilter = {
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
    if (sessionStorage[this.sessionsName]) {
      this.matchSearchQueriesToSessions();
    } else {
      this.setSearchQueryDefaults();
    }
    this.matchSearchQueriesToUI();
    /* TODO:
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
    this.matchSearchQueriesToUI();
  },
  matchSearchQueriesToSessions() {
    this.searchQueries = {
      productLawArea: JSON.parse(sessionStorage[this.sessionsName]).productLawArea || ['all'], // checkbox
      productTopic: JSON.parse(sessionStorage[this.sessionsName]).productTopic || ['all'], // checkbox
      productTag: JSON.parse(sessionStorage[this.sessionsName]).productTag || ['all'], // checkbox
      productCenterAuthor: JSON.parse(sessionStorage[this.sessionsName]).productCenterAuthor || 'all', // dropdown
      productType: JSON.parse(sessionStorage[this.sessionsName]).productType || 'all', // dropdown
      searchParams: JSON.parse(sessionStorage[this.sessionsName]).searchParams || '',
      sortOrder: 'desc' // keep desc on refresh
    };
  },
  matchSearchQueriesToUI() {
    /* need this for url params */
    // text search
    document.querySelector('#searchfield').value = this.searchQueries.searchParams;
    // dropdowns
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
      this.searchQueries[camelCase(dropdown.id)] = dropdown.selectedOptions[0].value;
      const selectedIndex = dropdown.selectedOptions[0].index;

      if (selectedIndex !== -1) {
        dropdown.selectedIndex = selectedIndex;
      }
    });
    // match checkbox UI to searchQueries
    // Checkbox filter tag ids: 'product-law-area', 'product-topic', 'product-tag'

    this.searchQueries.productLawArea.forEach(action => {
      if (action !== 'all') {
        document.querySelector(`input[type=checkbox][value=${action}]`).checked = true;
      }
    });

    this.searchQueries.productTopic.forEach(action => {
      if (action !== 'all') {
        document.querySelector(`input[type=checkbox][value=${action}]`).checked = true;
      }
    });

    this.searchQueries.productTag.forEach(action => {
      if (action !== 'all') {
        document.querySelector(`input[type=checkbox][value=${action}]`).checked = true;
      }
    });
  },
  sortByDate(sortOrder = 'desc') {
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
    this.displayResultsCount();
    this.setSessions();
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
    this.setSessions();
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
    this.filterList(this.searchQueries);
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
  handleCheckboxChange() {
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
    this.displayResultsCount();
    this.displayResultQueries();
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
  clearAllFilters() {
    this.clearResultsItems();
    this.setSearchQueryDefaults();
    this.targetList.search();
    this.targetList.filter();
    this.clearFormInputs();
    this.sortByDate('desc');
    this.displayResultsCount();
    this.displayResultQueries();
    this.clearSessions();
  },
  clearSessions() {
    sessionStorage.removeItem(this.sessionsName);
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
  displayResultsCount() {
    const count = this.targetList.matchingItems.length;
    const label = count === 1 ? 'result' : 'results';
    // main results message
    document.getElementById('results-total').innerHTML = `Displaying ${count} ${label} `;
    // mobile results message
    if (count === 0) {
      document.getElementById('mobile-results-total').innerHTML = ` ${count} ${label}`;
    } else {
      document.getElementById('mobile-results-total').innerHTML = `See ${count} ${label}`;
    }
  },
  displayResultQueries() {
    // populates this.resultsItems

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
  handleSearchBehavior() {
    const hasUrlParam = window.location.search;
    if (hasUrlParam) {
      this.filterByUrlParams();
      this.matchSearchQueriesToUI();
    } else {
      this.matchSearchQueriesToUI();
      this.filterList();
    }
  },
  filterByUrlParams() {
    // match url query to stringQuery keys - currently only works with one param
    const searchString = window.location.search
      // .replace('action', 'resource-advocacy-actions')
      // .replace('phase', 'resource-lifecycle-phase')
      .replace('q', 'searchParams');
    // get array of search queries and params
    const searchQueries = searchString.split('?');
    searchQueries.forEach(query => {
      if (query.split('=')[0]) {
        this.searchQueries[camelCase(query.split('=')[0])] = query.split('=')[1];
      }
    });
    this.filterList();
    this.matchSearchQueriesToUI();
  },
  filterBySessionStorage() {
    // matches dropdowns to sessions
    if (sessionStorage[this.sessionsName]) {
      const storage = JSON.parse(sessionStorage[this.sessionsName]);
      this.searchQueries = storage;

      // select dropdown value in sessionStorage
      for (let [key, value] of Object.entries(this.searchQueries)) {
        document.querySelectorAll('.dropdown').forEach(select => {
          if (camelCase(select.id) === key) {
            select.childNodes.forEach(option => {
              if (option.id === value) {
                option.selected = true;
              }
            });
          }
        });
      }
      this.displayResultQueries();
    }
  },
  handleMobileFilter() {
    const filterButtons = document.querySelectorAll('.outputs-filter.js-toggle-filters');
    
    const filterDecorator = document.querySelector('.filter-decorator');
    const filterContainer = document.querySelector('.list-aside');
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        if (filterContainer.classList.contains('js-active')) {
          filterContainer.classList.remove('js-active');
          filterDecorator.classList.remove('js-active');
        } else {
          filterContainer.classList.add('js-active');
          filterDecorator.classList.add('js-active');
        }
      });
    });
  },
  init() {
    this.createList();
    this.filterBySessionStorage();
    this.sortByDate();
    this.handleDateSortClick();
    this.handleSearchParams();
    this.handleDropdownChange();
    this.handleCheckboxChange();
    this.handleClearAllFilters();
    this.handleSearchBehavior();
    this.handleMobileFilter();
  }
};

module.exports = ProductFilter;
