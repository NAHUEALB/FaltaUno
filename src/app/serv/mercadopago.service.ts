import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MercadopagoService {
  response: Response;

  constructor(private http: HttpClient) {}

  requestHttp(request) {
    const headers = {
      Authorization:
        'Bearer TEST-761120447250611-102623-92ef01bf797024fcb6e858e3aff75da2-194080444',
        'Content-Type': 'application/json',
    };
    let promise = new Promise((resolve, reject) => {
      this.http
        .post<any>(
          'https://api.mercadopago.com/checkout/preferences',
          request,
          { headers }
        )
        .subscribe((data: any) => {
          this.response = data.sandbox_init_point;
          resolve(this.response);
        });

    });

    return promise;
  }
}
