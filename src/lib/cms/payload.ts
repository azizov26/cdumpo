import config from "@payload-config";
import { getPayload } from "payload";

/** Клиент Payload для серверных компонентов (Local API, без HTTP). */
export const getCms = () => getPayload({ config });
