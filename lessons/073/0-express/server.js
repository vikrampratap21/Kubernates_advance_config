const { Counter, register } = require('prom-client');
const express = require('express');
const app = express();
const port = 8081;

const c = new Counter({
	name: 'test_counter',
	help: 'Example of a counter',
	labelNames: ['code'],
});

app.get('/hello', (req, res) => {
    c.inc({ code: 200 });
    res.send('Hello World!');
})

app.get('/metrics', async (req, res) => {
	try {
		res.set('Content-Type', register.contentType);
		res.end(await register.getSingleMetricAsString('test_counter'));
	} catch (ex) {
		res.status(500).end(ex);
	}
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})
