import Inntekter, { inntektRequest } from "../../lib/Containers/Inntekter";
import { useEffect, useState } from "react";

export default function InntekterPage() {
  const [visFor, setVisFor] = useState();
  const search = typeof location != "undefined" ? location.search : null;

  useEffect(() => {
    if (!search) return;
    setVisFor(inntektRequest(new URLSearchParams(search)));
  }, [search]);

  if (!visFor) return null;
  return <Inntekter readOnly={false} visFor={visFor} />;
}
