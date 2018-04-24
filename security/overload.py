import requests

for x in range(10000000):
	payload = {'username': x, 'lat': 10, 'lng':10};
	r = requests.post("http://serene-ocean-41337.herokuapp.com/rides", data=payload);

