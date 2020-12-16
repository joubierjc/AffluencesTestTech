# reservation-service

https://gitlab.com/affluences/affluences-tests/reservation-service

# v2

- Meilleur algo de recherche

```typescript
const isInsideTimeTable = timetables.map(e => {
    return moment(date).isBetween(e.opening, e.closing, undefined, "[)");
}).filter(e => e).length > 0;

...

const isInsideReservations = reservations.map(e => {
    return moment(date).isBetween(e.reservationStart, e.reservationEnd, undefined, "[)");
}).filter(e => e).length > 0;
```

- Utilisation de types

```typescript
export interface Reservation {
    reservationStart: Date,
    reservationEnd: Date,
}

...

export interface TimeTable {
    opening: Date,
    closing: Date,
}
```

- Meilleures promises

```typescript
...

    if (!isInsideTimeTable) {
        res.status(200).json({ "available": false });
        return;
    }

    return axios.get(`${serviceRoot}/reservations?date=${date}&resourceId=${resourceId}`);
})
.then(response => {
    if (!response) {
        return;
    } 

    const reservations: Reservation[] = response.data.reservations;

...
```
