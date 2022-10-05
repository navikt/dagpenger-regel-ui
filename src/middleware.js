const _middleware = (req, ev) => {
    console.log("Treffer midleware");
    req.next();
};

export default _middleware;

