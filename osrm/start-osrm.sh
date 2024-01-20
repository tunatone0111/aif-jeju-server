#!/bin/bash

docker run -d -p 3333:5000 -v "${PWD}:/data" osrm/osrm-backend osrm-routed --algorithm mld /data/south-korea-latest.osrm