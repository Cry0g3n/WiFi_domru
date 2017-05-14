import json

import numpy as np
from sklearn.cluster import MeanShift

with open('../data/coords.json') as data_file:
    data = json.load(data_file)

X = []
for coord in data:
    X.append([coord['latitude'], coord['longitude']])

ms = MeanShift()
ms.fit(X)
labels = ms.labels_

sample_count = len(X)
coords_labeled = []
for i in range(0, sample_count):
    latitude = X[i][0]
    longitude = X[i][1]
    label = labels[i]
    coords_labeled.append({
        'latitude': latitude,
        'longitude': longitude,
        'label': str(label)
    })

with open('../data/coords_labeled.json', 'w') as outfile:
    json.dump(coords_labeled, outfile)

labels_unique = np.unique(labels)
n_clusters_ = len(labels_unique)

print("number of estimated clusters : %d" % n_clusters_)
