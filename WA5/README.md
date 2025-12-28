# Pizza App — Vue 3 + Express

Samostalni Zadatak za vježbu 5

## Struktura projekta

Projekt je podijeljen na dva dijela:

- **frontend/** — Vue 3 aplikacija (Vite)
- **backend/** — Express.js API povezan na MongoDB Atlas

## MongoDB konfiguracija

Backend koristi **MongoDB Atlas** i varijable okruženja.

Potrebno je u direktoriju `backend/` kreirati `.env` datoteku sa sljedećim varijablama:

```env
MONGO_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER_URL>/?retryWrites=true&w=majority
MONGO_DB_NAME=pizza_db
```

## MongoDB kolekcije

Aplikacija koristi sljedeće kolekcije u MongoDB bazi:

### pizze

Sadrži podatke o pizzama:

- naziv
- sastojci
- cijene (mala, srednja, jumbo)
- slika_url

### narudzbe

Sadrži narudžbe korisnika:

- ime
- adresa
- telefon
- narucene_pizze
- ukupna_cijena
- status
- created_at

## Postman link

https://www.postman.com/technical-astronomer-97079522/workspace/wa-5

## Pokretanje Frontenda

```
cd pizza-vue
```

```
npm install
```

```
npm run dev
```

Frontend radi na: http://localhost:5173

## Pokretanje Backenda

```
cd pizza-express
```

```
npm install
```

```
node index.js
```

Backend radi na: http://localhost:3000

## Pokretanje aplikacije

Otvorite: http://localhost:5173

## API rute

### Pizze

- GET /pizze (podržava query parametre: naziv, cijena_min, cijena_max, sort)
- GET /pizze/:naziv
- POST /pizze
- PATCH /pizze/:naziv
- DELETE /pizze/:naziv

### Narudžbe

- POST /narudzba
- PATCH /narudzbe/:id

## Implementirane funkcionalnosti

- Pretraga pizza prema nazivu
- Filtriranje pizza prema cijeni
- Sortiranje pizza po cijeni (uzlazno / silazno)

## Tehnologije

Vue 3, Vite, Tailwind, Express, Node.js, MongoDB Atlas, MongoDB Node.js driver

## Autor

Loren Bažon
