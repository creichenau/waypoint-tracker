Hooks.once('init', () => {
  console.log('waypoint-tracker | Initializing...')

  window.waypointTracker = {
    dashboard: new TrackerDashboard(),
    datamanager: new TrackerDataManager()
  }

  window.waypointTracker.datamanager.register();

  console.log('waypoint-tracker | Initialization Complete.')
});

Hooks.once('ready', () => {
  
});

Hooks.on('renderActorDirectory', (app, html, data) => {
  html
    .find(".directory-header")
    .prepend(`<div class="action-buttons flexrow"><button id="btn-dashboard">Waypoint Tracker</div>`)
    .promise()
    .done(() => {
      $('#btn-dashboard').on('click', e => {
        window.waypointTracker.dashboard.redraw(true);
      });
    })
});

class TrackerDashboard extends Application {

  static get defaultOptions() {

    let dd = [];
    dd.push(
    new DragDrop({ 
      dropSelector: ".drop-target",
      callbacks: { 
          drop: this.handleDrop
      }}));

    return mergeObject(super.defaultOptions, {
      id: "waypoint-tracker-dashboard",
      classes: ["luck-dashboard"],
      template: "modules/waypoint-tracker/templates/mission_tracker.html",
      minimizable: true,
      resizable: true,
      title: "Waypoint Tracker",
      dragDrop: dd,
    })
  }

  activateListeners(html) {
    super.activateListeners(html);
  }

  _onDragStart(event) {
    console.log(event);
    if (event.currentTarget.dataset.itemId !== undefined) {
      super._onDragStart(event);
      return;
    }
  }

  async handleDrop(event) {
    console.log(event);
  }

  redraw(force) {
    this.render(force);
  }

  getData() {
    return window.waypointTracker.datamanager.progress();
  }

}

class TrackerDataManager {

  progress() {
    let retVal = this.get();
    return retVal;
  }

  clearProgress() {
    let newData = { progress: { 'waypoint_count': 8, 'marked': [] } };
    this.set(newData);
  }

  updateProgress(current) {
    let newData = { progress: current };
    this.set(newData);
  }

  register() {
    let newData = { progress: { 'waypoint_count': 8, 'marked': [] } };
    console.log('waypoint-tracker | registering settings...')
    game.settings.register('waypoint-tracker', 'waypoint-data', {
      name: "Waypoint Tracker",
      scope: "client",
      config: false,
      type: Object,
      default: null
    });
    this.set(newData);
    console.log('waypoint-tracker | settings registered.')
  }

  get() {
    return game.settings.get('waypoint-tracker', 'waypoint-data');
  }

  set(value) {
    game.settings.set('waypoint-tracker', 'waypoint-data', value)
  }
}
