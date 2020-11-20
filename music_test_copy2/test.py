
from flask import Flask, render_template, request,redirect
import ML
import Spotify

app = Flask(__name__)


@app.route('/')
def index():
    
    return render_template('pyandjs.html')

@app.route("/ML",methods=['GET','POST'])
def ML_feature():
    track_data = {"features":{}}
    track_data["features"]["acousticness"] = request.form["acousticness"]
    track_data["features"]["danceability"] = request.form["danceability"]
    track_data["features"]["duration_ms"] = request.form["duration_ms"]
    track_data["features"]["energy"] = request.form["energy"]
    track_data["features"]["instrumentalness"] = request.form["instrumentalness"]
    track_data["features"]["key"] = request.form["key"]
    track_data["features"]["liveness"] = request.form["liveness"]
    track_data["features"]["loudness"] = request.form["loudness"]
    track_data["features"]["mode"] = request.form["mode"]
    track_data["features"]["speechiness"] = request.form["speechiness"]
    track_data["features"]["tempo"] = request.form["tempo"]
    track_data["features"]["time_signature"] = request.form["time_signature"]
    track_data["features"]["valence"] = request.form["valence"]

    track_result = ML.ML_Pro(track_data["features"])
    # return 'Result is %s <br/> <a href="/">Back Home</a>' % (track_result)
    # track_data["result"] = track_result
    return result_rec(track_result)
@app.route('/result')
def result_rec(result):
    return render_template('result.html',result=result)


@app.route("/data")
def data():
    return (render_template('data.html'))

@app.route('/about')
def about():
    return (render_template('about.html'))

@app.route('/aml')
def aml():
    return (render_template('visu.html'))

@app.route('/visu')
def visu():
    return (render_template('visu2.html'))

if __name__ == '__main__':
    app.run()

# from flask import Flask, render_template, request,redirect
# import ML
# import Spotify

# app = Flask(__name__)
# default_track_data = {
#     "result" : None,
#     "features":{
#         "acousticness" : "null",
#         "danceability" : "null",
#         "duration_ms" : "null",
#         "energy" : "null",
#         "instrumentalness" : "null",
#         "key" : "null",
#         "liveness" : "null",
#         "loudness" : "null",
#         "mode" : "null",
#         "speechiness" : "null",
#         "tempo" : "null",
#         "time_signature" : "null",
#         "valence" : "null"
#     },
#     "info":None
# }

# @app.route('/')
# def index(data=default_track_data):
    
#     return render_template('test.html',track_data=data)

# @app.route("/ML",methods=['GET','POST'])
# def ML_feature(track_detail = None):
#     track_data = default_track_data
#     if track_detail:
#         track_data = track_detail

#         feature_dict = track_data["features"]
#         acousticness = feature_dict["acousticness"]
#         danceability = feature_dict["danceability"]
#         duration_ms = feature_dict["duration_ms"]
#         energy = feature_dict["energy"]
#         instrumentalness = feature_dict["instrumentalness"]
#         key = feature_dict["key"]
#         liveness = feature_dict["liveness"]
#         loudness = feature_dict["loudness"]
#         mode = feature_dict["mode"]
#         speechiness = feature_dict["speechiness"]
#         tempo = feature_dict["tempo"]
#         time_signature = feature_dict["time_signature"]
#         valence = feature_dict["valence"]
        
#     else:
#         track_data["features"]["acousticness"] = request.form["acousticness"]
#         track_data["features"]["danceability"] = request.form["danceability"]
#         track_data["features"]["duration_ms"] = request.form["duration_ms"]
#         track_data["features"]["energy"] = request.form["energy"]
#         track_data["features"]["instrumentalness"] = request.form["instrumentalness"]
#         track_data["features"]["key"] = request.form["key"]
#         track_data["features"]["liveness"] = request.form["liveness"]
#         track_data["features"]["loudness"] = request.form["loudness"]
#         track_data["features"]["mode"] = request.form["mode"]
#         track_data["features"]["speechiness"] = request.form["speechiness"]
#         track_data["features"]["tempo"] = request.form["tempo"]
#         track_data["features"]["time_signature"] = request.form["time_signature"]
#         track_data["features"]["valence"] = request.form["valence"]

#     track_result = ML.ML_Pro(track_data["features"])
#     # return 'Result is %s <br/> <a href="/">Back Home</a>' % (track_result)
#     track_data["result"] = track_result
#     return index(track_data)

# @app.route("/find",methods=['GET','POST'])
# def find_spotify():
#     title = request.form["title"]
#     if len(title) > 0:
#         track_detail = Spotify.find_track(title)
#         return ML_feature(track_detail)
        
#     else:
#         return index(default_track_data)



# if __name__ == '__main__':
#     app.run()