import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './common/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  async ngOnInit() {
    const token = sessionStorage.getItem('token');
    const userData = sessionStorage.getItem('user');

    if (!token || !userData) {
      this.router.navigateByUrl('/login');
      return;
    }

    await this.userService.decodingJWTValues(token);
    this.userService.user.next(JSON.parse(userData));
  }
}
