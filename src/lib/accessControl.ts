// Lista de e-mails autorizados a acessar o app.
// Para liberar acesso a outra pessoa, adicione o e-mail (em minúsculas) abaixo.
export const ALLOWED_EMAILS: string[] = [
  "jeaninefgr@gmail.com",
];

export const isEmailAllowed = (email?: string | null): boolean => {
  if (!email) return false;
  return ALLOWED_EMAILS.map((e) => e.toLowerCase()).includes(email.toLowerCase());
};