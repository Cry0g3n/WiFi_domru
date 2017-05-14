import json

import numpy as np
from sklearn.cluster import AffinityPropagation

with open('../data/organizations.json') as data_file:
    data = json.load(data_file)

X = []
for coord in data:
    X.append([coord['latitude'], coord['longitude']])

ap = AffinityPropagation()
ap.fit(X)
labels = ap.labels_
cluster_centers_ = ap.cluster_centers_

sample_count = len(X)
coords_labeled = []

for i in range(0, sample_count):
    latitude = X[i][0]
    longitude = X[i][1]
    label = labels[i]
    coords_labeled.append({
        'point': [latitude, longitude],
        'label': str(label),
        'recall_count': data[i]['recall_count']
    })

labels_unique = np.unique(labels)
n_clusters_ = len(labels_unique)

print("number of estimated clusters : %d" % n_clusters_)

cluster_centers_ = cluster_centers_.tolist()

data = {
    'places': coords_labeled,
    'centers': cluster_centers_
}

with open('../data/organizations_labeled.json', 'w') as outfile:
    json.dump(data, outfile)
