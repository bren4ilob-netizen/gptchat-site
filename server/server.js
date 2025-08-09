const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Simple mock chat endpoint (replace with OpenAI server-side calls)
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  const model = (req.query.model || 'gpt-4');
  // mock reply
  const reply = `(${model}) Эхо: ` + (message || '');
  res.json({ reply });
});

// Payment endpoints (placeholders)
app.post('/api/pay-denizbank', (req, res) => {
  const { amount } = req.body;
  // TODO: integrate with DenizBank Virtual POS
  res.json({ status: 'ok', message: `Платёж на ${amount} — заглушка.` });
});

app.post('/api/create-checkout', (req, res) => {
  // Create payment session with provider and return redirect
  res.json({ redirectUrl: 'https://example.com/mock-checkout' });
});

app.post('/api/webhook', (req, res) => {
  // Handle provider webhook — validate signature in production
  console.log('webhook', req.body);
  res.status(200).send('ok');
});

app.get('/health', (req, res) => res.send('ok'));

app.listen(port, () => {
  console.log('Server running on port', port);
});
