
define(['dojo/_base/declare', 'jimu/BaseWidget',
  'esri/symbols/SimpleFillSymbol',
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  'esri/geometry/Point', 
  'dojo/_base/lang',
  'dojo/dom',
  'esri/graphic',
  "esri/toolbars/draw",
  'esri/Color',
  "dojo/store/Memory",
  "dgrid/Selection",
  "esri/layers/FeatureLayer",
"esri/tasks/query",
"dgrid/OnDemandGrid",
"dojo/_base/array"],
  function (declare, BaseWidget,
    SimpleFillSymbol,
    SimpleMarkerSymbol,
    SimpleLineSymbol,
    Point,
    lang,
    dom,
    Graphic,
    Draw,
    Color,
    Memory,Selection,
    FeatureLayer,
    Query,
    Grid,array) {
    return declare([BaseWidget], {
      baseClass: 'add-graphic',
      postCreate: function postCreate() {
        this.symbol = new SimpleFillSymbol();
        var marker = this.symbol;
        marker.setColor(new Color([0, 77, 168, 0]));
      },

      startup: function startup() {
        this.inherited(arguments);
        


        // console.log(layerSanecan);
      },

      onOpen: function () {
        this.map.graphics.show();
        


        

      //Anomalias//
      var anomaliasLayer = new FeatureLayer("https://localhost:6443/arcgis/rest/services/TFM/GEODATABASE/FeatureServer/0");
      this.map.addLayer(anomaliasLayer);

      // valvulas
      var valvulasLayer = new FeatureLayer("https://localhost:6443/arcgis/rest/services/TFM/GEODATABASE/FeatureServer/3");
      this.map.addLayer(valvulasLayer);


        

       

        this.map.on('click', lang.hitch(this, function (evt) {
          if (dom.byId('activado').checked) {
            this.map.graphics.clear();
          
            
            
            this.selectPoint()
            
          };
        }));

        
        // var geometryInput = populateGrid;
        //   queryAnomalias = geometryInput.geometry;
        //   lyUrban.on("selection-complete", populateGrid);
        //   lyUrban.selectFeatures(queryAnomalias, FeatureLayer.SELECTION_NEW);
        

       
      },
       
       selectPoint() {
      
       
          /*
           * Step: Implement the Draw toolbar
           */
          var tbDraw = new Draw(this.map);
         
          tbDraw.activate(Draw.POLYGON);

          tbDraw.on('draw-end',lang.hitch(this, function(params) {
            console.log("displayPolygon",params)
            var poligono = params.geometry
            var Simbologia = new SimpleFillSymbol()
            this.map.graphics.add(new Graphic(poligono,Simbologia))
            tbDraw.deactivate()



            
            var symbolSelect= new SimpleMarkerSymbol({"type": "esriSMS",
            "style": "esriSMSCircle",
            "color": [255, 115, 0, 128],
            "size": 8,
            "outline": {
                "color": [255, 0, 0, 214],
                "width": 1
            }}
        );
            console.log('this.map', this.map)
            var anomaliasLayer = new FeatureLayer("https://localhost:6443/arcgis/rest/services/TFM/GEODATABASE/FeatureServer/0",{outFields:"*"});
            anomaliasLayer.setSelectionSymbol(symbolSelect);

            var queryAnomalias = new Query();
            queryAnomalias.geometry = poligono;
           
           queryAnomalias.outFields = ["*"]
           console.log(queryAnomalias)

            anomaliasLayer.selectFeatures(queryAnomalias, FeatureLayer.SELECTION_NEW);
            
      
            anomaliasLayer.on("selection-complete", function(results) {
              console.log('results', results) 


              var gridAnomalias = new (declare([Grid, Selection]))({
                bufferRows: Infinity,
                columns: {
                    municipio: "MUNICIPIO",              
                    tipo: "TIPO",
                    subtipo:"SUBTIPO",
                    profundidad: "PROFUNDIDAD"
                               
                }
            }, "divGrid");
               
                
                var dataAnomalias = array.map(results.features, function (feature) {
                  console.log("Feature", feature)
                    var outAnomalias = ["gasoducto", "tipo","subtipo","profundidad"];
                    return {              
                        /*
                         * Step: Reference the attribute field values
                         */
                        "municipio": feature.attributes[outAnomalias[0]],
                        "tipo": feature.attributes[outAnomalias[1]],
                        "subtipo": feature.attributes[outAnomalias[2]],
                        "profundidad":feature.attributes[outAnomalias[3]]
                    }
                });
                console.log(dataAnomalias)
      
                // Pass the data to the grid
                var memStore = new Memory({
                    data: dataAnomalias
                });
                gridAnomalias.set("store", memStore);
      
                console.log("Hola")
          
            });
          }))
          

       

       
        
  
  
      },

      onClose: function onClose() {
        this.map.graphics.hide();
      }
    });
  });