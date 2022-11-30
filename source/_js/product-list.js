const List = require('list.js');
const camelCase = require('lodash.camelcase');

/* eslint-disable comma-dangle */
const ProductFilters = {
  searchQueries: {},
  resultsItems: [],
  sortOrder: 'desc',
  options: {
    productList: undefined,
    allFilters: undefined,
    // pagination: { innerWindow: 1, outerWindow: 2 },
    // page: 50,
    valueNames: [
      'product-title',
      'product-subtitle',
      'product-authors',
      'product-description',
      'product-law-area',
      'product-topic',
      'product-tag',
      'product-center-authors',
      'product-types',
      { name: 'product-publication-date', attr: 'data-timestamp' }
    ],
    fuzzySearch: {
      searchClass: 'fuzzy-search',
      location: 1,
      distance: 5000,
      threshold: 0,
      multiSearch: true
    }
  },
  // SETUP
  createList() {
    this.productList = new List('product-list', this.options);
    this.sortByDate(this.sortOrder);
    this.setSearchQueryDefaults();
  },
  setSearchQueryDefaults() {
    this.searchQueries = {
      searchParams: '',
      sortOrder: 'desc',
      productTitle: '',
      productSubtitle: '',
      productAuthors: '',
      productDescription: '',
      productLawArea: ['all'],
      productTopic: ['all'],
      productTag: ['all'],
      productCenterAuthors: ['all'],
      productTypes: ['all'],
      productPublicationDate: 'all'
    };
  },
  sortByDate(sortOrder) {
    this.productList.sort('product-publication-date', { order: sortOrder });
  },
  // TEXT INPUT
  filterBySearchParams(searchParams) {
    this.productList.fuzzySearch(searchParams);
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
    document.querySelector('.search-submit').addEventListener('click', e => {
      e.preventDefault();
      this.updateActiveSearchQueries();
      // window.location.href = `/database/?q=${this.searchQueries.searchParams}`;
    });
  },
  // SELECT AND CHECKBOX
  filterByDropdownsAndCheckboxes() {
    const { productCenterAuthors, productTypes } = this.searchQueries;
    // debugger
    this.productList.filter(
      item =>
        // debugger
        item
          .values()
          ['product-center-authors'].split(' ')
          .indexOf(productCenterAuthors) !== -1 &&
        item
          .values()
          ['product-types'].split(' ')
          .indexOf(productTypes) !== -1 &&
        // include checkboxes
        this.matchesAllItems(item.values()['area-checkbox'], this.searchQueries.productLawArea) &&
        this.matchesAllItems(item.values()['topic-checkbox'], this.searchQueries.productTopic) &&
        this.matchesAllItems(item.values()['tag-checkbox'], this.searchQueries.productTag)
    );
  },
  handleDropdownParams() {
    const allDropdowns = document.querySelectorAll('.dropdown');
    allDropdowns.forEach(dropdown => {
      dropdown.addEventListener('change', e => {
        this.updateActiveSearchQueries();
        sessionStorage.setItem('productSearchQueries', JSON.stringify(this.searchQueries));
      });
    });
  },
  filterByCheckboxes() {
    const areaCheckboxes = document.querySelectorAll('.checkbox.area-checkbox');
    const topicCheckboxes = document.querySelectorAll('.checkbox.topic-checkbox');
    const tagCheckboxes = document.querySelectorAll('.checkbox.tag-checkbox');

    const checkedAreaCheckboxes = [];
    const checkedTopicCheckboxes = [];
    const checkedTagCheckboxes = [];

    areaCheckboxes.forEach(checkbox => {
      if (checkbox.checked === true) {
        checkedAreaCheckboxes.push(checkbox.value);
      }
    });

    topicCheckboxes.forEach(checkbox => {
      if (checkbox.checked === true) {
        checkedTopicCheckboxes.push(checkbox.value);
      }
    });

    tagCheckboxes.forEach(checkbox => {
      if (checkbox.checked === true) {
        checkedTagCheckboxes.push(checkbox.value);
      }
    });

    this.searchQueries.productLawArea = checkedAreaCheckboxes;
    this.searchQueries.productTopic = checkedTopicCheckboxes;
    this.searchQueries.productTag = checkedTagCheckboxes;
    this.updateActiveSearchQueries();
    this.filterList(this.searchQueries);
    sessionStorage.setItem('productSearchQueries', JSON.stringify(this.searchQueries));
  },
  handleCheckboxClick() {
    document.querySelectorAll('.checkbox-container').forEach(checkbox =>
      checkbox.addEventListener('change', () => {
        this.filterByCheckboxes();
      })
    );
  },
  matchesAllItems: (listItemValues, selectedFilters) => {
    return selectedFilters.every(filter => listItemValues.indexOf(filter) !== -1);
  },
  matchesSomeItems: (listItemValues, selectedFilters) => {
    if (selectedFilters.length === 0) {
      return true;
    }
    return selectedFilters.some(filter => listItemValues.indexOf(filter) !== -1);
  },
  // CLEAR FILTERS
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
    this.setSearchQueryDefaults();
    this.productList.search();
    this.productList.filter();
    this.clearFormInputs();
    this.displayResults();
    this.displayResultQueries();
    sessionStorage.setItem('productSearchQueries', JSON.stringify(this.searchQueries));
  },
  handleClearAllFilters() {
    document.querySelector('.clear-filters').addEventListener('click', () => {
      this.clearAllFilters();
    });
  },
  // MULTI SEARCH HANDLERS
  updateActiveSearchQueries() {
    // get dropdowns
    document.querySelectorAll('.dropdown').forEach(dropdown => {
      this.searchQueries[camelCase(dropdown.id)] = dropdown[dropdown.selectedIndex].value;
    });
    const selectedOptions = document.querySelectorAll('option:checked');
    selectedOptions.forEach(filter => {
      const filterParam = filter.parentElement.id;
      const filterValue = filter.value;
      this.searchQueries[filterParam] = filterValue;
    });
    const textSearch = document.querySelector('#searchfield').value;
    this.searchQueries.searchParams = textSearch;
    this.filterList();
    sessionStorage.setItem('productSearchQueries', JSON.stringify(this.searchQueries));
  },
  matchSearchQueriesToUI() {
    const dropdowns = document.querySelectorAll('.dropdown');
    const areaCheckboxes = document.querySelectorAll('.checkbox.area-checkbox');
    const topicCheckboxes = document.querySelectorAll('.checkbox.topic-checkbox');
    const tagCheckboxes = document.querySelectorAll('.checkbox.tag-checkbox');

    if (window.location.search) {
      // text search
      document.querySelector('#searchfield').value = this.searchQueries.searchParams;
      // checkbox search
      this.searchQueries.citationThemes.forEach(theme => {
        if (theme !== 'all') {
          document.querySelector(`input[type=checkbox][value=${theme}]`).checked = true;
        }
      });
      this.searchQueries.citationTags.forEach(tag => {
        if (tag !== 'all') {
          document.querySelector(`input[type=checkbox][value=${tag}]`).checked = true;
        }
      });
      // dropdown search
      dropdowns.forEach(dropdown => {
        const dropdownOptions = Array.from(dropdown.options).map(option => option.id);
        const urlSearchTerm = this.searchQueries[dropdown.id];
        const selectedIndex = dropdownOptions.indexOf(urlSearchTerm);
        if (selectedIndex !== -1) {
          dropdown.selectedIndex = selectedIndex;
        }
      });
    } else {
      if (document.querySelector('#searchfield').value) {
        this.searchQueries.searchParams = document.querySelector('#searchfield').value;
      }
      areaCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
          this.searchQueries.citationThemes.push(checkbox.value);
        }
      });
      topicCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
          this.searchQueries.citationThemes.push(checkbox.value);
        }
      });
      tagCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
          this.searchQueries.citationTags.push(checkbox.value);
        }
      });
      dropdowns.forEach(dropdown => {
        this.searchQueries[dropdown.id] = dropdown.selectedOptions[0].value;
        const selectedIndex = dropdown.selectedOptions[0].index;
        if (selectedIndex !== -1) {
          dropdown.selectedIndex = selectedIndex;
        }
      });
    }
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
    // // match url query to stringQuery keys - currently only works with one param
    // const searchString = window.location.search
    //   .replace('source', 'citation-sources')
    //   .replace('theme', 'citation-themes')
    //   .replace('tag', 'citation-tags');
    // // get array of search queries and params
    // const searchQueries = searchString.split('?');
    // searchQueries.forEach(query => {
    //   if (query.split('=')[0]) {
    //     this.searchQueries[camelCase(query.split('=')[0])] = query.split('=')[1];
    //   }
    // });
    // this.filterList();
    // this.matchSearchQueriesToUI();
    // this.displayResultQueries();
  },
  filterBySessionStorage() {
    const urlSearchParam = window.location.search.split('=')[0];

    if ((sessionStorage.productSearchQueries && urlSearchParam === '') || urlSearchParam === '?q') {
      const storage = JSON.parse(sessionStorage.productSearchQueries);
      this.searchQueries = storage;

      // check checkbox if value is in sessionStorage
      const areaCheckboxes = document.querySelectorAll('.checkbox.area-checkbox');
      areaCheckboxes.forEach(checkbox => {
        if (this.searchQueries.productLawArea.indexOf(checkbox.id) !== -1) {
          checkbox.checked = true;
        }
      });
      // check checkbox if value is in sessionStorage
      const topicCheckboxes = document.querySelectorAll('.checkbox.topic-checkbox');
      topicCheckboxes.forEach(checkbox => {
        if (this.searchQueries.productTopic.indexOf(checkbox.id) !== -1) {
          checkbox.checked = true;
        }
      });

      // check checkbox if value is in sessionStorage
      const tagCheckboxes = document.querySelectorAll('.checkbox.tag-checkbox');
      tagCheckboxes.forEach(checkbox => {
        if (this.searchQueries.productTag.indexOf(checkbox.id) !== -1) {
          checkbox.checked = true;
        }
      });

      // select dropdown value in sessionStorage
      for (let [key, value] of Object.entries(this.searchQueries)) {
        document.querySelectorAll('.dropdown').forEach(select => {
          if (select.id === key) {
            select.childNodes.forEach(option => {
              if (option.id === value) {
                option.selected = true;
              }
            });
          }
        });

        if (key === 'searchParams') {
          document.querySelector('#searchfield').value = value;
        }
      }

      this.displayResultQueries();
    } else if (urlSearchParam !== '') {
      if (sessionStorage.productSearchQueries) {
        const sortOrder = JSON.parse(sessionStorage.productSearchQueries).sortOrder;
        this.searchQueries.sortOrder = sortOrder;
      }
      this.filterByUrlParams();
    }
  },
  // DISPLAY RESULTS
  displayResults() {
    const count = this.productList.matchingItems.length;
    const label =
      count === 1
        ? 'result'
        : 'results'
    document.querySelector('#results-total').innerHTML = `Displaying ${count} ${label}`;
  },
  displayResultQueries() {
    this.resultsItems = [];
    const { searchParams } = this.searchQueries;

    if (searchParams !== '') {
      this.resultsItems.push(searchParams);
    }
    Array.from(document.querySelectorAll('.checkbox')).forEach(checkbox => {
      if (checkbox.checked) {
        this.resultsItems.push(document.querySelector(`label[for=${checkbox.id}]`).innerText);
      }
    });
    Array.from(document.querySelectorAll('.dropdown')).map(item => {
      if (item.options.selectedIndex !== 0) {
        this.resultsItems.push(document.querySelector(`option#${item.value}`).innerText);
      }
      return this.resultsItems;
    });
    if (this.resultsItems.length > 0) {
      const updateItems = document.querySelectorAll('.product');
      const resultsMessage = document.querySelector('#results-filter-detail');
      resultsMessage.classList.add('js-show');
      if (updateItems.length === 0) {
        resultsMessage.innerHTML = ` for: ${this.resultsItems.join('; ')}`;
      } else {
        resultsMessage.innerHTML = ` for: ${this.resultsItems.join('; ')}`;
      }
    } else {
      document.querySelector('#results-filter-detail').classList.remove('js-show');
    }
  },
  // // MAIN FUNCTIONS
  filterList() {
    const searchParams = document.querySelector('#searchfield').value || this.searchQueries.searchParams;
    // themes should be an array
    if (typeof this.searchQueries.citationThemes === 'string') {
      this.searchQueries.citationThemes = this.searchQueries.citationThemes.split();
    }
    //tags should be an array
    if (typeof this.searchQueries.citationTags === 'string') {
      this.searchQueries.citationTags = this.searchQueries.citationTags.split();
    }
    this.filterBySearchParams(searchParams);
    this.filterByDropdownsAndCheckboxes();
    this.displayResults();
    this.displayResultQueries();
  },
  init() {
    this.createList();
    console.log(this.searchQueries);
    // this.filterBySessionStorage();
    this.handleSearchParams();
    this.handleClearAllFilters();
    // this.handleDateSortClick();
    this.handleDropdownParams();
    // this.handleCheckboxClick();
    // this.handleSearchBehavior();
  }
};

module.exports = ProductFilters;
