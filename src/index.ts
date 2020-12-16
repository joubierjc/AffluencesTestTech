import express from "express";
import moment from "moment";
import axios from "axios";

const app = express();
const port = 1234;

const serviceRoot = "http://127.0.0.1:8080";

app.get("/rooms", (req, res) => {
    var date : any = req.query.date;
    var resourceId : any = req.query.resourceId;

    if (!moment(date, moment.ISO_8601, true).isValid()) {
        res.status(400).json({ "error": "wrong format for param startDatetime" });
        return;
    }
    if (resourceId != 1337) {
        res.status(404).json({ "error": "resource not found" });
        return;
    }
    
    axios.get(serviceRoot + "/timetables?date=" + date + "&resourceId=" + resourceId)
        .then(response1  => {
            const dataTimetables = response1.data;
            let available = true;

            dataTimetables.forEach(e => {
                if (moment(date).isBefore(e.opening) || moment(date).isAfter(e.closing)) {
                    available = false;
                }
            });

            if (!available) {
                res.status(200).json({ "available": false });
                return;
            }

            axios.get(serviceRoot + "/reservations?date=" + date + "&resourceId=" + resourceId)
                .then(response2  => {
                    const dataReservations = response2.data;

                    dataReservations.forEach(element => {
                        if (moment(date).isAfter(element.reservationStart) || moment(date).isBefore(element.reservationEnd)) {
                            available = false;
                        }
                    });

                    res.status(200).json({ "available": available });
                    return;
                });

        })
        .catch(err => {
            console.error(err);
            res.status(404).json(err);
        });
});

// app.get("/reservations", (req, res) => {
//     var date : any = req.query.date;
//     var resourceId : any = req.query.resourceId;

//     if (!moment(date, moment.ISO_8601, true).isValid()) {
//         res.status(400).json({ "error": "wrong format for param startDatetime" });
//         return;
//     }
//     if (resourceId != 1337) {
//         res.status(404).json({ "error": "resource not found" });
//         return;
//     }

//     if (moment().isSame(moment(date), 'day')) {
//         res.json({ "reservations": [
//                 { "reservationStart": moment().set({ 'hour': 8, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss"), "reservationEnd": moment().set({ 'hour': 9, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss") },
//                 { "reservationStart": moment().set({ 'hour': 10, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss"), "reservationEnd": moment().set({ 'hour': 11, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss") },
//                 { "reservationStart": moment().set({ 'hour': 15, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss"), "reservationEnd": moment().set({ 'hour': 16, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss") }
//             ] });
//     }
//     else {
//         res.json({ "reservations": null });
//     }
// });

// app.get("/timetables", (req, res) => {
//     var date : any = req.query.date;
//     var resourceId : any = req.query.resourceId;

//     if (!moment(date, moment.ISO_8601, true).isValid()) {
//         res.status(400).json({ "error": "wrong format for param startDatetime" });
//         return;
//     }
//     if (resourceId != 1337) {
//         res.status(404).json({ "error": "resource not found" });
//         return;
//     }

//     if (moment().isSame(moment(date), 'day')) {
//         res.json({ "open": true,
//             "timetables": [
//                 { "opening": moment().set({ 'hour': 8, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss"), "closing": moment().set({ 'hour': 12, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss") },
//                 { "opening": moment().set({ 'hour': 14, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss"), "closing": moment().set({ 'hour': 18, 'minute': 0, 'second': 0 }).format("YYYY-MM-DD HH:mm:ss") }
//             ] });
//     }
//     else {
//         res.json({ "open": false, timetables: null });
//     }
// });

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});