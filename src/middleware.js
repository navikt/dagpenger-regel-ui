export default function middleware(req, ev) {
    console.log("Treffer midleware")
    req.next()
}