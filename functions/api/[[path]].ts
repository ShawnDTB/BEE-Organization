import { handleIntake, type Env } from "../../server/intake";
export const onRequest = ({ request, env }: { request: Request; env: Env }) =>
  handleIntake(request, env);
