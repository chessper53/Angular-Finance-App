import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthGuardService } from './authcheck.service';
import { Observable } from 'rxjs';
import { AccountService } from './account.service';
import { getHeaders, getServerUrl } from './http-environment';
import { Account } from './account.service';

export interface Credential {
  token: string,
  owner: Account
}
export interface LoginInfo {
  login: string,
  password: string
}
export interface RegistrationInfo extends LoginInfo {
  firstname: string,
  lastname: string
}

/**
 * Mit dem Authentication Service können neue Benutzer angelegt und
 * kann in existierende Accounts eingeloggt werden.
 */
@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(private http: HttpClient, private accountService: AccountService) {
  }

  /**
   * Registriert einen neuen Benutzer im System und gibt den Benutzer mit der
   * generierten Account Nummer zurück. Ein neuer Benutzer erhält 1000.- CHF
   * Startguthaben vom System. Neue Accounts enthalten noch keine Transaktionen.
   * @param model Spezifiziert den Namen, sowie den Benutzernamen und das Password des neuen Users.
   * @example Gibt das Resultat im folgenden Format zurück:
   * ```json
   * {
   *    "login": "mHans",
   *    "firstname": "Hans",
   *    "lastname": "Muster",
   *    "accountNr": "1000004"
   * }
   * ```
   */
  public register(model: RegistrationInfo): Observable<Account> {
    return this.http.post<Account>(
      getServerUrl('/auth/register'),
      JSON.stringify(model),
      getHeaders());
  }

  public validateJwt(selectedToken: string): Observable<boolean>{
    return new Observable<boolean>(observer => {
      this.accountService.getCurrentBalance(selectedToken).subscribe({
        error: e => {
          console.log(e);
          observer.next(false)
        },
        next: balance => {
          console.log(balance);
          observer.next(true)
        },
        complete: () => {
          observer.complete()
        }
      })
    })
  }
  /**
   * Sucht nach dem angegebenen Login und überprüft das spezifizierte Passwort.
   * Gibt das JWT Token sowie den gefundenen Account zurück, falls der User gefunden wurde.
   * Ansonsten wird der Request mit einem Status-Code 404 beantwortet.
   * @param model Spezifiziert den Benutzernamen und das Password des Users.
   * @example Gibt das Resultat im folgenden Format zurück:
   * ```json
   * {
   *    "token": "eyJhbGci...",
   *    "owner":
   *    {
   *       "login": "user1",
   *       "firstname": "Bob",
   *       "lastname": "Müller",
   *       "accountNr": "1000001"
   *    }
   * }
   * ```
   */
  public login(model: LoginInfo): Observable<Credential> {
    return this.http.post<Credential>(
      getServerUrl('/auth/login'),
      JSON.stringify(model),
      getHeaders());
  }
}
