
from flask import Flask, render_template, request,redirect
import ML
import Spotify

app = Flask(__name__)
track_result = 'empty'
@app.route('/')
def index(track_result = None):
    
    return render_template('test.html',result=track_result)

@app.route("/ML",methods=['POST'])
def ML_feature(feature_dict = None):
    if feature_dict:
        acousticness = feature_dict["acousticness"]
        danceability = feature_dict["danceability"]
        duration_ms = feature_dict["duration_ms"]
        energy = feature_dict["energy"]
        instrumentalness = feature_dict["instrumentalness"]
        key = feature_dict["key"]
        liveness = feature_dict["liveness"]
        loudness = feature_dict["loudness"]
        mode = feature_dict["mode"]
        speechiness = feature_dict["speechiness"]
        tempo = feature_dict["tempo"]
        time_signature = feature_dict["time_signature"]
        valence = feature_dict["valence"]
    else:
        acousticness = request.form["acousticness"]
        danceability = request.form["danceability"]
        duration_ms = request.form["duration_ms"]
        energy = request.form["energy"]
        instrumentalness = request.form["instrumentalness"]
        key = request.form["key"]
        liveness = request.form["liveness"]
        loudness = request.form["loudness"]
        mode = request.form["mode"]
        speechiness = request.form["speechiness"]
        tempo = request.form["tempo"]
        time_signature = request.form["time_signature"]
        valence = request.form["valence"]

    feature_values = [ "value", "value", "value", "value", acousticness, danceability, duration_ms, energy, instrumentalness, key, liveness, loudness, mode, speechiness, tempo, time_signature, valence, "value", "0" ]
    track_result = ML.ML_Pro(feature_values)
    # return 'Result is %s <br/> <a href="/">Back Home</a>' % (track_result)
    return index(track_result)

@app.route("/find",methods=['POST'])
def find_spotify():
    title = request.form["title"]
    feature_dict = Spotify.find_track(title)
    return ML_feature(feature_dict)


if __name__ == '__main__':
    app.run()