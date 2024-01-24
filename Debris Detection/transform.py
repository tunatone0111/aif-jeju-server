import gdal
import json
import numpy as np



def getDebrisLocation():
    folder = ".\\data\\predicted_unet\\output"
    fileSuffix = "_unet.tif"
    location = []
    for i in range(81):
        ds = gdal.Open(folder + str(i) + fileSuffix)
        data = ds.GetRasterBand(1).ReadAsArray()
        for i in range(256):
            for j in range(256):
                if data[i][j] == 1:
                    location.append(getCoordinate(i, j, ds.GetGeoTransform()))
    return location
def getCoordinate(y, x, GeoTransform):
    longitude = GeoTransform[0] + x * GeoTransform[1]
    latitude = GeoTransform[3] + y * GeoTransform[5]
    return (longitude, latitude)

def calcGeoTransform(GeoTransform, location):

    posX = 256 * (location % 9)
    posY = 256 * (location // 9)
    
    offsetX = GeoTransform[0] + posX * GeoTransform[1]
    offsetY = GeoTransform[3] + posY * GeoTransform[5]
    
    return (offsetX, GeoTransform[1], GeoTransform[2], offsetY, GeoTransform[4], GeoTransform[5])

def mix(images):
    driver = gdal.GetDriverByName("GTiff")
    output = driver.Create('./mixed.tif', 2304, 2304, 11, gdal.GDT_Float32)

    ds = gdal.Open(images[0], gdal.GA_ReadOnly)
    output.SetGeoTransform(ds.GetGeoTransform())
    output.SetProjection(ds.GetProjection())
    
    for i in range(11):
        ds = gdal.Open(images[i])
        band = ds.GetRasterBand(1)
        data = band.ReadAsArray()
        output.GetRasterBand(i + 1).WriteArray(data)
    
    output.FlushCache()

def crop(image):
    driver = gdal.GetDriverByName("GTiff")

    ds = gdal.Open(image, gdal.GA_ReadOnly)
    
    data = []

    for i in range(11):
        band = ds.GetRasterBand(i + 1)
        data.append(band.ReadAsArray().reshape(9, 256, -1, 256).swapaxes(1,2).reshape(-1, 256, 256))
    for i in range(81):
        output = driver.Create('.\\output\\output' + str(i) +".tif", 256, 256, 11, gdal.GDT_Float32)
        output.SetGeoTransform(calcGeoTransform(ds.GetGeoTransform(), i))
        output.SetProjection(ds.GetProjection())
        for j in range(11):
            output.GetRasterBand(j + 1).WriteArray(data[j][i])
        output.FlushCache()
    pass


if __name__ == "__main__":
    offset = "D:\\Download\\Browser_images\\"
    images = []
    # for i in range(11):
    #     images.append(offset + str(i + 1) + ".tiff")
    data = crop(".\\mixed.tif")
    # jsonData = {}
    # jsonData['data'] = []
    # current = (0, 0)
    # removeList = []
    # for item in data:
    #     if current[0] == item[0] or current[1] == item[1]:
    #         removeList.append(item)
    #     else:
    #         current = item  
    # for item in removeList:
    #     data.remove(item)

    # for item in data:
    #     location = {}
    #     location['location'] = {}
    #     location['location']['lat'] = item[1]
    #     location['location']['lng'] = item[0]
    #     jsonData['data'].append(location)
    # with open(".\\data.json", 'w') as outputFile:
    #     json.dump(jsonData, outputFile)


