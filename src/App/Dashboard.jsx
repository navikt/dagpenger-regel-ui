import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import Panel from 'nav-frontend-paneler';
import { Element, Undertekst, Undertittel } from 'nav-frontend-typografi';
import { loader } from 'graphql.macro';
import { ReactComponent as MannIkon } from '../images/mann.svg';
import { ReactComponent as KvinneIkon } from '../images/kvinne.svg';
import InntektsForm from '../Inntekt/InntektsForm';
import EditedIkon from '../Components/EditedIkon';
import Spinner from '../Components/Spinner';
import Spacer from '../Components/Spacer';
import { getAlleMåneder } from '../Utils/datoUtils';

const GET_INNTEKT = loader('../Graphql/GET_INNTEKT.gql');

const getKjønn = kjoenn => {
  if (kjoenn === 'Kvinne') {
    return <KvinneIkon />;
  }

  return <MannIkon />;
};

const inntektRequest = queryParams => ({
  personId: queryParams.get('aktorId'),
  vedtakId: queryParams.get('vedtakId'),
  beregningsdato: queryParams.get('beregningdato'),
});

// todo flytte til datoutils
export const set36Måneder = (data, beregningsmåneder) => {
  if (beregningsmåneder) {
    data.map(virksomhet => {
      if (virksomhet.posteringer === undefined) {
        Object.assign(virksomhet, {
          posteringer: {},
        });
      }

      beregningsmåneder.forEach(måned => {
        if (!virksomhet.posteringer[måned]) {
          Object.assign(virksomhet.posteringer, {
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
    const dato = `${item.aarMaaned}`;
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
  const [hentInntektStatus, setHentInntekttatus] = useState(false);
  const [isHentInntektModalOpen, setHentInntektModal] = useState(false);

  const { data, error, loading, refetch } = useQuery(GET_INNTEKT, {
    variables: { ...inntektRequest(new URLSearchParams(location.search)), forceRefresh: hentInntektStatus },
  });

  const fetchUncachedInntekt = async () => {
    await setHentInntekttatus(true);
    // hent ferske inntekter
    refetch();
  };

  if (loading) {
    return <Spinner type="XL" />;
  }

  if (error || !data.person) {
    throw new Error(error);
  }

  const { person } = data;

  const beregningsmåneder = getAlleMåneder(person.vedtak.inntekt.fraDato, person.vedtak.inntekt.tilDato);

  const inntekter =
    !loading &&
    set36Måneder(
      groupBy(person.vedtak.inntekt.posteringer, postering => postering.virksomhet.organisasjonsnummer || postering.virksomhet.naturligIdent),
      beregningsmåneder,
    );

  return (
    <>
      <Panel border>
        <div className="flex">
          {person.naturligIdent && (
            <>
              <div className="marginhoyre16">{getKjønn(person.kjoenn)}</div>
              <div>
                <Undertittel>{`${person.navn} (${person.alder} år)`}</Undertittel>
                <Undertekst>{person.naturligIdent}</Undertekst>
              </div>
            </>
          )}
          <div className="flexend flex noprint">
            {person.vedtak.inntekt.manueltRedigert && (
              <div className="marginhoyre16 flex">
                <EditedIkon />
                <Element>Manuelt redigert</Element>
              </div>
            )}
          </div>
        </div>
      </Panel>

      <Spacer sixteenPx />

      <InntektsForm
        locationData={inntektRequest(new URLSearchParams(location.search))}
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
        måneder={beregningsmåneder}
        readOnly={readOnly}
        isHentInntektModalOpen={isHentInntektModalOpen}
        setHentInntektModal={setHentInntektModal}
        fetchUncachedInntekt={fetchUncachedInntekt}
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
