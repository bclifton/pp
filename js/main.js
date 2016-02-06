function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


$(document).ready(function(){

  var colorMap = ['rgba(0,0,0,0)',
                  'rgba(206,226,249, 0.25)',
                  'rgba(146,168,219, 0.3)',
                  'rgba(123,123,199, 0.35)',
                  'rgba(126,87,188, 0.4)',
                  'rgba(148,59,184, 0.45)',
                  'rgba(189,33,188, 0.5)'];


  // d3.json('assets/us_grid.geo.json', function(error, grid_data){
  d3.json('assets/1.json', function(error, grid_data){
    if (error) throw error;

    mapboxgl.accessToken = 'pk.eyJ1IjoiYmNsaWZ0b24iLCJhIjoicWNXT0Z6OCJ9.JvNO6GIbU8BZ-8LLSEwz2Q';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v8',
        center: [-98.5795, 39.828175],
        zoom: 4
    });

    // turf.js vars:

    // var temp_grid = grid_data.features.map(function(obj){
    //   return {'type': 'Feature', 'features': obj};
    // });

    // grid_data.features.forEach(function(e){
    //   e.style = { "fill":"red" }
    // });

    console.log(grid_data);
    // console.log(temp_grid);




    




    var container = map.getCanvasContainer();
    var svg = d3.select(container).append("svg");
    var transform = d3.geo.transform({point: projectPoint});
  	var path = d3.geo.path().projection(transform);

    var featureElement = svg.selectAll("path")
      .data(grid_data.features)
      .enter()
      .append("path")
      .attr('stroke', 'rgba(175,175,175,0.1)')
      .attr('fill', colorMap[0])
      .attr('i', 0)
      .attr('fid', function(d){ return d.properties.FID; })
      .on('mouseover', function(d, i){
        var current = d3.select(this);
        var c = parseInt(current.attr('i'));
        current.attr('fill', colorMap[c]);
        current.attr('i', c >= 6 ? 6 : c += 1);
      })
      ;

    function update() {
      // console.log('updating');
      featureElement.attr("d", path);
    }

    //
    map.on("viewreset", update)
    map.on("movestart", function(){
      svg.classed("hidden", true);
    });
    map.on("rotate", function(){
      // svg.classed("hidden", true);
    });
    map.on("moveend", function(){
      update();
      svg.classed("hidden", false);
    })


    update();


    function projectPoint(lon, lat) {
      var point = map.project(new mapboxgl.LngLat(lon, lat));
      this.stream.point(point.x, point.y);
    }

    // map.on('style.load', function(){



      // map.addSource('grid', {
      //     'type': 'geojson',
      //     'data': grid_data
      // });


      // map.addLayer({
      //   'id': 'route',
      //   'type': 'line',
      //   'source': 'grid',
      //   'layout': {},
      //   'paint': {
      //       // "line-color": "#888",
      //       // "line-width": 1,
      //       // 'line-opacity': 0.2
      //   }
      // });
    // });


    $('#randomize').on('click', function(e){
      var allPaths = d3.selectAll('path')
        .each(function(d){
          d3.select(this)
            .attr('i', getRandomIntInclusive(0, 6) )
            .attr('fill', function(d){
              var current = d3.select(this);
              var c = parseInt(current.attr('i'));
              return colorMap[c];
            });
      });
    });

    var rowCount = 0;

    $('#count').on('click', function(e){
      d3.selectAll('path')
        .each(function(){
          d3.select(this)
            .attr('fill', function(d){
              var current = d3.select(this);
              var fid = parseInt(current.attr('fid'));
              // if (fid % 680 == 0){
              if (fid % 85 == 0){
                return  colorMap[5];
              } else {
                return colorMap[1];
              }

            });
        });

    });
  });
});
