import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthenticateService {
    roleAs1: string;
    roleAs2: string;
    roleAs3: string;
    roleAs4: string;
    isLogin: boolean;

    constructor(public http: HttpClient) {}

    _Success = new BehaviorSubject<boolean>(undefined);

    SetConnexionState(state) {
        this._Success.next(state);
    }

    Authenticate(data) {
        sessionStorage.setItem('_AuthCoords', JSON.stringify(data));
        this.isLogin = true;
        localStorage.setItem('STATE', 'true');

        const mockResponse = {
            IsConnectionOk: true,
            SessionId: 'MOCK-SESSION-' + Date.now(),
            ForwardURL: '',
            AccessRightsOfCurrentAccount: {
                '3': true,
                '14': true,
                '15': true,
                '17': true,
                '22': true,
                '28': true
            },
            AccessParentPageOfCurrentAccount: {
                Administration: true,
                'Gestion du parc': true,
                Suivi: true
            },
            CustomerName: data.Login || 'Demo Orient',
            CustomerGMT: '+01:00',
            Customer: 'TUNAV Orient Demo'
        };

        return of(mockResponse).pipe(delay(300));
    }

    RequestNewSession() {
        return this.Authenticate(JSON.parse(sessionStorage.getItem('_AuthCoords')));
    }

    LogOut() {
        this.isLogin = false;
        localStorage.clear();
        localStorage.setItem('STATE', 'false');
        this.SetConnexionState(false);
        return of(true).pipe(delay(100));
    }

    isLoggedIn() {
        const loggedIn = localStorage.getItem('STATE');
        if (loggedIn === 'true') {
            this.isLogin = true;
        } else {
            this.isLogin = false;
        }
        return this.isLogin;
    }

    GetParams(): Observable<any> {
        return of({}).pipe(delay(50));
    }

    getRole() {
        this.roleAs1 = localStorage.getItem('isAdminAuthorized');
        this.roleAs2 = localStorage.getItem('isParcAuthorized');
        this.roleAs3 = localStorage.getItem('isSuiviAuthorized');
        this.roleAs4 = localStorage.getItem('isMonitoringTankAuthorized');
        return (this.roleAs1 || '') + (this.roleAs2 || '') + (this.roleAs3 || '') + (this.roleAs4 || '');
    }

    GetConnexionState(): Observable<any> {
        const ok = localStorage.getItem('STATE') === 'true' && !!localStorage.getItem('SessionId');
        return of(ok);
    }
}
