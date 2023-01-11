import { fetcher } from "./api/fetcher";
import { join } from "path";

const apiUri = join(process.env.BASE_URL || "", "/api/inntekt");

export const getInntekt = async (uri) => {
  const params = new URLSearchParams({
    aktorId: uri.aktørId,
    vedtakId: uri.vedtakId,
    beregningsDato: uri.beregningsDato,
  });

  return fetcher(`${apiUri}?${params}`);
};

export const getUncachedInntekt = async (uri) => {
  const params = new URLSearchParams({
    aktorId: uri.aktørId,
    vedtakId: uri.vedtakId,
    beregningsDato: uri.beregningsDato,
  });

  return fetcher(`${apiUri}/uncached?${params}`);
};

// todo post til uncached hvis henter nye opplysninger
// todo legge til ${request.aktørId}/${request.vedtakId}/${request.beregningsDato}`,
export const lagreInntekt = async (request, isUncached, uri) => {
  const params = new URLSearchParams({
    aktorId: uri.aktørId,
    vedtakId: uri.vedtakId,
    beregningsDato: uri.beregningsDato,
  });

  const url = isUncached
    ? `${apiUri}/uncached?${params}`
    : `${apiUri}?${params}`;

  return fetcher(url, {
    method: "post",
    body: JSON.stringify(request),
  });
};

export const getVerdikoder = async () => fetcher(`${apiUri}/verdikoder`);
