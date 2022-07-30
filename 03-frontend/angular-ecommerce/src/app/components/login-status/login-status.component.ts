import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string;


  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
    this.oktaAuth.authStateManager.subscribe(
      isAuth => this.isAuthenticated = isAuth
    );
   }

    async ngOnInit(){

      // Subscribe to authentication state changes
      this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    
    if (this.isAuthenticated) {
      const userClaim = await this.oktaAuth.getUser();
      this.userFullName = userClaim.name || "";
    }
    console.log("Autentication = " + this.isAuthenticated);
    console.log("Username = " + this.userFullName);
      
    }
  
  // getUserDetails() {
  //   if(this.isAuthenticated){

  //     //Fetch the logged in user details (user's claims)

  //     //
  //     // user full name is exposed as a property name
  //     this.oktaAuth.getUser().then(
  //       (res) => {
  //         this.userFullName = res.name;
  //       }
  //     );
  //   }
  // }
  async logout(){
    // Terminates the session with Okta and removes current tokens
    await this.oktaAuth.signOut()
  }

}
