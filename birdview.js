
var jQ = jQuery;

Cesium.BingMapsApi.defaultKey = 'AhVOV60tIOUqmm3jdfvXcA4VS5J4mbQttw-zBW5FM5mroBii3d3GoD6qGINtYrK6'

var viewer = new Cesium.Viewer('cesiumContainer');

track = jQ.ajax({
    url: "PinPoint_40883_2016-06-11_17-53-39.json",
    dataType: 'json'
})

track.then(function(data) {
    var positions = new Cesium.SampledPositionProperty();
    var date = new Date()
    var c_date = Cesium.JulianDate.fromDate(date);
    viewer.clock.currentTime = c_date;
    
    var min_alt = data[0].Altitude;
    for (row_n in data) {
        var row = data[row_n];
        if (row.eRes > 5) { continue; }
        if (min_alt > row.Altitude) {
            min_alt = row.Altitude;
        }
    }
    console.log(min_alt);
    
    for (row_n in data) {
        var row = data[row_n];
        if (row.eRes > 5) { continue; }
        var new_date = c_date.clone();
        Cesium.JulianDate.addSeconds(c_date, 5*row_n, new_date);
        positions.addSample(new_date,
            new Cesium.Cartesian3.fromDegrees(
                row.Longitude, row.Latitude, Math.max(0, (row.Altitude-min_alt-5)*50)));
        // console.log(new_date);
        // console.log(viewer.clock.currentTime);
        // console.log(row);
    }        
    var entity = new Cesium.Entity({
        id: "turn",
        name: "turn",
        position: positions,
        point: new Cesium.PointGraphics({
            color: new Cesium.Color(255,255,255), 
            pixelSize: 7.0
        })
    });
    viewer.entities.add(entity);
    console.log(entity);

});

