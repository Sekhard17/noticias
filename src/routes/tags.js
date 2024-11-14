router.get('/api/tags', async (req, res) => {
  try {
    const tags = await Tag.findAll();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tags' });
  }
});

router.post('/api/news', async (req, res) => {
  try {
    const { title, subtitle, content, tags } = req.body;
    
    const news = await News.create({
      title,
      subtitle,
      content,
    });

    if (tags && tags.length > 0) {
      await news.setTags(tags);
    }

    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la noticia' });
  }
}); 