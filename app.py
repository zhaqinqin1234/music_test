from flask import Flask, render_template, request,redirect
import ML

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
# @app.route("/find",methods=['GET','POST'])
# def find_spotify():
#     title = request.form["title"]
#     if len(title) > 0:
#         track_detail = Spotify.find_track(title)
#         return ML_feature(track_detail)
        
#     else:
#         return index(default_track_data)



if __name__ == '__main__':
    app.run(debug=True)