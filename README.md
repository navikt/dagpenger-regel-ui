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

Applikasjonen har avhengigheter til dp-inntekt-api og Postgres som kan kjøres
opp lokalt vha Docker Compose(som følger med Docker Desktop) 


Starte dp-inntekt-api, Postgres og regel-ui (baseres på at dp-inntekt-api er bygget (`./gradlew build`) og regel-ui er bygget (`npm run build`))
```bash
docker-compose -f docker-compose.yml up --build

```

Stopp ved å kjøre: 
```bash
docker-compose -f docker-compose.yml down

```
