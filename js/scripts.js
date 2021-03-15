require(["esri/config", "esri/Map", "esri/views/MapView", "esri/layers/GeoJSONLayer", "esri/layers/VectorTileLayer", "esri/widgets/Popup/PopupViewModel", "esri/widgets/Feature"], function (esriConfig, Map, MapView, GeoJSONLayer,
    VectorTileLayer, PopupVM, Feature) {
    esriConfig.apiKey = "AAPK7904510d607c4e4f9241d3e83e475407rO4sFOn7xIuQFVlYlCwtmmAlpZJ5SIZlJ25wv7-fN0XJ_P49qXGVqjvrLCQexKDq";

    const renderer = {
        type: "simple", // autocasts as new SimpleRenderer()
        symbol: {
            type: "simple-fill",
            color: [51, 51, 204, 0.8],
            style: "none",
        }
    };

    const template = {
        title: "Vegetation Info",
        content: "<p><b>Address:</b> {address}</p> <p><b>Turf Area:</b> {area}</p>",
    };

    const metroBndy = new GeoJSONLayer({
        url: "notebooks/data/castle_pines_metro_bndy.json",
        spatialReference: {
            wkid: 4326
        },
        //popupTemplate: template,
        renderer: renderer //optional
    });

    const parcelBndy = new GeoJSONLayer({
        url: "notebooks/data/parcels_with_turf_area.json",
        spatialReference: {
            wkid: 4326
        },
        popupTemplate: template,
        renderer: renderer //optional
    });

    const map = new Map({
        basemap: "arcgis-topographic",
        layers: [metroBndy, parcelBndy]
    });

    const view = new MapView({
        map: map,
        center: [-104.8995488, 39.4433070],
        zoom: 14.5, // scale: 72223.819286
        container: "viewDiv",
        constraints: {
            snapToZoom: false
        },
        popup: {
            autoOpenEnabled: false
        }
    });

    view.when().then(function () {
        // Create a default graphic for when the application starts
        const graphic = {
            popupTemplate: {
                content: "Mouse over features to show details..."
            }
        };

        // Provide graphic to a new instance of a Feature widget
        const feature = new Feature({
            container: "feature-node",
            graphic: graphic,
            map: view.map,
            spatialReference: view.spatialReference
        });

        view.whenLayerView(parcelBndy).then(function (layerView) {
            let highlight;
            // listen for the pointer-move event on the View
            view.on("click", function (event) {
                let myModal = new bootstrap.Modal(document.getElementById('myModal'), {
                    keyboard: false
                })
                myModal.toggle()
                // Perform a hitTest on the View
                view.hitTest(event).then(function (event) {
                    // Make sure graphic has a popupTemplate
                    let results = event.results.filter(function (result) {
                        return result.graphic.layer.popupTemplate;
                    });
                    let result = results[0];
                    highlight && highlight.remove();
                    // Update the graphic of the Feature widget
                    // on pointer-move with the result
                    if (result) {
                        feature.graphic = result.graphic;
                        highlight = layerView.highlight(result.graphic);
                    } else {
                        feature.graphic = graphic;
                    }
                });
            });
        });
    });


    // var tileLayer = new VectorTileLayer({
    //     url: "https://jsapi.maps.arcgis.com/sharing/rest/content/items/75f4dfdff19e445395653121a95a85db/resources/styles/root.json"
    // });
    //map.add(metroBndy);

    // metroBndy.when(function () {
    //     view.goTo(metroBndy.fullExtent);
    // });


})