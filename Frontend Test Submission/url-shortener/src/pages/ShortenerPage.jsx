import React, { useState } from 'react';
import { Container, Typography, Button, Grid, Box } from '@mui/material';
import axios from 'axios';
import validator from 'validator';
import UrlForm from '../components/UrlForm';
import { Log } from '../utils/logger';

export default function ShortenerPage() {
  const [forms, setForms] = useState([{ url: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState([]);

  const handleChange = (index, e) => {
    const updated = [...forms];
    updated[index][e.target.name] = e.target.value;
    setForms(updated);
  };

  const handleAdd = () => {
    if (forms.length < 5) {
      setForms([...forms, { url: '', validity: '', shortcode: '' }]);
    }
  };

  const handleSubmit = async () => {
    const newResults = [];

    for (let i = 0; i < forms.length; i++) {
      const { url, validity, shortcode } = forms[i];

      if (!validator.isURL(url)) {
        await Log('frontend', 'error', 'component', `Invalid URL at index ${i}`);
        continue;
      }

      try {
        const res = await axios.post('http://localhost:5000/shorturls', {
          url,
          validity: validity ? parseInt(validity) : undefined,
          shortcode,
        });

        await Log('frontend', 'info', 'component', `Shortened URL created for: ${url}`);
        newResults.push({ ...res.data, originalUrl: url });
      } catch (err) {
        await Log('frontend', 'error', 'component', `Error shortening URL: ${url}`);
      }
    }

    setResults(newResults);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>URL Shortener</Typography>

      {forms.map((form, idx) => (
        <Box key={idx} mb={2}>
          <UrlForm index={idx} formData={form} handleChange={handleChange} />
        </Box>
      ))}

      <Button variant="contained" onClick={handleAdd} disabled={forms.length >= 5}>
        Add Another
      </Button>

      <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ ml: 2 }}>
        Shorten URLs
      </Button>

      <Box mt={4}>
        <Typography variant="h5">Results:</Typography>
        {results.map((result, idx) => (
          <Box key={idx} mb={1}>
            <Typography>
              Original: {result.originalUrl}
              <br />
              Short: <a href={result.shortLink}>{result.shortLink}</a>
              <br />
              Expiry: {result.expiry}
            </Typography>
          </Box>
        ))}
      </Box>
    </Container>
  );
}
