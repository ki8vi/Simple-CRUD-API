import { User } from "../types/user";
import { v4 as idGenerator } from 'uuid';

export class UsersData {
    private users: User[];

    constructor() {
        this.users = []; 
    }

    async getUsers(): Promise<User[]> {
        return Promise.resolve(this.users);
    }

    async getUserById(id: string): Promise<User | null> {
        const user = this.users.find((user) => user.id === id) || null;
        return Promise.resolve(user);
    }

    async createUser(username: string, age: number, hobbies: string[]): Promise<User> {
        const id = idGenerator();
        const newUser: User = {
            id,
            username,
            age,
            hobbies,
        };
        this.users.push(newUser);
        return Promise.resolve(newUser);
    }

    async updateUser(id: string, updatedData: Partial<Omit<User, 'id'>>): Promise<User | null> {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            return Promise.resolve(null);
        }
        const updatedUser = { ...this.users[userIndex], ...updatedData };
        this.users[userIndex] = updatedUser;
        return Promise.resolve(updatedUser);
    }

    async deleteUser(id: string): Promise<boolean> {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            return Promise.resolve(false);
        }
        this.users.splice(userIndex, 1);
        return Promise.resolve(true);
    }
}
