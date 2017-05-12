import json

import numpy as np
from sklearn.cluster import MeanShift

with open('data/coords.json') as data_file:
    data = json.load(data_file)

X = []
for coord in data:
    X.append([coord['latitude'], coord['longitude']])

ms = MeanShift()
ms.fit(X)
labels = ms.labels_
cluster_centers = ms.cluster_centers_

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

with open('data/coords_labeled.json', 'w') as outfile:
    json.dump(coords_labeled, outfile)

labels_unique = np.unique(labels)
n_clusters_ = len(labels_unique)

print("number of estimated clusters : %d" % n_clusters_)

# import matplotlib.pyplot as plt
# from itertools import cycle
#
# plt.figure(1)
# plt.clf()
#
# colors = cycle('bgrcmykbgrcmykbgrcmykbgrcmyk')
# for k, col in zip(range(n_clusters_), colors):
#     my_members = labels == k
#     cluster_center = cluster_centers[k]
#     plt.plot(X[my_members, 0], X[my_members, 1], col + '.')
#     plt.plot(cluster_center[0], cluster_center[1], 'o', markerfacecolor=col,
#              markeredgecolor='k', markersize=14)
# plt.title('Estimated number of clusters: %d' % n_clusters_)
# plt.show()
