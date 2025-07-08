import React from 'react';
import { TextField, Grid } from '@mui/material';

export default function UrlForm({ index, formData, handleChange }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Long URL"
          name="url"
          value={formData.url}
          onChange={(e) => handleChange(index, e)}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Validity (minutes)"
          name="validity"
          type="number"
          value={formData.validity}
          onChange={(e) => handleChange(index, e)}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Custom Shortcode (optional)"
          name="shortcode"
          value={formData.shortcode}
          onChange={(e) => handleChange(index, e)}
        />
      </Grid>
    </Grid>
  );
}
