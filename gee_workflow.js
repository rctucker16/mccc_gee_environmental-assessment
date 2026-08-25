/** 
 * MCCC Soil & Water Health Index (2026)
 * Area: Blue Bell Campus
 */
 
 var campus = ee.Geometry.Point([-75.276, 40.180]);
 Map.centerObject(campus, 16);
 
 var dataset = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(campus)
  .filterDate('2026-01-01', '2026-12-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
  .median();
   
// 7. Advanced Water Analysis: MNDWI
// Formula: (Green - SWIR1) / (Green + SWIR1)
var mndwi = dataset.normalizedDifference(['B3', 'B11']).rename('MNDWI');

// 8. Water Quality/Level Proxy (Turbidity/Sediment)
// Higher values in water bodies suggest shallower/murkier water
var turbidity = dataset.select('B4').divide(dataset.select('B3')).rename('Turbidity');

// 9. Update Visualization for Advanced Water
var mndwiVis = {min: -1, max: 0.5, palette: ['white', 'cyan', 'darkblue']};
var turbVis = {min: 0.5, max: 1.5, palette: ['blue', 'yellow', 'orange']};

// 10. Add these layers to the Map
Map.addLayer(mndwi, mndwiVis, 'Refined Water Levels (MNDWI)');
Map.addLayer(turbidity.updateMask(mndwi.gt(0)), turbVis, 'Water Murkiness/Depth Proxy');
  
  var savi = dataset.expression(
    '((NIR - RED) / (NIR + RED + L)) * (1 + L)', {
      'NIR': dataset.select('B8'),   
      'RED': dataset.select('B4'),   
      'MIR': dataset.select('B11'),  
      'L': 0.5                       
    }).rename('SAVI');
    
  var waterVis = {min: -1, max: 0.5, palette: ['white', 'blue']};
  var soilVis = {min: 0, max: 0.8, palette: ['brown', 'yellow', 'green']};
  
  

  Map.addLayer(savi, soilVis, 'Soil Health (SAVI)');
  Map.addLayer(dataset, {bands: ['B4', 'B3', 'B2'], min: 0, max: 3000}, 'True Color');
   
  var legend = ui.Panel({
  style: {
    position: 'bottom-right',
    padding: '8px 15px'
  }
});

// 2. Create a Legend Title
var legendTitle = ui.Label({
  value: 'MCCC Soil & Water Health Index (2026)',
  style: {
    fontWeight: 'bold',
    fontSize: '16px',
    margin: '0 0 4px 0',
    padding: '0'
  }
});
legend.add(legendTitle);

// 3. Define the Legend Rows (Colors and Labels)
var makeRow = function(color, name) {
  var colorBox = ui.Label({
    style: {
      backgroundColor: color,
      padding: '8px',
      margin: '0 8px 4px 0'
    }
  });
  var description = ui.Label({
    value: name,
    style: {margin: '0 0 4px 0'}
  });
  return ui.Panel({
    widgets: [colorBox, description],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
};

legend.add(ui.Label('Advanced Water Detail', {fontWeight: 'bold', margin: '8px 0 4px 0'}));
legend.add(makeRow('cyan', 'Shallow/Saturated Soil'));
legend.add(makeRow('darkblue', 'Deep/Clear Water'));
legend.add(makeRow('orange', 'High Sediment/Potential Low Level'));

legend.add(ui.Label('Soil & Vegetation Index (SAVI)', {fontWeight: 'bold', margin: '12px 0 4px 0'}));
legend.add(makeRow('#8b0000', 'Stressed / Impervious / High Impact Zone (SAVI < 0.20)')); 
legend.add(makeRow('#ff4500', 'Moderate Stress / Parking Periphery (SAVI 0.20 - 0.35)')); 
legend.add(makeRow('#ffff00', 'Transition Zone / Managed Turf (SAVI 0.35 - 0.55)'));       
legend.add(makeRow('#90ee90', 'Moderate Vegetation / Riparian Canopy (SAVI 0.55 - 0.70)'));  
legend.add(makeRow('#006400', 'High-Vigor Canopy / Woodland Buffer (SAVI > 0.70)'));

// 6. Add the legend to the map
Map.add(legend);
   
var exportRegion = campus.buffer(1000).bounds();
