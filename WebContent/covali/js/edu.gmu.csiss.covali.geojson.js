/**
 * Juozas
 */
edu.gmu.csiss.covali.geojson = {
    addGeoJSONFeature: function(url, layertitle) {
    	
        $.ajax({

        	dataType: 'json',

            url: url,

            success: function(obj, text, jxhr)
            {
                var gs = (new ol.format.GeoJSON()).readFeatures(obj);
                var features = [];
                
                var style = new ol.style.Style({
                    image: new ol.style.Icon(/** @type {module:ol/style/Icon~Options} */ ({
                        anchor: [40, 52],
                        anchorXUnits: 'pixels',
                        anchorYUnits: 'pixels',
                        crossOrigin: 'anonymous',
                        src: '../images/chords-marker.png'
                    }))
                });
                
                for(var i=0;i<gs.length;i+=1){
                	
                	var feature = gs[i];
                    var point = feature.getGeometry();

                    var coords = ol.proj.fromLonLat(point.getCoordinates().map(parseFloat));
                    point.setCoordinates(coords);
                    
                    feature.setStyle(style);
                    
                    features.push(feature);
                	
                }
                
                var vectorSource = new ol.source.Vector({
                	format: new ol.format.GeoJSON(),
                	features: features,
                	projection: 'EPSG:4326',
                	name: layertitle,
                	title: layertitle
                });


                var vectorLayer = new ol.layer.Vector({
                    source: vectorSource,
                    style: style,
                    name: layertitle,
                    title: layertitle
                });

                var map1 = edu.gmu.csiss.covali.map.getMapBySide('left');
                var map2 = edu.gmu.csiss.covali.map.getMapBySide('right');

                var select1 = new ol.interaction.Select();
                var select2 = new ol.interaction.Select();

                var selectedFeatures1 = select1.getFeatures();
                var selectedFeatures2 = select2.getFeatures();

                selectedFeatures1.on('add', function(){
                    var feature = selectedFeatures1.pop();
                    edu.gmu.csiss.covali.chords.showSitePopup(feature, 'left');
                });

                selectedFeatures2.on('add', function(){
                    var feature = selectedFeatures2.pop();
                    edu.gmu.csiss.covali.chords.showSitePopup(feature, 'right');
                });


                map1.addInteraction(select1);
                map2.addInteraction(select2);


                map1.addLayer(vectorLayer);
                map2.addLayer(vectorLayer);


                map1.on('pointermove', function(evt) {
                    map1.getTargetElement().style.cursor =
                        map1.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';
                });

                map2.on('pointermove', function(evt) {
                    map2.getTargetElement().style.cursor =
                        map2.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';
                });

            }
        });
    }
}

