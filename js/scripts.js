require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/GeoJSONLayer",
    "esri/layers/MapImageLayer",
    "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.js",
    "esri/widgets/Search",
    "esri/widgets/LayerList",
    "dojo/query",
    "esri/core/watchUtils",
    "dojo/dom-style",
    "esri/layers/FeatureLayer"
], function (esriConfig, Map, MapView, GeoJSONLayer, MapImageLayer, Chart, Search, LayerList, query, watchUtils, domStyle, FeatureLayer) {

    let myModal = new bootstrap.Modal(document.getElementById('infoModal'))
    myModal.show();

    document.addEventListener('click', function (event) {
        event.preventDefault();
        if (event.target.id == 'infoBtn') {
            myModal.show();
        }
    })

    /**
     * Global variables
     * @param  {string} apiKey ESRI JS API Key
     * @param  {object} chart null chart object for pupup
     */
    esriConfig.apiKey = "AAPK7904510d607c4e4f9241d3e83e475407rO4sFOn7xIuQFVlYlCwtmmAlpZJ5SIZlJ25wv7-fN0XJ_P49qXGVqjvrLCQexKDq";
    let chart;

    /**
     * Create Map
     */
    function createMap() {
        try {

            /**
             * create symbology object for parcels and metro boundary
             */
            const renderer = {
                type: "simple", // autocasts as new SimpleRenderer()
                symbol: {
                    type: "simple-fill",
                    color: [51, 51, 204, 0.8],
                    outline: {
                        color: [0, 0, 0],
                        width: 2
                    },
                    style: "none"
                }
            };

            /**
             * create symbology object for parcels and metro boundary
             */
            const rendererOutline = {
                type: "simple", // autocasts as new SimpleRenderer()
                symbol: {
                    type: "simple-fill",
                    color: [51, 51, 204, 0.8],
                    outline: {
                        color: [255, 255, 255],
                        width: 4
                    },
                    style: "none"
                }
            };

            /**
             * create symbology object for turf polygons
             */
            const turfRenderer = {
                type: "simple", // autocasts as new SimpleRenderer()
                symbol: {
                    type: "simple-fill",
                    color: [11, 156, 49, 0.6], // orange, opacity 80%
                    outline: {
                        color: [255, 255, 255],
                        width: 1
                    }
                }
            };

            /**
             * create symbology object for turf polygons
             */
            const nativeRenderer = {
                type: "simple", // autocasts as new SimpleRenderer()
                symbol: {
                    type: "simple-fill",
                    color: [255, 255, 115, 0.6], // orange, opacity 80%
                    outline: {
                        color: [255, 255, 255],
                        width: 1
                    }
                }
            };

            /**
             * create symbology object for turf polygons
             */
            const plantingRenderer = {
                type: "simple", // autocasts as new SimpleRenderer()
                symbol: {
                    type: "simple-fill",
                    color: [168, 112, 0, 0.6], // orange, opacity 80%
                    outline: {
                        color: [255, 255, 255],
                        width: 1
                    }
                }
            };

            /**
             * create popup template object for parcels
             * Content is created with setContentInfo function
             */
            const template2 = {
                title: "<div class ='textLeft'><h2><b>Vegetation Info</b></h2><br><p><b>Address:</b> {address}</p><p><b>Turf Area: </b><span class = 'turf'>{turf_area} sqft.</span></p><p><b>Planting Bed Area: </b><span class = 'planting'>{planting} sqft.</span></p><p><b>Native Grass Area: </b><span class = 'native'>{native} sqft.</span></p></div>",
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
                }, {
                    fieldName: 'planting',
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                }, {
                    fieldName: 'native',
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                }],
                content: setContentInfo,
            };

            /**
             * create metro boundary object from ESRI GeoJSONLayer function
             * references renderer object
             */
            const metroBndy = new GeoJSONLayer({
                url: "notebooks/data/castle_pines_metro_bndy.json",
                spatialReference: {
                    wkid: 4326
                },
                title: "Metro Boundary",
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

            /**
             * create metro boundary object from ESRI GeoJSONLayer function
             * references renderer object
             */
            const metroBndyOutline = new GeoJSONLayer({
                url: "notebooks/data/castle_pines_metro_bndy.json",
                spatialReference: {
                    wkid: 4326
                },
                title: "Metro Boundary Outline",
                //popupTemplate: template,
                renderer: rendererOutline,
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

            /**
             * create pacel boundary object from ESRI GeoJSONLayer function
             * references renderer object and popup template
             */
            const parcelBndy = new GeoJSONLayer({
                url: "notebooks/data/parcels_with_turf_area2.json",
                title: "Parcel Boundaries",
                spatialReference: {
                    wkid: 4326
                },
                popupTemplate: template2,
                minScale: 10000,
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
                }, {
                    name: "planting",
                    alias: "Planting Bed Area",
                    type: "double"
                }, {
                    name: "native",
                    alias: "Native Grass Area",
                    type: "double"
                }]
            });

            /**
             * create turf boundary object from ESRI GeoJSONLayer function
             * references turfRenderer object
             */
            // const turf = new GeoJSONLayer({
            //     url: "notebooks/data/turf_polygons_edited.json",
            //     title: "Turf",
            //     spatialReference: {
            //         wkid: 2232
            //     },
            //     minScale: 6000,
            //     renderer: turfRenderer,

            // });


            const turf = new FeatureLayer({
                // URL to the service
                url: "https://gis.aztecconsultants.com/server/rest/services/Castle_Pines_Metro_District/FeatureServer/1",
                title: "Turf",
                // spatialReference: {
                //     wkid: 2232
                // },
                minScale: 6000,
                renderer: turfRenderer
            });

            /**
             * create native boundary object from ESRI GeoJSONLayer function
             * references turfRenderer object
             */
            const native = new FeatureLayer({
                url: "https://gis.aztecconsultants.com/server/rest/services/Castle_Pines_Metro_District/FeatureServer/4",
                title: "Native Grass",
                // spatialReference: {
                //     wkid: 2232
                // },
                minScale: 6000,
                renderer: nativeRenderer,

            });

            /**
             * create native boundary object from ESRI GeoJSONLayer function
             * references turfRenderer object
             */
            const planting = new FeatureLayer({
                url: "https://gis.aztecconsultants.com/server/rest/services/Castle_Pines_Metro_District/FeatureServer/2",
                title: "Planting Beds",
                // spatialReference: {
                //     wkid: 2232
                // },
                minScale: 6000,
                renderer: plantingRenderer,

            });


            /**
             * create imagery object from ESRI MapImageLayer function
             * set min scale so it is only displayed at certain zoom levels
             */
            // let drcog_imagery = new MapImageLayer({
            //     url: "https://gis.aztecconsultants.com/server/rest/services/GIS/Castle_Pines_DRCOG_Imagery/MapServer",
            //     minScale: 4000
            // });

            /**
             * create map object from ESRI Map function
             */
            const map = new Map({
                basemap: "hybrid",
                layers: [turf, native, planting, metroBndyOutline, metroBndy, parcelBndy]
            });

            /**
             * create map view object from ESRI MapView function
             */
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


            fetch('https://api.weatherapi.com/v1/forecast.json?key=a51b53b71dc342749e500143210605&q=Castle Pines&days=1&aqi=no&alerts=no')
                // .then(response => response.json())
                // .then(data => console.log(data));
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                }).then((responseJson) => {
                    //   console.log(responseJson)
                    //Populate Div
                    let image = document.getElementById('image').src = responseJson.current.condition.icon;
                    let condition = document.getElementById('condition').innerHTML = responseJson.current.condition.text;
                    let chanceOfRain = document.getElementById('chanceOfRain').innerHTML = 'Chance of Rain: ' + responseJson.forecast.forecastday[0].day.daily_chance_of_rain + '%';
                    let totalPrecip = document.getElementById('precip').innerHTML = 'Total Precipitation: ' + responseJson.forecast.forecastday[0].day.totalprecip_in + ' in.';
                    let wind = document.getElementById('wind').innerHTML = 'Wind: ' + responseJson.current.wind_mph + ' mph';
                    let humidity = document.getElementById('humidity').innerHTML = 'Humidity: ' + responseJson.current.humidity + '%';
                    let temp = document.getElementById('temp').innerHTML = 'Temperature: ' + responseJson.current.temp_f + ' F';
                })
                .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                });


            view.ui.add(weatherDiv, "bottom-left");

            /**
             * create search object from ESRI Search function
             * references parcelBndy object to search for addresses instead of a geocoder.
             * container is outside of map located in navbar
             */
            const searchWidget = new Search({
                view: view,
                container: "searchWidget",
                sources: [{
                    layer: parcelBndy,
                    searchFields: ["address"],
                    displayField: "address",
                    exactMatch: false,
                    outFields: ["address", "area", "turf_area", "planting"],
                    name: "Addresses",
                    placeholder: "Search By Address"
                }],
                includeDefaultSources: false
            });

            metroBndy.when(function () {
                view.goTo(metroBndy.fullExtent);
            });

            let basemapDropdown = document.querySelectorAll('.basemap');

            basemapDropdown.forEach(el => el.addEventListener('click', event => {
                if (event.target.tagName == 'IMG') {
                    console.log('clicked image, bubble up to a tag');
                    let id = event.target.parentNode.id;
                    changeBasemap(id, view);
                } else {
                    let id = event.target.id;
                    changeBasemap(id, view);
                }


            }))

            // Sets the location of the popup to the center of the view
            view.popup.location = view.center;

            /**
             * create layerList object using ESRI LayerList function
             */
            const layerList = new LayerList({
                view: view,
                listItemCreatedFunction: function (event) {
                    defineActions(event)
                    const item = event.item;
                    if (item.layer.type != "group") {
                        // don't show legend twice
                        item.panel = {
                            content: "legend",
                            open: true
                        };
                    }

                }
            });



            view.ui.add(layerList, "top-right");
            //workaround for making sure layerlist is ready
            watchUtils.when(layerList, 'operationalItems.length', function () {
                let lis = query('li[aria-labelledby $= "__title"]', layerList.domNode);
                lis.map(function (li) {
                    if (li.innerText.match(/Metro Boundary Outline.*/)) {
                        domStyle.set(li, "display", "none");
                    }
                });
            });

            var uniqueParentItems = [];

            function defineActions(event) {
                var item = event.item;
                if (!item.parent) {
                    //only add the item if it has not been added before
                    if (!uniqueParentItems.includes(item.title)) {
                        uniqueParentItems.push(item.title);
                        if (item.title == 'Metro Boundary') {
                            item.watch("visible", function (event) {
                                metroBndyOutline.visible = event;
                            });
                        }

                    }
                }
            }



            /**
             * watch handler with callback that fires each time view scale changes
             * @param  {int} newScale map view scale value based on zoom actions
             */
            const handle = view.watch('scale', function (newScale) {
                //console.log("Scale: ", newScale);
                if (newScale > 10000) {
                    parcelBndy.listMode = 'hide';
                } else {
                    parcelBndy.listMode = 'show';
                }

                if (newScale > 6000) {
                    turf.listMode = 'hide';
                    planting.listMode = 'hide';
                    native.listMode = 'hide';
                    // drcog_imagery.listMode = 'hide';
                } else {
                    turf.listMode = 'show';
                    planting.listMode = 'show';
                    native.listMode = 'show';
                    // drcog_imagery.listMode = 'show';
                }

            });

        } catch (error) {
            console.log(error)
        }

    }


    /**
     * Create content html for parcel popup.  
     * @param  {object} results object of data returned from esri js api feature layer generated from the parcel geojson.
     * @return {html} graphDiv html of graph content and slider     
     */
    // Using the data from the feature layer, create a doughnut graph.
    function setContentInfo(results) {
        try {
            //extract attributes and assign to variable.
            let area = results.graphic.attributes.turf_area
            let plantingArea = results.graphic.attributes.planting
            let parcelArea = results.graphic.attributes.area

            //Create graph object
            let graph = createGraph(area, plantingArea)

            //Create graph html
            let graphDiv = document.createElement('div');
            graphDiv.id = 'graphDiv';

            //Create html label for slider
            let label = document.createElement('label');
            label.htmlFor = 'editSlider';
            label.innerHTML = 'Adjust Turf Area';
            label.className = 'form-label';
            label.className = 'bold';

            //Create html label for slider2
            let label2 = document.createElement('label');
            label2.htmlFor = 'editSlider';
            label2.innerHTML = 'Adjust Planting Bed Area';
            label2.className = 'form-label';
            label2.className = 'bold';

            //Create html for slider
            let slider = document.createElement('input');
            slider.id = 'editSlider';
            slider.type = 'range';
            slider.min = '0';
            slider.max = parcelArea;
            slider.value = area;
            slider.className = 'slider, form-range';

            //Create html for slider
            let sliderPlant = document.createElement('input');
            sliderPlant.id = 'editSlider2';
            sliderPlant.type = 'range';
            sliderPlant.min = '0';
            sliderPlant.max = parcelArea;
            sliderPlant.value = plantingArea;
            sliderPlant.className = 'slider, form-range';

            //append label to graph div
            graphDiv.appendChild(label);

            //append slider to graph div
            graphDiv.appendChild(slider);

            //append label to graph div
            graphDiv.appendChild(label2);

            //append slider to graph div
            graphDiv.appendChild(sliderPlant);

            //append graphy to graph div
            graphDiv.appendChild(graph);


            /**
             * on slider input change run function to get value of slider and call updateChart function
             */
            slider.oninput = function () {
                let output = document.querySelector('.turf')
                output.innerHTML = numberWithCommas(this.value) + ' sqft.';
                //update chart
                let area = this.value
                let plantingArea = document.querySelector('#editSlider2').value;
                //removeData(graph)
                console.log(plantingArea)
                updateChart(area, plantingArea)
            }

            /**
             * on slider input change run function to get value of slider and call updateChart function
             */
            sliderPlant.oninput = function () {
                let output = document.querySelector('.planting')
                output.innerHTML = numberWithCommas(this.value) + ' sqft.';
                //update chart
                let plantingArea = this.value
                let area = document.querySelector('#editSlider').value;
                //removeData(graph)
                //console.log(area)
                updateChart(area, plantingArea)
            }

            return graphDiv;
        } catch (error) {
            console.log(error)
        }

    }

    /**
     * add commas to numbers to make them more readable
     * @param  {int} x number to add commas to
     * @return {string}      string of integer with commas
     */
    function numberWithCommas(x) {
        try {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } catch (error) {
            console.log(error)
        }

    }

    /**
     * create object of water budget values per month
     * @param  {float} area area of turf from parcel polygons or slider update value
     * @return {object} budget object of months with budget values
     */
    function getWaterBudget(area, plantingArea) {
        try {

            let budget = {};
            area = Number(area);
            plantingArea = Number(plantingArea);

            budget.april = Math.round(((area * 1) + (plantingArea * 0.4)), 2);
            budget.may = Math.round(((area * 2.5) + (plantingArea * 1.01)), 2);
            budget.june = Math.round(((area * 5) + (plantingArea * 2.02)), 2);
            budget.july = Math.round(((area * 5.3) + (plantingArea * 2.14)), 2);
            budget.august = Math.round(((area * 2.5) + (plantingArea * 1.01)), 2);
            budget.september = Math.round(((area * 1) + (plantingArea * 0.4)), 2);

            return budget;
        } catch (error) {
            console.log(error)
        }


    }

    /**
     * Update bar chart with new values
     * @param  {float} area area of turf from slider update value
     */
    function updateChart(area, plantingArea) {
        try {
            let budgetData = getWaterBudget(area, plantingArea);

            chart.data.datasets[0].data[3] = budgetData.april;
            chart.data.datasets[0].data[4] = budgetData.may;
            chart.data.datasets[0].data[5] = budgetData.june;
            chart.data.datasets[0].data[6] = budgetData.july;
            chart.data.datasets[0].data[7] = budgetData.august;
            chart.data.datasets[0].data[8] = budgetData.september;

            chart.update();
        } catch (error) {
            console.log(error)
        }


    }

    /**
     * create bar chart
     * @param  {float} area area from parcel polygon
     * @return {html} canvas html object of graphy in canvas tag
     */
    function createGraph(area, plantingArea) {
        try {
            // Create a new canvas element, this is where the graph will be placed.
            let canvas = document.createElement('canvas');
            canvas.id = "myChart";

            let budgetData = getWaterBudget(area, plantingArea);


            // Create a data object, this will include the data from the feature layer and other information like color or labels.
            let data = {
                datasets: [{
                    label: "Gallons",
                    data: [0, 0, 0, budgetData.april, budgetData.may, budgetData.june, budgetData.july, budgetData.august, budgetData.september, 0, 0, 0],
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
                                return tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'Gal.';
                            },
                        },
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                callback: function (value, index, values) {
                                    if (parseInt(value) >= 1000) {
                                        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' Gal.';
                                    } else {
                                        return value + ' Gal.';
                                    }
                                }
                            }
                        }]
                    }
                }
            });

            return canvas;
        } catch (error) {
            console.log(error)
        }

    }

    /**
     * Change the basemap in the view object
     * @param  {string} id name of esri basemap
     * @param  {object} view esri map object
     */
    function changeBasemap(id, view) {
        try {
            view.map.basemap = id;
        } catch (error) {
            console.log(error)
        }

    }

    createMap()


})