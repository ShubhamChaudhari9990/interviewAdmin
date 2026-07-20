import { Injectable, inject } from '@angular/core';
import {
  Auth,
  User,
  signInWithEmailAndPassword,
  signOut,
  authState
} from '@angular/fire/auth';

export interface AuthProfile {
  name: string;
  role: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);

  user$ = authState(this.auth);

  login(email: string, password: string) {
    return signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );
  }

  logout() {
    return signOut(this.auth);
  }

  resolveProfile(user: User | null): AuthProfile {
    if (!user) {
      return {
        name: 'Admin',
        role: '',
        avatar: this.buildAvatarUrl('Admin'),
      };
    }

    const name =
      user.displayName?.trim() ||
      user.email?.split('@')[0] ||
      'Admin';

    return {
      name,
      role: user.email ?? 'Administrator',
      avatar: user.photoURL ?? this.buildAvatarUrl(name),
    };
  }

  private buildAvatarUrl(name: string): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3525cd&color=ffffff&size=80`;
  }

}