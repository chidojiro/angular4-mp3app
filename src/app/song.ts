export class Song {
    id: String;
    title: String;
    genres: String[];
    artists: String[];
    downloadURL: String;
    views: number;
    lyric: String;
    likes: number;
    likedUsers: String[];

    constructor(title?, genres?, artists?, downloadURL?, views?, likes?) {
        this.title = title,
        this.genres = genres ? genres : [];
        this.artists = artists ? artists : [];
        this.downloadURL = downloadURL;
        this.views = views ? views : 0;
    }
}
