const APIController = (function() {
    
    const clientId = '';
    const clientSecret = '';

    // private methods
    const _getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    }

    const _getSearch = async (token,title) => {
        const result = await fetch(`https://api.spotify.com/v1/search?q=${title}&type=track`, {
            method: 'Get',
            headers: {'Authorization': 'Bearer '+token}
        });
        const data = await result.json();
        return data.tracks.items;
    }


    const _getTrack = async (token, trackEndPoint) => {

        const result = await fetch(`${trackEndPoint}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data;
    }

    const _getFeature = async (token, trackFeature) => {

        const result = await fetch(`${trackFeature}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });
        const data =await result.json();
        return data;
    }

    return {
        getToken() {
            return _getToken();
        },
        getSearch(token,title){
            return _getSearch(token,title);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        },
        getFeature(token, trackFeature) {
            return _getFeature(token, trackFeature);
        }
    }
})();


// UI Module
const UIController = (function() {

    //object to hold references to html selectors
    const DOMElements = {
        inputTitle: 'input_title',
        buttonSubmit: 'btn_submit',
        Submit2: 'btn_submit2',
        divSongDetail: 'song-detail',
        selectPlaylist: 'select_playlist',
        hfToken: 'hidden_token',
        divFeatures: 'song-features'
    }

    //public methods
    return {

        //method to get input fields
        inputField() {
            return {
                title: document.getElementById(DOMElements.inputTitle),
                tracks: document.getElementById(DOMElements.divSonglist),
                playlist: document.getElementById(DOMElements.selectPlaylist),
                submit: document.getElementById(DOMElements.buttonSubmit),
                submit2: document.getElementById(DOMElements.Submit2),
                songDetail: document.getElementById(DOMElements.divSongDetail),
                songFeatures: document.getElementById(DOMElements.divFeatures)
            }
        },

        createPlaylist(text, value, artist) {
            const html = `<option value="${value}">${text} By ${artist.name}</option>`;
            document.getElementById(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html);
        },

        createTrackDetail(img, title, artist) {

            const detailDiv = document.getElementById(DOMElements.divSongDetail);
            // any time user clicks a new song, we need to clear out the song detail div
            detailDiv.innerHTML = '';

            const html = 
            `
            <div class="row col-sm-12 px-0">
                <img src="${img}" alt="">        
            </div>
            <div class="row col-sm-12 px-0">
                <label for="Genre" class="form-label col-sm-12">${title}</label>
            </div>
            <div class="row col-sm-12 px-0">
                <label for="artist" class="form-label col-sm-12">By ${artist}</label>
            </div> 
            `;

            detailDiv.insertAdjacentHTML('beforeend', html)
        },
        createTrackfeatures(features) {

            const featureDiv = document.getElementById(DOMElements.divFeatures);
            // any time user clicks a new song, we need to clear out the song detail div
            featureDiv.innerHTML = '';
            console.log(features.key);
            const html = 
            `
            <form action="/ML" method="post">
            acousticness: <input type="text" name="acousticness" value = ${features.acousticness} > 0 TO 1  <br />
            danceability: <input type="text" name="danceability" value = ${features.danceability} > 0 TO 1 <br />
            duration_ms: <input type="text" name="duration_ms" value = ${features.duration_ms} >  <br />
            energy: <input type="text" name="energy" value = ${features.energy} > 0 TO 1 <br />
            instrumentalness: <input type="text" name="instrumentalness" value = ${features.instrumentalness} > 0 TO 1 <br />
            key: <input type="text" name="key" value = ${features.key} >  <br />
            liveness: <input type="text" name="liveness" value = ${features.liveness} > 0 TO 1 <br />
            loudness: <input type="text" name="loudness" value = ${features.loudness} > -14 TO 0 <br />
            mode: <input type="text" name="mode" value = ${features.mode} > 0 OR 1 <br />
            speechiness: <input type="text" name="speechiness" value = ${features.speechiness} > 0 TO 1 <br />
            tempo: <input type="text" name="tempo" value = ${features.tempo} >  <br />
            time_signature: <input type="text" name="time_signature" value = ${features.time_signature} >  <br />
            valence: <input type="text" name="valence" value = ${features.valence} /> 0 TO 1 <br>
            <input type="submit" name= "form" value="Submit" />
        </form><hr>
            `;

            featureDiv.insertAdjacentHTML('beforeend', html)
        },

        resetTrackDetail() {
            this.inputField().songDetail.innerHTML = '';
        },

        resetPlaylist() {
            this.inputField().playlist.innerHTML = '';
            this.resetTrackDetail();
        },

        storeToken(value) {
            document.getElementById(DOMElements.hfToken).value = value;
        },

        getStoredToken() {
            return {
                token: document.getElementById(DOMElements.hfToken).value
            }
        }
    }

})();

const APPController = (function(UICtrl, APICtrl) {

    const DOMInputs = UICtrl.inputField();
    const loadToken = async() =>{
        const token = await APICtrl.getToken();
        UICtrl.storeToken(token);
    }
    DOMInputs.submit.addEventListener('click', async (e) => {
        e.preventDefault();
        UICtrl.resetPlaylist();
        const token = UICtrl.getStoredToken().token;        
        var inputTitle = DOMInputs.title.value;
        console.log(inputTitle)
        const track_list = await APICtrl.getSearch(token, inputTitle);
        track_list.forEach(p => UICtrl.createPlaylist(p.name, p.id, p.artists[0]));
    });
    
    DOMInputs.submit2.addEventListener('click', async (e) => {
        e.preventDefault();
        UICtrl.resetTrackDetail();
        const token = UICtrl.getStoredToken().token;
        const trackSelect = UICtrl.inputField().playlist;
        const track_id = trackSelect.options[trackSelect.selectedIndex].value;
        const trackEndpoint = `	https://api.spotify.com/v1/tracks/${track_id}`
        const track = await APICtrl.getTrack(token, trackEndpoint);
        UICtrl.createTrackDetail(track.album.images[2].url, track.name, track.artists[0].name);
        const trackFeature = `https://api.spotify.com/v1/audio-features/${track_id}`
        const feature = await APICtrl.getFeature(token, trackFeature);

        const Features = {
            'acousticness':feature.acousticness,
            'danceability':feature.danceability,
            'duration_ms':feature.duration_ms,
            'energy':feature.energy,
            'instrumentalness':feature.instrumentalness,
            'key':feature.key,
            'liveness':feature.liveness,
            'loudness':feature.loudness,
            'mode':feature.mode,
            'speechiness':feature.speechiness,
            'tempo':feature.tempo,
            'time_signature':feature.time_signature,
            'valence':feature.valence
        }
        console.log(Features);
        UICtrl.createTrackfeatures(Features);
        console.log("run")
    });    

    return {
        init() {
            console.log('App is starting');
            loadToken();
        }
    }

})(UIController, APIController);

APPController.init();