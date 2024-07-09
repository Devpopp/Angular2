from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'f42b8cc471e58b22f3e0ad07f9f9f8df'
app.config['JWT_TOKEN_LOCATION'] = ['headers']
jwt = JWTManager(app)

# Dummy user data for testing
users = {
    "user1": {
        "username": "user1",
        "first_name": "User",
        "brid": "1234",
        "groups": ["group1", "FGLBGFTCODR"]
    }
}

required_functional_group = "FGLBGFTCODR"  # This is the required functional group

def fetch_fn_grps(user_groups):
    fmt_ad_groups_set = set(user_groups)
    return fmt_ad_groups_set

@app.route('/api/validate_group', methods=['GET'])
@jwt_required()
def validate_group():
  username = request.args.get('username')
  if not username:
      return jsonify({"msg": "Username is required"}), 400

  user = users.get(username)
  if not user:
      return jsonify({"msg": "User not found"}), 404

  user_groups = user.get('groups', [])
  functional_groups = fetch_fn_grps(user_groups)
  
  if required_functional_group not in functional_groups:
      return jsonify({"msg": "Unauthorized"}), 401
  
  response = {
      "access_token": jwt.encode({"username": user["username"]}, app.config['JWT_SECRET_KEY'], algorithm="HS256"),
      "brid": user["brid"],
      "first_name": user["first_name"],
      "message": "User is found and authorized"
  }
  return jsonify(response), 200

if __name__ == '__main__':
    app.run(debug=True)
To diagnose and resolve the issues with the validation logic, we need to ensure the backend routes are properly defined and accessible, and the Angular frontend is making correct HTTP requests. Let's review the provided code and fix the issues step by step.

### Flask Backend Review and Correction

Ensure the Flask backend has the correct routes and is running without errors. Here is a consolidated view of the Flask backend code with added comments for clarity:

```python
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
    data = request.json
    print(f"Request JSON data: {data}")
    username = data.get('username')
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
    print("Validate group request received")
    current_user = "user1"  # Mock current user retrieval
    print(f"Current user: {current_user}")
    
    if current_user in users:
        user = users[current_user]
        user_groups = user['groups']
        print(f"User groups: {user_groups}")
        
        if required_functional_group in user_groups:
            print("User authorized")
            return jsonify({
                "message": "User is authorized", 
                "first_name": user['first_name'], 
                "brid": user['brid'],
                "groups": user_groups
            })
        else:
            print("User not in required functional group")
            return jsonify({'message': 'User is not authorized'}), 403
    else:
        print("User not found")
        return jsonify({'message': 'User not found'}), 404

@app.route('/api/users_in_group', methods=['GET'])
def users_in_group():
    group = request.args.get('group')
    print(f"Checking users in group: {group}")
    users_in_group = [user for user in users.values() if group in user['groups']]
    print(f"Users in group {group}: {users_in_group}")
    return jsonify(users_in_group)

if __name__ == '__main__':
    app.run(debug=True)
```

### Angular Service and Component Review and Correction

#### `data.service.ts`

Ensure the Angular service is correctly configured to interact with the Flask backend.

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  login(username: string): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const body = { username: username };
    return this.http.post<any>(`${this.baseUrl}/api/login`, body, { headers });
  }

  validateGroup(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/validate_group`);
  }

  getUsersInGroup(group: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/users_in_group?group=${group}`);
  }

  // Other methods...
}
```

#### `auth.service.ts`

Ensure the authentication service is properly making requests to the Flask backend.

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  login(username: string): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const body = { username: username };
    return this.http.post<any>(`${this.baseUrl}/api/login`, body, { headers })
      .pipe(
        map((response: any) => {
          if (response.access_token) {
            localStorage.setItem('token', response.access_token);
            localStorage.setItem('brid', response.brid);
            localStorage.setItem('first_name', response.first_name);
          }
          return response;
        }),
        catchError(error => {
          console.error('Login error:', error);
          return [];
        })
      );
  }

  validateGroup(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/validate_group`);
  }

  getUsersInGroup(group: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/users_in_group?group=${group}`);
  }
}
```

#### `app.component.ts`

Ensure the Angular component is correctly handling the responses and updating the UI.

```typescript
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TCO';

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.login('user1').subscribe(response => {
      console.log('Login Response:', response);
      if (response.message === 'User is found and authorized') {
        this.authService.validateGroup().subscribe(groupResponse => {
          console.log('Group Validation Response:', groupResponse);
          if (groupResponse.message === 'User is authorized') {
            this.authService.getUsersInGroup('required_group').subscribe(usersResponse => {
              console.log('Users in Required Group:', usersResponse);
            });
          } else {
            console.error('User not authorized for the required group');
          }
        });
      } else {
        console.error('Login failed or user not found');
      }
    });
  }
}
```

### Key Points to Check

1. **Ensure Flask Server is Running**:
   Make sure the Flask server is running and accessible. You should see the printed debug statements in the terminal.

2. **Correct Base URL in Angular Environment**:
   Ensure the `environment.baseUrl` in Angular points to `http://127.0.0.1:5000`.

3. **Use Correct Endpoints**:
   Verify that the endpoints in the Angular services match the Flask routes (`/api/login`, `/api/validate_group`, `/api/users_in_group`).

4. **Check CORS Configuration**:
   If the frontend and backend are on different domains or ports, ensure CORS is configured correctly in Flask.

```python
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
```

By following these steps and ensuring the configurations are correct, you should be able to resolve the issues and validate the user's presence in the provided functional group. If the issue persists, please share specific error messages or logs for further assistance.
