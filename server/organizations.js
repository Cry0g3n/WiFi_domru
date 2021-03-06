const csv = require('csvtojson');
const fs = require('fs');
const MultiGeocoder = require('multi-geocoder');

const geocoder = new MultiGeocoder({provider: 'yandex-cache', coordorder: 'latlong'});
const provider = geocoder.getProvider();

provider.getText = function (point) {
    return point.address;
};

fs.readFile('../data/organizations.csv', 'utf8', function (err, contents) {
    const csvStr = contents;
    const csvParams = {
        noheader: true,
        delimiter: ';',
        headers: ['name', 'address', 'recall_count']
    };

    csv(csvParams)
        .fromString(csvStr)
        .on('end_parsed', (statObjList) => {
            const geoRequest = [];

            for (let obj of statObjList) {
                geoRequest.push({
                    address: obj['address']
                });
            }

            geocoder.geocode(geoRequest)
                .then(function (res) {

                    const result = res['result'];
                    const features = result['features'];
                    const coords = [];

                    features.forEach(function (feature, i) {
                        const geometry = feature['geometry'];
                        const coordinates = geometry['coordinates'];
                        coords.push({
                            latitude: coordinates[0],
                            longitude: coordinates[1],
                            // name: statObjList[i].name,
                            recall_count: statObjList[i].recall_count
                        })
                    });

                    const jsonCoords = JSON.stringify(coords);
                    fs.writeFile("../data/organizations.json", jsonCoords, function(err) {
                        if(err) {
                            return console.log(err);
                        }

                        console.log("The file was saved!");
                    });
                });
        });
});