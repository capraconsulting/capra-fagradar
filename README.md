## Capra fagradar

Basert på https://github.com/thoughtworks/build-your-own-radar med inspirasjon fra https://github.com/oslokommune/origo-teknologiradar.
Lisensiert under AGPL-3.0.

Dataen til fagraderen er her: https://docs.google.com/spreadsheets/d/1ijgKkGvDoHSC1DgF5oWlPRZQJvm23N5oz-ssY9ZJMRs

### Oppdater fagrader-data
Dataene oppdateres i [Notion](https://www.notion.so/capra/eab66400679a4d48b6d0fa8920ee56e2?v=84f89f952c734786879adf92c6673c49).
Eksporter tabellen til csv og oppdater `data/radar.csv`.

Det er viktig at kolonne-navnene forblir `name,ring,quadrant,isNew,description` og at dataen i `quadrant` og `ring`
stemmer overens med `src/graphing/config.js` sine `getQuadrants` og `getRings` data. Rader som ikke matcher blir ikke med i radaren (!).

### Kjør lokalt
```
npm install
npm run dev
```


### Deploy

#### Apply infrastruktur
Oppdater `infra/prod/prod.tf` med riktig AWS-kontonummer.
Kjør:
```
aws-vault exec <capra-profile> -- terraform apply
```

#### Bygg og last opp

Oppdater `deploy` scriptet i `package.json` med target s3 bøtte som stemmer overens med `prod.tf`, ie. `capra-radar-<AWS-kontonummer>`.
Kjør:
```
aws-vault exec <capra-profile> -- npm run deploy
```


Radaren genereres on-demand fra `data/radar.csv`, så man trenger ikke kjøre ny deploy hvis man bare har oppdatert csv-filen.
