import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, from } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  JWT_KEY = 'turlist_jwtstoragekey';
  IS_FACEBOOK_LOGIN = 'turlist_is_facebook_login';
  CUR_LOCATION = 'turlist_cur_location';
  access_token = "IGQVJYUGRnOUVOWEd5YkhBQXBMWUVJaVIyeGNYdmFyY0pSZAFk3by1Vclc0TlQ0VEFFelNnTHc2UmVmUHJaLXJYLUNsbnVDbDdRYjlLa3JWM3RYbDgxcDQ1T2lxZAC1pUDN5RThHMkdxQm5VRTVWXzVmZAgZDZD";
  api_prefix = 'https://turlister.no/wp-json';
  api_v2_url = this.api_prefix + '/tl/v2/';
  api_v1_url = this.api_prefix + '/tl/v2/';

  protected headers: HttpHeaders;

  onTourCategorySub: BehaviorSubject<string> = new BehaviorSubject('');
  user = new BehaviorSubject(null);

  constructor(private http: HttpClient, private storage: Storage, private plt: Platform) {
    this.plt.ready().then(() => {
      this.storage.get(this.JWT_KEY).then(data => {
        // console.log("from storage:", data);
        if (data) {
          this.user.next(data);
        }
      })
    })
  }

  /**
   * get user from local storage
   */
  getUser() {
    return this.user.asObservable();
  }

  getUserValue() {
    return this.user.getValue();
  }

  /**
   * wordpress login
   * @param username 
   * @param password 
   */
  doLoginInWordpress(username, password) {
    return this.http.post(environment.apiUrl + '/jwt-auth/v1/token', { username, password }).pipe(
      switchMap((data: any) => {
        console.log("data:", data);
        let userdata = {
          email: data.user_email,
          name: data.user_display_name,
          picture: ''
        }
        return from(this.storage.set(this.JWT_KEY, userdata))
      }),
      tap((data: any) => {
        this.user.next(data);
      })
    )
  }

  /**
   * wordpress signup
   * @param username 
   * @param email 
   * @param password 
   */
  doSignupInWordpress(newUser) {
    return this.http.post(`https://turlister.no/wp-json/tl/v2/registration?uName=${newUser.uName}&email=${newUser.email}&fName=${newUser.fName}&lName=${newUser.lName}&password=${newUser.password}`, {});
    // return this.http.post(`${environment.apiUrl}/wp/v2/users/register`, newUser);
  }

  /**
   * reset password
   * @param usernameOrEmail 
   */
  resetPassword(usernameOrEmail) {
    return this.http.post(`${environment.apiUrl}/wp/v2/users/lostpassword`, { user_login: usernameOrEmail });
  }

  /**
   * logout
   */
  logout() {
    this.storage.remove(this.JWT_KEY).then(() => {
      this.user.next(null);
    });
  }

  /**
   * get user info with from wordpress
   * @param token 
   */
  validateAuthToken(token) {
    this.headers = new HttpHeaders({
      'Authorization': 'Basic ' + token
    });
    // headers.append('Authorization', 'Basic ' + token);
    return this.http.post(this.api_prefix + '/jwt-auth/v1/token/validate?token=' + token,
      {}, { headers: this.headers })
  }
  /**
   * get categories
   */
  getCategories() {
    console.log("url:", this.api_v1_url + 'categories');
    return this.http.get(this.api_v1_url + 'categories')
  }
  /**
   * get About
   */
  getAbout() {
    return this.http.get(this.api_v2_url + 'about')
  }
  /**
   * get Terms and Conditions
   */
  getTermsConditions() {
    return this.http.get(environment.apiUrl + '/tl/v2/terms')
  }

  /**
   * get photos with a given hashtag in instagram
   * https://api.instagram.com/v1/self/media/recent?access_token=2ab8a944fb7043fcad9923531e374c00
   */
  getPhotosWithHashtagFromInstagram() {
    // https://turlister.no/wp-json/tl/v2/instagram
    // return this.http.get('https://api.instagram.com/v1/tags/turlister/media/recent?access_token=2ab8a944fb7043fcad9923531e374c00');
    return this.http.get(this.api_v1_url + 'instagram');
  }
  /**
   * get Tours with coordinates
   */
  getTours(category, searchWord, isSearch) {
    let url = 'https://turlister.no/wp-json/tl/v2';
    if (isSearch) {
      if (searchWord) {
        url += "/search?words=" + searchWord;
      } else {
        url += '/locations';
      }
    } else {
      url += '/locations';
      if (category) {
        url += '?cat=' + category;
      }
    }
    return this.http.get(url);
  }
  /**
   * get Tours with coordinates
   * https://turlister.no/wp-json/tl/v2/location?id=2775
   */
  getTourDetail(tourid, email) {
    let url = this.api_v1_url + 'location?id=' + tourid;
    if (email) {
      url += "&email=" + email;
    }
    console.log("api url:", url);

    return this.http.get(url);
  }


  /**
   * send a request after logged in.
   * @param email 
   */
  checkinTour(id, email) {
    // return this.http.get(`${environment.apiUrl}/tl/v2/location?id=${id}@email=${email}`);
    let url = this.api_v1_url + 'checkin';
    console.log("checkin url:", url);

    return this.http.post(url, { tour_id: id, email: email });
  }

  getProfileOfRegisterdTours(email) {
    let url = this.api_v1_url + 'profile?email=' + email;
    console.log("url:", url);

    return this.http.get(url);
  }

  /**
 * Converts degrees to radians.
 * 
 * @param degrees Number of degrees.
 */
  degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  /**
  * Returns the distance between 2 points of coordinates in Google Maps
  * 
  * @see https://stackoverflow.com/a/1502821/4241030
  * @param lat1 Latitude of the point A
  * @param lng1 Longitude of the point A
  * @param lat2 Latitude of the point B
  * @param lng2 Longitude of the point B
  */
  getDistanceBetweenPoints(lat1, lng1, lat2, lng2) {
    // The radius of the planet earth in meters
    let R = 6378137;
    let dLat = this.degreesToRadians(lat2 - lat1);
    let dLong = this.degreesToRadians(lng2 - lng1);
    let a = Math.sin(dLat / 2)
      *
      Math.sin(dLat / 2)
      +
      Math.cos(this.degreesToRadians(lat1))
      *
      Math.cos(this.degreesToRadians(lat1))
      *
      Math.sin(dLong / 2)
      *
      Math.sin(dLong / 2);

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = R * c;

    return distance;
  }
}
