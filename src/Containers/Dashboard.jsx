import React, { useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import axios from 'axios';
import { Hovedknapp } from 'nav-frontend-knapper';
import AlertStripeSuksess from 'nav-frontend-alertstriper/lib/suksess-alertstripe';
import AlertStripeFeil from 'nav-frontend-alertstriper/lib/feil-alertstripe';
import Spinner from '../Components/Spinner';
import Arbeidsgiver from '../Components/Arbeidsgiver';
import Maaned from '../Components/Maaned';
import Inntekt from '../Components/Inntekt';
import dashboardPropType from '../PropTypes/dashBoardPropType';
import { getInntekt, lagreInntekt } from '../lib/inntektApiClient';
import './Dashboard.css';


const findArbeidsgivere = (inntekt) => {
  const map = new Map();
  inntekt.arbeidsInntektMaaned
    .forEach(mnd => mnd.arbeidsInntektInformasjon.inntektListe
      .forEach((arbeidsgiver) => {
        map.set(arbeidsgiver.virksomhet.identifikator, arbeidsgiver.virksomhet);
      }));

  return Array.from(map.values())
    .sort((first, second) => second.identifikator - first.identifikator);
};

// TODO fikse slik at vi ikke trenger å traverese dataen på nytt
const buildCSSGrid = (data, arbeidsgivere) => {
  const { arbeidsInntektMaaned } = data.inntekt;

  const maaneder = arbeidsInntektMaaned.map(maaned => `maaned--${maaned.aarMaaned}`);
  const arbeidsgivereMedInntekter = arbeidsgivere.map((arbeidsgiver) => {
    const inntekter = arbeidsInntektMaaned.map(maaned => `inntekter--${arbeidsgiver.identifikator}--${maaned.aarMaaned} `);
    return `"arbeidsgiver--${arbeidsgiver.identifikator} ${inntekter.join(' ')}"`;
  });

  return `
  .grid {
    grid-template-areas: ". ${maaneder.join(' ')}" ${arbeidsgivereMedInntekter.join(' ')};
`;
};

const Dashboard = ({ readOnly, location }) => {
  const [data, setData] = useState({ inntektId: '', inntekt: { arbeidsInntektMaaned: [], ident: {} } });
  const [arbeidsgivere, setArbeidsgivere] = useState([]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const inntektApiRequest = {
      aktørId: queryParams.get('aktorId'),
      vedtakId: queryParams.get('vedtakId'),
      beregningsDato: queryParams.get('beregningdato'),
    };

    const getInntektFromApi = async () => {
      let result;
      if (process.env.NODE_ENV !== 'production') {
        result = await axios(
          `${process.env.PUBLIC_URL}/mock/flereinntekter.json`,
        );
      } else {
        result = await getInntekt(inntektApiRequest);
      }
      setData({ ...result.data });
      setArbeidsgivere(findArbeidsgivere(result.data.inntekt));
    };

    getInntektFromApi();
  }, [location.search]);

  if (!arbeidsgivere.length && !data.inntekt.arbeidsInntektMaaned.length) {
    return <Spinner type="XL" />;
  }
  // TODO ingen behov settimeout lenger, bruk async og await
  return (
    <>
      <style dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
        __html: buildCSSGrid(data, arbeidsgivere),
      }}
      />

      <Formik
        enableReinitialize
        initialValues={data}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            lagreInntekt(values)
              .then((result) => {
                setData({ ...result.data });
                setArbeidsgivere(findArbeidsgivere(result.data.inntekt));
                actions.setStatus({ success: true });
              })
              .catch((error) => {
                actions.setStatus({ failure: true });
              }).finally(() => {
                actions.setSubmitting(false);
              });
          }, 1000);
        }}
        render={props => (
          <Form>
            {props.status && props.status.success
            && <div aria-live="polite"><AlertStripeSuksess>Inntekt er lagret</AlertStripeSuksess></div>}
            {props.status && props.status.failure
            && (
            <div aria-live="polite">
              <AlertStripeFeil>Uff da. Noe feil skjedde under lagring av inntekt</AlertStripeFeil>
            </div>
            )}
            <div className="grid">
              {arbeidsgivere.map(arbeidsgiver => (
                <Arbeidsgiver key={arbeidsgiver.identifikator} arbeidsgiver={arbeidsgiver} />
              ))}
              {props.values.inntekt.arbeidsInntektMaaned.map((maaned, monthIndex) => (
                <React.Fragment key={maaned.aarMaaned}>
                  <Maaned maaned={maaned.aarMaaned} />
                  {arbeidsgivere.map(arbeidsgiver => (
                    <Inntekt
                      readOnly={readOnly}
                      rowId={arbeidsgiver.identifikator}
                      columnId={maaned.aarMaaned}
                      key={arbeidsgiver.identifikator}
                      inntekter={maaned.arbeidsInntektInformasjon.inntektListe}
                      monthIndex={monthIndex}
                      formProps={props}
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>
            {props.errors.name && <div className="error">{props.errors.name}</div>}
            <div className="flex flexend">
              <Hovedknapp htmlType="submit" spinner={props.isSubmitting} autoDisableVedSpinner disabled={!props.dirty}>
                Bekreft
              </Hovedknapp>
            </div>
          </Form>
        )}
      />
    </>
  );
};

Dashboard.propTypes = dashboardPropType;
Dashboard.defaultProps = { readOnly: false };

export default Dashboard;
