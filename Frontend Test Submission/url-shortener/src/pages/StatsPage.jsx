import React, { useEffect, useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import { Log } from '../utils/logger';

export default function StatsPage() {
  const [shortcodes, setShortcodes] = useState(['abcd1', 'xyz12']); // demo/test codes
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      for (let code of shortcodes) {
        try {
          const res = await axios.get(`http://localhost:5000/shorturls/${code}`);
          setStats((prev) => [...prev, res.data]);
          await Log('frontend', 'info', 'page', `Fetched stats for: ${code}`);
        } catch (err) {
          await Log('frontend', 'error', 'page', `Failed to fetch stats for: ${code}`);
        }
      }
    };

    fetchStats();
  }, [shortcodes]); // ✅ Fix: Add shortcodes here


  return (
    <Container>
      <Typography variant="h4" gutterBottom>URL Stats</Typography>

      {stats.map((data, idx) => (
        <Box key={idx} mb={4}>
          <Typography variant="h6">Shortcode: {data.shortcode}</Typography>
          <Typography>Original URL: {data.url}</Typography>
          <Typography>Created At: {data.createdAt}</Typography>
          <Typography>Expiry: {data.expiry}</Typography>
          <Typography>Total Clicks: {data.totalClicks}</Typography>

          <Typography>Click Logs:</Typography>
          {data.clicks.map((click, i) => (
            <Box key={i} ml={2}>
              <Typography>Time: {click.timestamp}</Typography>
              <Typography>Referrer: {click.referrer}</Typography>
              <Typography>Location: {click.location}</Typography>
            </Box>
          ))}
        </Box>
      ))}
    </Container>
  );
}
