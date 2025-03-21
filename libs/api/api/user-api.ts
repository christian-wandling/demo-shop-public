/**
 * Demo Shop API
 *
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
  HttpEvent,
  HttpParameterCodec,
  HttpContext,
} from '@angular/common/http';
import { CustomHttpParameterCodec } from '../encoder';
import { Observable } from 'rxjs';

// @ts-ignore
import { AddressResponse } from '../model/address-response';
// @ts-ignore
import { UpdateUserAddressRequest } from '../model/update-user-address-request';
// @ts-ignore
import { UpdateUserPhoneRequest } from '../model/update-user-phone-request';
// @ts-ignore
import { UserResponse } from '../model/user-response';

// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS } from '../variables';
import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root',
})
export class UserApi {
  protected basePath = 'http://localhost';
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();
  public encoder: HttpParameterCodec;

  constructor(
    protected httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string | string[],
    @Optional() configuration: Configuration
  ) {
    if (configuration) {
      this.configuration = configuration;
    }
    if (typeof this.configuration.basePath !== 'string') {
      const firstBasePath = Array.isArray(basePath) ? basePath[0] : undefined;
      if (firstBasePath != undefined) {
        basePath = firstBasePath;
      }

      if (typeof basePath !== 'string') {
        basePath = this.basePath;
      }
      this.configuration.basePath = basePath;
    }
    this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
  }

  // @ts-ignore
  private addToHttpParams(httpParams: HttpParams, value: any, key?: string): HttpParams {
    if (typeof value === 'object' && value instanceof Date === false) {
      httpParams = this.addToHttpParamsRecursive(httpParams, value);
    } else {
      httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
    }
    return httpParams;
  }

  private addToHttpParamsRecursive(httpParams: HttpParams, value?: any, key?: string): HttpParams {
    if (value == null) {
      return httpParams;
    }

    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        (value as any[]).forEach(elem => (httpParams = this.addToHttpParamsRecursive(httpParams, elem, key)));
      } else if (value instanceof Date) {
        if (key != null) {
          httpParams = httpParams.append(key, (value as Date).toISOString().substring(0, 10));
        } else {
          throw Error('key may not be null if value is Date');
        }
      } else {
        Object.keys(value).forEach(
          k => (httpParams = this.addToHttpParamsRecursive(httpParams, value[k], key != null ? `${key}.${k}` : k))
        );
      }
    } else if (key != null) {
      httpParams = httpParams.append(key, value);
    } else {
      throw Error('key may not be null if value is not object or array');
    }
    return httpParams;
  }

  /**
   * Resolve current user
   * Resolve current user based on identity extracted from bearer token
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public resolveCurrentUser(
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext; transferCache?: boolean }
  ): Observable<UserResponse>;
  public resolveCurrentUser(
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext; transferCache?: boolean }
  ): Observable<HttpResponse<UserResponse>>;
  public resolveCurrentUser(
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext; transferCache?: boolean }
  ): Observable<HttpEvent<UserResponse>>;
  public resolveCurrentUser(
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext; transferCache?: boolean }
  ): Observable<any> {
    let localVarHeaders = this.defaultHeaders;

    let localVarCredential: string | undefined;
    // authentication (bearer) required
    localVarCredential = this.configuration.lookupCredential('bearer');
    if (localVarCredential) {
      localVarHeaders = localVarHeaders.set('Authorization', 'Bearer ' + localVarCredential);
    }

    let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (localVarHttpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json'];
      localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (localVarHttpHeaderAcceptSelected !== undefined) {
      localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
    }

    let localVarHttpContext: HttpContext | undefined = options && options.context;
    if (localVarHttpContext === undefined) {
      localVarHttpContext = new HttpContext();
    }

    let localVarTransferCache: boolean | undefined = options && options.transferCache;
    if (localVarTransferCache === undefined) {
      localVarTransferCache = true;
    }

    let responseType_: 'text' | 'json' | 'blob' = 'json';
    if (localVarHttpHeaderAcceptSelected) {
      if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
        responseType_ = 'text';
      } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
        responseType_ = 'json';
      } else {
        responseType_ = 'blob';
      }
    }

    let localVarPath = `/api/v1/users/me`;
    return this.httpClient.request<UserResponse>('post', `${this.configuration.basePath}${localVarPath}`, {
      context: localVarHttpContext,
      responseType: <any>responseType_,
      withCredentials: this.configuration.withCredentials,
      headers: localVarHeaders,
      observe: observe,
      transferCache: localVarTransferCache,
      reportProgress: reportProgress,
    });
  }

  /**
   * Update address of current user
   * Update the address of the user based on identity extracted from bearer token
   * @param updateUserAddressRequest
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public updateCurrentUserAddress(
    updateUserAddressRequest: UpdateUserAddressRequest,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext; transferCache?: boolean }
  ): Observable<AddressResponse>;
  public updateCurrentUserAddress(
    updateUserAddressRequest: UpdateUserAddressRequest,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext; transferCache?: boolean }
  ): Observable<HttpResponse<AddressResponse>>;
  public updateCurrentUserAddress(
    updateUserAddressRequest: UpdateUserAddressRequest,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext; transferCache?: boolean }
  ): Observable<HttpEvent<AddressResponse>>;
  public updateCurrentUserAddress(
    updateUserAddressRequest: UpdateUserAddressRequest,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext; transferCache?: boolean }
  ): Observable<any> {
    if (updateUserAddressRequest === null || updateUserAddressRequest === undefined) {
      throw new Error(
        'Required parameter updateUserAddressRequest was null or undefined when calling updateCurrentUserAddress.'
      );
    }

    let localVarHeaders = this.defaultHeaders;

    let localVarCredential: string | undefined;
    // authentication (bearer) required
    localVarCredential = this.configuration.lookupCredential('bearer');
    if (localVarCredential) {
      localVarHeaders = localVarHeaders.set('Authorization', 'Bearer ' + localVarCredential);
    }

    let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (localVarHttpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json'];
      localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (localVarHttpHeaderAcceptSelected !== undefined) {
      localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
    }

    let localVarHttpContext: HttpContext | undefined = options && options.context;
    if (localVarHttpContext === undefined) {
      localVarHttpContext = new HttpContext();
    }

    let localVarTransferCache: boolean | undefined = options && options.transferCache;
    if (localVarTransferCache === undefined) {
      localVarTransferCache = true;
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json'];
    const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected !== undefined) {
      localVarHeaders = localVarHeaders.set('Content-Type', httpContentTypeSelected);
    }

    let responseType_: 'text' | 'json' | 'blob' = 'json';
    if (localVarHttpHeaderAcceptSelected) {
      if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
        responseType_ = 'text';
      } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
        responseType_ = 'json';
      } else {
        responseType_ = 'blob';
      }
    }

    let localVarPath = `/api/v1/users/me/address`;
    return this.httpClient.request<AddressResponse>('put', `${this.configuration.basePath}${localVarPath}`, {
      context: localVarHttpContext,
      body: updateUserAddressRequest,
      responseType: <any>responseType_,
      withCredentials: this.configuration.withCredentials,
      headers: localVarHeaders,
      observe: observe,
      transferCache: localVarTransferCache,
      reportProgress: reportProgress,
    });
  }

  /**
   * Update phone of current user
   * Update the phone of the user based on identity extracted from bearer token
   * @param updateUserPhoneRequest
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public updateCurrentUserPhone(
    updateUserPhoneRequest: UpdateUserPhoneRequest,
    observe?: 'body',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext; transferCache?: boolean }
  ): Observable<UserResponse>;
  public updateCurrentUserPhone(
    updateUserPhoneRequest: UpdateUserPhoneRequest,
    observe?: 'response',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext; transferCache?: boolean }
  ): Observable<HttpResponse<UserResponse>>;
  public updateCurrentUserPhone(
    updateUserPhoneRequest: UpdateUserPhoneRequest,
    observe?: 'events',
    reportProgress?: boolean,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext; transferCache?: boolean }
  ): Observable<HttpEvent<UserResponse>>;
  public updateCurrentUserPhone(
    updateUserPhoneRequest: UpdateUserPhoneRequest,
    observe: any = 'body',
    reportProgress: boolean = false,
    options?: { httpHeaderAccept?: 'application/json'; context?: HttpContext; transferCache?: boolean }
  ): Observable<any> {
    if (updateUserPhoneRequest === null || updateUserPhoneRequest === undefined) {
      throw new Error(
        'Required parameter updateUserPhoneRequest was null or undefined when calling updateCurrentUserPhone.'
      );
    }

    let localVarHeaders = this.defaultHeaders;

    let localVarCredential: string | undefined;
    // authentication (bearer) required
    localVarCredential = this.configuration.lookupCredential('bearer');
    if (localVarCredential) {
      localVarHeaders = localVarHeaders.set('Authorization', 'Bearer ' + localVarCredential);
    }

    let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
    if (localVarHttpHeaderAcceptSelected === undefined) {
      // to determine the Accept header
      const httpHeaderAccepts: string[] = ['application/json'];
      localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
    }
    if (localVarHttpHeaderAcceptSelected !== undefined) {
      localVarHeaders = localVarHeaders.set('Accept', localVarHttpHeaderAcceptSelected);
    }

    let localVarHttpContext: HttpContext | undefined = options && options.context;
    if (localVarHttpContext === undefined) {
      localVarHttpContext = new HttpContext();
    }

    let localVarTransferCache: boolean | undefined = options && options.transferCache;
    if (localVarTransferCache === undefined) {
      localVarTransferCache = true;
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json'];
    const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected !== undefined) {
      localVarHeaders = localVarHeaders.set('Content-Type', httpContentTypeSelected);
    }

    let responseType_: 'text' | 'json' | 'blob' = 'json';
    if (localVarHttpHeaderAcceptSelected) {
      if (localVarHttpHeaderAcceptSelected.startsWith('text')) {
        responseType_ = 'text';
      } else if (this.configuration.isJsonMime(localVarHttpHeaderAcceptSelected)) {
        responseType_ = 'json';
      } else {
        responseType_ = 'blob';
      }
    }

    let localVarPath = `/api/v1/users/me/phone`;
    return this.httpClient.request<UserResponse>('patch', `${this.configuration.basePath}${localVarPath}`, {
      context: localVarHttpContext,
      body: updateUserPhoneRequest,
      responseType: <any>responseType_,
      withCredentials: this.configuration.withCredentials,
      headers: localVarHeaders,
      observe: observe,
      transferCache: localVarTransferCache,
      reportProgress: reportProgress,
    });
  }
}
