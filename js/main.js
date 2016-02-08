var MAP_WIDTH = 369;
var MAP_HEIGHT = 170;
var pixelColorMap = {};

var colorMap = ['rgba(0,0,0,0)',
                'rgba(206,226,249, 0.25)',
                'rgba(146,168,219, 0.3)',
                'rgba(123,123,199, 0.35)',
                'rgba(126,87,188, 0.4)',
                'rgba(148,59,184, 0.45)',
                'rgba(189,33,188, 0.5)'];


function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function map_range(value, low1, high1, low2, high2) {
    return Math.floor(low2 + (high2 - low2) * (value - low1) / (high1 - low1));
}

$(document).ready(function(){

  d3.json('assets/us_grid_with_inverted_positions.geo.json', function(error, grid_data){
    if (error) throw error;

    mapboxgl.accessToken = 'pk.eyJ1IjoiYmNsaWZ0b24iLCJhIjoicWNXT0Z6OCJ9.JvNO6GIbU8BZ-8LLSEwz2Q';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v8',
        center: [-98.5795, 39.828175],
        zoom: 4
    });

    // console.log(grid_data);

    grid_data.features.forEach(function(e){
      var fid = e.properties.FID;
    });

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
      .attr('x', function(d){ return d.properties.x})
      .attr('y', function(d){ return d.properties.y});
    function update() {
      featureElement.attr("d", path);
    }
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
    });
    update();
    function projectPoint(lon, lat) {
      var point = map.project(new mapboxgl.LngLat(lon, lat));
      this.stream.point(point.x, point.y);
    }

    $('#draw').on('click', function(e){
      var allPaths = d3.selectAll('path')
        .on('mouseover', function(d, i){
          var current = d3.select(this);
          var c = parseInt(current.attr('i'));
          current.attr('fill', colorMap[c]);
          current.attr('i', c >= 6 ? 6 : c += 1);
        });
    });


    $('#randomize').on('click', function(e){
      var allPaths = d3.selectAll('path')
        .each(function(d){
          d3.select(this)
            .attr('i', getRandomIntInclusive(0,6))
            .attr('fill', function(d){
              var current = d3.select(this);
              var c = parseInt(current.attr('i'));
              return colorMap[c];
            });
      });
    });


    $('#clear').on('click', function(e){
      var allPaths = d3.selectAll('path')
        .each(function(d){
          d3.select(this)
            .attr('i', 0)
            .attr('fill', function(d){
              var current = d3.select(this);
              var c = parseInt(current.attr('i'));
              return colorMap[c];
            });
      });
    });

    // $('#count').on('click', function(e){
    //   d3.selectAll('path')
    //     .each(function(){
    //       d3.select(this)
    //         .attr('fill', function(d){
    //           var current = d3.select(this);
    //           var fid = parseInt(current.attr('fid'));
    //             if (fid % 85 == 0){
    //               return  colorMap[5];
    //             } else {
    //               return colorMap[1];
    //             }
    //           });
    //     });
    //   });



    // $('#noise').on('click', function(e){
    //
    //   var valueMap = {};
    //
    //   for (var x = 0; x < MAP_WIDTH; x++) {
    //     for (var y = 0; y < MAP_HEIGHT; y++) {
    //
    //       var value = Math.abs(noise.perlin2(x / 100, y / 100));
    //       value *= 256;
    //       // var cell = (x + y * MAP_WIDTH) * 4;
    //
    //       valueMap[ x + ',' + y ] = value
    //       // perlinNoiseMap[]
    //
    //
    //       // data[cell] = data[cell + 1] = data[cell + 2] = value;
    //       // data[cell] += Math.max(0, (25 - value) * 8);
    //       // data[cell + 3] = 255; // alpha.
    //
    //
    //     }
    //   }
    //
    //
    //   console.log(valueMap);
    //
    //
    //   d3.selectAll('path')
    //     .each(function(){
    //       d3.select(this)
    //         .attr('fill', function(d){
    //           var current = d3.select(this);
    //           var fid = parseInt(current.attr('fid'));
    //
    //           return fid;
    //           // var x = current.attr('x');
    //           // var y = current.attr('y');
    //
    //         });
    //     });
    // });

    $(":file").change(function () {
      var reader = new FileReader();
      reader.onload = imageIsLoaded;
      reader.readAsDataURL(this.files[0]);
    });

    function imageIsLoaded(e) {

      $('#hidden-image').attr('src', e.target.result);

      img = document.getElementById("hidden-image");
			var canvas = document.getElementById("hidden-canvas");
			var ctx = canvas.getContext("2d");

      // ctx.setTransform();

      // ctx.translate(0, canvas.height);
      // ctx.scale(1, -1);

			ctx.drawImage(img ,0 ,0, img.width, img.height,
								0, 0, canvas.width, canvas.height);

      // ctx.restore();
      // ctx.scale(1,-1);

			var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
			var pix = imgd.data;

      console.log(canvas.height);
      console.log(canvas.width);
      console.log(pix);

			var counter = 0;
			var grayscaleArray = new Array();

			for (var x = 0; x < canvas.width * 4; x += 4) {
				for (var y = 0; y < pix.length; y += canvas.width*4) {
					counter ++;
          grayscale = (pix[x+y] + pix[x+y+1] + pix[x+y+2]) / 3 ;
					grayscale = map_range(grayscale, 0, 255, 6, 0);
					grayscaleArray.push(grayscale);
				};
			};


      d3.selectAll('path')
        .each(function(){
          d3.select(this)
            .attr('i', function(d){
              var current = d3.select(this);
              var fid = parseInt(current.attr('fid'));
              return grayscaleArray[fid]
            })
            .attr('fill', function(d){
              var current = d3.select(this);
              var c = parseInt(current.attr('i'));
              return colorMap[c];
            });
        });
    };


  }); // ends d3.json()

}); // ends $(document).ready()
