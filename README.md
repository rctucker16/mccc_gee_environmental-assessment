# MCCC Campus Environmental Baseline Assessment

A multi-sensor remote sensing pipeline developed in Google Earth Engine (GEE) to evaluate soil vigor, surface moisture, and turbidity across campus micro-climates.

## 📌 Project Overview
- **Data Source:** Copernicus Sentinel-2 Level-2A (`COPERNICUS/S2_SR_HARMONIZED`)
- **Indices Calculated:**
  - **SAVI:** Soil-Adjusted Vegetation Index ($L = 0.5$) for soil and canopy health
  - **MNDWI:** Modified Normalized Difference Water Index for moisture identification
  - **Turbidity Proxy:** Band ratio ($B4 / B3$) for sediment tracking

## 📁 Repository Contents
- `gee_workflow.js` - Complete Google Earth Engine JavaScript pipeline for data filtering, index calculation, and visual rendering.

## 🔬 Key Takeaways
High-impact infrastructure zones (e.g., parking peripheries) displayed marked soil stress ($\text{SAVI} < 0.20$), whereas intact woodland buffers maintained high vegetation vigor
