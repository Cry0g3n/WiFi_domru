import codecs
import json
from math import sqrt

from sklearn.ensemble import RandomForestRegressor, ExtraTreesRegressor
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

test_features = []
test_points = [[57.62661167, 39.87677937],
               [57.62661167, 39.87677937],
               [57.68002214, 39.799272],
               [57.647885, 39.953117],
               [57.568171, 39.928102],
               [57.645195, 39.783545]]

for point in test_points:
    test_features.append(get_feature_vector(point))

result = regr.predict(test_features)
print(result)
print('end')
