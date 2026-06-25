export class AuthResponseDto {
  accessToken!: string;
  user!: {
    id: string;
    email: string;
    phone: string | null;
    name: string | null;
    role: string;
  };
}
