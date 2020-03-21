export class UsuarioModel {
  status: boolean;
  _id: string;
  name: string;
  last_name: string;
  email: string;
  password: string;
  type: string;
  boss?: string;
}
