import { Injectable } from '@angular/core';
const PREFIX = "mazebank-"

@Injectable({
  providedIn: 'root'
})
export class LocalsaveService {

  save(jwt: string){
    localStorage.setItem(PREFIX + "jwt", jwt);
  }

  load() : string{
    return <string> localStorage.getItem(PREFIX + "jwt");
  }

  constructor() { }
}
