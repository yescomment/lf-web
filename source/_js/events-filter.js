const List = require('list.js');
const camelCase = require('lodash.camelcase');

/* eslint-disable comma-dangle */
const EventsFilter = {
  searchQueries: {},
  resultsItems: [],
  sortOrder: 'desc',
  sessionsName: 'eventYearSearchQueries',
  options: {
    eventList: undefined,
    allFilters: undefined,
    sortOrder: 'desc',
    valueNames: [{ name: 'event-start-date', attr: 'data-timestamp' }, 'event-year']
  },
  // SETUP
  createList() {
    this.eventList = new List('event-list', this.options);
    this.sortByDate(this.sortOrder);
    this.setSearchQueryDefaults();
  },
  setSearchQueryDefaults() {
    this.searchQueries = {
      eventYear: 'all'
    };
  },
  sortByDate(sortOrder) {
    this.eventList.sort('event-start-date', { order: sortOrder });
  },
  // // SELECT AND CHECKBOX
  filterByDropdowns() {
    const { eventYear } = this.searchQueries;
    this.eventList.filter(item => item.values()['event-year'].indexOf(eventYear) !== -1);
  },
  handleDropdownParams() {
    const allDropdowns = document.querySelectorAll('.dropdown');
    allDropdowns.forEach(dropdown => {
      dropdown.addEventListener('change', e => {
        this.updateActiveSearchQueries();
        sessionStorage.setItem(this.sessionsName, JSON.stringify(this.searchQueries));
      });
    });
  },
  updateActiveSearchQueries() {
    // get dropdowns
    document.querySelectorAll('.dropdown').forEach(dropdown => {
      this.searchQueries[camelCase(dropdown.id)] = dropdown[dropdown.selectedIndex].value;
    });
    this.filterList();
  },
  // // MAIN FUNCTIONS
  filterList() {
    this.filterByDropdowns();
  },
  setVisibilityByDate() {
    // get all events
    const upcomingEvents = document.querySelectorAll('.event--upcoming');
    const pastEvents = document.querySelectorAll('.event--past');
    const currentDate = new Date(Date.now());

    upcomingEvents.forEach(event => {
      const eventDate = new Date(event.getAttribute('data-event-start'));
      if (eventDate.getTime() < currentDate.getTime()) {
        event.classList.add('not-visible');
      } else {
        event.classList.remove('not-visible');
      }
    });
    pastEvents.forEach(event => {
      const eventDate = new Date(event.getAttribute('data-event-start'));
      if (eventDate.getTime() > currentDate.getTime()) {
        event.classList.add('not-visible');
      } else {
        event.classList.remove('not-visible');
      }
    });
  },
  clearFormInputs() {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
      dropdown.selectedIndex = 0;
    });
  },
  init() {
    this.setVisibilityByDate();
    this.createList();
    this.handleDropdownParams();
    this.clearFormInputs();
  }
};

module.exports = EventsFilter;
