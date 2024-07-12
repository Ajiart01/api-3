const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('home');
});

router.get('/loading', (req, res) => {
  res.render('loading');
});

router.get('/dashboard', (rea, res) => {
  res.render('dashboard')
});

router.get('/docs', (req, res) => {
  res.render('docs');
});

router.get('/donasi', (req, res) => {
  res.render('donasi');
});

router.get('/changelog', (req, res) => {
  res.render('changelog');
});

router.get('/requestfitur', (req, res) => {
  res.render('requestfitur');
});

router.get('/ai', (req, res) => {
  res.render('ai');
});

router.get('/tools', (req, res) => {
  res.render('tools');
});

router.get('/fun', (req, res) => {
  res.render('fun');
});

router.get('/tools/upload', (req, res) => {
  res.render('/tools/upload');
});

router.get('/news', (req, res) => {
  res.render('news');
});

router.get('/download', (req, res) => {
  res.render('download');
});

router.get('/maker', (req, res) => {
  res.render('maker');
});

router.get('/primbon', (req, res) => {
  res.render('primbon');
});

router.get('/searching', (req, res) => {
  res.render('searching');
});

router.get('/other', (req, res) => {
  res.render('other');
});

router.get('/maker', (req, res) => {
  res.render('maker');
});
router.get('/search', (req, res) => {
  res.render('search');
});
                    
module.exports = router;