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

function getContent() {
    return Array.from(document.querySelectorAll('.content'));
}

async function displayContent(content) {
    const searchword = content.innerText;
    const gifs = await DataService.getSearchGifs(searchword);
    const gifsRoot = document.querySelector('.gifs');
    const renderer = new GifRenderer(gifsRoot);
    renderer.renderGifs(gifs.data);
}

async function main() {
    document
        .getElementById('filter-form')
        .addEventListener('submit', (event) => {
            event.preventDefault();
            const query = document
                .getElementById('input')
                .value;
            searchData(query);
            var search = getContent();
        })

    document
        .getElementById('trending__button')
        .addEventListener('click', trendingData);

    getContent().forEach(content => {
        content.addEventListener('click', () =>{
            displayContent(content);
        });
    })
}

window.addEventListener('load', main);