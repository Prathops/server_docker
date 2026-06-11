const pool = require('../src/config/db');

const items = [
  {
    id: 1,
    name: 'laptop',
    description: 'lap',
    created_at: '2026-03-31 09:08:51',
    image_filename: null,
    image_url: null
  },
  {
    id: 3,
    name: 'prat',
    description: 'devops project',
    created_at: '2026-03-31 09:25:46',
    image_filename: null,
    image_url: null
  },
  {
    id: 4,
    name: 'game',
    description: 'video',
    created_at: '2026-03-31 09:32:59',
    image_filename: null,
    image_url: null
  },
  {
    id: 7,
    name: 'laptop hp',
    description: 'laptop of hp company',
    created_at: '2026-04-01 08:04:17',
    image_filename: '1775030657402-images.jpeg',
    image_url: '/uploads/1775030657402-images.jpeg'
  },
  {
    id: 8,
    name: 'earphone',
    description: 'apple',
    created_at: '2026-04-06 04:31:50',
    image_filename: null,
    image_url: null
  },
  {
    id: 9,
    name: 'tiffin',
    description: 'food items of tiffin is vegetables',
    created_at: '2026-04-06 05:26:11',
    image_filename: null,
    image_url: null
  },
  {
    id: 10,
    name: 'book shelf',
    description: 'book shelf',
    created_at: '2026-04-07 14:15:57',
    image_filename: '1775571357694-bookshelv.jpeg',
    image_url: '/uploads/1775571357694-bookshelv.jpeg'
  }
];

const createTableSql = `
CREATE TABLE IF NOT EXISTS items (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  description TEXT COLLATE utf8mb4_unicode_ci NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  image_filename VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  image_url VARCHAR(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const seed = async () => {
  await pool.query(createTableSql);

  for (const item of items) {
    await pool.query(
      `INSERT INTO items
        (id, name, description, created_at, image_filename, image_url)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        description = VALUES(description),
        created_at = VALUES(created_at),
        image_filename = VALUES(image_filename),
        image_url = VALUES(image_url)`,
      [
        item.id,
        item.name,
        item.description,
        item.created_at,
        item.image_filename,
        item.image_url
      ]
    );
  }

  const [rows] = await pool.query('SELECT COUNT(*) AS count FROM items');
  console.log(`Seed complete. items count: ${rows[0].count}`);
};

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
