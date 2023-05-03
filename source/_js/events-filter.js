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
    if (sessionStorage[this.sessionsName]) {
      this.matchSearchQueriesToSessions();
    } else {
      this.setSearchQueryDefaults();
    }
  },
  setSearchQueryDefaults() {
    this.searchQueries = {
      eventYear: 'all',
      sortOrder: 'desc'
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
  matchSearchQueriesToSessions() {
    this.searchQueries = {
      eventYear: JSON.parse(sessionStorage[this.sessionsName]).eventYear || 'all', // dropdown
      sortOrder: 'desc' // keep desc on refresh
    };
  },
  setSessions() {
    sessionStorage.setItem(this.sessionsName, JSON.stringify(this.searchQueries));
  },
  updateActiveSearchQueries() {
    // get dropdowns
    document.querySelectorAll('.dropdown').forEach(dropdown => {
      this.searchQueries[camelCase(dropdown.id)] = dropdown[dropdown.selectedIndex].value;
    });
    this.filterList();
    this.setSessions();
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
      if (eventDate.getTime() + 1 * 24 * 60 * 60 * 1000 < currentDate.getTime()) {
        event.classList.add('not-visible');
      } else {
        event.classList.remove('not-visible');
      }
    });
    this.handleNoUpcomingEvents();
    pastEvents.forEach(event => {
      const eventDate = new Date(event.getAttribute('data-event-start'));
      if (eventDate.getTime() + 1 * 24 * 60 * 60 * 1000 > currentDate.getTime()) {
        event.classList.add('not-visible');
      } else {
        event.classList.remove('not-visible');
      }
    });
  },
  handleNoUpcomingEvents() {
    let allEvents = document.querySelectorAll('.cards-wrapper--upcoming > .event');
    let hiddenEvents = document.querySelectorAll('.cards-wrapper--upcoming > .event.not-visible');
    if (allEvents.length === hiddenEvents.length) {
      document.querySelector('.cards-wrapper--upcoming').innerHTML = `<p>No Upcoming Events</p>`;
    }
  },

  clearFormInputs() {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
      dropdown.selectedIndex = 0;
    });
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
    }
  },
  handleSearchBehavior() {
    this.filterList();
  },
  init() {
    this.setVisibilityByDate();
    this.createList();
    this.handleDropdownParams();
    this.clearFormInputs();
    this.filterBySessionStorage();
    this.handleSearchBehavior();
  }
};

module.exports = EventsFilter;
