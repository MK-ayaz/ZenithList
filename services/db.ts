import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('zenithlist.db');

export const initDb = async () => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      dueDate TEXT NOT NULL,
      priority TEXT NOT NULL,
      category TEXT NOT NULL,
      isCompleted INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL,
      reminderScheduled INTEGER DEFAULT 0
    );
  `);
};

export const todoService = {
  async create(todo: Omit<import('./../types/todo').Todo, 'id'>) {
    const result = await db.runAsync(
      'INSERT INTO todos (title, description, dueDate, priority, category, isCompleted, createdAt, reminderScheduled) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [todo.title, todo.description, todo.dueDate, todo.priority, todo.category, todo.isCompleted ? 1 : 0, todo.createdAt, todo.reminderScheduled ? 1 : 0]
    );
    return result.lastInsertRowId;
  },

  async getAll() {
    return await db.getAllAsync<import('./../types/todo').Todo>('SELECT * FROM todos ORDER BY dueDate ASC, priority DESC');
  },

  async getFiltered(filter: 'today' | 'upcoming' | 'completed') {
    const now = new Date().toISOString();
    if (filter === 'today') {
      return await db.getAllAsync<import('./../types/todo').Todo>(
        'SELECT * FROM todos WHERE date(dueDate) = date(\'now\') AND isCompleted = 0'
      );
    }
    if (filter === 'upcoming') {
      return await db.getAllAsync<import('./../types/todo').Todo>(
        'SELECT * FROM todos WHERE date(dueDate) > date(\'now\') AND isCompleted = 0'
      );
    }
    return await db.getAllAsync<import('./../types/todo').Todo>(
      'SELECT * FROM todos WHERE isCompleted = 1'
    );
  },

  async update(id: number, updates: Partial<import('./../types/todo').Todo>) {
    const keys = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = keys.map(k => `${k} = ?`).join(', ');
    
    if (updates.isCompleted !== undefined) {
      // Convert boolean to integer for SQLite
      const updatedValues = values.map(v => typeof v === 'boolean' ? (v ? 1 : 0) : v);
      await db.runAsync(`UPDATE todos SET ${setClause} WHERE id = ?`, [...updatedValues, id]);
    } else {
      await db.runAsync(`UPDATE todos SET ${setClause} WHERE id = ?`, [...values, id]);
    }
  },

  async delete(id: number) {
    await db.runAsync('DELETE FROM todos WHERE id = ?', [id]);
  },

  async getStats() {
    const total = await db.getFirstAsync<{ count: number }>('SELECT count(*) as count FROM todos');
    const completed = await db.getFirstAsync<{ count: number }>('SELECT count(*) as count FROM todos WHERE isCompleted = 1');
    
    return {
      totalTasks: total?.count || 0,
      completedTasks: completed?.count || 0,
      pendingTasks: (total?.count || 0) - (completed?.count || 0),
      completionRate: total?.count ? ((completed?.count || 0) / total?.count) * 100 : 0
    };
  }
};
