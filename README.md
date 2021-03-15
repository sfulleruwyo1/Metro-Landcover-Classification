# Metro Landcover Classification
## A Case Study of Castle Pines Metro District

## I. Introduction
The Denver Metro Area is slowly inching towards a water crisis.  Years of drought and overuse of water have led many municipalities and water districts scrambling to find ways to alleviate water usage beyond tiered pricing structures.  The obvious first choice is to educate homeowners and assist them in creating water budgets for landscape irrigation.  Areas of native grasses need significantly less water than turf, yet many homeowners are wasting thousands of gallons a year watering native grass for aesthetic purposes or out of ignorance.  To educate homeowners and create water budgets vegetation classification is needed, but many municipalities/metro districts do not have the finances, or manpower to survey properties accurately and need a semi-automated approach.  

Utilizing Object Based Imagery Analysis to automate classification of large areas by vegetation type this web map will provide an example to Homeowners Associations, Metropolitan Water Districts and local Municipalities on what tools and resources can be provided to homeowners to better manage their vegetation irrigation.  Homeowners will be able to view the square footage of turf on their lot, and look at recommended water calculations provided by the Colorado State Agriculture Outreach department applied to their property.  

## II. Methodolgy
Data utilized for this project was collected from the Douglas County GIS Open Data Portal and the Denver Regional Council of Governments Aerial Immagery Collection.  In addition small areas of drone imagery were collected by Aztec Consultants GIS department.  Python 3, QGIS, and ESRI Arc Pro were utilized to process and examine all datasets.

## A. Data
To complete this analysis high resolution imagery is needed in the Red, Green, Blue band wavelengths.  The Denver Regional Council of Governments does provide imagery for the metro district but it is 2 years old, and a resolution of 6 inches per pixel.  Higher resolution imagery can be acquired with small remote unmanned aerial systems but is time consuming and requires a significant amount of processing through proprietary software.  For testing and code purposes I will start with DRCOG imagery while drone imagery is acquired.  

### Data Sources
[DRCOG Aerial Imagery](https://data.drcog.org/dataset/denver-regional-aerial-photography-project-tiles-2016)
[Douglas County Parcels](https://gis-dougco.opendata.arcgis.com/datasets/parcels-w-accounts)

### Data Analysis
All data was processed within a Jupyter Notebook utilizing code initially written by [Konrad Hafen](https://opensourceoptions.com/blog/python-geographic-object-based-image-analysis-geobia-part-2-image-classification/).  This code generates a Geographic Object-Based Image Analysis to delineate vegetation classification utilizing the Random Forest Classifier Machine Learning Algorithm.  The initial training datasets were constructed as shapefiles in QGIS and ESRI Arc Pro using manual classification from direct observation of each imagery tile.  

Once the vegetation is classified into a raster, it is then converted to a vector and processed against parcel boundaries provided by the county to generate a clean dataset of square footage of turf per parcel.

![Clean Data](http://clean_data.png)

The clean data format will be a GeoJSON file of all parcels.  All imagery tiles will be hosted on an ESRI Portal Server hosted privately.

## B. Medium for delivery
The final map will be a web browser based application that is also resoponsive for desktop and mobile devices.  All data is hosted on Github and imagery is hosted privately on a seperate server.

The technology stack for this web application is based on HTML 5.0, CSS 3.0, [ESRI JS API 4.18](https://developers.arcgis.com/javascript/latest/), and [Bootstrap 5.0](https://getbootstrap.com/docs/5.0/getting-started/introduction/) for styling and mobile responsive frameworks.    

## C. Application layout
Here you'll want to consider the general layout of the web page and how it will "respond" to different device sizes. It's probably easiest to include 2 or three very simple wireframes showing mobile, tablet, and desktop layouts (not detailed mockups).

Also see: https://gistbok.ucgis.org/bok-topics/mobile-maps-and-responsive-design (Links to an external site.)

D. Thematic representation
Describe how the data will be visually represented (points, lines, polygons) and what thematic technique you will employ (icons or proportional symbols for points, classified choropleth for polygons).

You may also want to indicate what visual variables you will use to encode your information (i.e., the size of the proportional symbol to encode the amount of X, different hues to encode nominal distinctions between features).

Also see: https://gistbok.ucgis.org/bok-topics/symbolization-and-visual-variables (Links to an external site.)

E. User interaction
In this section describe how the user will engage or interact with the map. Will be a more simple scrolling interface? With the user need to pan/zoom and hover or click on features to retrieve information? Will there be additional user interaction elements for selecting, filtering, or changing the map?

Describe what the user interface will be composed of (toggle buttons, search forms, .etc) and the result. How will the UI elements affect the representation of the data or map experience?

Include additional mockups of either the entire application or specific parts of the user interface.

You may want to include an example of a user persona/scenario here if it helps describe the intent of your map design (see MAP673 modules 05/06).

Also see: https://gistbok.ucgis.org/bok-topics/user-interface-and-user-experience-uiux-design (Links to an external site.)

F. Aesthetics and design considerations
Here a full-blown mockup may be useful, but not necessary. You may also simply offer some anticipated design solutions for your map. Think about:

colors (what's the tone of the map?)
dark vs light motif
font choices
modern or flat design? something more flamboyant or artsy?
G. Conclusion
Provide a brief (one or two paragraphs) statement to conclude the proposal. This will likely be restating what you said in the introduction, but also (re)consider the format we used in the first assignment (a topic with a motivating question).
