import { APIEvent } from "@solidjs/start/server";
import { proxyAuthRequest } from "~/auth.server";

export const GET = ({ request }: APIEvent) => proxyAuthRequest(request);
export const POST = ({ request }: APIEvent) => proxyAuthRequest(request);
