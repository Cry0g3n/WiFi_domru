import codecs
import json
from math import sqrt

import tornado.ioloop
import tornado.web
from sklearn.ensemble import RandomForestRegressor, ExtraTreesRegressor
from sklearn.externals import joblib
from sklearn.svm import SVR

regressor = 'et'


def get_distance(p0, p1):
    return sqrt((p0[0] - p1[0]) ** 2 + (p0[1] - p1[1]) ** 2)


def get_feature_vector(point):
    f_vector = []

    for center in centers:
        f_vector.append(get_distance(point, center))

    return f_vector


fileObj = codecs.open('../data/organizations_labeled.json', "r", "utf_8_sig")
organizations_labeled = json.loads(fileObj.read())
fileObj.close()

fileObj = codecs.open('../data/connections.json', "r", "utf_8_sig")
connections = json.loads(fileObj.read())
fileObj.close()

features = []
labels = []

centers = organizations_labeled['centers']
for connection in connections:
    point = connection['point']
    feature_vector = get_feature_vector(point)
    features.append(feature_vector)
    labels.append(int(connection['connection_count']))

regr = None

if regressor == 'rf':
    regr = RandomForestRegressor(n_estimators=25, n_jobs=-1)
elif regressor == 'et':
    regr = ExtraTreesRegressor(n_estimators=25, n_jobs=-1)
elif regressor == 'sv':
    regr = SVR()

regr.fit(features, labels)
joblib.dump(regr, 'regr.pkl')


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "*")
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        lat = self.get_argument('lat', 'No data received')
        lon = self.get_argument('lon', 'No data received')

        test_features = []
        test_points = [[float(lat), float(lon)]]

        for point in test_points:
            test_features.append(get_feature_vector(point))

        result = regr.predict(test_features)[0]
        self.write('Возможное число подключений:' + str(int(result)))


def make_app():
    return tornado.web.Application([
        (r"/submit", MainHandler),
    ])


if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    tornado.ioloop.IOLoop.current().start()
