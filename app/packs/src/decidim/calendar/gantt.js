import { SVGGantt, CanvasGantt, StrGantt } from 'gantt';

document.addEventListener('DOMContentLoaded', function() {
  collect_tasks();
});

function collect_tasks() {
  fetch('/calendar/calendar/gantt/tasks')
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      if (json == null)
        return

      const isoDatePattern = new RegExp(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d/);
      const jsons = JSON.stringify(json);

      // Convert back, use reviver function:
      const parsed = JSON.parse(jsons, (key, value) => {
        if (typeof value === 'string' && value.match(isoDatePattern)){
          return new Date(value); // isostring, so cast to js date
        }
        return value; // leave any other value as-is
      });

      render_gantt(parsed);
    });
}

function render_gantt(tasks) {
  new SVGGantt("#gantt", tasks, {
    view_mode: 'Month',
  });
}
