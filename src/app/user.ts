export class User {
    displayName: String;
    email: String;
    isAdmin: boolean;
    uid: String;
    playlist: String[];

    constructor(displayName, email, uid, isAdmin = false, playlist) {
        this.displayName = displayName;
        this.email = email;
        this.uid = uid;
        this.isAdmin = isAdmin;
        if (!playlist) {
            this.playlist = [];
        } else {
            this.playlist = playlist;
        }
    }
}
