import { join } from "path";
import { fetcher } from "./api/fetcher";

const apiUri = join(process.env.BASE_URL || "", "/api/enhet");

export const getOrganisasjonsNavn = async (orgNr) =>
  fetcher(`${apiUri}/${orgNr}`).catch((err) => console.error(err));
