import sqlite3 from 'sqlite3';

const sqlite = sqlite3.verbose();
const db = new sqlite.Database('./info.db', sqlite.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connect to the info database.');
});

db.serialize(() => {
  const sql = `CREATE TABLE IF NOT EXISTS frames (
    uuid varchar(20),
    episode int,
    name varchar(255),
    start varchar(255),
    startIndex int,
    end varchar(255),
    endIndex int,
    frames int,
    describe text
  )`;
  db.run(sql, (err) => {
    if (err) {
      throw err;
    }
    console.log('init table');
  });
});

function queryData() {
  const sql = `SELECT * from frames`;
  const resultSet = [];
  // all()加载全部数据到内存,each()加载单条数据到内存
  // get()查询结果为一条或零条
  db.all(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    resultSet.concat(rows);
  });
  console.log('resultSet', resultSet);
  return resultSet;
}

function insertData(params) {
  const sql = `INSERT INTO frames 
  (uuid, episode, name, start, startIndex, end, endIndex, frames, describe) 
  VALUES 
  (?,?,?,?,?,?,?,?,?)`;
  // const params = [
  //   "9cda55",
  //   1,
  //   "撩头发",
  //   "04:07+23",
  //   5951,
  //   "04:09+09",
  //   5985,
  //   34,
  //   "辛梅尔撩头发",
  // ];
  db.run(sql, params, function (err) {
    if (err) {
      throw err;
    }
    console.log(`insert row with rowId ${this.lastID}`);
  });
}

function updateData(params, id) {
  const sql = `UPDATE frames SET episode = ?, 
  name = ?, start = ?, startIndex = ?, 
  end = ?, endIndex = ?, frames = ?, 
  describe = ? WHERE ROWID = ?`;
  db.run(sql, [...params, id], function (err) {
    if (err) {
      throw err;
    }
    console.log(`Row(s) updated: ${this.changes}`);
  });
}

function deleteData(id) {
  const sql = `DELETE FROM frames WHERE ROWID = ?`;
  db.run(sql, id, function (err) {
    if (err) {
      throw err;
    }
    console.log(`delete row with rowId ${id}`);
  });
}

function closeDB() {
  db.close();
}

setTimeout(() => {
  queryData();
}, 1000);
