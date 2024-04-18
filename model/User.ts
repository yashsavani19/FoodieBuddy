
import { PreferenceList } from './PreferenceList';
import { Saved } from './Saved';


export abstract class User {
    private userId: string;
    private email: string;
    private username: string;
    private password: string;
    private preferences: PreferenceList;
    private savedRestaurants: Saved[];
    private visitedRestaurants: Saved[];
    private bookmarkedRestaurants: Saved[];

    constructor(userId: string, email: string, username: string, password: string, preferences: PreferenceList, savedRestaurants: Saved[], visitedRestaurants: Saved[], bookmarkedRestaurants: Saved[]) {
        this.userId = userId;
        this.email = email;
        this.username = username;
        this.password = password;
        this.preferences = preferences;
        this.savedRestaurants = savedRestaurants;
        this.visitedRestaurants = visitedRestaurants;
        this.bookmarkedRestaurants = bookmarkedRestaurants;
    }

    getUserId(): string {
        return this.userId;
    }

    getEmail(): string {
        return this.email;
    }

    getUsername(): string {
        return this.username;
    }

    getPassword(): string {
        return this.password;
    }

    getPreferences(): PreferenceList {
        return this.preferences;
    }

    getSavedRestaurants(): Saved[] {
        return this.savedRestaurants;
    }

    getVisitedRestaurants(): Saved[] {
        return this.visitedRestaurants;
    }

    getBookmarkedRestaurants(): Saved[] {
        return this.bookmarkedRestaurants;
    }

    setUserId(userId: string) {
        this.userId = userId;
    }

    setEmail(email: string) {
        this.email = email;
    }

    setUsername(username: string) {
        this.username = username;
    }

    setPassword(password: string) {
        this.password = password;
    }

    setPreferences(preferences: PreferenceList) {
        this.preferences = preferences;
    }

    setSavedRestaurants(savedRestaurants: Saved[]) {
        this.savedRestaurants = savedRestaurants;
    }

    setVisitedRestaurants(visitedRestaurants: Saved[]) {
        this.visitedRestaurants = visitedRestaurants;
    }

    setBookmarkedRestaurants(bookmarkedRestaurants: Saved[]) {
        this.bookmarkedRestaurants = bookmarkedRestaurants;
    }
}