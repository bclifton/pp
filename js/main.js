var MAP_WIDTH = 369;
var MAP_HEIGHT = 170;
var pixelColorMap = {};



function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function map_range(value, low1, high1, low2, high2) {
    return Math.floor(low2 + (high2 - low2) * (value - low1) / (high1 - low1));
}

// Dropzone.options.myAwesomeDropzone = {
//   init: function() {
//     this.on("addedfile", function(file) {
//       alert("Added file.");
//      });
//   }
// };


// function grayscale(image, bPlaceImage) {
//   var myCanvas=document.createElement("canvas");
//   var myCanvasContext=myCanvas.getContext("2d");
//
//   var imgWidth=image.width;
//   var imgHeight=image.height;
//   // You'll get some string error if you fail to specify the dimensions
//   myCanvas.width= imgWidth;
//   myCanvas.height=imgHeight;
//   //  alert(imgWidth);
//   myCanvasContext.drawImage(image,0,0);
//
//   // This function cannot be called if the image is not rom the same domain.
//   // You'll get security error if you do.
//   var imageData=myCanvasContext.getImageData(0,0, imgWidth, imgHeight);
//
//   // This loop gets every pixels on the image and
//     for (j=0; j<imageData.height; i++)
//     {
//       for (i=0; i<imageData.width; j++)
//       {
//          var index=(i*4)*imageData.width+(j*4);
//          var red=imageData.data[index];
//          var green=imageData.data[index+1];
//          var blue=imageData.data[index+2];
//          var alpha=imageData.data[index+3];
//          var average=(red+green+blue)/3;
//    	     imageData.data[index]=average;
//          imageData.data[index+1]=average;
//          imageData.data[index+2]=average;
//          imageData.data[index+3]=alpha;
//        }
//      }
//
//     if (bPlaceImage)
// 	{
// 	  var myDiv=document.createElement("div");
// 	     myDiv.appendChild(myCanvas);
// 	  image.parentNode.appendChild(myCanvas);
// 	}
// 	return myCanvas.toDataURL();
// }

// function getBase64Image(img) {
//     // Create an empty canvas element
//     var canvas = document.createElement("canvas");
//     canvas.width = img.width;
//     canvas.height = img.height;
//
//     // Copy the image contents to the canvas
//     var ctx = canvas.getContext("2d");
//     ctx.drawImage(img, 0, 0);
//
//
//     console.log(ctx);
//     // Get the data-URL formatted image
//     // Firefox supports PNG and JPEG. You could check img.src to
//     // guess the original format, but be aware the using "image/jpg"
//     // will re-encode the image.
//     var dataURL = canvas.toDataURL("image/png");
//
//     return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
// }






$(document).ready(function(){



  var colorMap = ['rgba(0,0,0,0)',
                  'rgba(206,226,249, 0.25)',
                  'rgba(146,168,219, 0.3)',
                  'rgba(123,123,199, 0.35)',
                  'rgba(126,87,188, 0.4)',
                  'rgba(148,59,184, 0.45)',
                  'rgba(189,33,188, 0.5)'];


  d3.json('assets/us_grid_with_positions.geo.json', function(error, grid_data){
    if (error) throw error;

    mapboxgl.accessToken = 'pk.eyJ1IjoiYmNsaWZ0b24iLCJhIjoicWNXT0Z6OCJ9.JvNO6GIbU8BZ-8LLSEwz2Q';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v8',
        center: [-98.5795, 39.828175],
        zoom: 4
    });

    console.log(grid_data);

    var xCounter = 0;
    var yCounter = 0;

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



    $('#noise').on('click', function(e){

      var valueMap = {};

      for (var x = 0; x < MAP_WIDTH; x++) {
        for (var y = 0; y < MAP_HEIGHT; y++) {

          var value = Math.abs(noise.perlin2(x / 100, y / 100));
          value *= 256;
          // var cell = (x + y * MAP_WIDTH) * 4;

          valueMap[ x + ',' + y ] = value
          // perlinNoiseMap[]


          // data[cell] = data[cell + 1] = data[cell + 2] = value;
          // data[cell] += Math.max(0, (25 - value) * 8);
          // data[cell + 3] = 255; // alpha.


        }
      }


      console.log(valueMap);


      d3.selectAll('path')
        .each(function(){
          d3.select(this)
            .attr('fill', function(d){
              var current = d3.select(this);
              var fid = parseInt(current.attr('fid'));

              return fid;
              // var x = current.attr('x');
              // var y = current.attr('y');

            });
        });
    });

    // var imageCounter=0;


    $(":file").change(function () {
        // if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = imageIsLoaded;
            reader.readAsDataURL(this.files[0]);
        // }
    });

    function imageIsLoaded(e) {

      $('#hidden-image').attr('src', e.target.result);

      img = document.getElementById("hidden-image");
			var canvas = document.getElementById("hidden-canvas");
			var ctx = canvas.getContext("2d");

      // ctx.setTransform();

      ctx.translate(0, canvas.height);
      ctx.scale(1, -1);

			ctx.drawImage(img ,0 ,0, img.width, img.height,
								0, 0, canvas.width, canvas.height);

      // ctx.restore();

      // ctx.scale(1,-1);

			var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
			var pix = imgd.data;

			var counter = 0;

			var grayscaleArray = new Array();

			for (var x = 0; x < canvas.width * 4; x+=4) {
				for (var y = 0; y < pix.length; y+= canvas.width*4) {
					counter ++;
          grayscale = (pix[x+y]+pix[x+y+1]+pix[x+y+2]) / 3 ;
					grayscale = map_range(grayscale, 0, 255, 6, 0);
					grayscaleArray.push(grayscale);
				};
			};

			console.log(grayscaleArray);

      d3.selectAll('path')
        .each(function(){
          d3.select(this)
            .attr('fill', function(d){
              var current = d3.select(this);
              var fid = parseInt(current.attr('fid'));
              var grayscaleColor = grayscaleArray[fid]
              return colorMap[grayscaleColor];
            });
        });
    };


  }); // ends d3.json()

}); // ends $(document).ready()
