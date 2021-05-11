class DataService {
    static async getSearchGifs(request) {
        try {
            const response = await fetch('https://api.giphy.com/v1/gifs/search?' + new URLSearchParams({
                api_key: 'y0keFsZgPljRFCYa0UDbgJIwOSBJjwRc',
                q: `${request}`,
            }));
            return await response.json();
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    static async getTrendingGifs() {
        try {
            const response = await fetch('https://api.giphy.com/v1/gifs/trending?' + new URLSearchParams({
                api_key: '1pWkGdmSXllJ3H0uPzdtJb5qfoC1vsfe',
            }));
            return await response.json();
        } catch (e) {
            console.log(e);
            return [];
        }
    }
}

class GifRenderer {
    constructor(root) {
        this.root = root;
    }

    renderGifs(gifs) {
        this.root.innerHTML = gifs
            .map(this._gifToHTML)
            .join('');
    }

    _gifToHTML(gif) {
        return `
            <div class="gif">
                <div class="image-container">
                    <img class="gif-image" src = '${gif.images.downsized.url}'>
                </div>
                <div class="rating">
                    <p class="gif-rating">
                        Rating: ${gif.rating}
                    </p>
                </div>
            </div> 
        `;
    }
}

async function trendingData() {
    const gifs = await DataService.getTrendingGifs();
    const gifsRoot = document.querySelector('.gifs');
    const renderer = new GifRenderer(gifsRoot);
    renderer.renderGifs(gifs.data);
}

async function searchData(query) {
    const gifs = await DataService.getSearchGifs(query);
    const gifsRoot = document.querySelector('.gifs');
    const renderer = new GifRenderer(gifsRoot);
    renderer.renderGifs(gifs.data);
}

class ContentRenderer {
    constructor(root) {
        this.root = root;
    }

    renderContents(contents) {
        this.root.innerHTML = contents
            .map(this._gifToHTML)
            .join('');
    }

    _gifToHTML(content) {
        return `
            <div class="content-wrapper">
                <p class="content">
                    ${content}
                </p>
            </div>
        `;
    }
}

function displayContents(contents) {
    contentRoot = document.querySelector('.searched-content');
    const render = new ContentRenderer(contentRoot);
    render.renderContents(contents);

    document
        .querySelectorAll('.content').forEach(content => {
            content.addEventListener('click', () => {
                displayContentGifs(content.innerText);
            });
        })
}

async function displayContentGifs(query) {
    const gifs = await DataService.getSearchGifs(query);
    const gifsRoot = document.querySelector('.gifs');
    const renderer = new GifRenderer(gifsRoot);
    renderer.renderGifs(gifs.data);
}

async function main() {
    var contents = ["Internet Cats", "Meme's", "Typing", "Space", "Rick and Morty"];
    displayContents(contents);

    document
        .getElementById('filter-form')
        .addEventListener('submit', (event) => {
            event.preventDefault();
            const query = document
                .getElementById('input')
                .value;
            if (query !== "") {
                searchData(query);
            } 
            if (query !== "" && !contents.includes(query)) {
                contents.shift();
                contents.push(query);
                displayContents(contents);  
            }
        })

    document
        .getElementById('trending__button')
        .addEventListener('click', trendingData);
}

window.addEventListener('load', main);