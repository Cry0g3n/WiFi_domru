const csv = require('csvtojson');
const fs = require('fs');
const MultiGeocoder = require('multi-geocoder');

const geocoder = new MultiGeocoder({provider: 'yandex-cache', coordorder: 'latlong'});
const provider = geocoder.getProvider();

provider.getText = function (point) {
    return point.address;
};

fs.readFile('data/stat.csv', 'utf8', function (err, contents) {
    const csvStr = contents;
    const csvParams = {
        noheader: true,
        delimiter: ';',
        headers: ['address', 'name', 'connection_count']
    };

    csv(csvParams)
        .fromString(csvStr)
        .on('end_parsed', (statObjList) => {
            statObjList.shift();
            const geoRequest = [];

            for (let obj of statObjList) {
                geoRequest.push({
                    address: obj['address']
                });
            }

            geocoder.geocode(geoRequest)
                .then(function (res) {
                    // console.log(res);

                    const result = res['result'];
                    const features = result['features']
                    const coords = [];

                    for (let feature of features) {
                        const geometry = feature['geometry'];
                        const coordinates = geometry['coordinates'];
                        coords.push({
                            latitude: coordinates[0],
                            longitude: coordinates[1]
                        })
                    }

                    const jsonCoords = JSON.stringify(coords);
                    fs.writeFile("data/coords.json", jsonCoords, function(err) {
                        if(err) {
                            return console.log(err);
                        }

                        console.log("The file was saved!");
                    });
                });
        });
});