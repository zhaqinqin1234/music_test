# import urllib
import urllib.request
import ast
import json 

def ML_Pro(track_values):
    api_key = '1XIr7GLUUo4mY/OkCY04/wrVz99EyaDw+aCs69eWBwVuKw8wMdJT3h6FUZKt2UWDYQ9yg4Nbo6Ln4WyJegRz1Q=='
    url = 'https://ussouthcentral.services.azureml.net/workspaces/0860328401bc467ba9848b4ffdd94923/services/f7a7e34f0c7c4c2084160f25422776a3/execute?api-version=2.0&details=true'
    data =  {

            "Inputs": {

                    "input1":
                    {
                        "ColumnNames": ["id", "name", "uri", "artist", "acousticness", "danceability", "duration_ms", "energy", "instrumentalness", "key", "liveness", "loudness", "mode", "speechiness", "tempo", "time_signature", "valence", "Group", "group_n"],
                        "Values": [ track_values ]
                    },        },
                "GlobalParameters": {
    }
        }

    body = str.encode(json.dumps(data))

    # Replace this with the API key for the web service
    headers = {'Content-Type':'application/json', 'Authorization':('Bearer '+ api_key)}
    req = urllib.request.Request(url, body, headers) 
    try:
        response = urllib.request.urlopen(req)

        # If you are using Python 3+, replace urllib2 with urllib.request in the above code:
        # req = urllib.request.Request(url, body, headers) 
        # response = urllib.request.urlopen(req)

        result = response.read()
        # result = result.decode('ASCII')
        # print(result.Results.output1.ColumnNames) 
    except urllib.error.HTTPError as error:
        print("The request failed with status code: " + str(error.code))

        # Print the headers - they include the requert ID and the timestamp, which are useful for debugging the failure
        print(error.info())

        print(json.loads(error.read()))     

    decode_result = result.decode('UTF-8')
    mydata = ast.literal_eval(decode_result)
    final_result = mydata["Results"]["output1"]["value"]["Values"][0][-1]
    return final_result            