from flask import Flask, request, jsonify

app = Flask(__name__)

# Dummy user data for testing
users = {
    "user1": {
        "username": "user1",
        "first_name": "User",
        "brid": "1234",
        "groups": ["group1", "required_group"]
    }
}

required_functional_group = "required_group"

@app.route('/api/login', methods=['POST'])
def login():
    print("Login request received")
    username = request.json.get('username')
    print(f"Username received: {username}")
    
    if username in users:
        user = users[username]
        user_groups = user['groups']
        print(f"User found: {user}")
        print(f"User groups: {user_groups}")
        
        if required_functional_group in user_groups:
            access_token = "fake_access_token"  # Mock access token creation
            print("User authorized")
            return jsonify({
                "message": "User is found and authorized",
                "access_token": access_token,
                "brid": user['brid'],
                "first_name": user['first_name']
            })
        else:
            print("User not in required functional group")
            return jsonify({"message": "User not authorized for this functional group"}), 403
    else:
        print("User not found")
        return jsonify({"message": "User not found"}), 404

@app.route('/api/portfolio_leadinfo', methods=['POST'])
def portfolio_leadinfo():
    data = request.json
    print(f"Portfolio lead info received: {data}")
    # Your processing logic here
    return jsonify({"message": "Portfolio Lead Info received"})

@app.route('/api/validate_group', methods=['GET'])
def validate_group():
    current_user = "user1"  # Mock current user retrieval
    print(f"Current user: {current_user}")
    
    if current_user in users:
        user = users[current_user]
        user_groups = user['groups']
        print(f"User groups: {user_groups}")
        
        if required_functional_group in user_groups:
            print("User authorized")
            return jsonify({"message": "User is authorized", "first_name": user['first_name'], "brid": user['brid']})
        else:
            print("User not in required functional group")
            return jsonify({'message': 'User is not authorized'}), 403
    else:
        print("User not found")
        return jsonify({'message': 'User not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
To handle authentication and authorization purely based on BAM without any manual input of username and password, you can modify the process to automatically validate the user based on the BAM token and functional group when they access any part of your application. Here's how you can set it up:

### Step-by-Step Guide

1. **Ensure BAM Token Retrieval and Validation**

2. **Modify Backend for Functional Group Validation**

3. **Set Up Angular Interceptor and Service**

4. **Automatically Validate User on App Initialization**

### Step 1: Ensure BAM Token Retrieval and Validation

#### Backend (Flask)

Modify your Flask backend to automatically validate the user's BAM token and check their functional group.

```python
from flask import Flask, jsonify, request, make_response
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'  # Change this to your secure key
jwt = JWTManager(app)
CORS(app, supports_credentials=True)

@app.route('/api/validate-group', methods=['GET'])
@jwt_required()
def validate_group():
    current_user = get_jwt_identity()
    bam_agent_key = current_user.get('bam_agent_key')
    username = current_user.get('username')

    # Replace this with your actual validation logic
    if bam_agent_key == 'valid_functional_group_key':
        return jsonify(isAuthorized=True)
    else:
        return jsonify(isAuthorized=False), 403

if __name__ == '__main__':
    app.run(debug=True)
```

### Step 2: Set Up Angular Interceptor and Service

#### `auth.service.ts`

Ensure your Angular service can handle BAM token retrieval and functional group validation.

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getTokenFromCookie(): string {
    const name = 'bamToken=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  validateFunctionalGroup(): Observable<boolean> {
    const token = this.getTokenFromCookie();
    if (!token) {
      console.log('No token found. User is not authorized.');
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/api/validate-group`, { headers }).pipe(
      map((response: any) => response.isAuthorized),
      catchError(error => {
        console.error('Validation error:', error);
        return of(false);
      })
    );
  }
}
```

#### `http-interceptor.service.ts`

Modify your HTTP interceptor to automatically validate the user's functional group.

```typescript
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { LogService } from '../services/log.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private logService: LogService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getTokenFromCookie();

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
    }

    return next.handle(req).pipe(
      catchError(err => {
        if (err.status === 401) {
          this.logService.addData('User is not authenticated');
          // Optionally, redirect to login page or handle re-authentication
          return throwError(err);
        }

        // Validate the user's group before proceeding
        return this.authService.validateFunctionalGroup().pipe(
          switchMap(isAuthorized => {
            if (isAuthorized) {
              return next.handle(req);
            } else {
              this.logService.addData('User is not authorized');
              return throwError({ status: 403, message: 'User is not authorized' });
            }
          }),
          catchError(groupError => {
            this.logService.addData(`Group validation error: ${groupError.message}`);
            return throwError(groupError);
          })
        );
      })
    );
  }
}
```

### Step 3: Automatically Validate User on App Initialization

#### `app.component.ts`

Modify your main component to automatically check if the user is authorized when the application initializes.

```typescript
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isAuthorized = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.validateFunctionalGroup().subscribe(isAuth => {
      this.isAuthorized = isAuth;
      if (isAuth) {
        console.log('User is authorized.');
        // Load the content for authorized users
      } else {
        console.log('User is not authorized. Access denied.');
        // Optionally, redirect or show an error message
      }
    });
  }
}
```

#### `app.component.html`

Update the template to show content conditionally based on authorization status.

```html
<div *ngIf="isAuthorized; else unauthorized">
  <!-- Content for authorized users -->
  <p>Welcome, authorized user!</p>
  <!-- Other protected content -->
</div>
<ng-template #unauthorized>
  <p>You are not authorized to view this content.</p>
</ng-template>
```

### Summary

By following these steps, you will set up your Angular application to automatically check if the user is authorized based on their BAM token when they access any part of the project. This approach avoids manual input of user credentials and ensures that only users who are part of the functional group can access the content.

If you encounter any issues or need further assistance, feel free to ask!
