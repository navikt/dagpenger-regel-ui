import React, { useEffect, useState } from 'react';
import { Form, Formik, FieldArray } from 'formik';
import axios from 'axios';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import AlertStripeSuksess from 'nav-frontend-alertstriper/lib/suksess-alertstripe';
import AlertStripeFeil from 'nav-frontend-alertstriper/lib/feil-alertstripe';
import { DisplayFormikState } from '../Utils/formikUtils';
import Spinner from '../Components/Spinner';
import Arbeidsgiver from '../Components/Arbeidsgiver';
import Maaned from '../Components/Maaned';
import Inntekt from '../Components/Inntekt';
import NyArbeidsgiver from './NyArbeidsgiver';
import NyMaaned from './NyMaaned';
import dashboardPropType from '../PropTypes/dashBoardPropType';
import { getInntekt, getUncachedInntekt, lagreInntekt } from '../lib/inntektApiClient';
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

  const maaneder = arbeidsInntektMaaned.sort((a, b) => a.aarMaaned.localeCompare(b.aarMaaned)).map(maaned => `maaned--${maaned.aarMaaned}`);
  const arbeidsgivereMedInntekter = arbeidsgivere.map((arbeidsgiver) => {
    const inntekter = arbeidsInntektMaaned.map(maaned => `inntekter--${arbeidsgiver.identifikator}--${maaned.aarMaaned} `);
    return `"arbeidsgiver--${arbeidsgiver.identifikator} ${inntekter.join(' ')} ."`;
  });

  return `
  .grid {
    grid-template-areas: ". ${maaneder.join(' ')} maaned--ny" ${arbeidsgivereMedInntekter.join(' ')};
`;
};

const inntektRequest = queryParams => ({
  aktørId: queryParams.get('aktorId'),
  vedtakId: queryParams.get('vedtakId'),
  beregningsDato: queryParams.get('beregningdato'),
});

const Dashboard = ({ readOnly, location }) => {
  const [data, setData] = useState({ inntektId: '', inntekt: { arbeidsInntektMaaned: [], ident: {} } });
  const [arbeidsgivere, setArbeidsgivere] = useState([]);
  const [uncachedStatus, setUncachedStatus] = useState('');
  const [isArbeidsgiverModalOpen, setArbeidsgiverModal] = useState(false);
  const [isMånedModalOpen, setMånedModal] = useState(false);

  useEffect(() => {
    const getInntektFromApi = async () => {
      let result;
      if (process.env.NODE_ENV !== 'production') {
        result = await axios(
          `${process.env.PUBLIC_URL}/mock/flereinntekter.json`,
        );
      } else {
        result = await getInntekt(inntektRequest(new URLSearchParams(location.search)));
      }
      setData({ ...result.data });
      setArbeidsgivere(findArbeidsgivere(result.data.inntekt));
    };

    getInntektFromApi();
  }, [location.search]);

  const fetchUncachedInntekt = async () => {
    setUncachedStatus('fetching');
    if (process.env.NODE_ENV !== 'production') {
      const result = await axios(
        `${process.env.PUBLIC_URL}/mock/inntekter.json`,
      );
      setData({ ...result.data });
      setArbeidsgivere(findArbeidsgivere(result.data.inntekt));
      setUncachedStatus('success');
    } else {
      getUncachedInntekt(inntektRequest(new URLSearchParams(location.search)))
        .then((result) => {
          setData({ ...result.data });
          setArbeidsgivere(findArbeidsgivere(result.data.inntekt));
          setUncachedStatus('success');
        })
        // eslint-disable-next-line no-unused-vars
        .catch((error) => {
          setUncachedStatus('error');
        });
    }
  };

  if (!arbeidsgivere.length && !data.inntekt.arbeidsInntektMaaned.length) {
    return <Spinner type="XL" />;
  }
  // TODO ingen behov settimeout lenger, bruk async og await

  return (
    <>

      {uncachedStatus === 'success'
      && <div aria-live="polite"><AlertStripeSuksess>Ny inntekt hentet</AlertStripeSuksess></div>}
      {uncachedStatus === 'error'
      && (
        <div aria-live="polite">
          <AlertStripeFeil>En feil skjedde under henting av frisk inntekt</AlertStripeFeil>
        </div>
      )}
      <div>{`AktørId: ${data.inntekt.ident.identifikator}`}</div>

      <Knapp
        mini
        onClick={fetchUncachedInntekt}
        autoDisableVedSpinner
        spinner={uncachedStatus === 'fetching'}
      >
        Oppfrisk inntekt
      </Knapp>
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
              // eslint-disable-next-line no-unused-vars
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

            <style dangerouslySetInnerHTML={{ // eslint-disable-line react/no-danger
              __html: buildCSSGrid(props.values, arbeidsgivere),
            }}
            />


            <div className="grid">
              {arbeidsgivere.length > 0 && arbeidsgivere.map(arbeidsgiver => (
                <Arbeidsgiver key={arbeidsgiver.identifikator} arbeidsgiver={arbeidsgiver} />
              ))}

              <FieldArray
                name="inntekt.arbeidsInntektMaaned"
                render={arrayHelpers => (
                  <>
                    {props.values.inntekt.arbeidsInntektMaaned.map((maaned, monthIndex) => (
                      <React.Fragment key={maaned.aarMaaned}>
                        <Maaned maaned={maaned.aarMaaned} />
                        <>
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
                        </>
                      </React.Fragment>
                    ))}
                    <div className="item maaned maaned--ny">
                      <Knapp
                        htmlType="button"
                        mini
                        onClick={() => setMånedModal(!isMånedModalOpen)}
                      >
Legg til måned

                      </Knapp>
                      <Modal
                        isOpen={isMånedModalOpen}
                        onRequestClose={() => setMånedModal(false)}
                        closeButton={false}
                        contentLabel="Ny arbeidsgiver"
                        ariaHideApp={false}

                      >
                        <NyMaaned closeModal={() => setMånedModal(false)} arrayHelpers={arrayHelpers} />
                      </Modal>
                    </div>


                  </>
                )}
              />
            </div>
            {props.errors.name && <div className="error">{props.errors.name}</div>}

            <div className="flex">
              <div className="">
                <Knapp
                  htmlType="button"
                  mini
                  onClick={() => setArbeidsgiverModal(!isArbeidsgiverModalOpen)}
                >
                  Legg til arbeidsgiver
                </Knapp>
                <Modal
                  isOpen={isArbeidsgiverModalOpen}
                  onRequestClose={() => setArbeidsgiverModal(false)}
                  closeButton={false}
                  contentLabel="Ny arbeidsgiver"
                  ariaHideApp={false}
                >
                  <NyArbeidsgiver
                    setArbeidsgivere={setArbeidsgivere}
                    arbeidsgivere={arbeidsgivere}
                    closeModal={() => setArbeidsgiverModal(false)}
                  />
                </Modal>

              </div>
              <div className="flexend">
                <Hovedknapp htmlType="submit" spinner={props.isSubmitting} autoDisableVedSpinner disabled={!props.dirty && uncachedStatus === !'success'}>
                Bekreft og lagre
                </Hovedknapp>
              </div>
            </div>

            <DisplayFormikState {...props.values} />
          </Form>
        )}
      />
    </>
  );
};

Dashboard.propTypes = dashboardPropType;
Dashboard.defaultProps = { readOnly: false };

export default Dashboard;
