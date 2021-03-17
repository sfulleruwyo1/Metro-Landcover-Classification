require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/GeoJSONLayer",
    "esri/layers/MapImageLayer",
    "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.js",
    "esri/widgets/Search"
], function (esriConfig, Map, MapView, GeoJSONLayer, MapImageLayer, Chart, Search) {
    esriConfig.apiKey = "AAPK7904510d607c4e4f9241d3e83e475407rO4sFOn7xIuQFVlYlCwtmmAlpZJ5SIZlJ25wv7-fN0XJ_P49qXGVqjvrLCQexKDq";
    let chart;

    const renderer = {
        type: "simple", // autocasts as new SimpleRenderer()
        symbol: {
            type: "simple-fill",
            color: [51, 51, 204, 0.8],
            style: "none",
        }
    };

    const template2 = {
        title: "<div class ='textLeft'><h2><b>Vegetation Info</b></h2><br><p><b>Address:</b> {address}</p><p><b>Turf Area: </b><span class = 'turf'>{turf_area}</span></p></div>",
        outFields: ["*"],
        fieldInfos: [{
            fieldName: 'area',
            format: {
                places: 0,
                digitSeparator: true
            }
        }, {
            fieldName: 'turf_area',
            format: {
                places: 0,
                digitSeparator: true
            }
        }],
        content: setContentInfo,


    };

    const metroBndy = new GeoJSONLayer({
        url: "notebooks/data/castle_pines_metro_bndy.json",
        spatialReference: {
            wkid: 4326
        },
        //popupTemplate: template,
        renderer: renderer,
        Fields: [{
            name: "OBJECTID",
            alias: "ObjectID",
            type: "oid"
        }, {
            name: "LGNAME",
            alias: "Name",
            type: "string"
        }]
    });

    const parcelBndy = new GeoJSONLayer({
        url: "notebooks/data/parcels_with_turf_area.json",
        spatialReference: {
            wkid: 4326
        },
        popupTemplate: template2,
        outFields: ["*"],
        renderer: renderer,
        Fields: [{
            name: "address",
            alias: "Address",
            type: "string"
        }, {
            name: "id",
            alias: "ID",
            type: "integer"
        }, {
            name: "turf_area",
            alias: "Turf Area",
            type: "double"
        }, {
            name: "area",
            alias: "Area",
            type: "double"
        }]
    });

    let drcog_imagery = new MapImageLayer({
        url: "https://gis.aztecconsultants.com/server/rest/services/GIS/Castle_Pines_DRCOG_Imagery/MapServer"
    });


    const map = new Map({
        basemap: "arcgis-topographic",
        layers: [drcog_imagery, metroBndy, parcelBndy]
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
            autoOpenEnabled: true
        }
    });

    const searchWidget = new Search({
        view: view,
        container: "searchWidget",
        sources: [{
            layer: parcelBndy,
            searchFields: ["address"],
            displayField: "address",
            exactMatch: false,
            outFields: ["address", "area", "turf_area"],
            name: "Addresses",
            placeholder: "Search By Address"
        }],
        includeDefaultSources: false
    });

    // Using the data from the feature layer, create a doughnut graph.
    function setContentInfo(results) {
        //console.log(results)
        area = results.graphic.attributes.turf_area
        parcelArea = results.graphic.attributes.area
        let graph = createGraph(area)
        let graphDiv = document.createElement('div');
        graphDiv.id = 'graphDiv';
        let label = document.createElement('label');
        label.htmlFor = 'editSlider';
        label.innerHTML = 'Adjust Turf Area';
        label.className = 'form-label';
        graphDiv.appendChild(label);
        let slider = document.createElement('input');
        slider.id = 'editSlider';
        slider.type = 'range';
        slider.min = '0';
        slider.max = parcelArea;
        slider.value = area;
        slider.className = 'slider, form-range';
        graphDiv.appendChild(slider);

        graphDiv.appendChild(graph);


        slider.oninput = function () {
            let output = document.querySelector('.turf')
            output.innerHTML = numberWithCommas(this.value);
            //update chart
            let area = this.value
            //removeData(graph)
            updateChart(area)
        }

        return graphDiv;
    }

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }



    function updateChart(area) {
        let april = Math.round(((area * 0.623) * 4.3), 2)
        let may = Math.round(((area * 0.75) * 4.3), 2)
        let june = Math.round(((area * 1) * 4.3), 2)
        let july = Math.round(((area * 1.25) * 4.3), 2)
        let august = Math.round(((area * 1) * 4.3), 2)
        let september = Math.round(((area * 0.623) * 4.3), 2)

        chart.data.datasets[0].data[3] = april;
        chart.data.datasets[0].data[4] = may;
        chart.data.datasets[0].data[5] = june;
        chart.data.datasets[0].data[6] = july;
        chart.data.datasets[0].data[7] = august;
        chart.data.datasets[0].data[8] = september;

        chart.update();

    }

    function createGraph(area) {
        // Create a new canvas element, this is where the graph will be placed.
        let canvas = document.createElement('canvas');
        canvas.id = "myChart";

        let april = Math.round(((area * 0.623) * 4.3), 2)
        let may = Math.round(((area * 0.75) * 4.3), 2)
        let june = Math.round(((area * 1) * 4.3), 2)
        let july = Math.round(((area * 1.25) * 4.3), 2)
        let august = Math.round(((area * 1) * 4.3), 2)
        let september = Math.round(((area * 0.623) * 4.3), 2)

        // april = Number(april).toLocaleString('en');
        // console.log(april)

        // Create a data object, this will include the data from the feature layer and other information like color or labels.
        let data = {
            datasets: [{
                label: "Gallons",
                data: [0, 0, 0, april, may, june, july, august, september, 0, 0, 0],
                backgroundColor: ["#4286f4", "#41f4be", "#8b41f4", "#e241f4", "#f44185", "#f4cd41", "#4286f4", "#41f4be", "#8b41f4", "#e241f4", "#f44185", "#f4cd41"]
            }],
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        };

        // Create a new Chart and hook it to the canvas and then return the canvas.
        chart = new Chart(canvas, {
            type: 'bar',
            data: data,
            options: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Monthly Water Budget'
                },
                tooltips: {
                    mode: 'label',
                    label: 'mylabel',
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        },
                    },
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: function (value, index, values) {
                                if (parseInt(value) >= 1000) {
                                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                } else {
                                    return value;
                                }
                            }
                        }
                    }]
                }
            }
        });

        return canvas;
    }



    // var tileLayer = new VectorTileLayer({
    //     url: "https://jsapi.maps.arcgis.com/sharing/rest/content/items/75f4dfdff19e445395653121a95a85db/resources/styles/root.json"
    // });
    //map.add(metroBndy);

    // metroBndy.when(function () {
    //     view.goTo(metroBndy.fullExtent);
    // });


})