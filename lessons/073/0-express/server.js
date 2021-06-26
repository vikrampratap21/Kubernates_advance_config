const { Counter, register } = require('prom-client');
const express = require('express');
const app = express();
const port = 8081;
const host = '0.0.0.0';

const c = new Counter({
    name: 'http_requests_total',
    help: 'Total number of http requests',
    labelNames: ['method'],
});

const fibonacci = (num) => {
    if (num <= 1) return 1;
    return fibonacci(num - 1) + fibonacci(num - 2);
}

app.get('/fibonacci', (req, res) => {
    fibonacci(42);
    res.send('Fibonacci Sequence');
});

app.get('/hello', (req, res) => {
    c.inc({ method: 'GET' });
    res.send('Hello World!');
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.getSingleMetricAsString('http_requests_total'));
});

app.listen(port, host, () => {
    console.log(`Server listening at http://${host}:${port}`);
});
