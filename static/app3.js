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

    const _getPlaylistByGenre = async (token, genreId) => {

        const limit = 10;
        
        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.playlists.items;
    }


    const _getTracks = async (token, tracksEndPoint) => {

        const limit = 10;

        const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.items;
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
        getPlaylistByGenre(token, genreId) {
            return _getPlaylistByGenre(token, genreId);
        },
        getTracks(token, trackEndPoint) {
            return _getTracks(token, trackEndPoint);
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
        Genre: 'genreId',
        buttonSubmit: 'btn_submit',
        Submit2: 'btn_submit2',
        divSongDetail: 'song-detail',
        selectPlaylist: 'select_playlist',
        hfToken: 'hidden_token',
        divSonglist: '.song-list'
    }

    //public methods
    return {

        //method to get input fields
        inputField() {
            return {
                genreid: document.getElementById(DOMElements.Genre),
                playlist: document.getElementById(DOMElements.selectPlaylist),
                tracks: document.querySelector(DOMElements.divSonglist),
                submit: document.getElementById(DOMElements.buttonSubmit),
                submit2: document.getElementById(DOMElements.Submit2),
                songDetail: document.getElementById(DOMElements.divSongDetail),
            }
        },

        createPlaylist(text, value, id) {
            const html = `<option value="${value}" id="${id}">${text}</option>`;
            document.getElementById(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html);
        },
        createTrack(id, name) {
            const html = `<a href="${id}" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name}</a>`;
            document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
        },

        resetPlaylist() {
            this.inputField().playlist.innerHTML = '';
            this.resetTracks();
        },
        resetTracks() {
            this.inputField().tracks.innerHTML = '';
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
        const genreID = DOMInputs.genreid.textContent;
        // console.log(genreID)
        const playlist = await APICtrl.getPlaylistByGenre(token, genreID);
        // console.log(playlist[0])
        playlist.forEach(p => UICtrl.createPlaylist(p.name, p.tracks.href, p.uri));
    });
    
    DOMInputs.submit2.addEventListener('click', async (e) => {
        e.preventDefault();
        UICtrl.resetTracks();
        const token = UICtrl.getStoredToken().token;
        const playlistSelect = UICtrl.inputField().playlist;
        const playlistLink = playlistSelect.options[playlistSelect.selectedIndex].id
        // get track endpoint based on the selected playlist
        const tracksEndPoint = playlistSelect.options[playlistSelect.selectedIndex].value;
        // get the list of tracks
        const tracks = await APICtrl.getTracks(token, tracksEndPoint);
        // create a track list item
        const html = `<a href="${playlistLink}" class="list-group-item list-group-item-action list-group-item-light" >To Playlist</a>`;
        document.querySelector(".song-list").insertAdjacentHTML('beforeend', html);
        tracks.forEach(el => UICtrl.createTrack(el.track.uri, el.track.name))

    });    

    return {
        init() {
            console.log('App is starting');
            loadToken();
            console.log("nothing")
        }
    }

})(UIController, APIController);

APPController.init();