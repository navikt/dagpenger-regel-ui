[![CircleCI](https://circleci.com/gh/navikt/dagpenger-regel-ui.svg?style=svg)](https://circleci.com/gh/navikt/dagpenger-regel-ui)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=navikt_dagpenger-regel-ui&metric=alert_status)](https://sonarcloud.io/dashboard?id=navikt_dagpenger-regel-ui)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## dagpenger-regel-ui

Verktøy for visning og redigering av inntekter ved behandling av dagpengevedtak.

## Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub.

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-dagpenger.

## Utvikling av applikasjonen

For å kjøre enkelte av testene kreves det at Docker kjører.

[Docker Desktop](https://www.docker.com/products/docker-desktop)


### Starte applikasjonen lokalt

Applikasjonen har avhengigheter til dp-inntekt-api, Postgres og OpenId provider som kan kjøres
opp lokalt vha Docker Compose(som følger med Docker Desktop) 



Starte dp-inntekt-api, Postgres og regel-ui (baseres på at dp-inntekt-api er bygget (`./gradlew build`) og regel-ui er bygget (`npm run build`))
```bash
docker-compose -f docker-compose.yml up --build

```

OpenId provideren har et sett predifinerte brukernavn og passord, se disse brukerene nederst på denne siden https://hub.docker.com/r/qlik/simple-oidc-provider/ 


Stopp ved å kjøre: 
```bash
docker-compose -f docker-compose.yml down

```


# OpenId (OpenAM) konfigurasjon i NAV

Er definert i [dagpenger-iac](https://github.com/navikt/dagpenger-iac/tree/master/openid) prosjektet.
