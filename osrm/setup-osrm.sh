#!/bin/bash

wget https://download.geofabrik.de/asia/south-korea-latest.osm.pbf

docker run -t -v "${PWD}:/data" osrm/osrm-backend osrm-extract -p /opt/car.lua /data/south-korea-latest.osm.pbf
docker run -t -v "${PWD}:/data" osrm/osrm-backend osrm-partition /data/south-korea-latest.osrm
docker run -t -v "${PWD}:/data" osrm/osrm-backend osrm-customize /data/south-korea-latest.osrm
