
var vertical_mult = 40;  // Vertical exaggeration
var vertical_buff = 5;   // subtracted from altitude to snap to ground

var jQ = jQuery;

Cesium.BingMapsApi.defaultKey = 'AhVOV60tIOUqmm3jdfvXcA4VS5J4mbQttw-zBW5FM5mroBii3d3GoD6qGINtYrK6'

var viewer = new Cesium.Viewer('cesiumContainer');

function row2date(row) {
    // convert bird gps row to Cesium date, via JS Date in ISO format
    var date = '20' + row.Date.replace(/\//g, '-') + 'T';
    date = date + row.RTC_time.replace(/.000$/g, '') + 'Z';
    return Cesium.JulianDate.fromDate(new Date(date));
}

track = jQ.ajax({
    url: "PinPoint_40883_2016-06-11_17-53-39.json",
    dataType: 'json'
})

track.then(function(data) {

    var positions = new Cesium.SampledPositionProperty();

    var min_alt = data[0].Altitude;
    for (row_n in data) {
        var row = data[row_n];
        if (row.eRes > 5) { continue; }
        if (min_alt > row.Altitude) {
            min_alt = row.Altitude;
        }
    }

    for (row_n in data) {
        var row = data[row_n];
        if (row.eRes > 5) { continue; }
        positions.addSample(row2date(row),
            new Cesium.Cartesian3.fromDegrees(
                row.Longitude, row.Latitude,
                Math.max(0, (row.Altitude-min_alt-vertical_buff)*vertical_mult)));
    }
    var entity = new Cesium.Entity({
        id: "Tern",
        name: "Tern",
        position: positions,
        viewFrom: new Cesium.Cartesian3(1000, -1000, 1000),
        point: new Cesium.PointGraphics({
            color: new Cesium.Color(255,255,255),
            pixelSize: 7.0
        })
    });
    viewer.entities.add(entity);

    viewer.trackedEntity = entity;

    viewer.clock.currentTime = Cesium.JulianDate.fromDate(
        new Date("2016-05-31T14:00:00Z"))
    viewer.clock.multiplier = 35;

    // viewer.scene.camera.lookAt(
    //     entity.position.getValue(viewer.clock.currentTime),
    //     new Cesium.Cartesian3(1000, -1000, 1000)
    // );

});

jQ(startup);

function show_date() {
    var date = Cesium.JulianDate.toDate(viewer.clock.currentTime);
    date = date.toString();
    var w = jQ('#date')
    if (w.text() != date) {
        w.text(date);
    }
}

function startup() {

    jQ("#next").click(function(){
        Cesium.JulianDate.addSeconds(
            viewer.clock.currentTime, 60*60, viewer.clock.currentTime);
    });
    jQ("#prev").click(function(){
        Cesium.JulianDate.addSeconds(
            viewer.clock.currentTime, -60*60, viewer.clock.currentTime);
    });

    viewer.clock.onTick.addEventListener(show_date);
}

