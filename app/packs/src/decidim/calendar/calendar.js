import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import allLocales from '@fullcalendar/core/locales-all';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/translucent.css';

document.addEventListener('DOMContentLoaded', function() {
  collect_events();
});

// TODO: Improve from https://fullcalendar.io/docs/events-json-feed
function collect_events() {
  fetch('/calendar/calendar/events')
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      render_calendar(json);
    });
}

function render_calendar(events) {
  var initialLocaleCode = 'pt-br';
  var localeSelectorEl = document.getElementById('locale-selector');
  var calendarEl = document.getElementById('calendar');

  var calendar = new Calendar(calendarEl, {
    plugins: [ interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: "dayGridMonth",
    locales: allLocales,
    locale: initialLocaleCode,
    navLinks: true, // can click day/week names to navigate views
    dayMaxEvents: true, // allow "more" link when too many events
    eventTimeFormat: {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      omitZeroMinute: false
    },
    events: events,
    eventDidMount: function(info) {
      var hour = info.event.start.toTimeString().substr(0, 5)
      var tip = "<b>" + info.event.title + "</b>"

      if (hour != "00:00") {
        tip = "<b>" + hour + " - " + info.event.title + "</b>"
      }

      if (info.event.extendedProps.description != "") {
        tip = tip + ":" + info.event.extendedProps.description
      }

      var tooltip = new tippy(info.el, {
        content: tip,
        allowHTML: true,
        theme: 'translucent',
        interactive: true
      });
    },
  });

  calendar.render();

  // build the locale selector's options
  calendar.getAvailableLocaleCodes().forEach(function(localeCode) {
    var optionEl = document.createElement('option');
    optionEl.value = localeCode;
    optionEl.selected = localeCode == initialLocaleCode;
    optionEl.innerText = localeCode;
    localeSelectorEl.appendChild(optionEl);
  });

  // when the selected option changes, dynamically change the calendar option
  localeSelectorEl.addEventListener('change', function() {
    if (this.value) {
      calendar.setOption('locale', this.value);
    }
  });
}
