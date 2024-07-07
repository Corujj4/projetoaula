import { Injectable } from '@angular/core';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: Usuario[] = []; 

  constructor() {}


  addUser(user: Usuario): void {
    this.users.push(user);
  }


  getUsers(): Usuario[] {
    return this.users;
  }


  getUserById(id: number): Usuario | undefined {
    return this.users.find(user => user.id === id);
  }
}
