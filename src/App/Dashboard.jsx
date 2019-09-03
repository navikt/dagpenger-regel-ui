import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Knapp } from 'nav-frontend-knapper';
import { useQuery } from '@apollo/react-hooks';
import Panel from 'nav-frontend-paneler';
import { nb } from 'date-fns/locale';
import AlertStripe from 'nav-frontend-alertstriper';
import { formatDistance } from 'date-fns';
import { Normaltekst, Ingress, Element } from 'nav-frontend-typografi';
import { loader } from 'graphql.macro';
import { OkAvbrytModal } from '../Components/OkAvbrytModal';
import { ReactComponent as MannIkon } from '../images/mann.svg';
import { ReactComponent as KvinneIkon } from '../images/kvinne.svg';
import InntektsForm from '../Inntekt/InntektsForm';
import EditedIkon from '../Components/EditedIkon';
import Spinner from '../Components/Spinner';
import Spacer from '../Components/Spacer';
import { DDMMYYYYHHMM_FORMAT } from '../Utils/datoFormat';
import { formatDato, eachMonthOfInterval } from '../Utils/datoUtils';

const GET_INNTEKT = loader('./GET_INNTEKT.gql');

const getKjønn = kjoenn => {
  if (kjoenn === 'Kvinne') {
    return <KvinneIkon />;
  }

  return <MannIkon />;
};

const getAlleMåneder = (fraDato, tilDato) => {
  const måneder = eachMonthOfInterval({
    start: new Date(fraDato),
    end: new Date(tilDato),
  });

  return måneder;
};

const set36Måneder = data => {
  const { fraDato, tilDato } = {
    fraDato: '2016-07',
    tilDato: '2019-06',
  };
  if (fraDato && tilDato) {
    const måneder = getAlleMåneder(fraDato, tilDato);

    data.map(a => {
      if (a.posteringer === undefined) {
        Object.assign(a, {
          posteringer: {},
        });
      }

      måneder.forEach(måned => {
        if (!a.posteringer[måned]) {
          // console.log('if');
          Object.assign(a.posteringer, {
            [måned]: [],
          });
        }
      });
      return data;
    });
  }
  return data;
};

// TODO generaliser slik at den kan fortsatt være i utils
const groupBy = (list, keyGetter) => {
  const map = new Map();
  list.forEach(item => {
    const key = keyGetter(item);
    const collection = map.get(key);
    const dato = `${item.periode.year}-${item.periode.month}`;
    if (!collection) {
      map.set(key, {
        ...item.virksomhet,
        posteringer: { [dato]: [item] },
      });
    } else if (collection.posteringer[dato]) {
      collection.posteringer[dato].push(item);
    } else {
      Object.assign(collection.posteringer, {
        [dato]: [item],
      });
    }
  });
  return Array.from(map.values());
};

const Dashboard = ({ readOnly, location }) => {
  const inntektRequest = new URLSearchParams(location.search);

  const { data, error, loading } = useQuery(GET_INNTEKT, {
    variables: {
      personId: inntektRequest.get('aktorId'),
      vedtakId: inntektRequest.get('vedtakId'),
      beregningsdato: inntektRequest.get('beregningdato'),
    },
  });

  const [hentInntektStatus, setHentInntekttatus] = useState(false);
  const [isHentInntektModalOpen, setHentInntektModal] = useState(false);

  const fetchUncachedInntekt = async () => {
    setHentInntekttatus('fetching');

    setHentInntekttatus(true);
  };

  if (loading) {
    return <Spinner type="XL" />;
  }

  if (error || !data.person) {
    return <>error</>;
  }

  const måneder = getAlleMåneder('2016-07', '2019-06');

  const { person } = data;

  const inntekter =
    !loading &&
    set36Måneder(groupBy(person.vedtak.inntekt.posteringer, postering => postering.virksomhet.organisasjonsnummer || postering.virksomhet.naturligIdent));
  console.log('data', data, inntekter);
  return (
    <>
      <Panel border>
        <div className="flex">
          {person.naturligIdent && (
            <>
              <div className="marginhoyre16">{getKjønn(person.kjoenn)}</div>
              <div>
                <Ingress>{person.navn}</Ingress>
                <Normaltekst>Fødselsnummer</Normaltekst>
                <Ingress>{person.naturligIdent}</Ingress>
              </div>
            </>
          )}
          <div className="flexend flex noprint">
            {person.manueltRedigert && (
              <div className="marginhoyre16 flex">
                <EditedIkon />
                <Element>Manuelt redigert</Element>
              </div>
            )}
          </div>
        </div>
      </Panel>

      <Spacer sixteenPx />

      {hentInntektStatus && (
        <div aria-live="polite">
          <AlertStripe type="info">Inntekt innhentet. Trykk bekreft for å lagre.</AlertStripe>
          <Spacer sixteenPx />
        </div>
      )}

      <div className="flex hentinntekter">
        <Knapp onClick={() => setHentInntektModal(true)} autoDisableVedSpinner disabled={readOnly} spinner={hentInntektStatus === 'fetching'}>
          Hent inntekter på nytt
        </Knapp>
        <div className="marginvenstre16">
          Opplysninger hentet :
          <Normaltekst>
            {formatDato(new Date(person.vedtak.inntekt.timestamp), DDMMYYYYHHMM_FORMAT)}
            {', '}
            <b>{formatDistance(new Date(person.vedtak.inntekt.timestamp), new Date(), { locale: nb, addSuffix: true })}</b>
          </Normaltekst>
        </div>
        <OkAvbrytModal
          isOpen={isHentInntektModalOpen}
          text="Når du henter inn nyeste inntekt fra skatt så vil alle tidligere endringene gå tapt."
          avbrytCallback={() => setHentInntektModal(false)}
          OkCallback={() => {
            fetchUncachedInntekt();
            setHentInntektModal(false);
          }}
        />
      </div>

      <InntektsForm
        initialValues={{
          person: {
            ...person,
            vedtak: {
              ...person.vedtak,
              inntekt: {
                ...person.vedtak.inntekt,
                posteringer: [...inntekter],
              },
            },
          },
        }}
        hentInntektStatus={hentInntektStatus}
        måneder={måneder}
        readOnly={readOnly}
      />
    </>
  );
};

Dashboard.propTypes = {
  readOnly: PropTypes.bool,
  location: PropTypes.shape().isRequired,
};

Dashboard.defaultProps = {
  readOnly: false,
};

export default Dashboard;
