export class User {
    username: string;
    email: string;
    token: string;
    image: string;

    constructor(username: string, email: string, token: string, image: string) {
        this.username = username;
        this.email = email;
        this.token = token;
        this.image = image;
    }
}